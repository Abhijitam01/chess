"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(username, password);
      router.push("/game");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#262421] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl text-[#769656]">♔</span>
          <h1 className="text-3xl font-black tracking-tighter text-white mt-4">Welcome back</h1>
          <p className="text-zinc-400 mt-2 font-medium">Sign in to continue playing</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#302e2b] border border-[#3d3a37] rounded-2xl p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1d1b18] border border-[#3d3a37] rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#769656]/50 transition-colors"
              placeholder="your_username"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1d1b18] border border-[#3d3a37] rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#769656]/50 transition-colors"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#769656] hover:bg-[#8fb870] disabled:bg-[#4a6438] disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-zinc-500">
            No account?{" "}
            <Link href="/signup" className="text-[#769656] hover:text-[#8fb870] font-bold">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
