"use client";

import { useState } from 'react';

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const [activeSection, setActiveSection] = useState<string>('settings');

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
                        className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-text-muted hover:text-text-primary"
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
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 animate-fade-in">
                        {/* Board Theme Section */}
                        <div className="card">
                            <button 
                                className={`sidebar-item w-full text-left flex items-center gap-3 ${activeSection === 'theme' ? 'active' : ''}`}
                                onClick={() => setActiveSection('theme')}
                            >
                                <span className="text-lg">🎨</span>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-text-primary">Board Theme</div>
                                    <div className="text-xs text-text-muted">Wood Classic</div>
                                </div>
                            </button>
                        </div>

                        {/* Piece Style Section */}
                        <div className="card">
                            <button 
                                className={`sidebar-item w-full text-left flex items-center gap-3 ${activeSection === 'pieces' ? 'active' : ''}`}
                                onClick={() => setActiveSection('pieces')}
                            >
                                <span className="text-lg">♞</span>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-text-primary">Piece Style</div>
                                    <div className="text-xs text-text-muted">Standard</div>
                                </div>
                            </button>
                        </div>

                        {/* Sound Section */}
                        <div className="card">
                            <button 
                                className={`sidebar-item w-full text-left flex items-center gap-3 ${activeSection === 'sound' ? 'active' : ''}`}
                                onClick={() => setActiveSection('sound')}
                            >
                                <span className="text-lg">🔊</span>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-text-primary">Sound</div>
                                    <div className="text-xs text-text-muted">Enabled</div>
                                </div>
                            </button>
                        </div>

                        {/* Coordinates Section */}
                        <div className="card">
                            <button 
                                className={`sidebar-item w-full text-left flex items-center gap-3 ${activeSection === 'coords' ? 'active' : ''}`}
                                onClick={() => setActiveSection('coords')}
                            >
                                <span className="text-lg font-mono text-sm">a1</span>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-text-primary">Coordinates</div>
                                    <div className="text-xs text-text-muted">Shown</div>
                                </div>
                            </button>
                        </div>

                        {/* Animation Section */}
                        <div className="card">
                            <button 
                                className={`sidebar-item w-full text-left flex items-center gap-3 ${activeSection === 'animation' ? 'active' : ''}`}
                                onClick={() => setActiveSection('animation')}
                            >
                                <span className="text-lg">✨</span>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-text-primary">Animations</div>
                                    <div className="text-xs text-text-muted">Enabled</div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* Collapsed Icons */}
                {isCollapsed && (
                    <div className="flex-1 flex flex-col items-center py-4 space-y-3 animate-fade-in">
                        <button className="p-3 rounded-lg hover:bg-white/[0.05] transition-colors" title="Board Theme">
                            <span className="text-lg">🎨</span>
                        </button>
                        <button className="p-3 rounded-lg hover:bg-white/[0.05] transition-colors" title="Piece Style">
                            <span className="text-lg">♞</span>
                        </button>
                        <button className="p-3 rounded-lg hover:bg-white/[0.05] transition-colors" title="Sound">
                            <span className="text-lg">🔊</span>
                        </button>
                        <button className="p-3 rounded-lg hover:bg-white/[0.05] transition-colors" title="Coordinates">
                            <span className="text-sm font-mono">a1</span>
                        </button>
                        <button className="p-3 rounded-lg hover:bg-white/[0.05] transition-colors" title="Animations">
                            <span className="text-lg">✨</span>
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
}
