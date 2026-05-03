namespace HastaAnketi.API.Models
{
    public class Sikayet
    {
        public int Id { get; set; }

        public int OturumId { get; set; }
        public int? HastaId { get; set; }
        public int BirimId { get; set; }

        /// <summary>Otomatik | Sikayet | Oneri</summary>
        public string Tip { get; set; } = "Otomatik";

        /// <summary>Gönderenin adı (isteğe bağlı)</summary>
        public string? GonderenAd { get; set; }

        public string Aciklama { get; set; } = string.Empty;

        // String kullanıyorsun, controller da buna göre set edecek
        public string Durum { get; set; } = "Acik"; // Acik / Inceleniyor / Kapandi

        public DateTime OlusturmaTarihi { get; set; } = DateTime.UtcNow;

        public AnketOturumu Oturum { get; set; } = null!;
        public Hasta? Hasta { get; set; }
        public Birim Birim { get; set; } = null!;
    }

    // Opsiyonel: Şu an controller string set edeceği için enumu kullanmıyoruz.
    public enum SikayetDurum
    {
        Open = 0,
        InProgress = 1,
        Closed = 2
    }
}