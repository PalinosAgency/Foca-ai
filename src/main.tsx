/*! desenvolvido por Arthur Miquelito Lopes e Heitor Crespo de Souza
 * Copyright (c) 2026 Arthur Miquelito Lopes e Heitor Crespo de Souza. Todos os direitos reservados.
 * Aviso de propriedade intelectual: remocao ou alteracao deste aviso nao remove os direitos autorais dos autores.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Pega o ID da variável de ambiente
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

// LOG DE DEPURAÇÃO: Verifica se o ID foi carregado
if (!clientId) {
  console.error("🔴 [Main] ERRO CRÍTICO: VITE_GOOGLE_CLIENT_ID está vazio ou indefinido!");
} else {
  console.log("🔵 [Main] Google Client ID carregado:", clientId.substring(0, 10) + "...");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);