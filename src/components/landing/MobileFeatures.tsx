import { motion } from 'framer-motion';
import { Wallet, Heart, GraduationCap, Calendar } from 'lucide-react';

const features = [
    {
        icon: Wallet,
        title: 'Finanças Pessoais',
        description: 'Registre gastos e receitas via WhatsApp. Visualize gráficos, categorias e balanço em tempo real.',
        color: 'bg-blue-100 text-[#0026f7]',
    },
    {
        icon: Heart,
        title: 'Hábitos de Saúde',
        description: 'Acompanhe consumo de água, horas de sono e treinos. Defina metas e monitore seu progresso.',
        color: 'bg-rose-100 text-rose-600',
    },
    {
        icon: GraduationCap,
        title: 'Gestão Acadêmica',
        description: 'Organize materiais de estudo, datas de provas e trabalhos. Mantenha seu desempenho acadêmico em dia.',
        color: 'bg-purple-100 text-purple-600',
    },
    {
        icon: Calendar,
        title: 'Agenda Inteligente',
        description: 'Crie compromissos via WhatsApp e sincronize automaticamente com Google Calendar.',
        color: 'bg-orange-100 text-orange-600',
    },
];

export function MobileFeatures() {
    return (
        <section className="lg:hidden py-16 px-4 bg-gray-50 text-[#040949]">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h2 className="text-2xl font-extrabold mb-3 text-[#040949]">
                        Tudo em{' '}
                        <span className="text-[#0026f7]">um só lugar</span>
                    </h2>
                    <p className="text-gray-600 text-base max-w-xs mx-auto leading-relaxed">
                        Quatro módulos poderosos para organizar sua vida.
                    </p>
                </motion.div>

                <div className="flex flex-col gap-4 max-w-sm mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-start gap-4"
                        >
                            <div className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center shrink-0`}>
                                <feature.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-1 text-[#040949]">{feature.title}</h3>
                                <p className="text-gray-500 text-sm leading-snug">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
