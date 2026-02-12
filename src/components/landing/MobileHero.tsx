import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PhoneMockup } from '@/components/landing/PhoneMockup';

export function MobileHero() {
    const { isAuthenticated } = useAuth();

    return (
        <section className="lg:hidden relative pt-24 pb-12 px-4 overflow-hidden bg-[#040949] text-white">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0224F7]/10 to-transparent -z-10" />

            <div className="container mx-auto relative z-10 flex flex-col items-center">

                {/* Texto Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full text-center max-w-md mx-auto mb-10"
                >
                    <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-[#0224F7]/10 text-blue-200 text-xs font-medium mb-6 border border-[#0224F7]/20">
                        <Sparkles className="w-3 h-3 text-[#0224F7]" />
                        Seu assistente no WhatsApp
                    </div>

                    <h1 className="text-4xl font-extrabold mb-4 leading-tight text-white tracking-tight">
                        Organize sua vida inteira <br />
                        <span className="text-[#0224F7]">sem sair do WhatsApp</span>
                    </h1>

                    <p className="text-lg text-blue-100/80 mb-8 leading-relaxed max-w-sm mx-auto">
                        Controle finanças, hábitos de saúde, estudos e agenda, tudo pelo WhatsApp. Dashboard completo com gráficos e insights.
                    </p>

                    <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
                        <Button asChild size="lg" className="w-full h-14 text-lg bg-[#0224F7] hover:bg-[#0224F7]/90 text-white shadow-lg shadow-blue-900/50 transition-all rounded-2xl border-0 font-bold">
                            <Link to={isAuthenticated ? "#precos" : "/register"}>
                                Começar Grátis
                                <ChevronRight className="w-5 h-5 ml-1" />
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" size="lg" className="w-full h-12 text-base text-blue-200 hover:text-white hover:bg-white/5 rounded-xl">
                            <a href="#como-funciona">
                                Ver como funciona
                            </a>
                        </Button>
                    </div>

                    <p className="text-xs text-blue-200/50 mt-4 flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-green-400" /> Teste grátis de 3 dias
                    </p>
                </motion.div>

                {/* Componente do iPhone - Ajustado para mobile */}
                <div className="w-full max-w-[280px] xs:max-w-[300px] mx-auto scale-95 origin-top">
                    <PhoneMockup />
                </div>
            </div>
        </section>
    );
}
