namespace HastaAnketi.API.DTOs
{
    public class KullaniciDto
    {
        public string KullaniciAdi { get; set; } = string.Empty;
        public string Sifre { get; set; } = string.Empty;
        public string AdSoyad { get; set; } = string.Empty;
        public int BirimId { get; set; }
        public int RolId { get; set; }
        public bool AktifPasif { get; set; }
    }
}