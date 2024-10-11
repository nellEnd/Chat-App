using Chat_App_API.Data;
using Chat_App_API.DTO;
using Chat_App_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Chat_App_API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly ChatContext _context;
		private readonly IConfiguration _config;

		public AuthController(ChatContext context, IConfiguration config)
		{
			_context = context;
			_config = config;
		}


		[HttpPost("signup")]
		public IActionResult Signup([FromBody] UserDTO userDto)
		{
			// Check if the password and confirm password match
			if (userDto.Password != userDto.ConfirmPassword)
				return BadRequest(new { message = "Passwords do not match." });

			// Hash the user's password using BCrypt for security
			var hashedPass = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

			// Create a new User object with the provided username and the hashed password
			var user = new User { Username = userDto.Username, PasswordHash = hashedPass };

			// Add new user to database
			_context.Users.Add(user);

			// Save new user to database
			_context.SaveChanges();

			return Ok(new {message = "User registered successfully!"});
		}

		[HttpPost("login")]
		public IActionResult Login([FromBody] LoginDTO loginDto)
		{
			// Check if user exists in database
			var user = _context.Users.SingleOrDefault(u => u.Username == loginDto.Username);

			// If user does not exist or the password does not match the stored hash, return unauthorized
			if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
				return Unauthorized(new {message= "Invalid credentials." });

			// If login detail are valid generate a JWT token for the user
			var token = GenerateJwtToken(user);

			// Return the token as a part of the successful login response
			return Ok(new {Token = token});
		}

		private string GenerateJwtToken(User user)
		{
			var tokenHandler = new JwtSecurityTokenHandler();

			// Fetch the secret key from configuration
			var key = Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]);

			// Set token properties
			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(new Claim[]
				{
					// Add claims to the token(username)
	            	  new Claim(ClaimTypes.Name, user.Username)
				}),
				Expires = DateTime.UtcNow.AddHours(2),

				// Specify the signing algorithm and the key used for signing the token
				SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
			};

			var token = tokenHandler.CreateToken(tokenDescriptor);
			return tokenHandler.WriteToken(token);
		}



		//NOT IN USE
		[HttpPost("invite")]
		public IActionResult InviteToPrivateChat([FromBody] PrivateChatRequest chatReq)
		{
			var senderUser = _context.Users.FirstOrDefault(u => u.Username == chatReq.SenderUsername);
			var receivedUser = _context.Users.FirstOrDefault(u => u.Username == chatReq.ReceivedUsername);

			if (receivedUser == null)
			{
				return NotFound(new { message = "User not found." });
			}

			var privateChatRoom = new PrivateChatRoom
			{
				IsPrivate = true,
				Participants = new List<User> { senderUser, receivedUser }
			};

			_context.PrivateChatRooms.Add(privateChatRoom);
			_context.SaveChanges();

			return Ok(new { message = "Invite sent" });
		}

		[HttpGet("users")]
		public async Task<IActionResult> GetUsers()
		{
			var users = await _context.Users.Select(u => new { u.Id, u.Username }).ToListAsync();

			return Ok(users);
		}
	}
}
