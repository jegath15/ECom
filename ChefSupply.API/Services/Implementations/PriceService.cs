using ChefSupply.API.Models;
using ChefSupply.API.Repositories.Interfaces;
using ChefSupply.API.Services.Interfaces;

namespace ChefSupply.API.Services.Implementations
{
    public class PriceService : IPriceService
    {
        private readonly IPriceRepository _repo;

        public PriceService(IPriceRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<ProductTierPrice>> GetTierPrices(Guid productId)
        {
            return await _repo.GetTierPrices(productId);
        }
    }
}