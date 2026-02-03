import { Chess } from "chess.js";
import type { Color, MovePayload } from "@repo/types";
export declare class Game {
    private board;
    constructor();
    getBoard(): Chess;
    getTurn(): "w" | "b";
    tryMove(move: MovePayload): boolean;
    isGameOver(): boolean;
    getWinner(): Color | null;
}
export declare function createChess(): Chess;
//# sourceMappingURL=Game.d.ts.map