interface MoveHistoryProps {
  moves: string[];
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
          {moves.map((move, index) => {
            if (index % 2 === 0) {
              return (
                <div key={index} className="contents">
                  {/* Move number */}
                  <div className="text-[#525252] text-right py-1 select-none font-mono text-xs tabular-nums">
                    {Math.floor(index / 2) + 1}.
                  </div>
                  {/* Moves pair */}
                  <div className="flex gap-2 py-1">
                    <span className="font-mono text-[#f5f5f4] bg-white/[0.03] px-2 py-0.5 rounded text-[13px] min-w-[48px] text-center hover:bg-white/[0.06] cursor-pointer transition-colors duration-100">
                      {move}
                    </span>
                    {moves[index + 1] && (
                      <span className="font-mono text-[#f5f5f4] bg-white/[0.03] px-2 py-0.5 rounded text-[13px] min-w-[48px] text-center hover:bg-white/[0.06] cursor-pointer transition-colors duration-100">
                        {moves[index + 1]}
                      </span>
                    )}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        {moves.length === 0 && (
          <div className="text-[#525252] text-center text-xs mt-8 font-medium">
            No moves yet
          </div>
        )}
      </div>
    </div>
  );
}