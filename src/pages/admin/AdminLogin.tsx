import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Credenciais inválidas.');
        return;
      }

      // Salva token admin no sessionStorage (limpa ao fechar aba)
      sessionStorage.setItem('admin_token', data.token);

      toast({ title: 'Login admin realizado!' });
      navigate('/admin/panel');
    } catch {
      setError('Erro ao conectar com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Painel Administrativo"
      subtitle="Acesso exclusivo da equipe Foca.aí"
    >
      <div className="flex items-center justify-center mb-6">
        <div className="p-3 rounded-full bg-amber-100">
          <Shield className="w-8 h-8 text-amber-600" />
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="admin-user" className="font-bold text-base">Usuário</Label>
          <Input
            id="admin-user"
            type="text"
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-12 focus-visible:ring-amber-500 text-base"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-pass" className="font-bold text-base">Senha</Label>
          <div className="relative">
            <Input
              id="admin-pass"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite a senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 focus-visible:ring-amber-500 pr-10 text-base"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 font-bold text-base shadow-md hover:shadow-lg transition-all bg-amber-600 hover:bg-amber-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Entrando...
            </>
          ) : (
            'Acessar Painel Admin'
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
