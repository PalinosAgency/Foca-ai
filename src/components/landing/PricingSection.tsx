import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const plan = {
  id: 'premium-plan',
  name: 'Foca.aí',
  description: 'Acesso ilimitado a todas as ferramentas',
  price: 29.90,
  features: [
    'Finanças ilimitadas',
    'Todos os hábitos de saúde',
    'Organização de estudos',
    'Agenda + Google Calendar',
    'Suporte prioritário',
    'Dashboard completo',
  ],
};

export function PricingSection() {
  // Removi o setIsOpen daqui, pois vamos navegar para a página do carrinho
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // Removi o toast daqui, pois não vamos usar nessa ação direta
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    // Pequeno delay para feedback visual
    await new Promise(resolve => setTimeout(resolve, 600));

    if (isAuthenticated) {
      // 1. Adiciona ao carrinho (SEM abrir sidebar, graças ao 'false')
      addItem({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        quantity: 1,
        type: 'subscription'
      }, false); 

      // 2. Redireciona direto para o Carrinho/Checkout
      // Isso evita a mensagem de toast cobrindo o botão
      navigate('/cart');
      
    } else {
      // Se não estiver logado, manda para o registro (mantido igual)
      navigate('/register', { 
        state: { 
          from: '/',
          action: 'add_to_cart',
          plan: plan
        } 
      });
    }
    
    setIsLoading(false);
  };

  return (
    <section id="precos" className="py-12 md:py-24 px-4 bg-[#040949] text-white">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Plano <span className="text-[#0026f7]">Simples</span>
          </h2>
          <p className="text-blue-100/80 text-base md:text-lg">
            Um único plano com acesso a tudo. Teste grátis por 3 dias.
          </p>
        </motion.div>

        <div className="flex justify-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative w-full max-w-sm bg-white text-[#040949] rounded-2xl p-6 md:p-8 shadow-2xl ring-4 ring-[#0026f7]/20"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 rounded-full bg-[#0026f7] text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                Melhor Oferta
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 mb-2 mt-2">
                <img 
                  src="/logo-icon-fundo.png" 
                  alt="Foca.aí Logo" 
                  className="w-12 h-12 md:w-16 md:h-16 object-contain"
                />
                <h3 className="text-2xl md:text-3xl font-bold text-[#040949]">{plan.name}</h3>
            </div>

            <p className="text-gray-500 text-sm mb-6 text-center">{plan.description}</p>
            
            <div className="flex items-baseline justify-center gap-1 mb-8">
              <span className="text-4xl md:text-5xl font-extrabold text-[#040949]">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
              <span className="text-gray-500 font-medium">/mês</span>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-[#0026f7]/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#0026f7]" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full h-12 text-base font-bold bg-[#0026f7] hover:bg-[#0026f7]/90 text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                'Começar Agora'
              )}
            </Button>
            
            <p className="text-xs text-center text-gray-400 mt-4">
              Cancele quando quiser. Sem taxas ocultas.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}