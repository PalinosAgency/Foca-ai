import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2,
  UserPlus,
  CheckCircle2,
  LogOut,
  Shield,
  Phone,
  User,
  Users,
  RefreshCw,
  Clock,
  MoreHorizontal,
  XCircle,
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  CalendarCheck,
  CalendarX,
  UserX,
  UserMinus,
  Trash2,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────
interface UserRow {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  created_at: string;
  sub_status: string | null;
  plan_id: string | null;
  current_period_end: string | null;
  auto_renew: boolean | null;
}

interface Stats {
  total: number;
  active: number;
  canceled: number;
  expired: number;
  noPlan: number;
}

interface AdminRow {
  email: string;
  created_at: string;
  created_by: string;
  isEnv?: boolean;
}

interface ConfirmAction {
  userId: string;
  userName: string;
  operation: 'cancel' | 'reactivate' | 'extend';
  duration?: string;
}

// ─── Helpers ─────────────────────────────────────
const getToken = () => sessionStorage.getItem('admin_token');

const formatPhoneDisplay = (phone: string | null) => {
  if (!phone) return '—';
  const digits = phone.replace(/^55/, '');
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return phone;
};

const formatPhoneInput = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

const daysUntil = (dateStr: string) => {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const calcPreviewDate = (duration: string) => {
  if (duration === 'lifetime') return '31/12/2099 (Vitalício)';
  const months = parseInt(duration, 10) || 1;
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toLocaleDateString('pt-BR');
};

const DURATION_OPTIONS = [
  { value: '1', label: '1 mês' },
  { value: '2', label: '2 meses' },
  { value: '3', label: '3 meses' },
  { value: '6', label: '6 meses' },
  { value: '12', label: '1 ano' },
  { value: 'lifetime', label: '♾ Vitalício' },
];

const FILTER_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: '🟢 Ativos' },
  { value: 'canceled', label: '🔴 Cancelados' },
  { value: 'expired', label: '⚫ Expirados' },
  { value: 'no-plan', label: '⚪ Sem plano' },
];

// ─── API Helper ──────────────────────────────────
async function adminFetch(body: Record<string, unknown>, navigate: ReturnType<typeof useNavigate>) {
  const token = getToken();
  if (!token) { navigate('/admin'); return null; }

  try {
    const response = await fetch('/api/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      sessionStorage.removeItem('admin_token');
      navigate('/admin');
      return null;
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text || 'Erro inesperado do servidor.' };
    }

    return { response, data };
  } catch (error) {
    console.error('API Fetch Error:', error);
    return null;
  }
}

// ─── Status Badge ────────────────────────────────
function StatusBadge({ status, endDate }: { status: string | null; endDate: string | null }) {
  const isActive = status === 'active' && endDate && new Date(endDate) > new Date();
  const isExpired = status === 'active' && endDate && new Date(endDate) <= new Date();
  const isCanceled = status === 'canceled';

  if (isActive) {
    const days = daysUntil(endDate!);
    const isLifetime = days > 25000;
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        {isLifetime ? 'Vitalício' : 'Ativo'}
      </span>
    );
  }
  if (isCanceled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        Cancelado
      </span>
    );
  }
  if (isExpired) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
        Expirado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
      Sem plano
    </span>
  );
}

