using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.Application.Commands.Anket;
using HastaAnketi.API.Application.Commands.Oturum;
using HastaAnketi.API.Application.Handlers.Anket;
using HastaAnketi.API.Application.Handlers.Oturum;
using HastaAnketi.API.Application.Handlers.Rapor;
using HastaAnketi.API.Application.Queries.Anket;
using HastaAnketi.API.Application.Queries.Oturum;
using HastaAnketi.API.Application.Queries.Rapor;
using HastaAnketi.API.Configuration;
using HastaAnketi.API.DTOs;
using HastaAnketi.API.DTOs.Responses;
using HastaAnketi.API.Interfaces;
using HastaAnketi.API.Repositories;
using HastaAnketi.API.Services;
using HastaAnketi.API.Services.Caching;

namespace HastaAnketi.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddProjectServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<CacheSettings>(configuration.GetSection(CacheSettings.SectionName));

        services.AddMemoryCache();
        services.AddScoped<IAnketRepository, AnketRepository>();
        services.AddScoped<IRaporRepository, RaporRepository>();
        services.AddScoped<IBirimRepository, BirimRepository>();
        services.AddScoped<IOturumRepository, OturumRepository>();

        services.AddScoped<ICommandHandler<CreateAnketCommand, AnketResponseDto>, CreateAnketCommandHandler>();
        services.AddScoped<ICommandHandler<UpdateAnketCommand, AnketResponseDto?>, UpdateAnketCommandHandler>();
        services.AddScoped<ICommandHandler<DeleteAnketCommand, bool>, DeleteAnketCommandHandler>();
        services.AddScoped<ICommandHandler<BaslatOturumCommand, OturumBaslatResponseDto>, BaslatOturumCommandHandler>();
        services.AddScoped<ICommandHandler<CevaplaOturumCommand, OturumCevapResponseDto>, CevaplaOturumCommandHandler>();

        services.AddScoped<IQueryHandler<GetAnketByIdQuery, AnketResponseDto?>, GetAnketByIdQueryHandler>();
        services.AddScoped<IQueryHandler<GetAnketDetayQuery, AnketDetayResponseDto?>, GetAnketDetayQueryHandler>();
        services.AddScoped<IQueryHandler<GetAnketListQuery, IReadOnlyList<AnketResponseDto>>, GetAnketListQueryHandler>();
        services.AddScoped<IQueryHandler<GetOturumSonucQuery, OturumSonucResponseDto?>, GetOturumSonucQueryHandler>();
        services.AddScoped<IQueryHandler<GetDashboardQuery, DashboardOzetDto>, GetDashboardQueryHandler>();
        services.AddScoped<IQueryHandler<GetBirimBazliRaporQuery, IReadOnlyList<BirimMemnuniyetDto>>, GetBirimBazliRaporQueryHandler>();
        services.AddScoped<IQueryHandler<GetSikayetListQuery, IReadOnlyList<SikayetOzetDto>>, GetSikayetListQueryHandler>();

        services.AddScoped<IAnketService, AnketService>();
        services.AddScoped<IOturumService, OturumService>();
        services.AddScoped<IRaporService, RaporService>();
        services.AddScoped<IBirimService, BirimService>();

        var cacheSettings = configuration.GetSection(CacheSettings.SectionName).Get<CacheSettings>() ?? new CacheSettings();
        if (string.Equals(cacheSettings.Provider, "Redis", StringComparison.OrdinalIgnoreCase))
        {
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = cacheSettings.RedisConnection;
            });
            services.AddScoped<ICacheService, RedisCacheService>();
        }
        else
        {
            services.AddScoped<ICacheService, MemoryCacheService>();
        }

        return services;
    }
}
