namespace HastaAnketi.API.Models
{
    public class KullaniciLog
    {
        public int Id { get; set; }
        public int KullaniciId { get; set; }

        public DateTime IslemZamani { get; set; } = DateTime.UtcNow;
        public string? IpAdresi { get; set; }
        public string? BrowserBilgisi { get; set; }

        public bool BasariDurumu { get; set; }
        public string? HataBilgisi { get; set; }

        public Kullanici? Kullanici { get; set; }
    }
}