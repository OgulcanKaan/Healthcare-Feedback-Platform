namespace HastaAnketi.API.DTOs.Responses;

public class AnketCevapResponseDto
{
    public string Mesaj { get; set; } = string.Empty;
    public int HesaplananPuan { get; set; }
    public string Durum { get; set; } = string.Empty;
}
