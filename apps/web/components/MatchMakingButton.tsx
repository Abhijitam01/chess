'use client';

interface MatchmakingButtonProps {
  status: 'idle' | 'finding' | 'found' | 'playing' | 'finished';
  onFindOpponent: () => void;
  isConnected: boolean;
}

export function MatchmakingButton({ 
  status, 
  onFindOpponent, 
  isConnected 
}: MatchmakingButtonProps) {
  
  // Don't show button when playing
  if (status === 'playing') {
    return null;
  }

  const getButtonContent = () => {
    switch (status) {
      case 'idle':
        return {
          text: 'Find Opponent',
          color: 'bg-gray-600 hover:bg-gray-700',
          disabled: !isConnected,
        };
      
      case 'finding':
        return {
          text: 'Finding opponent',
          color: 'bg-blue-600',
          disabled: true,
        };
      
      case 'found':
        return {
          text: 'Opponent found!',
          color: 'bg-green-600',
          disabled: true,
        };
      
      default:
        return {
          text: 'Find Opponent',
          color: 'bg-gray-600',
          disabled: true,
        };
    }
  };

  const { text, color, disabled } = getButtonContent();

  return (
    <button
      onClick={onFindOpponent}
      disabled={disabled}
      className={`
        px-8 py-4 rounded-lg text-white font-semibold text-lg
        transition-all duration-300 transform
        ${color}
        ${disabled ? 'cursor-not-allowed opacity-70' : 'hover:scale-105 active:scale-95'}
        ${status === 'finding' ? 'animate-pulse' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        {status === 'finding' && (
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        <span>{text}</span>
        {!isConnected && status === 'idle' && (
          <span className="text-sm text-red-300">(Disconnected)</span>
        )}
      </div>
    </button>
  );
}