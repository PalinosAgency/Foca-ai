import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // O hook useLocation "escuta" qual é a página atual
  const { pathname } = useLocation();

  useEffect(() => {
    // Sempre que o "pathname" mudar, rola para o topo suavemente
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Este componente não renderiza nada visualmente
};

export default ScrollToTop;