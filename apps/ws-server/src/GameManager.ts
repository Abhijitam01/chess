import { webcrypto } from "crypto";
import { WebSocket } from "ws";
import { z } from "zod";
import { Game } from "./game.js";
import {
  INIT_GAME, MOVE, RESIGN, DRAW_OFFER, DRAW_ACCEPT, DRAW_DECLINE,
  CREATE_LOBBY, JOIN_LOBBY, LOBBY_CREATED, LOBBY_NOT_FOUND,
  TIME_CONTROLS, DEFAULT_TIME_CONTROL,
  type TimeControlKey,
  type ClientMessage,
} from "@repo/types";
import { DatabaseService } from "./services/DatabaseService.js";
import { RedisService, type MatchFoundNotification, type IncomingGameAction } from "./services/RedisService.js";
import { logger } from "./logger.js";

// ── Input validation schemas ─────────────────────────────────────────────────

const MovePayloadSchema = z.object({
  from: z.string().min(2).max(2),
  to: z.string().min(2).max(2),
  promotion: z.string().optional(),
});

const TimeControlKeySchema = z.enum(['bullet', 'blitz', 'rapid', 'classical']);

const ClientMessageSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal(INIT_GAME), timeControl: TimeControlKeySchema.optional() }),
  z.object({ type: z.literal(MOVE), move: MovePayloadSchema }),
  z.object({ type: z.literal(RESIGN) }),
  z.object({ type: z.literal(DRAW_OFFER) }),
  z.object({ type: z.literal(DRAW_ACCEPT) }),
  z.object({ type: z.literal(DRAW_DECLINE) }),
  z.object({ type: z.literal(CREATE_LOBBY) }),
  z.object({ type: z.literal(JOIN_LOBBY), code: z.string().length(6).regex(/^[0-9a-f]{6}$/) }),
]);

// ── Rate limiter (token bucket, 10 msgs/s per socket) ───────────────────────

interface RateBucket {
  tokens: number;
  lastRefill: number;
  overageStreak: number;
}

const RATE_LIMIT = 10;
const OVERAGE_CLOSE_THRESHOLD = 5;

// ── Remote player proxy ──────────────────────────────────────────────────────
// Implements just enough of the WebSocket interface for Game to route messages
// to a player whose socket lives on a different server node.

class RemotePlayerProxy {
  readonly readyState = 1 as const; // OPEN

  constructor(
    readonly userId: string,
    private readonly redis: RedisService,
  ) {}

  send(data: string): void {
    this.redis.publishGameMessageToUser(this.userId, data).catch((err) =>
      logger.error({ err, userId: this.userId }, '[RemotePlayerProxy] send failed'),
    );
  }
}

// ── GameManager ──────────────────────────────────────────────────────────────

export class GameManager {
  /** Games whose engine runs on this node. */
  private games: Game[] = [];
  /** socket → userId for every player connected to this node. */
  private socketToUserId: Map<WebSocket, string> = new Map();
  /** userId → socket (reverse of socketToUserId). */
  private userIdToSocket: Map<string, WebSocket> = new Map();
  /** userId → Game for locally-owned games. */
  private userIdToGame: Map<string, Game> = new Map();
  /** userId → gameId for games owned by a remote node. */
  private remoteGameIds: Map<string, string> = new Map();
  /** Spectator sockets per gameId. */
  private spectatorSockets: Map<string, Set<WebSocket>> = new Map();
  /** Per-socket token buckets. */
  private rateBuckets: Map<WebSocket, RateBucket> = new Map();

  constructor(
    private readonly dbService: DatabaseService,
    private readonly redisService: RedisService,
  ) {}

  // ── Public API ─────────────────────────────────────────────────────────────

  addUserToGame(socket: WebSocket, userId: string): void {
    this.socketToUserId.set(socket, userId);
    this.userIdToSocket.set(userId, socket);
    this.rateBuckets.set(socket, { tokens: RATE_LIMIT, lastRefill: Date.now(), overageStreak: 0 });
    this.addHandler(socket, userId);
  }

  addSpectator(gameId: string, socket: WebSocket): void {
    if (!this.spectatorSockets.has(gameId)) {
      this.spectatorSockets.set(gameId, new Set());
      this.redisService.subscribeToGame(gameId, (event) => {
        const msg = JSON.stringify({ type: MOVE, payload: event });
        const spectators = this.spectatorSockets.get(gameId);
        if (spectators) {
          for (const ws of spectators) {
            if (ws.readyState === ws.OPEN) ws.send(msg);
          }
        }
      });
    }
    this.spectatorSockets.get(gameId)!.add(socket);
  }

