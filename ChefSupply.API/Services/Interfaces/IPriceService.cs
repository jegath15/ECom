using ChefSupply.API.Models;

namespace ChefSupply.API.Services.Interfaces
{
    public interface IPriceService
    {
        Task<List<ProductTierPrice>> GetTierPrices(Guid productId);
    }
}