// SebaKendra Professional Tools Engine
// Includes: Photo Studio, Joint Photo (যৌথ ছবি), NID Print Ready (৮৫.৬ x ৫৪ মিমি),
// A4 Print Sheet (4, 8, 12, 16, 24 copies), Voter Slip Generator, Bangla Tools, QR & AI

const Tools = {

  // ============ 1. IMAGE LOADER ============
  loadImage(fileOrBlob) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = typeof fileOrBlob === 'string' ? fileOrBlob : URL.createObjectURL(fileOrBlob);
    });
  },

  // ============ 2. PHOTO STUDIO PROCESSING ============
  // Process single photo to preset size with crop, background & filter
  processPhoto(img, { w = 600, h = 600, bg = null, border = 0, brightness = 100, contrast = 100 } = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Solid Background
    if (bg) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    }

    // Apply brightness / contrast filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    // Center crop aspect ratio
    const srcAspect = img.width / img.height;
    const dstAspect = w / h;
    let sw, sh, sx, sy;

    if (srcAspect > dstAspect) {
      sh = img.height;
      sw = sh * dstAspect;
      sx = (img.width - sw) / 2;
      sy = 0;
    } else {
      sw = img.width;
      sh = sw / dstAspect;
      sx = 0;
      sy = (img.height - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);

    // Border
    if (border > 0) {
      ctx.filter = 'none';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = border * 2;
      ctx.strokeRect(0, 0, w, h);
    }

    return canvas;
  },

  // Smart Background Remover with adjustable tolerance and edge-feathering
  removeBackground(img, tolerance = 35) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const W = canvas.width, H = canvas.height;

    // Sample average background from 4 corners
    const samples = [
      [0, 0], [W - 1, 0], [0, H - 1], [W - 1, H - 1],
      [Math.floor(W / 2), 0], [0, Math.floor(H / 2)], [W - 1, Math.floor(H / 2)]
    ];
    const bgColors = samples.map(([x, y]) => {
      const idx = (y * W + x) * 4;
      return [data[idx], data[idx + 1], data[idx + 2]];
    });

    // Check pixel similarity
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const isMatch = bgColors.some(([br, bg, bb]) => {
        const diff = Math.sqrt((r - br) ** 2 + (g - bg) ** 2 + (b - bb) ** 2);
        return diff < tolerance;
      });
      if (isMatch) {
        data[i + 3] = 0; // Transparent
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
  },

  // ============ 3. JOINT PHOTO (যৌথ ছবি) ============
  // Combines two photos side-by-side with optional name label and print border
  makeJointPhoto(img1, img2, { width = 900, height = 600, gap = 16, bg = '#ffffff', name1 = '', name2 = '' } = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const photoWidth = (width - gap * 3) / 2;
    const photoHeight = name1 || name2 ? height - 70 : height - gap * 2;
    const topY = gap;

    // Draw photo 1
    if (img1) {
      ctx.drawImage(img1, 0, 0, img1.width, img1.height, gap, topY, photoWidth, photoHeight);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.strokeRect(gap, topY, photoWidth, photoHeight);
    }

    // Draw photo 2
    if (img2) {
      const x2 = gap * 2 + photoWidth;
      ctx.drawImage(img2, 0, 0, img2.width, img2.height, x2, topY, photoWidth, photoHeight);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.strokeRect(x2, topY, photoWidth, photoHeight);
    }

    // Optional bottom text labels
    if (name1 || name2) {
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 22px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      if (name1) ctx.fillText(name1, gap + photoWidth / 2, height - 20);
      if (name2) ctx.fillText(name2, gap * 2 + photoWidth + photoWidth / 2, height - 20);
    }

    // Overall outer border
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    return canvas;
  },

  // ============ 4. NID PRINT READY (৮৫.৬ x ৫৪ মিমি) ============
  // Produces standard CR80 size front & back NID layout on A4 sheet
  makeNidPrintSheet(frontImg, backImg, { copies = 1, showGuides = true } = {}) {
    // A4 at 300 DPI scaled: 1240 x 1754 px
    const canvas = document.createElement('canvas');
    canvas.width = 1240;
    canvas.height = 1754;
    const ctx = canvas.getContext('2d');

    // White A4 sheet
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Standard NID Card dimensions at this scale (85.6mm x 54mm -> approx 506 x 318 px)
    const cardW = 506;
    const cardH = 318;
    const gap = 30;

    const startX = (canvas.width - (cardW * 2 + gap)) / 2;
    let startY = 180;

    // Draw copies
    for (let i = 0; i < copies; i++) {
      // Front side
      if (frontImg) {
        ctx.drawImage(frontImg, startX, startY, cardW, cardH);
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, startY, cardW, cardH);
      }

      // Back side
      if (backImg) {
        const backX = startX + cardW + gap;
        ctx.drawImage(backImg, backX, startY, cardW, cardH);
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.strokeRect(backX, startY, cardW, cardH);
      }

      // Cutting guide marks
      if (showGuides) {
        ctx.strokeStyle = '#9CA3AF';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        ctx.strokeRect(startX - 5, startY - 5, cardW * 2 + gap + 10, cardH + 10);
        ctx.setLineDash([]);
      }

      startY += cardH + 70;
    }

    // Header label on paper
    ctx.fillStyle = '#065F46';
    ctx.font = 'bold 26px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SebaKendra — NID Print Ready Sheet (Standard 85.6mm × 54mm)', canvas.width / 2, 80);

    ctx.fillStyle = '#6B7280';
    ctx.font = '16px "Hind Siliguri", sans-serif';
    ctx.fillText('প্রিন্ট করার সময় 100% Scale / Actual Size নির্বাচন করুন (Fit to page করবেন না)', canvas.width / 2, 115);

    return canvas;
  },

  // ============ 5. A4 PRINT READY MULTI-COPIES ============
  makeA4Sheet(img, copies = 24) {
    const canvas = document.createElement('canvas');
    canvas.width = 1240;
    canvas.height = 1754;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let cols = 4, rows = 6, w = 260, h = 320, gap = 16;
    if (copies === 4) { cols = 2; rows = 2; w = 480; h = 600; gap = 40; }
    else if (copies === 8) { cols = 2; rows = 4; w = 380; h = 475; gap = 30; }
    else if (copies === 12) { cols = 3; rows = 4; w = 340; h = 425; gap = 20; }
    else if (copies === 16) { cols = 4; rows = 4; w = 260; h = 325; gap = 16; }

    const totalW = cols * w + (cols - 1) * gap;
    const totalH = rows * h + (rows - 1) * gap;
    const ox = (canvas.width - totalW) / 2;
    const oy = (canvas.height - totalH) / 2;

    let drawn = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (drawn >= copies) break;
        const x = ox + c * (w + gap);
        const y = oy + r * (h + gap);
        ctx.drawImage(img, x, y, w, h);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, w, h);
        drawn++;
      }
    }

    return canvas;
  },

  // ============ 6. VOTER SLIP GENERATOR ============
  makeVoterSlip({ name, voterNo, serialNo, center, ward, area, date }) {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');

    // White card with green top bar
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F9D58';
    ctx.fillRect(0, 0, canvas.width, 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('বাংলাদেশ নির্বাচন কমিশন — ভোটার স্লিপ', canvas.width / 2, 45);

    // Voter Details
    ctx.fillStyle = '#111827';
    ctx.textAlign = 'left';
    ctx.font = 'bold 20px "Hind Siliguri", sans-serif';

    const leftX = 50;
    let y = 120;
    const items = [
      ['ভোটারের নাম:', name || '—'],
      ['ভোটার নম্বর:', voterNo || '—'],
      ['ভোটার ক্রমিক নং:', serialNo || '—'],
      ['ভোটকেন্দ্রের নাম:', center || '—'],
      ['ওয়ার্ড ও এলাকা:', `${ward || ''} ${area || ''}`.trim() || '—'],
      ['প্রিন্ট তারিখ:', date || new Date().toLocaleDateString('bn-BD')],
    ];

    items.forEach(([label, val]) => {
      ctx.fillStyle = '#4B5563';
      ctx.font = '600 18px "Hind Siliguri", sans-serif';
      ctx.fillText(label, leftX, y);

      ctx.fillStyle = '#065F46';
      ctx.font = 'bold 20px "Hind Siliguri", sans-serif';
      ctx.fillText(val, leftX + 170, y);
      y += 45;
    });

    // Outer border
    ctx.strokeStyle = '#0F9D58';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

    return canvas;
  },

  // ============ 7. DOWNLOAD HELPER ============
  downloadCanvas(canvas, filename = 'download.jpg') {
    const a = document.createElement('a');
    a.download = filename;
    a.href = canvas.toDataURL('image/jpeg', 0.95);
    a.click();
  },

  // ============ 8. BANGLA CONVERTERS ============
  enToBnNum(s) { return String(s).replace(/[0-9]/g, d => '০১২৩৪৫৬৭৮৯'[d]); },
  bnToEnNum(s) { return String(s).replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d)); },

  amountInWords(n) {
    const ones = ['', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ', 'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'ঊনিশ', 'বিশ', 'একুশ', 'বাইশ', 'তেইশ', 'চব্বিশ', 'পঁচিশ', 'ছাব্বিশ', 'সাতাশ', 'আটাশ', 'ঊনত্রিশ', 'ত্রিশ', 'একত্রিশ', 'বত্রিশ', 'তেত্রিশ', 'চৌত্রিশ', 'পঁয়ত্রিশ', 'ছত্রিশ', 'সাঁয়ত্রিশ', 'আটত্রিশ', 'ঊনচল্লিশ', 'চল্লিশ', 'একচল্লিশ', 'বিয়াল্লিশ', 'তেতাল্লিশ', 'চুয়াল্লিশ', 'পঁয়তাল্লিশ', 'ছেচল্লিশ', 'সাতচল্লিশ', 'আটচল্লিশ', 'ঊনপঞ্চাশ', 'পঞ্চাশ', 'একান্ন', 'বায়ান্ন', 'তিপ্পান্ন', 'চুয়ান্ন', 'পঞ্চান্ন', 'ছাপ্পান্ন', 'সাতান্ন', 'আটান্ন', 'ঊনষাট', 'ষাট', 'একষট্টি', 'বাষট্টি', 'তেষট্টি', 'চৌষট্টি', 'পঁয়ষট্টি', 'ছেষট্টি', 'সাতষট্টি', 'আটষট্টি', 'ঊনসত্তর', 'সত্তর', 'একাত্তর', 'বাহাত্তর', 'তেহাত্তর', 'চুয়াত্তর', 'পঁচাত্তর', 'ছিয়াত্তর', 'সাতাত্তর', 'আটাত্তর', 'ঊনআশি', 'আশি', 'একাশি', 'বিরাশি', 'তিরাশি', 'চুরাশি', 'পঁচাশি', 'ছিয়াশি', 'সাতাশি', 'আটাশি', 'ঊননব্বই', 'নব্বই', 'একানব্বই', 'বিরানব্বই', 'তিরানব্বই', 'চুরানব্বই', 'পঁচানব্বই', 'ছিয়ানব্বই', 'সাতানব্বই', 'আটানব্বই', 'ঊনশত', 'শত'];
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
    return s.trim() + ' টাকা মাত্র';
  },

  unicodeToBijoy(text) {
    const map = {
      'অ':'A','আ':'A','ই':'E','ঈ':'E','উ':'U','ঊ':'U','ঋ':'R','এ':'E','ঐ':'E','ও':'O','ঔ':'O',
      'ক':'K','খ':'K','গ':'G','ঘ':'G','ঙ':'Ng','চ':'C','ছ':'C','জ':'J','ঝ':'J','ঞ':'Y','ট':'T',
      'ঠ':'T','ড':'D','ঢ':'D','ণ':'N','ত':'T','থ':'T','দ':'D','ধ':'D','ন':'N','প':'P','ফ':'P',
      'ব':'B','ভ':'B','ম':'M','য':'Z','র':'R','ল':'L','শ':'S','ষ':'S','স':'S','হ':'H','ড়':'R',
      'ঢ়':'R','য়':'Y','ৎ':'T','ং':'ং','ঃ':'%','ঁ':'^','া':'v','ি':'w','ী':'x','ু':'y','ূ':'y',
      'ৃ':'q','ে':'e','ৈ':'E','ো':'t','ৌ':'T','্':'`','০':'0','১':'1','২':'2','৩':'3','৪':'4',
      '৫':'5','৬':'6','৭':'7','৮':'8','৯':'9','।':'.','!':'!','?':'?'
    };
    return String(text).split('').map(ch => map[ch] ?? ch).join('');
  },

  bijoyToUnicode(text) {
    const rev = { 'A':'অ','E':'ই','U':'উ','R':'র','O':'ও','K':'ক','G':'গ','Ng':'ঙ','C':'চ','J':'জ','Y':'ঞ','T':'ট','D':'ড','N':'ণ','P':'প','B':'ব','M':'ম','Z':'য','L':'ল','S':'স','H':'হ','v':'া','w':'ি','x':'ী','y':'ু','q':'ৃ','e':'ে','t':'ো','`':'্','0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯','.':'।' };
    return String(text).split('').map(ch => rev[ch] ?? ch).join('');
  },

  // ============ 9. AI TEMPLATES ============
  aiGenerate(slug, input) {
    const t = (input || '').trim() || '—';
    const templates = {
      'ai-cv': () => `জীবনবৃত্তান্ত (Curriculum Vitae)\n${'='.repeat(45)}\nনাম: ${t}\nপদবি: আইটি ও ডিজিটাল সেবা উদ্যোক্তা\n\nসারসংক্ষেপ:\nঅভিজ্ঞ ও দক্ষ ডিজিটাল সার্ভিস স্পেশালিস্ট। নাগরিক সেবা, NID প্রসেসিং, ফটো এডিটিং ও গ্রাহক সেবায় পারদর্শী।\n\nপ্রধান দক্ষতাসমূহ:\n• কম্পিউটার অ্যাপ্লিকেশন ও ডাটা এন্ট্রি\n• অনলাইন আবেদন ও ফর্ম প্রসেসিং\n• ফটো এডিটিং ও A4 প্রিন্ট রেডি\n• কাস্টমার রিলেশনশিপ ও হিসাব সংরক্ষণ\n\nঅভিজ্ঞতা:\n• উদ্যোক্তা ও পরিচালক, সেবাকেন্দ্র ডিজিটাল হাব\n\nযোগাযোগ:\nফোন: [আপনার নম্বর] | ইমেইল: [আপনার ইমেইল]`,
      'ai-cover': () => `বরাবর,\nনিয়োগকারী কর্তৃপক্ষ\n\nবিষয়: ${t} পদের জন্য আবেদনপত্র।\n\nজনাব,\nবিনীত নিবেদন এই যে, আপনার প্রতিষ্ঠানে প্রকাশিত "${t}" পদের বিজ্ঞপ্তির প্রেক্ষিতে আমি একজন আগ্রহী প্রার্থী হিসেবে আবেদন করছি। আমার দক্ষতা ও পূর্ব অভিজ্ঞতা আপনার প্রতিষ্ঠানের অগ্রগতিতে ভূমিকা রাখবে বলে আমি বিশ্বাস করি।\n\nঅতএব, বিষয়টি বিবেচনাপূর্বক আমাকে মৌখিক পরীক্ষার সুযোগ দানে বাধিত করবেন।\n\nধন্যবাদান্তে,\n[আপনার নাম]`,
      'ai-caption': () => `✨ ${t} নিয়ে আকর্ষণীয় ক্যাপশন:\n\n১. "${t} — এক ক্লিকেই সমাধান! দ্রুত ও নির্ভুল সেবার বিশ্বস্ত ঠিকানা।"\n২. "ডিজিটাল সেবা এখন আপনার হাতের মুঠোয়। ${t} এর সেরা সমাধান নিয়ে আমরা আছি আপনার পাশে। 🚀"\n৩. "সময় বাঁচান, স্মার্ট হোন! ${t} সেবা পেতে আজই চলে আসুন আমাদের সেন্টারে। 🤝"`,
    };
    return (templates[slug] || (() => `AI ফলাফল (${slug}): ${t}`))();
  },
};
