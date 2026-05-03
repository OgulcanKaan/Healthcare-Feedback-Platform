namespace HastaAnketi.API.DTOs.Responses;

public class OturumBaslatResponseDto
{
    public int OturumId { get; set; }
    public DateTime BaslamaZamani { get; set; }
    public string Durum { get; set; } = string.Empty;
}

public class OturumCevapResponseDto
{
    public int OturumId { get; set; }
    public int ToplamPuan { get; set; }
    public double OrtalamaPuan { get; set; }
    public bool SikayetOlustuMu { get; set; }
}

public class SikayetDetayResponseDto
{
    public int Id { get; set; }
    public string Durum { get; set; } = string.Empty;
    public string Aciklama { get; set; } = string.Empty;
}

public class OturumSonucResponseDto
{
    public int OturumId { get; set; }
    public string Durum { get; set; } = string.Empty;
    public int ToplamPuan { get; set; }
    public double OrtalamaPuan { get; set; }
    public bool KvkkOnayDurumu { get; set; }
    public int? HastaId { get; set; }
    public int BirimId { get; set; }
    public int? RandevuId { get; set; }
    public SikayetDetayResponseDto? Sikayet { get; set; }
}
