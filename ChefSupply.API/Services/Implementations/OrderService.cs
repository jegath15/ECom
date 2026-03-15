using ChefSupply.API.Services.Interfaces;
using ChefSupply.API.Repositories.Interfaces;
using ChefSupply.API.Models;
using ChefSupply.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ChefSupply.API.Services.Implementations;

public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _context;
    private readonly IOrderRepository _repo;
    private readonly IInvoiceService _invoiceService;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _config;

    public OrderService(ApplicationDbContext context, IOrderRepository repo, IInvoiceService invoiceService, IEmailService emailService, IConfiguration config)
    {
        _context = context;
        _repo = repo;
        _invoiceService = invoiceService;
        _emailService = emailService;
        _config = config;
    }

    public async Task<List<OrderResponseDto>> GetOrdersByBusiness(Guid businessId)
{
    var orders = await _context.Orders
        .Where(o => o.BusinessId == businessId)
        .Include(o => o.OrderItems)
        .Select(o => new OrderResponseDto
        {
            OrderId = o.OrderId,
            BusinessId = o.BusinessId ?? Guid.Empty,
            OrderStatus = o.OrderStatus,
            TotalAmount = o.TotalAmount,
            InternalPoNumber = o.InternalPoNumber,
            CreatedAt = o.CreatedAt,

            Items = o.OrderItems.Select(i => new OrderItemResponseDto
            {
                ProductId = i.ProductId ?? Guid.Empty,
                Quantity = i.Quantity ?? 0,
                Price = i.Price ?? 0,
                BidPrice = i.BidPrice,
                Subtotal = i.Subtotal ?? 0
            }).ToList()
        })
        .ToListAsync();

    return orders;
}

    public async Task<Order> CreateOrder(CreateOrderDto dto)
    {
        var order = new Order
        {
            OrderId = Guid.NewGuid(),
            BusinessId = dto.BusinessId,
            CreatedAt = DateTime.UtcNow,
            OrderStatus = dto.OrderStatus ?? (dto.IsQuotation ? "Quotation" : "Pending"),
            InternalPoNumber = dto.InternalPoNumber,
            RfqNotes = dto.RfqNotes
        };

        order.OrderItems = new List<OrderItem>();

        foreach (var item in dto.Items)
        {
            var product = await _context.Products.FindAsync(item.ProductId);
            if (product == null)
            {
                throw new Exception($"Product with ID {item.ProductId} not found.");
            }

            var priceTier = await _context.PricingTiers
                .Where(p => p.ProductId == item.ProductId && p.MinQuantity <= item.Quantity)
                .OrderByDescending(p => p.MinQuantity)
                .FirstOrDefaultAsync();
            
            decimal calculatedPrice = priceTier?.Price ?? product.BasePrice ?? 0;

            var orderItem = new OrderItem
            {
                OrderId = order.OrderId,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                Price = calculatedPrice,
                BidPrice = item.BidPrice,
                Subtotal = (item.BidPrice ?? calculatedPrice) * item.Quantity
            };
            order.OrderItems.Add(orderItem);
        }

        order.TotalAmount = order.OrderItems.Sum(i => i.Subtotal);

        var savedOrder = await _repo.CreateOrder(order);

        if (!dto.IsQuotation)
        {
            await _invoiceService.CreateInvoice(savedOrder.OrderId);
            await SendAdminOrderNotification(savedOrder, "New Order Placed");
        }
        else
        {
            await SendAdminOrderNotification(savedOrder, "New RFQ/Quotation Received");
        }

        return savedOrder;
    }

    private async Task SendAdminOrderNotification(Order order, string title)
    {
        var adminEmail = _config["Email:AdminEmail"] ?? "admin@chefsupply.com";
        var business = await _context.Businesses.FindAsync(order.BusinessId);
        var businessName = business?.BusinessName ?? "Unknown Business";

        string body = $@"
            <h2>{title}</h2>
            <p><strong>Order ID:</strong> {order.OrderId}</p>
            <p><strong>Business:</strong> {businessName}</p>
            <p><strong>Total Amount:</strong> ₹{order.TotalAmount:N2}</p>
            <p><strong>Status:</strong> {order.OrderStatus}</p>
            <p><strong>Date:</strong> {order.CreatedAt:f}</p>
            <hr/>
            <p>Please login to the Admin Console to review the details.</p>";

        await _emailService.SendEmailAsync(adminEmail, $"ChefSupply Alert: {title} - {businessName}", body);
    }

    public async Task<Order> ConvertQuotationToOrder(Guid orderId)
    {
        var order = await _context.Orders.FindAsync(orderId);
        if (order == null || order.OrderStatus != "Quotation")
            throw new Exception("Quotation not found or invalid status.");

        order.OrderStatus = "Pending";
        await _context.SaveChangesAsync();

        await _invoiceService.CreateInvoice(orderId);
        await SendAdminOrderNotification(order, "Quotation Converted to Order");

        return order;
    }
}