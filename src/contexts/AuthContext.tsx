// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, User, Subscription } from '@/lib/api';
import { googleLogout } from '@react-oauth/google';

interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setUser(null);
        setSubscription(null);
        setIsLoading(false);
        return;
      }
      const session = await api.getSession();
      if (session.user) {
        setUser(session.user);
        setSubscription(session.subscription);
      } else {
        localStorage.removeItem('auth_token');
        setUser(null);
        setSubscription(null);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message && error.message.includes('401')) {
        localStorage.removeItem('auth_token');
        setUser(null);
        setSubscription(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const loginWithGoogle = async (accessToken: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Falha no login Google');
      }

      localStorage.setItem('auth_token', data.token);

      setUser(data.user);
      await refreshSession();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.login({ email, password });
      setUser(response.user);
      await refreshSession();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // eslint-disable-next-line
      try { await api.logout(); } catch (e) { }
      localStorage.removeItem('auth_token');
      setUser(null);
      setSubscription(null);
      googleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; phone: string; password: string }) => {
    await api.register(data);
  };

  const isAuthenticated = !!user;

  // --- CORREÇÃO DE LÓGICA DE ASSINATURA ---
  // Agora calculamos se a assinatura é válida verificando o status OU a data.
  const hasActiveSubscription = React.useMemo(() => {
    if (!subscription) return false;

    // 1. Caso Simples: Status está explicitamente ativo
    if (subscription.status === 'active' || subscription.status === 'trialing') {
      return true;
    }

    // 2. Caso "Cancelado mas Pago": Status 'canceled' mas data futura
    // Isso acontece quando desativa a renovação automática
    if (subscription.current_period_end) {
      const endDate = new Date(subscription.current_period_end);
      const now = new Date();
      // Se a data de fim for maior que agora, ainda tem acesso!
      return endDate > now;
    }

    return false;
  }, [subscription]);

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        isLoading,
        isAuthenticated,
        hasActiveSubscription,
        login,
        loginWithGoogle,
        logout,
        register,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}