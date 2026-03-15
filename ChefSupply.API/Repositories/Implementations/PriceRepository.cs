using ChefSupply.API.Models;
using ChefSupply.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChefSupply.API.Repositories.Implementations
{
    public class PriceRepository : IPriceRepository
    {
        private readonly ApplicationDbContext _context;

        public PriceRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductTierPrice>> GetTierPrices(Guid productId)
        {
            return await _context.ProductTierPrices
                .Where(p => p.ProductId == productId)
                .ToListAsync();
        }
    }
}