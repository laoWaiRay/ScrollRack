import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

type DeckReadDTO = {
  id: number;
  userId: string;
  commander: string;
  moxfield: string;
  scryfallId: string;
  createdAt: string;
  statistics?: (Array<FilteredDeckStats> | null) | undefined;
};
type FilteredDeckStats = {
  podSize: number;
  stats: DeckStats;
};
type DeckStats = {
  numGames: number;
  numWins: number;
  latestWin?: (string | null) | undefined;
  currentStreak?: (number | null) | undefined;
  isCurrentWinStreak?: (boolean | null) | undefined;
  longestWinStreak?: (number | null) | undefined;
  longestLossStreak?: (number | null) | undefined;
  fastestWinInSeconds?: (number | null) | undefined;
  slowestWinInSeconds?: (number | null) | undefined;
  par?: (number | null) | undefined;
};
type DeckReadDTO2 = {
  id: number;
  userId: string;
  commander: string;
  moxfield: string;
  scryfallId: string;
  createdAt: string;
  statistics?: (Array<FilteredDeckStats> | null) | undefined;
};
type FilteredStatSnapshotDTO = {
  period: string;
  playerCount: number;
  snapshot: StatSnapshotDTO;
};
type StatSnapshotDTO = {
  gamesPlayed: number;
  gamesWon: number;
  numDecks: number;
  lastWon?: (string | null) | undefined;
  mostRecentPlayedDeck?: DeckReadDTO2 | undefined;
  mostPlayedCommanders: Array<string>;
  leastPlayedCommanders: Array<string>;
  currentWinStreak: number;
  isCurrentWinStreak?: (boolean | null) | undefined;
  winLossGamesByPeriod?: Array<WinLossGameCount> | undefined;
  deckPlayCounts?: Array<DeckPlayCount> | undefined;
  longestWinStreak: number;
  longestLossStreak: number;
  createdAt?: string | undefined;
};
type WinLossGameCount = {
  periodStart: string;
  periodEnd: string;
  wins: number;
  losses: number;
  games: number;
};
type DeckPlayCount = {
  commander: string;
  numGames: number;
  percentOfGamesPlayed: number;
};
type GameParticipationReadDTO = {
  id: string;
  gameId: number;
  userId: string;
  user: UserReadMinimalDTO;
  deckId: number;
  deck: DeckReadDTO;
  won: boolean;
  createdAt: string;
};
type UserReadMinimalDTO = {
  id: string;
  userName: string;
  email: string;
  profile?: (string | null) | undefined;
};
type GameReadDTO = {
  id: number;
  numPlayers: number;
  numTurns: number;
  seconds: number;
  createdAt: string;
  createdByUserId?: (string | null) | undefined;
  winnerId?: (string | null) | undefined;
  gameParticipations?: Array<GameParticipationReadDTO> | undefined;
};
type PagedResultOfGameReadDTO = Partial<{
  items: Array<GameReadDTO>;
  page: number;
  hasMore: boolean;
}>;
type RoomDTO = {
  id: number;
  roomOwnerId: string;
  code: string;
  createdAt?: string | undefined;
  players?: Array<UserReadDTO> | undefined;
};
type UserReadDTO = {
  id: string;
  userName: string;
  email: string;
  profile?: (string | null) | undefined;
  decks: Array<DeckReadDTO>;
};

const RegisterRequest = z
  .object({ email: z.string(), password: z.string() })
  .passthrough();
const LoginRequest = z
  .object({
    email: z.string(),
    password: z.string(),
    twoFactorCode: z.string().nullish(),
    twoFactorRecoveryCode: z.string().nullish(),
  })
  .passthrough();
const AccessTokenResponse = z
  .object({
    tokenType: z.string().nullish(),
    accessToken: z.string(),
    expiresIn: z.number().int(),
    refreshToken: z.string(),
  })
  .passthrough();
const RefreshRequest = z.object({ refreshToken: z.string() }).passthrough();
const ResendConfirmationEmailRequest = z
  .object({ email: z.string() })
  .passthrough();
const ForgotPasswordRequest = z.object({ email: z.string() }).passthrough();
const ResetPasswordRequest = z
  .object({ email: z.string(), resetCode: z.string(), newPassword: z.string() })
  .passthrough();
