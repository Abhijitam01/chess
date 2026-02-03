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
      <div className="w-full max-w-2xl aspect-square">
        <div className="grid grid-rows-8 w-full h-full border-[6px] border-slate-900 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
        {displayRanks.map((rank, rankIndex) => (
          <div key={rank} className="grid grid-cols-8">
            {displayFiles.map((file, fileIndex) => {
              const square = `${file}${rank}` as Square;
              const isLight = isLightSquare(fileIndex, rankIndex);
              const isSelected = selectedSquare === square;
              const isValidMove = validMoves.includes(square);
              const piece = chess.get(square);

              const squareColor = isLight ? "bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]" : "bg-gradient-to-br from-[#475569] to-[#334155]";

              return (
                <div
                  key={square}
                  className={`
                    aspect-square flex items-center justify-center cursor-pointer relative transition-all duration-200 ease-in-out
                    ${squareColor}
                    ${isSelected ? "!bg-gradient-to-br !from-emerald-400 !to-emerald-600 shadow-[inset_0_0_30px_rgba(0,0,0,0.3)] scale-[0.98]" : ""}
                    ${
                      isValidMove && !piece
                        ? 'after:content-[""] after:w-4 after:h-4 after:bg-emerald-400/60 after:rounded-full after:absolute after:shadow-lg'
                        : ""
                    }
                    ${isValidMove && piece ? "ring-[5px] ring-emerald-400/70 ring-inset shadow-lg" : ""}
                    hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]
                  `}
                  onClick={() => handleSquareClick(square)}
                >
                  {fileIndex === 0 && (
                    <span
                      className={`absolute top-0.5 left-1 text-[10px] font-bold ${
                        isLight ? "text-slate-600" : "text-slate-400"
                      }`}
                    >
                      {rank}
                    </span>
                  )}
                  {rankIndex === 7 && (
                    <span
                      className={`absolute bottom-0.5 right-1 text-[10px] font-bold ${
                        isLight ? "text-slate-600" : "text-slate-400"
                      }`}
                    >
                      {file}
                    </span>
                  )}

                  {piece && (
                    <div
                      className={`
                        text-5xl md:text-7xl select-none pointer-events-none leading-none w-full h-full flex items-center justify-center
                        ${
                          piece.color === "w"
                            ? "text-white drop-shadow-[0_6px_8px_rgba(0,0,0,0.8)] filter brightness-110"
                            : "text-slate-900 drop-shadow-[0_6px_8px_rgba(255,255,255,0.4)] filter brightness-95"
                        }
                        transition-all duration-200
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
    </div>
  );
}
