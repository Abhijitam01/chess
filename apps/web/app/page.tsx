"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
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
            <a
              href="#features"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#play"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Play
            </a>
            <button
              onClick={() => router.push("/game/quick")}
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
              Challenge players in real time and improve your skills.
            </p>

            <button
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-lg text-lg font-bold transition-all"
              onClick={() => router.push("/game/quick")}
            >
              Start Playing
            </button>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <Image
              src="/chess_board_hero.png"
              alt="Chess Board"
              width={1200}
              height={800}
              className="w-full rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
