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

export type TimeControlCategory = 'bullet' | 'blitz' | 'rapid' | 'classical';

export type TimeControlKey =
  | 'bullet_1' | 'bullet_2'
  | 'blitz_3'  | 'blitz_5'
  | 'rapid_10' | 'rapid_15' | 'rapid_20' | 'rapid_30'
  | 'classical_45' | 'classical_60';

export interface TimeControl {
  label: string;
  initialTimeMs: number;
  category: TimeControlCategory;
  minutes: number;
}

export const TIME_CONTROLS: Record<TimeControlKey, TimeControl> = {
  bullet_1:     { label: '1 min',  initialTimeMs: 60_000,    category: 'bullet',    minutes: 1  },
  bullet_2:     { label: '2 min',  initialTimeMs: 120_000,   category: 'bullet',    minutes: 2  },
  blitz_3:      { label: '3 min',  initialTimeMs: 180_000,   category: 'blitz',     minutes: 3  },
  blitz_5:      { label: '5 min',  initialTimeMs: 300_000,   category: 'blitz',     minutes: 5  },
  rapid_10:     { label: '10 min', initialTimeMs: 600_000,   category: 'rapid',     minutes: 10 },
  rapid_15:     { label: '15 min', initialTimeMs: 900_000,   category: 'rapid',     minutes: 15 },
  rapid_20:     { label: '20 min', initialTimeMs: 1_200_000, category: 'rapid',     minutes: 20 },
  rapid_30:     { label: '30 min', initialTimeMs: 1_800_000, category: 'rapid',     minutes: 30 },
  classical_45: { label: '45 min', initialTimeMs: 2_700_000, category: 'classical', minutes: 45 },
  classical_60: { label: '60 min', initialTimeMs: 3_600_000, category: 'classical', minutes: 60 },
};

/** Default time control used when none is specified. */
export const DEFAULT_TIME_CONTROL: TimeControlKey = 'blitz_5';

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
  winner: Color | null;
  reason?: string;
  whiteRatingChange?: number;
  blackRatingChange?: number;
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
  timeControl?: TimeControlKey;
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