using Backend.Data;
using Backend.Data.Models;
using Backend.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private IUnitOfWork _unitOfWork;

        public InventoryController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public IEnumerable<Inventory> Get()
        {
            var inventoryTemp = _unitOfWork.InventoryRepository.Get();
            return inventoryTemp;
        }

        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            var inventoryTemp = _unitOfWork.InventoryRepository.GetByID(id);
            if (inventoryTemp == null)
            {
                return BadRequest();
            }

            return Ok(inventoryTemp);
        }

        [HttpPost]
        public ActionResult Post([FromBody] PostInventoryDto value)
        {
            var newInventory = new Inventory()
            {
                ProductId = value.ProductId,
                QuantityOnHand = value.QuantityOnHand,
                ReorderLevel = value.ReorderLevel,
                LastUpdated = value.LastUpdated
            };

            _unitOfWork.InventoryRepository.Insert(newInventory);
            _unitOfWork.Save();
            _unitOfWork.Dispose();
            return CreatedAtAction(nameof(Get), newInventory);
        }

        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] Inventory value)
        {
            var inventoryDb = _unitOfWork.InventoryRepository.GetByID(id);
            if (inventoryDb == null)
            {
                return BadRequest();
            }

            inventoryDb.ProductId = value.ProductId;
            inventoryDb.QuantityOnHand = value.QuantityOnHand;
            inventoryDb.ReorderLevel = value.ReorderLevel;
            inventoryDb.LastUpdated = value.LastUpdated;

            _unitOfWork.InventoryRepository.Update(inventoryDb);
            _unitOfWork.Save();
            return Ok();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            _unitOfWork.InventoryRepository.Delete(id);
            _unitOfWork.Save();
            return Ok();
        }
    }
}