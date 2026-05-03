using System.Text.Json.Serialization;

namespace HastaAnketi.API.Models
{
    public class CevapSecenek
    {
        public int Id { get; set; }
        public int SoruId { get; set; }
        public string SecenekMetni { get; set; } = string.Empty;
        public int PuanDegeri { get; set; }

        [JsonIgnore]
        public Soru? Soru { get; set; }
    }
}