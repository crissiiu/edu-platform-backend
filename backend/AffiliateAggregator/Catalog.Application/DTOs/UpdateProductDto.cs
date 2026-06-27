using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Catalog.Application.DTOs
{
    public record UpdateProductDto(
        [Required(ErrorMessage = "Định danh sản phẩm (Id) bắt buộc phải có để cập nhật.")]
        Guid Id,

        [Required(ErrorMessage = "Tên sản phẩm không được để trống.")]
        [StringLength(250, MinimumLength = 10, ErrorMessage = "Tên sản phẩm thương mại phải từ 10 đến 250 ký tự.")]
        string Name,

        [Required(ErrorMessage = "Đường dẫn (Slug) không được để trống.")]
        [StringLength(250, ErrorMessage = "Đường dẫn (Slug) không được vượt quá 250 ký tự.")]
        [RegularExpression(@"^[a-z0-8-]+$", ErrorMessage = "Slug không hợp lệ. Chỉ được chứa chữ cái viết thường, số và dấu gạch ngang (chuẩn SEO).")]
        string Slug,

        [MaxLength(2000, ErrorMessage = "Mô tả sản phẩm không được vượt quá 2000 ký tự.")]
        string Description,

        [Required(ErrorMessage = "Hình ảnh sản phẩm bắt buộc phải có.")]
        [Url(ErrorMessage = "Đường dẫn hình ảnh không đúng định dạng URL.")]
        string ImageUrl,

        [Required(ErrorMessage = "Giá gốc không được để trống.")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá gốc phải lớn hơn hoặc bằng 0.")]
        decimal OriginalPrice,

        [Required(ErrorMessage = "Giá hiện tại sau giảm không được để trống.")]
        [Range(0, double.MaxValue, ErrorMessage = "Giá hiện tại phải lớn hơn hoặc bằng 0.")]
        decimal CurrentPrice,

        [Required(ErrorMessage = "Nguồn sàn thương mại bắt buộc phải chọn.")]
        [StringLength(50, ErrorMessage = "Tên sàn không được vượt quá 50 ký tự.")]
        string SourcePlatform,

        [Required(ErrorMessage = "Link sản phẩm gốc bắt buộc phải có.")]
        [Url(ErrorMessage = "Link sản phẩm gốc không đúng định dạng URL.")]
        string RawProductUrl,

        [Required(ErrorMessage = "Link kiếm tiền Affiliate bắt buộc phải có.")]
        [Url(ErrorMessage = "Link Affiliate không đúng định dạng URL.")]
        string AffiliateUrl,

        [Required(ErrorMessage = "Danh mục sản phẩm không được để trống.")]
        Guid CategoryId,

        List<string>? SecondaryImages
    );
}
