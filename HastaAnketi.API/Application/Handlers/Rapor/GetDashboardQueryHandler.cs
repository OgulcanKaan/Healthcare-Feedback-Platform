using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.Application.Queries.Rapor;
using HastaAnketi.API.DTOs;
using HastaAnketi.API.Interfaces;

namespace HastaAnketi.API.Application.Handlers.Rapor;

public class GetDashboardQueryHandler : IQueryHandler<GetDashboardQuery, DashboardOzetDto>
{
    private readonly IRaporRepository _raporRepository;

    public GetDashboardQueryHandler(IRaporRepository raporRepository)
    {
        _raporRepository = raporRepository;
    }

    public Task<DashboardOzetDto> HandleAsync(GetDashboardQuery query, CancellationToken cancellationToken = default)
    {
        var result = _raporRepository.GetDashboardOzeti(query.BaslangicTarihi, query.BitisTarihi);
        return Task.FromResult(result);
    }
}
