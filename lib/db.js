// lib/db.js
import { Pool } from 'pg';

// Isso garante que não abriremos milhões de conexões no serverless
let pool;

if (!pool) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Necessário para o Neon DB
    },
  });
}

export default pool;