namespace Catalog.Domain.Entities
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;

        // Giá cả
        public decimal OriginalPrice { get; set; } // Giá gốc của sàn
        public decimal CurrentPrice { get; set; }  // Giá sau khi giảm
        public double DiscountPercentage { get; set; } // % giảm giá

        // Affiliate Links
        public string SourcePlatform { get; set; } = string.Empty; // Shopee, Lazada, Amazon...
        public string RawProductUrl { get; set; } = string.Empty;  // Link gốc sản phẩm
        public string AffiliateUrl { get; set; } = string.Empty;   // Link đã bọc mã kiếm tiền

        // Trạng thái & Thời gian
        public bool IsAvailable { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public Guid CategoryId { get; set; }
        public Category? Category { get; set; }
        public ICollection<PriceHistory> PriceHistories { get; set; } = new List<PriceHistory>();
    }
}
