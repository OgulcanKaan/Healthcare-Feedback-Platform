using HastaAnketi.API.Extensions;
using HastaAnketi.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HastaAnketi.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Yonetici")]
public class RaporController : ControllerBase
{
    private readonly IRaporService _raporService;

    public RaporController(IRaporService raporService)
    {
        _raporService = raporService;
    }

    [HttpGet("DashboardOzet")]
    public async Task<IActionResult> GetDashboardOzet([FromQuery] DateTime? baslangicTarihi, [FromQuery] DateTime? bitisTarihi, CancellationToken cancellationToken)
    {
        var result = await _raporService.GetDashboardOzetiAsync(baslangicTarihi, bitisTarihi, cancellationToken);
        return this.ToActionResult(result);
    }

    [HttpGet("BirimBazli")]
    public async Task<IActionResult> GetBirimBazli([FromQuery] DateTime? baslangicTarihi, [FromQuery] DateTime? bitisTarihi, CancellationToken cancellationToken)
    {
        var result = await _raporService.GetBirimBazliRaporAsync(baslangicTarihi, bitisTarihi, cancellationToken);
        return this.ToActionResult(result);
    }

    [HttpGet("Sikayetler")]
    public async Task<IActionResult> GetSikayetler(CancellationToken cancellationToken)
    {
        var result = await _raporService.GetSikayetlerAsync(cancellationToken);
        return this.ToActionResult(result);
    }
}
