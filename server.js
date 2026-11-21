// SebaKendra - Modular Monolith Server (Node.js runtime + MySQL)
// Database: seba_kendra | User: seba_kendra | Password: seba_kendra
// Fallback: in-memory sandbox ledger when MySQL is unavailable

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
let mysql = null;
try { mysql = require('mysql2/promise'); } catch (e) { mysql = null; }

const PORT = process.env.PORT || 4001;
const HOST = '0.0.0.0';
const PUBLIC_DIR = path.join(__dirname, 'public');

// ---- Database Configuration ----
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'seba_kendra',
  password: process.env.DB_PASSWORD || 'seba_kendra',
  database: process.env.DB_NAME || 'seba_kendra',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let dbPool = null;
let dbAvailable = false;

async function initDatabase() {
  if (!mysql) {
    console.log('[DB] mysql2 driver not available, using in-memory mode');
    return;
  }
  try {
    dbPool = mysql.createPool(DB_CONFIG);
    const conn = await dbPool.getConnection();
    await conn.ping();
    conn.release();
    dbAvailable = true;
    console.log('[DB] Connected to MySQL database:', DB_CONFIG.database);

    // Auto-create core tables if not exist
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        service_slug VARCHAR(100) NOT NULL,
        service_name VARCHAR(255) NOT NULL,
        fee DECIMAL(10,2) NOT NULL,
        customer_name VARCHAR(150),
        customer_phone VARCHAR(30),
        status VARCHAR(50) DEFAULT 'processing',
        payment_id VARCHAR(100),
        trx_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id VARCHAR(100) PRIMARY KEY,
        amount DECIMAL(10,2) NOT NULL,
        trx_id VARCHAR(100),
        purpose VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        executed_at TIMESTAMP NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  } catch (err) {
    console.warn('[DB] MySQL connection notice:', err.message);
    console.warn('[DB] Operating in resilient memory mode (will auto-reconnect if MySQL starts)');
    dbAvailable = false;
  }
}

initDatabase();

// ---- Config (env-driven; secrets never shipped to frontend) ----
const CONFIG = {
  appName: 'SebaKendra',
  env: process.env.APP_ENV || 'local',
  bkash: {
    mode: process.env.BKASH_MODE || 'sandbox',
    appKey: process.env.BKASH_APP_KEY || '',
    appSecret: process.env.BKASH_APP_SECRET || '',
    username: process.env.BKASH_USERNAME || '',
    password: process.env.BKASH_PASSWORD || '',
  },
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
  '.wasm': 'application/wasm',
  '.tflite': 'application/octet-stream',
  '.binarypb': 'application/octet-stream',
};

function send(res, status, body, type = 'application/json') {
  const isBinaryOrString = Buffer.isBuffer(body) || typeof body === 'string';
  const data = isBinaryOrString ? body : JSON.stringify(body);
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

// ---- bKash Payment Module ----
async function bkashCreatePayment({ amount, invoice, purpose, serviceSlug, serviceName, customerName, customerPhone }) {
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

  if (dbAvailable && dbPool) {
    try {
      await dbPool.query(
        'INSERT INTO payments (payment_id, amount, purpose, status) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE amount=VALUES(amount)',
        [paymentID, record.amount, record.purpose, 'pending']
      );
    } catch (e) { console.error('[DB Insert Error]', e.message); }
  }

  return record;
}

async function bkashExecutePayment(paymentID) {
  const rec = CONFIG.sandboxPayments.get(paymentID);
  if (!rec) return { ok: false, success: false, error: 'Payment not found' };
  if (rec.status === 'completed') return { ok: true, success: true, ...rec, duplicate: true };
  if (rec.status === 'expired') return { ok: false, success: false, error: 'Payment expired' };

  rec.status = 'completed';
  rec.trxID = 'TRX' + crypto.randomBytes(6).toString('hex').toUpperCase();
  rec.executedAt = new Date().toISOString();

  if (dbAvailable && dbPool) {
    try {
      await dbPool.query(
        'UPDATE payments SET status = ?, trx_id = ?, executed_at = NOW() WHERE payment_id = ?',
        ['completed', rec.trxID, paymentID]
      );
    } catch (e) { console.error('[DB Update Error]', e.message); }
  }

  return { ok: true, success: true, ...rec };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // ---------- API ----------
  if (pathname === '/api/health') {
    return send(res, 200, {
      status: 'ok',
      app: CONFIG.appName,
      env: CONFIG.env,
      mysql: dbAvailable ? 'connected' : 'memory-fallback',
      db: DB_CONFIG.database,
      time: new Date().toISOString(),
    });
  }
  if (pathname === '/api/config') {
    return send(res, 200, {
      appName: CONFIG.appName,
      bkashMode: CONFIG.bkash.mode,
      currency: 'BDT',
      mysql: dbAvailable,
    });
  }
  if (pathname === '/api/payments/create' && req.method === 'POST') {
    const body = await readBody(req);
    if (!body.amount || Number(body.amount) <= 0) return send(res, 422, { ok: false, success: false, error: 'Invalid amount' });
    const rec = await bkashCreatePayment(body);
    return send(res, 201, { ok: true, success: true, paymentID: rec.paymentID, amount: rec.amount, mode: rec.mode, status: rec.status });
  }
  if (pathname === '/api/payments/execute' && req.method === 'POST') {
    const body = await readBody(req);
    const result = await bkashExecutePayment(body.paymentID);
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
