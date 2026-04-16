interface ChessClockProps {
  whiteTime: number;
  blackTime: number;
  turn: 'w' | 'b';
}

export function ChessClock({ whiteTime, blackTime, turn }: ChessClockProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#302e2b] p-4 rounded-xl border border-[#3d3a37] space-y-3">
      {/* White Time */}
      <div className={`
        flex items-center justify-between p-3 rounded-lg transition-all duration-300
        ${turn === 'w'
          ? 'bg-[#769656]/20 border border-[#769656]/50 shadow-[0_0_15px_rgba(118,150,86,0.2)]'
          : 'bg-[#302e2b] border border-white/5 opacity-60'
        }
      `}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${turn === 'w' ? 'bg-[#769656] animate-pulse' : 'bg-zinc-600'}`} />
          <span className="text-sm font-bold text-zinc-300">White</span>
        </div>
        <div className={`text-2xl font-mono font-black tracking-wider ${turn === 'w' ? 'text-white' : 'text-zinc-500'}`}>
          {formatTime(whiteTime)}
        </div>
      </div>

      {/* Black Time */}
      <div className={`
        flex items-center justify-between p-3 rounded-lg transition-all duration-300
        ${turn === 'b'
          ? 'bg-[#769656]/20 border border-[#769656]/50 shadow-[0_0_15px_rgba(118,150,86,0.2)]'
          : 'bg-[#302e2b] border border-white/5 opacity-60'
        }
      `}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${turn === 'b' ? 'bg-[#769656] animate-pulse' : 'bg-zinc-600'}`} />
          <span className="text-sm font-bold text-zinc-300">Black</span>
        </div>
        <div className={`text-2xl font-mono font-black tracking-wider ${turn === 'b' ? 'text-white' : 'text-zinc-500'}`}>
          {formatTime(blackTime)}
        </div>
      </div>
    </div>
  );
}