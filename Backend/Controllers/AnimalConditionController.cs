using Backend.Data;
using Backend.Data.Models;
using Backend.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AnimalConditionController : ControllerBase
  {
    private IUnitOfWork _unitOfWork;
    public AnimalConditionController(IUnitOfWork unitOfWork)
    {
      _unitOfWork = unitOfWork;
    }

    [HttpGet("{id}")]
    public ActionResult Get(int id)
    {
      var animalCondition = _unitOfWork.AnimalConditionRepository.GetByID(id);
      if (animalCondition == null)
      {
        return NotFound();
      }

      return Ok(animalCondition);
    }

    [HttpGet("animal/{animalId}")]
    public ActionResult GetByAnimal(int animalId)
    {
      var conditions = _unitOfWork.AnimalConditionRepository
        .Get(filter: condition => condition.AnimalId == animalId);
      return Ok(conditions);
    }

    [HttpGet("severity")]
    public ActionResult GetAnimalSeverity()
    {
      var animalSeverity = _unitOfWork.AnimalConditionRepository.Get(filter: a =>
            a.Severity != null &&
            (a.Severity.ToLower() == "high" || a.Severity.ToLower() == "critical")).Count();

      return Ok( new { animalSeverity });
    }

    [HttpGet("severity/animals")]
    public ActionResult GetAnimalSeverities()
    {
      var severityOrder = new Dictionary<string, int>
      {
        { "low", 0 },
        { "moderate", 1 },
        { "high", 2 },
        { "critical", 3 },
      };

      var result = _unitOfWork.AnimalConditionRepository
          .Get(filter: a => a.Severity != null && a.AnimalId != null)
          .GroupBy(a => a.AnimalId)
          .Select(g => new
          {
            animalId = g.Key,
            severity = g.OrderByDescending(a =>
              severityOrder.GetValueOrDefault(a.Severity!.ToLower(), -1))
              .First().Severity!.ToLower()
          })
          .ToList();

      return Ok(result);
    }

    [HttpPost]
    public ActionResult Post([FromBody] AnimalConditionDto value)
    {
      var newAnimalCondition = new AnimalCondition()
      {
        AnimalId = value.AnimalId,
        ConditionType = value.ConditionType,
        Description = value.Description,
        Severity = value.Severity,
        StartDate = value.StartDate,
        EndDate = value.EndDate,
        VetSeen = value.VetSeen
      };
        _unitOfWork.AnimalConditionRepository.Insert(newAnimalCondition);
        _unitOfWork.Save();
        return CreatedAtAction(nameof(Get), new { id = newAnimalCondition.Id }, newAnimalCondition );
    }
    
    [HttpPut("{id}")]
    public ActionResult Put(int id, [FromBody] AnimalConditionDto value)
    {
      var updateAnimalCondition = _unitOfWork.AnimalConditionRepository.GetByID(id);
      if (updateAnimalCondition == null)
      {
        return BadRequest();
      }

      updateAnimalCondition.ConditionType = value.ConditionType;
      updateAnimalCondition.Description = value.Description;
      updateAnimalCondition.Severity = value.Severity;
      updateAnimalCondition.StartDate = value.StartDate;
      updateAnimalCondition.EndDate = value.EndDate;
      updateAnimalCondition.VetSeen = value.VetSeen;

      _unitOfWork.AnimalConditionRepository.Update(updateAnimalCondition);
      _unitOfWork.Save();
      return Ok(updateAnimalCondition);
    }
  }
}