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

export function HealthTab() {
  // --- MOCK DATA ---
  const waterGoal = 2500;
  const sleepGoal = 8;
  const waterToday = 1250;
  const lastSleep = 7.2;
  const lastWeight = 78.5;
  const waterPercentage = (waterToday / waterGoal) * 100;

  // Mock para Histórico de Treinos
  const workoutLog = [
    { id: '1', item: 'Musculação', description: 'Treino A - Peito e Tríceps', date: '2025-01-28', value: 60, unit: 'min' },
    { id: '2', item: 'Corrida', description: 'Parque Ibirapuera', date: '2025-01-26', value: 5, unit: 'km' },
    { id: '3', item: 'Yoga', description: 'Relaxamento', date: '2025-01-24', value: 45, unit: 'min' },
  ];

  // Mock para Histórico de Peso
  const weightLog = [
    { date: '2025-01-28', value: 78.5 },
    { date: '2025-01-21', value: 79.2 },
    { date: '2025-01-14', value: 79.8 },
  ];

  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* --- HEADER --- */}
      <motion.div 
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#040949]">Saúde</h1>
            <p className="text-slate-500 mt-1">Monitore seus hábitos</p>
          </div>
        </div>
        
        {/* Date Selector Only - Botão Removido */}
        <div className="w-[200px] flex items-center justify-start text-left font-normal px-4 py-2 bg-white border border-slate-200 rounded-md text-slate-500 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>28/12/25 - 28/01/26</span>
        </div>
      </motion.div>

      {/* --- METRICS ROW --- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Água */}
        <motion.div 
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-300 transition-colors"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Água hoje</span>
            <Droplets className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-blue-600">{waterToday}ml</span>
            {waterPercentage < 50 && (
              <span className="text-sm font-medium text-slate-400">{(waterPercentage).toFixed(0)}%</span>
            )}
          </div>
        </motion.div>

        {/* Sono */}
        <motion.div 
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-orange-300 transition-colors"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Último sono</span>
            <Moon className="h-5 w-5 text-orange-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-orange-600">{lastSleep}h</span>
          </div>
        </motion.div>

        {/* Peso */}
        <motion.div 
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition-colors"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Último peso</span>
            <Scale className="h-5 w-5 text-slate-400" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-700">{lastWeight}kg</span>
          </div>
        </motion.div>

        {/* Atividades */}
        <motion.div 
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-purple-300 transition-colors"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Atividades</span>
            <Dumbbell className="h-5 w-5 text-purple-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-purple-600">{workoutLog.length}</span>
          </div>
        </motion.div>
      </div>

      {/* --- GOALS INFO --- */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex flex-wrap gap-6 text-sm shadow-sm">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-blue-500" />
          <span className="text-slate-600">Meta de água: <strong className="text-slate-900">{waterGoal}ml/dia</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-orange-500" />
          <span className="text-slate-600">Meta de sono: <strong className="text-slate-900">{sleepGoal}h/noite</strong></span>
        </div>
      </div>

      {/* --- CHARTS ROW --- */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico Água */}
        <motion.div
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Droplets className="h-5 w-5 text-blue-600" />
            </div>
            Consumo de água
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={waterData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} dx={-10} />
                <RechartsTooltip
                  cursor={{ fill: "hsl(210, 40%, 96.1%)" }}
                  formatter={(value: number) => [`${value}ml`, "Água"]}
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <ReferenceLine 
                  y={waterGoal} stroke="#22c55e" strokeDasharray="5 5" 
                  label={{ value: `Meta`, position: 'right', fill: "#22c55e", fontSize: 10 }} 
                />
                <Bar dataKey="value" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Gráfico Sono */}
        <motion.div
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        >
          <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Moon className="h-5 w-5 text-orange-600" />
            </div>
            Horas de sono
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                <YAxis domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} dx={-10} />
                <RechartsTooltip
                  cursor={{ fill: "hsl(210, 40%, 96.1%)" }}
                  formatter={(value: number) => [`${value}h`, "Sono"]}
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <ReferenceLine 
                  y={sleepGoal} stroke="#22c55e" strokeDasharray="5 5" 
                  label={{ value: `Meta`, position: 'right', fill: "#22c55e", fontSize: 10 }} 
                />
                <Bar dataKey="value" fill="hsl(25, 95%, 53%)" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* --- LISTS ROW --- */}
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Histórico de Treinos */}
        <motion.div
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        >
          <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <div className="p-2 bg-purple-100 rounded-lg">
               <Dumbbell className="h-5 w-5 text-purple-600" />
            </div>
            Histórico de treinos
          </h3>
          <div className="space-y-3">
            {workoutLog.map((workout) => (
              <div key={workout.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-100 text-purple-600 shadow-sm">
                   <Dumbbell className="h-5 w-5" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="font-semibold text-slate-900">{workout.item}</p>
                   <p className="text-xs text-slate-500">{workout.description}</p>
                 </div>
                 <div className="text-right">
                    <p className="font-bold text-slate-900 text-sm">{workout.value} {workout.unit}</p>
                    <p className="text-xs text-slate-400">{workout.date.split('-').reverse().slice(0,2).join('/')}</p>
                 </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Histórico de Peso */}
        <motion.div
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        >
          <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <div className="p-2 bg-slate-100 rounded-lg">
               <Scale className="h-5 w-5 text-slate-600" />
            </div>
            Histórico de peso
          </h3>
          <div className="space-y-3">
            {weightLog.map((item, index) => (
              <div key={index} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 transition-all hover:shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Scale className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900">{item.value} kg</p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                    <CalendarDays className="h-3 w-3" />
                    <span>{item.date.split('-').reverse().slice(0,2).join('/')}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center pt-2">
               <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  Ver histórico completo <ChevronDown className="h-4 w-4" />
               </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}