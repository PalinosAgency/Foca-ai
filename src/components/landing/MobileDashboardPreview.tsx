import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Wallet, Heart, GraduationCap, Calendar
} from 'lucide-react';
import { MobileOverviewTab } from './preview/MobileOverviewTab';
import { MobileFinanceTab } from './preview/MobileFinanceTab';
import { MobileHealthTab } from './preview/MobileHealthTab';
import { MobileAcademicTab } from './preview/MobileAcademicTab';
import { MobileAgendaTab } from './preview/MobileAgendaTab';

export function MobileDashboardPreview() {
    const [activeTab, setActiveTab] = useState('visao-geral');

    // Mapeamento dos componentes de abas MOBILE
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
        { id: 'visao-geral', icon: LayoutDashboard, label: 'Visão Geral' },
        { id: 'financas', icon: Wallet, label: 'Finanças' },
        { id: 'saude', icon: Heart, label: 'Saúde' },
        { id: 'academico', icon: GraduationCap, label: 'Acad.' },
        { id: 'agenda', icon: Calendar, label: 'Agenda' },
    ];

    return (
        <section className="lg:hidden py-12 px-2 bg-[#040949] text-white">
            <div className="container mx-auto">
                <div className="text-center mb-8 px-4">
                    <h2 className="text-2xl font-bold mb-3">
                        Painel <span className="text-[#0026f7]">Completo</span>
                    </h2>
                    <p className="text-blue-100/80 text-sm max-w-xs mx-auto">
                        Acesse todos os seus dados organizados.
                    </p>
                </div>

                {/* Container responsivo que mantém o aspecto de "tela" mas se adapta a altura */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full max-w-md mx-auto aspect-[9/14] sm:aspect-[4/5]"
                >
                    {/* MOLDURA DO LAPTOP (Adaptada para Mobile - mais alta/estreita mas com visual de laptop) */}
                    <div className="bg-[#121212] rounded-t-xl p-1.5 shadow-2xl ring-1 ring-white/10 w-full h-full">
                        <div className="bg-[#F8FAFC] rounded-lg h-full w-full relative flex flex-col font-sans overflow-hidden">

                            {/* TOP NAV (Estilo Laptop, mas compacta) */}
                            <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-3 shrink-0 z-20">
                                {/* Logo Compacto */}
                                <div className="flex items-center gap-2 shrink-0 mr-2">
                                    <img src="/logo-icon-fundo.png" alt="Icon" className="w-6 h-6 object-contain" />
                                    <span className="font-bold text-lg tracking-tight text-[#040949] hidden xs:block">Foca.aí</span>
                                </div>

                                {/* Tabs com Scroll Horizontal */}
                                <div className="flex-1 overflow-x-auto hide-scrollbar flex items-center gap-2 justify-start mask-linear-fade pl-1">
                                    {tabs.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setActiveTab(item.id)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap snap-start ${activeTab === item.id
                                                ? 'text-[#0026f7] bg-blue-50 shadow-sm ring-1 ring-blue-100'
                                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                                }`}
                                        >
                                            <item.icon className={`w-3.5 h-3.5 ${activeTab === item.id ? 'stroke-2' : 'stroke-[1.5]'}`} />
                                            <span>{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* CONTEÚDO (Scrollável) */}
                            <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-3 custom-scrollbar">
                                {renderTab()}
                            </div>
                        </div>
                    </div>

                    {/* BASE DO LAPTOP */}
                    <div className="bg-[#e2e2e2] h-2 rounded-b-lg w-[96%] mx-auto shadow-md relative mt-[1px]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[20%] h-0.5 bg-gray-300 rounded-b-md"></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
