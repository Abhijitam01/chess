export type Color = "white" | "black";
export declare const INIT_GAME: "init_game";
export declare const MOVE: "move";
export declare const GAME_OVER: "game_over";
export declare const JOIN_GAME: "join_game";
export declare const OPONENT_LEFT: "opponent_left";
export declare const INVALID_MOVE: "invalid_move";
export declare const RESIGN: "resign";
export declare const TIME_UPDATE: "time_update";
export declare const DRAW_OFFER: "draw_offer";
export declare const DRAW_ACCEPT: "draw_accept";
export declare const DRAW_DECLINE: "draw_decline";
export declare const AUTH_ERROR: "AUTH_ERROR";
export declare const CREATE_LOBBY: "create_lobby";
export declare const JOIN_LOBBY: "join_lobby";
export declare const LOBBY_CREATED: "lobby_created";
export declare const LOBBY_NOT_FOUND: "lobby_not_found";
export declare const CLOCK_SYNC: "clock_sync";
export type TimeControlCategory = 'bullet' | 'blitz' | 'rapid' | 'classical';
export type TimeControlKey = 'bullet_1' | 'bullet_2' | 'blitz_3' | 'blitz_5' | 'rapid_10' | 'rapid_15' | 'rapid_20' | 'rapid_30' | 'classical_45' | 'classical_60';
export interface TimeControl {
    label: string;
    initialTimeMs: number;
    category: TimeControlCategory;
    minutes: number;
}
export declare const TIME_CONTROLS: Record<TimeControlKey, TimeControl>;
/** Default time control used when none is specified. */
export declare const DEFAULT_TIME_CONTROL: TimeControlKey;
export interface ClientClockSyncMessage {
    type: typeof CLOCK_SYNC;
    payload: {
        whiteTime: number;
        blackTime: number;
        serverTs: number;
    };
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
    payload: {
        whiteTime: number;
        blackTime: number;
        serverTs: number;
    };
}
export type ServerMessage = ServerInitGameMessage | ServerMoveMessage | ServerGameOverMessage | ServerOpponentLeftMessage | ServerResignMessage | ServerInvalidMoveMessage | ServerTimeUpdateMessage | ServerDrawOfferMessage | ServerDrawDeclineMessage | ServerLobbyCreatedMessage | ServerLobbyNotFoundMessage | ServerClockSyncMessage;
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
    payload: {
        code: string;
    };
}
export interface ServerLobbyNotFoundMessage {
    type: typeof LOBBY_NOT_FOUND;
}
export type ClientMessage = ClientInitGameMessage | ClientMoveMessage | ClientResignMessage | ClientDrawOfferMessage | ClientDrawAcceptMessage | ClientDrawDeclineMessage | ClientCreateLobbyMessage | ClientJoinLobbyMessage;
export interface ClientTimeUpdateMessage {
    type: typeof TIME_UPDATE;
}
//# sourceMappingURL=messages.d.ts.map