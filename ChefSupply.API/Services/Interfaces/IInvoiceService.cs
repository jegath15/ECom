using ChefSupply.API.DTOs;

namespace ChefSupply.API.Services.Interfaces;

public interface IInvoiceService
{
    Task<InvoiceResponseDto> CreateInvoice(Guid orderId);

    Task<List<InvoiceResponseDto>> GetInvoices();

    Task<List<InvoiceResponseDto>> GetInvoicesByBusinessId(Guid businessId);

    Task<InvoiceResponseDto> PayInvoice(Guid invoiceId, Guid businessId);
}