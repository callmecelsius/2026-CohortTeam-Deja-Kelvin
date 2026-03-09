
using Backend.Data;
using Backend.Data.Models;
using Backend.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        

        private IUnitOfWork _unitOfWork;

        public UserController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public IEnumerable<User> Get()
   {
            var userTemp = _unitOfWork.UserRepository.Get();
            return userTemp;
        }

        /*
         {
            "id": 0,
            "firstname": "Max",
            "lastname": "Wil",
            "employeeId": 50002,
            "phoneNumber": 1234567786,
            "email": "max@example.com",
            "address": "123 Main",
            "city": "New York",
            "state": "NY",
            "zip": 10002,
            "createdOn": "2026-02-18T19:38:31.39391",
            "updatedOn": "2026-02-18T19:38:31.394016",
            "behaviorLogs": [],
            "fosterParents": [],
            "orders": []
        }
         */

        [HttpGet("email/{email}")]
        public ActionResult GetEmail(string email)
        {
            var userTemp = _unitOfWork.UserRepository.Get(u => u.Email == email);

            if (!userTemp.Any())
            {
                return NotFound();
            }
            var user = userTemp.FirstOrDefault();           
            var userDto = new UsersDto
            {
                Id = user!.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                EmployeeId = user.EmployeeId,
                Phone = user.PhoneNumber,
                Email = user.Email,
                Address = user.Address,
                City = user.City,
                State = user.State,
                Zip = user.Zip,
                CreatedOn = user.CreatedOn,
                UpdatedOn = user.UpdatedOn
            };

            var fosterParents = _unitOfWork.FosterParentRepository.Get(
                f => f.UserId == user!.Id,
                includeProperties: "FosterHome"
            );
            if (fosterParents.Any())
            {
                var fosterParent = fosterParents.FirstOrDefault();
                userDto.FosterParent = new FosterParentGetDto {
                    ApprovedDate = fosterParent!.ApprovedDate,
                    FosterHomeId = fosterParent.FosterHomeId,
                    Id = fosterParent.Id,
                    Status = fosterParent.Status,
                    UserId = fosterParent.UserId,
                    FosterHome = fosterParent.FosterHome != null ? new FosterHomeDto {
                        Id = fosterParent.FosterHome.Id,
                        HomeName = fosterParent.FosterHome.HomeName,
                        Address = fosterParent.FosterHome.Address,
                        Capacity = fosterParent.FosterHome.Capacity
                    } : null
                };

            }

            return Ok(userDto);
        }

        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            var userTemp = _unitOfWork.UserRepository.GetByID(id);

            if (userTemp == null)
            {
                return BadRequest();
            }

            return Ok(userTemp);
        }


        [HttpPost]
        //http://localhost:5282/api/User
         /*Sample Body
          * 
          * {
          "firstname": "Sam",
          "lastname": "Wilson",
          "employeeId": 50001,
          "phoneNumber": 1234567894,
          "email": "sam@example.com",
          "address": "123 Main Street",
          "city": "New York",
          "state": "NY",
          "zip": 10001,
          "createdOn": "2026-02-17T10:30:00", 
          "updatedOn": "2026-02-17T10:30:00"
        }*/
        public ActionResult RegisterUser([FromBody] UsersDto userDto)
        {
            try
            {
                if (userDto == null)
                {
                    return BadRequest("User details are required.");
                }
                // Auto-assign next employeeId if registering as employee
                int? assignedEmployeeId = null;
                if (userDto.EmployeeId != null)
                {
                    var allUsers = _unitOfWork.UserRepository.Get(u => u.EmployeeId != null);
                    var maxId = allUsers.Any() ? allUsers.Max(u => u.EmployeeId!.Value) : 0;
                    assignedEmployeeId = maxId + 1;
                }

                var user = new User
                {
                    FirstName = userDto.FirstName,
                    LastName = userDto.LastName,
                    EmployeeId = assignedEmployeeId,
                    PhoneNumber = userDto.Phone,
                    Email = userDto.Email,
                    Address = userDto.Address,
                    City = userDto.City,
                    State = userDto.State,
                    Zip = userDto.Zip,
                    CreatedOn = DateTime.UtcNow,
                    UpdatedOn = DateTime.UtcNow
                };

                _unitOfWork.UserRepository.Insert(user);
                _unitOfWork.Save();
                _unitOfWork.Dispose();
                return Ok(new
                {
                    id = user.Id,
                    message = "user registered successfully.",
                });

            }            
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred." });
            }

        }

        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] UsersDto userDto)
        {
            var user = _unitOfWork.UserRepository.GetByID(id);
            if (user == null)
            {
                return NotFound();
            }

            user.FirstName = userDto.FirstName;
            user.LastName = userDto.LastName;
            user.PhoneNumber = userDto.Phone;
            user.Email = userDto.Email;
            user.Address = userDto.Address;
            user.City = userDto.City;
            user.State = userDto.State;
            user.Zip = userDto.Zip;
            user.UpdatedOn = DateTime.UtcNow;

            _unitOfWork.UserRepository.Update(user);
            _unitOfWork.Save();
            return Ok();
        }
    }
}
