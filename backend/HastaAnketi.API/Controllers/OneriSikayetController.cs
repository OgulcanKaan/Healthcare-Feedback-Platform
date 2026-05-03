using HastaAnketi.API.Data;
using HastaAnketi.API.DTOs;
using HastaAnketi.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HastaAnketi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OneriSikayetController : ControllerBase
    {
        /// <summary>
        /// Hasta veya ziyaretçi tarafından gönderilen öneri/şikayet.
        /// BirimId yoksa 1 (Acil) varsayılan kullanılır.
        /// </summary>
        [HttpPost]
        [AllowAnonymous]
        public IActionResult Gonder([FromBody] OneriSikayetRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Mesaj))
                return BadRequest(new { mesaj = "Mesaj alanı boş olamaz." });

            if (request.Mesaj.Length > 1000)
                return BadRequest(new { mesaj = "Mesaj en fazla 1000 karakter olabilir." });

            var tip = request.Tip?.ToLower() switch
            {
                "oneri" => "Oneri",
                "sikayet" => "Sikayet",
                _ => "Sikayet"
            };

            // Geçerli birimId yoksa 1 kullan
            var birimId = InMemoryStore.Birimler.Any(b => b.Id == request.BirimId)
                ? request.BirimId
                : (InMemoryStore.Birimler.FirstOrDefault()?.Id ?? 1);

            var birim = InMemoryStore.Birimler.First(b => b.Id == birimId);

            // Oturum zorunlu değil — oturumId 0 ise boş oturum nesnesi oluştur
            AnketOturumu oturum;
            if (request.OturumId > 0)
            {
                var mevcutOturum = InMemoryStore.Oturumlar.FirstOrDefault(o => o.Id == request.OturumId);
                if (mevcutOturum == null)
                    return BadRequest(new { mesaj = "Belirtilen oturum bulunamadı." });
                oturum = mevcutOturum;
            }
            else
            {
                // Standalone öneri/şikayet — oturuma bağlı değil
                oturum = new AnketOturumu
                {
                    Id = 0,
                    AnketId = 0,
                    BirimId = birimId,
                    Durum = "Standalone",
                    BaslamaZamani = DateTime.UtcNow
                };
            }

            var kayit = new Sikayet
            {
                Id = InMemoryStore.NextId(InMemoryStore.Sikayetler),
                OturumId = oturum.Id,
                HastaId = null,
                BirimId = birimId,
                Tip = tip,
                GonderenAd = string.IsNullOrWhiteSpace(request.GonderenAd) ? null : request.GonderenAd.Trim(),
                Aciklama = request.Mesaj.Trim(),
                Durum = "Acik",
                OlusturmaTarihi = DateTime.UtcNow,
                Oturum = oturum,
                Birim = birim
            };

            InMemoryStore.Sikayetler.Add(kayit);

            return Ok(new
            {
                mesaj = tip == "Oneri"
                    ? "Öneriniz alındı. Teşekkür ederiz."
                    : "Şikayetiniz alındı. En kısa sürede inceleme yapılacaktır.",
                id = kayit.Id
            });
        }

        /// <summary>
        /// Admin: Tüm öneri ve şikayetleri listele (Tip ve Durum filtrelemeli).
        /// </summary>
        [HttpGet]
        [Authorize]
        public IActionResult GetTumKayitlar([FromQuery] string? tip, [FromQuery] string? durum)
        {
            var sorgu = InMemoryStore.Sikayetler.AsEnumerable();

            if (!string.IsNullOrWhiteSpace(tip))
                sorgu = sorgu.Where(s => s.Tip.Equals(tip, StringComparison.OrdinalIgnoreCase));

            if (!string.IsNullOrWhiteSpace(durum))
                sorgu = sorgu.Where(s => s.Durum.Equals(durum, StringComparison.OrdinalIgnoreCase));

            var sonuc = sorgu
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

            return Ok(sonuc);
        }

        /// <summary>
        /// Admin: Kaydın durumunu güncelle (Acik → Inceleniyor → Kapandi).
        /// </summary>
        [HttpPatch("{id:int}/durum")]
        [Authorize]
        public IActionResult DurumGuncelle(int id, [FromBody] DurumGuncelleRequest request)
        {
            var kayit = InMemoryStore.Sikayetler.FirstOrDefault(s => s.Id == id);
            if (kayit == null)
                return NotFound(new { mesaj = "Kayıt bulunamadı." });

            var gecerliDurumlar = new[] { "Acik", "Inceleniyor", "Kapandi" };
            if (!gecerliDurumlar.Contains(request.Durum))
                return BadRequest(new { mesaj = "Geçersiz durum değeri." });

            kayit.Durum = request.Durum;
            return Ok(new { mesaj = "Durum güncellendi.", id = kayit.Id, durum = kayit.Durum });
        }
    }

    public class OneriSikayetRequest
    {
        /// <summary>Sikayet veya Oneri</summary>
        public string Tip { get; set; } = "Sikayet";
        public string Mesaj { get; set; } = string.Empty;
        public string? GonderenAd { get; set; }
        public int BirimId { get; set; } = 1;
        /// <summary>Anket oturumundan geliyorsa OturumId; bağımsız gönderimde 0</summary>
        public int OturumId { get; set; } = 0;
    }

    public class DurumGuncelleRequest
    {
        public string Durum { get; set; } = "Inceleniyor";
    }
}
