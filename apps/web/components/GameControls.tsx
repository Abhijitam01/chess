"use client";

interface GameControlsProps {
    isConnected: boolean;
    playerColor: 'white' | 'black' | null;
    status: 'waiting' | 'playing' | 'finished';
    turn: 'w' | 'b';
    isMyTurn: boolean;
    winner: string | null;
    onStartGame: () => void;
    onResign: () => void;
}

export function GameControls({ 
    isConnected, 
    playerColor, 
    status, 
    turn,
    isMyTurn,
    winner,
    onStartGame,
    onResign
}: GameControlsProps) {
    
    const cardStyle: React.CSSProperties = {
        background: 'rgba(35, 35, 35, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1.25rem',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        width: '100%',
        maxWidth: '360px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.02)'
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '0.875rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    };

    const getBadgeStyle = (): React.CSSProperties => {
        const baseStyle: React.CSSProperties = {
            padding: '0.25rem 0.625rem',
            borderRadius: '4px',
            fontSize: '0.6875rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
        };
        
        if (status === 'waiting') {
            return { ...baseStyle, background: 'rgba(201, 168, 108, 0.12)', color: '#c9a86c' };
        } else if (status === 'playing') {
            return { ...baseStyle, background: 'rgba(168, 162, 158, 0.12)', color: '#a8a29e' };
        }
        return { ...baseStyle, background: 'rgba(120, 113, 108, 0.12)', color: '#78716c' };
    };

    const statusBoxStyle: React.CSSProperties = {
        background: 'rgba(0, 0, 0, 0.25)',
        padding: '1rem',
        borderRadius: '8px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.03)'
    };

    const playerBadgeStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'rgba(0, 0, 0, 0.25)',
        padding: '0.875rem',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.03)'
    };

    const playerIconStyle = (color: 'white' | 'black'): React.CSSProperties => ({
        width: '2.25rem',
        height: '2.25rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.125rem',
        background: color === 'white' ? '#f5f5f4' : '#1a1a1a',
        color: color === 'white' ? '#1a1a1a' : '#f5f5f4',
        border: color === 'black' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
    });

    const turnIndicatorStyle = (isActive: boolean): React.CSSProperties => ({
        padding: '0.625rem',
        borderRadius: '8px',
        border: `1px solid ${isActive ? 'rgba(201, 168, 108, 0.4)' : 'rgba(255, 255, 255, 0.05)'}`,
        background: isActive ? 'rgba(201, 168, 108, 0.08)' : 'rgba(0, 0, 0, 0.2)',
        opacity: isActive ? 1 : 0.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem',
        transition: 'all 0.15s ease-out'
    });

    const buttonPrimaryStyle: React.CSSProperties = {
        width: '100%',
        background: 'linear-gradient(180deg, #4a4a4a 0%, #3a3a3a 100%)',
        color: '#f5f5f4',
        fontWeight: 600,
        padding: '0.875rem 1.5rem',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: isConnected ? 'pointer' : 'not-allowed',
        opacity: isConnected ? 1 : 0.5,
        fontSize: '0.9375rem',
        letterSpacing: '0.01em',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.15s ease-out'
    };

    const buttonSecondaryStyle: React.CSSProperties = {
        width: '100%',
        background: 'transparent',
        color: '#a8a29e',
        fontWeight: 600,
        padding: '0.875rem 1.5rem',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        cursor: 'pointer',
        fontSize: '0.9375rem',
        transition: 'all 0.15s ease-out'
    };

    const winnerBoxStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '1.25rem',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '8px',
        border: '1px solid rgba(201, 168, 108, 0.2)'
    };

    return (
        <div style={cardStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#f5f5f4', margin: 0, letterSpacing: '0.01em' }}>
                    Game Status
                </h2>
                <div style={getBadgeStyle()}>
                    {status === 'waiting' && 'Waiting'}
                    {status === 'playing' && 'In Game'}
                    {status === 'finished' && 'Ended'}
                </div>
            </div>

            {/* Status Box */}
            <div style={statusBoxStyle}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#a8a29e' }}>
                    {status === 'waiting' && "Waiting for opponent..."}
                    {status === 'playing' && (!isMyTurn ? "Opponent's turn" : "Your turn")}
                    {status === 'finished' && "Game complete"}
                </div>
            </div>

            {/* Player Color Badge */}
            {playerColor && (
                <div style={playerBadgeStyle}>
                    <div style={playerIconStyle(playerColor)}>
                        {playerColor === 'white' ? '♔' : '♚'}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.6875rem', color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Playing as</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f5f5f4', textTransform: 'capitalize' }}>
                            {playerColor}
                        </div>
                    </div>
                </div>
            )}

            {/* Turn Indicators */}
            {status === 'playing' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                    <div style={turnIndicatorStyle(turn === 'w')}>
                        <span style={{ fontSize: '1.25rem' }}>♔</span>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: turn === 'w' ? '#c9a86c' : '#525252' }}>
                            White
                        </span>
                    </div>
                    <div style={turnIndicatorStyle(turn === 'b')}>
                        <span style={{ fontSize: '1.25rem' }}>♚</span>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: turn === 'b' ? '#c9a86c' : '#525252' }}>
                            Black
                        </span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div style={{ marginTop: '0.25rem' }}>
                {status === 'waiting' && (
                    <button 
                        style={buttonPrimaryStyle}
                        onClick={onStartGame}
                        disabled={!isConnected}
                        onMouseEnter={(e) => {
                            if (isConnected) {
                                (e.target as HTMLButtonElement).style.background = 'linear-gradient(180deg, #555555 0%, #444444 100%)';
                                (e.target as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            (e.target as HTMLButtonElement).style.background = 'linear-gradient(180deg, #4a4a4a 0%, #3a3a3a 100%)';
                            (e.target as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseDown={(e) => {
                            if (isConnected) {
                                (e.target as HTMLButtonElement).style.transform = 'translateY(1px)';
                            }
                        }}
                        onMouseUp={(e) => {
                            (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                        }}
                    >
                        Start Game
                    </button>
                )}

                {status === 'playing' && (
                    <button 
                        style={buttonSecondaryStyle}
                        onClick={onResign}
                        onMouseEnter={(e) => {
                            (e.target as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.15)';
                            (e.target as HTMLButtonElement).style.color = '#f5f5f4';
                            (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.03)';
                        }}
                        onMouseLeave={(e) => {
                            (e.target as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.08)';
                            (e.target as HTMLButtonElement).style.color = '#a8a29e';
                            (e.target as HTMLButtonElement).style.background = 'transparent';
                        }}
                        onMouseDown={(e) => {
                            (e.target as HTMLButtonElement).style.transform = 'translateY(1px)';
                        }}
                        onMouseUp={(e) => {
                            (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                        }}
                    >
                        Resign
                    </button>
                )}
                {status === 'finished' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        <div style={winnerBoxStyle}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.375rem' }}>♔</div>
                            <h3 style={{ 
                                fontSize: '1rem', 
                                fontWeight: 600, 
                                color: '#c9a86c', 
                                textTransform: 'capitalize',
                                margin: 0,
                                letterSpacing: '0.01em'
                            }}>
                                {winner} wins
                            </h3>
                        </div>
                        <button 
                            style={buttonSecondaryStyle}
                            onClick={() => window.location.reload()}
                            onMouseEnter={(e) => {
                                (e.target as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.15)';
                                (e.target as HTMLButtonElement).style.color = '#f5f5f4';
                                (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.03)';
                            }}
                            onMouseLeave={(e) => {
                                (e.target as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                (e.target as HTMLButtonElement).style.color = '#a8a29e';
                                (e.target as HTMLButtonElement).style.background = 'transparent';
                            }}
                            onMouseDown={(e) => {
                                (e.target as HTMLButtonElement).style.transform = 'translateY(1px)';
                            }}
                            onMouseUp={(e) => {
                                (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                            }}
                        >
                            Play Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
