"use client";

import { useEffect, useState } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useChessGame } from "../../hooks/useChessGame";
import { ChessBoard } from "../../components/ChessBoard";
import { GameControls } from "../../components/GameControls";
import { MoveHistory } from "../../components/MoveHistory";
import { Sidebar } from "../../components/Sidebar";
import { useRouter } from "next/navigation";
import { ChessClock } from "../../components/ChessClock";
import { MatchmakingButton } from "../../components/MatchMakingButton";
import { LobbyModal } from "../../components/LobbyModal";
import { GameOverModal } from "../../components/GameOverModal";
import { useAuth } from "../../hooks/useAuth";
import { useThemeContext } from "../../context/ThemeContext";
import { useSound } from "../../hooks/useSound";
import { TIME_CONTROLS, TimeControlKey, DEFAULT_TIME_CONTROL } from "@repo/types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

export default function Game() {
  const { user, isLoading, logout } = useAuth();
  const { boardTheme, showCoordinates, soundEnabled } = useThemeContext();
  const { play: playSound } = useSound(soundEnabled);
  const router = useRouter();
  const [selectedTimeControl, setSelectedTimeControl] = useState<TimeControlKey>(DEFAULT_TIME_CONTROL);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  const { socket, isConnected } = useWebSocket(
    WS_URL,
    user?.token ?? null,
    () => { logout(); router.replace("/login"); }
  );
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
    gameOverReason,
    startMatchMaking,
    resetGame,
    matchMakingStatus,
    offerDraw,
    acceptDraw,
    declineDraw,
    drawOfferPending,
    drawOfferFromOpponent,
    ratingChanges,
    showLobbyModal,
    lobbyMode,
    lobbyCode,
    lobbyError,
    openLobbyModal,
    closeLobbyModal,
    createLobby,
    joinLobby,
  } = useChessGame(socket, isConnected, playSound);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Navigation - Fixed Height */}
      <nav className="h-16 relative z-20 border-b border-white/10 bg-zinc-900/80 backdrop-blur-md flex-shrink-0">
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
            
            {/* Right: User Info + Connection Status */}
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
              <button
                onClick={() => router.push(`/profile/${user.username}`)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-xs font-bold text-zinc-300"
              >
                <span className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-black">
                  {user.username[0]?.toUpperCase()}
                </span>
                <span>{user.username}</span>
                <span className="text-emerald-400">{user.rating}</span>
              </button>
              <button
                onClick={() => { logout(); router.replace("/login"); }}
                className="hidden sm:block text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-1.5"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Tight 3-Column Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Sidebar (Collapsed by default on mobile) */}
        <div className={`
          ${sidebarCollapsed ? 'w-0 lg:w-20' : 'w-64'} 
          transition-all duration-300 border-r border-white/10 bg-zinc-900 flex-shrink-0
          hidden lg:block
        `}>
          <Sidebar 
            isCollapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
        </div>

        {/* Center: Board Area - MAXIMIZED */}
        <div className="flex-1 flex flex-col items-center justify-center p-2 lg:p-4 overflow-hidden bg-zinc-950">
          <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Board Container - Responsive but huge */}
            <div className="flex-1 w-full flex items-center justify-center min-h-0">
              <div className="relative h-full aspect-square max-h-[85vh] w-auto">
                <ChessBoard
                  chess={chess}
                  playerColor={playerColor}
                  isMyTurn={isMyTurn}
                  onMove={makeMove}
                  boardTheme={boardTheme}
                  showCoordinates={showCoordinates}
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
        <div className="hidden xl:flex flex-col w-[320px] border-l border-white/10 bg-zinc-900 p-4 gap-4 overflow-y-auto shrink-0 shadow-2xl z-10">
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
            onResign={resign}
            winner={winner}
            reason={gameOverReason}
            showMatchStartAnimation={showMatchStartAnimation}
            onPlayAgain={() => {
              resetGame();
              startMatchMaking(selectedTimeControl);
            }}
            onOfferDraw={offerDraw}
            onAcceptDraw={acceptDraw}
            onDeclineDraw={declineDraw}
            drawOfferPending={drawOfferPending}
            drawOfferFromOpponent={drawOfferFromOpponent}
          />

          {matchMakingStatus === 'idle' && (
            <div className="grid grid-cols-4 gap-1 rounded-lg overflow-hidden border border-white/10">
              {(Object.keys(TIME_CONTROLS) as TimeControlKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedTimeControl(key)}
                  className={`py-2 text-xs font-semibold capitalize transition-colors ${
                    selectedTimeControl === key
                      ? 'bg-accent-emerald text-white'
                      : 'bg-white/[0.03] text-zinc-400 hover:bg-white/10 hover:text-zinc-200'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          )}

          <MatchmakingButton
            status={matchMakingStatus}
            onFindOpponent={() => startMatchMaking(selectedTimeControl)}
            isConnected={isConnected}
          />

          {matchMakingStatus === 'idle' && (
            <button
              onClick={openLobbyModal}
              disabled={!isConnected}
              className="w-full px-4 py-3 rounded-xl border border-white/10 text-zinc-300 hover:text-zinc-100 hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold transition-colors"
            >
              Challenge a Friend
            </button>
          )}

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


      <GameOverModal
        show={status === 'finished' && !!gameOverReason}
        winner={winner}
        playerColor={playerColor}
        reason={gameOverReason ?? ''}
        whiteRatingChange={ratingChanges.white}
        blackRatingChange={ratingChanges.black}
        onPlayAgain={() => {
          resetGame();
          startMatchMaking(selectedTimeControl);
        }}
      />

      <LobbyModal
        show={showLobbyModal}
        mode={lobbyMode}
        lobbyCode={lobbyCode}
        lobbyError={lobbyError}
        onClose={closeLobbyModal}
        onCreateLobby={createLobby}
        onJoinLobby={joinLobby}
      />
    </div>
  );
}
