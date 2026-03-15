using System;
using System.Linq;
using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChefSupply.API.Models;

namespace ChefSupply.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SuppliersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SuppliersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET all suppliers
        [HttpGet]
        public async Task<IActionResult> GetSuppliers()
        {
            var suppliers = await _context.Suppliers.ToListAsync();
            return Ok(suppliers);
        }

        // GET suppliers and their active contracts
        [HttpGet("contracts")]
        public async Task<IActionResult> GetSupplierContracts()
        {
            var contracts = await _context.Contracts.ToListAsync();
            var suppliers = await _context.Suppliers.ToListAsync();
            
            var suppliersWithContracts = suppliers.Select(s => new {
                s.SupplierId,
                s.SupplierName,
                s.ContactPerson,
                s.Phone,
                s.Email,
                s.Location,
                Contracts = contracts.Where(c => c.SupplierId == s.SupplierId).ToList()
            });

            return Ok(suppliersWithContracts);
        }
    }
}
