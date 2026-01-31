import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Loader2 } from "lucide-react";
import ScrollToTop from "@/components/ScrollToTop"; // <--- 1. NOVO IMPORT

// --- LAZY LOADING ---
const Index = lazy(() => import("./pages/Index"));
const Plans = lazy(() => import("./pages/Plans"));
const NotFound = lazy(() => import("./pages/NotFound"));

// --- PÁGINAS LEGAIS ---
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

// NOVO: Importando a página do Carrinho
const Cart = lazy(() => import("./pages/Cart"));

// Auth Pages
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));

// App Pages
const Account = lazy(() => import("./pages/app/Account"));
const SubscriptionBlocked = lazy(() => import("./pages/app/SubscriptionBlocked"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#040949]">
    <Loader2 className="w-10 h-10 text-white animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            
            {/* 2. ADICIONA O COMPONENTE AQUI */}
            {/* Ele vai monitorizar as trocas de página e rolar para o topo automaticamente */}
            <ScrollToTop /> 
            
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* --- ROTAS PÚBLICAS --- */}
                <Route path="/" element={<Index />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/precos" element={<Plans />} />
                
                {/* --- ROTAS LEGAIS --- */}
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                
                {/* --- ROTAS DE AUTENTICAÇÃO --- */}
                <Route path="/login" element={<Login />} />
                <Route path="/entrar" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/comecar" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                
                {/* --- ÁREA DO CLIENTE --- */}
                <Route 
                  path="/account" 
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  } 
                />

                <Route path="/app" element={<Navigate to="/account" replace />} />
                <Route path="/app/perfil" element={<Navigate to="/account" replace />} />

                <Route
                  path="/app/blocked"
                  element={
                    <ProtectedRoute>
                      <SubscriptionBlocked />
                    </ProtectedRoute>
                  }
                />

                {/* --- ROTA DO CARRINHO --- */}
                <Route 
                  path="/cart" 
                  element={<Cart />} 
                />

                {/* Erro 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>

          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;