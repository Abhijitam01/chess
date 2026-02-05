"use client";

import { useEffect, useState } from "react";
import { createChess } from "@chess/chess-engine";
import {
  ServerMessage,
  ClientMessage,
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
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [timeState, setTimeState] = useState({
    whiteTime: 300000,
    blackTime: 300000
  });

  const resign = () => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: "resign"
      }));
    }
  }

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data as string) as ServerMessage;
      console.log("Game message received:", message);

      switch (message.type) {
        case "init_game":
          setMoveHistory([]);
          setGameState((prev) => ({
            ...prev,
            playerColor: message.payload.color,
            status: "playing",
          }));
          break;

        case "move": {
          const { from, to, san, promotion } = message.payload as { from: string; to: string; san: string; promotion?: string };
          
          setGameState((prev) => {
            const newChess = createChess();
            newChess.load(prev.chess.fen());
            
            try {
              const moveResult = newChess.move({
                from,
                to,
                promotion: promotion || 'q'
              });
              
              if (!moveResult) {
                console.error("Invalid move received from server:", message.payload);
                return prev;
              }
              
              return {
                ...prev,
                chess: newChess,
                turn: newChess.turn(),
              };
            } catch (error) {
              console.error("Error applying move from server:", error);
              return prev;
            }
          });
          
          setMoveHistory(prevHistory => {
            const newHistory = [...prevHistory, san];
            return newHistory;
          });
          break;
        }

        case "game_over":
          setGameState((prev) => ({
            ...prev,
            status: "finished",
            winner: message.payload.winner,
          }));
          break;

        case "opponent_left":
          setGameState((prev) => ({
            ...prev,
            status: "finished",
            winner: prev.playerColor,
          }));
          alert(message.payload.message);
          break;

        case "invalid_move":
          alert(`Invalid Move : ${message.payload.error}`);
          break;

        case "time_update":
          setTimeState({
            whiteTime: message.payload.whiteTime,
            blackTime: message.payload.blackTime,
          });
          break;
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  const makeMove = (from: string, to: string) => {
    const tempChess = createChess();
    tempChess.load(gameState.chess.fen());
    
    const move = tempChess.move({ from, to, promotion: "q" });
    if (move) {
      if (socket && isConnected) {
        const message: ClientMessage = {
          type: "move",
          move: { from, to },
        };
        socket.send(JSON.stringify(message));
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
    setMoveHistory([]);
  };

  return {
    ...gameState,
    makeMove,
    resetGame,
    moveHistory,
    resign,
    whiteTime: timeState.whiteTime,
    blackTime: timeState.blackTime,
    isMyTurn:
      gameState.playerColor !== null &&
      ((gameState.playerColor === "white" && gameState.turn === "w") ||
        (gameState.playerColor === "black" && gameState.turn === "b")),
  };
}
