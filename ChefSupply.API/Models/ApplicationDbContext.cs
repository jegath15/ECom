using Microsoft.EntityFrameworkCore;

namespace ChefSupply.API.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Invoice> Invoices { get; set; }

        public DbSet<Product> Products { get; set; }
        public DbSet<ProductTierPrice> ProductTierPrices { get; set; }

        public DbSet<Wallet> Wallets { get; set; }
        public DbSet<WalletTransaction> WalletTransactions { get; set; }

        public DbSet<Business> Businesses { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Contract> Contracts { get; set; }
        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<PricingTier> PricingTiers { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // USERS
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
                entity.Property(e => e.Role).HasColumnName("role");
            });

            // PRODUCTS
            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("products");

                entity.Property(e => e.ProductId).HasColumnName("product_id");
                entity.Property(e => e.SupplierId).HasColumnName("supplier_id");
                entity.Property(e => e.CategoryId).HasColumnName("category_id");
                entity.Property(e => e.ProductName).HasColumnName("product_name");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.Unit).HasColumnName("unit");
                entity.Property(e => e.BasePrice).HasColumnName("base_price");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            });

            // PRODUCT TIER PRICING
            modelBuilder.Entity<ProductTierPrice>(entity =>
            {
                entity.ToTable("product_tier_prices");

                entity.Property(e => e.TierPriceId).HasColumnName("tier_price_id");
                entity.Property(e => e.ProductId).HasColumnName("product_id");
                entity.Property(e => e.MinQuantity).HasColumnName("min_quantity");
                entity.Property(e => e.Price).HasColumnName("price");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            });

            // ORDERS
            modelBuilder.Entity<Order>(entity =>
            {
                entity.ToTable("orders");

                entity.Property(e => e.OrderId).HasColumnName("order_id");
                entity.Property(e => e.BusinessId).HasColumnName("business_id");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.TotalAmount).HasColumnName("total_amount");
                entity.Property(e => e.OrderStatus).HasColumnName("order_status");
                entity.Property(e => e.InternalPoNumber).HasColumnName("internal_po_number");
                entity.Property(e => e.RfqNotes).HasColumnName("rfq_notes");
            });

            // ORDER ITEMS
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.ToTable("order_items");

                entity.Property(e => e.OrderItemId).HasColumnName("order_item_id");
                entity.Property(e => e.OrderId).HasColumnName("order_id");
                entity.Property(e => e.ProductId).HasColumnName("product_id");
                entity.Property(e => e.Quantity).HasColumnName("quantity");
                entity.Property(e => e.Price).HasColumnName("unit_price");
                entity.Property(e => e.BidPrice).HasColumnName("bid_price");
                entity.Property(e => e.Subtotal).HasColumnName("subtotal");
            });

            // INVOICES
            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.ToTable("invoices");

                entity.Property(e => e.InvoiceId).HasColumnName("invoice_id");
                entity.Property(e => e.OrderId).HasColumnName("order_id");
                entity.Property(e => e.TotalAmount).HasColumnName("total_amount");
                entity.Property(e => e.Status).HasColumnName("status");
                entity.Property(e => e.InvoiceDate).HasColumnName("invoice_date");
            });

            // WALLETS
            modelBuilder.Entity<Wallet>(entity =>
            {
                entity.ToTable("wallets");

                entity.Property(e => e.WalletId).HasColumnName("wallet_id");
                entity.Property(e => e.BusinessId).HasColumnName("business_id");
                entity.Property(e => e.Balance).HasColumnName("balance");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            });

            // WALLET TRANSACTIONS
            modelBuilder.Entity<WalletTransaction>(entity =>
            {
                entity.ToTable("wallet_transactions");

                entity.Property(e => e.TransactionId).HasColumnName("transaction_id");
                entity.Property(e => e.WalletId).HasColumnName("wallet_id");
                entity.Property(e => e.Amount).HasColumnName("amount");
                entity.Property(e => e.Type).HasColumnName("type");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            });

            // BUSINESSES
            modelBuilder.Entity<Business>(entity =>
            {
                entity.ToTable("businesses");

                entity.Property(e => e.BusinessId).HasColumnName("business_id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.BusinessName).HasColumnName("business_name");
                entity.Property(e => e.GstNumber).HasColumnName("gst_number");
                entity.Property(e => e.Address).HasColumnName("address");
                entity.Property(e => e.City).HasColumnName("city");
                entity.Property(e => e.State).HasColumnName("state");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            });

            // CATEGORIES
            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("categories");

                entity.Property(e => e.CategoryId).HasColumnName("category_id");
                entity.Property(e => e.CategoryName).HasColumnName("category_name");
            });

            // CONTRACTS
            modelBuilder.Entity<Contract>(entity =>
            {
                entity.ToTable("contracts");

                entity.Property(e => e.ContractId).HasColumnName("contract_id");
                entity.Property(e => e.BusinessId).HasColumnName("business_id");
                entity.Property(e => e.SupplierId).HasColumnName("supplier_id");
                entity.Property(e => e.StartDate).HasColumnName("start_date");
                entity.Property(e => e.EndDate).HasColumnName("end_date");
                entity.Property(e => e.ContractStatus).HasColumnName("contract_status");
            });

            // INVENTORIES
            modelBuilder.Entity<Inventory>(entity =>
            {
                entity.ToTable("inventories");

                entity.Property(e => e.InventoryId).HasColumnName("inventory_id");
                entity.Property(e => e.ProductId).HasColumnName("product_id");
                entity.Property(e => e.AvailableQuantity).HasColumnName("available_quantity");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            });

            // PRICING TIERS
            modelBuilder.Entity<PricingTier>(entity =>
            {
                entity.ToTable("pricing_tiers");

                entity.Property(e => e.PricingTierId).HasColumnName("pricing_tier_id");
                entity.Property(e => e.ProductId).HasColumnName("product_id");
                entity.Property(e => e.MinQuantity).HasColumnName("min_quantity");
                entity.Property(e => e.Price).HasColumnName("price");
            });

            // SUPPLIERS
            modelBuilder.Entity<Supplier>(entity =>
            {
                entity.ToTable("suppliers");

                entity.Property(e => e.SupplierId).HasColumnName("supplier_id");
                entity.Property(e => e.SupplierName).HasColumnName("supplier_name");
                entity.Property(e => e.ContactPerson).HasColumnName("contact_person");
                entity.Property(e => e.Phone).HasColumnName("phone");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Location).HasColumnName("location");
            });
        }
    }
}