'use client';

import { useEffect, useState } from 'react';

interface MatchStartAnimationProps {
  show: boolean;
  playerColor: 'white' | 'black' | null;
  onComplete: () => void;
}

export function MatchStartAnimation({ 
  show, 
  playerColor, 
  onComplete 
}: MatchStartAnimationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      
      // Hide after 2 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="text-center space-y-6 animate-scaleIn">
        {/* Chessboard icon animation */}
        <div className="w-32 h-32 mx-auto grid grid-cols-4 gap-1 rotate-45 animate-spin-slow">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className={`
                ${(Math.floor(i / 4) + i) % 2 === 0 ? 'bg-white' : 'bg-gray-800'}
                rounded-sm
              `}
            />
          ))}
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-white animate-pulse">
            Match Starting
          </h2>
          <p className="text-xl text-gray-300">
            You are playing as{' '}
            <span className={`font-bold ${playerColor === 'white' ? 'text-white' : 'text-gray-400'}`}>
              {playerColor}
            </span>
          </p>
        </div>

        {/* Countdown dots */}
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    </div>
  );
}