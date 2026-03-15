using ChefSupply.API.Models;

namespace ChefSupply.API.Repositories.Interfaces
{
    public interface IPriceRepository
    {
        Task<List<ProductTierPrice>> GetTierPrices(Guid productId);
    }
}