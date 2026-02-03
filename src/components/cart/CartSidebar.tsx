import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { ShoppingCart, Trash2, ArrowRight, PackageOpen, Lock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';

export function CartSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, removeItem, total, isOpen, setIsOpen } = useCart();

  const handleViewPlans = () => {
    setIsOpen(false);
    if (location.pathname === '/') {
      const element = document.getElementById('precos');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/plans');
    }
  };

  const handleCheckout = () => {
    setIsOpen(false); 
    navigate('/cart'); 
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group hover:bg-white/10">
          <ShoppingCart className="w-6 h-6 text-white transition-colors" />
          {items.length > 0 && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-[#0026f7] rounded-full border-2 border-[#040949] flex items-center justify-center animate-pulse" />
          )}
        </Button>
      </SheetTrigger>
      
      {/* Sidebar com fundo cinza bem claro para destacar os cards brancos */}
      <SheetContent className="flex flex-col w-full sm:max-w-md bg-[#F8F9FA] text-gray-900 shadow-2xl border-l border-gray-100 p-0">
        
        {/* CABEÇALHO */}
        <SheetHeader className="px-6 py-5 border-b border-gray-200 bg-white flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="flex items-center gap-3 text-xl font-bold text-[#040949]">
            <div className="bg-[#0026f7] p-2 rounded-xl shadow-lg shadow-blue-500/20 text-white">
              <ShoppingCart className="w-5 h-5" />
            </div>
            Seu Carrinho
          </SheetTitle>
          <div className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </div>
        </SheetHeader>

        {/* ÁREA DE CONTEÚDO */}
        <div className="flex-1 overflow-hidden">
          {items.length === 0 ? (
            // ESTADO VAZIO
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-8 bg-white">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <PackageOpen className="w-10 h-10 text-gray-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#040949]">Seu carrinho está vazio</h3>
                <p className="text-sm text-gray-500 max-w-[250px] mx-auto leading-relaxed">
                  Adicione o plano Foca.aí para começar a organizar sua vida.
                </p>
              </div>
              
              <Button 
                onClick={handleViewPlans} 
                className="mt-6 bg-[#0026f7] hover:bg-[#0026f7]/90 text-white font-bold px-8 py-6 rounded-xl shadow-xl shadow-blue-900/10 transition-all hover:-translate-y-1"
              >
                Ver Planos Disponíveis
              </Button>
            </div>
          ) : (
            // LISTA DE ITENS - ESTILO CART.TSX ADAPTADO PARA SIDEBAR
            <ScrollArea className="h-full px-5 py-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-3 transition-all hover:shadow-md hover:border-blue-200">
                    
                    {/* Linha Superior: Imagem e Textos */}
                    <div className="flex gap-4">
                      {/* Imagem */}
                      <div className="w-16 h-16 bg-[#040949] rounded-xl flex items-center justify-center p-3 shrink-0 shadow-sm">
                        <img src="/logo-icon.png" alt="Logo" className="w-full h-full object-contain" />
                      </div>

                      {/* Informações */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base text-[#040949] leading-tight truncate">{item.name}</h4>
                        <span className="text-[10px] font-semibold text-[#0026f7] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 mt-1 inline-block">
                          Assinatura Mensal
                        </span>
                      </div>
                    </div>

                    <Separator className="bg-gray-100" />

                    {/* Linha Inferior: Ações e Preço */}
                    <div className="flex justify-between items-center">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-600 text-xs font-medium flex items-center gap-1.5 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remover
                      </button>

                      <div className="text-right">
                        <span className="font-extrabold text-lg text-[#040949]">
                          {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium ml-1">/mês</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* RODAPÉ */}
        {items.length > 0 && (
          <SheetFooter className="border-t border-gray-200 p-6 sm:flex-col sm:space-x-0 bg-white z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="space-y-5 w-full">
              
              {/* Resumo Financeiro */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Taxas</span>
                  <span className="text-green-600 font-bold">Grátis</span>
                </div>
                <Separator className="bg-gray-100" />
                <div className="flex justify-between items-end">
                  <span className="text-base font-bold text-[#040949]">Total</span>
                  <span className="text-2xl font-extrabold text-[#0026f7]">
                    {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
              
              {/* Botão de Ação */}
              <Button 
                className="w-full h-14 text-base font-bold bg-[#0026f7] hover:bg-[#0026f7]/90 text-white shadow-xl shadow-blue-900/20 rounded-xl transition-all hover:translate-y-[-2px] hover:shadow-blue-900/30" 
                onClick={handleCheckout}
              >
                Finalizar Compra
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-1">
                <Lock className="w-3 h-3 text-green-500" />
                Ambiente 100% seguro
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}