using System;
using System.Collections.Generic;

namespace ChefSupply.API.Models;

public partial class Business
{
    public Guid BusinessId { get; set; }

    public Guid? UserId { get; set; }

    public string BusinessName { get; set; } = null!;

    public string? GstNumber { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public string? IndustryType { get; set; }

    public decimal? EstimatedMonthlyVolume { get; set; }

    public string? KycDocumentUrl { get; set; }

    public string CreditStatus { get; set; } = "Pending Verification";

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Contract> Contracts { get; set; } = new List<Contract>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual User? User { get; set; }

    public virtual ICollection<Wallet> Wallets { get; set; } = new List<Wallet>();
}
