// lib/db.js
import { Pool } from 'pg';

// Isso garante que não abriremos milhões de conexões no serverless
let pool;

if (!pool) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: true } // ✅ Produção: valida certificado SSL
      : { rejectUnauthorized: false } // ⚠️ Dev: permite certificados self-signed
  });
}

export default pool;