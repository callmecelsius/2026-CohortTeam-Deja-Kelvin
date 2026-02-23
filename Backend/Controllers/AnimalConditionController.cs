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

    [HttpGet("{animalId}")]
    public ActionResult GetByAnimal(int animalId)
    {
      var conditions = _unitOfWork.AnimalConditionRepository
        .Get(filter: condition => condition.AnimalId == animalId);
      return Ok(conditions);
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