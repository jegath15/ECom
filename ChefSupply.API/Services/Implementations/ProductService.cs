using ChefSupply.API.Models;
using ChefSupply.API.Repositories.Interfaces;
using ChefSupply.API.Services.Interfaces;

namespace ChefSupply.API.Services.Implementations
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;

        public ProductService(IProductRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Product>> GetProducts()
        {
            return await _repository.GetAllProducts();
        }
    }
}