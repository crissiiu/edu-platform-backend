using Catalog.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Infrastructure.Data
{
    public class CatalogDbContext : DbContext
    {
        public CatalogDbContext(DbContextOptions<CatalogDbContext> options) : base(options)
        {
        }
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<PriceHistory> PriceHistories => Set<PriceHistory>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Cấu hình bảng Category
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Name).IsRequired().HasMaxLength(150);

                // Tối ưu SEO cho URL Danh mục
                entity.Property(c => c.Slug).IsRequired().HasMaxLength(150);
                entity.HasIndex(c => c.Slug).IsUnique();
            });

            // 2. Cấu hình bảng Product
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Name).IsRequired().HasMaxLength(250);

                // Tối ưu SEO cho URL Sản phẩm
                entity.Property(p => p.Slug).IsRequired().HasMaxLength(250);
                entity.HasIndex(p => p.Slug).IsUnique();

                entity.Property(p => p.Description).HasMaxLength(2000);
                entity.Property(p => p.ImageUrl).HasMaxLength(500);

                // Định dạng tiền tệ chính xác, tránh sai số làm tròn
                entity.Property(p => p.OriginalPrice).HasPrecision(18, 2);
                entity.Property(p => p.CurrentPrice).HasPrecision(18, 2);

                entity.Property(p => p.SourcePlatform).IsRequired().HasMaxLength(50); // Shopee, Lazada...
                entity.Property(p => p.RawProductUrl).IsRequired().HasMaxLength(2000);
                entity.Property(p => p.AffiliateUrl).IsRequired().HasMaxLength(2000);

                // Cấu hình mối quan hệ 1-Nhiều (Category -> Products)
                entity.HasOne(p => p.Category)
                      .WithMany(c => c.Products)
                      .HasForeignKey(p => p.CategoryId)
                      .OnDelete(DeleteBehavior.Cascade); // Xóa danh mục thì tự động xóa sản phẩm bên trong
            });

            // 3. Cấu hình bảng PriceHistory
            modelBuilder.Entity<PriceHistory>(entity =>
            {
                entity.HasKey(ph => ph.Id);
                entity.Property(ph => ph.Price).HasPrecision(18, 2);

                // Cấu hình mối quan hệ 1-Nhiều (Product -> PriceHistories)
                entity.HasOne(ph => ph.Product)
                      .WithMany(p => p.PriceHistories)
                      .HasForeignKey(ph => ph.ProductId)
                      .OnDelete(DeleteBehavior.Cascade); // Xóa sản phẩm thì tự động xóa lịch sử giá của nó
            });
        }
    }
}
