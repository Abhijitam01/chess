interface MoveHistoryProps {
  moves: string[];
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  return (
    <div className="bg-neutral-900/50 p-6 rounded-lg border border-white/10 h-full flex flex-col">
      <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Move History</h3>
      <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-mono">
          {moves.map((move, index) => {
            if (index % 2 === 0) {
              return (
                <div key={index} className="contents">
                   <div className="text-neutral-500 text-right pr-2 py-1 select-none">
                      {Math.floor(index / 2) + 1}.
                   </div>
                   <div className="flex gap-4 py-1">
                      <span className="text-white bg-white/5 px-2 rounded-sm min-w-12 text-center hover:bg-white/10 cursor-pointer transition-colors block">
                         {move}
                      </span>
                      {moves[index + 1] && (
                        <span className="text-white bg-white/5 px-2 rounded-sm min-w-12 text-center hover:bg-white/10 cursor-pointer transition-colors block">
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
           <div className="text-neutral-600 italic text-center text-xs mt-10">
              No moves made yet
           </div>
        )}
      </div>
    </div>
  );
}