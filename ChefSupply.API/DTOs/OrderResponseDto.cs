namespace ChefSupply.API.DTOs;

public class OrderResponseDto
{
    public Guid OrderId { get; set; }

    public Guid BusinessId { get; set; }

    public string? OrderStatus { get; set; }

    public decimal? TotalAmount { get; set; }

    public string? InternalPoNumber { get; set; }
    public string? RfqNotes { get; set; }
    public DateTime? CreatedAt { get; set; }

    public List<OrderItemResponseDto> Items { get; set; } = new();
}