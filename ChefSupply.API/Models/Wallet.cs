using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChefSupply.API.Models
{
    [Table("wallet")]
    public class Wallet
    {
        [Key]
        [Column("wallet_id")]
        public Guid WalletId { get; set; }

        [Column("business_id")]
        public Guid BusinessId { get; set; }

        [Column("balance")]
        public decimal Balance { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}