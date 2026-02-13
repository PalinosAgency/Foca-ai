export const PIE_COLORS = [
    "hsl(217, 91%, 60%)",   // Finance Blue
    "hsl(142, 71%, 45%)",   // Health Green
    "hsl(25, 95%, 53%)",    // Training Orange
    "hsl(262, 83%, 58%)",   // Schedule Purple
    "hsl(199, 89%, 48%)",   // Academic Cyan
    "hsl(0, 84%, 60%)",     // Destructive Red
    "hsl(45, 93%, 47%)",    // Yellow
    "hsl(280, 65%, 60%)",   // Violet
    "hsl(180, 50%, 50%)",   // Teal
];

import { FileText, CalendarCheck, BookOpen, GraduationCap, LucideIcon } from 'lucide-react';

export const ACADEMIC_TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: LucideIcon }> = {
    prova: { label: "Prova", color: "text-red-600", bg: "bg-red-100", icon: FileText },
    trabalho: { label: "Trabalho", color: "text-orange-600", bg: "bg-orange-100", icon: CalendarCheck },
    leitura: { label: "Leitura", color: "text-blue-600", bg: "bg-blue-100", icon: BookOpen },
    estudo: { label: "Estudo", color: "text-green-600", bg: "bg-green-100", icon: GraduationCap },
};

