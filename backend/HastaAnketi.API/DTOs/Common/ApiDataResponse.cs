namespace HastaAnketi.API.DTOs.Common;

public class ApiDataResponse<T>
{
    public string Mesaj { get; set; } = string.Empty;

    public T Veri { get; set; } = default!;
}
