using Backend.Data;
using Backend.Data.Models;
using Backend.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductCategoryController : Controller
    {
        private IUnitOfWork _unitOfWork;

        public ProductCategoryController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public IEnumerable<ProductCategoryDto> Get()
        {
            var categories = _unitOfWork.ProductCategoryRepository.Get()
                .Select(c => new ProductCategoryDto
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .ToList();

            return categories;
        }

        [HttpPost]
        /*http://localhost:5282/api/ProductCategory
            {
                "Name":"toy"
    
            }
         */
        public ActionResult InsertProductCategory([FromBody] ProductCategoryDto productCategoryDto)
        {
            try
            {
                if (productCategoryDto == null)
                {
                    return BadRequest("Product Category details are required.");
                }
                var productCategory = new ProductCategory
                {
                    Name = productCategoryDto.Name.ToLower()

                };

                _unitOfWork.ProductCategoryRepository.Insert(productCategory);
                _unitOfWork.Save();
                _unitOfWork.Dispose();
                return Ok("product Category inserted successfully.");

            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred." });
            }

        }

    }
}
