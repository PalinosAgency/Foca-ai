import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Wallet, Heart, GraduationCap, Calendar, Settings, LogOut
} from 'lucide-react';
import { MobileOverviewTab } from './preview/MobileOverviewTab';
import { MobileFinanceTab } from './preview/MobileFinanceTab';
import { MobileHealthTab } from './preview/MobileHealthTab';
import { MobileAcademicTab } from './preview/MobileAcademicTab';
import { MobileAgendaTab } from './preview/MobileAgendaTab';

export function MobileDashboardPreview() {
    const [activeTab, setActiveTab] = useState('visao-geral');

    const renderTab = () => {
        switch (activeTab) {
            case 'visao-geral': return <MobileOverviewTab />;
            case 'financas': return <MobileFinanceTab />;
            case 'saude': return <MobileHealthTab />;
            case 'academico': return <MobileAcademicTab />;
            case 'agenda': return <MobileAgendaTab />;
            default: return <MobileOverviewTab />;
        }
    };

    const tabs = [
        { id: 'visao-geral', icon: LayoutDashboard, label: 'Geral' },
        { id: 'financas', icon: Wallet, label: 'Finanças' },
        { id: 'academico', icon: GraduationCap, label: 'Acad.' },
        { id: 'saude', icon: Heart, label: 'Saúde' },
        { id: 'agenda', icon: Calendar, label: 'Agenda' },
    ];

    return (
        <section className="lg:hidden py-12 px-2 bg-[#040949] text-white">
            <div className="container mx-auto">
                <div className="text-center mb-8 px-4">
                    <h2 className="text-2xl font-bold mb-3">
                        Seu painel de controle <span className="text-[#0026f7]">completo</span>
                    </h2>
                    <p className="text-blue-100/80 text-sm max-w-xs mx-auto">
                        Acesse todos os seus dados organizados pelo computador ou celular.
                    </p>
                </div>

                {/* Container do "Tablet/Notebook" */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    // Aspect ratio mais quadrado para simular um tablet/notebook aberto
                    className="w-full max-w-md mx-auto aspect-[4/5] sm:aspect-[4/3] relative"
                >
                    <div className="bg-[#121212] rounded-xl p-2 shadow-2xl ring-1 ring-white/10 w-full h-full flex flex-col">

                        {/* TELA INTERNA */}
                        <div className="bg-[#F8FAFC] rounded-lg flex-1 w-full overflow-hidden flex font-sans relative">

                            {/* SIDEBAR (Navegação Lateral) */}
                            <div className="w-14 bg-[#040949] flex flex-col items-center py-4 gap-4 shrink-0 shadow-xl z-20">
                                {/* Logo Mini - Fixed: No background box, just the icon */}
                                <div className="flex items-center justify-center mb-2">
                                    <img src="/logo-icon-fundo.png" alt="Foca" className="w-8 h-8 object-contain" />
                                </div>

                                {/* Menu Items */}
                                <div className="flex flex-col gap-3 w-full px-2">
                                    {tabs.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-300 relative group ${activeTab === item.id
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'text-blue-200/60 hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {/* Tooltip simples */}
                                            {activeTab !== item.id && (
                                                <span className="absolute left-full ml-2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                                                    {item.label}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* MAIN CONTENT AREA */}
                            <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
                                {/* Header da Aplicação Simulada */}
                                <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 sticky top-0 z-10">
                                    <div>
                                        <h3 className="text-[#040949] font-bold text-sm leading-tight">Olá, Visitante</h3>
                                        <p className="text-gray-400 text-[10px] font-medium">
                                            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                        </p>
                                    </div>
                                    {/* Removed User Avatar as requested */}
                                </header>

                                {/* Área de Scroll do Conteúdo */}
                                <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                                    <div className="max-w-md mx-auto">
                                        {renderTab()}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
