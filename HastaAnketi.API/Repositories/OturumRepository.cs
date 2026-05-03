using HastaAnketi.API.Data;
using HastaAnketi.API.Interfaces;
using HastaAnketi.API.Models;

namespace HastaAnketi.API.Repositories;

public class OturumRepository : IOturumRepository
{
    public AnketOturumu Add(AnketOturumu oturum)
    {
        oturum.Id = InMemoryStore.NextId(InMemoryStore.Oturumlar);
        InMemoryStore.Oturumlar.Add(oturum);
        return oturum;
    }

    public AnketOturumu? GetById(int id) => InMemoryStore.Oturumlar.FirstOrDefault(x => x.Id == id);

    public Birim? GetBirimById(int id) => InMemoryStore.Birimler.FirstOrDefault(x => x.Id == id && x.AktifPasif);

    public Hasta? GetHastaById(int id) => InMemoryStore.Hastalar.FirstOrDefault(x => x.Id == id);

    public Randevu? GetRandevuById(int id) => InMemoryStore.Randevular.FirstOrDefault(x => x.Id == id);

    public CevapSecenek? GetSecenek(int soruId, int secenekId) =>
        InMemoryStore.Secenekler.FirstOrDefault(x => x.Id == secenekId && x.SoruId == soruId);

    public IReadOnlyCollection<int> GetAnketSoruIdleri(int anketId) =>
        InMemoryStore.AnketSorular.Where(x => x.AnketId == anketId).Select(x => x.SoruId).ToHashSet();

    public void AddCevap(Cevap cevap)
    {
        cevap.Id = InMemoryStore.NextId(InMemoryStore.Cevaplar);
        InMemoryStore.Cevaplar.Add(cevap);
    }

    public IReadOnlyList<Cevap> GetCevaplarByOturumId(int oturumId) =>
        InMemoryStore.Cevaplar.Where(x => x.AnketOturumuId == oturumId).ToList();

    public Sikayet? GetSikayetByOturumId(int oturumId) => InMemoryStore.Sikayetler.FirstOrDefault(x => x.OturumId == oturumId);

    public bool HasSikayet(int oturumId) => InMemoryStore.Sikayetler.Any(x => x.OturumId == oturumId);

    public Sikayet AddSikayet(Sikayet sikayet)
    {
        sikayet.Id = InMemoryStore.NextId(InMemoryStore.Sikayetler);
        InMemoryStore.Sikayetler.Add(sikayet);
        return sikayet;
    }

    public int GetSikayetEsikPuani() => InMemoryStore.Parametre.SikayetEsikPuani;
}
