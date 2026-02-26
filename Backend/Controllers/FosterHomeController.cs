using Backend.Data;
using Backend.Data.Models;
using Backend.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class FosterHomeController : ControllerBase
  {
    private IUnitOfWork _unitOfWork;
    public FosterHomeController(IUnitOfWork unitOfWork)
    {
      _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public ActionResult<IEnumerable<FosterHome>> Get()
    {
      var fosterHomeTemp = _unitOfWork.FosterHomeRepository.Get();
      return Ok(fosterHomeTemp);
    }

    [HttpGet("{id}")]
    public ActionResult Get(int id)
    {
      var fosterHomeTemp = _unitOfWork.FosterHomeRepository.GetByID(id);
      if (fosterHomeTemp == null)
      {
        return NotFound();
      }

      return Ok(fosterHomeTemp);
    }

    [HttpPost]
    public ActionResult Post([FromBody] FosterHomeDto value)
    {
      var newFosterHome = new FosterHome()
      {
        HomeName = value.HomeName,
        Address = value.Address,
        Capacity = value.Capacity
      };
      
      _unitOfWork.FosterHomeRepository.Insert(newFosterHome);
      _unitOfWork.Save();
      return CreatedAtAction(nameof(Get), newFosterHome);
    }

    [HttpPut("{id}")]
    public ActionResult Put(int id, [FromBody] FosterHomeDto value)
    {
      var fosterHomeDb = _unitOfWork.FosterHomeRepository.GetByID(id);
      if (fosterHomeDb == null)
      {
        return NotFound();
      }

      fosterHomeDb.HomeName = value.HomeName;
      fosterHomeDb.Address = value.Address;
      fosterHomeDb.Capacity = value.Capacity;

      _unitOfWork.FosterHomeRepository.Update(fosterHomeDb);
      _unitOfWork.Save();
      return Ok();
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
      var fosterHomeDb = _unitOfWork.FosterHomeRepository.GetByID(id);
      if (fosterHomeDb == null)
      {
        return NotFound();
      }

      _unitOfWork.FosterHomeRepository.Delete(id);
      _unitOfWork.Save();
      return Ok();
    }
  }
}