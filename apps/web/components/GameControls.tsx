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
    
    const getBadgeClasses = (): string => {
        const baseClasses = "px-2.5 py-1 rounded text-[0.6875rem] font-semibold uppercase tracking-wider";
        
        if (status === 'waiting') {
            return `${baseClasses} bg-accent-gold/[0.12] text-accent-gold`;
        } else if (status === 'playing') {
            return `${baseClasses} bg-text-secondary/[0.12] text-text-secondary`;
        }
        return `${baseClasses} bg-text-muted/[0.12] text-text-muted`;
    };

    return (
        <div className="bg-background-card border border-white/[0.08] p-5 rounded-xl flex flex-col gap-5 w-full max-w-[360px] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.05]">
                <h2 className="text-[0.9375rem] font-semibold text-text-primary tracking-[0.01em]">
                    Game Status
                </h2>
                <div className={getBadgeClasses()}>
                    {status === 'waiting' && 'Waiting'}
                    {status === 'playing' && 'In Game'}
                    {status === 'finished' && 'Ended'}
                </div>
            </div>

            {/* Status Box */}
            <div className="bg-black/25 p-4 rounded-lg text-center border border-white/[0.03]">
                <div className="text-sm font-medium text-text-secondary">
                    {status === 'waiting' && "Waiting for opponent..."}
                    {status === 'playing' && (!isMyTurn ? "Opponent's turn" : "Your turn")}
                    {status === 'finished' && "Game complete"}
                </div>
            </div>

            {/* Player Color Badge */}
            {playerColor && (
                <div className="flex items-center gap-3 bg-black/25 p-3.5 rounded-lg border border-white/[0.03]">
                    <div className={`
                        w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-[0_2px_4px_rgba(0,0,0,0.2)]
                        ${playerColor === 'white' 
                            ? 'bg-text-primary text-[#1a1a1a]' 
                            : 'bg-[#1a1a1a] text-text-primary border border-white/20'
                        }
                    `}>
                        {playerColor === 'white' ? '♔' : '♚'}
                    </div>
                    <div>
                        <div className="text-[0.6875rem] text-text-muted uppercase tracking-widest">Playing as</div>
                        <div className="text-sm font-semibold text-text-primary capitalize">
                            {playerColor}
                        </div>
                    </div>
                </div>
            )}

            {/* Turn Indicators */}
            {status === 'playing' && (
                <div className="grid grid-cols-2 gap-2.5">
                    <div className={`
                        p-2.5 rounded-lg flex flex-col items-center gap-1 transition-all duration-150
                        ${turn === 'w' 
                            ? 'border border-accent-gold/40 bg-accent-gold/[0.08]' 
                            : 'border border-white/[0.05] bg-black/20 opacity-50'
                        }
                    `}>
                        <span className="text-xl">♔</span>
                        <span className={`text-[0.6875rem] font-semibold ${turn === 'w' ? 'text-accent-gold' : 'text-text-dim'}`}>
                            White
                        </span>
                    </div>
                    <div className={`
                        p-2.5 rounded-lg flex flex-col items-center gap-1 transition-all duration-150
                        ${turn === 'b' 
                            ? 'border border-accent-gold/40 bg-accent-gold/[0.08]' 
                            : 'border border-white/[0.05] bg-black/20 opacity-50'
                        }
                    `}>
                        <span className="text-xl">♚</span>
                        <span className={`text-[0.6875rem] font-semibold ${turn === 'b' ? 'text-accent-gold' : 'text-text-dim'}`}>
                            Black
                        </span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-1">
                {status === 'waiting' && (
                    <button 
                        className={`
                            w-full bg-gradient-to-b from-[#4a4a4a] to-[#3a3a3a] text-text-primary font-semibold
                            py-3.5 px-6 rounded-lg border border-white/10 text-[0.9375rem] tracking-[0.01em]
                            shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-150
                            hover:from-[#555555] hover:to-[#444444] hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)]
                            active:translate-y-px active:shadow-[0_1px_4px_rgba(0,0,0,0.3)]
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                        onClick={onStartGame}
                        disabled={!isConnected}
                    >
                        Start Game
                    </button>
                )}

                {status === 'playing' && (
                    <button 
                        className="
                            w-full bg-transparent text-text-secondary font-semibold py-3.5 px-6 rounded-lg
                            border border-white/[0.08] text-[0.9375rem] transition-all duration-150
                            hover:border-white/15 hover:text-text-primary hover:bg-white/[0.03]
                            active:translate-y-px
                        "
                        onClick={onResign}
                    >
                        Resign
                    </button>
                )}

                {status === 'finished' && (
                    <div className="flex flex-col gap-2.5">
                        <div className="text-center p-5 bg-black/30 rounded-lg border border-accent-gold/20">
                            <div className="text-3xl mb-1.5">♔</div>
                            <h3 className="text-base font-semibold text-accent-gold capitalize tracking-[0.01em]">
                                {winner} wins
                            </h3>
                        </div>
                        <button 
                            className="
                                w-full bg-transparent text-text-secondary font-semibold py-3.5 px-6 rounded-lg
                                border border-white/[0.08] text-[0.9375rem] transition-all duration-150
                                hover:border-white/15 hover:text-text-primary hover:bg-white/[0.03]
                                active:translate-y-px
                            "
                            onClick={() => window.location.reload()}
                        >
                            Play Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
