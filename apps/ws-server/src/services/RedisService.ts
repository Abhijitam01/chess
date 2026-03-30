import Redis from 'ioredis';
import { config } from '../config.js';
import { logger } from '../logger.js';

const GAME_TTL = 86400; // 24 hours
const ACTIVE_GAMES_KEY = 'active_games';
const MATCHMAKING_QUEUE_KEY = 'matchmaking:queue';

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
  // Single generic dispatcher — maps channel → raw message handler
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

    // Single top-level dispatcher — registered once, never duplicated
    this.subClient.on('message', (channel, raw) => {
      const handler = this.channelHandlers.get(channel);
      if (handler) {
        try {
          handler(raw);
        } catch {
          // ignore malformed messages
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

  // ── Spectator: live move events ──────────────────────────────────────────

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

  // ── Matchmaking queue ─────────────────────────────────────────────────────

  async enqueueForMatchmaking(userId: string): Promise<void> {
    // Remove any stale entry first to avoid duplicates
    await this.client.lrem(MATCHMAKING_QUEUE_KEY, 0, userId);
    await this.client.lpush(MATCHMAKING_QUEUE_KEY, userId);
  }

  async removeFromMatchmaking(userId: string): Promise<void> {
    await this.client.lrem(MATCHMAKING_QUEUE_KEY, 0, userId);
  }

  /**
   * Atomically pop a pair of users from the queue.
   * Returns [user1, user2] if two are available, null otherwise.
   */
  async tryDequeueMatchedPair(): Promise<[string, string] | null> {
    const script = `
      local count = redis.call('LLEN', KEYS[1])
      if count >= 2 then
        local u1 = redis.call('rpop', KEYS[1])
        local u2 = redis.call('rpop', KEYS[1])
        return {u1, u2}
      end
      return nil
    `;
    const result = await this.client.eval(script, 1, MATCHMAKING_QUEUE_KEY) as string[] | null;
    if (!result || result.length < 2 || !result[0] || !result[1]) return null;
    return [result[0], result[1]];
  }

  // ── User notification channels (cross-node match signalling) ─────────────

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

  // ── Cross-node move routing ───────────────────────────────────────────────

  /**
   * Non-owner nodes publish incoming moves here.
   * The game-owner node processes them and publishes results to game:{id}:events.
   */
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

  /**
   * Game owner publishes processed game events (moves, game_over, time_update).
   * All nodes with local sockets for a game subscribe here to forward events.
   */
  async publishGameEvent(gameId: string, event: Record<string, unknown>): Promise<void> {
    await this.client.publish(`game:${gameId}:events`, JSON.stringify(event));
  }

  subscribeToGameEvents(gameId: string, callback: (event: Record<string, unknown>) => void): void {
    const channel = `game:${gameId}:events`;
    this.channelHandlers.set(channel, (raw) => callback(JSON.parse(raw) as Record<string, unknown>));
    this.subClient.subscribe(channel).catch((err) => {
      logger.error({ err, channel }, '[Redis] failed to subscribe');
    });
  }

  unsubscribeFromGameEvents(gameId: string): void {
    const channel = `game:${gameId}:events`;
    this.channelHandlers.delete(channel);
    this.subClient.unsubscribe(channel).catch(() => {});
  }

  // ── Private lobby ─────────────────────────────────────────────────────────

  /**
   * Store a lobby code → creatorId with 10-minute TTL.
   * Uses NX so two colliding codes don't overwrite each other.
   * Returns true if the key was set, false if a collision occurred.
   */
  async createLobby(code: string, creatorId: string): Promise<boolean> {
    const result = await this.client.set(`lobby:${code}`, creatorId, 'EX', 600, 'NX');
    return result === 'OK';
  }

  /**
   * Atomically GET the creatorId and DELETE the lobby key.
   * Returns the creatorId, or null if the code is unknown/expired.
   */
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

  // ── Direct game messages to a specific user (cross-node INIT_GAME, etc.) ──

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
