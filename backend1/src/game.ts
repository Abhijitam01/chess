import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages.js";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    public board : Chess
    private startTime: number;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = Date.now();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white",
            }
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black",
            }
        }))
    }

    makeMove(socket: WebSocket, move: {
        from: string;
        to: string;
    }) {
        // Validate turn
        if (this.board.turn() === 'w' && socket !== this.player1) {
            console.log("Not player1's turn");
            return;
        }
        if (this.board.turn() === 'b' && socket !== this.player2) {
            console.log("Not player2's turn");
            return;
        }

        try {
            this.board.move(move);
        } catch (error) {
            console.log("Invalid move", error);
            return;
        }

        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? "black" : "white";
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: winner,
                }
            }))
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: winner,
                }
            }))
            return;
        }

        // Notify both players of the move
        const moveMsg = JSON.stringify({
            type: MOVE,
            payload: move
        });
        
        this.player1.send(moveMsg);
        this.player2.send(moveMsg);
    }
}