import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState("Verificando sua conta...");

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage("Link de verificação inválido.");
      return;
    }

    const verify = async () => {
      try {
        await api.verifyEmail(token); // Chama a função no api.ts
        setStatus('success');
        setMessage("Sua conta foi verificada com sucesso!");
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || "Não foi possível verificar seu e-mail.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center space-y-6">
        
        {/* LOADING */}
        {status === 'loading' && (
          <>
            <Loader2 className="h-16 w-16 text-[#0026f7] animate-spin mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Validando...</h2>
            <p className="text-gray-500">{message}</p>
          </>
        )}

        {/* SUCESSO */}
        {status === 'success' && (
          <>
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600">Verificado!</h2>
            <p className="text-gray-600">{message}</p>
            <Button asChild className="w-full bg-[#0026f7] hover:bg-[#0026f7]/90 mt-4">
              <Link to="/login">Ir para Login</Link>
            </Button>
          </>
        )}

        {/* ERRO */}
        {status === 'error' && (
          <>
            <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-600">Ops!</h2>
            <p className="text-gray-600">{message}</p>
            <Button variant="outline" asChild className="w-full mt-4">
              <Link to="/login">Voltar ao Login</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}