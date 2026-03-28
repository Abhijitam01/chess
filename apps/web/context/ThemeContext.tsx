"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type BoardTheme = "classic" | "walnut" | "ocean" | "midnight" | "emerald";

export interface ThemeColors {
  light: string;
  dark: string;
}

export const BOARD_THEMES: Record<BoardTheme, ThemeColors> = {
  classic:  { light: "#F0D9B5", dark: "#B58863" },
  walnut:   { light: "#E8CDA0", dark: "#8B5E3C" },
  ocean:    { light: "#DEE3E6", dark: "#527FA5" },
  midnight: { light: "#CBD8EB", dark: "#3E5879" },
  emerald:  { light: "#D1E8D1", dark: "#3A7D44" },
};

interface ThemeContextValue {
  boardTheme: BoardTheme;
  setBoardTheme: (theme: BoardTheme) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  showCoordinates: boolean;
  setShowCoordinates: (show: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [boardTheme, setBoardThemeState] = useState<BoardTheme>("classic");
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [showCoordinates, setShowCoordinatesState] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("chess_theme_prefs");
      if (stored) {
        const prefs = JSON.parse(stored) as Partial<{
          boardTheme: BoardTheme;
          soundEnabled: boolean;
          showCoordinates: boolean;
        }>;
        if (prefs.boardTheme) setBoardThemeState(prefs.boardTheme);
        if (prefs.soundEnabled !== undefined) setSoundEnabledState(prefs.soundEnabled);
        if (prefs.showCoordinates !== undefined) setShowCoordinatesState(prefs.showCoordinates);
      }
    } catch {
      // ignore corrupt prefs
    }
  }, []);

  const persist = (updates: Partial<{ boardTheme: BoardTheme; soundEnabled: boolean; showCoordinates: boolean }>) => {
    try {
      const stored = localStorage.getItem("chess_theme_prefs");
      const current = stored ? (JSON.parse(stored) as object) : {};
      localStorage.setItem("chess_theme_prefs", JSON.stringify({ ...current, ...updates }));
    } catch {
      // ignore
    }
  };

  const setBoardTheme = useCallback((theme: BoardTheme) => {
    setBoardThemeState(theme);
    persist({ boardTheme: theme });
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    persist({ soundEnabled: enabled });
  }, []);

  const setShowCoordinates = useCallback((show: boolean) => {
    setShowCoordinatesState(show);
    persist({ showCoordinates: show });
  }, []);

  return (
    <ThemeContext.Provider value={{ boardTheme, setBoardTheme, soundEnabled, setSoundEnabled, showCoordinates, setShowCoordinates }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
}
