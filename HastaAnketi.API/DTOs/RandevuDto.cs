namespace HastaAnketi.API.DTOs
{
    public class RandevuDto
    {
        public int HastaId { get; set; }
        public int BirimId { get; set; }
        public string DoktorAdi { get; set; } = string.Empty;
        public DateTime RandevuZamani { get; set; }
        public string Durum { get; set; } = "Tamamlandi";
    }
}