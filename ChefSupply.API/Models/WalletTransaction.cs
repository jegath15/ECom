using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChefSupply.API.Models
{
    [Table("wallet_transactions")]
    public class WalletTransaction
    {
        [Key]
        [Column("transaction_id")]
        public Guid TransactionId { get; set; }

        [Column("wallet_id")]
        public Guid WalletId { get; set; }

        [Column("amount")]
        public decimal Amount { get; set; }

        [Column("type")]
        public string? Type { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}