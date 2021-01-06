using API.Helpers;

namespace API.Params
{
    public class MessageParams: PaginationParams
    {
        public string Username { get; set; } // Currently logged in user
        public string Container { get; set; } = "Unread"; // Or Inbox, Outbox
    }
}