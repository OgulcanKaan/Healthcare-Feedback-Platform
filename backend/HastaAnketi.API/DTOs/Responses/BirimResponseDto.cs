namespace HastaAnketi.API.DTOs.Responses;

public class BirimResponseDto
{
    public int Id { get; set; }
    public string BirimKodu { get; set; } = string.Empty;
    public string BirimAdi { get; set; } = string.Empty;
    public bool AktifPasif { get; set; }
}
