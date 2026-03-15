namespace ChefSupply.API.DTOs;

public class AddMoneyDto
{
    public Guid BusinessId { get; set; }

    public decimal Amount { get; set; }
}