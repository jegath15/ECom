using ChefSupply.API.DTOs;

namespace ChefSupply.API.Services.Interfaces;

public interface IAuthService
{
    Task<string> Register(RegisterDto dto);
    Task<string> Login(LoginDto dto);
    Task<object> GetDbStatus();
}