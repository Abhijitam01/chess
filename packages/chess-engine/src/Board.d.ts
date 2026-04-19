export type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';
export interface Piece {
    type: PieceSymbol;
    color: PieceColor;
}
export type Square = `${'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'}${'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'}`;
export declare class Board {
    private chess;
    constructor(fen?: string);
    /** Return the current FEN string. */
    fen(): string;
    /** Load a position from a FEN string. */
    load(fen: string): void;
    /** Whose turn it is: 'w' or 'b'. */
    turn(): PieceColor;
    /** Get the piece on a square, or null if empty. */
    get(square: Square): Piece | null;
    /** True when the side to move is in check. */
    inCheck(): boolean;
    /** True when the game is over by any means. */
    isGameOver(): boolean;
    /** True when the side to move is checkmated. */
    isCheckmate(): boolean;
    /** True when the position is stalemate. */
    isStalemate(): boolean;
    /** True when the game is drawn (stalemate, insufficient material, 50-move, repetition). */
    isDraw(): boolean;
    /** All legal moves from the current position in SAN notation. */
    moves(): string[];
    /** Legal moves for a specific square. */
    movesFrom(square: Square): string[];
    /** Reset to the starting position. */
    reset(): void;
}
//# sourceMappingURL=Board.d.ts.map