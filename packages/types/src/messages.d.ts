export type Color = "white" | "black";
export declare const INIT_GAME: "init_game";
export declare const MOVE: "move";
export declare const GAME_OVER: "game_over";
export declare const JOIN_GAME: "join_game";
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
export type ServerMessage = ServerInitGameMessage | ServerMoveMessage | ServerGameOverMessage;
export interface ClientInitGameMessage {
    type: typeof INIT_GAME;
}
export interface ClientMoveMessage {
    type: typeof MOVE;
    move: MovePayload;
}
export type ClientMessage = ClientInitGameMessage | ClientMoveMessage;
//# sourceMappingURL=messages.d.ts.map