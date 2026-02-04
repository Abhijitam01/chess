"use client";

import { useWebSocket } from "../../hooks/useWebSocket";
import { useChessGame } from "../../hooks/useChessGame";
import { ChessBoard } from "../../components/ChessBoard";
import { GameControls } from "../../components/GameControls";
import { MoveHistory } from "../../components/MoveHistory";
import { useRouter } from "next/navigation";
import { INIT_GAME } from '@repo/types';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

export default function Game() {
  const { socket, isConnected, sendMessage } = useWebSocket(WS_URL);
  const { 
    chess, 
    playerColor, 
    status, 
    turn, 
    winner, 
    moveHistory, 
    makeMove, 
    isMyTurn,
    resign 
  } = useChessGame(socket, isConnected);
  const router = useRouter();

  const handleStartGame = () => {
    sendMessage({ type: INIT_GAME });
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)] pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-3 group transition-transform hover:scale-105"
            >
              <span className="text-4xl drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">♔</span>
              <span className="text-2xl font-bold bg-linear-to-r from-blue-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent">
                Chess Online
              </span>
            </button>

            {/* Connection Status */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
              isConnected 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
              }`} />
              <span className={`text-sm font-semibold ${
                isConnected ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="flex flex-col lg:flex-row items-start justify-center gap-6">
          {/* Chess Board Section */}
          <div className="flex-1 w-full max-w-2xl">
            <div className="bg-slate-900/40 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-2xl">
              <ChessBoard 
                chess={chess} 
                playerColor={playerColor} 
                isMyTurn={isMyTurn} 
                onMove={makeMove} 
              />
            </div>
          </div>

          {/* Sidebar - Game Info */}
          <div className="w-full lg:w-96 flex flex-col gap-6">
            {/* Game Controls */}
            <div className="bg-slate-900/40 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-xl">
              <GameControls
                isConnected={isConnected}
                playerColor={playerColor}
                status={status}
                turn={turn}
                isMyTurn={isMyTurn}
                winner={winner}
                onStartGame={handleStartGame}
                onResign={resign}
              />
            </div>

            {/* Move History */}
            <div className="bg-slate-900/40 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-xl flex flex-col max-h-[500px]">
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/5">
                <span className="text-2xl">📜</span>
                <h3 className="text-lg font-bold text-white">Move History</h3>
                {moveHistory && moveHistory.length > 0 && (
                  <span className="ml-auto text-xs font-semibold text-slate-400 bg-white/5 px-3 py-1 rounded-full">
                    {moveHistory.length} {moveHistory.length === 1 ? 'move' : 'moves'}
                  </span>
                )}
              </div>
              
              <MoveHistory moves={moveHistory} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-slate-950/80 backdrop-blur-xl py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm font-medium mb-2">
            Built with ♟️ and ⚡ • Chess Online 2026
          </p>
          <p className="text-slate-500 text-xs">
            Real-time multiplayer chess experience
          </p>
        </div>
      </footer>
    </div>
  );
}