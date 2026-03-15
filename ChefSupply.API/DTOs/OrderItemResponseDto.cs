namespace ChefSupply.API.DTOs;

public class OrderItemResponseDto
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal? BidPrice { get; set; }
    public decimal Subtotal { get; set; }
}