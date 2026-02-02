import { Heart, Calendar, Droplets, Moon, Weight, Dumbbell } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { waterData, sleepData, workouts } from './mocks';

export function HealthTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 mb-2">
         <div className="flex items-center gap-3">
           <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
             <Heart className="w-6 h-6 text-rose-500" />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-gray-900">Saúde</h2>
             <p className="text-gray-500 text-sm">Monitoramento de bem-estar</p>
           </div>
         </div>
         <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 shadow-sm">
           <Calendar className="w-4 h-4 opacity-50" />
           <span>28 dez - 28 jan</span>
         </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
         <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between h-28">
           <div className="flex items-center justify-between">
             <span className="text-xs font-bold text-gray-500 uppercase">Água hoje</span>
             <Droplets className="h-4 w-4 text-blue-400" />
           </div>
           <p className="text-2xl font-extrabold text-[#0026f7]">0ml</p>
         </div>
         
         <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between h-28">
           <div className="flex items-center justify-between">
             <span className="text-xs font-bold text-gray-500 uppercase">Sono</span>
             <Moon className="h-4 w-4 text-indigo-400" />
           </div>
           <p className="text-2xl font-extrabold text-green-600">7.2h</p>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between h-28">
           <div className="flex items-center justify-between">
             <span className="text-xs font-bold text-gray-500 uppercase">Peso</span>
             <Weight className="h-4 w-4 text-gray-400" />
           </div>
           <p className="text-2xl font-extrabold text-gray-900">78.5kg</p>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between h-28">
           <div className="flex items-center justify-between">
             <span className="text-xs font-bold text-gray-500 uppercase">Treinos</span>
             <Dumbbell className="h-4 w-4 text-amber-500" />
           </div>
           <p className="text-2xl font-extrabold text-amber-500">1</p>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-lg text-gray-900">Hidratação Semanal</h3>
               <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold">Meta: 2500ml</div>
            </div>
            <div className="h-56">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={waterData} barGap={4}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100" />
                   <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                   <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                   <Bar dataKey="value" fill="#06B6D4" radius={[6, 6, 0, 0]} maxBarSize={40} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-lg text-gray-900">Qualidade do Sono</h3>
               <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold">Meta: 8h</div>
            </div>
            <div className="h-56">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={sleepData} barGap={4}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100" />
                   <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                   <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                   <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                   <ReferenceLine y={8} stroke="#22C55E" strokeDasharray="5 5" />
                   <Bar dataKey="value" fill="#F97316" radius={[6, 6, 0, 0]} maxBarSize={40} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
}