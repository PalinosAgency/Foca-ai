import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Wallet, Heart, GraduationCap, Calendar,
} from 'lucide-react';
import { OverviewTab } from './preview/OverviewTab';
import { FinanceTab } from './preview/FinanceTab';
import { HealthTab } from './preview/HealthTab';
import { AcademicTab } from './preview/AcademicTab';
import { AgendaTab } from './preview/AgendaTab';

export function DesktopDashboardPreview() {
    const [activeTab, setActiveTab] = useState('visao-geral');

    const DashboardScreen = () => (
        <>
            {/* TOP NAV (Limpa) */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-20">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2.5">
                        <img
                            src="/logo-icon-fundo.png"
                            alt="Icon"
                            className="w-8 h-8 object-contain"
                        />
                        <span className="font-bold text-xl tracking-tight text-[#040949]">
                            Foca.aí
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        {[
                            { id: 'visao-geral', icon: LayoutDashboard, label: 'Geral' },
                            { id: 'financas', icon: Wallet, label: 'Finanças' },
                            { id: 'academico', icon: GraduationCap, label: 'Acad.' },
                            { id: 'saude', icon: Heart, label: 'Saúde' },
                            { id: 'agenda', icon: Calendar, label: 'Agenda' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === item.id
                                    ? 'text-[#0026f7] bg-blue-50 shadow-sm ring-1 ring-blue-100'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'stroke-2' : 'stroke-[1.5]'}`} />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>


            </div>

            {/* CONTEÚDO */}
            <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 custom-scrollbar scrollbar-none">
                {activeTab === 'visao-geral' && <OverviewTab onNavigate={setActiveTab} />}
                {activeTab === 'financas' && <FinanceTab />}
                {activeTab === 'saude' && <HealthTab />}
                {activeTab === 'academico' && <AcademicTab />}
                {activeTab === 'agenda' && <AgendaTab />}
            </div>
        </>
    );

    return (
        <section className="hidden lg:block py-24 px-4 overflow-hidden bg-[#040949]">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-white">
                        Seu painel de controle <span className="text-[#0026f7]">completo</span>
                    </h2>
                    <p className="text-blue-100/80 text-lg max-w-2xl mx-auto">
                        Acesse todos os seus dados organizados pelo computador ou celular.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 w-full aspect-[16/10]"
                    >
                        {/* LAPTOP FRAME */}
                        <div className="bg-[#1a1a1a] rounded-[1.5rem] p-[3%] shadow-2xl ring-1 ring-white/5 w-full h-full relative">

                            {/* Camera / Webcam */}
                            <div className="absolute top-[1.2%] left-1/2 -translate-x-1/2 w-[0.8%] h-[0.8%] bg-[#0a0a0a] rounded-full ring-1 ring-white/10 z-30 flex items-center justify-center">
                                <div className="w-[40%] h-[40%] bg-[#2a2a2a] rounded-full"></div>
                            </div>

                            {/* Screen Container */}
                            <div className="bg-[#000] rounded-xl h-full w-full relative overflow-hidden ring-1 ring-black/50">

                                {/* Screen Reflection (Glass Effect) */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent z-20 pointer-events-none opacity-50 rounded-xl"></div>

                                {/* Actual Dashboard Content */}
                                <div className="h-full w-full bg-[#F8FAFC] flex flex-col font-sans relative z-10">
                                    <DashboardScreen />
                                </div>
                            </div>
                        </div>

                        {/* LAPTOP BASE / HINGE */}
                        <div className="relative w-[102%] -left-[1%] mt-[-1%]">
                            {/* Hinge */}
                            <div className="h-4 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] w-[80%] mx-auto rounded-b-lg shadow-lg relative z-0"></div>
                            {/* Base Top Edge */}
                            <div className="h-2 bg-[#2a2a2a] w-full rounded-t-sm mt-[-2px]"></div>
                            {/* Base Body */}
                            <div className="h-3 bg-[#e2e2e2] w-full rounded-b-xl shadow-xl flex justify-center border-t border-white/20">
                                {/* Thumb Notch */}
                                <div className="w-[15%] h-1.5 bg-[#d4d4d4] rounded-b-md"></div>
                            </div>
                        </div>

                    </motion.div>

                    {/* Brilho de Fundo */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#0026f7]/20 blur-[100px] -z-10 rounded-full"></div>
                </div>

            </div>
        </section>
    );
}
