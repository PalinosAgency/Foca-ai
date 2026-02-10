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
      <div className="container mx-auto px-4 pt-10 pb-8 md:py-12">

        {/* GRID PRINCIPAL: 2 colunas no mobile (compacto), 3 no desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 md:gap-x-12 lg:gap-x-16 max-w-5xl mx-auto">

          {/* Brand - Ocupa as 2 colunas no mobile para destaque */}
          <div className="col-span-2 md:col-span-1">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2 mb-3 md:mb-4 group">
              <img
                src="/logo-icon-fundo.png"
                alt="Foca.Aí"
                className="h-10 w-10 md:h-12 md:w-12 object-contain group-hover:opacity-90 transition-opacity"
              />
              <span className="text-xl md:text-2xl font-bold text-white tracking-tight">Foca.aí</span>
            </Link>

            <p className="text-blue-100/70 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 max-w-xs">
              Seu assistente pessoal no WhatsApp para organizar finanças, saúde, estudos e agenda.
            </p>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] md:text-xs font-bold text-blue-200 uppercase tracking-wider opacity-80">Suporte Oficial</span>
              <a
                href="mailto:suportefocaaioficial@gmail.com"
                className="flex items-center gap-2 text-xs md:text-sm text-white hover:text-blue-300 transition-colors font-medium"
              >
                <Mail className="w-3.5 h-3.5" />
                suportefocaaioficial@gmail.com
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="col-span-1">
            <h4 className="font-bold mb-3 md:mb-4 text-white text-sm md:text-base">Produto</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#como-funciona"
                  onClick={(e) => handleScroll(e, 'como-funciona')}
                  className="text-blue-100/70 hover:text-white text-xs md:text-sm transition-colors cursor-pointer block py-0.5"
                >
                  Recursos
                </a>
              </li>
              <li>
                <a
                  href="#precos"
                  onClick={(e) => handleScroll(e, 'precos')}
                  className="text-blue-100/70 hover:text-white text-xs md:text-sm transition-colors cursor-pointer block py-0.5"
                >
                  Preços
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={(e) => handleScroll(e, 'faq')}
                  className="text-blue-100/70 hover:text-white text-xs md:text-sm transition-colors cursor-pointer block py-0.5"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-bold mb-3 md:mb-4 text-white text-sm md:text-base">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-blue-100/70 hover:text-white text-xs md:text-sm transition-colors block py-0.5">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-blue-100/70 hover:text-white text-xs md:text-sm transition-colors block py-0.5">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Rodapé Inferior */}
        <div className="border-t border-white/10 mt-8 md:mt-10 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blue-100/40 text-xs text-center md:text-left">
            © {new Date().getFullYear()} Foca.aí. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/foca__ai?igsh=MXZrd21nYjI5ZmZ2dQ%3D%3D"
              className="bg-white/5 p-2 rounded-full text-white/80 hover:text-[#E1306C] hover:bg-white/10 transition-all duration-300"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}