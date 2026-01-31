import { WebSocket, WebSocketServer } from "ws";
import { GameManager } from "./GameManager.js";
const wss = new WebSocketServer({ port: 8080 });
const gameManager = new GameManager();
wss.on("connection", function connection(ws) {
    gameManager.addUserToGame(ws);
    ws.on("close", function close() {
        gameManager.removeUserFromGame(ws);
    });
});
//# sourceMappingURL=index.js.map