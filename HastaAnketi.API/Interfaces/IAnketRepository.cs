using HastaAnketi.API.Models;

namespace HastaAnketi.API.Interfaces
{
    public interface IAnketRepository
    {
        List<Anket> GetirTumAnketler();
        Anket YeniAnketEkle(Anket yeniAnket);
        Anket? GetById(int id);
        List<Soru> GetSorularByAnketId(int anketId);
        void Update(Anket anket);
        void Delete(int id);
    }
}
