using HastaAnketi.API.Data;
using HastaAnketi.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HastaAnketi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SoruController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetTumSorular()
        {
            return Ok(InMemoryStore.Sorular);
        }

        [HttpGet("{id}")]
        public IActionResult GetSoruById(int id)
        {
            var soru = InMemoryStore.Sorular.FirstOrDefault(x => x.Id == id);

            if (soru == null)
                return NotFound(new { message = "Soru bulunamadı." });

            return Ok(soru);
        }

        [HttpPost]
        public IActionResult YeniSoruEkle([FromBody] Soru yeniSoru)
        {
            if (yeniSoru == null)
                return BadRequest(new { message = "Geçersiz veri." });

            yeniSoru.Id = InMemoryStore.NextId(InMemoryStore.Sorular);

            if (yeniSoru.Secenekler == null)
                yeniSoru.Secenekler = new List<CevapSecenek>();

            if (yeniSoru.Secenekler.Any())
            {
                foreach (var secenek in yeniSoru.Secenekler)
                {
                    secenek.Id = InMemoryStore.NextId(InMemoryStore.Secenekler);
                    secenek.SoruId = yeniSoru.Id;
                    InMemoryStore.Secenekler.Add(secenek);
                }
            }

            InMemoryStore.Sorular.Add(yeniSoru);

            return CreatedAtAction(nameof(GetSoruById), new { id = yeniSoru.Id }, yeniSoru);
        }

        [HttpPut("{id}")]
        public IActionResult Guncelle(int id, [FromBody] Soru guncelSoru)
        {
            var mevcutSoru = InMemoryStore.Sorular.FirstOrDefault(x => x.Id == id);

            if (mevcutSoru == null)
                return NotFound(new { message = "Güncellenecek soru bulunamadı." });

            mevcutSoru.SoruTipi = guncelSoru.SoruTipi;
            mevcutSoru.SoruMetni = guncelSoru.SoruMetni;
            mevcutSoru.ZorunluMu = guncelSoru.ZorunluMu;
            mevcutSoru.Kategori = guncelSoru.Kategori;

            return Ok(new
            {
                message = "Soru başarıyla güncellendi.",
                data = mevcutSoru
            });
        }

        [HttpDelete("{id}")]
        public IActionResult Sil(int id)
        {
            var soru = InMemoryStore.Sorular.FirstOrDefault(x => x.Id == id);

            if (soru == null)
                return NotFound(new { message = "Silinecek soru bulunamadı." });

            var bagliSecenekler = InMemoryStore.Secenekler
                .Where(x => x.SoruId == id)
                .ToList();

            foreach (var secenek in bagliSecenekler)
            {
                InMemoryStore.Secenekler.Remove(secenek);
            }

            var bagliAnketSorular = InMemoryStore.AnketSorular
                .Where(x => x.SoruId == id)
                .ToList();

            foreach (var anketSoru in bagliAnketSorular)
            {
                InMemoryStore.AnketSorular.Remove(anketSoru);
            }

            InMemoryStore.Sorular.Remove(soru);

            return Ok(new { message = "Soru başarıyla silindi." });
        }
    }
}