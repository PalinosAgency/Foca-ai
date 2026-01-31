import { motion } from 'framer-motion';
import { Check, Zap, Wallet, Layers, Shield } from 'lucide-react';

const benefits = [
  'Organize sua vida financeira sem planilhas',
  'Acompanhe hábitos de saúde de forma simples',
  'Organização simplificada de estudos e arquivos', // Texto ajustado
  'Agenda sincronizada com Google Calendar',
  'Tudo pelo WhatsApp, sem apps extras',
  'Dashboard completo com gráficos',
];

export function BenefitsSection() {
  return (
    // BG-WHITE, TEXTO DEEP BLUE
    <section className="py-24 px-4 bg-white text-[#040949]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          
          {/* LADO ESQUERDO: Texto */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Por que escolher o{' '}
              <span className="text-[#0026f7]">Foca.aí</span>?
            </h2>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  {/* Ícone de check com Electric Blue oficial */}
                  <div className="w-6 h-6 rounded-full bg-[#0026f7]/10 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-[#0026f7]" />
                  </div>
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* LADO DIREITO: Grid de Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <Zap className="w-8 h-8 text-[#0026f7] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#040949]">-80%</p>
                <p className="text-sm text-gray-600">Tempo gasto organizando</p>
              </div>
              
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-center hover:shadow-lg transition-all shadow-md transform scale-105 z-10">
                <Wallet className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-rose-600">+30%</p>
                <p className="text-sm text-rose-800/80">Economia mensal média</p>
              </div>
              
              {/* CARD NOVO - Substituindo usuários ativos */}
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <Layers className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#040949]">4 em 1</p>
                <p className="text-sm text-gray-600">Gestão Integrada Completa</p>
              </div>
              
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <Shield className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#040949]">100%</p>
                <p className="text-sm text-gray-600">Privacidade Garantida</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}