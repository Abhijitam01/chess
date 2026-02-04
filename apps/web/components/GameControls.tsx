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
    
    const cardStyle: React.CSSProperties = {
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1.5rem',
        borderRadius: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '360px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    };

    const getBadgeStyle = (): React.CSSProperties => {
        const baseStyle: React.CSSProperties = {
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600
        };
        
        if (status === 'waiting') {
            return { ...baseStyle, background: 'rgba(234, 179, 8, 0.2)', color: '#facc15' };
        } else if (status === 'playing') {
            return { ...baseStyle, background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' };
        }
        return { ...baseStyle, background: 'rgba(100, 116, 139, 0.2)', color: '#94a3b8' };
    };

    const statusBoxStyle: React.CSSProperties = {
        background: 'rgba(15, 23, 42, 0.5)',
        padding: '1rem',
        borderRadius: '0.75rem',
        textAlign: 'center'
    };

    const playerBadgeStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'rgba(15, 23, 42, 0.5)',
        padding: '1rem',
        borderRadius: '0.75rem'
    };

    const playerIconStyle = (color: 'white' | 'black'): React.CSSProperties => ({
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        background: color === 'white' ? '#ffffff' : '#1e293b',
        color: color === 'white' ? '#1e293b' : '#ffffff',
        border: color === 'black' ? '2px solid #475569' : 'none'
    });

    const turnIndicatorStyle = (isActive: boolean): React.CSSProperties => ({
        padding: '0.75rem',
        borderRadius: '0.75rem',
        border: `2px solid ${isActive ? '#10b981' : '#334155'}`,
        background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.3)',
        opacity: isActive ? 1 : 0.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem',
        transition: 'all 0.2s ease'
    });

    const buttonPrimaryStyle: React.CSSProperties = {
        width: '100%',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white',
        fontWeight: 700,
        padding: '1rem 2rem',
        borderRadius: '0.75rem',
        border: 'none',
        cursor: isConnected ? 'pointer' : 'not-allowed',
        opacity: isConnected ? 1 : 0.5,
        fontSize: '1rem',
        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
        transition: 'all 0.2s ease'
    };

    const buttonSecondaryStyle: React.CSSProperties = {
        width: '100%',
        background: 'linear-gradient(135deg, #475569, #334155)',
        color: 'white',
        fontWeight: 700,
        padding: '1rem 2rem',
        borderRadius: '0.75rem',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'all 0.2s ease'
    };

    const winnerBoxStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))',
        borderRadius: '0.75rem',
        border: '1px solid rgba(16, 185, 129, 0.3)'
    };

    return (
        <div style={cardStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    Game Status
                </h2>
                <div style={getBadgeStyle()}>
                    {status === 'waiting' && 'Waiting'}
                    {status === 'playing' && 'In Game'}
                    {status === 'finished' && 'Game Over'}
                </div>
            </div>

            {/* Connection Status */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                background: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
            }}>
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isConnected ? '#10b981' : '#ef4444'
                }} />
                <span style={{ color: isConnected ? '#34d399' : '#f87171' }}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                </span>
            </div>

            {/* Status Box */}
            <div style={statusBoxStyle}>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>
                    {status === 'waiting' && "Waiting for Opponent..."}
                    {status === 'playing' && (isMyTurn ? "✨ Your Turn!" : "⏳ Opponent's Turn")}
                    {status === 'finished' && "Game Over"}
                </div>
            </div>

            {/* Player Color Badge */}
            {playerColor && (
                <div style={playerBadgeStyle}>
                    <div style={playerIconStyle(playerColor)}>
                        {playerColor === 'white' ? '♔' : '♚'}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Playing as</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', textTransform: 'capitalize' }}>
                            {playerColor}
                        </div>
                    </div>
                </div>
            )}

            {/* Turn Indicators */}
            {status === 'playing' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={turnIndicatorStyle(turn === 'w')}>
                        <span style={{ fontSize: '1.5rem' }}>♔</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: turn === 'w' ? '#34d399' : '#64748b' }}>
                            White
                        </span>
                    </div>
                    <div style={turnIndicatorStyle(turn === 'b')}>
                        <span style={{ fontSize: '1.5rem' }}>♚</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: turn === 'b' ? '#34d399' : '#64748b' }}>
                            Black
                        </span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div style={{ marginTop: '0.5rem' }}>
                {status === 'waiting' && (
                    <button 
                        style={buttonPrimaryStyle}
                        onClick={onStartGame}
                        disabled={!isConnected}
                        onMouseEnter={(e) => {
                            if (isConnected) {
                                (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                                (e.target as HTMLButtonElement).style.boxShadow = '0 8px 30px rgba(16, 185, 129, 0.5)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                            (e.target as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.3)';
                        }}
                    >
                        🎮 Start Game
                    </button>
                )}

                {status === 'finished' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={winnerBoxStyle}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
                            <h3 style={{ 
                                fontSize: '1.5rem', 
                                fontWeight: 700, 
                                color: '#34d399', 
                                textTransform: 'capitalize',
                                margin: 0 
                            }}>
                                {winner} Wins!
                            </h3>
                        </div>
                        <button 
                            style={buttonSecondaryStyle}
                            onClick={() => window.location.reload()}
                            onMouseEnter={(e) => {
                                (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                            }}
                        >
                            🔄 Play Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
