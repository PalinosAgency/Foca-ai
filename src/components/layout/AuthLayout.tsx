import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    // Fundo Deep Blue da marca preenchendo a tela
    <div className="min-h-screen w-full bg-[#040949] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      
      {/* Botão Voltar (Texto claro para contraste) */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm font-medium group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Voltar para o início
      </Link>

      <div className="w-full max-w-[420px] flex flex-col gap-8 items-center z-10">
        
        {/* CABEÇALHO: Logo Composta (Ícone + Texto Foca.aí) */}
        <div className="flex flex-col items-center text-center space-y-6 mb-2">
          {/* CORREÇÃO VISUAL:
              Substituído logo-full.png por Ícone + Texto customizado.
              Isso garante o "F" maiúsculo conforme a diretriz da marca.
          */}
          <div className="flex flex-col items-center gap-4">
            <img 
              src="/logo-icon-fundo.png" 
              alt="Ícone Foca.aí" 
              className="h-24 w-24 object-contain drop-shadow-lg" 
            />
            <span className="text-5xl font-bold tracking-tight text-white drop-shadow-md">
              Foca.aí
            </span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {title}
            </h1>
            <p className="text-blue-200 text-sm sm:text-base">
              {subtitle}
            </p>
          </div>
        </div>

        {/* CONTEÚDO (Card Branco para Contraste) 
            CORREÇÃO: Adicionado 'text-slate-900' para garantir que TODO o texto dentro
            do card seja escuro, prevenindo herança de cor branca do tema escuro.
        */}
        <div className="w-full bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-300">
          {children}
        </div>

        {/* FOOTER (Texto claro) */}
        <div className="text-center text-xs text-blue-300/80">
          &copy; {new Date().getFullYear()} Foca.aí. Todos os direitos reservados.
        </div>

      </div>
    </div>
  );
}