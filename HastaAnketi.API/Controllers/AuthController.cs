using HastaAnketi.API.Data;
using HastaAnketi.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HastaAnketi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] KullaniciGiris bilgileri)
        {
            var kullanici = InMemoryStore.Kullanicilar.FirstOrDefault(x =>
                x.KullaniciAdi == bilgileri.KullaniciAdi &&
                x.Sifre == bilgileri.Sifre &&
                x.AktifPasif);

            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            var browser = Request.Headers["User-Agent"].ToString();

            if (kullanici == null)
            {
                InMemoryStore.KullaniciLoglari.Add(new KullaniciLog
                {
                    Id = InMemoryStore.NextId(InMemoryStore.KullaniciLoglari),
                    KullaniciId = 0,
                    IslemZamani = DateTime.UtcNow,
                    IpAdresi = ip,
                    BrowserBilgisi = browser,
                    BasariDurumu = false,
                    HataBilgisi = "Hatalı kullanıcı adı veya şifre"
                });

                return Unauthorized("Kullanıcı adı veya şifre hatalı!");
            }

            kullanici.SonGirisTarihi = DateTime.UtcNow;

            var rol = InMemoryStore.Roller.FirstOrDefault(r => r.Id == kullanici.RolId);
            var rolAdi = rol?.RolAdi ?? "Kullanici";

            InMemoryStore.KullaniciLoglari.Add(new KullaniciLog
            {
                Id = InMemoryStore.NextId(InMemoryStore.KullaniciLoglari),
                KullaniciId = kullanici.Id,
                IslemZamani = DateTime.UtcNow,
                IpAdresi = ip,
                BrowserBilgisi = browser,
                BasariDurumu = true,
                HataBilgisi = null
            });

            var tokenString = GenerateJwtToken(kullanici.KullaniciAdi, rolAdi);

            return Ok(new
            {
                Token = tokenString,
                Kullanici = new
                {
                    kullanici.Id,
                    kullanici.KullaniciAdi,
                    kullanici.AdSoyad,
                    Rol = rolAdi
                }
            });
        }

        private string GenerateJwtToken(string kullaniciAdi, string rol)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, kullaniciAdi),
                new Claim(ClaimTypes.Role, rol)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class KullaniciGiris
    {
        public string KullaniciAdi { get; set; } = string.Empty;
        public string Sifre { get; set; } = string.Empty;
    }
}