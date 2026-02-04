interface MoveHistoryProps {
  moves: string[];
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
    <h3 className="text-white text-lg mb-2">Move History</h3>
    <div className="space-y-1 max-h-96 overflow-y-auto">
      {moves.map((move, index) => (
        <div key={index} className="text-gray-300">
          {Math.floor(index / 2) + 1}. {move}
        </div>
      ))}
    </div>
  </div>
);
}