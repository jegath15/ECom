using ChefSupply.API.DTOs;
using ChefSupply.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ChefSupply.API.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _service;

    public OrdersController(IOrderService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder(CreateOrderDto dto)
{
    try
    {
        var order = await _service.CreateOrder(dto);
        return Ok(order);
    }
    catch (Exception ex)
    {
        return BadRequest(new { message = ex.Message });
    }
}

    [HttpGet("business/{businessId}")]
    public async Task<IActionResult> GetOrdersByBusiness(Guid businessId)
    {
        var orders = await _service.GetOrdersByBusiness(businessId);
        return Ok(orders);
    }

    [HttpPatch("{orderId}/convert")]
    public async Task<IActionResult> ConvertQuotation(Guid orderId)
    {
        try
        {
            var order = await _service.ConvertQuotationToOrder(orderId);
            return Ok(order);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}