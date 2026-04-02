'use client';

import { useEffect, useState } from 'react';

interface GameOverModalProps {
  show: boolean;
  winner: string | null;
  playerColor: 'white' | 'black' | null;
  reason: string;
  winningMove?: string | null;
  whiteRatingChange?: number | null;
  blackRatingChange?: number | null;
  onPlayAgain: () => void;
}

export function GameOverModal({
  show,
  winner,
  playerColor,
  reason,
  winningMove,
  whiteRatingChange,
  blackRatingChange,
  onPlayAgain
}: GameOverModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }
    // Brief delay so players see the final board position first
    const t = setTimeout(() => setVisible(true), 750);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  const getResult = () => {
    if (winner === null) {
      return {
        title: 'Draw',
        subtitle: `Game drawn by ${reason}`,
        titleClass: 'text-yellow-400',
        bgAccent: 'from-yellow-900/30 to-transparent',
        borderColor: 'border-yellow-700/30',
        icon: (
          <svg viewBox="0 0 40 40" className="w-16 h-16" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#eab308" strokeWidth="2" strokeOpacity="0.4" />
            <text x="20" y="27" textAnchor="middle" fontSize="20" fill="#eab308">½</text>
          </svg>
        ),
        shimmer: false,
      };
    }

    const youWon = winner === playerColor;
    if (youWon) {
      return {
        title: 'You Won!',
        subtitle: `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins by ${reason}`,
        titleClass: 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-300',
        bgAccent: 'from-indigo-900/40 to-transparent',
        borderColor: 'border-indigo-600/40',
        icon: (
          <svg viewBox="0 0 40 40" className="w-16 h-16" fill="none">
            <polygon
              points="20,4 24,15 36,15 26.5,22 30,33 20,26 10,33 13.5,22 4,15 16,15"
              fill="#6366f1"
              fillOpacity="0.9"
              stroke="#818cf8"
              strokeWidth="1"
            />
          </svg>
        ),
        shimmer: true,
      };
    }
    return {
      title: 'You Lost',
      subtitle: `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins by ${reason}`,
      titleClass: 'text-slate-400',
      bgAccent: 'from-red-950/30 to-transparent',
      borderColor: 'border-red-900/30',
      icon: (
        <svg viewBox="0 0 40 40" className="w-16 h-16" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.5" />
          <line x1="13" y1="13" x2="27" y2="27" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.7" />
          <line x1="27" y1="13" x2="13" y2="27" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.7" />
        </svg>
      ),
      shimmer: false,
    };
  };

  const result = getResult();
  const myRatingChange = playerColor === 'white' ? whiteRatingChange : blackRatingChange;

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes iconPop {
          0%   { transform: scale(0.4) rotate(-12deg); opacity: 0; }
          70%  { transform: scale(1.15) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #a5b4fc 0%, #ffffff 40%, #a5b4fc 60%, #818cf8 100%);
          background-size: 200% auto;
          animation: shimmer 2.4s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .modal-enter { animation: modalIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .overlay-enter { animation: overlayIn 0.25s ease forwards; }
        .icon-pop { animation: iconPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both; }
      `}</style>

      {/* Overlay */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

        {/* Modal */}
        {visible && (
          <div className={`modal-enter relative bg-[#161e2e] rounded-2xl max-w-sm w-full mx-4 shadow-2xl border ${result.borderColor} overflow-hidden`}>

            {/* Accent gradient top */}
            <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${result.bgAccent} pointer-events-none`} />

            <div className="relative p-8">
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div className="icon-pop">
                  {result.icon}
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-1">
                <h2 className={`text-4xl font-black tracking-tight ${result.shimmer ? 'shimmer-text' : result.titleClass}`}>
                  {result.title}
                </h2>
              </div>

              {/* Subtitle */}
              <p className="text-center text-slate-500 text-sm mb-5">
                {result.subtitle}
              </p>

              {/* Winning move badge */}
              {winningMove && (
                <div className="flex justify-center mb-5">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0d1117] border border-[#2a3547]">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Final move</span>
                    <span className="text-sm font-mono font-bold text-slate-200">{winningMove}</span>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="bg-[#0d1117] rounded-xl p-4 mb-5 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Result</span>
                  <span className="text-slate-200 font-semibold">
                    {winner ? `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins` : 'Draw'}
                  </span>
                </div>
                {myRatingChange != null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Rating</span>
                    <span className={`font-bold ${myRatingChange >= 0 ? 'text-indigo-400' : 'text-red-400'}`}>
                      {myRatingChange >= 0 ? '+' : ''}{myRatingChange}
                    </span>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={onPlayAgain}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors text-sm"
                >
                  Play Again
                </button>
                <button
                  onClick={() => window.location.href = '/game'}
                  className="w-full py-2.5 bg-transparent hover:bg-white/5 border border-[#2a3547] text-slate-400 hover:text-slate-200 font-semibold rounded-xl transition-colors text-sm"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
