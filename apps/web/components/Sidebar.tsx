"use client";

import { memo } from 'react';
import { useThemeContext, BOARD_THEMES, type BoardTheme } from '../context/ThemeContext';

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

const THEME_LABELS: Record<BoardTheme, string> = {
    classic:  "Classic",
    walnut:   "Walnut",
    ocean:    "Ocean",
    midnight: "Midnight",
    emerald:  "Emerald",
};

export const Sidebar = memo(function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const { boardTheme, setBoardTheme, soundEnabled, setSoundEnabled, showCoordinates, setShowCoordinates } = useThemeContext();

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:relative z-40 h-full
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'w-0 lg:w-16' : 'w-[280px]'}
                    bg-background-sidebar border-r border-white/[0.06]
                    flex flex-col overflow-hidden
                `}
            >
                {/* Sidebar Header */}
                <div className={`
                    flex items-center justify-between p-4 border-b border-white/[0.05]
                    ${isCollapsed ? 'px-3' : 'px-4'}
                `}>
                    {!isCollapsed && (
                        <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                            Settings
                        </span>
                    )}
                    <button
                        onClick={onToggle}
                        className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-text-muted hover:text-text-primary min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <svg
                            className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Sidebar Content */}
                {!isCollapsed && (
                    <div className="flex-1 overflow-y-auto p-3 space-y-4 animate-fade-in">
                        {/* Board Theme Section */}
                        <div className="card p-3 space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">🎨</span>
                                <div>
                                    <div className="text-sm font-medium text-text-primary">Board Theme</div>
                                    <div className="text-xs text-text-muted">{THEME_LABELS[boardTheme]}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {(Object.keys(BOARD_THEMES) as BoardTheme[]).map((theme) => (
                                    <button
                                        key={theme}
                                        title={THEME_LABELS[theme]}
                                        onClick={() => setBoardTheme(theme)}
                                        className={`
                                            relative h-10 rounded-lg overflow-hidden border-2 transition-all
                                            ${boardTheme === theme ? 'border-emerald-500 scale-105' : 'border-white/10 hover:border-white/30'}
                                        `}
                                    >
                                        <div className="grid grid-cols-2 grid-rows-2 h-full">
                                            <div style={{ backgroundColor: BOARD_THEMES[theme].light }} />
                                            <div style={{ backgroundColor: BOARD_THEMES[theme].dark }} />
                                            <div style={{ backgroundColor: BOARD_THEMES[theme].dark }} />
                                            <div style={{ backgroundColor: BOARD_THEMES[theme].light }} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sound Section */}
                        <div className="card p-3">
                            <button
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className="sidebar-item w-full text-left flex items-center gap-3 min-h-[44px]"
                            >
                                <span className="text-lg">{soundEnabled ? '🔊' : '🔇'}</span>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-text-primary">Sound</div>
                                    <div className="text-xs text-text-muted">{soundEnabled ? 'Enabled' : 'Disabled'}</div>
                                </div>
                                <div className={`w-9 h-5 rounded-full transition-colors ${soundEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}>
                                    <div className={`w-4 h-4 mt-0.5 rounded-full bg-white shadow transition-transform ${soundEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                                </div>
                            </button>
                        </div>

                        {/* Coordinates Section */}
                        <div className="card p-3">
                            <button
                                onClick={() => setShowCoordinates(!showCoordinates)}
                                className="sidebar-item w-full text-left flex items-center gap-3 min-h-[44px]"
                            >
                                <span className="text-sm font-mono font-bold text-text-primary">a1</span>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-text-primary">Coordinates</div>
                                    <div className="text-xs text-text-muted">{showCoordinates ? 'Shown' : 'Hidden'}</div>
                                </div>
                                <div className={`w-9 h-5 rounded-full transition-colors ${showCoordinates ? 'bg-emerald-500' : 'bg-white/10'}`}>
                                    <div className={`w-4 h-4 mt-0.5 rounded-full bg-white shadow transition-transform ${showCoordinates ? 'translate-x-4' : 'translate-x-0.5'}`} />
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* Collapsed Icons */}
                {isCollapsed && (
                    <div className="flex-1 flex flex-col items-center py-4 space-y-3 animate-fade-in">
                        <button
                            onClick={onToggle}
                            className="p-3 rounded-lg hover:bg-white/[0.05] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                            title="Board Theme"
                        >
                            <span className="text-lg">🎨</span>
                        </button>
                        <button
                            onClick={onToggle}
                            className="p-3 rounded-lg hover:bg-white/[0.05] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                            title={soundEnabled ? 'Sound On' : 'Sound Off'}
                        >
                            <span className="text-lg">{soundEnabled ? '🔊' : '🔇'}</span>
                        </button>
                        <button
                            onClick={onToggle}
                            className="p-3 rounded-lg hover:bg-white/[0.05] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                            title="Coordinates"
                        >
                            <span className="text-sm font-mono">a1</span>
                        </button>
                    </div>
                )}
            </aside>

            {/* Mobile Overlay */}
            {!isCollapsed && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={onToggle}
                />
            )}
        </>
    );
});
