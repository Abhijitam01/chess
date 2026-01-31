import { useNavigate } from 'react-router-dom';
import chessBoardImage from '../assets/chess_board_hero_1769865149682.png';

export function Landing() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="nav-bar">
                <div className="container flex-between">
                    <div className="logo">
                        <h2 style={{ margin: 0, color: 'var(--color-text-light)' }}>♔ Chess</h2>
                    </div>
                    <div className="nav-links" style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                        <a href="#features" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color var(--transition-fast)' }}>Features</a>
                        <a href="#play" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color var(--transition-fast)' }}>Play</a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text animate-fade-in">
                            <h1 style={{ 
                                background: 'linear-gradient(135deg, var(--color-text-light) 0%, var(--color-accent) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                marginBottom: 'var(--spacing-md)'
                            }}>
                                Play Chess Online
                            </h1>
                            <p style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-xl)', maxWidth: '600px' }}>
                                Challenge players from around the world in real-time chess matches. Improve your skills and climb the ranks.
                            </p>
                            <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                                <button 
                                    className="btn btn-primary btn-large"
                                    onClick={() => navigate('/game')}
                                >
                                    Play Online
                                </button>
                                <button className="btn btn-secondary btn-large">
                                    Learn Chess
                                </button>
                            </div>
                        </div>
                        <div className="hero-image animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <img 
                                src={chessBoardImage} 
                                alt="Chess Board" 
                                style={{ 
                                    width: '100%', 
                                    height: 'auto', 
                                    borderRadius: 'var(--radius-xl)',
                                    boxShadow: 'var(--shadow-xl)'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-card card glass">
                            <h3 style={{ color: 'var(--color-accent)', fontSize: '2.5rem', margin: 0 }}>10K+</h3>
                            <p style={{ margin: 0, fontSize: '1rem' }}>Active Players</p>
                        </div>
                        <div className="stat-card card glass">
                            <h3 style={{ color: 'var(--color-accent)', fontSize: '2.5rem', margin: 0 }}>50K+</h3>
                            <p style={{ margin: 0, fontSize: '1rem' }}>Games Today</p>
                        </div>
                        <div className="stat-card card glass">
                            <h3 style={{ color: 'var(--color-accent)', fontSize: '2.5rem', margin: 0 }}>24/7</h3>
                            <p style={{ margin: 0, fontSize: '1rem' }}>Always Online</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features">
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                        Why Play Here?
                    </h2>
                    <div className="features-grid grid grid-3">
                        <div className="feature-card card">
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>⚡</div>
                            <h3>Real-Time Matches</h3>
                            <p>Play instantly with opponents from around the world. Fast matchmaking and smooth gameplay.</p>
                        </div>
                        <div className="feature-card card">
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📊</div>
                            <h3>Track Progress</h3>
                            <p>Monitor your improvement with detailed statistics and rating system.</p>
                        </div>
                        <div className="feature-card card">
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🏆</div>
                            <h3>Compete & Win</h3>
                            <p>Join tournaments and climb the leaderboards to prove your skills.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section" id="play">
                <div className="container">
                    <div className="cta-content glass" style={{ 
                        padding: 'var(--spacing-2xl)', 
                        borderRadius: 'var(--radius-xl)',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Ready to Play?</h2>
                        <p style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-xl)', maxWidth: '600px', margin: '0 auto var(--spacing-xl)' }}>
                            Join thousands of players and start your chess journey today.
                        </p>
                        <button 
                            className="btn btn-primary btn-large"
                            onClick={() => navigate('/game')}
                        >
                            Start Playing Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-lg) 0' }}>
                        <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
                            © 2026 Chess Online. Built for chess enthusiasts.
                        </p>
                    </div>
                </div>
            </footer>

            <style>{`
                .landing-page {
                    min-height: 100vh;
                }

                .nav-bar {
                    padding: var(--spacing-md) 0;
                    background: var(--color-bg-darker);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    box-shadow: var(--shadow-md);
                }

                .nav-links a:hover {
                    color: var(--color-accent) !important;
                }

                .hero-section {
                    padding: var(--spacing-2xl) 0;
                    background: linear-gradient(135deg, var(--color-bg-dark) 0%, var(--color-bg-darker) 100%);
                }

                .hero-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-2xl);
                    align-items: center;
                }

                .stats-section {
                    padding: var(--spacing-2xl) 0;
                    background: var(--color-bg-darker);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--spacing-lg);
                }

                .stat-card {
                    text-align: center;
                    padding: var(--spacing-xl);
                }

                .features-section {
                    padding: var(--spacing-2xl) 0;
                }

                .cta-section {
                    padding: var(--spacing-2xl) 0;
                    background: var(--color-bg-darker);
                }

                .footer {
                    background: var(--color-bg-darker);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                @media (max-width: 768px) {
                    .hero-content {
                        grid-template-columns: 1fr;
                    }

                    .hero-text {
                        text-align: center;
                    }

                    .hero-text > div {
                        justify-content: center;
                    }

                    .nav-links {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}