using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _iMapper;
        private readonly IPhotoService _iPhotoService;
        public UsersController(IUserRepository userRepository,
        IMapper iMapper,
        IPhotoService iPhotoService)
        {
            _userRepository = userRepository;
            _iMapper = iMapper;
            _iPhotoService = iPhotoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers()
        {
            var users = await _userRepository.GetMembersAsync();
            return Ok(users);
        }

        [HttpGet("{username}", Name = "GetUser")]
        public async Task<ActionResult<MemberDTO>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDTO)
        {

            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(username);
            _iMapper.Map(memberUpdateDTO, user);

            _userRepository.Update(user);

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to save the user.");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDTO>> AddPhoto(IFormFile file)
        {
            var username = User.GetUsername(); // User class extention
            var user = await _userRepository.GetUserByUsernameAsync(username);
            var result = await _iPhotoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if (await _userRepository.SaveAllAsync())
            {
                // return _iMapper.Map<PhotoDTO>(photo);
                // return CreatedAtRoute("GetUser", _iMapper.Map<PhotoDTO>(photo));
                return CreatedAtRoute("GetUser", new
                {
                    username = user.UserName
                }, _iMapper.Map<PhotoDTO>(photo));
            }
            return BadRequest("Something went wrong while adding photos!");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId){
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(username);
            var photo = user.Photos.FirstOrDefault(photo => photo.Id == photoId);

            if(photo.IsMain) return BadRequest("The photo is already main photo");

            var currentMain = user.Photos.FirstOrDefault(photo => photo.IsMain == true);
            if (currentMain != null) currentMain.IsMain = false;

            photo.IsMain = true;

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to set main photo.");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId){
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(username);
            var photo = user.Photos.FirstOrDefault(photo => photo.Id == photoId);

            if(photo == null) return NotFound();
            if(photo.IsMain) return BadRequest("The main photo can not be deleted");
            if(photo.PublicId != null) {
                var result = await _iPhotoService.DeletePhotoAsync(photo.PublicId);
                if(result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo); // Just adding the tracking flag

            if(await _userRepository.SaveAllAsync()){
                return Ok();
            }

            return BadRequest("Failed to delete the resource.");
        }
    }
}