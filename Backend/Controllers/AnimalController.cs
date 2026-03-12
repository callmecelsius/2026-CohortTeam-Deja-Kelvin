using Backend.Data;
using Backend.Data.Models;
using Backend.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnimalController : ControllerBase
    {
        private IUnitOfWork _unitOfWork; 

        public AnimalController(IUnitOfWork unitOfWork) 
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/<ValuesController>
        [HttpGet]
        public IEnumerable<Animal> Get()
        {
            var animalTemp = _unitOfWork.AnimalRepository.Get();
            return animalTemp;
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            var animalTemp = _unitOfWork.AnimalRepository.GetByID(id);
            if (animalTemp == null)
            {
                return BadRequest();
            }

            return Ok(animalTemp);
        }

        // GET api/Animal/FosterHome/1
        [HttpGet("FosterHome/{fosterHomeId}")]
        public IEnumerable<AnimalDto> GetFosterAnimals(int fosterHomeId)
        {
            var fosterAnimal = _unitOfWork.FosterAssignmentRepository.Get(f => f.FosterHomeId == fosterHomeId, includeProperties: "Animal");
             var animals = fosterAnimal.Where(a => a.Animal != null).Select(a => a.Animal!).Select(a => new AnimalDto {
                Id = a.Id,
                Name = a.Name,
                Breed = a.Breed,
                Weight = a.Weight,
                Height = a.Height,
                IntakeDate = a.IntakeDate,
                Status = a.Status,                
                Type = a.Type,
                AnimalPhoto = a.AnimalPhoto
            }).ToList();

            return animals;
        } 

        // POST api/<ValuesController>
        [HttpPost]
        public ActionResult Post([FromBody] PostAnimalDto value)
        {
            byte[]? photoBytes = null;
            if (!string.IsNullOrEmpty(value.AnimalPhoto))
            {
                photoBytes = Convert.FromBase64String(value.AnimalPhoto);
            }

            var newAnimal = new Animal()
            {
                Name = value.Name,
                Type = value.Type,
                Breed = value.Breed,
                Weight = value.Weight,
                Height = value.Height,
                IntakeDate = value.IntakeDate,
                Status = value.Status,
                AnimalPhoto = photoBytes
            };

            _unitOfWork.AnimalRepository.Insert(newAnimal);
            _unitOfWork.Save();
            _unitOfWork.Dispose();
            return CreatedAtAction(nameof(Get), newAnimal);
        }

        // PUT api/<ValuesController>/5
        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] PostAnimalDto value)
        {
            var animalDb = _unitOfWork.AnimalRepository.GetByID(id);
            if (animalDb == null)
            {
                return BadRequest();
            }

            animalDb.Name = value.Name;
            animalDb.Type = value.Type;
            animalDb.Breed = value.Breed;
            animalDb.Weight = value.Weight;
            animalDb.Height = value.Height;
            animalDb.IntakeDate = value.IntakeDate;
            animalDb.Status = value.Status;

            if (!string.IsNullOrEmpty(value.AnimalPhoto))
            {
                animalDb.AnimalPhoto = Convert.FromBase64String(value.AnimalPhoto);
            }

            _unitOfWork.AnimalRepository.Update(animalDb);
            _unitOfWork.Save();
            return Ok();
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var animal = _unitOfWork.AnimalRepository.GetByID(id);
            if (animal == null)
            {
                return NotFound();
            }

            // Remove related records before deleting the animal
            var assignments = _unitOfWork.FosterAssignmentRepository
                .Get(fa => fa.AnimalId == id);
            foreach (var assignment in assignments)
            {
                _unitOfWork.FosterAssignmentRepository.Delete(assignment.Id);
            }

            var conditions = _unitOfWork.AnimalConditionRepository
                .Get(ac => ac.AnimalId == id);
            foreach (var condition in conditions)
            {
                _unitOfWork.AnimalConditionRepository.Delete(condition.Id);
            }

            var behaviorLogs = _unitOfWork.BehaviorLogRepository
                .Get(bl => bl.AnimalId == id);
            foreach (var log in behaviorLogs)
            {
                _unitOfWork.BehaviorLogRepository.Delete(log.Id);
            }

            _unitOfWork.AnimalRepository.Delete(id);
            _unitOfWork.Save();
            return Ok();
        }

        // GET api/Animal/5/foster-home
        [HttpGet("{id}/foster-home")]
        public ActionResult GetAnimalFosterHome(int id)
        {
            var animal = _unitOfWork.AnimalRepository.GetByID(id);
            if (animal == null)
            {
                return NotFound("Animal not found.");
            }

            var now = DateTime.UtcNow;
            var assignment = _unitOfWork.FosterAssignmentRepository
                .Get(fa => fa.AnimalId == id && (fa.EndDate == null || fa.EndDate > now), includeProperties: "FosterHome")
                .FirstOrDefault();

            if (assignment?.FosterHome == null)
            {
                return Ok(new { assigned = false });
            }

            return Ok(new
            {
                assigned = true,
                fosterHomeId = assignment.FosterHome.Id,
                homeName = assignment.FosterHome.HomeName,
                address = assignment.FosterHome.Address
            });
        }

        // POST api/Animal/5/assign
        [HttpPost("{id}/assign")]
        public ActionResult AssignToFosterHome(int id, [FromBody] AssignFosterHomeDto dto)
        {
            var animal = _unitOfWork.AnimalRepository.GetByID(id);
            if (animal == null)
            {
                return NotFound("Animal not found.");
            }

            var fosterHome = _unitOfWork.FosterHomeRepository.GetByID(dto.FosterHomeId);
            if (fosterHome == null)
            {
                return NotFound("Foster home not found.");
            }

            // Check if foster home is at capacity
            var now = DateTime.UtcNow;
            var currentCount = _unitOfWork.FosterAssignmentRepository
                .Get(fa => fa.FosterHomeId == dto.FosterHomeId && (fa.EndDate == null || fa.EndDate > now))
                .Count();

            if (fosterHome.Capacity.HasValue && currentCount >= fosterHome.Capacity.Value)
            {
                return BadRequest("This foster home is at full capacity.");
            }

            // End any existing active assignments for this animal
            var existingAssignments = _unitOfWork.FosterAssignmentRepository
                .Get(fa => fa.AnimalId == id && (fa.EndDate == null || fa.EndDate > now));
            foreach (var old in existingAssignments)
            {
                old.EndDate = now;
                _unitOfWork.FosterAssignmentRepository.Update(old);
            }

            var assignment = new FosterAssignment
            {
                AnimalId = id,
                FosterHomeId = dto.FosterHomeId,
                StartDate = now,
                EndDate = null
            };

            _unitOfWork.FosterAssignmentRepository.Insert(assignment);
            _unitOfWork.Save();
            return Ok();
        }
    }
}
