using HastaAnketi.API.Data;
using HastaAnketi.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HastaAnketi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SecenekController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetTumSecenekler()
        {
            return Ok(InMemoryStore.Secenekler);
        }

        [HttpGet("{id}")]
        public IActionResult GetSecenekById(int id)
        {
            var secenek = InMemoryStore.Secenekler.FirstOrDefault(x => x.Id == id);

            if (secenek == null)
                return NotFound(new { message = "Seçenek bulunamadı." });

            return Ok(secenek);
        }

        [HttpGet("soru/{soruId}")]
        public IActionResult GetSeceneklerBySoruId(int soruId)
        {
            var secenekler = InMemoryStore.Secenekler
                .Where(x => x.SoruId == soruId)
                .ToList();

            return Ok(secenekler);
        }

        [HttpPost]
        public IActionResult YeniSecenekEkle([FromBody] CevapSecenek yeniSecenek)
        {
            if (yeniSecenek == null)
                return BadRequest(new { message = "Geçersiz veri." });

            var soru = InMemoryStore.Sorular.FirstOrDefault(x => x.Id == yeniSecenek.SoruId);
            if (soru == null)
                return BadRequest(new { message = "Geçerli bir SoruId bulunamadı." });

            yeniSecenek.Id = InMemoryStore.NextId(InMemoryStore.Secenekler);
            InMemoryStore.Secenekler.Add(yeniSecenek);

            if (soru.Secenekler == null)
                soru.Secenekler = new List<CevapSecenek>();

            soru.Secenekler.Add(yeniSecenek);

            return CreatedAtAction(nameof(GetSecenekById), new { id = yeniSecenek.Id }, yeniSecenek);
        }

        [HttpPut("{id}")]
        public IActionResult Guncelle(int id, [FromBody] CevapSecenek guncelSecenek)
        {
            var mevcutSecenek = InMemoryStore.Secenekler.FirstOrDefault(x => x.Id == id);

            if (mevcutSecenek == null)
                return NotFound(new { message = "Güncellenecek seçenek bulunamadı." });

            mevcutSecenek.SecenekMetni = guncelSecenek.SecenekMetni;
            mevcutSecenek.PuanDegeri = guncelSecenek.PuanDegeri;

            return Ok(new
            {
                message = "Seçenek başarıyla güncellendi.",
                data = mevcutSecenek
            });
        }

        [HttpDelete("{id}")]
        public IActionResult Sil(int id)
        {
            var secenek = InMemoryStore.Secenekler.FirstOrDefault(x => x.Id == id);

            if (secenek == null)
                return NotFound(new { message = "Silinecek seçenek bulunamadı." });

            var soru = InMemoryStore.Sorular.FirstOrDefault(x => x.Id == secenek.SoruId);
            if (soru != null && soru.Secenekler != null)
            {
                var soruIciSecenek = soru.Secenekler.FirstOrDefault(x => x.Id == id);
                if (soruIciSecenek != null)
                {
                    soru.Secenekler.Remove(soruIciSecenek);
                }
            }

            InMemoryStore.Secenekler.Remove(secenek);

            return Ok(new { message = "Seçenek başarıyla silindi." });
        }
    }
}