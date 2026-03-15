using ChefSupply.API.Models;
using ChefSupply.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost("reset-data")]
        public async Task<IActionResult> ResetData()
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
