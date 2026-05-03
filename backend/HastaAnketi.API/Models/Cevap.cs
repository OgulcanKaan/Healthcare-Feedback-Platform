namespace HastaAnketi.API.Models;

public class Cevap
{
    public int Id { get; set; }

    public int AnketOturumuId { get; set; }
    public int SoruId { get; set; }

    public int? CevapSecenekId { get; set; }

    public string? Metin { get; set; }

    public int Puan { get; set; }
    public DateTime OlusturmaTarihi { get; set; } = DateTime.UtcNow;
}
