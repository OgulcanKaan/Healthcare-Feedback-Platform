using HastaAnketi.API.Common.Results;
using HastaAnketi.API.DTOs;

namespace HastaAnketi.API.Interfaces;

public interface IRaporService
{
    Task<ServiceResult<DashboardOzetDto>> GetDashboardOzetiAsync(DateTime? baslangicTarihi, DateTime? bitisTarihi, CancellationToken cancellationToken = default);

    Task<ServiceResult<IReadOnlyList<BirimMemnuniyetDto>>> GetBirimBazliRaporAsync(DateTime? baslangicTarihi, DateTime? bitisTarihi, CancellationToken cancellationToken = default);

    Task<ServiceResult<IReadOnlyList<SikayetOzetDto>>> GetSikayetlerAsync(CancellationToken cancellationToken = default);
}
