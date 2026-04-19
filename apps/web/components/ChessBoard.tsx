"use client";
import { useState, useEffect, useMemo, memo } from 'react';
import type { Chess, Square } from '@chess/chess-engine';
import { Chess as ChessClass } from '@chess/chess-engine';
import { ChessPiece } from './ChessPiece';
import { BOARD_THEMES, type BoardTheme } from '../context/ThemeContext';

// Move type from chess.js - only the fields we use
interface Move {
    from: string;
    to: string;
}
interface ChessBoardProps {
    chess: Chess;
    playerColor: 'white' | 'black' | null;
    isMyTurn: boolean;
    onMove: (from: string, to: string, promotion?: string) => boolean;
    boardTheme?: BoardTheme;
    showCoordinates?: boolean;
    readOnly?: boolean;
    viewingMoveIndex?: number | null;
}

const PROMOTION_PIECES = ['q', 'r', 'b', 'n'] as const;
type PromotionPiece = typeof PROMOTION_PIECES[number];

function isPromotionMove(chess: Chess, from: string, to: string): boolean {
    const piece = chess.get(from as Square);
    if (!piece || piece.type !== 'p') return false;
    return (piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1');
}

export const ChessBoard = memo(function ChessBoard({ chess, playerColor, isMyTurn, onMove, boardTheme = 'classic', showCoordinates = true, readOnly = false, viewingMoveIndex = null }: ChessBoardProps) {
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [validMoves, setValidMoves] = useState<string[]>([]);
    const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
    const [draggedFrom, setDraggedFrom] = useState<string | null>(null);
    const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string } | null>(null);

    // When viewing a past move, reconstruct that board position
    const displayChess = useMemo(() => {
        if (viewingMoveIndex === null) return chess;
        const moves = chess.history();
        const c = new ChessClass();
        for (let i = 0; i <= viewingMoveIndex && i < moves.length; i++) {
            c.move(moves[i]!);
        }
        return c;
    }, [chess, viewingMoveIndex]);

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    const displayFiles = playerColor === 'black' ? [...files].reverse() : files;
    const displayRanks = playerColor === 'black' ? [...ranks].reverse() : ranks;

    // Track last move from game history
    useEffect(() => {
        const history = displayChess.history({ verbose: true }) as Move[];
        if (history.length > 0) {
            const last = history[history.length - 1]!;
            setLastMove({ from: last.from, to: last.to });
        } else {
            setLastMove(null);
        }
    }, [displayChess]);

    const commitMove = (from: string, to: string, promotion?: string) => {
        const success = onMove(from, to, promotion);
        if (success) {
            setLastMove({ from, to });
        }
        setSelectedSquare(null);
        setValidMoves([]);
        return success;
    };

    const handlePromotionSelect = (piece: PromotionPiece) => {
        if (!pendingPromotion) return;
        commitMove(pendingPromotion.from, pendingPromotion.to, piece);
        setPendingPromotion(null);
    };

    const handleSquareClick = (square: string) => {
        if (readOnly || !isMyTurn || pendingPromotion) return;

        const piece = chess.get(square as Square);
        const yourColor = playerColor === 'white' ? 'w' : 'b';

        if (!selectedSquare && piece && piece.color === yourColor) {
            setSelectedSquare(square);
            const moves = chess.moves({ square: square as Square, verbose: true });
            setValidMoves(moves.map(m => m.to));
            return;
        }

        if (selectedSquare === square) {
            setSelectedSquare(null);
            setValidMoves([]);
            return;
        }

        if (piece && piece.color === yourColor) {
            setSelectedSquare(square);
            const moves = chess.moves({ square: square as Square, verbose: true });
            setValidMoves(moves.map(m => m.to));
            return;
        }

        if (validMoves.includes(square)) {
            if (isPromotionMove(chess, selectedSquare as string, square)) {
                setPendingPromotion({ from: selectedSquare as string, to: square });
                return;
            }
            commitMove(selectedSquare as string, square);
            return;
        }

        setSelectedSquare(null);
        setValidMoves([]);
    };

    const handleDragStart = (e: React.DragEvent, square: string) => {
        if (readOnly || !isMyTurn) { e.preventDefault(); return; }
        const piece = chess.get(square as Square);
        const yourColor = playerColor === 'white' ? 'w' : 'b';
        if (!piece || piece.color !== yourColor) { e.preventDefault(); return; }
        setDraggedFrom(square);
        setSelectedSquare(square);
        const moves = chess.moves({ square: square as Square, verbose: true });
        setValidMoves(moves.map(m => m.to));
        e.dataTransfer.effectAllowed = 'move';

        // Show only the piece image as the drag ghost, not the whole square
        const img = e.currentTarget.querySelector('img');
        if (img) {
            e.dataTransfer.setDragImage(img, img.offsetWidth / 2, img.offsetHeight / 2);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, square: string) => {
        e.preventDefault();
        if (!draggedFrom) return;
        if (validMoves.includes(square)) {
            if (isPromotionMove(chess, draggedFrom, square)) {
                setPendingPromotion({ from: draggedFrom, to: square });
                setDraggedFrom(null);
                return;
            }
            commitMove(draggedFrom, square);
        } else {
            setSelectedSquare(null);
            setValidMoves([]);
        }
        setDraggedFrom(null);
    };

    const isLightSquare = (fileIndex: number, rankIndex: number): boolean => {
        return (fileIndex + rankIndex) % 2 === 0;
    };


    const themeColors = BOARD_THEMES[boardTheme];
    const colors = {
        light: themeColors.light,
        dark: themeColors.dark,
        selected: '#f7ec5e',
        moveLight: 'rgba(247, 236, 94, 0.8)',
        moveDark: 'rgba(247, 236, 94, 0.6)'
    };

    const promotionColor = playerColor === 'black' ? 'b' : 'w';

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
                            const piece = displayChess.get(square as Square);
                            const isValidMove = validMoves.includes(square);
                            const isSelected = selectedSquare === square;
                            const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);
                            const yourColor = playerColor === 'white' ? 'w' : 'b';
                            const isDraggable = !readOnly && isMyTurn && !!piece && piece.color === yourColor;

                            const bgStyle = isSelected
                                ? colors.selected
                                : isLastMoveSquare
                                    ? (isLight ? colors.moveLight : colors.moveDark)
                                    : (isLight ? colors.light : colors.dark);

                            return (
                                <div
                                    key={square}
                                    onClick={() => handleSquareClick(square)}
                                    draggable={isDraggable}
                                    onDragStart={(e) => handleDragStart(e, square)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, square)}
                                    className={`
                                        relative w-full h-full flex items-center justify-center cursor-pointer
                                        ${isValidMove && piece ? 'shadow-[inset_0_0_0_4px_rgba(0,0,0,0.2)]' : ''}
                                    `}
                                    style={{ backgroundColor: bgStyle }}
                                >
                                    {/* Rank label (left side) */}
                                    {showCoordinates && fileIndex === 0 && (
                                        <span
                                            className="absolute top-0.5 left-1 text-[10px] font-bold pointer-events-none select-none z-10"
                                            style={{ color: isLight ? colors.dark : colors.light }}
                                        >
                                            {rank}
                                        </span>
                                    )}

                                    {/* File label (bottom) */}
                                    {showCoordinates && rankIndex === 7 && (
                                        <span
                                            className="absolute bottom-0.5 right-1 text-[10px] font-bold pointer-events-none select-none z-10"
                                            style={{ color: isLight ? colors.dark : colors.light }}
                                        >
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

                {/* Promotion modal */}
                {pendingPromotion && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60">
                        <div className="bg-[#2c2c2c] border-2 border-[#555] rounded-lg p-4 flex flex-col items-center gap-3 shadow-2xl">
                            <span className="text-white text-sm font-semibold tracking-wide">Choose promotion piece</span>
                            <div className="flex gap-2">
                                {PROMOTION_PIECES.map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => handlePromotionSelect(p)}
                                        className="w-16 h-16 bg-[#3c3c3c] hover:bg-[#4c4c4c] border border-[#666] hover:border-[#aaa] rounded-md flex items-center justify-center transition-colors cursor-pointer"
                                    >
                                        <ChessPiece
                                            type={p}
                                            color={promotionColor}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});
