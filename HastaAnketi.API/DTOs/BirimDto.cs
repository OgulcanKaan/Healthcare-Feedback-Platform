namespace HastaAnketi.API.DTOs
{
    public class BirimDto
    {
        public string BirimKodu { get; set; } = string.Empty;

        public string BirimAdi { get; set; } = string.Empty;

        public bool AktifPasif { get; set; }
    }
}