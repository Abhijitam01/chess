import { WebSocket } from "ws";
import crypto from "crypto";
import { Game } from "./game";
import { GAME_OVER, INIT_GAME, MOVE, OPONENT_LEFT, RESIGN, type ClientMessage } from "@repo/types";
import { DatabaseService } from './services/DatabaseService';

export class GameManager {
  private games: Game[] = [];
  private pendingUser: WebSocket | null = null;
  private users: WebSocket[] = [];
  private dbService: DatabaseService;
  private socketToUSerId : Map<WebSocket, string> = new Map();

  constructor() {
    this.dbService = new DatabaseService();
  }

  addUserToGame(socket: WebSocket , userId: string) {
    console.log("User added to GameManager");
    this.users.push(socket);
    this.socketToUSerId.set(socket, userId);
    this.addHandler(socket);
  }

  removeUserFromGame(socket: WebSocket) {
    console.log("User removed from GameManager");

    const gameIndex = this.games.findIndex((game) => game.player1 === socket || game.player2 === socket);
    if (gameIndex !== -1) {
      const  game = this.games[gameIndex];
      const opponent = game.player1 === socket ? game.player2 : game.player1;
      opponent.send(JSON.stringify({
        type: OPONENT_LEFT,
        payload: {
          message: "Opponent left the game",
        },
      }));
      this.games.splice(gameIndex, 1);
    }

    this.users = this.users.filter((user) => user !== socket);
    this.socketToUSerId.delete(socket);

    if (this.pendingUser === socket) {
      this.pendingUser = null;
    }
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      console.log("Message received:", data.toString());
      const message = JSON.parse(data.toString()) as ClientMessage;

      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          const player1Id = this.socketToUSerId.get(this.pendingUser);
          const player2Id = this.socketToUSerId.get(socket);
          console.log("Starting new game");
          const game = new Game(this.pendingUser, socket, player1Id, player2Id);
          this.games.push(game);
          this.pendingUser = null;
        } else {
          console.log("Waiting for second player");
          this.pendingUser = socket;
        }
      }

      if (message.type === MOVE) {
        console.log("Move message received");
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket,
        );
        if (game) {
          game.makeMove(socket, message.move);
        }
      }
      if (message.type === RESIGN) {
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket,
        );
        if (game) {
          const resigningPlayer  = game.player1 === socket ?  "white" : "black";
          const winner = resigningPlayer === "white" ? "black" : "white";
          const gameOver = JSON.stringify({
            type: GAME_OVER,
            payload: {
              winner,
            },
          });
          game.player1.send(gameOver);
          game.player2.send(gameOver);
          this.games = this.games.filter(g => g !== game);
        }
      }
    });
  }
}
