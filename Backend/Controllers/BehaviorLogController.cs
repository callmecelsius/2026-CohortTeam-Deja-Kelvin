using Backend.Data;
using Backend.Data.Models;
using Backend.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class BehaviorLogController : ControllerBase
  {
    private IUnitOfWork _unitOfWork;
    public BehaviorLogController(IUnitOfWork unitOfWork)
    {
      _unitOfWork = unitOfWork;
    }


    // GET
    [HttpGet("{id}")]
    public ActionResult Get(int id)
    {
      var behaviorLog = _unitOfWork.BehaviorLogRepository.GetByID(id);
      if (behaviorLog == null)
      {
        return NotFound();
      }

      return Ok(behaviorLog);
    }

    [HttpGet("animal/{animalId}")]
    public ActionResult GetByAnimal(int animalId)
    {
      var behaviors = _unitOfWork.BehaviorLogRepository
        .Get(filter: behavior => behavior.AnimalId == animalId);
      return Ok(behaviors);
    }

    [HttpGet("user/{userId}")]
    public ActionResult GetByUser(int userId)
    {
      var reports = _unitOfWork.BehaviorLogRepository
        .Get(filter: report => report.ReportedByUserId == userId);
      return Ok(reports);
    }

    // POST 
    [HttpPost]
    public ActionResult Post([FromBody] BehaviorLogDto value)
    {
      var newBehaviorLog = new BehaviorLog()
      {
        AnimalId = value.AnimalId,
        ReportedByUserId = value.ReportedByUserId,
        BehaviorType = value.BehaviorType,
        Notes = value.Notes,
        DateReported = value.DateReported,
        Resolved = value.Resolved,
      };
      _unitOfWork.BehaviorLogRepository.Insert(newBehaviorLog);
      _unitOfWork.Save();
      return CreatedAtAction(nameof(Get), new { id = newBehaviorLog.Id }, newBehaviorLog);
    }
    
    // PUT 
    
    [HttpPut("{id}")]
    public ActionResult Put(int id, [FromBody] BehaviorLogDto value)
    {
      var updateBehaviorLog = _unitOfWork.BehaviorLogRepository.GetByID(id);
      if (updateBehaviorLog == null)
      {
        return BadRequest();
      }

      updateBehaviorLog.BehaviorType = value.BehaviorType;
      updateBehaviorLog.Notes = value.Notes;
      updateBehaviorLog.DateReported = value.DateReported;
      updateBehaviorLog.Resolved = value.Resolved;

      _unitOfWork.BehaviorLogRepository.Update(updateBehaviorLog);
      _unitOfWork.Save();
      return Ok(updateBehaviorLog);
    }
  }
}

