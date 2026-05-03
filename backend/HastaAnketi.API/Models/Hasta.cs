namespace HastaAnketi.API.Models
{
    public class Hasta
    {
        public int Id { get; set; }
        public string HbysReferans { get; set; } = string.Empty;
        public string? TcNo { get; set; }   // anonim ise boş olabilir
        public int BirimId { get; set; }
        public DateTime HizmetTarihi { get; set; }
        public bool AnonimMi { get; set; }

        public Birim? Birim { get; set; }

        public List<AnketOturumu> Oturumlar { get; set; } = new();
    }
}