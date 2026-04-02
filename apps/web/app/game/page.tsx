"use client";

import { useEffect, useState } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useChessGame } from "../../hooks/useChessGame";
import { ChessBoard } from "../../components/ChessBoard";
import { MoveHistory } from "../../components/MoveHistory";
import { useRouter } from "next/navigation";
import { LobbyModal } from "../../components/LobbyModal";
import { GameOverModal } from "../../components/GameOverModal";
import { useAuth } from "../../hooks/useAuth";
import { useThemeContext, BOARD_THEMES, type BoardTheme } from "../../context/ThemeContext";
import { useSound } from "../../hooks/useSound";
import { TIME_CONTROLS, TimeControlKey, DEFAULT_TIME_CONTROL } from "@repo/types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const BOARD_THEME_LABELS: Record<BoardTheme, string> = {
  classic: "Classic",
  walnut: "Walnut",
  ocean: "Ocean",
  midnight: "Midnight",
  emerald: "Emerald",
};

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-9 h-5 rounded-full transition-colors flex-shrink-0 relative ${on ? "bg-indigo-600" : "bg-[#0d1117] border border-[#2a3547]"}`}
    >
      <div
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`}
      />
    </button>
  );
}

export default function Game() {
  const { user, isLoading, logout } = useAuth();
  const {
    boardTheme,
    setBoardTheme,
    soundEnabled,
    setSoundEnabled,
    showCoordinates,
    setShowCoordinates,
  } = useThemeContext();
  const { play: playSound } = useSound(soundEnabled);
  const router = useRouter();
  const [selectedTimeControl, setSelectedTimeControl] =
    useState<TimeControlKey>(DEFAULT_TIME_CONTROL);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  const { socket, isConnected } = useWebSocket(
    WS_URL,
    user?.token ?? null,
    () => {
      logout();
      router.replace("/login");
    }
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

  const [viewingMoveIndex, setViewingMoveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (status === "playing") setViewingMoveIndex(null);
  }, [status]);

  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0d1117] text-slate-400">
        <div className="text-lg font-medium">Loading...</div>
      </div>
    );
  }

  const isPlaying = status === "playing";
  const isIdle = matchMakingStatus === "idle" && status !== "playing";
  const isFinding = matchMakingStatus === "finding";

  const myTime = playerColor === "white" ? whiteTime : blackTime;
  const opponentTime = playerColor === "white" ? blackTime : whiteTime;
  const myClockActive = isMyTurn && isPlaying;
  const opponentClockActive = !isMyTurn && isPlaying;
  const opponentColorLabel = playerColor === "white" ? "black" : "white";

  return (
    <div className="h-screen flex flex-col bg-[#0d1117] text-slate-100 overflow-hidden">
      {/* ── Top Navigation ── */}
      <nav className="h-14 border-b border-[#1a2235] bg-[#111827] flex-shrink-0 z-20 px-4 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-xl text-indigo-400">♔</span>
            <span className="text-base font-bold text-slate-100 hidden sm:block">Chess</span>
          </button>

          {isPlaying && (
            <>
              <span className="text-slate-700 hidden sm:block">/</span>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-slate-100">Live Game</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide leading-none">
                  {selectedTimeControl} · {playerColor ?? ""}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`}
          />

          {isPlaying && lobbyCode && (
            <span className="hidden sm:block px-3 py-1.5 rounded-lg bg-[#1c2333] border border-[#2a3547] text-xs font-mono text-slate-400">
              {lobbyCode}
            </span>
          )}

          {isPlaying && (
            <button
              onClick={() => resetGame()}
              className="px-3 py-1.5 rounded-lg bg-[#1c2333] border border-[#2a3547] text-xs font-semibold text-slate-400 hover:text-slate-200 hover:border-[#3a4d6a] transition-colors"
            >
              Lobby
            </button>
          )}

          {!isPlaying && (
            <>
              <button
                onClick={() => router.push(`/profile/${user.username}`)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c2333] hover:bg-[#222d42] transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[9px] font-black">
                  {user.username[0]?.toUpperCase()}
                </span>
                <span className="text-xs font-semibold text-slate-300">{user.username}</span>
                <span className="text-xs font-bold text-indigo-400">{user.rating}</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1"
              >
                Logout
              </button>
            </>
          )}

          {isPlaying && (
            <button
              onClick={openLobbyModal}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
            >
              New Game
            </button>
          )}
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="flex-1 flex overflow-hidden">
        {/* Icon Sidebar */}
        <aside className="hidden lg:flex w-14 flex-shrink-0 bg-[#111827] border-r border-[#1a2235] flex-col items-center py-3 gap-1">
          <button
            onClick={() => router.push("/")}
            title="Home"
            className="p-3 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-[#1c2333] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          <button
            onClick={() => router.push("/leaderboard")}
            title="Leaderboard"
            className="p-3 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-[#1c2333] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          <button
            onClick={() => router.push(`/profile/${user.username}`)}
            title="Profile"
            className="p-3 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-[#1c2333] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          <div className="flex-1" />

          <div className="text-[10px] text-slate-600 font-mono font-bold pb-1">
            {user.rating}
          </div>
        </aside>

        {/* ── Left Panel ── */}
        <div className="hidden lg:flex flex-col w-[240px] flex-shrink-0 bg-[#111827] border-r border-[#1a2235] overflow-y-auto">
          {isPlaying ? (
            <>
              {/* Opponent card */}
              <div className="p-4 border-b border-[#1a2235] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-700 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    ?
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-100 truncate">Opponent</div>
                    <div className="text-xs text-slate-500">
                      {opponentColorLabel === "white" ? "♔" : "♚"} {opponentColorLabel}
                    </div>
                  </div>
                </div>
                {/* Opponent clock */}
                <div
                  className={`rounded-xl px-4 py-3 text-center transition-all ${
                    opponentClockActive
                      ? "bg-indigo-600/20 border border-indigo-500/40"
                      : "bg-[#1c2333] border border-[#2a3547]"
                  }`}
                >
                  <span
                    className={`font-mono text-3xl font-black tabular-nums tracking-wide ${
                      opponentClockActive ? "text-indigo-300" : "text-slate-500"
                    }`}
                  >
                    {formatTime(opponentTime)}
                  </span>
                </div>
              </div>

              {/* Move History */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#1a2235] flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Move History
                  </span>
                  {moveHistory.length > 0 && (
                    <span className="text-[10px] text-slate-600 bg-[#1c2333] px-1.5 py-0.5 rounded font-mono">
                      {Math.ceil(moveHistory.length / 2)}
                    </span>
                  )}
                </div>
                <div className="flex-1 overflow-hidden p-2">
                  <MoveHistory
                    moves={moveHistory}
                    selectedMoveIndex={viewingMoveIndex}
                    onMoveSelect={(idx) => setViewingMoveIndex(idx)}
                  />
                </div>
              </div>
            </>
          ) : (
            /* Idle: time controls + matchmaking */
            <div className="p-4 space-y-4">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                  Time Control
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(TIME_CONTROLS) as TimeControlKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTimeControl(key)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold capitalize text-center transition-all ${
                        selectedTimeControl === key
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                          : "bg-[#1c2333] border border-[#2a3547] text-slate-400 hover:border-indigo-500/30 hover:text-slate-200"
                      }`}
                    >
                      <div className="text-base mb-1">
                        {key === "bullet" ? "⚡" : key === "blitz" ? "🔥" : key === "rapid" ? "⏱" : "♟"}
                      </div>
                      {key}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => startMatchMaking(selectedTimeControl)}
                disabled={!isConnected || isFinding}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors shadow-lg shadow-indigo-600/20"
              >
                {isFinding ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:300ms]" />
                    <span className="ml-1">Finding...</span>
                  </span>
                ) : (
                  "Find Opponent"
                )}
              </button>

              {isFinding && (
                <button
                  onClick={resetGame}
                  className="w-full py-2.5 rounded-xl border border-[#2a3547] text-slate-400 hover:text-slate-200 hover:border-slate-600 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
              )}

              <div className="relative flex items-center">
                <div className="flex-1 border-t border-[#1a2235]" />
                <span className="px-2 text-[10px] text-slate-600 bg-[#111827]">OR</span>
                <div className="flex-1 border-t border-[#1a2235]" />
              </div>

              <button
                onClick={openLobbyModal}
                disabled={!isConnected}
                className="w-full py-3 rounded-xl border border-[#2a3547] text-slate-300 hover:text-white hover:border-indigo-500/50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold transition-all"
              >
                Challenge a Friend
              </button>

              {!isConnected && (
                <div className="rounded-xl bg-red-950/50 border border-red-800/40 px-3 py-2.5 text-xs text-red-400 font-medium text-center">
                  Not connected to server
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Center: Board ── */}
        <div className="flex-1 flex flex-col items-center justify-center bg-[#0d1117] overflow-hidden p-3 lg:p-4">
          {/* Board */}
          <div className="flex-1 w-full flex items-center justify-center min-h-0">
            <div className="relative h-full aspect-square max-h-[85vh] w-auto">
              <ChessBoard
                chess={chess}
                playerColor={playerColor}
                isMyTurn={isMyTurn && viewingMoveIndex === null}
                onMove={(from, to) => {
                  const ok = makeMove(from, to);
                  if (ok) setViewingMoveIndex(null);
                  return ok;
                }}
                boardTheme={boardTheme}
                showCoordinates={showCoordinates}
                viewingMoveIndex={viewingMoveIndex}
              />
            </div>
          </div>

          {/* Turn indicator */}
          {isPlaying && viewingMoveIndex === null && (
            <div className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111827] border border-[#1a2235] shrink-0">
              <span className="text-lg">{turn === "w" ? "♔" : "♚"}</span>
              <span
                className={`text-sm font-semibold ${isMyTurn ? "text-indigo-400" : "text-slate-500"}`}
              >
                {isMyTurn ? "Your turn" : "Opponent's turn"}
              </span>
            </div>
          )}

          {/* Match starting banner */}
          {showMatchStartAnimation && (
            <div className="mt-2 px-5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-700/30 shrink-0">
              <span className="text-emerald-400 font-bold text-sm animate-pulse">
                Match Starting — you play as {playerColor}
              </span>
            </div>
          )}

          {/* Move navigation */}
          {moveHistory.length > 0 && (
            <div className="mt-2 flex items-center gap-1 shrink-0">
              <button
                onClick={() => setViewingMoveIndex(0)}
                disabled={(viewingMoveIndex ?? moveHistory.length - 1) <= 0}
                title="First move"
                className="p-1.5 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-slate-400 hover:text-slate-200 transition-colors text-xs font-bold"
              >
                ⏮
              </button>
              <button
                onClick={() =>
                  setViewingMoveIndex(
                    Math.max(0, (viewingMoveIndex ?? moveHistory.length - 1) - 1)
                  )
                }
                disabled={(viewingMoveIndex ?? moveHistory.length - 1) <= 0}
                title="Previous"
                className="p-1.5 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-slate-400 hover:text-slate-200 transition-colors text-lg"
              >
                ‹
              </button>
              <span className="px-3 py-1 rounded bg-[#1c2333] text-xs font-mono text-slate-400 min-w-[60px] text-center">
                {viewingMoveIndex === null
                  ? `${Math.ceil(moveHistory.length / 2)} / ${Math.ceil(moveHistory.length / 2)}`
                  : `${Math.ceil((viewingMoveIndex + 1) / 2)} / ${Math.ceil(moveHistory.length / 2)}`}
              </span>
              <button
                onClick={() => {
                  const next = (viewingMoveIndex ?? moveHistory.length - 1) + 1;
                  if (next >= moveHistory.length) setViewingMoveIndex(null);
                  else setViewingMoveIndex(next);
                }}
                disabled={viewingMoveIndex === null}
                title="Next"
                className="p-1.5 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-slate-400 hover:text-slate-200 transition-colors text-lg"
              >
                ›
              </button>
              <button
                onClick={() => setViewingMoveIndex(null)}
                disabled={viewingMoveIndex === null}
                title="Latest"
                className="p-1.5 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-slate-400 hover:text-slate-200 transition-colors text-xs font-bold"
              >
                ⏭
              </button>
            </div>
          )}

          {/* Mobile controls */}
          <div className="lg:hidden mt-3 w-full max-w-md space-y-2 shrink-0">
            {isPlaying && (
              <div className="grid grid-cols-2 gap-2">
                <div
                  className={`rounded-xl px-3 py-2.5 text-center transition-all ${
                    opponentClockActive
                      ? "bg-indigo-600/20 border border-indigo-500/40"
                      : "bg-[#1c2333] border border-[#2a3547]"
                  }`}
                >
                  <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wide">
                    Opponent
                  </div>
                  <div
                    className={`font-mono text-2xl font-black tabular-nums ${
                      opponentClockActive ? "text-indigo-300" : "text-slate-500"
                    }`}
                  >
                    {formatTime(opponentTime)}
                  </div>
                </div>
                <div
                  className={`rounded-xl px-3 py-2.5 text-center transition-all ${
                    myClockActive
                      ? "bg-indigo-600 shadow-lg shadow-indigo-600/30"
                      : "bg-[#1c2333] border border-[#2a3547]"
                  }`}
                >
                  <div
                    className={`text-[10px] mb-1 uppercase tracking-wide ${myClockActive ? "text-indigo-200" : "text-slate-500"}`}
                  >
                    You
                  </div>
                  <div
                    className={`font-mono text-2xl font-black tabular-nums ${
                      myClockActive ? "text-white" : "text-slate-500"
                    }`}
                  >
                    {formatTime(myTime)}
                  </div>
                </div>
              </div>
            )}

            {(isIdle || isFinding) && (
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-1 rounded-xl overflow-hidden border border-[#1a2235]">
                  {(Object.keys(TIME_CONTROLS) as TimeControlKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTimeControl(key)}
                      className={`py-2 text-xs font-semibold capitalize transition-colors ${
                        selectedTimeControl === key
                          ? "bg-indigo-600 text-white"
                          : "bg-[#1c2333] text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
                {isFinding ? (
                  <button
                    onClick={resetGame}
                    className="w-full py-3 rounded-xl border border-[#2a3547] text-slate-400 hover:text-slate-200 text-sm font-bold transition-colors"
                  >
                    Cancel Search
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => startMatchMaking(selectedTimeControl)}
                      disabled={!isConnected}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm transition-colors"
                    >
                      Find Opponent
                    </button>
                    <button
                      onClick={openLobbyModal}
                      disabled={!isConnected}
                      className="w-full py-2.5 rounded-xl border border-[#2a3547] text-slate-300 hover:text-white disabled:opacity-40 text-sm font-semibold transition-colors"
                    >
                      Challenge a Friend
                    </button>
                  </>
                )}
              </div>
            )}

            {isPlaying && (
              <div className="flex gap-2">
                {!drawOfferPending && !drawOfferFromOpponent && (
                  <button
                    onClick={offerDraw}
                    className="flex-1 py-2.5 rounded-xl bg-[#1c2333] border border-[#2a3547] text-slate-300 text-xs font-bold transition-colors hover:border-indigo-500/40"
                  >
                    Offer Draw
                  </button>
                )}
                <button
                  onClick={resign}
                  className="flex-1 py-2.5 rounded-xl bg-red-950/40 border border-red-800/30 text-red-400 text-xs font-bold transition-colors hover:bg-red-950/70"
                >
                  Resign
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="hidden lg:flex flex-col w-[260px] flex-shrink-0 bg-[#111827] border-l border-[#1a2235] overflow-y-auto">
          {isPlaying ? (
            <div className="p-4 space-y-4">
              {/* Your card + clock */}
              <div className="rounded-xl bg-[#1c2333] border border-[#2a3547] p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                      {user.username[0]?.toUpperCase()}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1c2333] ${
                        isConnected ? "bg-emerald-400" : "bg-red-400"
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-100 truncate">{user.username}</div>
                    <div className="text-xs text-slate-500">
                      {playerColor === "white" ? "♔" : "♚"} {playerColor}
                    </div>
                  </div>
                  <div className="text-sm font-black text-indigo-400 flex-shrink-0">
                    {user.rating}
                  </div>
                </div>

                {/* My clock — highlighted when active */}
                <div
                  className={`rounded-xl px-4 py-3.5 text-center transition-all ${
                    myClockActive
                      ? "bg-indigo-600 shadow-lg shadow-indigo-600/30"
                      : "bg-[#131929] border border-[#1a2235]"
                  }`}
                >
                  <span
                    className={`font-mono text-4xl font-black tabular-nums tracking-wide ${
                      myClockActive ? "text-white" : "text-slate-500"
                    }`}
                  >
                    {formatTime(myTime)}
                  </span>
                </div>
              </div>

              {/* Draw offer */}
              {drawOfferFromOpponent && (
                <div className="rounded-xl bg-indigo-950/60 border border-indigo-700/40 p-3 space-y-2">
                  <p className="text-xs font-semibold text-indigo-300 text-center">
                    Opponent offers a draw
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={acceptDraw}
                      className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={declineDraw}
                      className="flex-1 py-2 rounded-lg bg-[#1c2333] border border-[#2a3547] text-slate-400 hover:text-slate-200 text-xs font-bold transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              )}

              {/* Game Actions */}
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Game Actions
                </div>
                <div className="space-y-2">
                  {!drawOfferPending && !drawOfferFromOpponent && (
                    <button
                      onClick={offerDraw}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1c2333] border border-[#2a3547] hover:border-indigo-500/40 hover:bg-[#222d42] text-slate-300 hover:text-white text-sm font-semibold transition-all"
                    >
                      <span className="text-base">🤝</span>
                      Offer Draw
                    </button>
                  )}
                  {drawOfferPending && (
                    <div className="px-4 py-3 rounded-xl bg-[#1c2333] border border-indigo-500/20 text-xs text-indigo-400 font-medium text-center">
                      Draw offer sent…
                    </div>
                  )}
                  <button
                    onClick={resign}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-950/40 border border-red-800/30 hover:bg-red-950/70 hover:border-red-700/50 text-red-400 hover:text-red-300 text-sm font-semibold transition-all"
                  >
                    <span className="text-base">🏳️</span>
                    Resign
                  </button>
                </div>
              </div>

              {/* Board Themes */}
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Board Theme
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {(Object.keys(BOARD_THEMES) as BoardTheme[]).map((theme) => (
                    <button
                      key={theme}
                      title={BOARD_THEME_LABELS[theme]}
                      onClick={() => setBoardTheme(theme)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all h-10 ${
                        boardTheme === theme
                          ? "border-indigo-500 scale-105"
                          : "border-[#2a3547] hover:border-slate-500"
                      }`}
                    >
                      <div className="grid grid-cols-2 grid-rows-2 h-full">
                        <div style={{ backgroundColor: BOARD_THEMES[theme].light }} />
                        <div style={{ backgroundColor: BOARD_THEMES[theme].dark }} />
                        <div style={{ backgroundColor: BOARD_THEMES[theme].dark }} />
                        <div style={{ backgroundColor: BOARD_THEMES[theme].light }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Idle right panel */
            <div className="p-4 space-y-4">
              {/* User card */}
              <div className="rounded-xl bg-[#1c2333] border border-[#2a3547] p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                      {user.username[0]?.toUpperCase()}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1c2333] ${
                        isConnected ? "bg-emerald-400" : "bg-red-400"
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-100 truncate">{user.username}</div>
                    <button
                      onClick={() => router.push(`/profile/${user.username}`)}
                      className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
                    >
                      View Profile →
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#131929] border border-[#1a2235]">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                    ELO Rating
                  </span>
                  <span className="text-xl font-black text-indigo-400">{user.rating}</span>
                </div>
              </div>

              {/* Board Themes */}
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Board Theme
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {(Object.keys(BOARD_THEMES) as BoardTheme[]).map((theme) => (
                    <button
                      key={theme}
                      title={BOARD_THEME_LABELS[theme]}
                      onClick={() => setBoardTheme(theme)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all h-10 ${
                        boardTheme === theme
                          ? "border-indigo-500 scale-105"
                          : "border-[#2a3547] hover:border-slate-500"
                      }`}
                    >
                      <div className="grid grid-cols-2 grid-rows-2 h-full">
                        <div style={{ backgroundColor: BOARD_THEMES[theme].light }} />
                        <div style={{ backgroundColor: BOARD_THEMES[theme].dark }} />
                        <div style={{ backgroundColor: BOARD_THEMES[theme].dark }} />
                        <div style={{ backgroundColor: BOARD_THEMES[theme].light }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Preferences
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#1c2333] border border-[#2a3547]">
                    <span className="text-base">{soundEnabled ? "🔊" : "🔇"}</span>
                    <span className="text-sm text-slate-300 flex-1">Sound Effects</span>
                    <Toggle on={soundEnabled} onClick={() => setSoundEnabled(!soundEnabled)} />
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#1c2333] border border-[#2a3547]">
                    <span className="text-sm font-mono font-bold text-slate-400">a1</span>
                    <span className="text-sm text-slate-300 flex-1">Coordinates</span>
                    <Toggle
                      on={showCoordinates}
                      onClick={() => setShowCoordinates(!showCoordinates)}
                    />
                  </div>
                </div>
              </div>

              {!isConnected && (
                <div className="rounded-xl bg-red-950/50 border border-red-800/40 px-3 py-2.5 text-xs text-red-400 font-medium text-center">
                  Not connected to server
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <GameOverModal
        show={status === "finished" && !!gameOverReason}
        winner={winner}
        playerColor={playerColor}
        reason={gameOverReason ?? ""}
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
