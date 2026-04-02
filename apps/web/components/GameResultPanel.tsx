'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface GameResultPanelProps {
  winner: string | null;
  playerColor: 'white' | 'black' | null;
  reason: string;
  winningMove: string | null;
  myRatingChange: number | null | undefined;
  onPlayAgain: () => void;
}

export function GameResultPanel({
  winner,
  playerColor,
  reason,
  winningMove,
  myRatingChange,
  onPlayAgain,
}: GameResultPanelProps) {
  const router = useRouter();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(t);
  }, []);

  const youWon = winner !== null && winner === playerColor;
  const isDraw = winner === null;

  return (
    <>
      <style>{`
        @keyframes resultSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes resultIconPop {
          0%   { transform: scale(0.5); opacity: 0; }
          65%  { transform: scale(1.18); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmerWin {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes moveBadgePop {
          from { opacity: 0; transform: scale(0.85) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes particleFloat {
          0%   { transform: translateY(0) scale(1); opacity: 0.9; }
          100% { transform: translateY(-48px) scale(0.4); opacity: 0; }
        }
        .result-enter { animation: resultSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .result-icon-pop { animation: resultIconPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both; }
        .win-shimmer-text {
          background: linear-gradient(90deg, #a5b4fc 0%, #e0e7ff 35%, #fff 50%, #e0e7ff 65%, #a5b4fc 100%);
          background-size: 200% auto;
          animation: shimmerWin 2.2s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .move-badge-pop { animation: moveBadgePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.45s both; }
        .particle { animation: particleFloat 1.2s ease-out forwards; }
      `}</style>

      <div
        className={`flex flex-col h-full transition-opacity duration-300 ${entered ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Result area — takes remaining space, centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-6 gap-5">

          {/* Icon */}
          <div className="result-icon-pop relative">
            {youWon && (
              <div className="relative">
                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className="particle absolute w-1 h-1 rounded-full bg-indigo-400"
                    style={{
                      left: `${10 + i * 12}px`,
                      bottom: '100%',
                      animationDelay: `${0.6 + i * 0.08}s`,
                      opacity: 0,
                    }}
                  />
                ))}
                <svg viewBox="0 0 56 56" className="w-20 h-20" fill="none">
                  <circle cx="28" cy="28" r="27" fill="#1e1b4b" />
                  <circle cx="28" cy="28" r="27" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.6" />
                  <polygon
                    points="28,10 32.5,21.5 45,21.5 35.5,29 39,40.5 28,33 17,40.5 20.5,29 11,21.5 23.5,21.5"
                    fill="#6366f1"
                    stroke="#a5b4fc"
                    strokeWidth="0.8"
                  />
                </svg>
              </div>
            )}
            {!youWon && !isDraw && (
              <svg viewBox="0 0 56 56" className="w-20 h-20" fill="none">
                <circle cx="28" cy="28" r="27" fill="#1a0f0f" />
                <circle cx="28" cy="28" r="27" stroke="#7f1d1d" strokeWidth="1.5" strokeOpacity="0.5" />
                <line x1="17" y1="17" x2="39" y2="39" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.7" />
                <line x1="39" y1="17" x2="17" y2="39" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.7" />
              </svg>
            )}
            {isDraw && (
              <svg viewBox="0 0 56 56" className="w-20 h-20" fill="none">
                <circle cx="28" cy="28" r="27" fill="#1a1500" />
                <circle cx="28" cy="28" r="27" stroke="#a16207" strokeWidth="1.5" strokeOpacity="0.5" />
                <text x="28" y="36" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#eab308" fontFamily="serif">½</text>
              </svg>
            )}
          </div>

          {/* Title */}
          <div className="result-enter text-center" style={{ animationDelay: '0.1s' }}>
            <div
              className={`text-3xl font-black tracking-tight ${
                youWon
                  ? 'win-shimmer-text'
                  : isDraw
                  ? 'text-yellow-400'
                  : 'text-slate-500'
              }`}
            >
              {youWon ? 'You Won!' : isDraw ? 'Draw' : 'You Lost'}
            </div>
            <div className="text-xs text-slate-500 mt-1 capitalize">
              {isDraw
                ? `by ${reason}`
                : `${winner} wins by ${reason}`}
            </div>
          </div>

          {/* Final move badge */}
          {winningMove && (
            <div className="move-badge-pop flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0d1117] border border-[#2a3547]">
              <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
                Final move
              </span>
              <span className="text-sm font-mono font-bold text-slate-200 tracking-wide">
                {winningMove}
              </span>
            </div>
          )}

          {/* Rating change */}
          {myRatingChange != null && (
            <div className="result-enter text-center" style={{ animationDelay: '0.3s' }}>
              <div
                className={`text-2xl font-black ${
                  myRatingChange >= 0 ? 'text-indigo-400' : 'text-red-400'
                }`}
              >
                {myRatingChange >= 0 ? '+' : ''}{myRatingChange}
              </div>
              <div className="text-[10px] text-slate-600 uppercase tracking-widest mt-0.5">
                Rating
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          className="result-enter flex-shrink-0 border-t border-[#1a2235] p-4 space-y-2.5"
          style={{ animationDelay: '0.2s' }}
        >
          <button
            onClick={onPlayAgain}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={() => router.push('/game')}
            className="w-full py-2.5 rounded-xl bg-transparent border border-[#2a3547] hover:bg-white/5 text-slate-400 hover:text-slate-200 text-sm font-semibold transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </>
  );
}
