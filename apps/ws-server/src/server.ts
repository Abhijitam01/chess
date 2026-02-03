import * as http from 'http';

export function createServer() {
  const server = http.createServer();
  // TODO: attach WebSocket server here
  return server;
}
