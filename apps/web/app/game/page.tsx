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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const handleStartGame = () => {
    sendMessage({ type: INIT_GAME });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Premium gradient background */}
      <div className="fixed inset-0 bg-premium-dark pointer-events-none" />
      
      {/* Subtle texture overlay */}
      <div className="fixed inset-0 bg-subtle-texture pointer-events-none" />
      
      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl" />
      </div>
      
      {/* Navigation */}
      <nav className="relative z-20 border-b border-white/[0.06] bg-background-elevated/80 backdrop-blur-md">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-4">
              {/* Mobile menu toggle */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-text-muted hover:text-text-primary"
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
                <span className="text-2xl lg:text-3xl text-accent-primary">♔</span>
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
                  ? 'bg-status-online/10 text-status-online' 
                  : 'bg-status-offline/10 text-status-offline'
                }
              `}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-status-online animate-pulse' : 'bg-status-offline'}`} />
                {isConnected ? 'Connected' : 'Connecting...'}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - 3 Column Layout */}
      <main className="relative z-10 flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="hidden lg:block">
          <Sidebar 
            isCollapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          {!sidebarCollapsed && (
            <Sidebar 
              isCollapsed={false} 
              onToggle={() => setSidebarCollapsed(true)} 
            />
          )}
        </div>

        {/* Center: Board Area (Primary Focus) */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 overflow-auto">
          <div className="w-full max-w-[680px]">
            <ChessBoard 
              chess={chess} 
              playerColor={playerColor} 
              isMyTurn={isMyTurn} 
              onMove={makeMove} 
            />
            
            {/* Turn indicator below board */}
            {status === 'playing' && (
              <div className="mt-4 text-center animate-fade-in">
                <span className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                  ${isMyTurn 
                    ? 'bg-accent-primary/20 text-accent-primary' 
                    : 'bg-white/5 text-text-muted'
                  }
                `}>
                  <span className="text-lg">{turn === 'w' ? '♔' : '♚'}</span>
                  {isMyTurn ? "Your turn" : "Opponent's turn"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Game Info */}
        <div className="hidden lg:flex flex-col w-[360px] border-l border-white/[0.06] bg-background-sidebar/50 backdrop-blur-sm p-5 gap-5 overflow-y-auto">
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
          <div className="card flex flex-col flex-1 min-h-0 max-h-[400px]">
            <div className="card-header flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary">Moves</h3>
              {moveHistory && moveHistory.length > 0 && (
                <span className="text-[10px] font-bold text-text-muted bg-white/[0.06] px-2 py-1 rounded">
                  {Math.ceil(moveHistory.length / 2)} moves
                </span>
              )}
            </div>
            <div className="card-body flex-1 min-h-0 overflow-hidden">
              <MoveHistory moves={moveHistory} />
            </div>
          </div>
        </div>

        {/* Mobile Bottom Panel */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-background-elevated/95 backdrop-blur-md border-t border-white/[0.06] p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Status */}
            <div className="flex items-center gap-2">
              {playerColor && (
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm
                  ${playerColor === 'white' 
                    ? 'bg-text-primary text-background' 
                    : 'bg-background text-text-primary border border-white/20'
                  }
                `}>
                  {playerColor === 'white' ? '♔' : '♚'}
                </div>
              )}
              <span className="text-sm font-medium text-text-secondary">
                {status === 'waiting' && 'Waiting...'}
                {status === 'playing' && (isMyTurn ? 'Your turn' : 'Opponent')}
                {status === 'finished' && `${winner} wins`}
              </span>
            </div>
            
            {/* Action Button */}
            {status === 'waiting' && (
              <button 
                className="btn-primary text-sm py-2 px-4"
                onClick={handleStartGame}
                disabled={!isConnected}
              >
                Find Game
              </button>
            )}
            {status === 'playing' && (
              <button 
                className="btn-danger text-sm py-2 px-4"
                onClick={resign}
              >
                Resign
              </button>
            )}
            {status === 'finished' && (
              <button 
                className="btn-primary text-sm py-2 px-4"
                onClick={() => window.location.reload()}
              >
                New Game
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}