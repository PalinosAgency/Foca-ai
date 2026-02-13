import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Loader2, Mail, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Insira um e-mail válido'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      await api.forgotPassword(data.email);
      setSentEmail(data.email);
      setIsSuccess(true);
      toast({
        title: 'E-mail enviado',
        description: 'Verifique sua caixa de entrada.',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Tente novamente.';
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await api.forgotPassword(sentEmail);
      toast({
        title: 'Reenviado!',
        description: 'Verifique também o SPAM.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível reenviar.',
      });
    } finally {
      setIsResending(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Verifique seu e-mail"
        subtitle="Enviamos as instruções de recuperação."
      >
        <div className="flex flex-col items-center text-center space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-blue-50 p-5 rounded-full ring-8 ring-blue-50/50">
            <Mail className="w-10 h-10 text-[#0026f7]" />
          </div>

          <div className="space-y-4 w-full">
            <div className="space-y-2">
              <p className="text-gray-600">Link enviado para:</p>
              <p className="font-bold text-lg text-slate-900 bg-slate-100 py-2 px-4 rounded-lg break-all">
                {sentEmail}
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-sm text-amber-900 text-left shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-amber-700 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>Não encontrou?</span>
              </div>
              <ul className="list-disc ml-4 space-y-1 opacity-90">
                <li>Verifique a caixa de <b>Spam</b> ou <b>Lixo Eletrônico</b>.</li>
                <li>O e-mail pode levar até 2 minutos para chegar.</li>
              </ul>
            </div>
          </div>

          <div className="w-full pt-4 space-y-3">
            <Button asChild className="w-full h-12 text-base font-bold bg-[#0026f7] hover:bg-[#0026f7]/90 text-white shadow-md">
              <Link to="/login">
                Voltar para Login
              </Link>
            </Button>

            <button
              onClick={handleResend}
              disabled={isResending}
              className="w-full py-2 text-sm text-gray-500 hover:text-[#0026f7] flex items-center justify-center gap-2 transition-colors font-medium disabled:opacity-50"
            >
              {isResending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {isResending ? 'Enviando...' : 'Não recebeu? Reenviar e-mail'}
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Esqueceu a senha?"
      subtitle="Digite seu e-mail para receber um link de redefinição."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">

        {/* --- HACK DE SEGURANÇA: INPUTS FANTASMAS --- */}
        {/* Estes inputs invisíveis atraem o preenchimento automático do navegador 
            para que o campo real abaixo fique limpo. */}
        <div className="w-0 h-0 overflow-hidden opacity-0 pointer-events-none absolute" aria-hidden="true">
          <input type="text" name="fake_email_prevent_autofill" tabIndex={-1} />
          <input type="password" name="fake_password_prevent_autofill" tabIndex={-1} />
        </div>
        {/* ------------------------------------------- */}

        <div className="space-y-2">
          <Label htmlFor="email" className="font-bold text-base">E-mail cadastrado</Label>
          <Input
            id="email"
            type="email"
            placeholder="nome@exemplo.com"
            {...register('email')}
            // autoComplete="new-password" às vezes funciona melhor que "off"
            autoComplete="new-password"
            className="h-12"
          />
          {errors.email && (
            <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 font-bold text-base bg-[#0026f7] hover:bg-[#0026f7]/90 text-white shadow-md transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar link de recuperação'
          )}
        </Button>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-gray-500 hover:text-[#0026f7] flex items-center justify-center gap-2 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}