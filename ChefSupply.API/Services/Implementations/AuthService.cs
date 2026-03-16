using ChefSupply.API.DTOs;
using ChefSupply.API.Models;
using Microsoft.EntityFrameworkCore;
using ChefSupply.API.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ChefSupply.API.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;

    public AuthService(ApplicationDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<string> Register(RegisterDto dto)
    {
        var email = dto.Email.ToLower().Trim();
        var user = new User
        {
            UserId = Guid.NewGuid(),
            Name = dto.Name,
            Email = email,
            PasswordHash = dto.Password,
            Role = string.IsNullOrEmpty(dto.Role) ? "Buyer" : dto.Role
        };

        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (existingUser != null)
        {
            throw new Exception("Enterprise node email already registered.");
        }

        _context.Users.Add(user);

        // Create Business record
        var business = new Business
        {
            BusinessId = Guid.NewGuid(),
            UserId = user.UserId,
            BusinessName = dto.BusinessName,
            GstNumber = dto.GstNumber,
            Address = dto.Address,
            IndustryType = dto.IndustryType,
            EstimatedMonthlyVolume = dto.EstimatedMonthlyVolume,
            CreatedAt = DateTime.UtcNow
        };
        _context.Businesses.Add(business);

        // Create Wallet for the business
        var wallet = new Wallet
        {
            WalletId = Guid.NewGuid(),
            BusinessId = business.BusinessId,
            Balance = 0,
            CreatedAt = DateTime.UtcNow
        };
        _context.Wallets.Add(wallet);

        await _context.SaveChangesAsync();
        return GenerateToken(user);
    }

    public async Task<string> Login(LoginDto dto)
    {
        var email = dto.Email.ToLower().Trim();
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email && u.PasswordHash == dto.Password);

        if (user == null)
            throw new Exception("Authentication failed: Invalid node credentials.");

        return GenerateToken(user);
    }

    private string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim("nameid", user.UserId.ToString()),
            new Claim("unique_name", user.Name ?? ""),
            new Claim("email", user.Email),
            new Claim("role", user.Role ?? "Buyer")
        };

        var jwtKey = _config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key configuration is missing");
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(3),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<object> GetDbStatus()
    {
        return new
        {
            UserCount = await _context.Users.CountAsync(),
            BusinessCount = await _context.Businesses.CountAsync(),
            WalletCount = await _context.Wallets.CountAsync(),
            Connection = _context.Database.GetDbConnection().ConnectionString.Length > 0 ? "Connected" : "Disconnected",
            Timestamp = DateTime.UtcNow
        };
    }
}