"use client";

import { useWebSocket } from "../../hooks/useWebSocket";
import { useChessGame } from "../../hooks/useChessGame";
import { ChessBoard } from "../../components/ChessBoard";
import { GameControls } from "../../components/GameControls";
import { useRouter } from "next/navigation";
import { INIT_GAME } from '@repo/types';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

export default function Game() {
  const { socket, isConnected, sendMessage } = useWebSocket(WS_URL);
  const { chess, playerColor, status, turn, winner, makeMove, isMyTurn } = useChessGame(socket, isConnected);
  const router = useRouter();

  const handleStartGame = () => {
    sendMessage({ type: INIT_GAME });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
    }}>
      {/* Navigation */}
      <nav style={{ 
        width: '100%', 
        padding: '1.5rem 2rem', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div 
            onClick={() => router.push("/")}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <span style={{ fontSize: '2rem' }}>♔</span>
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: 700, 
              color: '#ffffff',
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Chess Online
            </span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '9999px',
            border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isConnected ? '#10b981' : '#ef4444',
              boxShadow: `0 0 10px ${isConnected ? '#10b981' : '#ef4444'}`
            }} />
            <span style={{ 
              fontSize: '0.875rem', 
              color: isConnected ? '#34d399' : '#f87171',
              fontWeight: 500
            }}>
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        width: '100%'
      }}>
        {/* Game Layout */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start', 
          justifyContent: 'center', 
          gap: '2rem',
          width: '100%'
        }}>
          {/* Chess Board */}
          <div style={{ 
            flex: '1 1 500px',
            maxWidth: '650px',
            minWidth: '300px'
          }}>
            <ChessBoard 
              chess={chess} 
              playerColor={playerColor} 
              isMyTurn={isMyTurn} 
              onMove={makeMove} 
            />
          </div>

          {/* Game Controls */}
          <div style={{ 
            flex: '0 0 auto',
            width: '100%',
            maxWidth: '360px'
          }}>
            <GameControls
              isConnected={isConnected}
              playerColor={playerColor}
              status={status}
              turn={turn}
              isMyTurn={isMyTurn}
              winner={winner}
              onStartGame={handleStartGame}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '1.5rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#64748b',
        fontSize: '0.875rem'
      }}>
        Built with ♟️ and ⚡ • Chess Online 2026
      </footer>
    </div>
  );
}
