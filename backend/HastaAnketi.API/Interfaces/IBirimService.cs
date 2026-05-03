using HastaAnketi.API.Common.Results;
using HastaAnketi.API.DTOs;
using HastaAnketi.API.DTOs.Common;
using HastaAnketi.API.DTOs.Responses;

namespace HastaAnketi.API.Interfaces;

public interface IBirimService
{
    Task<ServiceResult<IReadOnlyList<BirimResponseDto>>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<ServiceResult<BirimResponseDto>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<ServiceResult<BirimResponseDto>> CreateAsync(BirimDto model, CancellationToken cancellationToken = default);

    Task<ServiceResult<BirimResponseDto>> UpdateAsync(int id, BirimDto model, CancellationToken cancellationToken = default);

    Task<ServiceResult<ApiMessageResponse>> DeleteAsync(int id, CancellationToken cancellationToken = default);
}
