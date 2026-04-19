import { Chess } from "chess.js";
export class Game {
    board;
    constructor() {
        this.board = new Chess();
    }
    getBoard() {
        return this.board;
    }
    getTurn() {
        return this.board.turn();
    }
    tryMove(move) {
        try {
            const result = this.board.move(move);
            return result; // Returns the move object with san, from, to, etc.
        }
        catch {
            return null;
        }
    }
    isGameOver() {
        return this.board.isGameOver();
    }
    getWinner() {
        if (!this.board.isGameOver()) {
            return null;
        }
        // In chess.js, turn() returns the side to move; after game over, the side
        // that *cannot* move is the loser.
        return this.board.turn() === "w" ? "black" : "white";
    }
    moveCount() {
        return this.board.history().length;
    }
    isCheckmate() {
        return this.board.isCheckmate();
    }
    isStalemate() {
        return this.board.isStalemate();
    }
    pgn() {
        return this.board.pgn();
    }
}
export function createChess() {
    return new Chess();
}
