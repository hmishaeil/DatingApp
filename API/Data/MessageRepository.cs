using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using API.Params;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _iMapper;
        public MessageRepository(DataContext dataContext, IMapper iMapper)
        {
            _iMapper = iMapper;
            _dataContext = dataContext;
        }

        public void AddMessage(Message message)
        {
            _dataContext.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _dataContext.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _dataContext.Messages.Include(m => m.Sender).Include(m => m.Receiver).SingleOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<MessageDTO>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _dataContext.Messages.
            OrderByDescending(m => m.MessageSentDate).AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(m => m.ReceiverUsername == messageParams.Username && m.ReceiverDeleted == false),
                "Outbox" => query.Where(m => m.SenderUsername == messageParams.Username && m.SenderDeleted == false),
                _ => query.Where(m => m.ReceiverUsername == messageParams.Username && m.ReceiverDeleted == false && m.MessageReadDate == null),
            };

            // As we want to return the DTO, we should project it via Mapper.
            var messages = query.ProjectTo<MessageDTO>(_iMapper.ConfigurationProvider);

            return await PagedList<MessageDTO>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);

        }

        public async Task<IEnumerable<MessageDTO>> GetMessageThread(string currentUsername, string recipientUsername)
        {
            var messages = await _dataContext.Messages.
            Include(u => u.Sender).ThenInclude(p => p.Photos).
            Include(u => u.Receiver).ThenInclude(p => p.Photos).
            Where(m => (m.ReceiverUsername == currentUsername && m.SenderUsername == recipientUsername && m.ReceiverDeleted == false) ||
                       (m.ReceiverUsername == recipientUsername && m.SenderUsername == currentUsername && m.SenderDeleted == false)).OrderBy(m => m.MessageSentDate).ToListAsync();

            var unreadMessages = messages.Where(m => m.MessageReadDate == null && m.Receiver.UserName == currentUsername).ToList();

            if (unreadMessages.Any())
            {
                foreach (var unreadMsg in unreadMessages)
                {
                    unreadMsg.MessageReadDate = DateTime.Now;
                }
            }

            await _dataContext.SaveChangesAsync();

            return _iMapper.Map<IEnumerable<MessageDTO>>(messages);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _dataContext.SaveChangesAsync() > 0;
        }
    }
}