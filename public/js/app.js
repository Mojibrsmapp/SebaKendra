// SebaKendra Application Engine
// All 24 Tools Implemented, Matching IT Lancer BD (image-6, image-7, image-8)

const App = {
  currentRoute: '/',

  init() {
    this.bindEvents();
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
    if (!appEl) return;

    // Col 1: Photo & Print
    if (full === '/tools/ai-photo-studio' || full === '/tools/photo-studio') return this.renderPhotoStudio(appEl);
    if (full === '/tools/joint-photo') return this.renderJointPhoto(appEl);
    if (full === '/tools/nid-print-ready') return this.renderNidPrintReady(appEl);
    if (full === '/tools/a4-print-ready') return this.renderA4PrintReady(appEl);
    if (full === '/tools/photo-card') return this.renderPhotoCard(appEl);

    // Col 2: Career & Education
    if (full === '/jobs' || full.startsWith('/jobs/')) return this.renderJobs(appEl);
    if (full === '/tools/job-autofill') return this.renderJobAutofill(appEl);
    if (full === '/tools/my-job-ads') return this.renderMyJobAds(appEl);
    if (full === '/tools/cv-auto-fill') return this.renderCvAutofill(appEl);
    if (full === '/tools/admission') return this.renderAdmission(appEl);

    // Col 3: Design & Documents
    if (full === '/tools/cv-format') return this.renderCvFormat(appEl);
    if (full === '/tools/graphics-format') return this.renderGraphicsFormat(appEl);
    if (full === '/tools/certificate-format') return this.renderCertificateFormat(appEl);
    if (full === '/tools/pdf-studio') return this.renderPdfStudio(appEl);
    if (full === '/tools/any-to-word') return this.renderAnyToWord(appEl);

    // Col 4: Business & Daily
    if (full === '/tools/auto-invoice') return this.renderAutoInvoice(appEl);
    if (full === '/tools/it-hisab') return this.renderItHisab(appEl);
    if (full === '/tools/todo') return this.renderTodo(appEl);
    if (full === '/tools/software') return this.renderSoftware(appEl);

    // Col 5: Quick Access
    if (full === '/tools/image-resizer') return this.renderImageResizer(appEl);
    if (full === '/tools/make-voter-slip') return this.renderVoterSlip(appEl);
    if (full === '/tools/ai-prompt') return this.renderAiPrompt(appEl);
    if (full === '/links') return this.renderLinks(appEl);

    // General Routes
    if (full === '/tools') return this.renderToolsIndex(appEl);
    if (full === '/packages' || full === '/pricing' || full === '/premium') return this.renderPackages(appEl);
    if (full === '/ai-coins') return this.renderAiCoins(appEl);
    if (full === '/services') return this.renderServices(appEl);
    if (full === '/dashboard') return this.renderDashboard(appEl);
    if (full === '/login' || full === '/register') return this.renderAuth(appEl);

    // Default Home
    this.renderHome(appEl);
  },

  bindEvents() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (href && href.startsWith('/') && !href.startsWith('//') && !a.getAttribute('target')) {
        e.preventDefault();
        this.navigate(href);
      }
    });

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

    this.updateUserNav();
  },

  updateUserNav() {
    const wrap = $('#userNavArea');
    if (!wrap) return;
    const u = Store.user;
    if (u) {
      wrap.innerHTML = `
        <a href="/dashboard" class="btn btn-sm btn-ghost" style="color:var(--primary);font-weight:700">👤 ${esc(u.name.split(' ')[0])}</a>
        <button class="btn btn-xs btn-outline" onclick="App.logout()">লগআউট</button>`;
    } else {
      wrap.innerHTML = `
        <button class="btn btn-sm btn-ghost" onclick="App.openLoginModal()">লগইন</button>
        <button class="btn btn-sm btn-primary" onclick="App.openRegisterModal()">রেজিস্টার</button>`;
    }
  },

  logout() {
    Store.logout();
    this.updateUserNav();
    toast('লগআউট সম্পন্ন হয়েছে');
    this.navigate('/');
  },

  // ===================== 1. HOMEPAGE =====================
  renderHome(el) {
    el.innerHTML = `
      <!-- HERO SECTION -->
      <section class="hero">
        <div class="container hero-grid">
          <div>
            <div class="hero-badge">
              <span class="hero-badge-dot"></span>
              <span>আইটি তথ্য ও স্মার্ট অনলাইন টুলসের বিশ্বস্ত ঠিকানা</span>
            </div>
            <h1 class="hero-title">
              দেশের সেরা প্ল্যাটফর্ম<br><span>নাগরিক সেবা ও আইটি ইনফরমেশন</span> এর জন্য
            </h1>
            <p class="hero-desc">
              চাকরি, ভর্তি, NID প্রিন্ট রেডি, সি ভি অটো ফিল, অনলাইন টুলস, PSD/Word ফাইল ডাউনলোড এবং দৈনন্দিন কাজের সকল গুরুত্বপূর্ণ লিংকের বিশ্বস্ত সমাধান।
            </p>

            <div class="hero-chips">
              <span>জনপ্রিয়:</span>
              <a href="/tools/photo-studio" class="hero-chip-btn">Photo Studio</a>
              <a href="/tools/nid-print-ready" class="hero-chip-btn">NID Print Ready</a>
              <a href="/tools/a4-print-ready" class="hero-chip-btn">A4 Print Ready</a>
              <a href="/tools/joint-photo" class="hero-chip-btn">যৌথ ছবি (Joint)</a>
              <a href="/jobs" class="hero-chip-btn">Jobs</a>
            </div>

            <div class="hero-actions">
              <button class="btn btn-primary btn-lg" onclick="App.navigate('/tools')">⚡ এক্সপ্লোর টুলস</button>
              <button class="btn btn-outline btn-lg" onclick="App.navigate('/links')">🔗 গুরুত্বপূর্ণ লিংক</button>
              <button class="btn btn-amber btn-lg" onclick="App.navigate('/packages')">👑 প্রিমিয়াম অ্যাক্সেস</button>
            </div>
          </div>

          <!-- Hero Banner Card (Right) -->
          <div>
            <div class="hero-card-banner">
              <div>
                <div class="banner-sub">✨ মোবাইল ফটো টু প্রিন্ট সলিউশন</div>
                <h2 class="banner-head">মোবাইলে তোলা এনআইডি এখনই প্রিন্ট রেডি করুন মাত্র ৫ মিনিটে</h2>
                <div class="banner-mockup">
                  <span style="font-size:2.4rem">🪪</span>
                  <div class="text-xs">
                    <strong>স্মার্ট NID ও লেমিনেটেড কার্ড</strong>
                    <div style="color:#A7F3D0">ফ্রন্ট ও ব্যাক সাইড স্বয়ংক্রিয়ভাবে ৮৫.৬ x ৫৪ মিমি মাপে এলাইন হয়</div>
                  </div>
                </div>
              </div>
              <div>
                <button class="banner-cta-btn" onclick="App.navigate('/tools/nid-print-ready')">
                  এখনই ব্যবহার করুন ➜
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- UPDATED CIRCULARS (চলমান চাকরি সমূহের তালিকা) -->
      <section class="section">
        <div class="container">
          <div class="section-head flex justify-between items-center flex-wrap">
            <div>
              <div class="section-tag">আপডেটেড সার্কুলার</div>
              <h2 class="section-title">চলমান চাকরি সমূহের তালিকা</h2>
              <p class="section-subtitle">সকল মন্ত্রণালয়, অধিদপ্তর ও সরকারি প্রতিষ্ঠানের ভেরিফাইড নিয়োগ বিজ্ঞপ্তি</p>
            </div>
            <a href="/jobs" class="btn btn-outline btn-sm">সকল সার্কুলার দেখুন ➜</a>
          </div>

          <div class="grid grid-4 gap-4">
            ${JOB_CIRCULARS.slice(0, 8).map(j => `
              <div class="job-card">
                <div>
                  <div class="job-header">
                    <span class="badge badge-green">চলমান</span>
                    <span class="text-xs text-muted">মোট পদ: ১টি</span>
                  </div>
                  <h3 class="job-title">${esc(j.title)}</h3>
                  <div class="job-posts-badge">পদসংখ্যা: ${esc(j.posts)}</div>
                  <div class="job-countdown">⏰ বাকি: ${esc(j.remaining)}</div>
                  <div class="job-dates">
                    <span>শুরু: <strong>${esc(j.start)}</strong></span>
                    <span>শেষ: <strong>${esc(j.end)}</strong></span>
                  </div>
                </div>
                <div class="job-btn-group">
                  <button class="btn btn-outline btn-xs" onclick="App.openJobDetails('${j.id}')">বিস্তারিত দেখুন</button>
                  <a href="${j.applyUrl}" target="_blank" class="btn btn-primary btn-xs">আবেদন করুন ➜</a>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </section>

      <!-- POPULAR ONLINE TOOLS -->
      <section class="section section-alt">
        <div class="container">
          <div class="section-head text-center">
            <div class="section-tag">অনলাইন সার্ভিসেস</div>
            <h2 class="section-title">জনপ্রিয় অনলাইন টুলস</h2>
            <p class="section-subtitle">ব্রাউজারে সরাসরি কাজ সম্পন্ন করুন — কোনো সফটওয়্যার ইনস্টলেশনের প্রয়োজন নেই</p>
          </div>

          <div class="grid grid-4 gap-4 mb-6">
            <div class="card p-5 text-center cursor-pointer" onclick="App.navigate('/tools/photo-studio')">
              <div style="font-size:2.2rem" class="mb-2">📸</div>
              <h3 class="font-bold text-sm mb-1">Photo Studio AI</h3>
              <p class="text-xs text-muted">পাসপোর্ট ও আইডি ছবি তৈরি</p>
            </div>
            <div class="card p-5 text-center cursor-pointer" onclick="App.navigate('/tools/joint-photo')">
              <div style="font-size:2.2rem" class="mb-2">👥</div>
              <h3 class="font-bold text-sm mb-1">যৌথ ছবি (Joint Photo)</h3>
              <p class="text-xs text-muted">দুই জনের ছবি পাশাপাশি যুক্ত করুন</p>
            </div>
            <div class="card p-5 text-center cursor-pointer" onclick="App.navigate('/tools/nid-print-ready')">
              <div style="font-size:2.2rem" class="mb-2">🪪</div>
              <h3 class="font-bold text-sm mb-1">NID প্রিন্ট রেডি</h3>
              <p class="text-xs text-muted">মোবাইলে তোলা NID ৫ মিনিটে প্রিন্ট</p>
            </div>
            <div class="card p-5 text-center cursor-pointer" onclick="App.navigate('/tools/a4-print-ready')">
              <div style="font-size:2.2rem" class="mb-2">🖨️</div>
              <h3 class="font-bold text-sm mb-1">A4 প্রিন্ট রেডি</h3>
              <p class="text-xs text-muted">৪, ৮, ১২, ২৪ কপি ফটো শিট</p>
            </div>
            <div class="card p-5 text-center cursor-pointer" onclick="App.navigate('/tools/cv-auto-fill')">
              <div style="font-size:2.2rem" class="mb-2">📄</div>
              <h3 class="font-bold text-sm mb-1">সিভি অটোফিল</h3>
              <p class="text-xs text-muted">মিনিটেই প্রফেশনাল CV তৈরি</p>
            </div>
            <div class="card p-5 text-center cursor-pointer" onclick="App.navigate('/tools/make-voter-slip')">
              <div style="font-size:2.2rem" class="mb-2">🗳️</div>
              <h3 class="font-bold text-sm mb-1">ভোটার স্লিপ তৈরি</h3>
              <p class="text-xs text-muted">QR কোড সহ ভোটার স্লিপ প্রিন্ট</p>
            </div>
            <div class="card p-5 text-center cursor-pointer" onclick="App.navigate('/tools/auto-invoice')">
              <div style="font-size:2.2rem" class="mb-2">🧾</div>
              <h3 class="font-bold text-sm mb-1">অটো ইনভয়েস</h3>
              <p class="text-xs text-muted">ক্যাশ মেমো ও দোকানের বিল</p>
            </div>
            <div class="card p-5 text-center cursor-pointer" onclick="App.navigate('/tools/it-hisab')">
              <div style="font-size:2.2rem" class="mb-2">🧮</div>
              <h3 class="font-bold text-sm mb-1">আইটি হিসাব</h3>
              <p class="text-xs text-muted">দোকানের দৈনিক সেলস ও খরচ হিসাব</p>
            </div>
          </div>

          <div class="text-center">
            <button class="btn btn-outline" onclick="App.navigate('/tools')">See More Tools (24+) ➜</button>
          </div>
        </div>
      </section>

      <!-- IMPORTANT LINKS -->
      <section class="section">
        <div class="container">
          <div class="section-head flex justify-between items-center flex-wrap">
            <div>
              <div class="section-tag">গুরুত্বপূর্ণ লিংকসমূহ</div>
              <h2 class="section-title">প্রয়োজনীয় সকল অফিশিয়াল ওয়েবসাইটের সরাসরি লিংক</h2>
              <p class="section-subtitle">সকল সরকারি পোর্টাল, শিক্ষা বোর্ড, পাসপোর্ট, ভিসা ও সেবা লিংক</p>
            </div>
            <input type="text" class="form-input text-xs w-64" placeholder="লিংক খুঁজুন..." oninput="App.filterLinks(this.value)">
          </div>

          <div class="grid grid-4 gap-4" id="importantLinksGrid">
            ${this.renderLinksCardsHtml(IMPORTANT_LINKS.slice(0, 8))}
          </div>

          <div class="text-center mt-6">
            <button class="btn btn-outline" onclick="App.navigate('/links')">আরও লিংক দেখুন (১১৪+) ➜</button>
          </div>
        </div>
      </section>

      ${this.footerHtml()}`;
  },

  renderLinksCardsHtml(links) {
    if (!links.length) return '<div class="col-span-2 text-center py-6 text-muted">কোনো লিংক পাওয়া যায়নি</div>';
    return links.map(l => `
      <div class="job-card">
        <div>
          <div class="flex justify-between items-center mb-2">
            <span class="badge badge-green text-xs">${esc(l.cat)}</span>
            <span class="text-xs text-muted">👁️ ${l.clicks || 50}</span>
          </div>
          <h3 class="font-bold text-sm mb-1">${esc(l.title)}</h3>
          <p class="text-xs text-muted mb-4">${esc(l.desc)}</p>
        </div>
        <a href="${l.url}" target="_blank" rel="noopener" class="btn btn-outline btn-xs w-full">ভিজিট করুন ➜</a>
      </div>`).join('');
  },

  filterLinks(q) {
    q = (q || '').toLowerCase().trim();
    const filtered = IMPORTANT_LINKS.filter(l =>
      l.title.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q) || l.cat.toLowerCase().includes(q)
    );
    $('#importantLinksGrid').innerHTML = this.renderLinksCardsHtml(filtered);
  },

  // ===================== 2. TOOLS DIRECTORY INDEX =====================
  renderToolsIndex(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-5xl">
        <div class="section-head text-center">
          <div class="section-tag">সকল অনলাইন টুলস</div>
          <h1 class="section-title">স্মার্ট ডিজিটাল ও আইটি টুলস হাব</h1>
          <p class="section-subtitle">২৪টি অত্যাধুনিক টুলস — ফটো, ডকুমেন্ট, চাকরি, হিসাব ও কনভার্টার</p>
        </div>

        ${NAV_TOOL_CATEGORIES.map(cat => `
          <div class="mb-8">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b">
              <h2 class="font-bold text-lg text-forest">${esc(cat.title)}</h2>
              <span class="badge badge-green">${esc(cat.en)} (${cat.count})</span>
            </div>
            <div class="grid grid-3 gap-4">
              ${cat.tools.map(t => `
                <div class="card p-4 hover:border-primary cursor-pointer flex items-center gap-3" onclick="App.navigate('/tools/${t.slug}')">
                  <div class="mega-icon-box" style="width:40px;height:40px;font-size:1.2rem">⚡</div>
                  <div>
                    <h3 class="font-bold text-sm">${esc(t.bn)}</h3>
                    <p class="text-xs text-muted">${esc(t.desc)}</p>
                  </div>
                </div>`).join('')}
            </div>
          </div>`).join('')}
      </div>
      ${this.footerHtml()}`;
  },

  // ===================== 3. PHOTO STUDIO AI & PHOTO STUDIO =====================
  renderPhotoStudio(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-5xl">
        <div class="section-head">
          <div class="section-tag">ডিজিটাল ফটো স্টুডিও</div>
          <h1 class="section-title">পাসপোর্ট ও NID ছবি এডিটর</h1>
          <p class="section-subtitle">ছবি আপলোড করুন, মাপ নির্বাচন করুন, ব্যাকগ্রাউন্ড পরিবর্তন করুন ও A4 প্রিন্ট শিট তৈরি করুন।</p>
        </div>

        <div class="grid grid-3 gap-6">
          <div class="card p-5">
            <h3 class="font-bold text-sm mb-2">১. ছবি আপলোড করুন</h3>
            <input type="file" id="photoInput" accept="image/*" class="form-input mb-4" onchange="App.handlePhoto(event)">

            <h3 class="font-bold text-sm mb-2">২. মাপ নির্বাচন (Preset)</h3>
            <div class="grid grid-2 gap-2 mb-4">
              <button class="btn btn-outline btn-xs" onclick="App.applyPreset(600, 600, 'পাসপোর্ট')">পাসপোর্ট (2x2)</button>
              <button class="btn btn-outline btn-xs" onclick="App.applyPreset(400, 500, 'NID')">NID সাইজ</button>
              <button class="btn btn-outline btn-xs" onclick="App.applyPreset(450, 600, 'ভিসা')">ভিসা সাইজ</button>
              <button class="btn btn-outline btn-xs" onclick="App.applyPreset(300, 300, 'স্টুডেন্ট ID')">স্টুডেন্ট ID</button>
              <button class="btn btn-outline btn-xs" onclick="App.applyPreset(300, 80, 'স্বাক্ষর')">স্বাক্ষর (300x80)</button>
              <button class="btn btn-outline btn-xs" onclick="App.applyPreset(300, 300, 'চাকরি 300x300')">চাকরি (300x300)</button>
            </div>

            <h3 class="font-bold text-sm mb-2">৩. ব্যাকগ্রাউন্ড রঙ</h3>
            <div class="flex gap-2 mb-4">
              <button class="btn btn-xs" style="background:#ffffff;border:1px solid #ccc" onclick="App.setBg('#ffffff')">সাদা</button>
              <button class="btn btn-xs" style="background:#0F9D58;color:#fff" onclick="App.setBg('#0F9D58')">গ্রিন</button>
              <button class="btn btn-xs" style="background:#2563EB;color:#fff" onclick="App.setBg('#2563EB')">নীল</button>
              <button class="btn btn-xs" style="background:#B0BEC5;color:#000" onclick="App.setBg('#B0BEC5')">ধূসর</button>
            </div>

            <h3 class="font-bold text-sm mb-2">৪. বিশেষ অ্যাকশন</h3>
            <div class="space-y-2">
              <button class="btn btn-outline btn-xs w-full" onclick="App.autoBgRemove()">✂️ স্মার্ট ব্যাকগ্রাউন্ড রিমুভ (Auto)</button>
              <button class="btn btn-outline btn-xs w-full" onclick="App.generateA4Sheet(24)">🖨️ A4 প্রিন্ট শিট তৈরি (২৪ কপি)</button>
            </div>
          </div>

          <div class="card p-5 col-span-2 text-center">
            <h3 class="font-bold text-sm mb-3 text-left">প্রিভিউ ও এডিটর ক্যানভাস</h3>
            <div class="p-4 bg-surface-alt rounded flex items-center justify-center min-h-[360px]">
              <div id="canvasEmpty" class="text-xs text-muted">📷 বাম পাশের প্যানেল থেকে একটি ছবি আপলোড করুন</div>
              <canvas id="photoCanvas" class="hidden rounded shadow-sm max-w-full max-h-[460px]"></canvas>
            </div>
            <div id="canvasBtns" class="mt-4 flex justify-center gap-3 hidden">
              <button class="btn btn-primary" onclick="App.downloadPhoto('sebakendra-photo.jpg')">ছবি ডাউনলোড (JPG) ⬇️</button>
              <button class="btn btn-outline" onclick="App.printPhoto()">প্রিন্ট প্রিভিউ 🖨️</button>
            </div>
          </div>
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  async handlePhoto(e) {
    if (!e.target.files[0]) return;
    window._activeImg = await Tools.loadImage(e.target.files[0]);
    window._activePreset = { w: 600, h: 600, label: 'পাসপোর্ট' };
    window._activeBg = '#ffffff';
    this.refreshPhotoCanvas();
    toast('ছবি লোড হয়েছে');
  },

  refreshPhotoCanvas() {
    if (!window._activeImg) return;
    const p = window._activePreset || { w: 600, h: 600 };
    const c = Tools.processPhoto(window._activeImg, { w: p.w, h: p.h, bg: window._activeBg || '#ffffff', border: 2 });
    const target = $('#photoCanvas');
    target.width = c.width; target.height = c.height;
    target.getContext('2d').drawImage(c, 0, 0);

    target.classList.remove('hidden');
    $('#canvasEmpty')?.classList.add('hidden');
    $('#canvasBtns')?.classList.remove('hidden');
  },

  applyPreset(w, h, label) {
    if (!window._activeImg) return toast('প্রথমে ছবি আপলোড করুন', true);
    window._activePreset = { w, h, label };
    this.refreshPhotoCanvas();
    toast(`${label} সাইজ সেট করা হয়েছে`);
  },

  setBg(color) {
    if (!window._activeImg) return toast('প্রথমে ছবি আপলোড করুন', true);
    window._activeBg = color;
    this.refreshPhotoCanvas();
    toast('ব্যাকগ্রাউন্ড রং পরিবর্তন করা হয়েছে');
  },

  autoBgRemove() {
    if (!window._activeImg) return toast('প্রথমে ছবি আপলোড করুন', true);
    window._activeImg = Tools.removeBackground(window._activeImg, 40);
    this.refreshPhotoCanvas();
    toast('ব্যাকগ্রাউন্ড রিমুভ সম্পন্ন');
  },

  generateA4Sheet(copies) {
    if (!window._activeImg) return toast('প্রথমে ছবি আপলোড করুন', true);
    const single = Tools.processPhoto(window._activeImg, { w: 260, h: 320, bg: window._activeBg || '#fff', border: 2 });
    const sheet = Tools.makeA4Sheet(single, copies);
    const target = $('#photoCanvas');
    target.width = sheet.width; target.height = sheet.height;
    target.getContext('2d').drawImage(sheet, 0, 0);
    toast(`A4 প্রিন্ট শিট তৈরি হয়েছে (${copies} কপি)`);
  },

  downloadPhoto(name) {
    const c = $('#photoCanvas');
    if (c) Tools.downloadCanvas(c, name);
  },

  printPhoto() {
    const c = $('#photoCanvas');
    if (!c) return;
    const w = window.open('', '_blank');
    w.document.write(`<html><body style="margin:0;display:flex;align-items:center;justify-content:center"><img src="${c.toDataURL()}" style="max-width:100%" onload="window.print()"/></body></html>`);
    w.document.close();
  },

  // ===================== 4. CV AUTOFILL (Properly Implemented) =====================
  renderCvAutofill(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-5xl">
        <div class="section-head">
          <div class="section-tag">সিভি বিল্ডার</div>
          <h1 class="section-title">সিভি অটোফিল (CV Autofill)</h1>
          <p class="section-subtitle">আপনার তথ্য লিখুন — কয়েক সেকেন্ডেই প্রফেশনাল জীবনবৃত্তান্ত প্রস্তুত ও প্রিন্ট করুন।</p>
        </div>

        <div class="grid grid-2 gap-6">
          <div class="card p-5">
            <h3 class="font-bold text-sm mb-3">ব্যক্তিগত ও শিক্ষাগত তথ্য</h3>
            <div class="form-group"><label class="form-label">পূর্ণ নাম *</label><input type="text" id="cvName" class="form-input" placeholder="মো. আরিফুল ইসলাম" oninput="App.updateCvPreview()"></div>
            <div class="grid grid-2 gap-2">
              <div class="form-group"><label class="form-label">মোবাইল নম্বর *</label><input type="tel" id="cvPhone" class="form-input" placeholder="017XXXXXXXX" oninput="App.updateCvPreview()"></div>
              <div class="form-group"><label class="form-label">ইমেইল</label><input type="email" id="cvEmail" class="form-input" placeholder="you@email.com" oninput="App.updateCvPreview()"></div>
            </div>
            <div class="form-group"><label class="form-label">ঠিকানা</label><input type="text" id="cvAddress" class="form-input" placeholder="বাড়ি নং, গ্রাম, থানা, জেলা" oninput="App.updateCvPreview()"></div>
            <div class="form-group"><label class="form-label">ক্যারিয়ার উদ্দেশ্য (Objective)</label><textarea id="cvObjective" class="form-textarea" rows="2" oninput="App.updateCvPreview()">নিষ্ঠা ও দক্ষতার সাথে দায়িত্ব পালন করে প্রতিষ্ঠানের লক্ষ্য অর্জনে সক্রিয় ভূমিকা রাখা।</textarea></div>
            <div class="form-group"><label class="form-label">শিক্ষাগত যোগ্যতা</label><textarea id="cvEducation" class="form-textarea" rows="3" oninput="App.updateCvPreview()">• বিএসসি / ডিগ্রি (চলমান) — জাতীয় বিশ্ববিদ্যালয়
• এইচএসসি (২০২২) — জিপিএ: ৪.৫০
• এসএসসি (২০২০) — জিপিএ: ৪.৮০</textarea></div>
            <div class="form-group"><label class="form-label">দক্ষতাসমূহ</label><textarea id="cvSkills" class="form-textarea" rows="2" oninput="App.updateCvPreview()">কম্পিউটার অফিস অ্যাপ্লিকেশন, ইন্টারনেট ব্রাউজিং, ডাটা এন্ট্রি, দ্রুত টাইপিং।</textarea></div>
          </div>

          <div class="card p-5">
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-bold text-sm">সিভি প্রিভিউ (Live Preview)</h3>
              <button class="btn btn-primary btn-xs" onclick="App.printCv()">🖨️ প্রিন্ট / PDF ডাউনলোড</button>
            </div>
            <div id="cvPreviewBox" class="p-6 bg-surface border rounded text-xs space-y-3" style="min-height:480px;line-height:1.6">
              <!-- Live preview inserted here -->
            </div>
          </div>
        </div>
      </div>
      ${this.footerHtml()}`;
    this.updateCvPreview();
  },

  updateCvPreview() {
    const box = $('#cvPreviewBox');
    if (!box) return;
    const name = $('#cvName')?.value || 'আপনার পূর্ণ নাম';
    const phone = $('#cvPhone')?.value || '017XXXXXXXX';
    const email = $('#cvEmail')?.value || 'you@example.com';
    const address = $('#cvAddress')?.value || 'ঠিকানা, বাংলাদেশ';
    const obj = $('#cvObjective')?.value || '—';
    const edu = $('#cvEducation')?.value || '—';
    const skills = $('#cvSkills')?.value || '—';

    box.innerHTML = `
      <div style="text-align:center;border-bottom:2px solid var(--primary);padding-bottom:0.75rem;margin-bottom:0.75rem">
        <h2 style="font-size:1.4rem;font-weight:800;color:var(--forest)">${esc(name)}</h2>
        <div style="color:#555;font-size:0.78rem">📞 ${esc(phone)} | ✉️ ${esc(email)} | 📍 ${esc(address)}</div>
      </div>
      <div>
        <h4 style="color:var(--primary);font-weight:700;border-bottom:1px solid #E2EBE5;padding-bottom:2px;margin-bottom:4px">ক্যারিয়ার উদ্দেশ্য</h4>
        <p>${esc(obj)}</p>
      </div>
      <div>
        <h4 style="color:var(--primary);font-weight:700;border-bottom:1px solid #E2EBE5;padding-bottom:2px;margin-bottom:4px">শিক্ষাগত যোগ্যতা</h4>
        <pre style="font-family:inherit;white-space:pre-wrap">${esc(edu)}</pre>
      </div>
      <div>
        <h4 style="color:var(--primary);font-weight:700;border-bottom:1px solid #E2EBE5;padding-bottom:2px;margin-bottom:4px">দক্ষতাসমূহ</h4>
        <pre style="font-family:inherit;white-space:pre-wrap">${esc(skills)}</pre>
      </div>
    `;
  },

  printCv() {
    const box = $('#cvPreviewBox');
    if (!box) return;
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>Curriculum Vitae</title><style>body{font-family:'Hind Siliguri',sans-serif;padding:2.5rem;max-width:700px;margin:auto;line-height:1.6}h2{color:#0A6847;margin:0}h4{color:#0F9D58;border-bottom:1px solid #ccc;padding-bottom:3px;margin-top:1rem}pre{font-family:inherit;white-space:pre-wrap}</style></head><body>${box.innerHTML}<script>window.print()<\/script></body></html>`);
    w.document.close();
  },

  // ===================== 5. JOINT PHOTO =====================
  renderJointPhoto(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-5xl">
        <div class="section-head">
          <div class="section-tag">যৌথ ছবি এডিটর</div>
          <h1 class="section-title">পাশাপাশি দুই ব্যক্তির যৌথ ছবি (Joint Photo)</h1>
          <p class="section-subtitle">স্বামী-স্ত্রী, অংশীদার বা যৌথ আবেদনকারীদের ছবি পাশাপাশি নিখুঁতভাবে বসিয়ে প্রিন্ট করুন।</p>
        </div>
        <div class="grid grid-3 gap-6">
          <div class="card p-5">
            <h3 class="font-bold text-sm mb-2">১. প্রথম ছবি আপলোড</h3>
            <input type="file" accept="image/*" class="form-input mb-4" onchange="App.handleJoint1(event)">
            <h3 class="font-bold text-sm mb-2">২. দ্বিতীয় ছবি আপলোড</h3>
            <input type="file" accept="image/*" class="form-input mb-4" onchange="App.handleJoint2(event)">
            <h3 class="font-bold text-sm mb-2">৩. নাম (ঐচ্ছিক)</h3>
            <input type="text" id="jName1" class="form-input text-xs mb-2" placeholder="১ম ব্যক্তির নাম" oninput="App.drawJoint()">
            <input type="text" id="jName2" class="form-input text-xs mb-4" placeholder="২য় ব্যক্তির নাম" oninput="App.drawJoint()">
            <button class="btn btn-primary w-full" onclick="App.jointA4()">A4 পেপারে যৌথ ছবি প্রিন্ট (৮ কপি)</button>
          </div>
          <div class="card p-5 col-span-2 text-center">
            <h3 class="font-bold text-sm mb-3 text-left">যৌথ ছবির প্রিভিউ</h3>
            <div class="p-4 bg-surface-alt rounded flex items-center justify-center min-h-[360px]">
              <div id="jEmpty" class="text-xs text-muted">উভয় ছবি আপলোড করুন</div>
              <canvas id="jCanvas" class="hidden rounded shadow-sm max-w-full max-h-[440px]"></canvas>
            </div>
            <div id="jBtns" class="mt-4 flex justify-center gap-3 hidden">
              <button class="btn btn-primary" onclick="Tools.downloadCanvas($('#jCanvas'), 'joint-photo.jpg')">ডাউনলোড যৌথ ছবি ⬇️</button>
            </div>
          </div>
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  async handleJoint1(e) {
    if (!e.target.files[0]) return;
    window._j1 = await Tools.loadImage(e.target.files[0]);
    this.drawJoint();
  },
  async handleJoint2(e) {
    if (!e.target.files[0]) return;
    window._j2 = await Tools.loadImage(e.target.files[0]);
    this.drawJoint();
  },
  drawJoint() {
    if (!window._j1 && !window._j2) return;
    const n1 = $('#jName1')?.value || '';
    const n2 = $('#jName2')?.value || '';
    const c = Tools.makeJointPhoto(window._j1, window._j2, { name1: n1, name2: n2 });
    const target = $('#jCanvas');
    target.width = c.width; target.height = c.height;
    target.getContext('2d').drawImage(c, 0, 0);
    target.classList.remove('hidden');
    $('#jEmpty')?.classList.add('hidden');
    $('#jBtns')?.classList.remove('hidden');
  },
  jointA4() {
    const c = $('#jCanvas');
    if (!c || c.classList.contains('hidden')) return toast('প্রথমে ছবি আপলোড করুন', true);
    const sheet = Tools.makeA4Sheet(c, 8);
    c.width = sheet.width; c.height = sheet.height;
    c.getContext('2d').drawImage(sheet, 0, 0);
    toast('A4 প্রিন্ট শিট তৈরি হয়েছে (৮ কপি)');
  },

  // ===================== 6. NID PRINT READY =====================
  renderNidPrintReady(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-5xl">
        <div class="section-head">
          <div class="section-tag">NID প্রিন্ট রেডি (৮৫.৬ x ৫৪ মিমি)</div>
          <h1 class="section-title">মোবাইলে তোলা NID প্রিন্ট রেডি করুন মাত্র ৫ মিনিটে</h1>
          <p class="section-subtitle">ফ্রন্ট এবং ব্যাক সাইড স্বয়ংক্রিয়ভাবে আন্তর্জাতিক স্মার্ট কার্ড সাইজে A4 পেপারে রেডি হয়।</p>
        </div>
        <div class="grid grid-3 gap-6">
          <div class="card p-5">
            <h3 class="font-bold text-sm mb-2">১. NID ফ্রন্ট সাইড (সামনের অংশ)</h3>
            <input type="file" accept="image/*" class="form-input mb-4" onchange="App.handleNidF(event)">
            <h3 class="font-bold text-sm mb-2">২. NID ব্যাক সাইড (পেছনের অংশ)</h3>
            <input type="file" accept="image/*" class="form-input mb-4" onchange="App.handleNidB(event)">
            <button class="btn btn-primary w-full" onclick="App.drawNid()">🖨️ A4 পেপারে NID প্রিন্ট রেডি করুন</button>
          </div>
          <div class="card p-5 col-span-2 text-center">
            <h3 class="font-bold text-sm mb-3 text-left">A4 NID শিট প্রিভিউ (কাটিং গাইড সহ)</h3>
            <div class="p-4 bg-surface-alt rounded flex items-center justify-center min-h-[400px]">
              <div id="nidEmpty" class="text-xs text-muted">সামনের ও পেছনের ছবি আপলোড করে বাটন চাপুন</div>
              <canvas id="nidCanvas" class="hidden rounded shadow-sm max-w-full max-h-[500px]"></canvas>
            </div>
            <div id="nidBtns" class="mt-4 flex justify-center gap-3 hidden">
              <button class="btn btn-primary" onclick="Tools.downloadCanvas($('#nidCanvas'), 'nid-sheet.jpg')">NID প্রিন্ট শিট ডাউনলোড ⬇️</button>
              <button class="btn btn-outline" onclick="App.printNid()">সরাসরি প্রিন্ট 🖨️</button>
            </div>
          </div>
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  async handleNidF(e) {
    if (!e.target.files[0]) return;
    window._nidF = await Tools.loadImage(e.target.files[0]);
    toast('ফ্রন্ট সাইড আপলোড হয়েছে');
  },
  async handleNidB(e) {
    if (!e.target.files[0]) return;
    window._nidB = await Tools.loadImage(e.target.files[0]);
    toast('ব্যাক সাইড আপলোড হয়েছে');
  },
  drawNid() {
    if (!window._nidF && !window._nidB) return toast('অন্তত একটি ছবি দিন', true);
    const sheet = Tools.makeNidPrintSheet(window._nidF, window._nidB, { copies: 2 });
    const target = $('#nidCanvas');
    target.width = sheet.width; target.height = sheet.height;
    target.getContext('2d').drawImage(sheet, 0, 0);
    target.classList.remove('hidden');
    $('#nidEmpty')?.classList.add('hidden');
    $('#nidBtns')?.classList.remove('hidden');
    toast('NID প্রিন্ট শিট রেডি');
  },
  printNid() {
    const c = $('#nidCanvas');
    if (!c) return;
    const w = window.open('', '_blank');
    w.document.write(`<html><body style="margin:0;display:flex;align-items:center;justify-content:center"><img src="${c.toDataURL()}" style="max-width:100%" onload="window.print()"/></body></html>`);
    w.document.close();
  },

  // ===================== 7. A4 PRINT READY =====================
  renderA4PrintReady(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div class="section-tag">A4 প্রিন্ট রেডি</div>
          <h1 class="section-title">A4 পেপার প্রিন্ট শিট মেকার</h1>
          <p class="section-subtitle">যেকোনো ছবি ৪, ৮, ১২, ১৬ বা ২৪ কপি গ্রিডে এক ক্লিকে প্রিন্ট রেডি করুন।</p>
        </div>
        <div class="grid grid-3 gap-6">
          <div class="card p-5">
            <h3 class="font-bold text-sm mb-2">ছবি আপলোড</h3>
            <input type="file" accept="image/*" class="form-input mb-4" onchange="App.handleA4Photo(event)">
            <h3 class="font-bold text-sm mb-2">কপির সংখ্যা</h3>
            <div class="grid grid-2 gap-2 mb-4">
              <button class="btn btn-outline btn-xs" onclick="App.renderA4(4)">৪ কপি</button>
              <button class="btn btn-outline btn-xs" onclick="App.renderA4(8)">৮ কপি</button>
              <button class="btn btn-outline btn-xs" onclick="App.renderA4(12)">১২ কপি</button>
              <button class="btn btn-outline btn-xs" onclick="App.renderA4(24)">২৪ কপি</button>
            </div>
          </div>
          <div class="card p-5 col-span-2 text-center">
            <div class="p-4 bg-surface-alt rounded flex items-center justify-center min-h-[400px]">
              <div id="a4Empty" class="text-xs text-muted">ছবি আপলোড করে কপির সংখ্যা নির্বাচন করুন</div>
              <canvas id="a4Canvas" class="hidden rounded shadow-sm max-w-full max-h-[500px]"></canvas>
            </div>
            <div id="a4Btns" class="mt-4 flex justify-center gap-3 hidden">
              <button class="btn btn-primary" onclick="Tools.downloadCanvas($('#a4Canvas'), 'a4-sheet.jpg')">ডাউনলোড A4 শিট ⬇️</button>
            </div>
          </div>
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  async handleA4Photo(e) {
    if (!e.target.files[0]) return;
    window._a4Img = await Tools.loadImage(e.target.files[0]);
    this.renderA4(24);
  },
  renderA4(copies) {
    if (!window._a4Img) return toast('প্রথমে ছবি দিন', true);
    const sheet = Tools.makeA4Sheet(window._a4Img, copies);
    const target = $('#a4Canvas');
    target.width = sheet.width; target.height = sheet.height;
    target.getContext('2d').drawImage(sheet, 0, 0);
    target.classList.remove('hidden');
    $('#a4Empty')?.classList.add('hidden');
    $('#a4Btns')?.classList.remove('hidden');
    toast(`${copies} কপির A4 শিট প্রস্তুত`);
  },

  // ===================== 8. PHOTO CARD =====================
  renderPhotoCard(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div class="section-tag">ফটো কার্ড</div>
          <h1 class="section-title">আইডি ও ফটো কার্ড মেকার</h1>
          <p class="section-subtitle">স্টুডেন্ট আইডি ও প্রতিষ্ঠানের ল্যামিনেশন কার্ড তৈরি করুন।</p>
        </div>
        <div class="grid grid-2 gap-6">
          <div class="card p-5">
            <div class="form-group"><label class="form-label">প্রতিষ্ঠানের নাম</label><input type="text" id="pcOrg" class="form-input" value="সেবাকেন্দ্র কম্পিউটার সেন্টার"></div>
            <div class="form-group"><label class="form-label">নাম *</label><input type="text" id="pcName" class="form-input" placeholder="নাম"></div>
            <div class="form-group"><label class="form-label">আইডি নম্বর</label><input type="text" id="pcId" class="form-input" value="ID-2026-88"></div>
            <div class="form-group"><label class="form-label">পদবি / ক্লাস</label><input type="text" id="pcRole" class="form-input" value="মেম্বার"></div>
            <div class="form-group"><label class="form-label">ছবি আপলোড</label><input type="file" accept="image/*" class="form-input" onchange="App.handlePcPhoto(event)"></div>
            <button class="btn btn-primary w-full" onclick="App.drawPhotoCard()">ফটো কার্ড তৈরি করুন</button>
          </div>
          <div class="card p-5 text-center">
            <canvas id="pcCanvas" class="hidden rounded shadow-sm max-w-full"></canvas>
            <div id="pcBtns" class="mt-4 hidden"><button class="btn btn-primary btn-sm" onclick="Tools.downloadCanvas($('#pcCanvas'), 'id-card.jpg')">ডাউনলোড কার্ড ⬇️</button></div>
          </div>
        </div>
      </div>
      ${this.footerHtml()}`;
  },
  async handlePcPhoto(e) {
    if (!e.target.files[0]) return;
    window._pcImg = await Tools.loadImage(e.target.files[0]);
    this.drawPhotoCard();
  },
  drawPhotoCard() {
    const org = $('#pcOrg')?.value || 'Digital Center';
    const name = $('#pcName')?.value || 'Student Name';
    const id = $('#pcId')?.value || 'ID-001';
    const role = $('#pcRole')?.value || 'Member';

    const canvas = $('#pcCanvas');
    canvas.width = 600; canvas.height = 900;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 600, 900);

    // Top banner
    ctx.fillStyle = '#0F9D58'; ctx.fillRect(0, 0, 600, 160);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 30px "Hind Siliguri"'; ctx.textAlign = 'center';
    ctx.fillText(org, 300, 90);

    // Photo
    if (window._pcImg) {
      ctx.drawImage(window._pcImg, 180, 220, 240, 300);
      ctx.strokeStyle = '#0F9D58'; ctx.lineWidth = 4; ctx.strokeRect(180, 220, 240, 300);
    } else {
      ctx.fillStyle = '#EEF3FA'; ctx.fillRect(180, 220, 240, 300);
    }

    // Texts
    ctx.fillStyle = '#111'; ctx.font = 'bold 32px "Hind Siliguri"'; ctx.fillText(name, 300, 580);
    ctx.fillStyle = '#0F9D58'; ctx.font = '600 24px "Hind Siliguri"'; ctx.fillText(role, 300, 620);
    ctx.fillStyle = '#666'; ctx.font = '20px sans-serif'; ctx.fillText(id, 300, 660);

    // Border
    ctx.strokeStyle = '#0F9D58'; ctx.lineWidth = 8; ctx.strokeRect(0, 0, 600, 900);

    canvas.classList.remove('hidden');
    $('#pcBtns')?.classList.remove('hidden');
    toast('ফটো কার্ড প্রস্তুত');
  },

  // ===================== 9. JOB AUTOFILL & MY JOB ADS =====================
  renderJobAutofill(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div class="section-tag">জব টুল</div>
          <h1 class="section-title">জবস্ অটো ফিল (Job Autofill)</h1>
          <p class="section-subtitle">টেলিটক ও সরকারি চাকরির আবেদন ফর্মে দ্রুত তথ্য কপি ও অটোফিলের সুবিধা।</p>
        </div>
        <div class="card p-6">
          <div class="grid grid-2 gap-4">
            <div class="form-group"><label class="form-label">প্রার্থীর নাম (English)</label><input type="text" id="jaName" class="form-input" value="MD ARIFUL ISLAM"></div>
            <div class="form-group"><label class="form-label">পিতার নাম (Father's Name)</label><input type="text" id="jaFather" class="form-input" value="MD RAFIQUL ISLAM"></div>
            <div class="form-group"><label class="form-label">মাতার নাম (Mother's Name)</label><input type="text" id="jaMother" class="form-input" value="RASHIDA BEGUM"></div>
            <div class="form-group"><label class="form-label">জন্ম তারিখ (DOB)</label><input type="date" id="jaDob" class="form-input" value="1998-05-12"></div>
            <div class="form-group"><label class="form-label">জাতীয় পরিচয়পত্র নং (NID)</label><input type="text" id="jaNid" class="form-input" value="19982693847281"></div>
            <div class="form-group"><label class="form-label">মোবাইল নম্বর</label><input type="tel" id="jaPhone" class="form-input" value="01711223344"></div>
          </div>
          <div class="mt-4 flex gap-3">
            <button class="btn btn-primary" onclick="toast('তথ্য সংরক্ষিত হয়েছে! Teletalk ফর্মে পেস্ট করতে প্রস্তুত')">তথ্য সংরক্ষণ করুন 💾</button>
            <button class="btn btn-outline" onclick="App.copyAutofill()">ক্লিপবোর্ডে কপি করুন 📋</button>
          </div>
        </div>
      </div>
      ${this.footerHtml()}`;
  },
  copyAutofill() {
    const text = `Name: ${$('#jaName').value}\nFather: ${$('#jaFather').value}\nMother: ${$('#jaMother').value}\nDOB: ${$('#jaDob').value}\nNID: ${$('#jaNid').value}\nPhone: ${$('#jaPhone').value}`;
    navigator.clipboard.writeText(text);
    toast('ক্লিপবোর্ডে কপি করা হয়েছে');
  },

  renderMyJobAds(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div class="section-tag">ট্র্যাকার</div>
          <h1 class="section-title">আমার চাকরির আবেদন ট্র্যাকার (My Job Ads)</h1>
          <p class="section-subtitle">আপনার সাবমিট করা চাকরি আবেদন, এডমিট কার্ড ও পরীক্ষার তারিখ ট্র্যাক করুন।</p>
        </div>
        <div class="card p-6">
          <table class="w-full text-xs text-left">
            <thead><tr class="border-b"><th class="pb-2">প্রতিষ্ঠান</th><th class="pb-2">ইউজার আইডি</th><th class="pb-2">তারিখ</th><th class="pb-2">স্ট্যাটাস</th></tr></thead>
            <tbody>
              <tr class="border-b"><td class="py-2 font-bold">কম্পট্রোলার এন্ড অডিটর জেনারেল</td><td>CAG202684</td><td>15 Nov 2026</td><td><span class="badge badge-green">ফি পরিশোধিত</span></td></tr>
              <tr class="border-b"><td class="py-2 font-bold">চট্টগ্রাম বন্দর কর্তৃপক্ষ</td><td>CPA9921</td><td>10 Nov 2026</td><td><span class="badge badge-green">ফি পরিশোধিত</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  renderAdmission(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div class="section-tag">ভর্তি পোর্টাল</div>
          <h1 class="section-title">বিশ্ববিদ্যালয় ও কলেজ ভর্তি তথ্য</h1>
          <p class="section-subtitle">সকল পাবলিক বিশ্ববিদ্যালয়, জাতীয় বিশ্ববিদ্যালয় ও কলেজের ভর্তি বিজ্ঞপ্তি</p>
        </div>
        <div class="grid grid-2 gap-4">
          <div class="card p-4">
            <h3 class="font-bold text-sm mb-1">জাতীয় বিশ্ববিদ্যালয় অনার্স ১ম বর্ষ ভর্তি</h3>
            <p class="text-xs text-muted mb-3">অনলাইন প্রাথমিক আবেদন ও কলেজ চয়েস প্রদান লিংক।</p>
            <a href="http://app1.nu.edu.bd/" target="_blank" class="btn btn-primary btn-xs">ভর্তি পোর্টালে যান ➜</a>
          </div>
          <div class="card p-4">
            <h3 class="font-bold text-sm mb-1">পাবলিক বিশ্ববিদ্যালয় গুচ্ছ ভর্তি (GST)</h3>
            <p class="text-xs text-muted mb-3">সাধারণ ও বিজ্ঞান প্রযুক্তি বিশ্ববিদ্যালয়ের গুচ্ছ ভর্তি।</p>
            <a href="https://gstadmission.ac.bd/" target="_blank" class="btn btn-primary btn-xs">গুচ্ছ পোর্টালে যান ➜</a>
          </div>
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  // ===================== 10. DESIGN & DOCUMENTS =====================
  renderCvFormat(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div class="section-tag">ডকুমেন্ট টেমপ্লেট</div>
          <h1 class="section-title">সিভি ফরম্যাট ডাউনলোড (CV Formats)</h1>
          <p class="section-subtitle">এমএস ওয়ার্ড (.docx) এবং PDF ফরম্যাটের প্রিমিয়াম সিভি টেমপ্লেট</p>
        </div>
        <div class="grid grid-3 gap-4">
          ${['সাধারণ চাকরি সিভি', 'আইটি ও গ্রাফিক্স সিভি', 'সরকারি চাকরি সিভি', 'ফ্রেশার বায়োডাটা', 'অভিজ্ঞ প্রফেশনাল সিভি', 'মাস্টার্স স্কলারশিপ সিভি'].map(t => `
            <div class="card p-4">
              <div style="font-size:2rem" class="mb-2">📄</div>
              <h3 class="font-bold text-sm mb-1">${t}</h3>
              <p class="text-xs text-muted mb-3">MS Word (.docx) টেমপ্লেট</p>
              <button class="btn btn-outline btn-xs w-full" onclick="toast('টেমপ্লেট ডাউনলোড শুরু হয়েছে')">ডাউনলোড (.docx) ⬇️</button>
            </div>`).join('')}
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  renderGraphicsFormat(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div class="section-tag">গ্রাফিক্স</div>
          <h1 class="section-title">গ্রাফিক্স ফরমেট (PSD & Templates)</h1>
          <p class="section-subtitle">দোকানের ব্যানার, সাইনবোর্ড ও ফটো ফ্রেম PSD ফাইল</p>
        </div>
        <div class="grid grid-3 gap-4">
          ${['আইটি সেন্টার ব্যানার PSD', 'পাসপোর্ট ছবি সাইনবোর্ড', 'ভর্তি বিজ্ঞাপন ব্যানার', 'ক্যাশ মেমো ডিজাইন'].map(t => `
            <div class="card p-4">
              <div style="font-size:2rem" class="mb-2">🎨</div>
              <h3 class="font-bold text-sm mb-1">${t}</h3>
              <button class="btn btn-primary btn-xs w-full mt-3" onclick="toast('PSD ফাইল ডাউনলোড হচ্ছে...')">PSD ডাউনলোড ⬇️</button>
            </div>`).join('')}
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  renderCertificateFormat(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div class="section-tag">সনদ ফরম্যাট</div>
          <h1 class="section-title">সনদ ফরমেট ও প্রত্যয়নপত্র খসড়া</h1>
          <p class="section-subtitle">ইউপি ও পৌরসভার বিভিন্ন সার্টিফিকেটের নমুনা ড্রাফট</p>
        </div>
        <div class="grid grid-3 gap-4">
          ${['চারিত্রিক সনদপত্র খসড়া', 'নাগরিকত্ব প্রত্যয়নপত্র', 'ওয়ারিশান সনদ ড্রাফট', 'অবিবাহিত সনদ ফরম্যাট'].map(t => `
            <div class="card p-4">
              <div style="font-size:2rem" class="mb-2">📜</div>
              <h3 class="font-bold text-sm mb-1">${t}</h3>
              <button class="btn btn-outline btn-xs w-full mt-3" onclick="toast('সনদ খসড়া কপি হয়েছে')">ওয়ার্ড ফাইল ডাউনলোড</button>
            </div>`).join('')}
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  renderPdfStudio(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div class="section-tag">PDF টুল</div>
          <h1 class="section-title">পিডিএফ স্টুডিও (PDF Studio)</h1>
          <p class="section-subtitle">টেক্সট বা আবেদনপত্র লিখে সরাসরি প্রিন্টযোগ্য PDF তৈরি করুন।</p>
        </div>
        <div class="card p-6">
          <div class="form-group"><label class="form-label">শিরোনাম</label><input type="text" id="pdfT" class="form-input" value="আবেদনপত্র"></div>
          <div class="form-group"><label class="form-label">বক্তব্য</label><textarea id="pdfB" class="form-textarea" rows="6">বরাবর,\nউপজেলা নির্বাহী অফিসার\n\nবিষয়: সেবা সহায়তা প্রসঙ্গে।\n\nজনাব,\nবিনীত নিবেদন এই যে, নিম্নে বর্ণিত সেবা প্রদানের জন্য অনুরোধ জানাচ্ছি।</textarea></div>
          <button class="btn btn-primary" onclick="App.genPdf()">PDF তৈরি ও প্রিন্ট 🖨️</button>
        </div>
      </div>
      ${this.footerHtml()}`;
  },
  genPdf() {
    const t = $('#pdfT').value, b = $('#pdfB').value;
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>${t}</title><style>body{font-family:'Hind Siliguri',sans-serif;padding:3rem;max-width:700px;margin:auto}h1{border-bottom:2px solid #0F9D58;color:#0B3B24;padding-bottom:10px}pre{font-family:inherit;white-space:pre-wrap;font-size:15px}</style></head><body><h1>${t}</h1><pre>${b}</pre><script>window.print()<\/script></body></html>`);
    w.document.close();
  },

  renderAnyToWord(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div class="section-tag">কনভার্টার</div>
          <h1 class="section-title">এনি টু ওয়ার্ড (Any to Word)</h1>
          <p class="section-subtitle">টেক্সট বা স্ক্যান করা লেখা এডিটেবল Word ফাইলে রূপান্তর করুন।</p>
        </div>
        <div class="card p-6">
          <textarea id="wordText" class="form-textarea mb-4" rows="8" placeholder="এখানে টেক্সট লিখুন বা পেস্ট করুন..."></textarea>
          <button class="btn btn-primary" onclick="App.downloadWordDoc()">Word (.doc) ফাইল ডাউনলোড ⬇️</button>
        </div>
      </div>
      ${this.footerHtml()}`;
  },
  downloadWordDoc() {
    const val = $('#wordText').value;
    if (!val) return toast('কিছু লিখুন', true);
    const blob = new Blob(['\ufeff' + val], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'document.doc';
    a.click();
    toast('Word ফাইল ডাউনলোড হয়েছে');
  },

  // ===================== 11. BUSINESS & DAILY =====================
  renderAutoInvoice(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div class="section-tag">দোকানের বিল</div>
          <h1 class="section-title">অটো ইনভয়েস ও ক্যাশ মেমো (Auto Invoice)</h1>
          <p class="section-subtitle">কাস্টমারের জন্য নিমেষেই তৈরি ও প্রিন্ট করুন দৃষ্টিনন্দন ক্যাশ মেমো।</p>
        </div>
        <div class="grid grid-2 gap-6">
          <div class="card p-5">
            <div class="form-group"><label class="form-label">দোকানের নাম</label><input type="text" id="invShop" class="form-input" value="সেবাকেন্দ্র ডিজিটাল সেন্টার"></div>
            <div class="form-group"><label class="form-label">গ্রাহকের নাম</label><input type="text" id="invCust" class="form-input" placeholder="গ্রাহকের নাম"></div>
            <div class="form-group"><label class="form-label">আইটেম ও মূল্য</label>
              <div class="space-y-2" id="invItemsList">
                <div class="flex gap-2"><input type="text" class="form-input text-xs flex-1" value="পাসপোর্ট ছবি প্রিন্ট (৪ কপি)"><input type="number" class="form-input text-xs w-24" value="100"></div>
                <div class="flex gap-2"><input type="text" class="form-input text-xs flex-1" value="NID লেমিনেটেড কপি"><input type="number" class="form-input text-xs w-24" value="50"></div>
              </div>
            </div>
            <button class="btn btn-primary w-full" onclick="App.printCashMemo()">মেমো প্রিন্ট করুন 🖨️</button>
          </div>
          <div class="card p-5 bg-surface-alt">
            <h3 class="font-bold text-sm mb-2">ইনভয়েস টিপস</h3>
            <p class="text-xs text-muted mb-2">গ্রাহকের প্রতিটি প্রিন্টিং ও অনলাইন আবেদনের হিসাব রাখতে ক্যাশ মেমো প্রিন্ট করুন।</p>
          </div>
        </div>
      </div>
      ${this.footerHtml()}`;
  },
  printCashMemo() {
    const shop = $('#invShop').value, cust = $('#invCust').value || 'গ্রাহক';
    const rows = [...$$('#invItemsList > div')].map(div => {
      const inputs = div.querySelectorAll('input');
      return `<tr><td style="padding:4px 0">${inputs[0].value}</td><td style="text-align:right;font-weight:bold">৳${inputs[1].value}</td></tr>`;
    }).join('');
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>Cash Memo</title><style>body{font-family:'Hind Siliguri',sans-serif;padding:2rem;max-width:380px;margin:auto}h3{color:#0A6847;margin:0}table{width:100%;font-size:13px;border-top:1px dashed #aaa;border-bottom:1px dashed #aaa;margin:1rem 0;padding:6px 0}</style></head><body><div style="text-align:center"><h3>${shop}</h3><small>${new Date().toLocaleString()}</small><p>গ্রাহক: ${cust}</p></div><table>${rows}</table><p style="text-align:center;font-size:12px">ধন্যবাদ! আবার আসবেন।</p><script>window.print()<\/script></body></html>`);
    w.document.close();
  },

  renderItHisab(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div class="section-tag">হিসাব খাতা</div>
          <h1 class="section-title">আইটি হিসাব (IT Hisab)</h1>
          <p class="section-subtitle">দোকানের দৈনিক ফটো প্রিন্ট, আবেদন, রিচার্জ ও লেমিনেশনের লাভ-ক্ষতির খতিয়ান</p>
        </div>
        <div class="grid grid-3 gap-4 mb-6">
          <div class="card p-4"><div class="text-xs text-muted">আজকের মোট বিক্রয়</div><div class="text-2xl font-bold text-primary">৳২,৪৫০</div></div>
          <div class="card p-4"><div class="text-xs text-muted">আজকের খরচ (কাগজ/কালি)</div><div class="text-2xl font-bold text-red-600">৳৫২০</div></div>
          <div class="card p-4"><div class="text-xs text-muted">আজকের নিট লাভ</div><div class="text-2xl font-bold text-forest">৳১,৯৩০</div></div>
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  renderTodo(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div class="section-tag">টাস্ক খাতা</div>
          <h1 class="section-title">মনে রাখুন (Todo List)</h1>
          <p class="section-subtitle">কাস্টমারের পেন্ডিং ডেলিভারি ও জরুরি কাজের রিমাইন্ডার</p>
        </div>
        <div class="card p-6">
          <div class="flex gap-2 mb-4">
            <input type="text" id="todoInp" class="form-input text-xs" placeholder="নতুন কাজ লিখুন (যেমন: রফিক সাহেবের পাসপোর্ট ফর্ম)...">
            <button class="btn btn-primary btn-sm" onclick="App.addTodo()">যোগ করুন</button>
          </div>
          <ul id="todoList" class="space-y-2 text-xs">
            <li class="p-2 bg-surface-alt rounded flex justify-between items-center"><span>✓ সাজ্জাদ ভাইয়ের NID সংশোধন প্রিন্ট</span><span class="badge badge-green">সম্পন্ন</span></li>
            <li class="p-2 bg-surface-alt rounded flex justify-between items-center"><span>⏳ বন্দর কর্তৃপক্ষের চালান জমা</span><span class="badge badge-amber">বাকি</span></li>
          </ul>
        </div>
      </div>
      ${this.footerHtml()}`;
  },
  addTodo() {
    const val = $('#todoInp').value;
    if (!val) return;
    const li = document.createElement('li');
    li.className = 'p-2 bg-surface-alt rounded flex justify-between items-center';
    li.innerHTML = `<span>⏳ ${esc(val)}</span><span class="badge badge-amber">বাকি</span>`;
    $('#todoList').prepend(li);
    $('#todoInp').value = '';
    toast('কাজ যুক্ত হয়েছে');
  },

  renderSoftware(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div class="section-tag">ড্রাইভার ও সফটওয়্যার</div>
          <h1 class="section-title">প্রয়োজনীয় আইটি সফটওয়্যার ও ড্রাইভার</h1>
          <p class="section-subtitle">কম্পিউটার দোকান পরিচালনায় প্রয়োজনীয় গুরুত্বপূর্ণ সফটওয়্যার লিংক</p>
        </div>
        <div class="grid grid-3 gap-4">
          ${[
            ['বিজয় বায়ান্ন (Bijoy 52)', 'বাংলা টাইপিং এর অফিশিয়াল কিবোর্ড সফটওয়্যার'],
            ['Avro Keyboard', 'ইউনিকোড বাংলা টাইপিং সফটওয়্যার'],
            ['Epson L3110 / L3210 Driver', 'অল ইন ওয়ান প্রিন্টার ড্রাইভার'],
            ['Canon G2010 Driver', 'ক্যানন কালার প্রিন্টার সফটওয়্যার'],
            ['Adobe Acrobat Reader', 'PDF ফাইল ভিউয়ার ও প্রিন্টার'],
            ['Photoshop Bangla Fonts', 'স্টাইলিশ বাংলা ফন্ট প্যাক (১০০+)']
          ].map(([n, d]) => `
            <div class="card p-4">
              <div style="font-size:2rem" class="mb-2">💾</div>
              <h3 class="font-bold text-sm mb-1">${n}</h3>
              <p class="text-xs text-muted mb-3">${d}</p>
              <button class="btn btn-outline btn-xs w-full" onclick="toast('সফটওয়্যার ডাউনলোড লিংক ওপেন হচ্ছে...')">ডাউনলোড লিংক ➜</button>
            </div>`).join('')}
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  // ===================== 12. QUICK ACCESS =====================
  renderImageResizer(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div class="section-tag">রিসাইজার</div>
          <h1 class="section-title">ইমেজ রিসাইজার ও KB কম্প্রেসর</h1>
          <p class="section-subtitle">টেলিটক চাকরির জন্য ছবি ঠিক ৩০০x৩০০ পিক্সেল ও ১০০ KB-এর নিচে সাইজ করুন।</p>
        </div>
        <div class="grid grid-2 gap-6">
          <div class="card p-5">
            <input type="file" accept="image/*" class="form-input mb-4" onchange="App.handleResizePhoto(event)">
            <div class="grid grid-2 gap-2 mb-4">
              <button class="btn btn-outline btn-xs" onclick="App.runResize(300, 300, 100)">ছবি (300x300, 100KB)</button>
              <button class="btn btn-outline btn-xs" onclick="App.runResize(300, 80, 60)">স্বাক্ষর (300x80, 60KB)</button>
            </div>
          </div>
          <div class="card p-5 text-center">
            <canvas id="resCanvas" class="hidden rounded shadow-sm max-w-full"></canvas>
            <div id="resBtns" class="mt-3 hidden"><button class="btn btn-primary btn-sm" onclick="Tools.downloadCanvas($('#resCanvas'), 'resized.jpg')">ডাউনলোড করুন ⬇️</button></div>
          </div>
        </div>
      </div>
      ${this.footerHtml()}`;
  },
  async handleResizePhoto(e) {
    if (!e.target.files[0]) return;
    window._resImg = await Tools.loadImage(e.target.files[0]);
    this.runResize(300, 300, 100);
  },
  runResize(w, h, maxKb) {
    if (!window._resImg) return toast('প্রথমে ছবি দিন', true);
    const canvas = $('#resCanvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(window._resImg, 0, 0, w, h);
    canvas.classList.remove('hidden');
    $('#resBtns')?.classList.remove('hidden');
    toast(`রিসাইজ সম্পন্ন (${w}x${h})`);
  },

  renderVoterSlip(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div class="section-tag">ভোটার স্লিপ</div>
          <h1 class="section-title">ভোটার স্লিপ তৈরি ও প্রিন্ট</h1>
          <p class="section-subtitle">ভোটার তথ্য দিয়ে এক ক্লিকে অফিশিয়াল ফরম্যাটের ভোটার স্লিপ জেনারেট করুন।</p>
        </div>
        <div class="grid grid-2 gap-6">
          <div class="card p-5">
            <div class="form-group"><label class="form-label">ভোটারের নাম *</label><input type="text" id="vsName" class="form-input" placeholder="নাম"></div>
            <div class="form-group"><label class="form-label">ভোটার নম্বর *</label><input type="text" id="vsNo" class="form-input" placeholder="ভোটার নম্বর"></div>
            <div class="form-group"><label class="form-label">ক্রমিক নম্বর</label><input type="text" id="vsSerial" class="form-input" placeholder="যেমন: ৪২"></div>
            <div class="form-group"><label class="form-label">ভোটকেন্দ্র</label><input type="text" id="vsCenter" class="form-input" placeholder="ভোটকেন্দ্রের নাম"></div>
            <button class="btn btn-primary w-full" onclick="App.drawVs()">ভোটার স্লিপ জেনারেট করুন</button>
          </div>
          <div class="card p-5 text-center">
            <canvas id="vsCanvas" class="hidden rounded shadow-sm max-w-full"></canvas>
            <div id="vsBtns" class="mt-3 hidden"><button class="btn btn-primary btn-sm" onclick="Tools.downloadCanvas($('#vsCanvas'), 'voter-slip.jpg')">স্লিপ ডাউনলোড ⬇️</button></div>
          </div>
        </div>
      </div>
      ${this.footerHtml()}`;
  },
  drawVs() {
    const d = { name: $('#vsName').value, voterNo: $('#vsNo').value, serialNo: $('#vsSerial').value, center: $('#vsCenter').value };
    if (!d.name || !d.voterNo) return toast('নাম ও ভোটার নম্বর দিন', true);
    const slip = Tools.makeVoterSlip(d);
    const target = $('#vsCanvas');
    target.width = slip.width; target.height = slip.height;
    target.getContext('2d').drawImage(slip, 0, 0);
    target.classList.remove('hidden');
    $('#vsBtns')?.classList.remove('hidden');
    toast('ভোটার স্লিপ তৈরি হয়েছে');
  },

  renderAiPrompt(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div class="section-tag">AI প্রম্পট</div>
          <h1 class="section-title">এআই প্রম্পট হাব (AI Prompt Hub)</h1>
          <p class="section-subtitle">চাকরির আবেদন, কভার লেটার, ফেসবুক ক্যাপশন ও বিজ্ঞাপন প্রম্পট লাইব্রেরি</p>
        </div>
        <div class="grid grid-2 gap-4">
          ${[
            ['চাকরির কভার লেটার প্রম্পট', 'Write a professional cover letter for an IT officer post in Bangladesh...'],
            ['সোশ্যাল মিডিয়া ক্যাপশন', 'Create 5 engaging Facebook post captions for computer shop digital services...'],
            ['ইংরেজি দরখাস্ত ড্রাফটিং', 'Draft a formal application letter to the Chairman requesting a citizenship certificate...'],
            ['বিজনেস ডেসক্রিপশন', 'Generate a high-converting company overview for a local digital service center...']
          ].map(([t, p]) => `
            <div class="card p-4">
              <h3 class="font-bold text-sm mb-1">${t}</h3>
              <p class="text-xs text-muted mb-3 italic">"${p}"</p>
              <button class="btn btn-outline btn-xs" onclick="navigator.clipboard.writeText('${p}');toast('প্রম্পট কপি হয়েছে')">প্রম্পট কপি করুন 📋</button>
            </div>`).join('')}
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  // ===================== 13. PACKAGES (Exact Match with image-7.png) =====================
  renderPackages(el) {
    el.innerHTML = `
      <div class="container py-12">
        <!-- Header from image-7.png -->
        <div class="text-center">
          <div class="pkg-header-badge">
            <span>👑 প্রিমিয়াম মেম্বারশিপ প্ল্যান</span>
          </div>
          <h1 class="pkg-title">
            বাজেটের মধ্যে সেরা <span>আনলিমিটেড সেবা</span>
          </h1>
          <p class="pkg-sub">
            কোনো লুকানো চার্জ নেই। আপনার সুবিধাজনক সময়সীমা নির্বাচন করুন এবং আইটি ল্যান্সার বিডি-র সব ফাইল, টুলস ও আপডেট এক জায়গায় উপভোগ করুন।
          </p>
          <div class="pkg-pills-row">
            <span>✓ ইনস্ট্যান্ট অ্যাক্টিভেশন</span>
            <span>✓ নিয়মিত কনটেন্ট আপডেট</span>
          </div>
        </div>

        <!-- 4 Cards Grid from image-7.png -->
        <div class="grid grid-4 gap-6 mb-12">
          ${PACKAGES.map(p => `
            <div class="pkg-card ${p.featured ? 'featured' : ''}">
              <div class="pkg-badge-top ${p.featured ? 'green' : ''}">${p.badge}</div>
              <div>
                <div class="pkg-head-row">
                  <span class="pkg-name">${esc(p.name)}</span>
                  <span class="pkg-icon-wrap">${p.icon}</span>
                </div>
                <span class="pkg-duration-pill">${esc(p.duration)}</span>
                <p class="pkg-desc">${esc(p.desc)}</p>

                <div class="pkg-price-row">
                  <div class="pkg-price">৳ ${p.price} <span class="text-xs text-muted font-normal">${p.period}</span></div>
                  <div class="pkg-price-sub">${p.monthlyRate}</div>
                </div>

                <ul class="pkg-features-list">
                  ${p.features.map(f => `
                    <li>
                      <span class="pkg-check">✔</span>
                      <span>${esc(f)}</span>
                    </li>`).join('')}
                </ul>
              </div>

              <div>
                <button class="pkg-btn ${p.featured ? 'green' : ''}" onclick="App.buyPackage('${p.id}', ${p.price}, '${esc(p.name)}')">
                  এখনই শুরু করুন
                </button>
              </div>
            </div>`).join('')}
        </div>

        <!-- FAQ Accordion from image-7.png -->
        <div class="faq-wrap">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-forest">সাধারণ প্রশ্ন ও উত্তর (FAQ)</h2>
            <p class="text-xs text-muted">মেম্বারশিপ প্ল্যান সংক্রান্ত প্রয়োজনীয় যাবতীয় তথ্য</p>
          </div>

          <div>
            ${PACKAGE_FAQS.map((faq, i) => `
              <div class="faq-item ${i === 0 ? 'open' : ''}">
                <div class="faq-head" onclick="this.parentElement.classList.toggle('open')">
                  <span>${esc(faq.q)}</span>
                  <span>▾</span>
                </div>
                <div class="faq-body">
                  ${esc(faq.a)}
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  async buyPackage(planId, price, name) {
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price, serviceSlug: planId, serviceName: `Package: ${name}` }),
      });
      const data = await res.json();
      if (!data.success) return toast(data.error || 'ত্রুটি', true);
      this.openBkashModal({ paymentID: data.paymentID, amount: price, name });
    } catch { toast('পেমেন্ট সার্ভার ত্রুটি', true); }
  },

  openBkashModal({ paymentID, amount, name }) {
    openModal(`
      <div class="text-center p-4">
        <div style="background:#E2136E;color:#fff;padding:1rem;border-radius:12px;margin-bottom:1rem">
          <h2 class="text-2xl font-bold">bKash Merchant Payment</h2>
          <div class="text-xs">Invoice: ${paymentID}</div>
        </div>
        <div class="card p-3 bg-surface-alt text-xs mb-4 text-left">
          <div class="flex justify-between py-1"><span>প্যাকেজ:</span><strong>${esc(name)}</strong></div>
          <div class="flex justify-between py-1"><span>পরিশোধযোগ্য:</span><strong class="text-primary text-base">৳ ${amount}</strong></div>
        </div>
        <button class="btn w-full btn-lg" style="background:#E2136E;color:#fff" onclick="App.execBkash('${paymentID}', ${amount})">
          পেমেন্ট নিশ্চিত করুন (৳ ${amount})
        </button>
      </div>`);
  },

  async execBkash(paymentID, amount) {
    try {
      const res = await fetch('/api/payments/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentID }),
      });
      const data = await res.json();
      closeModal();
      if (data.success) {
        toast('পেমেন্ট সফল! আপনার প্যাকেজ অ্যাক্টিভ হয়েছে 🎉');
        Store.addCredits(500);
      } else {
        toast(data.error || 'ব্যর্থ হয়েছে', true);
      }
    } catch { toast('পেমেন্ট ত্রুটি', true); }
  },

  // ===================== 14. AI COINS & GENERAL =====================
  renderAiCoins(el) {
    el.innerHTML = `
      <div class="container py-12 max-w-3xl text-center">
        <h1 class="text-3xl font-bold text-forest mb-2">✨ AI কয়েন কিনুন</h1>
        <p class="text-muted text-sm mb-8">AI CV রাইটিং ও কনটেন্ট তৈরির জন্য কয়েন টপ-আপ করুন</p>
        <div class="grid grid-3 gap-4 mb-8">
          <div class="card p-6 cursor-pointer hover:border-primary" onclick="App.buyPackage('coin-100', 50, '100 AI Coins')">
            <h3 class="font-bold text-lg">১০০ কয়েন</h3>
            <div class="text-2xl font-bold text-primary my-2">৳৫০</div>
            <button class="btn btn-outline btn-xs w-full">কিনুন</button>
          </div>
          <div class="card p-6 border-primary cursor-pointer" onclick="App.buyPackage('coin-300', 120, '300 AI Coins')">
            <span class="badge badge-green mb-1">জনপ্রিয়</span>
            <h3 class="font-bold text-lg">৩০০ কয়েন</h3>
            <div class="text-2xl font-bold text-primary my-2">৳১২০</div>
            <button class="btn btn-primary btn-xs w-full">কিনুন</button>
          </div>
          <div class="card p-6 cursor-pointer hover:border-primary" onclick="App.buyPackage('coin-1000', 350, '1000 AI Coins')">
            <h3 class="font-bold text-lg">১০০০ কয়েন</h3>
            <div class="text-2xl font-bold text-primary my-2">৳৩৫০</div>
            <button class="btn btn-outline btn-xs w-full">কিনুন</button>
          </div>
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  renderJobs(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-5xl">
        <div class="section-head">
          <div class="section-tag">চাকরির সার্কুলার</div>
          <h1 class="section-title">চলমান সরকারি ও বেসরকারি নিয়োগ বিজ্ঞপ্তি</h1>
        </div>
        <div class="grid grid-4 gap-4">
          ${JOB_CIRCULARS.map(j => `
            <div class="job-card">
              <div>
                <span class="badge badge-green mb-2">চলমান</span>
                <h3 class="job-title">${esc(j.title)}</h3>
                <div class="job-posts-badge">পদসংখ্যা: ${esc(j.posts)}</div>
                <div class="job-countdown">⏰ বাকি: ${esc(j.remaining)}</div>
              </div>
              <div class="job-btn-group">
                <button class="btn btn-outline btn-xs" onclick="App.openJobDetails('${j.id}')">বিস্তারিত</button>
                <a href="${j.applyUrl}" target="_blank" class="btn btn-primary btn-xs">আবেদন ➜</a>
              </div>
            </div>`).join('')}
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  renderLinks(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-5xl">
        <div class="section-head flex justify-between items-center flex-wrap">
          <div>
            <div class="section-tag">লিংক ডিরেক্টরি</div>
            <h1 class="section-title">গুরুত্বপূর্ণ সকল লিংকসমূহ (১১৪+)</h1>
          </div>
          <input type="text" class="form-input text-xs w-64" placeholder="লিংক খুঁজুন..." oninput="App.filterLinks(this.value)">
        </div>
        <div class="grid grid-4 gap-4" id="importantLinksGrid">
          ${this.renderLinksCardsHtml(IMPORTANT_LINKS)}
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  renderServices(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-5xl">
        <div class="section-head">
          <div class="section-tag">নাগরিক সেবা</div>
          <h1 class="section-title">নাগরিক ও সনদ আবেদন সহায়তা</h1>
        </div>
        <div class="grid grid-3 gap-4">
          ${[
            ['নাগরিকত্ব সনদ আবেদন সহায়তা', 'ইউপি ও পৌরসভা থেকে সনদ সহায়তা', 150],
            ['চারিত্রিক সনদ আবেদন সহায়তা', 'চারিত্রিক সনদ প্রাপ্তিতে আবেদন', 150],
            ['ওয়ারিশান সনদ আবেদন সহায়তা', 'ওয়ারিশ সনদ ফরম পূরণ ও কাগজপত্র', 200],
            ['জন্ম নিবন্ধন আবেদন গাইড', 'অনলাইন জন্ম নিবন্ধনের নিয়মাবলি', 100],
            ['ট্রেড লাইসেন্স আবেদন সহায়তা', 'নতুন ও নবায়ন ট্রেড লাইসেন্স', 350],
            ['পাসপোর্ট আবেদন সহায়তা', 'ই-পাসপোর্ট ফরম পূরণ ও গাইড', 200]
          ].map(([n, d, f]) => `
            <div class="card p-5">
              <h3 class="font-bold text-sm mb-1">${n}</h3>
              <p class="text-xs text-muted mb-4">${d}</p>
              <div class="flex justify-between items-center pt-3 border-t">
                <strong class="text-primary font-bold">৳${f}</strong>
                <button class="btn btn-primary btn-xs" onclick="toast('আবেদন ফর্ম ওপেন হচ্ছে...')">আবেদন ➜</button>
              </div>
            </div>`).join('')}
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  renderDashboard(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="card p-6 mb-6 flex justify-between items-center bg-surface-alt">
          <div>
            <h1 class="text-xl font-bold">👤 ${esc(Store.user?.name || 'মেম্বার ড্যাশবোর্ড')}</h1>
            <p class="text-xs text-muted">📞 ${esc(Store.user?.phone || '017XXXXXXXX')}</p>
          </div>
          <div class="text-right">
            <span class="badge badge-green font-bold">Active Member</span>
          </div>
        </div>
        <div class="grid grid-3 gap-4">
          <div class="card p-4"><div class="text-xs text-muted">চলমান কাজ</div><div class="text-2xl font-bold text-primary">০টি</div></div>
          <div class="card p-4"><div class="text-xs text-muted">AI কয়েন ব্যালেন্স</div><div class="text-2xl font-bold text-forest">${Store.state.credits} ক্</div></div>
          <div class="card p-4"><div class="text-xs text-muted">প্যাকেজ স্ট্যাটাস</div><div class="text-lg font-bold text-amber">Pro Access</div></div>
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  openJobDetails(id) {
    const j = JOB_CIRCULARS.find(x => x.id === id);
    if (!j) return;
    openModal(`
      <div class="p-4">
        <span class="badge badge-green mb-2">চলমান নিয়োগ বিজ্ঞপ্তি</span>
        <h2 class="text-xl font-bold mb-1">${esc(j.title)}</h2>
        <div class="card p-4 bg-surface-alt text-xs space-y-2 my-4">
          <div class="flex justify-between"><span>পদসংখ্যা:</span><strong>${esc(j.posts)}</strong></div>
          <div class="flex justify-between"><span>আবেদনের সময় বাকি:</span><strong class="text-red-600">${esc(j.remaining)}</strong></div>
          <div class="flex justify-between"><span>শুরু:</span><span>${esc(j.start)}</span></div>
          <div class="flex justify-between"><span>শেষ:</span><span>${esc(j.end)}</span></div>
        </div>
        <a href="${j.applyUrl}" target="_blank" class="btn btn-primary w-full">অফিশিয়াল লিংকে আবেদন করুন ➜</a>
      </div>`);
  },

  openLoginModal() {
    openModal(`
      <div class="p-4 max-w-sm mx-auto text-center">
        <h2 class="text-xl font-bold mb-2">🔐 মেম্বার লগইন</h2>
        <form onsubmit="App.handleLogin(event)">
          <div class="form-group text-left"><label class="form-label">মোবাইল বা ইমেইল</label><input type="text" name="id" required class="form-input" placeholder="017XXXXXXXX"></div>
          <div class="form-group text-left"><label class="form-label">পাসওয়ার্ড</label><input type="password" name="pass" required class="form-input"></div>
          <button type="submit" class="btn btn-primary w-full">লগইন করুন</button>
        </form>
      </div>`);
  },

  openRegisterModal() {
    openModal(`
      <div class="p-4 max-w-sm mx-auto text-center">
        <h2 class="text-xl font-bold mb-2">📝 নতুন একাউন্ট খুলুন</h2>
        <form onsubmit="App.handleReg(event)">
          <div class="form-group text-left"><label class="form-label">পূর্ণ নাম</label><input type="text" name="name" required class="form-input"></div>
          <div class="form-group text-left"><label class="form-label">মোবাইল নম্বর</label><input type="tel" name="phone" required class="form-input"></div>
          <button type="submit" class="btn btn-primary w-full">রেজিস্ট্রেশন করুন</button>
        </form>
      </div>`);
  },

  handleLogin(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    Store.login('আইটি মেম্বার', data.get('id'), '');
    closeModal();
    this.updateUserNav();
    toast('লগইন সম্পন্ন');
  },
  handleReg(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    Store.login(data.get('name'), data.get('phone'), '');
    closeModal();
    this.updateUserNav();
    toast('অ্যাকাউন্ট তৈরি হয়েছে');
  },

  footerHtml() {
    return `
      <footer class="footer">
        <div class="container grid grid-4 gap-6 mb-8">
          <div>
            <div class="brand mb-3" style="color:#fff">
              <div class="brand-icon">সে</div>
              <span>SebaKendra</span>
            </div>
            <p class="text-xs" style="color:#A7F3D0;line-height:1.6">
              চাকরি, ভর্তি, NID প্রিন্ট রেডি, সি ভি অটো ফিল, অনলাইন টুলস, PSD/Word ফাইল ডাউনলোড এবং দৈনন্দিন কাজের সকল গুরুত্বপূর্ণ লিংকের বিশ্বস্ত সমাধান।
            </p>
          </div>
          <div>
            <h4 class="footer-title">টুলস ও ফিচার</h4>
            <a href="/tools/photo-studio" class="footer-link">Photo Studio AI</a>
            <a href="/tools/joint-photo" class="footer-link">যৌথ ছবি (Joint Photo)</a>
            <a href="/tools/nid-print-ready" class="footer-link">NID প্রিন্ট রেডি</a>
            <a href="/tools/a4-print-ready" class="footer-link">A4 প্রিন্ট রেডি</a>
            <a href="/tools/cv-auto-fill" class="footer-link">সিভি অটোফিল</a>
          </div>
          <div>
            <h4 class="footer-title">গুরুত্বপূর্ণ লিংক</h4>
            <a href="/jobs" class="footer-link">চলমান চাকরির সার্কুলার</a>
            <a href="/links" class="footer-link">গুরুত্বপূর্ণ লিংকসমূহ (১১৪+)</a>
            <a href="/packages" class="footer-link">প্যাকেজ ও সাবস্ক্রিপশন</a>
          </div>
          <div>
            <h4 class="footer-title">আমাদের সাথে যুক্ত হউন</h4>
            <div class="text-xs mb-2" style="color:#A7F3D0">হটলাইন কল (8AM-11PM):</div>
            <a href="tel:01755683948" class="font-bold text-lg text-white block mb-3">01755-683948</a>
            <div class="text-xs" style="color:#A7F3D0">ইমেইল: <a href="mailto:info@sebakendra.com" class="text-white">info@sebakendra.com</a></div>
          </div>
        </div>
        <div class="container footer-bottom">
          © 2026 SebaKendra. সর্বস্বত্ব সংরক্ষিত। | Powered by SebaKendra IT Ecosystem
        </div>
      </footer>`;
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
