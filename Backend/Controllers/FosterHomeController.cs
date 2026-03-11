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
    public ActionResult<IEnumerable<FosterHomeWithCountDto>> Get()
    {
      var fosterHomes = _unitOfWork.FosterHomeRepository.Get();
      var now = DateTime.UtcNow;

      var result = fosterHomes.Select(fh => new FosterHomeWithCountDto
      {
        Id = fh.Id,
        HomeName = fh.HomeName,
        Address = fh.Address,
        Capacity = fh.Capacity ?? 0,
        CurrentAnimalCount = _unitOfWork.FosterAssignmentRepository
          .Get(fa => fa.FosterHomeId == fh.Id && (fa.EndDate == null || fa.EndDate > now))
          .Count()
      });

      return Ok(result);
    }

    [HttpGet("{id}")]
    public ActionResult<FosterHomeWithCountDto> Get(int id)
    {
      var fosterHome = _unitOfWork.FosterHomeRepository.GetByID(id);
      if (fosterHome == null)
      {
        return NotFound();
      }

      var now = DateTime.UtcNow;
      var currentAnimalCount = _unitOfWork.FosterAssignmentRepository
        .Get(fa => fa.FosterHomeId == id && (fa.EndDate == null || fa.EndDate > now))
        .Count();

      var result = new FosterHomeWithCountDto
      {
        Id = fosterHome.Id,
        HomeName = fosterHome.HomeName,
        Address = fosterHome.Address,
        Capacity = fosterHome.Capacity ?? 0,
        CurrentAnimalCount = currentAnimalCount
      };

      return Ok(result);
    }

    [HttpGet("{id}/availability")]
    public ActionResult<FosterHomeAvailabilityDto> GetAvailability(int id)
    {
      var fosterHome = _unitOfWork.FosterHomeRepository.GetByID(id);
      if (fosterHome == null)
      {
        return NotFound();
      }

      var occupiedSlots = _unitOfWork.FosterParentRepository
        .Get(fosterparent => fosterparent.FosterHomeId == id)
        .Count();

      var capacity = fosterHome.Capacity ?? 0;

      var result = new FosterHomeAvailabilityDto
      {
        FosterHomeId = id,
        Capacity = capacity,
        OccupiedSlots = occupiedSlots,
        Availability = capacity - occupiedSlots
      };

      return Ok(result);
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