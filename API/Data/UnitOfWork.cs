using System.Threading.Tasks;
using API.Interfaces;
using AutoMapper;

namespace API.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _iMapper;
        public UnitOfWork(DataContext dataContext, IMapper iMapper)
        {
            _iMapper = iMapper;
            _dataContext = dataContext;
        }

        public IUserRepository UserRepository => new UserRepository(_dataContext, _iMapper);
        public IMessageRepository MessageRepository => new MessageRepository(_dataContext, _iMapper);
        public ILikesRepository LikesRepository => new LikesRepository(_dataContext);

        public async Task<bool> Complete()
        {
            return await _dataContext.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            return _dataContext.ChangeTracker.HasChanges();
        }
    }
}