
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
                var user = new User
                {
                    FirstName = userDto.FirstName,
                    LastName = userDto.LastName,
                    EmployeeId = userDto.EmployeeId,
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
                return Ok("user registered successfully.");

            }            
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred." });
            }

        }
    }
}
