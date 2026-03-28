"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ActiveGame {
  id: string;
  whitePlayer: { username: string; rating: number };
  blackPlayer: { username: string; rating: number };
  fen: string;
  turn: "w" | "b";
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function SpectateListPage() {
  const [games, setGames] = useState<ActiveGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      fetch(`${API_URL}/games/active`)
        .then((r) => r.json())
        .then((json) => {
          if (json.success) {
            setGames(json.data as ActiveGame[]);
            setError(null);
          } else {
            setError(json.error ?? "Failed to load games");
          }
        })
        .catch(() => setError("Failed to connect to server"))
        .finally(() => setLoading(false));
    };

    load();
    const interval = setInterval(load, 10_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-background text-text-primary px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-text-muted hover:text-text-primary transition-colors text-sm">
            ← Home
          </Link>
          <h1 className="text-2xl font-bold">Live Games</h1>
          {!loading && (
            <span className="ml-auto text-xs text-text-muted">
              {games.length} active
            </span>
          )}
        </div>

        {loading && (
          <div className="text-center text-text-muted py-20">Loading…</div>
        )}

        {error && (
          <div className="text-center text-accent-danger py-20">{error}</div>
        )}

        {!loading && !error && games.length === 0 && (
          <div className="card text-center py-16">
            <p className="text-text-muted text-sm">No live games right now.</p>
            <Link href="/game" className="btn-primary mt-4 inline-block text-sm">
              Start a game
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/spectate/${game.id}`}
              className="card hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-white border border-white/20 inline-block" />
                    <span className="font-semibold text-sm">{game.whitePlayer.username}</span>
                    <span className="text-xs text-accent-primary font-mono">{game.whitePlayer.rating}</span>
                    {game.turn === "w" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse ml-1" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#1a1a1a] border border-white/40 inline-block" />
                    <span className="font-semibold text-sm">{game.blackPlayer.username}</span>
                    <span className="text-xs text-accent-primary font-mono">{game.blackPlayer.rating}</span>
                    {game.turn === "b" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse ml-1" />
                    )}
                  </div>
                </div>
                <div className="text-xs text-text-muted font-medium uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
                  Live
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
