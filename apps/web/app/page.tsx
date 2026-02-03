"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import chessBoardImage from "../assets/chess_board_hero_1769865149682.png";

export default function Landing() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <nav className="w-full py-6 border-b border-white/10">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">♔</span>
            <h2 className="text-xl font-bold">Chess Online</h2>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-slate-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#play" className="text-slate-400 hover:text-white transition-colors">
              Play
            </a>
            <button
              onClick={() => router.push("/game")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold transition-all"
            >
              Play Now
            </button>
          </div>
        </div>
      </nav>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Play Chess Online
            </h1>

            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
              Challenge players from around the world in real-time chess matches. Improve your skills and climb the
              ranks.
            </p>

            <button
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-lg text-lg font-bold transition-all"
              onClick={() => router.push("/game")}
            >
              Start Playing
            </button>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <Image
              src={chessBoardImage}
              alt="Chess Board"
              className="w-full rounded-xl shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>
        
        {/* Features Section */}
      <section className="py-24" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Why Play Here?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Simple, fast, and built for chess players.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-800/50 p-8 rounded-xl border border-white/10">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3 text-white">Real-Time Play</h3>
              <p className="text-slate-400">Instant matchmaking with players worldwide. No lag, no delays.</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-xl border border-white/10">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3 text-white">Track Progress</h3>
              <p className="text-slate-400">Monitor your improvement with detailed statistics and ratings.</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-xl border border-white/10">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-3 text-white">Compete & Win</h3>
              <p className="text-slate-400">Join tournaments and climb the leaderboards.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-10 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
            <div className="text-slate-500 text-sm">© 2026 Chess Online. Built for chess enthusiasts.</div>
            <div className="text-slate-500 text-sm gap-4 flex justify-center mt-2">
                <a href="https://www.linkedin.com/in/abhijitam-dubey-3ab794263/" className="text-slate-500 hover:text-white transition-colors">LinkedIn</a>
                <a href="https://github.com/Abhijitam01" className="text-slate-500 hover:text-white transition-colors">GitHub</a>
            </div> 
        </div>
      </footer>
    </div>
  );
}
