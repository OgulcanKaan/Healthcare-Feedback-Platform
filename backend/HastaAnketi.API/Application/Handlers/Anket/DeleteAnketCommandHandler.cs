using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.Application.Commands.Anket;
using HastaAnketi.API.Interfaces;

namespace HastaAnketi.API.Application.Handlers.Anket;

public class DeleteAnketCommandHandler : ICommandHandler<DeleteAnketCommand, bool>
{
    private readonly IAnketRepository _anketRepository;

    public DeleteAnketCommandHandler(IAnketRepository anketRepository)
    {
        _anketRepository = anketRepository;
    }

    public Task<bool> HandleAsync(DeleteAnketCommand command, CancellationToken cancellationToken = default)
    {
        var entity = _anketRepository.GetById(command.Id);
        if (entity == null)
        {
            return Task.FromResult(false);
        }

        _anketRepository.Delete(command.Id);
        return Task.FromResult(true);
    }
}
