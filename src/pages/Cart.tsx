import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Trash2, Loader2, ShoppingCart, ArrowLeft, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

const HOTMART_LINK = "https://pay.hotmart.com/R104179058N";

export default function Cart() {
  const { items, removeItem, total } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

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

    if (!termsAccepted) {
      toast({
        title: "Termos de Uso",
        description: "Você precisa aceitar os termos para continuar.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const checkoutUrl = `${HOTMART_LINK}?checkoutMode=2&email=${user.email}&name=${encodeURIComponent(user.name)}&sck=focaai_cart`;

      const customWindow = window as unknown as { importHotmart?: () => void; location: Location };
      if (customWindow.importHotmart) {
        customWindow.importHotmart();
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

      <main className="flex-1 container mx-auto px-4 py-8 md:py-24 max-w-5xl pb-40 lg:pb-8">

        {/* Botão Voltar */}
        <div className="mt-20 md:mt-0 mb-4">
          <Button
            variant="ghost"
            asChild
            className="pl-0 hover:bg-transparent text-gray-500 hover:text-[#0026f7] -ml-2 transition-colors"
          >
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao início
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-6 md:mb-10 border-b border-gray-200 pb-4 md:pb-6">
          <div className="bg-[#0026f7] p-2 md:p-3 rounded-xl md:rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-[#040949]">Seu Carrinho</h1>
            <p className="text-gray-500 text-xs md:text-sm mt-0.5">Finalize sua assinatura e comece agora.</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 md:py-24 bg-white rounded-3xl shadow-sm border border-gray-100 text-center px-4">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
              <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-gray-300" />
            </div>
            <p className="text-[#040949] text-xl md:text-2xl font-bold mb-2">Seu carrinho está vazio</p>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm md:text-base">
              Parece que você ainda não escolheu seu plano. Aproveite nossos recursos premium.
            </p>
            <Button asChild className="bg-[#0026f7] hover:bg-[#0026f7]/90 text-white font-bold px-8 py-6 text-base rounded-xl shadow-xl shadow-blue-900/10">
              <Link to="/plans">Ver Planos Disponíveis</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8 items-start">

            {/* COLUNA DA ESQUERDA: ITENS + BENEFÍCIOS + AVISO E-MAIL */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 flex flex-row items-start gap-4 transition-all hover:shadow-md hover:border-blue-100">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-[#040949] rounded-xl md:rounded-2xl flex items-center justify-center p-2 md:p-4 shrink-0 shadow-md">
                    <img src="/logo-icon.png" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-start justify-between w-full">
                      <div>
                        <h3 className="font-bold text-base md:text-xl text-[#040949] leading-tight">{item.name}</h3>
                        <p className="text-[10px] md:text-sm text-[#0026f7] font-semibold bg-blue-50 px-2 py-0.5 rounded md:rounded-lg inline-block border border-blue-100 mt-1">
                          Assinatura Mensal
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0 text-left md:text-right">
                        <span className="font-extrabold text-lg md:text-2xl text-[#040949]">
                          {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <p className="text-[10px] text-gray-400 font-medium">/mês</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="mt-3 text-gray-400 hover:text-red-600 text-xs md:text-sm font-medium flex items-center gap-1 hover:bg-red-50 pr-2 py-1 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remover
                    </button>
                  </div>
                </div>
              ))}

              {/* Benefícios */}
              <div className="hidden md:flex bg-blue-50 border border-blue-100 rounded-2xl p-6 flex-wrap gap-4 justify-between items-center text-sm text-[#040949]/80 font-medium">
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#0026f7]" />Acesso Imediato</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#0026f7]" />Cancele quando quiser</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#0026f7]" />Garantia de 7 dias</div>
              </div>

              {/* --- AVISO DO E-MAIL (MOVIDO PARA CÁ) --- */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl flex gap-3 items-start shadow-sm">
                <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-900 leading-relaxed">
                  <p className="font-bold mb-1">Atenção Importante:</p>
                  Na hora do pagamento, certifique-se de usar o <strong>mesmo e-mail</strong> cadastrado aqui:
                  <div className="mt-2 inline-block bg-white px-3 py-1 rounded border border-yellow-200 font-mono text-yellow-800 font-bold">
                    {user?.email}
                  </div>
                  <p className="mt-1 opacity-90 text-xs">Isso garante a liberação automática imediata do seu acesso.</p>
                </div>
              </div>

            </div>

            {/* COLUNA DA DIREITA: RESUMO DO PEDIDO */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
                <h3 className="font-bold text-xl mb-6 text-[#040949]">Resumo do pedido</h3>

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

                <div className="border-t border-gray-100 pt-6 mb-6 flex justify-between items-end">
                  <span className="text-[#040949] font-bold text-lg">Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-[#0026f7]">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Em até 12x no cartão</p>
                  </div>
                </div>

                {/* --- CHECKBOX DE ACEITE --- */}
                <div className="flex items-start space-x-2 mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Checkbox
                    id="terms-desktop"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    className="mt-1 border-gray-300 data-[state=checked]:bg-[#0026f7] data-[state=checked]:border-[#0026f7]"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms-desktop"
                      className="text-xs text-gray-600 font-medium leading-relaxed cursor-pointer"
                    >
                      Li e concordo com os <Link to="/terms" target="_blank" className="text-[#0026f7] underline hover:text-blue-800">Termos de Uso</Link> e a <Link to="/privacy" target="_blank" className="text-[#0026f7] underline hover:text-blue-800">Política de Privacidade</Link>.
                    </label>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={loading || !termsAccepted}
                  className="w-full h-16 text-lg font-bold bg-[#0026f7] hover:bg-[#0026f7]/90 text-white shadow-xl shadow-blue-900/20 rounded-xl transition-all hover:-translate-y-1 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Processando...</>
                  ) : "Finalizar Compra"}
                </Button>

                <div className="flex items-center justify-center gap-3 bg-gray-50 py-3 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">PROTEGIDO POR</span>
                  <div className="flex items-center gap-1.5">
                    <img src="/Logo_Hotmart.png" alt="Hotmart" className="h-6 object-contain" />
                    <span className="text-lg font-extrabold text-[#F04E23] tracking-tight">Hotmart</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER CHECKOUT MOBILE FIXO */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-6 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50 safe-area-bottom">

          {/* Aviso Mobile Compacto */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-2 mb-3 rounded-r-md flex gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-yellow-800 leading-tight">
              Use o e-mail: <strong>{user?.email}</strong> no pagamento.
            </p>
          </div>

          <div className="flex items-start space-x-2 mb-4 p-2 bg-gray-50 rounded-lg border border-gray-100">
            <Checkbox
              id="terms-mobile"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              className="mt-0.5 border-gray-300 data-[state=checked]:bg-[#0026f7] data-[state=checked]:border-[#0026f7]"
            />
            <label
              htmlFor="terms-mobile"
              className="text-[10px] text-gray-600 font-medium leading-snug cursor-pointer"
            >
              Concordo com os <Link to="/terms" target="_blank" className="text-[#0026f7] underline">Termos</Link> e <Link to="/privacy" target="_blank" className="text-[#0026f7] underline">Privacidade</Link>.
            </label>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Total a pagar</p>
              <p className="text-2xl font-extrabold text-[#0026f7]">
                {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
            <div className="opacity-70 grayscale">
              <img src="/Logo_Hotmart.png" alt="Hotmart" className="h-5 object-contain" />
            </div>
          </div>
          <Button
            onClick={handleCheckout}
            disabled={loading || !termsAccepted}
            className="w-full h-14 text-lg font-bold bg-[#0026f7] hover:bg-[#0026f7]/90 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Finalizar Compra Agora"}
          </Button>
        </div>
      )}

      <div className={items.length > 0 ? "hidden lg:block" : "block"}>
        <Footer />
      </div>
    </div>
  );
}