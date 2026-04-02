import Redis from 'ioredis';
import { config } from '../config.js';
import { logger } from '../logger.js';
import { DEFAULT_TIME_CONTROL, type TimeControlKey } from '@repo/types';

const GAME_TTL = 86400; // 24 hours
const ACTIVE_GAMES_KEY = 'active_games';

function matchmakingQueueKey(timeControl: string): string {
  return `matchmaking:${timeControl}`;
}

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

export interface MatchFoundNotification {
  type: 'match_found';
  gameId: string;
  color: 'white' | 'black';
  opponentId: string;
  timeControl: { whiteTime: number; blackTime: number };
}

export type IncomingGameAction =
  | { type: 'move'; userId: string; from: string; to: string; promotion?: string }
  | { type: 'resign'; userId: string }
  | { type: 'draw_offer'; userId: string }
  | { type: 'draw_accept'; userId: string }
  | { type: 'draw_decline'; userId: string };

export class RedisService {
  private client: Redis;
  private subClient: Redis;
  private channelHandlers = new Map<string, (raw: string) => void>();

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
      logger.error({ err }, '[Redis] client error');
    });

    this.subClient.on('error', (err) => {
      logger.error({ err }, '[Redis] sub error');
    });

    this.subClient.on('message', (channel, raw) => {
      const handler = this.channelHandlers.get(channel);
      if (handler) {
        try {
          handler(raw);
        } catch {
          // ignore
        }
      }
    });
  }

  async connect(): Promise<void> {
    await Promise.all([this.client.connect(), this.subClient.connect()]);
  }

  async disconnect(): Promise<void> {
    await Promise.all([this.client.quit(), this.subClient.quit()]);
  }

  async ping(): Promise<string> {
    return this.client.ping();
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
    this.channelHandlers.set(channel, (raw) => callback(JSON.parse(raw) as LiveMoveEvent));
    this.subClient.subscribe(channel).catch((err) => {
      logger.error({ err, channel }, '[Redis] failed to subscribe');
    });
  }

  unsubscribeFromGame(gameId: string): void {
    const channel = `game:${gameId}:live`;
    this.channelHandlers.delete(channel);
    this.subClient.unsubscribe(channel).catch(() => {});
  }

  async enqueueForMatchmaking(userId: string, timeControl: TimeControlKey = DEFAULT_TIME_CONTROL): Promise<void> {
    const key = matchmakingQueueKey(timeControl);
    await this.client.lrem(key, 0, userId);
    await this.client.lpush(key, userId);
  }

  async removeFromMatchmaking(userId: string, timeControl: TimeControlKey = DEFAULT_TIME_CONTROL): Promise<void> {
    await this.client.lrem(matchmakingQueueKey(timeControl), 0, userId);
  }

  async tryDequeueMatchedPair(timeControl: TimeControlKey = DEFAULT_TIME_CONTROL): Promise<[string, string] | null> {
    const key = matchmakingQueueKey(timeControl);
    const script = `
      local count = redis.call('LLEN', KEYS[1])
      if count >= 2 then
        local u1 = redis.call('rpop', KEYS[1])
        local u2 = redis.call('rpop', KEYS[1])
        return {u1, u2}
      end
      return nil
    `;
    const result = await this.client.eval(script, 1, key) as string[] | null;
    if (!result || result.length < 2 || !result[0] || !result[1]) return null;
    return [result[0], result[1]];
  }

  subscribeToUserNotify(userId: string, callback: (msg: MatchFoundNotification) => void): void {
    const channel = `user:${userId}:notify`;
    this.channelHandlers.set(channel, (raw) => callback(JSON.parse(raw) as MatchFoundNotification));
    this.subClient.subscribe(channel).catch((err) => {
      logger.error({ err, channel }, '[Redis] failed to subscribe');
    });
  }

  unsubscribeFromUserNotify(userId: string): void {
    const channel = `user:${userId}:notify`;
    this.channelHandlers.delete(channel);
    this.subClient.unsubscribe(channel).catch(() => {});
  }

  async publishToUser(userId: string, msg: MatchFoundNotification): Promise<void> {
    await this.client.publish(`user:${userId}:notify`, JSON.stringify(msg));
  }

  async publishMoveToGame(gameId: string, action: IncomingGameAction): Promise<void> {
    await this.client.publish(`game:${gameId}:moves_in`, JSON.stringify(action));
  }

  subscribeToGameMovesIn(gameId: string, callback: (action: IncomingGameAction) => void): void {
    const channel = `game:${gameId}:moves_in`;
    this.channelHandlers.set(channel, (raw) => callback(JSON.parse(raw) as IncomingGameAction));
    this.subClient.subscribe(channel).catch((err) => {
      logger.error({ err, channel }, '[Redis] failed to subscribe');
    });
  }

  unsubscribeFromGameMovesIn(gameId: string): void {
    const channel = `game:${gameId}:moves_in`;
    this.channelHandlers.delete(channel);
    this.subClient.unsubscribe(channel).catch(() => {});
  }

  async createLobby(code: string, creatorId: string): Promise<boolean> {
    const result = await this.client.set(`lobby:${code}`, creatorId, 'EX', 600, 'NX');
    return result === 'OK';
  }

  async popLobby(code: string): Promise<string | null> {
    const script = `
      local v = redis.call('GET', KEYS[1])
      if v then
        redis.call('DEL', KEYS[1])
        return v
      end
      return nil
    `;
    const result = await this.client.eval(script, 1, `lobby:${code}`);
    return typeof result === 'string' ? result : null;
  }

  async publishGameMessageToUser(userId: string, message: string): Promise<void> {
    await this.client.publish(`user:${userId}:game_msg`, message);
  }

  subscribeToUserGameMessages(userId: string, callback: (msg: string) => void): void {
    const channel = `user:${userId}:game_msg`;
    this.channelHandlers.set(channel, callback);
    this.subClient.subscribe(channel).catch((err) => {
      logger.error({ err, channel }, '[Redis] failed to subscribe');
    });
  }

  unsubscribeFromUserGameMessages(userId: string): void {
    const channel = `user:${userId}:game_msg`;
    this.channelHandlers.delete(channel);
    this.subClient.unsubscribe(channel).catch(() => {});
  }
}
