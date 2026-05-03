using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.DTOs;
using HastaAnketi.API.DTOs.Responses;

namespace HastaAnketi.API.Application.Commands.Oturum;

public record CevaplaOturumCommand(int OturumId, AnketCevaplaRequestDto Request) : ICommand<OturumCevapResponseDto>;
