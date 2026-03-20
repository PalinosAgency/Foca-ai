import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RegisteredUser {
  name: string;
  phone: string;
  subscriptionEnd: string;
}

export default function AdminPanel() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastRegistered, setLastRegistered] = useState<RegisteredUser | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verifica se está autenticado como admin
  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  // Formata telefone no padrão brasileiro enquanto digita
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLastRegistered(null);

    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'register-investor', name: name.trim(), phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: 'Erro ao registrar',
          description: data.message || 'Erro desconhecido.',
          variant: 'destructive',
        });
        return;
      }

      // Sucesso!
      setLastRegistered({
        name: data.user.name,
        phone: data.user.phone,
        subscriptionEnd: new Date(data.subscription.current_period_end).toLocaleDateString('pt-BR'),
      });

      toast({
        title: '✅ Investidor registrado!',
        description: data.message,
      });

      // Limpa formulário
      setName('');
      setPhone('');
    } catch {
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível conectar com o servidor.',
        variant: 'destructive',
      });
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
      <div className="w-full max-w-lg flex items-center justify-between mb-8 mt-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-amber-500/20">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Painel Admin</h1>
            <p className="text-blue-300 text-sm">Registro rápido de investidores</p>
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

      {/* Card principal */}
      <div className="w-full max-w-lg bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-blue-100">
            <UserPlus className="w-6 h-6 text-[#0026f7]" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Registrar Investidor</h2>
            <p className="text-sm text-gray-500">Ativa matrícula + 30 dias de assinatura premium</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="investor-name" className="font-bold text-base flex items-center gap-2">
              <User className="w-4 h-4" />
              Nome completo
            </Label>
            <Input
              id="investor-name"
              type="text"
              placeholder="Ex: João Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 focus-visible:ring-[#0026f7] text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="investor-phone" className="font-bold text-base flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Telefone (WhatsApp)
            </Label>
            <Input
              id="investor-phone"
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
                Registrar Investidor
              </>
            )}
          </Button>
        </form>

        {/* Feedback de sucesso */}
        {lastRegistered && (
          <Alert className="mt-6 bg-emerald-50 border-emerald-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <AlertDescription className="text-emerald-800">
              <p className="font-bold mb-1">Investidor registrado com sucesso!</p>
              <p><strong>Nome:</strong> {lastRegistered.name}</p>
              <p><strong>Telefone:</strong> {lastRegistered.phone}</p>
              <p><strong>Acesso até:</strong> {lastRegistered.subscriptionEnd}</p>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-blue-300/80 mt-8">
        &copy; {new Date().getFullYear()} Foca.aí — Painel Administrativo
      </div>
    </div>
  );
}
