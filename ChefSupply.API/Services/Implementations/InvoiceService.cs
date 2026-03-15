using ChefSupply.API.Models;
using ChefSupply.API.DTOs;
using ChefSupply.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChefSupply.API.Services.Implementations;

public class InvoiceService : IInvoiceService
{
    private readonly ApplicationDbContext _context;
    private readonly IWalletService _walletService;

    public InvoiceService(ApplicationDbContext context, IWalletService walletService)
    {
        _context = context;
        _walletService = walletService;
    }

    public async Task<InvoiceResponseDto> CreateInvoice(Guid orderId)
{
    var order = await _context.Orders
        .FirstOrDefaultAsync(o => o.OrderId == orderId);

    if (order == null)
        throw new Exception("Order not found");

    var invoice = new Invoice
    {
        InvoiceId = Guid.NewGuid(),
        OrderId = orderId,
        TotalAmount = order.TotalAmount ?? 0,
        InvoiceDate = DateTime.UtcNow,
        Status = "unpaid"
    };

    _context.Invoices.Add(invoice);
    await _context.SaveChangesAsync();

    return new InvoiceResponseDto
    {
        InvoiceId = invoice.InvoiceId,
        OrderId = invoice.OrderId,
        Amount = invoice.TotalAmount,
        Status = invoice.Status,
        CreatedAt = invoice.InvoiceDate
    };
}

    public async Task<List<InvoiceResponseDto>> GetInvoices()
    {
        return await _context.Invoices
            .Select(i => new InvoiceResponseDto
            {
                InvoiceId = i.InvoiceId,
                OrderId = i.OrderId,
                Amount = i.TotalAmount,
                Status = i.Status,
                CreatedAt = i.InvoiceDate
            })
            .ToListAsync();
    }

    public async Task<List<InvoiceResponseDto>> GetInvoicesByBusinessId(Guid businessId)
    {
        var orders = await _context.Orders
            .Where(o => o.BusinessId == businessId)
            .Select(o => o.OrderId)
            .ToListAsync();

        return await _context.Invoices
            .Where(i => orders.Contains(i.OrderId))
            .Select(i => new InvoiceResponseDto
            {
                InvoiceId = i.InvoiceId,
                OrderId = i.OrderId,
                Amount = i.TotalAmount,
                Status = i.Status,
                CreatedAt = i.InvoiceDate
            })
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();
    }

    public async Task<InvoiceResponseDto> PayInvoice(Guid invoiceId, Guid businessId)
    {
        var invoice = await _context.Invoices.FindAsync(invoiceId);
        if (invoice == null) throw new Exception("Invoice not found");
        if (invoice.Status == "paid") throw new Exception("Invoice already paid");

        // Deduct from wallet
        await _walletService.DeductMoney(businessId, invoice.TotalAmount);

        // Update invoice
        invoice.Status = "paid";
        await _context.SaveChangesAsync();

        return new InvoiceResponseDto
        {
            InvoiceId = invoice.InvoiceId,
            OrderId = invoice.OrderId,
            Amount = invoice.TotalAmount,
            Status = invoice.Status,
            CreatedAt = invoice.InvoiceDate
        };
    }
}