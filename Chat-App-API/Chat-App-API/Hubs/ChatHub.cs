using Chat_App_API.Data;
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
		private readonly ChatContext _context;

		public ChatHub(ChatContext context)
		{
			_context = context;
		}

		// When client connects
		public override async Task OnConnectedAsync()
		{
			//If logged in, load last 50 messages
			if (Context.User?.Identity != null && Context.User.Identity.IsAuthenticated)
			{
				var messages = _context.ChatMessages
					.Where(m => m.ConversationId == null)
					.OrderBy(m => m.Timestamp)
					.Take(50)
					.ToList();
				
				foreach (var message in messages)
				{
					await Clients.Caller.SendAsync("ReceiveMessage", message.Username, message.Message);
				}
			}
			else
				// If not authorized, let user know
				await Clients.Caller.SendAsync("ReceiveMessage", "System", "You are not authorized.");

			await base.OnConnectedAsync();
		}

		public async Task SendMessage (string user, string message)
		{

			var chatMessage = new ChatMessage {
				Username = user,
				Message = message,
			};

			_context.ChatMessages.Add(chatMessage);
			await _context.SaveChangesAsync(); // Save to database

			// Broadcast the message to all connected clients
			Console.WriteLine($"User: {user}, Message: {message}");
			await Clients.All.SendAsync("ReceiveMessage", user, message);
		}
	}
}
