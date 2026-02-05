import { useState } from "react";

type Square = string;

interface Piece {
  color: "w" | "b";
  type: string;
}

interface Move {
  to: string;
  from: string;
}

interface ChessLike {
  get(square: Square): Piece | null | undefined;
  moves(options: { square: Square; verbose: boolean }): any[];
}

interface ChessBoardProps {
  chess: ChessLike;
  playerColor: "white" | "black" | null;
  isMyTurn: boolean;
  onMove: (from: string, to: string) => boolean;
}

const PIECE_SYMBOLS: { [key: string]: string } = {
  p: "♟",
  n: "♞",
  b: "♝",
  r: "♜",
  q: "♛",
  k: "♚",
};

export function ChessBoard({
  chess,
  playerColor,
  isMyTurn,
  onMove,
}: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"] as const;

  const displayFiles = playerColor === "black" ? [...files].reverse() : files;
  const displayRanks = playerColor === "black" ? [...ranks].reverse() : ranks;

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

    if (
      piece &&
      ((playerColor === "white" && piece.color === "w") ||
        (playerColor === "black" && piece.color === "b"))
    ) {
      setSelectedSquare(square);

      const moves = chess.moves({ square: square as Square, verbose: true });
      setValidMoves(moves.map((m) => m.to));
    }
  };

  const isLightSquare = (fileIndex: number, rankIndex: number): boolean => {
    return (fileIndex + rankIndex) % 2 === 0;
  };

  const getSquareClasses = (
    square: string,
    isLight: boolean,
    isSelected: boolean,
    isValidMove: boolean,
    piece: Piece | null | undefined
  ): string => {
    let classes = "aspect-square flex items-center justify-center cursor-pointer relative transition-colors duration-150";
    
    // Base color with hover
    if (isSelected) {
      classes += " bg-accent-gold shadow-[inset_0_0_12px_rgba(0,0,0,0.2)]";
    } else if (isLight) {
      classes += " bg-board-light hover:bg-board-light-hover";
    } else {
      classes += " bg-board-dark hover:bg-board-dark-hover";
    }
    
    // Valid capture indicator
    if (isValidMove && piece) {
      classes += " shadow-[inset_0_0_0_3px_rgba(139,115,85,0.6)]";
    }
    
    return classes;
  };

  return (
    <div className="flex justify-center items-center w-full min-h-[500px] p-4 md:p-8">
      <div 
        className="w-full max-w-2xl shadow-ambient rounded-board overflow-hidden border-4 border-neutral-800 grid grid-rows-8 aspect-square"
      >
        {displayRanks.map((rank, rankIndex) => (
          <div 
            key={rank} 
            className="grid grid-cols-8 w-full h-full"
          >
            {displayFiles.map((file, fileIndex) => {
              const square = `${file}${rank}` as Square;
              const isLight = isLightSquare(fileIndex, rankIndex);
              const isSelected = selectedSquare === square;
              const isValidMove = validMoves.includes(square);
              const piece = chess.get(square);

              return (
                <div
                  key={square}
                  className={getSquareClasses(square, isLight, isSelected, isValidMove, piece)}
                  onClick={() => handleSquareClick(square)}
                >
                  {/* Coordinates */}
                  {fileIndex === 0 && (
                    <span
                      className={`absolute top-0.5 left-1 text-[10px] font-bold ${
                         isLight ? "text-neutral-500" : "text-neutral-400"
                      }`}
                    >
                      {rank}
                    </span>
                  )}
                  {rankIndex === 7 && (
                    <span
                      className={`absolute bottom-0.5 right-1 text-[10px] font-bold ${
                        isLight ? "text-neutral-500" : "text-neutral-400"
                      }`}
                    >
                      {file}
                    </span>
                  )}

                  {/* Valid move indicator dot */}
                  {isValidMove && !piece && (
                    <div className="absolute w-[20%] h-[20%] bg-accent-bronze rounded-full opacity-70" />
                  )}

                  {/* Chess piece */}
                  {piece && (
                    <div
                      className={`
                        text-[clamp(1.5rem,8vw,3rem)] leading-none select-none pointer-events-none
                        transition-transform duration-150
                        ${piece.color === "w" 
                          ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" 
                          : "text-[#1a1a1a] drop-shadow-[0_1px_2px_rgba(255,255,255,0.15)]"
                        }
                        ${isSelected ? "scale-105 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" : ""}
                      `}
                    >
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
