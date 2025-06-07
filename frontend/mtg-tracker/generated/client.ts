import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

type RoomDTO = {
  id?: number | undefined;
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
};

const RegisterRequest = z
  .object({ email: z.string(), password: z.string() })
  .strict()
  .passthrough();
const LoginRequest = z
  .object({
    email: z.string(),
    password: z.string(),
    twoFactorCode: z.string().nullish(),
    twoFactorRecoveryCode: z.string().nullish(),
  })
  .strict()
  .passthrough();
const AccessTokenResponse = z
  .object({
    tokenType: z.string().nullish(),
    accessToken: z.string(),
    expiresIn: z.number().int(),
    refreshToken: z.string(),
  })
  .strict()
  .passthrough();
const RefreshRequest = z
  .object({ refreshToken: z.string() })
  .strict()
  .passthrough();
const ResendConfirmationEmailRequest = z
  .object({ email: z.string() })
  .strict()
  .passthrough();
const ForgotPasswordRequest = z
  .object({ email: z.string() })
  .strict()
  .passthrough();
const ResetPasswordRequest = z
  .object({ email: z.string(), resetCode: z.string(), newPassword: z.string() })
  .strict()
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
  .strict()
  .passthrough();
const TwoFactorResponse = z
  .object({
    sharedKey: z.string(),
    recoveryCodesLeft: z.number().int(),
    recoveryCodes: z.array(z.string()).nullish(),
    isTwoFactorEnabled: z.boolean(),
    isMachineRemembered: z.boolean(),
  })
  .strict()
  .passthrough();
const InfoResponse = z
  .object({ email: z.string(), isEmailConfirmed: z.boolean() })
  .strict()
  .passthrough();
const InfoRequest = z
  .object({
    newEmail: z.string().nullable(),
    newPassword: z.string().nullable(),
    oldPassword: z.string().nullable(),
  })
  .partial()
  .strict()
  .passthrough();
const DeckReadDTO = z
  .object({
    id: z.number().int().optional(),
    userId: z.string().optional(),
    commander: z.string(),
    moxfield: z.string(),
    numGames: z.number().int().optional(),
    numWins: z.number().int().optional(),
  })
  .strict()
  .passthrough();
const DeckWriteDTO = z
  .object({
    userId: z.string().optional(),
    commander: z.string(),
    moxfield: z.string(),
    numGames: z.number().int().optional(),
    numWins: z.number().int().optional(),
  })
  .strict()
  .passthrough();
const UserReadDTO: z.ZodType<UserReadDTO> = z
  .object({
    id: z.string(),
    userName: z.string(),
    email: z.string(),
    profile: z.string().nullish(),
  })
  .strict()
  .passthrough();
const FriendRequestDTO = z
  .object({
    id: z.number().int().optional(),
    senderId: z.string(),
    receiverId: z.string(),
  })
  .strict()
  .passthrough();
const GameDTO = z
  .object({
    id: z.number().int(),
    numPlayers: z.number().int(),
    numTurns: z.number().int(),
    minutes: z.number().int(),
    createdAt: z.string().datetime({ offset: true }),
  })
  .partial()
  .strict()
  .passthrough();
const GameParticipationReadDTO = z
  .object({ id: z.number().int(), won: z.boolean() })
  .partial()
  .strict()
  .passthrough();
const GameParticipationWriteDTO = z
  .object({
    userId: z.string(),
    gameId: z.number().int().optional(),
    deckId: z.number().int().optional(),
    won: z.boolean().optional(),
  })
  .strict()
  .passthrough();
const RoomDTO: z.ZodType<RoomDTO> = z
  .object({
    id: z.number().int().optional(),
    roomOwnerId: z.string(),
    code: z.string(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    players: z.array(UserReadDTO).optional(),
  })
  .strict()
  .passthrough();
const AddPlayerDTO = z.object({ id: z.string() }).strict().passthrough();
const StatSnapshotDTO = z
  .object({
    gamesPlayed: z.number().int(),
    gamesWon: z.number().int(),
    numDecks: z.number().int(),
    currentWinStreak: z.number().int(),
    currentLossStreak: z.number().int(),
    longestWinStreak: z.number().int(),
    longestLossStreak: z.number().int(),
    createdAt: z.string().datetime({ offset: true }),
  })
  .partial()
  .strict()
  .passthrough();
const UserWriteDTO = z
  .object({
    id: z.string(),
    userName: z.string(),
    profile: z.string().nullish(),
  })
  .strict()
  .passthrough();
const UserRegisterDTO = z
  .object({ userName: z.string(), email: z.string(), password: z.string() })
  .strict()
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
  .strict()
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
  DeckReadDTO,
  DeckWriteDTO,
  UserReadDTO,
  FriendRequestDTO,
  GameDTO,
  GameParticipationReadDTO,
  GameParticipationWriteDTO,
  RoomDTO,
  AddPlayerDTO,
  StatSnapshotDTO,
  UserWriteDTO,
  UserRegisterDTO,
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
    response: z.void(),
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
        name: "friendId",
        type: "Query",
        schema: z.string().optional(),
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
    path: "/api/FriendRequest/:receiverId",
    alias: "postApiFriendRequestReceiverId",
    requestFormat: "json",
    parameters: [
      {
        name: "receiverId",
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
    response: z.array(GameDTO),
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
        schema: GameDTO,
      },
    ],
    response: z.void(),
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
    response: GameDTO,
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
    response: z.void(),
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
    response: z.void(),
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
    response: z.void(),
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
        schema: z.object({ id: z.string() }).strict().passthrough(),
      },
      {
        name: "roomCode",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
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
    response: z.void(),
  },
  {
    method: "get",
    path: "/api/StatSnapshot",
    alias: "getApiStatSnapshot",
    requestFormat: "json",
    response: StatSnapshotDTO,
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
    method: "get",
    path: "/api/User",
    alias: "getApiUser",
    requestFormat: "json",
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
    response: z.void(),
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
        schema: z.object({ email: z.string() }).strict().passthrough(),
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
        schema: z.object({ refreshToken: z.string() }).strict().passthrough(),
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
        schema: z.object({ email: z.string() }).strict().passthrough(),
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
