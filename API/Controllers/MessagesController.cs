using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using API.Params;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;
        public MessagesController(IUserRepository userRepository,
        IMessageRepository messageRepository,
        IMapper mapper)
        {
            _messageRepository = messageRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessageDTO createMessageDTO)
        {
            var username = User.GetUsername();
            if (username == createMessageDTO.ReceiverUsername.ToLower()) return BadRequest("Not able to send message to itself.");

            var sender = await _userRepository.GetUserByUsernameAsync(username);
            var receiver = await _userRepository.GetUserByUsernameAsync(createMessageDTO.ReceiverUsername);

            if (receiver == null) return NotFound("Recipient not found");

            var message = new Message
            {
                Sender = sender,
                SenderUsername = sender.UserName,
                Receiver = receiver,
                ReceiverUsername = receiver.UserName,
                Content = createMessageDTO.Content
            };

            _messageRepository.AddMessage(message);

            if (await _messageRepository.SaveAllAsync()) return Ok(_mapper.Map<MessageDTO>(message)); // Return mapped MessageDTO from message 

            return BadRequest("Failed to create the message!");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();

            var messages = await _messageRepository.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(messages.CurrentPage, messages.TotalPages, messages.PageSize, messages.TotalCount);

            return messages;
        }

        [HttpGet("thread/{other_username}")]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetMessageThread(string otherUsername)
        {
            var currentUsername = User.GetUsername(); // The logged in username

            var messageThread = await _messageRepository.GetMessageThread(currentUsername, otherUsername);
            return Ok(messageThread);
        }
    }
}