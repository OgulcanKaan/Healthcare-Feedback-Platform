namespace HastaAnketi.API.Models
{
    public class AnketSoru
    {
        public int AnketId { get; set; }
        public int SoruId { get; set; }

        public int SiraNo { get; set; }

        public Anket Anket { get; set; } = null!;
        public Soru Soru { get; set; } = null!;
    }
}