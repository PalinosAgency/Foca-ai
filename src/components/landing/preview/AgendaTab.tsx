import { Calendar, Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { upcomingEvents } from './mocks';

export function AgendaTab() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
         <div className="flex items-center gap-3">
           <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
             <Calendar className="w-6 h-6 text-orange-500" />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-gray-900">Agenda</h2>
             <p className="text-gray-500 text-sm">Seus compromissos</p>
           </div>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
               <Clock className="w-4 h-4" />
               <span>10:42</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 shadow-sm cursor-pointer hover:bg-gray-50">
              <Calendar className="w-4 h-4 opacity-50" />
              <span>28 dez - 28 jan</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
         <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm text-gray-500">Futuros</span>
             <Clock className="h-4 w-4 text-gray-400" />
           </div>
           <p className="text-2xl font-bold text-[#0026f7]">4</p>
         </div>
         
         <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm text-gray-500">Sincronizados</span>
             <CheckCircle className="h-4 w-4 text-gray-400" />
           </div>
           <p className="text-2xl font-bold text-green-600">0</p>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm text-gray-500">Pendentes</span>
             <AlertCircle className="h-4 w-4 text-gray-400" />
           </div>
           <p className="text-2xl font-bold text-amber-500">4</p>
         </div>
      </div>

      <div className="bg-[#0026f7]/10 rounded-xl border border-transparent p-6 mb-6">
         <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#0026f7]" />
            <h3 className="font-semibold text-gray-900">Próximos Compromissos</h3>
         </div>
         
         <div className="space-y-2">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                 {event.synced && (
                    <span className="w-5 h-5 rounded bg-green-500 flex items-center justify-center text-white text-xs">✓</span>
                 )}
                 <div className="flex-1">
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.datetime}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
               <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
               <h3 className="font-semibold capitalize text-gray-900">janeiro 2026</h3>
               <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm">
               {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'].map((day) => (
                  <div key={day} className="py-2 text-gray-400 font-medium text-xs uppercase">{day}</div>
               ))}
               {Array.from({length: 31}, (_, i) => {
                  const day = i + 1;
                  const isToday = day === 28;
                  const isSelected = day === 28; 
                  const hasEvent = [26, 28, 29].includes(day);

                  return (
                     <button
                       key={i}
                       className={`
                         py-2 rounded-lg text-sm relative
                         ${isSelected ? 'bg-[#0026f7] text-white' : 'text-gray-700 hover:bg-gray-50'}
                         ${isToday && !isSelected ? 'bg-gray-100 font-bold' : ''}
                       `}
                     >
                        {day}
                        {hasEvent && !isSelected && (
                           <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0026f7]" />
                        )}
                     </button>
                  )
               })}
            </div>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-semibold text-gray-900">Eventos em 28 de jan</h3>
            </div>
            <div className="text-center py-12 text-gray-400">
               <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
               <p>Nenhum evento neste dia</p>
            </div>
         </div>
      </div>
    </div>
  );
}