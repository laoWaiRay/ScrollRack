using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;
using Mtg_tracker.MappingProfiles;
using Microsoft.AspNetCore.Identity;
using Mtg_tracker.Hubs;
using Mtg_tracker.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Add Swagger with JWT configuration
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Mtg Tracker Api", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token."
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

builder.Services.AddDbContext<MtgContext>(options =>
    options
        .UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
        .UseSnakeCaseNamingConvention()
        .ConfigureWarnings(w => w.Throw(RelationalEventId.MultipleCollectionIncludeWarning))
);
builder.Services.AddAutoMapper(typeof(AutoMapperProfile).Assembly);

// Custom Services
builder.Services.AddScoped<DeckStatsService>();
builder.Services.AddTransient<ITemplatedEmailSender, EmailSender>();
builder.Services.Configure<EmailSenderOptions>(builder.Configuration);
builder.Services.AddScoped<TokenProviderService>();

// Identity Services (authentication/authorization)
builder.Services.Configure<IdentityOptions>(options =>
{
    options.User.RequireUniqueEmail = true;
});
builder.Services.AddAuthorization();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(jwtOptions =>
    {
        jwtOptions.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt_Issuer"],
            ValidAudience = builder.Configuration["Jwt_Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt_Secret"]!)),
            ClockSkew = TimeSpan.Zero,
        };

        jwtOptions.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;

                // Only allow tokens for SignalR endpoints
                if (!string.IsNullOrEmpty(accessToken) &&
                    path.StartsWithSegments("/hub"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });


builder.Services.AddIdentityApiEndpoints<ApplicationUser>()
    .AddEntityFrameworkStores<MtgContext>();

// CORS
var MyAllowSpecificOrigins = "Client";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        var env = builder.Environment;

        if (env.IsDevelopment())
        {
            policy.WithOrigins("https://localhost:3000", "http://localhost:3000", "https://192.168.1.66:3000", "http://192.168.1.66:3000")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
        else
        {
            policy.WithOrigins("https://scrollrack.win")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }

    });
});

// SignalR
builder.Services.AddSignalR();

// Cookies
// builder.Services.ConfigureApplicationCookie(options =>
// {
//     // options.Cookie.SameSite = SameSiteMode.None;
//     // options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
// });

var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // Only for development (inspecting tutorial on fetch api) - production frontend will be Next.js
    app.UseDefaultFiles();
    app.UseStaticFiles();

    // Only for development purposes - production should simply not expose http endpoints
    app.UseHttpsRedirection();
}

app.MapControllers();
app.MapHub<RoomHub>("/hub");

app.Run();