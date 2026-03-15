using Microsoft.AspNetCore.Mvc;
using ChefSupply.API.Services.Interfaces;

namespace ChefSupply.API.Controllers;

[ApiController]
[Route("api/invoices")]
public class InvoiceController : ControllerBase
{
    private readonly IInvoiceService _service;

    public InvoiceController(IInvoiceService service)
    {
        _service = service;
    }

    [HttpPost("{orderId}")]
    public async Task<IActionResult> CreateInvoice(Guid orderId)
    {
        var invoice = await _service.CreateInvoice(orderId);

        return Ok(invoice);
    }

    [HttpGet]
    public async Task<IActionResult> GetInvoices()
    {
        var invoices = await _service.GetInvoices();

        return Ok(invoices);
    }

    [HttpGet("business/{businessId}")]
    public async Task<IActionResult> GetInvoicesByBusiness(Guid businessId)
    {
        var invoices = await _service.GetInvoicesByBusinessId(businessId);
        return Ok(invoices);
    }

    [HttpPost("{invoiceId}/pay/{businessId}")]
    public async Task<IActionResult> PayInvoice(Guid invoiceId, Guid businessId)
    {
        try
        {
            var invoice = await _service.PayInvoice(invoiceId, businessId);
            return Ok(invoice);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}