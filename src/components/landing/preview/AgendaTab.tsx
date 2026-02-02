import { Calendar, Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { upcomingEvents } from './mocks';

export function AgendaTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 mb-2">
         <div className="flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
             <Calendar className="w-7 h-7 text-orange-500" />
           </div>
           <div>
             <h2 className="text-3xl font-bold text-gray-900">Agenda</h2>
             <p className="text-gray-500 text-base">Seus compromissos</p>
           </div>
         </div>
         
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-base font-medium text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
               <Clock className="w-5 h-5" />
               <span>10:42</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-base text-gray-600 shadow-sm cursor-pointer hover:bg-gray-50">
              <Calendar className="w-5 h-5 opacity-50" />
              <span>28 dez - 28 jan</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
           <div>
             <span className="text-sm font-bold text-gray-500 uppercase block mb-1">Futuros</span>
             <p className="text-3xl font-extrabold text-[#0026f7]">4</p>
           </div>
           <div className="p-3 bg-gray-50 rounded-xl"><Clock className="h-6 w-6 text-gray-400" /></div>
         </div>
         
         <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
           <div>
             <span className="text-sm font-bold text-gray-500 uppercase block mb-1">Sincronizados</span>
             <p className="text-3xl font-extrabold text-green-600">0</p>
           </div>
           <div className="p-3 bg-gray-50 rounded-xl"><CheckCircle className="h-6 w-6 text-gray-400" /></div>
         </div>

         <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
           <div>
             <span className="text-sm font-bold text-gray-500 uppercase block mb-1">Pendentes</span>
             <p className="text-3xl font-extrabold text-amber-500">4</p>
           </div>
           <div className="p-3 bg-gray-50 rounded-xl"><AlertCircle className="h-6 w-6 text-gray-400" /></div>
         </div>
      </div>

      <div className="bg-[#0026f7]/5 rounded-2xl border border-[#0026f7]/10 p-6">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#0026f7]/10 rounded-lg">
                <Calendar className="w-5 h-5 text-[#0026f7]" />
            </div>
            <h3 className="font-bold text-xl text-gray-900">Próximos Compromissos</h3>
         </div>
         
         <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-5 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${event.synced ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-200 bg-gray-50'}`}>
                    {event.synced ? <CheckCircle className="w-5 h-5" /> : <div className="w-2 h-2 bg-gray-300 rounded-full" />}
                 </div>
                 <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg">{event.title}</p>
                    <p className="text-sm text-gray-500 font-medium">{event.datetime}</p>
                 </div>
                 <button className="text-sm font-bold text-[#0026f7] hover:underline px-4">Detalhes</button>
              </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
               <button className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5 text-gray-500" /></button>
               <h3 className="font-bold text-lg capitalize text-gray-900">janeiro 2026</h3>
               <button className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-5 h-5 text-gray-500" /></button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-sm">
               {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'].map((day) => (
                  <div key={day} className="py-2 text-gray-400 font-bold text-xs uppercase">{day}</div>
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
                         h-10 rounded-lg text-sm font-medium relative transition-colors
                         ${isSelected ? 'bg-[#0026f7] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}
                         ${isToday && !isSelected ? 'bg-gray-100 font-bold' : ''}
                       `}
                     >
                        {day}
                        {hasEvent && !isSelected && (
                           <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#0026f7]" />
                        )}
                     </button>
                  )
               })}
            </div>
         </div>

         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
               <Calendar className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">28 de Janeiro</h3>
            <p className="text-gray-500">Nenhum evento agendado para hoje.</p>
            <button className="mt-6 px-6 py-3 bg-[#0026f7] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-[#0026f7]/90 transition-colors">
               + Novo Evento
            </button>
         </div>
      </div>
    </div>
  );
}