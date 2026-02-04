"use client";
import { useState } from 'react';
import type { Chess, Square } from '@chess/chess-engine';

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

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    const displayFiles = playerColor === 'black' ? [...files].reverse() : files;
    const displayRanks = playerColor === 'black' ? [...ranks].reverse() : ranks;

    const handleSquareClick = (square: string) => {
        if (!isMyTurn) return;

        if (selectedSquare) {
            const moved = onMove(selectedSquare, square);
            setSelectedSquare(null);
            setValidMoves([]);
            
            if (!moved && square !== selectedSquare) {
                selectSquare(square);
            }
        } else {
            selectSquare(square);
        }
    };

    const selectSquare = (square: string) => {
        const piece = chess.get(square as Square);
        
        if (piece && 
            ((playerColor === 'white' && piece.color === 'w') ||
             (playerColor === 'black' && piece.color === 'b'))) {
            setSelectedSquare(square);
            
            const moves = chess.moves({ square: square as Square, verbose: true });
            setValidMoves(moves.map(m => m.to));
        }
    };

    const isLightSquare = (fileIndex: number, rankIndex: number): boolean => {
        return (fileIndex + rankIndex) % 2 === 0;
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
            <div style={{
                display: 'grid',
                gridTemplateRows: 'repeat(8, 1fr)',
                width: '100%',
                maxWidth: '600px',
                aspectRatio: '1',
                border: '6px solid #1e293b',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                background: '#0f172a'
            }}>
                {displayRanks.map((rank, rankIndex) => (
                    <div key={rank} style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)' }}>
                        {displayFiles.map((file, fileIndex) => {
                            const square = `${file}${rank}`;
                            const isLight = isLightSquare(fileIndex, rankIndex);
                            const isSelected = selectedSquare === square;
                            const isValidMove = validMoves.includes(square);
                            const piece = chess.get(square as Square);
                            
                            // Determine square background
                            let squareBackground = isLight 
                                ? 'linear-gradient(135deg, #e2e8f0, #cbd5e1)' 
                                : 'linear-gradient(135deg, #475569, #334155)';
                            
                            if (isSelected) {
                                squareBackground = 'linear-gradient(135deg, #10b981, #059669)';
                            }

                            return (
                                <div
                                    key={square}
                                    onClick={() => handleSquareClick(square)}
                                    style={{
                                        aspectRatio: '1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        background: squareBackground,
                                        boxShadow: isSelected ? 'inset 0 0 20px rgba(0,0,0,0.3)' : 
                                                   isValidMove && piece ? 'inset 0 0 0 4px rgba(16, 185, 129, 0.6)' : 'none',
                                        transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.target as HTMLElement).style.filter = 'brightness(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.target as HTMLElement).style.filter = 'brightness(1)';
                                    }}
                                >
                                    {/* Rank label (left side) */}
                                    {fileIndex === 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '2px',
                                            left: '4px',
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            color: isLight ? '#475569' : '#94a3b8',
                                            pointerEvents: 'none'
                                        }}>
                                            {rank}
                                        </span>
                                    )}
                                    
                                    {/* File label (bottom) */}
                                    {rankIndex === 7 && (
                                        <span style={{
                                            position: 'absolute',
                                            bottom: '2px',
                                            right: '4px',
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            color: isLight ? '#475569' : '#94a3b8',
                                            pointerEvents: 'none'
                                        }}>
                                            {file}
                                        </span>
                                    )}

                                    {/* Valid move indicator (empty square) */}
                                    {isValidMove && !piece && (
                                        <div style={{
                                            position: 'absolute',
                                            width: '30%',
                                            height: '30%',
                                            background: 'rgba(16, 185, 129, 0.6)',
                                            borderRadius: '50%'
                                        }} />
                                    )}

                                    {/* Chess piece */}
                                    {piece && (
                                        <div style={{
                                            fontSize: 'clamp(24px, 8vw, 48px)',
                                            lineHeight: 1,
                                            userSelect: 'none',
                                            pointerEvents: 'none',
                                            color: piece.color === 'w' ? '#ffffff' : '#1e293b',
                                            textShadow: piece.color === 'w' 
                                                ? '0 4px 6px rgba(0, 0, 0, 0.5)' 
                                                : '0 2px 4px rgba(255, 255, 255, 0.2)',
                                            transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                                            transition: 'transform 0.2s ease'
                                        }}>
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
    );
}
