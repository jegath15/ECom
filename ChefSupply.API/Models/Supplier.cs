using System;
using System.Collections.Generic;

namespace ChefSupply.API.Models;

public partial class Supplier
{
    public Guid SupplierId { get; set; }

    public string SupplierName { get; set; } = null!;

    public string? ContactPerson { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? Location { get; set; }

    public virtual ICollection<Contract> Contracts { get; set; } = new List<Contract>();

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
