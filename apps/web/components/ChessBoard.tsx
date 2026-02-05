"use client";
import { useState, useEffect } from 'react';
import type { Chess, Square } from '@chess/chess-engine';
import { ChessPiece } from './ChessPiece';

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


    // Safe hex colors for board - fallback if variables fail
    const colors = {
        light: '#eeeed2',
        dark: '#769656',
        lightHover: '#f5f5e6',
        darkHover: '#86a666',
        selected: '#f7ec5e',
        moveLight: 'rgba(247, 236, 94, 0.8)',
        moveDark: 'rgba(247, 236, 94, 0.6)'
    };

    return (
        <div className="flex justify-center items-center w-full h-full">
            {/* Board container with explicit centering and sizing */}
            <div className="
                w-full h-full
                aspect-square 
                bg-[#2c2c2c]
                border-4 border-[#3c3c3c]
                rounded-sm
                shadow-2xl
                relative
                flex items-center justify-center
            ">
                <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                    {displayRanks.map((rank, rankIndex) => (
                        displayFiles.map((file, fileIndex) => {
                            const square = `${file}${rank}`;
                            const isLight = isLightSquare(fileIndex, rankIndex);
                            const piece = chess.get(square as Square);
                            const isValidMove = validMoves.includes(square);
                            const isSelected = selectedSquare === square;
                            const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);

                            // Inline styles for absolute color safety
                            const bgStyle = isSelected 
                                ? colors.selected
                                : isLastMoveSquare 
                                    ? (isLight ? colors.moveLight : colors.moveDark)
                                    : (isLight ? colors.light : colors.dark);

                            return (
                                <div
                                    key={square}
                                    onClick={() => handleSquareClick(square)}
                                    className={`
                                        relative w-full h-full flex items-center justify-center cursor-pointer
                                        ${isValidMove && piece ? 'shadow-[inset_0_0_0_4px_rgba(0,0,0,0.2)]' : ''}
                                    `}
                                    style={{ backgroundColor: bgStyle }}
                                >
                                    {/* Rank label (left side) */}
                                    {fileIndex === 0 && (
                                        <span className={`
                                            absolute top-0.5 left-1 text-[10px] font-bold pointer-events-none select-none z-10
                                            ${isLight ? 'text-[#769656]' : 'text-[#eeeed2]'}
                                        `}>
                                            {rank}
                                        </span>
                                    )}
                                    
                                    {/* File label (bottom) */}
                                    {rankIndex === 7 && (
                                        <span className={`
                                            absolute bottom-0.5 right-1 text-[10px] font-bold pointer-events-none select-none z-10
                                            ${isLight ? 'text-[#769656]' : 'text-[#eeeed2]'}
                                        `}>
                                            {file}
                                        </span>
                                    )}

                                    {/* Valid move indicator */}
                                    {isValidMove && !piece && (
                                        <div className="absolute w-3 h-3 bg-black/20 rounded-full z-10" />
                                    )}

                                    {/* Chess piece */}
                                    {piece && (
                                        <div className="relative z-20 w-[90%] h-[90%] flex items-center justify-center">
                                            <ChessPiece 
                                                type={piece.type as 'k' | 'q' | 'r' | 'b' | 'n' | 'p'}
                                                color={piece.color}
                                                isSelected={selectedSquare === square}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>
        </div>
    );
}