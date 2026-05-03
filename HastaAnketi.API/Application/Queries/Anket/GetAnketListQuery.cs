using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.DTOs.Responses;

namespace HastaAnketi.API.Application.Queries.Anket;

public record GetAnketListQuery() : IQuery<IReadOnlyList<AnketResponseDto>>;
