using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.DTOs;
using HastaAnketi.API.DTOs.Responses;

namespace HastaAnketi.API.Application.Commands.Anket;

public record UpdateAnketCommand(int Id, AnketDto Model) : ICommand<AnketResponseDto?>;
