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
      
      // Hide after 0.5 seconds (very quick)
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-black/40 backdrop-blur-sm px-8 py-4 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-1">
            Match Starting
          </h2>
          <p className="text-gray-200">
            Playing as <span className="font-bold text-accent-emerald capitalize">{playerColor}</span>
          </p>
        </div>
      </div>
    </div>
  );
}