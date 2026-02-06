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
    answer: 'O Foca.aí é um assistente pessoal inteligente integrado ao seu WhatsApp. Você envia mensagens de áudio ou texto para registrar gastos, hábitos, estudos e agenda. Nossa IA processa tudo, organiza automaticamente e disponibiliza em um dashboard visual.',
  },
  {
    question: 'Preciso baixar algum aplicativo?',
    answer: 'Não! O Foca.aí funciona diretamente no WhatsApp que você já usa todos os dias. O painel de controle (Dashboard) é acessível por qualquer navegador no celular ou computador, sem ocupar espaço no seu telefone.',
  },
  {
    question: 'Como funciona o período de teste?',
    answer: 'Oferecemos 3 dias totalmente grátis. Você tem acesso a todas as funcionalidades premium. A cobrança só ocorre automaticamente após esse período, caso você decida continuar.',
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim! Sem fidelidade e sem taxas surpresas. O cancelamento é gerenciado de forma segura pela Hotmart. Em "Minha Conta" no nosso site, disponibilizamos um link direto para você gerenciar ou cancelar sua assinatura com apenas alguns cliques.',
  },
  {
    question: 'Meus dados estão seguros?',
    answer: 'Segurança é nossa prioridade. Utilizamos criptografia de ponta a ponta e seguimos rigorosamente a LGPD. Seus dados financeiros são processados exclusivamente pela Hotmart; nós não temos acesso a nenhum dado de pagamento (seja cartão, PIX ou boleto).',
  },
  {
    question: 'Como funciona a integração com Google Calendar?',
    answer: 'É automática! Ao enviar um compromisso para o WhatsApp (ex: "Dentista amanhã às 14h"), a IA entende a data e o horário e cria o evento diretamente na sua agenda do Google.',
  },
  {
    question: 'Como entro em contato com o suporte?',
    answer: 'Nosso suporte é realizado através do e-mail suportefocaaioficial@gmail.com. Nossa equipe está pronta para tirar suas dúvidas e ajudar no que for preciso.',
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