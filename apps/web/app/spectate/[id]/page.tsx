"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createChess } from "@chess/chess-engine";
import { ChessBoard } from "../../../components/ChessBoard";
import { MoveHistory } from "../../../components/MoveHistory";
import { ChessClock } from "../../../components/ChessClock";
import { useAuth } from "../../../hooks/useAuth";
import { useThemeContext } from "../../../context/ThemeContext";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

interface MoveRecord {
  san: string;
  uci: string;
  fen: string;
  whiteTime: number;
  blackTime: number;
  moveNumber: number;
}

interface LiveMoveEvent {
  gameId: string;
  move: MoveRecord;
  fen: string;
  whiteTime: number;
  blackTime: number;
  turn: "w" | "b";
}

export default function SpectateLivePage() {
  const params = useParams();
  const gameId = params.id as string;
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { boardTheme, showCoordinates } = useThemeContext();

  const [chess, setChess] = useState(() => createChess());
  const [turn, setTurn] = useState<"w" | "b">("w");
  const [whiteTime, setWhiteTime] = useState(300_000);
  const [blackTime, setBlackTime] = useState(300_000);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [status, setStatus] = useState<"connecting" | "watching" | "ended">("connecting");
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  // Load existing moves from HTTP then open WS
  useEffect(() => {
    if (!user?.token) return;

    // Fetch prior moves to restore board state
    fetch(`${API_URL}/games/${gameId}/moves`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          const { moves, fen } = json.data as { moves: MoveRecord[]; fen: string | null };
          if (fen) {
            const c = createChess();
            c.load(fen);
            setChess(c);
            setTurn(c.turn());
          }
          if (moves.length > 0) {
            setMoveHistory(moves.map((m) => m.san));
            const last = moves.at(-1);
            if (last) {
              setWhiteTime(last.whiteTime);
              setBlackTime(last.blackTime);
            }
          }
        }
      })
      .catch(() => {/* ignore — will get live updates from WS */});

    // Connect as spectator
    const ws = new WebSocket(`${WS_URL}?spectate=${gameId}&token=${user.token}`);
    wsRef.current = ws;

    ws.onopen = () => setStatus("watching");

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as { type: string; payload: unknown };

        if (msg.type === "move") {
          const event = msg.payload as LiveMoveEvent;
          setChess(() => {
            const c = createChess();
            c.load(event.fen);
            return c;
          });
          setTurn(event.turn);
          setWhiteTime(event.whiteTime);
          setBlackTime(event.blackTime);
          setMoveHistory((h) => [...h, event.move.san]);
        }

        if (msg.type === "game_over") {
          setStatus("ended");
          ws.close();
        }
      } catch {
        // ignore malformed
      }
    };

    ws.onclose = () => {
      if (status !== "ended") setStatus("ended");
    };

    ws.onerror = () => setError("Connection error");

    return () => {
      ws.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, user?.token]);

  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0d1117] text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Nav */}
      <nav className="h-16 border-b border-white/10 bg-zinc-900/80 backdrop-blur-md flex-shrink-0 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/spectate" className="text-slate-500 hover:text-slate-100 text-sm transition-colors">
            ← Live Games
          </Link>
          <span className="text-slate-100 font-bold">Spectating</span>
          {status === "watching" && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          )}
          {status === "ended" && (
            <span className="text-xs text-slate-500 font-medium">Game ended</span>
          )}
        </div>
        <div className="text-xs text-slate-500 font-mono truncate max-w-[160px]">{gameId}</div>
      </nav>

      {/* Body */}
      <main className="flex-1 flex overflow-hidden">
        {/* Board */}
        <div className="flex-1 flex items-center justify-center p-4 bg-zinc-950">
          {error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            <div className="h-full aspect-square max-h-[85vh]">
              <ChessBoard
                chess={chess}
                playerColor={null}
                isMyTurn={false}
                onMove={() => false}
                boardTheme={boardTheme}
                showCoordinates={showCoordinates}
                readOnly
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden xl:flex flex-col w-[280px] border-l border-white/10 bg-zinc-900 p-4 gap-4 overflow-y-auto flex-shrink-0">
          <ChessClock whiteTime={whiteTime} blackTime={blackTime} turn={turn} />

          <div className="bg-[#1c2333] border border-[#2a3547] rounded-xl flex flex-col gap-2 py-3 px-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-white border border-white/20" />
              <span className="font-medium">White</span>
              {turn === "w" && status === "watching" && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse ml-auto" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-[#1a1a1a] border border-white/40" />
              <span className="font-medium">Black</span>
              {turn === "b" && status === "watching" && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse ml-auto" />
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 min-h-0 bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-3 border-b border-white/5 text-xs uppercase tracking-wider font-bold text-slate-500 flex items-center justify-between">
              <span>Moves</span>
              {moveHistory.length > 0 && (
                <span className="bg-white/5 px-2 py-0.5 rounded text-slate-100">
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
    </div>
  );
}
