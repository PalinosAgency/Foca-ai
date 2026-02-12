import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

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

export function MobilePricing() {
    const { addItem } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 600));

        if (isAuthenticated) {
            addItem({
                id: plan.id,
                name: plan.name,
                price: plan.price,
                quantity: 1,
                type: 'subscription'
            }, false);
            navigate('/cart');
        } else {
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
        <section className="lg:hidden py-16 px-4 bg-[#040949] text-white">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h2 className="text-2xl font-bold mb-2">
                        Plano <span className="text-[#0026f7]">Simples</span>
                    </h2>
                    <p className="text-blue-100/80 text-sm">
                        Teste grátis por 3 dias.ancele quando quiser.
                    </p>
                </motion.div>

                <div className="flex justify-center max-w-sm mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative w-full bg-white text-[#040949] rounded-2xl p-6 shadow-xl ring-4 ring-[#0026f7]/20"
                    >
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="px-3 py-1 rounded-full bg-[#0026f7] text-white text-[10px] font-bold uppercase tracking-wider shadow">
                                Melhor Oferta
                            </span>
                        </div>

                        <div className="flex items-center justify-center gap-2 mb-1 mt-1">
                            <img
                                src="/logo-icon-fundo.png"
                                alt="Logo"
                                className="w-10 h-10 object-contain"
                            />
                            <h3 className="text-2xl font-bold text-[#040949]">{plan.name}</h3>
                        </div>

                        <p className="text-gray-500 text-xs mb-4 text-center">{plan.description}</p>

                        <div className="flex items-baseline justify-center gap-1 mb-6">
                            <span className="text-4xl font-extrabold text-[#040949]">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
                            <span className="text-gray-500 text-sm font-medium">/mês</span>
                        </div>

                        <ul className="space-y-3 mb-6">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                    <div className="w-5 h-5 rounded-full bg-[#0026f7]/10 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-[#0026f7]" />
                                    </div>
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Button
                            onClick={handleSubscribe}
                            disabled={isLoading}
                            className="w-full h-11 text-sm font-bold bg-[#0026f7] hover:bg-[#0026f7]/90 text-white shadow-lg rounded-xl"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processando...
                                </>
                            ) : (
                                'Começar Agora'
                            )}
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
