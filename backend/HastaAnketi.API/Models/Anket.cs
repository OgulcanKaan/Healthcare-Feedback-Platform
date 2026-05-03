namespace HastaAnketi.API.Models
{
    public class Anket
    {
        public int Id { get; set; }
        public string AnketAdi { get; set; } = string.Empty;
        public string Durum { get; set; } = "Aktif";
        public DateTime BaslangicTarihi { get; set; }
        public DateTime? BitisTarihi { get; set; }
        public string KarsilamaMesaji { get; set; } = string.Empty;
        public string TesekkurMesaji { get; set; } = string.Empty;

        public int OlusturanKullaniciId { get; set; }
        public Kullanici? OlusturanKullanici { get; set; }

        public List<AnketSoru> AnketSorular { get; set; } = new();
    }
}