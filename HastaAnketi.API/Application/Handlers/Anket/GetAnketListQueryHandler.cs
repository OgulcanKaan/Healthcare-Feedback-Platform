using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.Application.Queries.Anket;
using HastaAnketi.API.Common.Mapping;
using HastaAnketi.API.DTOs.Responses;
using HastaAnketi.API.Interfaces;

namespace HastaAnketi.API.Application.Handlers.Anket;

public class GetAnketListQueryHandler : IQueryHandler<GetAnketListQuery, IReadOnlyList<AnketResponseDto>>
{
    private readonly IAnketRepository _anketRepository;

    public GetAnketListQueryHandler(IAnketRepository anketRepository)
    {
        _anketRepository = anketRepository;
    }

    public Task<IReadOnlyList<AnketResponseDto>> HandleAsync(GetAnketListQuery query, CancellationToken cancellationToken = default)
    {
        var response = _anketRepository
            .GetirTumAnketler()
            .Select(x => x.ToResponseDto())
            .ToList();

        return Task.FromResult<IReadOnlyList<AnketResponseDto>>(response);
    }
}
