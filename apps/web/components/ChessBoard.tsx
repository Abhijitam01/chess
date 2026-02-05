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
        
        let classes = 'aspect-square flex items-center justify-center cursor-pointer relative square-transition';
        
        // Base color - chess.com inspired colors
        if (isSelected) {
            classes += ' bg-[#f7ec5e]'; // Bright yellow for selection
        } else if (isLastMoveSquare) {
            classes += isLight 
                ? ' bg-move-highlight-light' // Yellow tint for last move on light
                : ' bg-move-highlight-dark'; // Yellow tint for last move on dark
        } else {
            classes += isLight 
                ? ' bg-board-light hover:bg-board-light-hover' // Light wood
                : ' bg-board-dark hover:bg-board-dark-hover'; // Dark wood
        }
        
        // Valid move indicators - ring for captures
        if (isValidMove && piece) {
            classes += ' shadow-[inset_0_0_0_3px_rgba(0,0,0,0.4)]'; // Dark ring for captures
        }
        
        return classes;
    };

    return (
        <div className="flex justify-center items-center w-full">
            {/* Board container with premium shadow */}
            <div className="w-full max-w-[640px] aspect-square rounded-[6px] overflow-hidden shadow-ambient border border-black/20">
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
                                                absolute top-[3px] left-[5px] text-[11px] font-bold pointer-events-none select-none
                                                ${isLight ? 'text-board-dark' : 'text-board-light'}
                                            `}>
                                                {rank}
                                            </span>
                                        )}
                                        
                                        {/* File label (bottom) */}
                                        {rankIndex === 7 && (
                                            <span className={`
                                                absolute bottom-[2px] right-[5px] text-[11px] font-bold pointer-events-none select-none
                                                ${isLight ? 'text-board-dark' : 'text-board-light'}
                                            `}>
                                                {file}
                                            </span>
                                        )}

                                        {/* Valid move indicator - centered dot for empty squares */}
                                        {isValidMove && !piece && (
                                            <div className="absolute w-[28%] h-[28%] bg-black/20 rounded-full" />
                                        )}

                                        {/* Chess piece */}
                                        {piece && (
                                            <div className={`
                                                text-[clamp(32px,8vw,52px)] leading-none select-none pointer-events-none
                                                piece-transition
                                                ${piece.color === 'w' 
                                                    ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]' 
                                                    : 'text-[#1a1a1a] drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]'
                                                }
                                                ${selectedSquare === square 
                                                    ? 'scale-110' 
                                                    : 'hover:scale-105'
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