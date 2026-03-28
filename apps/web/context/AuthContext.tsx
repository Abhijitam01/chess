"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface AuthUser {
  token: string;
  userId: string;
  username: string;
  rating: number;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("chess_auth");
      if (stored) {
        setUser(JSON.parse(stored) as AuthUser);
      }
    } catch {
      localStorage.removeItem("chess_auth");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistUser = (authUser: AuthUser) => {
    localStorage.setItem("chess_auth", JSON.stringify(authUser));
    setUser(authUser);
  };

  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const json = (await res.json()) as { success: boolean; data?: AuthUser; error?: string };
    if (!json.success || !json.data) {
      throw new Error(json.error ?? "Sign in failed");
    }
    persistUser(json.data);
  }, []);

  const signup = useCallback(async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const json = (await res.json()) as { success: boolean; data?: AuthUser; error?: string };
    if (!json.success || !json.data) {
      throw new Error(json.error ?? "Sign up failed");
    }
    persistUser(json.data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("chess_auth");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
