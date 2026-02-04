"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Left Panel - Visuals */}
      <div className="w-full md:w-1/2 lg:w-[60%] relative flex items-center justify-center bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-black to-black opacity-70"></div>
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10 pointer-events-none">
          {Array.from({ length: 64 }).map((_, i) => (
             <div key={i} className={`
                ${(Math.floor(i / 8) + i) % 2 === 0 ? 'bg-white' : 'bg-transparent'}
             `}></div>
          ))}
        </div>

        <div className="relative z-10 w-[85%] max-w-[600px] aspect-square">
             {/* Chess Board Graphic Construction */}
             <div className="w-full h-full bg-[#111] rounded-lg shadow-2xl border-8 border-[#222] relative overflow-hidden group">
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                  {Array.from({ length: 64 }).map((_, i) => {
                     const isLight = (Math.floor(i / 8) + i) % 2 === 0;
                     return (
                        <div key={i} className={`${isLight ? 'bg-[#525252]' : 'bg-[#262626]'} relative`}>
                        </div>
                     );
                  })}
                </div>
                {/* Decorative Pieces */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[10rem] md:text-[15rem] text-white drop-shadow-2xl filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] animate-float">
                        ♛
                    </span>
                </div>
             </div>
        </div>
      </div>

      {/* Right Panel - CTA */}
      <div className="w-full md:w-1/2 lg:w-[40%] flex flex-col justify-center items-center p-8 md:p-16 relative z-10 bg-black border-l border-white/10">
        <div className="max-w-md w-full space-y-12">
            <div className="text-center md:text-left space-y-6">
                <div className="inline-flex items-center gap-2 mb-4 bg-white/10 px-4 py-1 rounded-full border border-white/10">
                   <span className="text-xl">♔</span>
                   <span className="text-sm font-bold uppercase tracking-widest text-neutral-300">Chess Online</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1]">
                    PLAY <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">
                        CHESS
                    </span>
                </h1>
                <p className="text-xl text-neutral-400 font-light leading-relaxed">
                    Play with millions of players around the world. Free. Unlimited. Real-time.
                </p>
            </div>

            <div className="space-y-4">
                <button
                    onClick={() => router.push("/game")}
                    className="w-full bg-white text-black text-xl font-bold py-6 rounded-lg uppercase tracking-widest hover:bg-neutral-200 transition-all transform hover:-translate-y-1 shadow-[0_4px_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 group"
                >
                    <span>Play Online</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
                
                <button
                    className="w-full bg-transparent border-2 border-neutral-800 text-neutral-400 text-lg font-bold py-4 rounded-lg uppercase tracking-widest hover:border-white hover:text-white transition-all"
                >
                    Play Computer
                </button>
            </div>

            <div className="pt-12 border-t border-white/10 grid grid-cols-3 gap-6 text-center">
                <div>
                   <div className="text-3xl font-black mb-1">10M+</div>
                   <div className="text-xs text-neutral-500 uppercase tracking-widest">Games</div>
                </div>
                <div>
                   <div className="text-3xl font-black mb-1">0ms</div>
                   <div className="text-xs text-neutral-500 uppercase tracking-widest">Latency</div>
                </div>
                 <div>
                   <div className="text-3xl font-black mb-1">24/7</div>
                   <div className="text-xs text-neutral-500 uppercase tracking-widest">Support</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
