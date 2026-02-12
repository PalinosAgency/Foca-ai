import {
    Calendar as CalendarIcon, Clock, CheckCircle, CalendarDays,
    RefreshCw, Cloud
} from 'lucide-react';
import { motion } from 'framer-motion';

export function MobileAgendaTab() {
    // --- MOCK DATA ---
    const eventsCount = 8;
    const eventsTodayCount = 3;
    const syncedCount = 5;

    // Mock para "EventsList" (Eventos do dia selecionado)
    const eventsList = [
        {
            id: '1',
            title: 'Reunião de Projeto',
            time: '14:00',
            description: 'Alinhamento semanal com a equipe.',
            synced: true
        },
        {
            id: '2',
            title: 'Focar no Dashboard',
            time: '15:30',
            description: 'Finalizar a implementação.',
            synced: false
        },
        {
            id: '3',
            title: 'Academia',
            time: '18:00',
            description: 'Treino de perna.',
            synced: true
        }
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
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                        <CalendarIcon className="h-4 w-4" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-[#040949]">Agenda</h1>
                        <p className="text-xs text-slate-500">Compromissos</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 w-fit self-end">
                    <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                    <span>10:45</span>
                </div>
            </motion.div>

            {/* --- METRICS ROW --- */}
            <div className="grid gap-3 grid-cols-3">
                {/* Total Agenda */}
                <motion.div
                    className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm flex flex-col items-center justify-center h-20 text-center"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                >
                    <Clock className="h-4 w-4 text-violet-500 mb-1" />
                    <span className="text-lg font-bold text-violet-600 leading-none">{eventsCount}</span>
                    <span className="text-[10px] text-slate-500">Total</span>
                </motion.div>

                {/* Eventos Hoje */}
                <motion.div
                    className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm flex flex-col items-center justify-center h-20 text-center"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                >
                    <CalendarDays className="h-4 w-4 text-orange-500 mb-1" />
                    <span className="text-lg font-bold text-orange-600 leading-none">{eventsTodayCount}</span>
                    <span className="text-[10px] text-slate-500">Hoje</span>
                </motion.div>

                {/* Sincronizados */}
                <motion.div
                    className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm flex flex-col items-center justify-center h-20 text-center"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                >
                    <CheckCircle className="h-4 w-4 text-green-500 mb-1" />
                    <span className="text-lg font-bold text-green-600 leading-none">{syncedCount}</span>
                    <span className="text-[10px] text-slate-500">Sync</span>
                </motion.div>
            </div>

            {/* --- UPCOMING EVENTS (Added for Parity) --- */}
            <motion.div
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            >
                <h3 className="mb-3 text-sm font-semibold flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2">
                    Próximos
                </h3>
                <div className="space-y-2">
                    {[
                        { id: '1', title: 'Reunião de Projeto', date: '28/01 14:00', synced: true },
                        { id: '2', title: 'Dentista', date: '29/01 09:00', synced: false },
                    ].map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate text-slate-900">{event.title}</p>
                                <p className="text-[10px] text-slate-500">{event.date}</p>
                            </div>
                            {event.synced && (
                                <CheckCircle className="h-3 w-3 text-green-500 ml-2" />
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Events List */}
            <motion.div
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            >
                <h3 className="mb-3 text-sm font-semibold flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2">
                    Eventos Hoje
                </h3>

                <div className="space-y-2">
                    {eventsList.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-start gap-3 rounded-lg bg-slate-50 p-2 border border-slate-100"
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                                <CalendarIcon className="h-4 w-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="truncate text-xs font-semibold text-slate-900">{event.title}</h4>
                                </div>

                                <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-500">
                                    <Clock className="h-3 w-3" />
                                    <span className="font-medium">
                                        {event.time}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

        </div>
    );
}
