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
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public MessagesController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessageDTO createMessageDTO)
        {
            var username = User.GetUsername();
            if (username == createMessageDTO.ReceiverUsername.ToLower()) return BadRequest("Not able to send message to itself.");

            var sender = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var receiver = await _unitOfWork.UserRepository.GetUserByUsernameAsync(createMessageDTO.ReceiverUsername);

            if (receiver == null) return NotFound("Recipient not found");

            var message = new Message
            {
                Sender = sender,
                SenderUsername = sender.UserName,
                Receiver = receiver,
                ReceiverUsername = receiver.UserName,
                Content = createMessageDTO.Content
            };

            _unitOfWork.MessageRepository.AddMessage(message);

            if (await _unitOfWork.Complete()) return Ok(_mapper.Map<MessageDTO>(message)); // Return mapped MessageDTO from message 

            return BadRequest("Failed to create the message!");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();

            var messages = await _unitOfWork.MessageRepository.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(messages.CurrentPage, messages.TotalPages, messages.PageSize, messages.TotalCount);

            return messages;
        }

        [HttpGet("thread/{otherUsername}")]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessageThread(string otherUsername)
        {
            var currentUsername = User.GetUsername(); // The logged in username

            var messageThread = await _unitOfWork.MessageRepository.GetMessageThread(currentUsername, otherUsername);
            return Ok(messageThread);
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var currentUsername = User.GetUsername();

            Message message = await _unitOfWork.MessageRepository.GetMessage(id);

            if (message.Sender.UserName != currentUsername && message.Receiver.UserName != currentUsername)
            {
                return Unauthorized();
            }

            if (message.Sender.UserName == currentUsername)
            {
                message.SenderDeleted = true;
            }

            if (message.Receiver.UserName == currentUsername)
            {
                message.ReceiverDeleted = true;
            }

            if (message.SenderDeleted && message.ReceiverDeleted)
            {
                _unitOfWork.MessageRepository.DeleteMessage(message);
            }

            if (await _unitOfWork.Complete()) return Ok();

            return BadRequest("failed to delete the message for sender/receiver");

        }
    }
}