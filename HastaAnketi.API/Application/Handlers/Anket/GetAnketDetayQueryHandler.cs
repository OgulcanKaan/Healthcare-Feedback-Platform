using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.Application.Queries.Anket;
using HastaAnketi.API.Common.Mapping;
using HastaAnketi.API.DTOs.Responses;
using HastaAnketi.API.Interfaces;

namespace HastaAnketi.API.Application.Handlers.Anket;

public class GetAnketDetayQueryHandler : IQueryHandler<GetAnketDetayQuery, AnketDetayResponseDto?>
{
    private readonly IAnketRepository _anketRepository;

    public GetAnketDetayQueryHandler(IAnketRepository anketRepository)
    {
        _anketRepository = anketRepository;
    }

    public Task<AnketDetayResponseDto?> HandleAsync(GetAnketDetayQuery query, CancellationToken cancellationToken = default)
    {
        var entity = _anketRepository.GetById(query.Id);
        return Task.FromResult(entity?.ToDetayResponseDto());
    }
}
