import { WebSocket } from "ws";
import { Game } from "./game.js";
import { INIT_GAME, MOVE } from "@repo/common";

export class GameManager {
    private games:Game[] ;
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUserToGame(socket: WebSocket) {
        console.log("User added to GameManager");
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUserFromGame(socket: WebSocket) {
        console.log("User removed from GameManager");
        this.users = this.users.filter(user => user !== socket);
    }

    private addHandler(socket: WebSocket) {
        socket.on("message", (data) => {
            console.log("Message received:", data.toString());
            const message = JSON.parse(data.toString());

            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    console.log("Starting new game");
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    console.log("Waiting for second player");
                    this.pendingUser = socket;
                }
            }

            if (message.type === MOVE) {
                console.log("Move message received");
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.move);
                }
            }
        });
    }
}