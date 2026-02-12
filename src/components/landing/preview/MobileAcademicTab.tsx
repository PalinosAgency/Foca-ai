import {
    GraduationCap, Brain, CalendarClock, CheckCircle2, Clock,
    Pencil, FileText, BookOpen, Calendar as CalendarIcon,
    CalendarCheck, Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';

export function MobileAcademicTab() {
    // --- MOCK DATA ---
    const studySessions = 12;
    const upcomingExams = 2;
    const totalActivities = 24;
    const nextExamDate = "15/02";

    // Mock baseado no "AcademicList.tsx" e "typeConfig"
    const items = [
        {
            id: '1',
            doc_name: 'Prova de Cálculo I',
            tag: 'prova',
            created_at: '20 de Fev',
            isFuture: true
        },
        {
            id: '2',
            doc_name: 'Relatório de Física',
            tag: 'trabalho',
            created_at: '28 de Jan',
            isFuture: false
        },
        {
            id: '3',
            doc_name: 'Capítulo 4 - História',
            tag: 'leitura',
            created_at: '26 de Jan',
            isFuture: false
        },
    ];

    // Configuração visual idêntica ao "AcademicList.tsx"
    const typeConfig: any = {
        prova: { label: "Prova", color: "text-red-600", bg: "bg-red-100", icon: FileText },
        trabalho: { label: "Trabalho", color: "text-orange-600", bg: "bg-orange-100", icon: CalendarCheck },
        leitura: { label: "Leitura", color: "text-blue-600", bg: "bg-blue-100", icon: BookOpen },
        estudo: { label: "Estudo", color: "text-green-600", bg: "bg-green-100", icon: GraduationCap },
    };

    return (
        <div className="space-y-4 font-sans text-slate-900 pb-4">

            {/* --- HEADER --- */}
            <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                        <GraduationCap className="h-4 w-4" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-[#040949]">Acadêmico</h1>
                        <p className="text-xs text-slate-500">Planejamento e estudos</p>
                    </div>
                </div>
            </motion.div>

            {/* --- METRICS ROW --- */}
            <div className="grid gap-3 grid-cols-2">
                {/* Sessões Estudo */}
                <motion.div
                    className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Sessões</span>
                        <Brain className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="text-xl font-bold text-green-600">{studySessions}</span>
                </motion.div>

                {/* Provas Futuras */}
                <motion.div
                    className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Provas</span>
                        <CalendarClock className="h-4 w-4 text-red-500" />
                    </div>
                    <span className="text-xl font-bold text-red-600">{upcomingExams}</span>
                </motion.div>

                {/* Total Atividades */}
                <motion.div
                    className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Atividades</span>
                        <CheckCircle2 className="h-4 w-4 text-slate-400" />
                    </div>
                    <span className="text-xl font-bold text-slate-700">{totalActivities}</span>
                </motion.div>

                {/* Próxima Prova */}
                <motion.div
                    className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Próx. Prova</span>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-xl font-bold text-blue-600">{nextExamDate}</span>
                </motion.div>
            </div>

            {/* --- DISTRIBUTION (Added for Parity) --- */}
            <motion.div
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            >
                <h3 className="mb-3 text-sm font-semibold text-slate-900">Distribuição</h3>
                <div className="space-y-3">
                    {[
                        { tag: 'estudo', label: 'Estudos', count: 12, color: 'bg-green-500', iconColor: 'text-white' },
                        { tag: 'trabalho', label: 'Trabalhos', count: 5, color: 'bg-orange-500', iconColor: 'text-white' },
                        { tag: 'leitura', label: 'Leituras', count: 4, color: 'bg-blue-500', iconColor: 'text-white' },
                        { tag: 'prova', label: 'Provas', count: 3, color: 'bg-red-500', iconColor: 'text-white' },
                    ].map((item) => {
                        const totalDocs = 24; // Mock total
                        const percentage = (item.count / totalDocs) * 100;

                        return (
                            <div key={item.tag} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-medium text-slate-700">{item.label}</span>
                                    <span className="text-slate-500">{item.count}</span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={`h-full rounded-full ${item.color}`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* --- LIST ROW --- */}
            <motion.div
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            >
                <h3 className="mb-3 text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Cronograma</h3>
                <div className="space-y-2">
                    {items.map((item) => {
                        const config = typeConfig[item.tag];
                        const Icon = config.icon;

                        return (
                            <div
                                key={item.id}
                                className="flex items-center gap-3 rounded-lg bg-slate-50 p-2"
                            >
                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                                    <Icon className={`h-4 w-4 ${config.color}`} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="truncate text-xs font-semibold text-slate-900">{item.doc_name}</h4>
                                    </div>

                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-slate-500">
                                            {item.created_at}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

        </div>
    );
}
