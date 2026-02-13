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
import { DashboardDatePicker } from './DashboardDatePicker';

import { useMemo } from 'react';
import { PIE_COLORS } from './constants';

export function MobileFinanceTab() {
    const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    // Cálculos Mockados
    const { balance, totalIncome, totalExpenses, flowData } = useMemo(() => {
        const _totalIncome = 9700;
        const _totalExpenses = 6420;
        const _balance = _totalIncome - _totalExpenses;

        // Adaptar dados para o gráfico de fluxo (BarChart)
        const _flowData = financeDaily.map(item => ({
            ...item,
            dateLabel: item.date,
        }));

        return {
            balance: _balance,
            totalIncome: _totalIncome,
            totalExpenses: _totalExpenses,
            flowData: _flowData
        };
    }, []);

    return (
        <div className="space-y-4 font-sans text-slate-900 pb-4">

            {/* --- HEADER --- */}
            <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h1 className="text-xl font-bold text-[#040949]">Finanças</h1>
                    <p className="text-xs text-slate-500">Gerencie seu fluxo</p>
                </div>
            </motion.div>

            {/* Date Picker */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <DashboardDatePicker className="w-full" />
            </motion.div>

            {/* --- METRICS ROW --- */}
            <div className="grid gap-3 grid-cols-1">
                {/* Saldo Atual */}
                <motion.div
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                >
                    <div>
                        <span className="text-xs text-slate-500 block">Saldo atual</span>
                        <span className="text-xl font-bold text-green-600">{formatCurrency(balance)}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                        <Wallet className="h-5 w-5 text-slate-400" />
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-3">
                    {/* Total Entradas */}
                    <motion.div
                        className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-slate-500">Entradas</span>
                            <TrendingUp className="h-3 w-3 text-green-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-green-600">{formatCurrency(totalIncome)}</span>
                            <span className="text-[10px] font-medium text-green-600">+12%</span>
                        </div>
                    </motion.div>

                    {/* Total Saídas */}
                    <motion.div
                        className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-slate-500">Saídas</span>
                            <TrendingDown className="h-3 w-3 text-red-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-blue-600">{formatCurrency(totalExpenses)}</span>
                            <span className="text-[10px] font-medium text-red-500">-5%</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* --- CHARTS ROW (Adicionado para Paridade) --- */}
            <div className="flex flex-col gap-4">
                {/* Transaction Flow Chart */}
                <motion.div
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm overflow-hidden"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                >
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <ArrowLeftRight className="h-4 w-4 text-blue-600" />
                        Fluxo de Transação
                    </h3>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={flowData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100" />
                                <XAxis dataKey="dateLabel" className="text-[10px]" tick={{ fill: "#64748b" }} axisLine={false} tickLine={false} />
                                <YAxis className="text-[10px]" tick={{ fill: "#64748b" }} axisLine={false} tickLine={false} width={30} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }}
                                    formatter={(value: number) => [formatCurrency(value), ""]}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <ReferenceLine y={0} stroke="#e2e8f0" />
                                <Bar dataKey="income" name="Receitas" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                <Bar dataKey="expense" name="Despesas" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} maxBarSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Category Pie Chart */}
                <motion.div
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm overflow-hidden"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                >
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <PieChartIcon className="h-4 w-4 text-blue-600" />
                        Gastos por categoria
                    </h3>
                    <div className="flex flex-col gap-4">
                        <div className="h-40 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={financeCategories}
                                        cx="50%" cy="50%"
                                        innerRadius={40} outerRadius={70}
                                        paddingAngle={2} dataKey="value" stroke="none"
                                    >
                                        {financeCategories.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        formatter={(value: number) => formatCurrency(value)}
                                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Legenda Customizada para Mobile */}
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                            {financeCategories.slice(0, 6).map((item, index) => (
                                <div key={index} className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                                    <span className="text-slate-500 truncate">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* --- TRANSACTIONS CARD --- */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-sm text-slate-900">Histórico Recente</h3>
                </div>

                <div className="p-0">
                    <div className="divide-y divide-slate-100">
                        {financeTransactions.slice(0, 4).map((t) => (
                            <div key={t.id} className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-full shrink-0 ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {t.type === 'income' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="font-medium text-xs truncate max-w-[120px] text-slate-900">{t.description || "Sem descrição"}</p>
                                        <p className="text-[10px] text-slate-500">
                                            {t.category}
                                        </p>
                                    </div>
                                </div>

                                <div className={`font-bold text-xs whitespace-nowrap ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(t.amount))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 border-t border-slate-100 flex justify-center bg-slate-50/50">
                        <button className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                            Ver tudo <ChevronDown className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
