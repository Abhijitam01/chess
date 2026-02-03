"use client";
import { useState } from 'react';
import { Chess, type Square } from 'chess.js';

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
        <div className="flex justify-center items-center">
            <div className="grid grid-rows-8 border-4 border-slate-700 bg-slate-800 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-[650px] aspect-square relative z-10">
                {displayRanks.map((rank, rankIndex) => (
                    <div key={rank} className="grid grid-cols-8">
                        {displayFiles.map((file, fileIndex) => {
                            const square = `${file}${rank}` as Square;
                            const isLight = isLightSquare(fileIndex, rankIndex);
                            const isSelected = selectedSquare === square;
                            const isValidMove = validMoves.includes(square);
                            const piece = chess.get(square);
                            
                            const squareColor = isLight ? 'bg-[#e2e8f0]' : 'bg-[#334155]'; 

                            return (
                                <div
                                    key={square}
                                    className={`
                                        aspect-square flex items-center justify-center cursor-pointer relative transition-all duration-150
                                        ${squareColor}
                                        ${isSelected ? '!bg-emerald-500/80 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]' : ''}
                                        ${isValidMove && !piece ? 'after:content-[""] after:w-3 after:h-3 after:bg-emerald-500/50 after:rounded-full after:absolute' : ''}
                                        ${isValidMove && piece ? 'ring-4 ring-emerald-500/50 ring-inset' : ''}
                                        hover:brightness-110
                                    `}
                                    onClick={() => handleSquareClick(square)}
                                >
                                    {fileIndex === 0 && (
                                        <span className={`absolute top-0.5 left-1 text-[10px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                                            {rank}
                                        </span>
                                    )}
                                    {rankIndex === 7 && (
                                        <span className={`absolute bottom-0.5 right-1 text-[10px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                                            {file}
                                        </span>
                                    )}

                                    {piece && (
                                        <div className={`
                                            text-5xl md:text-7xl select-none pointer-events-none leading-none w-full h-full flex items-center justify-center
                                            ${piece.color === 'w' 
                                                ? 'text-[#f8fafc] drop-shadow-[0_4px_3px_rgba(0,0,0,0.6)]' 
                                                : 'text-[#0f172a] drop-shadow-[0_4px_3px_rgba(255,255,255,0.3)]'}
                                            transition-transform duration-200 hover:scale-110
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
    );
}

