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

export function DesktopFeatures() {
    return (
        <section className="hidden lg:block py-24 px-4 bg-gray-50 text-[#040949]">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#040949]">
                        Tudo que você precisa em{' '}
                        <span className="text-[#0026f7]">um só lugar</span>
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Quatro módulos poderosos para organizar cada aspecto da sua vida pessoal.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-6`}>
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-[#040949]">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed font-medium">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
