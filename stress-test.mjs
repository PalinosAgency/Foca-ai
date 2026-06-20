#!/usr/bin/env node
/*! desenvolvido por Arthur Miquelito Lopes e Heitor Crespo de Souza
 * Copyright (c) 2026 Arthur Miquelito Lopes e Heitor Crespo de Souza. Todos os direitos reservados.
 * Aviso de propriedade intelectual: remocao ou alteracao deste aviso nao remove os direitos autorais dos autores.
 */
/**
 * stress-test.mjs — Foca.aí API Stress Test
 *
 * Uso:
 *   node stress-test.mjs                               # padrão: 20 usuários, 5 req
 *   node stress-test.mjs --users 50 --requests 8
 *   npm run stress
 *   npm run stress:medium
 *   npm run stress:heavy
 */

const BASE_URL = 'https://foca-ai-oficial.vercel.app';

// --- Parsear argumentos CLI ---
const args = process.argv.slice(2);
const flag = (name, def) => {
    const i = args.indexOf(name);
    return i !== -1 ? parseInt(args[i + 1]) : def;
};
const CONCURRENT_USERS = flag('--users', 20);
const REQUESTS_PER_USER = flag('--requests', 5);

// --- Estado global ---
const results = {
    total: 0,
    success: 0,
    error: 0,
    rateLimited: 0,
    latencies: [],
    byEndpoint: {},
};

// --- Helpers ---
function trackResult(endpoint, status, latency, expectedOk) {
    results.total++;
    results.latencies.push(latency);

    if (!results.byEndpoint[endpoint]) {
        results.byEndpoint[endpoint] = { ok: 0, err: 0, tooMany: 0, latencies: [] };
    }
    results.byEndpoint[endpoint].latencies.push(latency);

    if (status === 429) {
        results.rateLimited++;
        results.byEndpoint[endpoint].tooMany++;
        // Rate limiting é comportamento esperado, não é erro
        results.success++;
        results.byEndpoint[endpoint].ok++;
    } else if (expectedOk(status)) {
        results.success++;
        results.byEndpoint[endpoint].ok++;
    } else {
        results.error++;
        results.byEndpoint[endpoint].err++;
    }
}

async function request(method, path, body = null, token = null) {
    const url = BASE_URL + path;
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    const t0 = Date.now();
    try {
        const res = await fetch(url, opts);
        return { status: res.status, latency: Date.now() - t0 };
    } catch (err) {
        return { status: 0, latency: Date.now() - t0, err: err.message };
    }
}

function p(arr, pct) {
    if (!arr.length) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length * pct / 100)];
}

// --- Cenários de teste ---

// ✅ GET / → esperado: 200
async function testLanding() {
    const { status, latency } = await request('GET', '/');
    trackResult('GET /', status, latency, s => s === 200);
}

// ✅ GET /api/auth/session sem token → esperado: 401 (correto)
async function testSessionUnauthenticated() {
    const { status, latency } = await request('GET', '/api/auth/session');
    trackResult('GET /api/auth/session (sem token)', status, latency, s => s === 401);
}

// ✅ POST /api/auth/login com credenciais inválidas → esperado: 400 ou 401
async function testLoginInvalid() {
    const { status, latency } = await request('POST', '/api/auth/login', {
        email: `stress_${Date.now()}@example.com`,
        password: 'WrongPassword123!',
    });
    trackResult('POST /api/auth/login (inválido)', status, latency,
        // Qualquer 4xx é correto: 400 (dados inválidos), 401 (credenciais erradas), 429 (rate limit)
        s => (s >= 400 && s < 500));
}

// ✅ GET /api/account sem token → esperado: 401 (não 500!)
async function testAccountProtected() {
    const { status, latency } = await request('GET', '/api/account');
    trackResult('GET /api/account (sem auth)', status, latency, s => s === 401);
}

// ✅ POST /api/auth/register com dados duplicados → esperado: 400 (já cadastrado) ou 201 (se criou)
async function testRegisterDuplicate() {
    const { status, latency } = await request('POST', '/api/auth/register', {
        name: 'Stress Test User',
        email: 'stress.duplicate@focaai.test',
        password: 'TestPassword123!',
    });
    // API retorna 400 para email duplicado (não 409). 201 se de alguma forma registrar.
    trackResult('POST /api/auth/register (duplicado)', status, latency,
        // Qualquer 4xx é correto: 400 (já existe), 409 (conflito), 429 (rate limit). 201 se criou.
        s => s === 201 || (s >= 400 && s < 500));
}

