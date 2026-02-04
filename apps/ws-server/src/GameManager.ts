import { WebSocket } from "ws";
import { Game } from "./game";
import { GAME_OVER, INIT_GAME, MOVE, OPONENT_LEFT, RESIGN, type ClientMessage } from "@repo/types";

export class GameManager {
  private games: Game[] = [];
  private pendingUser: WebSocket | null = null;
  private users: WebSocket[] = [];

  addUserToGame(socket: WebSocket) {
    console.log("User added to GameManager");
    this.users.push(socket);
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
          console.log("Starting new game");
          const game = new Game(this.pendingUser, socket);
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
