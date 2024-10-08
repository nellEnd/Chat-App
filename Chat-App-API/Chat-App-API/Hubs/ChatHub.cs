using Chat_App_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Chat_App_API.Hubs
{
	public class ChatHub : Hub
	{
		// When client connects
		public override async Task OnConnectedAsync()
		{
			if (Context.User?.Identity != null && Context.User.Identity.IsAuthenticated)
				// If user logged in, send confirmation
				await Clients.Caller.SendAsync("ReceiveMessage", "System", "Welcome to the chat!");
			else
				// If not authorized, let user know
				await Clients.Caller.SendAsync("ReceiveMessage", "System", "You are not authorized.");

			await base.OnConnectedAsync();
		}

		public async Task SendMessage (string user, string message)
		{
			// Broadcast the message to all connected clients
			Console.WriteLine($"User: {user}, Message: {message}");
			await Clients.All.SendAsync("ReceiveMessage", user, message);
		}
	}
}
