import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Zap, Check } from 'lucide-react';
import { PhoneMockup } from './PhoneMockup';

export function HeroSection() {
  return (
    // AJUSTE: pt-20 no mobile para subir o conteúdo e "descolar" do topo sem exagerar
    <section className="relative pt-20 pb-12 md:pt-32 md:pb-20 px-4 overflow-hidden bg-white">
      {/* Background Gradient Suave no topo */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
          
          {/* Texto Hero */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0"
          >
            {/* BADGE: Ficou um pouco menor (text-xs) e com padding ajustado */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 md:px-4 md:py-2 rounded-full bg-[#0026f7]/10 text-[#0026f7] text-xs md:text-sm font-semibold mb-4 md:mb-6 border border-[#0026f7]/20">
              <Zap className="w-3 h-3 md:w-4 md:h-4 fill-current" />
              Gestão Inteligente via WhatsApp
            </div>
            
            {/* TÍTULO: Reduzi para text-3xl no mobile para não ocupar a tela toda */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight text-[#040949] tracking-tight">
              Organize sua vida inteira{' '}
              <span className="text-[#0026f7] whitespace-nowrap">sem sair do Zap</span>
            </h1>
            
            {/* TEXTO DE APOIO: Levemente menor no mobile */}
            <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed px-2 md:px-0">
              Controle finanças, hábitos de saúde, estudos e agenda enviando mensagens simples. 
              Tudo sincronizado automaticamente em um dashboard poderoso.
            </p>
            
            {/* BOTÕES: Mais compactos no mobile (h-11 em vez de h-12) */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start w-full sm:w-auto px-4 sm:px-0">
              <Button asChild size="lg" className="w-full sm:w-auto h-11 md:h-12 text-sm md:text-lg px-6 md:px-8 bg-[#0026f7] hover:bg-[#0026f7]/90 shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5 font-bold rounded-xl">
                <Link to="/register">
                  Testar Grátis Agora
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-11 md:h-12 text-sm md:text-lg px-6 md:px-8 border-[#040949]/20 text-[#040949] hover:bg-gray-50 rounded-xl">
                <a href="#como-funciona">
                  Ver como funciona
                </a>
              </Button>
            </div>
            
            <p className="text-xs md:text-sm text-gray-500 mt-4 md:mt-6 flex items-center justify-center lg:justify-start gap-1.5">
              <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" /> Sem cartão de crédito para começar
            </p>
          </motion.div>

          {/* Visual Hero - Container ajustado */}
          <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-md lg:max-w-none flex justify-center mt-2 md:mt-0">
            <PhoneMockup />
          </div>
          
        </div>
      </div>
    </section>
  );
}