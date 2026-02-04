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
    <div className="min-h-screen flex flex-col bg-[#1a1a1a]">
      {/* Subtle vignette background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, #1e1e1e 0%, #161616 50%, #0f0f0f 100%)'
        }}
      />
      {/* Very subtle warm accent */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(201, 168, 108, 0.03) 0%, transparent 50%)'
        }}
      />
      
      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/[0.06] bg-[#1a1a1a]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-3 group transition-opacity hover:opacity-80"
            >
              <span className="text-3xl text-[#c9a86c]">♔</span>
              <span className="text-xl font-semibold text-[#f5f5f4] tracking-tight">
                Chess
              </span>
            </button>
            
            {/* Connection indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#6b8e6b]' : 'bg-[#8e6b6b]'}`} />
              <span className="text-xs text-[#78716c] font-medium">
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          {/* Chess Board Section */}
          <div className="flex-1 w-full max-w-2xl">
            <ChessBoard 
              chess={chess} 
              playerColor={playerColor} 
              isMyTurn={isMyTurn} 
              onMove={makeMove} 
            />
          </div>

          {/* Sidebar - Game Info */}
          <div className="w-full lg:w-80 flex flex-col gap-5">
            {/* Game Controls */}
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

            {/* Move History */}
            <div 
              className="rounded-xl p-5 flex flex-col max-h-[400px]"
              style={{
                background: 'rgba(35, 35, 35, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.02)'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.05]">
                <h3 className="text-sm font-semibold text-[#f5f5f4] tracking-wide">Moves</h3>
                {moveHistory && moveHistory.length > 0 && (
                  <span className="text-[10px] font-medium text-[#78716c] bg-white/[0.05] px-2 py-0.5 rounded">
                    {Math.ceil(moveHistory.length / 2)}
                  </span>
                )}
              </div>
              
              <MoveHistory moves={moveHistory} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.05] py-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[#525252] text-xs font-medium">
            Chess • 2026
          </p>
        </div>
      </footer>
    </div>
  );
}