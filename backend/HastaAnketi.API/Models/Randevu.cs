namespace HastaAnketi.API.Models
{
    public class Randevu
    {
        public int Id { get; set; }
        public int HastaId { get; set; }
        public int BirimId { get; set; }

        public string DoktorAdi { get; set; } = string.Empty;
        public DateTime RandevuZamani { get; set; }
        public string Durum { get; set; } = "Tamamlandi";

        public Hasta? Hasta { get; set; }
        public Birim? Birim { get; set; }
    }
}