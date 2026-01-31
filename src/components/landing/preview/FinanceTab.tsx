import { Wallet, Calendar, TrendingUp, TrendingDown, Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { financeDaily, financeCategories, financeTransactions } from './mocks';

export function FinanceTab() {
  const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
         <div className="flex items-center gap-3">
           <div className="w-12 h-12 rounded-xl bg-[#0026f7]/10 flex items-center justify-center">
             <Wallet className="w-6 h-6 text-[#0026f7]" />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-gray-900">Finanças</h2>
             <p className="text-gray-500 text-sm">Gerencie seu fluxo</p>
           </div>
         </div>
         <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 shadow-sm cursor-pointer hover:bg-gray-50">
           <Calendar className="w-4 h-4 opacity-50" />
           <span>28 dez - 28 jan</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm text-gray-500">Saldo atual</span>
             <Wallet className="h-4 w-4 text-gray-400" />
           </div>
           <p className="text-2xl font-bold text-[#0026f7]">R$ 3.280,00</p>
         </div>
         <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm text-gray-500">Total de entradas</span>
             <TrendingUp className="h-4 w-4 text-gray-400" />
           </div>
           <p className="text-2xl font-bold text-green-600">R$ 9.700,00</p>
         </div>
         <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm text-gray-500">Total de saídas</span>
             <TrendingDown className="h-4 w-4 text-gray-400" />
           </div>
           <p className="text-2xl font-bold text-red-600">R$ 6.420,00</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-semibold text-gray-900">Fluxo de Transação</h3>
               <div className="w-10 h-10 rounded-xl bg-[#0026f7]/10 flex items-center justify-center">
                 <TrendingUp className="w-5 h-5 text-[#0026f7]" />
               </div>
            </div>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={financeDaily} barGap={0}>
                   <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100" />
                   <XAxis dataKey="date" className="text-xs" tick={{ fill: '#6B7280' }} />
                   <YAxis className="text-xs" tick={{ fill: '#6B7280' }} />
                   <Tooltip
                     contentStyle={{
                       backgroundColor: '#fff',
                       border: '1px solid #e5e7eb',
                       borderRadius: '8px',
                     }}
                     formatter={(value: number) => formatCurrency(value)}
                   />
                   <Bar dataKey="income" name="Receitas" fill="#22C55E" radius={[4, 4, 0, 0]} />
                   <Bar dataKey="expense" name="Despesas" fill="#EF4444" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-sm text-gray-600">Receitas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="text-sm text-gray-600">Despesas</span>
              </div>
            </div>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-semibold text-gray-900">Gastos por categoria</h3>
               <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                 <Wallet className="w-5 h-5 text-orange-500" />
               </div>
            </div>
            <div className="h-64 flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={financeCategories}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={90}
                     paddingAngle={2}
                     dataKey="value"
                   >
                     {financeCategories.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip
                     contentStyle={{
                       backgroundColor: '#fff',
                       border: '1px solid #e5e7eb',
                       borderRadius: '8px',
                     }}
                     formatter={(value: number) => formatCurrency(value)}
                   />
                 </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
               {financeCategories.map((item) => (
                 <div key={item.name} className="flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                   <span className="text-xs text-gray-600">{item.name}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
         <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Histórico</h3>
            <div className="flex gap-2">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar..." 
                    className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0026f7] w-40 md:w-64"
                  />
               </div>
               <button className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-50">
                  <Filter className="w-4 h-4 text-gray-500" />
               </button>
            </div>
         </div>

         <div className="space-y-2">
            {financeTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    {tx.type === 'income' ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    )}
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{tx.description}</p>
                    <p className="text-sm text-gray-500">{tx.category} • {tx.date}</p>
                 </div>
                 <p className={`font-semibold whitespace-nowrap ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                 </p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}