import { Heart, Calendar, Droplets, Moon, Weight, Dumbbell } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { waterData, sleepData, workouts } from './mocks';

export function HealthTab() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
         <div className="flex items-center gap-3">
           <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
             <Heart className="w-6 h-6 text-rose-500" />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-gray-900">Saúde</h2>
             <p className="text-gray-500 text-sm">Monitore seus hábitos diários</p>
           </div>
         </div>
         <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 shadow-sm cursor-pointer hover:bg-gray-50">
           <Calendar className="w-4 h-4 opacity-50" />
           <span>28 dez - 28 jan</span>
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm text-gray-500">Água hoje</span>
             <Droplets className="h-4 w-4 text-gray-400" />
           </div>
           <p className="text-2xl font-bold text-[#0026f7]">0ml</p>
         </div>
         
         <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm text-gray-500">Último sono</span>
             <Moon className="h-4 w-4 text-gray-400" />
           </div>
           <p className="text-2xl font-bold text-green-600">7.2h</p>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm text-gray-500">Último peso</span>
             <Weight className="h-4 w-4 text-gray-400" />
           </div>
           <p className="text-2xl font-bold text-gray-900">78.5kg</p>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm text-gray-500">Treinos recentes</span>
             <Dumbbell className="h-4 w-4 text-gray-400" />
           </div>
           <p className="text-2xl font-bold text-amber-500">1</p>
         </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
          <Droplets className="w-4 h-4 text-cyan-500" />
          <span className="text-gray-700">Meta de água: 2500ml/dia</span>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
          <Moon className="w-4 h-4 text-indigo-500" />
          <span className="text-gray-700">Meta de sono: 8h/noite</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-semibold text-gray-900">Consumo de água</h3>
               <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                 <Droplets className="w-5 h-5 text-cyan-500" />
               </div>
            </div>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={waterData}>
                   <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100" />
                   <XAxis dataKey="day" tick={{ fill: '#6B7280' }} />
                   <YAxis tick={{ fill: '#6B7280' }} />
                   <Tooltip
                     contentStyle={{
                       backgroundColor: '#fff',
                       border: '1px solid #e5e7eb',
                       borderRadius: '8px',
                     }}
                     formatter={(value: number) => [`${value}ml`, 'Água']}
                   />
                   <Bar dataKey="value" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-semibold text-gray-900">Horas de sono</h3>
               <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                 <Moon className="w-5 h-5 text-orange-500" />
               </div>
            </div>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={sleepData}>
                   <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100" />
                   <XAxis dataKey="day" tick={{ fill: '#6B7280' }} />
                   <YAxis domain={[0, 12]} tick={{ fill: '#6B7280' }} />
                   <Tooltip
                     contentStyle={{
                       backgroundColor: '#fff',
                       border: '1px solid #e5e7eb',
                       borderRadius: '8px',
                     }}
                     formatter={(value: number) => [`${value}h`, 'Sono']}
                   />
                   <ReferenceLine
                     y={8}
                     stroke="#22C55E"
                     strokeDasharray="5 5"
                     label={{ value: 'Meta: 8h', fill: '#22C55E', fontSize: 12 }}
                   />
                   <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
         <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Histórico de treinos</h3>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
               <Dumbbell className="w-5 h-5 text-amber-600" />
            </div>
         </div>
         
         <div className="space-y-2">
            {workouts.map((workout) => (
              <div key={workout.id} className="flex items-center gap-4 p-3 bg-amber-500/10 rounded-lg">
                 <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-amber-600" />
                 </div>
                 <div>
                    <p className="font-medium text-gray-900">{workout.type}</p>
                    <p className="text-sm text-gray-500">{workout.date}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}