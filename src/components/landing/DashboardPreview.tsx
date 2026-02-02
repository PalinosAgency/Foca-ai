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

        {/* CONTAINER GERAL (Largura Desktop Restaurada) */}
        <div className="max-w-[1200px] mx-auto relative px-0">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            {/* MOLDURA DO LAPTOP */}
            <div className="bg-[#121212] rounded-t-xl md:rounded-t-2xl p-1.5 md:p-2 shadow-2xl ring-1 ring-white/10 mx-auto w-full aspect-[16/10] overflow-hidden">
              <div className="bg-[#F8FAFC] rounded-lg h-full w-full relative overflow-hidden flex flex-col font-sans">
                
                {/* LÓGICA HÍBRIDA:
                   - Mobile/Tablet: Largura fixa de 1024px e Scale para caber na tela.
                   - Desktop (lg+): Largura 100% (fluida) e Scale normal.
                */}
                <div className={`
                    bg-[#F8FAFC] flex flex-col absolute top-0 origin-top
                    
                    /* Comportamento Mobile (Simula Desktop) */
                    w-[1024px] h-[640px] left-1/2 -translate-x-1/2 
                    transform scale-[0.34] xs:scale-[0.40] sm:scale-[0.65] md:scale-[0.75]
                    
                    /* Comportamento Desktop (Nativo) */
                    lg:w-full lg:h-full lg:static lg:transform-none lg:translate-x-0 lg:left-0
                `}>
                  
                  {/* --- TOP NAV --- */}
                  <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-20">
                    <div className="flex items-center gap-8 w-full">
                      {/* Logo */}
                      <div className="flex items-center gap-2 shrink-0">
                        <img 
                          src="/logo-icon-fundo.png" 
                          alt="Icon" 
                          className="w-8 h-8 object-contain"
                        />
                        <span className="font-bold text-xl tracking-tight text-[#040949]">
                          Foca.aí
                        </span>
                      </div>

                      {/* Menu */}
                      <div className="flex items-center gap-1 flex-1">
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
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              activeTab === item.id 
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

                  {/* --- CONTEÚDO PRINCIPAL --- */}
                  <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 custom-scrollbar">
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
            <div className="bg-[#e2e2e2] h-2 sm:h-4 md:h-5 rounded-b-xl w-[96%] mx-auto shadow-md relative mt-[1px]">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 sm:w-32 md:w-48 h-1 sm:h-1.5 md:h-2 bg-gray-300 rounded-b-lg"></div>
            </div>
          </motion.div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-[#0026f7]/20 blur-[60px] md:blur-[120px] -z-10 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}