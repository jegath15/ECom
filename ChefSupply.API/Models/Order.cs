using System;
using System.Collections.Generic;

namespace ChefSupply.API.Models;

public partial class Order
{
    public Guid OrderId { get; set; }

    public Guid? BusinessId { get; set; }

    public string? OrderStatus { get; set; }

    public decimal? TotalAmount { get; set; }

    public string? InternalPoNumber { get; set; }

    public string? RfqNotes { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Business? Business { get; set; }

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
