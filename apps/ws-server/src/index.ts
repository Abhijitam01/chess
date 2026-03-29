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

  async function gracefulShutdown(signal: string): Promise<void> {
    console.log(`[Server] ${signal} received — starting graceful shutdown`);

    // Stop accepting new WS and HTTP connections
    wss.close();
    httpServer.close();

    // Notify all connected clients so they can reconnect to another node
    const shutdownMsg = JSON.stringify({ type: "server_shutdown", payload: { message: "Server is restarting, please reconnect" } });
    for (const client of wss.clients) {
      if (client.readyState === client.OPEN) {
        client.send(shutdownMsg);
        client.close(1001, "Server shutting down");
      }
    }

    // Give active games up to 30s to finish writing to Redis/DB
    await new Promise<void>((resolve) => setTimeout(resolve, Math.min(wss.clients.size > 0 ? 5000 : 0, 30000)));

    await redisService.disconnect();
    console.log("[Server] Shutdown complete");
    process.exit(0);
  }

  process.on("SIGTERM", () => { gracefulShutdown("SIGTERM").catch(console.error); });
  process.on("SIGINT",  () => { gracefulShutdown("SIGINT").catch(console.error); });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