// ═══════════════════════════════════════════════════
// ─── MAIN COMPONENT ──────────────────────────────
// ═══════════════════════════════════════════════════
export default function AdminPanel() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // ── State: Tabs ──
  const [activeTab, setActiveTab] = useState('users');

  // ── State: Users Tab ──
  const [users, setUsers] = useState<UserRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // ── State: Confirm Dialog ──
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // ── State: Register Tab ──
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDuration, setRegDuration] = useState('1');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regSuccess, setRegSuccess] = useState('');

  // ── State: Stats Tab ──
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // ── State: Admins Tab ──
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  // ── Safety measure against Radix Dialog pointer-events bug ──
  useEffect(() => {
    if (!confirmAction) {
      const t = setTimeout(() => {
        document.body.style.pointerEvents = '';
      }, 500);
      return () => clearTimeout(t);
    }
  }, [confirmAction]);

  // ── Auth check ──
  useEffect(() => {
    if (!getToken()) navigate('/admin');
  }, [navigate]);

  // ── Debounce search ──
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchDebounced(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // ── Fetch Users ──
  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const result = await adminFetch(
        { action: 'list-users', page, limit: 20, filter, search: searchDebounced },
        navigate
      );
      if (result?.response.ok) {
        setUsers(result.data.users || []);
        setTotalPages(result.data.totalPages || 1);
        setTotalUsers(result.data.total || 0);
      }
    } catch { /* silent */ } finally {
      setIsLoadingUsers(false);
    }
  }, [page, filter, searchDebounced, navigate]);

  useEffect(() => {
    if (getToken()) fetchUsers();
  }, [fetchUsers]);

  // ── Fetch Stats ──
  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const result = await adminFetch({ action: 'get-stats' }, navigate);
      if (result?.response.ok) setStats(result.data);
    } catch { /* silent */ } finally {
      setIsLoadingStats(false);
    }
  }, [navigate]);

  // ── Fetch Admins ──
  const fetchAdmins = useCallback(async () => {
    setIsLoadingAdmins(true);
    try {
      const result = await adminFetch({ action: 'list-admins' }, navigate);
      if (result?.response.ok) {
        setAdmins(result.data.admins || []);
      }
    } catch { /* silent */ } finally {
      setIsLoadingAdmins(false);
    }
  }, [navigate]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    setIsAddingAdmin(true);
    try {
      const result = await adminFetch({ action: 'add-admin', email: newAdminEmail.trim() }, navigate);
      if (result?.response?.ok) {
        toast({ title: '✅ Sucesso', description: result.data.message });
        setNewAdminEmail('');
        fetchAdmins();
      } else {
        toast({ title: 'Erro', description: result?.data?.message || 'Erro ao adicionar', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erro de conexão', variant: 'destructive' });
    } finally {
      setIsAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (!confirm(`Tem certeza que deseja remover o administrador ${email}?`)) return;
    try {
      const result = await adminFetch({ action: 'remove-admin', email }, navigate);
      if (result?.response?.ok) {
        toast({ title: '✅ Sucesso', description: result.data.message });
        fetchAdmins();
      } else {
        toast({ title: 'Erro', description: result?.data?.message || 'Erro ao remover', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erro de conexão', variant: 'destructive' });
    }
  };

  // ── Handle subscription action ──
  const handleSubscriptionAction = async () => {
    if (!confirmAction) return;
    setIsActionLoading(true);
    try {
      const result = await adminFetch(
        { action: 'update-subscription', userId: confirmAction.userId, operation: confirmAction.operation, duration: confirmAction.duration },
        navigate
      );
      if (result?.response?.ok) {
        toast({ title: '✅ Sucesso', description: result.data.message });
        setConfirmAction(null);
        setTimeout(() => {
          fetchUsers();
          fetchStats();
        }, 400);
      } else {
        toast({ title: 'Erro', description: result?.data?.message || 'Falha na operação', variant: 'destructive' });
        setConfirmAction(null);
      }
    } catch {
      toast({ title: 'Erro de conexão', variant: 'destructive' });
      setConfirmAction(null);
    } finally {
      setIsActionLoading(false);
    }
  };

  // ── Handle registration ──
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setRegSuccess('');
    try {
      const result = await adminFetch(
        { action: 'register', name: regName.trim(), phone: regPhone, duration: regDuration === 'lifetime' ? 'lifetime' : parseInt(regDuration, 10) },
        navigate
      );
      if (result?.response?.ok) {
        setRegSuccess(result.data.message);
        toast({ title: '✅ Registro realizado!', description: result.data.message });
        setRegName('');
        setRegPhone('');
        setRegDuration('1');
        fetchUsers();
        fetchStats();
      } else {
        toast({ title: 'Erro', description: result?.data?.message || 'Erro ao registrar', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erro de conexão', variant: 'destructive' });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    navigate('/admin');
  };

  // ═══════════════════════════════════════════════
  // ─── RENDER ────────────────────────────────────
  // ═══════════════════════════════════════════════
  return (
    <div className="min-h-screen w-full bg-[#040949] flex flex-col items-center p-4 sm:p-6">
      {/* ── Header ── */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-6 mt-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-amber-500/20 ring-2 ring-amber-400/30">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Painel Admin</h1>
            <p className="text-blue-300/80 text-sm">Gerenciamento completo · Foca.aí</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-blue-300 hover:text-white hover:bg-white/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>

      {/* ── Tabs ── */}
      <Tabs
        value={activeTab}
        className="w-full max-w-5xl"
        onValueChange={(v) => { 
          setActiveTab(v); 
          if (v === 'stats') fetchStats(); 
          if (v === 'admins') fetchAdmins();
        }}
      >
        <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-6 h-auto sm:h-12 gap-1 sm:gap-0">
          <TabsTrigger
            value="users"
            className="rounded-lg text-white/70 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md font-semibold transition-all"
          >
            <Users className="w-4 h-4 mr-2" />
            Usuários
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="rounded-lg text-white/70 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md font-semibold transition-all"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Registro Manual
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="rounded-lg text-white/70 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md font-semibold transition-all"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Resumo
          </TabsTrigger>
          <TabsTrigger
            value="admins"
            className="rounded-lg text-white/70 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md font-semibold transition-all"
          >
            <Shield className="w-4 h-4 mr-2" />
            Admins
          </TabsTrigger>
        </TabsList>

        {/* ══════════════════════════════════════════ */}
        {/* TAB: USUÁRIOS                             */}
        {/* ══════════════════════════════════════════ */}
        <TabsContent value="users">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-5 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="search-users"
                  placeholder="Buscar por nome ou telefone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <Select value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-[180px] h-10" id="filter-status">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  {FILTER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchUsers}
                disabled={isLoadingUsers}
                className="h-10 w-10 shrink-0"
                id="refresh-users"
              >
                {isLoadingUsers ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              </Button>
            </div>

            {/* Users count */}
            <p className="text-xs text-gray-500 mb-3">
              {totalUsers} usuário{totalUsers !== 1 ? 's' : ''} encontrado{totalUsers !== 1 ? 's' : ''}
            </p>

            {/* Table */}
            {isLoadingUsers && users.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Users className="w-14 h-14 mx-auto mb-3 opacity-20" />
                <p>Nenhum usuário encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-5 sm:-mx-8 px-5 sm:px-8">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">Nome</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">Telefone</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">E-mail</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">Acesso até</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">Registrado</th>
                      <th className="text-right py-3 px-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const isActive = u.sub_status === 'active' && u.current_period_end && new Date(u.current_period_end) > new Date();
                      const days = u.current_period_end ? daysUntil(u.current_period_end) : null;
                      const isLifetime = days !== null && days > 25000;
                      const isExpiringSoon = days !== null && days > 0 && days <= 7 && !isLifetime;

                      return (
                        <tr key={u.id} className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors group">
                          <td className="py-3 px-2 font-medium">{u.name || '—'}</td>
                          <td className="py-3 px-2 text-gray-600 font-mono text-xs">{formatPhoneDisplay(u.phone)}</td>
                          <td className="py-3 px-2 text-gray-500 text-xs max-w-[160px] truncate">{u.email || '—'}</td>
                          <td className="py-3 px-2">
                            <StatusBadge status={u.sub_status} endDate={u.current_period_end} />
                          </td>
                          <td className="py-3 px-2 text-gray-600 text-xs">
                            {u.current_period_end ? (
                              <div className="flex flex-col gap-0.5">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {isLifetime ? 'Vitalício' : new Date(u.current_period_end).toLocaleDateString('pt-BR')}
                                </span>
                                {isExpiringSoon && (
                                  <span className="text-amber-600 font-semibold text-[10px]">⚠ {days} dia{days! > 1 ? 's' : ''} restante{days! > 1 ? 's' : ''}</span>
                                )}
                              </div>
                            ) : '—'}
                          </td>
                          <td className="py-3 px-2 text-gray-400 text-xs">
                            {u.created_at
                              ? new Date(u.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
                              : '—'}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                  id={`actions-${u.id}`}
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setConfirmAction({ userId: u.id, userName: u.name || 'Usuário', operation: 'extend', duration: '1' })}
                                  className="text-emerald-600 focus:text-emerald-600"
                                >
                                  <Clock className="w-4 h-4 mr-2" />
                                  {isActive ? 'Aumentar 1 mês' : 'Reativar (1 mês)'}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setConfirmAction({ userId: u.id, userName: u.name || 'Usuário', operation: 'extend', duration: '2' })}
                                  className="text-emerald-600 focus:text-emerald-600"
                                >
                                  <Clock className="w-4 h-4 mr-2" />
                                  {isActive ? 'Aumentar 2 meses' : 'Reativar (2 meses)'}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setConfirmAction({ userId: u.id, userName: u.name || 'Usuário', operation: 'extend', duration: '6' })}
                                  className="text-emerald-600 focus:text-emerald-600"
                                >
                                  <Clock className="w-4 h-4 mr-2" />
                                  {isActive ? 'Aumentar 6 meses' : 'Reativar (6 meses)'}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setConfirmAction({ userId: u.id, userName: u.name || 'Usuário', operation: 'extend', duration: '12' })}
                                  className="text-emerald-600 focus:text-emerald-600"
                                >
                                  <Clock className="w-4 h-4 mr-2" />
                                  {isActive ? 'Aumentar 1 ano' : 'Reativar (1 ano)'}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setConfirmAction({ userId: u.id, userName: u.name || 'Usuário', operation: 'extend', duration: 'lifetime' })}
                                  className="text-blue-600 focus:text-blue-600"
                                >
                                  <Shield className="w-4 h-4 mr-2" />
                                  {isActive ? 'Tornar Vitalício' : 'Reativar (Vitalício)'}
                                </DropdownMenuItem>
                                {isActive && (
                                  <DropdownMenuItem
                                    onClick={() => setConfirmAction({ userId: u.id, userName: u.name || 'Usuário', operation: 'cancel' })}
                                    className="text-red-600 focus:text-red-600 border-t mt-1 pt-1"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancelar assinatura
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Página {page} de {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    id="prev-page"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    id="next-page"
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ══════════════════════════════════════════ */}
        {/* TAB: REGISTRO MANUAL                      */}
        {/* ══════════════════════════════════════════ */}
        <TabsContent value="register">
          <div className="max-w-xl mx-auto bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-blue-100">
                <UserPlus className="w-6 h-6 text-[#0026f7]" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Registro Manual</h2>
                <p className="text-sm text-gray-500">Crie um acesso com duração personalizada</p>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="reg-name" className="font-bold text-base flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome completo
                </Label>
                <Input
                  id="reg-name"
                  type="text"
                  placeholder="Ex: João Silva"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="h-12 focus-visible:ring-[#0026f7] text-base"
                  required
                />
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="reg-phone" className="font-bold text-base flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefone (WhatsApp)
                </Label>
                <p className="text-xs text-amber-600 font-medium">⚠️ Não inclua +55 — digite apenas DDD + número</p>
                <Input
                  id="reg-phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={regPhone}
                  onChange={(e) => setRegPhone(formatPhoneInput(e.target.value))}
                  className="h-12 focus-visible:ring-[#0026f7] text-base"
                  required
                />
              </div>

              {/* Duração */}
              <div className="space-y-2">
                <Label htmlFor="reg-duration" className="font-bold text-base flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Duração da assinatura
                </Label>
                <Select value={regDuration} onValueChange={setRegDuration}>
                  <SelectTrigger className="h-12 text-base" id="reg-duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Preview */}
                <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-4 py-2.5 text-sm">
                  <CalendarCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-blue-800">
                    Acesso válido até: <strong>{calcPreviewDate(regDuration)}</strong>
                  </span>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 font-bold text-base shadow-md hover:shadow-lg transition-all bg-[#0026f7] hover:bg-[#0026f7]/90 text-white"
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Registrar Usuário
                  </>
                )}
              </Button>
            </form>

            {/* Success Feedback */}
            {regSuccess && (
              <Alert className="mt-6 bg-emerald-50 border-emerald-200">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <AlertDescription className="text-emerald-800 font-medium">
                  {regSuccess}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>

        {/* ══════════════════════════════════════════ */}
        {/* TAB: RESUMO / STATS                       */}
        {/* ══════════════════════════════════════════ */}
        <TabsContent value="stats">
          <div className="animate-in fade-in zoom-in-95 duration-300">
            {isLoadingStats ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard icon={<Users className="w-6 h-6" />} label="Total" value={stats.total} color="blue" onClick={() => { setFilter('all'); setPage(1); setActiveTab('users'); }} />
                <StatCard icon={<CalendarCheck className="w-6 h-6" />} label="Ativos" value={stats.active} color="emerald" onClick={() => { setFilter('active'); setPage(1); setActiveTab('users'); }} />
                <StatCard icon={<XCircle className="w-6 h-6" />} label="Cancelados" value={stats.canceled} color="red" onClick={() => { setFilter('canceled'); setPage(1); setActiveTab('users'); }} />
                <StatCard icon={<CalendarX className="w-6 h-6" />} label="Expirados" value={stats.expired} color="gray" onClick={() => { setFilter('expired'); setPage(1); setActiveTab('users'); }} />
                <StatCard icon={<UserMinus className="w-6 h-6" />} label="Sem plano" value={stats.noPlan} color="slate" onClick={() => { setFilter('no-plan'); setPage(1); setActiveTab('users'); }} />
              </div>
            ) : (
              <div className="text-center py-16 text-blue-300/60">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Não foi possível carregar as estatísticas</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ══════════════════════════════════════════ */}
        {/* TAB: ADMINS                               */}
        {/* ══════════════════════════════════════════ */}
        <TabsContent value="admins">
          <div className="max-w-3xl mx-auto bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-blue-100">
                <Shield className="w-6 h-6 text-[#0026f7]" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Administradores</h2>
                <p className="text-sm text-gray-500">Gerencie quem tem acesso a este painel</p>
              </div>
            </div>

            {/* Formulário de Adição */}
            <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="E-mail do novo administrador (Conta Google)"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="h-12 focus-visible:ring-[#0026f7]"
                  required
                />
              </div>
              <Button
                type="submit"
                className="h-12 bg-[#0026f7] hover:bg-[#0026f7]/90 text-white shrink-0"
                disabled={isAddingAdmin}
              >
                {isAddingAdmin ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                Adicionar
              </Button>
            </form>

            {/* Lista de Admins */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" /> Usuários com Acesso
              </h3>
              
              {isLoadingAdmins && admins.length === 0 ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
              ) : (
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3 font-semibold">E-mail</th>
                        <th className="px-4 py-3 font-semibold">Adicionado por</th>
                        <th className="px-4 py-3 font-semibold">Data</th>
                        <th className="px-4 py-3 text-right font-semibold">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {admins.map((admin) => (
                        <tr key={admin.email} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-4 py-3 font-medium">{admin.email} {admin.isEnv && <span className="ml-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">SISTEMA</span>}</td>
                          <td className="px-4 py-3 text-gray-500">{admin.created_by || '—'}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {admin.created_at ? new Date(admin.created_at).toLocaleDateString('pt-BR') : '—'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {!admin.isEnv && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleRemoveAdmin(admin.email)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Confirm Dialog ── */}
      <Dialog open={!!confirmAction} onOpenChange={(open) => { if (!open) setConfirmAction(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {confirmAction?.operation === 'cancel' ? (
                <><XCircle className="w-5 h-5 text-red-500" /> Cancelar Assinatura</>
              ) : (
                <><RotateCcw className="w-5 h-5 text-emerald-500" /> {confirmAction?.duration === 'lifetime' ? 'Acesso Vitalício' : 'Aumentar Tempo'}</>
              )}
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.operation === 'cancel'
                ? `Tem certeza que deseja cancelar a assinatura de "${confirmAction?.userName}"? O acesso será encerrado.`
                : `Deseja adicionar mais ${confirmAction?.duration === 'lifetime' ? 'tempo vitalício' : confirmAction?.duration + (confirmAction?.duration === '1' ? ' mês' : ' meses')} para "${confirmAction?.userName}"?`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmAction(null)} disabled={isActionLoading}>
              Voltar
            </Button>
            <Button
              onClick={handleSubscriptionAction}
              disabled={isActionLoading}
              className={confirmAction?.operation === 'cancel'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }
            >
              {isActionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {confirmAction?.operation === 'cancel' ? 'Cancelar' : 'Reativar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Footer ── */}
      <div className="text-center text-xs text-blue-300/60 mt-8 pb-4">
        &copy; {new Date().getFullYear()} Foca.aí — Painel Administrativo
      </div>
    </div>
  );
}

// ─── Stat Card Component ─────────────────────────
function StatCard({ icon, label, value, color, onClick }: { icon: React.ReactNode; label: string; value: number; color: string; onClick?: () => void }) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/10 text-blue-400 ring-blue-500/20',
    emerald: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-emerald-500/20',
    red: 'from-red-500/20 to-red-600/10 text-red-400 ring-red-500/20',
    gray: 'from-gray-500/20 to-gray-600/10 text-gray-400 ring-gray-500/20',
    slate: 'from-slate-500/20 to-slate-600/10 text-slate-400 ring-slate-500/20',
  };

  return (
    <Card 
      onClick={onClick}
      className={`bg-gradient-to-br ${colorMap[color]} border-0 ring-1 shadow-lg ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
    >
      <CardContent className="p-5 flex flex-col items-center text-center gap-2">
        <div className={colorMap[color].split(' ')[2]}>{icon}</div>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm text-white/70 font-medium">{label}</p>
      </CardContent>
    </Card>
  );
}
