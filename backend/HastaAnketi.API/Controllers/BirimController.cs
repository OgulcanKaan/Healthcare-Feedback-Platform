using HastaAnketi.API.DTOs;
using HastaAnketi.API.Extensions;
using HastaAnketi.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HastaAnketi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Yonetici")]
public class BirimController : ControllerBase
{
    private readonly IBirimService _birimService;

    public BirimController(IBirimService birimService)
    {
        _birimService = birimService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _birimService.GetAllAsync(cancellationToken);
        return this.ToActionResult(result);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var result = await _birimService.GetByIdAsync(id, cancellationToken);
        return this.ToActionResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BirimDto model, CancellationToken cancellationToken)
    {
        var result = await _birimService.CreateAsync(model, cancellationToken);
        return this.ToActionResult(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] BirimDto model, CancellationToken cancellationToken)
    {
        var result = await _birimService.UpdateAsync(id, model, cancellationToken);
        return this.ToActionResult(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var result = await _birimService.DeleteAsync(id, cancellationToken);
        return this.ToActionResult(result);
    }
}