const TwoFactorRequest = z
  .object({
    enable: z.boolean().nullable(),
    twoFactorCode: z.string().nullable(),
    resetSharedKey: z.boolean(),
    resetRecoveryCodes: z.boolean(),
    forgetMachine: z.boolean(),
  })
  .partial()
  .passthrough();
const TwoFactorResponse = z
  .object({
    sharedKey: z.string(),
    recoveryCodesLeft: z.number().int(),
    recoveryCodes: z.array(z.string()).nullish(),
    isTwoFactorEnabled: z.boolean(),
    isMachineRemembered: z.boolean(),
  })
  .passthrough();
const InfoResponse = z
  .object({ email: z.string(), isEmailConfirmed: z.boolean() })
  .passthrough();
const InfoRequest = z
  .object({
    newEmail: z.string().nullable(),
    newPassword: z.string().nullable(),
    oldPassword: z.string().nullable(),
  })
  .partial()
  .passthrough();
const DeckStats: z.ZodType<DeckStats> = z
  .object({
    numGames: z.number().int(),
    numWins: z.number().int(),
    latestWin: z.string().datetime({ offset: true }).nullish(),
    currentStreak: z.number().int().nullish(),
    isCurrentWinStreak: z.boolean().nullish(),
    longestWinStreak: z.number().int().nullish(),
    longestLossStreak: z.number().int().nullish(),
    fastestWinInSeconds: z.number().int().nullish(),
    slowestWinInSeconds: z.number().int().nullish(),
    par: z.number().nullish(),
  })
  .passthrough();
const FilteredDeckStats: z.ZodType<FilteredDeckStats> = z
  .object({ podSize: z.number().int(), stats: DeckStats })
  .passthrough();
const DeckReadDTO: z.ZodType<DeckReadDTO> = z
  .object({
    id: z.number().int(),
    userId: z.string(),
    commander: z.string(),
    moxfield: z.string(),
    scryfallId: z.string(),
    createdAt: z.string().datetime({ offset: true }),
    statistics: z.array(FilteredDeckStats).nullish(),
  })
  .passthrough();
const DeckWriteDTO = z
  .object({
    userId: z.string(),
    commander: z.string(),
    moxfield: z.string(),
    scryfallId: z.string(),
    numGames: z.number().int(),
    numWins: z.number().int(),
  })
  .passthrough();
const UserReadDTO: z.ZodType<UserReadDTO> = z
  .object({
    id: z.string(),
    userName: z.string(),
    email: z.string(),
    profile: z.string().nullish(),
    decks: z.array(DeckReadDTO),
  })
  .passthrough();
const UserFriendAddDTO = z
  .object({ id: z.string(), requiresPermission: z.boolean() })
  .passthrough();
const FriendRequestDTO = z
  .object({
    id: z.number().int().optional(),
    senderId: z.string(),
    receiverId: z.string(),
  })
  .passthrough();
const UserReadMinimalDTO: z.ZodType<UserReadMinimalDTO> = z
  .object({
    id: z.string(),
    userName: z.string(),
    email: z.string(),
    profile: z.string().nullish(),
  })
  .passthrough();
