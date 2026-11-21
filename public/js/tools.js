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

  // ============ AI PHOTO STUDIO ENGINE (Background Removal, Dress Replacement, Skin Smoothing & Studio Light) ============
  async processAiPhoto(img, {
    bg = '#0284C7',
    dress = 'বর্তমান পোশাক',
    dressOffsetY = 0,
    dressScale = 1.0,
    instructions = [],
    w = 600,
    h = 750
  } = {}) {
    // 1. Prepare base cropped canvas (40x50 mm passport ratio)
    const base = document.createElement('canvas');
    base.width = w; base.height = h;
    const bctx = base.getContext('2d');

    const srcAspect = img.width / img.height;
    const dstAspect = w / h;
    let sw, sh, sx, sy;
    if (srcAspect > dstAspect) {
      sh = img.height; sw = sh * dstAspect;
      sx = (img.width - sw) / 2; sy = 0;
    } else {
      sw = img.width; sh = sw / dstAspect;
      sx = 0; sy = (img.height - sh) / 2;
    }
    bctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);

    // 2. Perform AI Segmentation (MediaPipe or Smart Skin-Protected Color Segmenter)
    let segmentedCanvas = await this.segmentSubject(base);

    // 3. Composite onto target background
    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    const ctx = out.getContext('2d');

    // Fill background color
    ctx.fillStyle = bg || '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Subtle studio background radial gradient
    const bgRad = ctx.createRadialGradient(w * 0.5, h * 0.38, 40, w * 0.5, h * 0.45, w * 0.85);
    bgRad.addColorStop(0, 'rgba(255,255,255,0.22)');
    bgRad.addColorStop(1, 'rgba(0,0,0,0.12)');
    ctx.fillStyle = bgRad;
    ctx.fillRect(0, 0, w, h);

    // Draw segmented person
    ctx.drawImage(segmentedCanvas, 0, 0);

    // 4. Apply AI Enhancement Filters
    const instSet = new Set(instructions);
    if (instSet.has('ত্বক মসৃণ') || instSet.has('সৌন্দর্য বৃদ্ধি')) {
      this.applySkinSmoothing(ctx, w, h);
    }
    if (instSet.has('সৌন্দর্য বৃদ্ধি')) {
      this.applyBeautyEnhance(ctx, w, h);
    }
    if (instSet.has('স্টুডিও লাইট')) {
      this.applyStudioLight(ctx, w, h);
    }
    if (instSet.has('তৈলাক্ত ত্বক দূর')) {
      this.applyOilinessRemoval(ctx, w, h);
    }

    // 5. Apply Dress Overlay
    if (dress && dress !== 'বর্তমান পোশাক') {
      this.drawDressOverlay(ctx, w, h, dress, dressOffsetY, dressScale);
    }

    return out;
  },

  // Segment subject using MediaPipe or Smart Fallback
  async segmentSubject(canvas) {
    const W = canvas.width, H = canvas.height;

    // Check if MediaPipe SelfieSegmentation is available
    if (window.SelfieSegmentation) {
      try {
        const seg = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject('timeout'), 1800);
          try {
            const ss = new window.SelfieSegmentation({
              locateFile: (file) => `/vendor/mediapipe/${file}`
            });
            ss.setOptions({ modelSelection: 1 });
            ss.onResults((results) => {
              clearTimeout(timeout);
              const maskCanvas = document.createElement('canvas');
              maskCanvas.width = W; maskCanvas.height = H;
              const mctx = maskCanvas.getContext('2d');
              mctx.drawImage(results.segmentationMask, 0, 0, W, H);

              const out = document.createElement('canvas');
              out.width = W; out.height = H;
              const octx = out.getContext('2d');
              octx.drawImage(canvas, 0, 0);
              octx.globalCompositeOperation = 'destination-in';
              octx.drawImage(maskCanvas, 0, 0);
              resolve(out);
            });
            ss.send({ image: canvas });
          } catch (err) {
            clearTimeout(timeout);
            reject(err);
          }
        });
        if (seg) return seg;
      } catch (e) {
        // Fallback to Canvas Smart Segmenter
      }
    }

    // High Quality Fallback: Smart Color & Skin-Protected Segmenter
    return this.smartColorSegment(canvas);
  },

  // Smart Color Segmenter with skin & hair protection
  smartColorSegment(canvas) {
    const W = canvas.width, H = canvas.height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, W, H);
    const data = imgData.data;

    // Sample background colors from top corners and top 20px
    const bgSamples = [];
    for (let x = 0; x < W; x += 15) {
      for (let y = 0; y < 25; y += 5) {
        const idx = (y * W + x) * 4;
        bgSamples.push([data[idx], data[idx + 1], data[idx + 2]]);
      }
    }

    // Average BG color
    const avgBg = bgSamples.reduce((acc, c) => [acc[0] + c[0], acc[1] + c[1], acc[2] + c[2]], [0, 0, 0])
      .map(v => v / bgSamples.length);

    // Alpha mask
    const mask = new Uint8Array(W * H);

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const idx = (y * W + x) * 4;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];

        // 1. Never remove chest/torso at bottom center
        if (y > H * 0.72 && x > W * 0.15 && x < W * 0.85) {
          mask[y * W + x] = 255;
          continue;
        }

        // 2. Skin tone detection (keep face/neck protected)
        const isSkin = (r > 95 && g > 40 && b > 20 && (r - g) > 12 && r > b && (Math.max(r, g, b) - Math.min(r, g, b)) > 15);
        if (isSkin && y > H * 0.15 && y < H * 0.78 && x > W * 0.20 && x < W * 0.80) {
          mask[y * W + x] = 255;
          continue;
        }

        // 3. Dark hair and beard protection
        const lum = (r * 0.299 + g * 0.587 + b * 0.114);
        if (lum < 52 && y > H * 0.08 && y < H * 0.70 && x > W * 0.18 && x < W * 0.82) {
          mask[y * W + x] = 255;
          continue;
        }

        // Distance from sample BG colors
        let minDist = 999;
        for (const [br, bg, bb] of bgSamples) {
          const d = Math.sqrt((r - br) ** 2 + (g - bg) ** 2 + (b - bb) ** 2);
          if (d < minDist) minDist = d;
        }

        if (minDist < 38) {
          mask[y * W + x] = 0;
        } else if (minDist < 60) {
          mask[y * W + x] = Math.round(((minDist - 38) / 22) * 255);
        } else {
          mask[y * W + x] = 255;
        }
      }
    }

    // Apply alpha mask with edge feathering
    for (let i = 0; i < mask.length; i++) {
      data[i * 4 + 3] = mask[i];
    }

    const out = document.createElement('canvas');
    out.width = W; out.height = H;
    out.getContext('2d').putImageData(imgData, 0, 0);
    return out;
  },

  // Apply smooth skin filter to face area without blurring eyes/mouth/beard
  applySkinSmoothing(ctx, W, H) {
    const imgData = ctx.getImageData(0, 0, W, H);
    const data = imgData.data;

    // Face bounding box area: y: 20% to 56%, x: 25% to 75%
    const fy1 = Math.floor(H * 0.20), fy2 = Math.floor(H * 0.56);
    const fx1 = Math.floor(W * 0.25), fx2 = Math.floor(W * 0.75);

    const copy = new Uint8ClampedArray(data);

    for (let y = fy1; y < fy2; y++) {
      for (let x = fx1; x < fx2; x++) {
        const idx = (y * W + x) * 4;
        const r = copy[idx], g = copy[idx + 1], b = copy[idx + 2];

        // Check if skin tone
        const isSkin = (r > 100 && g > 50 && b > 30 && r > g && r > b && (r - g) > 10);
        // Avoid dark areas (eyes, eyebrows, nostrils, lips, beard)
        const lum = (r * 0.299 + g * 0.587 + b * 0.114);
        if (!isSkin || lum < 70) continue;

        // Bilateral smooth: 5x5 box filter on similar color pixels
        let tr = 0, tg = 0, tb = 0, count = 0;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const ny = y + dy, nx = x + dx;
            if (ny < 0 || ny >= H || nx < 0 || nx >= W) continue;
            const nidx = (ny * W + nx) * 4;
            const nr = copy[nidx], ng = copy[nidx + 1], nb = copy[nidx + 2];
            const diff = Math.abs(r - nr) + Math.abs(g - ng) + Math.abs(b - nb);
            if (diff < 45) {
              tr += nr; tg += ng; tb += nb; count++;
            }
          }
        }
        if (count > 2) {
          // Softly blend 60% smoothed + 40% original for realistic texture
          data[idx] = Math.round(data[idx] * 0.4 + (tr / count) * 0.6);
          data[idx + 1] = Math.round(data[idx + 1] * 0.4 + (tg / count) * 0.6);
          data[idx + 2] = Math.round(data[idx + 2] * 0.4 + (tb / count) * 0.6);
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  },

  // Beauty enhance: contrast, vibrance, eye clarity
  applyBeautyEnhance(ctx, W, H) {
    const imgData = ctx.getImageData(0, 0, W, H);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      let r = data[i], g = data[i + 1], b = data[i + 2];

      // Subtle contrast lift
      r = ((r - 128) * 1.08) + 128;
      g = ((g - 128) * 1.08) + 128;
      b = ((b - 128) * 1.08) + 128;

      // Warm brightness
      r += 8; g += 6; b += 4;

      data[i] = Math.min(255, Math.max(0, Math.round(r)));
      data[i + 1] = Math.min(255, Math.max(0, Math.round(g)));
      data[i + 2] = Math.min(255, Math.max(0, Math.round(b)));
    }
    ctx.putImageData(imgData, 0, 0);
  },

  // Studio lighting effect
  applyStudioLight(ctx, W, H) {
    const rad = ctx.createRadialGradient(W * 0.50, H * 0.35, 30, W * 0.50, H * 0.42, W * 0.75);
    rad.addColorStop(0, 'rgba(255,250,240,0.18)');
    rad.addColorStop(0.7, 'rgba(255,250,240,0.04)');
    rad.addColorStop(1, 'rgba(0,0,0,0.14)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, W, H);
  },

  // Remove oily specular glare from forehead/nose
  applyOilinessRemoval(ctx, W, H) {
    const imgData = ctx.getImageData(0, 0, W, H);
    const data = imgData.data;
    const fy1 = Math.floor(H * 0.22), fy2 = Math.floor(H * 0.48);
    const fx1 = Math.floor(W * 0.32), fx2 = Math.floor(W * 0.68);

    for (let y = fy1; y < fy2; y++) {
      for (let x = fx1; x < fx2; x++) {
        const idx = (y * W + x) * 4;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        const lum = (r * 0.299 + g * 0.587 + b * 0.114);
        if (lum > 220 && r > g && g > b) {
          // Tone down glare
          data[idx] = Math.round(r * 0.88);
          data[idx + 1] = Math.round(g * 0.88);
          data[idx + 2] = Math.round(b * 0.88);
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  },

  // ============ DRESS OVERLAYS (Blazer, Suit & Tie, Panjabi, Shirt, Hijab, Saree) ============
  drawDressOverlay(ctx, W, H, dressName, offsetY = 0, scale = 1.0) {
    ctx.save();

    // Baseline placement: passport shoulders start at y: 60% (~450px on 750px height)
    const baseY = (H * 0.62) + offsetY;
    const midX = W * 0.5;

    // Apply scale around center
    ctx.translate(midX, baseY);
    ctx.scale(scale, scale);
    ctx.translate(-midX, -baseY);

    if (dressName === 'ফরমাল ব্লেজার' || dressName === 'formal-blazer') {
      this.drawFormalBlazer(ctx, W, H, baseY, midX, false);
    } else if (dressName === 'টাই ও স্যুট' || dressName === 'tie-suit') {
      this.drawFormalBlazer(ctx, W, H, baseY, midX, true);
    } else if (dressName === 'পাঞ্জাবি' || dressName === 'panjabi') {
      this.drawPanjabi(ctx, W, H, baseY, midX);
    } else if (dressName === 'সলিড শার্ট' || dressName === 'solid-shirt') {
      this.drawSolidShirt(ctx, W, H, baseY, midX, false);
    } else if (dressName === 'চেক শার্ট' || dressName === 'check-shirt') {
      this.drawSolidShirt(ctx, W, H, baseY, midX, true);
    } else if (dressName === 'হিজাবের...' || dressName === 'হিজাব' || dressName === 'hijab') {
      this.drawHijab(ctx, W, H, baseY, midX);
    } else if (dressName === 'শাড়ি' || dressName === 'saree') {
      this.drawSaree(ctx, W, H, baseY, midX);
    }

    ctx.restore();
  },

  // Draw Realistic Tailored Formal Blazer (with or without executive tie)
  drawFormalBlazer(ctx, W, H, baseY, midX, withTie = false) {
    const neckW = 160;
    const neckTop = baseY - 70;
    const neckBottom = baseY + 120;

    // 1. Neck drop shadow onto shirt
    const nShadow = ctx.createLinearGradient(midX, neckTop - 20, midX, neckTop + 40);
    nShadow.addColorStop(0, 'rgba(0,0,0,0.45)');
    nShadow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = nShadow;
    ctx.fillRect(midX - 110, neckTop - 15, 220, 50);

    // 2. White Inner Formal Shirt
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(midX - neckW * 0.5, neckTop);
    ctx.lineTo(midX + neckW * 0.5, neckTop);
    ctx.lineTo(midX + 70, neckBottom + 80);
    ctx.lineTo(midX - 70, neckBottom + 80);
    ctx.closePath();
    ctx.fill();

    // Shirt collar leaves
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;

    // Left collar point
    ctx.beginPath();
    ctx.moveTo(midX - 75, neckTop);
    ctx.lineTo(midX - 20, neckTop + 65);
    ctx.lineTo(midX - 8, neckTop + 35);
    ctx.lineTo(midX - 45, neckTop - 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right collar point
    ctx.beginPath();
    ctx.moveTo(midX + 75, neckTop);
    ctx.lineTo(midX + 20, neckTop + 65);
    ctx.lineTo(midX + 8, neckTop + 35);
    ctx.lineTo(midX + 45, neckTop - 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Executive Tie (if withTie)
    if (withTie) {
      // Tie knot
      const knotGrad = ctx.createLinearGradient(midX - 18, neckTop + 35, midX + 18, neckTop + 65);
      knotGrad.addColorStop(0, '#881337'); // Deep Burgundy/Crimson
      knotGrad.addColorStop(0.5, '#be123c');
      knotGrad.addColorStop(1, '#4c0519');
      ctx.fillStyle = knotGrad;
      ctx.beginPath();
      ctx.moveTo(midX - 16, neckTop + 35);
      ctx.lineTo(midX + 16, neckTop + 35);
      ctx.lineTo(midX + 12, neckTop + 72);
      ctx.lineTo(midX - 12, neckTop + 72);
      ctx.closePath();
      ctx.fill();

      // Tie body
      const tieGrad = ctx.createLinearGradient(midX - 25, neckTop + 72, midX + 25, H);
      tieGrad.addColorStop(0, '#9f1239');
      tieGrad.addColorStop(0.5, '#be123c');
      tieGrad.addColorStop(1, '#881337');
      ctx.fillStyle = tieGrad;
      ctx.beginPath();
      ctx.moveTo(midX - 12, neckTop + 72);
      ctx.lineTo(midX + 12, neckTop + 72);
      ctx.lineTo(midX + 26, neckBottom + 160);
      ctx.lineTo(midX, neckBottom + 200);
      ctx.lineTo(midX - 26, neckBottom + 160);
      ctx.closePath();
      ctx.fill();

      // Tie diagonal silk stripes
      ctx.strokeStyle = 'rgba(255,255,255,0.22)';
      ctx.lineWidth = 2;
      for (let ty = neckTop + 85; ty < H; ty += 22) {
        ctx.beginPath();
        ctx.moveTo(midX - 20, ty);
        ctx.lineTo(midX + 20, ty - 12);
        ctx.stroke();
      }
    }

    // 3. Tailored Charcoal/Dark Blazer Jacket
    const suitColor = withTie ? '#0f172a' : '#18181b'; // Deep Navy for tie, Charcoal for blazer
    const suitGrad = ctx.createLinearGradient(0, neckTop, W, H);
    suitGrad.addColorStop(0, suitColor);
    suitGrad.addColorStop(0.5, '#27272a');
    suitGrad.addColorStop(1, '#09090b');

    ctx.fillStyle = suitGrad;
    ctx.beginPath();
    // Shoulder contour from left edge
    ctx.moveTo(0, baseY + 60);
    ctx.bezierCurveTo(W * 0.15, baseY + 10, W * 0.28, baseY - 35, midX - 85, neckTop + 10);
    // V-neck dip down to center button
    ctx.lineTo(midX - 20, neckBottom + 80);
    ctx.lineTo(midX, neckBottom + 95);
    ctx.lineTo(midX + 20, neckBottom + 80);
    // Up to right shoulder
    ctx.lineTo(midX + 85, neckTop + 10);
    ctx.bezierCurveTo(W * 0.72, baseY - 35, W * 0.85, baseY + 10, W, baseY + 60);
    // Down to bottom
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    // 4. Blazer Lapels with 3D Depth
    const lapelGrad = ctx.createLinearGradient(midX - 120, neckTop, midX, neckBottom);
    lapelGrad.addColorStop(0, '#27272a');
    lapelGrad.addColorStop(1, '#18181b');

    ctx.fillStyle = lapelGrad;
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;

    // Left Lapel
    ctx.beginPath();
    ctx.moveTo(midX - 85, neckTop + 10);
    ctx.lineTo(midX - 130, baseY + 20); // Notch peak
    ctx.lineTo(midX - 105, baseY + 35); // Notch dip
    ctx.lineTo(midX - 18, neckBottom + 80);
    ctx.lineTo(midX - 42, neckBottom + 70);
    ctx.lineTo(midX - 58, neckTop + 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Lapel
    ctx.beginPath();
    ctx.moveTo(midX + 85, neckTop + 10);
    ctx.lineTo(midX + 130, baseY + 20); // Notch peak
    ctx.lineTo(midX + 105, baseY + 35); // Notch dip
    ctx.lineTo(midX + 18, neckBottom + 80);
    ctx.lineTo(midX + 42, neckBottom + 70);
    ctx.lineTo(midX + 58, neckTop + 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Lapel Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.moveTo(midX - 18, neckBottom + 80);
    ctx.lineTo(midX - 30, neckBottom + 75);
    ctx.lineTo(midX - 95, baseY + 40);
    ctx.lineTo(midX - 105, baseY + 35);
    ctx.closePath();
    ctx.fill();

    // Suit Buttons
    ctx.fillStyle = '#09090b';
    ctx.strokeStyle = '#52525b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(midX, neckBottom + 110, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Pocket welt (left chest)
    ctx.fillStyle = '#27272a';
    ctx.fillRect(midX - 150, baseY + 80, 50, 7);
  },

  // Draw Traditional Panjabi with Mandarin Collar
  drawPanjabi(ctx, W, H, baseY, midX) {
    const neckTop = baseY - 60;
    const pGrad = ctx.createLinearGradient(0, neckTop, W, H);
    pGrad.addColorStop(0, '#f8fafc');
    pGrad.addColorStop(0.5, '#f1f5f9');
    pGrad.addColorStop(1, '#e2e8f0');

    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.moveTo(0, baseY + 60);
    ctx.bezierCurveTo(W * 0.15, baseY + 10, W * 0.30, baseY - 30, midX - 65, neckTop + 10);
    ctx.lineTo(midX + 65, neckTop + 10);
    ctx.bezierCurveTo(W * 0.70, baseY - 30, W * 0.85, baseY + 10, W, baseY + 60);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    // Mandarin Stand Collar (ব্যান্ড কলার)
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(midX - 65, neckTop + 10);
    ctx.bezierCurveTo(midX - 30, neckTop - 8, midX + 30, neckTop - 8, midX + 65, neckTop + 10);
    ctx.lineTo(midX + 65, neckTop + 28);
    ctx.bezierCurveTo(midX + 30, neckTop + 10, midX - 30, neckTop + 10, midX - 65, neckTop + 28);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Collar embroidery trim
    ctx.strokeStyle = '#d97706'; // Gold embroidery line
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(midX - 62, neckTop + 18);
    ctx.bezierCurveTo(midX - 28, neckTop + 2, midX + 28, neckTop + 2, midX + 62, neckTop + 18);
    ctx.stroke();

    // Front Placket with buttons
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(midX - 14, neckTop + 28, 28, 200);
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(midX - 14, neckTop + 28, 28, 200);

    for (let by = neckTop + 55; by < neckTop + 210; by += 35) {
      ctx.fillStyle = '#b45309'; // Gold/wooden button
      ctx.beginPath();
      ctx.arc(midX, by, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // Draw Formal Solid or Check Shirt
  drawSolidShirt(ctx, W, H, baseY, midX, isChecked = false) {
    const neckTop = baseY - 65;
    const sGrad = ctx.createLinearGradient(0, neckTop, W, H);
    sGrad.addColorStop(0, '#e0f2fe'); // Crisp Sky Blue
    sGrad.addColorStop(1, '#bae6fd');

    ctx.fillStyle = isChecked ? '#f8fafc' : sGrad;
    ctx.beginPath();
    ctx.moveTo(0, baseY + 60);
    ctx.bezierCurveTo(W * 0.15, baseY + 10, W * 0.30, baseY - 30, midX - 70, neckTop + 10);
    ctx.lineTo(midX + 70, neckTop + 10);
    ctx.bezierCurveTo(W * 0.70, baseY - 30, W * 0.85, baseY + 10, W, baseY + 60);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    // If checked shirt, draw smart check grid
    if (isChecked) {
      ctx.strokeStyle = 'rgba(2, 132, 199, 0.25)';
      ctx.lineWidth = 1.5;
      for (let gx = 0; gx < W; gx += 20) {
        ctx.beginPath(); ctx.moveTo(gx, baseY - 20); ctx.lineTo(gx, H); ctx.stroke();
      }
      for (let gy = baseY - 20; gy < H; gy += 20) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      }
    }

    // Shirt Collar
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;

    // Left collar
    ctx.beginPath();
    ctx.moveTo(midX - 70, neckTop + 10);
    ctx.lineTo(midX - 15, neckTop + 65);
    ctx.lineTo(midX, neckTop + 25);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Right collar
    ctx.beginPath();
    ctx.moveTo(midX + 70, neckTop + 10);
    ctx.lineTo(midX + 15, neckTop + 65);
    ctx.lineTo(midX, neckTop + 25);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Center button placket
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(midX - 12, neckTop + 25, 24, 220);
    ctx.strokeRect(midX - 12, neckTop + 25, 24, 220);

    for (let by = neckTop + 50; by < neckTop + 240; by += 40) {
      ctx.fillStyle = '#f1f5f9';
      ctx.strokeStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(midX, by, 4.5, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    }
  },

  // Draw Hijab Drape
  drawHijab(ctx, W, H, baseY, midX) {
    const hGrad = ctx.createLinearGradient(0, baseY - 80, W, H);
    hGrad.addColorStop(0, '#1e293b');
    hGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = hGrad;

    ctx.beginPath();
    ctx.moveTo(0, baseY + 60);
    ctx.bezierCurveTo(W * 0.20, baseY - 20, W * 0.35, baseY - 70, midX - 80, baseY - 60);
    ctx.bezierCurveTo(midX, baseY - 30, midX + 80, baseY - 60, midX + 80, baseY - 60);
    ctx.bezierCurveTo(W * 0.65, baseY - 70, W * 0.80, baseY - 20, W, baseY + 60);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    // Fabric fold lines
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(midX - 50, baseY - 40);
    ctx.bezierCurveTo(midX - 10, baseY + 40, midX + 10, baseY + 60, midX + 60, baseY + 120);
    ctx.stroke();
  },

  // Draw Saree Drape
  drawSaree(ctx, W, H, baseY, midX) {
    const sGrad = ctx.createLinearGradient(0, baseY, W, H);
    sGrad.addColorStop(0, '#831843'); // Rich maroon
    sGrad.addColorStop(1, '#500724');
    ctx.fillStyle = sGrad;

    ctx.beginPath();
    ctx.moveTo(0, baseY + 60);
    ctx.lineTo(W, baseY + 40);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    // Diagonal Pallu across shoulder
    ctx.fillStyle = '#9d174d';
    ctx.beginPath();
    ctx.moveTo(0, baseY + 70);
    ctx.lineTo(midX - 40, baseY - 20);
    ctx.lineTo(midX + 70, baseY - 20);
    ctx.lineTo(W * 0.40, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    // Golden border trim
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, baseY + 70);
    ctx.lineTo(midX - 40, baseY - 20);
    ctx.stroke();
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
