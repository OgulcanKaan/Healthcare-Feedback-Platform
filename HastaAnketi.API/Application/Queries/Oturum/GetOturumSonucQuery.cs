using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.DTOs.Responses;

namespace HastaAnketi.API.Application.Queries.Oturum;

public record GetOturumSonucQuery(int OturumId) : IQuery<OturumSonucResponseDto?>;
