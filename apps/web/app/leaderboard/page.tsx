"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface LeaderboardEntry {
  id: string;
  username: string;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  totalGames: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/leaderboard?limit=50`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setEntries(json.data as LeaderboardEntry[]);
        } else {
          setError(json.error ?? "Failed to load leaderboard");
        }
      })
      .catch(() => setError("Failed to connect to server"))
      .finally(() => setLoading(false));
  }, []);

  const badge = (rank: number) => {
    if (rank === 1) return <span className="text-yellow-400 font-bold text-lg">🥇</span>;
    if (rank === 2) return <span className="text-gray-300 font-bold text-lg">🥈</span>;
    if (rank === 3) return <span className="text-amber-600 font-bold text-lg">🥉</span>;
    return <span className="text-text-muted text-sm font-mono w-6 text-right">{rank}</span>;
  };

  const winRate = (e: LeaderboardEntry) =>
    e.totalGames > 0 ? Math.round((e.wins / e.totalGames) * 100) : 0;

  return (
    <main className="min-h-screen bg-background text-text-primary px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-text-muted hover:text-text-primary transition-colors text-sm">
            ← Home
          </Link>
          <h1 className="text-2xl font-bold">Leaderboard</h1>
        </div>

        {loading && (
          <div className="text-center text-text-muted py-20">Loading…</div>
        )}

        {error && (
          <div className="text-center text-accent-danger py-20">{error}</div>
        )}

        {!loading && !error && (
          <div className="card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-text-muted text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 text-left w-12">Rank</th>
                  <th className="py-3 px-4 text-left">Player</th>
                  <th className="py-3 px-4 text-right">Rating</th>
                  <th className="py-3 px-4 text-right hidden sm:table-cell">W</th>
                  <th className="py-3 px-4 text-right hidden sm:table-cell">L</th>
                  <th className="py-3 px-4 text-right hidden sm:table-cell">D</th>
                  <th className="py-3 px-4 text-right hidden md:table-cell">Win%</th>
                  <th className="py-3 px-4 text-right hidden md:table-cell">Games</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => {
                  const rank = i + 1;
                  return (
                    <tr
                      key={entry.id}
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                        rank <= 3 ? "bg-white/[0.02]" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center">{badge(rank)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/profile/${encodeURIComponent(entry.username)}`}
                          className="font-semibold text-text-primary hover:text-accent-primary transition-colors"
                        >
                          {entry.username}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-accent-primary">
                        {entry.rating}
                      </td>
                      <td className="py-3 px-4 text-right text-accent-emerald hidden sm:table-cell">{entry.wins}</td>
                      <td className="py-3 px-4 text-right text-accent-danger hidden sm:table-cell">{entry.losses}</td>
                      <td className="py-3 px-4 text-right text-text-muted hidden sm:table-cell">{entry.draws}</td>
                      <td className="py-3 px-4 text-right text-text-secondary hidden md:table-cell">{winRate(entry)}%</td>
                      <td className="py-3 px-4 text-right text-text-muted hidden md:table-cell">{entry.totalGames}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {entries.length === 0 && (
              <p className="text-center text-text-muted py-12">No players yet. Be the first!</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
