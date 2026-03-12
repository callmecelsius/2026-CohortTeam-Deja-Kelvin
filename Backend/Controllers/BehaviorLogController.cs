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

        [HttpGet]
        public IEnumerable<BehaviorLog> Get()
        {
            var behaviorLogs = _unitOfWork.BehaviorLogRepository.Get();
            return behaviorLogs;
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

            return Ok(new BehaviorLogDto()
            {
                Id = behaviorLog.Id,
                AnimalId = behaviorLog.AnimalId,
                ReportedByUserId = behaviorLog.ReportedByUserId,
                BehaviorType = behaviorLog.BehaviorType,
                Notes = behaviorLog.Notes,
                DateReported = behaviorLog.DateReported,
                Resolved = behaviorLog.Resolved
            });
        }

        //[HttpGet("animal/{animalId}")]
        //public ActionResult GetByAnimal(int animalId)
        //{
        //  var behaviors = _unitOfWork.BehaviorLogRepository
        //    .Get(filter: behavior => behavior.AnimalId == animalId);
        //  return Ok(behaviors);
        //}
        [HttpGet("animal/{animalId}")]
        public ActionResult GetByAnimal(int animalId)
        {
            var behaviors = _unitOfWork.BehaviorLogRepository
        .Get(filter: b => b.AnimalId == animalId);

            var users = _unitOfWork.UserRepository.Get();

            var result = behaviors
                .Join(users,
                    b => b.ReportedByUserId,
                    u => u.Id,
                    (b, u) => new BehaviorLogGetDto
                    {
                        Id = b.Id,
                        AnimalId = b.AnimalId,
                        ReportedByUserId = b.ReportedByUserId,
                        ReportedByName = u.FirstName + " " + u.LastName,
                        BehaviorType = b.BehaviorType,
                        Notes = b.Notes,
                        DateReported = b.DateReported,
                        Resolved = b.Resolved
                    });

            return Ok(result);
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
            var newBehaviorLogDto = new BehaviorLogDto()
            {
                Id = newBehaviorLog.Id,
                AnimalId = newBehaviorLog.AnimalId,
                ReportedByUserId = newBehaviorLog.ReportedByUserId,
                BehaviorType = newBehaviorLog.BehaviorType,
                Notes = newBehaviorLog.Notes,
                DateReported = newBehaviorLog.DateReported,
                Resolved = newBehaviorLog.Resolved
            };
            return CreatedAtAction(nameof(Get), new { id = newBehaviorLog.Id }, newBehaviorLogDto);
        }

        // PUT 

        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] BehaviorLogPutDto value)
        {
            var updateBehaviorLog = _unitOfWork.BehaviorLogRepository.GetByID(id);
            if (updateBehaviorLog == null)
            {
                return NotFound();
            }

            updateBehaviorLog.Resolved = value.Resolved;

            _unitOfWork.BehaviorLogRepository.Update(updateBehaviorLog);
            _unitOfWork.Save();
            var updatedBehaviorLogDto = new BehaviorLogDto()
            {
                Id = updateBehaviorLog.Id,
                AnimalId = updateBehaviorLog.AnimalId,
                ReportedByUserId = updateBehaviorLog.ReportedByUserId,
                BehaviorType = updateBehaviorLog.BehaviorType,
                Notes = updateBehaviorLog.Notes,
                DateReported = updateBehaviorLog.DateReported,
                Resolved = updateBehaviorLog.Resolved
            };
            return Ok(updatedBehaviorLogDto);
        }

        // DELETE

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var behaviorLogDb = _unitOfWork.BehaviorLogRepository.GetByID(id);
            if (behaviorLogDb == null)
            {
                return NotFound();
            }

            _unitOfWork.BehaviorLogRepository.Delete(id);
            _unitOfWork.Save();
            return Ok();
        }
    }
}

