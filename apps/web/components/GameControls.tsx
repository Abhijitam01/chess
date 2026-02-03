"use client";
interface GameControlsProps {
    isConnected: boolean;
    playerColor: 'white' | 'black' | null;
    status: 'waiting' | 'playing' | 'finished';
    turn: 'w' | 'b';
    isMyTurn: boolean;
    winner: string | null;
    onStartGame: () => void;
}

export function GameControls({ 
    isConnected, 
    playerColor, 
    status, 
    turn,
    isMyTurn,
    winner,
    onStartGame 
}: GameControlsProps) {
    return (
        <div className="bg-slate-800/50 border border-white/10 p-6 rounded-xl flex flex-col gap-6 w-full">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Game Status</h2>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    status === 'waiting' ? 'bg-yellow-500/20 text-yellow-400' : 
                    status === 'playing' ? 'bg-emerald-500/20 text-emerald-400' : 
                    'bg-slate-500/20 text-slate-400'
                }`}>
                    {status === 'waiting' && 'Waiting for Opponent'}
                    {status === 'playing' && 'In Game'}
                    {status === 'finished' && 'Game Over'}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                
                <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-white">
                        {status === 'waiting' && "Waiting for Opponent"}
                        {status === 'playing' && (isMyTurn ? "Your Turn" : "Opponent's Turn")}
                        {status === 'finished' && "Game Over"}
                    </div>
                </div>

                {playerColor && (
                    <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-lg">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${playerColor === 'white' ? 'bg-white text-black' : 'bg-slate-900 text-white border-2 border-slate-600'}`}>
                            {playerColor === 'white' ? '♔' : '♚'}
                        </div>
                        <div>
                            <div className="text-xs text-slate-400">Playing as</div>
                            <div className="text-base font-bold text-white capitalize">{playerColor}</div>
                        </div>
                    </div>
                )}

                {status === 'playing' && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${turn === 'w' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-900/30 opacity-50'}`}>
                            <span className="text-2xl">♔</span>
                            <span className="text-xs font-semibold">White</span>
                        </div>
                        <div className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${turn === 'b' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-900/30 opacity-50'}`}>
                            <span className="text-2xl">♚</span>
                            <span className="text-xs font-semibold">Black</span>
                        </div>
                    </div>
                )}
            </div>

            
            <div className="mt-2">
                {status === 'waiting' && (
                    <button 
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        onClick={onStartGame}
                        disabled={!isConnected}
                    >
                        🎮 Start Game
                    </button>
                )}

                {status === 'finished' && (
                    <div className="space-y-3">
                        <div className="text-center p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-xl border border-emerald-500/30">
                            <div className="text-5xl mb-3">🏆</div>
                            <h3 className="text-2xl font-bold text-emerald-400 capitalize">{winner} Wins!</h3>
                        </div>
                        <button 
                            className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                            onClick={() => window.location.reload()}
                        >
                            🔄 Play Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
