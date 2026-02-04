export type Color = "white" | "black";

export const INIT_GAME = "init_game" as const;
export const MOVE = "move" as const;
export const GAME_OVER = "game_over" as const;
export const JOIN_GAME = "join_game" as const;
export const OPONENT_LEFT = "opponent_left" as const;
export const INVALID_MOVE = "invalid_move" as const;

export interface OpponentLeftPayload {
  message: string;
}

export interface InitGamePayload {
  color: Color;
}

export interface MovePayload {
  from: string;
  to: string;
}

export interface GameOverPayload {
  winner: Color;
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

export type ServerMessage =
  | ServerInitGameMessage
  | ServerMoveMessage
  | ServerGameOverMessage
  | ServerOpponentLeftMessage
  | ServerInvalidMoveMessage;

export interface ClientInitGameMessage {
  type: typeof INIT_GAME;
}

export interface ClientMoveMessage {
  type: typeof MOVE;
  move: MovePayload;
}

export type ClientMessage = ClientInitGameMessage | ClientMoveMessage;
