namespace HastaAnketi.API.DTOs.Responses;

public class AnketResponseDto
{
    public int Id { get; set; }
    public string AnketAdi { get; set; } = string.Empty;
    public string Durum { get; set; } = string.Empty;
    public DateTime BaslangicTarihi { get; set; }
    public DateTime? BitisTarihi { get; set; }
    public string KarsilamaMesaji { get; set; } = string.Empty;
    public string TesekkurMesaji { get; set; } = string.Empty;
    public int OlusturanKullaniciId { get; set; }
}
