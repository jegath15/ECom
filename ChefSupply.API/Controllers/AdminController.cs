using ChefSupply.API.Models;
using ChefSupply.API.Data;
using ChefSupply.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChefSupply.API.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var stats = new AdminStatsDto
            {
                TotalSales = await _context.Orders.Where(o => o.OrderStatus != "Quotation").SumAsync(o => o.TotalAmount ?? 0),
                ActiveUsers = await _context.Users.CountAsync(),
                TotalBusinesses = await _context.Businesses.CountAsync(),
                PendingOrders = await _context.Orders.CountAsync(o => o.OrderStatus == "Pending"),
                TotalProducts = await _context.Products.CountAsync(),
                LowStockAlerts = await _context.Inventories.CountAsync(i => i.AvailableQuantity < 50)
            };
            return Ok(stats);
        }

        [HttpGet("businesses")]
        public async Task<IActionResult> GetBusinesses()
        {
            var businesses = await _context.Businesses
                .Include(b => b.User)
                .Select(b => new AdminBusinessDto
                {
                    BusinessId = b.BusinessId,
                    BusinessName = b.BusinessName,
                    GstNumber = b.GstNumber,
                    IndustryType = b.IndustryType,
                    OwnerName = b.User != null ? b.User.Name : "N/A",
                    OwnerEmail = b.User != null ? b.User.Email : "N/A",
                    CreditStatus = b.CreditStatus,
                    CreatedAt = b.CreatedAt
                })
                .ToListAsync();
            return Ok(businesses);
        }

        [HttpGet("products")]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Inventories)
                .Select(p => new AdminProductDto
                {
                    ProductId = p.ProductId,
                    ProductName = p.ProductName,
                    CategoryName = p.Category != null ? p.Category.CategoryName : "N/A",
                    BasePrice = p.BasePrice,
                    StockLevel = p.Inventories.Sum(i => i.AvailableQuantity ?? 0)
                })
                .ToListAsync();
            return Ok(products);
        }

        [HttpPost("reset-data")]
        public IActionResult ResetData()
        {
            try 
            {
                DbInitializer.Initialize(_context, force: true);
                return Ok(new { message = "Database has been successfully re-seeded with B2B Enterprise nodes." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("status")]
        public IActionResult GetStatus()
        {
            return Ok(new { 
                status = "Authorized", 
                instance = Environment.MachineName,
                timestamp = DateTime.UtcNow 
            });
        }
    }
}
