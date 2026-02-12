import { motion } from 'framer-motion';
import { Check, Zap, Wallet, Layers, Shield } from 'lucide-react';

const benefits = [
    'Organize sua vida financeira sem planilhas',
    'Acompanhe hábitos de saúde de forma simples',
    'Organização simplificada de estudos e arquivos',
    'Agenda sincronizada com Google Calendar',
    'Tudo pelo WhatsApp, sem apps extras',
    'Dashboard completo com gráficos',
];

export function MobileBenefits() {
    return (
        <section className="lg:hidden py-10 px-4 bg-white text-[#040949]">
            <div className="container mx-auto">
                <div className="flex flex-col gap-8">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-xl font-bold mb-4">
                            Por que escolher o <span className="text-[#0026f7]">Foca.aí</span>?
                        </h2>
                        <ul className="space-y-3 text-left max-w-xs mx-auto">
                            {benefits.map((benefit, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-5 h-5 rounded-full bg-[#0026f7]/10 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-[#0026f7]" />
                                    </div>
                                    <span className="text-gray-700 text-sm font-medium">{benefit}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                                <Zap className="w-6 h-6 text-[#0026f7] mx-auto mb-1" />
                                <p className="text-lg font-bold text-[#040949]">-80%</p>
                                <p className="text-xs text-gray-600">Tempo gasto</p>
                            </div>

                            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-center shadow-sm">
                                <Wallet className="w-6 h-6 text-rose-600 mx-auto mb-1" />
                                <p className="text-lg font-bold text-rose-600">+30%</p>
                                <p className="text-xs text-rose-800/80">Economia</p>
                            </div>

                            <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-center">
                                <Layers className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                                <p className="text-lg font-bold text-[#040949]">4 em 1</p>
                                <p className="text-xs text-gray-600">Completo</p>
                            </div>

                            <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
                                <Shield className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                                <p className="text-lg font-bold text-[#040949]">100%</p>
                                <p className="text-xs text-gray-600">Privado</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
