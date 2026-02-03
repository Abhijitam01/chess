export type Color = "white" | "black";

export const INIT_GAME = "init_game" as const;
export const MOVE = "move" as const;
export const GAME_OVER = "game_over" as const;
export const JOIN_GAME = "join_game" as const;

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

export interface ServerMoveMessage {
  type: typeof MOVE;
  payload: MovePayload;
}

export interface ServerGameOverMessage {
  type: typeof GAME_OVER;
  payload: GameOverPayload;
}

export type ServerMessage =
  | ServerInitGameMessage
  | ServerMoveMessage
  | ServerGameOverMessage;

export interface ClientInitGameMessage {
  type: typeof INIT_GAME;
}

export interface ClientMoveMessage {
  type: typeof MOVE;
  move: MovePayload;
}

export type ClientMessage = ClientInitGameMessage | ClientMoveMessage;
