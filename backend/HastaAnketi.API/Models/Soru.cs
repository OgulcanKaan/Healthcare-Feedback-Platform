using System.Text.Json.Serialization;

namespace HastaAnketi.API.Models
{
    public class Soru
    {
        public int Id { get; set; }

        // ERD uyumu: Soru doğrudan AnketId tutmaz, ANKET_SORU ile bağlanır.
        public string SoruTipi { get; set; } = string.Empty;
        public string SoruMetni { get; set; } = string.Empty;
        public bool ZorunluMu { get; set; }
        public string Kategori { get; set; } = string.Empty;

        public List<CevapSecenek> Secenekler { get; set; } = new();

        // İstersen ankete bağlı soruları görmek için:
        [JsonIgnore]
        public List<AnketSoru> AnketSorular { get; set; } = new();
    }
}