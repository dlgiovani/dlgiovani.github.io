/* Animated lever demonstrations for the portfolio.
   Three self-contained <canvas> web components, each with an auto-toggling,
   click-toggleable lever that flips the system from a grayscale / laborious
   state to a colorized / effortless one.

   Custom elements:
     <consulting-anim accent="#hex"></consulting-anim>
     <integration-anim accent="#hex"></integration-anim>
     <automation-anim accent="#hex"></automation-anim>
*/
(function () {
  "use strict";

  /* ---------- color helpers ---------- */
  function hexToRgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function css(c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + (a == null ? 1 : a) + ')'; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpC(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
  function gray(c) { const l = 0.30 * c[0] + 0.59 * c[1] + 0.11 * c[2]; return [l, l, l]; }
  // mix=1 full color, mix=0 grayscale
  function colorize(c, mix) { return lerpC(gray(c), c, mix); }
  function smooth(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }
  function clamp01(x) { return Math.max(0, Math.min(1, x)); }

  /* ---------- light, proximity-based pointer interactivity ----------
     A single shared pointer state (only one scene is ever on screen). */
  const MOUSE = { x: -1e5, y: -1e5, tx: -1e5, ty: -1e5, infl: 0, tActive: false };
  // pull a point GENTLY toward the (smoothed) cursor, fading to 0 at `radius`
  function mouseNudge(x, y, radius, amp) {
    if (MOUSE.infl < 1e-3) return [0, 0];
    const dx = MOUSE.x - x, dy = MOUSE.y - y, d = Math.hypot(dx, dy);
    if (d > radius || d < 1e-4) return [0, 0];
    const t = smooth(1 - d / radius);
    const f = amp * t * MOUSE.infl / d;
    return [dx * f, dy * f];
  }
  // pupil offset toward the cursor when it's within `radius` (face flips x)
  function eyeTrack(wx, wy, faceX, amp, radius) {
    if (MOUSE.infl < 1e-3) return [0, 0];
    const dx = MOUSE.x - wx, dy = MOUSE.y - wy, d = Math.hypot(dx, dy);
    if (d > radius || d < 1e-4) return [0, 0];
    const prox = 0.4 + 0.6 * smooth(1 - d / radius);
    const k = amp * prox * MOUSE.infl / d;
    return [faceX * dx * k, dy * k];
  }

  function hslToRgb(h, s, l) {
    h /= 360;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
      const k = (n + h * 12) % 12;
      return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    };
    return [f(0) * 255, f(8) * 255, f(4) * 255];
  }
  function rgbToHsl(c) {
    const r = c[0] / 255, g = c[1] / 255, b = c[2] / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    let h = 0, s = 0, l = (mx + mn) / 2;
    if (mx !== mn) {
      const d = mx - mn;
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      if (mx === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (mx === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return [h, s, l];
  }
  // harmonious palette derived from a single brand accent
  function buildPalette(accentHex, n) {
    const base = rgbToHsl(hexToRgb(accentHex));
    const out = [];
    const span = 70; // degrees swept around the accent hue
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const h = (base[0] + (t - 0.5) * span + 360) % 360;
      const s = clamp01(base[1] * (0.72 + 0.28 * Math.cos((t - 0.5) * 2)));
      const l = clamp01(base[2] * (0.85 + 0.30 * (t - 0.5)));
      out.push(hslToRgb(h, s, l));
    }
    return out;
  }

  const INK = [44, 40, 34];
  const MID = [126, 120, 110];
  const FAINT = [196, 190, 180];
  const ERR = [200, 70, 55];

  /* ---------- base component ---------- */
  class LeverAnim extends HTMLElement {
    static get observedAttributes() { return ['accent']; }

    connectedCallback() {
      this.accentHex = this.getAttribute('accent') || '#E0512B';
      this.palette = buildPalette(this.accentHex, 6);
      this.accentRgb = hexToRgb(this.accentHex);

      this.style.display = 'block';
      this.style.position = 'relative';
      this.style.width = '100%';
      this.style.height = '100%';

      const cv = document.createElement('canvas');
      cv.style.cssText = 'display:block;width:100%;height:100%;';
      this.appendChild(cv);
      this.canvas = cv;
      this.ctx = cv.getContext('2d');

      this._buildLever();

      this.on = false;
      this.mix = 0;
      this.t = 0;
      this.switchT = 0;
      this.start = performance.now();
      this.last = this.start;

      this._ro = new ResizeObserver(() => this._resize());
      this._ro.observe(this);
      this._resize();

      this._raf = requestAnimationFrame(this._loop.bind(this));

      // track the cursor (canvas-local) for proximity interactivity. The canvas
      // rect is cached (refreshed once per frame) so pointer moves never force a
      // synchronous layout.
      this.addEventListener('pointermove', (e) => {
        const r = this._rect || (this._rect = this.canvas.getBoundingClientRect());
        MOUSE.tx = e.clientX - r.left; MOUSE.ty = e.clientY - r.top; MOUSE.tActive = true;
        if (MOUSE.infl < 0.02) { MOUSE.x = MOUSE.tx; MOUSE.y = MOUSE.ty; }  // snap in, fade strength
      });
      this.addEventListener('pointerleave', () => { MOUSE.tActive = false; });
    }

    disconnectedCallback() {
      cancelAnimationFrame(this._raf);
      clearInterval(this._auto);
      if (this._ro) this._ro.disconnect();
    }

    attributeChangedCallback(name, _o, v) {
      if (name === 'accent' && v) {
        this.accentHex = v;
        this.accentRgb = hexToRgb(v);
        this.palette = buildPalette(v, 6);
        if (this.lever) this.lever.style.setProperty('--accent', v);
      }
    }

    _buildLever() {
      const w = document.createElement('button');
      w.setAttribute('aria-label', 'Toggle the system');
      w.style.cssText =
        'position:absolute;left:50%;bottom:14px;transform:translateX(-50%);' +
        'width:92px;height:62px;border:0;background:transparent;cursor:pointer;padding:0;' +
        'outline:none;-webkit-tap-highlight-color:transparent;';
      w.style.setProperty('--accent', this.accentHex);
      w.innerHTML =
        '<svg viewBox="0 0 92 62" width="92" height="62" style="overflow:visible">' +
        '<rect x="22" y="44" width="48" height="13" rx="6.5" fill="#2c2822"/>' +
        '<rect x="22" y="44" width="48" height="13" rx="6.5" fill="none" stroke="#1a1712" stroke-width="1"/>' +
        '<circle cx="46" cy="50" r="3" fill="#5a544b"/>' +
        '<g class="ltwitch" style="transform-box:view-box;transform-origin:46px 50px;animation:leverTwitch 3.4s ease-in-out infinite">' +
        '<g class="larm" style="transform-box:view-box;transform-origin:46px 50px;transition:transform .7s cubic-bezier(.65,.02,.25,1)">' +
        '<line x1="46" y1="50" x2="46" y2="16" stroke="#3a352e" stroke-width="6" stroke-linecap="round"/>' +
        '<circle class="lknob" cx="46" cy="14" r="9" fill="#3a352e"/>' +
        '</g></g>' +
        '<g class="lhint" style="animation:hintBob 1.4s ease-in-out infinite">' +
        '<path d="M46 -9 L46 2 M41 -3 L46 2 L51 -3" fill="none" stroke="' + this.accentHex + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</g>' +
        '</svg>';
      w.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggle(true); }
      });
      this.appendChild(w);
      this.lever = w;
      this.larm = w.querySelector('.larm');
      this.lknob = w.querySelector('.lknob');
      this.ltwitch = w.querySelector('.ltwitch');
      this.lhint = w.querySelector('.lhint');
      this._bindLeverDrag(w);
      if (!document.getElementById('__lever_kf')) {
        const st = document.createElement('style'); st.id = '__lever_kf';
        st.textContent =
          '@keyframes leverTwitch{0%,68%,100%{transform:rotate(0)}76%{transform:rotate(-6deg)}84%{transform:rotate(4.5deg)}92%{transform:rotate(-2deg)}}' +
          '@keyframes hintBob{0%,100%{transform:translateY(0);opacity:.85}50%{transform:translateY(4px);opacity:1}}';
        document.head.appendChild(st);
      }
      this._paintLever();
    }

    // the handle is both clickable (tap) and draggable (swing it across)
    _bindLeverDrag(w) {
      const ON = 32, OFF = -32;
      let dragging = false, sx = 0, moved = 0, baseAng = 0, dragAng = 0;
      const setAng = (a) => { this.larm.style.transition = 'none'; this.larm.style.transform = 'rotate(' + a + 'deg)'; };
      w.addEventListener('pointerdown', (e) => {
        dragging = true; moved = 0; sx = e.clientX;
        baseAng = this.on ? ON : OFF; dragAng = baseAng;
        this._hideHint();
        try { w.setPointerCapture(e.pointerId); } catch (_) {}
        e.preventDefault();
      });
      w.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
        dragAng = Math.max(OFF, Math.min(ON, baseAng + dx * 0.9));
        setAng(dragAng);
      });
      const end = (e) => {
        if (!dragging) return; dragging = false;
        try { w.releasePointerCapture(e.pointerId); } catch (_) {}
        this.larm.style.transition = 'transform .7s cubic-bezier(.65,.02,.25,1)';
        if (moved < 4) { this.toggle(true); return; }   // barely moved -> treat as a click
        const wantOn = dragAng >= 0;
        if (wantOn !== this.on) {
          this.on = wantOn; this.switchT = this.t; this._paintLever();
          if (this.onSwitch) this.onSwitch(this.on);
        } else { this._paintLever(); }                  // snap back to current state
      };
      w.addEventListener('pointerup', end);
      w.addEventListener('pointercancel', end);
    }

    _hideHint() {
      if (this.lhint) { this.lhint.style.animation = 'none'; this.lhint.style.transition = 'opacity .35s'; this.lhint.style.opacity = '0'; }
      if (this.ltwitch) this.ltwitch.style.animation = 'none';
    }

    _paintLever() {
      if (!this.larm) return;
      this.larm.style.transform = 'rotate(' + (this.on ? 32 : -32) + 'deg)';
      this.lknob.setAttribute('fill', this.on ? this.accentHex : '#3a352e');
    }

    toggle(user) {
      this.on = !this.on;
      this.switchT = this.t;
      this._paintLever();
      this._hideHint();
      if (this.onSwitch) this.onSwitch(this.on);
    }

    _resize() {
      const r = this.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = Math.max(1, r.width);
      this.h = Math.max(1, r.height);
      this.canvas.width = Math.round(this.w * dpr);
      this.canvas.height = Math.round(this.h * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this._init = false;
    }

    _loop(now) {
      // stop a stale loop after the element is torn down (sc-if navigation)
      if (!this.isConnected) { this._raf = 0; return; }
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.t = (now - this.start) / 1000;
      const target = this.on ? 1 : 0;
      this.mix += (target - this.mix) * Math.min(1, dt * 3.2);
      // ease the shared pointer toward its target + fade influence in/out, so all
      // proximity effects transition smoothly instead of snapping
      const mk = 1 - Math.exp(-dt / 0.09);
      MOUSE.x += (MOUSE.tx - MOUSE.x) * mk;
      MOUSE.y += (MOUSE.ty - MOUSE.y) * mk;
      MOUSE.infl += ((MOUSE.tActive ? 1 : 0) - MOUSE.infl) * mk;
      // refresh the cached canvas rect once per frame (cheap; avoids per-event layout)
      if (MOUSE.tActive) this._rect = this.canvas.getBoundingClientRect();
      const ctx = this.ctx;
      // skip a frame if not fully initialised yet, but KEEP the loop alive so the
      // animation reliably appears once ready (guards re-mount races)
      if (!ctx || !this.palette || !this.w) { this._raf = requestAnimationFrame(this._loop.bind(this)); return; }
      ctx.clearRect(0, 0, this.w, this.h);
      if (!this._init && this.setup) { this.setup(this.w, this.h); this._init = true; }
      if (this.render) {
        try { this.render(ctx, this.w, this.h, dt, this.t); }
        catch (e) { /* never let one bad frame kill the loop */ }
      }
      this._raf = requestAnimationFrame(this._loop.bind(this));
    }

    // persistent per-figure state (for smooth limb inertia)
    _figState(key) { if (!this._fs) this._fs = {}; return this._fs[key] || (this._fs[key] = {}); }

    // a soft accent wash that fades in when the system is colorized
    bgWash(ctx, w, h) {
      const m = smooth(this.mix);
      if (m < 0.02) return;
      const g = ctx.createRadialGradient(w / 2, h * 0.46, 0, w / 2, h * 0.46, Math.max(w, h) * 0.6);
      g.addColorStop(0, css(this.accentRgb, 0.07 * m));
      g.addColorStop(1, css(this.accentRgb, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
  }

  /* ---------- helpers shared by the figurative scenes ---------- */
  function strokePath(ctx, pts, col, lw) {
    ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
    ctx.stroke();
  }
  // rounded, faced line-art figure (shared look). pose: {lean, armA, armB,
  // handL, handR, legPh, sit, face} — same API as before, nicer rendering.
  function figure(ctx, x, y, s, pose, col, sweat) {
    const u = s / 30;
    const lw = 2.3 * u;
    const face = pose.face || 1;
    const lean = pose.lean || 0;
    // whole figure drifts a touch toward a nearby cursor
    const bodyN = mouseNudge(x, y - 24 * u, 150 * u, 5 * u);
    x += bodyN[0]; y += bodyN[1];
    // limb inertia: hands lag behind body motion and swing open when it drops
    const st = pose.st, idt = pose.dt || 0.016;
    let lagX = 0, lagY = 0;
    if (st) {
      if (st.lx == null) { st.lx = x; st.ly = y; }
      const lk = 1 - Math.exp(-idt / 0.17);
      st.lx += (x - st.lx) * lk; st.ly += (y - st.ly) * lk;
      const mxl = 8 * u;                       // cap so limbs never stretch too far
      lagX = Math.max(-mxl, Math.min(mxl, (st.lx - x) * 2.5));
      lagY = Math.max(-mxl, Math.min(mxl, (st.ly - y) * 2.5));
    }
    const limbX = face * lagX, limbY = lagY;
    const openAmt = Math.min(6 * u, Math.max(0, -lagY) * 1.8);   // body descending -> arms open/up
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(face, 1);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw;

    const hipY = 0;
    const headR = 9 * u;
    const headY = -42 * u;
    const headX = lean * 34 * u;            // lean tilts the upper body sideways
    const shY = headY + headR + 4 * u;
    const shX = headX * 0.7;

    // legs
    if (pose.sit) {
      ctx.beginPath(); ctx.moveTo(-4 * u, hipY); ctx.quadraticCurveTo(9 * u, hipY + 2 * u, 10 * u, hipY + 13 * u); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4 * u, hipY); ctx.quadraticCurveTo(13 * u, hipY + 3 * u, 14 * u, hipY + 13 * u); ctx.stroke();
    } else {
      const ph = pose.legPh || 0;
      const sa = Math.sin(ph) * 5 * u, sb = Math.sin(ph + Math.PI) * 5 * u, ll = 18 * u;
      ctx.beginPath(); ctx.moveTo(-4 * u, hipY); ctx.lineTo(-4 * u + sa, hipY + ll); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4 * u, hipY); ctx.lineTo(4 * u + sb, hipY + ll); ctx.stroke();
      ctx.beginPath(); ctx.arc(-4 * u + sa, hipY + ll, 2.2 * u, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(4 * u + sb, hipY + ll, 2.2 * u, 0, Math.PI * 2); ctx.fill();
    }

    // arms (curved, round hands). endpoints keep the original angle-based math.
    const aL = pose.armA == null ? -0.5 : pose.armA, aR = pose.armB == null ? 0.5 : pose.armB;
    const al = 16 * u;
    const shoulderW = 7 * u;
    const drawArm = (ang, hand, bend, ox, side) => {
      let ex = ox + Math.sin(ang) * al + (hand ? hand[0] * u : 6 * u);
      let ey = shY + Math.cos(ang) * al * 0.9 + (hand ? hand[1] * u : 8 * u);
      ex += limbX + side * openAmt; ey += limbY;
      const mx = (ox + ex) / 2 + bend * u, my = (shY + ey) / 2;
      ctx.beginPath(); ctx.moveTo(ox, shY); ctx.quadraticCurveTo(mx, my, ex, ey); ctx.stroke();
      ctx.beginPath(); ctx.arc(ex, ey, 2.6 * u, 0, Math.PI * 2); ctx.fill();
    };
    drawArm(aL, pose.handL, -5, shX - shoulderW, -1);
    drawArm(aR, pose.handR, 5, shX + shoulderW, 1);

    // rounded torso (head sits on top, leaning)
    ctx.beginPath();
    ctx.moveTo(-12 * u, hipY);
    ctx.quadraticCurveTo(-15 * u + shX, shY + 3 * u, shX - 8 * u, shY);
    ctx.lineTo(shX + 8 * u, shY);
    ctx.quadraticCurveTo(15 * u + shX, shY + 3 * u, 12 * u, hipY);
    ctx.quadraticCurveTo(0, hipY + 4 * u, -12 * u, hipY);
    ctx.stroke();

    // head + eyes — the head eases toward a nearby cursor, eyes track it
    const hp = mouseNudge(x + face * headX, y + headY, headR * 6, headR * 0.8);
    const hX = headX + face * hp[0], hY = headY + hp[1];
    ctx.beginPath(); ctx.arc(hX, hY, headR, 0, Math.PI * 2); ctx.stroke();
    const look = pose.look != null ? pose.look : Math.max(-1, Math.min(1, lean * 8));
    const ed = look * 2.5 * u;
    const ep = eyeTrack(x + face * hX, y + hY, face, 0.9 * u, 230);
    const exL = hX - 3.5 * u + ed + ep[0], exR = hX + 3.5 * u + ed + ep[0], eY = hY - 0.5 * u + ep[1];
    ctx.beginPath(); ctx.arc(exL, eY, 1.5 * u, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(exR, eY, 1.5 * u, 0, Math.PI * 2); ctx.fill();

    if (sweat && sweat > 0) {
      ctx.fillStyle = css(MID, 0.7 * sweat);
      const dy = (performance.now() / 1000 * 60) % 18;
      ctx.beginPath(); ctx.ellipse(hX + headR + 2 * u, hY - 2 + dy, 2, 3, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  /* ---------- procedural chain (FABRIK-style follow) for fluid, rounded limbs ---------- */
  function simplifyAngle(a) { const t = Math.PI * 2; a %= t; if (a < 0) a += t; return a; }
  function relativeAngleDiff(angle, anchor) { angle = simplifyAngle(angle + Math.PI - anchor); return Math.PI - angle; }
  function constrainAngle(angle, anchor, constraint) {
    if (Math.abs(relativeAngleDiff(angle, anchor)) <= constraint) return simplifyAngle(angle);
    if (relativeAngleDiff(angle, anchor) > constraint) return simplifyAngle(anchor - constraint);
    return simplifyAngle(anchor + constraint);
  }
  class Chain {
    constructor(origin, jointCount, linkSize, angleConstraint) {
      this.linkSize = linkSize;
      this.angleConstraint = angleConstraint == null ? Math.PI * 2 : angleConstraint;
      this.joints = [[origin[0], origin[1]]];
      this.angles = [0];
      for (let i = 1; i < jointCount; i++) {
        this.joints.push([origin[0], origin[1] + linkSize * i]);
        this.angles.push(Math.PI / 2);
      }
    }
    resolve(pos) {
      this.angles[0] = Math.atan2(pos[1] - this.joints[0][1], pos[0] - this.joints[0][0]);
      this.joints[0] = [pos[0], pos[1]];
      for (let i = 1; i < this.joints.length; i++) {
        const cur = Math.atan2(this.joints[i - 1][1] - this.joints[i][1], this.joints[i - 1][0] - this.joints[i][0]);
        this.angles[i] = constrainAngle(cur, this.angles[i - 1], this.angleConstraint);
        this.joints[i] = [
          this.joints[i - 1][0] - Math.cos(this.angles[i]) * this.linkSize,
          this.joints[i - 1][1] - Math.sin(this.angles[i]) * this.linkSize
        ];
      }
    }
  }
  // a smooth, rounded silhouette around a chain of joints with per-joint radii
  function drawLimb(ctx, joints, radii, fill) {
    const n = joints.length, left = [], right = [];
    for (let i = 0; i < n; i++) {
      let dx, dy;
      if (i === 0) { dx = joints[0][0] - joints[1][0]; dy = joints[0][1] - joints[1][1]; }
      else if (i === n - 1) { dx = joints[i - 1][0] - joints[i][0]; dy = joints[i - 1][1] - joints[i][1]; }
      else { dx = joints[i - 1][0] - joints[i + 1][0]; dy = joints[i - 1][1] - joints[i + 1][1]; }
      const len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
      right.push([joints[i][0] + nx * radii[i], joints[i][1] + ny * radii[i]]);
      left.push([joints[i][0] - nx * radii[i], joints[i][1] - ny * radii[i]]);
    }
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(right[0][0], right[0][1]);
    for (let i = 1; i < right.length; i++) ctx.lineTo(right[i][0], right[i][1]);
    for (let i = left.length - 1; i >= 0; i--) ctx.lineTo(left[i][0], left[i][1]);
    ctx.closePath(); ctx.fill();
    // rounded caps at both ends
    ctx.beginPath(); ctx.arc(joints[0][0], joints[0][1], radii[0], 0, Math.PI * 2); ctx.fill();
    const e = joints[n - 1]; ctx.beginPath(); ctx.arc(e[0], e[1], radii[n - 1], 0, Math.PI * 2); ctx.fill();
  }

  /* ---------- shared rounded line-art person + desk (used by every scene) ---------- */
  function deskFig(ctx, x, y, s, face) {
    ctx.strokeStyle = css(INK, 0.8); ctx.lineWidth = 2; ctx.lineCap = 'round';
    const a = face * 40 * s, b = -face * 26 * s;
    ctx.beginPath();
    ctx.moveTo(x + b, y); ctx.lineTo(x + a, y);
    ctx.moveTo(x + b * 0.78, y); ctx.lineTo(x + b * 0.78, y + 22 * s);
    ctx.moveTo(x + a * 0.85, y); ctx.lineTo(x + a * 0.85, y + 22 * s);
    ctx.stroke();
  }
  // a rounded, faced figure: head + eyes + arms (absolute hand targets) + optional legs
  function personFig(ctx, x, y, s, o) {
    o = o || {};
    // whole figure drifts slightly toward a nearby cursor
    const bn = mouseNudge(x, y - 24 * s, 150 * s, 5 * s);
    x += bn[0]; y += bn[1];
    // limb inertia: hands lag behind body motion and open when it drops
    const st = o.st, idt = o.dt || 0.016;
    let lagX = 0, lagY = 0;
    if (st) {
      if (st.lx == null) { st.lx = x; st.ly = y; }
      const lk = 1 - Math.exp(-idt / 0.17);
      st.lx += (x - st.lx) * lk; st.ly += (y - st.ly) * lk;
      const mxl = 8 * s;                       // cap so limbs never stretch too far
      lagX = Math.max(-mxl, Math.min(mxl, (st.lx - x) * 2.5));
      lagY = Math.max(-mxl, Math.min(mxl, (st.ly - y) * 2.5));
    }
    const openAmt = Math.min(6 * s, Math.max(0, -lagY) * 1.8);
    const ink = css(INK, o.alpha == null ? 0.9 : o.alpha), lw = 2.2 * s;
    const headR = 11 * s;
    const lean = o.lean || 0;
    const hx = x + lean, hy = y - 42 * s;
    const shY = hy + headR + 5 * s;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = lw;
    // legs (optional, for walking figures)
    if (o.legs) {
      const lp = o.legPh || 0, ll = 17 * s;
      const sa = Math.sin(lp) * 6 * s, sb = Math.sin(lp + Math.PI) * 6 * s;
      ctx.beginPath(); ctx.moveTo(x - 5 * s, y); ctx.lineTo(x - 5 * s + sa, y + ll); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 5 * s, y); ctx.lineTo(x + 5 * s + sb, y + ll); ctx.stroke();
      ctx.beginPath(); ctx.arc(x - 5 * s + sa, y + ll, 2.4 * s, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 5 * s + sb, y + ll, 2.4 * s, 0, Math.PI * 2); ctx.fill();
    }
    // arms first so they tuck under the body/head
    const arm = (sx, sy, t, bend, side) => {
      if (!t) return;
      const tx = t[0] + lagX + side * openAmt, ty = t[1] + lagY;
      const mx = (sx + tx) / 2 + bend, my = (sy + ty) / 2;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(mx, my, tx, ty); ctx.stroke();
      ctx.beginPath(); ctx.arc(tx, ty, 2.6 * s, 0, Math.PI * 2); ctx.fill();
    };
    arm(hx - 8 * s, shY + 2 * s, o.armL, -7 * s, -1);
    arm(hx + 8 * s, shY + 2 * s, o.armR, 7 * s, 1);
    // rounded torso
    ctx.beginPath();
    ctx.moveTo(x - 13 * s, y);
    ctx.quadraticCurveTo(x - 16 * s, shY + 3 * s, hx - 9 * s, shY);
    ctx.lineTo(hx + 9 * s, shY);
    ctx.quadraticCurveTo(x + 16 * s, shY + 3 * s, x + 13 * s, y);
    ctx.quadraticCurveTo(x, y + 5 * s, x - 13 * s, y);
    ctx.stroke();
    // head — eases toward a nearby cursor; eyes track it
    const hp = mouseNudge(hx, hy, headR * 5.5, headR * 0.7);
    const hX = hx + hp[0], hY = hy + hp[1];
    ctx.beginPath(); ctx.arc(hX, hY, headR, 0, Math.PI * 2); ctx.stroke();
    // eyes
    const ex = (o.face ? o.face : 0) * 2 * s;
    const ey = o.look === 'down' ? 3 * s : (o.look === 'up' ? -3 * s : 0);
    const ep = eyeTrack(hX, hY, 1, 1.0 * s, 230);
    ctx.beginPath(); ctx.arc(hX - 4 * s + ex + ep[0], hY - 1 * s + ey + ep[1], 1.6 * s, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hX + 4 * s + ex + ep[0], hY - 1 * s + ey + ep[1], 1.6 * s, 0, Math.PI * 2); ctx.fill();
    if (o.sweat) {
      ctx.fillStyle = css(MID, 0.7);
      const d = ((o.time || 0) * 60) % 20;
      ctx.beginPath(); ctx.ellipse(hX + headR + 2 * s, hY - 4 + d, 2, 3, 0, 0, Math.PI * 2); ctx.fill();
    }
  }

  /* ============================================================
     1. CONSULTING — an inefficient vs. efficient machine that
        powers a lightbulb; a fluid worker drives it by effort
     ============================================================ */
  class ConsultingAnim extends LeverAnim {
    setup(w, h) {
      this.gearDefs = [
        { rf: 0.085, teeth: 11 },
        { rf: 0.070, teeth: 9, ang: -0.55 },
        { rf: 0.082, teeth: 10, ang: 0.32 },
        { rf: 0.060, teeth: 8, ang: -0.78 },
        { rf: 0.074, teeth: 9, ang: -0.08 },
        { rf: 0.052, teeth: 8, ang: -0.62 }
      ];
      this.angles = new Array(this.gearDefs.length).fill(0);
      // useless extra cogs that clutter the inefficient (OFF) machine
      this.offGears = [
        { parent: 1, ang: -1.7, rf: 0.050, teeth: 8 },
        { parent: 2, ang: 1.5, rf: 0.044, teeth: 7 },
        { parent: 3, ang: 1.95, rf: 0.056, teeth: 9 },
        { parent: 4, ang: -1.95, rf: 0.040, teeth: 7 }
      ];
      this.offAng = this.offGears.map(() => 0);
      // driven cog->bulb trains that grow in once the system runs well (ON).
      // each train branches off a cluster gear NEXT TO the main bulb and meshes
      // outward, so the new bulbs are actually driven by the main machine
      // (no free-spinning cogs). 'from' = cluster gear index it taps power from.
      this.onTrains = [
        { from: 5, delay: 0.45, bulbAng: -2.78, bulbRf: 0.050, links: [
            { ang: -2.46, rf: 0.045, teeth: 8 },
            { ang: -2.72, rf: 0.052, teeth: 9 }
          ] },
        { from: 4, delay: 1.15, bulbAng: 0.46, bulbRf: 0.047, links: [
            { ang: 0.86, rf: 0.044, teeth: 8 },
            { ang: 0.60, rf: 0.050, teeth: 9 }
          ] }
      ];
      this.onAng = this.onTrains.map(t => t.links.map(() => 0));
      this.startFx = 0.26; this.startFy = 0.60;
      this.deskFx = 0.12; this.deskFy = 0.80;
      this.rightFx = 0.88; this.rightFy = 0.82;
    }

    render(ctx, w, h, dt, time) {
      this.bgWash(ctx, w, h);
      const m = smooth(this.mix);
      const onT = time - this.switchT;
      const s = h / 340;
      const accent = this.accentRgb;
      const gearCol = lerpC(MID, accent, m * 0.30);

      // tangent cog cluster (each sits exactly r1+r2 from the previous, so they mesh)
      const radii = this.gearDefs.map(g => g.rf * h);
      const pos = [[this.startFx * w, this.startFy * h]];
      for (let i = 1; i < this.gearDefs.length; i++) {
        const a = this.gearDefs[i].ang, d = radii[i - 1] + radii[i];
        pos.push([pos[i - 1][0] + Math.cos(a) * d, pos[i - 1][1] + Math.sin(a) * d]);
      }

      // meshing rotation: gear 0 driven by effort, the rest follow
      const erratic = 0.3 + 0.7 * Math.abs(Math.sin(time * 1.6));
      let om = 1.3 * (m + (1 - m) * erratic * 0.5);
      const omega = [om];
      this.angles[0] += om * dt;
      for (let i = 1; i < radii.length; i++) { om = -om * radii[i - 1] / radii[i]; omega[i] = om; this.angles[i] += om * dt; }

      // main bulb sits right beside the top cog (no wires)
      const top = pos[pos.length - 1], topR = radii[radii.length - 1];
      const mbr = 0.060 * h, ba = -0.6;
      const bulb = [top[0] + Math.cos(ba) * (topR + mbr), top[1] + Math.sin(ba) * (topR + mbr)];
      const bright = lerp(
        0.12 + 0.17 * (0.5 + 0.5 * Math.sin(time * 17 + 1)) * (0.5 + 0.5 * Math.sin(time * 6.3)),
        0.9 + 0.05 * Math.sin(time * 2), m);

      // gentle cursor interactivity: each gear (and the bulb) drifts toward a
      // nearby pointer; the threads + bulb then follow the same offsets so the
      // drivetrain stays connected while it wiggles
      const dpos = pos.map((p, i) => { const n = mouseNudge(p[0], p[1], radii[i] * 2.4, 3.2); return [p[0] + n[0], p[1] + n[1]]; });
      const bnud = mouseNudge(bulb[0], bulb[1], mbr * 3, 3.5);
      const dbulb = [bulb[0] + bnud[0], bulb[1] + bnud[1]];

      // useless cogs (OFF only) fade out as the machine becomes efficient
      if (1 - m > 0.02) {
        ctx.save(); ctx.globalAlpha = 1 - m;
        for (let i = 0; i < this.offGears.length; i++) {
          const og = this.offGears[i], p = dpos[og.parent], pr = radii[og.parent], r = og.rf * h;
          const gx = p[0] + Math.cos(og.ang) * (pr + r), gy = p[1] + Math.sin(og.ang) * (pr + r);
          this.offAng[i] += -omega[og.parent] * (pr / r) * dt;
          this._gear(ctx, gx, gy, r, og.teeth, this.offAng[i], MID, 1.5 * s);
        }
        ctx.restore();
      }

      // main cluster cogs
      // when running (ON), faint threads link every gear hub through to the main
      // bulb, so the whole drivetrain reads as one connected machine
      if (m > 0.02) {
        ctx.save();
        ctx.strokeStyle = css(MID, 0.4 * m); ctx.lineWidth = 1.3 * s;
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(dpos[0][0], dpos[0][1]);
        for (let i = 1; i < dpos.length; i++) ctx.lineTo(dpos[i][0], dpos[i][1]);
        ctx.lineTo(dbulb[0], dbulb[1]);
        ctx.stroke();
        ctx.restore();
      }
      for (let i = 0; i < dpos.length; i++) {
        this._gear(ctx, dpos[i][0], dpos[i][1], radii[i], this.gearDefs[i].teeth, this.angles[i], gearCol, 1.7 * s, lerpC([70, 66, 60], accent, m));
      }

      this._leftWorker(ctx, w, h, s, time, dt);
      this._bulb(ctx, dbulb[0], dbulb[1], mbr, bright, lerpC([168, 166, 160], accent, m), accent);

      // driven cog->bulb trains grow in when efficient (ON): each meshes back
      // through the cluster gear nearest the main bulb, so nothing spins alone.
      for (let ti = 0; ti < this.onTrains.length; ti++) {
        const tr = this.onTrains[ti];
        const appear = this.on ? clamp01((onT - tr.delay) / 0.7) * m : 0;
        // build + advance the meshing chain (keep turning even before visible)
        let px = dpos[tr.from][0], py = dpos[tr.from][1];
        let pr = radii[tr.from], pom = omega[tr.from];
        const drawn = [];
        for (let li = 0; li < tr.links.length; li++) {
          const lk = tr.links[li], r = lk.rf * h;
          const gx = px + Math.cos(lk.ang) * (pr + r);
          const gy = py + Math.sin(lk.ang) * (pr + r);
          const om = -pom * (pr / r);
          this.onAng[ti][li] += om * dt;
          drawn.push({ gx, gy, r, teeth: lk.teeth, ang: this.onAng[ti][li], px, py });
          px = gx; py = gy; pr = r; pom = om;
        }
        if (appear < 0.02) continue;
        ctx.save(); ctx.globalAlpha = appear;
        // faint axle linkages from the source through each gear hub
        ctx.strokeStyle = css(MID, 0.4); ctx.lineWidth = 1.3 * s;
        ctx.beginPath(); ctx.moveTo(dpos[tr.from][0], dpos[tr.from][1]);
        for (const g of drawn) ctx.lineTo(g.gx, g.gy);
        ctx.stroke();
        for (const g of drawn) this._gear(ctx, g.gx, g.gy, g.r, g.teeth, g.ang, lerpC(MID, accent, m * 0.35), 1.4 * s, accent);
        // bulb sits beside the final driven gear
        const last = drawn[drawn.length - 1], br = tr.bulbRf * h;
        const bx = last.gx + Math.cos(tr.bulbAng) * (last.r + br);
        const by = last.gy + Math.sin(tr.bulbAng) * (last.r + br);
        const tbn = mouseNudge(bx, by, br * 3, 3);
        this._bulb(ctx, bx + tbn[0], by + tbn[1], br, 0.85 + 0.1 * Math.sin(time * 2.5 + tr.delay), accent, accent);
        ctx.restore();
      }

      this._rightPerson(ctx, w, h, s, time, m, dt);
    }

    _leftWorker(ctx, w, h, s, time, dt) {
      const wx = this.deskFx * w, wy = this.deskFy * h;
      deskFig(ctx, wx, wy, s, -1);
      const wkr = this.on ? 5 : 8;
      const amp = (this.on ? 6 : 10) * s;
      const scrX = wx + 28 * s + Math.cos(time * wkr) * amp;
      const scrY = wy - 9 * s + Math.sin(time * wkr * 2) * 4 * s;
      personFig(ctx, wx, wy, s, {
        lean: (this.on ? 4 : 9) * s, look: 'down',
        armR: [scrX, scrY], armL: [wx - 12 * s, wy - 4 * s],
        sweat: !this.on, time, st: this._figState('cWorker'), dt
      });
    }

    _rightPerson(ctx, w, h, s, time, m, dt) {
      const rx = this.rightFx * w, ry = this.rightFy * h;
      deskFig(ctx, rx, ry, s, 1);
      const up = smooth(m);
      const cheer = up * (0.5 + 0.5 * Math.sin(time * 3)) * 6 * s;
      const ly = lerp(ry - 4 * s, ry - 54 * s - cheer, up);
      personFig(ctx, rx, ry, s, {
        lean: lerp(6 * s, 0, up), look: m > 0.5 ? 'up' : 'fwd',
        armL: [lerp(rx - 14 * s, rx - 22 * s, up), ly],
        armR: [lerp(rx + 14 * s, rx + 22 * s, up), ly],
        time, st: this._figState('cRight'), dt
      });
    }

    _gear(ctx, x, y, r, teeth, ang, col, lw, dotCol) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
      ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      const ro = r, ri = r * 0.80, n = teeth, aa = Math.PI * 2 / n;
      ctx.beginPath();
      for (let k = 0; k < n; k++) {
        const b = k * aa;
        const pts = [[ri, b], [ro, b + aa * 0.18], [ro, b + aa * 0.40], [ri, b + aa * 0.58]];
        for (let j = 0; j < 4; j++) {
          const px = Math.cos(pts[j][1]) * pts[j][0], py = Math.sin(pts[j][1]) * pts[j][0];
          (k === 0 && j === 0) ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
      }
      ctx.closePath(); ctx.stroke();
      // hub
      ctx.beginPath(); ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = dotCol || col; ctx.beginPath(); ctx.arc(0, 0, r * 0.13, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    _bulb(ctx, x, y, r, bright, col, accent) {
      accent = accent || col;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4.2);
      g.addColorStop(0, css(col, 0.55 * bright));
      g.addColorStop(0.5, css(col, 0.18 * bright));
      g.addColorStop(1, css(col, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r * 4.2, 0, Math.PI * 2); ctx.fill();
      // screw base
      ctx.fillStyle = css(MID, 0.9);
      ctx.fillRect(x - r * 0.42, y + r * 0.82, r * 0.84, r * 0.5);
      ctx.strokeStyle = css(INK, 0.45); ctx.lineWidth = 1;
      for (let k = 0; k < 2; k++) { ctx.beginPath(); ctx.moveTo(x - r * 0.42, y + r * (1.0 + k * 0.18)); ctx.lineTo(x + r * 0.42, y + r * (1.0 + k * 0.18)); ctx.stroke(); }
      // glass
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = css(col, 0.12 + 0.5 * bright); ctx.fill();
      ctx.strokeStyle = css(INK, 0.75); ctx.lineWidth = 1.6; ctx.stroke();
      // a VERY faint accent glow on the diode inside the glass, present even when
      // 'off' — reads as 'it's working, but poorly'
      const dg = ctx.createRadialGradient(x, y, 0, x, y, r * 0.95);
      dg.addColorStop(0, css(accent, 0.09 + 0.5 * bright));
      dg.addColorStop(1, css(accent, 0));
      ctx.save(); ctx.beginPath(); ctx.arc(x, y, r * 0.92, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = dg; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
      // filament — always carries a faint accent tint, brightening with output
      ctx.strokeStyle = css(lerpC([120, 95, 55], accent, clamp01(0.34 + 0.66 * bright)), 0.5 + 0.5 * bright); ctx.lineWidth = 1.3; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x - r * 0.34, y + r * 0.5);
      ctx.lineTo(x - r * 0.34, y);
      ctx.lineTo(x - r * 0.12, y - r * 0.30);
      ctx.lineTo(x + r * 0.12, y + r * 0.10);
      ctx.lineTo(x + r * 0.34, y - r * 0.30);
      ctx.lineTo(x + r * 0.34, y + r * 0.5);
      ctx.stroke();
    }
  }

  /* ============================================================
     2. INTEGRATION — papers shuttled by hand vs. flown as planes
     ============================================================ */
  class IntegrationAnim extends LeverAnim {
    setup(w, h) {
      this.planes = [];
      this.emit = 0;
      this.sendCount = 0;
    }
    desks(w, h) {
      return {
        y: h * 0.74,
        L: w * 0.17, R: w * 0.83,
        wd: w * 0.13,
        top: { x: w * 0.5, y: h * 0.18 }
      };
    }
    render(ctx, w, h, dt, time) {
      this.bgWash(ctx, w, h);
      const D = this.desks(w, h), m = smooth(this.mix);

      // two desks on the floor (left & right)
      this._desk(ctx, D.L, D.y, D.wd);
      this._desk(ctx, D.R, D.y, D.wd);

      // mailman path: left -> top -> right -> top -> left
      const WT = { x: D.top.x - w * 0.06, y: D.top.y + 52 };
      const WL = { x: D.L, y: D.y - 6 };
      const WR = { x: D.R, y: D.y - 6 };
      const u = (time * 0.12) % 1;
      const path = [WL, WT, WR, WT, WL];
      const seg = Math.min(3, (u * 4) | 0);
      const lt = smooth((u * 4) - seg);
      const a = path[seg], b = path[seg + 1];
      const mx = lerp(a.x, b.x, lt), my = lerp(a.y, b.y, lt);
      const face = (b.x - a.x) >= 0 ? 1 : -1;
      const atTop = Math.hypot(mx - WT.x, my - WT.y) < w * 0.085;

      // top desk + analyser — the third table; fades away when system is ON
      const topA = 1 - m;
      if (topA > 0.02) {
        ctx.save();
        ctx.globalAlpha = topA;
        this._desk(ctx, D.top.x, D.top.y + 36, w * 0.16);
        // analyser works the papers; reaches toward the mailman when he arrives
        const work = atTop ? 1 : 0.5 + Math.sin(time * 5) * 0.25;
        figure(ctx, D.top.x + w * 0.055, D.top.y + 30, 28,
          { face: -1, lean: 0.10, armA: -0.4, armB: 0.25 + work * 0.8, legPh: 0, handR: [atTop ? -18 : -4, 4], st: this._figState('intAnalyser'), dt },
          css(INK, 0.85), 0);
        // a paper on the top desk that gets stamped while being worked
        const stamp = atTop && (Math.sin(time * 12) > 0);
        this._paper(ctx, D.top.x - w * 0.01, D.top.y + 14, null, stamp);
        ctx.restore();
      }

      if (!this.on) {
        // OFF: mailman walks left -> top -> right -> top -> left carrying a paper,
        //      handing it to the analyser at the top desk on each pass.
        const bob = Math.abs(Math.sin(time * 9)) * 4;
        const handing = atTop;
        figure(ctx, mx, my - bob, 30, {
          face,
          lean: 0.16,
          legPh: time * 11,
          armA: handing ? -0.95 : 0.5,
          armB: 0.15,
          handL: [face * (handing ? 11 : 4), handing ? -8 : -2], st: this._figState('intMail'), dt
        }, css(INK, 0.9), 0.9);
        // place the paper at the actual hand tip (mirror the figure's arm math)
        const fu = 1;                       // figure size 30 -> u = 1
        const fLean = 0.16;
        const fShX = fLean * 34 * fu * 0.7;
        const fAng = handing ? -0.95 : 0.5;
        const fHandLx = face * (handing ? 11 : 4);
        const exLocal = (fShX - 7 * fu) + Math.sin(fAng) * 16 * fu + fHandLx * fu;
        const handX = mx + face * exLocal;
        this._paper(ctx, handX, my - (handing ? 42 : 30) - bob, null, false);
        this.planes.length = 0;
        this.emit = 0;
      } else {
        // ON: each message FOLDS into a paper plane as it leaves a desk, ejects,
        // and glides across with its own random arc + flutter before coming to
        // REST on the far desk. A send (L->R) and its reply (R->L) share a colour
        // but their paths are independently noised, so the exchange is never a
        // mirror image. Colour seeps in subtly during the fold, then holds.
        this.emit -= dt;
        if (this.emit <= 0) {
          const ci = this.sendCount % 6;
          this.sendCount++;
          this.planes.push(this._spawnPlane(1, 0, ci, D, h));
          this.planes.push(this._spawnPlane(-1, 0.3 + Math.random() * 0.5, ci, D, h));
          this.emit = 0.7 + Math.random() * 0.7;
        }
        for (const p of this.planes) {
          p.age += dt;
          if (p.age >= p.dur) p.rest += dt;
        }
        this.planes = this.planes.filter(p => p.rest < p.restDur);
        for (const p of this.planes) {
          if (p.age < 0) continue;                               // reply not launched yet
          const t = clamp01(p.age / p.dur);
          const posAt = (tt) => {
            const xx = lerp(p.fromX, p.toX, smooth(tt));
            const base = lerp(p.fromY, p.toY, tt);
            const arcY = -Math.sin(Math.pow(tt, p.arcSkew) * Math.PI) * p.arc;
            const flutter = Math.sin(tt * p.wobFreq * Math.PI * 2 + p.wobPhase) * p.wobAmp * Math.sin(tt * Math.PI);
            return [xx, base + arcY + flutter];
          };
          const pos = posAt(t);
          // pitch follows the glide; stable forward term avoids end-of-flight spin
          const e = 0.012;
          const dyv = posAt(clamp01(t + e))[1] - posAt(clamp01(t - e))[1];
          const fwd = Math.abs(p.toX - p.fromX) * 2 * e;
          const facingLeft = (p.toX - p.fromX) < 0;
          let pitch = 0;
          if (t < 1) pitch = Math.atan2(dyv, Math.max(0.001, fwd)) * 0.85
            + Math.sin(t * p.wobFreq * 5 + p.wobPhase) * p.rollAmp;
          // fold (0->1 over the first slice) unfurls the shape AND bleeds colour in
          const fold = clamp01(t / 0.16);
          const fade = clamp01((p.restDur - p.rest) / 0.4);   // sits, then fades out
          const col = colorize(this.palette[p.ci], fold * 0.7 * m);
          const pn = mouseNudge(pos[0], pos[1], 46, 4);
          this._plane(ctx, pos[0] + pn[0], pos[1] + pn[1], pitch, facingLeft, col, fold, fade);
        }
        // mailman relaxes in the middle: breathing, weight-shift, points at the planes
        const bob = Math.sin(time * 2.2) * 2.4;
        const sway = Math.sin(time * 0.9) * 0.06;
        const point = Math.max(0, Math.sin(time * 0.85));
        figure(ctx, D.top.x, D.y - 6 + bob, 30, {
          lean: sway,
          armA: -1.15, handL: [10, 6],
          armB: lerp(1.15, -1.7, point), handR: lerp(-10, 8, point),
          legPh: 0, st: this._figState('intRelax'), dt
        }, css(INK, 0.85), 0);
      }
    }
    onSwitch(on) { this.planes = []; this.emit = 0; this.sendCount = 0; }
    _spawnPlane(dir, delay, ci, D, h) {
      const fromX = dir === 1 ? D.L : D.R;
      const toX = dir === 1 ? D.R : D.L;
      return {
        dir, ci,
        age: -delay,
        dur: 1.1 + Math.random() * 0.8,        // flight time (noised)
        fromX, toX,
        fromY: D.y - 10, toY: D.y - 7,         // leaves a desktop, rests on the other
        arc: h * (0.22 + Math.random() * 0.18),// peak height
        arcSkew: 0.6 + Math.random() * 0.5,    // <1 peaks earlier (launch shove)
        wobAmp: 5 + Math.random() * 9,         // gliding flutter
        wobFreq: 1.4 + Math.random() * 2.2,
        wobPhase: Math.random() * Math.PI * 2,
        rollAmp: 0.10 + Math.random() * 0.18,  // pitch jitter
        rest: 0, restDur: 0.5 + Math.random() * 0.8
      };
    }
    _desk(ctx, x, y, wd) {
      ctx.strokeStyle = css(INK, 0.8); ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - wd / 2, y); ctx.lineTo(x + wd / 2, y);
      ctx.moveTo(x - wd / 2 + 6, y); ctx.lineTo(x - wd / 2 + 6, y + 26);
      ctx.moveTo(x + wd / 2 - 6, y); ctx.lineTo(x + wd / 2 - 6, y + 26);
      ctx.stroke();
      // a little stack of papers on the desk
      ctx.strokeStyle = css(MID, 0.8); ctx.lineWidth = 1.2;
      for (let i = 0; i < 3; i++) { ctx.strokeRect(x - 10, y - 6 - i * 3, 20, 5); }
    }
    _paper(ctx, x, y, col, stamp) {
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = css([248, 245, 238], 0.95);
      ctx.strokeStyle = css(MID, 0.9); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.roundRect(-9, -12, 18, 24, 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = css(MID, 0.7); ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-5, -5 + i * 5); ctx.lineTo(5, -5 + i * 5); ctx.stroke(); }
      if (stamp) { ctx.strokeStyle = css(ERR, 0.8); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.stroke(); }
      ctx.restore();
    }
    _plane(ctx, x, y, ang, facingLeft, col, fold, alpha) {
      const s = lerp(0.5, 1, fold);            // unfurls from a small folded form
      ctx.save();
      ctx.translate(x, y); ctx.rotate(ang); ctx.scale(facingLeft ? -s : s, s);
      const wing = lerpC(col, [252, 249, 243], 0.5);   // upper wing catches light
      ctx.fillStyle = css(wing, 0.96 * alpha);
      ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-12, -9); ctx.lineTo(-3, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css(col, 0.96 * alpha);          // shaded lower fold
      ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-3, 0); ctx.lineTo(-10, 8); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = css(gray(col), 0.45 * alpha); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-3, 0); ctx.lineTo(-12, -9); ctx.stroke();
      ctx.restore();
    }
  }

  /* ============================================================
     3. AUTOMATION — copying cells by hand vs. data flowing itself
     ============================================================ */
  class AutomationAnim extends LeverAnim {
    setup(w, h) {
      this.cells = [];   // filled cells on the right grid (by hand)
      this.flow = [];    // flowing particles when on
      this.handT = 0;
      this.emit = 0;
    }
    grids(w, h) {
      const gw = w * 0.26, gh = h * 0.5, gy = h * 0.14;
      return {
        L: { x: w * 0.07, y: gy, w: gw, h: gh },
        R: { x: w * 0.67, y: gy, w: gw, h: gh },
        cols: 4, rows: 6
      };
    }
    _grid(ctx, g, cols, rows, fills, m, label) {
      ctx.strokeStyle = css(MID, 0.85); ctx.lineWidth = 1.4;
      ctx.strokeRect(g.x, g.y, g.w, g.h);
      ctx.strokeStyle = css(MID, 0.4); ctx.lineWidth = 1;
      for (let c = 1; c < cols; c++) { ctx.beginPath(); ctx.moveTo(g.x + g.w * c / cols, g.y); ctx.lineTo(g.x + g.w * c / cols, g.y + g.h); ctx.stroke(); }
      for (let r = 1; r < rows; r++) { ctx.beginPath(); ctx.moveTo(g.x, g.y + g.h * r / rows); ctx.lineTo(g.x + g.w, g.y + g.h * r / rows); ctx.stroke(); }
      // header row tint
      ctx.fillStyle = css(MID, 0.12); ctx.fillRect(g.x, g.y, g.w, g.h / rows);
      if (fills) {
        const cw = g.w / cols, ch = g.h / rows;
        for (const f of fills) {
          const col = colorize(this.palette[(f.c + f.r) % 6], f.m == null ? m : f.m);
          ctx.fillStyle = css(col, 0.85);
          ctx.fillRect(g.x + f.c * cw + 2, g.y + (f.r + 1) * ch + 2, cw - 4, ch - 4);
        }
      }
    }
    render(ctx, w, h, dt, time) {
      this.bgWash(ctx, w, h);
      const g = this.grids(w, h), m = smooth(this.mix);
      const cols = g.cols, rows = g.rows;
      const cw = g.L.w / cols, ch = g.L.h / rows;
      const SEMI = 0.5;                       // right sheet's muted tone when OFF
      const rightAmt = SEMI + (1 - SEMI) * m;  // OFF: semigray -> ON: 100% colour

      // LEFT grid (raw source): grayscale when OFF, full colour when ON
      const srcFills = [];
      for (let r = 0; r < rows - 1; r++) for (let c = 0; c < cols; c++) srcFills.push({ c, r, m: m });
      this._grid(ctx, g.L, cols, rows, srcFills, m);
      this._grid(ctx, g.R, cols, rows, this.cells, rightAmt);

      const totalCells = (rows - 1) * cols;
      const figX = w * 0.5, figY = h * 0.48;

      if (this.on) {
        // flowing particles fill the right grid quickly
        this.emit -= dt;
        if (this.emit <= 0 && this.cells.length < totalCells) {
          const idx = this.cells.length;
          const c = idx % cols, r = (idx / cols) | 0;
          this.flow.push({ c, r, age: 0, dur: 0.5, sc: (idx % cols), sr: (idx / cols | 0) });
          this.cells.push({ c, r, m: 0, settling: true });
          this.emit = 0.06;
        }
        for (const f of this.flow) f.age += dt;
        // settle cells
        for (const cell of this.cells) if (cell.settling) { cell.m += dt * 3; if (cell.m >= rightAmt) { cell.m = rightAmt; cell.settling = false; } }
        // draw flow particles travelling left->right
        for (const f of this.flow) {
          const t = clamp01(f.age / f.dur);
          const sx = g.L.x + (f.sc + 0.5) * cw, sy = g.L.y + (f.sr + 1.5) * ch;
          const tx = g.R.x + (f.c + 0.5) * (g.R.w / cols), ty = g.R.y + (f.r + 1.5) * (g.R.h / rows);
          const x = lerp(sx, tx, smooth(t)), y = lerp(sy, ty, smooth(t)) - Math.sin(t * Math.PI) * 24;
          const pn = mouseNudge(x, y, 42, 4);
          ctx.fillStyle = css(colorize(this.palette[(f.c + f.r) % 6], rightAmt), 0.9 * (1 - t * 0.3));
          ctx.beginPath(); ctx.arc(x + pn[0], y + pn[1], 3.4, 0, Math.PI * 2); ctx.fill();
        }
        this.flow = this.flow.filter(f => f.age < f.dur);
        // relaxed figure: breathing, weight-shift, and a gaze that cycles
        // between the left sheet, the camera, and the right sheet
        const ibob = Math.sin(time * 2) * 2.6;
        const stretch = (Math.sin(time * 0.6) + 1) / 2;
        const gazeSeq = [-1, 0, 1, 0];          // left sheet, camera, right sheet, camera
        const gp = 1.5;                          // seconds dwelling on each
        const gi = Math.floor(time / gp) % 4;
        const gf = smooth(clamp01(((time % gp) / gp - 0.62) / 0.38)); // hold, then glance
        const look = lerp(gazeSeq[gi], gazeSeq[(gi + 1) % 4], gf);
        figure(ctx, figX, figY + ibob, 32, {
          lean: look * 0.10, look: look,
          armA: -2.4, handL: [-4, -13],
          armB: lerp(2.4, 1.1, stretch * 0.6), handR: [lerp(4, 12, stretch * 0.6), lerp(-13, -1, stretch * 0.5)],
          legPh: 0, st: this._figState('autoRelax'), dt
        }, css(INK, 0.85), 0);
      } else {
        // BY HAND: the worker walks to the left sheet, grabs a cell, carries it
        // across, and drops it into the matching slot on the right sheet, then
        // walks back for the next one. (laborious & literal — no teleporting)
        this.handT += dt;
        const step = 1.9;                              // seconds for one full trip
        const idx = Math.floor(this.handT / step) % totalCells;
        const ph = (this.handT % step) / step;          // 0..1 within the trip
        const c = idx % cols, r = (idx / cols) | 0;
        const cwR = g.R.w / cols, chR = g.R.h / rows;
        const srcC = [g.L.x + (c + 0.5) * cw, g.L.y + (r + 1.5) * ch];   // source cell centre
        const tgtC = [g.R.x + (c + 0.5) * cwR, g.R.y + (r + 1.5) * chR]; // target cell centre
        const leftX = g.L.x + g.L.w + 0.055 * w;        // stand just right of the left sheet
        const rightX = g.R.x - 0.055 * w;               // stand just left of the right sheet
        const cellCol = colorize(this.palette[(c + r) % 6], rightAmt);

        // sub-phase split: pickup -> carry -> drop -> return
        const P1 = 0.17, P2 = 0.50, P3 = 0.67;
        const carryAt = (fx, fc) => [fx + fc * 13, figY - 21];   // cell rides in front of chest
        let figX2, face2 = 1, walking = false, cellPos = null, pose;
        const bob = () => Math.abs(Math.sin(this.handT * 9)) * 2.4;

        if (ph < P1) {                                  // reach down + grab at the left sheet
          figX2 = leftX; face2 = -1;
          const gp = smooth(ph / P1);
          cellPos = [lerp(srcC[0], carryAt(leftX, -1)[0], gp), lerp(srcC[1], carryAt(leftX, -1)[1], gp)];
          pose = { face: -1, lean: 0.12, armB: lerp(1.4, 0.5, gp), handR: [lerp(14, 6, gp), lerp(8, -6, gp)], armA: 0.2, handL: [-4, -4] };
          ctx.strokeStyle = css(ERR, 0.8 * (1 - m)); ctx.lineWidth = 1.6;
          ctx.strokeRect(g.L.x + c * cw + 1, g.L.y + (r + 1) * ch + 1, cw - 2, ch - 2);
        } else if (ph < P2) {                           // carry it across the middle
          walking = true;
          const cp = smooth((ph - P1) / (P2 - P1));
          figX2 = lerp(leftX, rightX, cp); face2 = 1;
          cellPos = carryAt(figX2, 1);
          pose = { face: 1, lean: 0.06, legPh: this.handT * 11, armA: 0.2, handL: [6, -7], armB: 0.4, handR: [9, -7] };
        } else if (ph < P3) {                           // reach + drop into the right slot
          figX2 = rightX; face2 = 1;
          const dp = smooth((ph - P2) / (P3 - P2));
          cellPos = [lerp(carryAt(rightX, 1)[0], tgtC[0], dp), lerp(carryAt(rightX, 1)[1], tgtC[1], dp)];
          pose = { face: 1, lean: 0.12, armB: lerp(0.4, 1.4, dp), handR: [lerp(6, 18, dp), lerp(-6, 6, dp)], armA: -0.2, handL: [4, -4] };
          ctx.strokeStyle = css(MID, 0.9); ctx.lineWidth = 1.6;
          ctx.strokeRect(tgtC[0] - cwR / 2 + 1, tgtC[1] - chR / 2 + 1, cwR - 2, chR - 2);
        } else {                                        // walk back empty-handed
          walking = true;
          const rp = smooth((ph - P3) / (1 - P3));
          figX2 = lerp(rightX, leftX, rp); face2 = -1;
          pose = { face: -1, lean: 0.07, legPh: this.handT * 11, armA: 0.5, armB: -0.4 };
        }

        // cells already delivered stay filled; the current one fills once dropped
        this.cells = [];
        for (let i = 0; i < idx; i++) this.cells.push({ c: i % cols, r: (i / cols) | 0, m: rightAmt });
        if (ph >= P3) this.cells.push({ c, r, m: rightAmt });
        this._grid(ctx, g.R, cols, rows, this.cells, 0);   // redraw right fills so they show

        pose.st = this._figState('autoWalk'); pose.dt = dt;
        figure(ctx, figX2, figY - (walking ? bob() : 0), 30, pose, css(INK, 0.85), 0.9);

        // the carried cell on top of everything while it's in transit
        if (cellPos) {
          const csz = Math.min(cw - 4, 14);
          ctx.fillStyle = css(cellCol, 0.9);
          ctx.beginPath(); ctx.roundRect(cellPos[0] - csz / 2, cellPos[1] - csz / 2, csz, csz, 2); ctx.fill();
          ctx.strokeStyle = css(INK, 0.5); ctx.lineWidth = 1; ctx.stroke();
        }
      }
    }
    onSwitch(on) {
      // reset the right grid on each switch so the demo restarts cleanly
      this.cells = []; this.flow = []; this.handT = 0; this.emit = 0;
    }
  }

  /* ============================================================
     4. SOMETHING ELSE — left points seek their match on the right
        (kept as the original connecting-points animation)
     ============================================================ */
  class SomethingElseAnim extends LeverAnim {
    setup(w, h) {
      this.N = 6;
      this.match = [3, 0, 4, 1, 5, 2];
      this.attempts = [];
      this.spawn = 0;
    }
    pts(w, h) {
      const N = this.N, lx = w * 0.24, rx = w * 0.76, top = h * 0.16, bot = h * 0.78;
      const L = [], R = [];
      for (let i = 0; i < N; i++) {
        const y = lerp(top, bot, i / (N - 1));
        const nl = mouseNudge(lx, y, 46, 4), nr = mouseNudge(rx, y, 46, 4);
        L.push([lx + nl[0], y + nl[1]]); R.push([rx + nr[0], y + nr[1]]);
      }
      return { L, R };
    }
    render(ctx, w, h, dt, time) {
      this.bgWash(ctx, w, h);
      const { L, R } = this.pts(w, h);
      const mix = this.mix, m = smooth(mix);
      const since = time - this.switchT;
      ctx.save();
      if (this.on) {
        const per = 0.34;
        for (let i = 0; i < this.N; i++) {
          const prog = clamp01((since - i * per) / per);
          if (prog <= 0) continue;
          const a = L[i], b = R[this.match[i]];
          const col = colorize(this.palette[i], m);
          const cx = (a[0] + b[0]) / 2;
          ctx.strokeStyle = css(col, 0.9);
          ctx.lineWidth = 2.6; ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(a[0], a[1]);
          const ex = lerp(a[0], b[0], prog), ey = lerp(a[1], b[1], prog);
          ctx.bezierCurveTo(cx, a[1], cx, ey, ex, ey);
          ctx.stroke();
          if (prog >= 1) {
            const sp = (time * 1.4 + i) % 1;
            const px = lerp(a[0], b[0], sp), py = lerp(a[1], b[1], sp);
            ctx.fillStyle = css(col, 0.9 * m);
            ctx.beginPath(); ctx.arc(px, py, 2.6, 0, Math.PI * 2); ctx.fill();
          }
        }
      } else {
        this.spawn -= dt;
        if (this.spawn <= 0 && this.attempts.length < 4) {
          const i = (Math.random() * this.N) | 0;
          let j = (Math.random() * this.N) | 0;
          if (j === this.match[i]) j = (j + 1) % this.N;
          this.attempts.push({ i, j, age: 0, dur: 1.1 + Math.random() * 0.8 });
          this.spawn = 0.35 + Math.random() * 0.5;
        }
        for (const at of this.attempts) at.age += dt;
        this.attempts = this.attempts.filter(at => at.age < at.dur);
        for (const at of this.attempts) {
          const a = L[at.i], b = R[at.j];
          const p = at.age / at.dur;
          const reach = Math.sin(clamp01(p / 0.6) * Math.PI / 2);
          const ex = lerp(a[0], b[0], reach * 0.82), ey = lerp(a[1], b[1], reach * 0.82) + Math.sin(time * 9 + at.i) * 3 * (1 - reach);
          ctx.strokeStyle = css(MID, 0.5 * (1 - m));
          ctx.setLineDash([5, 5]); ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(ex, ey); ctx.stroke();
          ctx.setLineDash([]);
          if (p > 0.6) {
            const ea = clamp01((p - 0.6) / 0.25);
            ctx.strokeStyle = css(ERR, 0.8 * ea * (1 - m * 0.6)); ctx.lineWidth = 1.8;
            const r = 4;
            ctx.beginPath();
            ctx.moveTo(ex - r, ey - r); ctx.lineTo(ex + r, ey + r);
            ctx.moveTo(ex + r, ey - r); ctx.lineTo(ex - r, ey + r);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
      for (let i = 0; i < this.N; i++) {
        const connected = this.on && (since - i * 0.34) > 0.34;
        const colL = colorize(this.palette[i], m);
        const colR = colorize(this.palette[this.match.indexOf(i)], m);
        this._dot(ctx, L[i][0], L[i][1], colL, connected, time, i);
        this._dot(ctx, R[i][0], R[i][1], colR, this.on && this._rConnected(i, since), time, i + 9);
      }
    }
    _rConnected(rIndex, since) {
      const li = this.match.indexOf(rIndex);
      return (since - li * 0.34) > 0.34;
    }
    _dot(ctx, x, y, col, glow, time, seed) {
      if (glow) {
        ctx.fillStyle = css(col, 0.18);
        ctx.beginPath(); ctx.arc(x, y, 11 + Math.sin(time * 2 + seed) * 1.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = css(col, 1);
      ctx.beginPath(); ctx.arc(x, y, 5.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = css([255, 255, 255], 0.5); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(x, y, 5.5, 0, Math.PI * 2); ctx.stroke();
    }
  }

  customElements.define('consulting-anim', ConsultingAnim);
  customElements.define('integration-anim', IntegrationAnim);
  customElements.define('automation-anim', AutomationAnim);
  customElements.define('somethingelse-anim', SomethingElseAnim);
})();
