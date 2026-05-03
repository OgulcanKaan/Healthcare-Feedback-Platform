using System.Collections.Concurrent;
using HastaAnketi.API.Configuration;
using HastaAnketi.API.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace HastaAnketi.API.Services.Caching;

public class MemoryCacheService : ICacheService
{
    private static readonly ConcurrentDictionary<string, byte> Keys = new();

    private readonly IMemoryCache _memoryCache;
    private readonly CacheSettings _cacheSettings;

    public MemoryCacheService(IMemoryCache memoryCache, IOptions<CacheSettings> cacheOptions)
    {
        _memoryCache = memoryCache;
        _cacheSettings = cacheOptions.Value;
    }

    public Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        _memoryCache.TryGetValue(key, out T? value);
        return Task.FromResult(value);
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

    public Task SetAsync<T>(string key, T value, TimeSpan? expiration = null, CancellationToken cancellationToken = default)
    {
        Keys[key] = 0;
        _memoryCache.Set(key, value, expiration ?? TimeSpan.FromMinutes(_cacheSettings.DefaultExpirationMinutes));
        return Task.CompletedTask;
    }

    public Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        Keys.TryRemove(key, out _);
        _memoryCache.Remove(key);
        return Task.CompletedTask;
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
