export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const JOIN_GAME = "join_game";
export const OPONENT_LEFT = "opponent_left";
export const INVALID_MOVE = "invalid_move";
export const RESIGN = "resign";
export const TIME_UPDATE = "time_update";
export const DRAW_OFFER = "draw_offer";
export const DRAW_ACCEPT = "draw_accept";
export const DRAW_DECLINE = "draw_decline";
export const AUTH_ERROR = "AUTH_ERROR";
export const CREATE_LOBBY = "create_lobby";
export const JOIN_LOBBY = "join_lobby";
export const LOBBY_CREATED = "lobby_created";
export const LOBBY_NOT_FOUND = "lobby_not_found";
export const CLOCK_SYNC = "clock_sync";

export const TIME_CONTROLS = {
  bullet:    { label: 'Bullet (1 min)',     initialTimeMs: 60_000 },
  blitz:     { label: 'Blitz (5 min)',      initialTimeMs: 300_000 },
  rapid:     { label: 'Rapid (10 min)',     initialTimeMs: 600_000 },
  classical: { label: 'Classical (30 min)', initialTimeMs: 1_800_000 },
};

export const DEFAULT_TIME_CONTROL = 'blitz';
