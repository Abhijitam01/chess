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
        this.player1.emit(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white",
            }
        }))
        this.player2.emit(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black",
            }
        }))
    }
    makeMove(socket: WebSocket, move: {
        from: string;
        to: string;
    
    }){
       if(this.board.move.length % 2=== 0 && socket !== this.player1){
        return;
       }
       if(this.board.move.length % 2=== 1 && socket !== this.player2){
        return;
       }
       try {
        this.board.move(move);
       } catch (error) {
        return;
       }

        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? this.player1 : this.player2,
                }
            }))
        }
        if(this.board.move.length % 2 === 0) {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: {
                    board: this.board.board(),
                }
            }))
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: {
                    board: this.board.board(),
                }
            }))
        }
    }
}