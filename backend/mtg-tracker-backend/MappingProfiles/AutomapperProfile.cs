using Mtg_tracker.Models;
using Mtg_tracker.Models.DTOs;
using AutoMapper;

namespace Mtg_tracker.MappingProfiles;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        // Server -> Client
        CreateMap<Deck, DeckReadDTO>();
        CreateMap<FriendRequest, FriendRequestDTO>();
        CreateMap<Game, GameReadDTO>();
        CreateMap<GameParticipation, GameParticipationReadDTO>();
        CreateMap<Room, RoomDTO>();
        CreateMap<StatSnapshot, StatSnapshotDTO>();
        CreateMap<ApplicationUser, UserReadDTO>();
        CreateMap<ApplicationUser, UserReadMinimalDTO>();
        CreateMap<ApplicationUser, UserWithEmailDTO>();

        // Client -> Server
        CreateMap<DeckWriteDTO, Deck>();
        CreateMap<FriendRequestDTO, FriendRequest>();
        CreateMap<GameWriteDTO, Game>();
        CreateMap<GameParticipationReadDTO, GameParticipation>();
        CreateMap<GameParticipationWriteDTO, GameParticipation>();
        CreateMap<RoomDTO, Room>();
        CreateMap<StatSnapshotDTO, StatSnapshot>();
    }
}