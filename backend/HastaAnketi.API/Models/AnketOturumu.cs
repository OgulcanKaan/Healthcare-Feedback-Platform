namespace HastaAnketi.API.Models;

public class AnketOturumu
{
    public int Id { get; set; }

    public int AnketId { get; set; }
    public int? HastaId { get; set; }
    public int BirimId { get; set; }
    public int? RandevuId { get; set; }

    public string Kanal { get; set; } = "Web";
    public bool KvkkOnayDurumu { get; set; }

    public DateTime BaslamaZamani { get; set; } = DateTime.UtcNow;
    public DateTime? BitisZamani { get; set; }

    public string? IpAdresi { get; set; }
    public string? CihazBilgisi { get; set; }

    public int ToplamPuan { get; set; }
    public string Durum { get; set; } = "Basladi";

    public Anket? Anket { get; set; }
    public Hasta? Hasta { get; set; }
    public Birim? Birim { get; set; }
    public Randevu? Randevu { get; set; }

    public List<Cevap> Cevaplar { get; set; } = new();
    public List<Sikayet> Sikayetler { get; set; } = new();
}
