import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // Agora pegamos também o "hash" (que é a parte #precos)
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Se tiver um hash na URL (ex: #precos)
    if (hash) {
      // Damos um pequeno delay (100ms) para garantir que a Home carregou os elementos
      const timer = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          // Rola suavemente até a seção
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      
      // Limpa o timer se o usuário mudar de página rápido
      return () => clearTimeout(timer);
    } 
    // Se NÃO tiver hash, aí sim rola para o topo (comportamento padrão)
    else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]); // Executa quando muda a página OU o hash

  return null;
};

export default ScrollToTop;