import {
  GraduationCap, Brain, CalendarClock, CheckCircle2, Clock,
  Pencil, FileText, BookOpen, Calendar as CalendarIcon,
  CalendarCheck, Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';

export function AcademicTab() {
  // --- MOCK DATA ---
  const studySessions = 12;
  const upcomingExams = 2;
  const totalActivities = 24;
  const nextExamDate = "15/02";

  // Mock baseado no "TagsOverview.tsx"
  const tagCounts = [
    { tag: 'estudo', label: 'Estudos', count: 12, icon: GraduationCap, color: 'bg-green-500', iconColor: 'text-white' },
    { tag: 'trabalho', label: 'Trabalhos', count: 5, icon: CalendarCheck, color: 'bg-orange-500', iconColor: 'text-white' },
    { tag: 'leitura', label: 'Leituras', count: 4, icon: BookOpen, color: 'bg-blue-500', iconColor: 'text-white' },
    { tag: 'prova', label: 'Provas', count: 3, icon: Pencil, color: 'bg-red-500', iconColor: 'text-white' },
  ];

  // Mock baseado no "AcademicList.tsx" e "typeConfig"
  const items = [
    {
      id: '1',
      doc_name: 'Prova de Cálculo I',
      summary: 'Conteúdo: Derivadas, Limites e Integrais básicas.',
      tag: 'prova',
      created_at: '20 de Fev às 08:00',
      isFuture: true
    },
    {
      id: '2',
      doc_name: 'Relatório de Física',
      summary: 'Análise do experimento de queda livre.',
      tag: 'trabalho',
      created_at: '28 de Jan às 10:30',
      isFuture: false
    },
    {
      id: '3',
      doc_name: 'Capítulo 4 - História',
      summary: 'Leitura sobre a Revolução Industrial.',
      tag: 'leitura',
      created_at: '26 de Jan às 14:00',
      isFuture: false
    },
    {
      id: '4',
      doc_name: 'Lista de Exercícios',
      summary: 'Resolver questões 1 a 10 da lista de Álgebra.',
      tag: 'estudo',
      created_at: '25 de Jan às 16:00',
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
    <div className="space-y-6 font-sans text-slate-900">

      {/* --- HEADER --- */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#040949]">Acadêmico</h1>
            <p className="text-slate-500 mt-1">Planejamento, estudos e provas</p>
          </div>
        </div>

        {/* Date Selector Mock */}
        <div className="w-[200px] flex items-center justify-start text-left font-normal px-4 py-2 bg-white border border-slate-200 rounded-md text-slate-500 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>28/12/25 - 28/01/26</span>
        </div>
      </motion.div>

      {/* --- METRICS ROW --- */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {/* Sessões Estudo */}
        <motion.div
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-green-300 transition-colors"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Sessões Estudo</span>
            <Brain className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-green-600">{studySessions}</span>
          </div>
        </motion.div>

        {/* Provas Futuras */}
        <motion.div
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-red-300 transition-colors"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Provas Futuras</span>
            <CalendarClock className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-red-600">{upcomingExams}</span>
          </div>
        </motion.div>

        {/* Total Atividades */}
        <motion.div
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition-colors"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Total Atividades</span>
            <CheckCircle2 className="h-5 w-5 text-slate-400" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-700">{totalActivities}</span>
          </div>
        </motion.div>

        {/* Próxima Prova */}
        <motion.div
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-300 transition-colors"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Próxima Prova</span>
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-blue-600">{nextExamDate}</span>
          </div>
        </motion.div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">

        {/* COLUNA ESQUERDA: TagsOverview (Distribuição) */}
        <motion.div
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm h-fit"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Distribuição</h3>
          <div className="space-y-4">
            {tagCounts.map((item) => {
              const totalDocs = tagCounts.reduce((acc, d) => acc + d.count, 0);
              const percentage = (item.count / totalDocs) * 100;

              return (
                <div key={item.tag} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.color} ${item.iconColor}`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-slate-700 text-sm">{item.label}</span>
                    </div>
                    <span className="text-sm text-slate-500">{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* COLUNA DIREITA: AcademicList (Cronograma) */}
        <motion.div
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 overflow-hidden"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        >
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Cronograma de Atividades</h3>
          <div className="space-y-3 pr-2">
            {items.map((item) => {
              const config = typeConfig[item.tag];
              const Icon = config.icon;

              return (
                <div
                  key={item.id}
                  className="group flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-4 transition-all hover:shadow-sm"
                >
                  {/* Ícone do Tipo */}
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
                    <Icon className={`h-6 w-6 ${config.color}`} />
                  </div>

                  {/* Conteúdo */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="truncate font-semibold text-slate-900">{item.doc_name}</h4>
                      {item.isFuture && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          Agendado
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="text-xs text-slate-500">
                        {item.created_at}
                      </span>
                    </div>

                    {item.summary && (
                      <p className="mt-2 text-sm text-slate-500 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100/50">
                        {item.summary}
                      </p>
                    )}
                  </div>

                  {/* Botão de Ação Visual */}
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-md text-slate-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}