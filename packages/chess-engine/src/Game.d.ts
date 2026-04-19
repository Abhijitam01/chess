import { Chess } from "chess.js";
import type { Color } from "@repo/types";
import type { MovePayload } from "@repo/types";
export declare class Game {
    private board;
    constructor();
    getBoard(): Chess;
    getTurn(): "w" | "b";
    tryMove(move: MovePayload): import("chess.js").Move | null;
    isGameOver(): boolean;
    getWinner(): Color | null;
    moveCount(): number;
    isCheckmate(): boolean;
    isStalemate(): boolean;
    pgn(): string;
}
export declare function createChess(): Chess;
//# sourceMappingURL=Game.d.ts.map