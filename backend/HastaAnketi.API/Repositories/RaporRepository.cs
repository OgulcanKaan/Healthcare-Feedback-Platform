using HastaAnketi.API.Data;
using HastaAnketi.API.DTOs;
using HastaAnketi.API.Interfaces;

namespace HastaAnketi.API.Repositories
{
    public class RaporRepository : IRaporRepository
    {
        public DashboardOzetDto GetDashboardOzeti(DateTime? baslangicTarihi, DateTime? bitisTarihi)
        {
            var tamamlananOturumlar = InMemoryStore.Oturumlar
                .Where(o => o.Durum == "Tamamlandi")
                .Where(o => TarihAraligindaMi(o.BitisZamani ?? o.BaslamaZamani, baslangicTarihi, bitisTarihi))
                .ToList();

            var oturumIdleri = tamamlananOturumlar
                .Select(o => o.Id)
                .ToHashSet();

            var ilgiliCevaplar = InMemoryStore.Cevaplar
                .Where(c => oturumIdleri.Contains(c.AnketOturumuId))
                .ToList();

            var ilgiliSikayetler = InMemoryStore.Sikayetler
                .Where(s => oturumIdleri.Contains(s.OturumId))
                .Where(s => TarihAraligindaMi(s.OlusturmaTarihi, baslangicTarihi, bitisTarihi))
                .ToList();

            double genelMemnuniyetOrtalamasi = 0;

            if (ilgiliCevaplar.Any())
            {
                var ortalamaPuan = ilgiliCevaplar.Average(c => c.Puan);
                genelMemnuniyetOrtalamasi = Math.Round((ortalamaPuan / 5.0) * 100.0, 2);
            }

            return new DashboardOzetDto
            {
                GenelMemnuniyetOrtalamasi = genelMemnuniyetOrtalamasi,
                ToplamCevaplananAnket = tamamlananOturumlar.Count,
                ToplamSikayetSayisi = ilgiliSikayetler.Count
            };
        }

        public List<BirimMemnuniyetDto> GetBirimBazliRapor(DateTime? baslangicTarihi, DateTime? bitisTarihi)
        {
            var tamamlananOturumlar = InMemoryStore.Oturumlar
                .Where(o => o.Durum == "Tamamlandi")
                .Where(o => TarihAraligindaMi(o.BitisZamani ?? o.BaslamaZamani, baslangicTarihi, bitisTarihi))
                .ToList();

            var sonuc = InMemoryStore.Birimler
                .Select(birim =>
                {
                    var birimOturumlari = tamamlananOturumlar
                        .Where(o => o.BirimId == birim.Id)
                        .ToList();

                    var oturumIdleri = birimOturumlari
                        .Select(o => o.Id)
                        .ToHashSet();

                    var birimCevaplari = InMemoryStore.Cevaplar
                        .Where(c => oturumIdleri.Contains(c.AnketOturumuId))
                        .ToList();

                    double ortalamaPuan = 0;

                    if (birimCevaplari.Any())
                    {
                        var cevapOrtalamasi = birimCevaplari.Average(c => c.Puan);
                        ortalamaPuan = Math.Round((cevapOrtalamasi / 5.0) * 100.0, 2);
                    }

                    return new BirimMemnuniyetDto
                    {
                        BirimAdi = birim.BirimAdi,
                        OrtalamaPuan = ortalamaPuan,
                        ToplamAnketSayisi = birimOturumlari.Count
                    };
                })
                .Where(x => x.ToplamAnketSayisi > 0)
                .OrderByDescending(x => x.OrtalamaPuan)
                .ToList();

            return sonuc;
        }

        public List<SikayetOzetDto> GetDusukPuanliSikayetler()
        {
            return InMemoryStore.Sikayetler
                .OrderByDescending(s => s.OlusturmaTarihi)
                .Select(s => new SikayetOzetDto
                {
                    SikayetId = s.Id,
                    OturumId = s.OturumId,
                    Tip = s.Tip,
                    GonderenAd = s.GonderenAd,
                    Aciklama = s.Aciklama,
                    Durum = s.Durum,
                    OlusturmaTarihi = s.OlusturmaTarihi
                })
                .ToList();
        }


        private static bool TarihAraligindaMi(DateTime tarih, DateTime? baslangicTarihi, DateTime? bitisTarihi)
        {
            if (baslangicTarihi.HasValue && tarih.Date < baslangicTarihi.Value.Date)
                return false;

            // bitisTarihi gün sonu dahil (23:59:59.999) olarak kontrol et
            if (bitisTarihi.HasValue && tarih > bitisTarihi.Value.Date.AddDays(1).AddMilliseconds(-1))
                return false;

            return true;
        }
    }
}