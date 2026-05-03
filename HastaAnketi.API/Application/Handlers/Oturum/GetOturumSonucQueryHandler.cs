using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.Application.Queries.Oturum;
using HastaAnketi.API.DTOs.Responses;
using HastaAnketi.API.Interfaces;

namespace HastaAnketi.API.Application.Handlers.Oturum;

public class GetOturumSonucQueryHandler : IQueryHandler<GetOturumSonucQuery, OturumSonucResponseDto?>
{
    private readonly IOturumRepository _oturumRepository;

    public GetOturumSonucQueryHandler(IOturumRepository oturumRepository)
    {
        _oturumRepository = oturumRepository;
    }

    public Task<OturumSonucResponseDto?> HandleAsync(GetOturumSonucQuery query, CancellationToken cancellationToken = default)
    {
        var oturum = _oturumRepository.GetById(query.OturumId);
        if (oturum == null)
        {
            return Task.FromResult<OturumSonucResponseDto?>(null);
        }

        var cevaplar = _oturumRepository.GetCevaplarByOturumId(query.OturumId);
        var ortalama = cevaplar.Count == 0 ? 0 : cevaplar.Average(x => x.Puan);
        var sikayet = _oturumRepository.GetSikayetByOturumId(query.OturumId);

        return Task.FromResult<OturumSonucResponseDto?>(new OturumSonucResponseDto
        {
            OturumId = query.OturumId,
            Durum = oturum.Durum,
            ToplamPuan = oturum.ToplamPuan,
            OrtalamaPuan = ortalama,
            KvkkOnayDurumu = oturum.KvkkOnayDurumu,
            HastaId = oturum.HastaId,
            BirimId = oturum.BirimId,
            RandevuId = oturum.RandevuId,
            Sikayet = sikayet == null
                ? null
                : new SikayetDetayResponseDto
                {
                    Id = sikayet.Id,
                    Durum = sikayet.Durum,
                    Aciklama = sikayet.Aciklama
                }
        });
    }
}
