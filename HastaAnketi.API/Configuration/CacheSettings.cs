namespace HastaAnketi.API.Configuration;

public class CacheSettings
{
    public const string SectionName = "CacheSettings";

    public string Provider { get; set; } = "Memory";

    public string RedisConnection { get; set; } = "localhost:6379";

    public int DefaultExpirationMinutes { get; set; } = 10;
}
