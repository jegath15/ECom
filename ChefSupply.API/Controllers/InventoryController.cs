using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChefSupply.API.Models;

namespace ChefSupply.API.Controllers
{
    [ApiController]
    [Route("api/inventory")]
    public class InventoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InventoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllInventory()
        {
            var inventory = await _context.Inventories
                .Include(i => i.Product)
                .Select(i => new {
                    i.InventoryId,
                    i.ProductId,
                    ProductName = i.Product.ProductName,
                    i.AvailableQuantity,
                    i.UpdatedAt
                })
                .ToListAsync();

            return Ok(inventory);
        }
    }
}
