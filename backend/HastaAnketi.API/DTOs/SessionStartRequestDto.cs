namespace HastaAnketi.API.DTOs
{
    public class SessionStartRequestDto
    {
        public int AnketId { get; set; }
        public int? HastaId { get; set; }
        public int BirimId { get; set; }
        public int? RandevuId { get; set; }

        public string Kanal { get; set; } = "Web";
        public bool KvkkOnayDurumu { get; set; }

        public string? IpAdresi { get; set; }
        public string? CihazBilgisi { get; set; }
    }
}