import {
    Wallet, TrendingUp, TrendingDown, ArrowRight, Receipt,
    Heart, Droplets, Moon, GraduationCap, Calendar, CheckCircle2,
    Calendar as CalendarIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import {
    overviewExpenses,
    overviewTransactions,
    upcomingEvents
} from './mocks';

// --- CORES PADRONIZADAS ---
const PIE_COLORS = [
    "hsl(217, 91%, 60%)", // Finance Blue
    "hsl(142, 71%, 45%)", // Health Green
    "hsl(25, 95%, 53%)",  // Training Orange
    "hsl(262, 83%, 58%)", // Schedule Purple
    "hsl(199, 89%, 48%)", // Academic Cyan
];

export function MobileOverviewTab() {
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

    return (
        <div className="space-y-4 font-sans text-slate-900 pb-4">

            {/* --- HEADER --- */}
            <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h1 className="text-xl font-bold text-[#040949]">Bom dia, Usuário! 👋</h1>
                    <p className="text-xs text-slate-500 capitalize">quarta-feira, 28 de janeiro</p>
                </div>
            </motion.div>

            {/* --- SEÇÃO 1: FINANÇAS --- */}
            <section className="grid gap-4 grid-cols-1">

                {/* CARD 1: Resumo Financeiro */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                                <Wallet className="h-4 w-4 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-sm">Resumo Financeiro</h3>
                        </div>
                    </div>

                    <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-100">
                        <p className="text-xs text-slate-500 mb-0.5">Saldo atual</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(balance)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 rounded-lg bg-green-50 border border-green-100">
                            <div className="flex items-center gap-1.5 mb-1">
                                <TrendingUp className="h-3 w-3 text-green-600" />
                                <span className="text-xs text-slate-500">Receitas</span>
                            </div>
                            <p className="text-sm font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-red-50 border border-red-100">
                            <div className="flex items-center gap-1.5 mb-1">
                                <TrendingDown className="h-3 w-3 text-red-600" />
                                <span className="text-xs text-slate-500">Despesas</span>
                            </div>
                            <p className="text-sm font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                        </div>
                    </div>
                </motion.div>

                {/* CARD: Gráfico de Despesas (Adicionado para paridade) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-sm">Despesas por Categoria</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="h-40 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={overviewExpenses}
                                        cx="50%" cy="50%"
                                        innerRadius={30} outerRadius={60}
                                        paddingAngle={2} dataKey="value"
                                    >
                                        {overviewExpenses.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(val: number) => formatCurrency(val)}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-1.5 overflow-y-auto max-h-32 custom-scrollbar">
                            {overviewExpenses.map((item, index) => (
                                <div key={item.name} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                                        <span className="text-slate-500 truncate max-w-[100px]">{item.name}</span>
                                    </div>
                                    <span className="font-medium text-xs">{formatCurrency(item.value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* CARD 2: Últimas Transações */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                                <Receipt className="h-4 w-4 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-sm">Últimas Transações</h3>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {overviewTransactions.slice(0, 3).map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate text-slate-900">{tx.description || tx.category}</p>
                                    <p className="text-[10px] text-slate-500">{tx.date}</p>
                                </div>
                                <p className={`text-xs font-bold ml-2 ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* --- SEÇÃO 2: OUTRAS ÁREAS --- */}
            <section className="grid gap-4 grid-cols-1">

                {/* CARD 4: Saúde */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0026f7]/10">
                                <Heart className="h-4 w-4 text-[#0026f7]" />
                            </div>
                            <h3 className="font-semibold text-sm">Saúde</h3>
                        </div>
                    </div>

                    {/* Água */}
                    <div className="mb-3">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                                <Droplets className="h-3 w-3 text-blue-500" />
                                <span className="text-xs font-medium text-slate-700">Água</span>
                            </div>
                            <span className="text-xs text-slate-500">{waterToday}/{waterGoal}ml</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-blue-500" style={{ width: `${waterPct}%` }} />
                        </div>
                    </div>

                    {/* Sono */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                                <Moon className="h-3 w-3 text-orange-500" />
                                <span className="text-xs font-medium text-slate-700">Sono</span>
                            </div>
                            <span className="text-xs text-slate-500">{sleepValue}/{sleepGoal}h</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-orange-500" style={{ width: `${sleepPct}%` }} />
                        </div>
                    </div>
                </motion.div>

                {/* CARD 5: Acadêmico (Com gráfico) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                                <GraduationCap className="h-4 w-4" />
                            </div>
                            <h3 className="font-semibold text-sm">Acadêmico</h3>
                        </div>
                    </div>

                    {/* Dados Acadêmicos Mockados (Mesmos do Desktop) */}
                    <div className="flex items-center justify-between gap-4 h-32">
                        <div className="h-full w-1/2 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Provas', value: 3, fill: PIE_COLORS[0] },
                                            { name: 'Trabalhos', value: 2, fill: PIE_COLORS[3] },
                                            { name: 'Estudos', value: 5, fill: PIE_COLORS[4] },
                                        ]}
                                        cx="50%" cy="50%"
                                        innerRadius={25} outerRadius={40}
                                        paddingAngle={4} cornerRadius={4}
                                        dataKey="value" stroke="none"
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-lg font-bold text-slate-900">10</span>
                            </div>
                        </div>

                        <div className="w-1/2 flex flex-col justify-center gap-1.5">
                            {[
                                { name: 'Provas', value: 3, fill: PIE_COLORS[0] },
                                { name: 'Trabalhos', value: 2, fill: PIE_COLORS[3] },
                                { name: 'Estudos', value: 5, fill: PIE_COLORS[4] },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[10px]">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.fill }} />
                                        <span className="text-slate-500">{item.name}</span>
                                    </div>
                                    <span className="font-semibold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* CARD 6: Agenda */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
                                <Calendar className="h-4 w-4 text-violet-600" />
                            </div>
                            <h3 className="font-semibold text-sm">Próximos</h3>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {upcomingEvents.slice(0, 2).map((event) => (
                            <div key={event.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                                <div className="text-center min-w-8">
                                    <p className="text-[10px] font-medium text-violet-600">{event.datetime.split(' ')[0].slice(0, 3)}</p>
                                    <p className="text-[10px] text-slate-500">{event.datetime.match(/\d{2}:\d{2}/)}</p>
                                </div>
                                <span className="text-xs truncate flex-1 text-slate-700">{event.title}</span>
                                {event.synced && (
                                    <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

            </section>
        </div>
    );
}
