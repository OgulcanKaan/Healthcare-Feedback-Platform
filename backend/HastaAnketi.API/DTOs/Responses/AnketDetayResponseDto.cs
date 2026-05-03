namespace HastaAnketi.API.DTOs.Responses;

public class AnketDetayResponseDto
{
    public int Id { get; set; }
    public string AnketAdi { get; set; } = string.Empty;
    public string Durum { get; set; } = string.Empty;
    public DateTime BaslangicTarihi { get; set; }
    public DateTime? BitisTarihi { get; set; }
    public string KarsilamaMesaji { get; set; } = string.Empty;
    public string TesekkurMesaji { get; set; } = string.Empty;
    public int OlusturanKullaniciId { get; set; }
    public List<AnketSoruResponseDto> Sorular { get; set; } = new();
}

public class AnketSoruResponseDto
{
    public int SoruId { get; set; }
    public int SiraNo { get; set; }
    public string SoruTipi { get; set; } = string.Empty;
    public string SoruMetni { get; set; } = string.Empty;
    public bool ZorunluMu { get; set; }
    public string Kategori { get; set; } = string.Empty;
    public List<SecenekResponseDto> Secenekler { get; set; } = new();
}

public class SecenekResponseDto
{
    public int Id { get; set; }
    public int SoruId { get; set; }
    public string SecenekMetni { get; set; } = string.Empty;
    public int PuanDegeri { get; set; }
}
