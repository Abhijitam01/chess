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

export const DEFAULT_TIME_CONTROL = 'blitz_5';
