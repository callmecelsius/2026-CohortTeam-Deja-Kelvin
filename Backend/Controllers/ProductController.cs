using Backend.Data;
using Backend.Data.Models;
using Backend.Dtos;
using Microsoft.AspNetCore.Mvc;


namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController: ControllerBase
    {
        private IUnitOfWork _unitOfWork;

        public ProductController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        // http://localhost:5282/api/Product/
        public IEnumerable<Product> Get()
        {
            var productTemp = _unitOfWork.ProductRepository.Get();
            return productTemp;
        }

        // GET http://localhost:5282/api/Product/0
        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            var productTemp = _unitOfWork.ProductRepository.GetByID(id);
            
            if (productTemp == null)
            {
                return BadRequest();
            }

            return Ok(productTemp);
        }

        [HttpPost]
        /*http://localhost:5282/api/Product/
            {
                "CategoryId" :123,
                "Description":"test",
                "UnitPrice": 100
            }
         */
        public ActionResult InsertProduct([FromBody] ProductDto productDto)
        {
            try
            {

                if (productDto == null)
                {
                    return BadRequest("Product details are required.");
                }
               
                var product = new Product
                {
                    CategoryId = productDto.CategoryId,
                    Description = productDto.Description,
                    UnitPrice = productDto.UnitPrice

                };

                _unitOfWork.ProductRepository.Insert(product);
                _unitOfWork.Save();
                _unitOfWork.Dispose();
                return Ok(new
                {
                    id = product.Id,
                    message = "Product inserted successfully.",
                    product = product
                });

            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred." });
            }

        }

        // PUT api/<ValuesController>/5
        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] ProductDto productDto)
        {
            try
            {
                var productDb = _unitOfWork.ProductRepository.GetByID(id);
                if (productDb == null)
                {
                    return BadRequest();
                }

                productDb.CategoryId = productDto.CategoryId;
                productDb.Description = productDto.Description;
                productDb.UnitPrice = productDto.UnitPrice;
                _unitOfWork.ProductRepository.Update(productDb);
                _unitOfWork.Save();
                return Ok();
            }
            catch (Exception) {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred." });
            }
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            try { 
            _unitOfWork.ProductRepository.Delete(id);
            _unitOfWork.Save();
            return Ok();
            }
            catch (Exception) {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred." });
            }
        }
    }
}
