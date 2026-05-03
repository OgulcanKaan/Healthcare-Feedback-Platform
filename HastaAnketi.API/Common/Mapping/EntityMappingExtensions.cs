using HastaAnketi.API.DTOs;
using HastaAnketi.API.DTOs.Responses;
using HastaAnketi.API.Models;

namespace HastaAnketi.API.Common.Mapping;

public static class EntityMappingExtensions
{
    public static AnketResponseDto ToResponseDto(this Anket anket)
    {
        return new AnketResponseDto
        {
            Id = anket.Id,
            AnketAdi = anket.AnketAdi,
            Durum = anket.Durum,
            BaslangicTarihi = anket.BaslangicTarihi,
            BitisTarihi = anket.BitisTarihi,
            KarsilamaMesaji = anket.KarsilamaMesaji,
            TesekkurMesaji = anket.TesekkurMesaji,
            OlusturanKullaniciId = anket.OlusturanKullaniciId
        };
    }

    public static AnketDetayResponseDto ToDetayResponseDto(this Anket anket)
    {
        return new AnketDetayResponseDto
        {
            Id = anket.Id,
            AnketAdi = anket.AnketAdi,
            Durum = anket.Durum,
            BaslangicTarihi = anket.BaslangicTarihi,
            BitisTarihi = anket.BitisTarihi,
            KarsilamaMesaji = anket.KarsilamaMesaji,
            TesekkurMesaji = anket.TesekkurMesaji,
            OlusturanKullaniciId = anket.OlusturanKullaniciId,
            Sorular = anket.AnketSorular
                .OrderBy(x => x.SiraNo)
                .Select(x => new AnketSoruResponseDto
                {
                    SoruId = x.SoruId,
                    SiraNo = x.SiraNo,
                    SoruTipi = x.Soru?.SoruTipi ?? string.Empty,
                    SoruMetni = x.Soru?.SoruMetni ?? string.Empty,
                    ZorunluMu = x.Soru?.ZorunluMu ?? false,
                    Kategori = x.Soru?.Kategori ?? string.Empty,
                    Secenekler = x.Soru?.Secenekler?
                        .Select(secenek => new SecenekResponseDto
                        {
                            Id = secenek.Id,
                            SoruId = secenek.SoruId,
                            SecenekMetni = secenek.SecenekMetni,
                            PuanDegeri = secenek.PuanDegeri
                        })
                        .ToList() ?? new List<SecenekResponseDto>()
                })
                .ToList()
        };
    }

    public static Anket ToEntity(this AnketDto dto)
    {
        return new Anket
        {
            AnketAdi = dto.AnketAdi,
            Durum = dto.Durum,
            BaslangicTarihi = dto.BaslangicTarihi,
            BitisTarihi = dto.BitisTarihi,
            KarsilamaMesaji = dto.KarsilamaMesaji,
            TesekkurMesaji = dto.TesekkurMesaji,
            OlusturanKullaniciId = dto.OlusturanKullaniciId,
            AnketSorular = new List<AnketSoru>()
        };
    }

    public static void Apply(this AnketDto dto, Anket entity)
    {
        entity.AnketAdi = dto.AnketAdi;
        entity.Durum = dto.Durum;
        entity.BaslangicTarihi = dto.BaslangicTarihi;
        entity.BitisTarihi = dto.BitisTarihi;
        entity.KarsilamaMesaji = dto.KarsilamaMesaji;
        entity.TesekkurMesaji = dto.TesekkurMesaji;
        entity.OlusturanKullaniciId = dto.OlusturanKullaniciId;
    }

    public static BirimResponseDto ToResponseDto(this Birim birim)
    {
        return new BirimResponseDto
        {
            Id = birim.Id,
            BirimKodu = birim.BirimKodu,
            BirimAdi = birim.BirimAdi,
            AktifPasif = birim.AktifPasif
        };
    }

    public static Birim ToEntity(this BirimDto dto)
    {
        return new Birim
        {
            BirimAdi = dto.BirimAdi,
            BirimKodu = dto.BirimKodu,
            AktifPasif = dto.AktifPasif
        };
    }

    public static void Apply(this BirimDto dto, Birim entity)
    {
        entity.BirimAdi = dto.BirimAdi;
        entity.BirimKodu = dto.BirimKodu;
        entity.AktifPasif = dto.AktifPasif;
    }
}
