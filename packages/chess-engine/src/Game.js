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
            this.board.move(move);
            return true;
        }
        catch {
            return false;
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
}
export function createChess() {
    return new Chess();
}
