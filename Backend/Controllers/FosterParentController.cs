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
        public IEnumerable<FosterUserGetDto> Get()
        {
            var fosterParentTemp = _unitOfWork.FosterParentRepository.Get();
            var fosterHomesList = _unitOfWork.FosterHomeRepository.Get();
            var usersList = _unitOfWork.UserRepository.Get();

            fosterParentTemp.ToList().ForEach(fp =>
            {
                fp.FosterHome = fosterHomesList.Where(fh => fh.Id == fp.FosterHomeId).FirstOrDefault();
                fp.User = usersList.Where(u => u.Id == fp.UserId).FirstOrDefault();
            });

            return fosterParentTemp.Select(fp => new FosterUserGetDto()
            {
                Id = fp.UserId,
                FirstName = fp.User?.FirstName,
                LastName = fp.User?.LastName,
                Phone = fp.User?.PhoneNumber,
                Email = fp.User?.Email,
                Address = fp.User?.Address,
                City = fp.User?.City,
                State = fp.User?.State,
                Zip = fp.User?.Zip,
                CreatedOn = fp.User?.CreatedOn,
                FosterParent = new FosterParentGetDto()
                {
                    Id = fp.Id,
                    UserId = fp.UserId,
                    FosterHomeId = fp.FosterHomeId,
                    ApprovedDate = fp.ApprovedDate,
                    Status = fp.Status,
                    FosterHome = new FosterHomeDto()
                    {
                        Id = fp.FosterHome?.Id,
                        HomeName = fp.FosterHome?.HomeName,
                        Address = fp.FosterHome?.Address,
                    }
                }
            }).ToList();
        }

        [HttpGet("GetFosterUsers/{fosterHomeID}")]
        public ActionResult GetFosterUsers(int fosterHomeID)
        {
            var result = (
                from fp in _unitOfWork.FosterParentRepository.Get()
                join u in _unitOfWork.UserRepository.Get()
                    on fp.UserId equals u.Id
                where fp.FosterHomeId == fosterHomeID
                select new
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName
                }
            ).ToList();

            if (!result.Any())
                return NotFound();

            return Ok(result);
        }

        [HttpGet("status/{userId}")]
        public ActionResult GetStatusByUserId(int userId)
        {
            var fosterParent = _unitOfWork.FosterParentRepository
        .Get(x => x.UserId == userId)
        .FirstOrDefault();

            if (fosterParent == null)
            {
                return NotFound();
            }

            return Ok(new { status = fosterParent.Status });
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

        [HttpGet("status")]
        public ActionResult GetPendingStatus()
        {
            var status = _unitOfWork.FosterParentRepository
                .Get(filter: fosterparent => fosterparent.Status == "Pending")
                .Count();

            return Ok(new { status });
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