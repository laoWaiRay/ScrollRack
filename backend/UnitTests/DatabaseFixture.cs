using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Mtg_tracker.MappingProfiles;
using Mtg_tracker.Models;
using Testcontainers.PostgreSql;

namespace UnitTests;

public record struct UserData(string UserName, string Email);

public record struct DeckData(string Commander, string ScryfallId, UserData UserData);

public record struct UserDeckPair(UserData UserData, DeckData DeckData);

public record struct RoomData(
    UserData Owner,
    List<UserData> Players,
    string RoomCode,
    List<GameData> Games
);

public record struct GameData(
    List<UserDeckPair> UserDeckPairs,
    UserData Winner,
    int NumTurns,
    int Seconds
);

public sealed class DatabaseFixture : IAsyncLifetime
{
    private const string DbDockerImage = "postgres:17";
    public DbContextOptions<MtgContext> Options { get; private set; } = null!;
    public PostgreSqlContainer Container { get; private set; } = null!;
    public MapperConfiguration MapperConfig { get; private set; } = null!;

    public async ValueTask DisposeAsync()
    {
        if (Container != null)
        {
            await Container.DisposeAsync();
        }
    }

    public async ValueTask InitializeAsync()
    {
        Container = new PostgreSqlBuilder().WithImage(DbDockerImage).Build();
        await Container.StartAsync(TestContext.Current.CancellationToken);

        MapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddMaps(typeof(AutoMapperProfile).Assembly);
        });

        Options = new DbContextOptionsBuilder<MtgContext>()
            .UseNpgsql(Container.GetConnectionString())
            .UseSnakeCaseNamingConvention()
            .Options;

        using var Context = new MtgContext(Options);
        await Context.Database.EnsureCreatedAsync();

        await SeedDb(Context);
    }

    public MtgContext CreateContext() => new(Options);

    private static async Task SeedDb(MtgContext context)
    {
        // Add Users
        foreach (var data in SeedUserData)
        {
            var user = new ApplicationUser { UserName = data.UserName, Email = data.Email };
            context.Add(user);
        }
        await context.SaveChangesAsync();

        // Add Decks
        foreach (var data in SeedDeckData)
        {
            var owner = context.Users.First(u => u.UserName == data.UserData.UserName);
            var deck = new Deck
            {
                Commander = data.Commander,
                ScryfallId = data.ScryfallId,
                UserId = owner.Id,
            };
            context.Decks.Add(deck);
        }
        await context.SaveChangesAsync();

        // Add Rooms + Games + GameParticipations.
        // After a room is created, all corresponding games and gameParticipations should also be created.
        // After all games are saved, the room for those games should be deleted, so that the initial
        // db state does not have any players currently in rooms.
        foreach (var rd in SeedRoomData)
        {
            List<string> userNames = rd.Players.Select(p => p.UserName).ToList();
            List<ApplicationUser> players = context
                .Users.Where(u => userNames.Contains(u.UserName!))
                .ToList();
            ApplicationUser roomOwner = players.Find(p => p.UserName == rd.Owner.UserName)!;

            var room = new Room
            {
                RoomOwnerId = roomOwner.Id,
                Players = players,
                Code = rd.RoomCode,
            };
            context.Rooms.Add(room);
            await context.SaveChangesAsync();

            foreach (var gd in rd.Games)
            {
                var (UserDeckPairs, Winner, NumTurns, Seconds) = gd;
                ApplicationUser winner = context.Users.Single(u => u.UserName == Winner.UserName);
                var game = new Game
                {
                    RoomId = room.Id,
                    NumPlayers = players.Count,
                    NumTurns = NumTurns,
                    WinnerId = winner.Id,
                    Seconds = Seconds,
                    CreatedByUserId = roomOwner.Id,
                };
                context.Games.Add(game);
                await context.SaveChangesAsync();

                foreach (var pair in gd.UserDeckPairs)
                {
                    var (UserData, DeckData) = pair;
                    var player = players.Single(p => p.UserName == UserData.UserName);
                    var deck = context.Decks.Single(d =>
                        d.Commander == DeckData.Commander && d.UserId == player.Id
                    );
                    var gameParticipation = new GameParticipation
                    {
                        UserId = player.Id,
                        GameId = game.Id,
                        DeckId = deck.Id,
                        Won = player.Id == winner.Id,
                    };
                    context.GameParticipations.Add(gameParticipation);
                }
                await context.SaveChangesAsync();
            }

            // Close the room
            context.Rooms.Remove(room);
            await context.SaveChangesAsync();
        }
    }

    public static readonly List<UserData> SeedUserData =
    [
        new UserData { Email = "user0@gmail.com", UserName = "user0" },
        new UserData { Email = "user1@gmail.com", UserName = "user1" },
        new UserData { Email = "user2@gmail.com", UserName = "user2" },
    ];

    public static readonly List<DeckData> SeedDeckData =
    [
        new DeckData
        {
            Commander = "user0 commander0",
            ScryfallId = "",
            UserData = SeedUserData[0],
        },
        new DeckData
        {
            Commander = "user1 commander0",
            ScryfallId = "",
            UserData = SeedUserData[1],
        },
        new DeckData
        {
            Commander = "user2 commander0",
            ScryfallId = "",
            UserData = SeedUserData[2],
        },
    ];

    public static readonly List<RoomData> SeedRoomData =
    [
        new RoomData
        {
            Owner = SeedUserData[0],
            Players = SeedUserData[0..3],
            RoomCode = "ABC123",
            Games =
            [
                new GameData
                {
                    UserDeckPairs =
                    [
                        new UserDeckPair(SeedUserData[0], SeedDeckData[0]),
                        new UserDeckPair(SeedUserData[1], SeedDeckData[1]),
                        new UserDeckPair(SeedUserData[2], SeedDeckData[2]),
                    ],
                    Winner = SeedUserData[0],
                    NumTurns = 10,
                    Seconds = 1000,
                },
                new GameData
                {
                    UserDeckPairs =
                    [
                        new UserDeckPair(SeedUserData[0], SeedDeckData[0]),
                        new UserDeckPair(SeedUserData[1], SeedDeckData[1]),
                        new UserDeckPair(SeedUserData[2], SeedDeckData[2]),
                    ],
                    Winner = SeedUserData[0],
                    NumTurns = 8,
                    Seconds = 800,
                },
            ],
        },
        new RoomData
        {
            Owner = SeedUserData[0],
            Players = SeedUserData[0..2],
            RoomCode = "ABC456",
            Games =
            [
                new GameData
                {
                    UserDeckPairs =
                    [
                        new UserDeckPair(SeedUserData[0], SeedDeckData[0]),
                        new UserDeckPair(SeedUserData[1], SeedDeckData[1]),
                    ],
                    Winner = SeedUserData[0],
                    NumTurns = 5,
                    Seconds = 500,
                },
                new GameData
                {
                    UserDeckPairs =
                    [
                        new UserDeckPair(SeedUserData[0], SeedDeckData[0]),
                        new UserDeckPair(SeedUserData[1], SeedDeckData[1]),
                    ],
                    Winner = SeedUserData[1],
                    NumTurns = 6,
                    Seconds = 600,
                },
            ],
        },
    ];
}
