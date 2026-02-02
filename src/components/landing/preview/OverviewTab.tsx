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
          <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900">
            Bom dia, Usuário! <span>👋</span>
          </h1>
          <p className="text-gray-500 capitalize text-lg">quarta-feira, 28 de janeiro</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-base text-gray-600 shadow-sm cursor-pointer hover:bg-gray-50">
           <Calendar className="w-5 h-5 opacity-50" />
           <span>21 jan - 28 jan</span>
        </div>
      </div>

      {/* Grid Principal - 3 Colunas Fixas */}
      <div className="grid grid-cols-3 gap-6">
        {/* Resumo Financeiro */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 col-span-1">
           <div className="flex items-center justify-between mb-6">
             <div>
               <h3 className="font-bold text-lg text-gray-900">Resumo Financeiro</h3>
               <p className="text-sm text-gray-500">Visão do período</p>
             </div>
             <div className="w-12 h-12 rounded-xl bg-[#0026f7]/10 flex items-center justify-center">
               <Wallet className="w-6 h-6 text-[#0026f7]" />
             </div>
           </div>
           <div className="space-y-4">
              <div className="bg-[#0026f7]/5 rounded-xl p-5 border border-[#0026f7]/10">
                <p className="text-sm text-gray-500 mb-1 font-medium">Saldo atual</p>
                <p className="text-4xl font-bold text-[#0026f7] tracking-tight">R$ 8.980,00</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/10">
                  <div className="flex items-center gap-1.5 text-green-600 text-sm mb-1 font-medium">
                    <TrendingUp className="w-4 h-4" /> Receitas
                  </div>
                  <p className="font-bold text-green-700 text-lg">R$ 9.700</p>
                </div>
                <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/10">
                  <div className="flex items-center gap-1.5 text-red-600 text-sm mb-1 font-medium">
                    <TrendingDown className="w-4 h-4" /> Despesas
                  </div>
                  <p className="font-bold text-red-700 text-lg">R$ 720</p>
                </div>
              </div>
           </div>
        </div>

        {/* Gráfico de Despesas */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 col-span-1">
           <h3 className="font-bold text-lg text-gray-900 mb-4">Despesas por Categoria</h3>
           <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={overviewExpenses}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {overviewExpenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="space-y-3 mt-2">
             {overviewExpenses.map((item) => (
               <div key={item.name} className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2.5">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                   <span className="text-gray-700 font-medium">{item.name}</span>
                 </div>
                 <span className="font-bold text-gray-900">{formatCurrency(item.value)}</span>
               </div>
             ))}
           </div>
        </div>

        {/* Últimas Transações */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 col-span-1">
           <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-lg text-gray-900">Últimas Transações</h3>
             <button className="h-9 w-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
               <ArrowRight className="w-5 h-5 text-gray-400" />
             </button>
           </div>
           <div className="space-y-4">
             {overviewTransactions.map((tx) => (
               <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                 <div>
                   <p className="font-semibold text-sm text-gray-900">{tx.description}</p>
                   <p className="text-xs text-gray-500 mt-0.5">{tx.date} • {tx.category}</p>
                 </div>
                 <p className={`font-bold text-sm ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                   {tx.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                 </p>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Cards Inferiores - Grid 3 Colunas */}
      <div className="grid grid-cols-3 gap-6">
         {/* Saúde */}
         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-gray-900">Saúde</h3>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-500" />
              </div>
           </div>
           <div className="space-y-5">
             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Droplets className="w-5 h-5 text-cyan-500" />
                 </div>
                 <div>
                    <p className="text-xs text-gray-500 font-medium">Água hoje</p>
                    <p className="text-sm font-bold text-gray-900">0 / 2500ml</p>
                 </div>
               </div>
             </div>
             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Moon className="w-5 h-5 text-indigo-500" />
                 </div>
                 <div>
                    <p className="text-xs text-gray-500 font-medium">Sono</p>
                    <p className="text-sm font-bold text-gray-900">- / 8h</p>
                 </div>
               </div>
             </div>
           </div>
         </div>

         {/* Acadêmico */}
         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">Acadêmico</h3>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex-1 text-center py-4 bg-purple-50 rounded-xl border border-purple-100">
                <p className="text-4xl font-bold text-purple-600">3</p>
                <p className="text-xs font-medium text-purple-900/60 mt-1">Registros</p>
              </div>
              <div className="h-28 w-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{value: 2, color: '#8B5CF6'}, {value: 1, color: '#06B6D4'}]}
                        cx="50%" cy="50%" innerRadius={30} outerRadius={45} paddingAngle={2} dataKey="value" stroke="none"
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
         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-gray-900">Agenda</h3>
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-500" />
              </div>
           </div>
           <div className="space-y-3">
             {upcomingEvents.slice(0, 3).map((event) => (
               <div key={event.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                 <div className="text-center px-2 border-r border-gray-200">
                   <p className="text-xs font-bold text-gray-400 uppercase">{event.datetime.split(' ')[0].substring(0, 3)}</p>
                   <p className="text-sm font-bold text-gray-900">{event.datetime.match(/\d+/)}</p>
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold text-gray-900 truncate">{event.title}</p>
                   <p className="text-xs text-gray-500">{event.datetime.split(' ').slice(1).join(' ')}</p>
                 </div>
               </div>
             ))}
           </div>
         </div>
      </div>
    </div>
  );
}