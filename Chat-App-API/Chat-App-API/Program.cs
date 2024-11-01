

using Chat_App_API.Data;
using Chat_App_API.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add CORS
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowReactApp", builder =>
	{
		builder.WithOrigins("https://localhost:3001") // React URL 
			   .AllowAnyHeader()
			   .AllowAnyMethod()
			   .AllowCredentials();
	});
});

// Add services to the container.
builder.Services.AddSignalR();
builder.Services.AddControllers();

var jwtSecretKey = builder.Configuration["JwtSettings:SecretKey"];

if (string.IsNullOrEmpty(jwtSecretKey))
{
	throw new InvalidOperationException("JWT secret key is not configured.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(options =>
	{
		options.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = false,
			ValidateAudience = false,
			ValidateLifetime = true,
			ValidateIssuerSigningKey = true,
			IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey))
		};

		// Handle the JWT in the SignalR connection
		options.Events = new JwtBearerEvents
		{
			OnMessageReceived = context =>
			{
				// Check for the access token in the query string
				var accessToken = context.Request.Query["access_token"];

				// If found, set it
				if (!string.IsNullOrEmpty(accessToken) && context.HttpContext.Request.Path.StartsWithSegments("/chathub"))
				{
					context.Token = accessToken;
				}

				return Task.CompletedTask;
			}
		};
	});

builder.Services.AddAuthorization();

// Add SQLite database
builder.Services.AddDbContext<ChatContext>(options =>
	options.UseSqlite(builder.Configuration.GetConnectionString("ChatDbConnection")));

// Only use Https, points at self-signed certificate
builder.WebHost.ConfigureKestrel(options =>
{

	options.ListenAnyIP(5001, listenOptions =>
	{
		listenOptions.UseHttps("C:/Users/nelly/source/repos/ChatApp/certis/mylocalcert.pfx", "x5jZ};9r23Kw");
	});
});


var app = builder.Build();


app.UseCors("AllowReactApp");

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
	app.UseExceptionHandler("/Error");
	app.UseHsts();
}

app.UseHttpsRedirection();
app.UseDefaultFiles(); // Enables default files (e.g., index.html)
app.UseStaticFiles(); // Allows serving static files from wwwroot
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapHub<ChatHub>("/chathub");
app.MapControllers();

app.Run();
