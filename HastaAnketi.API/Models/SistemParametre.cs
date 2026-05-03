namespace HastaAnketi.API.Models
{
    public class SistemParametre
    {
        public int Id { get; set; }

        public string KurumAdi { get; set; } = string.Empty;
        public string? KurumLogosu { get; set; }
        public string? SmsSaglayiciAyarlari { get; set; }
        public string? KvkkMetni { get; set; }

        public int AnketTimeoutSuresi { get; set; } = 15; // dk
        public bool AnonimAnketAktif { get; set; } = true;

        // Opsiyonel: şikayet eşiği gibi parametreler
        public int SikayetEsikPuani { get; set; } = 2;
    }
}