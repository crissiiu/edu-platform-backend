using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Catalog.Application.DTOs
{
    public record ProductDto(
        Guid Id,
        string Name,
        string Slug,
        string Description,
        string ImageUrl,
        decimal OriginalPrice,
        decimal CurrentPrice,
        double DiscountPercentage,
        string SourcePlatform,
        string AffiliateUrl,
        Guid CategoryId
    );
}
