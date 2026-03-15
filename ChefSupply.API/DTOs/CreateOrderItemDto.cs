namespace ChefSupply.API.DTOs;

public class CreateOrderItemDto
{
    public Guid ProductId { get; set; }

    public int Quantity { get; set; }
    public decimal? BidPrice { get; set; }
}