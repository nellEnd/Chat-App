using Chat_App_API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System.Collections.Generic;

namespace Chat_App_API.Data
{
	public class ChatContext:DbContext
	{
		public ChatContext(DbContextOptions<ChatContext> options) : base(options) { }
		public DbSet<ChatMessage> ChatMessages { get; set; } // The table of chat messages

		public DbSet<User> Users { get; set; } // The table consisting of users
		public DbSet<Conversation> Conversations { get; set; } // The table consisting of convos

	}
}
