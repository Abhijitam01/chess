import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", (ws) => {
    console.log("Client connected");
});
wss.on("error", (error) => {
    console.error("WebSocket error:", error);
});
wss.on("close", () => {
    console.log("Client disconnected");
});
//# sourceMappingURL=index.js.map