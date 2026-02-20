import { WebSocket } from "ws";
import { Game as ChessGame } from "@chess/chess-engine";
import {DatabaseService} from "./services/DatabaseService";
import {
  GAME_OVER,
  TIME_UPDATE,
  INIT_GAME,
  INVALID_MOVE,
  MOVE,
  type MovePayload,
} from "@repo/types";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public engine: ChessGame;
  private startTime: number;
  private whiteTime : number = 300000;
  private blackTime : number = 300000;
  private lastMoveTime : number = Date.now();
  private clockInterval : NodeJS.Timeout | null = null;
  private gameId?: string;
  private whitePlayerId : string ;
  private blackPlayerId : string ;
  private dbService : DatabaseService;

  constructor(player1: WebSocket, player2: WebSocket , whitePlayerId: string, blackPlayerId: string) {
    this.player1 = player1;
    this.player2 = player2;
    this.whitePlayerId = whitePlayerId;
    this.blackPlayerId = blackPlayerId;
    this.engine = new ChessGame();
    this.startTime = Date.now();
    this.startClock();
    this.dbService = new DatabaseService();
    this.initializeGame();
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
        },
      }),
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
        },
      }),
    );
  }

  async initializeGame() {
    try {
      // Create game in DB
      // TODO: Get real ratings for users
      if (this.whitePlayerId.startsWith('temp_')) {
        await this.dbService.createGuestUser(this.whitePlayerId);
      }
      if (this.blackPlayerId.startsWith('temp_')) {
          await this.dbService.createGuestUser(this.blackPlayerId);
      }
      const game = await this.dbService.createGame(this.whitePlayerId, this.blackPlayerId, 1200, 1200);
      this.gameId = game.id;
      console.log(`Game created with ID: ${this.gameId}`);
    } catch(e) {
      console.error(`Failed to create game: ${e}`);
    }
  }
  
  private startClock() {
    this.clockInterval = setInterval(() => {
      // Don't update time if no moves have been made yet
      if (this.engine.moveCount() === 0) {
        this.lastMoveTime = Date.now();
        return;
      }

      const now = Date.now();
      const elapsed = now - this.lastMoveTime;

      if(this.engine.getTurn() === "w") {
        this.whiteTime -= elapsed;
      } else {
        this.blackTime -= elapsed;
      }
      this.lastMoveTime = now;
      if(this.whiteTime <= 0 || this.blackTime <= 0) {
        this.handleTimeOut();
      }
      this.broadcastTime();
    }, 100);
  }

  private broadcastTime() {
    const timeUpdate = JSON.stringify({
      type: TIME_UPDATE,
      payload: {
        whiteTime: this.whiteTime,
        blackTime: this.blackTime,
      },
    });
    this.player1.send(timeUpdate);
    this.player2.send(timeUpdate);
  }

  private async handleGameOver() {
    let winner: string | null = null;
    let reason = 'draw';
  
    if (this.engine.isCheckmate()) {
      winner = this.engine.getTurn() === 'w' ? 'black' : 'white';
      reason = 'checkmate';
    } 
  
    // Calculate rating changes (simple version)
    const whiteChange = winner === 'white' ? 15 : winner === 'black' ? -15 : 0;
    const blackChange = winner === 'black' ? 15 : winner === 'white' ? -15 : 0;
  
    // Save game result to database
    try {
      if(this.gameId) {
      await this.dbService.updateGame(
        this.gameId!,
        winner!,
        reason,
        this.engine.pgn(),
        whiteChange,
        blackChange
      );
  
      console.log(`Game ${this.gameId} saved: ${winner || 'draw'} by ${reason}`);
      }
    } catch (error) {
      console.error('Failed to save game result:', error);
    }
  
    // Notify players
    const gameOverMessage = JSON.stringify({
      type: GAME_OVER,
      payload: { 
        winner,
        reason,
        whiteRatingChange: whiteChange,
        blackRatingChange: blackChange
      }
    });
  
    this.player1.send(gameOverMessage);
    this.player2.send(gameOverMessage);

    if (this.clockInterval) clearInterval(this.clockInterval);
  }

  private handleTimeOut() {
    if(this.gameId) {
      this.dbService.updateGame(this.gameId!, "timeout", "timeout", this.engine.pgn(), 0, 0);
    }
    if(this.clockInterval) {
      clearInterval(this.clockInterval);
    }
    const winner = this.whiteTime <= 0 ? "black" : "white";
    const gameOver = JSON.stringify({
      type: GAME_OVER,
      payload: {
        winner,
        reason: "timeout"
      },
    });
    this.player1.send(gameOver);
    this.player2.send(gameOver);
  }

  async makeMove(socket: WebSocket, move: MovePayload) {
    // Validate turn
    if (this.engine.getTurn() === "w" && socket !== this.player1) {
      return;
    }
    if (this.engine.getTurn() === "b" && socket !== this.player2) {
      return;
    }

    try {
      const moveResult = this.engine.tryMove(move);

      if (!moveResult) {
        socket.send(JSON.stringify({
          type: INVALID_MOVE,
          payload: {
            move,
            error: "Invalid move"
          }
        }));
        return;
      }

      // Update time for the player who just moved
      // And reset lastMoveTime for the next turn
      this.lastMoveTime = Date.now();

      // Save move to DB
      if (this.gameId) {
        this.dbService.saveMove(
          this.gameId,
          this.engine.moveCount(),
          moveResult.san,
          this.engine.getBoard().fen(),
          this.whiteTime,
          this.blackTime
        );
      }

      // Broadcast move
      const moveMsg = JSON.stringify({
        type: MOVE,
        payload: {
          from: moveResult.from,
          to: moveResult.to,
          san: moveResult.san,
          promotion: moveResult.promotion,
          san_move: moveResult.san // Adding this as some frontends might expect san_move or san
        }
      });

      this.player1.send(moveMsg);
      this.player2.send(moveMsg);

      // Check for game over
      if (this.engine.isGameOver()) {
        await this.handleGameOver();
        return;
      }

    } catch (e) {
      console.error(e);
    }
  }

  resign(socket: WebSocket) {
    const winner = socket === this.player1 ? "black" : "white";
    const msg = JSON.stringify({
      type: GAME_OVER,
      payload: {
        winner,
        reason: "resignation"
      }
    });

    this.player1.send(msg);
    this.player2.send(msg);
    
    if (this.clockInterval) clearInterval(this.clockInterval);
  }
}