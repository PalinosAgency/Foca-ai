import { 
  Wallet, Calendar, TrendingUp, TrendingDown, Heart, GraduationCap, 
  Droplets, Moon, ArrowRight, Check 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { overviewExpenses, overviewTransactions, upcomingEvents } from './mocks';

export function OverviewTab() {
  const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 text-gray-900">
            Bom dia, Usuário! <span>👋</span>
          </h1>
          <p className="text-gray-500 capitalize">quarta-feira, 28 de janeiro</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 shadow-sm w-full md:w-auto justify-between md:justify-start cursor-pointer hover:bg-gray-50">
           <div className="flex items-center gap-2">
             <Calendar className="w-4 h-4 opacity-50" />
             <span>21 jan - 28 jan</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resumo Financeiro */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:col-span-1">
           <div className="flex items-center justify-between mb-4">
             <div>
               <h3 className="font-semibold text-gray-900">Resumo Financeiro</h3>
               <p className="text-xs text-gray-500">Visão do período</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-[#0026f7]/10 flex items-center justify-center">
               <Wallet className="w-5 h-5 text-[#0026f7]" />
             </div>
           </div>
           <div className="space-y-4">
              <div className="bg-[#0026f7]/10 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Saldo atual</p>
                <p className="text-3xl font-bold text-[#0026f7]">R$ 8.980,00</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-500/10 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-green-600 text-sm mb-1">
                    <TrendingUp className="w-3 h-3" /> Receitas
                  </div>
                  <p className="font-semibold text-green-600">R$ 9.700,00</p>
                </div>
                <div className="bg-red-500/10 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-red-600 text-sm mb-1">
                    <TrendingDown className="w-3 h-3" /> Despesas
                  </div>
                  <p className="font-semibold text-red-600">R$ 720,00</p>
                </div>
              </div>
           </div>
        </div>

        {/* Despesas por Categoria */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:col-span-1">
           <h3 className="font-semibold text-gray-900 mb-1">Despesas por Categoria</h3>
           <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={overviewExpenses}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {overviewExpenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="space-y-2 mt-2">
             {overviewExpenses.map((item) => (
               <div key={item.name} className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                   <span className="text-gray-600">{item.name}</span>
                 </div>
                 <span className="font-medium text-gray-900">{formatCurrency(item.value)}</span>
               </div>
             ))}
           </div>
           <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">Total de despesas</p>
              <p className="text-xl font-bold text-red-600">R$ 720,00</p>
           </div>
        </div>

        {/* Últimas Transações */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:col-span-1">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Últimas Transações</h3>
              <button className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors">
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </button>
           </div>
           <div className="space-y-3">
              {overviewTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{tx.description}</p>
                    <p className="text-xs text-gray-500">{tx.date} • {tx.category}</p>
                  </div>
                  <p className={`font-semibold text-sm ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                  </p>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Cards Inferiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
         {/* Saúde */}
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-gray-900">Saúde</h3>
               <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                 <Heart className="w-5 h-5 text-rose-500" />
               </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm text-gray-700">Água hoje</span>
                </div>
                <span className="text-sm font-medium text-gray-900">0ml / 2500ml</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm text-gray-700">Último sono</span>
                </div>
                <span className="text-sm font-medium text-gray-900">- / 8h</span>
              </div>
              <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                <p>Meta diária: 2500ml água</p>
                <p>Meta: 8h sono</p>
              </div>
            </div>
         </div>

         {/* Acadêmico */}
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-gray-900">Acadêmico</h3>
               <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                 <GraduationCap className="w-5 h-5 text-purple-600" />
               </div>
            </div>
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-[#0026f7]">3</p>
              <p className="text-sm text-gray-500">documentos registrados</p>
            </div>
            <div className="h-24">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Estudo', value: 2, color: '#8B5CF6' },
                        { name: 'Trabalho', value: 1, color: '#06B6D4' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {[
                        { name: 'Estudo', value: 2, color: '#8B5CF6' },
                        { name: 'Trabalho', value: 1, color: '#06B6D4' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs mt-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-gray-600">Estudo</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                <span className="text-gray-600">Trabalho</span>
              </div>
            </div>
         </div>

         {/* Próximos Eventos */}
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-gray-900">Próximos Eventos</h3>
               <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                 <Calendar className="w-5 h-5 text-orange-500" />
               </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#0026f7]/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-[#0026f7]">4</p>
                <p className="text-xs text-gray-500">Próximos eventos</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-xs text-gray-500">Sincronizados</p>
              </div>
            </div>
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className="text-xs text-[#0026f7] font-medium w-16 leading-tight">
                    {event.datetime.split(' ')[0]}<br />{event.datetime.split(' ')[1]}
                  </div>
                  <div className="flex items-center gap-2">
                    {event.synced && (
                      <span className="w-4 h-4 rounded bg-green-500 flex items-center justify-center text-white text-[10px] font-bold">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                    <span className="text-sm text-gray-700 truncate">{event.title}</span>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
}