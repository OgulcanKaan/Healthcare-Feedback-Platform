using HastaAnketi.API.Data;
using HastaAnketi.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HastaAnketi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Yonetici")]
    public class RolController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(InMemoryStore.Roller);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var rol = InMemoryStore.Roller.FirstOrDefault(x => x.Id == id);
            if (rol == null)
                return NotFound("Rol bulunamadı.");

            return Ok(rol);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Rol model)
        {
            if (string.IsNullOrWhiteSpace(model.RolAdi))
                return BadRequest("Rol adı zorunludur.");

            if (InMemoryStore.Roller.Any(x => x.RolAdi == model.RolAdi))
                return BadRequest("Aynı isimde rol zaten mevcut.");

            model.Id = InMemoryStore.NextId(InMemoryStore.Roller);

            InMemoryStore.Roller.Add(model);

            return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
        }

        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] Rol model)
        {
            var rol = InMemoryStore.Roller.FirstOrDefault(x => x.Id == id);
            if (rol == null)
                return NotFound("Rol bulunamadı.");

            if (string.IsNullOrWhiteSpace(model.RolAdi))
                return BadRequest("Rol adı zorunludur.");

            if (InMemoryStore.Roller.Any(x => x.Id != id && x.RolAdi == model.RolAdi))
                return BadRequest("Aynı isimde başka bir rol zaten mevcut.");

            rol.RolAdi = model.RolAdi;
            rol.AktifPasif = model.AktifPasif;

            return Ok(rol);
        }

        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var rol = InMemoryStore.Roller.FirstOrDefault(x => x.Id == id);
            if (rol == null)
                return NotFound("Rol bulunamadı.");

            InMemoryStore.Roller.Remove(rol);

            return Ok(new { message = "Rol silindi." });
        }
    }
}