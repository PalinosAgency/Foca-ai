import { Button } from '@/components/ui/button';
import { PackageOpen, ShoppingCart, Trash2, ArrowRight, Lock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface CartContentProps {
    onClose: () => void;
}

export function CartContent({ onClose }: CartContentProps) {
    const { items, removeItem, total } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const handleViewPlans = () => {
        onClose();
        if (location.pathname === '/') {
            const element = document.getElementById('precos');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/plans');
        }
    };

    const handleCheckout = () => {
        onClose();
        navigate('/cart');
    };

    if (items.length === 0) {
        return (
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
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#F8F9FA]">
            {/* LISTA DE ITENS */}
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full px-5 py-6">
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-3 transition-all hover:shadow-md hover:border-blue-200">

                                {/* Linha Superior: Imagem e Textos */}
                                <div className="flex gap-4">
                                    {/* Imagem com fundo Azul Escuro e Icone Correto */}
                                    <div className="w-16 h-16 bg-[#040949] rounded-xl flex items-center justify-center p-3 shrink-0 shadow-sm">
                                        <img src="/logo-icon.png" alt="Logo" className="w-full h-full object-contain" />
                                    </div>

                                    {/* Informações */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h4 className="font-bold text-base text-[#040949] leading-tight truncate">{item.name}</h4>
                                        <span className="text-[10px] font-semibold text-[#0026f7] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 mt-1 inline-block w-fit">
                                            Assinatura Mensal
                                        </span>
                                    </div>
                                </div>

                                <Separator className="bg-gray-100" />

                                {/* Linha Inferior: Botão Remover e Preço Separados */}
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
            </div>

            {/* RODAPÉ */}
            <div className="border-t border-gray-200 p-6 bg-white z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
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
            </div>
        </div>
    );
}
