import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  interval?: 'monthly' | 'yearly'; // Opcional, pois nem todo item pode ter intervalo
  quantity: number;
  type: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  isOpen: boolean; // Novo: Estado de visibilidade
  setIsOpen: (open: boolean) => void; // Novo: Função para abrir/fechar
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [isOpen, setIsOpen] = useState(false); // Estado local de visibilidade

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    // Lógica para evitar duplicatas de assinatura ou somar quantidade
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        // Se já existe, não duplica (para assinaturas é melhor ser único)
        return prev; 
      }
      return [...prev, item];
    });
    setIsOpen(true); // Abre o carrinho automaticamente ao adicionar
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}