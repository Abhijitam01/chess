'use client';

import { useState } from 'react';

type LobbyMode = 'menu' | 'creating' | 'waiting' | 'joining' | 'error';

interface LobbyModalProps {
  show: boolean;
  mode: LobbyMode;
  lobbyCode: string | null;
  lobbyError: string | null;
  onClose: () => void;
  onCreateLobby: () => void;
  onJoinLobby: (code: string) => void;
}

export function LobbyModal({
  show,
  mode,
  lobbyCode,
  lobbyError,
  onClose,
  onCreateLobby,
  onJoinLobby,
}: LobbyModalProps) {
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);

  if (!show) return null;

  const handleCopy = () => {
    if (!lobbyCode) return;
    navigator.clipboard.writeText(lobbyCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleJoin = () => {
    const code = inputCode.trim().toLowerCase();
    if (code.length === 6) onJoinLobby(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-zinc-100">Challenge a Friend</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {mode === 'menu' && (
          <div className="flex flex-col gap-3">
            <button
              onClick={onCreateLobby}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
            >
              Create Lobby
            </button>
            <div className="flex items-center gap-3 text-zinc-500 text-xs">
              <div className="flex-1 h-px bg-white/10" />
              <span>or join one</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toLowerCase().replace(/[^0-9a-f]/g, '').slice(0, 6))}
                placeholder="6-char code"
                className="flex-1 bg-zinc-800 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-mono tracking-widest"
                maxLength={6}
                onKeyDown={(e) => { if (e.key === 'Enter') handleJoin(); }}
              />
              <button
                onClick={handleJoin}
                disabled={inputCode.length !== 6}
                className="px-4 py-2.5 rounded-xl bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
              >
                Join
              </button>
            </div>
            {lobbyError && (
              <p className="text-center text-sm text-red-400">{lobbyError}</p>
            )}
          </div>
        )}

        {mode === 'creating' && (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
            <p className="text-zinc-400 text-sm">Creating lobby...</p>
          </div>
        )}

        {mode === 'waiting' && lobbyCode && (
          <div className="flex flex-col gap-4">
            <p className="text-zinc-400 text-sm text-center">Share this code with your friend:</p>
            <div className="flex items-center gap-2 bg-zinc-800 rounded-xl p-3 border border-white/10">
              <span className="flex-1 font-mono text-2xl font-bold tracking-[0.3em] text-emerald-400 text-center">
                {lobbyCode}
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-xs font-semibold text-zinc-300 transition-colors shrink-0"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Waiting for opponent...
            </div>
          </div>
        )}

        {mode === 'joining' && (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
            <p className="text-zinc-400 text-sm">Joining lobby...</p>
          </div>
        )}

        {mode === 'error' && (
          <div className="flex flex-col items-center gap-4 py-2">
            <p className="text-red-400 text-sm text-center">{lobbyError ?? 'Lobby not found or expired.'}</p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-semibold text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
