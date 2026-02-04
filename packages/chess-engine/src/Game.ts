import { Chess } from "chess.js";
import type { Color } from "@repo/types";
import type { MovePayload } from "@repo/types";

export class Game {
  private board: Chess;

  constructor() {
    this.board = new Chess();
  }

  getBoard(): Chess {
    return this.board;
  }

  getTurn(): "w" | "b" {
    return this.board.turn();
  }

  tryMove(move: MovePayload) {
    try {
      const result = this.board.move(move);
      return result; // Returns the move object with san, from, to, etc.
    } catch {
      return null;
    }
  }

  isGameOver(): boolean {
    return this.board.isGameOver();
  }

  getWinner(): Color | null {
    if (!this.board.isGameOver()) {
      return null;
    }
    // In chess.js, turn() returns the side to move; after game over, the side
    // that *cannot* move is the loser.
    return this.board.turn() === "w" ? "black" : "white";
  }
}

export function createChess() {
  return new Chess();
}
