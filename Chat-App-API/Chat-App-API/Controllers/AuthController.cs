using Chat_App_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
		[HttpGet("hej")]
		public IActionResult Hej()
		{
			return Ok("Hej!!");
		}

		[HttpPost("login")]
		public IActionResult Login([FromBody] LoginRequest request)
		{
			var testUsername1 = "nelly";
			var testPass1 = "password";

			var testUse2 = "kalle";

			List<User> users = new List<User>();
			users.Add(new User { Username = "nelly", PasswordHash = "bajs" });
			users.Add(new User { Username = "kalle", PasswordHash = "bajs" });

			var user = users.SingleOrDefault(x => x.Username == request.Username);

			if (user == null || request.Password != user.PasswordHash)
			{
				return Unauthorized(new { message = "Invalid credentials" });
			}


			//if (request == null || request.Username != testUsername1 || request.Password != testPass1)
			//return Unauthorized(new { message = "Invalid credentials" });

			var token = GenerateJwtToken(request.Username, request.Password);
			return Ok(new {Token = token});
		}

		private static string GenerateJwtToken(string username, string password)
		{
			var tokenHandler = new JwtSecurityTokenHandler();
			var key = Encoding.ASCII.GetBytes("d5df9b30d5891d6e19c3eda79aef6fa0181cb5f0da195f2bbb54022c7d217b1b"); // private key

			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(new Claim[]
				{
		  new Claim(ClaimTypes.Name, username)
				}),
				Expires = DateTime.UtcNow.AddHours(2),
				SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
			};

			var token = tokenHandler.CreateToken(tokenDescriptor);
			return tokenHandler.WriteToken(token);
		}
	}
}
