"use client";

import { memo } from 'react';

interface GameControlsProps {
    playerColor: 'white' | 'black' | null;
    status: 'waiting' | 'playing' | 'finished';
    matchMakingStatus?: 'idle' | 'finding' | 'found' | 'playing' | 'finished';
    turn: 'w' | 'b';
    isMyTurn: boolean;
    onResign: () => void;
    onCancelSearch?: () => void;
    winner?: string | null;
    reason?: string | null;
    showMatchStartAnimation?: boolean;
    onPlayAgain?: () => void;
    isConnected?: boolean;
    onStartGame?: () => void;
    onOfferDraw?: () => void;
    onAcceptDraw?: () => void;
    onDeclineDraw?: () => void;
    drawOfferPending?: boolean;
    drawOfferFromOpponent?: boolean;
}

export const GameControls = memo(function GameControls({
    playerColor,
    status,
    turn,
    isMyTurn,
    onResign,
    onCancelSearch,
    winner,
    reason,
    showMatchStartAnimation,
    onPlayAgain,
    onOfferDraw,
    onAcceptDraw,
    onDeclineDraw,
    drawOfferPending = false,
    drawOfferFromOpponent = false,
}: GameControlsProps) {
    
    const getStatusBadge = () => {
        const baseClasses = "px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider";
        
        if (showMatchStartAnimation) {
             return (
                <span className={`${baseClasses} bg-accent-emerald/20 text-accent-emerald animate-pulse`}>
                    Starting
                </span>
            );
        }

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
                <div className="bg-background/60 p-4 rounded-lg text-center border border-white/5">
                    <div className="text-sm font-medium text-text-secondary">
                        {showMatchStartAnimation && (
                            <div className="flex flex-col gap-1">
                                <span className="text-accent-emerald font-bold text-base">Match Starting!</span>
                                <span>You are playing as {playerColor}</span>
                            </div>
                        )}
                        {!showMatchStartAnimation && status === 'waiting' && (
                            <div className="flex flex-col items-center gap-3">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <span className="inline-flex gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0ms]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:150ms]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:300ms]" />
                                    </span>
                                    <span className="text-xs font-medium">Searching for opponent</span>
                                </div>
                                {onCancelSearch && (
                                    <button
                                        onClick={onCancelSearch}
                                        className="px-4 py-1.5 rounded-lg border border-zinc-700 text-xs font-semibold text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 transition-colors"
                                    >
                                        Cancel Search
                                    </button>
                                )}
                            </div>
                        )}
                        {!showMatchStartAnimation && status === 'playing' && (isMyTurn ? "Your turn to move" : "Waiting for opponent")}
                        {!showMatchStartAnimation && status === 'finished' && (
                            <div className="flex flex-col gap-2">
                                <div className="text-base font-bold">
                                    {winner ? (
                                        <span className={winner === playerColor ? "text-accent-emerald" : "text-accent-danger"}>
                                            {winner === playerColor ? "You Won!" : "You Lost"}
                                        </span>
                                    ) : (
                                        <span className="text-text-secondary">Draw</span>
                                    )}
                                </div>
                                <div className="text-xs text-text-muted">
                                    {reason ? `by ${reason}` : "Game Over"}
                                </div>
                            </div>
                        )}
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

                {/* Draw offer banner */}
                {drawOfferFromOpponent && status === 'playing' && (
                    <div className="bg-accent-primary/10 border border-accent-primary/30 rounded-lg p-3 flex flex-col gap-2">
                        <p className="text-sm font-semibold text-text-primary text-center">Opponent offers a draw</p>
                        <div className="flex gap-2">
                            <button
                                className="btn-primary flex-1 text-xs py-1.5"
                                onClick={onAcceptDraw}
                            >
                                Accept
                            </button>
                            <button
                                className="btn-danger flex-1 text-xs py-1.5"
                                onClick={onDeclineDraw}
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-2 flex flex-col gap-2">
                    {status === 'playing' && (
                        <>
                            <button
                                className="btn-danger w-full text-sm"
                                onClick={onResign}
                            >
                                Resign Game
                            </button>
                            {onOfferDraw && !drawOfferPending && !drawOfferFromOpponent && (
                                <button
                                    className="w-full text-sm px-4 py-2 rounded-lg border border-white/20 text-text-secondary hover:text-text-primary hover:border-white/40 transition-colors"
                                    onClick={onOfferDraw}
                                >
                                    Offer Draw
                                </button>
                            )}
                            {drawOfferPending && (
                                <p className="text-xs text-text-muted text-center">Draw offer sent…</p>
                            )}
                        </>
                    )}

                    {status === 'finished' && onPlayAgain && (
                        <button
                            className="btn-primary w-full text-sm"
                            onClick={onPlayAgain}
                        >
                            Play Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
});
