using System.Collections.Generic;

namespace HastaAnketi.API.DTOs
{
    // Anket cevaplama isteğini taşıyan DTO
    public class AnketCevaplaRequestDto
    {
        public int AnketId { get; set; }

        // Anonim anket desteklenir - nullable
        public int? HastaId { get; set; }

        // KVKK onayı zorunlu
        public bool KvkkOnayDurumu { get; set; }

        // Ankette verilen cevapların listesi
        public List<CevapDto> Cevaplar { get; set; } = new List<CevapDto>();
    }

    // Her soru için gönderilen cevap
    public class CevapDto
    {
        public int SoruId { get; set; }

        // Çoktan seçmeli sorular için
        public int? SecenekId { get; set; }

        // Açık uçlu sorular için
        public string? AcikCevap { get; set; }
    }
}