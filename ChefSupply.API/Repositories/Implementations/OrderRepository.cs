using ChefSupply.API.Models;
using ChefSupply.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChefSupply.API.Repositories.Implementations;

public class OrderRepository : IOrderRepository
{
    private readonly ApplicationDbContext _context;

    public OrderRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Order> CreateOrder(Order order)
    {
        _context.Orders.Add(order);

        await _context.SaveChangesAsync();

        return order;
    }
    public async Task<List<Order>> GetOrdersByBusiness(Guid businessId)
{
    return await _context.Orders
        .Where(o => o.BusinessId == businessId)
        .Include(o => o.OrderItems)
        .ToListAsync();
}
}