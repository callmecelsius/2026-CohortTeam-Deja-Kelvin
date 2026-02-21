using Backend.Data;
using Backend.Data.Models;
using Backend.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private IUnitOfWork _unitOfWork;

        public OrderController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        /*
         [
    {
        "id": 0,
        "userId": 0,
        "orderComplete": true,
        "dateOrdered": "2026-02-20T00:00:00",
        "orderItems": [
            {
                "id": 0,
                "orderId": 0,
                "productId": 0,
                "quantity": 1,
                "productName": "testtesttest"
            }
        ]
    }
]
         */
        public IEnumerable<OrderDto> Get()
        {
            var orders = _unitOfWork.OrderRepository.Get(includeProperties: "OrderItems,User,OrderItems.Product");

            return orders.Select(o => new OrderDto
            {
                Id = o.Id,
                UserId = o.UserId,
                OrderComplete = o.OrderComplete,
                DateOrdered = o.DateOrdered,
                OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    OrderId = oi.OrderId,
                    ProductId = oi.ProductId,
                    Quantity = oi.Quantity,
                    ProductName = oi.Product?.Description
                }).ToList()
            }).ToList();
        }

        [HttpGet("{id}")]
        public ActionResult<OrderDto> Get(int id)
        {
            var order = _unitOfWork.OrderRepository
                .Get(o => o.Id == id, includeProperties: "OrderItems,User,OrderItems.Product")
                .FirstOrDefault();

            if (order == null)
            {
                return NotFound();
            }

            var dto = new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                OrderComplete = order.OrderComplete,
                DateOrdered = order.DateOrdered,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    OrderId = oi.OrderId,
                    ProductId = oi.ProductId,
                    Quantity = oi.Quantity,
                    ProductName = oi.Product?.Description
                }).ToList()
            };

            return Ok(dto);
        }

        [HttpPost]
        /*
                 {
            "UserId" :0,
            "OrderComplete":true,
            "DateOrdered": "2026-02-20"
        }
         */
        public ActionResult InsertProduct([FromBody] OrderDto orderDto)
        {
            try
            {

                if (orderDto == null)
                {
                    return BadRequest("order details are required.");
                }

                var order = new Order
                {
                   UserId = orderDto.UserId,
                   OrderComplete = orderDto.OrderComplete,
                   DateOrdered = orderDto.DateOrdered

                };

                _unitOfWork.OrderRepository.Insert(order);
                _unitOfWork.Save();
                _unitOfWork.Dispose();
                return Ok("order inserted successfully.");

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred." });
            }

        }

        [HttpPut("{id}")]
        /*
         {
                "UserId" :0,
                "OrderComplete":false,
                "DateOrdered": "2026-02-20"
            }
                     */
        public ActionResult Put(int id, [FromBody] OrderDto orderDto)
        {
            try
            {
                var orderDb = _unitOfWork.OrderRepository.GetByID(id);
                if (orderDb == null)
                {
                    return BadRequest();
                }

                orderDb.UserId = orderDto.UserId;
                orderDb.OrderComplete = orderDto.OrderComplete;
                orderDb.DateOrdered = orderDto.DateOrdered;
                _unitOfWork.OrderRepository.Update(orderDb);
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
                _unitOfWork.OrderRepository.Delete(id);
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
