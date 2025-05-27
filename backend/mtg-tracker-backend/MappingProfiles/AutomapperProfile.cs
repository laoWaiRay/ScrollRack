using Mtg_tracker.Models;
using Mtg_tracker.Models.DTOs;
using AutoMapper;

namespace Mtg_tracker.MappingProfiles;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        // Server -> Client
        CreateMap<Deck, DeckDTO>();
        CreateMap<FriendRequest, FriendRequestDTO>();
        CreateMap<Game, GameDTO>();
        CreateMap<GameParticipation, GameParticipationDTO>();
        CreateMap<Room, RoomDTO>();
        CreateMap<StatSnapshot, StatSnapshotDTO>();
        CreateMap<User, UserReadDTO>();

        // Client -> Server
        CreateMap<DeckDTO, Deck>();
        CreateMap<FriendRequestDTO, FriendRequest>();
        CreateMap<GameDTO, Game>();
        CreateMap<GameParticipationDTO, GameParticipation>();
        CreateMap<RoomDTO, Room>();
        CreateMap<StatSnapshotDTO, StatSnapshot>();
        CreateMap<UserCreateDTO, User>();
        CreateMap<UserUpdateDTO, User>();
    }
}