"use client";

import { ChessBoard } from "@repo/ui";
import { useWebSocket } from "../../../hooks/useWebSocket";
import { useChessGame } from "../../../hooks/useChessGame";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080";

export default function GamePage() {
  const { socket, isConnected, sendMessage } = useWebSocket(WS_URL);
  const { chess, playerColor, status, turn, winner, makeMove, isMyTurn } =
    useChessGame(socket, isConnected);

  const handleStartGame = () => {
    sendMessage({ type: "init_game" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full p-6 border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">♔</span>
            <span className="text-lg font-bold">Chess Online</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12">
        <div className="order-2 lg:order-1">
          <ChessBoard
            chess={chess}
            playerColor={playerColor}
            isMyTurn={isMyTurn}
            onMove={makeMove}
          />
        </div>

        <div className="w-full max-w-sm order-1 lg:order-2 text-white space-y-4">
          <button
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
            onClick={handleStartGame}
            disabled={!isConnected || status === "playing"}
          >
            {isConnected ? "Start Game" : "Connecting..."}
          </button>
          <div>Status: {status}</div>
          <div>Turn: {turn === "w" ? "White" : "Black"}</div>
          {winner && <div>Winner: {winner}</div>}
        </div>
      </div>
    </div>
  );
}
