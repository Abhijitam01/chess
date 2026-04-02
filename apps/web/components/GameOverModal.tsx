'use client';

interface GameOverModalProps {
  show: boolean;
  winner: string | null;
  playerColor: 'white' | 'black' | null;
  reason: string;
  whiteRatingChange?: number | null;
  blackRatingChange?: number | null;
  onPlayAgain: () => void;
}

export function GameOverModal({
  show,
  winner,
  playerColor,
  reason,
  whiteRatingChange,
  blackRatingChange,
  onPlayAgain
}: GameOverModalProps) {
  if (!show) return null;

  const getResultText = () => {
    if (winner === null) {
      return {
        title: "Draw!",
        subtitle: `Game drawn by ${reason}`,
        color: 'text-yellow-400',
        emoji: '🤝',
      };
    }

    const youWon = winner === playerColor;
    
    return {
      title: youWon ? "You Won!" : "You Lost",
      subtitle: `${winner} wins by ${reason}`,
      color: youWon ? 'text-green-400' : 'text-red-400',
      emoji: youWon ? '🏆' : '😔',
    };
  };

  const { title, subtitle, color, emoji } = getResultText();

  const myRatingChange = playerColor === 'white' ? whiteRatingChange : blackRatingChange;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1c2333] rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-[#2a3547] animate-scaleIn">
        {/* Emoji */}
        <div className="text-center mb-4">
          <div className="text-7xl mb-4 animate-bounce">
            {emoji}
          </div>
        </div>

        {/* Result */}
        <div className="text-center space-y-2 mb-6">
          <h2 className={`text-4xl font-bold ${color}`}>
            {title}
          </h2>
          <p className="text-slate-400 text-lg">
            {subtitle}
          </p>
        </div>

        {/* Stats */}
        <div className="bg-[#131929] rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Result:</span>
            <span className="text-white font-semibold">{winner ? `${winner} wins` : 'Draw'}</span>
          </div>
          {myRatingChange != null && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Rating change:</span>
              <span className={`font-bold ${myRatingChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {myRatingChange >= 0 ? '+' : ''}{myRatingChange}
              </span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors"
          >
            Play Again
          </button>
          
          <button
            onClick={() => window.location.href = '/game'}
            className="w-full py-3 bg-[#1c2333] hover:bg-[#222d42] border border-[#2a3547] text-white font-semibold rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}