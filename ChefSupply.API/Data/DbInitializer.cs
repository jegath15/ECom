using ChefSupply.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChefSupply.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context, bool force = false)
        {
            try
            {
                // Ensure Database Created
                context.Database.EnsureCreated();

                context.Database.ExecuteSqlRaw(@"
                    ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
                    ALTER TABLE businesses ADD COLUMN IF NOT EXISTS industry_type TEXT;
                    ALTER TABLE businesses ADD COLUMN IF NOT EXISTS estimated_monthly_volume DECIMAL;
                ");

                // Check if already seeded & not forced
                if (!force && context.Products.Any())
                {
                    return; 
                }

                if (force)
                {
                    context.Database.ExecuteSqlRaw("TRUNCATE TABLE products CASCADE;");
                    context.Database.ExecuteSqlRaw("TRUNCATE TABLE categories CASCADE;");
                    context.Database.ExecuteSqlRaw("TRUNCATE TABLE suppliers CASCADE;");
                }

                SeedData(context);
            }
            catch (Exception ex)
            {
                // In a real app, use a logger
                Console.WriteLine($"DB Init Error: {ex.Message}");
                throw;
            }
        }

        private static void SeedData(ApplicationDbContext context)
        {
            // Seed Default Admin if not exists
            if (!context.Users.Any(u => u.Role == "Admin"))
            {
                context.Users.Add(new User
                {
                    UserId = Guid.NewGuid(),
                    Name = "System Administrator",
                    Email = "admin@chefsupply.com",
                    PasswordHash = "Admin123!", // Note: In production use hashed passwords
                    Role = "Admin"
                });
                context.SaveChanges();
            }

            // Seed Categories
            var categories = new List<Category>
            {
                new Category { CategoryName = "Vegetables" },
                new Category { CategoryName = "Meat & Poultry" },
                new Category { CategoryName = "Dairy" },
                new Category { CategoryName = "Seafood" },
                new Category { CategoryName = "Kitchen Equipment" },
                new Category { CategoryName = "Disposables" },
                new Category { CategoryName = "Cooking Utensils" },
                new Category { CategoryName = "Cleaning Supplies" }
            };
            context.Categories.AddRange(categories);
            context.SaveChanges();

            // Seed Suppliers
            var suppliers = new List<Supplier>
            {
                new Supplier { SupplierId = Guid.NewGuid(), SupplierName = "Green Leaf Farms", Email = "procurement@greenleaf.com", Location = "Salinas, CA", ContactPerson = "Jim Farmer" },
                new Supplier { SupplierId = Guid.NewGuid(), SupplierName = "Valley Meats Co", Email = "orders@valleymeats.com", Location = "Omaha, NE", ContactPerson = "Sarah Butcher" },
                new Supplier { SupplierId = Guid.NewGuid(), SupplierName = "Oceanic Catch", Email = "sales@oceanic.com", Location = "Seattle, WA", ContactPerson = "Ray Fisher" },
                new Supplier { SupplierId = Guid.NewGuid(), SupplierName = "Industrial Chef Supply", Email = "b2b@chefsupply.com", Location = "Chicago, IL", ContactPerson = "Mark Tech" }
            };
            context.Suppliers.AddRange(suppliers);
            context.SaveChanges();

            var random = new Random();
            var products = new List<Product>();

            var categoryData = new Dictionary<string, (string[] Names, string[] Descs, string Unit, decimal PriceRange, string Image)>
            {
                { "Vegetables", (new[] { "Organic Hass Avocados", "Vine-Ripened Roma Tomatoes", "Heirloom Carrots", "Hydroponic Butter Lettuce", "Premium Red Onions" }, new[] { "Farm Fresh", "Organic Choice", "Hydroponic" }, "10kg Box", 45m, "/assets/products/vegetables.png") },
                { "Meat & Poultry", (new[] { "Premium Ribeye Steak", "Free-Range Chicken Breast", "Angus Ground Beef", "Smoked Pork Belly" }, new[] { "Premium Choice", "Grass Fed", "Free Range" }, "5kg Case", 180m, "/assets/products/meat.png") },
                { "Dairy", (new[] { "Whole Grass-Fed Milk", "Salted Creamery Butter", "Aged White Cheddar", "Greek Style Yogurt" }, new[] { "Pasteurized", "Cultured", "Double Cream" }, "Case", 60m, "/assets/products/dairy.png") },
                { "Seafood", (new[] { "Atlantic Salmon Fillet", "Jumbo Tiger Prawns", "Wild Sea Bass", "Lobster Tails" }, new[] { "Wild Caught", "Sustainable", "Flash Frozen" }, "2kg Box", 140m, "/assets/products/seafood.png") },
                { "Kitchen Equipment", (new[] { "Industrial Vitamix Blender", "Stainless Steel Prep Table", "High-Power Induction Hob" }, new[] { "Heavy Duty", "Industrial Grade", "Precision" }, "Unit", 1200m, "/assets/products/equipment.png") },
                { "Disposables", (new[] { "Heavy Duty Paper Towels", "Powder-Free Vinyl Gloves", "Eco-Friendly Takeaway Boxes" }, new[] { "Biodegradable", "Recycled", "Powder Free" }, "Bulk Case", 85m, "/assets/products/disposables.png") },
                { "Cooking Utensils", (new[] { "8 inch Chef's Knife", "12 inch Sauté Pan", "20L Stock Pot" }, new[] { "Forged Steel", "Non-Stick", "Stainless" }, "Unit", 75m, "/assets/products/utensils.png") },
                { "Cleaning Supplies", (new[] { "Kitchen Floor Degreaser", "Industrial Sanitizing Wipes", "Concentrated Dish Soap" }, new[] { "Industrial Strength", "Food Safe", "Concentrated" }, "5L Bottle", 55m, "/assets/products/cleaning.png") }
            };

            foreach (var cat in context.Categories.ToList())
            {
                if (!categoryData.ContainsKey(cat.CategoryName)) continue;
                var info = categoryData[cat.CategoryName];

                for (int i = 1; i <= 20; i++)
                {
                    string baseName = info.Names[random.Next(info.Names.Length)];
                    string prefix = info.Descs[random.Next(info.Descs.Length)];
                    decimal price = (decimal)(random.NextDouble() * (double)info.PriceRange) + 10m;

                    var p = new Product
                    {
                        ProductId = Guid.NewGuid(),
                        ProductName = $"{prefix} {baseName} {i:D2}",
                        CategoryId = cat.CategoryId,
                        SupplierId = suppliers[random.Next(suppliers.Count)].SupplierId,
                        BasePrice = Math.Round(price, 2),
                        Unit = info.Unit,
                        ImageUrl = info.Image,
                        Description = $"{prefix} {baseName} sourced for high-volume B2B operations. Verified quality standards for hospitality nodes."
                    };
                    products.Add(p);
                }
            }

            context.Products.AddRange(products);
            context.SaveChanges();

            foreach (var p in products)
            {
                context.Inventories.Add(new Inventory { 
                    ProductId = p.ProductId, 
                    AvailableQuantity = random.Next(100, 1000), 
                    UpdatedAt = DateTime.UtcNow 
                });

                context.PricingTiers.Add(new PricingTier {
                    PricingTierId = Guid.NewGuid(),
                    ProductId = p.ProductId,
                    MinQuantity = 25,
                    Price = Math.Round((p.BasePrice ?? 0) * 0.95m, 2)
                });
            }
            context.SaveChanges();
        }
    }
}
