import { useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGoogleLogin } from '@react-oauth/google';

const loginSchema = z.object({
  email: z.string().email('Insira um e-mail válido'),
  password: z.string().min(1, 'A senha é obrigatória'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, loginWithGoogle } = useAuth();
  const { addItem, setIsOpen } = useCart();
  const [searchParams] = useSearchParams();
  const registered = searchParams.get('registered');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await loginWithGoogle(tokenResponse.access_token);
        
        const state = location.state as { from?: string; action?: string; plan?: any } | null;
        if (state?.action === 'add_to_cart' && state.plan) {
          addItem({
            id: state.plan.id,
            name: state.plan.name,
            price: state.plan.price,
            quantity: 1,
            type: 'subscription'
          });
          setIsOpen(true);
          navigate('/');
          toast({ title: "Login realizado!", description: "Finalize sua compra." });
        } else {
          navigate('/');
          toast({ title: "Bem-vindo de volta!" });
        }
      } catch (error) {
        toast({
          title: "Erro no Login Google",
          description: "Não foi possível conectar sua conta.",
          variant: "destructive"
        });
      }
    },
    onError: () => {
      toast({ title: "Erro", description: "Falha ao abrir popup do Google.", variant: "destructive" });
    }
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      
      const state = location.state as { from?: string; action?: string; plan?: any } | null;

      if (state?.action === 'add_to_cart' && state.plan) {
        addItem({
          id: state.plan.id,
          name: state.plan.name,
          price: state.plan.price,
          quantity: 1,
          type: 'subscription'
        });
        setIsOpen(true);
        navigate('/'); 
        toast({ title: "Login realizado!", description: "Finalize sua compra no carrinho." });
      } else {
        navigate('/'); 
      }

    } catch (error: any) {
      toast({
        title: 'Acesso negado',
        description: error.message || 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-zoom-wrapper">
      <div className="w-full max-w-md">
        <AuthLayout
          title="Bem-vindo de volta"
          subtitle="Acesse sua conta para continuar."
        >
          {registered && (
            <Alert className="bg-green-50 border-green-200 text-green-800 mb-6">
              <AlertDescription>
                Conta criada! Verifique seu e-mail para ativar.
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-6 space-y-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => googleLogin()}
              className="w-full h-12 font-bold bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3 shadow-sm transition-all hover:shadow-md text-base"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Entrar com Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-base">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                {...register('email')}
                className="h-11 focus-visible:ring-[#0026f7]"
              />
              {errors.email && (
                <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-bold text-base">Senha</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#0026f7] font-semibold hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  {...register('password')}
                  className="h-11 focus-visible:ring-[#0026f7] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 font-bold text-base shadow-md hover:shadow-lg transition-all bg-[#0026f7] hover:bg-[#0026f7]/90 text-white" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar na plataforma'
              )}
            </Button>

            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Ainda não tem uma conta?{' '}
                <Link to="/register" state={location.state} className="text-[#0026f7] font-bold hover:underline">
                  Criar conta grátis
                </Link>
              </p>
            </div>
          </form>
        </AuthLayout>
      </div>
    </div>
  );
}