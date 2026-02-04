import { 
  Wallet, TrendingUp, TrendingDown, ArrowRight, Receipt, 
  Heart, Droplets, Moon, GraduationCap, Calendar, CheckCircle2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Label } from 'recharts';
import { motion } from 'framer-motion';
import { 
  overviewExpenses, 
  overviewTransactions, 
  upcomingEvents
} from './mocks';

// --- CORES PADRONIZADAS (Baseadas no novo Dashboard) ---
const COLORS = {
  finance: "#3b82f6", // Blue 500
  health: "#22c55e",  // Green 500
  warning: "#ef4444", // Red 500
  schedule: "#8b5cf6", // Violet 500
  academic: "#06b6d4", // Cyan 500
};

const PIE_COLORS = [
  "hsl(217, 91%, 60%)", // Finance Blue
  "hsl(142, 71%, 45%)", // Health Green
  "hsl(25, 95%, 53%)",  // Training Orange
  "hsl(262, 83%, 58%)", // Schedule Purple
  "hsl(199, 89%, 48%)", // Academic Cyan
];

export function OverviewTab() {
  const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  // --- MOCK DATA CALCULATIONS ---
  const totalExpenses = overviewExpenses.reduce((acc, item) => acc + item.value, 0);
  const totalIncome = 9700;
  const balance = totalIncome - totalExpenses;
  
  // Health Mocks
  const waterToday = 1250;
  const waterGoal = 2500;
  const waterPct = (waterToday / waterGoal) * 100;
  const sleepValue = 7.2;
  const sleepGoal = 8;
  const sleepPct = (sleepValue / sleepGoal) * 100;

  // Academic Mocks
  const academicChartData = [
    { name: 'Provas', value: 3, fill: PIE_COLORS[0] },
    { name: 'Trabalhos', value: 2, fill: PIE_COLORS[3] },
    { name: 'Estudos', value: 5, fill: PIE_COLORS[4] },
  ];
  const totalAcademicDocs = 10;

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* --- HEADER --- */}
      <motion.div 
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-[#040949]">Bom dia, Usuário! 👋</h1>
          <p className="text-slate-500 capitalize mt-1">quarta-feira, 28 de janeiro</p>
        </div>
        
        {/* DateRangeSelector Visual Mock */}
        <div className="w-[260px] flex items-center justify-start text-left font-normal px-4 py-2 bg-white border border-slate-200 rounded-md text-slate-500 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>21/01/26 - 28/01/26</span>
        </div>
      </motion.div>

      {/* --- SEÇÃO 1: FINANÇAS --- */}
      <section className="grid gap-6 lg:grid-cols-3">
        
        {/* CARD 1: Resumo Financeiro */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Resumo Financeiro</h3>
                <p className="text-sm text-slate-500">Visão do período</p>
              </div>
            </div>
            <div className="rounded-full bg-slate-100 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-100">
            <p className="text-sm text-slate-500 mb-1">Saldo atual</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(balance)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-green-50 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-slate-500">Receitas</span>
              </div>
              <p className="text-xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="p-4 rounded-lg bg-red-50 border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-sm text-slate-500">Despesas</span>
              </div>
              <p className="text-xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </motion.div>

        {/* CARD 2: Gráfico de Despesas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Despesas por Categoria</h3>
            <div className="rounded-full bg-slate-100 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={overviewExpenses}
                    cx="50%" cy="50%"
                    innerRadius={40} outerRadius={70}
                    paddingAngle={2} dataKey="value"
                  >
                    {overviewExpenses.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: number) => formatCurrency(val)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-48 custom-scrollbar">
              {overviewExpenses.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                    <span className="text-slate-500 truncate max-w-[80px]">{item.name}</span>
                  </div>
                  <span className="font-medium text-xs">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">Total de despesas</p>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(totalExpenses)}</p>
          </div>
        </motion.div>

        {/* CARD 3: Últimas Transações */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Receipt className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">Últimas Transações</h3>
            </div>
            <div className="rounded-full bg-slate-100 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-3">
            {overviewTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-slate-900">{tx.description || tx.category}</p>
                  <p className="text-xs text-slate-500">{tx.date} • {tx.category}</p>
                </div>
                <p className={`text-sm font-bold ml-2 ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* --- SEÇÃO 2: OUTRAS ÁREAS (Saúde, Acadêmico, Agenda) --- */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* CARD 4: Saúde */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0026f7]/10">
                <Heart className="h-5 w-5 text-[#0026f7]" />
              </div>
              <h3 className="font-semibold text-lg">Saúde</h3>
            </div>
            <div className="rounded-full bg-slate-100 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          {/* Água */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-slate-700">Água hoje</span>
              </div>
              <span className="text-sm text-slate-500">{waterToday}ml / {waterGoal}ml</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${waterPct}%` }} />
            </div>
          </div>

          {/* Sono */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-slate-700">Último sono</span>
              </div>
              <span className="text-sm text-slate-500">{sleepValue}h / {sleepGoal}h</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-orange-500 transition-all duration-500" style={{ width: `${sleepPct}%` }} />
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-400">
            <span>Meta: {waterGoal}ml água</span>
            <span>Meta: {sleepGoal}h sono</span>
          </div>
        </motion.div>

        {/* CARD 5: Acadêmico */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-300 group cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg leading-tight">Acadêmico</h3>
                <p className="text-xs text-slate-500">Progresso e atividades</p>
              </div>
            </div>
            <div className="rounded-full bg-slate-100 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center h-[180px]">
            {/* Gráfico Donut */}
            <div className="h-full w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={academicChartData}
                    cx="50%" cy="50%"
                    innerRadius={40} outerRadius={60}
                    paddingAngle={4} cornerRadius={4}
                    dataKey="value" stroke="none"
                  >
                    {academicChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan x={viewBox.cx} y={viewBox.cy} className="fill-slate-900 text-2xl font-bold">{totalAcademicDocs}</tspan>
                              <tspan x={viewBox.cx} y={(viewBox.cy as number) + 16} className="fill-slate-500 text-[10px] uppercase tracking-wide font-medium">Itens</tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legenda */}
            <div className="flex flex-col justify-center gap-2 pr-2">
              {academicChartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-slate-500 text-xs font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-xs text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CARD 6: Agenda */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
                <Calendar className="h-5 w-5 text-violet-600" />
              </div>
              <h3 className="font-semibold text-lg">Próximos Eventos</h3>
            </div>
            <div className="rounded-full bg-slate-100 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-violet-50 text-center">
              <p className="text-2xl font-bold text-violet-600">4</p>
              <p className="text-xs text-slate-500">Próximos eventos</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 text-center">
              <p className="text-2xl font-bold text-green-600">3</p>
              <p className="text-xs text-slate-500">Sincronizados</p>
            </div>
          </div>

          <div className="space-y-2">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <div className="text-center min-w-12">
                  <p className="text-xs font-medium text-violet-600">{event.datetime.split(' ')[0].slice(0,3)}</p>
                  <p className="text-xs text-slate-500">{event.datetime.match(/\d{2}:\d{2}/)}</p>
                </div>
                <span className="text-sm truncate flex-1 text-slate-700">{event.title}</span>
                {event.synced && (
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

      </section>
    </div>
  );
}