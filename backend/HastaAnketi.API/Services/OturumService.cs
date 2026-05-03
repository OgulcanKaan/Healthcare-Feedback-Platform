using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.Application.Commands.Oturum;
using HastaAnketi.API.Application.Queries.Oturum;
using HastaAnketi.API.Common.Caching;
using HastaAnketi.API.Common.Results;
using HastaAnketi.API.DTOs;
using HastaAnketi.API.DTOs.Responses;
using HastaAnketi.API.Interfaces;
using Microsoft.AspNetCore.Http;

namespace HastaAnketi.API.Services;

public class OturumService : IOturumService
{
    private readonly IAnketRepository _anketRepository;
    private readonly IOturumRepository _oturumRepository;
    private readonly ICacheService _cacheService;
    private readonly ICommandHandler<BaslatOturumCommand, OturumBaslatResponseDto> _baslatHandler;
    private readonly ICommandHandler<CevaplaOturumCommand, OturumCevapResponseDto> _cevaplaHandler;
    private readonly IQueryHandler<GetOturumSonucQuery, OturumSonucResponseDto?> _sonucHandler;

    public OturumService(
        IAnketRepository anketRepository,
        IOturumRepository oturumRepository,
        ICacheService cacheService,
        ICommandHandler<BaslatOturumCommand, OturumBaslatResponseDto> baslatHandler,
        ICommandHandler<CevaplaOturumCommand, OturumCevapResponseDto> cevaplaHandler,
        IQueryHandler<GetOturumSonucQuery, OturumSonucResponseDto?> sonucHandler)
    {
        _anketRepository = anketRepository;
        _oturumRepository = oturumRepository;
        _cacheService = cacheService;
        _baslatHandler = baslatHandler;
        _cevaplaHandler = cevaplaHandler;
        _sonucHandler = sonucHandler;
    }

    public async Task<ServiceResult<OturumBaslatResponseDto>> BaslatAsync(SessionStartRequestDto request, CancellationToken cancellationToken = default)
    {
        var anket = _anketRepository.GetById(request.AnketId);
        if (anket == null)
        {
            return ServiceResult<OturumBaslatResponseDto>.Fail("Anket bulunamadı.", StatusCodes.Status404NotFound);
        }

        if (!string.Equals(anket.Durum, "Aktif", StringComparison.OrdinalIgnoreCase))
        {
            return ServiceResult<OturumBaslatResponseDto>.Fail("Anket aktif değil.");
        }

        if (!request.KvkkOnayDurumu)
        {
            return ServiceResult<OturumBaslatResponseDto>.Fail("KVKK onayı olmadan oturum başlatılamaz.");
        }

        var birim = _oturumRepository.GetBirimById(request.BirimId);
        if (birim == null)
        {
            return ServiceResult<OturumBaslatResponseDto>.Fail("Birim bulunamadı veya pasif.");
        }

        if (request.RandevuId.HasValue)
        {
            var randevu = _oturumRepository.GetRandevuById(request.RandevuId.Value);
            if (randevu == null)
            {
                return ServiceResult<OturumBaslatResponseDto>.Fail("Randevu bulunamadı.");
            }

            if (randevu.BirimId != request.BirimId)
            {
                return ServiceResult<OturumBaslatResponseDto>.Fail("Randevu ile birim bilgisi uyuşmuyor.");
            }
        }

        if (request.HastaId.HasValue)
        {
            var hasta = _oturumRepository.GetHastaById(request.HastaId.Value);
            if (hasta == null)
            {
                return ServiceResult<OturumBaslatResponseDto>.Fail("Hasta bulunamadı.");
            }

            if (hasta.BirimId != request.BirimId)
            {
                return ServiceResult<OturumBaslatResponseDto>.Fail("Hasta ile birim bilgisi uyuşmuyor.");
            }

            if (request.RandevuId.HasValue)
            {
                var randevu = _oturumRepository.GetRandevuById(request.RandevuId.Value);
                if (randevu != null && randevu.HastaId != request.HastaId.Value)
                {
                    return ServiceResult<OturumBaslatResponseDto>.Fail("Randevu ile hasta bilgisi uyuşmuyor.");
                }
            }
        }

        var result = await _baslatHandler.HandleAsync(new BaslatOturumCommand(request), cancellationToken);
        return ServiceResult<OturumBaslatResponseDto>.Success(result);
    }

    public async Task<ServiceResult<OturumCevapResponseDto>> CevaplaAsync(int oturumId, AnketCevaplaRequestDto request, CancellationToken cancellationToken = default)
    {
        var oturum = _oturumRepository.GetById(oturumId);
        if (oturum == null)
        {
            return ServiceResult<OturumCevapResponseDto>.Fail("Oturum bulunamadı.", StatusCodes.Status404NotFound);
        }

        if (!string.Equals(oturum.Durum, "Basladi", StringComparison.OrdinalIgnoreCase))
        {
            return ServiceResult<OturumCevapResponseDto>.Fail("Oturum cevap almaya uygun değil.");
        }

        if (request.Cevaplar == null || !request.Cevaplar.Any())
        {
            return ServiceResult<OturumCevapResponseDto>.Fail("En az bir cevap gönderilmelidir.");
        }

        foreach (var item in request.Cevaplar.Where(x => x.SecenekId.HasValue))
        {
            if (_oturumRepository.GetSecenek(item.SoruId, item.SecenekId!.Value) == null)
            {
                return ServiceResult<OturumCevapResponseDto>.Fail($"Geçersiz seçenek. SoruId={item.SoruId}, SecenekId={item.SecenekId}");
            }
        }

        var result = await _cevaplaHandler.HandleAsync(new CevaplaOturumCommand(oturumId, request), cancellationToken);
        await _cacheService.RemoveByPrefixAsync(CacheKeys.RaporPrefix, cancellationToken);
        await _cacheService.RemoveAsync(CacheKeys.SikayetList, cancellationToken);
        return ServiceResult<OturumCevapResponseDto>.Success(result);
    }

    public async Task<ServiceResult<OturumSonucResponseDto>> SonucAsync(int oturumId, CancellationToken cancellationToken = default)
    {
        var result = await _sonucHandler.HandleAsync(new GetOturumSonucQuery(oturumId), cancellationToken);
        return result == null
            ? ServiceResult<OturumSonucResponseDto>.Fail("Oturum bulunamadı.", StatusCodes.Status404NotFound)
            : ServiceResult<OturumSonucResponseDto>.Success(result);
    }
}
