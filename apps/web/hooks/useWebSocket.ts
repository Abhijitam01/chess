"use client";
import { useEffect, useRef, useState } from 'react';

export function useWebSocket(url: string) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectTimeoutRef = useRef<number>(null!);

    useEffect(() => {
        const connectWebSocket = () => {
            const ws = new WebSocket(url);

            ws.onopen = () => {
                console.log('WebSocket connected');
                setIsConnected(true);
                setSocket(ws);
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected');
                setIsConnected(false);
                setSocket(null);
                
                reconnectTimeoutRef.current = window.setTimeout(() => {
                    console.log('Attempting to reconnect...');
                    connectWebSocket();
                }, 3000);
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            return ws;
        };

        const ws = connectWebSocket();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            ws.close();
        };
    }, [url]);

    const sendMessage = (message: unknown) => {
        if (socket && isConnected) {
            socket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected');
        }
    };

    return { socket, isConnected, sendMessage };
}
