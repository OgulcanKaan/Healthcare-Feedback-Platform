using HastaAnketi.API.Data;
using HastaAnketi.API.Interfaces;
using HastaAnketi.API.Models;

namespace HastaAnketi.API.Repositories;

public class BirimRepository : IBirimRepository
{
    public List<Birim> GetAll() => InMemoryStore.Birimler;

    public Birim? GetById(int id) => InMemoryStore.Birimler.FirstOrDefault(x => x.Id == id);

    public Birim Create(Birim birim)
    {
        birim.Id = InMemoryStore.NextId(InMemoryStore.Birimler);
        InMemoryStore.Birimler.Add(birim);
        return birim;
    }

    public void Update(Birim birim)
    {
        var entity = GetById(birim.Id);
        if (entity == null)
        {
            return;
        }

        entity.BirimAdi = birim.BirimAdi;
        entity.BirimKodu = birim.BirimKodu;
        entity.AktifPasif = birim.AktifPasif;
    }

    public void Delete(Birim birim)
    {
        InMemoryStore.Birimler.Remove(birim);
    }

    public bool ExistsByCode(string birimKodu, int? excludedId = null)
    {
        return InMemoryStore.Birimler.Any(x =>
            x.BirimKodu.Equals(birimKodu, StringComparison.OrdinalIgnoreCase) &&
            (!excludedId.HasValue || x.Id != excludedId.Value));
    }
}
