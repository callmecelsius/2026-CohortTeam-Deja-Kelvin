using Backend.Data.Models;
using Backend.Data;
using Backend.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemController : ControllerBase
    {
        private IUnitOfWork _unitOfWork;

        public OrderItemController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        /*
         * [
    {
        "id": 0,
        "orderId": 0,
        "productId": 0,
        "quantity": 1,
        "productName": "testtesttest",
        "userId": 0,
        "orderComplete": true,
        "dateOrdered": "2026-02-20T00:00:00"
    }
]
         */
        public IEnumerable<OrderItemDto> Get()
        {
            var items = _unitOfWork.OrderItemRepository
                .Get(includeProperties: "Product,Order");

            return items.Select(i => new OrderItemDto
            {
                Id = i.Id,
                Quantity = i.Quantity,
                OrderId = i.OrderId,
                ProductId = i.ProductId,
                ProductName = i.Product?.Description,

                // All Order fields
               // UserId = i.Order?.UserId,
               // OrderComplete = i.Order?.OrderComplete,
                //DateOrdered = i.Order?.DateOrdered
            }).ToList();
        }

        [HttpGet("{id}")]
        public ActionResult<OrderItemDto> Get(int id)
        {
            var orderTemp = _unitOfWork.OrderItemRepository
                .Get(o => o.Id == id, includeProperties: "Product,Order")
                .FirstOrDefault();

            if (orderTemp == null)
            {
                return NotFound();
            }

            var dto = new OrderItemDto
            {
                Id = orderTemp.Id,
                Quantity = orderTemp.Quantity,
                OrderId = orderTemp.OrderId,
                ProductId = orderTemp.ProductId,
                ProductName = orderTemp.Product?.Description,

                // All Order fields
               // UserId = orderTemp.Order?.UserId,
                //OrderComplete = orderTemp.Order?.OrderComplete,
               // DateOrdered = orderTemp.Order?.DateOrdered
            };

            return Ok(dto);
        }

        [HttpPost]
        public ActionResult InsertProduct([FromBody] OrderItemDto orderitemDto)
        {
            try
            {

                if (orderitemDto == null)
                {
                    return BadRequest("orderitem details are required.");
                }

                var orderitem = new OrderItem
                {
                    OrderId = orderitemDto.OrderId,
                    ProductId = orderitemDto.ProductId,
                    Quantity = orderitemDto.Quantity,
                    
                };

                _unitOfWork.OrderItemRepository.Insert(orderitem);
                _unitOfWork.Save();
                _unitOfWork.Dispose();
                return Ok("orderitem inserted successfully.");

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred." });
            }

        }

        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] OrderItemDto orderitemDto)
        {
            try
            {
                var orderitemDb = _unitOfWork.OrderItemRepository.GetByID(id);
                if (orderitemDb == null)
                {
                    return BadRequest();
                }

                orderitemDb.OrderId=orderitemDto.OrderId;
                orderitemDb.ProductId=orderitemDto.ProductId;
                orderitemDb.Quantity=orderitemDto.Quantity;
                _unitOfWork.OrderItemRepository.Update(orderitemDb);
                _unitOfWork.Save();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred." });
            }
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            try
            {
                _unitOfWork.OrderItemRepository.Delete(id);
                _unitOfWork.Save();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred." });
            }
        }
    }
}
