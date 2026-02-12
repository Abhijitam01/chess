"use client";

import { useEffect, useState, useRef } from "react";
import { createChess } from "@chess/chess-engine";
import { ServerMessage, ClientMessage } from "@repo/types";

type GameStatus = "waiting" | "playing" | "finished";
type PlayerColor = "white" | "black" | null;
type MatchMakingStatus = "idle" | "finding" | "found" | "playing" | "finished";

interface GameState {
  chess: ReturnType<typeof createChess>;
  playerColor: PlayerColor;
  status: GameStatus;
  turn: "w" | "b";
  winner: PlayerColor;
  matchMakingStatus: MatchMakingStatus;
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
    error: null,
  });

  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [showMatchStartAnimation, setShowMatchStartAnimation] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);

  const [timeState, setTimeState] = useState({
    whiteTime: 300000,
    blackTime: 300000,
  });

  const timerRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());
  const timeoutSentRef = useRef(false);

  /* -------------------------------- helpers -------------------------------- */

  const stopClock = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const isMyTurn =
    gameState.playerColor !== null &&
    ((gameState.playerColor === "white" && gameState.turn === "w") ||
      (gameState.playerColor === "black" && gameState.turn === "b"));

  /* -------------------------------- actions -------------------------------- */

  const startMatchMaking = () => {
    setGameState((p) => ({ ...p, matchMakingStatus: "finding" }));
    socket?.send(JSON.stringify({ type: "init_game" }));
  };

  const resign = () => {
    if (!socket || !isConnected) return;

    // 🔥 stop clock immediately
    stopClock();

    setGameState((prev) => ({
      ...prev,
      status: "finished",
      matchMakingStatus: "finished",
      winner: prev.playerColor === "white" ? "black" : "white",
    }));

    setGameOverReason("resign");

    socket.send(JSON.stringify({ type: "resign" }));
  };

  const makeMove = (from: string, to: string) => {
    if (!isMyTurn) return false;

    const temp = createChess();
    temp.load(gameState.chess.fen());

    const move = temp.move({ from, to, promotion: "q" });
    if (!move) return false;

    socket?.send(
      JSON.stringify({
        type: "move",
        move: { from, to },
      } satisfies ClientMessage)
    );

    return true;
  };

  const resetGame = () => {
    stopClock();
    timeoutSentRef.current = false;

    setGameState({
      chess: createChess(),
      playerColor: null,
      status: "waiting",
      turn: "w",
      winner: null,
      matchMakingStatus: "idle",
      error: null,
    });

    setMoveHistory([]);
    setTimeState({ whiteTime: 300000, blackTime: 300000 });
    setGameOverReason(null);
  };

  /* -------------------------------- timer -------------------------------- */

  useEffect(() => {
    if (
      gameState.status !== "playing" ||
      !socket ||
      !isConnected ||
      gameOverReason
    ) {
      stopClock();
      return;
    }

    lastUpdateRef.current = Date.now();

    timerRef.current = window.setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastUpdateRef.current;
      lastUpdateRef.current = now;

      setTimeState((prev) => {
        if (gameState.turn === "w") {
          const whiteTime = Math.max(0, prev.whiteTime - elapsed);

          if (whiteTime === 0 && !timeoutSentRef.current) {
            timeoutSentRef.current = true;
            stopClock();
            socket.send(
              JSON.stringify({ type: "time_out", color: "white" })
            );
          }

          return { ...prev, whiteTime };
        } else {
          const blackTime = Math.max(0, prev.blackTime - elapsed);

          if (blackTime === 0 && !timeoutSentRef.current) {
            timeoutSentRef.current = true;
            stopClock();
            socket.send(
              JSON.stringify({ type: "time_out", color: "black" })
            );
          }

          return { ...prev, blackTime };
        }
      });
    }, 100);

    return stopClock;
  }, [gameState.status, gameState.turn, socket, isConnected, gameOverReason]);

  /* ------------------------------ socket msgs ------------------------------ */

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data) as ServerMessage;

      switch (message.type) {
        case "init_game": {
          timeoutSentRef.current = false;
          setMoveHistory([]);
          setShowMatchStartAnimation(true);

          const wt = message.payload.timeControl?.whiteTime ?? 300000;
          const bt = message.payload.timeControl?.blackTime ?? 300000;

          setTimeState({ whiteTime: wt, blackTime: bt });

          setGameState((p) => ({
            ...p,
            chess: createChess(),
            playerColor: message.payload.color,
            status: "playing",
            matchMakingStatus: "playing",
            turn: "w",
            winner: null,
          }));

          lastUpdateRef.current = Date.now();
          break;
        }

        case "move": {
          const { from, to, san, promotion } = message.payload;

          setGameState((prev) => {
            const chess = createChess();
            chess.load(prev.chess.fen());
            chess.move({ from, to, promotion: promotion || "q" });

            return { ...prev, chess, turn: chess.turn() };
          });

          setMoveHistory((h) => [...h, san]);
          lastUpdateRef.current = Date.now();
          break;
        }

        case "game_over":
          stopClock();
          setGameOverReason(message.payload.reason || "game_over");
          setGameState((p) => ({
            ...p,
            status: "finished",
            winner: message.payload.winner,
            matchMakingStatus: "finished",
          }));
          break;

        case "opponent_left":
          stopClock();
          setGameOverReason("opponent_left");
          setGameState((p) => ({
            ...p,
            status: "finished",
            winner: p.playerColor,
            matchMakingStatus: "finished",
          }));
          break;

        case "time_update":
          setTimeState({
            whiteTime: message.payload.whiteTime,
            blackTime: message.payload.blackTime,
          });
          lastUpdateRef.current = Date.now();
          break;
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);

  /* -------------------------------- effects -------------------------------- */

  useEffect(() => {
    if (!showMatchStartAnimation) return;
    const t = setTimeout(() => setShowMatchStartAnimation(false), 2000);
    return () => clearTimeout(t);
  }, [showMatchStartAnimation]);

  /* -------------------------------- return -------------------------------- */

  return {
    ...gameState,
    whiteTime: timeState.whiteTime,
    blackTime: timeState.blackTime,
    makeMove,
    resign,
    resetGame,
    startMatchMaking,
    moveHistory,
    showMatchStartAnimation,
    gameOverReason,
    isMyTurn,
    onMatchAnimationComplete: () => setShowMatchStartAnimation(false),
  };
}
