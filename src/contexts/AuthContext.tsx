import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, User, Subscription } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  // IMPORTANTE: Começa true para segurar a tela de loading no F5
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Se não tem token salvo, aí sim paramos de carregar e consideramos deslogado
      if (!token) {
        setUser(null);
        setSubscription(null);
        setIsLoading(false);
        return;
      }

      // Chama a API
      const session = await api.getSession();
      
      if (session.user) {
        setUser(session.user);
        setSubscription(session.subscription);
      } else {
        // Se a API retornou null (token inválido), desloga
        console.warn("Sessão inválida retornada pela API");
        localStorage.removeItem('auth_token');
        setUser(null);
        setSubscription(null);
      }
    } catch (error: any) {
      console.error("Erro ao validar sessão:", error);
      // SÓ DESLOGA SE FOR ERRO DE AUTENTICAÇÃO (401)
      // Se for erro de rede ou 500, mantém o usuário na tela (evita logout acidental)
      if (error.message && error.message.includes('401')) {
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

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.login({ identifier, password });
      setUser(response.user);
      await refreshSession();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
        // Tenta avisar o backend, mas limpa local mesmo se falhar
        try { await api.logout(); } catch (e) {} 
        localStorage.removeItem('auth_token');
        setUser(null);
        setSubscription(null);
    } finally {
        setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; phone: string; password: string }) => {
    await api.register(data);
  };

  const isAuthenticated = !!user;
  const hasActiveSubscription = subscription?.status === 'trialing' || subscription?.status === 'active';

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        isLoading,
        isAuthenticated,
        hasActiveSubscription,
        login,
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