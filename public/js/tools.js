// SebaKendra Tools Engine — real client-side processing
// PhotoStudio (canvas), Bangla tools, QR, AI template generators, PDF (jsPDF).

const Tools = {

  // ============ PHOTO STUDIO ============
  loadImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  },

  // Crop center square/rect + resize to preset, return canvas
  processPhoto(img, { w = 600, h = 600, bg = null, border = 0 } = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h); }
    // center-crop source to target aspect
    const srcAspect = img.width / img.height, dstAspect = w / h;
    let sw, sh, sx, sy;
    if (srcAspect > dstAspect) { sh = img.height; sw = sh * dstAspect; sx = (img.width - sw) / 2; sy = 0; }
    else { sw = img.width; sh = sw / dstAspect; sx = 0; sy = (img.height - sh) / 2; }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
    if (border) { ctx.strokeStyle = '#fff'; ctx.lineWidth = border; ctx.strokeRect(0, 0, w, h); }
    return canvas;
  },

  // Simple corner-color background removal (works best with plain studio bg)
  removeCornerBg(img, tolerance = 42) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = data.data, W = canvas.width;
    const corner = [0, W - 1, (canvas.height - 1) * W, canvas.height * W - 1];
    const ref = corner.map(i => [d[i * 4], d[i * 4 + 1], d[i * 4 + 2]]);
    const seen = new Uint8Array(W * canvas.height);
    const stack = [...corner];
    const match = (i) => ref.some(r => Math.abs(d[i * 4] - r[0]) < tolerance && Math.abs(d[i * 4 + 1] - r[1]) < tolerance && Math.abs(d[i * 4 + 2] - r[2]) < tolerance);
    while (stack.length) {
      const i = stack.pop();
      if (seen[i] || !match(i)) continue;
      seen[i] = 1; d[i * 4 + 3] = 0;
      const x = i % W, y = (i / W) | 0;
      if (x > 0) stack.push(i - 1); if (x < W - 1) stack.push(i + 1);
      if (y > 0) stack.push(i - W); if (y < canvas.height - 1) stack.push(i + W);
    }
    ctx.putImageData(data, 0, 0);
    return canvas;
  },

  // A4 sheet: repeat photo N times on A4 canvas (2480x3508 @300dpi scaled to 1240x1754)
  makeSheet(img, cols = 4, rows = 6, w = 300, h = 375) {
    const canvas = document.createElement('canvas');
    canvas.width = 1240; canvas.height = 1754;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const gap = 12, totalW = cols * w + (cols - 1) * gap, totalH = rows * h + (rows - 1) * gap;
    const ox = (canvas.width - totalW) / 2, oy = (canvas.height - totalH) / 2;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      ctx.drawImage(img, ox + c * (w + gap), oy + r * (h + gap), w, h);
    }
    return canvas;
  },

  downloadCanvas(canvas, name = 'photo.jpg') {
    const a = document.createElement('a');
    a.download = name;
    a.href = canvas.toDataURL('image/jpeg', 0.92);
    a.click();
  },

  // ============ BANGLA TOOLS ============
  enToBnNum(s) { return String(s).replace(/[0-9]/g, d => '০১২৩৪৫৬৭৮৯'[d]); },
  bnToEnNum(s) { return String(s).replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d)); },

  amountInWords(n) {
    const ones = ['', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ', 'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'ঊনিশ', 'বিশ', 'একুশ', 'বাইশ', 'তেইশ', 'চব্বিশ', 'পঁচিশ', 'ছাব্বিশ', 'সাতাশ', 'আটাশ', 'ঊনত্রিশ', 'ত্রিশ', 'একত্রিশ', 'বত্রিশ', 'তেত্রিশ', 'চৌত্রিশ', 'পঁয়ত্রিশ', 'ছত্রিশ', 'সাঁয়ত্রিশ', 'আটত্রিশ', 'ঊনচল্লিশ', 'চল্লিশ', 'একচল্লিশ', 'বিয়াল্লিশ', 'তেতাল্লিশ', 'চুয়াল্লিশ', 'পঁয়তাল্লিশ', 'ছেচল্লিশ', 'সাতচল্লিশ', 'আটচল্লিশ', 'ঊনপঞ্চাশ', 'পঞ্চাশ', 'একান্ন', 'বায়ান্ন', 'তিপ্পান্ন', 'চুয়ান্ন', 'পঞ্চান্ন', 'ছাপ্পান্ন', 'সাতান্ন', 'আটান্ন', 'ঊনষাট', 'ষাট', 'একষট্টি', 'বাষট্টি', 'তেষট্টি', 'চৌষট্টি', 'পঁয়ষট্টি', 'ছেষট্টি', 'সাতষট্টি', 'আটষট্টি', 'ঊনসত্তর', 'সত্তর', 'একাত্তর', 'বাহাত্তর', 'তেহাত্তর', 'চুয়াত্তর', 'পঁচাত্তর', 'ছিয়াত্তর', 'সাতাত্তর', 'আটাত্তর', 'ঊনআশি', 'আশি', 'একাশি', 'বিরাশি', 'তিরাশি', 'চুরাশি', 'পঁচাশি', 'ছিয়াশি', 'সাতাশি', 'আটাশি', 'ঊননব্বই', 'নব্বই', 'একানব্বই', 'বিরানব্বই', 'তিরানব্বই', 'চুরানব্বই', 'পঁচানব্বই', 'ছিয়ানব্বই', 'সাতানব্বই', 'আটানব্বই', 'ঊনশত', 'শত'];
    const two = (x) => x === 100 ? 'শত' : ones[x];
    const under1000 = (x) => {
      let s = '';
      const h = Math.floor(x / 100), r = x % 100;
      if (h) s += ones[h] + ' শত' + (r ? ' ' : '');
      if (r) s += ones[r];
      return s.trim();
    };
    n = Math.floor(Math.abs(Number(n) || 0));
    if (n === 0) return 'শূন্য টাকা';
    let s = '';
    const crore = Math.floor(n / 10000000); n %= 10000000;
    const lakh = Math.floor(n / 100000); n %= 100000;
    const thousand = Math.floor(n / 1000); n %= 1000;
    if (crore) s += under1000(crore) + ' কোটি ';
    if (lakh) s += under1000(lakh) + ' লাখ ';
    if (thousand) s += under1000(thousand) + ' হাজার ';
    if (n) s += under1000(n);
    return s.trim() + ' টাকা';
  },

  // Unicode -> Bijoy (basic mapping for common characters; full Bijoy needs font tables)
  unicodeToBijoy(text) {
    const map = {
      'অ':'A','আ':'A','ই':'E','ঈ':'E','উ':'U','ঊ':'U','ঋ':'R','এ':'E','ঐ':'E','ও':'O','ঔ':'O',
      'ক':'K','খ':'K','গ':'G','ঘ':'G','ঙ':'Ng','চ':'C','ছ':'C','জ':'J','ঝ':'J','ঞ':'Y','ট':'T','ঠ':'T','ড':'D','ঢ':'D','ণ':'N','ত':'T','থ':'T','দ':'D','ধ':'D','ন':'N','প':'P','ফ':'P','ব':'B','ভ':'B','ম':'M','য':'Z','র':'R','ল':'L','শ':'S','ষ':'S','স':'S','হ':'H','ড়':'R','ঢ়':'R','য়':'Y','ৎ':'T','ং':'ং','ঃ':'%','ঁ':'^','া':'v','ি':'w','ী':'x','ু':'y','ূ':'y','ৃ':'q','ে':'e','ৈ':'E','ো':'t','ৌ':'T','্':'`','ৰ':'R','ৱ':'R',
      '০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9',
      '।':'.','!':'!','?':'?','-':'-',' ':' ','\n':'\n'
    };
    // Handle conjuncts crudely: hasant + consonant -> ` + consonant
    return String(text).split('').map(ch => map[ch] ?? ch).join('');
  },

  bijoyToUnicode(text) {
    const rev = { 'A':'অ','E':'ই','U':'উ','R':'র','O':'ও','K':'ক','G':'গ','Ng':'ঙ','C':'চ','J':'জ','Y':'ঞ','T':'ট','D':'ড','N':'ণ','P':'প','B':'ব','M':'ম','Z':'য','L':'ল','S':'স','H':'হ','v':'া','w':'ি','x':'ী','y':'ু','q':'ৃ','e':'ে','t':'ো','`':'্','0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯','.':'।' };
    return String(text).split('').map(ch => rev[ch] ?? ch).join('');
  },

  dateConvert(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return 'অবৈধ তারিখ';
    const bn = d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
    const en = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    return `বাংলা: ${bn}\nEnglish: ${en}\nসংখ্যা: ${this.enToBnNum(d.toISOString().slice(0, 10))}`;
  },

  // Application / letter generator
  makeApplication({ to, from, subject, body, date }) {
    const today = date || new Date().toLocaleDateString('bn-BD');
    return `বরাবর,\n${to}\n\nবিষয়: ${subject}\n\nজনাব,\n\n${body}\n\nঅতএব, মহোদয়ের নিকট বিনীত প্রার্থনা, উল্লিখিত বিষয়ে প্রয়োজনীয় ব্যবস্থা গ্রহণে বাধ্য করবেন।\n\nবিনীত নিবেদক,\n${from}\n\nতারিখ: ${today}`;
  },

  // ============ QR ============
  async drawQR(canvas, text) {
    // Try CDN lib first
    if (window.QRCode && QRCode.toCanvas) {
      await QRCode.toCanvas(canvas, text, { width: 220, margin: 1, color: { dark: '#123B70', light: '#ffffff' } });
      return true;
    }
    // Fallback: deterministic pattern (visual only, clearly not scannable)
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.height = 220;
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 220, 220);
    ctx.fillStyle = '#123B70';
    let seed = 0; for (const c of text) seed = (seed * 31 + c.charCodeAt(0)) >>> 0;
    const rnd = () => { seed = (seed * 1103515245 + 12345) >>> 0; return seed / 4294967296; };
    const cell = 220 / 25;
    for (let y = 0; y < 25; y++) for (let x = 0; x < 25; x++) if (rnd() > 0.52) ctx.fillRect(x * cell, y * cell, cell, cell);
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cell * 7, cell * 7); ctx.fillRect(220 - cell * 7, 0, cell * 7, cell * 7); ctx.fillRect(0, 220 - cell * 7, cell * 7, cell * 7);
    ctx.fillStyle = '#123B70';
    [[0, 0], [220 - cell * 7, 0], [0, 220 - cell * 7]].forEach(([fx, fy]) => { ctx.fillRect(fx, fy, cell * 7, cell * 7); ctx.fillStyle = '#fff'; ctx.fillRect(fx + cell, fy + cell, cell * 5, cell * 5); ctx.fillStyle = '#123B70'; ctx.fillRect(fx + cell * 2, fy + cell * 2, cell * 3, cell * 3); });
    return false;
  },

  // ============ AI (template engine — deterministic, offline) ============
  aiGenerate(slug, input) {
    const t = (input || '').trim() || '—';
    const templates = {
      'ai-cv': () => `পেশাগত জীবনবৃত্তান্ত (CV)\n${'='.repeat(40)}\nনাম: ${t}\nপদবি: সেবা প্রদানকারী / উদ্যোক্তা\n\nসারসংক্ষেপ:\nঅভিজ্ঞ ও দায়িত্বশীল পেশাদার। ডিজিটাল সেবা, ডকুমেন্ট প্রসেসিং ও গ্রাহক সেবায় দক্ষ।\n\nদক্ষতা:\n• ডিজিটাল সেবা প্রদান\n• ডকুমেন্ট ও ফর্ম প্রসেসিং\n• গ্রাহক যোগাযোগ\n• কম্পিউটার অ্যাপ্লিকেশন\n\nঅভিজ্ঞতা:\n• সেবাকেন্দ্র নেটওয়ার্কে সক্রিয় উদ্যোক্তা\n\nশিক্ষা:\n• সংশ্লিষ্ট বিষয়ে শিক্ষাগত যোগ্যতা\n\nযোগাযোগ: [আপনার ফোন/ইমেইল বসান]`,
      'ai-cover': () => `কভার লেটার\n${'='.repeat(40)}\n\nপ্রিয় নিয়োগকর্তা,\n\nআমি ${t} পদে আবেদন করতে আগ্রহী। আমার দক্ষতা ও অভিজ্ঞতা আপনার প্রতিষ্ঠানের চাহিদার সাথে সামঞ্জস্যপূর্ণ বলে আমি বিশ্বাস করি।\n\nআমার মূল শক্তি:\n• দ্রুত শেখার ক্ষমতা\n• দলগত কাজে পারদর্শিতা\n• সময় ব্যবস্থাপনা\n\nআপনার প্রতিষ্ঠানে যোগ দেওয়ার সুযোগ পেলে আমি সর্বোচ্চ প্রচেষ্টা দিয়ে কাজ করব।\n\nধন্যবাদসহ,\n[আপনার নাম]`,
      'ai-email': () => `বিষয়: ${t}\n\nপ্রিয় মহোদয়/মহোদয়া,\n\nআশা করি ভালো আছেন। আমি ${t} সম্পর্কে জানাতে লিখছি।\n\nবিস্তারিত তথ্য নিচে দেওয়া হলো। আপনার মূল্যবান মতামতের অপেক্ষায় রইলাম।\n\nধন্যবাদান্তে,\n[আপনার নাম ও পদবি]`,
      'ai-caption': () => `📱 ফেসবুক ক্যাপশন আইডিয়া (${t}):\n\n১. "${t} — নতুন শুরু, নতুন সম্ভাবনা! 🚀"\n২. "স্বপ্ন দেখুন, আমরা বাস্তবায়নে পাশে আছি ✨"\n৩. "${t} এখন আপনার হাতের মুঠোয়! 💪"\n৪. "প্রতিদিন নতুন কিছু — ${t} এর সাথে থাকুন 🌟"\n৫. "আপনার সেবাই আমাদের অঙ্গীকার 🤝"`,
      'ai-biz-name': () => `💡 বিজনেস নামের আইডিয়া (${t}):\n\n১. ${t} সেবাকেন্দ্র\n২. ${t} ডিজিটাল হাব\n৩. ${t} সলিউশন\n৪. ${t} পয়েন্ট\n৫. ${t} ওয়ার্কস\n৬. ${t} নেটওয়ার্ক\n৭. ${t} এক্সপ্রেস\n৮. ${t} সেন্টার`,
      'ai-translate': () => `[অনুবাদ] ${t}\n\n(নোট: এটি ডেমো অনুবাদ। প্রোডাকশনে AI API-এর মাধ্যমে অনুবাদ করা হবে।)`,
      'ai-summarize': () => `📋 সারসংক্ষেপ:\n\nমূল বিষয়: ${t.slice(0, 120)}${t.length > 120 ? '...' : ''}\n\nমূল পয়েন্ট:\n• প্রধান তথ্য: ${t.split(/[.!?।]/)[0] || t}\n• বিস্তারিত: ${t.split(/[.!?।]/)[1] || '—'}\n• উপসংহার: ${t.split(/[.!?।]/).slice(-2)[0] || '—'}`,
      'ai-grammar': () => `✔️ গ্রামার চেক রিপোর্ট:\n\nইনপুট: "${t}"\n\nপরামর্শ:\n• বাক্যের শুরুতে বড় হাতের অক্ষর ব্যবহার করুন\n• বিরামচিহ্ন (। , ?) সঠিকভাবে বসান\n• অপ্রয়োজনীয় স্পেস পরিহার করুন\n\nসংশোধিত সংস্করণ:\n"${t.charAt(0).toUpperCase() + t.slice(1)}"`,
      'ai-application': () => `আবেদনপত্র\n${'='.repeat(40)}\n\nবরাবর,\nকর্তৃপক্ষ\n\nবিষয়: ${t}\n\nজনাব,\n\nআমি ${t} সংক্রান্ত আবেদন করছি। অনুগ্রহপূর্বক বিষয়টি বিবেচনায় নিয়ে প্রয়োজনীয় ব্যবস্থা গ্রহণ করবেন।\n\nবিনীত নিবেদক,\n[নাম]`,
      'ai-biz-desc': () => `🏢 বিজনেস বর্ণনা:\n\n${t} — আপনার বিশ্বস্ত ডিজিটাল সেবা প্রদানকারী। আমরা মানসম্মত সেবা, দ্রুত ডেলিভারি ও সাশ্রয়ী মূল্যে গ্রাহক সন্তুষ্টি নিশ্চিত করি।\n\nআমাদের সেবা:\n• নাগরিক সেবা সহায়তা\n• ডিজিটাল টুলস\n• ব্যবসা সমাধান`,
      'ai-product': () => `🛍️ প্রোডাক্ট বর্ণনা:\n\n${t}\n\nবৈশিষ্ট্য:\n• প্রিমিয়াম কোয়ালিটি\n• সাশ্রয়ী মূল্য\n• দ্রুত ডেলিভারি\n• ওয়ারেন্টি সুবিধা\n\nঅর্ডার করতে আজই যোগাযোগ করুন!`,
      'ai-seo': () => `🔍 SEO মেটা:\n\nTitle: ${t} | SebaKendra\nDescription: ${t} — বাংলাদেশের সেরা ডিজিটাল সেবা প্ল্যাটফর্মে অনলাইনে সহজে পান। নিরাপদ পেমেন্ট, দ্রুত ডেলিভারি।\nKeywords: ${t}, অনলাইন সেবা, বাংলাদেশ`,
      'ai-blog': () => `✍️ ব্লগ আউটলাইন: ${t}\n\n১. ভূমিকা — ${t} কেন গুরুত্বপূর্ণ\n২. ধাপে ধাপে নির্দেশনা\n৩. প্রয়োজনীয় কাগজপত্র\n৪. সাধারণ ভুল ও সমাধান\n৫. উপসংহার ও CTA`,
      'ai-poster': () => `🎨 পোস্টার টেক্সট:\n\nহেডলাইন: ${t}\nসাব-হেডলাইন: এখনই অর্ডার করুন!\nCTA: SebaKendra — আপনার সেবা, আমাদের দায়িত্ব`,
      'ai-doc-assist': () => `🤖 ডকুমেন্ট অ্যাসিস্ট্যান্ট:\n\nআপনার ইনপুট: "${t}"\n\nপ্রস্তাবিত পদক্ষেপ:\n১. তথ্য যাচাই করুন\n২. প্রয়োজনীয় কাগজপত্র প্রস্তুত করুন\n৩. সেবাকেন্দ্রে আবেদন জমা দিন\n৪. স্ট্যাটাস ট্র্যাক করুন`,
      'ai-reply': () => `💬 কাস্টমার রিপ্লাই:\n\n"আসসালামু আলাইকুম! ${t} সম্পর্কে আপনার আগ্রহের জন্য ধন্যবাদ। বিস্তারিত তথ্য দিয়ে সাহায্য করছি। যেকোনো প্রয়োজনে আমাদের সাপোর্ট টিম আপনার পাশে আছে। 🤝"`,
      'ai-social': () => `📅 সোশ্যাল মিডিয়া প্ল্যান (৭ দিন):\n\nসোম: ${t} পরিচিতি পোস্ট\nমঙ্গল: টিপস/গাইড\nবুধ: গ্রাহক রিভিউ\nবৃহ: অফার পোস্ট\nশুক্র: লাইভ Q&A\nশনি: শিক্ষামূলক কনটেন্ট\nরবি: সাপ্তাহিক রিক্যাপ`,
      'ai-bg-remove': () => `✂️ ব্যাকগ্রাউন্ড রিমুভার:\n\nফটো স্টুডিওতে যান — ছবি আপলোড করে "ব্যাকগ্রাউন্ড রিমুভ" বাটন চাপুন। কর্নার-কালার ডিটেকশন দিয়ে স্বয়ংক্রিয়ভাবে ব্যাকগ্রাউন্ড সরানো হবে।`,
      'ai-enhance': () => `✨ ছবি এনহ্যান্সার:\n\nফটো স্টুডিওতে যান — ছবি আপলোড করে সাইজ/কোয়ালিটি অপ্টিমাইজ করুন ও ডাউনলোড করুন।`,
    };
    return (templates[slug] || (() => `AI আউটপুট: ${t}`))();
  },
};
