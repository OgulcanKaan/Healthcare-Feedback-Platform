using HastaAnketi.API.DTOs;

namespace HastaAnketi.API.Interfaces
{
    public interface IRaporRepository
    {
        DashboardOzetDto GetDashboardOzeti(DateTime? baslangicTarihi, DateTime? bitisTarihi);
        List<BirimMemnuniyetDto> GetBirimBazliRapor(DateTime? baslangicTarihi, DateTime? bitisTarihi);
        List<SikayetOzetDto> GetDusukPuanliSikayetler();
    }
}