using HastaAnketi.API.Data;
using HastaAnketi.API.DTOs;
using HastaAnketi.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HastaAnketi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RandevuController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetTumRandevular()
        {
            var sonuc = InMemoryStore.Randevular.Select(r => new
            {
                r.Id,
                r.HastaId,
                HastaTcNo = InMemoryStore.Hastalar.FirstOrDefault(h => h.Id == r.HastaId)?.TcNo,
                r.BirimId,
                BirimAdi = InMemoryStore.Birimler.FirstOrDefault(b => b.Id == r.BirimId)?.BirimAdi,
                r.DoktorAdi,
                r.RandevuZamani,
                r.Durum
            });

            return Ok(sonuc);
        }

        [HttpGet("{id}")]
        public IActionResult GetRandevuById(int id)
        {
            var randevu = InMemoryStore.Randevular.FirstOrDefault(x => x.Id == id);

            if (randevu == null)
                return NotFound(new { message = "Randevu bulunamadı." });

            var sonuc = new
            {
                randevu.Id,
                randevu.HastaId,
                HastaTcNo = InMemoryStore.Hastalar.FirstOrDefault(h => h.Id == randevu.HastaId)?.TcNo,
                randevu.BirimId,
                BirimAdi = InMemoryStore.Birimler.FirstOrDefault(b => b.Id == randevu.BirimId)?.BirimAdi,
                randevu.DoktorAdi,
                randevu.RandevuZamani,
                randevu.Durum
            };

            return Ok(sonuc);
        }

        [HttpPost]
        public IActionResult YeniRandevuEkle([FromBody] RandevuDto model)
        {
            if (model.HastaId <= 0)
                return BadRequest(new { message = "Geçerli bir HastaId girilmelidir." });

            if (model.BirimId <= 0)
                return BadRequest(new { message = "Geçerli bir BirimId girilmelidir." });

            if (string.IsNullOrWhiteSpace(model.DoktorAdi))
                return BadRequest(new { message = "Doktor adı zorunludur." });

            var hasta = InMemoryStore.Hastalar.FirstOrDefault(x => x.Id == model.HastaId);
            if (hasta == null)
                return BadRequest(new { message = "Geçerli bir HastaId bulunamadı." });

            var birim = InMemoryStore.Birimler.FirstOrDefault(x => x.Id == model.BirimId);
            if (birim == null)
                return BadRequest(new { message = "Geçerli bir BirimId bulunamadı." });

            var yeniRandevu = new Randevu
            {
                Id = InMemoryStore.NextId(InMemoryStore.Randevular),
                HastaId = model.HastaId,
                BirimId = model.BirimId,
                DoktorAdi = model.DoktorAdi,
                RandevuZamani = model.RandevuZamani,
                Durum = model.Durum
            };

            InMemoryStore.Randevular.Add(yeniRandevu);

            return CreatedAtAction(nameof(GetRandevuById), new { id = yeniRandevu.Id }, new
            {
                yeniRandevu.Id,
                yeniRandevu.HastaId,
                yeniRandevu.BirimId,
                yeniRandevu.DoktorAdi,
                yeniRandevu.RandevuZamani,
                yeniRandevu.Durum
            });
        }

        [HttpPut("{id}")]
        public IActionResult Guncelle(int id, [FromBody] RandevuDto model)
        {
            var mevcutRandevu = InMemoryStore.Randevular.FirstOrDefault(x => x.Id == id);

            if (mevcutRandevu == null)
                return NotFound(new { message = "Güncellenecek randevu bulunamadı." });

            if (model.HastaId <= 0)
                return BadRequest(new { message = "Geçerli bir HastaId girilmelidir." });

            if (model.BirimId <= 0)
                return BadRequest(new { message = "Geçerli bir BirimId girilmelidir." });

            if (string.IsNullOrWhiteSpace(model.DoktorAdi))
                return BadRequest(new { message = "Doktor adı zorunludur." });

            var hasta = InMemoryStore.Hastalar.FirstOrDefault(x => x.Id == model.HastaId);
            if (hasta == null)
                return BadRequest(new { message = "Geçerli bir HastaId bulunamadı." });

            var birim = InMemoryStore.Birimler.FirstOrDefault(x => x.Id == model.BirimId);
            if (birim == null)
                return BadRequest(new { message = "Geçerli bir BirimId bulunamadı." });

            mevcutRandevu.HastaId = model.HastaId;
            mevcutRandevu.BirimId = model.BirimId;
            mevcutRandevu.DoktorAdi = model.DoktorAdi;
            mevcutRandevu.RandevuZamani = model.RandevuZamani;
            mevcutRandevu.Durum = model.Durum;

            return Ok(new
            {
                mevcutRandevu.Id,
                mevcutRandevu.HastaId,
                mevcutRandevu.BirimId,
                mevcutRandevu.DoktorAdi,
                mevcutRandevu.RandevuZamani,
                mevcutRandevu.Durum
            });
        }

        [HttpDelete("{id}")]
        public IActionResult Sil(int id)
        {
            var randevu = InMemoryStore.Randevular.FirstOrDefault(x => x.Id == id);

            if (randevu == null)
                return NotFound(new { message = "Silinecek randevu bulunamadı." });

            InMemoryStore.Randevular.Remove(randevu);

            return Ok(new { message = "Randevu başarıyla silindi." });
        }
    }
}