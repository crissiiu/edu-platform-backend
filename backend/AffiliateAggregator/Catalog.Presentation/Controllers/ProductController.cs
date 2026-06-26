using Affiliate.SharedLibrary.Interface;
using Affiliate.SharedLibrary.Responses;
using Catalog.Application.DTOs;
using Catalog.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Catalog.Presentation.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class ProductsController(IGenericInterface<Product> productRepository) : ControllerBase
    {
        // 1. GET ALL: api/v1/Products
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await productRepository.GetAllAsync();

            // Chuyển đổi danh sách Entity sang DTO đầu ra sạch sẽ
            var productDtos = products.Select(p => new ProductDto(
                p.Id, p.Name, p.Slug, p.Description, p.ImageUrl,
                p.OriginalPrice, p.CurrentPrice, p.DiscountPercentage,
                p.SourcePlatform, p.AffiliateUrl, p.CategoryId
            ));

            return Ok(productDtos);
        }

        // 2. GET BY ID: api/v1/Products/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetProductById(Guid id)
        {
            var p = await productRepository.GetByIdAsync(id);
            if (p == null)
                return NotFound(new Response(false, "Sản phẩm không tồn tại hoặc đã bị ẩn khỏi hệ thống thương mại."));

            var dto = new ProductDto(
                p.Id, p.Name, p.Slug, p.Description, p.ImageUrl,
                p.OriginalPrice, p.CurrentPrice, p.DiscountPercentage,
                p.SourcePlatform, p.AffiliateUrl, p.CategoryId
            );

            return Ok(dto);
        }

        // 3. POST: api/v1/Products (Hứng CreateProductDto)
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
        {
            if (dto == null) return BadRequest();

            // KIỂM TRA TRÙNG LẶP: Chặn trùng tên hoặc trùng đường dẫn URL chuẩn SEO
            var existingByName = await productRepository.GetByExpressionAsync(p => p.Name!.Equals(dto.Name));
            if (existingByName is not null)
                return BadRequest(new Response(false, $"Sản phẩm '{dto.Name}' đã tồn tại trên hệ thống."));

            var existingBySlug = await productRepository.GetByExpressionAsync(p => p.Slug!.Equals(dto.Slug));
            if (existingBySlug is not null)
                return BadRequest(new Response(false, $"Đường dẫn URL (Slug) '{dto.Slug}' đã bị trùng. Vui lòng sửa lại Slug!"));

            // Nghiệp vụ hợp lệ -> Ánh xạ dữ liệu sang Domain Entity
            var product = new Product
            {
                Name = dto.Name,
                Slug = dto.Slug,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl,
                OriginalPrice = dto.OriginalPrice,
                CurrentPrice = dto.CurrentPrice,
                SourcePlatform = dto.SourcePlatform,
                RawProductUrl = dto.RawProductUrl,
                AffiliateUrl = dto.AffiliateUrl,
                CategoryId = dto.CategoryId
            };

            // Tự động tính toán % giảm giá từ giá gốc
            if (product.OriginalPrice > 0 && product.OriginalPrice >= product.CurrentPrice)
            {
                product.DiscountPercentage = Math.Round((double)((product.OriginalPrice - product.CurrentPrice) / product.OriginalPrice) * 100, 1);
            }
            else if (product.OriginalPrice < product.CurrentPrice)
            {
                return BadRequest(new Response(false, "Giá gốc kinh doanh không thể nhỏ hơn giá bán hiện tại sau khi giảm."));
            }

            var result = await productRepository.CreateAsync(product);
            return result.Flag ? Ok(result) : BadRequest(result);
        }

        // 4. PUT: api/v1/Products/{id} (Hứng UpdateProductDto)
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateProductDto dto)
        {
            if (id != dto.Id)
                return BadRequest(new Response(false, "Thông tin định danh ID truyền lên không khớp với cấu trúc DTO."));

            // BẢO VỆ DỮ LIỆU CHẶT CHẼ: Tìm kiếm bản ghi đang hoạt động
            // Do có Global Query Filter, nếu sản phẩm đã bị Xoá mềm trước đó, hàm này trả về null luôn
            var existingProduct = await productRepository.GetByIdAsync(id);
            if (existingProduct == null)
            {
                return NotFound(new Response(false, "Không thể chỉnh sửa! Sản phẩm không tồn tại hoặc đã bị đưa vào kho lưu vết xoá mềm."));
            }

            // Tiến hành ghi đè dữ liệu thay đổi hợp lệ từ DTO vào Entity cũ
            existingProduct.Name = dto.Name;
            existingProduct.Slug = dto.Slug;
            existingProduct.Description = dto.Description;
            existingProduct.ImageUrl = dto.ImageUrl;
            existingProduct.OriginalPrice = dto.OriginalPrice;
            existingProduct.CurrentPrice = dto.CurrentPrice;
            existingProduct.SourcePlatform = dto.SourcePlatform;
            existingProduct.RawProductUrl = dto.RawProductUrl;
            existingProduct.AffiliateUrl = dto.AffiliateUrl;
            existingProduct.CategoryId = dto.CategoryId;

            // Tính toán lại biên độ % giảm giá thương mại
            if (existingProduct.OriginalPrice > 0 && existingProduct.OriginalPrice >= existingProduct.CurrentPrice)
            {
                existingProduct.DiscountPercentage = Math.Round((double)((existingProduct.OriginalPrice - existingProduct.CurrentPrice) / existingProduct.OriginalPrice) * 100, 1);
            }
            else if (existingProduct.OriginalPrice < existingProduct.CurrentPrice)
            {
                return BadRequest(new Response(false, "Giá gốc mới chỉnh sửa không thể nhỏ hơn giá hiện tại."));
            }

            var result = await productRepository.UpdateAsync(existingProduct);
            return result.Flag ? Ok(result) : BadRequest(result);
        }

        // 5. DELETE: api/v1/Products/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            var result = await productRepository.DeleteAsync(id);
            return result.Flag ? Ok(result) : BadRequest(result);
        }
    }
}
