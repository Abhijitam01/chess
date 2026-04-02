import { Chess } from 'chess.js';

export type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface Piece {
  type: PieceSymbol;
  color: PieceColor;
}

export type Square = `${'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'}${'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'}`;

export class Board {
  private chess: Chess;

  constructor(fen?: string) {
    this.chess = fen ? new Chess(fen) : new Chess();
  }

  /** Return the current FEN string. */
  fen(): string {
    return this.chess.fen();
  }

  /** Load a position from a FEN string. */
  load(fen: string): void {
    this.chess.load(fen);
  }

  /** Whose turn it is: 'w' or 'b'. */
  turn(): PieceColor {
    return this.chess.turn();
  }

  /** Get the piece on a square, or null if empty. */
  get(square: Square): Piece | null {
    return this.chess.get(square) ?? null;
  }

  /** True when the side to move is in check. */
  inCheck(): boolean {
    return this.chess.inCheck();
  }

  /** True when the game is over by any means. */
  isGameOver(): boolean {
    return this.chess.isGameOver();
  }

  /** True when the side to move is checkmated. */
  isCheckmate(): boolean {
    return this.chess.isCheckmate();
  }

  /** True when the position is stalemate. */
  isStalemate(): boolean {
    return this.chess.isStalemate();
  }

  /** True when the game is drawn (stalemate, insufficient material, 50-move, repetition). */
  isDraw(): boolean {
    return this.chess.isDraw();
  }

  /** All legal moves from the current position in SAN notation. */
  moves(): string[] {
    return this.chess.moves();
  }

  /** Legal moves for a specific square. */
  movesFrom(square: Square): string[] {
    return this.chess.moves({ square });
  }

  /** Reset to the starting position. */
  reset(): void {
    this.chess.reset();
  }
}
