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
                "productName": "test"
            }
        ]
    }
]
         */
        public IEnumerable<OrderDto> Get()
        {
            var orders = _unitOfWork.OrderRepository.Get(includeProperties: "OrderItems,User,OrderItems.Product,OrderItems.Product.Category");

            return orders.Select(o => new OrderDto
            {
                Id = o.Id,
                UserId = o.UserId,
                UserName = o.User != null ? $"{o.User.FirstName} {o.User.LastName}" : null,
                OrderComplete = o.OrderComplete,
                DateOrdered = o.DateOrdered,
                OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    OrderId = oi.OrderId,
                    ProductId = oi.ProductId,
                    Quantity = oi.Quantity,
                    ProductName = oi.Product?.Description,
                    CategoryName = oi.Product?.Category?.Name
                }).ToList()
            }).ToList();
        }

        [HttpGet("{id}")]
        public ActionResult<OrderDto> Get(int id)
        {
            var order = _unitOfWork.OrderRepository
                .Get(o => o.Id == id, includeProperties: "OrderItems,User,OrderItems.Product,OrderItems.Product.Category")
                .FirstOrDefault();

            if (order == null)
            {
                return NotFound();
            }

            var dto = new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                UserName = order.User != null ? $"{order.User.FirstName} {order.User.LastName}" : null,
                OrderComplete = order.OrderComplete,
                DateOrdered = order.DateOrdered,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    OrderId = oi.OrderId,
                    ProductId = oi.ProductId,
                    Quantity = oi.Quantity,
                    ProductName = oi.Product?.Description,
                    CategoryName = oi.Product?.Category?.Name
                }).ToList()
            };

            return Ok(dto);
        }

        [HttpGet("fosterhome/{fosterHomeId}")]
        public ActionResult<IEnumerable<OrderDto>> GetByFosterHome(int fosterHomeId)
        {
            var fosterParents = _unitOfWork.FosterParentRepository
                .Get(fp => fp.FosterHomeId == fosterHomeId);

            var userIds = fosterParents
                .Where(fp => fp.UserId.HasValue)
                .Select(fp => fp.UserId.Value)
                .ToList();

            if (!userIds.Any())
            {
                return Ok(new List<OrderDto>());
            }

            var orders = _unitOfWork.OrderRepository
                .Get(
                    filter: o => o.UserId.HasValue && userIds.Contains(o.UserId.Value),
                    includeProperties: "OrderItems,User,OrderItems.Product,OrderItems.Product.Category"
                );

            var result = orders.Select(o => new OrderDto
            {
                Id = o.Id,
                UserId = o.UserId,
                UserName = o.User != null ? $"{o.User.FirstName} {o.User.LastName}" : null,
                OrderComplete = o.OrderComplete,
                DateOrdered = o.DateOrdered,
                OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    OrderId = oi.OrderId,
                    ProductId = oi.ProductId,
                    Quantity = oi.Quantity,
                    ProductName = oi.Product?.Description,
                    CategoryName = oi.Product?.Category?.Name
                }).ToList()
            }).ToList();

            return Ok(result);
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

                // Return the created order with its ID so the frontend can use it
                return Ok(new { id = order.Id });

            }
            catch (Exception)
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

                // Check if the order is being marked as complete (was false, now true)
                bool isBeingCompleted = orderDb.OrderComplete != true && orderDto.OrderComplete == true;

                orderDb.UserId = orderDto.UserId;
                orderDb.OrderComplete = orderDto.OrderComplete;
                orderDb.DateOrdered = orderDto.DateOrdered;
                _unitOfWork.OrderRepository.Update(orderDb);

                // If the order is being completed, decrease inventory for each item
                if (isBeingCompleted)
                {
                    var orderItems = _unitOfWork.OrderItemRepository
                        .Get(oi => oi.OrderId == id);

                    foreach (var item in orderItems)
                    {
                        var inventoryItem = _unitOfWork.InventoryRepository
                            .Get(i => i.ProductId == item.ProductId)
                            .FirstOrDefault();

                        if (inventoryItem != null && item.Quantity.HasValue)
                        {
                            inventoryItem.QuantityOnHand = (inventoryItem.QuantityOnHand ?? 0) - item.Quantity.Value;
                            inventoryItem.LastUpdated = DateTime.UtcNow;
                            _unitOfWork.InventoryRepository.Update(inventoryItem);
                        }
                    }
                }

                _unitOfWork.Save();
                return Ok();
            }
            catch (Exception)
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
                // Delete all order items first (foreign key constraint)
                var orderItems = _unitOfWork.OrderItemRepository
                    .Get(oi => oi.OrderId == id);

                foreach (var item in orderItems)
                {
                    _unitOfWork.OrderItemRepository.Delete(item.Id);
                }

                // Now delete the order itself
                _unitOfWork.OrderRepository.Delete(id);
                _unitOfWork.Save();
                return Ok();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred." });
            }
        }
    }
}
