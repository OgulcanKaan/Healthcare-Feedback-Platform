namespace HastaAnketi.API.Models
{
    public class Rol
    {
        public int Id { get; set; }
        public string RolAdi { get; set; } = string.Empty;
        public bool AktifPasif { get; set; } = true;

        public List<Kullanici> Kullanicilar { get; set; } = new();
    }
}