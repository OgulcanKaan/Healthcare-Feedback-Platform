using HastaAnketi.API.Data;
using HastaAnketi.API.Interfaces;
using HastaAnketi.API.Models;

namespace HastaAnketi.API.Repositories;

public class AnketRepository : IAnketRepository
{
    public List<Anket> GetirTumAnketler()
    {
        return InMemoryStore.Anketler.Select(HydrateAnket).ToList();
    }

    public Anket YeniAnketEkle(Anket yeniAnket)
    {
        yeniAnket.Id = InMemoryStore.NextId(InMemoryStore.Anketler);

        if (yeniAnket.AnketSorular == null)
        {
            yeniAnket.AnketSorular = new List<AnketSoru>();
        }

        if (yeniAnket.AnketSorular.Any())
        {
            foreach (var anketSoru in yeniAnket.AnketSorular)
            {
                anketSoru.AnketId = yeniAnket.Id;

                if (anketSoru.Soru != null)
                {
                    var soru = anketSoru.Soru;
                    soru.Id = InMemoryStore.NextId(InMemoryStore.Sorular);
                    InMemoryStore.Sorular.Add(soru);

                    anketSoru.SoruId = soru.Id;

                    if (soru.Secenekler != null && soru.Secenekler.Any())
                    {
                        foreach (var secenek in soru.Secenekler)
                        {
                            secenek.Id = InMemoryStore.NextId(InMemoryStore.Secenekler);
                            secenek.SoruId = soru.Id;
                            InMemoryStore.Secenekler.Add(secenek);
                        }
                    }
                }

                InMemoryStore.AnketSorular.Add(anketSoru);
            }
        }

        InMemoryStore.Anketler.Add(yeniAnket);
        return HydrateAnket(yeniAnket);
    }

    public Anket? GetById(int id)
    {
        var anket = InMemoryStore.Anketler.FirstOrDefault(a => a.Id == id);
        return anket == null ? null : HydrateAnket(anket);
    }

    public List<Soru> GetSorularByAnketId(int anketId)
    {
        return InMemoryStore.AnketSorular
            .Where(x => x.AnketId == anketId)
            .OrderBy(x => x.SiraNo)
            .Select(x => BuildSoru(x.SoruId))
            .Where(x => x != null)
            .Cast<Soru>()
            .ToList();
    }

    public void Update(Anket anket)
    {
        var mevcut = InMemoryStore.Anketler.FirstOrDefault(a => a.Id == anket.Id);
        if (mevcut == null)
        {
            return;
        }

        mevcut.AnketAdi = anket.AnketAdi;
        mevcut.Durum = anket.Durum;
        mevcut.BaslangicTarihi = anket.BaslangicTarihi;
        mevcut.BitisTarihi = anket.BitisTarihi;
        mevcut.KarsilamaMesaji = anket.KarsilamaMesaji;
        mevcut.TesekkurMesaji = anket.TesekkurMesaji;
        mevcut.OlusturanKullaniciId = anket.OlusturanKullaniciId;
    }

    public void Delete(int id)
    {
        var anket = InMemoryStore.Anketler.FirstOrDefault(a => a.Id == id);
        if (anket == null)
        {
            return;
        }

        var iliskiliAnketSorular = InMemoryStore.AnketSorular
            .Where(x => x.AnketId == id)
            .ToList();

        foreach (var anketSoru in iliskiliAnketSorular)
        {
            var soru = InMemoryStore.Sorular.FirstOrDefault(s => s.Id == anketSoru.SoruId);
            if (soru != null)
            {
                var secenekler = InMemoryStore.Secenekler
                    .Where(sec => sec.SoruId == soru.Id)
                    .ToList();

                foreach (var secenek in secenekler)
                {
                    InMemoryStore.Secenekler.Remove(secenek);
                }

                InMemoryStore.Sorular.Remove(soru);
            }

            InMemoryStore.AnketSorular.Remove(anketSoru);
        }

        InMemoryStore.Anketler.Remove(anket);
    }

    private static Anket HydrateAnket(Anket source)
    {
        source.AnketSorular = InMemoryStore.AnketSorular
            .Where(x => x.AnketId == source.Id)
            .OrderBy(x => x.SiraNo)
            .Select(x => new AnketSoru
            {
                AnketId = x.AnketId,
                SoruId = x.SoruId,
                SiraNo = x.SiraNo,
                Anket = source,
                Soru = BuildSoru(x.SoruId) ?? new Soru()
            })
            .ToList();

        return source;
    }

    private static Soru? BuildSoru(int soruId)
    {
        var soru = InMemoryStore.Sorular.FirstOrDefault(x => x.Id == soruId);
        if (soru == null)
        {
            return null;
        }

        soru.Secenekler = InMemoryStore.Secenekler
            .Where(x => x.SoruId == soru.Id)
            .Select(x => new CevapSecenek
            {
                Id = x.Id,
                SoruId = x.SoruId,
                SecenekMetni = x.SecenekMetni,
                PuanDegeri = x.PuanDegeri
            })
            .ToList();

        return soru;
    }
}
