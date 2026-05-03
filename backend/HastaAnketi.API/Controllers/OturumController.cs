using HastaAnketi.API.DTOs;
using HastaAnketi.API.Extensions;
using HastaAnketi.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HastaAnketi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OturumController : ControllerBase
{
    private readonly IOturumService _oturumService;

    public OturumController(IOturumService oturumService)
    {
        _oturumService = oturumService;
    }

    [HttpPost("baslat")]
    public async Task<IActionResult> Baslat([FromBody] SessionStartRequestDto req, CancellationToken cancellationToken)
    {
        var result = await _oturumService.BaslatAsync(req, cancellationToken);
        return this.ToActionResult(result);
    }

    [HttpPost("{oturumId:int}/cevapla")]
    public async Task<IActionResult> Cevapla(int oturumId, [FromBody] AnketCevaplaRequestDto req, CancellationToken cancellationToken)
    {
        var result = await _oturumService.CevaplaAsync(oturumId, req, cancellationToken);
        return this.ToActionResult(result);
    }

    [HttpGet("{oturumId:int}/sonuc")]
    public async Task<IActionResult> Sonuc(int oturumId, CancellationToken cancellationToken)
    {
        var result = await _oturumService.SonucAsync(oturumId, cancellationToken);
        return this.ToActionResult(result);
    }
}
