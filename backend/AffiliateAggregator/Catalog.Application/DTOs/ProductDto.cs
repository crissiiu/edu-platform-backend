using System;
using System.Collections.Generic;

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
        string RawProductUrl,
        string AffiliateUrl,
        Guid CategoryId,
        List<string> SecondaryImages
    );
}
