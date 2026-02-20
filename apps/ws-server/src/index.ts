import { WebSocket, WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
const wss = new WebSocketServer({ port });

const gameManager = new GameManager();

wss.on("connection", (ws: WebSocket , req: Request) => {
  
  const tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  gameManager.addUserToGame(ws, tempUserId);

  ws.on("close", () => {
    gameManager.removeUserFromGame(ws);
  });
});

console.log(`WebSocket server listening on port ${port}`);