  removeSpectator(gameId: string, socket: WebSocket): void {
    const spectators = this.spectatorSockets.get(gameId);
    if (!spectators) return;
    spectators.delete(socket);
    if (spectators.size === 0) {
      this.spectatorSockets.delete(gameId);
      this.redisService.unsubscribeFromGame(gameId);
    }
  }

  removeUserFromGame(socket: WebSocket): void {
    const userId = this.socketToUserId.get(socket);
    this.socketToUserId.delete(socket);
    this.rateBuckets.delete(socket);

    if (userId) {
      this.userIdToSocket.delete(userId);
      // Clean up per-user Redis subscriptions so they don't fire on a dead socket
      this.redisService.unsubscribeFromUserNotify(userId);
      this.redisService.unsubscribeFromUserGameMessages(userId);
      this.remoteGameIds.delete(userId);
    }
    // userIdToGame is intentionally NOT cleared — player may reconnect to local game
  }

  // ── Rate limiting ──────────────────────────────────────────────────────────

  private checkRateLimit(socket: WebSocket): boolean {
    const bucket = this.rateBuckets.get(socket);
    if (!bucket) return true; // spectators have no bucket — allow

    const now = Date.now();
    const elapsed = (now - bucket.lastRefill) / 1000;
    bucket.tokens = Math.min(RATE_LIMIT, bucket.tokens + elapsed * RATE_LIMIT);
    bucket.lastRefill = now;

    if (bucket.tokens < 1) {
      bucket.overageStreak++;
      if (bucket.overageStreak >= OVERAGE_CLOSE_THRESHOLD) {
        socket.close(1008, "Rate limit exceeded");
      }
      return false;
    }

    bucket.tokens--;
    bucket.overageStreak = 0;
    return true;
  }

  // ── Message handler ────────────────────────────────────────────────────────

  private addHandler(socket: WebSocket, userId: string): void {
    socket.on("message", async (data) => {
      if (!this.checkRateLimit(socket)) return;

      let message: ClientMessage;
      try {
        const raw = JSON.parse(data.toString());
        const parsed = ClientMessageSchema.safeParse(raw);
        if (!parsed.success) return;
        message = parsed.data as ClientMessage;
      } catch {
        return;
      }

      switch (message.type) {
        case INIT_GAME:
          await this.handleInitGame(socket, userId, message.timeControl ?? DEFAULT_TIME_CONTROL);
          break;

        case MOVE: {
          const localGame = this.userIdToGame.get(userId);
          if (localGame && !localGame.isFinished()) {
            await localGame.makeMove(socket, message.move);
            if (localGame.isFinished()) this.cleanupGame(localGame);
            break;
          }
          // Game lives on a remote node — forward via Redis
          const remoteId = this.remoteGameIds.get(userId);
          if (remoteId) {
            await this.redisService.publishMoveToGame(remoteId, {
              type: "move",
              userId,
              from: message.move.from,
              to: message.move.to,
              promotion: message.move.promotion,
            });
          }
          break;
        }

        case RESIGN: {
          const localGame = this.userIdToGame.get(userId);
          if (localGame && !localGame.isFinished()) {
            localGame.resign(socket);
            this.cleanupGame(localGame);
            break;
          }
          const remoteId = this.remoteGameIds.get(userId);
          if (remoteId) {
            await this.redisService.publishMoveToGame(remoteId, { type: "resign", userId });
          }
          break;
        }

        case DRAW_OFFER: {
          const localGame = this.userIdToGame.get(userId);
          if (localGame && !localGame.isFinished()) {
            localGame.offerDraw(socket);
            break;
          }
          const remoteId = this.remoteGameIds.get(userId);
          if (remoteId) {
            await this.redisService.publishMoveToGame(remoteId, { type: "draw_offer", userId });
          }
          break;
        }

        case DRAW_ACCEPT: {
          const localGame = this.userIdToGame.get(userId);
          if (localGame && !localGame.isFinished()) {
            await localGame.respondDraw(socket, true);
            if (localGame.isFinished()) this.cleanupGame(localGame);
            break;
          }
          const remoteId = this.remoteGameIds.get(userId);
          if (remoteId) {
            await this.redisService.publishMoveToGame(remoteId, { type: "draw_accept", userId });
          }
          break;
        }

        case DRAW_DECLINE: {
          const localGame = this.userIdToGame.get(userId);
          if (localGame && !localGame.isFinished()) {
            await localGame.respondDraw(socket, false);
            break;
          }
          const remoteId = this.remoteGameIds.get(userId);
          if (remoteId) {
            await this.redisService.publishMoveToGame(remoteId, { type: "draw_decline", userId });
          }
          break;
        }

        case CREATE_LOBBY:
          await this.handleCreateLobby(socket, userId);
          break;

        case JOIN_LOBBY:
          await this.handleJoinLobby(socket, userId, message.code);
          break;
      }
    });
  }

