import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CartSidebar } from '../cart/CartSidebar';

export function DesktopNavbar() {
    const { user, isAuthenticated, logout, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getInitials = (name: string) => {
        return name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'U';
    };

    const handleScroll = (id: string) => {
        if (location.pathname !== '/') {
            navigate(`/#${id}`);
            return;
        }
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleLogoClick = (e: React.MouseEvent) => {
        if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="hidden lg:flex items-center justify-between h-full w-full">
            {/* --- LOGO --- */}
            <Link
                to="/"
                onClick={handleLogoClick}
                className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
                <img
                    src="/logo-icon-fundo.png"
                    alt="Foca.Aí"
                    className="h-14 w-14 object-contain"
                />
                <span className="text-2xl font-bold text-white tracking-tight">Foca.aí</span>
            </Link>

            {/* --- NAVEGAÇÃO DESKTOP --- */}
            <div className="flex items-center gap-8">
                <button onClick={() => handleScroll('como-funciona')} className="text-base font-medium text-gray-300 hover:text-white transition-colors cursor-pointer">Como Funciona</button>
                <button onClick={() => handleScroll('precos')} className="text-base font-medium text-gray-300 hover:text-white transition-colors cursor-pointer">Preços</button>
                <button onClick={() => handleScroll('faq')} className="text-base font-medium text-gray-300 hover:text-white transition-colors cursor-pointer">FAQ</button>
            </div>

            {/* --- ÁREA DA DIREITA (DESKTOP) --- */}
            <div className="flex items-center gap-4">
                {isLoading ? (
                    <div className="h-10 w-24 bg-white/10 rounded-md animate-pulse" />
                ) : isAuthenticated && user ? (
                    <>
                        <div className="text-white"><CartSidebar /></div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                                    <Avatar className="h-9 w-9 border border-white/10 cursor-pointer">
                                        <AvatarImage src={user.avatar_url} />
                                        <AvatarFallback className="bg-white text-[#040949] font-bold">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate('/account')} className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" /> Minha Conta
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" /> Sair
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                ) : (
                    <>
                        <Button variant="ghost" asChild className="text-white hover:bg-white/10 text-base">
                            <Link to="/login">Entrar</Link>
                        </Button>
                        <Button asChild className="bg-[#0026f7] hover:bg-[#0026f7]/90 text-white shadow-lg shadow-blue-900/20 text-base font-semibold px-6">
                            <Link to="/register">Criar Conta</Link>
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
