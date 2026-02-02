import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Wallet, Heart, GraduationCap, Calendar, 
  Menu, Search, Bell
} from 'lucide-react';

// Importação das Abas
import { OverviewTab } from './preview/OverviewTab';
import { FinanceTab } from './preview/FinanceTab';
import { HealthTab } from './preview/HealthTab';
import { AcademicTab } from './preview/AcademicTab';
import { AgendaTab } from './preview/AgendaTab';

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState('visao-geral');

  return (
    <section className="py-12 md:py-24 px-4 overflow-x-clip bg-[#040949]">
      <div className="container mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
            Seu painel de controle <span className="text-[#0026f7]">completo</span>
          </h2>
          <p className="text-blue-100/80 text-base md:text-lg max-w-2xl mx-auto">
            Acesse todos os seus dados organizados pelo computador ou celular.
          </p>
        </div>

        <div className="max-w-6xl mx-auto relative px-2 md:px-0">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            {/* MOLDURA DO LAPTOP */}
            <div className="bg-[#121212] rounded-t-xl md:rounded-t-2xl p-1 sm:p-2 shadow-2xl ring-1 ring-white/10 mx-auto w-full aspect-[16/10] sm:aspect-[16/9] max-w-[1000px]">
              <div className="bg-[#F8FAFC] rounded-lg h-full w-full relative overflow-hidden flex flex-col font-sans">
                
                {/* --- TOP NAV --- */}
                {/* AJUSTE: h-12 no mobile, h-16 no desktop */}
                <div className="h-12 md:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 md:px-8 flex-shrink-0 z-20">
                  <div className="flex items-center gap-4 md:gap-8">
                    <div className="flex items-center gap-3">
                      <div className="md:hidden">
                        <Menu className="w-5 h-5 text-gray-500" />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <img 
                          src="/logo-icon-fundo.png" 
                          alt="Icon" 
                          className="w-6 h-6 md:w-8 md:h-8 object-contain"
                        />
                        <span className="font-bold text-base md:text-lg tracking-tight text-[#040949] hidden sm:inline">
                          Foca.aí
                        </span>
                      </div>
                    </div>

                    <div className="hidden md:flex items-center gap-1">
                      {[
                        { id: 'visao-geral', icon: LayoutDashboard, label: 'Visão Geral' },
                        { id: 'financas', icon: Wallet, label: 'Finanças' },
                        { id: 'saude', icon: Heart, label: 'Saúde' },
                        { id: 'academico', icon: GraduationCap, label: 'Acadêmico' },
                        { id: 'agenda', icon: Calendar, label: 'Agenda' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`flex items-center gap-1.5 md:gap-2 px-2 py-1.5 md:px-3 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                            activeTab === item.id 
                              ? 'text-[#0026f7] bg-blue-50' 
                              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <item.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div></div>
                </div>

                {/* --- CONTEÚDO PRINCIPAL --- */}
                {/* AJUSTE: Padding menor no mobile (p-3) */}
                <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-3 md:p-8 custom-scrollbar">
                  {activeTab === 'visao-geral' && <OverviewTab />}
                  {activeTab === 'financas' && <FinanceTab />}
                  {activeTab === 'saude' && <HealthTab />}
                  {activeTab === 'academico' && <AcademicTab />}
                  {activeTab === 'agenda' && <AgendaTab />}
                </div>

              </div>
            </div>
            
            {/* Base do Laptop */}
            <div className="bg-[#e2e2e2] h-3 sm:h-5 rounded-b-xl w-[96%] max-w-[1050px] mx-auto shadow-md relative mt-[1px]">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-40 h-1 sm:h-2 bg-gray-300 rounded-b-lg"></div>
            </div>
          </motion.div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-[#0026f7]/20 blur-[80px] md:blur-[120px] -z-10 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}