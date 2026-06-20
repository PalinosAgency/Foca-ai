/*! desenvolvido por Arthur Miquelito Lopes e Heitor Crespo de Souza
 * Copyright (c) 2026 Arthur Miquelito Lopes e Heitor Crespo de Souza. Todos os direitos reservados.
 * Aviso de propriedade intelectual: remocao ou alteracao deste aviso nao remove os direitos autorais dos autores.
 */
// lib/db.js
import { Pool } from 'pg';

// Pool singleton — evita múltiplas conexões em ambiente serverless
let pool;

if (!pool) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: true }  // ✅ Produção: valida certificado SSL
      : { rejectUnauthorized: false }, // ⚠️ Dev: permite certificados self-signed

    // --- Configurações Serverless (Vercel + Neon) ---
    max: 5,                     // Máx. 5 conexões por instância (Neon free = 100 total)
    idleTimeoutMillis: 10000,   // Fecha conexões ociosas em 10s (evita leak no serverless)
    connectionTimeoutMillis: 5000, // Timeout de 5s na tentativa de conexão
  });
}

export default pool;
