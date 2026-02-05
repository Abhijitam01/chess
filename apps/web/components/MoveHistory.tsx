import { useEffect, useRef } from 'react';

interface MoveHistoryProps {
  moves: string[];
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest move
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves]);

  // Group moves into pairs (white, black)
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1] || null,
    });
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
      <div 
        ref={scrollRef}
        className="overflow-y-auto flex-1 pr-1 custom-scrollbar"
      >
        {moves.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-text-muted">
            <span className="text-2xl mb-2 opacity-40">♟</span>
            <span className="text-xs font-medium">No moves yet</span>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {movePairs.map((pair, index) => (
              <div 
                key={pair.number}
                className={`
                  grid grid-cols-[32px_1fr_1fr] gap-1 items-center py-1.5 px-2 rounded
                  ${index === movePairs.length - 1 ? 'bg-accent-primary/10' : 'hover:bg-white/[0.03]'}
                  transition-colors duration-100
                `}
              >
                {/* Move number */}
                <span className="text-text-dim text-xs font-mono tabular-nums text-right pr-1">
                  {pair.number}.
                </span>
                
                {/* White's move */}
                <button className={`
                  font-mono text-[13px] px-2 py-1 rounded text-left
                  transition-all duration-100
                  ${index === movePairs.length - 1 && !pair.black
                    ? 'bg-accent-primary/20 text-accent-primary font-semibold'
                    : 'text-text-primary hover:bg-white/[0.06]'
                  }
                `}>
                  {pair.white}
                </button>
                
                {/* Black's move */}
                {pair.black ? (
                  <button className={`
                    font-mono text-[13px] px-2 py-1 rounded text-left
                    transition-all duration-100
                    ${index === movePairs.length - 1
                      ? 'bg-accent-primary/20 text-accent-primary font-semibold'
                      : 'text-text-primary hover:bg-white/[0.06]'
                    }
                  `}>
                    {pair.black}
                  </button>
                ) : (
                  <span />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}