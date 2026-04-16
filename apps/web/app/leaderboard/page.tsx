"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("chess_token");

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
    return <span className="text-slate-500 text-sm font-mono w-6 text-right">{rank}</span>;
  };

  const winRate = (e: LeaderboardEntry) =>
    e.totalGames > 0 ? Math.round((e.wins / e.totalGames) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#262421] text-slate-100 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push(isLoggedIn ? "/game" : "/")}
            className="text-slate-500 hover:text-slate-100 transition-colors text-sm"
          >
            ← {isLoggedIn ? "Back" : "Home"}
          </button>
          <h1 className="text-2xl font-bold">Leaderboard</h1>
        </div>

        {loading && (
          <div className="text-center text-slate-500 py-20">Loading…</div>
        )}

        {error && (
          <div className="text-center text-red-400 py-20">{error}</div>
        )}

        {!loading && !error && (
          <div className="bg-[#302e2b] border border-[#3d3a37] rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-500 text-xs uppercase tracking-wider">
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
                          className="font-semibold text-slate-100 hover:text-[#769656] transition-colors"
                        >
                          {entry.username}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#769656]">
                        {entry.rating}
                      </td>
                      <td className="py-3 px-4 text-right text-[#769656] hidden sm:table-cell">{entry.wins}</td>
                      <td className="py-3 px-4 text-right text-red-400 hidden sm:table-cell">{entry.losses}</td>
                      <td className="py-3 px-4 text-right text-slate-500 hidden sm:table-cell">{entry.draws}</td>
                      <td className="py-3 px-4 text-right text-slate-400 hidden md:table-cell">{winRate(entry)}%</td>
                      <td className="py-3 px-4 text-right text-slate-500 hidden md:table-cell">{entry.totalGames}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {entries.length === 0 && (
              <p className="text-center text-slate-500 py-12">No players yet. Be the first!</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
