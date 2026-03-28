import { WebSocket } from "ws";
import { Game } from "./game.js";
import { INIT_GAME, MOVE, RESIGN, DRAW_OFFER, DRAW_ACCEPT, DRAW_DECLINE, type ClientMessage } from "@repo/types";
import { DatabaseService } from "./services/DatabaseService.js";
import { RedisService } from "./services/RedisService.js";

export class GameManager {
  private games: Game[] = [];
  private pendingUser: { socket: WebSocket; userId: string } | null = null;
  private socketToUserId: Map<WebSocket, string> = new Map();
  private userIdToGame: Map<string, Game> = new Map();
  private spectatorSockets: Map<string, Set<WebSocket>> = new Map();
  private dbService: DatabaseService;
  private redisService: RedisService;

  constructor(dbService: DatabaseService, redisService: RedisService) {
    this.dbService = dbService;
    this.redisService = redisService;
  }

  addUserToGame(socket: WebSocket, userId: string): void {
    this.socketToUserId.set(socket, userId);
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
            if (ws.readyState === ws.OPEN) {
              ws.send(msg);
            }
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

    if (this.pendingUser?.socket === socket) {
      this.pendingUser = null;
    }

    // Don't remove from userIdToGame on disconnect — player may reconnect
  }

  private cleanupGame(game: Game): void {
    this.games = this.games.filter((g) => g !== game);
    this.userIdToGame.delete(game.whitePlayerId);
    this.userIdToGame.delete(game.blackPlayerId);
  }

  private addHandler(socket: WebSocket, userId: string): void {
    socket.on("message", async (data) => {
      let message: ClientMessage;
      try {
        message = JSON.parse(data.toString()) as ClientMessage;
      } catch {
        return;
      }

      if (message.type === INIT_GAME) {
        // Check if user has an active game in Redis
        const activeGameId = await this.redisService.getActiveGameForUser(userId);
        const existingGame = this.userIdToGame.get(userId);

        if (existingGame && !existingGame.isFinished()) {
          // Reconnect to existing in-memory game
          existingGame.reconnectPlayer(socket, userId);
          this.socketToUserId.set(socket, userId);
          return;
        }

        if (activeGameId) {
          // Active game in Redis but not in memory — game was lost on server restart
          // Clean up stale Redis entry and allow new matchmaking
          await this.redisService.finishGame(
            activeGameId,
            userId,
            userId, // placeholder; finishGame deletes user keys regardless
          );
        }

        // Normal matchmaking
        if (this.pendingUser) {
          const { socket: pendingSocket, userId: pendingUserId } = this.pendingUser;
          this.pendingUser = null;

          const game = new Game(
            pendingSocket,
            socket,
            pendingUserId,
            userId,
            this.dbService,
            this.redisService,
          );

          this.games.push(game);
          this.userIdToGame.set(pendingUserId, game);
          this.userIdToGame.set(userId, game);
        } else {
          this.pendingUser = { socket, userId };
        }

        return;
      }

      if (message.type === MOVE) {
        const game = this.userIdToGame.get(userId);
        if (game && !game.isFinished()) {
          await game.makeMove(socket, message.move);
          if (game.isFinished()) {
            this.cleanupGame(game);
          }
        }
        return;
      }

      if (message.type === RESIGN) {
        const game = this.userIdToGame.get(userId);
        if (game && !game.isFinished()) {
          game.resign(socket);
          this.cleanupGame(game);
        }
        return;
      }

      if (message.type === DRAW_OFFER) {
        const game = this.userIdToGame.get(userId);
        if (game && !game.isFinished()) {
          game.offerDraw(socket);
        }
        return;
      }

      if (message.type === DRAW_ACCEPT) {
        const game = this.userIdToGame.get(userId);
        if (game && !game.isFinished()) {
          await game.respondDraw(socket, true);
          if (game.isFinished()) {
            this.cleanupGame(game);
          }
        }
        return;
      }

      if (message.type === DRAW_DECLINE) {
        const game = this.userIdToGame.get(userId);
        if (game && !game.isFinished()) {
          await game.respondDraw(socket, false);
        }
        return;
      }
    });
  }
}
