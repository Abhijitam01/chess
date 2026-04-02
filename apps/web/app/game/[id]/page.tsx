"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createChess } from "@chess/chess-engine";
import { ChessBoard } from "../../../components/ChessBoard";
import { MoveHistory } from "../../../components/MoveHistory";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

interface GameMove {
  moveNumber: number;
  san: string;
  uci: string;
  fen: string;
  whiteTime: number;
  blackTime: number;
}

function formatMs(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function GameReplayPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [moves, setMoves] = useState<GameMove[]>([]);
  const [cursor, setCursor] = useState(-1); // -1 = initial position
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoplay, setAutoplay] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Derive board position from moves[0..cursor]
  const chess = useCallback(() => {
    const c = createChess();
    for (let i = 0; i <= cursor && i < moves.length; i++) {
      const m = moves[i]!;
      c.move({ from: m.uci.slice(0, 2), to: m.uci.slice(2, 4), promotion: m.uci[4] ?? undefined });
    }
    return c;
  }, [cursor, moves]);

  const currentChess = chess();
  const currentMove = cursor >= 0 ? moves[cursor] : null;

  useEffect(() => {
    if (!id) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("chess_token") : null;
    fetch(`${API_URL}/games/${id}/moves`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((body) => {
        if (body.success) {
          setMoves(body.data.moves ?? []);
          setCursor(-1);
        } else {
          setError("Game not found.");
        }
      })
      .catch(() => setError("Failed to load game."))
      .finally(() => setLoading(false));
  }, [id]);

  // Autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        setCursor((prev) => {
          if (prev + 1 >= moves.length) {
            setAutoplay(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    } else {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [autoplay, moves.length]);

  const goTo = (idx: number) => {
    setAutoplay(false);
    setCursor(Math.max(-1, Math.min(idx, moves.length - 1)));
  };

  const sanHistory = moves.slice(0, Math.max(0, cursor + 1)).map((m) => m.san);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="text-lg font-medium">Loading replay...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950 text-zinc-400 flex-col gap-4">
        <div className="text-lg font-medium">{error}</div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-sm transition-colors"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Nav */}
      <nav className="h-16 border-b border-white/10 bg-zinc-900/80 backdrop-blur-md flex-shrink-0 flex items-center px-4 lg:px-6 gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-zinc-400 hover:text-zinc-100"
          aria-label="Back"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-2xl text-emerald-400">♔</span>
        <span className="text-lg font-bold text-slate-100">Game Replay</span>
        <span className="ml-auto text-xs text-zinc-500 font-mono">{id}</span>
      </nav>

      {/* Main */}
      <main className="flex-1 flex overflow-hidden">
        {/* Board */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden bg-zinc-950">
          <div className="relative h-full aspect-square max-h-[85vh] w-auto">
            <ChessBoard
              chess={currentChess}
              playerColor="white"
              isMyTurn={false}
              onMove={() => false}
              readOnly
            />
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center gap-2 shrink-0">
            <button
              onClick={() => goTo(-1)}
              disabled={cursor === -1}
              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 text-sm transition-colors"
              title="Start"
            >
              ⏮
            </button>
            <button
              onClick={() => goTo(cursor - 1)}
              disabled={cursor === -1}
              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 text-sm transition-colors"
              title="Previous"
            >
              ◀
            </button>
            <button
              onClick={() => setAutoplay((a) => !a)}
              className="px-4 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-sm font-semibold transition-colors"
            >
              {autoplay ? "⏸ Pause" : "▶ Play"}
            </button>
            <button
              onClick={() => goTo(cursor + 1)}
              disabled={cursor >= moves.length - 1}
              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 text-sm transition-colors"
              title="Next"
            >
              ▶
            </button>
            <button
              onClick={() => goTo(moves.length - 1)}
              disabled={cursor >= moves.length - 1}
              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 text-sm transition-colors"
              title="End"
            >
              ⏭
            </button>
            <span className="ml-2 text-xs text-zinc-500">
              {cursor + 1} / {moves.length}
            </span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden xl:flex flex-col w-[300px] border-l border-white/10 bg-zinc-900 p-4 gap-4 overflow-y-auto shrink-0">
          {/* Clock at current position */}
          {currentMove && (
            <div className="bg-white/[0.03] rounded-xl border border-white/5 p-4">
              <div className="text-xs uppercase tracking-wider font-bold text-zinc-500 mb-3">Clock</div>
              <div className="flex justify-between text-sm">
                <div>
                  <div className="text-zinc-400">White</div>
                  <div className="text-lg font-mono font-bold text-zinc-100">
                    {formatMs(currentMove.whiteTime)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-zinc-400">Black</div>
                  <div className="text-lg font-mono font-bold text-zinc-100">
                    {formatMs(currentMove.blackTime)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scrubber */}
          <div className="bg-white/[0.03] rounded-xl border border-white/5 p-4">
            <div className="text-xs uppercase tracking-wider font-bold text-zinc-500 mb-3">Position</div>
            <input
              type="range"
              min={-1}
              max={moves.length - 1}
              value={cursor}
              onChange={(e) => goTo(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Move list */}
          <div className="flex flex-col flex-1 min-h-0 bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-3 border-b border-white/5 text-xs uppercase tracking-wider font-bold text-zinc-500">
              Moves
            </div>
            <div className="flex-1 overflow-hidden">
              <MoveHistory moves={sanHistory} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
