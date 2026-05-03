using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.Application.Commands.Anket;
using HastaAnketi.API.Common.Mapping;
using HastaAnketi.API.DTOs.Responses;
using HastaAnketi.API.Interfaces;

namespace HastaAnketi.API.Application.Handlers.Anket;

public class UpdateAnketCommandHandler : ICommandHandler<UpdateAnketCommand, AnketResponseDto?>
{
    private readonly IAnketRepository _anketRepository;

    public UpdateAnketCommandHandler(IAnketRepository anketRepository)
    {
        _anketRepository = anketRepository;
    }

    public Task<AnketResponseDto?> HandleAsync(UpdateAnketCommand command, CancellationToken cancellationToken = default)
    {
        var entity = _anketRepository.GetById(command.Id);
        if (entity == null)
        {
            return Task.FromResult<AnketResponseDto?>(null);
        }

        command.Model.Apply(entity);
        _anketRepository.Update(entity);
        return Task.FromResult<AnketResponseDto?>(entity.ToResponseDto());
    }
}
