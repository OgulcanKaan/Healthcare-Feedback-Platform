using System.Collections.Concurrent;
using System.Text.Json;
using HastaAnketi.API.Configuration;
using HastaAnketi.API.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace HastaAnketi.API.Services.Caching;

public class RedisCacheService : ICacheService
{
    private static readonly ConcurrentDictionary<string, byte> Keys = new();

    private readonly IDistributedCache _distributedCache;
    private readonly IMemoryCache _fallbackCache;
    private readonly CacheSettings _cacheSettings;
    private readonly ILogger<RedisCacheService> _logger;

    public RedisCacheService(
        IDistributedCache distributedCache,
        IMemoryCache fallbackCache,
        IOptions<CacheSettings> cacheOptions,
        ILogger<RedisCacheService> logger)
    {
        _distributedCache = distributedCache;
        _fallbackCache = fallbackCache;
        _cacheSettings = cacheOptions.Value;
        _logger = logger;
    }

    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        try
        {
            var value = await _distributedCache.GetStringAsync(key, cancellationToken);
            if (string.IsNullOrWhiteSpace(value))
            {
                return _fallbackCache.TryGetValue(key, out T? fallback) ? fallback : default;
            }

            return JsonSerializer.Deserialize<T>(value);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Redis cache okunamadı. Memory fallback kullanılacak. Key: {CacheKey}", key);
            return _fallbackCache.TryGetValue(key, out T? fallback) ? fallback : default;
        }
    }

    public async Task<T> GetOrCreateAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null, CancellationToken cancellationToken = default)
    {
        var cached = await GetAsync<T>(key, cancellationToken);
        if (cached is not null)
        {
            return cached;
        }

        var value = await factory();
        await SetAsync(key, value, expiration, cancellationToken);
        return value;
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null, CancellationToken cancellationToken = default)
    {
        var cacheExpiration = expiration ?? TimeSpan.FromMinutes(_cacheSettings.DefaultExpirationMinutes);
        Keys[key] = 0;
        _fallbackCache.Set(key, value, cacheExpiration);

        try
        {
            var json = JsonSerializer.Serialize(value);
            await _distributedCache.SetStringAsync(
                key,
                json,
                new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = cacheExpiration },
                cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Redis cache yazılamadı. Memory fallback kullanılmaya devam edecek. Key: {CacheKey}", key);
        }
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        Keys.TryRemove(key, out _);
        _fallbackCache.Remove(key);

        try
        {
            await _distributedCache.RemoveAsync(key, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Redis cache temizlenemedi. Key: {CacheKey}", key);
        }
    }

    public async Task RemoveByPrefixAsync(string prefix, CancellationToken cancellationToken = default)
    {
        var keys = Keys.Keys.Where(x => x.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)).ToList();
        foreach (var key in keys)
        {
            await RemoveAsync(key, cancellationToken);
        }
    }
}
