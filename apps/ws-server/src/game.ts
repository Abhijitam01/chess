import { WebSocket } from "ws";
import { Game as ChessGame } from "@chess/chess-engine";
import {
  GAME_OVER,
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

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.engine = new ChessGame();
    this.startTime = Date.now();

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

  makeMove(socket: WebSocket, move: MovePayload) {
    // Validate turn
    if (this.engine.getTurn() === "w" && socket !== this.player1) {
      console.log("Not player1's turn");
      return;
    }
    if (this.engine.getTurn() === "b" && socket !== this.player2) {
      console.log("Not player2's turn");
      return;
    }

    // Try to make the move and get the result
    const moveResult = this.engine.tryMove(move);
    
    if (!moveResult) {
      // Invalid move
      socket.send(JSON.stringify({
        type: INVALID_MOVE,
        payload: {
          error: "Invalid Move, please try again",
          move: move
        }
      }));
      return;
    }

    console.log("Move executed:", moveResult);

    // Check if game is over
    if (this.engine.isGameOver()) {
      const winner = this.engine.getWinner();
      const gameOverMsg = JSON.stringify({
        type: GAME_OVER,
        payload: {
          winner,
        },
      });
      this.player1.send(gameOverMsg);
      this.player2.send(gameOverMsg);
      return;
    }

    // Notify both players of the move with complete information
    const moveMsg = JSON.stringify({
      type: MOVE,
      payload: {
        from: moveResult.from,
        to: moveResult.to,
        san: moveResult.san, // Include SAN notation for move history
        promotion: moveResult.promotion
      },
    });

    this.player1.send(moveMsg);
    this.player2.send(moveMsg);
  }
}
