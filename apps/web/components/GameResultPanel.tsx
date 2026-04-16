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
      <div
        className={`flex flex-col h-full transition-opacity duration-300 ${entered ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Result area — takes remaining space, centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-6 gap-5">

          {/* Icon */}
          <div className="result-icon-pop relative">
            {youWon && (
              <div className="relative">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className="particle absolute w-1 h-1 rounded-full bg-[#769656]"
                    style={{
                      left: `${10 + i * 12}px`,
                      bottom: '100%',
                      animationDelay: `${0.6 + i * 0.08}s`,
                      opacity: 0,
                    }}
                  />
                ))}
                <svg viewBox="0 0 56 56" className="w-20 h-20" fill="none">
                  <circle cx="28" cy="28" r="27" fill="#1a2216" />
                  <circle cx="28" cy="28" r="27" stroke="#769656" strokeWidth="1.5" strokeOpacity="0.6" />
                  <polygon
                    points="28,10 32.5,21.5 45,21.5 35.5,29 39,40.5 28,33 17,40.5 20.5,29 11,21.5 23.5,21.5"
                    fill="#769656"
                    stroke="#8fb870"
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
            <div className="move-badge-pop flex items-center gap-2 px-3 py-2 rounded-lg bg-[#262421] border border-[#3d3a37]">
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
                  myRatingChange >= 0 ? 'text-[#769656]' : 'text-red-400'
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
          className="result-enter flex-shrink-0 border-t border-[#3d3a37] p-4 space-y-2.5"
          style={{ animationDelay: '0.2s' }}
        >
          <button
            onClick={onPlayAgain}
            className="w-full py-3 rounded-xl bg-[#769656] hover:bg-[#8fb870] text-white text-sm font-bold transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={() => router.push('/game')}
            className="w-full py-2.5 rounded-xl bg-transparent border border-[#3d3a37] hover:bg-white/5 text-slate-400 hover:text-slate-200 text-sm font-semibold transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </>
  );
}
