import { 
  Wallet, Calendar, TrendingUp, TrendingDown, Heart, GraduationCap, 
  Droplets, Moon, ArrowRight 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { overviewExpenses, overviewTransactions, upcomingEvents } from './mocks';

export function OverviewTab() {
  const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
            Bom dia, Usuário! <span>👋</span>
          </h1>
          <p className="text-gray-500 capitalize text-sm">quarta-feira, 28 de janeiro</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 shadow-sm cursor-pointer hover:bg-gray-50">
           <Calendar className="w-4 h-4 opacity-50" />
           <span>21 jan - 28 jan</span>
        </div>
      </div>

      {/* Grid Principal - 3 Colunas */}
      <div className="grid grid-cols-3 gap-5">
        {/* Resumo Financeiro */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 col-span-1">
           <div className="flex items-center justify-between mb-4">
             <div>
               <h3 className="font-bold text-base text-gray-900">Resumo Financeiro</h3>
               <p className="text-xs text-gray-500">Visão do período</p>
             </div>
             <div className="w-10 h-10 rounded-lg bg-[#0026f7]/10 flex items-center justify-center">
               <Wallet className="w-5 h-5 text-[#0026f7]" />
             </div>
           </div>
           <div className="space-y-3">
              <div className="bg-[#0026f7]/5 rounded-lg p-4 border border-[#0026f7]/10">
                <p className="text-xs text-gray-500 mb-1 font-medium">Saldo atual</p>
                <p className="text-3xl font-bold text-[#0026f7] tracking-tight">R$ 8.980,00</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/10">
                  <div className="flex items-center gap-1 text-green-600 text-xs mb-1 font-medium">
                    <TrendingUp className="w-3 h-3" /> Receitas
                  </div>
                  <p className="font-bold text-green-700 text-base">R$ 9.700</p>
                </div>
                <div className="bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                  <div className="flex items-center gap-1 text-red-600 text-xs mb-1 font-medium">
                    <TrendingDown className="w-3 h-3" /> Despesas
                  </div>
                  <p className="font-bold text-red-700 text-base">R$ 720</p>
                </div>
              </div>
           </div>
        </div>

        {/* Despesas por Categoria */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 col-span-1">
           <h3 className="font-bold text-base text-gray-900 mb-3">Despesas por Categoria</h3>
           <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={overviewExpenses}
                    cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value" stroke="none"
                  >
                    {overviewExpenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="space-y-2 mt-1">
             {overviewExpenses.map((item) => (
               <div key={item.name} className="flex items-center justify-between text-xs">
                 <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                   <span className="text-gray-700 font-medium">{item.name}</span>
                 </div>
                 <span className="font-bold text-gray-900">{formatCurrency(item.value)}</span>
               </div>
             ))}
           </div>
        </div>

        {/* Últimas Transações */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 col-span-1">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-base text-gray-900">Últimas Transações</h3>
             <button className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
               <ArrowRight className="w-4 h-4 text-gray-400" />
             </button>
           </div>
           <div className="space-y-3">
             {overviewTransactions.map((tx) => (
               <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                 <div>
                   <p className="font-semibold text-xs text-gray-900">{tx.description}</p>
                   <p className="text-[10px] text-gray-500 mt-0.5">{tx.date} • {tx.category}</p>
                 </div>
                 <p className={`font-bold text-xs ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                   {tx.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                 </p>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Cards Inferiores - Grid 3 Colunas */}
      <div className="grid grid-cols-3 gap-5">
         {/* Saúde */}
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-gray-900">Saúde</h3>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-rose-500" />
              </div>
           </div>
           <div className="space-y-3">
             <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100">
               <div className="flex items-center gap-2">
                 <Droplets className="w-4 h-4 text-cyan-500" />
                 <div>
                    <p className="text-[10px] text-gray-500 font-medium">Água</p>
                    <p className="text-xs font-bold text-gray-900">0 / 2.5L</p>
                 </div>
               </div>
             </div>
             <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100">
               <div className="flex items-center gap-2">
                 <Moon className="w-4 h-4 text-indigo-500" />
                 <div>
                    <p className="text-[10px] text-gray-500 font-medium">Sono</p>
                    <p className="text-xs font-bold text-gray-900">- / 8h</p>
                 </div>
               </div>
             </div>
           </div>
         </div>

         {/* Acadêmico */}
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-gray-900">Acadêmico</h3>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-purple-600" />
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex-1 text-center py-3 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-3xl font-bold text-purple-600">3</p>
                <p className="text-[10px] font-medium text-purple-900/60">Registros</p>
              </div>
              <div className="h-20 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{value: 2, color: '#8B5CF6'}, {value: 1, color: '#06B6D4'}]}
                        cx="50%" cy="50%" innerRadius={20} outerRadius={35} paddingAngle={2} dataKey="value" stroke="none"
                      >
                        {[{value: 2, color: '#8B5CF6'}, {value: 1, color: '#06B6D4'}].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
              </div>
           </div>
         </div>

         {/* Agenda */}
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-gray-900">Agenda</h3>
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-orange-500" />
              </div>
           </div>
           <div className="space-y-2">
             {upcomingEvents.slice(0, 3).map((event) => (
               <div key={event.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                 <div className="text-center px-2 border-r border-gray-200">
                   <p className="text-[10px] font-bold text-gray-400 uppercase">{event.datetime.split(' ')[0].substring(0, 3)}</p>
                   <p className="text-xs font-bold text-gray-900">{event.datetime.match(/\d+/)}</p>
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-xs font-bold text-gray-900 truncate">{event.title}</p>
                   <p className="text-[10px] text-gray-500">{event.datetime.split(' ').slice(1).join(' ')}</p>
                 </div>
               </div>
             ))}
           </div>
         </div>
      </div>
    </div>
  );
}