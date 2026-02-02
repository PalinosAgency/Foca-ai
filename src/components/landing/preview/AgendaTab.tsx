import { Calendar, Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { upcomingEvents } from './mocks';

export function AgendaTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 mb-2">
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
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
               <Clock className="w-4 h-4" />
               <span>10:42</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 shadow-sm">
              <Calendar className="w-4 h-4 opacity-50" />
              <span>28 dez - 28 jan</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
         <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
           <div>
             <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Futuros</span>
             <p className="text-2xl font-extrabold text-[#0026f7]">4</p>
           </div>
           <div className="p-2 bg-gray-50 rounded-lg"><Clock className="h-5 w-5 text-gray-400" /></div>
         </div>
         
         <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
           <div>
             <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Sincronizados</span>
             <p className="text-2xl font-extrabold text-green-600">0</p>
           </div>
           <div className="p-2 bg-gray-50 rounded-lg"><CheckCircle className="h-5 w-5 text-gray-400" /></div>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
           <div>
             <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Pendentes</span>
             <p className="text-2xl font-extrabold text-amber-500">4</p>
           </div>
           <div className="p-2 bg-gray-50 rounded-lg"><AlertCircle className="h-5 w-5 text-gray-400" /></div>
         </div>
      </div>

      <div className="bg-[#0026f7]/5 rounded-xl border border-[#0026f7]/10 p-6">
         <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-[#0026f7]/10 rounded-lg">
                <Calendar className="w-4 h-4 text-[#0026f7]" />
            </div>
            <h3 className="font-bold text-lg text-gray-900">Próximos Compromissos</h3>
         </div>
         
         <div className="space-y-2">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                 <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${event.synced ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-200 bg-gray-50'}`}>
                    {event.synced ? <CheckCircle className="w-4 h-4" /> : <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />}
                 </div>
                 <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{event.title}</p>
                    <p className="text-xs text-gray-500 font-medium">{event.datetime}</p>
                 </div>
                 <button className="text-xs font-bold text-[#0026f7] hover:underline px-3">Detalhes</button>
              </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
               <button className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
               <h3 className="font-bold text-sm capitalize text-gray-900">janeiro 2026</h3>
               <button className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs">
               {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'].map((day) => (
                  <div key={day} className="py-1 text-gray-400 font-bold text-[10px] uppercase">{day}</div>
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
                         h-8 rounded-md text-xs font-medium relative transition-colors
                         ${isSelected ? 'bg-[#0026f7] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}
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

         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
               <Calendar className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">28 de Janeiro</h3>
            <p className="text-xs text-gray-500">Sem eventos.</p>
            <button className="mt-4 px-4 py-2 bg-[#0026f7] text-white rounded-lg font-bold text-xs shadow-md hover:bg-[#0026f7]/90 transition-colors">
               + Novo Evento
            </button>
         </div>
      </div>
    </div>
  );
}