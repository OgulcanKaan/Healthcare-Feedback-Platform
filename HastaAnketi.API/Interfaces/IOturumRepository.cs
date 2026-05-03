using HastaAnketi.API.Models;

namespace HastaAnketi.API.Interfaces;

public interface IOturumRepository
{
    AnketOturumu Add(AnketOturumu oturum);

    AnketOturumu? GetById(int id);

    Birim? GetBirimById(int id);

    Hasta? GetHastaById(int id);

    Randevu? GetRandevuById(int id);

    CevapSecenek? GetSecenek(int soruId, int secenekId);

    IReadOnlyCollection<int> GetAnketSoruIdleri(int anketId);

    void AddCevap(Cevap cevap);

    IReadOnlyList<Cevap> GetCevaplarByOturumId(int oturumId);

    Sikayet? GetSikayetByOturumId(int oturumId);

    bool HasSikayet(int oturumId);

    Sikayet AddSikayet(Sikayet sikayet);

    int GetSikayetEsikPuani();
}
