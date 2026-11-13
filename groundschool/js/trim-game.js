// Trim Master — a tiny flight model that teaches the four forces, angle of attack and stalls.
// The pilot sets pitch ATTITUDE and THROTTLE (like a real airplane); angle of attack = attitude − flight path.
(() => {
  const SKY = window.SKY = window.SKY || {};
  SKY.games = SKY.games || {};

  const VREF = 77.46;        // speed (kts) where q = 1
  const CRIT = 16;           // critical angle of attack (deg)
  const INCIDENCE = 2;       // wing is bolted on 2° nose-up
  const TMAX = 0.16;
  const CD0 = 0.03, K = 0.05;
  const VNE = 163;
  const TIME_SCALE = 2;      // sim runs at 2× so climbs and descents don't drag on

  const MISSIONS = [
    { id: 'level', title: 'Straight & Level', hold: 10,
      brief: 'You’re at 3,000 ft, going fast with way too much power — the plane wants to climb! Balance the forces: hold 3,000 ft (±100) without climbing or sinking for 10 seconds.',
      start: { alt: 3000, v: 120, throttle: 85, pitch: 2 },
      goal: (s) => Math.abs(s.alt - 3000) <= 100 && Math.abs(s.vs) < 250,
      hint: (s) => s.vs > 250 ? 'Climbing! Too much thrust — ease the throttle back (or lower the nose a touch).' : s.vs < -250 ? 'Sinking — add a little power or raise the nose slightly.' : 'Watch the Lift vs Weight and Thrust vs Drag meters. Balanced = steady.' },
    { id: 'climb', title: 'Climb to 4,000', hold: 5,
      brief: 'Full power and a few degrees nose-up. Then level off at 4,000 ft (±100) and hold it for 5 seconds. Climbs are powered by extra THRUST!',
      start: { alt: 3000, v: 100, throttle: 50, pitch: 2 },
      goal: (s) => Math.abs(s.alt - 4000) <= 100 && Math.abs(s.vs) < 250,
      hint: (s) => s.alt < 3900 ? 'Throttle up to 100% and raise the nose to about 5–7°.' : 'Almost there — lower the nose and reduce power to level off.' },
    { id: 'slow', title: 'Slow Flight', hold: 8,
      brief: 'Fly slooow: 60–70 knots while holding 3,000 ft (±200) for 8 seconds. Notice how high the angle of attack gets — and how much POWER slow flight needs.',
      start: { alt: 3000, v: 100, throttle: 50, pitch: 2 },
      goal: (s) => s.v >= 60 && s.v <= 70 && Math.abs(s.alt - 3000) <= 200,
      hint: (s) => s.v > 70 ? 'Reduce power to about 30% first, then slowly raise the nose to bleed off speed.' : s.v < 60 ? 'Too slow! Lower the nose slightly and add power.' : s.alt < 2800 ? 'Losing altitude — add power. Slow flight needs MORE power than you think!' : s.alt > 3200 ? 'Too high — a little less power, and keep that nose up to stay slow.' : 'Nice — keep it steady. Try about 57% power and 10° nose-up.' },
    { id: 'stall', title: 'Stall & Recover', hold: 2, stall: true,
      brief: 'Pull the power to idle and keep raising the nose until the wing STALLS. Then recover: lower the nose first, add full power, and get back above 70 knots with the descent stopped.',
      start: { alt: 4000, v: 90, throttle: 50, pitch: 2 },
      goal: (s) => !s.stalled && s.throttle >= 0.8 && s.v > 70 && s.vs > -200,
      hint: (s, m) => !m.sawStall ? 'Throttle to 0%, then keep raising the nose… listen for the stall horn.' : s.stalled ? 'STALLED! Lower the nose to reduce angle of attack!' : 'Good — now full power, and gently raise the nose to stop the descent.' },
    { id: 'descend', title: 'Descend to 2,000', hold: 5,
      brief: 'Reduce power and lower the nose gently. Level off at 2,000 ft (±100) and hold it for 5 seconds — without going over 130 knots.',
      start: { alt: 3000, v: 100, throttle: 50, pitch: 2 },
      goal: (s) => Math.abs(s.alt - 2000) <= 100 && Math.abs(s.vs) < 250 && s.v <= 130,
      hint: (s) => s.v > 130 ? 'Too fast! Less power, and don’t point the nose down so much.' : s.alt > 2100 ? 'Reduce power to about 25% and lower the nose a few degrees.' : 'Level off: bring the power back up and raise the nose to stop the descent.' }
  ];

  // Side-view airplane (nose to the right), centered on the CG at (100,50).
  const PLANE = new Path2D('M160,52 Q158,44 145,43 L80,41 Q65,40 35,36 L28,22 L20,22 L22,42 Q22,47 30,48 L140,58 Q155,58 160,52 Z');
  const WING = new Path2D('M92,38 L134,38 Q137,40 134,42 L92,42 Q89,40 92,38 Z');
  const WINDOW = new Path2D('M128,44 L141,45 L148,51 L128,50 Z');

  function CL(a) {
    if (a <= CRIT) return Math.max(-0.6, 0.2 + 0.1 * a);
    return Math.max(0.7, 1.8 - 0.15 * (a - CRIT));
  }

  function mount(root, opts) {
    const done = new Set(opts.done || []);
    let mi = MISSIONS.findIndex((m) => !done.has(m.id));
    if (mi < 0) mi = 0;

    root.innerHTML = `<div class="game">
      <div class="mission-chips" id="chips"></div>
      <div class="sim"><canvas id="cv"></canvas></div>
      <div class="brief"><strong id="mt"></strong><p id="mb"></p><div class="hold"><i id="hb"></i></div></div>
      <div class="controls">
        <div class="ctrl"><div class="ctrl-head"><span>🔥 Throttle (thrust)</span><span id="tv"></span></div>
          <div class="ctrl-row"><button data-d="thr" data-v="-5">−</button><input type="range" id="thr" min="0" max="100" step="1"><button data-d="thr" data-v="5">+</button></div></div>
        <div class="ctrl"><div class="ctrl-head"><span>↕️ Pitch attitude (nose angle)</span><span id="pv"></span></div>
          <div class="ctrl-row"><button data-d="pit" data-v="-1">−</button><input type="range" id="pit" min="-10" max="20" step="0.5"><button data-d="pit" data-v="1">+</button></div></div>
      </div>
      <div class="balance">
        <div class="bal"><b>Lift vs Weight</b><div class="tug"><i id="lw"></i></div><div class="tug-labels"><span style="color:var(--weight)">Weight</span><span style="color:var(--lift)">Lift</span></div></div>
        <div class="bal"><b>Thrust vs Drag</b><div class="tug"><i id="td"></i></div><div class="tug-labels"><span style="color:var(--drag)">Drag</span><span style="color:var(--thrust)">Thrust</span></div></div>
      </div>
      <div class="talk hint"><div class="avatar">🧑‍✈️</div><div class="bubble"><div class="who">JAX · YOUR CFI</div><p id="hint"></p></div></div>
      <div class="btn-row" style="margin-top:14px"><button class="btn ghost" id="rs">↺ Restart</button><button class="btn" id="nx">Next mission ›</button></div>
    </div>`;

    const $ = (id) => root.querySelector('#' + id);
    const cv = $('cv'), ctx = cv.getContext('2d');
    const thr = $('thr'), pit = $('pit');
    let s, m, raf, last = 0, hintT = 0, hornOsc = null, hornGain = null, dpr = 1, W = 0, H = 0;
    const clouds = Array.from({ length: 14 }, (_, i) => ({ x: Math.random(), alt: 1500 + i * 400 + Math.random() * 300, r: 14 + Math.random() * 22 }));

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
    }

    function chips() {
      $('chips').innerHTML = MISSIONS.map((x, k) =>
        `<button class="mchip ${k === mi ? 'on' : ''} ${done.has(x.id) ? 'done' : ''}" data-k="${k}">${done.has(x.id) ? '✓ ' : ''}${k + 1}. ${x.title}</button>`).join('');
      $('chips').querySelectorAll('.mchip').forEach((b) => b.onclick = () => { mi = +b.dataset.k; reset(); });
    }

    function reset() {
      m = MISSIONS[mi];
      s = { alt: m.start.alt, v: m.start.v, gamma: 0, dist: 0, vs: 0, aoa: 0, L: 1, D: 0.08, T: 0.08, stalled: false, crashed: 0, won: false };
      m.held = 0; m.sawStall = false; m.stallT = 0;
      thr.value = m.start.throttle; pit.value = m.start.pitch;
      $('mt').textContent = `Mission ${mi + 1}: ${m.title}`;
      $('mb').textContent = m.brief;
      $('nx').textContent = mi < MISSIONS.length - 1 ? 'Next mission ›' : 'Back to mission 1';
      chips(); labels();
    }

    function labels() {
      $('tv').textContent = `${thr.value}%`;
      $('pv').textContent = `${(+pit.value > 0 ? '+' : '') + (+pit.value).toFixed(1)}°`;
    }

    function step(dt) {
      const theta = +pit.value, throttle = s.throttle = +thr.value / 100;
      const gdeg = s.gamma * 180 / Math.PI;
      s.aoa = theta - gdeg + INCIDENCE;
      const q = (s.v / VREF) ** 2;
      const cl = CL(s.aoa);
      s.stalled = s.aoa > CRIT;
      s.L = cl * q;
      s.D = (CD0 + K * cl * cl + (s.stalled ? 0.05 : 0)) * q;
      s.T = TMAX * throttle * (1 - Math.max(0, s.v - 100) / 400);
      const vfps = Math.max(s.v, 20) * 1.688;
      s.v += 19 * (s.T - s.D - Math.sin(s.gamma)) * dt;
      s.v = Math.max(20, Math.min(220, s.v));
      s.gamma += (32.2 / vfps) * (s.L - Math.cos(s.gamma)) * dt;
      s.gamma = Math.max(-1.2, Math.min(1.2, s.gamma));
      s.vs = vfps * Math.sin(s.gamma) * 60;
      s.alt += vfps * Math.sin(s.gamma) * dt;
      s.dist += s.v * dt;
      if (s.alt > 12000) { s.alt = 12000; s.gamma = Math.min(s.gamma, 0); }
    }

    function horn(on) {
      const ac = opts.sfx.ctx && opts.sfx.ctx();
      if (on && ac && !hornOsc) {
        if (ac.state === 'suspended') ac.resume();
        hornOsc = ac.createOscillator(); hornGain = ac.createGain();
        hornOsc.type = 'square'; hornOsc.frequency.value = 420; hornGain.gain.value = 0.035;
        hornOsc.connect(hornGain).connect(ac.destination); hornOsc.start();
      } else if (!on && hornOsc) {
        try { hornOsc.stop(); } catch (e) { /* already stopped */ }
        hornOsc = null;
      }
    }

    function arrow(x, y, ang, len, color, label) {
      if (len < 3) return;
      const ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len;
      ctx.strokeStyle = ctx.fillStyle = color; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ex + Math.cos(ang) * 8, ey + Math.sin(ang) * 8);
      ctx.lineTo(ex + Math.cos(ang + 2.4) * 9, ey + Math.sin(ang + 2.4) * 9);
      ctx.lineTo(ex + Math.cos(ang - 2.4) * 9, ey + Math.sin(ang - 2.4) * 9); ctx.fill();
      ctx.font = '700 12px ui-rounded, system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.35)';
      ctx.strokeText(label, ex + Math.cos(ang) * 22, ey + Math.sin(ang) * 22 + 4);
      ctx.fillText(label, ex + Math.cos(ang) * 22, ey + Math.sin(ang) * 22 + 4);
    }

    function draw() {
      const css = getComputedStyle(document.documentElement);
      const col = (n) => css.getPropertyValue(n).trim();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#0b2d6e'); g.addColorStop(1, '#5aa7f0');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const cx = W * 0.5, cy = H * 0.52, PX = 0.07;

      // clouds
      ctx.fillStyle = 'rgba(255,255,255,.75)';
      clouds.forEach((c) => {
        const y = cy - (c.alt - s.alt) * PX;
        if (y < -40 || y > H + 40) return;
        const x = ((c.x * (W + 200) - s.dist * 0.9) % (W + 200) + (W + 200)) % (W + 200) - 100;
        ctx.beginPath(); ctx.arc(x, y, c.r, 0, 7); ctx.arc(x + c.r, y + 4, c.r * 0.8, 0, 7); ctx.arc(x - c.r, y + 5, c.r * 0.7, 0, 7); ctx.fill();
      });
      // ground
      const gy = cy + s.alt * PX;
      if (gy < H) {
        ctx.fillStyle = '#3f8f4a'; ctx.fillRect(0, gy, W, H - gy);
        ctx.fillStyle = '#2f6e38';
        for (let k = 0; k < 12; k++) { const x = ((k * 90 - s.dist * 3) % (W + 90) + W + 90) % (W + 90) - 45; ctx.fillRect(x, gy, 30, 6); }
      }
      // target altitude line
      const tgt = { level: 3000, climb: 4000, descend: 2000, slow: 3000 }[m.id];
      if (tgt) {
        const ty = cy - (tgt - s.alt) * PX;
        ctx.setLineDash([8, 8]); ctx.strokeStyle = 'rgba(255,210,122,.9)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, ty); ctx.lineTo(W, ty); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#ffd27a'; ctx.font = '700 11px ui-rounded, system-ui'; ctx.textAlign = 'left';
        ctx.fillText(`TARGET ${tgt.toLocaleString()} FT`, 8, ty - 6);
      }

      const theta = +pit.value * Math.PI / 180;
      const shake = s.stalled ? (Math.random() - 0.5) * 0.05 : 0;
      const sc = Math.min(1.1, W / 360);

      // flight path (relative wind comes from the opposite direction)
      ctx.setLineDash([5, 6]); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(-s.gamma) * 130 * sc, cy + Math.sin(-s.gamma) * 130 * sc); ctx.stroke();
      ctx.setLineDash([]);

      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-theta + shake); ctx.scale(sc, sc); ctx.translate(-100, -50);
      ctx.fillStyle = '#f4f7fb'; ctx.strokeStyle = '#0b1b33'; ctx.lineWidth = 1.8; ctx.lineJoin = 'round';
      ctx.fill(PLANE); ctx.stroke(PLANE);
      ctx.fillStyle = '#d64a2b'; ctx.fill(WING); ctx.stroke(WING);
      ctx.fillStyle = '#9cc8ff'; ctx.fill(WINDOW); ctx.stroke(WINDOW);
      ctx.fillStyle = '#0b1b33'; ctx.beginPath(); ctx.arc(161, 52, 3, 0, 7); ctx.fill();
      ctx.globalAlpha = 0.5; ctx.fillRect(160, 38 + (performance.now() / 20 % 4), 2, 28); ctx.globalAlpha = 1;
      ctx.restore();

      // force arrows (from CG)
      const F = 58 * sc;
      arrow(cx, cy, -s.gamma - Math.PI / 2, F * Math.min(s.L, 2.2), col('--lift') || '#16a34a', 'LIFT');
      arrow(cx, cy, Math.PI / 2, F, col('--weight') || '#dc2626', 'WEIGHT');
      arrow(cx, cy, -theta, F * 9 * s.T, col('--thrust') || '#2563eb', 'THRUST');
      arrow(cx, cy, Math.PI - s.gamma, F * 9 * Math.min(s.D, 0.25), col('--drag') || '#d97706', 'DRAG');

      // HUD
      ctx.fillStyle = 'rgba(4,12,28,.78)';
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(8, 8, 128, 84, 10) : ctx.rect(8, 8, 128, 84); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '700 13px ui-monospace, Menlo, monospace'; ctx.textAlign = 'left';
      ctx.fillText(`ALT ${Math.round(s.alt).toLocaleString().padStart(6)} ft`, 16, 28);
      ctx.fillStyle = s.v > VNE ? '#ff8a8a' : '#fff';
      ctx.fillText(`SPD ${Math.round(s.v).toString().padStart(6)} kt`, 16, 46);
      ctx.fillStyle = '#fff';
      ctx.fillText(`VS  ${(Math.round(s.vs / 10) * 10).toString().padStart(6)} fpm`, 16, 64);
      ctx.fillStyle = s.aoa > CRIT - 2 ? '#ffb4b4' : '#ffd27a';
      ctx.fillText(`AoA ${s.aoa.toFixed(1).padStart(6)}°`, 16, 82);

      // AoA gauge
      const gx = W - 22, gtop = 16, gh = 90;
      ctx.fillStyle = 'rgba(4,12,28,.55)'; ctx.fillRect(gx - 8, gtop - 6, 22, gh + 30);
      const aFrac = Math.max(0, Math.min(1, (s.aoa + 4) / 24));
      const critFrac = (CRIT + 4) / 24;
      ctx.fillStyle = '#16a34a'; ctx.fillRect(gx - 2, gtop + gh * (1 - critFrac + 0.08), 10, gh * (critFrac - 0.08));
      ctx.fillStyle = '#f59e0b'; ctx.fillRect(gx - 2, gtop + gh * (1 - critFrac), 10, gh * 0.08);
      ctx.fillStyle = '#dc2626'; ctx.fillRect(gx - 2, gtop, 10, gh * (1 - critFrac));
      ctx.fillStyle = '#fff'; ctx.fillRect(gx - 6, gtop + gh * (1 - aFrac) - 1.5, 18, 3);
      ctx.font = '700 9px ui-rounded, system-ui'; ctx.textAlign = 'center'; ctx.fillText('AoA', gx + 3, gtop + gh + 18);

      // warnings
      const warn = s.crashed > 0 ? '💥 Ground contact! Resetting…' : s.stalled ? '⚠ STALL — LOWER THE NOSE!' : s.aoa > CRIT - 2 ? '🔊 Stall warning' : s.v > VNE ? '⚠ OVERSPEED (Vne 163 kt)' : '';
      if (warn) {
        ctx.font = '800 16px ui-rounded, system-ui'; ctx.textAlign = 'center';
        const tw = ctx.measureText(warn).width + 24;
        ctx.fillStyle = s.stalled || s.crashed ? 'rgba(198,40,40,.92)' : 'rgba(217,119,6,.92)';
        ctx.fillRect(cx - tw / 2, H - 44, tw, 30);
        ctx.fillStyle = '#fff'; ctx.fillText(warn, cx, H - 23);
      }
      if (s.won) {
        ctx.fillStyle = 'rgba(19,138,67,.92)'; ctx.font = '800 20px ui-rounded, system-ui'; ctx.textAlign = 'center';
        const t = `✅ Mission complete!${s.won !== true ? ` +${s.won} XP` : ''}`;
        const tw = ctx.measureText(t).width + 30;
        ctx.fillRect(cx - tw / 2, 14, tw, 38); ctx.fillStyle = '#fff'; ctx.fillText(t, cx, 40);
      }
    }

    function meters() {
      const lw = Math.max(-1, Math.min(1, (s.L - Math.cos(s.gamma)) * 2.5));
      const td = Math.max(-1, Math.min(1, (s.T - s.D - Math.sin(s.gamma)) * 12));
      const set = (el, v, pos, neg) => {
        el.style.left = v >= 0 ? '50%' : `${50 + v * 50}%`;
        el.style.width = `${Math.abs(v) * 50}%`;
        el.style.background = v >= 0 ? pos : neg;
      };
      set($('lw'), lw, 'var(--lift)', 'var(--weight)');
      set($('td'), td, 'var(--thrust)', 'var(--drag)');
      $('hb').style.width = `${Math.min(1, m.held / m.hold) * 100}%`;
    }

    function tick(now) {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      if (s.crashed > 0) {
        s.crashed -= dt;
        if (s.crashed <= 0) reset();
      } else {
        for (let k = 0; k < 4; k++) step((dt * TIME_SCALE) / 4);
        if (s.alt <= 0) { s.alt = 0; s.crashed = 1.8; opts.sfx.bad(); }
        if (m.stall) {
          if (s.stalled) { m.stallT += dt; if (m.stallT > 0.4) m.sawStall = true; }
        }
        const ok = !s.won && (!m.stall || m.sawStall) && m.goal(s);
        m.held = ok ? m.held + dt : s.won ? m.held : Math.max(0, m.held - dt * 2);
        if (!s.won && m.held >= m.hold) {
          const xp = opts.onMission(m.id, m.title);
          done.add(m.id); s.won = xp || true; opts.sfx.win(); chips();
        }
      }
      horn(!s.crashed && s.aoa > CRIT - 2);
      hintT -= dt;
      if (hintT <= 0) { $('hint').textContent = s.won ? 'Great flying! Tap “Next mission” when you’re ready.' : m.hint(s, m); hintT = 0.8; }
      draw(); meters();
    }

    root.querySelectorAll('[data-d]').forEach((b) => b.onclick = () => {
      const el = b.dataset.d === 'thr' ? thr : pit;
      el.value = Math.max(+el.min, Math.min(+el.max, +el.value + +b.dataset.v)); labels();
    });
    thr.oninput = labels; pit.oninput = labels;
    $('rs').onclick = reset;
    $('nx').onclick = () => { mi = (mi + 1) % MISSIONS.length; reset(); };

    const onVis = () => { if (document.hidden) { cancelAnimationFrame(raf); horn(false); } else { last = 0; raf = requestAnimationFrame(tick); } };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', resize);
    resize(); reset();
    raf = requestAnimationFrame(tick);

    return {
      destroy() {
        cancelAnimationFrame(raf); horn(false);
        document.removeEventListener('visibilitychange', onVis);
        window.removeEventListener('resize', resize);
      }
    };
  }

  SKY.games.trim = { mount, missionCount: MISSIONS.length };
})();
