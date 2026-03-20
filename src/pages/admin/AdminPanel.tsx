import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  UserPlus,
  CheckCircle2,
  LogOut,
  Shield,
  Phone,
  User,
  RefreshCw,
  Clock,
  Users,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Registration {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  sub_status: string | null;
  current_period_end: string | null;
}

export default function AdminPanel() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLog, setIsLoadingLog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getToken = () => sessionStorage.getItem('admin_token');

  // Busca registros recentes
  const fetchRegistrations = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setIsLoadingLog(true);
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'list-registrations' }),
      });

      if (response.status === 401) {
        sessionStorage.removeItem('admin_token');
        navigate('/admin');
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setRegistrations(data.registrations || []);
      }
    } catch {
      // silencioso
    } finally {
      setIsLoadingLog(false);
    }
  }, [navigate]);

  // Verifica auth + carrega registros
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchRegistrations();
  }, [navigate, fetchRegistrations]);

  // Formata telefone brasileiro
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const formatPhoneDisplay = (phone: string | null) => {
    if (!phone) return '—';
    const digits = phone.replace(/^55/, '');
    if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return phone;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');

    const token = getToken();
    if (!token) { navigate('/admin'); return; }

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'register', name: name.trim(), phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({ title: 'Erro', description: data.message, variant: 'destructive' });
        return;
      }

      setSuccessMessage(data.message);
      toast({ title: '✅ Registro realizado!', description: data.message });
      setName('');
      setPhone('');

      // Atualiza a lista
      fetchRegistrations();
    } catch {
      toast({ title: 'Erro de conexão', description: 'Não foi possível conectar.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen w-full bg-[#040949] flex flex-col items-center p-4 sm:p-8">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-8 mt-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-amber-500/20">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Painel Admin</h1>
            <p className="text-blue-300 text-sm">Gerenciamento de registros</p>
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

      {/* Card de registro */}
      <div className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-blue-100">
            <UserPlus className="w-6 h-6 text-[#0026f7]" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Registro Manual</h2>
            <p className="text-sm text-gray-500">Ativa matrícula + 30 dias de assinatura premium</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="reg-name" className="font-bold text-base flex items-center gap-2">
              <User className="w-4 h-4" />
              Nome completo
            </Label>
            <Input
              id="reg-name"
              type="text"
              placeholder="Ex: João Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 focus-visible:ring-[#0026f7] text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-phone" className="font-bold text-base flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Telefone (WhatsApp)
            </Label>
            <Input
              id="reg-phone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={handlePhoneChange}
              className="h-12 focus-visible:ring-[#0026f7] text-base"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 font-bold text-base shadow-md hover:shadow-lg transition-all bg-[#0026f7] hover:bg-[#0026f7]/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
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

        {/* Feedback de sucesso */}
        {successMessage && (
          <Alert className="mt-6 bg-emerald-50 border-emerald-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <AlertDescription className="text-emerald-800 font-medium">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Log de atividades */}
      <div className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 mt-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-purple-100">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Registro de Atividades</h2>
              <p className="text-sm text-gray-500">Últimos 50 usuários registrados</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRegistrations}
            disabled={isLoadingLog}
            className="text-sm"
          >
            {isLoadingLog ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>

        {registrations.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhum registro encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-gray-600">Nome</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-600">Telefone</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-600">Acesso até</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-600">Registrado em</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => {
                  const isActive = reg.sub_status === 'active' &&
                    reg.current_period_end &&
                    new Date(reg.current_period_end) > new Date();

                  return (
                    <tr key={reg.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 font-medium">{reg.name || '—'}</td>
                      <td className="py-3 px-2 text-gray-600">{formatPhoneDisplay(reg.phone)}</td>
                      <td className="py-3 px-2">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Ativo
                          </span>
                        ) : reg.sub_status ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {reg.sub_status === 'canceled' ? 'Cancelado' : 'Expirado'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                            Sem plano
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-gray-600">
                        {reg.current_period_end ? (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(reg.current_period_end).toLocaleDateString('pt-BR')}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="py-3 px-2 text-gray-500 text-xs">
                        {reg.created_at
                          ? new Date(reg.created_at).toLocaleString('pt-BR', {
                              day: '2-digit', month: '2-digit', year: '2-digit',
                              hour: '2-digit', minute: '2-digit'
                            })
                          : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-blue-300/80 mt-8">
        &copy; {new Date().getFullYear()} Foca.aí — Painel Administrativo
      </div>
    </div>
  );
}
