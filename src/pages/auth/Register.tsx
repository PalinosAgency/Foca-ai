import { useState, useEffect } from 'react'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api'; 
import { Loader2, Eye, EyeOff, Mail, RefreshCw, AlertTriangle } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone incompleto'),
  password: z.string().min(8, 'Mínimo de 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    reset();
  }, [reset]);

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await api.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      
      setRegisteredEmail(data.email);
      setIsSuccess(true);
      
      toast({
        title: 'Cadastro realizado!',
        description: 'Verifique seu e-mail para ativar a conta.',
      });

    } catch (error: any) {
      toast({
        title: 'Erro no cadastro',
        description: error.message || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!registeredEmail) return;
    setIsResending(true);
    try {
      await api.resendVerification(registeredEmail);
      toast({
        title: 'E-mail reenviado!',
        description: 'Verifique sua caixa de entrada e SPAM.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao reenviar',
        description: error.message || 'Tente novamente.',
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleGoogleRegister = () => {
    toast({
      title: "Em breve!",
      description: "O cadastro com Google estará disponível nas próximas atualizações.",
    });
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Verifique seu e-mail"
        subtitle="Quase lá! Só falta ativar sua conta."
      >
        <div className="flex flex-col items-center text-center space-y-6 py-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-blue-50 p-5 rounded-full ring-8 ring-blue-50/50">
            <Mail className="w-10 h-10 text-[#0026f7]" />
          </div>
          
          <div className="space-y-4 w-full">
            <div className="space-y-2">
              <p className="text-gray-600">
                Enviamos um link de confirmação para:
              </p>
              <p className="font-bold text-lg text-slate-900 bg-slate-100 py-2 px-4 rounded-lg break-all">
                {registeredEmail}
              </p>
            </div>
            
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-sm text-amber-900 text-left shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-amber-700 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>Não encontrou o e-mail?</span>
              </div>
              <ul className="list-disc ml-4 space-y-1 opacity-90">
                <li>Verifique sua pasta de <b>Spam</b> ou <b>Lixo Eletrônico</b>.</li>
                <li>O e-mail pode levar até 2 minutos para chegar.</li>
              </ul>
            </div>
          </div>

          <div className="w-full pt-4 space-y-3">
            <Button asChild className="w-full h-12 text-base font-bold bg-[#0026f7] hover:bg-[#0026f7]/90 text-white shadow-md">
              <Link to="/login">Já confirmei, ir para Login</Link>
            </Button>
            
            <button 
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full py-2 text-sm text-gray-500 hover:text-[#0026f7] flex items-center justify-center gap-2 transition-colors font-medium disabled:opacity-50"
            >
              {isResending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {isResending ? 'Enviando...' : 'Não recebeu? Reenviar link'}
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Criar nova conta"
      subtitle="Comece sua jornada de organização hoje mesmo."
    >
      
      {/* --- BOTÃO GOOGLE --- */}
      <div className="mb-6 space-y-4">
        <Button 
          variant="outline" 
          type="button" 
          onClick={handleGoogleRegister}
          className="w-full h-11 font-bold bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow-md"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Criar conta com Google
        </Button>

        <div className="relative flex items-center">
          <span className="w-full border-t border-gray-200" />
          <span className="absolute left-1/2 -translate-x-1/2 bg-white px-2 text-xs uppercase text-gray-500 font-medium">
            Ou use seu e-mail
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
        
        <div className="space-y-2">
          <Label htmlFor="name" className="font-bold text-base">Nome completo</Label>
          <Input 
            id="name" 
            placeholder="Ex: João Silva" 
            {...register('name')} 
            autoComplete="off" 
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="font-bold text-base">Seu melhor e-mail</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="nome@exemplo.com" 
            {...register('email')} 
            autoComplete="off" 
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="font-bold text-base">WhatsApp / Celular</Label>
          <Input 
            id="phone" 
            type="tel" 
            placeholder="(00) 00000-0000" 
            {...register('phone')} 
            autoComplete="off" 
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="font-bold text-base">Senha</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Mín. 8 chars" 
                {...register('password')} 
                className="pr-10"
                autoComplete="new-password"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-bold text-base">Confirmar</Label>
            <div className="relative">
              <Input 
                id="confirmPassword" 
                type={showConfirmPassword ? 'text' : 'password'} 
                placeholder="Repita a senha" 
                {...register('confirmPassword')} 
                className="pr-10"
                autoComplete="new-password"
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 font-bold text-base mt-2 shadow-md hover:shadow-lg transition-all bg-[#0026f7] hover:bg-[#0026f7]/90 text-white" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            'Finalizar cadastro'
          )}
        </Button>

        <p className="text-center text-xs text-gray-600 pt-2 leading-relaxed">
          Ao se cadastrar, você aceita nossos <Link to="/terms" className="underline hover:text-[#0026f7]">Termos de Uso</Link> e <Link to="/privacy" className="underline hover:text-[#0026f7]">Política de Privacidade</Link>.
        </p>

        <div className="text-center pt-3 border-t mt-4">
          <p className="text-sm text-gray-600">
            Já possui cadastro?{' '}
            <Link to="/login" state={location.state} className="text-[#0026f7] font-bold hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}