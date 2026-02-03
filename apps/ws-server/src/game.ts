import { WebSocket } from "ws";
import { Game as ChessGame } from "@chess/chess-engine";
import {
  GAME_OVER,
  INIT_GAME,
  MOVE,
  type MovePayload,
} from "@chess/shared-types";

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

    const moved = this.engine.tryMove(move);
    if (!moved) {
      console.log("Invalid move");
      return;
    }

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

    // Notify both players of the move
    const moveMsg = JSON.stringify({
      type: MOVE,
      payload: move,
    });

    this.player1.send(moveMsg);
    this.player2.send(moveMsg);
  }
}
