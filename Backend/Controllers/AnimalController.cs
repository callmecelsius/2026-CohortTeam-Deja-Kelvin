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
             var animals = fosterAnimal.Where(a => a.Animal != null).Select(a => a.Animal).Select(a => new AnimalDto {
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
            _unitOfWork.AnimalRepository.Delete(id);
            _unitOfWork.Save();
            return Ok();
        }
    }
}