  // ── Matchmaking ────────────────────────────────────────────────────────────

  private async handleInitGame(socket: WebSocket, userId: string, timeControl: TimeControlKey = DEFAULT_TIME_CONTROL): Promise<void> {
    // 1. Reconnect to a game this node owns
    const existingGame = this.userIdToGame.get(userId);
    if (existingGame && !existingGame.isFinished()) {
      existingGame.reconnectPlayer(socket, userId);
      this.userIdToSocket.set(userId, socket);
      return;
    }

    // 2. Reconnect to a game owned by a remote node
    const remoteGameId = this.remoteGameIds.get(userId);
    if (remoteGameId) {
      this.forwardUserGameMessages(userId, socket);
      return;
    }

    // 3. Clean up any stale Redis active-game entry
    const activeGameId = await this.redisService.getActiveGameForUser(userId);
    if (activeGameId) {
      await this.redisService.finishGame(activeGameId, userId, userId);
    }

    // 4. Enqueue in the time-control-specific matchmaking queue (idempotent)
    await this.redisService.enqueueForMatchmaking(userId, timeControl);

    // 5. Atomically try to dequeue a matched pair from the same time-control queue
    const pair = await this.redisService.tryDequeueMatchedPair(timeControl);
    if (pair) {
      const [userA, userB] = pair;
      await this.createGameForMatch(userA, userB, timeControl);
    } else {
      // Wait for a cross-node match_found notification
      this.redisService.subscribeToUserNotify(userId, (notification) => {
        this.handleMatchNotification(userId, notification).catch((err) =>
          logger.error({ err, userId }, '[GameManager] handleMatchNotification error'),
        );
      });
    }
  }

  /**
   * This node won the race and will own the game.
   * Either or both players may have sockets on remote nodes.
   */
  private async createGameForMatch(
    whiteUserId: string,
    blackUserId: string,
    timeControl: TimeControlKey = DEFAULT_TIME_CONTROL,
  ): Promise<void> {
    const whiteSocket = this.userIdToSocket.get(whiteUserId);
    const blackSocket = this.userIdToSocket.get(blackUserId);

    const whitePlayer = (whiteSocket ??
      new RemotePlayerProxy(whiteUserId, this.redisService)) as unknown as WebSocket;
    const blackPlayer = (blackSocket ??
      new RemotePlayerProxy(blackUserId, this.redisService)) as unknown as WebSocket;

    const game = new Game(
      whitePlayer,
      blackPlayer,
      whiteUserId,
      blackUserId,
      this.dbService,
      this.redisService,
      (gameId) =>
        this.onGameReady(gameId, game, whiteUserId, blackUserId, !!whiteSocket, !!blackSocket, timeControl),
      timeControl,
    );

    this.games.push(game);
    // Register locally so moves from this node's sockets route directly
    if (whiteSocket) this.userIdToGame.set(whiteUserId, game);
    if (blackSocket) this.userIdToGame.set(blackUserId, game);
  }

  /**
   * Fires once the DB record is created and we have a stable gameId.
   */
  private onGameReady(
    gameId: string,
    game: Game,
    whiteUserId: string,
    blackUserId: string,
    whiteIsLocal: boolean,
    blackIsLocal: boolean,
    timeControl: TimeControlKey = DEFAULT_TIME_CONTROL,
  ): void {
    const initialTimeMs = TIME_CONTROLS[timeControl].initialTimeMs;
    // Subscribe to incoming actions from remote nodes
    this.redisService.subscribeToGameMovesIn(gameId, (action) => {
      this.handleIncomingAction(action, game).catch((err) =>
        logger.error({ err, gameId }, '[GameManager] handleIncomingAction error'),
      );
    });

    // Notify remote players of the gameId so they can start forwarding messages
    if (!whiteIsLocal) {
      this.redisService
        .publishToUser(whiteUserId, {
          type: "match_found",
          gameId,
          color: "white",
          opponentId: blackUserId,
          timeControl: { whiteTime: initialTimeMs, blackTime: initialTimeMs },
        })
        .catch((err) => logger.error({ err }, '[GameManager] publishToUser failed'));
    }
    if (!blackIsLocal) {
      this.redisService
        .publishToUser(blackUserId, {
          type: "match_found",
          gameId,
          color: "black",
          opponentId: whiteUserId,
          timeControl: { whiteTime: initialTimeMs, blackTime: initialTimeMs },
        })
        .catch((err) => logger.error({ err }, '[GameManager] publishToUser failed'));
    }
  }

