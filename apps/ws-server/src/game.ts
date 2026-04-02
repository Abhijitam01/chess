import { WebSocket } from "ws";
import { Game as ChessGame } from "@chess/chess-engine";
import { DatabaseService } from "./services/DatabaseService.js";
import { RedisService } from "./services/RedisService.js";
import { logger } from "./logger.js";
import {
  GAME_OVER,
  TIME_UPDATE,
  CLOCK_SYNC,
  INIT_GAME,
  INVALID_MOVE,
  MOVE,
  DRAW_OFFER,
  DRAW_DECLINE,
  TIME_CONTROLS,
  DEFAULT_TIME_CONTROL,
  type TimeControlKey,
  type MovePayload,
} from "@repo/types";

const K_FACTOR = 32;
const CLOCK_SYNC_INTERVAL_MS = 3_000;

export function calcElo(playerRating: number, opponentRating: number, actual: 1 | 0 | 0.5): number {
  const expected = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  return Math.round(K_FACTOR * (actual - expected));
}

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public engine: ChessGame;
  private startTime: number;
  private whiteTime: number;
  private blackTime: number;
  private lastMoveTime: number = Date.now();
  private clockInterval: NodeJS.Timeout | null = null;
  private clockSyncInterval: NodeJS.Timeout | null = null;
  private gameId?: string;
  readonly whitePlayerId: string;
  readonly blackPlayerId: string;
  private whiteRating: number = 1000;
  private blackRating: number = 1000;
  private dbService: DatabaseService;
  private redisService: RedisService;
  private finished = false;
  private pendingDrawFrom: WebSocket | null = null;
  private onReady?: (gameId: string) => void;

  constructor(
    player1: WebSocket,
    player2: WebSocket,
    whitePlayerId: string,
    blackPlayerId: string,
    dbService: DatabaseService,
    redisService: RedisService,
    onReady?: (gameId: string) => void,
    timeControl: TimeControlKey = DEFAULT_TIME_CONTROL,
  ) {
    this.player1 = player1;
    this.player2 = player2;
    this.whitePlayerId = whitePlayerId;
    this.blackPlayerId = blackPlayerId;
    this.engine = new ChessGame();
    this.startTime = Date.now();
    this.dbService = dbService;
    this.redisService = redisService;
    this.onReady = onReady;

    const initialTimeMs = TIME_CONTROLS[timeControl].initialTimeMs;
    this.whiteTime = initialTimeMs;
    this.blackTime = initialTimeMs;

    this.initializeGame();
  }

  reconnectPlayer(socket: WebSocket, userId: string): void {
    if (userId === this.whitePlayerId) {
      this.player1 = socket;
    } else if (userId === this.blackPlayerId) {
      this.player2 = socket;
    }

    socket.send(JSON.stringify({
      type: INIT_GAME,
      payload: {
        color: userId === this.whitePlayerId ? 'white' : 'black',
        fen: this.engine.getBoard().fen(),
        whiteTime: this.whiteTime,
        blackTime: this.blackTime,
        resumed: true,
      },
    }));

    socket.send(JSON.stringify({
      type: CLOCK_SYNC,
      payload: { whiteTime: this.whiteTime, blackTime: this.blackTime, serverTs: Date.now() },
    }));
  }

  isFinished(): boolean {
    return this.finished;
  }

  getGameId(): string | undefined {
    return this.gameId;
  }

  private async initializeGame(): Promise<void> {
    try {
      const [white, black] = await Promise.all([
        this.dbService.getProfileById(this.whitePlayerId),
        this.dbService.getProfileById(this.blackPlayerId),
      ]);
      this.whiteRating = white?.rating ?? 1000;
      this.blackRating = black?.rating ?? 1000;

      const game = await this.dbService.createGame(
        this.whitePlayerId,
        this.blackPlayerId,
        this.whiteRating,
        this.blackRating,
      );
      this.gameId = game.id;
      this.onReady?.(this.gameId);

      await this.redisService.initGame(
        this.gameId,
        this.whitePlayerId,
        this.blackPlayerId,
        this.engine.getBoard().fen(),
        this.whiteTime,
        this.blackTime,
      );

      const whiteMsg = JSON.stringify({ type: INIT_GAME, payload: { color: 'white', gameId: this.gameId } });
      const blackMsg = JSON.stringify({ type: INIT_GAME, payload: { color: 'black', gameId: this.gameId } });
      this.player1.send(whiteMsg);
      this.player2.send(blackMsg);

      this.startClock();
      this.startClockSync();
    } catch (e) {
      logger.error({ err: e }, 'Failed to initialize game');
    }
  }

  private startClock(): void {
    this.clockInterval = setInterval(() => {
      if (this.engine.moveCount() === 0) {
        this.lastMoveTime = Date.now();
        return;
      }

      const now = Date.now();
      const elapsed = now - this.lastMoveTime;

      if (this.engine.getTurn() === 'w') {
        this.whiteTime -= elapsed;
      } else {
        this.blackTime -= elapsed;
      }
      this.lastMoveTime = now;

      if (this.whiteTime <= 0 || this.blackTime <= 0) {
        this.handleTimeOut();
        return;
      }

      this.broadcastTime();
    }, 100);
  }

  private broadcastTime(): void {
    const msg = JSON.stringify({
      type: TIME_UPDATE,
      payload: { whiteTime: this.whiteTime, blackTime: this.blackTime },
    });
    this.player1.send(msg);
    this.player2.send(msg);
  }

  private startClockSync(): void {
    this.clockSyncInterval = setInterval(() => {
      if (this.finished) return;
      const msg = JSON.stringify({
        type: CLOCK_SYNC,
        payload: { whiteTime: this.whiteTime, blackTime: this.blackTime, serverTs: Date.now() },
      });
      this.player1.send(msg);
      this.player2.send(msg);
    }, CLOCK_SYNC_INTERVAL_MS);
  }

  private stopClock(): void {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
    if (this.clockSyncInterval) {
      clearInterval(this.clockSyncInterval);
      this.clockSyncInterval = null;
    }
  }

  async makeMove(socket: WebSocket, move: MovePayload): Promise<void> {
    if (this.finished) return;

    if (this.engine.getTurn() === 'w' && socket !== this.player1) return;
    if (this.engine.getTurn() === 'b' && socket !== this.player2) return;

    try {
      const moveResult = this.engine.tryMove(move);

      if (!moveResult) {
        socket.send(JSON.stringify({ type: INVALID_MOVE, payload: { move, error: 'Invalid move' } }));
        return;
      }

      this.lastMoveTime = Date.now();
      const uci = `${moveResult.from}${moveResult.to}`;
      const fen = this.engine.getBoard().fen();

      if (this.gameId) {
        await this.redisService.publishMove(
          this.gameId,
          { san: moveResult.san, uci, fen, whiteTime: this.whiteTime, blackTime: this.blackTime, moveNumber: this.engine.moveCount() },
          fen,
          this.whiteTime,
          this.blackTime,
          this.engine.getTurn() as 'w' | 'b',
        );
      }

      if (this.gameId) {
        this.dbService.saveMove(
          this.gameId,
          this.engine.moveCount(),
          moveResult.san,
          uci,
          fen,
          this.whiteTime,
          this.blackTime,
        ).catch((err) => logger.error({ err }, '[Game] saveMove failed'));
      }

      const moveMsg = JSON.stringify({
        type: MOVE,
        payload: {
          from: moveResult.from,
          to: moveResult.to,
          san: moveResult.san,
          promotion: moveResult.promotion,
        },
      });
      this.player1.send(moveMsg);
      this.player2.send(moveMsg);

      if (this.engine.isGameOver()) {
        await this.handleGameOver();
      }
    } catch (e) {
      logger.error({ err: e }, 'Error in makeMove');
    }
  }

  private async handleGameOver(): Promise<void> {
    this.finished = true;
    this.stopClock();

    let winner: string | null = null;
    let reason = 'draw';

    if (this.engine.isCheckmate()) {
      winner = this.engine.getTurn() === 'w' ? 'black' : 'white';
      reason = 'checkmate';
    } else if (this.engine.isStalemate()) {
      winner = null;
      reason = 'stalemate';
    }

    const { whiteChange, blackChange } = this.calcRatingChanges(winner);

    try {
      const updates: Promise<unknown>[] = [];

      if (this.gameId) {
        updates.push(
          this.dbService.updateGame(this.gameId, winner ?? 'draw', reason, this.engine.pgn(), whiteChange, blackChange),
          this.redisService.finishGame(this.gameId, this.whitePlayerId, this.blackPlayerId),
        );
      }

      const whiteOutcome = winner === 'white' ? 'win' : winner === 'black' ? 'loss' : 'draw';
      const blackOutcome = winner === 'black' ? 'win' : winner === 'white' ? 'loss' : 'draw';
      updates.push(
        this.dbService.updateProfileStats(this.whitePlayerId, whiteChange, whiteOutcome),
        this.dbService.updateProfileStats(this.blackPlayerId, blackChange, blackOutcome),
      );

      await Promise.all(updates);
    } catch (err) {
      logger.error({ err }, 'Failed to save game result');
    }

    const gameOverMsg = JSON.stringify({
      type: GAME_OVER,
      payload: { winner, reason, whiteRatingChange: whiteChange, blackRatingChange: blackChange },
    });
    this.player1.send(gameOverMsg);
    this.player2.send(gameOverMsg);
  }

  private async handleTimeOut(): Promise<void> {
    this.finished = true;
    this.stopClock();

    const winner = this.whiteTime <= 0 ? 'black' : 'white';
    const { whiteChange, blackChange } = this.calcRatingChanges(winner);

    try {
      const updates: Promise<unknown>[] = [];

      if (this.gameId) {
        updates.push(
          this.dbService.updateGame(this.gameId, winner, 'timeout', this.engine.pgn(), whiteChange, blackChange),
          this.redisService.finishGame(this.gameId, this.whitePlayerId, this.blackPlayerId),
        );
      }

      const whiteOutcome = winner === 'white' ? 'win' : 'loss';
      const blackOutcome = winner === 'black' ? 'win' : 'loss';
      updates.push(
        this.dbService.updateProfileStats(this.whitePlayerId, whiteChange, whiteOutcome),
        this.dbService.updateProfileStats(this.blackPlayerId, blackChange, blackOutcome),
      );

      await Promise.all(updates);
    } catch (err) {
      logger.error({ err }, 'Failed to save timeout result');
    }

    const gameOverMsg = JSON.stringify({
      type: GAME_OVER,
      payload: { winner, reason: 'timeout', whiteRatingChange: whiteChange, blackRatingChange: blackChange },
    });
    this.player1.send(gameOverMsg);
    this.player2.send(gameOverMsg);
  }

  resign(socket: WebSocket): void {
    if (this.finished) return;
    this.finished = true;
    this.stopClock();

    const winner = socket === this.player1 ? 'black' : 'white';
    const { whiteChange, blackChange } = this.calcRatingChanges(winner);

    const msg = JSON.stringify({
      type: GAME_OVER,
      payload: { winner, reason: 'resignation', whiteRatingChange: whiteChange, blackRatingChange: blackChange },
    });
    this.player1.send(msg);
    this.player2.send(msg);

    if (this.gameId) {
      const whiteOutcome = winner === 'white' ? 'win' : 'loss';
      const blackOutcome = winner === 'black' ? 'win' : 'loss';
      Promise.all([
        this.dbService.updateGame(this.gameId, winner, 'resignation', this.engine.pgn(), whiteChange, blackChange),
        this.redisService.finishGame(this.gameId, this.whitePlayerId, this.blackPlayerId),
        this.dbService.updateProfileStats(this.whitePlayerId, whiteChange, whiteOutcome),
        this.dbService.updateProfileStats(this.blackPlayerId, blackChange, blackOutcome),
      ]).catch((err) => logger.error({ err }, 'Failed to save resignation'));
    }
  }

  offerDraw(socket: WebSocket): void {
    if (this.finished || this.pendingDrawFrom) return;
    this.pendingDrawFrom = socket;
    const opponent = socket === this.player1 ? this.player2 : this.player1;
    opponent.send(JSON.stringify({ type: DRAW_OFFER }));
  }

  async respondDraw(socket: WebSocket, accept: boolean): Promise<void> {
    if (this.finished || !this.pendingDrawFrom || socket === this.pendingDrawFrom) return;
    const offerer = this.pendingDrawFrom;
    this.pendingDrawFrom = null;

    if (accept) {
      await this.handleDrawAgreement();
    } else {
      offerer.send(JSON.stringify({ type: DRAW_DECLINE }));
    }
  }

  private async handleDrawAgreement(): Promise<void> {
    this.finished = true;
    this.stopClock();

    const { whiteChange, blackChange } = this.calcRatingChanges(null);

    try {
      const updates: Promise<unknown>[] = [];
      if (this.gameId) {
        updates.push(
          this.dbService.updateGame(this.gameId, 'draw', 'agreement', this.engine.pgn(), whiteChange, blackChange),
          this.redisService.finishGame(this.gameId, this.whitePlayerId, this.blackPlayerId),
        );
      }
      updates.push(
        this.dbService.updateProfileStats(this.whitePlayerId, whiteChange, 'draw'),
        this.dbService.updateProfileStats(this.blackPlayerId, blackChange, 'draw'),
      );
      await Promise.all(updates);
    } catch (err) {
      logger.error({ err }, 'Failed to save draw agreement');
    }

    const msg = JSON.stringify({
      type: GAME_OVER,
      payload: { winner: null, reason: 'agreement', whiteRatingChange: whiteChange, blackRatingChange: blackChange },
    });
    this.player1.send(msg);
    this.player2.send(msg);
  }

  private calcRatingChanges(winner: string | null): { whiteChange: number; blackChange: number } {
    const whiteActual: 1 | 0 | 0.5 = winner === 'white' ? 1 : winner === 'black' ? 0 : 0.5;
    const blackActual: 1 | 0 | 0.5 = winner === 'black' ? 1 : winner === 'white' ? 0 : 0.5;
    return {
      whiteChange: calcElo(this.whiteRating, this.blackRating, whiteActual),
      blackChange: calcElo(this.blackRating, this.whiteRating, blackActual),
    };
  }
}
