# 🎯 Foca.aí - Assistente Pessoal Inteligente no WhatsApp

<div align="center">
  <img src="public/logo-icon-fundo.png" alt="Foca.aí Logo" width="120" height="120">
  
  **Organize sua vida de forma simples e inteligente — direto do WhatsApp!**

  [![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](#-licença)
  [![Security: A+](https://img.shields.io/badge/Security-A%2B-green.svg)](https://securityheaders.com)
  [![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
  
  [🌐 Site Oficial](https://foca-ai-oficial.vercel.app) · [📧 Suporte](mailto:suportefocaaioficial@gmail.com) · [📸 Instagram](https://www.instagram.com/foca__ai)
</div>

---

> **⚠️ AVISO LEGAL**: Este repositório é de código **source-available** (código visível apenas para referência e aprendizado). **O uso, cópia, modificação ou redistribuição para fins comerciais é estritamente proibido sem autorização expressa e por escrito da Palinos Produtora.** Veja a [Licença](#-licença) para detalhes.

---

## 📖 Sobre o Projeto

**Foca.aí** é um assistente pessoal inteligente que funciona diretamente no WhatsApp, projetado para ajudar você a organizar **finanças**, **saúde**, **estudos** e **agenda** de forma simples e eficiente.

### ✨ Principais Funcionalidades

- 💰 **Gestão Financeira**: Controle de receitas e despesas
- 🏥 **Acompanhamento de Saúde**: Registro de medicamentos e consultas
- 📚 **Organização de Estudos**: Planejamento de tarefas acadêmicas
- 📅 **Agenda Inteligente**: Gerenciamento de compromissos

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Roteamento**: React Router DOM v7
- **UI Components**: 
  - Radix UI (Componentes acessíveis)
  - shadcn/ui (Design System)
  - Tailwind CSS (Estilização)
- **Formulários**: React Hook Form + Zod (Validação)
- **Ícones**: Lucide React

### Backend (Serverless)
- **Runtime**: Node.js 20.x
- **API**: Vercel Serverless Functions
- **Banco de Dados**: PostgreSQL (Neon)
- **Autenticação**: JWT + bcryptjs
- **Email**: Nodemailer (SMTP)
- **Logging**: Winston (Estruturado)

### Integrações
- **Pagamentos**: Hotmart (Webhooks HMAC)
- **OAuth**: Google Login
- **WhatsApp**: Integração via API

### Segurança
- ✅ **Headers de Segurança**: CSP, HSTS, X-Frame-Options
- ✅ **Rate Limiting**: Proteção contra brute-force
- ✅ **CORS**: Whitelist configurada
- ✅ **SSL/TLS**: Certificados validados (Neon DB)
- ✅ **Logging Auditado**: Winston com níveis estruturados
- ✅ **Validação HMAC**: Webhooks Hotmart
- ✅ **Grade A+**: SecurityHeaders.com

---

## 📦 Instalação

### Pré-requisitos

- Node.js 20.x ou superior
- npm ou yarn
- Banco de dados PostgreSQL (Neon recomendado)
- Conta SMTP (para envio de emails)

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/foca-ai.git
   cd foca-ai
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```

   Edite o arquivo `.env` com suas credenciais:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@host/database

   # JWT Secret
   JWT_SECRET=sua-chave-secreta-super-segura

   # Email (SMTP)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=seu-email@gmail.com
   EMAIL_PASS=sua-senha-de-app

   # Application
   APP_URL=http://localhost:5173

   # Hotmart Webhook
   HOTMART_WEBHOOK_TOKEN=seu-token-hotmart

   # Google OAuth
   VITE_GOOGLE_CLIENT_ID=seu-client-id-google
   ```

4. **Configure o banco de dados**
   
   Execute os scripts SQL em `database/schema.sql` (se disponível) ou crie as tabelas:
   ```sql
   -- Exemplo: Tabela de usuários
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     is_verified BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

   Acesse: `http://localhost:5173`

---

## 🏗️ Estrutura do Projeto

```
foca-ai/
├── api/                      # Serverless Functions (Vercel)
│   ├── auth/                # Autenticação (login, register, etc.)
│   ├── finance/             # APIs financeiras
│   ├── webhooks/            # Webhooks (Hotmart)
│   └── account.js           # Gestão de conta
├── lib/                     # Bibliotecas compartilhadas
│   ├── auth.js              # JWT helpers
│   ├── db.js                # Conexão PostgreSQL
│   ├── email.js             # Nodemailer
│   ├── logger.js            # Winston
│   └── security/            # Rate limiting, HMAC, etc.
├── src/                     # Frontend React
│   ├── components/          # Componentes React
│   │   ├── layout/         # Navbar, Footer, etc.
│   │   ├── ui/             # shadcn/ui components
│   │   └── cart/           # Carrinho de compras
│   ├── contexts/           # Context API (Auth, Cart)
│   ├── pages/              # Páginas da aplicação
│   ├── hooks/              # Custom hooks
│   └── App.tsx             # App principal
├── public/                  # Assets estáticos
├── vercel.json             # Configuração Vercel + Headers
├── .env.example            # Exemplo de variáveis de ambiente
├── package.json            # Dependências
└── README.md               # Este arquivo
```

---

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor Vite (localhost:5173)

# Build
npm run build            # Compila para produção
npm run preview          # Preview do build local

# Linting
npm run lint             # Executa ESLint

# Testes (se configurado)
npm test                 # Executa testes
```

---

## 🔒 Segurança

Este projeto segue as melhores práticas de segurança:

### ✅ Implementado

- **Headers HTTP**: CSP, HSTS, X-Frame-Options, Referrer-Policy
- **Autenticação JWT**: Tokens assinados com HS256
- **Rate Limiting**: Proteção contra ataques de força bruta
- **CORS**: Whitelist configurada (não permite `*`)
- **SSL/TLS**: Certificados validados em produção
- **Validação de Entrada**: Zod schemas
- **Logging Estruturado**: Winston com níveis (info, warn, error)
- **Webhook Security**: HMAC validation (Hotmart)
- **Secrets Management**: Variáveis de ambiente (não commitadas)

### 📊 Auditorias

- ✅ **SecurityHeaders.com**: Grade A+
- ✅ **npm audit**: 0 vulnerabilidades
- ✅ **Dependências**: Atualizadas regularmente

Para detalhes completos, consulte: [`SECURITY_DOCUMENTATION.md`](/.gemini/antigravity/brain/906c59d7-af35-41b4-8bf7-2469a6238876/SECURITY_DOCUMENTATION.md)

---

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte o repositório ao Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Configure as variáveis de ambiente no Dashboard Vercel**
   - Acesse: Settings → Environment Variables
   - Adicione todas as variáveis do `.env.example`

3. **Deploy automático**
   - Push para `main` → Deploy automático
   - Preview: branches de feature

### Variáveis de Ambiente Obrigatórias na Vercel

```
DATABASE_URL
JWT_SECRET
EMAIL_HOST
EMAIL_PORT
EMAIL_USER
EMAIL_PASS
APP_URL (https://foca-ai-oficial.vercel.app)
HOTMART_WEBHOOK_TOKEN
VITE_GOOGLE_CLIENT_ID
```

---

## 📝 Roadmap

### ✅ Concluído
- [x] Sistema de autenticação completo (JWT + OAuth Google)
- [x] Integração de pagamentos (Hotmart)
- [x] Dashboard de usuário
- [x] Sistema de carrinho de compras
- [x] Auditoria de segurança completa (Grade A+)
- [x] Logging estruturado (Winston)

### 🔜 Próximas Features
- [ ] Integração completa WhatsApp Bot
- [ ] Módulo de agenda com notificações
- [ ] Relatórios financeiros (gráficos)
- [ ] Exportação de dados (CSV/PDF)
- [ ] App Mobile (React Native)
- [ ] Testes automatizados (Jest + React Testing Library)

---

## 🤝 Contribuindo

Este é um projeto **proprietário** desenvolvido pela **Palinos Produtora**. 

O código está disponível **apenas para fins educacionais e de referência**. Contribuições externas não são aceitas no momento.

**Se você deseja colaborar ou usar comercialmente**, entre em contato:
- 📧 Email: suportefocaaioficial@gmail.com
- 📸 Instagram: [@foca__ai](https://www.instagram.com/foca__ai)

---

## 📄 Licença

**Copyright © 2026 Palinos Produtora. Todos os direitos reservados.**

Este software é **proprietário e protegido por direitos autorais**. O código-fonte está disponível publicamente **apenas para fins de referência, estudo e aprendizado**, sob as seguintes condições:

### ✅ Permitido (sem autorização)
- Visualizar o código-fonte
- Estudar a arquitetura e implementação
- Usar como referência educacional

### ❌ Proibido (sem autorização expressa e por escrito)
- **Uso comercial** (incluindo SaaS, aplicações internas de empresas, serviços pagos)
- **Redistribuição** (pública ou privada, modificada ou não)
- **Cópia** (total ou parcial) para outros projetos
- **Modificação e uso** em produção
- **Criação de trabalhos derivados** para fins comerciais

### 📝 Licenciamento Comercial

Para obter uma **licença comercial** ou autorização de uso, entre em contato:
- 📧 **Email**: suportefocaaioficial@gmail.com
- 🌐 **Site**: [foca-ai-oficial.vercel.app](https://foca-ai-oficial.vercel.app)

**Violações desta licença estão sujeitas a ações legais.**

---

## ⚖️ Disclaimer

ESTE SOFTWARE É FORNECIDO "NO ESTADO EM QUE SE ENCONTRA", SEM GARANTIAS DE QUALQUER TIPO, EXPRESSAS OU IMPLÍCITAS. EM NENHUMA CIRCUNSTÂNCIA OS AUTORES SERÃO RESPONSÁVEIS POR QUAISQUER DANOS DECORRENTES DO USO DESTE SOFTWARE.

O uso não autorizado deste software para fins comerciais constitui violação de direitos autorais e está sujeito a processos judiciais.

---

## 👥 Equipe

**Desenvolvido por**: Palinos Produtora  
**Suporte**: suportefocaaioficial@gmail.com  
**Instagram**: [@foca__ai](https://www.instagram.com/foca__ai)

---

## 📞 Suporte

- 📧 **Email**: suportefocaaioficial@gmail.com
- 📸 **Instagram**: [@foca__ai](https://www.instagram.com/foca__ai)
- 🌐 **Site**: [foca-ai-oficial.vercel.app](https://foca-ai-oficial.vercel.app)

---

<div align="center">
  
  **Desenvolvido com ❤️ pela Palinos Produtora**
  
  © 2026 Foca.aí. Todos os direitos reservados.
  
</div>
