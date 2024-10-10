namespace Chat_App_API.DTO
{
	public class UserDTO
	{
		public required string Username { get; set; }
		public required string Password { get; set; }
		public required string ConfirmPassword { get; set; }

	}
}
