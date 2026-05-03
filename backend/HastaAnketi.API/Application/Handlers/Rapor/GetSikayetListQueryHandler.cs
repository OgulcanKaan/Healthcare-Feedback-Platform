using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.Application.Queries.Rapor;
using HastaAnketi.API.DTOs;
using HastaAnketi.API.Interfaces;

namespace HastaAnketi.API.Application.Handlers.Rapor;

public class GetSikayetListQueryHandler : IQueryHandler<GetSikayetListQuery, IReadOnlyList<SikayetOzetDto>>
{
    private readonly IRaporRepository _raporRepository;

    public GetSikayetListQueryHandler(IRaporRepository raporRepository)
    {
        _raporRepository = raporRepository;
    }

    public Task<IReadOnlyList<SikayetOzetDto>> HandleAsync(GetSikayetListQuery query, CancellationToken cancellationToken = default)
    {
        var result = _raporRepository.GetDusukPuanliSikayetler();
        return Task.FromResult<IReadOnlyList<SikayetOzetDto>>(result);
    }
}
