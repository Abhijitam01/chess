"use client";

import { useWebSocket } from "../../hooks/useWebSocket";
import { useChessGame } from "../../hooks/useChessGame";
import { ChessBoard } from "../../components/ChessBoard";
import { GameControls } from "../../components/GameControls";
import { useRouter } from "next/navigation";
import { INIT_GAME, MOVE, GAME_OVER } from '@repo/types';

const WS_URL = "ws://localhost:8080";

export default function Game() {
  const { socket, isConnected, sendMessage } = useWebSocket(WS_URL);
  const { chess, playerColor, status, turn, winner, makeMove, isMyTurn } = useChessGame(socket, isConnected);
  const router = useRouter();

  const handleStartGame = () => {
    sendMessage({ type: INIT_GAME });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full p-6 border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <span className="text-2xl">♔</span>
            <span className="text-lg font-bold">Chess Online</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12">
        <div className="order-2 lg:order-1">
          <ChessBoard chess={chess} playerColor={playerColor} isMyTurn={isMyTurn} onMove={makeMove} />
        </div>

        <div className="w-full max-w-sm order-1 lg:order-2">
          <GameControls
            isConnected={isConnected}
            playerColor={playerColor}
            status={status}
            turn={turn}
            isMyTurn={isMyTurn}
            winner={winner}
            onStartGame={handleStartGame}
          />
        </div>
      </div>
    </div>
  );
}
