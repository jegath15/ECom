using Microsoft.AspNetCore.Mvc;
using ChefSupply.API.Models;

namespace ChefSupply.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PricingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PricingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET pricing tiers
        [HttpGet]
        public IActionResult GetPricing()
        {
            return Ok(_context.ProductTierPrices.ToList());
        }

        // POST add pricing tier
        [HttpPost]
        public IActionResult AddPricing(ProductTierPrice pricing)
        {
            pricing.TierPriceId = Guid.NewGuid();

            _context.ProductTierPrices.Add(pricing);
            _context.SaveChanges();

            return Ok(pricing);
        }
    }
}