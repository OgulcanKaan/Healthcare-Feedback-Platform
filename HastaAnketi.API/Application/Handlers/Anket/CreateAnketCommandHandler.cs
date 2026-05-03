using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.Application.Commands.Anket;
using HastaAnketi.API.Common.Mapping;
using HastaAnketi.API.DTOs.Responses;
using HastaAnketi.API.Interfaces;

namespace HastaAnketi.API.Application.Handlers.Anket;

public class CreateAnketCommandHandler : ICommandHandler<CreateAnketCommand, AnketResponseDto>
{
    private readonly IAnketRepository _anketRepository;

    public CreateAnketCommandHandler(IAnketRepository anketRepository)
    {
        _anketRepository = anketRepository;
    }

    public Task<AnketResponseDto> HandleAsync(CreateAnketCommand command, CancellationToken cancellationToken = default)
    {
        var entity = command.Model.ToEntity();
        var created = _anketRepository.YeniAnketEkle(entity);
        return Task.FromResult(created.ToResponseDto());
    }
}