  /**
   * Called on a non-owner node when match_found arrives via user notify channel.
   */
  private async handleMatchNotification(
    userId: string,
    notification: MatchFoundNotification,
  ): Promise<void> {
    this.redisService.unsubscribeFromUserNotify(userId);

    const socket = this.userIdToSocket.get(userId);
    if (!socket) return; // player disconnected before the match fired

    this.remoteGameIds.set(userId, notification.gameId);
    this.forwardUserGameMessages(userId, socket);
  }

  /** Subscribe to Redis game messages for a user and pipe them to their local socket. */
  private forwardUserGameMessages(userId: string, socket: WebSocket): void {
    this.redisService.subscribeToUserGameMessages(userId, (msg) => {
      if (socket.readyState === socket.OPEN) {
        socket.send(msg);
      }
    });
  }

  /** Handle a game action that arrived from a remote node via moves_in channel. */
  private async handleIncomingAction(action: IncomingGameAction, game: Game): Promise<void> {
    if (game.isFinished()) return;

    const playerSocket =
      action.userId === game.whitePlayerId ? game.player1 : game.player2;

    switch (action.type) {
      case "move":
        await game.makeMove(playerSocket, {
          from: action.from,
          to: action.to,
          promotion: action.promotion,
        });
        if (game.isFinished()) this.cleanupGame(game);
        break;
      case "resign":
        game.resign(playerSocket);
        this.cleanupGame(game);
        break;
      case "draw_offer":
        game.offerDraw(playerSocket);
        break;
      case "draw_accept":
        await game.respondDraw(playerSocket, true);
        if (game.isFinished()) this.cleanupGame(game);
        break;
      case "draw_decline":
        await game.respondDraw(playerSocket, false);
        break;
    }
  }

  // ── Lobby ───────────────────────────────────────────────────────────────────

  private async handleCreateLobby(socket: WebSocket, userId: string): Promise<void> {
    // Retry on the rare collision (birthday probability ~1/16M for 6-char hex)
    let code: string;
    let stored = false;
    let attempts = 0;
    do {
      code = Buffer.from(webcrypto.getRandomValues(new Uint8Array(3))).toString('hex');
      stored = await this.redisService.createLobby(code, userId);
      attempts++;
    } while (!stored && attempts < 5);

    if (!stored) {
      logger.error({ userId }, '[GameManager] failed to generate unique lobby code');
      return;
    }

    socket.send(JSON.stringify({ type: LOBBY_CREATED, payload: { code } }));
    logger.info({ userId, code }, '[GameManager] lobby created');
  }

  private async handleJoinLobby(socket: WebSocket, userId: string, code: string): Promise<void> {
    const creatorId = await this.redisService.popLobby(code);

    if (!creatorId) {
      socket.send(JSON.stringify({ type: LOBBY_NOT_FOUND }));
      return;
    }

    if (creatorId === userId) {
      // Creator joined their own code — treat as LOBBY_NOT_FOUND to avoid self-game
      socket.send(JSON.stringify({ type: LOBBY_NOT_FOUND }));
      return;
    }

    logger.info({ creatorId, joinerId: userId, code }, '[GameManager] lobby joined — creating game');
    // Creator is white, joiner is black (deterministic); lobby games default to blitz
    await this.createGameForMatch(creatorId, userId, DEFAULT_TIME_CONTROL);
  }

  private cleanupGame(game: Game): void {
    const gameId = game.getGameId();
    if (gameId) this.redisService.unsubscribeFromGameMovesIn(gameId);
    this.games = this.games.filter((g) => g !== game);
    this.userIdToGame.delete(game.whitePlayerId);
    this.userIdToGame.delete(game.blackPlayerId);
  }
}
