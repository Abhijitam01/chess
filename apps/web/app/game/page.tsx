"use client";

import { useEffect, useState, useMemo } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useChessGame } from "../../hooks/useChessGame";
import { ChessBoard } from "../../components/ChessBoard";
import { MoveHistory } from "../../components/MoveHistory";
import { useRouter } from "next/navigation";
import { LobbyModal } from "../../components/LobbyModal";
import { GameResultPanel } from "../../components/GameResultPanel";
import { useAuth } from "../../hooks/useAuth";
import { useThemeContext, BOARD_THEMES, type BoardTheme } from "../../context/ThemeContext";
import { useSound } from "../../hooks/useSound";
import { TIME_CONTROLS, TimeControlKey, TimeControlCategory, DEFAULT_TIME_CONTROL } from "@repo/types";
import { Chess } from "@chess/chess-engine";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

type BotDifficulty = 'easy' | 'medium' | 'hard';

const PIECE_VALUES: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

function evalPosition(chess: Chess, forColor: 'w' | 'b'): number {
  if (chess.isCheckmate()) return chess.turn() !== forColor ? 1000 : -1000;
  if (chess.isDraw()) return 0;
  let score = 0;
  for (const row of chess.board()) {
    for (const sq of row) {
      if (!sq) continue;
      const val = PIECE_VALUES[sq.type] ?? 0;
      score += sq.color === forColor ? val : -val;
    }
  }
  return score;
}

