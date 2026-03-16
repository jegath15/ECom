using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChefSupply.API.Models;

namespace ChefSupply.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BusinessController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BusinessController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET business profile by Auth user id (Mock User ID mapped to a Business)
        // Note: For simplicity, checking if Business logic maps to User ID
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetBusinessProfile(Guid userId)
        {
            var business = await _context.Businesses.FirstOrDefaultAsync(b => b.UserId == userId);
            
            if (business == null) return NotFound("No commercial business profile found for this user.");
            
            return Ok(business);
            
            return Ok(business);
        }

        // PUT update business profile
        [HttpPut("{businessId}")]
        public async Task<IActionResult> UpdateBusinessProfile(Guid businessId, [FromBody] Business updateModel)
        {
            var business = await _context.Businesses.FirstOrDefaultAsync(b => b.BusinessId == businessId);
            if(business == null) return NotFound();

            business.BusinessName = updateModel.BusinessName;
            business.GstNumber = updateModel.GstNumber;
            business.Address = updateModel.Address;
            business.City = updateModel.City;
            business.State = updateModel.State;

            _context.Businesses.Update(business);
            await _context.SaveChangesAsync();

            return Ok(business);
        }
    }
}
