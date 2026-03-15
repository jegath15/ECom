namespace ChefSupply.API.DTOs;

public class InvoiceResponseDto
{
    public Guid InvoiceId { get; set; }

    public Guid OrderId { get; set; }

    public decimal Amount { get; set; }

    public string Status { get; set; } = "";

    public DateTime CreatedAt { get; set; }
}