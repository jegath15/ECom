using System;
using System.ComponentModel.DataAnnotations;

namespace ChefSupply.API.Models
{
    public class ProductTierPrice
    {
        [Key]
        public Guid TierPriceId { get; set; }

        public Guid ProductId { get; set; }

        public int MinQuantity { get; set; }

        public decimal Price { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}