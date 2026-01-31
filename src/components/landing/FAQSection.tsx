import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Como funciona o Foca.aí?',
    answer: 'O Foca.Aí é um assistente pessoal que funciona via WhatsApp. Você envia mensagens para registrar gastos, hábitos de saúde, organização de estudos e compromissos. Tudo é organizado automaticamente e disponível no dashboard.',
  },
  {
    question: 'Preciso baixar algum aplicativo?',
    answer: 'Não! O Foca.Aí funciona diretamente no WhatsApp que você já usa. O dashboard é acessível pelo navegador, sem necessidade de instalar nada.',
  },
  {
    question: 'Como funciona o período de teste?',
    answer: 'Oferecemos 3 dias grátis para você experimentar todas as funcionalidades. Após o período de teste, a cobrança é feita automaticamente no cartão cadastrado.',
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim! Você pode cancelar sua assinatura a qualquer momento diretamente pelo site do Foca.aí (em Minha Conta), sem taxas ou burocracia.',
  },
  {
    question: 'Meus dados estão seguros?',
    answer: 'Absolutamente. Utilizamos criptografia de ponta a ponta e não compartilhamos seus dados com terceiros. Sua privacidade é nossa prioridade.',
  },
  {
    question: 'Como funciona a integração com Google Calendar?',
    answer: 'Ao criar compromissos via WhatsApp (ex: "Reunião amanhã às 14h"), o evento é automaticamente sincronizado com seu Google Calendar.',
  },
  {
    question: 'Como entro em contato com o suporte?',
    answer: 'Nosso suporte é realizado exclusivamente através do e-mail suportefocaaioficial@gmail.com. Envie sua dúvida e nossa equipe responderá o mais breve possível.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 px-4 bg-white text-[#040949]">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#040949]">
            Perguntas{' '}
            <span className="text-[#0026f7]">frequentes</span>
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <AccordionItem value={`item-${index}`} className="bg-gray-50 border border-gray-200 rounded-lg px-6 hover:bg-white hover:shadow-md transition-all">
                {/* Pergunta em Negrito Forte */}
                <AccordionTrigger className="text-left hover:no-underline text-[#040949] font-bold text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}