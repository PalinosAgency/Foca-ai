import { Wallet, Calendar, TrendingUp, TrendingDown, Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { financeDaily, financeCategories, financeTransactions } from './mocks';

export function FinanceTab() {
  const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
         <div className="flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-[#0026f7]/10 flex items-center justify-center shadow-sm">
             <Wallet className="w-7 h-7 text-[#0026f7]" />
           </div>
           <div>
             <h2 className="text-3xl font-bold text-gray-900">Finanças</h2>
             <p className="text-gray-500 text-base">Gerencie seu fluxo financeiro</p>
           </div>
         </div>
         <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-base text-gray-600 shadow-sm cursor-pointer hover:bg-gray-50">
           <Calendar className="w-5 h-5 opacity-50" />
           <span>28 dez - 28 jan</span>
         </div>
      </div>

      {/* Cards Topo - 3 Colunas Fixas */}
      <div className="grid grid-cols-3 gap-6">
         <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
           <div className="flex items-center justify-between mb-4">
             <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">Saldo atual</span>
             <div className="p-2 bg-blue-50 rounded-lg"><Wallet className="h-5 w-5 text-blue-600" /></div>
           </div>
           <p className="text-4xl font-bold text-[#0026f7]">R$ 3.280,00</p>
         </div>
         <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
           <div className="flex items-center justify-between mb-4">
             <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">Entradas</span>
             <div className="p-2 bg-green-50 rounded-lg"><TrendingUp className="h-5 w-5 text-green-600" /></div>
           </div>
           <p className="text-4xl font-bold text-green-600">R$ 9.700,00</p>
         </div>
         <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
           <div className="flex items-center justify-between mb-4">
             <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">Saídas</span>
             <div className="p-2 bg-red-50 rounded-lg"><TrendingDown className="h-5 w-5 text-red-600" /></div>
           </div>
           <p className="text-4xl font-bold text-red-600">R$ 6.420,00</p>
         </div>
      </div>

      {/* Gráficos - 2 Colunas */}
      <div className="grid grid-cols-2 gap-6">
         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-bold text-xl text-gray-900">Fluxo de Transação</h3>
            </div>
            <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={financeDaily} barGap={8}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100" />
                   <XAxis dataKey="date" className="text-xs" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                   <YAxis className="text-xs" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                   <Tooltip
                     cursor={{ fill: 'transparent' }}
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     formatter={(value: number) => formatCurrency(value)}
                   />
                   <Bar dataKey="income" name="Receitas" fill="#22C55E" radius={[6, 6, 0, 0]} maxBarSize={40} />
                   <Bar dataKey="expense" name="Despesas" fill="#EF4444" radius={[6, 6, 0, 0]} maxBarSize={40} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-bold text-xl text-gray-900">Gastos por Categoria</h3>
            </div>
            <div className="h-64 flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={financeCategories}
                     cx="50%" cy="50%"
                     innerRadius={70}
                     outerRadius={100}
                     paddingAngle={3}
                     dataKey="value"
                     stroke="none"
                   >
                     {financeCategories.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 10px rgb(0 0 0 / 0.1)' }}
                     formatter={(value: number) => formatCurrency(value)}
                   />
                 </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-6">
               {financeCategories.map((item) => (
                 <div key={item.name} className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                   <span className="text-sm font-medium text-gray-600">{item.name}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Histórico */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
         <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl text-gray-900">Histórico Recente</h3>
            <div className="flex gap-3">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar transação..." 
                    className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0026f7]/20 w-72 transition-all"
                  />
               </div>
               <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-5 h-5 text-gray-500" />
               </button>
            </div>
         </div>

         <div className="space-y-1">
            <div className="grid grid-cols-12 px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50 rounded-lg mb-2">
                <div className="col-span-6">Descrição</div>
                <div className="col-span-3">Categoria</div>
                <div className="col-span-3 text-right">Valor</div>
            </div>
            {financeTransactions.map((tx) => (
              <div key={tx.id} className="grid grid-cols-12 items-center px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-default group">
                 <div className="col-span-6 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${tx.type === 'income' ? 'bg-green-50' : 'bg-red-50'}`}>
                       {tx.type === 'income' ? <ArrowUpRight className="w-5 h-5 text-green-600" /> : <ArrowDownRight className="w-5 h-5 text-red-600" />}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{tx.description}</p>
                        <p className="text-xs text-gray-500">{tx.date}</p>
                    </div>
                 </div>
                 <div className="col-span-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold border border-gray-200">{tx.category}</span>
                 </div>
                 <div className="col-span-3 text-right">
                    <p className={`font-bold text-base ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                       {tx.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                    </p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}