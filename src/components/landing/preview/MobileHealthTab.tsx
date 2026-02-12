import {
    Heart, Calendar as CalendarIcon, Droplets, Moon,
    Dumbbell, Scale, CalendarDays, ChevronDown
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, ReferenceLine
} from 'recharts';
import { motion } from 'framer-motion';
import { waterData, sleepData } from './mocks';

export function MobileHealthTab() {
    // --- MOCK DATA ---
    const waterGoal = 2500;
    const sleepGoal = 8;
    const waterToday = 1250;
    const lastSleep = 7.2;
    const lastWeight = 78.5;
    const waterPercentage = (waterToday / waterGoal) * 100;
    const sleepPercentage = (lastSleep / sleepGoal) * 100;

    // Mock para Histórico de Treinos
    const workoutLog = [
        { id: '1', item: 'Musculação', description: 'Peito e Tríceps', date: '2025-01-28', value: 60, unit: 'min' },
        { id: '2', item: 'Corrida', description: 'Parque Ibirapuera', date: '2025-01-26', value: 5, unit: 'km' },
    ];

    // Mock para Histórico de Peso (Adicionado para Paridade)
    const weightLog = [
        { date: '2025-01-28', value: 78.5 },
        { date: '2025-01-21', value: 79.2 },
    ];

    return (
        <div className="space-y-4 font-sans text-slate-900 pb-4">

            {/* --- HEADER --- */}
            <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
                        <Heart className="h-4 w-4" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-[#040949]">Saúde</h1>
                        <p className="text-xs text-slate-500">Monitore seus hábitos</p>
                    </div>
                </div>
            </motion.div>

            {/* --- METRICS ROW --- */}
            <div className="grid gap-3 grid-cols-2">
                {/* Água */}
                <motion.div
                    className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm flex flex-col justify-between h-24"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Água</span>
                        <Droplets className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-blue-600">{waterToday}ml</span>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${waterPercentage}%` }}></div>
                        </div>
                    </div>
                </motion.div>

                {/* Sono */}
                <motion.div
                    className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm flex flex-col justify-between h-24"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Sono</span>
                        <Moon className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-orange-600">{lastSleep}h</span>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${sleepPercentage}%` }}></div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid gap-3 grid-cols-2">
                {/* Peso */}
                <motion.div
                    className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm h-20 flex flex-col justify-center"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Peso</span>
                        <Scale className="h-4 w-4 text-slate-400" />
                    </div>
                    <span className="text-lg font-bold text-slate-700">{lastWeight}kg</span>
                </motion.div>

                {/* Atividades */}
                <motion.div
                    className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm h-20 flex flex-col justify-center"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Treinos</span>
                        <Dumbbell className="h-4 w-4 text-purple-500" />
                    </div>
                    <span className="text-lg font-bold text-purple-600">{workoutLog.length}</span>
                </motion.div>
            </div>

            {/* --- GOALS INFO (Added for Parity) --- */}
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex flex-col gap-2 text-xs shadow-sm">
                <div className="flex items-center gap-2">
                    <Droplets className="h-3 w-3 text-blue-500" />
                    <span className="text-slate-600">Meta: <strong className="text-slate-900">{waterGoal}ml/dia</strong></span>
                </div>
                <div className="flex items-center gap-2">
                    <Moon className="h-3 w-3 text-orange-500" />
                    <span className="text-slate-600">Meta: <strong className="text-slate-900">{sleepGoal}h/noite</strong></span>
                </div>
            </div>

            {/* --- CHARTS ROW (Added for Parity) --- */}
            <div className="flex flex-col gap-4">
                {/* Gráfico Água */}
                <motion.div
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                >
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Droplets className="h-4 w-4 text-blue-600" />
                        Consumo de água
                    </h3>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={waterData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100" vertical={false} />
                                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} dy={5} />
                                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} dx={-5} />
                                <RechartsTooltip
                                    cursor={{ fill: "hsl(210, 40%, 96.1%)" }}
                                    formatter={(value: number) => [`${value}ml`, "Água"]}
                                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }}
                                />
                                <ReferenceLine
                                    y={waterGoal} stroke="#22c55e" strokeDasharray="5 5"
                                    label={{ value: `Meta`, position: 'right', fill: "#22c55e", fontSize: 10 }}
                                />
                                <Bar dataKey="value" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Gráfico Sono */}
                <motion.div
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                >
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Moon className="h-4 w-4 text-orange-600" />
                        Horas de sono
                    </h3>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={sleepData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100" vertical={false} />
                                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} dy={5} />
                                <YAxis domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} dx={-5} />
                                <RechartsTooltip
                                    cursor={{ fill: "hsl(210, 40%, 96.1%)" }}
                                    formatter={(value: number) => [`${value}h`, "Sono"]}
                                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }}
                                />
                                <ReferenceLine
                                    y={sleepGoal} stroke="#22c55e" strokeDasharray="5 5"
                                    label={{ value: `Meta`, position: 'right', fill: "#22c55e", fontSize: 10 }}
                                />
                                <Bar dataKey="value" fill="hsl(25, 95%, 53%)" radius={[4, 4, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* --- RECENT ACTIVITY --- */}
            <motion.div
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            >
                <h3 className="mb-3 text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
                    Últimos Treinos
                </h3>
                <div className="space-y-2">
                    {workoutLog.map((workout) => (
                        <div key={workout.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-100 text-purple-600">
                                <Dumbbell className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 text-xs">{workout.item}</p>
                                <p className="text-[10px] text-slate-500 truncate">{workout.description}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-slate-900 text-xs">{workout.value} {workout.unit}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* --- WEIGHT HISTORY (Added primarily for Parity, though simple) --- */}
            <motion.div
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            >
                <h3 className="mb-3 text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
                    Histórico de Peso
                </h3>
                <div className="space-y-2">
                    {weightLog.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-600">
                                <Scale className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 text-xs">{item.value} kg</p>
                                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500">
                                    <CalendarDays className="h-3 w-3" />
                                    <span>{item.date.split('-').reverse().slice(0, 2).join('/')}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

        </div>
    );
}
