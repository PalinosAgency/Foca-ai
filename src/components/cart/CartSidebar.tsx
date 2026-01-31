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
    setIsOpen(false); // Fecha a sidebar
    navigate('/cart'); // VAI PARA A PÁGINA DO CARRINHO (ONDE ESTÁ A HOTMART)
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
      
      {/* Sidebar com fundo Branco */}
      <SheetContent className="flex flex-col w-full sm:max-w-md bg-white text-gray-900 shadow-2xl border-l border-gray-100 p-0">
        
        {/* CABEÇALHO */}
        <SheetHeader className="px-6 py-4 border-b border-gray-100 flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="flex items-center gap-3 text-xl font-bold text-[#040949]">
            <div className="bg-[#0026f7] p-2 rounded-lg shadow-sm shadow-blue-500/30">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            Seu Carrinho
          </SheetTitle>
        </SheetHeader>

        {/* ÁREA DE CONTEÚDO */}
        <div className="flex-1 overflow-hidden bg-white">
          {items.length === 0 ? (
            // ESTADO VAZIO
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-8">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-2 shadow-sm border border-gray-100">
                <PackageOpen className="w-10 h-10 text-gray-300" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900">Seu carrinho está vazio</h3>
                <p className="text-sm text-gray-500 max-w-[250px] mx-auto leading-relaxed">
                  Adicione o plano Foca.aí para começar a organizar sua vida.
                </p>
              </div>
              
              <Button 
                onClick={handleViewPlans} 
                className="mt-6 bg-[#0026f7] hover:bg-[#0026f7]/90 text-white font-semibold px-8 py-2 rounded-full shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
              >
                Ver Planos
              </Button>
            </div>
          ) : (
            // LISTA DE ITENS
            <ScrollArea className="h-full px-6 py-6">
              <div className="space-y-4">
                {items.map((item) => (
                  // CARD DO PRODUTO
                  <div key={item.id} className="group flex gap-4 items-start bg-[#0026f7]/10 p-4 rounded-2xl border border-[#0026f7]/20 shadow-sm hover:shadow-md transition-all duration-200 relative">
                    
                    {/* Fundo DEEP BLUE (#040949) */}
                    <div className="h-16 w-16 rounded-xl bg-[#040949] flex items-center justify-center shrink-0 p-3 shadow-sm">
                      <img src="/logo-icon-fundo.png" alt="Foca.aí" className="w-full h-full object-contain" />
                    </div>
                    
                    {/* Detalhes */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center h-16">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-[#040949] text-base leading-tight">{item.name}</h4>
                          <p className="text-gray-600 text-xs mt-1 flex items-center gap-1.5 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0026f7]" />
                            Assinatura Mensal
                          </p>
                        </div>
                        {/* Preço */}
                        <p className="font-bold text-[#0026f7] text-lg">
                          {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </div>
                    </div>

                    {/* Botão Remover */}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 shadow-sm border border-transparent hover:border-red-100"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* RODAPÉ */}
        {items.length > 0 && (
          <SheetFooter className="border-t border-gray-100 p-6 sm:flex-col sm:space-x-0 bg-white z-10">
            <div className="space-y-4 w-full">
              
              {/* Resumo Financeiro */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Taxas</span>
                  <span className="text-[#0026f7] font-medium">Grátis</span>
                </div>
                <Separator className="my-2 bg-gray-100" />
                <div className="flex justify-between items-end">
                  <span className="text-base font-semibold text-gray-900">Total a pagar</span>
                  <span className="text-2xl font-bold text-[#040949]">
                    {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
              
              {/* Botão de Ação - AGORA LEVA PARA /CART */}
              <Button 
                className="w-full h-14 text-base font-bold bg-[#0026f7] hover:bg-[#0026f7]/90 text-white shadow-lg shadow-blue-500/25 rounded-xl transition-all hover:translate-y-[-2px]" 
                onClick={handleCheckout}
              >
                Finalizar Compra
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium uppercase tracking-wide pt-2">
                <Lock className="w-3 h-3" />
                Ambiente 100% seguro
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}