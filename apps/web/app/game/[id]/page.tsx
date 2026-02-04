"use client";

import { ChessBoard } from "@repo/ui";
import { MoveHistory } from "../../../components/MoveHistory";
import { useWebSocket } from "../../../hooks/useWebSocket";
import { useChessGame } from "../../../hooks/useChessGame";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080";

export default function GamePage() {
  const { socket, isConnected, sendMessage } = useWebSocket(WS_URL);
  const { chess, playerColor, status, turn, winner, makeMove, isMyTurn, moveHistory } =
    useChessGame(socket, isConnected);

  const handleStartGame = () => {
    sendMessage({ type: "init_game" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <nav className="w-full p-6 border-b border-white/10 bg-neutral-900/50 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">♔</span>
            <span className="text-lg font-bold tracking-widest uppercase">Chess Online</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-16">
        <div className="order-2 lg:order-1 flex-shrink-0">
          <ChessBoard
            chess={chess}
            playerColor={playerColor}
            isMyTurn={isMyTurn}
            onMove={makeMove}
          />
        </div>

        <div className="w-full max-w-sm order-1 lg:order-2 space-y-6 flex flex-col h-[600px]">
          <div className="bg-neutral-900/50 p-6 rounded-lg border border-white/5 space-y-6">
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-neutral-400 uppercase text-xs tracking-widest font-semibold">Game Status</span>
                   <span className={`badge ${status === 'playing' ? 'badge-playing' : status === 'waiting' ? 'badge-waiting' : 'badge-finished'}`}>
                      {status.toUpperCase()}
                   </span>
                </div>
                
                <div className="flex justify-between items-center">
                   <span className="text-neutral-400 uppercase text-xs tracking-widest font-semibold">Turn</span>
                   <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${turn === 'w' ? 'bg-white' : 'bg-neutral-600'} border border-white/20`}></div>
                      <span className="font-mono">{turn === "w" ? "White" : "Black"}</span>
                   </div>
                </div>

                {winner && (
                   <div className="p-4 bg-white text-black font-bold text-center uppercase tracking-widest rounded-sm animate-pulse-glow">
                      Winner: {winner === "w" ? "White" : "Black"}
                   </div>
                )}
             </div>

             <button
               className="w-full bg-white text-black py-4 font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.1)]"
               onClick={handleStartGame}
               disabled={!isConnected || status === "playing"}
             >
               {isConnected ? (status === 'playing' ? "Game in Progress" : "Start Game") : "Connecting..."}
             </button>
             
             <div className="text-xs text-neutral-600 text-center font-mono">
                {isConnected ? "● Connected to server" : "○ Disconnected"}
             </div>
          </div>
          
          <div className="flex-1 overflow-hidden min-h-0">
             <MoveHistory moves={moveHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}
