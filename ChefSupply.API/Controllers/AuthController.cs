using ChefSupply.API.DTOs;
using ChefSupply.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ChefSupply.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _service;

    public AuthController(IAuthService service)
    {
        _service = service;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var token = await _service.Register(dto);
        return Ok(new { token });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var token = await _service.Login(dto);
        return Ok(new { token });
    }

    [HttpGet("db-status")]
    public async Task<IActionResult> GetDbStatus()
    {
        var status = await _service.GetDbStatus();
        return Ok(status);
    }
}