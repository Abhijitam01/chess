"use client";

import Image from 'next/image';

interface ChessPieceProps {
  type: 'k' | 'q' | 'r' | 'b' | 'n' | 'p';
  color: 'w' | 'b';
  className?: string;
  isSelected?: boolean;
}

const PIECE_NAMES: { [key: string]: string } = {
  'k': 'king',
  'q': 'queen',
  'r': 'rook',
  'b': 'bishop',
  'n': 'knight',
  'p': 'pawn',
};

export function ChessPiece({ type, color, className = '', isSelected = false }: ChessPieceProps) {
  const colorName = color === 'w' ? 'white' : 'black';
  const pieceName = PIECE_NAMES[type];
  const src = `/pieces/${colorName}-${pieceName}.svg`;

  return (
    <div 
      className={`
        relative w-full h-full flex items-center justify-center
        piece-transition select-none pointer-events-none
        ${isSelected ? 'scale-110' : 'group-hover:scale-105'}
        ${className}
      `}
    >
      <Image
        src={src}
        alt={`${colorName} ${pieceName}`}
        width={45}
        height={45}
        className="w-[85%] h-[85%] object-contain drop-shadow-md"
        priority
        draggable={false}
      />
    </div>
  );
}
