using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _iMapper;
        public UserRepository(DataContext dataContext, IMapper iMapper)
        {
            _dataContext = dataContext;
            _iMapper = iMapper;
        }

        public async Task<MemberDTO> GetMemberAsync(string username)
        {
            return await _dataContext.Users.Where(
                user => user.UserName == username
            ).ProjectTo<MemberDTO>(_iMapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<MemberDTO>> GetMembersAsync()
        {
            return await _dataContext.Users.ProjectTo<MemberDTO>(_iMapper.ConfigurationProvider).ToListAsync();
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _dataContext.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _dataContext.Users.
            Include(p => p.Photos).
            SingleOrDefaultAsync(user => user.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _dataContext.Users.
            Include(p => p.Photos).
            ToListAsync<AppUser>();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _dataContext.SaveChangesAsync() > 0;
        }

        public void Update(AppUser appUser)
        {
            _dataContext.Entry(appUser).State = EntityState.Modified;
        }
    }
}