import { Chess } from "chess.js";
import type { Color, MovePayload } from "@chess/shared-types";

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

  tryMove(move: MovePayload): boolean {
    try {
      this.board.move(move);
      return true;
    } catch {
      return false;
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
