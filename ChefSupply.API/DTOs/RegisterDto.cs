namespace ChefSupply.API.DTOs;

public class RegisterDto
{
    public required string Name { get; set; }

    public required string Email { get; set; }

    public required string Password { get; set; }

    public string Role { get; set; } = "buyer";

    public required string BusinessName { get; set; }

    public string? GstNumber { get; set; }

    public string? Address { get; set; }

    public string? IndustryType { get; set; }

    public decimal? EstimatedMonthlyVolume { get; set; }
}