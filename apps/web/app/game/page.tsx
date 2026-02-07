"use client";

import { useState } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useChessGame } from "../../hooks/useChessGame";
import { ChessBoard } from "../../components/ChessBoard";
import { GameControls } from "../../components/GameControls";
import { MoveHistory } from "../../components/MoveHistory";
import { Sidebar } from "../../components/Sidebar";
import { useRouter } from "next/navigation";
import { INIT_GAME } from '@repo/types';
import { ChessClock } from "../../components/ChessClock";
import { GameOverModal } from "../../components/GameOverModal";
import { MatchStartAnimation } from "../../components/MatchStartAnimation";
import { MatchmakingButton } from "../../components/MatchMakingButton";

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
    resign,
    whiteTime,
    blackTime,
    showMatchStartAnimation,
    onMatchAnimationComplete,
    gameOverReason,
    startMatchMaking,
    resetGame,
    matchMakingStatus,
  } = useChessGame(socket, isConnected);
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [moveHistoryExpanded, setMoveHistoryExpanded] = useState(false);
  
  const handleStartGame = () => {
    sendMessage({ type: INIT_GAME });
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Navigation - Fixed Height */}
      <nav className="h-16 relative z-20 border-b border-white/[0.06] bg-background-elevated/80 backdrop-blur-md flex-shrink-0">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-6 h-full flex items-center">
          <div className="flex items-center justify-between w-full">
            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-4">
              {/* Mobile menu toggle */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-text-muted hover:text-text-primary min-w-[44px] min-h-[44px]"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Logo */}
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 group transition-opacity hover:opacity-80"
              >
                <span className="text-2xl lg:text-3xl text-accent-emerald">♔</span>
                <span className="text-lg lg:text-xl font-bold text-text-primary tracking-tight">
                  Chess
                </span>
              </button>
            </div>
            
            {/* Right: Connection Status */}
            <div className="flex items-center gap-3">
              <div className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
                ${isConnected 
                  ? 'bg-accent-emerald/10 text-accent-emerald' 
                  : 'bg-accent-danger/10 text-accent-danger'
                }
              `}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-accent-emerald animate-pulse' : 'bg-accent-danger'}`} />
                <span className="hidden sm:inline">{isConnected ? 'Connected' : 'Connecting...'}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Tight 3-Column Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Sidebar (Collapsed by default on mobile) */}
        <div className={`
          ${sidebarCollapsed ? 'w-0 lg:w-20' : 'w-64'} 
          transition-all duration-300 border-r border-white/5 bg-background-sidebar flex-shrink-0
          hidden lg:block
        `}>
          <Sidebar 
            isCollapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
        </div>

        {/* Center: Board Area - MAXIMIZED */}
        <div className="flex-1 flex flex-col items-center justify-center p-2 lg:p-4 overflow-hidden bg-background">
          <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Board Container - Responsive but huge */}
            <div className="flex-1 w-full flex items-center justify-center min-h-0">
              <div className="h-full aspect-square max-h-[85vh] w-auto">
                <ChessBoard 
                  chess={chess} 
                  playerColor={playerColor} 
                  isMyTurn={isMyTurn} 
                  onMove={makeMove} 
                />
              </div>
            </div>
            
            {/* Turn indicator - tighter spacing */}
            {status === 'playing' && (
              <div className="mt-4 flex items-center gap-3 px-6 py-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
                <span className="text-2xl">{turn === 'w' ? '♔' : '♚'}</span>
                <span className={`font-semibold ${isMyTurn ? 'text-accent-emerald' : 'text-text-secondary'}`}>
                  {isMyTurn ? "Your turn" : "Opponent's turn"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Game Info Panel - Closer to board */}
        <div className="hidden xl:flex flex-col w-[320px] border-l border-white/5 bg-background-elevated p-4 gap-4 overflow-y-auto shrink-0 shadow-2xl z-10">
          {/* Chess Clock */}
          <ChessClock 
            whiteTime={whiteTime} 
            blackTime={blackTime} 
            turn={turn} 
          />

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

          <MatchmakingButton
            status={matchMakingStatus}
            onFindOpponent={startMatchMaking}
            isConnected={isConnected}
          />

          <div className="flex flex-col flex-1 min-h-0 bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-3 border-b border-white/5 flex items-center justify-between text-xs uppercase tracking-wider font-bold text-text-muted">
              <span>Move History</span>
              {moveHistory && moveHistory.length > 0 && (
                <span className="bg-white/5 px-2 py-0.5 rounded text-text-primary">
                  {Math.ceil(moveHistory.length / 2)}
                </span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <MoveHistory moves={moveHistory} />
            </div>
          </div>
        </div>
      </main>

      {/* Match Start Animation */}
      <MatchStartAnimation
        show={showMatchStartAnimation}
        playerColor={playerColor}
        onComplete={onMatchAnimationComplete}
      />

      {/* Game Over Modal */}
      <GameOverModal
        show={status === 'finished'}
        winner={winner || ""}
        playerColor={playerColor}
        reason={gameOverReason || ""}
        onPlayAgain={() => {
          resetGame();
          startMatchMaking();
        }}
      />
    </div>
  );
}
