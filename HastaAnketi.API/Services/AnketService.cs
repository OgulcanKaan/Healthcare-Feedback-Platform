using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.Application.Commands.Anket;
using HastaAnketi.API.Application.Queries.Anket;
using HastaAnketi.API.Common.Caching;
using HastaAnketi.API.Common.Results;
using HastaAnketi.API.Common.Validation;
using HastaAnketi.API.DTOs;
using HastaAnketi.API.DTOs.Common;
using HastaAnketi.API.DTOs.Responses;
using HastaAnketi.API.Interfaces;
using Microsoft.AspNetCore.Http;

namespace HastaAnketi.API.Services;

public class AnketService : IAnketService
{
    private readonly IAnketRepository _anketRepository;
    private readonly ICacheService _cacheService;
    private readonly ICommandHandler<CreateAnketCommand, AnketResponseDto> _createHandler;
    private readonly ICommandHandler<UpdateAnketCommand, AnketResponseDto?> _updateHandler;
    private readonly ICommandHandler<DeleteAnketCommand, bool> _deleteHandler;
    private readonly IQueryHandler<GetAnketByIdQuery, AnketResponseDto?> _getByIdHandler;
    private readonly IQueryHandler<GetAnketDetayQuery, AnketDetayResponseDto?> _getDetayHandler;
    private readonly IQueryHandler<GetAnketListQuery, IReadOnlyList<AnketResponseDto>> _getListHandler;

    public AnketService(
        IAnketRepository anketRepository,
        ICacheService cacheService,
        ICommandHandler<CreateAnketCommand, AnketResponseDto> createHandler,
        ICommandHandler<UpdateAnketCommand, AnketResponseDto?> updateHandler,
        ICommandHandler<DeleteAnketCommand, bool> deleteHandler,
        IQueryHandler<GetAnketByIdQuery, AnketResponseDto?> getByIdHandler,
        IQueryHandler<GetAnketDetayQuery, AnketDetayResponseDto?> getDetayHandler,
        IQueryHandler<GetAnketListQuery, IReadOnlyList<AnketResponseDto>> getListHandler)
    {
        _anketRepository = anketRepository;
        _cacheService = cacheService;
        _createHandler = createHandler;
        _updateHandler = updateHandler;
        _deleteHandler = deleteHandler;
        _getByIdHandler = getByIdHandler;
        _getDetayHandler = getDetayHandler;
        _getListHandler = getListHandler;
    }

    public async Task<ServiceResult<IReadOnlyList<AnketResponseDto>>> GetirTumAnketlerAsync(CancellationToken cancellationToken = default)
    {
        var data = await _cacheService.GetOrCreateAsync(
            CacheKeys.AnketList,
            () => _getListHandler.HandleAsync(new GetAnketListQuery(), cancellationToken),
            cancellationToken: cancellationToken);

        return ServiceResult<IReadOnlyList<AnketResponseDto>>.Success(data);
    }

    public async Task<ServiceResult<AnketResponseDto>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var data = await _cacheService.GetOrCreateAsync(
            CacheKeys.AnketById(id),
            () => _getByIdHandler.HandleAsync(new GetAnketByIdQuery(id), cancellationToken),
            cancellationToken: cancellationToken);

