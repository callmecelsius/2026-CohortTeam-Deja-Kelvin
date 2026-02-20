using Backend.Data;
using Backend.Data.Models;
using Backend.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class FosterParentController : ControllerBase
  {
    private IUnitOfWork _unitOfWork;

    public FosterParentController(IUnitOfWork unitOfWork)
    {
      _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public IEnumerable<FosterParent> Get()
    {
      var fosterParentTemp = _unitOfWork.FosterParentRepository.Get();
      return fosterParentTemp;
    }

    [HttpGet("{id}")]
    public ActionResult Get(int id)
    {
      var fosterParentTemp = _unitOfWork.FosterParentRepository.GetByID(id);
      if (fosterParentTemp == null)
      {
        return BadRequest();
      }

      return Ok(fosterParentTemp);
    }

    [HttpPost]
    public ActionResult Post([FromBody] PostFosterParentDto value)
    {
      var newFosterParent = new FosterParent()
      {
        UserId = value.UserId,
        FosterHomeId = value.FosterHomeId,
        ApprovedDate = value.ApprovedDate,
        Status = value.Status
      };

      _unitOfWork.FosterParentRepository.Insert(newFosterParent);
      _unitOfWork.Save();
      _unitOfWork.Dispose();
      return CreatedAtAction(nameof(Get), newFosterParent);
    }

    [HttpPut("{id}")]
    public ActionResult Put(int id, [FromBody] FosterParent value)
    {
      var fosterParentDb = _unitOfWork.FosterParentRepository.GetByID(id);
      if (fosterParentDb == null)
      {
        return BadRequest();
      }

      fosterParentDb.UserId = value.UserId;
      fosterParentDb.FosterHomeId = value.FosterHomeId;
      fosterParentDb.ApprovedDate = value.ApprovedDate;
      fosterParentDb.Status = value.Status;

      _unitOfWork.FosterParentRepository.Update(fosterParentDb);
      _unitOfWork.Save();
      return Ok();
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
      _unitOfWork.FosterParentRepository.Delete(id);
      _unitOfWork.Save();
      return Ok();
    }
  }
}