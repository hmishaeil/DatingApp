using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        // private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly SignInManager<AppUser> _singInManager;
        private readonly UserManager<AppUser> _userManager;

        public AccountController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> singInManager,
            ITokenService tokenService, IMapper mapper)
        {
            _singInManager = singInManager;
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {
            if (await UserExists(registerDTO.Username)) return BadRequest("username already exists!");

            var user = _mapper.Map<AppUser>(registerDTO); // Mapping from registerDTO to AppUser


            user.UserName = registerDTO.Username.ToLower();

            var result = await _userManager.CreateAsync(user, registerDTO.Password); // Create and save the user in the database

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRolesAsync(user, new[] { "Member" });

            if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);

            return new UserDTO
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender,
            };

        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {

            var user = await _userManager.Users.Include(x => x.Photos).SingleOrDefaultAsync<AppUser>(x => x.UserName == loginDTO.Username.ToLower());

            if (user == null) return Unauthorized("username not found");


            var result = await _singInManager.CheckPasswordSignInAsync(user, loginDTO.Password, false);
            if (!result.Succeeded) return Unauthorized();

            return new UserDTO
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl = user.Photos?.FirstOrDefault(photo => photo.IsMain == true)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };

        }
        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}