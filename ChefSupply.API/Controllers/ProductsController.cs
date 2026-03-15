using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChefSupply.API.Models;

namespace ChefSupply.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET all products with Inventory and PricingTiers
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            var inventories = await _context.Inventories.ToListAsync();
            var pricingTiers = await _context.PricingTiers.ToListAsync();
            var categories = await _context.Categories.ToListAsync();
            
            var enrichedProducts = products.Select(p => new {
                p.ProductId,
                p.ProductName,
                p.Description,
                p.Unit,
                p.BasePrice,
                p.CategoryId,
                CategoryName = categories.FirstOrDefault(c => c.CategoryId == p.CategoryId)?.CategoryName,
                p.SupplierId,
                AvailableQuantity = inventories.FirstOrDefault(i => i.ProductId == p.ProductId)?.AvailableQuantity ?? 0,
                PricingTiers = pricingTiers.Where(pt => pt.ProductId == p.ProductId).Select(pt => new { pt.MinQuantity, pt.Price }).ToList()
            });

            return Ok(enrichedProducts);
        }

        // GET all categories
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(categories);
        }

        // POST create product
        [HttpPost]
        public IActionResult CreateProduct(Product product)
        {
            product.ProductId = Guid.NewGuid();

            _context.Products.Add(product);
            _context.SaveChanges();

            return Ok(product);
        }
    }
}