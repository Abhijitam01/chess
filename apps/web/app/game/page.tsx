"use client";

import { useWebSocket } from "../../hooks/useWebSocket";
import { useChessGame } from "../../hooks/useChessGame";
import { ChessBoard } from "../../components/ChessBoard";
import { GameControls } from "../../components/GameControls";
import { MoveHistory } from "../../components/MoveHistory";
import { useRouter } from "next/navigation";
import { INIT_GAME } from '@repo/types';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

export default function Game() {
  const { socket, isConnected, sendMessage } = useWebSocket(WS_URL);
  const { chess, playerColor, status, turn, winner, moveHistory, makeMove, isMyTurn } = useChessGame(socket, isConnected);
  const router = useRouter();

  const handleStartGame = () => {
    sendMessage({ type: INIT_GAME });
  };
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f35 25%, #0f1729 50%, #1a1f35 75%, #0a0e1a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />

      {/* Chess Pattern Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(255, 255, 255, 0.01) 60px, rgba(255, 255, 255, 0.01) 120px)
        `,
        pointerEvents: 'none'
      }} />

      {/* Navigation */}
      <nav style={{ 
        width: '100%', 
        padding: '1.25rem 2rem', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(10, 14, 26, 0.7)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ 
          maxWidth: '1400px', 
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
              gap: '0.75rem', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ 
              fontSize: '2.25rem',
              filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))'
            }}>♔</span>
            <span style={{ 
              fontSize: '1.5rem', 
              fontWeight: 800, 
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>
              Chess Online
            </span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            padding: '0.625rem 1.25rem',
            background: isConnected 
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))' 
              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))',
            borderRadius: '9999px',
            border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            boxShadow: isConnected 
              ? '0 4px 20px rgba(16, 185, 129, 0.1)' 
              : '0 4px 20px rgba(239, 68, 68, 0.1)'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: isConnected ? '#10b981' : '#ef4444',
              boxShadow: `0 0 15px ${isConnected ? '#10b981' : '#ef4444'}`,
              animation: isConnected ? 'pulse 2s ease-in-out infinite' : 'none'
            }} />
            <span style={{ 
              fontSize: '0.875rem', 
              color: isConnected ? '#34d399' : '#f87171',
              fontWeight: 600,
              letterSpacing: '0.02em'
            }}>
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '2.5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Game Layout */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start', 
          justifyContent: 'center', 
          gap: '2.5rem',
          width: '100%'
        }}>
          {/* Chess Board Container */}
          <div style={{ 
            flex: '1 1 600px',
            maxWidth: '700px',
            minWidth: '320px'
          }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.4)',
              borderRadius: '24px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: `
                0 20px 60px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.05) inset,
                0 0 100px rgba(59, 130, 246, 0.05)
              `,
              backdropFilter: 'blur(10px)'
            }}>
              <ChessBoard 
                chess={chess} 
                playerColor={playerColor} 
                isMyTurn={isMyTurn} 
                onMove={makeMove} 
              />
            </div>
          </div>

          {/* Right Sidebar - Game Info */}
          <div style={{ 
            flex: '0 0 auto',
            width: '100%',
            maxWidth: '400px',
            minWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {/* Game Controls Card */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.4)',
              borderRadius: '20px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: `
                0 10px 40px rgba(0, 0, 0, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.05) inset
              `,
              backdropFilter: 'blur(10px)'
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

            {/* Move History Card */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.4)',
              borderRadius: '20px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: `
                0 10px 40px rgba(0, 0, 0, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.05) inset
              `,
              backdropFilter: 'blur(10px)',
              maxHeight: '500px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Move History Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <span style={{ fontSize: '1.5rem' }}>📜</span>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '-0.01em'
                }}>
                  Move History
                </h3>
                {moveHistory && moveHistory.length > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '0.875rem',
                    color: '#64748b',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontWeight: 600
                  }}>
                    {moveHistory.length} {moveHistory.length === 1 ? 'move' : 'moves'}
                  </span>
                )}
              </div>
              
              <MoveHistory moves={moveHistory} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '2rem 1.5rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(10, 14, 26, 0.5)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          alignItems: 'center'
        }}>
          <p style={{
            color: '#64748b',
            fontSize: '0.875rem',
            margin: 0,
            fontWeight: 500
          }}>
            Built with ♟️ and ⚡ • Chess Online 2026
          </p>
          <p style={{
            color: '#475569',
            fontSize: '0.75rem',
            margin: 0
          }}>
            Real-time multiplayer chess experience
          </p>
        </div>
      </footer>

      {/* Global Styles for Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}