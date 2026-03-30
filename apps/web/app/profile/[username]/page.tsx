"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface ProfileStats {
  id: string;
  username: string;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  totalGames: number;
}

interface RecentGame {
  id: string;
  whitePlayer: { username: string } | null;
  blackPlayer: { username: string } | null;
  winner: string | null;
  resultReason: string | null;
  whiteRatingChange: number;
  blackRatingChange: number;
  finishedAt: string | null;
  startedAt: string;
}

interface ProfileData extends ProfileStats {
  recentGames: RecentGame[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function ProfilePage() {
  const params = useParams();
  const username = decodeURIComponent(params.username as string);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/profile/${encodeURIComponent(username)}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setProfile(json.data as ProfileData);
        } else {
          setError(json.error ?? "User not found");
        }
      })
      .catch(() => setError("Failed to connect to server"))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-muted">Loading…</p>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-accent-danger">{error ?? "User not found"}</p>
        <Link href="/leaderboard" className="text-sm text-text-muted hover:text-text-primary">
          ← Leaderboard
        </Link>
      </main>
    );
  }

  const initials = profile.username.slice(0, 2).toUpperCase();
  const winRate = profile.totalGames > 0
    ? Math.round((profile.wins / profile.totalGames) * 100)
    : 0;

  const getGameResult = (game: RecentGame, forUsername: string) => {
    const isWhite = game.whitePlayer?.username === forUsername;
    const playerColor = isWhite ? "white" : "black";
    if (!game.winner) return { label: "Draw", color: "text-text-muted", ratingChange: isWhite ? game.whiteRatingChange : game.blackRatingChange };
    const won = game.winner === playerColor;
    return {
      label: won ? "Win" : "Loss",
      color: won ? "text-accent-emerald" : "text-accent-danger",
      ratingChange: isWhite ? game.whiteRatingChange : game.blackRatingChange,
    };
  };

  return (
    <main className="min-h-screen bg-background text-text-primary px-4 py-10">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        {/* Back */}
        <Link href="/leaderboard" className="text-text-muted hover:text-text-primary transition-colors text-sm w-fit">
          ← Leaderboard
        </Link>

        {/* Profile header */}
        <div className="card flex flex-col items-center gap-4 py-8">
          <div className="w-20 h-20 rounded-full bg-accent-primary/20 border-2 border-accent-primary/40 flex items-center justify-center text-2xl font-bold text-accent-primary">
            {initials}
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">{profile.username}</h1>
            <div className="mt-1 inline-block px-3 py-1 bg-accent-primary/20 text-accent-primary rounded-full text-sm font-mono font-bold">
              {profile.rating} ELO
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex gap-8 mt-2">
            <div className="text-center">
              <div className="text-xl font-bold text-accent-emerald">{profile.wins}</div>
              <div className="text-xs text-text-muted uppercase tracking-wide">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-accent-danger">{profile.losses}</div>
              <div className="text-xs text-text-muted uppercase tracking-wide">Losses</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-text-secondary">{profile.draws}</div>
              <div className="text-xs text-text-muted uppercase tracking-wide">Draws</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-text-primary">{winRate}%</div>
              <div className="text-xs text-text-muted uppercase tracking-wide">Win rate</div>
            </div>
          </div>

          {/* Win/loss/draw bar */}
          {profile.totalGames > 0 && (
            <div className="w-full max-w-xs h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-accent-emerald"
                style={{ width: `${(profile.wins / profile.totalGames) * 100}%` }}
              />
              <div
                className="bg-text-muted/40"
                style={{ width: `${(profile.draws / profile.totalGames) * 100}%` }}
              />
              <div
                className="bg-accent-danger"
                style={{ width: `${(profile.losses / profile.totalGames) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Recent games */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3">Recent Games</h2>
          <div className="card divide-y divide-white/5">
            {profile.recentGames.length === 0 && (
              <p className="text-center text-text-muted py-8 text-sm">No games played yet</p>
            )}
            {profile.recentGames.map((game) => {
              const result = getGameResult(game, profile.username);
              const opponent =
                game.whitePlayer?.username === profile.username
                  ? game.blackPlayer?.username
                  : game.whitePlayer?.username;
              const ratingDelta = result.ratingChange;
              return (
                <Link
                  key={game.id}
                  href={`/game/${game.id}`}
                  className="flex items-center justify-between py-3 px-4 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold w-10 ${result.color}`}>{result.label}</span>
                    <div>
                      <div className="text-sm text-text-primary">
                        vs{" "}
                        <span
                          onClick={(e) => { e.preventDefault(); }}
                          className="hover:text-accent-primary transition-colors cursor-pointer"
                        >
                          {opponent ?? "Unknown"}
                        </span>
                      </div>
                      <div className="text-xs text-text-muted capitalize">
                        {game.resultReason ?? "unknown"}
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-mono font-bold ${ratingDelta >= 0 ? "text-accent-emerald" : "text-accent-danger"}`}>
                    {ratingDelta >= 0 ? "+" : ""}{ratingDelta}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