// ✅ POST /api/auth/forgot-password → esperado: 200 (endpoint público)
async function testForgotPassword() {
    const { status, latency } = await request('POST', '/api/auth/forgot-password', {
        email: 'nonexistent@focaai.test',
    });
    trackResult('POST /api/auth/forgot-password', status, latency, s => [200, 400, 404, 429].includes(s));
}

// --- Simular um usuário completo ---
const SCENARIOS = [
    testLanding,
    testSessionUnauthenticated,
    testLoginInvalid,
    testAccountProtected,
    testRegisterDuplicate,
    testForgotPassword,
];

async function simulateUser() {
    for (let i = 0; i < REQUESTS_PER_USER; i++) {
        // Cicla pelos cenários sem pular nenhum
        const fn = SCENARIOS[i % SCENARIOS.length];
        await fn();
        // Pequeno delay para evitar burst excessivo
        await new Promise(r => setTimeout(r, 50 + Math.random() * 100));
    }
}

// --- Main ---
async function main() {
    console.log('\n🚦 Iniciando Stress Test — Foca.aí');
    console.log(`   URL: ${BASE_URL}`);
    console.log(`   Usuários simultâneos: ${CONCURRENT_USERS}`);
    console.log(`   Requisições por usuário: ${REQUESTS_PER_USER}`);
    console.log(`   Total estimado: ${CONCURRENT_USERS * REQUESTS_PER_USER} requisições`);
    console.log('\n   Aguarde...\n');

    const t0 = Date.now();
    const workers = Array.from({ length: CONCURRENT_USERS }, () => simulateUser());
    await Promise.all(workers);
    const duration = ((Date.now() - t0) / 1000).toFixed(1);

    const line = '─'.repeat(60);
    const thick = '═'.repeat(60);

    console.log(`\n${thick}`);
    console.log('  📊  FOCA.AÍ — RELATÓRIO DE STRESS TEST');
    console.log(thick);
    console.log(`  Configuração: ${CONCURRENT_USERS} usuários × ${REQUESTS_PER_USER} req cada`);
    console.log(`  Duração total: ${duration}s`);
    console.log(line);
    console.log(`  Total de requisições: ${results.total}`);
    console.log(`  ✅ Sucesso:        ${String(results.success).padStart(4)}  (${(results.success / results.total * 100).toFixed(1)}%)`);
    console.log(`  ❌ Erros (5xx/net):${String(results.error).padStart(4)}  (${(results.error / results.total * 100).toFixed(1)}%)`);
    console.log(`  🚦 Rate Limited:   ${String(results.rateLimited).padStart(4)}  (${(results.rateLimited / results.total * 100).toFixed(1)}%)`);
    console.log(`  ⚡ Throughput:     ~${Math.round(results.total / parseFloat(duration))} req/s`);
    console.log(line);
    console.log('  LATÊNCIA');
    console.log(`    Média:  ${Math.round(results.latencies.reduce((a, b) => a + b, 0) / results.latencies.length)}ms`);
    console.log(`    P50:    ${p(results.latencies, 50)}ms`);
    console.log(`    P95:    ${p(results.latencies, 95)}ms`);
    console.log(`    P99:    ${p(results.latencies, 99)}ms`);
    console.log(`    Máximo: ${Math.max(...results.latencies)}ms`);
    console.log(line);
    console.log('  POR ENDPOINT:');

    for (const [ep, data] of Object.entries(results.byEndpoint)) {
        const avg = Math.round(data.latencies.reduce((a, b) => a + b, 0) / data.latencies.length);
        const icon = data.err === 0 ? '✅' : '❌';
        console.log(`  ${icon} ${ep}`);
        console.log(`      ok=${data.ok} err=${data.err} 429=${data.tooMany} avg=${avg}ms`);
    }

    console.log(thick);

    const errorRate = results.error / results.total * 100;
    if (errorRate > 5) {
        console.log(`\n  ⚠️  ATENÇÃO: Taxa de erro real > 5% (${errorRate.toFixed(1)}%) — verifique os logs do Vercel!`);
        console.log('  Endpoints com erro indicam 500 inesperado ou timeout de rede.');
    } else {
        console.log(`\n  ✅ EXCELENTE: Taxa de erro ${errorRate.toFixed(1)}% — dentro do esperado!`);
        if (results.rateLimited > 0) {
            console.log(`  🚦 Rate limiting funcionando: ${results.rateLimited} req limitadas (comportamento correto).`);
        }
        if (p(results.latencies, 95) < 2000) {
            console.log(`  ⚡ P95 = ${p(results.latencies, 95)}ms — dentro do limite aceitável (< 2000ms).`);
        }
    }
    console.log('');
}

main().catch(err => {
    console.error('Erro no stress test:', err);
    process.exit(1);
});
