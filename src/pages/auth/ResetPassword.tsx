import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Loader2, Eye, EyeOff, Check, ArrowLeft, CheckCircle } from 'lucide-react';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password', '');
  const passwordRequirements = [
    { label: 'Mínimo 8 caracteres', met: password.length >= 8 },
    { label: 'Uma letra maiúscula', met: /[A-Z]/.test(password) },
    { label: 'Uma letra minúscula', met: /[a-z]/.test(password) },
    { label: 'Um número', met: /[0-9]/.test(password) },
  ];

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast({
        title: 'Link inválido',
        description: 'O link de redefinição de senha é inválido ou expirou.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await api.resetPassword({ token, password: data.password });
      setIsSuccess(true);
    } catch (error) {
      toast({
        title: 'Erro ao redefinir senha',
        description: error instanceof Error ? error.message : 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout
        title="Link inválido"
        subtitle="Este link de redefinição de senha é inválido ou expirou"
      >
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Solicite um novo link de redefinição de senha.
          </p>
          <Button asChild className="w-full bg-[#0026f7] hover:bg-[#0026f7]/90 h-12">
            <Link to="/forgot-password">Solicitar novo link</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (isSuccess) {
    return (
      <AuthLayout
        title="Senha redefinida!"
        subtitle="Sua senha foi alterada com sucesso"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600 mb-6">
            Agora você pode fazer login com sua nova senha.
          </p>
          <Button asChild className="w-full bg-[#0026f7] hover:bg-[#0026f7]/90 h-12 font-bold text-base">
            <Link to="/login">Ir para o login</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Criar nova senha"
      subtitle="Digite sua nova senha abaixo"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          {/* Label Negrito */}
          <Label htmlFor="password" classname="font-bold text-base">Nova senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              // CORREÇÃO: Isso diz ao navegador "Não preencha a antiga, isso é uma NOVA senha"
              autoComplete="new-password"
              className="h-11 pr-10 focus-visible:ring-[#0026f7]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            {passwordRequirements.map((req) => (
              <div
                key={req.label}
                className={`flex items-center gap-1.5 text-xs font-medium ${
                  req.met ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                <Check className={`w-3 h-3 ${req.met ? 'opacity-100' : 'opacity-30'}`} />
                {req.label}
              </div>
            ))}
          </div>
          {errors.password && (
            <p className="text-sm text-destructive font-medium">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
           {/* Label Negrito */}
          <Label htmlFor="confirmPassword" classname="font-bold text-base">Confirmar nova senha</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('confirmPassword')}
              // CORREÇÃO: Mesma coisa aqui
              autoComplete="new-password"
              className="h-11 pr-10 focus-visible:ring-[#0026f7]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Botão Azul da Marca */}
        <Button 
          type="submit" 
          className="w-full h-12 font-bold text-base shadow-md hover:shadow-lg transition-all bg-[#0026f7] hover:bg-[#0026f7]/90 text-white" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Redefinindo...
            </>
          ) : (
            'Redefinir senha'
          )}
        </Button>

        <Button variant="ghost" asChild className="w-full text-gray-600 hover:text-[#0026f7] hover:bg-blue-50">
          <Link to="/login">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o login
          </Link>
        </Button>
      </form>
    </AuthLayout>
  );
}