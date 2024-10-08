namespace Chat_App_API.Models
{
	public class User
	{
		public int Id { get; set; }
		public required string Username { get; set; }
		public required string PasswordHash { get; set; }
	}

	public class LoginRequest
	{
		public required string Username { get; set; }
		public required string Password { get; set; }
	}
}
