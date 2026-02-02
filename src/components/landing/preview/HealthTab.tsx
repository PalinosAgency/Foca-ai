import { Heart, Calendar, Droplets, Moon, Weight, Dumbbell } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { waterData, sleepData, workouts } from './mocks';

export function HealthTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 mb-4">
         <div className="flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center">
             <Heart className="w-7 h-7 text-rose-500" />
           </div>
           <div>
             <h2 className="text-3xl font-bold text-gray-900">Saúde</h2>
             <p className="text-gray-500 text-base">Monitoramento de bem-estar</p>
           </div>
         </div>
         <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-base text-gray-600 shadow-sm">
           <Calendar className="w-5 h-5 opacity-50" />
           <span>28 dez - 28 jan</span>
         </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
         <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between h-32 hover:border-blue-200 transition-colors">
           <div className="flex items-center justify-between">
             <span className="text-sm font-bold text-gray-500 uppercase">Água hoje</span>
             <Droplets className="h-5 w-5 text-blue-400" />
           </div>
           <p className="text-3xl font-extrabold text-[#0026f7]">0ml</p>
         </div>
         
         <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between h-32 hover:border-green-200 transition-colors">
           <div className="flex items-center justify-between">
             <span className="text-sm font-bold text-gray-500 uppercase">Sono</span>
             <Moon className="h-5 w-5 text-indigo-400" />
           </div>
           <p className="text-3xl font-extrabold text-green-600">7.2h</p>
         </div>

         <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between h-32 hover:border-gray-300 transition-colors">
           <div className="flex items-center justify-between">
             <span className="text-sm font-bold text-gray-500 uppercase">Peso</span>
             <Weight className="h-5 w-5 text-gray-400" />
           </div>
           <p className="text-3xl font-extrabold text-gray-900">78.5kg</p>
         </div>

         <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between h-32 hover:border-amber-200 transition-colors">
           <div className="flex items-center justify-between">
             <span className="text-sm font-bold text-gray-500 uppercase">Treinos</span>
             <Dumbbell className="h-5 w-5 text-amber-500" />
           </div>
           <p className="text-3xl font-extrabold text-amber-500">1</p>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-bold text-xl text-gray-900">Hidratação Semanal</h3>
               <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">Meta: 2500ml</div>
            </div>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={waterData} barGap={8}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100" />
                   <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                   <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                   <Bar dataKey="value" fill="#06B6D4" radius={[6, 6, 0, 0]} maxBarSize={50} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-bold text-xl text-gray-900">Qualidade do Sono</h3>
               <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">Meta: 8h</div>
            </div>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={sleepData} barGap={8}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100" />
                   <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                   <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                   <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                   <ReferenceLine y={8} stroke="#22C55E" strokeDasharray="5 5" />
                   <Bar dataKey="value" fill="#F97316" radius={[6, 6, 0, 0]} maxBarSize={50} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
}