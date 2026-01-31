import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Zap, Check } from 'lucide-react';
import { PhoneMockup } from './PhoneMockup';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-white">
      {/* Background Gradient Suave no topo */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Texto Hero */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0"
          >
            {/* BADGE DE FUNCIONALIDADE (NOVO) */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0026f7]/10 text-[#0026f7] text-sm font-semibold mb-6 border border-[#0026f7]/20">
              <Zap className="w-4 h-4 fill-current" />
              Gestão Inteligente via WhatsApp
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-[#040949]">
              Organize sua vida inteira{' '}
              <span className="text-[#0026f7] whitespace-nowrap">sem sair do Zap</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Controle finanças, hábitos de saúde, estudos e agenda enviando mensagens simples. 
              Tudo sincronizado automaticamente em um dashboard poderoso.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="text-lg px-8 h-12 bg-[#0026f7] hover:bg-[#0026f7]/90 shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5 font-bold">
                <Link to="/register">
                  Testar Grátis Agora
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 h-12 border-[#040949]/20 text-[#040949] hover:bg-gray-50">
                <a href="#como-funciona">
                  Ver como funciona
                </a>
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 mt-6 flex items-center justify-center lg:justify-start gap-2">
              <Check className="w-4 h-4 text-green-600" /> Sem cartão de crédito para começar
            </p>
          </motion.div>

          {/* Visual Hero - Componente Isolado */}
          <PhoneMockup />
          
        </div>
      </div>
    </section>
  );
}