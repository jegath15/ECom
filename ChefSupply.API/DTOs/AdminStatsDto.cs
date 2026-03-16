using System;

namespace ChefSupply.API.DTOs;

public class AdminStatsDto
{
    public decimal TotalSales { get; set; }
    public int ActiveUsers { get; set; }
    public int TotalBusinesses { get; set; }
    public int PendingOrders { get; set; }
    public int TotalProducts { get; set; }
    public int LowStockAlerts { get; set; }
}

public class AdminBusinessDto
{
    public Guid BusinessId { get; set; }
    public string BusinessName { get; set; } = null!;
    public string? GstNumber { get; set; }
    public string? IndustryType { get; set; }
    public string? OwnerName { get; set; }
    public string? OwnerEmail { get; set; }
    public string CreditStatus { get; set; } = null!;
    public DateTime? CreatedAt { get; set; }
}

public class AdminProductDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = null!;
    public string? CategoryName { get; set; }
    public decimal? BasePrice { get; set; }
    public int StockLevel { get; set; }
}
