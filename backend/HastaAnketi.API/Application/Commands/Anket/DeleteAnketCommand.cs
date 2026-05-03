using HastaAnketi.API.Application.Abstractions;

namespace HastaAnketi.API.Application.Commands.Anket;

public record DeleteAnketCommand(int Id) : ICommand<bool>;
