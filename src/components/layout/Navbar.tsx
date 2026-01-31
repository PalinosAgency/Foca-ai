import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    
    setIsMenuOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#040949] border-b border-white/10 transition-all duration-300 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* --- LOGO --- */}
          <Link 
            to="/" 
            onClick={handleLogoClick}
            className="relative flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer h-full"
          >
            <img 
              src="/logo-icon-fundo.png" 
              alt="Foca.Aí" 
              className="h-14 w-14 object-contain" 
            />
            <span className="text-2xl font-bold text-white tracking-tight">Foca.aí</span>
          </Link>

          {/* --- NAVEGAÇÃO DESKTOP --- */}
          <div className="hidden md:flex items-center gap-10">
            <a href="#como-funciona" onClick={(e) => handleScroll(e, 'como-funciona')} className="text-base font-medium text-gray-300 hover:text-white transition-colors cursor-pointer">Como Funciona</a>
            <a href="#precos" onClick={(e) => handleScroll(e, 'precos')} className="text-base font-medium text-gray-300 hover:text-white transition-colors cursor-pointer">Preços</a>
            <a href="#faq" onClick={(e) => handleScroll(e, 'faq')} className="text-base font-medium text-gray-300 hover:text-white transition-colors cursor-pointer">FAQ</a>
          </div>

          {/* --- ÁREA DA DIREITA (BOTÕES) --- */}
          <div className="hidden md:flex items-center gap-4">
            
            {isLoading ? (
              <div className="flex items-center gap-3 animate-pulse opacity-50">
                <div className="h-10 w-24 bg-white/10 rounded-md"></div>
                <div className="h-10 w-10 bg-white/10 rounded-full"></div>
              </div>
            ) : isAuthenticated && user ? (
              <>
                <div className="text-white">
                  <CartSidebar />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10 focus:ring-0 focus:ring-offset-0">
                      <Avatar className="h-9 w-9 border border-white/10 shadow-sm cursor-pointer transition-all hover:scale-105">
                        <AvatarImage src={user.avatar_url} alt={user.name} />
                        <AvatarFallback className="bg-white text-[#040949] font-bold text-sm">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent className="w-64 p-2 bg-white border border-gray-200 shadow-xl rounded-xl mt-2" align="end" forceMount>
                    
                    <DropdownMenuLabel className="font-normal mb-2">
                      <div className="flex flex-col space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-sm font-bold text-gray-900 leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-gray-500 truncate font-medium">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    
                    <DropdownMenuItem 
                      onClick={() => navigate('/account')} 
                      className="cursor-pointer text-gray-700 focus:bg-gray-100 focus:text-[#040949] py-2.5 px-3 rounded-md font-bold transition-colors"
                    >
                      <User className="mr-3 h-4 w-4 text-gray-500" />
                      <span>Minha Conta</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator className="bg-gray-100 my-1" />
                    
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 py-2.5 px-3 rounded-md font-medium transition-colors"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-base font-medium h-11 px-6 text-white hover:bg-white/10 hover:text-white">
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild className="text-base font-semibold h-11 px-8 bg-[#0026f7] hover:bg-[#0026f7]/90 text-white shadow-lg shadow-blue-900/20 border-0 transition-all hover:-translate-y-0.5">
                  <Link to="/register">Criar Conta</Link>
                </Button>
              </>
            )}
          </div>

          {/* --- MOBILE MENU --- */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MENU MOBILE CONTENT --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#040949] border-b border-white/10 overflow-hidden shadow-xl"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-3">
              <a href="#como-funciona" onClick={(e) => handleScroll(e, 'como-funciona')} className="flex items-center h-12 px-4 rounded-lg hover:bg-white/5 font-medium text-white cursor-pointer">Como Funciona</a>
              <a href="#precos" onClick={(e) => handleScroll(e, 'precos')} className="flex items-center h-12 px-4 rounded-lg hover:bg-white/5 font-medium text-white cursor-pointer">Preços</a>
              <a href="#faq" onClick={(e) => handleScroll(e, 'faq')} className="flex items-center h-12 px-4 rounded-lg hover:bg-white/5 font-medium text-white cursor-pointer">FAQ</a>
              
              {isLoading ? (
                 <div className="border-t border-white/10 my-2 pt-4 flex flex-col gap-2 opacity-50">
                    <div className="h-12 w-full bg-white/10 rounded-lg animate-pulse" />
                 </div>
              ) : isAuthenticated ? (
                <>
                  <div className="border-t border-white/10 my-2 pt-4">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Minha Conta</p>
                    
                    <div className="flex items-center h-12 px-4 rounded-lg hover:bg-white/5 gap-3 text-white font-medium" onClick={() => setIsMenuOpen(false)}>
                        <div className="text-white"><CartSidebar /></div> <span className="text-white">Ver Carrinho</span>
                    </div>

                    <Link to="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center h-12 px-4 rounded-lg hover:bg-white/5 gap-3 text-white font-medium">
                      <User className="w-5 h-5 text-gray-400" /> Meu Perfil
                    </Link>
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left flex items-center h-12 px-4 rounded-lg hover:bg-red-900/20 text-red-400 gap-3 font-medium mt-2">
                      <LogOut className="w-5 h-5" /> Sair
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                  <Button variant="ghost" asChild className="w-full justify-start px-4 h-12 text-lg text-white hover:bg-white/10">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>Entrar</Link>
                  </Button>
                  <Button asChild className="w-full h-12 text-lg font-semibold shadow-md bg-[#0026f7] text-white border-0 hover:bg-[#0026f7]/90">
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>Criar Conta</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}