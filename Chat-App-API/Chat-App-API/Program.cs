

using Chat_App_API.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using Microsoft.AspNetCore.Server.Kestrel.Https;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Add CORS
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowReactApp", builder =>
	{
		builder.WithOrigins("https://localhost:3000") // React URL 
			   .AllowAnyHeader()
			   .AllowAnyMethod()
			   .AllowCredentials();
	});
});

// Add services to the container.
builder.Services.AddSignalR();
builder.Services.AddControllers();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(options =>
	{
		options.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = false,
			ValidateAudience = false,
			ValidateLifetime = true,
			ValidateIssuerSigningKey = true,
			IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("d5df9b30d5891d6e19c3eda79aef6fa0181cb5f0da195f2bbb54022c7d217b1b")) // Replace with your secret key
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


builder.WebHost.ConfigureKestrel(options =>
{
	options.ListenAnyIP(5068); // HTTP
	options.ListenAnyIP(7188, listenOptions =>
	{
		//listenOptions.UseHttps("C:/Users/nelly/source/repos/ChatApp/Certificat/mycert.pfx", "2nnK1nto6+VV"); // HTTPS
		listenOptions.UseHttps();
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
