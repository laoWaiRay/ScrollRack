using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;
using Mtg_tracker.MappingProfiles;
using Microsoft.AspNetCore.Identity;
using Mtg_tracker.Hubs;
using Mtg_tracker.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddDbContext<MtgContext>(options =>
    options
        .UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
        .UseSnakeCaseNamingConvention()
);
builder.Services.AddAutoMapper(typeof(AutoMapperProfile).Assembly);

// Custom Services
builder.Services.AddScoped<DeckStatsService>();
builder.Services.AddTransient<ITemplatedEmailSender, EmailSender>();
builder.Services.Configure<EmailSenderOptions>(builder.Configuration);

// Identity Services (authentication/authorization)
builder.Services.Configure<IdentityOptions>(options =>
{
    options.User.RequireUniqueEmail = true;
});
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<ApplicationUser>()
    .AddEntityFrameworkStores<MtgContext>();

// CORS
var MyAllowSpecificOrigins = "Client";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        policy.WithOrigins("https://localhost:3000", "http://localhost:3000", "https://192.168.1.66:3000", "http://192.168.1.66:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// SignalR
builder.Services.AddSignalR();

// Cookies
// builder.Services.ConfigureApplicationCookie(options =>
// {
//     options.Cookie.SameSite = SameSiteMode.Lax;
//     options.Cookie.HttpOnly = true;
// });

var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUi(options =>
    {
        options.DocumentPath = "/openapi/v1.json";
    });
}

// Only for development (inspecting tutorial on fetch api) - production frontend will be Next.js
app.UseDefaultFiles();
app.UseStaticFiles();

// Only for development purposes - production should simply not expose http endpoints
app.UseHttpsRedirection();

app.MapIdentityApi<ApplicationUser>();
app.MapControllers();
app.MapHub<RoomHub>("/hub");

app.Run();