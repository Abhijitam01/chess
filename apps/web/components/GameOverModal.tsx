'use client';

interface GameOverModalProps {
  show: boolean;
  winner: string | null;
  playerColor: 'white' | 'black' | null;
  reason: string;
  onPlayAgain: () => void;
}

export function GameOverModal({ 
  show, 
  winner, 
  playerColor,
  reason,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-700 animate-scaleIn">
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
          <p className="text-gray-400 text-lg">
            {subtitle}
          </p>
        </div>

        {/* Stats (placeholder for future rating changes) */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Result:</span>
            <span className="text-white font-semibold">{winner || 'Draw'}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Play Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}