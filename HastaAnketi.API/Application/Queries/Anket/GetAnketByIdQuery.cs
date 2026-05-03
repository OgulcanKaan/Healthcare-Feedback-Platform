using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.DTOs.Responses;

namespace HastaAnketi.API.Application.Queries.Anket;

public record GetAnketByIdQuery(int Id) : IQuery<AnketResponseDto?>;
