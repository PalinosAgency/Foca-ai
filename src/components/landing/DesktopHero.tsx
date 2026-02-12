import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PhoneMockup } from '@/components/landing/PhoneMockup';

export function DesktopHero() {
    const { isAuthenticated } = useAuth();

    return (
        <section className="hidden lg:block relative pt-32 pb-20 px-4 overflow-hidden bg-[#040949] text-white">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0224F7]/10 to-transparent -z-10" />

            <div className="container mx-auto relative z-10">
                <div className="flex flex-row items-center gap-20">

                    {/* Texto Hero */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 text-left max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0224F7]/10 text-blue-200 text-sm font-medium mb-6 border border-[#0224F7]/20">
                            <Sparkles className="w-4 h-4 text-[#0224F7]" />
                            Seu assistente pessoal no WhatsApp
                        </div>

                        <h1 className="text-6xl font-bold mb-6 leading-tight text-white">
                            Organize sua vida inteira{' '}
                            <span className="text-[#0224F7] whitespace-nowrap">sem sair do WhatsApp</span>
                        </h1>

                        <p className="text-xl text-blue-100/80 mb-8">
                            Controle finanças, hábitos de saúde, estudos e agenda, tudo pelo WhatsApp.
                            Dashboard completo com gráficos e insights.
                        </p>

                        <div className="flex flex-row gap-4 justify-start">
                            <Button asChild size="lg" className="text-lg px-8 h-12 bg-[#0224F7] hover:bg-[#0224F7]/90 text-white shadow-lg shadow-blue-900/50 transition-all rounded-full border-0">
                                <Link to={isAuthenticated ? "#precos" : "/register"}>
                                    Começar Grátis
                                    <ChevronRight className="w-5 h-5 ml-1" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="text-lg px-8 h-12 rounded-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
                                <a href="#como-funciona">
                                    Ver como funciona
                                </a>
                            </Button>
                        </div>

                        <p className="text-sm text-blue-200/60 mt-6 flex items-center justify-start gap-2">
                            <Check className="w-4 h-4 text-green-400" /> 3 dias grátis para testar
                        </p>
                    </motion.div>

                    {/* Componente do iPhone isolado */}
                    <PhoneMockup />
                </div>
            </div>
        </section>
    );
}
