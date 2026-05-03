namespace HastaAnketi.API.Models
{
    public class Birim
    {
        public int Id { get; set; }
        public string BirimKodu { get; set; } = string.Empty;
        public string BirimAdi { get; set; } = string.Empty;
        public bool AktifPasif { get; set; } = true;

        // Opsiyonel: navigations
        public List<Hasta> Hastalar { get; set; } = new();
        public List<Kullanici> Kullanicilar { get; set; } = new();
    }
}