
using ChefSupply.API.Models;
using ChefSupply.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChefSupply.API.Repositories.Implementations
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetAllProducts()
        {
            return await _context.Products.ToListAsync();
        }
    }
}