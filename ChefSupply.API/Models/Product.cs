using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChefSupply.API.Models
{
    [Table("products")]
    public class Product
    {
        [Key]
        [Column("product_id")]
        public Guid ProductId { get; set; } = Guid.NewGuid();

        [Column("supplier_id")]
        public Guid? SupplierId { get; set; }

        [Column("category_id")]
        public int? CategoryId { get; set; }

        [Column("product_name")]
        public string? ProductName { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("unit")]
        public string? Unit { get; set; }

        [Column("moq")]
        public int? MOQ { get; set; }

        [Column("base_price")]
        public decimal? BasePrice { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    }
}