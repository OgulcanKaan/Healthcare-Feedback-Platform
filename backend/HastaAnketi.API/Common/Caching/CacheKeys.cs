namespace HastaAnketi.API.Common.Caching;

public static class CacheKeys
{
    public const string AnketList = "anket:list";
    public const string AnketPrefix = "anket:";
    public const string BirimList = "birim:list";
    public const string BirimPrefix = "birim:";
    public const string DashboardPrefix = "rapor:dashboard:";
    public const string BirimRaporPrefix = "rapor:birim:";
    public const string SikayetList = "rapor:sikayet:list";
    public const string RaporPrefix = "rapor:";

    public static string AnketById(int id) => $"{AnketPrefix}{id}";

    public static string BirimById(int id) => $"{BirimPrefix}{id}";

    public static string Dashboard(DateTime? baslangicTarihi, DateTime? bitisTarihi) =>
        $"{DashboardPrefix}{FormatDate(baslangicTarihi)}:{FormatDate(bitisTarihi)}";

    public static string BirimRapor(DateTime? baslangicTarihi, DateTime? bitisTarihi) =>
        $"{BirimRaporPrefix}{FormatDate(baslangicTarihi)}:{FormatDate(bitisTarihi)}";

    private static string FormatDate(DateTime? tarih) => tarih?.ToString("yyyyMMddHHmmss") ?? "none";
}
