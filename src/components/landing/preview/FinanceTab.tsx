import {
  Wallet, TrendingUp, TrendingDown, ArrowLeftRight,
  PieChart as PieChartIcon, Search, Filter, Calendar as CalendarIcon,
  ChevronDown
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend, ReferenceLine, PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { financeDaily, financeCategories, financeTransactions } from './mocks';

// --- CORES PADRONIZADAS (Exatamente como no CategoryPieChart.tsx) ---
const PIE_COLORS = [
  "hsl(217, 91%, 60%)",   // finance blue
  "hsl(142, 71%, 45%)",   // health green
  "hsl(25, 95%, 53%)",    // training orange
  "hsl(262, 83%, 58%)",   // schedule purple
  "hsl(199, 89%, 48%)",   // academic cyan
  "hsl(0, 84%, 60%)",     // destructive red
  "hsl(45, 93%, 47%)",    // yellow
  "hsl(280, 65%, 60%)",   // violet
  "hsl(180, 50%, 50%)",   // teal
];

export function FinanceTab() {
  const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  // Cálculos Mockados
  const totalIncome = 9700;
  const totalExpenses = 6420;
  const balance = totalIncome - totalExpenses;

  // Adaptar dados para o gráfico de fluxo (BarChart)
  const flowData = financeDaily.map(item => ({
    ...item,
    dateLabel: item.date, // Já está formatado no mock (ex: "11/01")
  }));

  return (
    <div className="space-y-6 font-sans text-slate-900">

      {/* --- HEADER --- */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-[#040949]">Finanças</h1>
          <p className="text-slate-500 mt-1">Gerencie seu fluxo</p>
        </div>

        {/* DateRangeSelector Visual Mock */}
        <div className="w-[260px] flex items-center justify-start text-left font-normal px-4 py-2 bg-white border border-slate-200 rounded-md text-slate-500 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>28/12/25 - 28/01/26</span>
        </div>
      </motion.div>

      {/* --- METRICS ROW --- */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {/* Saldo Atual */}
        <motion.div
          className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm flex flex-col justify-between h-32 hover:border-blue-300 transition-colors"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Saldo atual</span>
            <Wallet className="h-5 w-5 text-slate-400" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-green-600">{formatCurrency(balance)}</span>
          </div>
        </motion.div>

        {/* Total Entradas */}
        <motion.div
          className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm flex flex-col justify-between h-32 hover:border-green-300 transition-colors"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Total de entradas</span>
            <TrendingUp className="h-5 w-5 text-slate-400" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</span>
            <span className="text-sm font-medium text-green-600">+12%</span>
          </div>
        </motion.div>

        {/* Total Saídas */}
        <motion.div
          className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm flex flex-col justify-between h-32 hover:border-blue-300 transition-colors"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Total de saídas</span>
            <TrendingDown className="h-5 w-5 text-slate-400" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalExpenses)}</span>
            <span className="text-sm font-medium text-red-500">-5%</span>
          </div>
        </motion.div>
      </div>

      {/* --- CHARTS ROW --- */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Transaction Flow Chart */}
        <motion.div
          className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 overflow-hidden shadow-sm"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <ArrowLeftRight className="h-5 w-5 text-blue-600" />
            Fluxo de Transação
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={flowData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100" />
                <XAxis dataKey="dateLabel" className="text-xs" tick={{ fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis className="text-xs" tick={{ fill: "#64748b" }} axisLine={false} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  formatter={(value: number) => formatCurrency(value)}
                  cursor={{ fill: 'transparent' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px", color: "#64748b" }} />
                <ReferenceLine y={0} stroke="#e2e8f0" />
                <Bar dataKey="income" name="Receitas" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expense" name="Despesas" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Pie Chart */}
        <motion.div
          className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 overflow-hidden shadow-sm"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        >
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <PieChartIcon className="h-5 w-5 text-blue-600" />
            Gastos por categoria
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={financeCategories}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={85}
                  paddingAngle={2} dataKey="value" stroke="none"
                >
                  {financeCategories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Legend
                  verticalAlign="bottom" height={36} iconType="circle"
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px", color: "#64748b" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* --- TRANSACTIONS CARD --- */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-semibold text-lg text-slate-900">Histórico de Transações</h3>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {/* Fake Select */}
              <div className="w-full sm:w-[180px] h-10 px-3 py-2 bg-white border border-slate-200 rounded-md flex items-center justify-between text-sm text-slate-500 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2 opacity-50" />
                  <span>Categoria</span>
                </div>
                <ChevronDown className="w-4 h-4 opacity-50" />
              </div>

              {/* Fake Search */}
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-8 h-10 w-full sm:w-[200px] border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-0">
          <div className="divide-y divide-slate-100">
            {financeTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-default">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`p-2 rounded-full shrink-0 ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {t.type === 'income' ? <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" /> : <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium truncate max-w-[150px] sm:max-w-xs text-slate-900">{t.description || "Sem descrição"}</p>
                    <p className="text-xs sm:text-sm text-slate-500">
                      {t.category} • {t.date}
                    </p>
                  </div>
                </div>

                <div className={`font-bold text-sm sm:text-base whitespace-nowrap ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(t.amount))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 flex justify-center bg-slate-50/50">
            <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              Ver todas as transações <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}