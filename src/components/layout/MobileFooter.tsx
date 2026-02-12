import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';

export function MobileFooter() {
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
        <footer className="lg:hidden bg-[#040949] border-t border-white/10 text-white transition-colors duration-300">
            <div className="container mx-auto px-4 pt-10 pb-8">

                {/* Brand */}
                <div className="mb-8 text-center">
                    <Link to="/" className="flex items-center justify-center gap-2 mb-3 group">
                        <img
                            src="/logo-icon-fundo.png"
                            alt="Foca.Aí"
                            className="h-10 w-10 object-contain group-hover:opacity-90 transition-opacity"
                        />
                        <span className="text-xl font-bold text-white tracking-tight">Foca.aí</span>
                    </Link>

                    <p className="text-blue-100/70 text-xs leading-relaxed mb-4 max-w-xs mx-auto">
                        Seu assistente pessoal no WhatsApp para organizar finanças, saúde, estudos e agenda.
                    </p>

                    <div className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider opacity-80">Suporte Oficial</span>
                        <a
                            href="mailto:suportefocaaioficial@gmail.com"
                            className="flex items-center gap-2 text-xs text-white hover:text-blue-300 transition-colors font-medium"
                        >
                            <Mail className="w-3.5 h-3.5" />
                            suportefocaaioficial@gmail.com
                        </a>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8 text-center">
                    <div>
                        <h4 className="font-bold mb-3 text-white text-sm">Produto</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#como-funciona"
                                    onClick={(e) => handleScroll(e, 'como-funciona')}
                                    className="text-blue-100/70 hover:text-white text-xs block py-1"
                                >
                                    Recursos
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#precos"
                                    onClick={(e) => handleScroll(e, 'precos')}
                                    className="text-blue-100/70 hover:text-white text-xs block py-1"
                                >
                                    Preços
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#faq"
                                    onClick={(e) => handleScroll(e, 'faq')}
                                    className="text-blue-100/70 hover:text-white text-xs block py-1"
                                >
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-3 text-white text-sm">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/privacy" className="text-blue-100/70 hover:text-white text-xs block py-1">
                                    Privacidade
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-blue-100/70 hover:text-white text-xs block py-1">
                                    Termos de Uso
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-white/10 pt-6 flex flex-col items-center gap-4">
                    <a
                        href="https://www.instagram.com/foca__ai?igsh=MXZrd21nYjI5ZmZ2dQ%3D%3D"
                        className="bg-white/5 p-2 rounded-full text-white/80 hover:text-[#E1306C] hover:bg-white/10 transition-all duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                    >
                        <Instagram className="w-5 h-5" />
                    </a>

                    <p className="text-blue-100/40 text-[10px] text-center">
                        © {new Date().getFullYear()} Foca.aí. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
