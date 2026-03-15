using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChefSupply.API.Models
{
    public class PricingTier
    {
        [Key]
        public Guid PricingTierId { get; set; }

        public Guid ProductId { get; set; }

        public int MinQuantity { get; set; }

        public decimal Price { get; set; }
    }
}