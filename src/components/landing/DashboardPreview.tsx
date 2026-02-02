import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Wallet, Heart, GraduationCap, Calendar, 
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
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
            Seu painel de controle <span className="text-[#0026f7]">completo</span>
          </h2>
          <p className="text-blue-100/80 text-sm md:text-lg max-w-2xl mx-auto">
            Acesse todos os seus dados organizados pelo computador ou celular.
          </p>
        </div>

        <div className="max-w-6xl mx-auto relative px-0 md:px-0">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            {/* MOLDURA DO LAPTOP */}
            <div className="bg-[#121212] rounded-t-xl md:rounded-t-2xl p-1.5 md:p-2 shadow-2xl ring-1 ring-white/10 mx-auto w-full aspect-[16/10] max-w-[1200px] overflow-hidden">
              <div className="bg-[#F8FAFC] rounded-lg h-full w-full relative overflow-hidden flex flex-col font-sans">
                
                {/* TRUQUE DE ESCALA "PERFECT FIT" CENTRALIZADO
                   1. origin-top: O zoom acontece a partir do topo.
                   2. left-1/2 -translate-x-1/2: Centraliza o elemento horizontalmente.
                   3. scale-[0.23]: Reduzido para caber com folga no mobile (320px+).
                */}
                <div className="w-[1200px] h-[750px] origin-top left-1/2 -translate-x-1/2 transform scale-[0.23] xs:scale-[0.28] sm:scale-[0.45] md:scale-[0.62] lg:scale-[0.82] xl:scale-100 flex flex-col absolute top-0 bg-[#F8FAFC]">
                  
                  {/* --- TOP NAV (Sem Usuário) --- */}
                  <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-20">
                    <div className="flex items-center gap-12">
                      {/* Logo */}
                      <div className="flex items-center gap-3">
                        <img 
                          src="/logo-icon-fundo.png" 
                          alt="Icon" 
                          className="w-10 h-10 object-contain"
                        />
                        <span className="font-bold text-2xl tracking-tight text-[#040949]">
                          Foca.aí
                        </span>
                      </div>

                      {/* Menu de Navegação */}
                      <div className="flex items-center gap-2">
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
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-base font-medium transition-all ${
                              activeTab === item.id 
                                ? 'text-[#0026f7] bg-blue-50 shadow-sm ring-1 ring-blue-100' 
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'stroke-2' : 'stroke-[1.5]'}`} />
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* LADO DIREITO VAZIO */}
                    <div></div>
                  </div>

                  {/* --- CONTEÚDO PRINCIPAL --- */}
                  <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-8 custom-scrollbar">
                    {activeTab === 'visao-geral' && <OverviewTab />}
                    {activeTab === 'financas' && <FinanceTab />}
                    {activeTab === 'saude' && <HealthTab />}
                    {activeTab === 'academico' && <AcademicTab />}
                    {activeTab === 'agenda' && <AgendaTab />}
                  </div>
                </div>

              </div>
            </div>
            
            {/* Base do Laptop */}
            <div className="bg-[#e2e2e2] h-2 sm:h-4 md:h-5 rounded-b-xl w-[96%] max-w-[1250px] mx-auto shadow-md relative mt-[1px]">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 sm:w-32 md:w-48 h-1 sm:h-1.5 md:h-2 bg-gray-300 rounded-b-lg"></div>
            </div>
          </motion.div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-[#0026f7]/20 blur-[60px] md:blur-[120px] -z-10 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}