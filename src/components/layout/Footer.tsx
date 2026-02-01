import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

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
  };

  return (
    <footer className="bg-[#040949] border-t border-white/10 text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="md:col-span-1">
            {/* LOGO */}
            <Link to="/" className="relative flex items-center gap-2 mb-4 h-16 w-40 overflow-hidden">
              <img 
                src="/logo-icon-fundo.png" 
                alt="Foca.Aí" 
                className="h-14 w-14 object-contain" 
              />
              <span className="text-2xl font-bold text-white tracking-tight">Foca.aí</span>
            </Link>
            
            <p className="text-blue-100/70 text-sm leading-relaxed mb-6">
              Seu assistente pessoal no WhatsApp para organizar finanças, saúde, estudos e agenda.
            </p>

            {/* Suporte em Destaque na Coluna da Marca */}
            <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Suporte</span>
                <a 
                  href="mailto:suportefocaaioficial@gmail.com" 
                  className="flex items-center gap-2 text-sm text-white hover:text-blue-300 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  suportefocaaioficial@gmail.com
                </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Produto</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#como-funciona" 
                  onClick={(e) => handleScroll(e, 'como-funciona')}
                  className="text-blue-100/70 hover:text-white text-sm transition-colors cursor-pointer"
                >
                  Recursos
                </a>
              </li>
              <li>
                <a 
                  href="#precos" 
                  onClick={(e) => handleScroll(e, 'precos')}
                  className="text-blue-100/70 hover:text-white text-sm transition-colors cursor-pointer"
                >
                  Preços
                </a>
              </li>
              <li>
                <a 
                  href="#faq" 
                  onClick={(e) => handleScroll(e, 'faq')}
                  className="text-blue-100/70 hover:text-white text-sm transition-colors cursor-pointer"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Empresa</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://palinosprodutora.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-100/70 hover:text-white text-sm transition-colors"
                >
                  Sobre nós
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/palinos_produtora/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-100/70 hover:text-white text-sm transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-blue-100/70 hover:text-white text-sm transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-blue-100/70 hover:text-white text-sm transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blue-100/50 text-sm">
            © {new Date().getFullYear()} Foca.aí. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/foca__ai?igsh=MXZrd21nYjI5ZmZ2dQ%3D%3D"
              className="text-blue-100/50 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}