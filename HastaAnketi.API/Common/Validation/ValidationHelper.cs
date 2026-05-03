namespace HastaAnketi.API.Common.Validation;

public static class ValidationHelper
{
    public static bool IsDateRangeValid(DateTime baslangicTarihi, DateTime? bitisTarihi) =>
        !bitisTarihi.HasValue || bitisTarihi.Value >= baslangicTarihi;
}
