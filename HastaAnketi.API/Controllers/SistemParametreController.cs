using HastaAnketi.API.Data;
using HastaAnketi.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HastaAnketi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Yonetici")]
    public class SistemParametreController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(InMemoryStore.Parametre);
        }

        [HttpPut]
        public IActionResult Update([FromBody] SistemParametre model)
        {
            if (string.IsNullOrWhiteSpace(model.KurumAdi))
                return BadRequest("Kurum adı zorunludur.");

            if (string.IsNullOrWhiteSpace(model.KvkkMetni))
                return BadRequest("KVKK metni zorunludur.");

            if (model.AnketTimeoutSuresi <= 0)
                return BadRequest("Anket timeout süresi 0'dan büyük olmalıdır.");

            if (model.SikayetEsikPuani < 0)
                return BadRequest("Şikayet eşik puanı negatif olamaz.");

            var guncel = InMemoryStore.Parametre;

            guncel.KurumAdi = model.KurumAdi;
            guncel.KvkkMetni = model.KvkkMetni;
            guncel.AnketTimeoutSuresi = model.AnketTimeoutSuresi;
            guncel.AnonimAnketAktif = model.AnonimAnketAktif;
            guncel.SikayetEsikPuani = model.SikayetEsikPuani;

            return Ok(guncel);
        }
    }
}
