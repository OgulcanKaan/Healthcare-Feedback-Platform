namespace HastaAnketi.API.DTOs
{
    public class AnketDto
    {
        public string AnketAdi { get; set; } = string.Empty;
        public string Durum { get; set; } = string.Empty;
        public DateTime BaslangicTarihi { get; set; }
        public DateTime BitisTarihi { get; set; }
        public string KarsilamaMesaji { get; set; } = string.Empty;
        public string TesekkurMesaji { get; set; } = string.Empty;
        public int OlusturanKullaniciId { get; set; }
    }
}