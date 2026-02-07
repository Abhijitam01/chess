"use client";

import { useEffect, useState } from "react";
import { createChess } from "@chess/chess-engine";
import {
  ServerMessage,
  ClientMessage,
} from "@repo/types";

type GameStatus = "waiting" | "playing" | "finished";
type PlayerColor = "white" | "black" | null;
type MatchMakingStatus = "idle" | "finding" | "found" | "playing" | "finished";

interface GameState {
  chess: ReturnType<typeof createChess>;
  playerColor: PlayerColor;
  status: GameStatus;
  turn: "w" | "b";
  winner: string | null;
  matchMakingStatus: MatchMakingStatus;
  whiteTime: number;
  blackTime: number;
  error: string | null;
}

export function useChessGame(socket: WebSocket | null, isConnected: boolean) {
  const [gameState, setGameState] = useState<GameState>({
    chess: createChess(),
    playerColor: null,
    status: "waiting",
    turn: "w",
    winner: null,
    matchMakingStatus: "idle",
    whiteTime: 300000,
    blackTime: 300000,
    error: null,
  });
  const [showMatchStartAnimation, setShowMatchStartAnimation] = useState(false);
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

  const startMatchMaking = () => {
    setGameState((prev) => ({
      ...prev,
      matchMakingStatus: "finding",
    }));
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: "init_game",
      }));
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data as string) as ServerMessage;
      console.log("Game message received:", message);

      switch (message.type) {
        case "init_game":
          setMoveHistory([]);
          setShowMatchStartAnimation(true);
          setGameState((prev) => ({
            ...prev,
            playerColor: message.payload.color,
            status: "playing",
            matchMakingStatus: "playing",
            whiteTime: message.payload.timeControl?.whiteTime || 300000,
            blackTime: message.payload.timeControl?.blackTime || 300000,
            error: null
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
          setGameOverReason(message.payload.reason || "checkmate");
          setGameState((prev) => ({
            ...prev,
            status: "finished",
            winner: message.payload.winner,
            matchMakingStatus: "finished",
            error: null,
          }));
          break;

        case "opponent_left":
          setGameOverReason("disconnected");
          setGameState((prev) => ({
            ...prev,
            status: "finished",
            winner: prev.playerColor,
            matchMakingStatus: "finished",
            error: null,
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
      matchMakingStatus: "idle",
      whiteTime: 300000,
      blackTime: 300000,
      error: null,
    });
    setMoveHistory([]);
    setTimeState({
      whiteTime: 300000,
      blackTime: 300000
    });
  };
  useEffect(() => {
    if (showMatchStartAnimation) {
      const timer = setTimeout(() => {
        setShowMatchStartAnimation(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showMatchStartAnimation]);


  const onMatchAnimationComplete = () => {
    setShowMatchStartAnimation(false);
  }
 const [gameOverReason, setGameOverReason] = useState<string | null>(null);

  return {
    ...gameState,
    makeMove,
    resetGame,
    moveHistory,
    resign,
    whiteTime: timeState.whiteTime,
    blackTime: timeState.blackTime,
    startMatchMaking,
    showMatchStartAnimation,
    gameOverReason,
    onMatchAnimationComplete,
    isMyTurn:
      gameState.playerColor !== null &&
      ((gameState.playerColor === "white" && gameState.turn === "w") ||
        (gameState.playerColor === "black" && gameState.turn === "b")),
  };
}
