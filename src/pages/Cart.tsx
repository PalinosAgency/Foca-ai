import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Trash2, Loader2, ShoppingCart, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const HOTMART_LINK = "https://pay.hotmart.com/R104179058N";

export default function Cart() {
  const { items, removeItem, total } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.hotmart.com/checkout/widget.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleCheckout = () => {
    if (items.length === 0) return;

    if (!user) {
      toast({
        title: "Faça login",
        description: "Você precisa entrar na sua conta para finalizar a compra.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const checkoutUrl = `${HOTMART_LINK}?checkoutMode=2&email=${user.email}&name=${encodeURIComponent(user.name)}&sck=focaai_cart`;
      
      // @ts-ignore
      if (window.importHotmart) {
         // @ts-ignore
         window.importHotmart(); 
      }
      
      window.location.href = checkoutUrl;

    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Tente novamente." });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-[#040949]">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-24 max-w-5xl">
        {/* Título */}
        <div className="flex items-center gap-4 mb-10 border-b border-gray-200 pb-6">
          <div className="bg-[#0026f7] p-3 rounded-2xl text-white shadow-xl shadow-blue-500/20">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#040949]">Seu Carrinho</h1>
            <p className="text-gray-500 text-sm mt-1">Finalize sua assinatura e comece agora.</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 text-center px-4">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
              <ShoppingCart className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-[#040949] text-2xl font-bold mb-2">Seu carrinho está vazio</p>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Parece que você ainda não escolheu seu plano. Aproveite nossos recursos premium agora mesmo.
            </p>
            <Button asChild className="bg-[#0026f7] hover:bg-[#0026f7]/90 text-white font-bold px-10 py-6 text-base rounded-xl shadow-xl shadow-blue-900/10 transition-transform hover:-translate-y-1">
              <Link to="/plans">Ver Planos Disponíveis</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            
            {/* Lista de Itens */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 transition-all hover:shadow-md hover:border-blue-100">
                  
                  {/* Imagem do Produto */}
                  <div className="w-24 h-24 bg-[#040949] rounded-2xl flex items-center justify-center p-4 shrink-0 shadow-lg">
                     <img src="/logo-icon-fundo.png" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  
                  {/* Detalhes */}
                  <div className="flex-1 text-center sm:text-left w-full">
                     <div className="flex flex-col sm:flex-row sm:items-start justify-between w-full">
                        <div>
                           <h3 className="font-bold text-xl text-[#040949] mb-1">{item.name}</h3>
                           <p className="text-sm text-[#0026f7] font-semibold bg-blue-50 px-3 py-1 rounded-lg inline-block border border-blue-100">
                              Assinatura Mensal
                           </p>
                        </div>
                        
                        <div className="mt-4 sm:mt-0 text-right">
                           <span className="font-extrabold text-2xl text-[#040949]">
                              {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                           </span>
                           <p className="text-xs text-gray-400 font-medium">/mês</p>
                        </div>
                     </div>
                     
                     <div className="mt-4 flex justify-center sm:justify-start">
                        <button 
                           onClick={() => removeItem(item.id)}
                           className="text-gray-400 hover:text-red-600 text-sm font-medium flex items-center gap-1.5 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
                        >
                           <Trash2 className="w-4 h-4" /> Remover item
                        </button>
                     </div>
                  </div>
                </div>
              ))}
              
              {/* Benefícios Rápidos */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-wrap gap-4 justify-center sm:justify-between items-center text-sm text-[#040949]/80 font-medium">
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#0026f7]" />
                     Acesso Imediato
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#0026f7]" />
                     Cancele quando quiser
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#0026f7]" />
                     Garantia de 7 dias
                  </div>
              </div>
            </div>

            {/* Resumo */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
                <h3 className="font-bold text-xl mb-6 text-[#040949] flex items-center gap-2">
                  Resumo do pedido
                </h3>
                
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-gray-600 font-medium text-sm">
                    <span>Subtotal</span>
                    <span className="text-[#040949]">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-medium text-sm">
                    <span>Taxas</span>
                    <span className="text-green-600 font-bold">R$ 0,00</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-6 mb-8 flex justify-between items-end">
                  <span className="text-[#040949] font-bold text-lg">Total</span>
                  <div className="text-right">
                     <span className="text-3xl font-extrabold text-[#0026f7]">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                     <p className="text-xs text-gray-400 mt-1 font-medium">Em até 12x no cartão</p>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full h-16 text-lg font-bold bg-[#0026f7] hover:bg-[#0026f7]/90 text-white shadow-xl shadow-blue-900/20 rounded-xl transition-all hover:-translate-y-1 mb-6"
                >
                  {loading ? (
                    <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Processando...</>
                  ) : (
                    <>
                      Finalizar Compra
                      <ArrowRight className="w-6 h-6 ml-2" />
                    </>
                  )}
                </Button>
                
                {/* TRUST BADGE CORRETO: Ícone + Texto "Hotmart" */}
                <div className="flex items-center justify-center gap-3 bg-gray-50 py-3 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">PROTEGIDO POR</span>
                  <div className="flex items-center gap-1.5">
                     {/* Ícone da Chama Laranja */}
                     <img src="/Logo_Hotmart.png" alt="Logo Hotmart" className="h-6 object-contain" />
                     {/* Texto Hotmart em Laranja Oficial */}
                     <span className="text-lg font-extrabold text-[#F04E23] tracking-tight">Hotmart</span>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                    <p className="text-[10px] text-gray-400 leading-tight">
                       Seus dados pessoais serão usados para processar seu pedido, apoiar sua experiência em todo o site e para outros fins descritos em nossa política de privacidade.
                    </p>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}