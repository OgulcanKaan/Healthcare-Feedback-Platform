using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.Application.Commands.Oturum;
using HastaAnketi.API.DTOs.Responses;
using HastaAnketi.API.Interfaces;
using HastaAnketi.API.Models;

namespace HastaAnketi.API.Application.Handlers.Oturum;

public class CevaplaOturumCommandHandler : ICommandHandler<CevaplaOturumCommand, OturumCevapResponseDto>
{
    private readonly IOturumRepository _oturumRepository;

    public CevaplaOturumCommandHandler(IOturumRepository oturumRepository)
    {
        _oturumRepository = oturumRepository;
    }

    public Task<OturumCevapResponseDto> HandleAsync(CevaplaOturumCommand command, CancellationToken cancellationToken = default)
    {
        var oturum = _oturumRepository.GetById(command.OturumId)!;
        var soruIdSet = _oturumRepository.GetAnketSoruIdleri(oturum.AnketId);

        var toplam = 0;
        var cevapSayisi = 0;

        foreach (var item in command.Request.Cevaplar)
        {
            // Ankete soru bağlıysa sadece bağlı soruları kabul et;
            // soru bağlı değilse gelen tüm cevapları işle
            if (soruIdSet.Count > 0 && !soruIdSet.Contains(item.SoruId))
            {
                continue;
            }

            var puan = 0;

            if (item.SecenekId.HasValue)
            {
                var secenek = _oturumRepository.GetSecenek(item.SoruId, item.SecenekId.Value)!;
                puan = secenek.PuanDegeri;
            }

            var cevap = new Cevap
            {
                AnketOturumuId = oturum.Id,
                SoruId = item.SoruId,
                CevapSecenekId = item.SecenekId,
                Metin = item.AcikCevap,
                Puan = puan,
                OlusturmaTarihi = DateTime.UtcNow
            };

            _oturumRepository.AddCevap(cevap);
            oturum.Cevaplar.Add(cevap);

            toplam += puan;
            cevapSayisi++;
        }

        oturum.ToplamPuan = toplam;
        oturum.BitisZamani = DateTime.UtcNow;
        oturum.Durum = "Tamamlandi";

        var ortalama = cevapSayisi == 0 ? 0 : (double)toplam / cevapSayisi;
        var sikayetOlustu = false;

        if (ortalama < _oturumRepository.GetSikayetEsikPuani() && !_oturumRepository.HasSikayet(oturum.Id))
        {
            var sikayet = new Sikayet
            {
                OturumId = oturum.Id,
                HastaId = oturum.HastaId,
                BirimId = oturum.BirimId,
                Aciklama = "Otomatik: Ortalama puan eşik altı.",
                Durum = "Acik",
                OlusturmaTarihi = DateTime.UtcNow,
                Oturum = oturum,
                Birim = oturum.Birim!
            };

            _oturumRepository.AddSikayet(sikayet);
            oturum.Sikayetler.Add(sikayet);
            sikayetOlustu = true;
        }

        return Task.FromResult(new OturumCevapResponseDto
        {
            OturumId = oturum.Id,
            ToplamPuan = oturum.ToplamPuan,
            OrtalamaPuan = ortalama,
            SikayetOlustuMu = sikayetOlustu
        });
    }
}
