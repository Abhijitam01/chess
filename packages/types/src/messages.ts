export type Color = "white" | "black";

export const INIT_GAME = "init_game" as const;
export const MOVE = "move" as const;
export const GAME_OVER = "game_over" as const;
export const JOIN_GAME = "join_game" as const;
export const OPONENT_LEFT = "opponent_left" as const;
export const INVALID_MOVE = "invalid_move" as const;
export const RESIGN = "resign" as const;
export const TIME_UPDATE = "time_update" as const;
export const DRAW_OFFER = "draw_offer" as const;
export const DRAW_ACCEPT = "draw_accept" as const;
export const DRAW_DECLINE = "draw_decline" as const;
export const AUTH_ERROR = "AUTH_ERROR" as const;
export const CREATE_LOBBY = "create_lobby" as const;
export const JOIN_LOBBY = "join_lobby" as const;
export const LOBBY_CREATED = "lobby_created" as const;
export const LOBBY_NOT_FOUND = "lobby_not_found" as const;
export const CLOCK_SYNC = "clock_sync" as const;

// ── Time controls ─────────────────────────────────────────────────────────────

export type TimeControlKey = 'bullet' | 'blitz' | 'rapid' | 'classical';

export interface TimeControl {
  label: string;
  initialTimeMs: number;
}

export const TIME_CONTROLS: Record<TimeControlKey, TimeControl> = {
  bullet:    { label: 'Bullet (1 min)',    initialTimeMs: 60_000 },
  blitz:     { label: 'Blitz (5 min)',     initialTimeMs: 300_000 },
  rapid:     { label: 'Rapid (10 min)',    initialTimeMs: 600_000 },
  classical: { label: 'Classical (30 min)', initialTimeMs: 1_800_000 },
};

/** Default time control used when none is specified. */
export const DEFAULT_TIME_CONTROL: TimeControlKey = 'blitz';

export interface ClientClockSyncMessage {
  type: typeof CLOCK_SYNC;
  payload: { whiteTime: number; blackTime: number; serverTs: number };
}
export interface OpponentLeftPayload {
  message: string;
}
export interface TimeUpdatePayload {
  whiteTime: number;
  blackTime: number;
}
export interface InitGamePayload {
  color: Color;
  timeControl?: {
    whiteTime: number;
    blackTime: number;
  };
}

export interface ResignPayload {
  message: string;
}
export interface ServerResignMessage {
  type: typeof RESIGN;
  payload: ResignPayload;
}

export interface ServerTimeUpdateMessage {
  type: typeof TIME_UPDATE;
  payload: TimeUpdatePayload;
}

export interface MovePayload {
  from: string;
  to: string;
  san?: string;
  promotion?: string;
}

export interface GameOverPayload {
  winner: Color;
  reason?: string;
}

export interface ServerInitGameMessage {
  type: typeof INIT_GAME;
  payload: InitGamePayload;
}

export interface InvalidMovePayload {
  error: string;
  move: MovePayload;
}

export interface ServerInvalidMoveMessage {
  type: typeof INVALID_MOVE;
  payload: InvalidMovePayload;
}

export interface ServerMoveMessage {
  type: typeof MOVE;
  payload: MovePayload;
}

export interface ServerGameOverMessage {
  type: typeof GAME_OVER;
  payload: GameOverPayload;
}

export interface ServerOpponentLeftMessage {
  type: typeof OPONENT_LEFT;
  payload: OpponentLeftPayload;
}

export interface ServerClockSyncMessage {
  type: typeof CLOCK_SYNC;
  payload: { whiteTime: number; blackTime: number; serverTs: number };
}

export type ServerMessage =
  | ServerInitGameMessage
  | ServerMoveMessage
  | ServerGameOverMessage
  | ServerOpponentLeftMessage
  | ServerResignMessage
  | ServerInvalidMoveMessage
  | ServerTimeUpdateMessage
  | ServerDrawOfferMessage
  | ServerDrawDeclineMessage
  | ServerLobbyCreatedMessage
  | ServerLobbyNotFoundMessage
  | ServerClockSyncMessage;

export interface ClientInitGameMessage {
  type: typeof INIT_GAME;
}

export interface ClientMoveMessage {
  type: typeof MOVE;
  move: MovePayload;
}




export interface ClientResignMessage {
  type: typeof RESIGN;
}

export interface ClientDrawOfferMessage {
  type: typeof DRAW_OFFER;
}

export interface ClientDrawAcceptMessage {
  type: typeof DRAW_ACCEPT;
}

export interface ClientDrawDeclineMessage {
  type: typeof DRAW_DECLINE;
}

export interface ServerDrawOfferMessage {
  type: typeof DRAW_OFFER;
}

export interface ServerDrawDeclineMessage {
  type: typeof DRAW_DECLINE;
}

export interface ClientCreateLobbyMessage {
  type: typeof CREATE_LOBBY;
}

export interface ClientJoinLobbyMessage {
  type: typeof JOIN_LOBBY;
  code: string;
}

export interface ServerLobbyCreatedMessage {
  type: typeof LOBBY_CREATED;
  payload: { code: string };
}

export interface ServerLobbyNotFoundMessage {
  type: typeof LOBBY_NOT_FOUND;
}

export type ClientMessage =
  | ClientInitGameMessage
  | ClientMoveMessage
  | ClientResignMessage
  | ClientDrawOfferMessage
  | ClientDrawAcceptMessage
  | ClientDrawDeclineMessage
  | ClientCreateLobbyMessage
  | ClientJoinLobbyMessage;

export interface ClientTimeUpdateMessage {
  type: typeof TIME_UPDATE;
}