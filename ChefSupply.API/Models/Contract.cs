using System;
using System.Collections.Generic;

namespace ChefSupply.API.Models;

public partial class Contract
{
    public Guid ContractId { get; set; }

    public Guid? BusinessId { get; set; }

    public Guid? SupplierId { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string? ContractStatus { get; set; }

    public virtual Business? Business { get; set; }

}
