import * as http from 'http';
import { WebSocketServer } from 'ws';
import type { DatabaseService } from './services/DatabaseService.js';
import type { RedisService } from './services/RedisService.js';
import type { AuthService } from './services/AuthService.js';
import { createAuthHandler } from './routes/auth.js';
import { GameManager } from './GameManager.js';
import { logger } from './logger.js';

export interface ServerDeps {
  dbService: DatabaseService;
  redisService: RedisService;
  authService: AuthService;
}

export interface ServerInstance {
  httpServer: http.Server;
  wss: WebSocketServer;
  gameManager: GameManager;
  shutdown: (signal: string) => Promise<void>;
}

export function createServer(deps: ServerDeps): ServerInstance {
  const { dbService, redisService, authService } = deps;

  const authHandler = createAuthHandler(authService, dbService, redisService);
  const httpServer = http.createServer(authHandler);
  const wss = new WebSocketServer({ server: httpServer });
  const gameManager = new GameManager(dbService, redisService);

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const token = url.searchParams.get('token');
    const spectateGameId = url.searchParams.get('spectate');

    if (!token) {
      ws.send(JSON.stringify({ type: 'AUTH_ERROR', payload: { message: 'Authentication required' } }));
      ws.close(1008, 'Authentication required');
      return;
    }

    let userId: string;
    try {
      const payload = authService.verifyToken(token);
      userId = payload.userId;
    } catch {
      ws.send(JSON.stringify({ type: 'AUTH_ERROR', payload: { message: 'Invalid or expired token' } }));
      ws.close(1008, 'Invalid token');
      return;
    }

    if (spectateGameId) {
      gameManager.addSpectator(spectateGameId, ws);
      ws.on('close', () => {
        gameManager.removeSpectator(spectateGameId, ws);
      });
      return;
    }

    gameManager.addUserToGame(ws, userId);
    ws.on('close', () => {
      gameManager.removeUserFromGame(ws);
    });
  });

  async function shutdown(signal: string): Promise<void> {
    logger.info(`[Server] ${signal} received — starting graceful shutdown`);

    wss.close();
    httpServer.close();

    const shutdownMsg = JSON.stringify({ type: 'server_shutdown', payload: { message: 'Server is restarting, please reconnect' } });
    for (const client of wss.clients) {
      if (client.readyState === client.OPEN) {
        client.send(shutdownMsg);
        client.close(1001, 'Server shutting down');
      }
    }

    await new Promise<void>((resolve) => setTimeout(resolve, Math.min(wss.clients.size > 0 ? 5000 : 0, 30000)));
    await redisService.disconnect();
    logger.info('[Server] Shutdown complete');
  }

  return { httpServer, wss, gameManager, shutdown };
}
