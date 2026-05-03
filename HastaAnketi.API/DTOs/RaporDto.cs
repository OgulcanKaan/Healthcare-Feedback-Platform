using System;

namespace HastaAnketi.API.DTOs
{
    public class DashboardOzetDto
    {
        public double GenelMemnuniyetOrtalamasi { get; set; }
        public int ToplamCevaplananAnket { get; set; }
        public int ToplamSikayetSayisi { get; set; }
    }

    public class BirimMemnuniyetDto
    {
        public string BirimAdi { get; set; } = string.Empty;
        public double OrtalamaPuan { get; set; }
        public int ToplamAnketSayisi { get; set; }
    }

    public class SikayetOzetDto
    {
        public int SikayetId { get; set; }
        public int OturumId { get; set; }
        public string Aciklama { get; set; } = string.Empty;
        public string Durum { get; set; } = string.Empty;
        public DateTime OlusturmaTarihi { get; set; }
    }
}