using System;
using System.Threading.Tasks;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize] // Add Authorize attribute to avoid un-authorized accesses
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _presenceTracker;
        public PresenceHub(PresenceTracker presenceTracker)
        {
            _presenceTracker = presenceTracker;
        }

        public override async Task OnConnectedAsync()
        {
            await _presenceTracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId);
            await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUsername());

            var currentOnlineUsers = await _presenceTracker.GetOnlineUsers();

            await Clients.All.SendAsync("GetOnlineUsers", currentOnlineUsers);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await _presenceTracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);

            await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUsername());
            await base.OnDisconnectedAsync(exception);

            var currentOnlineUsers = await _presenceTracker.GetOnlineUsers();

            await Clients.All.SendAsync("GetOnlineUsers", currentOnlineUsers);

        }

    }
}