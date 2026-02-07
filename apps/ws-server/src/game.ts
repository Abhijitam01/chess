import { WebSocket } from "ws";
import { Game as ChessGame } from "@chess/chess-engine";
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

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.engine = new ChessGame();
    this.startTime = Date.now();
    this.startClock();
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

  private handleTimeOut() {
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

  makeMove(socket: WebSocket, move: MovePayload) {
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

      // Check for game over
      if (this.engine.isGameOver()) {
        const winner = this.engine.getWinner();
        const reason = this.engine.isCheckmate() ? "checkmate" : "draw";
        
        const gameOver = JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner,
            reason
          }
        });

        this.player1.send(gameOver);
        this.player2.send(gameOver);
        
        if (this.clockInterval) clearInterval(this.clockInterval);
        return;
      }

      // Broadcast move
      const moveMsg = JSON.stringify({
        type: MOVE,
        payload: {
          from: moveResult.from,
          to: moveResult.to,
          san: moveResult.san,
          promotion: moveResult.promotion
        }
      });

      this.player1.send(moveMsg);
      this.player2.send(moveMsg);

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
