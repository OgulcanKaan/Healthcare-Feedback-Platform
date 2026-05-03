using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.Application.Commands.Oturum;
using HastaAnketi.API.DTOs.Responses;
using HastaAnketi.API.Interfaces;
using HastaAnketi.API.Models;

namespace HastaAnketi.API.Application.Handlers.Oturum;

public class BaslatOturumCommandHandler : ICommandHandler<BaslatOturumCommand, OturumBaslatResponseDto>
{
    private readonly IAnketRepository _anketRepository;
    private readonly IOturumRepository _oturumRepository;

    public BaslatOturumCommandHandler(IAnketRepository anketRepository, IOturumRepository oturumRepository)
    {
        _anketRepository = anketRepository;
        _oturumRepository = oturumRepository;
    }

    public Task<OturumBaslatResponseDto> HandleAsync(BaslatOturumCommand command, CancellationToken cancellationToken = default)
    {
        var request = command.Request;
        var anket = _anketRepository.GetById(request.AnketId)!;
        var birim = _oturumRepository.GetBirimById(request.BirimId)!;

        Hasta? hasta = null;
        Randevu? randevu = null;

        if (request.RandevuId.HasValue)
        {
            randevu = _oturumRepository.GetRandevuById(request.RandevuId.Value);
        }

        if (request.HastaId.HasValue)
        {
            hasta = _oturumRepository.GetHastaById(request.HastaId.Value);
        }
        else if (randevu != null)
        {
            hasta = _oturumRepository.GetHastaById(randevu.HastaId);
        }

        var oturum = new AnketOturumu
        {
            AnketId = request.AnketId,
            HastaId = hasta?.Id,
            BirimId = request.BirimId,
            RandevuId = request.RandevuId,
            Kanal = request.Kanal,
            KvkkOnayDurumu = request.KvkkOnayDurumu,
            BaslamaZamani = DateTime.UtcNow,
            IpAdresi = request.IpAdresi,
            CihazBilgisi = request.CihazBilgisi,
            ToplamPuan = 0,
            Durum = "Basladi",
            Anket = anket,
            Hasta = hasta,
            Birim = birim,
            Randevu = randevu
        };

        var created = _oturumRepository.Add(oturum);

        if (hasta != null)
        {
            hasta.Oturumlar.Add(created);
        }

        return Task.FromResult(new OturumBaslatResponseDto
        {
            OturumId = created.Id,
            BaslamaZamani = created.BaslamaZamani,
            Durum = created.Durum
        });
    }
}
