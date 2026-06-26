namespace Catalog.Domain.Entities
{
    public class PriceHistory:BaseEntity
    {
        public Guid ProductId { get; set; }
        public decimal Price { get; set; }
        public DateTime CheckedAt { get; set; } = DateTime.UtcNow;

        // Relationship
        public Product? Product { get; set; }
    }
}
