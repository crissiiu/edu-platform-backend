using Affiliate.SharedLibrary.Interface;
using Catalog.Application.DTOs;
using Catalog.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Linq;

namespace Catalog.Presentation.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class CategoriesController(IGenericInterface<Category> categoryRepository) : ControllerBase
    {
        // GET: api/v1/Categories
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await categoryRepository.GetAllAsync();

            // Map entities to DTOs
            var categoryDtos = categories.Select(c => new CategoryDto(
                c.Id, c.Name, c.Slug
            ));

            return Ok(categoryDtos);
        }
    }
}
