
"use client";

import { useEffect, useState } from "react";
import { INIT_GAME, MOVE, GAME_OVER } from '@repo/types';
import { createChess } from "@chess/chess-engine";
import type {
  ClientMessage,
  MovePayload,
  ServerMessage,
} from "@repo/types";

type GameStatus = "waiting" | "playing" | "finished";
type PlayerColor = "white" | "black" | null;

interface GameState {
  chess: ReturnType<typeof createChess>;
  playerColor: PlayerColor;
  status: GameStatus;
  turn: "w" | "b";
  winner: string | null;
}

export function useChessGame(socket: WebSocket | null, isConnected: boolean) {
  const [gameState, setGameState] = useState<GameState>({
    chess: createChess(),
    playerColor: null,
    status: "waiting",
    turn: "w",
    winner: null,
  });

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data as string) as ServerMessage;
      console.log("Game message received:", message);

      switch (message.type) {
        case "init_game":
          setGameState((prev) => ({
            ...prev,
            playerColor: message.payload.color,
            status: "playing",
          }));
          break;

        case "move":
          setGameState((prev) => {
            const newChess = createChess();
            newChess.load(prev.chess.fen());
            try {
              // The payload might be an object {from, to} or a string
              const moveResult = typeof message.payload === 'string' 
                ? newChess.move(message.payload)
                : newChess.move({
                    from: message.payload.from,
                    to: message.payload.to,
                    promotion: (message.payload as any).promotion || 'q'
                  });
              
              if (!moveResult) {
                console.error("Invalid move:", message.payload);
                return prev;
              }
              
              return {
                ...prev,
                chess: newChess,
                turn: newChess.turn(),
              };
            } catch (error) {
              console.error("Invalid move received:", error);
              return prev;
            }
          });
          break;

        case "game_over":
          setGameState((prev) => ({
            ...prev,
            status: "finished",
            winner: message.payload.winner,
          }));
          break;
      }
    };

    socket.addEventListener("message", handleMessage as any);

    return () => {
      socket.removeEventListener("message", handleMessage as any);
    };
  }, [socket]);

  const makeMove = (from: string, to: string) => {
    const move = gameState.chess.move({ from, to, promotion: "q" });

    if (move) {
      setGameState((prev) => ({
        ...prev,
        turn: prev.chess.turn(),
      }));

      if (socket && isConnected) {
        const message: ClientMessage = {
          type: "move",
          move: { from, to },
        };
        socket.send(JSON.stringify(message));
        console.log("Move sent to server:", { from, to });
      }

      return true;
    }

    return false;
  };

  const resetGame = () => {
    setGameState({
      chess: createChess(),
      playerColor: null,
      status: "waiting",
      turn: "w",
      winner: null,
    });
  };

  return {
    ...gameState,
    makeMove,
    resetGame,
    isMyTurn:
      gameState.playerColor !== null &&
      ((gameState.playerColor === "white" && gameState.turn === "w") ||
        (gameState.playerColor === "black" && gameState.turn === "b")),
  };
}
