namespace ChefSupply.API.Models
{
    public class Invoice
    {
        public Guid InvoiceId { get; set; }

        public Guid OrderId { get; set; }

        public decimal TotalAmount { get; set; }

        public string? Status { get; set; }

        public DateTime InvoiceDate { get; set; }
    }
}