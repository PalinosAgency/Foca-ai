import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Plans() {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const plan = {
      id: "monthly",
      name: "Plano Premium",
      price: 29.90,
      interval: "monthly",
      description: "Tudo o que você precisa para organizar sua vida",
      features: [
        "Agente IA no WhatsApp ilimitado", 
        "Dashboard Financeiro Completo", 
        "Controle de Saúde e Academia", 
        "Agenda Inteligente",
        "Suporte prioritário"
      ]
  };

  const handleAddToCart = () => {
    addItem({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      // @ts-ignore - forçando o tipo se necessário
      interval: 'monthly',
      quantity: 1,
      type: 'subscription'
    }, false); // <--- MUDANÇA: false impede a abertura do carrinho (Requer CartContext atualizado)
    
    toast({
      title: "Adicionado!",
      description: `${plan.name} foi adicionado ao seu carrinho.`,
      duration: 3000,
    });
  };

  const handleBuyNow = () => {
    // 1. Adiciona ao carrinho (sem abrir a sidebar)
    addItem({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      // @ts-ignore
      interval: 'monthly',
      quantity: 1,
      type: 'subscription'
    }, false); // <--- MUDANÇA: false impede a abertura do carrinho (Requer CartContext atualizado)
    
    // 2. Vai para a página do carrinho
    navigate("/cart"); 
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-24 flex flex-col items-center">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Escolha o plano ideal</h1>
          <p className="text-xl text-muted-foreground">
            Desbloqueie todo o potencial do seu assistente pessoal.
          </p>
        </div>

        <div className="w-full max-w-md relative rounded-2xl border border-primary p-8 flex flex-col bg-card shadow-xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Oferta Exclusiva
            </div>

            <div className="mb-8 text-center">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground mb-6">{plan.description}</p>
              <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold">
                    {plan.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                  <span className="text-muted-foreground">/mês</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                    </div>
                    {feature}
                  </li>
              ))}
            </ul>

            <div className="space-y-3">
              <Button 
                  className="w-full h-12 text-base font-semibold shadow-md bg-[#0026f7] hover:bg-[#0026f7]/90 text-white" 
                  onClick={handleBuyNow}
              >
                  Comprar Agora
              </Button>
              <Button 
                  variant="outline" 
                  className="w-full h-12 text-base"
                  onClick={handleAddToCart}
              >
                  Adicionar ao Carrinho
              </Button>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}