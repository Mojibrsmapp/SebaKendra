// SebaKendra - Modular Monolith Server (Node.js runtime)
// Mirrors the Laravel modular architecture from the blueprint:
//   Modules: Auth, Users, CitizenServices, Orders, Payments(bKash), Wallet,
//            Finance, Commission, DigitalTools, PhotoStudio, PDFTools,
//            AITools, BusinessSaaS, SMS, Subscriptions, Affiliate, Support,
//            Training, API, Notifications, Analytics
// In production this maps 1:1 to Laravel modules under app/Modules/*.
// This server serves the public/ SPA and exposes the API surface used by
// the frontend (health, config, payment verification stub for sandbox).

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 4001;
const HOST = '0.0.0.0';
const PUBLIC_DIR = path.join(__dirname, 'public');

// ---- Config (env-driven; secrets never shipped to frontend) ----
const CONFIG = {
  appName: 'SebaKendra',
  env: process.env.APP_ENV || 'local',
  bkash: {
    mode: process.env.BKASH_MODE || 'sandbox', // sandbox | live
    // Credentials come from server env only. Never expose in client code.
    appKey: process.env.BKASH_APP_KEY || '',
    appSecret: process.env.BKASH_APP_SECRET || '',
    username: process.env.BKASH_USERNAME || '',
    password: process.env.BKASH_PASSWORD || '',
  },
  // In-memory sandbox payment ledger (production: MySQL `payments` table).
  sandboxPayments: new Map(),
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
};

function send(res, status, body, type = 'application/json') {
  const data = (Buffer.isBuffer(body) || typeof body === 'string') ? body : JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': type.includes('html') ? 'no-cache' : 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  });
  res.end(data);
}

function readBody(req) {
  return new Promise((resolve) => {
    let buf = '';
    req.on('data', (c) => { buf += c; if (buf.length > 1e6) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(buf || '{}')); } catch { resolve({}); } });
  });
}

// ---- bKash Payment Module (sandbox implementation of the blueprint flow) ----
// Flow: Create Payment -> Hosted Checkout -> Execute/Query (server-side verify)
// Rule: an order is NEVER marked paid from a frontend redirect alone.
// Rule: customer bKash PIN / OTP is NEVER collected or stored.
function bkashCreatePayment({ amount, invoice, purpose, serviceSlug, serviceName, customerName, customerPhone }) {
  const paymentID = 'SBK' + crypto.randomBytes(8).toString('hex').toUpperCase();
  const record = {
    paymentID,
    amount: Number(amount),
    invoice: invoice || paymentID,
    purpose: purpose || serviceName || serviceSlug,
    serviceSlug,
    serviceName,
    customerName,
    customerPhone,
    status: 'pending',
    mode: CONFIG.bkash.mode,
    createdAt: new Date().toISOString(),
    trxID: null,
  };
  CONFIG.sandboxPayments.set(paymentID, record);
  return record;
}

function bkashExecutePayment(paymentID) {
  const rec = CONFIG.sandboxPayments.get(paymentID);
  if (!rec) return { ok: false, success: false, error: 'Payment not found' };
  if (rec.status === 'completed') return { ok: true, success: true, ...rec, duplicate: true }; // idempotent
  if (rec.status === 'expired') return { ok: false, success: false, error: 'Payment expired' };
  // Server-side verification (production: call bKash Execute/Query API here)
  rec.status = 'completed';
  rec.trxID = 'TRX' + crypto.randomBytes(6).toString('hex').toUpperCase();
  rec.executedAt = new Date().toISOString();
  return { ok: true, success: true, ...rec };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // ---------- API ----------
  if (pathname === '/api/health') {
    return send(res, 200, { status: 'ok', app: CONFIG.appName, env: CONFIG.env, time: new Date().toISOString() });
  }
  if (pathname === '/api/config') {
    // Safe public config only (no secrets)
    return send(res, 200, { appName: CONFIG.appName, bkashMode: CONFIG.bkash.mode, currency: 'BDT' });
  }
  if (pathname === '/api/payments/create' && req.method === 'POST') {
    const body = await readBody(req);
    if (!body.amount || Number(body.amount) <= 0) return send(res, 422, { ok: false, success: false, error: 'Invalid amount' });
    const rec = bkashCreatePayment(body);
    return send(res, 201, { ok: true, success: true, paymentID: rec.paymentID, amount: rec.amount, mode: rec.mode, status: rec.status });
  }
  if (pathname === '/api/payments/execute' && req.method === 'POST') {
    const body = await readBody(req);
    const result = bkashExecutePayment(body.paymentID);
    return send(res, result.ok ? 200 : 404, result);
  }
  if (pathname.startsWith('/api/payments/') && req.method === 'GET') {
    const id = pathname.split('/').pop();
    const rec = CONFIG.sandboxPayments.get(id);
    return rec ? send(res, 200, { ok: true, success: true, ...rec }) : send(res, 404, { ok: false, success: false, error: 'Not found' });
  }
  if (pathname === '/api/verify' && req.method === 'GET') {
    const ref = (url.searchParams.get('ref') || '').toUpperCase();
    let rec = CONFIG.sandboxPayments.get(ref);
    if (!rec) {
      for (const r of CONFIG.sandboxPayments.values()) {
        if (r.trxID === ref || r.invoice === ref) { rec = r; break; }
      }
    }
    return send(res, 200, { ok: true, found: !!rec, verified: !!rec, record: rec || null });
  }

  // ---------- Static + SPA fallback ----------
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  if (!filePath.startsWith(PUBLIC_DIR)) return send(res, 403, 'Forbidden', 'text/plain');
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      fs.readFile(filePath, (e, data) => {
        if (e) return send(res, 500, 'Server error', 'text/plain');
        send(res, 200, data, MIME[path.extname(filePath)] || 'application/octet-stream');
      });
    } else {
      // SPA route -> index.html
      fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (e, data) => {
        if (e) return send(res, 500, 'Server error', 'text/plain');
        send(res, 200, data, MIME['.html']);
      });
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`SebaKendra running at http://${HOST}:${PORT} (bKash: ${CONFIG.bkash.mode} mode)`);
});
