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

        // POST api/<ValuesController>
        [HttpPost]
        public ActionResult Post([FromBody] PostAnimalDto value)
        {
            var newAnimal = new Animal()
            {
                Name = value.Name,
                Breed = value.Breed,
                Weight = value.Weight,
                Height = value.Height,
                IntakeDate = value.IntakeDate,
                Status = value.Status
            };

            _unitOfWork.AnimalRepository.Insert(newAnimal);
            _unitOfWork.Save();
            _unitOfWork.Dispose();
            return CreatedAtAction(nameof(Get), newAnimal);
        }

        // PUT api/<ValuesController>/5
        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] Animal value)
        {
            var animalDb = _unitOfWork.AnimalRepository.GetByID(id);
            if (animalDb == null)
            {
                return BadRequest();
            }

            animalDb.Name = value.Name;
            animalDb.Breed = value.Breed;
            animalDb.Weight = value.Weight;
            animalDb.Height = value.Height;
            animalDb.IntakeDate = value.IntakeDate;
            animalDb.Status = value.Status;

            _unitOfWork.AnimalRepository.Update(animalDb);
            _unitOfWork.Save();
            return Ok();
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            _unitOfWork.AnimalRepository.Delete(id);
            _unitOfWork.Save();
            return Ok();
        }
    }
}
