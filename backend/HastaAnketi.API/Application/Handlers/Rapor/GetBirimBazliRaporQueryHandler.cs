using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.Application.Queries.Rapor;
using HastaAnketi.API.DTOs;
using HastaAnketi.API.Interfaces;

namespace HastaAnketi.API.Application.Handlers.Rapor;

public class GetBirimBazliRaporQueryHandler : IQueryHandler<GetBirimBazliRaporQuery, IReadOnlyList<BirimMemnuniyetDto>>
{
    private readonly IRaporRepository _raporRepository;

    public GetBirimBazliRaporQueryHandler(IRaporRepository raporRepository)
    {
        _raporRepository = raporRepository;
    }

    public Task<IReadOnlyList<BirimMemnuniyetDto>> HandleAsync(GetBirimBazliRaporQuery query, CancellationToken cancellationToken = default)
    {
        var result = _raporRepository.GetBirimBazliRapor(query.BaslangicTarihi, query.BitisTarihi);
        return Task.FromResult<IReadOnlyList<BirimMemnuniyetDto>>(result);
    }
}
