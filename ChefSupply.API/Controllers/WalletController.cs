using ChefSupply.API.DTOs;
using ChefSupply.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ChefSupply.API.Controllers;

[ApiController]
[Route("api/wallet")]
public class WalletController : ControllerBase
{
    private readonly IWalletService _service;

    public WalletController(IWalletService service)
    {
        _service = service;
    }

    [HttpPost("add-money")]
    public async Task<IActionResult> AddMoney(AddMoneyDto dto)
    {
        var balance = await _service.AddMoney(dto);

        return Ok(new { balance });
    }

    [HttpGet("{businessId}")]
    public async Task<IActionResult> GetBalance(Guid businessId)
    {
        var balance = await _service.GetBalance(businessId);

        return Ok(new { balance });
    }

    [HttpGet("{businessId}/transactions")]
    public async Task<IActionResult> GetTransactions(Guid businessId)
    {
        var transactions = await _service.GetTransactions(businessId);
        return Ok(transactions);
    }
}