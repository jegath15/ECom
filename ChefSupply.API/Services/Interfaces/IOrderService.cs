using ChefSupply.API.DTOs;
using ChefSupply.API.Models;

namespace ChefSupply.API.Services.Interfaces;

public interface IOrderService
{
    Task<Order> CreateOrder(CreateOrderDto dto);

    Task<List<OrderResponseDto>> GetOrdersByBusiness(Guid businessId);

    Task<Order> ConvertQuotationToOrder(Guid orderId);
    Task<List<OrderResponseDto>> GetAllOrders();
    Task<Order> UpdateOrderStatus(Guid orderId, string status);
}