"use client";

interface GameControlsProps {
    isConnected: boolean;
    playerColor: 'white' | 'black' | null;
    status: 'waiting' | 'playing' | 'finished';
    turn: 'w' | 'b';
    isMyTurn: boolean;
    winner: string | null;
    onStartGame: () => void;
    onResign: () => void;
}

export function GameControls({ 
    isConnected, 
    playerColor, 
    status, 
    turn,
    isMyTurn,
    winner,
    onStartGame,
    onResign
}: GameControlsProps) {
    
    const getStatusBadge = () => {
        const baseClasses = "px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider";
        
        if (status === 'waiting') {
            return (
                <span className={`${baseClasses} bg-status-warning/20 text-status-warning`}>
                    Waiting
                </span>
            );
        } else if (status === 'playing') {
            return (
                <span className={`${baseClasses} bg-accent-primary/20 text-accent-primary animate-pulse-glow`}>
                    Live
                </span>
            );
        }
        return (
            <span className={`${baseClasses} bg-text-muted/20 text-text-muted`}>
                Ended
            </span>
        );
    };

    return (
        <div className="card flex flex-col gap-4 w-full">
            {/* Header */}
            <div className="card-header flex items-center justify-between">
                <h2 className="text-base font-bold text-text-primary">
                    Game Status
                </h2>
                {getStatusBadge()}
            </div>

            <div className="card-body flex flex-col gap-4">
                {/* Status Message */}
                <div className="bg-background/60 p-4 rounded-lg text-center border border-white/[0.04]">
                    <div className="text-sm font-medium text-text-secondary">
                        {status === 'waiting' && "Finding an opponent..."}
                        {status === 'playing' && (isMyTurn ? "Your turn to move" : "Waiting for opponent")}
                        {status === 'finished' && "Game complete"}
                    </div>
                </div>

                {/* Player Cards */}
                <div className="flex flex-col gap-2">
                    {/* Black Player */}
                    <div className={`
                        flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                        ${turn === 'b' && status === 'playing' 
                            ? 'bg-accent-primary/10 border border-accent-primary/30' 
                            : 'bg-background/40 border border-transparent'
                        }
                    `}>
                        <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-xl border border-white/20 shadow-md">
                            ♚
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-text-primary flex items-center gap-2">
                                Black
                                {playerColor === 'black' && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-accent-primary/20 text-accent-primary rounded font-bold">
                                        YOU
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-text-muted">Player</div>
                        </div>
                        {turn === 'b' && status === 'playing' && (
                            <div className="w-2.5 h-2.5 rounded-full bg-accent-primary animate-pulse" />
                        )}
                    </div>

                    {/* White Player */}
                    <div className={`
                        flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                        ${turn === 'w' && status === 'playing' 
                            ? 'bg-accent-primary/10 border border-accent-primary/30' 
                            : 'bg-background/40 border border-transparent'
                        }
                    `}>
                        <div className="w-10 h-10 rounded-full bg-text-primary flex items-center justify-center text-xl text-[#1a1a1a] shadow-md">
                            ♔
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-text-primary flex items-center gap-2">
                                White
                                {playerColor === 'white' && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-accent-primary/20 text-accent-primary rounded font-bold">
                                        YOU
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-text-muted">Player</div>
                        </div>
                        {turn === 'w' && status === 'playing' && (
                            <div className="w-2.5 h-2.5 rounded-full bg-accent-primary animate-pulse" />
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-2">
                    {status === 'waiting' && (
                        <button 
                            className="btn-primary w-full text-sm"
                            onClick={onStartGame}
                            disabled={!isConnected}
                        >
                            {isConnected ? 'Find Opponent' : 'Connecting...'}
                        </button>
                    )}

                    {status === 'playing' && (
                        <button 
                            className="btn-danger w-full text-sm"
                            onClick={onResign}
                        >
                            Resign Game
                        </button>
                    )}

                    {status === 'finished' && (
                        <div className="flex flex-col gap-3">
                            <div className="text-center p-4 bg-background/60 rounded-lg border border-accent-gold/20">
                                <div className="text-3xl mb-2">
                                    {winner === 'white' ? '♔' : '♚'}
                                </div>
                                <h3 className="text-lg font-bold text-accent-gold capitalize">
                                    {winner} wins!
                                </h3>
                            </div>
                            <button 
                                className="btn-primary w-full text-sm"
                                onClick={() => window.location.reload()}
                            >
                                Play Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
