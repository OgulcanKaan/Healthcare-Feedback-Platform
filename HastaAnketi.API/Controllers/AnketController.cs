using HastaAnketi.API.DTOs;
using HastaAnketi.API.Extensions;
using HastaAnketi.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HastaAnketi.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class AnketController : ControllerBase
{
    private readonly IAnketService _anketService;

    public AnketController(IAnketService anketService)
    {
        _anketService = anketService;
    }

    [HttpGet]
    public async Task<IActionResult> GetirTumAnketler(CancellationToken cancellationToken)
    {
        var result = await _anketService.GetirTumAnketlerAsync(cancellationToken);
        return this.ToActionResult(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var result = await _anketService.GetByIdAsync(id, cancellationToken);
        return this.ToActionResult(result);
    }

    [HttpGet("{id:int}/detay")]
    [AllowAnonymous]
    public async Task<IActionResult> GetDetayById(int id, CancellationToken cancellationToken)
    {
        var result = await _anketService.GetDetayByIdAsync(id, cancellationToken);
        return this.ToActionResult(result);
    }

    [HttpPost]
    [Authorize(Roles = "Yonetici")]
    public async Task<IActionResult> YeniAnketEkle([FromBody] AnketDto model, CancellationToken cancellationToken)
    {
        var result = await _anketService.YeniAnketEkleAsync(model, cancellationToken);
        return this.ToActionResult(result);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Yonetici")]
    public async Task<IActionResult> Update(int id, [FromBody] AnketDto model, CancellationToken cancellationToken)
    {
        var result = await _anketService.UpdateAsync(id, model, cancellationToken);
        return this.ToActionResult(result);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Yonetici")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var result = await _anketService.DeleteAsync(id, cancellationToken);
        return this.ToActionResult(result);
    }

    [HttpPost("Cevapla")]
    [AllowAnonymous]
    public async Task<IActionResult> Cevapla([FromBody] AnketCevaplaRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _anketService.CevaplaAsync(request, cancellationToken);
        return this.ToActionResult(result);
    }
}
