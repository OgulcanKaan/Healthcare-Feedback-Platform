using HastaAnketi.API.Common.Results;
using HastaAnketi.API.DTOs;
using HastaAnketi.API.DTOs.Common;
using HastaAnketi.API.DTOs.Responses;

namespace HastaAnketi.API.Interfaces;

public interface IAnketService
{
    Task<ServiceResult<IReadOnlyList<AnketResponseDto>>> GetirTumAnketlerAsync(CancellationToken cancellationToken = default);

    Task<ServiceResult<AnketResponseDto>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<ServiceResult<AnketDetayResponseDto>> GetDetayByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<ServiceResult<ApiDataResponse<AnketResponseDto>>> YeniAnketEkleAsync(AnketDto model, CancellationToken cancellationToken = default);

    Task<ServiceResult<ApiDataResponse<AnketResponseDto>>> UpdateAsync(int id, AnketDto model, CancellationToken cancellationToken = default);

    Task<ServiceResult> DeleteAsync(int id, CancellationToken cancellationToken = default);

    Task<ServiceResult<AnketCevapResponseDto>> CevaplaAsync(AnketCevaplaRequestDto request, CancellationToken cancellationToken = default);

    Task<ServiceResult> AnketeSoruEkleAsync(int anketId, int soruId, CancellationToken cancellationToken = default);

    Task<ServiceResult> AnkettenSoruKaldirAsync(int anketId, int soruId, CancellationToken cancellationToken = default);
}
