import type { IncomingMessage, ServerResponse } from 'http';
import { z } from 'zod';
import type { AuthService } from '../services/AuthService.js';
import type { DatabaseService } from '../services/DatabaseService.js';
import type { RedisService } from '../services/RedisService.js';
import { logger } from '../logger.js';

const SignupSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, 'Username may only contain letters, numbers, and underscores'),
  password: z.string().min(8).max(100),
});

const SigninSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function sendJson<T>(res: ServerResponse, status: number, body: ApiResponse<T>): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(payload);
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

export function createAuthHandler(
  authService: AuthService,
  dbService: DatabaseService,
  redisService: RedisService,
) {
  return async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const url = req.url ?? '';
    const method = req.method ?? '';

    if (method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      });
      res.end();
      return;
    }

    if ((url === '/health' || url === '/healthz') && method === 'GET') {
      const [dbOk, redisOk] = await Promise.all([
        dbService.ping().then(() => true).catch(() => false),
        redisService.ping().then((r) => r === 'PONG').catch(() => false),
      ]);
      if (!dbOk || !redisOk) {
        sendJson(res, 503, { success: false, data: { status: 'unhealthy', db: dbOk, redis: redisOk } });
        return;
      }
      sendJson(res, 200, { success: true, data: { status: 'ok', db: true, redis: true } });
      return;
    }

    if (method === 'POST' && (url === '/auth/signup' || url === '/auth/signin')) {
      let body: Record<string, unknown>;
      try {
        body = (await readBody(req)) as Record<string, unknown>;
      } catch {
        sendJson(res, 400, { success: false, error: 'Invalid JSON body' });
        return;
      }

      const schema = url === '/auth/signup' ? SignupSchema : SigninSchema;
      const parsed = schema.safeParse(body);
      if (!parsed.success) {
        sendJson(res, 400, { success: false, error: parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ') });
        return;
      }
      const { username, password } = parsed.data;

      try {
        if (url === '/auth/signup') {
          const result = await authService.signup(username, password);
          sendJson(res, 201, { success: true, data: result });
        } else {
          const result = await authService.signin(username, password);
          sendJson(res, 200, { success: true, data: result });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Internal error';
        const status = message.includes('already taken') || message.includes('Invalid') ? 400 : 500;
        if (status === 500) logger.error({ err }, 'Auth handler error');
        sendJson(res, status, { success: false, error: message });
      }
      return;
    }

    if (method === 'GET' && url.startsWith('/leaderboard')) {
      const params = new URLSearchParams(url.split('?')[1] ?? '');
      const limit = Math.min(parseInt(params.get('limit') ?? '50', 10), 100);
      try {
        const data = await dbService.getLeaderboard(limit);
        sendJson(res, 200, { success: true, data });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Internal error';
        sendJson(res, 500, { success: false, error: message });
      }
      return;
    }

    const profileMatch = /^\/profile\/([^/?]+)$/.exec(url);
    if (method === 'GET' && profileMatch) {
      const username = decodeURIComponent(profileMatch[1]!);
      try {
        const profile = await dbService.getProfileStats(username);
        if (!profile) {
          sendJson(res, 404, { success: false, error: 'User not found' });
          return;
        }
        const games = await dbService.getUserGames(profile.id, 10);
        sendJson(res, 200, { success: true, data: { ...profile, recentGames: games } });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Internal error';
        sendJson(res, 500, { success: false, error: message });
      }
      return;
    }

    if (method === 'GET' && url === '/games/active') {
      try {
        const gameIds = await redisService.getActiveGames();
        const states = await Promise.all(gameIds.map((id) => redisService.getGameState(id)));

        const playerIds = states.flatMap((s) => s ? [s.whitePlayerId, s.blackPlayerId] : []);
        const profiles = playerIds.length > 0 ? await dbService.getProfilesByIds(playerIds) : {};

        const games = gameIds.map((id, i) => {
          const state = states[i];
          if (!state) return null;
          const white = profiles[state.whitePlayerId];
          const black = profiles[state.blackPlayerId];
          return {
            id,
            whitePlayer: { username: white?.username ?? 'Unknown', rating: white?.rating ?? 1200 },
            blackPlayer: { username: black?.username ?? 'Unknown', rating: black?.rating ?? 1200 },
            fen: state.fen,
            turn: state.turn,
          };
        });
        sendJson(res, 200, { success: true, data: games.filter(Boolean) });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Internal error';
        sendJson(res, 500, { success: false, error: message });
      }
      return;
    }

    const gameMoveMatch = /^\/games\/([^/?]+)\/moves$/.exec(url);
    if (method === 'GET' && gameMoveMatch) {
      const gameId = gameMoveMatch[1]!;
      try {
        let moves = await redisService.getGameMoves(gameId);
        if (!moves || moves.length === 0) {
          const dbMoves = await dbService.getGameMoves(gameId);
          moves = dbMoves.map((m) => ({
            san: m.moveSan,
            uci: m.moveUci,
            fen: m.fen,
            whiteTime: m.timeLeftWhite ?? 0,
            blackTime: m.timeLeftBlack ?? 0,
            moveNumber: m.moveNumber,
          }));
        }
        const state = await redisService.getGameState(gameId);
        sendJson(res, 200, { success: true, data: { moves, fen: state?.fen ?? null } });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Internal error';
        sendJson(res, 500, { success: false, error: message });
      }
      return;
    }

    sendJson(res, 404, { success: false, error: 'Not found' });
  };
}
