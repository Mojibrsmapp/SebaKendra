// SebaKendra Store — client state (localStorage persistence)
// Production equivalent: MySQL tables (users, orders, wallet_transactions,
// payments, commission_entries, ai_credits, tickets, notifications).
// Financial rule: ledger entries are append-only; never destructively deleted.

const Store = {
  KEY: 'sebakendra_v1',
  state: null,

  defaults() {
    return {
      user: null, // { name, phone, email, role, plan }
      orders: [], // { id, serviceSlug, serviceName, fee, status, date, form, paymentID, trxID }
      wallet: [], // ledger: { id, type, amount, ref, date, status }
      credits: 100, // AI credits
      tickets: [], // { id, subject, msg, status, date }
      notifications: [], // { id, text, date, read }
      favorites: [],
      subscriptions: [], // { plan, status, date }
      toolUsage: {}, // slug -> count
      withdrawals: [], // { id, amount, status, date }
      audit: [], // admin audit log
      featureFlags: { photoStudio: true, pdfTools: true, aiTools: true, sms: false, api: true },
      referrals: [], // { code, date, commission }
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      this.state = raw ? { ...this.defaults(), ...JSON.parse(raw) } : this.defaults();
    } catch { this.state = this.defaults(); }
    return this.state;
  },

  save() { localStorage.setItem(this.KEY, JSON.stringify(this.state)); },

  // ---- Auth ----
  login(name, phone, email) {
    this.state.user = { name, phone, email, role: 'citizen', plan: 'free', joined: new Date().toISOString() };
    this.notify(`স্বাগতম, ${name}! আপনার অ্যাকাউন্ট তৈরি হয়েছে।`);
    this.save();
  },
  logout() { this.state.user = null; this.save(); },
  get user() { return this.state.user; },

  // ---- Wallet ledger (append-only) ----
  walletBalance() {
    return this.state.wallet.filter(t => t.status === 'completed')
      .reduce((s, t) => s + Number(t.amount), 0);
  },
  ledger(type, amount, ref) {
    this.state.wallet.unshift({
      id: 'TXN' + Date.now().toString(36).toUpperCase(),
      type, amount: Number(amount), ref: ref || '', status: 'completed',
      date: new Date().toISOString(),
    });
    this.save();
  },

  // ---- Orders ----
  addOrder(order) {
    this.state.orders.unshift(order);
    this.ledger('service_purchase', -order.fee, order.id);
    this.notify(`অর্ডার তৈরি হয়েছে: ${order.id} — ${order.serviceName}`);
    this.save();
  },
  updateOrder(id, patch) {
    const o = this.state.orders.find(x => x.id === id);
    if (o) Object.assign(o, patch);
    this.save();
  },

  // ---- AI credits ----
  spendCredits(n) {
    if (this.state.credits < n) return false;
    this.state.credits -= n; this.save(); return true;
  },
  addCredits(n) { this.state.credits += n; this.save(); },

  // ---- Notifications ----
  notify(text) {
    this.state.notifications.unshift({ id: 'N' + Date.now(), text, date: new Date().toISOString(), read: false });
    this.save();
  },

  // ---- Support tickets ----
  addTicket(subject, msg) {
    const t = { id: 'TKT-' + Date.now().toString(36).toUpperCase(), subject, msg, status: 'open', date: new Date().toISOString() };
    this.state.tickets.unshift(t); this.save(); return t;
  },

  // ---- Favorites / usage ----
  toggleFav(slug) {
    const i = this.state.favorites.indexOf(slug);
    i >= 0 ? this.state.favorites.splice(i, 1) : this.state.favorites.push(slug);
    this.save();
  },
  bumpUsage(slug) { this.state.toolUsage[slug] = (this.state.toolUsage[slug] || 0) + 1; this.save(); },

  // ---- Admin audit ----
  audit(action) {
    this.state.audit.unshift({ action, date: new Date().toISOString(), by: this.state.user?.name || 'admin' });
    this.save();
  },
};

Store.load();

// ---- Helpers ----
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const fmtTk = (n) => '৳' + Number(n).toLocaleString('en-IN');
const fmtDate = (iso) => new Date(iso).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' });
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const newOrderId = () => 'SK-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);

function toast(msg, isError = false) {
  const el = document.createElement('div');
  el.className = 'toast' + (isError ? ' error' : '');
  el.textContent = msg;
  $('#toastWrap').appendChild(el);
  setTimeout(() => el.remove(), 3800);
}

function openModal(html) {
  $('#modalWrap').innerHTML = `<div class="modal-overlay" onclick="if(event.target===this)closeModal()"><div class="modal"><button class="modal-close" onclick="closeModal()">✕</button>${html}</div></div>`;
}
function closeModal() { $('#modalWrap').innerHTML = ''; }
