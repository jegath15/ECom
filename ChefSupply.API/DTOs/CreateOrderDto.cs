namespace ChefSupply.API.DTOs;

public class CreateOrderDto
{
    public Guid BusinessId { get; set; }
    public bool IsQuotation { get; set; } = false;
    public string? OrderStatus { get; set; }
    public string? InternalPoNumber { get; set; }
    public string? RfqNotes { get; set; }
    public List<CreateOrderItemDto> Items { get; set; } = new();
}