const GameParticipationReadDTO: z.ZodType<GameParticipationReadDTO> = z
  .object({
    id: z.string(),
    gameId: z.number().int(),
    userId: z.string(),
    user: UserReadMinimalDTO,
    deckId: z.number().int(),
    deck: DeckReadDTO,
    won: z.boolean(),
    createdAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const GameReadDTO: z.ZodType<GameReadDTO> = z
  .object({
    id: z.number().int(),
    numPlayers: z.number().int(),
    numTurns: z.number().int(),
    seconds: z.number().int(),
    createdAt: z.string().datetime({ offset: true }),
    createdByUserId: z.string().nullish(),
    winnerId: z.string().nullish(),
    gameParticipations: z.array(GameParticipationReadDTO).optional(),
  })
  .passthrough();
const PagedResultOfGameReadDTO: z.ZodType<PagedResultOfGameReadDTO> = z
  .object({
    items: z.array(GameReadDTO),
    page: z.number().int(),
    hasMore: z.boolean(),
  })
  .partial()
  .passthrough();
const GameWriteDTO = z
  .object({
    numPlayers: z.number().int(),
    numTurns: z.number().int(),
    seconds: z.number().int(),
    createdAt: z.string().datetime({ offset: true }),
    roomId: z.number().int(),
    createdByUserId: z.string(),
    winnerId: z.string(),
    imported: z.boolean().nullish(),
  })
  .passthrough();
const GameParticipationWriteDTO = z
  .object({
    userId: z.string(),
    gameId: z.number().int(),
    deckId: z.number().int(),
    won: z.boolean(),
  })
  .passthrough();
const RoomDTO: z.ZodType<RoomDTO> = z
  .object({
    id: z.number().int(),
    roomOwnerId: z.string(),
    code: z.string(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    players: z.array(UserReadDTO).optional(),
  })
  .passthrough();
const AddPlayerDTO = z.object({ id: z.string() }).passthrough();
const DeckReadDTO2: z.ZodType<DeckReadDTO2> = z
  .object({
    id: z.number().int(),
    userId: z.string(),
    commander: z.string(),
    moxfield: z.string(),
    scryfallId: z.string(),
    createdAt: z.string().datetime({ offset: true }),
    statistics: z.array(FilteredDeckStats).nullish(),
  })
  .passthrough();
const WinLossGameCount: z.ZodType<WinLossGameCount> = z
  .object({
    periodStart: z.string().datetime({ offset: true }),
    periodEnd: z.string().datetime({ offset: true }),
    wins: z.number().int(),
    losses: z.number().int(),
    games: z.number().int(),
  })
  .passthrough();
const DeckPlayCount: z.ZodType<DeckPlayCount> = z
  .object({
    commander: z.string(),
    numGames: z.number().int(),
    percentOfGamesPlayed: z.number(),
  })
  .passthrough();
const StatSnapshotDTO: z.ZodType<StatSnapshotDTO> = z
  .object({
    gamesPlayed: z.number().int(),
    gamesWon: z.number().int(),
    numDecks: z.number().int(),
    lastWon: z.string().datetime({ offset: true }).nullish(),
    mostRecentPlayedDeck: DeckReadDTO2.nullish(),
    mostPlayedCommanders: z.array(z.string()),
    leastPlayedCommanders: z.array(z.string()),
    currentWinStreak: z.number().int(),
    isCurrentWinStreak: z.boolean().nullish(),
    winLossGamesByPeriod: z.array(WinLossGameCount).optional(),
    deckPlayCounts: z.array(DeckPlayCount).optional(),
    longestWinStreak: z.number().int(),
    longestLossStreak: z.number().int(),
    createdAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const FilteredStatSnapshotDTO: z.ZodType<FilteredStatSnapshotDTO> = z
  .object({
    period: z.string(),
    playerCount: z.number().int(),
    snapshot: StatSnapshotDTO,
  })
  .passthrough();
const UserMultipleDTO = z.object({ ids: z.array(z.string()) }).passthrough();
const UserWriteDTO = z
  .object({
    id: z.string(),
    userName: z.string(),
    currentPassword: z.string().nullish(),
    newPassword: z.string().nullish(),
    profile: z.string().nullish(),
  })
  .passthrough();
const UserRegisterDTO = z
  .object({ userName: z.string(), email: z.string(), password: z.string() })
  .passthrough();
const UserLoginDTO = z
  .object({ email: z.string(), password: z.string() })
  .passthrough();
const HttpValidationProblemDetails = z
  .object({
    type: z.string().nullable(),
    title: z.string().nullable(),
    status: z.number().int().nullable(),
    detail: z.string().nullable(),
    instance: z.string().nullable(),
    errors: z.record(z.array(z.string())),
  })
  .partial()
  .passthrough();

export const schemas = {
  RegisterRequest,
  LoginRequest,
  AccessTokenResponse,
  RefreshRequest,
  ResendConfirmationEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  TwoFactorRequest,
  TwoFactorResponse,
  InfoResponse,
  InfoRequest,
  DeckStats,
  FilteredDeckStats,
  DeckReadDTO,
  DeckWriteDTO,
  UserReadDTO,
  UserFriendAddDTO,
  FriendRequestDTO,
  UserReadMinimalDTO,
  GameParticipationReadDTO,
  GameReadDTO,
  PagedResultOfGameReadDTO,
  GameWriteDTO,
  GameParticipationWriteDTO,
  RoomDTO,
  AddPlayerDTO,
  DeckReadDTO2,
  WinLossGameCount,
  DeckPlayCount,
  StatSnapshotDTO,
  FilteredStatSnapshotDTO,
  UserMultipleDTO,
  UserWriteDTO,
  UserRegisterDTO,
  UserLoginDTO,
  HttpValidationProblemDetails,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/api/Deck",
    alias: "getApiDeck",
    requestFormat: "json",
    response: z.array(DeckReadDTO),
  },
  {
    method: "post",
    path: "/api/Deck",
    alias: "postApiDeck",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: DeckWriteDTO,
      },
    ],
    response: DeckReadDTO,
  },
  {
    method: "get",
    path: "/api/Deck/:id",
    alias: "getApiDeckId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: DeckReadDTO,
  },
  {
    method: "put",
    path: "/api/Deck/:id",
    alias: "putApiDeckId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: DeckWriteDTO,
      },
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: DeckReadDTO,
  },
  {
    method: "delete",
    path: "/api/Deck/:id",
    alias: "deleteApiDeckId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
  },
  {
    method: "get",
    path: "/api/Friend",
    alias: "getApiFriend",
    requestFormat: "json",
    response: z.array(UserReadDTO),
  },
  {
    method: "post",
    path: "/api/Friend",
    alias: "postApiFriend",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UserFriendAddDTO,
      },
    ],
    response: z.void(),
  },
  {
    method: "delete",
    path: "/api/Friend/:id",
    alias: "deleteApiFriendId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: "get",
    path: "/api/Friend/detailed",
    alias: "getApiFrienddetailed",
    requestFormat: "json",
    response: z.array(UserReadDTO),
  },
  {
    method: "delete",
    path: "/api/FriendRequest/:id",
    alias: "deleteApiFriendRequestId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/FriendRequest/:userName",
    alias: "postApiFriendRequestUserName",
    requestFormat: "json",
    parameters: [
      {
        name: "userName",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: "get",
    path: "/api/FriendRequest/received",
    alias: "getApiFriendRequestreceived",
    requestFormat: "json",
    response: z.array(FriendRequestDTO),
  },
  {
    method: "get",
    path: "/api/FriendRequest/sent",
    alias: "getApiFriendRequestsent",
    requestFormat: "json",
    response: z.array(FriendRequestDTO),
  },
  {
    method: "get",
    path: "/api/Game",
    alias: "getApiGame",
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "startDate",
        type: "Query",
        schema: z.string().datetime({ offset: true }).optional(),
      },
      {
        name: "endDate",
        type: "Query",
        schema: z.string().datetime({ offset: true }).optional(),
      },
    ],
    response: PagedResultOfGameReadDTO,
  },
  {
    method: "post",
    path: "/api/Game",
    alias: "postApiGame",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: GameWriteDTO,
      },
    ],
    response: GameReadDTO,
  },
  {
    method: "get",
    path: "/api/Game/:id",
    alias: "getApiGameId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: GameReadDTO,
  },
  {
    method: "delete",
    path: "/api/Game/:id",
    alias: "deleteApiGameId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
  },
  {
    method: "get",
    path: "/api/GameParticipation",
    alias: "getApiGameParticipation",
    requestFormat: "json",
    response: z.array(GameParticipationReadDTO),
  },
  {
    method: "post",
    path: "/api/GameParticipation",
    alias: "postApiGameParticipation",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: GameParticipationWriteDTO,
      },
    ],
    response: GameParticipationReadDTO,
  },
  {
    method: "get",
    path: "/api/Room",
    alias: "getApiRoom",
    requestFormat: "json",
    response: z.array(RoomDTO),
  },
  {
    method: "post",
    path: "/api/Room",
    alias: "postApiRoom",
    requestFormat: "json",
    response: RoomDTO,
  },
  {
    method: "delete",
    path: "/api/Room",
    alias: "deleteApiRoom",
    requestFormat: "json",
    response: z.void(),
  },
  {
    method: "get",
    path: "/api/Room/:roomCode",
    alias: "getApiRoomRoomCode",
    requestFormat: "json",
    parameters: [
      {
        name: "roomCode",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: RoomDTO,
  },
  {
    method: "post",
    path: "/api/Room/:roomCode",
    alias: "postApiRoomRoomCode",
    requestFormat: "json",
    parameters: [
      {
        name: "roomCode",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: RoomDTO,
  },
  {
    method: "post",
    path: "/api/Room/:roomCode/players",
    alias: "postApiRoomRoomCodeplayers",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ id: z.string() }).passthrough(),
      },
      {
        name: "roomCode",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: RoomDTO,
  },
  {
    method: "delete",
    path: "/api/Room/:roomCode/players/:id",
    alias: "deleteApiRoomRoomCodeplayersId",
    requestFormat: "json",
    parameters: [
      {
        name: "roomCode",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: RoomDTO,
  },
  {
    method: "get",
    path: "/api/StatSnapshot",
    alias: "getApiStatSnapshot",
    requestFormat: "json",
    response: z.array(FilteredStatSnapshotDTO),
  },
  {
    method: "put",
    path: "/api/StatSnapshot",
    alias: "putApiStatSnapshot",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: StatSnapshotDTO,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/User",
    alias: "postApiUser",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UserMultipleDTO,
      },
    ],
    response: z.array(UserReadDTO),
  },
  {
    method: "put",
    path: "/api/User/:id",
    alias: "putApiUserId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UserWriteDTO,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: "get",
    path: "/api/User/:id/decks",
    alias: "getApiUserIddecks",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(DeckReadDTO),
  },
  {
    method: "get",
    path: "/api/User/id/:id",
    alias: "getApiUseridId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: UserReadDTO,
  },
  {
    method: "get",
    path: "/api/User/identity",
    alias: "getApiUseridentity",
    requestFormat: "json",
    response: UserReadDTO,
  },
  {
    method: "post",
    path: "/api/User/login",
    alias: "postApiUserlogin",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UserLoginDTO,
      },
    ],
    response: UserReadDTO,
  },
  {
    method: "post",
    path: "/api/User/logout",
    alias: "postApiUserlogout",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.unknown(),
      },
    ],
    response: z.void(),
  },
  {
    method: "get",
    path: "/api/User/name/:username",
    alias: "getApiUsernameUsername",
    requestFormat: "json",
    parameters: [
      {
        name: "username",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: UserReadDTO,
  },
  {
    method: "post",
    path: "/api/User/register",
    alias: "postApiUserregister",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UserRegisterDTO,
      },
    ],
    response: UserReadDTO,
  },
  {
    method: "get",
    path: "/confirmEmail",
    alias: "MapIdentityApi-/confirmEmail",
    requestFormat: "json",
    parameters: [
      {
        name: "userId",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "code",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "changedEmail",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/forgotPassword",
    alias: "postForgotPassword",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ email: z.string() }).passthrough(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/login",
    alias: "postLogin",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: LoginRequest,
      },
      {
        name: "useCookies",
        type: "Query",
        schema: z.boolean().optional(),
      },
      {
        name: "useSessionCookies",
        type: "Query",
        schema: z.boolean().optional(),
      },
    ],
    response: AccessTokenResponse,
  },
  {
    method: "post",
    path: "/manage/2fa",
    alias: "postManage2fa",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: TwoFactorRequest,
      },
    ],
    response: TwoFactorResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/manage/info",
    alias: "getManageinfo",
    requestFormat: "json",
    response: InfoResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/manage/info",
    alias: "postManageinfo",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: InfoRequest,
      },
    ],
    response: InfoResponse,
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/refresh",
    alias: "postRefresh",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ refreshToken: z.string() }).passthrough(),
      },
    ],
    response: AccessTokenResponse,
  },
  {
    method: "post",
    path: "/register",
    alias: "postRegister",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: RegisterRequest,
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/resendConfirmationEmail",
    alias: "postResendConfirmationEmail",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ email: z.string() }).passthrough(),
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/resetPassword",
    alias: "postResetPassword",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ResetPasswordRequest,
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.void(),
      },
    ],
  },
]);

export const api = new Zodios("https://localhost:7165", endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
