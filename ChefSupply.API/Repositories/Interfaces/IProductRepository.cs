using ChefSupply.API.Models;

namespace ChefSupply.API.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllProducts();
    }
}