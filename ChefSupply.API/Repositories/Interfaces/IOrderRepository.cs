using ChefSupply.API.Models;

namespace ChefSupply.API.Repositories.Interfaces;

public interface IOrderRepository
{
    Task<Order> CreateOrder(Order order);

    Task<List<Order>> GetOrdersByBusiness(Guid businessId);
}