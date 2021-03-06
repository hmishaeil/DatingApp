using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        public AdminController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            // Use Project Operation to Select items
            var users = await _userManager.Users.
                                Include(user => user.UserRoles).
                                ThenInclude(userRole => userRole.Role).
                                OrderBy(user => user.UserName).
                                Select(user => new
                                { // Projecting to anonymous object
                                    Id = user.Id,
                                    Username = user.UserName,
                                    Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList()
                                }).
                                ToListAsync();
            return Ok(users);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
        {

            if(string.IsNullOrEmpty(roles)) return BadRequest("No Parameter is provided.");

            var desiredRoles = roles.Split(",").ToArray();

            var user = await _userManager.FindByNameAsync(username);
            if(user == null) return NotFound("User not found");

            var userRoles = await _userManager.GetRolesAsync(user);

            var result = await _userManager.AddToRolesAsync(user, desiredRoles.Except(userRoles));
            if (!result.Succeeded) return BadRequest(result.Errors);
            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(desiredRoles));
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok(await _userManager.GetRolesAsync(user));
        }

        [Authorize(Policy = "ModeratePhotoRole")] // accessible by admin/moderator roles
        [HttpGet("moderate-photo")]
        public ActionResult GetPhotosForModeration()
        {
            return Ok();
        }
    }
}