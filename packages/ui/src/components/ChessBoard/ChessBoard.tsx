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

  return (
    <div className="flex justify-center items-center w-full min-h-[500px] p-4 md:p-8">
      {/* Use inline styles for critical layout to prevent stacking issues if Tailwind fails */}
      <div 
        className="chess-board w-full max-w-2xl shadow-2xl rounded-sm overflow-hidden border-4 border-neutral-800"
        style={{
          display: 'grid',
          gridTemplateRows: 'repeat(8, 1fr)',
          aspectRatio: '1/1'
        }}
      >
        {displayRanks.map((rank, rankIndex) => (
          <div 
            key={rank} 
            className="chess-row"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              width: '100%',
              height: '100%'
            }}
          >
            {displayFiles.map((file, fileIndex) => {
              const square = `${file}${rank}` as Square;
              const isLight = isLightSquare(fileIndex, rankIndex);
              const isSelected = selectedSquare === square;
              const isValidMove = validMoves.includes(square);
              const piece = chess.get(square);

              // Use styles defined in globals.css via these classes
              return (
                <div
                  key={square}
                  className={`
                    chess-square
                    ${isLight ? "light" : "dark"}
                    ${isSelected ? "selected" : ""}
                    ${isValidMove ? "valid-move" : ""}
                    ${isValidMove && piece ? "valid-capture" : ""}
                  `}
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

                  {piece && (
                    <div
                      className={`chess-piece ${piece.color === "w" ? "white" : "black"}`}
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
