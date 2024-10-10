namespace Chat_App_API.Models
{
	public class PrivateChatRoom
	{
		public Guid Id { get; set; } = Guid.NewGuid();
		public bool IsPrivate { get; set; }
		public List<User> Participants { get; set; } = new List<User>(); // Users in the Chat room
	}
}
