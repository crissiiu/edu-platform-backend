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

            modelBuilder.Entity<Category>().HasQueryFilter(c => !c.IsDeleted);
            modelBuilder.Entity<Product>().HasQueryFilter(p => !p.IsDeleted);
            modelBuilder.Entity<PriceHistory>().HasQueryFilter(ph => !ph.IsDeleted);

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
                entity.Property(p => p.SecondaryImages).HasColumnType("text[]");

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


        // ĐÁNH CHẶN TỰ ĐỘNG: Ghi vết lịch sử và thực thi xoá mềm trước khi lưu vào Postgres
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
            {
                switch (entry.State)
                {
                    // 1. Khi thêm mới dữ liệu
                    case EntityState.Added:
                        entry.Entity.CreatedAt = DateTime.UtcNow;
                        entry.Entity.IsDeleted = false;
                        break;

                    // 2. Khi cập nhật dữ liệu
                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        break;

                    // 3. KHI CÓ LỆNH XOÁ: Chặn đứng hành vi xoá cứng, chuyển thành cập nhật trạng thái
                    case EntityState.Deleted:
                        entry.State = EntityState.Modified; // Ép EF Core hiểu đây là lệnh Update chứ không phải Delete
                        entry.Entity.IsDeleted = true;
                        entry.Entity.DeletedAt = DateTime.UtcNow;
                        break;
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