        return data == null
            ? ServiceResult<AnketResponseDto>.Fail("Belirtilen ID'ye sahip anket bulunamadı.", StatusCodes.Status404NotFound)
            : ServiceResult<AnketResponseDto>.Success(data);
    }

    public async Task<ServiceResult<AnketDetayResponseDto>> GetDetayByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var data = await _cacheService.GetOrCreateAsync(
            $"{CacheKeys.AnketById(id)}:detay",
            () => _getDetayHandler.HandleAsync(new GetAnketDetayQuery(id), cancellationToken),
            cancellationToken: cancellationToken);

        return data == null
            ? ServiceResult<AnketDetayResponseDto>.Fail("Belirtilen ID'ye sahip anket bulunamadı.", StatusCodes.Status404NotFound)
            : ServiceResult<AnketDetayResponseDto>.Success(data);
    }

    public async Task<ServiceResult<ApiDataResponse<AnketResponseDto>>> YeniAnketEkleAsync(AnketDto model, CancellationToken cancellationToken = default)
    {
        var validation = Validate(model);
        if (validation != null)
        {
            return ServiceResult<ApiDataResponse<AnketResponseDto>>.Fail(validation);
        }

        var created = await _createHandler.HandleAsync(new CreateAnketCommand(model), cancellationToken);
        await InvalidateAnketCacheAsync(cancellationToken);

        return ServiceResult<ApiDataResponse<AnketResponseDto>>.Success(
            new ApiDataResponse<AnketResponseDto>
            {
                Mesaj = "Anket başarıyla oluşturuldu.",
                Veri = created
            },
            StatusCodes.Status201Created);
    }

    public async Task<ServiceResult<ApiDataResponse<AnketResponseDto>>> UpdateAsync(int id, AnketDto model, CancellationToken cancellationToken = default)
    {
        var validation = Validate(model);
        if (validation != null)
        {
            return ServiceResult<ApiDataResponse<AnketResponseDto>>.Fail(validation);
        }

        var updated = await _updateHandler.HandleAsync(new UpdateAnketCommand(id, model), cancellationToken);
        if (updated == null)
        {
            return ServiceResult<ApiDataResponse<AnketResponseDto>>.Fail("Güncellenmek istenen anket bulunamadı.", StatusCodes.Status404NotFound);
        }

        await InvalidateAnketCacheAsync(cancellationToken);

        return ServiceResult<ApiDataResponse<AnketResponseDto>>.Success(
            new ApiDataResponse<AnketResponseDto>
            {
                Mesaj = "Anket başarıyla güncellendi.",
                Veri = updated
            });
    }

    public async Task<ServiceResult> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var deleted = await _deleteHandler.HandleAsync(new DeleteAnketCommand(id), cancellationToken);
        if (!deleted)
        {
            return ServiceResult.Fail("Silinmek istenen anket bulunamadı.", StatusCodes.Status404NotFound);
        }

        await InvalidateAnketCacheAsync(cancellationToken);
        return ServiceResult.Success(StatusCodes.Status204NoContent);
    }

    public Task<ServiceResult<AnketCevapResponseDto>> CevaplaAsync(AnketCevaplaRequestDto request, CancellationToken cancellationToken = default)
    {
        if (request == null)
        {
            return Task.FromResult(ServiceResult<AnketCevapResponseDto>.Fail("Request boş olamaz."));
        }

        if (!request.KvkkOnayDurumu)
        {
            return Task.FromResult(ServiceResult<AnketCevapResponseDto>.Fail("KVKK metni onaylanmadan anket tamamlanamaz."));
        }

        if (request.Cevaplar == null || request.Cevaplar.Count == 0)
        {
            return Task.FromResult(ServiceResult<AnketCevapResponseDto>.Fail("Cevap listesi boş olamaz."));
        }

        var anket = _anketRepository.GetById(request.AnketId);
        if (anket == null)
        {
            return Task.FromResult(ServiceResult<AnketCevapResponseDto>.Fail("Cevaplanmak istenen anket bulunamadı.", StatusCodes.Status404NotFound));
        }

        var sorular = _anketRepository.GetSorularByAnketId(request.AnketId);
        var toplamPuan = 0;

        foreach (var cevap in request.Cevaplar)
        {
            var soru = sorular.FirstOrDefault(x => x.Id == cevap.SoruId);
            if (soru == null || !cevap.SecenekId.HasValue)
            {
                continue;
            }

            var secenek = soru.Secenekler.FirstOrDefault(x => x.Id == cevap.SecenekId.Value);
            if (secenek != null)
            {
                toplamPuan += secenek.PuanDegeri;
            }
        }

        var sikayetSureciBasladiMi = toplamPuan < 10;
        var result = new AnketCevapResponseDto
        {
            Mesaj = string.IsNullOrWhiteSpace(anket.TesekkurMesaji)
                ? "Anketimize katıldığınız için teşekkür ederiz."
                : anket.TesekkurMesaji,
            HesaplananPuan = toplamPuan,
            Durum = sikayetSureciBasladiMi
                ? "Düşük puan nedeniyle şikayet süreci başlatıldı."
                : "Memnuniyetiniz kaydedildi."
        };

        return Task.FromResult(ServiceResult<AnketCevapResponseDto>.Success(result));
    }

    private async Task InvalidateAnketCacheAsync(CancellationToken cancellationToken)
    {
        await _cacheService.RemoveAsync(CacheKeys.AnketList, cancellationToken);
        await _cacheService.RemoveByPrefixAsync(CacheKeys.AnketPrefix, cancellationToken);
        await _cacheService.RemoveByPrefixAsync(CacheKeys.RaporPrefix, cancellationToken);
    }

    private static string? Validate(AnketDto model)
    {
        if (model == null)
        {
            return "Anket verisi boş olamaz.";
        }

        if (string.IsNullOrWhiteSpace(model.AnketAdi))
        {
            return "Anket adı zorunludur.";
        }

        if (string.IsNullOrWhiteSpace(model.Durum))
        {
            return "Durum alanı zorunludur.";
        }

        if (!ValidationHelper.IsDateRangeValid(model.BaslangicTarihi, model.BitisTarihi))
        {
            return "Bitiş tarihi başlangıç tarihinden küçük olamaz.";
        }

        return null;
    }
}
