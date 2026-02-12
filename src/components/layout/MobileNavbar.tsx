import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, User, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CartSidebar } from '../cart/CartSidebar';

export function MobileNavbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        setIsSheetOpen(false);
        navigate('/login');
    };

    const getInitials = (name: string) => {
        return name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'U';
    };

    const handleScroll = (id: string) => {
        setIsSheetOpen(false);
        if (location.pathname !== '/') {
            navigate(`/#${id}`);
            return;
        }
        const element = document.getElementById(id);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth' });
            }, 300); // Pequeno delay para a sheet fechar
        }
    };

    return (
        <div className="lg:hidden flex items-center justify-between w-full h-full">
            {/* --- MOBILE LOGO --- */}
            <Link
                to="/"
                onClick={() => {
                    if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2"
            >
                <img
                    src="/logo-icon-fundo.png"
                    alt="Foca.Aí"
                    className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-bold text-white tracking-tight">Foca.aí</span>
            </Link>

            <div className="flex items-center gap-3">
                {/* Carrinho Mobile */}
                {isAuthenticated && (
                    <div className="text-white">
                        <CartSidebar />
                    </div>
                )}

                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 -mr-2">
                            <Menu className="h-8 w-8" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-[#040949] border-l-white/10 text-white w-[85vw] max-w-[350px] p-0 overflow-y-auto">
                        <SheetHeader className="p-6 text-left border-b border-white/10 bg-[#03073d]">
                            <SheetTitle className="text-white flex items-center gap-3">
                                <img src="/logo-icon-fundo.png" className="w-8 h-8 object-contain" alt="Logo" />
                                <span className="font-bold text-lg">Menu</span>
                            </SheetTitle>
                        </SheetHeader>

                        <div className="flex flex-col py-6 px-4">
                            {isAuthenticated && user && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl border border-white/5 shadow-inner">
                                        <Avatar className="h-12 w-12 border-2 border-blue-500/30">
                                            <AvatarImage src={user.avatar_url} />
                                            <AvatarFallback className="bg-white text-[#040949] font-bold text-lg">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="overflow-hidden flex-1">
                                            <p className="font-semibold truncate text-base">{user.name}</p>
                                            <p className="text-xs text-blue-200 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <p className="text-xs font-semibold text-blue-300/60 uppercase tracking-wider mb-2 px-2">Navegação</p>
                                <button onClick={() => handleScroll('como-funciona')} className="flex items-center justify-between h-14 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-left font-medium text-base transition-colors group">
                                    Como Funciona
                                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white" />
                                </button>
                                <button onClick={() => handleScroll('precos')} className="flex items-center justify-between h-14 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-left font-medium text-base transition-colors group">
                                    Preços
                                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white" />
                                </button>
                                <button onClick={() => handleScroll('faq')} className="flex items-center justify-between h-14 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-left font-medium text-base transition-colors group">
                                    FAQ
                                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white" />
                                </button>
                            </div>

                            <div className="mt-8 border-t border-white/10 pt-6 flex flex-col gap-3">
                                {isAuthenticated ? (
                                    <>
                                        <p className="text-xs font-semibold text-blue-300/60 uppercase tracking-wider mb-1 px-2">Conta</p>
                                        <Button
                                            variant="ghost"
                                            onClick={() => { setIsSheetOpen(false); navigate('/account'); }}
                                            className="justify-start h-12 text-base font-medium hover:bg-white/10 hover:text-white w-full px-4 rounded-xl"
                                        >
                                            <User className="mr-3 h-5 w-5" /> Minha Conta
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={handleLogout}
                                            className="justify-start h-12 text-base font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 w-full px-4 rounded-xl"
                                        >
                                            <LogOut className="mr-3 h-5 w-5" /> Sair
                                        </Button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-3 mt-2">
                                        <SheetClose asChild>
                                            <Button asChild className="w-full h-14 text-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium rounded-xl">
                                                <Link to="/login">Entrar</Link>
                                            </Button>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Button asChild className="w-full h-14 text-lg bg-[#0224F7] hover:bg-[#0224F7]/90 text-white border-0 shadow-lg shadow-blue-900/40 font-bold rounded-xl">
                                                <Link to="/register">Criar Conta Grátis</Link>
                                            </Button>
                                        </SheetClose>
                                    </div>
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
