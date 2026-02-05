"use client";
import { useState, useEffect } from 'react';
import type { Chess, Square } from '@chess/chess-engine';

// Move type from chess.js - only the fields we use
interface Move {
    from: string;
    to: string;
}
interface ChessBoardProps {
    chess: Chess;
    playerColor: 'white' | 'black' | null;
    isMyTurn: boolean;
    onMove: (from: string, to: string) => boolean;
}

const PIECE_SYMBOLS: { [key: string]: string } = {
    'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚',
};

export function ChessBoard({ chess, playerColor, isMyTurn, onMove }: ChessBoardProps) {
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [validMoves, setValidMoves] = useState<string[]>([]);
    const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    const displayFiles = playerColor === 'black' ? [...files].reverse() : files;
    const displayRanks = playerColor === 'black' ? [...ranks].reverse() : ranks;

    // Track last move from game history
    useEffect(() => {
        const history = chess.history({ verbose: true }) as Move[];
        if (history.length > 0) {
            const last = history[history.length - 1]!;
            setLastMove({ from: last.from, to: last.to });
        }
    }, [chess]);

    const handleSquareClick = (square: string) => {
        if (!isMyTurn) return;

        const piece = chess.get(square as Square);
        const yourColor = playerColor === 'white' ? 'w' : 'b';

        // Case 1: No piece selected - select if it's your piece
        if (!selectedSquare && piece && piece.color === yourColor) {
            setSelectedSquare(square);
            const moves = chess.moves({ square: square as Square, verbose: true });
            setValidMoves(moves.map(m => m.to));
            return;
        }
        
        // Case 2: Click same square - deselect
        if (selectedSquare === square) {
            setSelectedSquare(null);
            setValidMoves([]);
            return;
        }

        // Case 3: Click another piece of yours - reselect
        if (piece && piece.color === yourColor) {
            setSelectedSquare(square);
            const moves = chess.moves({ square: square as Square, verbose: true });
            setValidMoves(moves.map(m => m.to));
            return;
        }
        
        // Case 4: Click valid move - make the move
        if (validMoves.includes(square)) {
            const success = onMove(selectedSquare as string, square);
            if (success) {
                setLastMove({ from: selectedSquare as string, to: square });
                setSelectedSquare(null);
                setValidMoves([]);
            }
            return;
        }

        // Case 5: Click invalid square - cancel selection
        setSelectedSquare(null);
        setValidMoves([]);
    };

    const isLightSquare = (fileIndex: number, rankIndex: number): boolean => {
        return (fileIndex + rankIndex) % 2 === 0;
    };

    const getSquareClasses = (
        square: string, 
        isLight: boolean, 
        piece: { color: string; type: string } | null | undefined
    ): string => {
        const isSelected = selectedSquare === square;
        const isValidMove = validMoves.includes(square);
        const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);
        
        let classes = 'aspect-square flex items-center justify-center cursor-pointer relative transition-all duration-150';
        
        // Base color
        if (isSelected) {
            classes += ' bg-accent-gold'; // Warm gold for selection
        } else if (isLastMoveSquare) {
            classes += isLight 
                ? ' bg-board-light-hover' // Slightly warmer maple for last move
                : ' bg-board-dark-hover'; // Slightly lighter walnut for last move
        } else {
            classes += isLight 
                ? ' bg-board-light hover:bg-board-light-hover' // Maple
                : ' bg-board-dark hover:bg-board-dark-hover'; // Walnut
        }
        
        // Valid move indicators
        if (isValidMove && piece) {
            classes += ' shadow-[inset_0_0_0_3px_rgba(139,115,85,0.6)]'; // Bronze ring for captures
        }
        
        return classes;
    };

    return (
        <div className="flex justify-center items-center p-2">
            {/* Board container with ambient shadow */}
            <div className="w-full max-w-[560px] aspect-square rounded-board overflow-hidden shadow-ambient border border-white/[0.06]">
                <div className="grid grid-rows-8 w-full h-full">
                    {displayRanks.map((rank, rankIndex) => (
                        <div key={rank} className="grid grid-cols-8">
                            {displayFiles.map((file, fileIndex) => {
                                const square = `${file}${rank}`;
                                const isLight = isLightSquare(fileIndex, rankIndex);
                                const piece = chess.get(square as Square);
                                const isValidMove = validMoves.includes(square);

                                return (
                                    <div
                                        key={square}
                                        onClick={() => handleSquareClick(square)}
                                        className={getSquareClasses(square, isLight, piece)}
                                    >
                                        {/* Rank label (left side) */}
                                        {fileIndex === 0 && (
                                            <span className={`
                                                absolute top-0.5 left-1 text-[9px] font-semibold pointer-events-none select-none
                                                ${isLight ? 'text-board-dark/60' : 'text-board-light/50'}
                                            `}>
                                                {rank}
                                            </span>
                                        )}
                                        
                                        {/* File label (bottom) */}
                                        {rankIndex === 7 && (
                                            <span className={`
                                                absolute bottom-0.5 right-1 text-[9px] font-semibold pointer-events-none select-none
                                                ${isLight ? 'text-board-dark/60' : 'text-board-light/50'}
                                            `}>
                                                {file}
                                            </span>
                                        )}

                                        {/* Valid move indicator - small muted dot for empty squares */}
                                        {isValidMove && !piece && (
                                            <div className="absolute w-[18%] h-[18%] bg-accent-bronze rounded-full opacity-60" />
                                        )}

                                        {/* Chess piece */}
                                        {piece && (
                                            <div className={`
                                                text-[clamp(24px,7vw,44px)] leading-none select-none pointer-events-none
                                                transition-all duration-150 ease-out
                                                ${piece.color === 'w' 
                                                    ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]' 
                                                    : 'text-[#1a1a1a] drop-shadow-[0_1px_2px_rgba(255,255,255,0.12)]'
                                                }
                                                ${selectedSquare === square 
                                                    ? 'scale-105 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]' 
                                                    : 'hover:scale-[1.02]'
                                                }
                                            `}>
                                                {PIECE_SYMBOLS[piece.type.toLowerCase()]}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}