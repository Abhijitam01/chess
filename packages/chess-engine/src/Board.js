import { Chess } from 'chess.js';
export class Board {
    chess;
    constructor(fen) {
        this.chess = fen ? new Chess(fen) : new Chess();
    }
    /** Return the current FEN string. */
    fen() {
        return this.chess.fen();
    }
    /** Load a position from a FEN string. */
    load(fen) {
        this.chess.load(fen);
    }
    /** Whose turn it is: 'w' or 'b'. */
    turn() {
        return this.chess.turn();
    }
    /** Get the piece on a square, or null if empty. */
    get(square) {
        return this.chess.get(square) ?? null;
    }
    /** True when the side to move is in check. */
    inCheck() {
        return this.chess.inCheck();
    }
    /** True when the game is over by any means. */
    isGameOver() {
        return this.chess.isGameOver();
    }
    /** True when the side to move is checkmated. */
    isCheckmate() {
        return this.chess.isCheckmate();
    }
    /** True when the position is stalemate. */
    isStalemate() {
        return this.chess.isStalemate();
    }
    /** True when the game is drawn (stalemate, insufficient material, 50-move, repetition). */
    isDraw() {
        return this.chess.isDraw();
    }
    /** All legal moves from the current position in SAN notation. */
    moves() {
        return this.chess.moves();
    }
    /** Legal moves for a specific square. */
    movesFrom(square) {
        return this.chess.moves({ square });
    }
    /** Reset to the starting position. */
    reset() {
        this.chess.reset();
    }
}
