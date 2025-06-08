using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;
using Mtg_tracker.MappingProfiles;

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

// Identity Services (authentication/authorization)
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<ApplicationUser>()
    .AddEntityFrameworkStores<MtgContext>();

// CORS
var MyAllowSpecificOrigins = "Client";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        policy.WithOrigins("https://localhost:3000", "http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);

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

app.Run();