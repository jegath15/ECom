using System;
using System.Collections.Generic;

namespace ChefSupply.API.Models;

public partial class Inventory
{
    public int InventoryId { get; set; }

    public Guid? ProductId { get; set; }

    public int? AvailableQuantity { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Product? Product { get; set; }
}
