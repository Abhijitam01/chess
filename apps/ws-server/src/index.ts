import http from "http";
import { WebSocketServer } from "ws";
import { config } from "./config.js";
import { DatabaseService } from "./services/DatabaseService.js";
import { RedisService } from "./services/RedisService.js";
import { AuthService } from "./services/AuthService.js";
import { createAuthHandler } from "./routes/auth.js";
import { GameManager } from "./GameManager.js";

async function main() {
  const dbService = new DatabaseService();
  const redisService = new RedisService();
  const authService = new AuthService(dbService);

  await redisService.connect();

  const authHandler = createAuthHandler(authService, dbService, redisService);
  const httpServer = http.createServer(authHandler);
  const wss = new WebSocketServer({ server: httpServer });
  const gameManager = new GameManager(dbService, redisService);

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url ?? "/", `http://localhost`);
    const token = url.searchParams.get("token");
    const spectateGameId = url.searchParams.get("spectate");

    if (!token) {
      ws.send(JSON.stringify({ type: "AUTH_ERROR", payload: { message: "Authentication required" } }));
      ws.close(1008, "Authentication required");
      return;
    }

    let userId: string;
    try {
      const payload = authService.verifyToken(token);
      userId = payload.userId;
    } catch {
      ws.send(JSON.stringify({ type: "AUTH_ERROR", payload: { message: "Invalid or expired token" } }));
      ws.close(1008, "Invalid token");
      return;
    }

    if (spectateGameId) {
      gameManager.addSpectator(spectateGameId, ws);
      ws.on("close", () => {
        gameManager.removeSpectator(spectateGameId, ws);
      });
      return;
    }

    gameManager.addUserToGame(ws, userId);

    ws.on("close", () => {
      gameManager.removeUserFromGame(ws);
    });
  });

  httpServer.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });

  process.on("SIGTERM", async () => {
    await redisService.disconnect();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    await redisService.disconnect();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
