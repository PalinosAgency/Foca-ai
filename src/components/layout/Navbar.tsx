import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useState } from 'react';

export function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#040949] border-b border-white/10 shadow-md h-16 md:h-20 transition-all">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* --- LOGO --- */}
          <Link 
            to="/" 
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <img 
              src="/logo-icon-fundo.png" 
              alt="Foca.Aí" 
              className="h-10 w-10 md:h-14 md:w-14 object-contain" 
            />
            <span className="text-xl md:text-2xl font-bold text-white tracking-tight">Foca.aí</span>
          </Link>

          {/* --- NAVEGAÇÃO DESKTOP --- */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => handleScroll('como-funciona')} className="text-base font-medium text-gray-300 hover:text-white transition-colors cursor-pointer">Como Funciona</button>
            <button onClick={() => handleScroll('precos')} className="text-base font-medium text-gray-300 hover:text-white transition-colors cursor-pointer">Preços</button>
            <button onClick={() => handleScroll('faq')} className="text-base font-medium text-gray-300 hover:text-white transition-colors cursor-pointer">FAQ</button>
          </div>

          {/* --- ÁREA DA DIREITA (DESKTOP) --- */}
          <div className="hidden md:flex items-center gap-4">
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

          {/* --- MOBILE MENU (SHEET) --- */}
          <div className="md:hidden flex items-center gap-3">
             {/* Carrinho Mobile */}
             {isAuthenticated && (
               <div className="text-white">
                 <CartSidebar />
               </div>
             )}

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-7 w-7" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#040949] border-l-white/10 text-white w-[85vw] max-w-[350px] p-0 overflow-y-auto">
                <SheetHeader className="p-6 text-left border-b border-white/10">
                  <SheetTitle className="text-white flex items-center gap-2">
                    <img src="/logo-icon-fundo.png" className="w-8 h-8 object-contain" alt="Logo" />
                    <span className="font-bold">Menu</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col py-4">
                  {isAuthenticated && user && (
                    <div className="px-6 mb-6">
                      <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                        <Avatar className="h-10 w-10 border border-white/10">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback className="bg-white text-[#040949] font-bold">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                          <p className="font-medium truncate text-sm">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-1 px-3">
                    <button onClick={() => handleScroll('como-funciona')} className="flex items-center h-12 px-4 rounded-lg hover:bg-white/10 text-left font-medium text-base">Como Funciona</button>
                    <button onClick={() => handleScroll('precos')} className="flex items-center h-12 px-4 rounded-lg hover:bg-white/10 text-left font-medium text-base">Preços</button>
                    <button onClick={() => handleScroll('faq')} className="flex items-center h-12 px-4 rounded-lg hover:bg-white/10 text-left font-medium text-base">FAQ</button>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-4 px-3 flex flex-col gap-2">
                    {isAuthenticated ? (
                      <>
                        <Button 
                          variant="ghost" 
                          onClick={() => { setIsSheetOpen(false); navigate('/account'); }}
                          className="justify-start h-12 text-base font-normal hover:bg-white/10 hover:text-white w-full px-4"
                        >
                          <User className="mr-3 h-5 w-5" /> Minha Conta
                        </Button>
                        <Button 
                          variant="ghost" 
                          onClick={handleLogout}
                          className="justify-start h-12 text-base font-normal text-red-400 hover:bg-red-900/20 hover:text-red-300 w-full px-4"
                        >
                          <LogOut className="mr-3 h-5 w-5" /> Sair
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-3 px-2 mt-2">
                        <SheetClose asChild>
                          <Button asChild className="w-full h-12 text-base bg-white/10 hover:bg-white/20 text-white border-0 font-semibold">
                            <Link to="/login">Entrar</Link>
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button asChild className="w-full h-12 text-base bg-[#0026f7] hover:bg-[#0026f7]/90 text-white border-0 shadow-lg font-bold">
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
      </div>
    </nav>
  );
}