using System;

namespace API.Entities
{
    public class Message
    {
        public int Id { get; set; }

        public int SenderId { get; set; }
        public string SenderUsername { get; set; }
        public AppUser Sender { get; set; } // Related Property
        public int ReceiverId { get; set; }
        public string ReceiverUsername { get; set; }
        public AppUser Receiver { get; set; } // Related Property

        public string Content { get; set; }
        public DateTime? MessageReadDate { get; set; }
        public DateTime MessageSentDate { get; set; } = DateTime.Now;
        public bool SenderDeleted { get; set; }
        public bool ReceiverDeleted { get; set; }

    }
}