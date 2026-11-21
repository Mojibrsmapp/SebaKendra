// SebaKendra Application Engine & SPA Router
// IT Lancer BD Inspired UI & Workflow: Hero Banner, Job Circulars, 114+ Links,
// Working Photo Studio, Joint Photo (যৌথ ছবি), NID Print Ready, Voter Slip, bKash & MySQL

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

    // Navigation highlight
    $$('.nav-link').forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === full);
    });

    if (full === '/' || full === '') return this.renderHome(appEl);
    if (full === '/services') return this.renderServices(appEl);
    if (full.startsWith('/service/')) {
      const slug = full.replace('/service/', '');
      return this.renderServiceDetail(appEl, slug);
    }
    if (full === '/tools' || full === '/tools/photo-studio' || full === '/tools/ai-photo-studio') {
      return this.renderPhotoStudio(appEl);
    }
    if (full === '/tools/joint-photo') return this.renderJointPhoto(appEl);
    if (full === '/tools/nid-print-ready') return this.renderNidPrintReady(appEl);
    if (full === '/tools/a4-print-ready') return this.renderA4PrintReady(appEl);
    if (full === '/tools/make-voter-slip') return this.renderVoterSlip(appEl);
    if (full === '/tools/auto-invoice' || full === '/tools/it-hisab') return this.renderAutoInvoice(appEl);
    if (full === '/tools/cv-auto-fill') return this.renderCvAutofill(appEl);
    if (full === '/jobs' || full.startsWith('/jobs/')) return this.renderJobs(appEl);
    if (full === '/links') return this.renderLinks(appEl);
    if (full === '/packages' || full === '/pricing' || full === '/premium') return this.renderPricing(appEl);
    if (full === '/ai-coins' || full === '/ai-tools') return this.renderAiCoins(appEl);
    if (full === '/dashboard') return this.renderDashboard(appEl);
    if (full === '/admin') return this.renderAdmin(appEl);
    if (full === '/verify') return this.renderVerify(appEl);

    // Fallback Home
    this.renderHome(appEl);
  },

  bindEvents() {
    // Intercept clicks on internal links
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (href && href.startsWith('/') && !href.startsWith('//') && !a.getAttribute('target')) {
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

  // ===================== 1. HOMEPAGE (IT Lancer BD Style) =====================
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
              <button class="btn btn-primary btn-lg" onclick="App.navigate('/tools')">
                ⚡ এক্সপ্লোর টুলস
              </button>
              <button class="btn btn-outline btn-lg" onclick="App.navigate('/links')">
                🔗 গুরুত্বপূর্ণ লিংক
              </button>
              <button class="btn btn-amber btn-lg" onclick="App.navigate('/packages')">
                👑 প্রিমিয়াম অ্যাক্সেস
              </button>
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
                  <div class="job-countdown">
                    <span>⏰</span>
                    <span>বাকি: ${esc(j.remaining)}</span>
                  </div>
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

      <!-- POPULAR ONLINE TOOLS (অনলাইন সার্ভিসেস) -->
      <section class="section section-alt">
        <div class="container">
          <div class="section-head text-center">
            <div class="section-tag">অনলাইন সার্ভিসেস</div>
            <h2 class="section-title">জনপ্রিয় অনলাইন টুলস</h2>
            <p class="section-subtitle">ব্রাউজারে সরাসরি কাজ সম্পন্ন করুন — কোনো সফটওয়্যার ইনস্টলেশনের প্রয়োজন নেই</p>
          </div>

          <div class="grid grid-4 gap-4 mb-6">
            <div class="tool-grid-card" onclick="App.navigate('/tools/photo-studio')">
              <span class="tool-grid-icon">📸</span>
              <div class="tool-grid-title">Photo Studio AI</div>
              <div class="tool-grid-desc">পাসপোর্ট ও আইডি ছবি তৈরি</div>
            </div>
            <div class="tool-grid-card" onclick="App.navigate('/tools/joint-photo')">
              <span class="tool-grid-icon">👥</span>
              <div class="tool-grid-title">যৌথ ছবি (Joint Photo)</div>
              <div class="tool-grid-desc">দুই জনের ছবি পাশাপাশি যুক্ত করুন</div>
            </div>
            <div class="tool-grid-card" onclick="App.navigate('/tools/nid-print-ready')">
              <span class="tool-grid-icon">🪪</span>
              <div class="tool-grid-title">NID প্রিন্ট রেডি</div>
              <div class="tool-grid-desc">মোবাইলে তোলা NID ৫ মিনিটে প্রিন্ট</div>
            </div>
            <div class="tool-grid-card" onclick="App.navigate('/tools/a4-print-ready')">
              <span class="tool-grid-icon">🖨️</span>
              <div class="tool-grid-title">A4 প্রিন্ট রেডি</div>
              <div class="tool-grid-desc">৪, ৮, ১২, ২৪ কপি ফটো শিট</div>
            </div>
            <div class="tool-grid-card" onclick="App.navigate('/tools/make-voter-slip')">
              <span class="tool-grid-icon">🗳️</span>
              <div class="tool-grid-title">ভোটার স্লিপ তৈরি</div>
              <div class="tool-grid-desc">QR কোড সহ ভোটার স্লিপ প্রিন্ট</div>
            </div>
            <div class="tool-grid-card" onclick="App.navigate('/tools/cv-auto-fill')">
              <span class="tool-grid-icon">📄</span>
              <div class="tool-grid-title">সিভি অটোফিল</div>
              <div class="tool-grid-desc">মিনিটেই প্রফেশনাল CV তৈরি</div>
            </div>
            <div class="tool-grid-card" onclick="App.navigate('/tools/auto-invoice')">
              <span class="tool-grid-icon">🧾</span>
              <div class="tool-grid-title">অটো ইনভয়েস</div>
              <div class="tool-grid-desc">ক্যাশ মেমো ও দোকানের বিল</div>
            </div>
            <div class="tool-grid-card" onclick="App.navigate('/services')">
              <span class="tool-grid-icon">🏛️</span>
              <div class="tool-grid-title">নাগরিক সেবা (৩০+)</div>
              <div class="tool-grid-desc">সনদ ও সরকারি আবেদন সহায়তা</div>
            </div>
          </div>

          <div class="text-center">
            <button class="btn btn-outline" onclick="App.navigate('/tools')">See More Tools (23+) ➜</button>
          </div>
        </div>
      </section>

      <!-- IMPORTANT LINKS (গুরুত্বপূর্ণ লিংকসমূহ ১১৪+) -->
      <section class="section" id="links-section">
        <div class="container">
          <div class="section-head flex justify-between items-center flex-wrap">
            <div>
              <div class="section-tag">গুরুত্বপূর্ণ লিংকসমূহ</div>
              <h2 class="section-title">প্রয়োজনীয় সকল অফিশিয়াল ওয়েবসাইটের সরাসরি লিংক</h2>
              <p class="section-subtitle">সকল সরকারি পোর্টাল, শিক্ষা বোর্ড, পাসপোর্ট, ভিসা ও সেবা লিংক</p>
            </div>
            <div class="w-72">
              <input type="text" id="linkFilterInput" class="form-input text-xs" placeholder="লিংক খুঁজুন (যেমন: পাসপোর্ট, NID, রেজাল্ট)..." oninput="App.filterLinks(this.value)">
            </div>
          </div>

          <!-- Category Pills -->
          <div class="links-pill-container" id="linkCategoriesPills">
            ${IMPORTANT_LINK_CATEGORIES.map((c, i) => `
              <button class="link-pill ${i === 0 ? 'active' : ''}" onclick="App.selectLinkCategory('${c.id}', this)">
                ${esc(c.name)} ${c.count ? `(${c.count})` : ''}
              </button>`).join('')}
          </div>

          <!-- Links Grid -->
          <div class="grid grid-4 gap-4" id="importantLinksGrid">
            ${this.renderLinksCardsHtml(IMPORTANT_LINKS)}
          </div>

          <div class="text-center mt-6">
            <button class="btn btn-outline" onclick="App.navigate('/links')">আরও লিংক দেখুন (১১৪+) ➜</button>
          </div>
        </div>
      </section>

      <!-- IT SHOP MEMBERS (আইটি সপ সদস্যবৃন্দ) -->
      <section class="section section-alt">
        <div class="container">
          <div class="section-head text-center">
            <div class="section-tag">আইটি সপ সদস্যবৃন্দ</div>
            <h2 class="section-title">সারাদেশের এক্টিভ আইটি শপারদের তালিকা</h2>
            <p class="section-subtitle">সেবাকেন্দ্র ও আইটি ল্যান্সার প্ল্যাটফর্মের সাথে যুক্ত সফল ডিজিটাল উদ্যোক্তারা</p>
          </div>

          <div class="grid grid-6 gap-3 mb-6">
            ${MEMBERS.map(m => `
              <div class="member-card">
                <div class="member-avatar">${m.username.charAt(0).toUpperCase()}</div>
                <div class="badge ${m.badge === 'PRO' ? 'badge-pro' : 'badge-green'} mb-1">${m.badge}</div>
                <div class="font-bold text-xs truncate">${esc(m.username)}</div>
                <div class="text-xs text-muted truncate">📍 ${esc(m.location)}</div>
              </div>`).join('')}
          </div>

          <div class="text-center">
            <button class="btn btn-primary" onclick="App.openRegisterModal()">আপনিও আইটি শপ মেম্বার হন 🤝</button>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      ${this.footerHtml()}`;
  },

  renderLinksCardsHtml(links) {
    if (!links.length) {
      return '<div class="col-span-2 text-center py-8 text-muted">কোনো লিংক পাওয়া যায়নি</div>';
    }
    return links.map(l => `
      <div class="link-card">
        <div>
          <div class="flex justify-between items-center mb-2">
            <span class="badge badge-green text-xs">${esc(l.cat)}</span>
            <span class="text-xs text-muted">👁️ ${l.clicks || 50}</span>
          </div>
          <h3 class="font-bold text-sm mb-1">${esc(l.title)}</h3>
          <p class="text-xs text-muted mb-4">${esc(l.desc)}</p>
        </div>
        <a href="${l.url}" target="_blank" rel="noopener" class="btn btn-outline btn-xs w-full">
          ভিজিট করুন ➜
        </a>
      </div>`).join('');
  },

  filterLinks(q) {
    q = (q || '').toLowerCase().trim();
    const filtered = IMPORTANT_LINKS.filter(l =>
      l.title.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q) || l.cat.toLowerCase().includes(q)
    );
    $('#importantLinksGrid').innerHTML = this.renderLinksCardsHtml(filtered);
  },

  selectLinkCategory(catId, btn) {
    $$('.link-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filtered = catId === 'all' ? IMPORTANT_LINKS : IMPORTANT_LINKS.filter(l => l.cat === catId);
    $('#importantLinksGrid').innerHTML = this.renderLinksCardsHtml(filtered);
  },

  openJobDetails(id) {
    const j = JOB_CIRCULARS.find(x => x.id === id);
    if (!j) return;
    openModal(`
      <div class="p-4">
        <span class="badge badge-green mb-2">চলমান নিয়োগ বিজ্ঞপ্তি</span>
        <h2 class="text-xl font-bold mb-1">${esc(j.title)}</h2>
        <p class="text-xs text-muted mb-4">${esc(j.org)}</p>

        <div class="card p-4 bg-surface-alt text-xs space-y-2 mb-4">
          <div class="flex justify-between"><span>পদসংখ্যা:</span><strong>${esc(j.posts)}</strong></div>
          <div class="flex justify-between"><span>আবেদনের সময় বাকি:</span><strong class="text-red-600">${esc(j.remaining)}</strong></div>
          <div class="flex justify-between"><span>আবেদন শুরু:</span><span>${esc(j.start)}</span></div>
          <div class="flex justify-between"><span>আবেদন শেষ:</span><span>${esc(j.end)}</span></div>
        </div>

        <div class="flex gap-2">
          <a href="${j.applyUrl}" target="_blank" class="btn btn-primary flex-1">অফিশিয়াল পোর্টালে আবেদন ➜</a>
          <button class="btn btn-outline" onclick="closeModal()">বন্ধ করুন</button>
        </div>
      </div>`);
  },

  // ===================== 2. PHOTO STUDIO =====================
  renderPhotoStudio(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-5xl">
        <div class="section-head">
          <div class="section-tag">ডিজিটাল ফটো স্টুডিও</div>
          <h1 class="section-title">পাসপোর্ট ও NID ছবি এডিটর</h1>
          <p class="section-subtitle">ছবি আপলোড করুন, মাপ নির্বাচন করুন, ব্যাকগ্রাউন্ড পরিবর্তন করুন ও A4 প্রিন্ট শিট তৈরি করুন।</p>
        </div>

        <div class="grid grid-3 gap-6">
          <!-- Control Panel -->
          <div class="card p-5">
            <h3 class="font-bold text-sm mb-2">১. ছবি আপলোড করুন</h3>
            <input type="file" id="photoInput" accept="image/*" class="form-input mb-4" onchange="App.handleSinglePhoto(event)">

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
              <button class="btn btn-xs" style="background:#ffffff;border:1px solid #ccc" onclick="App.setPhotoBg('#ffffff')">সাদা</button>
              <button class="btn btn-xs" style="background:#0F9D58;color:#fff" onclick="App.setPhotoBg('#0F9D58')">গ্রিন</button>
              <button class="btn btn-xs" style="background:#2563EB;color:#fff" onclick="App.setPhotoBg('#2563EB')">নীল</button>
              <button class="btn btn-xs" style="background:#B0BEC5;color:#000" onclick="App.setPhotoBg('#B0BEC5')">ধূসর</button>
              <input type="color" id="bgPicker" value="#ffffff" onchange="App.setPhotoBg(this.value)" title="কাস্টম রঙ" style="width:32px;height:28px;cursor:pointer">
            </div>

            <h3 class="font-bold text-sm mb-2">৪. বিশেষ অ্যাকশন</h3>
            <div class="space-y-2">
              <button class="btn btn-outline btn-xs w-full" onclick="App.autoBgRemove()">✂️ স্মার্ট ব্যাকগ্রাউন্ড রিমুভ (Auto)</button>
              <button class="btn btn-outline btn-xs w-full" onclick="App.generateA4Sheet(24)">🖨️ A4 প্রিন্ট শিট তৈরি (২৪ কপি)</button>
            </div>
          </div>

          <!-- Preview & Canvas -->
          <div class="card p-5 col-span-2 text-center">
            <h3 class="font-bold text-sm mb-3 text-left">প্রিভিউ ও এডিটর ক্যানভাস</h3>
            <div id="canvasWrap" class="p-4 bg-surface-alt rounded flex items-center justify-center min-h-[360px]">
              <div id="canvasEmpty" class="text-xs text-muted">
                📷 বাম পাশের প্যানেল থেকে একটি ছবি আপলোড করুন
              </div>
              <canvas id="mainCanvas" class="hidden rounded shadow-sm max-w-full max-h-[460px]"></canvas>
            </div>
            <div id="canvasButtons" class="mt-4 flex justify-center gap-3 hidden">
              <button class="btn btn-primary" onclick="App.downloadCanvas('sebakendra-photo.jpg')">ছবি ডাউনলোড (JPG) ⬇️</button>
              <button class="btn btn-outline" onclick="App.printCanvas()">প্রিন্ট প্রিভিউ 🖨️</button>
            </div>
          </div>
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  async handleSinglePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const img = await Tools.loadImage(file);
      window._currentImg = img;
      window._currentPreset = { w: 600, h: 600, label: 'পাসপোর্ট' };
      window._currentBg = '#ffffff';
      this.drawCanvas();
      toast('ছবি লোড হয়েছে');
    } catch { toast('ছবি লোড করা যায়নি', true); }
  },

  drawCanvas() {
    if (!window._currentImg) return;
    const p = window._currentPreset || { w: 600, h: 600 };
    const bg = window._currentBg || '#ffffff';
    const c = Tools.processPhoto(window._currentImg, { w: p.w, h: p.h, bg, border: 2 });

    const target = $('#mainCanvas');
    target.width = c.width; target.height = c.height;
    target.getContext('2d').drawImage(c, 0, 0);

    target.classList.remove('hidden');
    $('#canvasEmpty')?.classList.add('hidden');
    $('#canvasButtons')?.classList.remove('hidden');
  },

  applyPreset(w, h, label) {
    if (!window._currentImg) return toast('প্রথমে ছবি আপলোড করুন', true);
    window._currentPreset = { w, h, label };
    this.drawCanvas();
    toast(`${label} সাইজ প্রয়োগ করা হয়েছে`);
  },

  setPhotoBg(color) {
    if (!window._currentImg) return toast('প্রথমে ছবি আপলোড করুন', true);
    window._currentBg = color;
    this.drawCanvas();
    toast('ব্যাকগ্রাউন্ড রং পরিবর্তন করা হয়েছে');
  },

  autoBgRemove() {
    if (!window._currentImg) return toast('প্রথমে ছবি আপলোড করুন', true);
    const cleaned = Tools.removeBackground(window._currentImg, 40);
    window._currentImg = cleaned;
    this.drawCanvas();
    toast('ব্যাকগ্রাউন্ড রিমুভ সম্পন্ন');
  },

  generateA4Sheet(copies) {
    if (!window._currentImg) return toast('প্রথমে ছবি আপলোড করুন', true);
    const single = Tools.processPhoto(window._currentImg, { w: 260, h: 320, bg: window._currentBg || '#fff', border: 2 });
    const sheet = Tools.makeA4Sheet(single, copies);
    const target = $('#mainCanvas');
    target.width = sheet.width; target.height = sheet.height;
    target.getContext('2d').drawImage(sheet, 0, 0);
    toast(`A4 প্রিন্ট শিট তৈরি হয়েছে (${copies} কপি)`);
  },

  downloadCanvas(filename) {
    const c = $('#mainCanvas');
    if (!c) return;
    Tools.downloadCanvas(c, filename);
    toast('ডাউনলোড শুরু হয়েছে');
  },

  printCanvas() {
    const c = $('#mainCanvas');
    if (!c) return;
    const w = window.open('', '_blank');
    w.document.write(`<html><body style="margin:0;display:flex;align-items:center;justify-content:center"><img src="${c.toDataURL()}" style="max-width:100%" onload="window.print()"/></body></html>`);
    w.document.close();
  },

  // ===================== 3. JOINT PHOTO (যৌথ ছবি) =====================
  renderJointPhoto(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-5xl">
        <div class="section-head">
          <div class="section-tag">যৌথ ছবি এডিটর</div>
          <h1 class="section-title">পাশাপাশি দুই ব্যক্তির যৌথ ছবি (Joint Photo)</h1>
          <p class="section-subtitle">স্বামী-স্ত্রী, অংশীদার বা যৌথ আবেদনকারীদের দুই ছবি পাশাপাশি নিখুঁতভাবে বসিয়ে প্রিন্ট করুন।</p>
        </div>

        <div class="grid grid-3 gap-6">
          <div class="card p-5">
            <h3 class="font-bold text-sm mb-2">১. প্রথম ছবি আপলোড</h3>
            <input type="file" accept="image/*" class="form-input mb-4" onchange="App.handleJointPhoto1(event)">

            <h3 class="font-bold text-sm mb-2">২. দ্বিতীয় ছবি আপলোড</h3>
            <input type="file" accept="image/*" class="form-input mb-4" onchange="App.handleJointPhoto2(event)">

            <h3 class="font-bold text-sm mb-2">৩. নাম (ঐচ্ছিক)</h3>
            <input type="text" id="jointName1" class="form-input text-xs mb-2" placeholder="১ম ব্যক্তির নাম" oninput="App.drawJoint()">
            <input type="text" id="jointName2" class="form-input text-xs mb-4" placeholder="২য় ব্যক্তির নাম" oninput="App.drawJoint()">

            <button class="btn btn-primary w-full mb-2" onclick="App.generateJointA4()">A4 পেপারে যৌথ ছবি প্রিন্ট (৮ কপি)</button>
          </div>

          <div class="card p-5 col-span-2 text-center">
            <h3 class="font-bold text-sm mb-3 text-left">যৌথ ছবির প্রিভিউ</h3>
            <div class="p-4 bg-surface-alt rounded flex items-center justify-center min-h-[360px]">
              <div id="jointEmpty" class="text-xs text-muted">উভয় ছবি আপলোড করুন</div>
              <canvas id="jointCanvas" class="hidden rounded shadow-sm max-w-full max-h-[440px]"></canvas>
            </div>
            <div id="jointButtons" class="mt-4 flex justify-center gap-3 hidden">
              <button class="btn btn-primary" onclick="Tools.downloadCanvas($('#jointCanvas'), 'joint-photo.jpg')">ডাউনলোড যৌথ ছবি ⬇️</button>
            </div>
          </div>
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  async handleJointPhoto1(e) {
    if (!e.target.files[0]) return;
    window._joint1 = await Tools.loadImage(e.target.files[0]);
    this.drawJoint();
  },
  async handleJointPhoto2(e) {
    if (!e.target.files[0]) return;
    window._joint2 = await Tools.loadImage(e.target.files[0]);
    this.drawJoint();
  },

  drawJoint() {
    if (!window._joint1 && !window._joint2) return;
    const n1 = $('#jointName1')?.value || '';
    const n2 = $('#jointName2')?.value || '';
    const c = Tools.makeJointPhoto(window._joint1, window._joint2, { name1: n1, name2: n2 });

    const target = $('#jointCanvas');
    target.width = c.width; target.height = c.height;
    target.getContext('2d').drawImage(c, 0, 0);

    target.classList.remove('hidden');
    $('#jointEmpty')?.classList.add('hidden');
    $('#jointButtons')?.classList.remove('hidden');
  },

  generateJointA4() {
    const c = $('#jointCanvas');
    if (!c || c.classList.contains('hidden')) return toast('প্রথমে যৌথ ছবি তৈরি করুন', true);
    const sheet = Tools.makeA4Sheet(c, 8);
    c.width = sheet.width; c.height = sheet.height;
    c.getContext('2d').drawImage(sheet, 0, 0);
    toast('যৌথ ছবির A4 প্রিন্ট শিট তৈরি হয়েছে (৮ কপি)');
  },

  // ===================== 4. NID PRINT READY =====================
  renderNidPrintReady(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-5xl">
        <div class="section-head">
          <div class="section-tag">NID প্রিন্ট রেডি (৮৫.৬ x ৫৪ মিমি)</div>
          <h1 class="section-title">মোবাইলে তোলা NID প্রিন্ট রেডি করুন মাত্র ৫ মিনিটে</h1>
          <p class="section-subtitle">ফ্রন্ট এবং ব্যাক সাইড স্বয়ংক্রিয়ভাবে স্ট্যান্ডার্ড স্মার্ট কার্ড সাইজে এলাইন হয়ে A4 শিটে প্রিন্ট রেডি হবে।</p>
        </div>

        <div class="grid grid-3 gap-6">
          <div class="card p-5">
            <h3 class="font-bold text-sm mb-2">১. NID ফ্রন্ট সাইড (সামনের অংশ)</h3>
            <input type="file" accept="image/*" class="form-input mb-4" onchange="App.handleNidFront(event)">

            <h3 class="font-bold text-sm mb-2">২. NID ব্যাক সাইড (পেছনের অংশ)</h3>
            <input type="file" accept="image/*" class="form-input mb-4" onchange="App.handleNidBack(event)">

            <button class="btn btn-primary w-full" onclick="App.drawNidSheet()">
              🖨️ A4 পেপারে NID প্রিন্ট রেডি করুন
            </button>
          </div>

          <div class="card p-5 col-span-2 text-center">
            <h3 class="font-bold text-sm mb-3 text-left">A4 NID শিট প্রিভিউ (কাটিং গাইড সহ)</h3>
            <div class="p-4 bg-surface-alt rounded flex items-center justify-center min-h-[400px]">
              <div id="nidEmpty" class="text-xs text-muted">সামনের ও পেছনের ছবি আপলোড করে বাটন চাপুন</div>
              <canvas id="nidCanvas" class="hidden rounded shadow-sm max-w-full max-h-[500px]"></canvas>
            </div>
            <div id="nidButtons" class="mt-4 flex justify-center gap-3 hidden">
              <button class="btn btn-primary" onclick="Tools.downloadCanvas($('#nidCanvas'), 'nid-print-ready.jpg')">NID প্রিন্ট শিট ডাউনলোড (JPG) ⬇️</button>
              <button class="btn btn-outline" onclick="App.printNid()">সরাসরি প্রিন্ট 🖨️</button>
            </div>
          </div>
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  async handleNidFront(e) {
    if (!e.target.files[0]) return;
    window._nidFront = await Tools.loadImage(e.target.files[0]);
    toast('NID ফ্রন্ট সাইড আপলোড হয়েছে');
  },
  async handleNidBack(e) {
    if (!e.target.files[0]) return;
    window._nidBack = await Tools.loadImage(e.target.files[0]);
    toast('NID ব্যাক সাইড আপলোড হয়েছে');
  },

  drawNidSheet() {
    if (!window._nidFront && !window._nidBack) return toast('অন্তত একটি অংশ আপলোড করুন', true);
    const sheet = Tools.makeNidPrintSheet(window._nidFront, window._nidBack, { copies: 2 });
    const target = $('#nidCanvas');
    target.width = sheet.width; target.height = sheet.height;
    target.getContext('2d').drawImage(sheet, 0, 0);

    target.classList.remove('hidden');
    $('#nidEmpty')?.classList.add('hidden');
    $('#nidButtons')?.classList.remove('hidden');
    toast('A4 NID প্রিন্ট রেডি সম্পন্ন');
  },

  printNid() {
    const c = $('#nidCanvas');
    if (!c) return;
    const w = window.open('', '_blank');
    w.document.write(`<html><body style="margin:0;display:flex;align-items:center;justify-content:center"><img src="${c.toDataURL()}" style="max-width:100%" onload="window.print()"/></body></html>`);
    w.document.close();
  },

  // ===================== 5. VOTER SLIP =====================
  renderVoterSlip(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-4xl">
        <div class="section-head">
          <div class="section-tag">ভোটার স্লিপ টুল</div>
          <h1 class="section-title">ভোটার স্লিপ তৈরি ও প্রিন্ট</h1>
          <p class="section-subtitle">ভোটার তথ্য দিয়ে এক ক্লিকে অফিশিয়াল ফরম্যাটের ভোটার স্লিপ জেনারেট করুন।</p>
        </div>

        <div class="grid grid-2 gap-6">
          <div class="card p-5">
            <div class="form-group">
              <label class="form-label">ভোটারের পূর্ণ নাম *</label>
              <input type="text" id="vsName" class="form-input" placeholder="যেমন: মো. রফিকুল ইসলাম">
            </div>
            <div class="form-group">
              <label class="form-label">ভোটার নম্বর *</label>
              <input type="text" id="vsVoterNo" class="form-input" placeholder="যেমন: 1982736452">
            </div>
            <div class="form-group">
              <label class="form-label">ভোটার ক্রমিক নং *</label>
              <input type="text" id="vsSerialNo" class="form-input" placeholder="যেমন: 42">
            </div>
            <div class="form-group">
              <label class="form-label">ভোটকেন্দ্রের নাম *</label>
              <input type="text" id="vsCenter" class="form-input" placeholder="যেমন: হরিপুর সরকারি প্রাথমিক বিদ্যালয়">
            </div>
            <div class="form-group">
              <label class="form-label">ওয়ার্ড ও এলাকা</label>
              <input type="text" id="vsWard" class="form-input" placeholder="যেমন: ওয়ার্ড নং ৩, হরিপুর">
            </div>
            <button class="btn btn-primary w-full" onclick="App.generateVoterSlip()">ভোটার স্লিপ জেনারেট করুন</button>
          </div>

          <div class="card p-5 text-center">
            <h3 class="font-bold text-sm mb-3 text-left">স্লিপ প্রিভিউ</h3>
            <canvas id="vsCanvas" class="rounded shadow-sm max-w-full hidden"></canvas>
            <div id="vsButtons" class="mt-4 hidden">
              <button class="btn btn-primary btn-sm" onclick="Tools.downloadCanvas($('#vsCanvas'), 'voter-slip.jpg')">স্লিপ ডাউনলোড ⬇️</button>
            </div>
          </div>
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  generateVoterSlip() {
    const data = {
      name: $('#vsName')?.value,
      voterNo: $('#vsVoterNo')?.value,
      serialNo: $('#vsSerialNo')?.value,
      center: $('#vsCenter')?.value,
      ward: $('#vsWard')?.value,
    };
    if (!data.name || !data.voterNo) return toast('নাম ও ভোটার নম্বর দিন', true);
    const slip = Tools.makeVoterSlip(data);
    const target = $('#vsCanvas');
    target.width = slip.width; target.height = slip.height;
    target.getContext('2d').drawImage(slip, 0, 0);
    target.classList.remove('hidden');
    $('#vsButtons')?.classList.remove('hidden');
    toast('ভোটার স্লিপ প্রস্তুত');
  },

  // ===================== 6. JOBS & LINKS FULL PAGES =====================
  renderJobs(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-5xl">
        <div class="section-head">
          <div class="section-tag">চাকরির সার্কুলার</div>
          <h1 class="section-title">চলমান সরকারি ও বেসরকারি নিয়োগ বিজ্ঞপ্তি</h1>
          <p class="section-subtitle">সকল মন্ত্রণালয়, অধিদপ্তর ও ব্যাংকের ভেরিফাইড সার্কুলার এবং অনলাইন আবেদন লিংক</p>
        </div>

        <div class="grid grid-4 gap-4 mb-8">
          ${JOB_CIRCULARS.map(j => `
            <div class="job-card">
              <div>
                <div class="job-header">
                  <span class="badge badge-green">চলমান</span>
                  <span class="text-xs text-muted">${esc(j.category)}</span>
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
            <div class="section-tag">অফিশিয়াল লিংক ডিরেক্টরি</div>
            <h1 class="section-title">গুরুত্বপূর্ণ সকল লিংকসমূহ (১১৪+)</h1>
            <p class="section-subtitle">সকল সরকারি সেবা পোর্টাল, বোর্ড রেজাল্ট, পাসপোর্ট ও ভিসা লিংক</p>
          </div>
          <input type="text" class="form-input text-xs w-64" placeholder="লিংক খুঁজুন..." oninput="App.filterLinks(this.value)">
        </div>

        <div class="links-pill-container" id="linkCategoriesPills">
          ${IMPORTANT_LINK_CATEGORIES.map((c, i) => `
            <button class="link-pill ${i === 0 ? 'active' : ''}" onclick="App.selectLinkCategory('${c.id}', this)">
              ${esc(c.name)} ${c.count ? `(${c.count})` : ''}
            </button>`).join('')}
        </div>

        <div class="grid grid-4 gap-4" id="importantLinksGrid">
          ${this.renderLinksCardsHtml(IMPORTANT_LINKS)}
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  // ===================== 7. PACKAGES & PRICING =====================
  renderPricing(el) {
    el.innerHTML = `
      <div class="container py-8 max-w-5xl">
        <div class="section-head text-center">
          <div class="section-tag">সাবস্ক্রিপশন প্ল্যান</div>
          <h1 class="section-title">প্যাকেজ ও প্রিমিয়াম অ্যাক্সেস</h1>
          <p class="section-subtitle">আইটি শপার ও ডিজিটাল সেন্টারের জন্য আনলিমিটেড টুলস ও সুবিধা</p>
        </div>

        <div class="grid grid-3 gap-6 mb-8">
          ${PLANS.map(p => `
            <div class="card p-6 ${p.featured ? 'border-primary shadow-lg' : ''}">
              ${p.featured ? '<span class="badge badge-pro mb-2">সেরা পছন্দ</span>' : ''}
              <h3 class="font-bold text-lg mb-1">${esc(p.name)}</h3>
              <div class="my-3">
                <span class="text-3xl font-extrabold text-primary">${fmtTk(p.price)}</span>
                <span class="text-xs text-muted">${esc(p.period)}</span>
              </div>
              <p class="text-xs text-muted mb-4">${esc(p.desc)}</p>
              <ul class="text-xs space-y-2 mb-6">
                ${p.features.map(f => `<li>✓ ${esc(f)}</li>`).join('')}
              </ul>
              <button class="btn ${p.featured ? 'btn-primary' : 'btn-outline'} w-full" onclick="App.subscribePlan('${p.id}')">
                ${p.price === 0 ? 'ফ্রি শুরু করুন' : 'প্যাকেজটি নিন ➜'}
              </button>
            </div>`).join('')}
        </div>
      </div>
      ${this.footerHtml()}`;
  },

  async subscribePlan(planId) {
    const p = PLANS.find(x => x.id === planId);
    if (!p) return;
    if (p.price === 0) {
      toast('আপনি ফ্রি প্ল্যানে আছেন');
      return;
    }
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: p.price, serviceSlug: p.id, serviceName: `Subscription: ${p.name}` }),
      });
      const data = await res.json();
      if (!data.success) return toast(data.error || 'ত্রুটি', true);
      this.openBkashModal({ paymentID: data.paymentID, amount: p.price, service: p });
    } catch { toast('সার্ভারে ত্রুটি ঘটেছে', true); }
  },

  openBkashModal({ paymentID, amount, service }) {
    openModal(`
      <div class="text-center p-4">
        <div style="background:#E2136E;color:#fff;padding:1rem;border-radius:10px;margin-bottom:1rem">
          <h2 class="text-2xl font-bold">bKash Merchant Checkout</h2>
          <div class="text-xs">Invoice: ${paymentID}</div>
        </div>
        <div class="card p-3 bg-surface-alt text-xs mb-4">
          <div class="flex justify-between py-1"><span>সার্ভিস:</span><strong>${esc(service.name || service.title)}</strong></div>
          <div class="flex justify-between py-1 font-bold text-base text-primary"><span>পরিশোধযোগ্য:</span><span>${fmtTk(amount)}</span></div>
        </div>
        <button class="btn w-full btn-lg" style="background:#E2136E;color:#fff" onclick="App.executeBkash('${paymentID}', ${amount})">
          পেমেন্ট নিশ্চিত করুন (${fmtTk(amount)})
        </button>
      </div>`);
  },

  async executeBkash(paymentID, amount) {
    try {
      const res = await fetch('/api/payments/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentID }),
      });
      const data = await res.json();
      closeModal();
      if (data.success) {
        toast('bKash পেমেন্ট সফল হয়েছে!');
        Store.addCredits(500);
      } else {
        toast(data.error || 'পেমেন্ট ব্যর্থ', true);
      }
    } catch { toast('পেমেন্ট ত্রুটি', true); }
  },

  // ===================== 8. FOOTER =====================
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
            <a href="/tools/make-voter-slip" class="footer-link">ভোটার স্লিপ তৈরি</a>
          </div>

          <div>
            <h4 class="footer-title">গুরুত্বপূর্ণ লিংক</h4>
            <a href="/jobs" class="footer-link">চলমান চাকরির সার্কুলার</a>
            <a href="/links" class="footer-link">গুরুত্বপূর্ণ লিংকসমূহ (১১৪+)</a>
            <a href="/services" class="footer-link">নাগরিক সেবা ক্যাটালগ</a>
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

  // Auth Modals
  openLoginModal() {
    openModal(`
      <div class="p-4 text-center max-w-sm mx-auto">
        <h2 class="text-xl font-bold mb-2">🔐 সেবাকেন্দ্রে লগইন</h2>
        <form onsubmit="App.handleLogin(event)">
          <div class="form-group text-left">
            <label class="form-label">মোবাইল নম্বর</label>
            <input type="tel" name="phone" required class="form-input" placeholder="017XXXXXXXX">
          </div>
          <div class="form-group text-left">
            <label class="form-label">পাসওয়ার্ড</label>
            <input type="password" name="pass" required class="form-input" placeholder="পাসওয়ার্ড">
          </div>
          <button type="submit" class="btn btn-primary w-full">লগইন করুন</button>
        </form>
      </div>`);
  },

  openRegisterModal() {
    openModal(`
      <div class="p-4 text-center max-w-sm mx-auto">
        <h2 class="text-xl font-bold mb-2">📝 নতুন অ্যাকাউন্ট তৈরি</h2>
        <form onsubmit="App.handleRegister(event)">
          <div class="form-group text-left"><label class="form-label">আপনার নাম</label><input type="text" name="name" required class="form-input" placeholder="নাম"></div>
          <div class="form-group text-left"><label class="form-label">মোবাইল নম্বর</label><input type="tel" name="phone" required class="form-input" placeholder="017XXXXXXXX"></div>
          <div class="form-group text-left"><label class="form-label">পাসওয়ার্ড</label><input type="password" name="pass" required class="form-input"></div>
          <button type="submit" class="btn btn-primary w-full">রেজিস্ট্রেশন সম্পন্ন করুন</button>
        </form>
      </div>`);
  },

  handleLogin(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    Store.login('আইটি মেম্বার', data.get('phone'), '');
    closeModal();
    this.updateUserNav();
    toast('লগইন সফল হয়েছে');
  },

  handleRegister(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    Store.login(data.get('name'), data.get('phone'), '');
    closeModal();
    this.updateUserNav();
    toast('অ্যাকাউন্ট তৈরি হয়েছে');
  },
};

// Initialize App on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => App.init());
