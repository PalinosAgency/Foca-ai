import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useMediaQuery } from '@/hooks/use-media-query';
import { CartContent } from './CartContent';
import { useState } from 'react';

export function CartSidebar() {
  const { items, isOpen, setIsOpen } = useCart();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Gerenciamento de estado local para garantir que o sheet/drawer feche corretamente
  // Sincroniza com o contexto, mas permite controle fino se necessário
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const TriggerButton = (
    <Button variant="ghost" size="icon" className="relative group hover:bg-white/10">
      <ShoppingCart className="w-6 h-6 text-white transition-colors" />
      {items.length > 0 && (
        <span className="absolute top-0 right-0 w-3 h-3 bg-[#0026f7] rounded-full border-2 border-[#040949] flex items-center justify-center animate-pulse" />
      )}
    </Button>
  );

  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          {TriggerButton}
        </SheetTrigger>

        {/* [&>button]:hidden remove o botão de fechar padrão do Sheet */}
        <SheetContent className="flex flex-col w-full sm:max-w-md bg-[#F8F9FA] text-gray-900 shadow-2xl border-l border-gray-100 p-0 [&>button]:hidden">
          <SheetHeader className="px-6 py-5 border-b border-gray-200 bg-white flex flex-row items-center justify-between space-y-0">
            <SheetTitle className="flex items-center gap-3 text-xl font-bold text-[#040949]">
              <div className="bg-[#0026f7] p-2 rounded-xl shadow-lg shadow-blue-500/20 text-white">
                <ShoppingCart className="w-5 h-5" />
              </div>
              Seu Carrinho
            </SheetTitle>
            <div className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-100">
              {items.length} {items.length === 1 ? 'item' : 'itens'}
            </div>
          </SheetHeader>

          <CartContent onClose={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        {TriggerButton}
      </DrawerTrigger>

      <DrawerContent className="h-[85vh] flex flex-col bg-[#F8F9FA] rounded-t-[20px]">
        <DrawerHeader className="px-6 py-4 border-b border-gray-200 bg-white rounded-t-[20px] flex flex-row items-center justify-between space-y-0 relative">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full mb-4" />

          <DrawerTitle className="flex items-center gap-3 text-lg font-bold text-[#040949] mt-4">
            <div className="bg-[#0026f7] p-1.5 rounded-lg shadow-md text-white">
              <ShoppingCart className="w-4 h-4" />
            </div>
            Carrinho
          </DrawerTitle>
          <div className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-100 mt-4">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </div>
        </DrawerHeader>

        <CartContent onClose={() => setIsOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
}