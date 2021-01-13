using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class CreateMessageDTO
    {
        [Required] public string ReceiverUsername { get; set; }
        [Required] public string Content { get; set; }
    }
}