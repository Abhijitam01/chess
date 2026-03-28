"use client";

import { useEffect, useRef, useState } from "react";

export function useWebSocket(url: string, token?: string | null, onAuthError?: () => void) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (token === null) return; // explicitly no token — skip connection

    const connectWebSocket = () => {
      const wsUrl = token ? `${url}?token=${token}` : url;
      const ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string) as { type: string };
          if (msg.type === "AUTH_ERROR" && onAuthError) {
            onAuthError();
          }
        } catch {
          // not JSON or not auth error — will be handled by game hook
        }
      };

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setSocket(ws);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        setSocket(null);

        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log("Attempting to reconnect...");
          connectWebSocket();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      return ws;
    };

    const ws = connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      ws?.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, token]);

  const sendMessage = (message: unknown) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  };

  return { socket, isConnected, sendMessage };
}
