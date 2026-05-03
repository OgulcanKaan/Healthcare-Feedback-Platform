using System.Text.Json.Serialization;

namespace HastaAnketi.API.Models
{
    public class Kullanici
    {
        public int Id { get; set; }

        public string KullaniciAdi { get; set; } = string.Empty;

        public string Sifre { get; set; } = string.Empty;

        public string AdSoyad { get; set; } = string.Empty;

        public int BirimId { get; set; }

        public int RolId { get; set; }

        public bool AktifPasif { get; set; } = true;

        public DateTime? SonGirisTarihi { get; set; }

        // Navigation Properties

        [JsonIgnore]
        public Birim? Birim { get; set; }

        [JsonIgnore]
        public Rol? Rol { get; set; }

        [JsonIgnore]
        public List<KullaniciLog> Loglar { get; set; } = new();
    }
}