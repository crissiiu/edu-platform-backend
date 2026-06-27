using System.Collections.Generic;

namespace Catalog.Application.DTOs
{
    public record PaginatedListDto<T>(
        List<T> Items,
        int PageNumber,
        int PageSize,
        int TotalCount,
        int TotalPages
    );
}
