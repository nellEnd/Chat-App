using Chat_App_API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System.Collections.Generic;

namespace Chat_App_API.Data
{
	public class ChatContext:DbContext
	{
		public ChatContext(DbContextOptions<ChatContext> options) : base(options) { }
		public DbSet<ChatMessage> ChatMessages { get; set; } 

		public DbSet<User> Users { get; set; } 
		public DbSet<Conversation> Conversations { get; set; } 

		public DbSet<PrivateChatRoom> PrivateChatRooms { get; set; } 

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);
			modelBuilder.Entity<PrivateChatRoom>()
               	.HasMany(c => c.Participants)
	            .WithMany(u => u.PrivateChatRooms); // Many-to-Many relation mellan chattrum och användare

		}

	}
}
