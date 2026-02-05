// src/lib/api.ts

// Configuração da URL da API
// Em produção (Vercel), '/api' usa o mesmo domínio.
export const API_BASE_URL = '/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, token, headers, ...fetchOptions } = options;
    
    // Constrói a URL com query params se existirem
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    // Recupera o token do localStorage se não for passado explicitamente
    const storedToken = localStorage.getItem('auth_token');
    const authToken = token || storedToken;

    const config: RequestInit = {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        // Injeta o Token JWT se existir
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Tenta ler o JSON, mas lida caso a resposta seja vazia (204 No Content)
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Se data for objeto com message, usa ela. Se for string, usa ela.
        const errorMessage = typeof data === 'object' && data.message 
          ? data.message 
          : `Erro HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      return data as T;
    } catch (error) {
      console.error(`Erro na requisição para ${endpoint}:`, error);
      throw error;
    }
  }

  // --- AUTH ENDPOINTS ---

  async register(data: { name: string; email: string; phone: string; password: string }) {
    return this.request<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resendVerification(email: string) {
    return this.request<{ message: string }>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // CORREÇÃO: Alterado de 'identifier' para 'email' para bater com o Backend
  async login(data: { email: string; password: string }) {
    const response = await this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }

    return response;
  }

  async logout() {
    localStorage.removeItem('auth_token');
    // Se precisar chamar o backend para invalidar sessão:
    // return this.request<{ message: string }>('/auth/logout', { method: 'POST' });
  }

  async verifyEmail(token: string) {
    return this.request<{ message: string }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async forgotPassword(email: string) {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(data: { token: string; password: string }) {
    return this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSession() {
    return this.request<{ user: User | null; subscription: Subscription | null }>('/auth/session');
  }

  // --- PROFILE ENDPOINTS ---

  async getProfile() {
    return this.request<{ user: User; subscription: Subscription | null }>('/profile');
  }

  // CORREÇÃO: Renomeado para 'updateUser' para bater com o Account.tsx
  // CORREÇÃO: Rota ajustada para '/users/update' e adicionado avatar_url
  async updateUser(data: { name?: string; phone?: string; avatar_url?: string }) {
    return this.request<{ user: User; message: string }>('/users/update', { 
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // --- BILLING ENDPOINTS ---

  async getPlans() {
    return this.request<{ plans: Plan[] }>('/billing/plans');
  }

  async createSubscription(planId: string) {
    return this.request<{ checkout_url: string }>('/billing/subscribe', {
      method: 'POST',
      body: JSON.stringify({ plan_id: planId }),
    });
  }

  // CORREÇÃO: Rota ajustada para '/subscription/cancel' para bater com a estrutura de pastas
  async cancelSubscription() {
    return this.request<{ message: string }>('/subscription/cancel', {
      method: 'POST',
    });
  }

  async getSubscription() {
    return this.request<{ subscription: Subscription | null }>('/billing/subscription');
  }

  // --- FINANCE ENDPOINTS ---

  async getFinanceSummary(params: { from: string; to: string }) {
    return this.request<FinanceSummary>('/finance/summary', { params });
  }

  async getTransactions(params: { from: string; to: string; search?: string; category?: string }) {
    return this.request<{ transactions: Transaction[] }>('/finance/transactions', { params });
  }

  async getTransactionsByCategory(params: { from: string; to: string }) {
    return this.request<{ categories: CategoryTotal[] }>('/finance/by-category', { params });
  }

  async getTransactionsByDay(params: { from: string; to: string }) {
    return this.request<{ days: DayTotal[] }>('/finance/by-day', { params });
  }

  // --- HEALTH ENDPOINTS ---

  async getHealthSummary(params: { from: string; to: string }) {
    return this.request<HealthSummary>('/health/summary', { params });
  }

  async getWaterLogs(params: { from: string; to: string }) {
    return this.request<{ logs: WaterLog[] }>('/health/water', { params });
  }

  async getSleepLogs(params: { from: string; to: string }) {
    return this.request<{ logs: SleepLog[] }>('/health/sleep', { params });
  }

  async getWorkoutLogs(params: { from: string; to: string }) {
    return this.request<{ logs: WorkoutLog[] }>('/health/workouts', { params });
  }

  // --- ACADEMIC ENDPOINTS ---

  async getAcademicSummary(params: { from: string; to: string }) {
    return this.request<AcademicSummary>('/academic/summary', { params });
  }

  async getDocuments(params: { from: string; to: string; category?: string }) {
    return this.request<{ documents: Document[] }>('/academic/documents', { params });
  }

  async getDocumentsByCategory(params: { from: string; to: string }) {
    return this.request<{ categories: { category: string; count: number }[] }>('/academic/by-category', { params });
  }

  // --- AGENDA ENDPOINTS ---

  async getAgendaSummary(params: { from: string; to: string }) {
    return this.request<AgendaSummary>('/agenda/summary', { params });
  }

  async getEvents(params: { from: string; to: string }) {
    return this.request<{ events: CalendarEvent[] }>('/agenda/events', { params });
  }

  async getEventsByDate(date: string) {
    return this.request<{ events: CalendarEvent[] }>('/agenda/events/date', { params: { date } });
  }
}

// --- TIPOS (INTERFACES) ---

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  email_verified: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  plan_id: string;
  plan_name: string;
  status: 'pending' | 'trialing' | 'active' | 'past_due' | 'canceled';
  trial_ends_at: string | null;
  current_period_end: string | null;
  canceled_at: string | null;
  price?: number; // Adicionado para suportar o Account.tsx
}

export interface Plan {
  id: string;
  name: string;
  price_cents: number;
  interval: 'monthly' | 'yearly';
  description: string;
  features: string[];
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount_cents: number;
  category: string;
  description: string | null;
  occurred_at: string;
  source: 'whatsapp' | 'manual';
}

export interface FinanceSummary {
  balance_cents: number;
  income_cents: number;
  expense_cents: number;
}

export interface CategoryTotal {
  category: string;
  total_cents: number;
  color: string;
}

export interface DayTotal {
  date: string;
  income_cents: number;
  expense_cents: number;
}

export interface HealthSummary {
  water_today_ml: number;
  water_goal_ml: number;
  last_sleep_hours: number | null;
  sleep_goal_hours: number;
  last_weight_kg: number | null;
  workouts_count: number;
}

export interface WaterLog {
  id: string;
  amount_ml: number;
  logged_at: string;
}

export interface SleepLog {
  id: string;
  hours: number;
  logged_at: string;
}

export interface WorkoutLog {
  id: string;
  workout_type: string;
  duration_minutes: number | null;
  logged_at: string;
}

export interface AcademicSummary {
  total_docs: number;
  with_summary: number;
  study_hours: number;
  last_update: string | null;
}

export interface Document {
  id: string;
  title: string;
  category: string;
  file_url: string;
  uploaded_at: string;
  has_summary: boolean;
  summary?: string;
}

export interface AgendaSummary {
  upcoming_count: number;
  synced_count: number;
  pending_count: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
  google_event_id: string | null;
  is_synced: boolean;
}

export const api = new ApiClient(API_BASE_URL);