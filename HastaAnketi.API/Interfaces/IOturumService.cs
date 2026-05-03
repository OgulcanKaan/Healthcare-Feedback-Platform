using HastaAnketi.API.Common.Results;
using HastaAnketi.API.DTOs;
using HastaAnketi.API.DTOs.Responses;

namespace HastaAnketi.API.Interfaces;

public interface IOturumService
{
    Task<ServiceResult<OturumBaslatResponseDto>> BaslatAsync(SessionStartRequestDto request, CancellationToken cancellationToken = default);

    Task<ServiceResult<OturumCevapResponseDto>> CevaplaAsync(int oturumId, AnketCevaplaRequestDto request, CancellationToken cancellationToken = default);

    Task<ServiceResult<OturumSonucResponseDto>> SonucAsync(int oturumId, CancellationToken cancellationToken = default);
}
