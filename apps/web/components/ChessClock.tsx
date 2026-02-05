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
      <div className="bg-gray-800 p-4 rounded-lg space-y-2">
        <div className={`p-2 rounded ${turn === 'w' ? 'bg-blue-600' : 'bg-gray-700'}`}>
          <div className="text-white">White</div>
          <div className="text-2xl font-mono">{formatTime(whiteTime)}</div>
        </div>
        <div className={`p-2 rounded ${turn === 'b' ? 'bg-blue-600' : 'bg-gray-700'}`}>
          <div className="text-white">Black</div>
          <div className="text-2xl font-mono">{formatTime(blackTime)}</div>
        </div>
      </div>
    );
  }