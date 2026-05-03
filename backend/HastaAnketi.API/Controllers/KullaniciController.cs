using HastaAnketi.API.Data;
using HastaAnketi.API.DTOs;
using HastaAnketi.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HastaAnketi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Yonetici")]
    public class KullaniciController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll()
        {
            var sonuc = InMemoryStore.Kullanicilar.Select(k => new
            {
                k.Id,
                k.KullaniciAdi,
                k.AdSoyad,
                k.BirimId,
                BirimAdi = InMemoryStore.Birimler.FirstOrDefault(b => b.Id == k.BirimId)?.BirimAdi,
                k.RolId,
                RolAdi = InMemoryStore.Roller.FirstOrDefault(r => r.Id == k.RolId)?.RolAdi,
                k.AktifPasif,
                k.SonGirisTarihi
            });

            return Ok(sonuc);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var kullanici = InMemoryStore.Kullanicilar.FirstOrDefault(x => x.Id == id);
            if (kullanici == null)
                return NotFound("Kullanıcı bulunamadı.");

            var sonuc = new
            {
                kullanici.Id,
                kullanici.KullaniciAdi,
                kullanici.AdSoyad,
                kullanici.BirimId,
                BirimAdi = InMemoryStore.Birimler.FirstOrDefault(b => b.Id == kullanici.BirimId)?.BirimAdi,
                kullanici.RolId,
                RolAdi = InMemoryStore.Roller.FirstOrDefault(r => r.Id == kullanici.RolId)?.RolAdi,
                kullanici.AktifPasif,
                kullanici.SonGirisTarihi
            };

            return Ok(sonuc);
        }

        [HttpGet("loglar")]
        public IActionResult GetLoglar()
        {
            var sonuc = InMemoryStore.KullaniciLoglari
                .OrderByDescending(log => log.IslemZamani)
                .Select(log => new
                {
                    log.Id,
                    log.KullaniciId,
                    KullaniciAdi = InMemoryStore.Kullanicilar.FirstOrDefault(k => k.Id == log.KullaniciId)?.KullaniciAdi ?? "Bilinmiyor",
                    log.IslemZamani,
                    log.IpAdresi,
                    log.BrowserBilgisi,
                    log.BasariDurumu,
                    log.HataBilgisi
                });

            return Ok(sonuc);
        }

        [HttpPost]
        public IActionResult Create([FromBody] KullaniciDto model)
        {
            if (string.IsNullOrWhiteSpace(model.KullaniciAdi))
                return BadRequest("Kullanıcı adı zorunludur.");

            if (string.IsNullOrWhiteSpace(model.Sifre))
                return BadRequest("Şifre zorunludur.");

            if (string.IsNullOrWhiteSpace(model.AdSoyad))
                return BadRequest("Ad soyad zorunludur.");

            if (InMemoryStore.Kullanicilar.Any(x => x.KullaniciAdi == model.KullaniciAdi))
                return BadRequest("Bu kullanıcı adı zaten kullanılıyor.");

            var birim = InMemoryStore.Birimler.FirstOrDefault(x => x.Id == model.BirimId);
            if (birim == null)
                return BadRequest("Geçerli bir birim seçilmelidir.");

            var rol = InMemoryStore.Roller.FirstOrDefault(x => x.Id == model.RolId);
            if (rol == null)
                return BadRequest("Geçerli bir rol seçilmelidir.");

            var yeniKullanici = new Kullanici
            {
                Id = InMemoryStore.NextId(InMemoryStore.Kullanicilar),
                KullaniciAdi = model.KullaniciAdi,
                Sifre = model.Sifre,
                AdSoyad = model.AdSoyad,
                BirimId = model.BirimId,
                RolId = model.RolId,
                AktifPasif = model.AktifPasif,
                SonGirisTarihi = null
            };

            InMemoryStore.Kullanicilar.Add(yeniKullanici);

            return CreatedAtAction(nameof(GetById), new { id = yeniKullanici.Id }, new
            {
                yeniKullanici.Id,
                yeniKullanici.KullaniciAdi,
                yeniKullanici.AdSoyad,
                yeniKullanici.BirimId,
                yeniKullanici.RolId,
                yeniKullanici.AktifPasif
            });
        }

        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] KullaniciDto model)
        {
            var kullanici = InMemoryStore.Kullanicilar.FirstOrDefault(x => x.Id == id);
            if (kullanici == null)
                return NotFound("Kullanıcı bulunamadı.");

            if (string.IsNullOrWhiteSpace(model.KullaniciAdi))
                return BadRequest("Kullanıcı adı zorunludur.");

            if (string.IsNullOrWhiteSpace(model.Sifre))
                return BadRequest("Şifre zorunludur.");

            if (string.IsNullOrWhiteSpace(model.AdSoyad))
                return BadRequest("Ad soyad zorunludur.");

            if (InMemoryStore.Kullanicilar.Any(x => x.Id != id && x.KullaniciAdi == model.KullaniciAdi))
                return BadRequest("Bu kullanıcı adı başka bir kullanıcı tarafından kullanılıyor.");

            var birim = InMemoryStore.Birimler.FirstOrDefault(x => x.Id == model.BirimId);
            if (birim == null)
                return BadRequest("Geçerli bir birim seçilmelidir.");

            var rol = InMemoryStore.Roller.FirstOrDefault(x => x.Id == model.RolId);
            if (rol == null)
                return BadRequest("Geçerli bir rol seçilmelidir.");

            kullanici.KullaniciAdi = model.KullaniciAdi;
            kullanici.Sifre = model.Sifre;
            kullanici.AdSoyad = model.AdSoyad;
            kullanici.BirimId = model.BirimId;
            kullanici.RolId = model.RolId;
            kullanici.AktifPasif = model.AktifPasif;

            return Ok(new
            {
                kullanici.Id,
                kullanici.KullaniciAdi,
                kullanici.AdSoyad,
                kullanici.BirimId,
                kullanici.RolId,
                kullanici.AktifPasif
            });
        }

        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var kullanici = InMemoryStore.Kullanicilar.FirstOrDefault(x => x.Id == id);
            if (kullanici == null)
                return NotFound("Kullanıcı bulunamadı.");

            InMemoryStore.Kullanicilar.Remove(kullanici);

            return Ok(new { message = "Kullanıcı silindi." });
        }
    }
}
