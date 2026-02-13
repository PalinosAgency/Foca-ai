// Cores do Sistema
export const COLORS = {
  primary: '#0026f7',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  text: '#040949',
  bg: '#F8FAFC'
};

// --- VISÃO GERAL ---
export const overviewExpenses = [
  { name: 'Mercado', value: 450, color: '#3B82F6' },
  { name: 'Alimentação', value: 150, color: '#22C55E' },
  { name: 'Transporte', value: 120, color: '#F97316' },
];

export const overviewTransactions = [
  { id: '1', description: 'Uber da semana', category: 'Transporte', date: '26/01', amount: -120, type: 'expense' },
  { id: '2', description: 'Almoço de Equipe', category: 'Alimentação', date: '26/01', amount: -150, type: 'expense' },
  { id: '3', description: 'Compras Semanais', category: 'Mercado', date: '25/01', amount: -450, type: 'expense' },
  { id: '4', description: 'Pagamento Mensal', category: 'Salário', date: '24/01', amount: 8500, type: 'income' },
  { id: '5', description: 'Dividendos FIIs', category: 'Investimentos', date: '21/01', amount: 1200, type: 'income' },
];

export const upcomingEvents = [
  { id: '1', title: 'Reunião Design', datetime: 'Amanhã 12:00', synced: true },
  { id: '2', title: 'Dentista Amanhã', datetime: 'Amanhã 14:20', synced: true },
  { id: '3', title: 'Apresentação Final', datetime: 'qui., 29 00:20', synced: true },
  { id: '4', title: 'Viagem Férias', datetime: 'qui., 26 14:20', synced: true },
];

// --- FINANÇAS ---
export const financeDaily = [
  { date: '11/01', income: 2500, expense: 800 },
  { date: '16/01', income: 3200, expense: 1200 },
  { date: '21/01', income: 8500, expense: 2500 },
  { date: '24/01', income: 1000, expense: 500 },
  { date: '25/01', income: 500, expense: 450 },
  { date: '28/01', income: 300, expense: 200 },
];

export const financeCategories = [
  { name: 'Transporte', value: 1200, color: '#3B82F6' },
  { name: 'Alimentação', value: 800, color: '#22C55E' },
  { name: 'Mercado', value: 1500, color: '#F97316' },
  { name: 'Moradia', value: 2200, color: '#8B5CF6' },
  { name: 'Lazer', value: 720, color: '#06B6D4' },
];

export const financeTransactions = [
  { id: '1', description: 'Uber da semana', category: 'Transporte', date: '28/01', amount: -120, type: 'expense' },
  { id: '2', description: 'Almoço de Equipe', category: 'Alimentação', date: '28/01', amount: -150, type: 'expense' },
  { id: '3', description: 'Compras Semanais', category: 'Mercado', date: '25/01', amount: -450, type: 'expense' },
  { id: '4', description: 'Pagamento Mensal', category: 'Salário', date: '24/01', amount: 8500, type: 'income' },
  { id: '6', description: 'Aluguel + Cond', category: 'Moradia', date: '18/01', amount: -2200, type: 'expense' },
];

// --- SAÚDE ---
export const waterData = [
  { day: 'dom', value: 2100 },
  { day: 'seg', value: 1800 },
  { day: 'ter', value: 2500 },
  { day: 'qua', value: 1200 },
];

export const sleepData = [
  { day: 'dom', value: 6.5 },
  { day: 'seg', value: 7.2 },
  { day: 'ter', value: 8.0 },
  { day: 'qua', value: 6.8 },
];

export const workouts = [
  { id: '1', type: 'Musculação', date: 'domingo, 25 de janeiro' },
];

// --- ACADÊMICO ---
export const academicDocs = [
  {
    id: '1',
    title: 'Trabalho de História',
    category: 'Trabalho',
    description: 'Revolução Industrial.',
    date: '24 de janeiro às 17:20',
  },
  {
    id: '2',
    title: 'Anotações de Reunião',
    category: 'Trabalho',
    description: 'Pauta sobre o novo sistema.',
    date: '21 de janeiro às 17:20',
  },
];

export const academicCategories = [
  { name: 'Trabalho', count: 2 },
];

// --- NOVOS MOCKS MOBILE ---

// Health
export const workoutLog = [
  { id: '1', item: 'Musculação', description: 'Peito e Tríceps', date: '2025-01-28', value: 60, unit: 'min' },
  { id: '2', item: 'Corrida', description: 'Parque Ibirapuera', date: '2025-01-26', value: 5, unit: 'km' },
];

export const weightLog = [
  { date: '2025-01-28', value: 78.5 },
  { date: '2025-01-21', value: 79.2 },
];

// Academic
export const academicItems = [
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

// Agenda
export const agendaEvents = [
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
