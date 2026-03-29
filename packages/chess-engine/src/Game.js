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
            return result;
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
        return this.board.turn() === "w" ? "black" : "white";
    }
    moveCount() {
        return this.board.history().length;
    }
    isCheckmate() {
        return this.board.isCheckmate();
    }
    pgn() {
        return this.board.pgn();
    }
}
export function createChess() {
    return new Chess();
}
