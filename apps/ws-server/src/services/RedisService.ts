import Redis from 'ioredis';
import { config } from '../config.js';

const GAME_TTL = 86400; // 24 hours
const ACTIVE_GAMES_KEY = 'active_games';

export interface GameState {
  fen: string;
  whiteTime: number;
  blackTime: number;
  turn: 'w' | 'b';
  status: 'active' | 'finished';
  whitePlayerId: string;
  blackPlayerId: string;
}

export interface MoveRecord {
  san: string;
  uci: string;
  fen: string;
  whiteTime: number;
  blackTime: number;
  moveNumber: number;
}

export interface LiveMoveEvent {
  gameId: string;
  move: MoveRecord;
  fen: string;
  whiteTime: number;
  blackTime: number;
  turn: 'w' | 'b';
}

export class RedisService {
  private client: Redis;
  private subClient: Redis;

  constructor() {
    this.client = new Redis(config.redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    });

    this.subClient = new Redis(config.redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    });

    this.client.on('error', (err) => {
      console.error('[Redis] client error:', err.message);
    });

    this.subClient.on('error', (err) => {
      console.error('[Redis] sub error:', err.message);
    });
  }

  async connect(): Promise<void> {
    await Promise.all([this.client.connect(), this.subClient.connect()]);
  }

  async disconnect(): Promise<void> {
    await Promise.all([this.client.quit(), this.subClient.quit()]);
  }

  async initGame(
    gameId: string,
    whitePlayerId: string,
    blackPlayerId: string,
    initialFen: string,
    whiteTime: number,
    blackTime: number,
  ): Promise<void> {
    const state: GameState = {
      fen: initialFen,
      whiteTime,
      blackTime,
      turn: 'w',
      status: 'active',
      whitePlayerId,
      blackPlayerId,
    };

    await Promise.all([
      this.client.set(`game:${gameId}:state`, JSON.stringify(state), 'EX', GAME_TTL),
      this.client.set(`user:${whitePlayerId}:activeGame`, gameId, 'EX', GAME_TTL),
      this.client.set(`user:${blackPlayerId}:activeGame`, gameId, 'EX', GAME_TTL),
      this.client.sadd(ACTIVE_GAMES_KEY, gameId),
    ]);
  }

  async publishMove(
    gameId: string,
    move: MoveRecord,
    fen: string,
    whiteTime: number,
    blackTime: number,
    turn: 'w' | 'b',
  ): Promise<void> {
    const stateRaw = await this.client.get(`game:${gameId}:state`);
    if (!stateRaw) return;

    const state: GameState = {
      ...JSON.parse(stateRaw),
      fen,
      whiteTime,
      blackTime,
      turn,
    };

    const event: LiveMoveEvent = { gameId, move, fen, whiteTime, blackTime, turn };

    await Promise.all([
      this.client.set(`game:${gameId}:state`, JSON.stringify(state), 'EX', GAME_TTL),
      this.client.rpush(`game:${gameId}:moves`, JSON.stringify(move)),
      this.client.expire(`game:${gameId}:moves`, GAME_TTL),
      this.client.publish(`game:${gameId}:live`, JSON.stringify(event)),
    ]);
  }

  async getGameState(gameId: string): Promise<GameState | null> {
    const raw = await this.client.get(`game:${gameId}:state`);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  }

  async getGameMoves(gameId: string): Promise<MoveRecord[]> {
    const raw = await this.client.lrange(`game:${gameId}:moves`, 0, -1);
    return raw.map((r) => JSON.parse(r) as MoveRecord);
  }

  async getActiveGameForUser(userId: string): Promise<string | null> {
    return this.client.get(`user:${userId}:activeGame`);
  }

  async getActiveGames(): Promise<string[]> {
    return this.client.smembers(ACTIVE_GAMES_KEY);
  }

  async finishGame(gameId: string, whitePlayerId: string, blackPlayerId: string): Promise<void> {
    const stateRaw = await this.client.get(`game:${gameId}:state`);
    if (stateRaw) {
      const state: GameState = { ...JSON.parse(stateRaw), status: 'finished' };
      await this.client.set(`game:${gameId}:state`, JSON.stringify(state), 'EX', 3600);
    }

    await Promise.all([
      this.client.del(`user:${whitePlayerId}:activeGame`),
      this.client.del(`user:${blackPlayerId}:activeGame`),
      this.client.srem(ACTIVE_GAMES_KEY, gameId),
    ]);
  }

  subscribeToGame(gameId: string, callback: (event: LiveMoveEvent) => void): void {
    const channel = `game:${gameId}:live`;
    this.subClient.subscribe(channel).catch((err) => {
      console.error(`[Redis] failed to subscribe to ${channel}:`, err);
    });
    this.subClient.on('message', (ch, message) => {
      if (ch === channel) {
        try {
          callback(JSON.parse(message) as LiveMoveEvent);
        } catch {
          // ignore malformed messages
        }
      }
    });
  }

  unsubscribeFromGame(gameId: string): void {
    this.subClient.unsubscribe(`game:${gameId}:live`).catch(() => {
      // ignore
    });
  }
}