function getBotMove(chess: Chess, difficulty: BotDifficulty): { from: string; to: string; san: string } | null {
  const moves = chess.moves({ verbose: true }) as Array<{ from: string; to: string; san: string; captured?: string }>;
  if (moves.length === 0) return null;

  if (difficulty === 'easy') {
    return moves[Math.floor(Math.random() * moves.length)]!;
  }

  if (difficulty === 'medium') {
    const captures = moves.filter(m => m.captured);
    if (captures.length > 0) {
      captures.sort((a, b) => (PIECE_VALUES[b.captured!] ?? 0) - (PIECE_VALUES[a.captured!] ?? 0));
      return captures[0]!;
    }
    return moves[Math.floor(Math.random() * moves.length)]!;
  }

  const color = chess.turn();
  let bestScore = -Infinity;
  let bestMove = moves[0]!;
  for (const move of moves) {
    const temp = new Chess(chess.fen());
    temp.move(move);
    const score = evalPosition(temp, color);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
}

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
      className={`w-9 h-5 rounded-full transition-colors flex-shrink-0 relative ${on ? "bg-[#769656]" : "bg-[#262421] border border-[#3d3a37]"}`}
    >
      <div
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`}
      />
    </button>
  );
}

const CATEGORIES: TimeControlCategory[] = ['bullet', 'blitz', 'rapid', 'classical'];

function TimeControlPicker({
  value,
  onChange,
  compact = false,
}: {
  value: TimeControlKey;
  onChange: (k: TimeControlKey) => void;
  compact?: boolean;
}) {
  const currentCategory = TIME_CONTROLS[value].category;

  const optionsForCategory = (cat: TimeControlCategory) =>
    Object.entries(TIME_CONTROLS).filter(([, v]) => v.category === cat) as [TimeControlKey, typeof TIME_CONTROLS[TimeControlKey]][];

  const selectCategory = (cat: TimeControlCategory) => {
    const opts = optionsForCategory(cat);
    if (opts.length > 0) onChange(opts[0]![0]);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 rounded-lg bg-[#262421] border border-[#3d3a37] overflow-hidden">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => selectCategory(cat)}
            className={`py-2 text-[11px] font-semibold capitalize transition-all ${
              currentCategory === cat
                ? 'bg-[#769656] text-white'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {optionsForCategory(currentCategory).map(([key, tc]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              value === key
                ? 'bg-[#769656]/20 text-[#8fb870] border border-[#769656]/50'
                : 'bg-[#302e2b] text-slate-400 border border-[#3d3a37] hover:border-[#769656]/30 hover:text-slate-200'
            }`}
          >
            {tc.minutes} min
          </button>
        ))}
      </div>
    </div>
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
  const [activeTab, setActiveTab] = useState<'moves' | 'chat' | 'info'>('moves');

  const [botMode, setBotMode] = useState(false);
  const [selectedBotDifficulty, setSelectedBotDifficulty] = useState<BotDifficulty>('medium');
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>('medium');
  const [localMoves, setLocalMoves] = useState<string[]>([]);
  const [localStatus, setLocalStatus] = useState<'playing' | 'finished'>('playing');
  const [localWinner, setLocalWinner] = useState<'white' | 'black' | null>(null);
  const [localGameOverReason, setLocalGameOverReason] = useState<string | null>(null);
  const [botThinking, setBotThinking] = useState(false);

  const localChess = useMemo(() => {
    const c = new Chess();
    for (const san of localMoves) c.move(san);
    return c;
  }, [localMoves]);

  const startBotGame = (difficulty: BotDifficulty) => {
    setBotMode(true);
    setBotDifficulty(difficulty);
    setLocalMoves([]);
    setLocalStatus('playing');
    setLocalWinner(null);
    setLocalGameOverReason(null);
    setBotThinking(false);
    setViewingMoveIndex(null);
  };

  const makeBotGameMove = (from: string, to: string): boolean => {
    if (botThinking || localStatus !== 'playing') return false;
    const temp = new Chess(localChess.fen());
    let result;
    try {
      result = temp.move({ from, to, promotion: 'q' });
    } catch {
      return false;
    }
    if (!result) return false;
    const newMoves = [...localMoves, result.san];
    setLocalMoves(newMoves);
    setViewingMoveIndex(null);
    if (temp.isGameOver()) {
      const winner = temp.isCheckmate() ? (temp.turn() === 'w' ? 'black' : 'white') : null;
      setLocalWinner(winner);
      setLocalGameOverReason(temp.isCheckmate() ? 'checkmate' : temp.isStalemate() ? 'stalemate' : 'draw');
      setLocalStatus('finished');
    } else {
      setBotThinking(true);
    }
    return true;
  };

  const resetBotGame = () => {
    setBotMode(false);
    setLocalMoves([]);
    setLocalStatus('playing');
    setLocalWinner(null);
    setLocalGameOverReason(null);
    setBotThinking(false);
    setViewingMoveIndex(null);
  };

  useEffect(() => {
    if (!botMode || !botThinking || localStatus !== 'playing') return;
    const delay = botDifficulty === 'easy' ? 300 : botDifficulty === 'medium' ? 500 : 900;
    const timer = setTimeout(() => {
      const move = getBotMove(localChess, botDifficulty);
      if (!move) { setBotThinking(false); return; }
      const newMoves = [...localMoves, move.san];
      setLocalMoves(newMoves);
      setBotThinking(false);
      const temp = new Chess();
      for (const san of newMoves) temp.move(san);
      if (temp.isGameOver()) {
        const winner = temp.isCheckmate() ? (temp.turn() === 'w' ? 'black' : 'white') : null;
        setLocalWinner(winner);
        setLocalGameOverReason(temp.isCheckmate() ? 'checkmate' : temp.isStalemate() ? 'stalemate' : 'draw');
        setLocalStatus('finished');
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [botMode, botThinking, localChess, localMoves, botDifficulty, localStatus]);

  useEffect(() => {
    if (status === "playing") setViewingMoveIndex(null);
  }, [status]);

  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#262421] text-slate-400">
        <div className="text-lg font-medium">Loading...</div>
      </div>
    );
  }

  const isFinished = (status === "finished" && !!gameOverReason) || (botMode && localStatus === 'finished');
  const isPlaying = status === "playing" || (botMode && localStatus === 'playing');
  const showBoard = isPlaying || isFinished;
  const isIdle = !botMode && matchMakingStatus === "idle" && status !== "playing" && !isFinished;
  const isFinding = !botMode && matchMakingStatus === "finding";

  const displayChess = botMode ? localChess : chess;
  const displayPlayerColor = botMode ? 'white' : playerColor;
  const displayMoveHistory = botMode ? localMoves : moveHistory;
  const displayIsMyTurn = botMode
    ? localChess.turn() === 'w' && !botThinking && localStatus === 'playing'
    : isMyTurn;

  const myTime = playerColor === "white" ? whiteTime : blackTime;
  const opponentTime = playerColor === "white" ? blackTime : whiteTime;
  const myClockActive = isMyTurn && status === "playing";
  const opponentClockActive = !isMyTurn && status === "playing";
  const opponentColorLabel = displayPlayerColor === "white" ? "black" : "white";

  return (
    <div className="h-screen flex flex-col bg-[#262421] text-slate-100 overflow-hidden">
      <nav className="h-14 border-b border-[#3d3a37] bg-[#1d1b18] flex-shrink-0 z-20 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/game")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-xl text-[#769656]">♔</span>
            <span className="text-base font-bold text-slate-100 hidden sm:block">Chess</span>
          </button>

          {isPlaying && (
            <>
              <span className="text-slate-700 hidden sm:block">/</span>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-slate-100">Live Game</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide leading-none">
                  {TIME_CONTROLS[selectedTimeControl].minutes} min · {playerColor ?? ""}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 ${isConnected ? "bg-[#769656] animate-pulse" : "bg-red-400"}`}
          />

          {isPlaying && lobbyCode && (
            <span className="hidden sm:block px-3 py-1.5 rounded-lg bg-[#302e2b] border border-[#3d3a37] text-xs font-mono text-slate-400">
              {lobbyCode}
            </span>
          )}

          {isPlaying && (
            <button
              onClick={() => resetGame()}
              className="px-3 py-1.5 rounded-lg bg-[#302e2b] border border-[#3d3a37] text-xs font-semibold text-slate-400 hover:text-slate-200 hover:border-[#3a4d6a] transition-colors"
            >
              Lobby
            </button>
          )}

          {!isPlaying && (
            <>
              <button
                onClick={() => router.push(`/profile/${user.username}`)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#302e2b] hover:bg-[#222d42] transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-[#769656] flex items-center justify-center text-white text-[9px] font-black">
                  {user.username[0]?.toUpperCase()}
                </span>
                <span className="text-xs font-semibold text-slate-300">{user.username}</span>
                <span className="text-xs font-bold text-[#769656]">{user.rating}</span>
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
              className="px-4 py-1.5 rounded-lg bg-[#769656] hover:bg-[#8fb870] text-white text-xs font-bold transition-colors"
            >
              New Game
            </button>
          )}
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden">
        <aside className="hidden lg:flex w-14 flex-shrink-0 bg-[#1d1b18] border-r border-[#3d3a37] flex-col items-center py-3 gap-1">
          <button
            onClick={() => router.push("/game")}
            title="Home"
            className="p-3 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-[#302e2b] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          <button
            onClick={() => router.push("/leaderboard")}
            title="Leaderboard"
            className="p-3 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-[#302e2b] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          <button
            onClick={() => router.push(`/profile/${user.username}`)}
            title="Profile"
            className="p-3 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-[#302e2b] transition-colors"
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

        {!isPlaying && (
        <div className="hidden lg:flex flex-col w-[240px] flex-shrink-0 bg-[#1d1b18] border-r border-[#3d3a37] overflow-y-auto">
            <div className="p-4 space-y-4">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                  Time Control
                </div>
                <TimeControlPicker value={selectedTimeControl} onChange={setSelectedTimeControl} />
              </div>

              <button
                onClick={() => startMatchMaking(selectedTimeControl)}
                disabled={!isConnected || isFinding}
                className="w-full py-3 rounded-xl bg-[#769656] hover:bg-[#8fb870] disabled:bg-[#2a3d1f] disabled:cursor-not-allowed text-white font-bold text-sm transition-colors shadow-lg shadow-[#769656]/20"
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
                  className="w-full py-2.5 rounded-xl border border-[#3d3a37] text-slate-400 hover:text-slate-200 hover:border-slate-600 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
              )}

              <div className="relative flex items-center">
                <div className="flex-1 border-t border-[#3d3a37]" />
                <span className="px-2 text-[10px] text-slate-600 bg-[#1d1b18]">OR</span>
                <div className="flex-1 border-t border-[#3d3a37]" />
              </div>

              <button
                onClick={openLobbyModal}
                disabled={!isConnected}
                className="w-full py-3 rounded-xl border border-[#3d3a37] text-slate-300 hover:text-white hover:border-[#769656]/50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold transition-all"
              >
                Challenge a Friend
              </button>

              <div className="relative flex items-center">
                <div className="flex-1 border-t border-[#3d3a37]" />
                <span className="px-2 text-[10px] text-slate-600 bg-[#1d1b18]">OR</span>
                <div className="flex-1 border-t border-[#3d3a37]" />
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Play vs Bot
                </div>
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {(['easy', 'medium', 'hard'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedBotDifficulty(d)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                        selectedBotDifficulty === d
                          ? 'bg-[#769656] text-white shadow-lg shadow-[#769656]/20'
                          : 'bg-[#302e2b] border border-[#3d3a37] text-slate-400 hover:border-[#769656]/30 hover:text-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => startBotGame(selectedBotDifficulty)}
                  className="w-full py-2.5 rounded-xl bg-violet-700 hover:bg-violet-600 text-white text-sm font-bold transition-colors"
                >
                  Play vs Bot
                </button>
              </div>

              {!isConnected && (
                <div className="rounded-xl bg-red-950/50 border border-red-800/40 px-3 py-2.5 text-xs text-red-400 font-medium text-center">
                  Not connected to server
                </div>
              )}
            </div>
        </div>
        )}

        <div className="flex-1 flex flex-col bg-[#262421] overflow-hidden">
          {showBoard ? (
            /* Playing / Finished: opponent strip + board + player strip */
            <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden p-2 lg:p-3">
              <div className="flex flex-col" style={{
                height: 'min(calc(100vh - 56px - 32px), 90vh)',
                width: 'min(min(calc(100vh - 56px - 32px), 90vh), 100%)'
              }}>
                <div className="h-[52px] flex-shrink-0 flex items-center justify-between px-1 gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0 ${botMode ? 'bg-violet-700' : 'bg-violet-700'}`}>
                      {botMode ? '🤖' : '?'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100">{botMode ? `Bot (${botDifficulty})` : 'Opponent'}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{opponentColorLabel}</div>
                    </div>
                  </div>
                  {!botMode && (
                    <div className={`px-3 py-1.5 rounded-lg font-mono text-xl font-black tabular-nums transition-all ${
                      opponentClockActive
                        ? 'bg-[#769656] text-white'
                        : 'bg-[#302e2b] text-slate-500 border border-[#3d3a37]'
                    }`}>
                      {formatTime(opponentTime)}
                    </div>
                  )}
                  {botMode && botThinking && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-900/40 border border-violet-700/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-h-0 min-w-0">
                  <ChessBoard
                    chess={displayChess}
                    playerColor={displayPlayerColor}
                    isMyTurn={displayIsMyTurn && viewingMoveIndex === null}
                    onMove={(from, to) => {
                      if (botMode) return makeBotGameMove(from, to);
                      const ok = makeMove(from, to);
                      if (ok) setViewingMoveIndex(null);
                      return ok;
                    }}
                    boardTheme={boardTheme}
                    showCoordinates={showCoordinates}
                    viewingMoveIndex={viewingMoveIndex}
                  />
                </div>

                <div className="h-[52px] flex-shrink-0 flex items-center justify-between px-1 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#769656] flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                      {user.username[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100">{user.username}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{displayPlayerColor ?? 'white'}</div>
                    </div>
                    <span className="text-xs font-bold text-[#769656]">{user.rating}</span>
                  </div>
                  {!botMode && (
                    <div className={`px-3 py-1.5 rounded-lg font-mono text-xl font-black tabular-nums transition-all ${
                      myClockActive
                        ? 'bg-[#769656] text-white shadow-lg shadow-[#769656]/30'
                        : 'bg-[#302e2b] text-slate-500 border border-[#3d3a37]'
                    }`}>
                      {formatTime(myTime)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Idle/finding: simple centered board */
            <div className="flex-1 flex items-center justify-center min-h-0 p-3 lg:p-4">
              <div className="relative h-full aspect-square max-h-[85vh] w-auto">
                <ChessBoard
                  chess={chess}
                  playerColor={null}
                  isMyTurn={false}
                  onMove={() => false}
                  boardTheme={boardTheme}
                  showCoordinates={showCoordinates}
                  viewingMoveIndex={null}
                  readOnly
                />
              </div>
            </div>
          )}

          {showMatchStartAnimation && (
            <div className="px-5 py-2 rounded-xl bg-[#1a2216]/60 border border-[#769656]/30 shrink-0 mx-auto mb-2">
              <span className="text-[#769656] font-bold text-sm animate-pulse">
                Match Starting — you play as {playerColor}
              </span>
            </div>
          )}

          <div className="lg:hidden mt-3 w-full max-w-md space-y-2 shrink-0">
            {isPlaying && (
              <div className="grid grid-cols-2 gap-2">
                <div
                  className={`rounded-xl px-3 py-2.5 text-center transition-all ${
                    opponentClockActive
                      ? "bg-[#769656]/20 border border-[#769656]/40"
                      : "bg-[#302e2b] border border-[#3d3a37]"
                  }`}
                >
                  <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wide">
                    Opponent
                  </div>
                  <div
                    className={`font-mono text-2xl font-black tabular-nums ${
                      opponentClockActive ? "text-[#8fb870]" : "text-slate-500"
                    }`}
                  >
                    {formatTime(opponentTime)}
                  </div>
                </div>
                <div
                  className={`rounded-xl px-3 py-2.5 text-center transition-all ${
                    myClockActive
                      ? "bg-[#769656] shadow-lg shadow-[#769656]/30"
                      : "bg-[#302e2b] border border-[#3d3a37]"
                  }`}
                >
                  <div
                    className={`text-[10px] mb-1 uppercase tracking-wide ${myClockActive ? "text-[#8fb870]" : "text-slate-500"}`}
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
                <TimeControlPicker value={selectedTimeControl} onChange={setSelectedTimeControl} compact />
                {isFinding ? (
                  <button
                    onClick={resetGame}
                    className="w-full py-3 rounded-xl border border-[#3d3a37] text-slate-400 hover:text-slate-200 text-sm font-bold transition-colors"
                  >
                    Cancel Search
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => startMatchMaking(selectedTimeControl)}
                      disabled={!isConnected}
                      className="w-full py-3 rounded-xl bg-[#769656] hover:bg-[#8fb870] disabled:opacity-40 text-white font-bold text-sm transition-colors"
                    >
                      Find Opponent
                    </button>
                    <button
                      onClick={openLobbyModal}
                      disabled={!isConnected}
                      className="w-full py-2.5 rounded-xl border border-[#3d3a37] text-slate-300 hover:text-white disabled:opacity-40 text-sm font-semibold transition-colors"
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
                    className="flex-1 py-2.5 rounded-xl bg-[#302e2b] border border-[#3d3a37] text-slate-300 text-xs font-bold transition-colors hover:border-[#769656]/40"
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

        <div className="hidden lg:flex flex-col w-[280px] flex-shrink-0 bg-[#1d1b18] border-l border-[#3d3a37]">
          {isFinished ? (
            <GameResultPanel
              winner={botMode ? localWinner : winner}
              playerColor={botMode ? 'white' : playerColor}
              reason={botMode ? (localGameOverReason ?? '') : (gameOverReason ?? '')}
              winningMove={displayMoveHistory.length > 0 ? displayMoveHistory[displayMoveHistory.length - 1] ?? null : null}
              myRatingChange={botMode ? null : (playerColor === 'white' ? ratingChanges.white : ratingChanges.black)}
              onPlayAgain={() => {
                if (botMode) { startBotGame(botDifficulty); } else { resetGame(); startMatchMaking(selectedTimeControl); }
              }}
            />
          ) : isPlaying ? (
            <>
              <div className="flex border-b border-[#3d3a37] flex-shrink-0">
                {(['moves', 'chat', 'info'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-xs font-semibold capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-slate-100 border-b-2 border-[#769656]'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {drawOfferFromOpponent && (
                <div className="p-3 bg-[#1a2216]/60 border-b border-[#769656]/40 flex-shrink-0">
                  <p className="text-xs font-semibold text-[#8fb870] text-center mb-2">
                    Opponent offers a draw
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={acceptDraw}
                      className="flex-1 py-1.5 bg-[#769656] hover:bg-[#8fb870] text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={declineDraw}
                      className="flex-1 py-1.5 bg-[#302e2b] border border-[#3d3a37] text-slate-400 hover:text-slate-200 text-xs font-bold rounded-lg transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                {activeTab === 'moves' && (
                  <MoveHistory
                    moves={displayMoveHistory}
                    selectedMoveIndex={viewingMoveIndex}
                    onMoveSelect={(idx) => setViewingMoveIndex(idx)}
                  />
                )}
                {activeTab === 'chat' && (
                  <div className="flex-1 flex items-center justify-center text-slate-600 text-sm">
                    Chat coming soon
                  </div>
                )}
                {activeTab === 'info' && (
                  <div className="flex-1 p-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Time control</span>
                      <span className="text-slate-200 font-semibold capitalize">{TIME_CONTROLS[selectedTimeControl].minutes} min · {TIME_CONTROLS[selectedTimeControl].category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">You play as</span>
                      <span className="text-slate-200 font-semibold capitalize">{playerColor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Your rating</span>
                      <span className="text-[#769656] font-bold">{user.rating}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 border-t border-[#3d3a37] flex items-center justify-center gap-1 p-3">
                <button
                  onClick={() => setViewingMoveIndex(0)}
                  disabled={(viewingMoveIndex ?? displayMoveHistory.length - 1) <= 0}
                  title="First move"
                  className="p-2 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-slate-400 hover:text-slate-200 transition-colors text-xs font-bold"
                >
                  ⏮
                </button>
                <button
                  onClick={() =>
                    setViewingMoveIndex(
                      Math.max(0, (viewingMoveIndex ?? displayMoveHistory.length - 1) - 1)
                    )
                  }
                  disabled={(viewingMoveIndex ?? displayMoveHistory.length - 1) <= 0}
                  title="Previous"
                  className="p-2 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-slate-400 hover:text-slate-200 transition-colors text-lg"
                >
                  ‹
                </button>
                <span className="px-3 py-1 rounded bg-[#302e2b] text-xs font-mono text-slate-400 min-w-[60px] text-center">
                  {viewingMoveIndex === null
                    ? `${Math.ceil(displayMoveHistory.length / 2)} / ${Math.ceil(displayMoveHistory.length / 2)}`
                    : `${Math.ceil((viewingMoveIndex + 1) / 2)} / ${Math.ceil(displayMoveHistory.length / 2)}`}
                </span>
                <button
                  onClick={() => {
                    const next = (viewingMoveIndex ?? displayMoveHistory.length - 1) + 1;
                    if (next >= displayMoveHistory.length) setViewingMoveIndex(null);
                    else setViewingMoveIndex(next);
                  }}
                  disabled={viewingMoveIndex === null}
                  title="Next"
                  className="p-2 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-slate-400 hover:text-slate-200 transition-colors text-lg"
                >
                  ›
                </button>
                <button
                  onClick={() => setViewingMoveIndex(null)}
                  disabled={viewingMoveIndex === null}
                  title="Latest"
                  className="p-2 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-slate-400 hover:text-slate-200 transition-colors text-xs font-bold"
                >
                  ⏭
                </button>
              </div>

              <div className="flex-shrink-0 border-t border-[#3d3a37] flex items-center gap-2 p-3">
                {botMode ? (
                  <button
                    onClick={resetBotGame}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-red-950/40 border border-red-800/30 hover:bg-red-950/70 text-red-400 text-xs font-bold transition-all"
                  >
                    🏳 Quit Game
                  </button>
                ) : (
                  <>
                    {!drawOfferPending && !drawOfferFromOpponent && (
                      <button
                        onClick={offerDraw}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#302e2b] border border-[#3d3a37] hover:border-[#769656]/40 text-slate-300 text-xs font-bold transition-all"
                      >
                        ½ Draw
                      </button>
                    )}
                    {drawOfferPending && (
                      <div className="flex-1 py-2.5 text-center text-xs text-[#769656] font-medium">
                        Draw offered…
                      </div>
                    )}
                    <button
                      onClick={resign}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-red-950/40 border border-red-800/30 hover:bg-red-950/70 text-red-400 text-xs font-bold transition-all"
                    >
                      🏳 Resign
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            /* Idle right panel */
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              <div className="rounded-xl bg-[#302e2b] border border-[#3d3a37] p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#769656] flex items-center justify-center text-white font-black text-sm">
                      {user.username[0]?.toUpperCase()}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#302e2b] ${
                        isConnected ? "bg-[#769656]" : "bg-red-400"
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-100 truncate">{user.username}</div>
                    <button
                      onClick={() => router.push(`/profile/${user.username}`)}
                      className="text-xs text-slate-500 hover:text-[#769656] transition-colors"
                    >
                      View Profile →
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#1d1b18] border border-[#3d3a37]">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                    ELO Rating
                  </span>
                  <span className="text-xl font-black text-[#769656]">{user.rating}</span>
                </div>
              </div>

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
                          ? "border-[#769656] scale-105"
                          : "border-[#3d3a37] hover:border-slate-500"
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

              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Preferences
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#302e2b] border border-[#3d3a37]">
                    <span className="text-base">{soundEnabled ? "🔊" : "🔇"}</span>
                    <span className="text-sm text-slate-300 flex-1">Sound Effects</span>
                    <Toggle on={soundEnabled} onClick={() => setSoundEnabled(!soundEnabled)} />
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#302e2b] border border-[#3d3a37]">
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
