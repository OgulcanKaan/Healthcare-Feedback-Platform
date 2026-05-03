using HastaAnketi.API.Common.Caching;
using HastaAnketi.API.Common.Mapping;
using HastaAnketi.API.Common.Results;
using HastaAnketi.API.DTOs;
using HastaAnketi.API.DTOs.Common;
using HastaAnketi.API.DTOs.Responses;
using HastaAnketi.API.Interfaces;
using Microsoft.AspNetCore.Http;

namespace HastaAnketi.API.Services;

public class BirimService : IBirimService
{
    private readonly IBirimRepository _birimRepository;
    private readonly ICacheService _cacheService;

    public BirimService(IBirimRepository birimRepository, ICacheService cacheService)
    {
        _birimRepository = birimRepository;
        _cacheService = cacheService;
    }

    public async Task<ServiceResult<IReadOnlyList<BirimResponseDto>>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var data = await _cacheService.GetOrCreateAsync(
            CacheKeys.BirimList,
            () => Task.FromResult<IReadOnlyList<BirimResponseDto>>(_birimRepository.GetAll().Select(x => x.ToResponseDto()).ToList()),
            cancellationToken: cancellationToken);

        return ServiceResult<IReadOnlyList<BirimResponseDto>>.Success(data);
    }

    public async Task<ServiceResult<BirimResponseDto>> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var data = await _cacheService.GetOrCreateAsync(
            CacheKeys.BirimById(id),
            () => Task.FromResult(_birimRepository.GetById(id)?.ToResponseDto()),
            cancellationToken: cancellationToken);

        return data == null
            ? ServiceResult<BirimResponseDto>.Fail("Birim bulunamadı.", StatusCodes.Status404NotFound)
            : ServiceResult<BirimResponseDto>.Success(data);
    }

    public async Task<ServiceResult<BirimResponseDto>> CreateAsync(BirimDto model, CancellationToken cancellationToken = default)
    {
        var validation = Validate(model);
        if (validation != null)
        {
            return ServiceResult<BirimResponseDto>.Fail(validation);
        }

        if (_birimRepository.ExistsByCode(model.BirimKodu))
        {
            return ServiceResult<BirimResponseDto>.Fail("Aynı birim koduna sahip kayıt zaten var.");
        }

        var created = _birimRepository.Create(model.ToEntity()).ToResponseDto();
        await InvalidateAsync(cancellationToken);
        return ServiceResult<BirimResponseDto>.Success(created, StatusCodes.Status201Created);
    }

    public async Task<ServiceResult<BirimResponseDto>> UpdateAsync(int id, BirimDto model, CancellationToken cancellationToken = default)
    {
        var entity = _birimRepository.GetById(id);
        if (entity == null)
        {
            return ServiceResult<BirimResponseDto>.Fail("Birim bulunamadı.", StatusCodes.Status404NotFound);
        }

        var validation = Validate(model);
        if (validation != null)
        {
            return ServiceResult<BirimResponseDto>.Fail(validation);
        }

        if (_birimRepository.ExistsByCode(model.BirimKodu, id))
        {
            return ServiceResult<BirimResponseDto>.Fail("Aynı birim koduna sahip başka bir kayıt var.");
        }

        model.Apply(entity);
        _birimRepository.Update(entity);
        await InvalidateAsync(cancellationToken);
        return ServiceResult<BirimResponseDto>.Success(entity.ToResponseDto());
    }

    public async Task<ServiceResult<ApiMessageResponse>> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = _birimRepository.GetById(id);
        if (entity == null)
        {
            return ServiceResult<ApiMessageResponse>.Fail("Birim bulunamadı.", StatusCodes.Status404NotFound);
        }

        _birimRepository.Delete(entity);
        await InvalidateAsync(cancellationToken);
        return ServiceResult<ApiMessageResponse>.Success(new ApiMessageResponse { Mesaj = "Birim silindi." });
    }

    private async Task InvalidateAsync(CancellationToken cancellationToken)
    {
        await _cacheService.RemoveAsync(CacheKeys.BirimList, cancellationToken);
        await _cacheService.RemoveByPrefixAsync(CacheKeys.BirimPrefix, cancellationToken);
        await _cacheService.RemoveByPrefixAsync(CacheKeys.RaporPrefix, cancellationToken);
    }

    private static string? Validate(BirimDto model)
    {
        if (model == null)
        {
            return "Birim verisi boş olamaz.";
        }

        if (string.IsNullOrWhiteSpace(model.BirimAdi))
        {
            return "Birim adı zorunludur.";
        }

        if (string.IsNullOrWhiteSpace(model.BirimKodu))
        {
            return "Birim kodu zorunludur.";
        }

        return null;
    }
}
