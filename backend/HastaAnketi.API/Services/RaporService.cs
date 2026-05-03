using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.Application.Queries.Rapor;
using HastaAnketi.API.Common.Caching;
using HastaAnketi.API.Common.Results;
using HastaAnketi.API.DTOs;
using HastaAnketi.API.Interfaces;

namespace HastaAnketi.API.Services;

public class RaporService : IRaporService
{
    private readonly ICacheService _cacheService;
    private readonly IQueryHandler<GetDashboardQuery, DashboardOzetDto> _dashboardHandler;
    private readonly IQueryHandler<GetBirimBazliRaporQuery, IReadOnlyList<BirimMemnuniyetDto>> _birimRaporHandler;
    private readonly IQueryHandler<GetSikayetListQuery, IReadOnlyList<SikayetOzetDto>> _sikayetHandler;

    public RaporService(
        ICacheService cacheService,
        IQueryHandler<GetDashboardQuery, DashboardOzetDto> dashboardHandler,
        IQueryHandler<GetBirimBazliRaporQuery, IReadOnlyList<BirimMemnuniyetDto>> birimRaporHandler,
        IQueryHandler<GetSikayetListQuery, IReadOnlyList<SikayetOzetDto>> sikayetHandler)
    {
        _cacheService = cacheService;
        _dashboardHandler = dashboardHandler;
        _birimRaporHandler = birimRaporHandler;
        _sikayetHandler = sikayetHandler;
    }

    public async Task<ServiceResult<DashboardOzetDto>> GetDashboardOzetiAsync(DateTime? baslangicTarihi, DateTime? bitisTarihi, CancellationToken cancellationToken = default)
    {
        var key = CacheKeys.Dashboard(baslangicTarihi, bitisTarihi);
        var data = await _cacheService.GetOrCreateAsync(
            key,
            () => _dashboardHandler.HandleAsync(new GetDashboardQuery(baslangicTarihi, bitisTarihi), cancellationToken),
            cancellationToken: cancellationToken);

        return ServiceResult<DashboardOzetDto>.Success(data);
    }

    public async Task<ServiceResult<IReadOnlyList<BirimMemnuniyetDto>>> GetBirimBazliRaporAsync(DateTime? baslangicTarihi, DateTime? bitisTarihi, CancellationToken cancellationToken = default)
    {
        var key = CacheKeys.BirimRapor(baslangicTarihi, bitisTarihi);
        var data = await _cacheService.GetOrCreateAsync(
            key,
            () => _birimRaporHandler.HandleAsync(new GetBirimBazliRaporQuery(baslangicTarihi, bitisTarihi), cancellationToken),
            cancellationToken: cancellationToken);

        return ServiceResult<IReadOnlyList<BirimMemnuniyetDto>>.Success(data);
    }

    public async Task<ServiceResult<IReadOnlyList<SikayetOzetDto>>> GetSikayetlerAsync(CancellationToken cancellationToken = default)
    {
        var data = await _cacheService.GetOrCreateAsync(
            CacheKeys.SikayetList,
            () => _sikayetHandler.HandleAsync(new GetSikayetListQuery(), cancellationToken),
            cancellationToken: cancellationToken);

        return ServiceResult<IReadOnlyList<SikayetOzetDto>>.Success(data);
    }
}
