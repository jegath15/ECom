using ChefSupply.API.Models;

namespace ChefSupply.API.Services.Interfaces
{
    public interface IProductService
    {
        Task<List<Product>> GetProducts();
    }
}