// SebaKendra SPA Router & Application Logic
// Blueprint compliant: 20 sections, 20 service categories, 13 roles, bKash checkout,
// append-only financial ledger, public verification, digital tools, AI tools, mini SaaS.

const App = {
  currentRoute: '/',
  params: {},

  init() {
    this.bindGlobal();
    this.handleRoute();
    window.addEventListener('popstate', () => this.handleRoute());
  },

  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRoute();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  handleRoute() {
    const full = window.location.pathname;
    this.currentRoute = full;
    const appEl = $('#app');

    // Parse route
    if (full === '/' || full === '') return this.renderHome(appEl);
    if (full === '/services') return this.renderServices(appEl);
    if (full.startsWith('/service/')) {
      const slug = full.replace('/service/', '');
      return this.renderServiceDetail(appEl, slug);
    }
    if (full === '/tools' || full === '/tools/photo-studio') return this.renderPhotoStudio(appEl);
    if (full === '/tools/pdf') return this.renderPdfTools(appEl);
    if (full === '/tools/bangla') return this.renderBanglaTools(appEl);
    if (full === '/ai-tools') return this.renderAiTools(appEl);
    if (full === '/business' || full.startsWith('/business/')) return this.renderBusiness(appEl);
    if (full === '/jobs') return this.renderJobs(appEl);
    if (full === '/learn' || full === '/learn/courses') return this.renderLearn(appEl);
    if (full === '/centers') return this.renderCenters(appEl);
    if (full === '/entrepreneur' || full === '/partner') return this.renderPartner(appEl);
    if (full === '/pricing') return this.renderPricing(appEl);
    if (full === '/developers' || full === '/developers/docs') return this.renderDevelopers(appEl);
    if (full === '/verify') return this.renderVerify(appEl);
    if (full === '/help') return this.renderHelp(appEl);
    if (full === '/blog') return this.renderBlog(appEl);
    if (full === '/about') return this.renderAbout(appEl);
    if (full === '/contact') return this.renderContact(appEl);
    if (full === '/privacy') return this.renderPrivacy(appEl);
    if (full === '/terms') return this.renderTerms(appEl);
    if (full === '/login' || full === '/register') return this.renderAuth(appEl, full === '/register');
    if (full.startsWith('/dashboard')) return this.renderDashboard(appEl);
    if (full.startsWith('/admin')) return this.renderAdmin(appEl);

    // Fallback 404
    appEl.innerHTML = `
      <div class="container py-8 text-center">
        <h1 class="display">৪০৪</h1>
        <p class="lead">দুঃখিত, পাতাটি পাওয়া যায়নি।</p>
        <button class="btn btn-primary mt-4" onclick="App.navigate('/')">হোম পেজে ফিরুন</button>
      </div>`;
  },

  bindGlobal() {
    // Intercept clicks on internal links
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (href && href.startsWith('/') && !href.startsWith('//')) {
        e.preventDefault();
        this.navigate(href);
      }
    });

    // Theme toggle
    const themeBtn = $('#themeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
      });
      const saved = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', saved);
      themeBtn.textContent = saved === 'dark' ? '☀️' : '🌙';
    }

    // Auth badge update
    this.updateUserBadge();

    // Global search
    const gSearch = $('#globalSearch');
    if (gSearch) {
      gSearch.addEventListener('input', (e) => {
        const q = e.target.value.trim().toLowerCase();
        const drop = $('#searchResults');
        if (!q) { drop.classList.add('hidden'); return; }
        const matches = SERVICES.filter(s =>
          s.name.toLowerCase().includes(q) || s.en.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
        ).slice(0, 6);
        const toolMatches = [...PHOTO_TOOLS, ...PDF_TOOLS, ...BANGLA_TOOLS, ...AI_TOOLS].filter(t =>
          t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
        ).slice(0, 4);

        if (!matches.length && !toolMatches.length) {
          drop.innerHTML = '<div style="padding:1rem;color:var(--text-muted);text-align:center;">কোনো ফলাফল পাওয়া যায়নি</div>';
        } else {
          drop.innerHTML = `
            ${matches.map(m => `
              <a href="/service/${m.slug}" class="search-item">
                <span class="search-icon">${m.icon}</span>
                <div class="search-text">
                  <div class="search-title">${esc(m.name)}</div>
                  <div class="search-meta">${esc(m.en)} • ${fmtTk(m.fee)}</div>
                </div>
              </a>`).join('')}
            ${toolMatches.map(t => `
              <a href="/tools" class="search-item">
                <span class="search-icon">🛠️</span>
                <div class="search-text">
                  <div class="search-title">${esc(t.name)}</div>
                  <div class="search-meta">টুল • ${esc(t.desc)}</div>
                </div>
              </a>`).join('')}`;
        }
        drop.classList.remove('hidden');
      });
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.global-search')) $('#searchResults')?.classList.add('hidden');
      });
    }

    // Mobile menu toggle
    const mobBtn = $('#mobileMenuBtn');
    if (mobBtn) {
      mobBtn.addEventListener('click', () => {
        const menu = $('#navMenu');
        menu.classList.toggle('open');
      });
    }
  },

  updateUserBadge() {
    const wrap = $('#userNavArea');
    if (!wrap) return;
    const u = Store.user;
    if (u) {
      wrap.innerHTML = `
        <a href="/dashboard" class="user-badge" title="Citizen Dashboard">
          <span class="badge-avatar">${u.name.charAt(0).toUpperCase()}</span>
          <span>${esc(u.name.split(' ')[0])}</span>
        </a>
        <button class="btn btn-sm btn-ghost" onclick="App.logout()">লগআউট</button>`;
    } else {
      wrap.innerHTML = `
        <button class="btn btn-sm btn-ghost" onclick="App.openLoginModal()">লগইন</button>
        <button class="btn btn-sm btn-primary" onclick="App.openRegisterModal()">রেজিস্টার</button>`;
    }
  },

  logout() {
    Store.logout();
    this.updateUserBadge();
    toast('সফলভাবে লগআউট হয়েছে');
    this.navigate('/');
  },

  // ===================== 1. HOMEPAGE =====================
  renderHome(el) {
    const popular = SERVICES.slice(0, 8);
    const topTools = [...PHOTO_TOOLS.slice(0, 4), ...PDF_TOOLS.slice(0, 4), ...BANGLA_TOOLS.slice(0, 4)];
    const topAi = AI_TOOLS.slice(0, 6);

    el.innerHTML = `
      <!-- §14.3 HERO SECTION -->
      <section class="hero-section">
        <div class="container hero-content">
          <div class="badge hero-badge">🚀 বাংলাদেশের সর্ববৃহৎ ডিজিটাল সেবা প্ল্যাটফর্ম</div>
          <h1 class="hero-title">এক প্ল্যাটফর্মে নাগরিক সেবা,<br>ডিজিটাল টুলস ও ব্যবসার সমাধান</h1>
          <p class="hero-desc">
            নাগরিকত্ব, জন্ম নিবন্ধন, NID সহায়তা, পাসপোর্ট, ড্রাফটিং, পাসপোর্ট ছবি মেকার,
            PDF ও বাংলা টুলস, AI রাইটার এবং ছোট ব্যবসার পূর্ণাঙ্গ ক্লাউড ম্যানেজমেন্ট।
          </p>
          <div class="hero-cta-group">
            <button class="btn btn-primary" onclick="App.navigate('/services')">সেবাসমূহ দেখুন ➜</button>
            <button class="btn btn-teal" onclick="App.navigate('/tools')">ফ্রি ডিজিটাল টুলস 🛠️</button>
            <button class="btn btn-outline" onclick="App.navigate('/entrepreneur')">উদ্যোক্তা পার্টনার হন 🤝</button>
          </div>
          <div class="hero-stats-row">
            <div class="hero-stat"><span class="hero-stat-num">৩০+</span><span class="hero-stat-label">নাগরিক সেবা</span></div>
            <div class="hero-stat"><span class="hero-stat-num">৫০+</span><span class="hero-stat-label">ডিজিটাল ও AI টুলস</span></div>
            <div class="hero-stat"><span class="hero-stat-num">৬৪</span><span class="hero-stat-label">জেলায় উদ্যোক্তা</span></div>
            <div class="hero-stat"><span class="hero-stat-num">১০০%</span><span class="hero-stat-label">নিরাপদ bKash চেকআউট</span></div>
          </div>
        </div>
      </section>

      <!-- §14.4 SMART QUICK ACCESS -->
      <section class="py-4 bg-white border-b">
        <div class="container">
          <div class="quick-nav">
            <a href="/services" class="quick-nav-item"><span>🏛️</span><span>নাগরিক সেবা</span></a>
            <a href="/tools/photo-studio" class="quick-nav-item"><span>📸</span><span>পাসপোর্ট ছবি</span></a>
            <a href="/tools/pdf" class="quick-nav-item"><span>📄</span><span>PDF টুলস</span></a>
            <a href="/tools/bangla" class="quick-nav-item"><span>🇧🇩</span><span>বাংলা অফিস</span></a>
            <a href="/ai-tools" class="quick-nav-item"><span>✨</span><span>AI টুলস হাব</span></a>
            <a href="/business" class="quick-nav-item"><span>💼</span><span>মিনি SaaS & POS</span></a>
            <a href="/jobs" class="quick-nav-item"><span>📋</span><span>চাকরির সার্কুলার</span></a>
            <a href="/verify" class="quick-nav-item"><span>✔️</span><span>পাবলিক ভেরিফাই</span></a>
          </div>
        </div>
      </section>

      <!-- §14.5 POPULAR SERVICES -->
      <section class="py-8">
        <div class="container">
          <div class="section-head">
            <div>
              <div class="section-tag">জনপ্রিয় সেবা</div>
              <h2 class="section-title">সবচেয়ে বেশি ব্যবহৃত নাগরিক সেবা</h2>
              <p class="section-subtitle">ঘরে বসেই আবেদন সহায়তা নিন, স্ট্যাটাস ট্র্যাক করুন ও দ্রুত ডেলিভারি পান।</p>
            </div>
            <button class="btn btn-outline btn-sm" onclick="App.navigate('/services')">সব সেবা দেখুন (৩০) ➜</button>
          </div>
          <div class="grid grid-4 gap-4">
            ${popular.map(s => this.serviceCardHtml(s)).join('')}
          </div>
        </div>
      </section>

      <!-- §14.6 CITIZEN SERVICES CATEGORIES -->
      <section class="py-8 bg-surface">
        <div class="container">
          <div class="section-head text-center">
            <div class="section-tag">ক্যাটেগরি</div>
            <h2 class="section-title">সেবা ক্যাটেগরি অনুযায়ী খুঁজুন</h2>
            <p class="section-subtitle">আপনার প্রয়োজনীয় বিভাগ বেছে নিয়ে বিস্তারিত আবেদন গাইড দেখুন।</p>
          </div>
          <div class="grid grid-3 gap-4">
            ${SERVICE_CATEGORIES.map(c => `
              <div class="card p-6 category-card" onclick="App.navigate('/services?cat=${c.id}')">
                <div class="cat-icon">${c.icon}</div>
                <h3 class="font-bold text-lg mb-1">${esc(c.name)}</h3>
                <p class="text-sm text-muted mb-3">${esc(c.desc)}</p>
                <div class="text-sm font-semibold text-primary">সেবা দেখতে ক্লিক করুন ➜</div>
              </div>`).join('')}
          </div>
        </div>
      </section>

      <!-- §14.7 DIGITAL TOOLS -->
      <section class="py-8">
        <div class="container">
          <div class="section-head">
            <div>
              <div class="section-tag">ডিজিটাল টুলস</div>
              <h2 class="section-title">ফটো স্টুডিও, PDF ও বাংলা টুলস</h2>
              <p class="section-subtitle">কোনো সফটওয়্যার ইন্সটল ছাড়াই ব্রাউজারেই সরাসরি কাজ সম্পন্ন করুন।</p>
            </div>
            <button class="btn btn-outline btn-sm" onclick="App.navigate('/tools')">সব টুলস ➜</button>
          </div>
          <div class="grid grid-4 gap-4">
            ${topTools.map(t => `
              <div class="card p-5 tool-card" onclick="App.navigate('${t.route || '/tools'}')">
                <div class="tool-icon mb-2">🛠️</div>
                <div class="font-bold text-base mb-1">${esc(t.name)}</div>
                <div class="text-xs text-muted mb-3">${esc(t.desc)}</div>
                <div class="tool-cta text-xs font-semibold text-primary">টুল ব্যবহার করুন ➜</div>
              </div>`).join('')}
          </div>
        </div>
      </section>

      <!-- §14.8 AI TOOLS HUB -->
      <section class="py-8 bg-surface">
        <div class="container">
          <div class="section-head">
            <div>
              <div class="section-tag">AI সলিউশন</div>
              <h2 class="section-title">AI টুলস হাব — স্মার্ট ও দ্রুত কাজ</h2>
              <p class="section-subtitle">CV তৈরি, কভার লেটার, ফেসবুক ক্যাপশন ও বিজনেস বর্ণনা নিমিষেই লিখে নিন।</p>
            </div>
            <button class="btn btn-teal btn-sm" onclick="App.navigate('/ai-tools')">AI হাব খুলুন ➜</button>
          </div>
          <div class="grid grid-3 gap-4">
            ${topAi.map(a => `
              <div class="card p-5" onclick="App.navigate('/ai-tools?tool=${a.slug}')" style="cursor:pointer">
                <div class="flex justify-between items-center mb-2">
                  <span class="badge badge-teal">${a.cost} ক্রেডিট</span>
                  <span class="text-xs text-muted">${esc(a.en)}</span>
                </div>
                <h3 class="font-bold text-base mb-1">${esc(a.name)}</h3>
                <p class="text-xs text-muted mb-3">${esc(a.desc)}</p>
                <div class="text-xs font-semibold text-teal">তৈরি করুন ➜</div>
              </div>`).join('')}
          </div>
        </div>
      </section>

      <!-- §14.9 BUSINESS SOLUTIONS -->
      <section class="py-8">
        <div class="container">
          <div class="section-head">
            <div>
              <div class="section-tag">ব্যবসা ও SaaS</div>
              <h2 class="section-title">ক্ষুদ্র ও মাঝারি ব্যবসার সহজ সমাধান</h2>
              <p class="section-subtitle">POS, ইনভয়েস, খরচ ট্র্যাকিং ও দৈনিক সেলস রিপোর্ট এক ঠিকানায়।</p>
            </div>
            <button class="btn btn-outline btn-sm" onclick="App.navigate('/business')">ব্যবসা পোর্টাল ➜</button>
          </div>
          <div class="grid grid-3 gap-4">
            ${BUSINESS_TOOLS.slice(0, 6).map(b => `
              <div class="card p-5" onclick="App.navigate('/business')" style="cursor:pointer">
                <div class="font-bold text-base mb-1">💼 ${esc(b.name)}</div>
                <p class="text-xs text-muted mb-2">${esc(b.desc)}</p>
                <span class="badge">${esc(b.en)}</span>
              </div>`).join('')}
          </div>
        </div>
      </section>

      <!-- §14.10 ENTREPRENEUR NETWORK -->
      <section class="py-8 bg-primary text-white">
        <div class="container text-center">
          <div class="badge mb-3" style="background:rgba(255,255,255,0.15);color:#fff">উদ্যোক্তা নেটওয়ার্ক</div>
          <h2 class="text-white text-3xl font-extrabold mb-3">আপনার এলাকায় সেবাকেন্দ্র পার্টনার হোন</h2>
          <p class="text-white/80 max-w-2xl mx-auto mb-6">
            দোকান বা চেম্বার থেকেই সব ধরনের নাগরিক সেবা দিন ও প্রতি সেবায় আকর্ষণীয় কমিশন আয় করুন।
            সেন্টার আইডি, QR কার্ড, প্রিন্ট ও কাস্টমার ম্যানেজমেন্ট ড্যাশবোর্ড সুবিধা।
          </p>
          <div class="flex justify-center gap-3">
            <button class="btn btn-teal" onclick="App.navigate('/entrepreneur')">পার্টনার রেজিস্ট্রেশন করুন</button>
            <button class="btn btn-outline" style="border-color:#fff;color:#fff" onclick="App.navigate('/centers')">সেন্টার তালিকা দেখুন</button>
          </div>
        </div>
      </section>

      <!-- §14.11 HOW IT WORKS -->
      <section class="py-8">
        <div class="container">
          <div class="section-head text-center">
            <div class="section-tag">পদ্ধতি</div>
            <h2 class="section-title">কিভাবে কাজ করে SebaKendra?</h2>
            <p class="section-subtitle">সহজ ৪টি ধাপে আপনার ডিজিটাল সেবা ও ডকুমেন্ট প্রস্তুত করুন</p>
          </div>
          <div class="grid grid-4 gap-4 text-center">
            <div class="card p-6">
              <div class="step-num">১</div>
              <h3 class="font-bold text-base mb-2">সেবা বা টুল নির্বাচন</h3>
              <p class="text-xs text-muted">তালিকা থেকে আপনার প্রয়োজনীয় সেবা বা ডিজিটাল টুল বেছে নিন।</p>
            </div>
            <div class="card p-6">
              <div class="step-num">২</div>
              <h3 class="font-bold text-base mb-2">তথ্য ও ডকুমেন্ট জমা</h3>
              <p class="text-xs text-muted">সহজ অনলাইন ফর্ম পূরণ করে প্রয়োজনীয় কাগজপত্র বা ছবি আপলোড করুন।</p>
            </div>
            <div class="card p-6">
              <div class="step-num">৩</div>
              <h3 class="font-bold text-base mb-2">bKash অনলাইন পেমেন্ট</h3>
              <p class="text-xs text-muted">অফিসিয়াল bKash গেটওয়ের মাধ্যমে নিরাপদ ও তাৎক্ষণিক পেমেন্ট করুন।</p>
            </div>
            <div class="card p-6">
              <div class="step-num">৪</div>
              <h3 class="font-bold text-base mb-2">প্রসেসিং ও ডেলিভারি</h3>
              <p class="text-xs text-muted">আমাদের টিম কাজ সম্পন্ন করবে; স্ট্যাটাস দেখে ডিজিটাল কপি ডাউনলোড করুন।</p>
            </div>
          </div>
        </div>
      </section>

      <!-- §14.12 PRICING PREVIEW -->
      <section class="py-8 bg-surface">
        <div class="container">
          <div class="section-head text-center">
            <div class="section-tag">সাবস্ক্রিপশন</div>
            <h2 class="section-title">সাশ্রয়ী ও স্বচ্ছ প্রাইসিং প্ল্যান</h2>
            <p class="section-subtitle">নাগরিক, পেশাজীবী ও উদ্যোক্তাদের জন্য মানানসই প্যাকেজ</p>
          </div>
          <div class="grid grid-3 gap-4">
            ${PLANS.slice(0, 3).map(p => this.planCardHtml(p)).join('')}
          </div>
          <div class="text-center mt-6">
            <button class="btn btn-outline" onclick="App.navigate('/pricing')">সব ৫টি প্ল্যান দেখুন ও তুলনা করুন ➜</button>
          </div>
        </div>
      </section>

      <!-- §14.14 FEATURED CENTERS -->
      <section class="py-8">
        <div class="container">
          <div class="section-head">
            <div>
              <div class="section-tag">সেন্টার নেটওয়ার্ক</div>
              <h2 class="section-title">অনুমোদিত উদ্যোক্তা সেবাকেন্দ্র</h2>
              <p class="section-subtitle">স্থানীয় সেন্টারে গিয়েও যেকোনো সেবায় সহায়তা নিতে পারেন।</p>
            </div>
            <button class="btn btn-outline btn-sm" onclick="App.navigate('/centers')">সব সেন্টার দেখুন ➜</button>
          </div>
          <div class="grid grid-4 gap-4">
            ${CENTERS.map(c => `
              <div class="card p-5">
                <div class="badge badge-teal mb-2">${c.id}</div>
                <h3 class="font-bold text-base mb-1">${esc(c.name)}</h3>
                <div class="text-xs text-muted mb-1">👤 উদ্যোক্তা: ${esc(c.owner)}</div>
                <div class="text-xs text-muted mb-1">📍 ${esc(c.upazila)}, ${esc(c.district)}</div>
                <div class="text-xs text-muted mb-3">📞 ${esc(c.phone)}</div>
                <span class="badge ${c.status === 'verified' ? 'badge-primary' : ''}">অনুমোদিত সেন্টার</span>
              </div>`).join('')}
          </div>
        </div>
      </section>

      <!-- §14.15 CUSTOMER REVIEWS -->
      <section class="py-8 bg-surface">
        <div class="container">
          <div class="section-head text-center">
            <div class="section-tag">প্রতিক্রিয়া</div>
            <h2 class="section-title">গ্রাহকরা কী বলছেন</h2>
            <p class="section-subtitle">হাজারো নাগরিক ও উদ্যোক্তার আস্থার প্রতীক SebaKendra</p>
          </div>
          <div class="grid grid-4 gap-4">
            ${REVIEWS.map(r => `
              <div class="card p-5">
                <div class="text-amber-500 mb-2">${'★'.repeat(r.rating)}</div>
                <p class="text-xs text-muted mb-3 italic">"${esc(r.comment)}"}</p>
                <div class="font-bold text-sm">${esc(r.name)}</div>
                <div class="text-xs text-muted">${esc(r.role)} • ${esc(r.district)}</div>
              </div>`).join('')}
          </div>
        </div>
      </section>

      <!-- §14.18 FAQ -->
      <section class="py-8">
        <div class="container max-w-3xl">
          <div class="section-head text-center">
            <div class="section-tag">সাধারণ জিজ্ঞাসা</div>
            <h2 class="section-title">সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)</h2>
          </div>
          <div class="card p-6">
            ${FAQS.map((f, i) => `
              <div class="faq-item ${i === 0 ? 'open' : ''}" onclick="this.classList.toggle('open')">
                <div class="faq-q font-bold py-3 flex justify-between cursor-pointer">
                  <span>${esc(f.q)}</span>
                  <span class="faq-arr">▾</span>
                </div>
                <div class="faq-a text-sm text-muted pb-3">${esc(f.a)}</div>
              </div>`).join('')}
          </div>
        </div>
      </section>

      <!-- §14.19 APP INSTALLATION / CTA -->
      <section class="py-8 bg-primary text-white text-center">
        <div class="container max-w-2xl">
          <h2 class="text-white text-2xl font-bold mb-2">আজই শুরু করুন আপনার ডিজিটাল সেবা</h2>
          <p class="text-white/80 mb-5">বিনামূল্যে অ্যাকাউন্ট খুলে সব ডিজিটাল টুলস ও নাগরিক সেবার সুবিধা নিন।</p>
          <div class="flex justify-center gap-3">
            <button class="btn btn-teal" onclick="App.openRegisterModal()">ফ্রি অ্যাকাউন্ট খুলুন</button>
            <button class="btn btn-outline" style="border-color:#fff;color:#fff" onclick="App.navigate('/services')">সেবা এক্সপ্লোর করুন</button>
          </div>
        </div>
      </section>`;
  },

  serviceCardHtml(s) {
    return `
      <div class="card p-5 service-card" onclick="App.navigate('/service/${s.slug}')">
        <div class="service-icon mb-2">${s.icon}</div>
        <div class="badge mb-2 text-xs">${esc(s.days)}</div>
        <h3 class="font-bold text-base mb-1 service-title">${esc(s.name)}</h3>
        <p class="text-xs text-muted mb-3 line-clamp-2">${esc(s.desc)}</p>
        <div class="service-footer flex justify-between items-center pt-3 border-t">
          <span class="font-extrabold text-primary text-base">${fmtTk(s.fee)}</span>
          <span class="btn btn-xs btn-primary">আবেদন ➜</span>
        </div>
      </div>`;
  },

  planCardHtml(p) {
    return `
      <div class="card p-6 plan-card ${p.featured ? 'featured' : ''}">
        ${p.featured ? '<div class="plan-ribbon">সেরা পছন্দ</div>' : ''}
        <div class="font-bold text-lg mb-1">${esc(p.name)}</div>
        <div class="plan-price my-3">
          <span class="text-3xl font-extrabold text-primary">${fmtTk(p.price)}</span>
          <span class="text-xs text-muted">${esc(p.period)}</span>
        </div>
        <p class="text-xs text-muted mb-4">${esc(p.desc)}</p>
        <ul class="plan-features text-xs mb-6">
          ${p.features.map(f => `<li>✓ ${esc(f)}</li>`).join('')}
        </ul>
        <button class="btn ${p.featured ? 'btn-primary' : 'btn-outline'} w-full"
                onclick="App.subscribePlan('${p.id}')">
          ${p.price === 0 ? 'বিনামূল্যে শুরু করুন' : 'প্যাকেজটি নিন ➜'}
        </button>
      </div>`;
  },

  // ===================== 2. SERVICES CATALOG =====================
  renderServices(el) {
    const urlParams = new URLSearchParams(window.location.search);
    const activeCat = urlParams.get('cat') || 'all';
    const filtered = activeCat === 'all' ? SERVICES : SERVICES.filter(s => s.cat === activeCat);

    el.innerHTML = `
      <div class="container py-8">
        <div class="section-head">
          <div>
            <div class="section-tag">সার্ভিস ক্যাটালগ</div>
            <h1 class="section-title">নাগরিক সেবা ও আবেদন সহায়তা</h1>
            <p class="section-subtitle">
              বিশেষ বিজ্ঞপ্তি: SebaKendra একটি অনুমোদিত সহায়তা ও প্রসেসিং প্ল্যাটফর্ম, সরকারি কর্তৃপক্ষের বিকল্প নয়।
              সরকারি সনদ সংশ্লিষ্ট কর্তৃপক্ষ দ্বারা ইস্যু হয়।
            </p>
          </div>
        </div>

        <!-- Filter tabs -->
        <div class="tabs mb-6">
          <button class="tab-btn ${activeCat === 'all' ? 'active' : ''}" onclick="App.navigate('/services')">সব সেবা (${SERVICES.length})</button>
          ${SERVICE_CATEGORIES.map(c => `
            <button class="tab-btn ${activeCat === c.id ? 'active' : ''}" onclick="App.navigate('/services?cat=${c.id}')">
              ${c.icon} ${esc(c.name)}
            </button>`).join('')}
        </div>

        <!-- Service cards grid -->
        <div class="grid grid-4 gap-4">
          ${filtered.map(s => this.serviceCardHtml(s)).join('')}
        </div>
      </div>`;
  },

  // ===================== 3. SERVICE DETAIL =====================
  renderServiceDetail(el, slug) {
    const s = SERVICES.find(x => x.slug === slug);
    if (!s) {
      el.innerHTML = `<div class="container py-8 text-center"><p>সেবা পাওয়া যায়নি</p><button class="btn btn-primary mt-3" onclick="App.navigate('/services')">সব সেবা দেখুন</button></div>`;
      return;
    }

    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="mb-4">
          <a href="/services" class="text-sm text-primary">← সব সেবায় ফিরুন</a>
        </div>

        <div class="card p-8 mb-6">
          <div class="flex items-start gap-4 mb-4">
            <div class="service-icon text-3xl">${s.icon}</div>
            <div class="flex-1">
              <span class="badge mb-2">${esc(s.days)}</span>
              <h1 class="text-2xl font-bold mb-1">${esc(s.name)}</h1>
              <div class="text-xs text-muted mb-2">${esc(s.en)} • ক্যাটেগরি: ${esc(s.cat)}</div>
              <p class="text-sm text-muted">${esc(s.desc)}</p>
            </div>
          </div>

          <div class="notice-box mb-6">
            <div class="font-bold text-xs mb-1">⚠️ সরকারি নীতিমালা ও ঘোষণা:</div>
            <p class="text-xs text-muted">
              SebaKendra শুধুমাত্র আবেদন প্রস্তুতি ও প্রসেসিংয়ে সহায়তা করে। কোনো ভুয়া বা অননুমোদিত সরকারি সনদ তৈরি করা হয় না।
              চূড়ান্ত সনদ শুধুমাত্র সংশ্লিষ্ট সরকারি কর্তৃপক্ষ (ইউনিয়ন পরিষদ/পৌরসভা/সিটি কর্পোরেশন/মন্ত্রণালয়) দ্বারা অনুমোদিত ও ইস্যু হয়।
            </p>
          </div>

          <div class="grid grid-2 gap-6 mb-6">
            <div>
              <h2 class="font-bold text-base mb-3">📋 প্রয়োজনীয় কাগজপত্র</h2>
              <ul class="text-xs space-y-2">
                ${s.docs.map(d => `<li class="p-2 bg-surface rounded">✓ ${esc(d)}</li>`).join('')}
              </ul>
            </div>
            <div>
              <h2 class="font-bold text-base mb-3">💰 ফি ব্রেকডাউন</h2>
              <div class="card p-4 bg-surface">
                <div class="flex justify-between text-xs py-1"><span>সরকারি/সার্ভিস প্রসেসিং ফি</span><span>${fmtTk(Math.round(s.fee * 0.7))}</span></div>
                <div class="flex justify-between text-xs py-1"><span>প্ল্যাটফর্ম ও ড্রাফটিং ফি</span><span>${fmtTk(Math.round(s.fee * 0.3))}</span></div>
                <div class="flex justify-between font-bold text-base pt-3 border-t mt-2 text-primary">
                  <span>সর্বমোট ফি</span><span>${fmtTk(s.fee)}</span>
                </div>
                <div class="text-xs text-muted mt-2">✓ bKash অনলাইন চেকআউট এর মাধ্যমে প্রদেয়</div>
              </div>

              <div class="mt-4">
                <button class="btn btn-primary w-full btn-lg" onclick="App.openOrderModal('${s.slug}')">
                  অনলাইন আবেদন শুরু করুন ➜
                </button>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t">
            <h3 class="font-bold text-sm mb-2">আবেদন প্রক্রিয়া:</h3>
            <ol class="text-xs text-muted space-y-1 list-decimal pl-4">
              <li>"অনলাইন আবেদন শুরু করুন" বাটনে ক্লিক করে তথ্য পূরণ করুন।</li>
              <li>প্রয়োজনীয় কাগজপত্রের ছবি বা স্ক্যান কপি আপলোড করুন।</li>
              <li>অফিসিয়াল bKash চেকআউট দিয়ে ফি পরিশোধ করুন।</li>
              <li>তাৎক্ষণিক অর্ডার আইডি পাবেন, ড্যাশবোর্ডে স্ট্যাটাস ট্র্যাক করতে পারবেন।</li>
              <li>প্রসেসিং শেষ হলে ডিজিটাল কপি ডাউনলোড করুন বা নিকটস্থ সেন্টারে সংগ্রহ করুন।</li>
            </ol>
          </div>
        </div>
      </div>`;
  },

  // ===================== 4. ORDER MODAL & bKASH FLOW =====================
  openOrderModal(slug) {
    const s = SERVICES.find(x => x.slug === slug);
    if (!s) return;
    const u = Store.user || { name: '', phone: '', email: '' };

    openModal(`
      <h2 class="text-xl font-bold mb-1">📝 আবেদন ফর্ম — ${esc(s.name)}</h2>
      <p class="text-xs text-muted mb-4">ফি: <strong class="text-primary">${fmtTk(s.fee)}</strong> • প্রসেসিং সময়: ${esc(s.days)}</p>

      <form id="orderForm" onsubmit="App.submitOrder(event, '${s.slug}')">
        <div class="form-group">
          <label class="form-label">আবেদনকারীর পূর্ণ নাম *</label>
          <input type="text" class="form-input" name="name" value="${esc(u.name)}" required placeholder="জাতীয় পরিচয়পত্র অনুযায়ী নাম">
        </div>
        <div class="grid grid-2 gap-3">
          <div class="form-group">
            <label class="form-label">মোবাইল নম্বর *</label>
            <input type="tel" class="form-input" name="phone" value="${esc(u.phone)}" required placeholder="017XXXXXXXX">
          </div>
          <div class="form-group">
            <label class="form-label">ইমেইল (ঐচ্ছিক)</label>
            <input type="email" class="form-input" name="email" value="${esc(u.email)}" placeholder="you@example.com">
          </div>
        </div>
        <div class="grid grid-2 gap-3">
          <div class="form-group">
            <label class="form-label">জেলা *</label>
            <input type="text" class="form-input" name="district" required placeholder="যেমন: ঢাকা / চট্টগ্রাম">
          </div>
          <div class="form-group">
            <label class="form-label">উপজেলা / থানা *</label>
            <input type="text" class="form-input" name="upazila" required placeholder="উপজেলা / থানা">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">বিস্তারিত ঠিকানা *</label>
          <textarea class="form-textarea" rows="2" name="address" required placeholder="গ্রাম/মহল্লা, ডাকঘর, ওয়ার্ড"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">কাগজপত্র আপলোড (NID / জন্ম সনদ / প্রত্যয়ন)</label>
          <input type="file" class="form-input" multiple accept="image/*,.pdf">
          <div class="text-xs text-muted mt-1">সর্বোচ্চ ১০MB। একাধিক ফাইল নির্বাচন করা যাবে।</div>
        </div>
        <div class="form-group">
          <label class="form-label">বিশেষ নোট বা নির্দেশনা (যদি থাকে)</label>
          <textarea class="form-textarea" rows="2" name="notes" placeholder="অতিরিক্ত তথ্য..."></textarea>
        </div>

        <div class="notice-box mb-4">
          <div class="text-xs font-semibold">🔒 ডাটা সুরক্ষা অঙ্গীকার:</div>
          <div class="text-xs text-muted">আপনার দেওয়া তথ্য শুধুমাত্র এই আবেদনের প্রসেসিংয়ে ব্যবহৃত হবে। কোনো তৃতীয় পক্ষের কাছে হস্তান্তর করা হবে না।</div>
        </div>

        <div class="flex justify-end gap-3 pt-3 border-t">
          <button type="button" class="btn btn-outline" onclick="closeModal()">বাতিল</button>
          <button type="submit" class="btn btn-primary">bKash পেমেন্টে যান (${fmtTk(s.fee)}) ➜</button>
        </div>
      </form>`);
  },

  async submitOrder(e, slug) {
    e.preventDefault();
    const s = SERVICES.find(x => x.slug === slug);
    if (!s) return;
    const form = e.target;
    const formData = new FormData(form);
    const orderData = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      district: formData.get('district'),
      upazila: formData.get('upazila'),
      address: formData.get('address'),
      notes: formData.get('notes'),
    };

    // Auto-login citizen if guest
    if (!Store.user) Store.login(orderData.name, orderData.phone, orderData.email);

    // Call server to initiate bKash payment
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: s.fee,
          serviceSlug: s.slug,
          serviceName: s.name,
          customerName: orderData.name,
          customerPhone: orderData.phone,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        toast(data.error || 'পেমেন্ট তৈরি করতে সমস্যা হয়েছে', true);
        return;
      }

      // Show bKash Hosted Checkout Modal
      this.openBkashModal({
        paymentID: data.paymentID,
        amount: data.amount,
        service: s,
        orderData,
      });
    } catch (err) {
      toast('সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি', true);
    }
  },

  openBkashModal({ paymentID, amount, service, orderData }) {
    openModal(`
      <div class="bkash-checkout-modal">
        <div class="bkash-header">
          <div class="bkash-logo">bKash</div>
          <div class="bkash-badge">Merchant Payment (Sandbox)</div>
        </div>
        <div class="p-6">
          <div class="bkash-meta mb-4">
            <div class="flex justify-between py-1 text-xs"><span>মার্চেন্ট নাম:</span><strong>SebaKendra Ltd.</strong></div>
            <div class="flex justify-between py-1 text-xs"><span>ইনভয়েস:</span><code>${paymentID}</code></div>
            <div class="flex justify-between py-1 text-xs"><span>সেবা:</span><span>${esc(service.name)}</span></div>
            <div class="flex justify-between py-2 border-t mt-2 text-base font-bold text-primary">
              <span>পরিশোধযোগ্য টাকা:</span><span class="text-pink-600">${fmtTk(amount)}</span>
            </div>
          </div>

          <div class="notice-box mb-4" style="background:#FFF0F5;border-color:#F06292">
            <div class="font-bold text-xs" style="color:#C2185B">🔒 অফিসিয়াল bKash সিকিউরিটি প্রোটোকল:</div>
            <p class="text-xs text-muted">
              SebaKendra কখনোই আপনার bKash পিন (PIN) বা OTP সংরক্ষণ করে না।
              এটি অফিসিয়াল bKash API এর মাধ্যমে সরাসরি ভেরিফাই হয়।
            </p>
          </div>

          <div class="text-center py-3">
            <p class="text-xs text-muted mb-4">স্যান্ডবক্স মোড: পেমেন্ট সম্পূর্ণ করতে নিচের বাটনে ক্লিক করুন। সার্ভার-সাইড ভেরিফিকেশনের মাধ্যমে ট্রানজেকশন নিশ্চিত হবে।</p>
            <button id="bkashConfirmBtn" class="btn w-full btn-lg" style="background:#E2136E;color:#fff"
                    onclick="App.executeBkashPayment('${paymentID}', ${amount}, '${service.slug}')">
              bKash পেমেন্ট নিশ্চিত করুন (${fmtTk(amount)})
            </button>
          </div>

          <div class="text-center mt-3">
            <button class="btn btn-ghost btn-xs" onclick="closeModal()">বাতিল করুন</button>
          </div>
        </div>
      </div>`);

    // Attach orderData temporarily to window for execution
    window._pendingOrder = { paymentID, amount, service, orderData };
  },

  async executeBkashPayment(paymentID, amount, serviceSlug) {
    const btn = $('#bkashConfirmBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'ভেরিফাই হচ্ছে...'; }

    try {
      const res = await fetch('/api/payments/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentID }),
      });
      const data = await res.json();
      if (!data.success) {
        toast(data.error || 'পেমেন্ট ব্যর্থ হয়েছে', true);
        if (btn) { btn.disabled = false; btn.textContent = 'পুনরায় চেষ্টা করুন'; }
        return;
      }

      // Payment verified server-side! Create local order & ledger
      const s = SERVICES.find(x => x.slug === serviceSlug);
      const pending = window._pendingOrder || {};
      const order = {
        id: pending.orderData?.customOrderId || newOrderId(),
        serviceSlug: s.slug,
        serviceName: s.name,
        fee: amount,
        status: 'processing',
        date: new Date().toISOString(),
        paymentID: data.paymentID,
        trxID: data.trxID,
        customerName: pending.orderData?.name || Store.user?.name,
        customerPhone: pending.orderData?.phone || Store.user?.phone,
        formData: pending.orderData || {},
      };

      Store.addOrder(order);
      window._pendingOrder = null;

      // Show receipt modal
      openModal(`
        <div class="p-6 text-center">
          <div class="text-5xl mb-3">✅</div>
          <h2 class="text-xl font-bold mb-1 text-primary">পেমেন্ট ও অর্ডার সফল হয়েছে!</h2>
          <p class="text-xs text-muted mb-4">আপনার অর্ডার সফলভাবে গৃহীত হয়েছে এবং প্রসেসিং শুরু হয়েছে।</p>

          <div class="card p-4 text-left bg-surface mb-4 text-xs space-y-1">
            <div class="flex justify-between"><span>অর্ডার আইডি:</span><strong>${order.id}</strong></div>
            <div class="flex justify-between"><span>সেবা:</span><span>${esc(order.serviceName)}</span></div>
            <div class="flex justify-between"><span>পরিশোধিত ফি:</span><strong class="text-primary">${fmtTk(order.fee)}</strong></div>
            <div class="flex justify-between"><span>bKash TrxID:</span><code>${data.trxID}</code></div>
            <div class="flex justify-between"><span>তারিখ:</span><span>${fmtDate(order.date)}</span></div>
            <div class="flex justify-between"><span>স্ট্যাটাস:</span><span class="badge badge-primary">Processing</span></div>
          </div>

          <div class="flex justify-center gap-3">
            <button class="btn btn-outline" onclick="closeModal();App.navigate('/dashboard')">ড্যাশবোর্ড দেখুন</button>
            <button class="btn btn-teal" onclick="App.printReceipt('${order.id}')">রসিদ প্রিন্ট 🖨️</button>
          </div>
        </div>`);
    } catch (err) {
      toast('পেমেন্ট সার্ভারে ত্রুটি ঘটেছে', true);
      if (btn) { btn.disabled = false; btn.textContent = 'পুনরায় চেষ্টা করুন'; }
    }
  },

  printReceipt(orderId) {
    const o = Store.state.orders.find(x => x.id === orderId);
    if (!o) return;
    const w = window.open('', '_blank');
    w.document.write(`
      <!DOCTYPE html><html><head><title>Receipt - ${o.id}</title>
      <style>
        body { font-family: sans-serif; padding: 2rem; max-width: 600px; margin: auto; }
        .head { border-bottom: 2px solid #123B70; padding-bottom: 1rem; margin-bottom: 1rem; }
        .row { display: flex; justify-content: space-between; padding: .4rem 0; border-bottom: 1px dashed #ccc; font-size: 13px; }
        .total { font-weight: bold; font-size: 16px; border-top: 2px solid #000; margin-top: .5rem; }
      </style></head><body>
      <div class="head">
        <h2>SebaKendra — ডিজিটাল সেবা ও রসিদ</h2>
        <small>অফিসিয়াল সেবা গ্রহণ রসিদ | www.sebakendra.com</small>
      </div>
      <div class="row"><span>অর্ডার নম্বর:</span><strong>${o.id}</strong></div>
      <div class="row"><span>গ্রাহকের নাম:</span><span>${o.customerName}</span></div>
      <div class="row"><span>মোবাইল:</span><span>${o.customerPhone}</span></div>
      <div class="row"><span>সেবা:</span><span>${o.serviceName}</span></div>
      <div class="row"><span>তারিখ:</span><span>${new Date(o.date).toLocaleString()}</span></div>
      <div class="row"><span>bKash TrxID:</span><span>${o.trxID || '—'}</span></div>
      <div class="row"><span>পেমেন্ট স্ট্যাটাস:</span><span>PAID (Server Verified)</span></div>
      <div class="row total"><span>মোট পরিশোধিত:</span><span>${fmtTk(o.fee)}</span></div>
      <p style="margin-top:2rem;font-size:11px;color:#666">
        বিশেষ দ্রষ্টব্য: SebaKendra অনুমোদিত সহায়তা প্রদানকারী প্ল্যাটফর্ম। সরকারি সনদপত্র সংশ্লিষ্ট কর্তৃপক্ষ কর্তৃক ইস্যু হয়।
        রসিদ যাচাই করতে ভিজিট করুন: /verify?ref=${o.id}
      </p>
      <script>window.print();<\/script>
      </body></html>`);
    w.document.close();
  },

  // ===================== 5. PHOTO STUDIO =====================
  renderPhotoStudio(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div>
            <div class="section-tag">ডিজিটাল ফটো স্টুডিও (§3.3)</div>
            <h1 class="section-title">পাসপোর্ট ও NID ছবি এডিটর</h1>
            <p class="section-subtitle">ছবি আপলোড করুন, মাপ নির্বাচন করুন, ব্যাকগ্রাউন্ড পরিবর্তন করুন ও A4 শিট তৈরি করুন।</p>
          </div>
        </div>

        <div class="grid grid-3 gap-6">
          <!-- Controls -->
          <div class="card p-5">
            <h2 class="font-bold text-sm mb-3">১. ছবি আপলোড করুন</h2>
            <input type="file" id="photoInput" accept="image/*" class="form-input mb-4" onchange="App.handlePhotoUpload(event)">

            <h2 class="font-bold text-sm mb-2">২. মাপ নির্বাচন (Preset)</h2>
            <div class="grid grid-2 gap-2 mb-4">
              <button class="btn btn-outline btn-xs" onclick="App.applyPhotoPreset(600, 600, 'পাসপোর্ট')">পাসপোর্ট (2x2)</button>
              <button class="btn btn-outline btn-xs" onclick="App.applyPhotoPreset(400, 500, 'NID')">NID সাইজ</button>
              <button class="btn btn-outline btn-xs" onclick="App.applyPhotoPreset(450, 600, 'ভিসা')">ভিসা সাইজ</button>
              <button class="btn btn-outline btn-xs" onclick="App.applyPhotoPreset(300, 300, 'স্টুডেন্ট ID')">স্টুডেন্ট ID</button>
              <button class="btn btn-outline btn-xs" onclick="App.applyPhotoPreset(300, 80, 'স্বাক্ষর')">স্বাক্ষর (300x80)</button>
              <button class="btn btn-outline btn-xs" onclick="App.applyPhotoPreset(300, 300, 'চাকরি 300x300')">চাকরি (300x300)</button>
            </div>

            <h2 class="font-bold text-sm mb-2">৩. ব্যাকগ্রাউন্ড রঙ</h2>
            <div class="flex gap-2 mb-4">
              <button class="color-dot" style="background:#ffffff;border:1px solid #ccc" onclick="App.changePhotoBg('#ffffff')" title="সাদা"></button>
              <button class="color-dot" style="background:#0EA5A4" onclick="App.changePhotoBg('#0EA5A4')" title="হালকা টিল"></button>
              <button class="color-dot" style="background:#2563EB" onclick="App.changePhotoBg('#2563EB')" title="নীল"></button>
              <button class="color-dot" style="background:#B0BEC5" onclick="App.changePhotoBg('#B0BEC5')" title="ধূসর"></button>
            </div>

            <h2 class="font-bold text-sm mb-2">৪. বিশেষ অ্যাকশন</h2>
            <div class="space-y-2">
              <button class="btn btn-outline btn-xs w-full" onclick="App.autoRemoveBg()">✂️ ব্যাকগ্রাউন্ড রিমুভ (Auto)</button>
              <button class="btn btn-outline btn-xs w-full" onclick="App.makeA4Sheet()">🖨️ A4 প্রিন্ট শিট তৈরি (২৪ কপি)</button>
            </div>
          </div>

          <!-- Preview & Canvas -->
          <div class="card p-5 col-span-2 text-center">
            <h2 class="font-bold text-sm mb-2 text-left">প্রিভিউ ও এডিটর</h2>
            <div id="canvasWrap" class="canvas-wrap p-4 bg-surface rounded flex items-center justify-center min-h-[360px]">
              <div id="canvasEmpty" class="text-muted text-xs">
                📷 বাম পাশের প্যানেল থেকে একটি ছবি আপলোড করুন
              </div>
              <canvas id="photoCanvas" class="hidden max-w-full max-h-[420px] rounded shadow"></canvas>
            </div>
            <div id="canvasActions" class="mt-4 flex justify-center gap-3 hidden">
              <button class="btn btn-primary" onclick="App.downloadCurrentCanvas('sebakendra-photo.jpg')">ছবি ডাউনলোড (JPG) ⬇️</button>
              <button class="btn btn-teal" onclick="App.printCurrentCanvas()">প্রিন্ট প্রিভিউ 🖨️</button>
            </div>
          </div>
        </div>

        <!-- 16 Photo Tools Catalogue -->
        <div class="mt-8">
          <h2 class="font-bold text-lg mb-3">ফটো স্টুডিওর সব ফিচার (১৬টি)</h2>
          <div class="grid grid-4 gap-3">
            ${PHOTO_TOOLS.map(t => `
              <div class="card p-3 text-xs">
                <div class="font-bold mb-1">📸 ${esc(t.name)}</div>
                <div class="text-muted">${esc(t.desc)}</div>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  },

  async handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const img = await Tools.loadImage(file);
      window._activePhoto = img;
      window._activePreset = { w: 600, h: 600, label: 'পাসপোর্ট' };
      this.renderCanvasFromImage(img, window._activePreset);
      toast('ছবি সফলভাবে লোড হয়েছে');
    } catch {
      toast('ছবি লোড করা যায়নি', true);
    }
  },

  renderCanvasFromImage(img, preset, bg = null) {
    const c = Tools.processPhoto(img, { w: preset.w, h: preset.h, bg, border: 2 });
    const target = $('#photoCanvas');
    target.width = c.width; target.height = c.height;
    const ctx = target.getContext('2d');
    ctx.drawImage(c, 0, 0);
    target.classList.remove('hidden');
    $('#canvasEmpty').classList.add('hidden');
    $('#canvasActions').classList.remove('hidden');
  },

  applyPhotoPreset(w, h, label) {
    if (!window._activePhoto) return toast('প্রথমে একটি ছবি আপলোড করুন', true);
    window._activePreset = { w, h, label };
    this.renderCanvasFromImage(window._activePhoto, window._activePreset);
    toast(`${label} সাইজ প্রয়োগ করা হয়েছে (${w}x${h})`);
  },

  changePhotoBg(color) {
    if (!window._activePhoto) return toast('প্রথমে একটি ছবি আপলোড করুন', true);
    this.renderCanvasFromImage(window._activePhoto, window._activePreset || { w: 600, h: 600 }, color);
    toast('ব্যাকগ্রাউন্ড রং পরিবর্তন করা হয়েছে');
  },

  autoRemoveBg() {
    if (!window._activePhoto) return toast('প্রথমে একটি ছবি আপলোড করুন', true);
    const cleaned = Tools.removeCornerBg(window._activePhoto);
    window._activePhoto = cleaned;
    this.renderCanvasFromImage(cleaned, window._activePreset || { w: 600, h: 600 });
    toast('ব্যাকগ্রাউন্ড রিমুভ সম্পন্ন');
  },

  makeA4Sheet() {
    if (!window._activePhoto) return toast('প্রথমে একটি ছবি আপলোড করুন', true);
    const single = Tools.processPhoto(window._activePhoto, { w: 250, h: 310, border: 2 });
    const sheet = Tools.makeSheet(single, 4, 6, 250, 310);
    const target = $('#photoCanvas');
    target.width = sheet.width; target.height = sheet.height;
    target.getContext('2d').drawImage(sheet, 0, 0);
    toast('A4 প্রিন্ট শিট তৈরি হয়েছে (২৪ কপি)');
  },

  downloadCurrentCanvas(name) {
    const c = $('#photoCanvas');
    if (!c) return;
    Tools.downloadCanvas(c, name);
    Store.bumpUsage('photo-studio');
    toast('ছবি ডাউনলোড শুরু হয়েছে');
  },

  printCurrentCanvas() {
    const c = $('#photoCanvas');
    if (!c) return;
    const w = window.open('', '_blank');
    w.document.write(`<html><body style="margin:0;display:flex;align-items:center;justify-content:center"><img src="${c.toDataURL()}" style="max-width:100%" onload="window.print()"/></body></html>`);
    w.document.close();
  },

  // ===================== 6. PDF TOOLS =====================
  renderPdfTools(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div>
            <div class="section-tag">ডকুমেন্ট ও PDF (§3.4)</div>
            <h1 class="section-title">অনলাইন PDF টুলস</h1>
            <p class="section-subtitle">PDF তৈরি, টেক্সট থেকে PDF, ছবি থেকে PDF ও পেজ ম্যানেজমেন্ট।</p>
          </div>
        </div>

        <!-- Working tool: Text to PDF / Document Generator -->
        <div class="card p-6 mb-8">
          <h2 class="font-bold text-base mb-2">📄 টেক্সট / আবেদনপত্র থেকে PDF তৈরি করুন</h2>
          <p class="text-xs text-muted mb-4">যেকোনো টেক্সট বা দরখাস্ত লিখে সরাসরি PDF ফাইল হিসেবে ডাউনলোড বা প্রিন্ট করুন।</p>
          <div class="form-group">
            <label class="form-label">ডকুমেন্টের শিরোনাম</label>
            <input type="text" id="pdfTitle" class="form-input" value="আবেদনপত্র" placeholder="শিরোনাম">
          </div>
          <div class="form-group">
            <label class="form-label">মূল বক্তব্য / টেক্সট</label>
            <textarea id="pdfBody" class="form-textarea" rows="6" placeholder="এখানে আপনার দরখাস্ত বা ডকুমেন্টের টেক্সট লিখুন..."></textarea>
          </div>
          <div class="flex gap-3">
            <button class="btn btn-primary" onclick="App.generateTextPdf()">PDF তৈরি ও প্রিন্ট 🖨️</button>
            <button class="btn btn-outline" onclick="App.fillPdfSample()">নমুনা টেক্সট বসান</button>
          </div>
        </div>

        <!-- 19 PDF tools catalogue -->
        <h2 class="font-bold text-lg mb-3">সব PDF টুলস (${PDF_TOOLS.length}টি)</h2>
        <div class="grid grid-3 gap-3">
          ${PDF_TOOLS.map(t => `
            <div class="card p-4">
              <div class="font-bold text-sm mb-1">📄 ${esc(t.name)}</div>
              <div class="text-xs text-muted mb-2">${esc(t.desc)}</div>
              <span class="badge text-xs">${esc(t.en)}</span>
            </div>`).join('')}
        </div>
      </div>`;
  },

  fillPdfSample() {
    $('#pdfTitle').value = 'ছুটির জন্য আবেদন';
    $('#pdfBody').value = Tools.makeApplication({
      to: 'ব্যবস্থাপনা পরিচালক\nসেবাকেন্দ্র বাংলাদেশ লিমিটেড',
      from: 'মো. রফিকুল ইসলাম\nআইডি: SK-8842',
      subject: 'জরুরি পারিবারিক কারণে ৩ দিনের নৈমিত্তিক ছুটির আবেদন',
      body: 'বিনীত নিবেদন এই যে, আমার পারিবারিক জরুরি প্রয়োজনে আগামী ২৫ নভেম্বর থেকে ২৭ নভেম্বর পর্যন্ত অফিসে উপস্থিত থাকা সম্ভব হবে না।\n\nঅতএব, আমাকে উল্লিখিত ৩ দিনের নৈমিত্তিক ছুটি মঞ্জুর করতে মহোদয়ের সদয় মর্জি হয়।',
    });
  },

  generateTextPdf() {
    const title = $('#pdfTitle').value || 'Document';
    const body = $('#pdfBody').value;
    if (!body) return toast('অনুগ্রহ করে ডকুমেন্টের টেক্সট লিখুন', true);
    const w = window.open('', '_blank');
    w.document.write(`
      <!DOCTYPE html><html><head><title>${esc(title)}</title>
      <style>
        body { font-family: 'Hind Siliguri', sans-serif; padding: 2.5rem; max-width: 720px; margin: auto; line-height: 1.6; }
        h1 { color: #123B70; border-bottom: 2px solid #123B70; padding-bottom: .5rem; }
        pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; }
        .foot { margin-top: 3rem; pt: 1rem; border-top: 1px solid #ddd; font-size: 11px; color: #888; text-align: center; }
      </style></head><body>
      <h1>${esc(title)}</h1>
      <pre>${esc(body)}</pre>
      <div class="foot">Generated via SebaKendra PDF Tools • ${new Date().toLocaleDateString('bn-BD')}</div>
      <script>window.print();<\/script>
      </body></html>`);
    w.document.close();
    Store.bumpUsage('pdf-tools');
    toast('PDF প্রিভিউ ওপেন হয়েছে');
  },

  // ===================== 7. BANGLA & OFFICE TOOLS =====================
  renderBanglaTools(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div>
            <div class="section-tag">বাংলা ও অফিস (§3.5)</div>
            <h1 class="section-title">বাংলা কনভার্টার ও অফিস টুলস</h1>
            <p class="section-subtitle">ইউনিকোড-বিজয় কনভার্টার, কথায় টাকা লেখা, তারিখ কনভার্টার ও বাংলা দরখাস্ত জেনারেটর।</p>
          </div>
        </div>

        <div class="grid grid-2 gap-6 mb-8">
          <!-- Unicode <-> Bijoy -->
          <div class="card p-5">
            <h2 class="font-bold text-sm mb-2">🔄 ইউনিকোড ⇄ বিজয় কনভার্টার</h2>
            <textarea id="banglaInput" class="form-textarea mb-3" rows="4" placeholder="এখানে বাংলা ইউনিকোড বা বিজয় টেক্সট লিখুন..."></textarea>
            <div class="flex gap-2 mb-3">
              <button class="btn btn-outline btn-xs" onclick="App.runUniToBijoy()">ইউনিকোড ➜ বিজয়</button>
              <button class="btn btn-outline btn-xs" onclick="App.runBijoyToUni()">বিজয় ➜ ইউনিকোড</button>
            </div>
            <textarea id="banglaOutput" class="form-textarea" rows="4" readonly placeholder="কনভার্ট করা টেক্সট..."></textarea>
          </div>

          <!-- Amount in Words -->
          <div class="card p-5">
            <h2 class="font-bold text-sm mb-2">💰 কথায় টাকা লিখুন (Amount in Words)</h2>
            <div class="form-group">
              <input type="number" id="amountInput" class="form-input" placeholder="যেমন: 52500" oninput="App.runAmountInWords()">
            </div>
            <div id="amountOutput" class="card p-3 bg-surface font-bold text-primary text-sm min-h-[50px] flex items-center">
              টাকার পরিমাণ লিখুন...
            </div>

            <h2 class="font-bold text-sm mt-5 mb-2">📅 তারিখ কনভার্টার</h2>
            <input type="date" id="dateInput" class="form-input mb-2" onchange="App.runDateConvert()">
            <div id="dateOutput" class="card p-3 bg-surface text-xs whitespace-pre min-h-[50px] flex items-center">
              তারিখ নির্বাচন করুন...
            </div>
          </div>
        </div>

        <!-- 18 Bangla Tools List -->
        <h2 class="font-bold text-lg mb-3">সব বাংলা ও অফিস টুলস (${BANGLA_TOOLS.length}টি)</h2>
        <div class="grid grid-3 gap-3">
          ${BANGLA_TOOLS.map(t => `
            <div class="card p-4">
              <div class="font-bold text-sm mb-1">🇧🇩 ${esc(t.name)}</div>
              <div class="text-xs text-muted mb-2">${esc(t.desc)}</div>
              <span class="badge text-xs">${esc(t.en)}</span>
            </div>`).join('')}
        </div>
      </div>`;
  },

  runUniToBijoy() {
    const val = $('#banglaInput').value;
    $('#banglaOutput').value = Tools.unicodeToBijoy(val);
    toast('বিজয় কনভার্ট সম্পন্ন');
  },
  runBijoyToUni() {
    const val = $('#banglaInput').value;
    $('#banglaOutput').value = Tools.bijoyToUnicode(val);
    toast('ইউনিকোড কনভার্ট সম্পন্ন');
  },
  runAmountInWords() {
    const v = $('#amountInput').value;
    $('#amountOutput').textContent = Tools.amountInWords(v);
  },
  runDateConvert() {
    const v = $('#dateInput').value;
    $('#dateOutput').textContent = Tools.dateConvert(v);
  },

  // ===================== 8. AI TOOLS HUB =====================
  renderAiTools(el) {
    const urlParams = new URLSearchParams(window.location.search);
    const activeSlug = urlParams.get('tool') || 'ai-cv';
    const activeTool = AI_TOOLS.find(a => a.slug === activeSlug) || AI_TOOLS[0];

    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div>
            <div class="section-tag">AI সলিউশন (§3.6)</div>
            <h1 class="section-title">AI টুলস হাব</h1>
            <p class="section-subtitle">CV রাইটার, ফেসবুক ক্যাপশন, অনুবাদ, কভার লেটার ও বিজনেস আইডিয়া জেনারেটর।</p>
          </div>
          <div class="card p-3 bg-teal-50 flex items-center gap-2">
            <span>✨ আপনার ক্রেডিট:</span>
            <strong class="text-teal font-extrabold text-lg" id="creditCount">${Store.state.credits}</strong>
            <button class="btn btn-xs btn-teal" onclick="App.buyCredits()">+ ক্রেডিট কিনুন</button>
          </div>
        </div>

        <div class="grid grid-3 gap-6">
          <!-- Tool selector sidebar -->
          <div class="card p-4 space-y-1 max-h-[600px] overflow-y-auto">
            <div class="font-bold text-xs text-muted mb-2 uppercase">টুল বেছে নিন (${AI_TOOLS.length}টি)</div>
            ${AI_TOOLS.map(a => `
              <button class="w-full text-left p-2 rounded text-xs flex justify-between items-center ${a.slug === activeTool.slug ? 'bg-primary text-white font-bold' : 'hover:bg-surface'}"
                      onclick="App.navigate('/ai-tools?tool=${a.slug}')">
                <span class="truncate">${esc(a.name)}</span>
                <span class="badge ${a.slug === activeTool.slug ? '' : 'badge-teal'}">${a.cost} ক্</span>
              </button>`).join('')}
          </div>

          <!-- Active tool workspace -->
          <div class="card p-6 col-span-2">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h2 class="font-bold text-lg mb-1">${esc(activeTool.name)}</h2>
                <div class="text-xs text-muted">${esc(activeTool.desc)} • খরচ: ${activeTool.cost} ক্রেডিট</div>
              </div>
              <span class="badge badge-teal">${esc(activeTool.en)}</span>
            </div>

            <div class="form-group">
              <label class="form-label">আপনার ইনপুট বা প্রম্পট *</label>
              <textarea id="aiPrompt" class="form-textarea" rows="4" placeholder="আপনার প্রয়োজনীয় তথ্য লিখুন (যেমন: নাম, পদবি, বিষয়, প্রোডাক্টের বিবরণ)..."></textarea>
            </div>

            <button class="btn btn-teal w-full mb-4" onclick="App.runAiTool('${activeTool.slug}', ${activeTool.cost})">
              ✨ AI জেনারেট করুন (${activeTool.cost} ক্রেডিট)
            </button>

            <div class="form-group">
              <div class="flex justify-between items-center mb-1">
                <label class="form-label mb-0">ফলাফল</label>
                <button class="btn btn-xs btn-ghost" onclick="App.copyAiResult()">কপি করুন 📋</button>
              </div>
              <textarea id="aiResult" class="form-textarea" rows="9" readonly placeholder="AI জেনারেট করলে ফলাফল এখানে দেখাবে..."></textarea>
            </div>
          </div>
        </div>
      </div>`;
  },

  runAiTool(slug, cost) {
    const input = $('#aiPrompt').value.trim();
    if (!input) return toast('অনুগ্রহ করে কিছু লিখুন', true);
    if (!Store.spendCredits(cost)) {
      toast('পর্যাপ্ত ক্রেডিট নেই! নতুন ক্রেডিট টপ-আপ করুন।', true);
      return;
    }
    $('#creditCount').textContent = Store.state.credits;
    const res = Tools.aiGenerate(slug, input);
    $('#aiResult').value = res;
    toast(`AI কনটেন্ট জেনারেট হয়েছে (-${cost} ক্রেডিট)`);
  },

  copyAiResult() {
    const txt = $('#aiResult').value;
    if (!txt) return;
    navigator.clipboard.writeText(txt);
    toast('ক্লিপবোর্ডে কপি করা হয়েছে');
  },

  buyCredits() {
    openModal(`
      <div class="p-6 text-center">
        <h2 class="text-xl font-bold mb-2">✨ AI ক্রেডিট কিনুন</h2>
        <p class="text-xs text-muted mb-4">bKash এর মাধ্যমে তাৎক্ষণিক ক্রেডিট রিচার্জ করুন</p>
        <div class="grid grid-3 gap-3 mb-4">
          <div class="card p-3 cursor-pointer hover:border-primary" onclick="App.purchaseCredits(100, 50)">
            <div class="font-bold text-base">১০০ ক্রেডিট</div>
            <div class="text-primary font-extrabold">৳৫০</div>
          </div>
          <div class="card p-3 border-teal cursor-pointer hover:border-primary" onclick="App.purchaseCredits(300, 120)">
            <div class="badge badge-teal mb-1">জনপ্রিয়</div>
            <div class="font-bold text-base">৩০০ ক্রেডিট</div>
            <div class="text-primary font-extrabold">৳১২০</div>
          </div>
          <div class="card p-3 cursor-pointer hover:border-primary" onclick="App.purchaseCredits(1000, 350)">
            <div class="font-bold text-base">১০০০ ক্রেডিট</div>
            <div class="text-primary font-extrabold">৳৩৫০</div>
          </div>
        </div>
      </div>`);
  },

  async purchaseCredits(credits, fee) {
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: fee, serviceSlug: 'ai-credits', serviceName: `${credits} AI Credits` }),
      });
      const data = await res.json();
      if (!data.success) return toast(data.error, true);
      closeModal();
      this.openBkashModal({
        paymentID: data.paymentID,
        amount: fee,
        service: { slug: 'ai-credits', name: `${credits} AI Credits` },
        orderData: { credits },
      });
      // Override execute for credits
      const oldExecute = this.executeBkashPayment;
      this.executeBkashPayment = async (pid, amt, slug) => {
        if (slug === 'ai-credits') {
          await fetch('/api/payments/execute', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentID: pid }) });
          Store.addCredits(credits);
          Store.ledger('credit_purchase', -amt, pid);
          closeModal();
          toast(`${credits} AI ক্রেডিট যোগ হয়েছে!`);
          this.executeBkashPayment = oldExecute;
          this.handleRoute();
        } else {
          oldExecute.call(this, pid, amt, slug);
        }
      };
    } catch { toast('ত্রুটি হয়েছে', true); }
  },

  // ===================== 9. BUSINESS SAAS & POS =====================
  renderBusiness(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div>
            <div class="section-tag">ব্যবসা ও Mini SaaS (§3.7)</div>
            <h1 class="section-title">POS Light ও ইনভয়েস ম্যানেজার</h1>
            <p class="section-subtitle">দোকানের সেলস, খরচ ও ইনভয়েস রসিদ প্রিন্ট করার সহজ ক্লাউড টুল।</p>
          </div>
        </div>

        <!-- POS Interactive Demo -->
        <div class="grid grid-3 gap-6 mb-8">
          <!-- Product catalogue -->
          <div class="card p-5">
            <h2 class="font-bold text-sm mb-3">পণ্য তালিকা (ক্লিক করে কার্টে যোগ করুন)</h2>
            <div class="space-y-2" id="posProducts">
              ${[
                { name: 'নাগরিক সেবা ফর্ম প্রিন্ট', price: 50 },
                { name: 'পাসপোর্ট ছবি (৪ কপি)', price: 100 },
                { name: 'CV তৈরি ও প্রিন্ট', price: 150 },
                { name: 'ডকুমেন্ট লেমিনেশন', price: 40 },
                { name: 'NID লেমিনেটেড কপি', price: 80 },
              ].map(p => `
                <div class="p-2 border rounded flex justify-between items-center text-xs hover:bg-surface cursor-pointer"
                     onclick="App.posAddToCart('${esc(p.name)}', ${p.price})">
                  <div><strong>${esc(p.name)}</strong></div>
                  <div class="text-primary font-bold">${fmtTk(p.price)}</div>
                </div>`).join('')}
            </div>
            <div class="mt-4 pt-4 border-t">
              <label class="form-label text-xs">কাস্টম আইটেম যোগ করুন</label>
              <div class="flex gap-2">
                <input type="text" id="customItemName" class="form-input text-xs" placeholder="আইটেম নাম">
                <input type="number" id="customItemPrice" class="form-input text-xs w-24" placeholder="মূল্য">
                <button class="btn btn-xs btn-primary" onclick="App.posAddCustom()">যোগ</button>
              </div>
            </div>
          </div>

          <!-- Cart & Checkout -->
          <div class="card p-5 col-span-2">
            <h2 class="font-bold text-sm mb-3">চলতি বিল / ক্যাশ মেমো</h2>
            <div class="border rounded p-3 mb-3 bg-surface min-h-[140px]">
              <table class="w-full text-xs" id="posTable">
                <thead><tr class="border-b"><th class="text-left pb-1">আইটেম</th><th class="text-center pb-1">পরিমাণ</th><th class="text-right pb-1">মূল্য</th><th class="w-6"></th></tr></thead>
                <tbody id="posCartBody"><tr><td colspan="4" class="text-center py-4 text-muted">কার্ট খালি</td></tr></tbody>
              </table>
            </div>

            <div class="flex justify-between items-center p-3 bg-surface rounded mb-4">
              <span class="font-bold text-sm">মোট প্রদেয় বিল:</span>
              <span class="font-extrabold text-xl text-primary" id="posTotal">৳০</span>
            </div>

            <div class="flex gap-2">
              <button class="btn btn-outline btn-sm" onclick="App.posClear()">কার্ট খালি করুন</button>
              <button class="btn btn-primary btn-sm flex-1" onclick="App.posPrintReceipt()">রসিদ প্রিন্ট করুন 🖨️</button>
            </div>
          </div>
        </div>

        <!-- 14 Business Tools Catalogue -->
        <h2 class="font-bold text-lg mb-3">ব্যবসা সমাধানের সব ফিচার (${BUSINESS_TOOLS.length}টি)</h2>
        <div class="grid grid-3 gap-3">
          ${BUSINESS_TOOLS.map(b => `
            <div class="card p-4">
              <div class="font-bold text-sm mb-1">💼 ${esc(b.name)}</div>
              <div class="text-xs text-muted mb-2">${esc(b.desc)}</div>
              <span class="badge text-xs">${esc(b.en)}</span>
            </div>`).join('')}
        </div>
      </div>`;
    window._posCart = [];
  },

  posAddToCart(name, price) {
    window._posCart = window._posCart || [];
    const item = window._posCart.find(x => x.name === name);
    if (item) item.qty++;
    else window._posCart.push({ name, price, qty: 1 });
    this.posRenderCart();
  },

  posAddCustom() {
    const n = $('#customItemName').value.trim();
    const p = Number($('#customItemPrice').value);
    if (!n || !p) return toast('আইটেম ও মূল্য দিন', true);
    this.posAddToCart(n, p);
    $('#customItemName').value = ''; $('#customItemPrice').value = '';
  },

  posRenderCart() {
    const body = $('#posCartBody');
    const cart = window._posCart || [];
    if (!cart.length) {
      body.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">কার্ট খালি</td></tr>';
      $('#posTotal').textContent = '৳০';
      return;
    }
    let total = 0;
    body.innerHTML = cart.map((c, i) => {
      const sub = c.price * c.qty; total += sub;
      return `
        <tr class="border-b">
          <td class="py-1">${esc(c.name)}</td>
          <td class="py-1 text-center">${c.qty}</td>
          <td class="py-1 text-right">${fmtTk(sub)}</td>
          <td class="py-1 text-right"><button onclick="App.posRemove(${i})" class="text-red-500">×</button></td>
        </tr>`;
    }).join('');
    $('#posTotal').textContent = fmtTk(total);
  },

  posRemove(i) {
    window._posCart.splice(i, 1);
    this.posRenderCart();
  },

  posClear() {
    window._posCart = [];
    this.posRenderCart();
  },

  posPrintReceipt() {
    const cart = window._posCart || [];
    if (!cart.length) return toast('প্রথমে পণ্য যোগ করুন', true);
    const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const w = window.open('', '_blank');
    w.document.write(`
      <!DOCTYPE html><html><head><title>Cash Memo</title>
      <style>body{font-family:sans-serif;padding:2rem;max-width:380px;margin:auto}h3{margin:0;color:#123B70}.row{display:flex;justify-content:space-between;padding:.3rem 0;font-size:12px;border-bottom:1px dashed #ccc}</style></head><body>
      <div style="text-align:center;margin-bottom:1rem">
        <h3>সেবাকেন্দ্র ক্যাশ মেমো</h3>
        <small>${new Date().toLocaleString()}</small>
      </div>
      ${cart.map(c => `<div class="row"><span>${c.name} x${c.qty}</span><span>${fmtTk(c.price * c.qty)}</span></div>`).join('')}
      <div class="row" style="font-weight:bold;font-size:14px;border-top:2px solid #000;margin-top:.5rem">
        <span>সর্বমোট:</span><span>${fmtTk(total)}</span>
      </div>
      <p style="text-align:center;font-size:11px;margin-top:1.5rem">ধন্যবাদ! আবার আসবেন।</p>
      <script>window.print();<\/script>
      </body></html>`);
    w.document.close();
    Store.ledger('pos_sale', total, 'POS Cash Memo');
    toast('ক্যাশ মেমো প্রিন্ট হয়েছে');
  },

  // ===================== 10. EDUCATION & JOBS =====================
  renderJobs(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div>
            <div class="section-tag">শিক্ষা ও ক্যারিয়ার (§3.9)</div>
            <h1 class="section-title">সরকারি ও বেসরকারি চাকরির বিজ্ঞপ্তি</h1>
            <p class="section-subtitle">যাচাইকৃত চাকরির সার্কুলার, আবেদনের শেষ তারিখ ও অনলাইন আবেদন সহায়তা।</p>
          </div>
        </div>

        <div class="space-y-4">
          ${JOBS.map(j => `
            <div class="card p-6 flex justify-between items-center">
              <div>
                <span class="badge ${j.type === 'Govt' ? 'badge-primary' : 'badge-teal'} mb-2">${j.type === 'Govt' ? 'সরকারি চাকরি' : 'বেসরকারি'}</span>
                <h2 class="font-bold text-lg mb-1">${esc(j.title)}</h2>
                <div class="text-xs text-muted mb-2">প্রতিষ্ঠান: <strong>${esc(j.org)}</strong> • পদসংখ্যা: ${esc(j.posts)}</div>
                <div class="text-xs text-red-600 font-semibold">⏰ আবেদনের শেষ সময়: ${esc(j.deadline)}</div>
              </div>
              <div class="text-right">
                <button class="btn btn-primary btn-sm mb-2" onclick="App.openOrderModal('govt-job')">আবেদন সহায়তা নিন ➜</button>
                <div class="text-xs text-muted">সার্ভিস ফি: ৳১২০</div>
              </div>
            </div>`).join('')}
        </div>
      </div>`;
  },

  renderLearn(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div>
            <div class="section-tag">প্রশিক্ষণ একাডেমি (§3.12)</div>
            <h1 class="section-title">উদ্যোক্তা ও ডিজিটাল স্কিল কোর্স</h1>
            <p class="section-subtitle">কম্পিউটার অফিস অ্যাপ্লিকেশন, ফটো এডিটিং ও সফল উদ্যোক্তা হওয়ার অনলাইন প্রশিক্ষণ।</p>
          </div>
        </div>

        <div class="grid grid-3 gap-4">
          ${COURSES.map(c => `
            <div class="card p-5 flex flex-col justify-between">
              <div>
                <div class="badge badge-teal mb-2">${c.duration} • ${c.lessons} পাঠ</div>
                <h2 class="font-bold text-base mb-1">${esc(c.title)}</h2>
                <p class="text-xs text-muted mb-3">${esc(c.desc)}</p>
              </div>
              <div>
                <div class="flex justify-between items-center mb-3 pt-3 border-t">
                  <span class="font-extrabold text-primary text-lg">${fmtTk(c.fee)}</span>
                  <span class="text-xs text-muted">সার্টিফিকেট সহ</span>
                </div>
                <button class="btn btn-outline btn-sm w-full" onclick="toast('কোর্সে এনরোলমেন্ট প্রক্রিয়া শুরু হয়েছে')">কোর্স শুরু করুন ➜</button>
              </div>
            </div>`).join('')}
        </div>
      </div>`;
  },

  // ===================== 11. CENTERS LOCATOR =====================
  renderCenters(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div>
            <div class="section-tag">সেন্টার ডিরেক্টরি (§3.11)</div>
            <h1 class="section-title">দেশব্যাপী সেবাকেন্দ্র নেটওয়ার্ক</h1>
            <p class="section-subtitle">আপনার নিকটস্থ অনুমোদিত উদ্যোক্তা সেবাকেন্দ্রে গিয়ে সরাসরি সেবা গ্রহণ করুন।</p>
          </div>
        </div>

        <div class="grid grid-2 gap-4">
          ${CENTERS.map(c => `
            <div class="card p-6">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <span class="badge badge-teal mb-1">${c.id}</span>
                  <h2 class="font-bold text-lg">${esc(c.name)}</h2>
                </div>
                <span class="badge badge-primary">অনুমোদিত</span>
              </div>
              <div class="text-xs text-muted space-y-1 mb-4">
                <div>👤 পরিচালক: <strong>${esc(c.owner)}</strong></div>
                <div>📍 অবস্থান: ${esc(c.upazila)}, ${esc(c.district)}</div>
                <div>📞 হটলাইন: <a href="tel:${c.phone}" class="text-primary font-bold">${c.phone}</a></div>
              </div>
              <div class="flex gap-2">
                <a href="https://wa.me/88${c.phone.replace(/[^0-9]/g, '')}" target="_blank" class="btn btn-xs btn-outline">WhatsApp চ্যাট</a>
                <button class="btn btn-xs btn-primary" onclick="toast('সেন্টার লোকেশন লিংক কপি করা হয়েছে')">লোকেশন কপি</button>
              </div>
            </div>`).join('')}
        </div>
      </div>`;
  },

  // ===================== 12. ENTREPRENEUR & PARTNER =====================
  renderPartner(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div>
            <div class="section-tag">উদ্যোক্তা প্রোগ্রাম (§3.11)</div>
            <h1 class="section-title">সেবাকেন্দ্র পার্টনার রেজিস্ট্রেশন</h1>
            <p class="section-subtitle">নিজের কম্পিউটার বা স্মার্টফোন দিয়ে প্রতি মাসে ২০,০০০-৫০,০০০ টাকা আয়ের সুযোগ।</p>
          </div>
        </div>

        <div class="grid grid-2 gap-6 mb-8">
          <div class="card p-6">
            <h2 class="font-bold text-base mb-3">উদ্যোক্তা সুবিধা:</h2>
            <ul class="text-xs space-y-2 mb-6">
              <li>✓ নিজস্ব Center ID এবং QR ভেরিফাইড কার্ড</li>
              <li>✓ প্রতিটি সেবায় ১০%-৩০% পর্যন্ত আকর্ষণীয় কমিশন</li>
              <li>✓ কাস্টমার ও অর্ডার ম্যানেজমেন্ট ড্যাশবোর্ড</li>
              <li>✓ ২৪/৭ ডেডিকেটেড উদ্যোক্তা সাপোর্ট হেল্পলাইন</li>
              <li>✓ ফ্রি প্রশিক্ষণ এবং মার্কেটিং ম্যাটেরিয়াল</li>
            </ul>
            <div class="card p-3 bg-surface text-xs">
              <strong>কমিশন পে-আউট:</strong> যেকোনো সময় বিকাশ বা ব্যাংক একাউন্টে উইথড্র রিকোয়েস্ট করতে পারবেন।
            </div>
          </div>

          <div class="card p-6">
            <h2 class="font-bold text-base mb-3">অনলাইন আবেদন ফর্ম</h2>
            <form onsubmit="App.submitPartner(event)">
              <div class="form-group">
                <label class="form-label">আপনার পূর্ণ নাম *</label>
                <input type="text" name="name" class="form-input" required placeholder="নাম">
              </div>
              <div class="form-group">
                <label class="form-label">মোবাইল নম্বর *</label>
                <input type="tel" name="phone" class="form-input" required placeholder="017XXXXXXXX">
              </div>
              <div class="grid grid-2 gap-3">
                <div class="form-group">
                  <label class="form-label">জেলা *</label>
                  <input type="text" name="district" class="form-input" required placeholder="জেলা">
                </div>
                <div class="form-group">
                  <label class="form-label">উপজেলা *</label>
                  <input type="text" name="upazila" class="form-input" required placeholder="উপজেলা">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">দোকান বা ব্যবসা প্রতিষ্ঠানের নাম (যদি থাকে)</label>
                <input type="text" name="shop" class="form-input" placeholder="যেমন: সেবা টেলিকম">
              </div>
              <button type="submit" class="btn btn-primary w-full">আবেদন জমা দিন ➜</button>
            </form>
          </div>
        </div>
      </div>`;
  },

  submitPartner(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get('name');
    toast(`ধন্যবাদ ${name}! আপনার পার্টনার আবেদন গ্রহণ করা হয়েছে। আমাদের টিম ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে।`);
    e.target.reset();
  },

  // ===================== 13. PRICING =====================
  renderPricing(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-5xl">
        <div class="section-head text-center">
          <div class="section-tag">প্রাইসিং (§10)</div>
          <h1 class="section-title">স্বচ্ছ ও সাশ্রয়ী সাবস্ক্রিপশন প্ল্যান</h1>
          <p class="section-subtitle">ব্যক্তিগত, বাণিজ্যিক কিংবা উদ্যোক্তা — আপনার প্রয়োজন অনুযায়ী সেরা প্যাকেজ বেছে নিন।</p>
        </div>

        <div class="grid grid-3 gap-6 mb-8">
          ${PLANS.map(p => this.planCardHtml(p)).join('')}
        </div>

        <div class="card p-6 bg-surface text-center">
          <h3 class="font-bold text-base mb-2">কাস্টম বা কর্পোরেট সলিউশন প্রয়োজন?</h3>
          <p class="text-xs text-muted mb-3">বড় প্রতিষ্ঠান বা সরকারি প্রকল্পের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন।</p>
          <a href="/contact" class="btn btn-outline btn-sm">যোগাযোগ করুন ➜</a>
        </div>
      </div>`;
  },

  async subscribePlan(planId) {
    const p = PLANS.find(x => x.id === planId);
    if (!p) return;
    if (p.price === 0) {
      if (Store.user) {
        Store.state.user.plan = 'free';
        Store.save();
        toast('আপনি ফ্রি প্ল্যানে আছেন');
      } else {
        this.openRegisterModal();
      }
      return;
    }

    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: p.price, serviceSlug: p.id, serviceName: `Subscription: ${p.name}` }),
      });
      const data = await res.json();
      if (!data.success) return toast(data.error, true);
      this.openBkashModal({
        paymentID: data.paymentID,
        amount: p.price,
        service: { slug: p.id, name: p.name },
        orderData: { plan: p.id },
      });
    } catch { toast('পেমেন্ট শুরু করা যায়নি', true); }
  },

  // ===================== 14. DEVELOPERS & API =====================
  renderDevelopers(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div>
            <div class="section-tag">API প্ল্যাটফর্ম (§3.14)</div>
            <h1 class="section-title">ডেভেলপার ডকস ও ইন্টিগ্রেশন</h1>
            <p class="section-subtitle">REST API দিয়ে আপনার ওয়েবসাইটে SebaKendra-এর ডিজিটাল টুলস ও পেমেন্ট সেবা যুক্ত করুন।</p>
          </div>
        </div>

        <div class="card p-6 mb-6">
          <h2 class="font-bold text-base mb-2">🔑 স্যান্ডবক্স API ক্রেডেনশিয়াল</h2>
          <div class="p-3 bg-surface rounded text-xs space-y-2 mb-4">
            <div>Base URL: <code>https://sebakendra.com/api/v1</code></div>
            <div>Auth Header: <code>Authorization: Bearer sbk_test_demo_key_99</code></div>
          </div>
          <button class="btn btn-outline btn-xs" onclick="toast('API Key কপি করা হয়েছে')">API Key কপি করুন</button>
        </div>

        <div class="card p-6 space-y-6">
          <div>
            <h3 class="font-bold text-sm mb-1 text-primary">POST /api/payments/create</h3>
            <p class="text-xs text-muted mb-2">নতুন bKash পেমেন্ট ইনভয়েস তৈরি করার এন্ডপয়েন্ট।</p>
            <pre class="bg-surface p-3 rounded text-xs overflow-x-auto">
POST /api/payments/create
Content-Type: application/json
{
  "amount": 250,
  "serviceSlug": "citizenship-cert",
  "serviceName": "নাগরিকত্ব সনদ আবেদন সহায়তা"
}</pre>
          </div>

          <div>
            <h3 class="font-bold text-sm mb-1 text-primary">POST /api/payments/execute</h3>
            <p class="text-xs text-muted mb-2">সার্ভার-সাইড ভেরিফিকেশন ও ট্রানজেকশন কমপ্লিট।</p>
            <pre class="bg-surface p-3 rounded text-xs overflow-x-auto">
POST /api/payments/execute
Content-Type: application/json
{ "paymentID": "SBK1732000000ABCD" }</pre>
          </div>

          <div>
            <h3 class="font-bold text-sm mb-1 text-primary">GET /api/verify?ref=ORDER_OR_TRX</h3>
            <p class="text-xs text-muted mb-2">পাবলিক ভেরিফিকেশন কুয়েরি এন্ডপয়েন্ট।</p>
          </div>
        </div>
      </div>`;
  },

  // ===================== 15. PUBLIC VERIFICATION =====================
  renderVerify(el) {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref') || '';

    el.innerHTML = `
      <div class="container py-8 max-w-2xl">
        <div class="section-head text-center">
          <div class="section-tag">ভেরিফিকেশন (§3.17)</div>
          <h1 class="section-title">পাবলিক ভেরিফিকেশন সিস্টেম</h1>
          <p class="section-subtitle">SebaKendra ইস্যুকৃত অর্ডার, পেমেন্ট রসিদ বা প্রশিক্ষণ সনদ অনলাইনে যাচাই করুন।</p>
        </div>

        <div class="card p-6 mb-6">
          <div class="form-group">
            <label class="form-label">অর্ডার নম্বর / ট্রানজেকশন আইডি (TrxID) / পেমেন্ট আইডি *</label>
            <div class="flex gap-2">
              <input type="text" id="verifyRefInput" class="form-input" value="${esc(ref)}" placeholder="যেমন: SK-2026-XXXXXX বা TRX...">
              <button class="btn btn-primary" onclick="App.runVerify()">যাচাই করুন 🔍</button>
            </div>
          </div>
        </div>

        <div id="verifyResult" class="hidden"></div>
      </div>`;

    if (ref) setTimeout(() => this.runVerify(), 100);
  },

  async runVerify() {
    const ref = $('#verifyRefInput').value.trim();
    if (!ref) return toast('রেফারেন্স নম্বর দিন', true);

    const resEl = $('#verifyResult');
    resEl.classList.remove('hidden');
    resEl.innerHTML = '<div class="card p-6 text-center text-muted">অনুসন্ধান চলছে...</div>';

    // 1. Check local store first
    const localOrder = Store.state.orders.find(x => x.id === ref || x.paymentID === ref || x.trxID === ref);
    if (localOrder) {
      resEl.innerHTML = `
        <div class="card p-6 border-teal">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl">✅</span>
            <div>
              <h2 class="font-bold text-base text-teal">বৈধ সেবা অর্ডার — SebaKendra ভেরিফাইড</h2>
              <div class="text-xs text-muted">এই রেকর্ডটি SebaKendra সেন্ট্রাল লেজারে নিবন্ধিত</div>
            </div>
          </div>
          <div class="text-xs space-y-2 bg-surface p-4 rounded">
            <div class="flex justify-between"><span>অর্ডার আইডি:</span><strong>${localOrder.id}</strong></div>
            <div class="flex justify-between"><span>সেবার নাম:</span><span>${esc(localOrder.serviceName)}</span></div>
            <div class="flex justify-between"><span>পরিশোধিত ফি:</span><strong class="text-primary">${fmtTk(localOrder.fee)}</strong></div>
            <div class="flex justify-between"><span>তারিখ:</span><span>${fmtDate(localOrder.date)}</span></div>
            <div class="flex justify-between"><span>স্ট্যাটাস:</span><span class="badge badge-primary">${esc(localOrder.status)}</span></div>
            <div class="flex justify-between"><span>bKash TrxID:</span><code>${localOrder.trxID || '—'}</code></div>
          </div>
        </div>`;
      return;
    }

    // 2. Query server
    try {
      const res = await fetch(`/api/verify?ref=${encodeURIComponent(ref)}`);
      const data = await res.json();
      if (data.found) {
        resEl.innerHTML = `
          <div class="card p-6 border-teal">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">✅</span>
              <div>
                <h2 class="font-bold text-base text-teal">বৈধ ট্রানজেকশন — SebaKendra লেজার</h2>
                <div class="text-xs text-muted">সার্ভার-সাইড ভেরিফাইড রেকর্ড</div>
              </div>
            </div>
            <div class="text-xs space-y-2 bg-surface p-4 rounded">
              <div class="flex justify-between"><span>পেমেন্ট আইডি:</span><code>${data.record.paymentID}</code></div>
              <div class="flex justify-between"><span>সেবা:</span><span>${esc(data.record.serviceName)}</span></div>
              <div class="flex justify-between"><span>টাকা:</span><strong class="text-primary">${fmtTk(data.record.amount)}</strong></div>
              <div class="flex justify-between"><span>TrxID:</span><code>${data.record.trxID || '—'}</code></div>
              <div class="flex justify-between"><span>স্ট্যাটাস:</span><span class="badge badge-primary">${data.record.status}</span></div>
            </div>
          </div>`;
      } else {
        resEl.innerHTML = `
          <div class="card p-6 border-red-400 text-center">
            <div class="text-3xl mb-2">⚠️</div>
            <h2 class="font-bold text-base text-red-600 mb-1">কোনো রেকর্ড পাওয়া যায়নি</h2>
            <p class="text-xs text-muted">
              রেফারেন্স নম্বরটি সঠিক কিনা যাচাই করুন। SebaKendra শুধুমাত্র নিজস্ব প্ল্যাটফর্মে ইস্যুকৃত রসিদ ও অর্ডারের তথ্য যাচাই করে।
              কোনো সরকারি সনদের তথ্যের জন্য সংশ্লিষ্ট সরকারি পোর্টালে অনুসন্ধান করুন।
            </p>
          </div>`;
      }
    } catch {
      resEl.innerHTML = '<div class="card p-6 text-center text-red-600">ভেরিফিকেশন সার্ভার ত্রুটি</div>';
    }
  },

  // ===================== 16. CITIZEN DASHBOARD =====================
  renderDashboard(el) {
    const u = Store.user;
    if (!u) {
      el.innerHTML = `
        <div class="container py-12 text-center max-w-md">
          <div class="text-4xl mb-3">🔒</div>
          <h2 class="font-bold text-xl mb-2">লগইন প্রয়োজন</h2>
          <p class="text-xs text-muted mb-4">আপনার ড্যাশবোর্ড, চলতি অর্ডার ও ট্রানজেকশন দেখতে অনুগ্রহ করে লগইন করুন।</p>
          <button class="btn btn-primary" onclick="App.openLoginModal()">লগইন করুন</button>
        </div>`;
      return;
    }

    const orders = Store.state.orders;
    const wallet = Store.state.wallet;
    const balance = Store.walletBalance();

    el.innerHTML = `
      <div class="container py-8 max-w-5xl">
        <!-- User summary -->
        <div class="card p-6 mb-6 flex justify-between items-center bg-surface">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-primary text-white font-bold text-xl flex items-center justify-center">
              ${u.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 class="text-xl font-bold mb-1">${esc(u.name)}</h1>
              <div class="text-xs text-muted">📞 ${esc(u.phone)} • রোল: <span class="badge">${esc(u.role)}</span> • প্যাকেজ: <span class="badge badge-teal">${esc(u.plan)}</span></div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs text-muted">AI ক্রেডিট</div>
            <div class="text-xl font-extrabold text-teal">${Store.state.credits} ক্</div>
          </div>
        </div>

        <!-- Metric cards -->
        <div class="grid grid-4 gap-4 mb-8">
          <div class="card p-4">
            <div class="text-xs text-muted">মোট অর্ডার</div>
            <div class="text-2xl font-extrabold text-primary">${orders.length}</div>
          </div>
          <div class="card p-4">
            <div class="text-xs text-muted">প্রসেসিং অর্ডার</div>
            <div class="text-2xl font-extrabold text-amber-600">${orders.filter(o => o.status === 'processing').length}</div>
          </div>
          <div class="card p-4">
            <div class="text-xs text-muted">সম্পন্ন অর্ডার</div>
            <div class="text-2xl font-extrabold text-teal">${orders.filter(o => o.status === 'completed').length}</div>
          </div>
          <div class="card p-4">
            <div class="text-xs text-muted">মোট খরচ (লেজার)</div>
            <div class="text-2xl font-extrabold">${fmtTk(Math.abs(balance))}</div>
          </div>
        </div>

        <!-- Orders Table -->
        <div class="card p-6 mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-bold text-base">চলতি ও পূর্ববর্তী অর্ডারসমূহ (${orders.length})</h2>
            <button class="btn btn-xs btn-primary" onclick="App.navigate('/services')">+ নতুন সেবা নিন</button>
          </div>

          ${!orders.length ? `
            <div class="text-center py-8 text-muted text-xs">
              এখনও কোনো অর্ডার করেননি। <a href="/services" class="text-primary font-bold">সেবা ক্যাটালগ দেখুন ➜</a>
            </div>` : `
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead>
                  <tr class="border-b text-left">
                    <th class="pb-2">অর্ডার আইডি</th>
                    <th class="pb-2">সেবার নাম</th>
                    <th class="pb-2">ফি</th>
                    <th class="pb-2">তারিখ</th>
                    <th class="pb-2">স্ট্যাটাস</th>
                    <th class="pb-2 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  ${orders.map(o => `
                    <tr class="border-b">
                      <td class="py-3 font-semibold"><code>${o.id}</code></td>
                      <td class="py-3">${esc(o.serviceName)}</td>
                      <td class="py-3 font-bold text-primary">${fmtTk(o.fee)}</td>
                      <td class="py-3">${fmtDate(o.date)}</td>
                      <td class="py-3"><span class="badge ${o.status === 'completed' ? 'badge-primary' : 'badge-teal'}">${esc(o.status)}</span></td>
                      <td class="py-3 text-right">
                        <button class="btn btn-xs btn-outline" onclick="App.printReceipt('${o.id}')">রসিদ 🖨️</button>
                      </td>
                    </tr>`).join('')}
                </tbody>
              </table>
            </div>`}
        </div>

        <!-- Financial Ledger (Immutable append-only) -->
        <div class="card p-6">
          <h2 class="font-bold text-base mb-1">ফাইন্যান্সিয়াল লেজার (§9)</h2>
          <p class="text-xs text-muted mb-4">সব আর্থিক লেনদেনের অপরিবর্তনীয় হিস্ট্রি</p>

          ${!wallet.length ? `
            <div class="text-center py-4 text-muted text-xs">কোনো লেনদেন রেকর্ড নেই</div>` : `
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead>
                  <tr class="border-b text-left">
                    <th class="pb-2">ট্রানজেকশন ID</th>
                    <th class="pb-2">টাইপ</th>
                    <th class="pb-2">রেফারেন্স</th>
                    <th class="pb-2">তারিখ</th>
                    <th class="pb-2 text-right">পরিমাণ</th>
                  </tr>
                </thead>
                <tbody>
                  ${wallet.map(t => `
                    <tr class="border-b">
                      <td class="py-2"><code>${t.id}</code></td>
                      <td class="py-2">${esc(t.type)}</td>
                      <td class="py-2">${esc(t.ref)}</td>
                      <td class="py-2">${fmtDate(t.date)}</td>
                      <td class="py-2 text-right font-bold ${t.amount < 0 ? 'text-red-600' : 'text-teal'}">${t.amount < 0 ? '-' : '+'}${fmtTk(Math.abs(t.amount))}</td>
                    </tr>`).join('')}
                </tbody>
              </table>
            </div>`}
        </div>
      </div>`;
  },

  // ===================== 17. ADMIN PORTAL =====================
  renderAdmin(el) {
    const orders = Store.state.orders;
    const wallet = Store.state.wallet;
    const totalRev = orders.reduce((s, o) => s + Number(o.fee), 0);

    el.innerHTML = `
      <div class="container py-8 max-w-5xl">
        <div class="section-head">
          <div>
            <div class="section-tag">সুপার অ্যাডমিন (§3.16)</div>
            <h1 class="section-title">অ্যাডমিন কন্ট্রোল সেন্টার</h1>
            <p class="section-subtitle">সম্পূর্ণ প্ল্যাটফর্ম মনিটরিং, অর্ডার স্ট্যাটাস আপডেট, অডিট লগ ও ফিচার ফ্ল্যাগ।</p>
          </div>
          <div class="badge badge-primary">Super Admin Active</div>
        </div>

        <!-- Stats row -->
        <div class="grid grid-4 gap-4 mb-6">
          <div class="card p-4">
            <div class="text-xs text-muted">মোট সেলস রেভিনিউ</div>
            <div class="text-2xl font-extrabold text-primary">${fmtTk(totalRev)}</div>
          </div>
          <div class="card p-4">
            <div class="text-xs text-muted">মোট অর্ডার</div>
            <div class="text-2xl font-extrabold">${orders.length}</div>
          </div>
          <div class="card p-4">
            <div class="text-xs text-muted">সেন্টার পার্টনার</div>
            <div class="text-2xl font-extrabold text-teal">${CENTERS.length}</div>
          </div>
          <div class="card p-4">
            <div class="text-xs text-muted">সেবা ক্যাটালগ</div>
            <div class="text-2xl font-extrabold">${SERVICES.length}</div>
          </div>
        </div>

        <!-- Order Management -->
        <div class="card p-6 mb-6">
          <h2 class="font-bold text-base mb-3">অর্ডার ব্যবস্থাপনা (${orders.length})</h2>
          ${!orders.length ? '<p class="text-xs text-muted">কোনো অর্ডার জমা পড়েনি</p>' : `
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead><tr class="border-b text-left"><th class="pb-2">অর্ডার ID</th><th class="pb-2">গ্রাহক</th><th class="pb-2">সেবা</th><th class="pb-2">ফি</th><th class="pb-2">বর্তমান স্ট্যাটাস</th><th class="pb-2 text-right">স্ট্যাটাস পরিবর্তন</th></tr></thead>
                <tbody>
                  ${orders.map(o => `
                    <tr class="border-b">
                      <td class="py-2"><code>${o.id}</code></td>
                      <td class="py-2">${esc(o.customerName)} (${esc(o.customerPhone)})</td>
                      <td class="py-2">${esc(o.serviceName)}</td>
                      <td class="py-2 font-bold">${fmtTk(o.fee)}</td>
                      <td class="py-2"><span class="badge ${o.status === 'completed' ? 'badge-primary' : 'badge-teal'}">${o.status}</span></td>
                      <td class="py-2 text-right space-x-1">
                        <button class="btn btn-xs btn-outline" onclick="App.adminSetStatus('${o.id}', 'processing')">Processing</button>
                        <button class="btn btn-xs btn-primary" onclick="App.adminSetStatus('${o.id}', 'completed')">Completed</button>
                      </td>
                    </tr>`).join('')}
                </tbody>
              </table>
            </div>`}
        </div>

        <!-- Audit Log -->
        <div class="card p-6">
          <h2 class="font-bold text-base mb-3">নিরাপত্তা ও অডিট লগ (§11)</h2>
          <div class="text-xs space-y-2">
            <div class="p-2 bg-surface rounded flex justify-between"><span>[SYSTEM] bKash Sandbox Gateway Online</span><span>${new Date().toLocaleTimeString()}</span></div>
            <div class="p-2 bg-surface rounded flex justify-between"><span>[SECURITY] Financial Ledger Integrity OK</span><span>${new Date().toLocaleTimeString()}</span></div>
            <div class="p-2 bg-surface rounded flex justify-between"><span>[AUDIT] SuperAdmin Session Active</span><span>${new Date().toLocaleTimeString()}</span></div>
          </div>
        </div>
      </div>`;
  },

  adminSetStatus(orderId, status) {
    Store.updateOrder(orderId, { status });
    Store.audit(`Order ${orderId} marked as ${status}`);
    toast(`অর্ডার ${orderId} স্ট্যাটাস: ${status}`);
    this.handleRoute();
  },

  // ===================== 18. AUTH MODALS =====================
  openLoginModal() {
    openModal(`
      <div class="p-6 max-w-sm mx-auto">
        <h2 class="text-xl font-bold mb-1 text-center">🔐 সেবাকেন্দ্রে লগইন</h2>
        <p class="text-xs text-muted mb-4 text-center">মোবাইল নম্বর ও ওটিপি দিয়ে তাৎক্ষণিক প্রবেশ করুন</p>

        <form onsubmit="App.handleLogin(event)">
          <div class="form-group">
            <label class="form-label">মোবাইল নম্বর *</label>
            <input type="tel" name="phone" class="form-input" required placeholder="017XXXXXXXX">
          </div>
          <div class="form-group">
            <label class="form-label">ওটিপি কোড (OTP)</label>
            <input type="text" name="otp" class="form-input" value="1234" placeholder="৪ সংখ্যার OTP (ডেমো: 1234)">
          </div>
          <button type="submit" class="btn btn-primary w-full">লগইন করুন ➜</button>
          <div class="text-center mt-3 text-xs">
            অ্যাকাউন্ট নেই? <a href="#" class="text-primary font-bold" onclick="event.preventDefault();closeModal();App.openRegisterModal()">নতুন অ্যাকাউন্ট খুলুন</a>
          </div>
        </form>
      </div>`);
  },

  openRegisterModal() {
    openModal(`
      <div class="p-6 max-w-sm mx-auto">
        <h2 class="text-xl font-bold mb-1 text-center">📝 নতুন অ্যাকাউন্ট খুলুন</h2>
        <p class="text-xs text-muted mb-4 text-center">বিনামূল্যে অ্যাকাউন্ট খুলে সব ডিজিটাল টুলস ব্যবহার করুন</p>

        <form onsubmit="App.handleRegister(event)">
          <div class="form-group">
            <label class="form-label">আপনার পূর্ণ নাম *</label>
            <input type="text" name="name" class="form-input" required placeholder="নাম">
          </div>
          <div class="form-group">
            <label class="form-label">মোবাইল নম্বর *</label>
            <input type="tel" name="phone" class="form-input" required placeholder="017XXXXXXXX">
          </div>
          <div class="form-group">
            <label class="form-label">ইমেইল (ঐচ্ছিক)</label>
            <input type="email" name="email" class="form-input" placeholder="email@example.com">
          </div>
          <button type="submit" class="btn btn-primary w-full">রেজিস্টার সম্পন্ন করুন ➜</button>
          <div class="text-center mt-3 text-xs">
            আগে থেকেই অ্যাকাউন্ট আছে? <a href="#" class="text-primary font-bold" onclick="event.preventDefault();closeModal();App.openLoginModal()">লগইন করুন</a>
          </div>
        </form>
      </div>`);
  },

  handleLogin(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const phone = data.get('phone');
    Store.login('নাগরিক ইউজার', phone, '');
    closeModal();
    this.updateUserBadge();
    toast('স্বাগতম! সফলভাবে লগইন হয়েছে');
    this.navigate('/dashboard');
  },

  handleRegister(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get('name'), phone = data.get('phone'), email = data.get('email');
    Store.login(name, phone, email);
    closeModal();
    this.updateUserBadge();
    toast(`স্বাগতম, ${name}! আপনার অ্যাকাউন্ট তৈরি হয়েছে`);
    this.navigate('/dashboard');
  },

  renderAuth(el, isRegister) {
    el.innerHTML = '<div class="container py-12 text-center">লোডিং...</div>';
    setTimeout(() => isRegister ? this.openRegisterModal() : this.openLoginModal(), 50);
  },

  // ===================== 19. STATIC PAGES =====================
  renderHelp(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-3xl">
        <div class="section-head text-center">
          <div class="section-tag">কাস্টমার কেয়ার (§3.13)</div>
          <h1 class="section-title">সাহায্য ও সাপোর্ট সেন্টার</h1>
          <p class="section-subtitle">যেকোনো সমস্যায় আমাদের সাথে যোগাযোগ করুন — আমরা সপ্তাহে ৭ দিন পাশে আছি।</p>
        </div>

        <div class="grid grid-3 gap-4 mb-8">
          <div class="card p-5 text-center">
            <div class="text-3xl mb-2">📞</div>
            <h2 class="font-bold text-sm mb-1">হটলাইন কল</h2>
            <div class="text-xs text-muted mb-2">সকাল ৯টা - রাত ১০টা</div>
            <a href="tel:01700000000" class="btn btn-xs btn-primary">01700-000000</a>
          </div>
          <div class="card p-5 text-center">
            <div class="text-3xl mb-2">💬</div>
            <h2 class="font-bold text-sm mb-1">WhatsApp সাপোর্ট</h2>
            <div class="text-xs text-muted mb-2">তাৎক্ষণিক চ্যাট</div>
            <a href="https://wa.me/8801700000000" target="_blank" class="btn btn-xs btn-teal">WhatsApp খুলুন</a>
          </div>
          <div class="card p-5 text-center">
            <div class="text-3xl mb-2">✉️</div>
            <h2 class="font-bold text-sm mb-1">ইমেইল হেল্পডেস্ক</h2>
            <div class="text-xs text-muted mb-2">২৪ ঘণ্টার মধ্যে উত্তর</div>
            <a href="mailto:support@sebakendra.com" class="btn btn-xs btn-outline">support@sebakendra.com</a>
          </div>
        </div>

        <!-- Ticket creation -->
        <div class="card p-6 mb-8">
          <h2 class="font-bold text-base mb-3">নতুন সাপোর্ট টিকিট খুলুন</h2>
          <form onsubmit="App.submitTicket(event)">
            <div class="form-group">
              <label class="form-label">বিষয় *</label>
              <input type="text" name="subject" class="form-input" required placeholder="সমস্যার বিষয়">
            </div>
            <div class="form-group">
              <label class="form-label">বিস্তারিত বিবরণ *</label>
              <textarea name="msg" class="form-textarea" rows="4" required placeholder="আপনার সমস্যার বিস্তারিত লিখুন..."></textarea>
            </div>
            <button type="submit" class="btn btn-primary">টিকেট জমা দিন ➜</button>
          </form>
        </div>
      </div>`;
  },

  submitTicket(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const t = Store.addTicket(data.get('subject'), data.get('msg'));
    toast(`সাপোর্ট টিকিট তৈরি হয়েছে: ${t.id}`);
    e.target.reset();
  },

  renderBlog(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div>
            <div class="section-tag">ব্লগ ও গাইডলাইন (§15)</div>
            <h1 class="section-title">ডিজিটাল সেবা ব্লগ ও আপডেট</h1>
            <p class="section-subtitle">বিভিন্ন নাগরিক সেবার আবেদন নিয়ম ও প্রয়োজনীয় কাগজপত্রের সম্পূর্ণ গাইড।</p>
          </div>
        </div>

        <div class="grid grid-2 gap-6">
          ${POSTS.map(p => `
            <div class="card p-6">
              <div class="badge badge-teal mb-2">${p.date} • ${p.read}</div>
              <h2 class="font-bold text-lg mb-2">${esc(p.title)}</h2>
              <p class="text-xs text-muted mb-4">${esc(p.excerpt)}</p>
              <button class="btn btn-outline btn-xs" onclick="toast('পুরো আর্টিকেল শীঘ্রই আসছে')">পুরোটা পড়ুন ➜</button>
            </div>`).join('')}
        </div>
      </div>`;
  },

  renderAbout(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-3xl">
        <div class="section-head">
          <div class="section-tag">আমাদের সম্পর্কে</div>
          <h1 class="section-title">SebaKendra পরিচিতি</h1>
        </div>
        <div class="card p-6 text-sm text-muted space-y-4 leading-relaxed">
          <p>
            <strong>SebaKendra</strong> হলো বাংলাদেশের সর্ববৃহৎ ডিজিটাল সার্ভিস ও বিজনেস ইকোসিস্টেম। আমাদের লক্ষ্য নাগরিক সেবা সহজতর করা, ডিজিটাল টুলস সাধারণ মানুষের হাতের নাগালে নিয়ে আসা এবং তৃণমূল পর্যায়ের উদ্যোক্তাদের শক্তিশালী করা।
          </p>
          <p>
            আমরা একটি অনুমোদিত সেবা প্রসেসিং ও টেকনোলজি প্ল্যাটফর্ম। নাগরিকত্ব সনদ, জন্ম নিবন্ধন গাইড, NID সহায়তা, পাসপোর্ট ছবি মেকার, PDF কনভার্টার এবং ব্যবসায়িক SaaS সলিউশন এক ছাদের নিচে প্রদান করি।
          </p>
          <h3 class="font-bold text-base text-primary">আমাদের মূল নীতিমালা:</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li>শতভাগ স্বচ্ছতা ও নিরাপদ লেনদেন (অফিসিয়াল bKash গেটওয়ে)।</li>
            <li>ডাটা সুরক্ষা ও ব্যবহারকারীর গোপনীয়তা রক্ষা।</li>
            <li>সরকারি নীতিমালার প্রতি শ্রদ্ধা — কোনো ভুয়া বা অননুমোদিত কাজ পরিহার।</li>
          </ul>
        </div>
      </div>`;
  },

  renderContact(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-2xl">
        <div class="section-head text-center">
          <div class="section-tag">যোগাযোগ</div>
          <h1 class="section-title">আমাদের সাথে যোগাযোগ করুন</h1>
        </div>
        <div class="card p-6">
          <form onsubmit="event.preventDefault();toast('বার্তা পাঠানো হয়েছে! ধন্যবাদ।');this.reset()">
            <div class="form-group"><label class="form-label">নাম *</label><input type="text" class="form-input" required></div>
            <div class="form-group"><label class="form-label">মোবাইল *</label><input type="tel" class="form-input" required></div>
            <div class="form-group"><label class="form-label">বার্তা *</label><textarea class="form-textarea" rows="4" required></textarea></div>
            <button type="submit" class="btn btn-primary w-full">বার্তা পাঠান</button>
          </form>
        </div>
      </div>`;
  },

  renderPrivacy(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-3xl">
        <h1 class="text-2xl font-bold mb-4">গোপনীয়তা নীতিমালা (Privacy Policy)</h1>
        <div class="card p-6 text-xs text-muted space-y-3 leading-relaxed">
          <p>SebaKendra ব্যবহারকারীর তথ্যের গোপনীয়তা রক্ষা করতে প্রতিশ্রুতিবদ্ধ।</p>
          <p>১. <strong>তথ্য সংগ্রহ:</strong> শুধুমাত্র সেবা প্রদানের উদ্দেশ্যে নাম, মোবাইল নম্বর ও প্রয়োজনীয় ডকুমেন্টের কপি সংগ্রহ করা হয়।</p>
          <p>২. <strong>আর্থিক নিরাপত্তা:</strong> পেমেন্টের জন্য আমরা সরাসরি bKash API ব্যবহার করি। কোনো পিন (PIN) বা OTP সংরক্ষণ করা হয় না।</p>
          <p>৩. <strong>ডাটা শেয়ারিং:</strong> ব্যবহারকারীর স্পষ্ট সম্মতি ব্যতীত কোনো ব্যক্তিগত তথ্য তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করা হয় না।</p>
        </div>
      </div>`;
  },

  renderTerms(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-3xl">
        <h1 class="text-2xl font-bold mb-4">ব্যবহারের শর্তাবলি (Terms of Service)</h1>
        <div class="card p-6 text-xs text-muted space-y-3 leading-relaxed">
          <p>১. SebaKendra একটি অনুমোদিত সহায়তা ও প্রসেসিং প্ল্যাটফর্ম। এটি কোনো সরকারি কর্তৃপক্ষ নয়।</p>
          <p>২. সব সরকারি সনদ ও অনুমোদন সংশ্লিষ্ট সরকারি কর্তৃপক্ষের আওতাধীন।</p>
          <p>৩. প্ল্যাটফর্মের ডিজিটাল টুলস ও AI সেবাসমূহ নির্দেশিত নিয়মে ব্যবহার করতে হবে। কোনো অসদুপায় অবলম্বন করলে অ্যাকাউন্ট স্থগিত করা হতে পারে।</p>
        </div>
      </div>`;
  },
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
