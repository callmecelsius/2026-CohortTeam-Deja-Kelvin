using Backend.Data;
using Backend.Data.Models;
using Backend.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AccountController : ControllerBase
  {
    private readonly AppDbContext;
    private readonly UserManager<IdentityUser> _userManager;
  }
}