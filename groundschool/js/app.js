(() => {
  const SKY = window.SKY = window.SKY || {};
  SKY.content = SKY.content || {};
  SKY.registerChapter = (c) => {
    if (c.game && !c.game.missionCount) c.game.missionCount = c.game.rounds ? c.game.rounds.length : (SKY.games[c.game.engine]?.missionCount || 1);
    SKY.content[c.id] = c;
  };

  const $app = document.getElementById('app');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const today = () => ymd(new Date());

  // ---------- Progress (saved on this device) ----------
  const KEY = 'skycadet.v1';
  const fresh = () => ({ name: '', xp: 0, hours: 0, done: {}, quiz: {}, game: {}, badges: {}, log: [], sound: true, streak: { last: null, count: 0 } });
  let S = fresh();
  try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* private mode */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };

  const RANKS = [
    { xp: 0, name: 'Cadet', em: '🎒' },
    { xp: 250, name: 'Student Pilot', em: '📗' },
    { xp: 700, name: 'Solo Pilot', em: '🛩️' },
    { xp: 1500, name: 'Private Pilot', em: '🪽' },
    { xp: 3000, name: 'Instrument Rated', em: '🌫️' },
    { xp: 5000, name: 'Commercial Pilot', em: '💼' },
    { xp: 8000, name: 'Airline Captain', em: '👨‍✈️' }
  ];
  const rankOf = (xp) => { let r = 0; RANKS.forEach((k, i) => { if (xp >= k.xp) r = i; }); return r; };

  function bumpStreak() {
    const t = today();
    if (S.streak.last === t) return;
    const d = new Date(); d.setDate(d.getDate() - 1);
    const y = ymd(d);
    S.streak.count = S.streak.last === y ? S.streak.count + 1 : 1;
    S.streak.last = t;
  }

  function award(xp, hours, what) {
    const before = rankOf(S.xp);
    S.xp += xp;
    S.hours = Math.round((S.hours + hours) * 10) / 10;
    if (what) S.log.unshift({ d: today(), what, h: hours, xp });
    bumpStreak();
    save();
    const after = rankOf(S.xp);
    if (after > before) setTimeout(() => rankUp(RANKS[after]), 900);
  }

  // ---------- Sound ----------
  let actx;
  function tone(freqs, dur = 0.12, type = 'sine', vol = 0.08) {
    if (!S.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      freqs.forEach((f, i) => {
        const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + i * dur;
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 1.6);
        o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur * 1.7);
      });
    } catch (e) { /* no audio */ }
  }
  SKY.sfx = {
    good: () => tone([660, 990]),
    bad: () => tone([220, 180], 0.14, 'square', 0.04),
    win: () => tone([523, 659, 784, 1047], 0.11),
    ctx: () => { if (!S.sound) return null; actx = actx || new (window.AudioContext || window.webkitAudioContext)(); return actx; }
  };

  // ---------- UI helpers ----------
  let toastTimer;
  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
  }
  function confetti() {
    const box = document.createElement('div'); box.className = 'confetti';
    const colors = ['#ff8a1f', '#1462d6', '#16a34a', '#ffd27a', '#dc2626', '#60a5fa'];
    for (let i = 0; i < 70; i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = 1.6 + Math.random() * 1.6 + 's';
      p.style.animationDelay = Math.random() * 0.4 + 's';
      box.appendChild(p);
    }
    document.body.appendChild(box); setTimeout(() => box.remove(), 3800);
  }
  const modalQueue = [];
  function modal(html, onMount) {
    if (document.querySelector('.modal-back')) { modalQueue.push([html, onMount]); return; }
    const back = document.createElement('div'); back.className = 'modal-back';
    back.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
    document.body.appendChild(back);
    const close = () => { back.remove(); const next = modalQueue.shift(); if (next) modal(...next); };
    onMount && onMount(back, close);
  }
  function rankUp(r) {
    SKY.sfx.win(); confetti();
    modal(`<div style="font-size:64px">${r.em}</div><h2>Promoted: ${esc(r.name)}!</h2><p>Your hard work is paying off, ${esc(S.name || 'Cadet')}. Keep climbing.</p><button class="btn" data-x>Roger that</button>`,
      (el, close) => el.querySelector('[data-x]').onclick = close);
  }
  const topbar = (title, back = '#/', extra = '') =>
    `<header class="topbar"><a class="icon-btn" href="${back}" aria-label="Back">‹</a><h1>${title}</h1>${extra}</header>`;
  const xpChip = () => `<span class="chip">⭐ ${S.xp} XP</span>`;

  // ---------- Chapter loading ----------
  const meta = (id) => SKY.catalog.find((c) => c.id === id);
  function loadChapter(id) {
    const m = meta(id);
    if (!m || !m.file) return Promise.resolve(null);
    if (SKY.content[id]) return Promise.resolve(SKY.content[id]);
    return new Promise((res) => {
      const s = document.createElement('script');
      s.src = m.file;
      s.onload = () => res(SKY.content[id] || null);
      s.onerror = () => res(null);
      document.head.appendChild(s);
    });
  }
  function chapterProgress(c) {
    if (!c) return 0;
    const parts = c.missions.length + 2;
    let n = c.missions.filter((m) => S.done[`${c.id}/${m.id}`]).length;
    if ((S.quiz[c.id]?.best || 0) >= 0.8) n++;
    const g = S.game[c.id] || [];
    if (c.game && g.length >= c.game.missionCount) n++;
    return n / parts;
  }
  function checkBadge(c) {
    if (S.badges[c.id]) return;
    const allMissions = c.missions.every((m) => S.done[`${c.id}/${m.id}`]);
    if (allMissions && (S.quiz[c.id]?.best || 0) >= 0.8) {
      S.badges[c.id] = today();
      award(150, 0, `Earned badge: ${c.badge.name}`);
      setTimeout(() => {
        SKY.sfx.win(); confetti();
        modal(`<div style="font-size:72px">${c.badge.emoji}</div><h2>${esc(c.badge.name)}</h2><p>${esc(c.badge.desc)}</p><p><span class="chip">⭐ +150 XP</span></p><button class="btn" data-x>Awesome!</button>`,
          (el, close) => el.querySelector('[data-x]').onclick = close);
      }, 600);
    }
  }

  // ---------- Screens ----------
  let cleanup = null;

  function home() {
    const r = rankOf(S.xp), rank = RANKS[r], next = RANKS[r + 1];
    const pct = next ? ((S.xp - rank.xp) / (next.xp - rank.xp)) * 100 : 100;
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    let cont = null;
    for (const m of SKY.catalog) {
      const c = SKY.content[m.id];
      if (!c) continue;
      const mi = c.missions.find((x) => !S.done[`${c.id}/${x.id}`]);
      if (mi) { cont = { href: `#/lesson/${c.id}/${mi.id}`, em: mi.emoji, top: `Chapter ${m.num} · Mission ${c.missions.indexOf(mi) + 1}`, title: mi.title }; break; }
      if ((S.quiz[c.id]?.best || 0) < 0.8) { cont = { href: `#/quiz/${c.id}`, em: '📝', top: `Chapter ${m.num}`, title: 'Take the Checkride quiz' }; break; }
    }

    const waypoints = SKY.catalog.map((m) => {
      const c = SKY.content[m.id];
      const p = chapterProgress(c);
      const cls = !m.file ? 'soon' : S.badges[m.id] ? 'done' : 'ready';
      const pill = !m.file ? '<span class="pill">Coming soon</span>'
        : S.badges[m.id] ? '<span class="pill ok">Badge earned</span>' : '<span class="pill live">Ready to fly</span>';
      return `<a class="wp ${cls}" href="#/ch/${m.id}" style="text-decoration:none;color:inherit">
        <span class="wp-dot">${S.badges[m.id] ? (c?.badge.emoji || '🏅') : m.emoji}</span>
        <span class="wp-body"><span class="wp-num">CHAPTER ${m.num}</span><span class="wp-title">${esc(m.title)}</span>
        <span class="wp-phak">${esc(m.phak)}</span>${pill}${m.file ? `<span class="mini-bar"><i style="width:${p * 100}%"></i></span>` : ''}</span></a>`;
    }).join('');

    $app.innerHTML = `
      <section class="hero">
        <a class="icon-btn settings-btn" href="#/settings" aria-label="Settings">⚙︎</a>
        <p class="hello">${greet},</p>
        <h2>${S.name ? 'Cadet ' + esc(S.name) : 'Cadet'}</h2>
        <div class="rank-row">
          <div class="rank-badge">${rank.em}</div>
          <div style="flex:1">
            <div class="rank-name">${rank.name}</div>
            <div class="xpbar"><i style="width:${pct}%"></i></div>
            <div class="xp-note">${next ? `${next.xp - S.xp} XP to ${next.name}` : 'Top rank — legend status!'}</div>
          </div>
        </div>
        <div class="stats">
          <div class="stat"><b>${S.xp}</b><span>XP</span></div>
          <a class="stat stat-link" href="#/log"><b>${S.hours.toFixed(1)}</b><span>Logbook hrs</span></a>
          <div class="stat"><b>${S.streak.count || 0}🔥</b><span>Day streak</span></div>
        </div>
      </section>
      <div class="wrap">
        ${cont ? `<div class="section-title">Up next</div>
        <a class="card continue" href="${cont.href}" style="text-decoration:none;color:inherit">
          <span class="big-emoji">${cont.em}</span><span><small>${cont.top}</small><strong>${esc(cont.title)}</strong></span><span class="go">›</span></a>` : ''}
        <div class="section-title">Your route · Pilot's Handbook of Aeronautical Knowledge</div>
        <nav class="route">${waypoints}</nav>
        <p style="text-align:center;margin:28px 0 0"><a href="../" style="font-weight:700;text-decoration:none">← Back to FlightLens</a></p>
      </div>`;

    if (!S.name) askName();
  }

  function askName(onDone) {
    modal(`<div style="font-size:56px">🧑‍✈️</div><h2>Welcome aboard!</h2>
      <p>I'm Jax, your flight instructor. Every pilot needs a callsign. What should I call you?</p>
      <label class="field"><span>Your callsign</span><input id="nm" maxlength="20" autocomplete="off" placeholder="e.g. Maverick" value="${esc(S.name)}"></label>
      <button class="btn" id="nmgo">Let's fly</button>`, (el, close) => {
      const inp = el.querySelector('#nm');
      const go = () => { S.name = inp.value.trim().slice(0, 20) || 'Rookie'; save(); close(); onDone ? onDone() : home(); };
      el.querySelector('#nmgo').onclick = go;
      inp.onkeydown = (e) => { if (e.key === 'Enter') go(); };
      setTimeout(() => inp.focus(), 50);
    });
  }

  async function chapter(id) {
    const m = meta(id);
    if (!m) return go('#/');
    const c = await loadChapter(id);
    if (!c) {
      $app.innerHTML = topbar(`Chapter ${m.num}`) + `<div class="wrap">
        <div class="ch-hero"><div class="em">${m.emoji}</div><h2>${esc(m.title)}</h2><p>PHAK Chapter ${m.num}: ${esc(m.phak)}</p></div>
        <div class="card" style="margin-top:16px"><strong>🛠️ This chapter is still in the hangar.</strong>
        <p style="margin:6px 0 10px;color:var(--muted)">Here's what you'll learn when it's ready:</p>
        <ul class="topic-list">${m.topics.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div></div>`;
      return;
    }
    const doneCount = c.missions.filter((x) => S.done[`${id}/${x.id}`]).length;
    const best = S.quiz[id]?.best;
    const g = S.game[id] || [];
    const earned = !!S.badges[id];
    $app.innerHTML = topbar(`Chapter ${m.num}`, '#/', xpChip()) + `<div class="wrap">
      <div class="ch-hero"><div class="em">${m.emoji}</div><h2>${esc(m.title)}</h2><p>PHAK Chapter ${m.num}: ${esc(m.phak)}</p></div>
      <div class="section-title">Missions · ${doneCount}/${c.missions.length} complete</div>
      <div class="list">${c.missions.map((x, i) => {
        const d = S.done[`${id}/${x.id}`];
        return `<a class="row ${d ? 'done' : ''}" href="#/lesson/${id}/${x.id}" style="text-decoration:none;color:inherit">
          <span class="em">${x.emoji}</span><span class="txt"><strong>${i + 1}. ${esc(x.title)}</strong><small>${esc(x.blurb)} · ~${x.minutes} min</small></span>
          <span class="state">${d ? '✅' : '›'}</span></a>`;
      }).join('')}</div>
      <div class="section-title">Practice</div>
      <div class="list">
        ${c.game ? `<a class="row" href="#/game/${id}" style="text-decoration:none;color:inherit"><span class="em">🎮</span>
          <span class="txt"><strong>${esc(c.game.title)}</strong><small>${esc(c.game.blurb)} · ${g.length}/${c.game.missionCount} done</small></span><span class="state">${g.length >= c.game.missionCount ? '✅' : '›'}</span></a>` : ''}
        <a class="row" href="#/quiz/${id}" style="text-decoration:none;color:inherit"><span class="em">📝</span>
          <span class="txt"><strong>Checkride Quiz</strong><small>Real FAA-style questions · ${best != null ? `Best: ${Math.round(best * 100)}%` : 'Not taken yet'}</small></span><span class="state">${best >= 0.8 ? '✅' : '›'}</span></a>
        <a class="row" href="#/cards/${id}" style="text-decoration:none;color:inherit"><span class="em">🃏</span>
          <span class="txt"><strong>Word Hangar</strong><small>${c.glossary.length} flashcards of key terms</small></span><span class="state">›</span></a>
      </div>
      <div class="section-title">Chapter badge</div>
      <div class="card badge-card ${earned ? 'earned' : 'locked'}"><div class="medal">${c.badge.emoji}</div>
        <div><strong>${esc(c.badge.name)}</strong><div style="color:var(--muted);font-size:14px">${earned ? `Earned ${S.badges[id]}` : 'Finish every mission and score 80%+ on the Checkride to earn it.'}</div></div></div>
    </div>`;
  }

  // Lesson player
  async function lesson(id, mid) {
    const c = await loadChapter(id);
    const mi = c?.missions.find((x) => x.id === mid);
    if (!mi) return go(`#/ch/${id}`);
    const cards = mi.cards;
    let i = 0;

    const draw = () => {
      const card = cards[i];
      const needsAnswer = card.t === 'check' || card.t === 'hotspot';
      $app.innerHTML = `<header class="topbar"><a class="icon-btn" href="#/ch/${id}" aria-label="Close">✕</a>
        <div class="progress"><i style="width:${(i / cards.length) * 100}%"></i></div><span class="chip">${i + 1}/${cards.length}</span></header>
        <div class="stage">${i === 0 ? `<div class="who" style="text-align:center;margin:0 0 12px">MISSION ${c.missions.indexOf(mi) + 1} · ${esc(mi.title.toUpperCase())}</div>` : ''}${renderCard(card)}</div>
        <div class="footer-bar"><button class="btn" id="next" ${needsAnswer ? 'disabled' : ''}>${i === cards.length - 1 ? 'Finish mission' : 'Continue'}</button></div>`;
      wireCard(card, () => { document.getElementById('next').disabled = false; });
      document.getElementById('next').onclick = () => {
        if (i < cards.length - 1) { i++; draw(); window.scrollTo(0, 0); } else finish();
      };
    };

    const finish = () => {
      const key = `${id}/${mid}`;
      const first = !S.done[key];
      if (first) { S.done[key] = today(); award(mi.xp || 50, 0.5, `Ch ${meta(id).num} mission: ${mi.title}`); }
      else { bumpStreak(); save(); }
      SKY.sfx.win(); confetti();
      const idx = c.missions.indexOf(mi), nxt = c.missions[idx + 1];
      $app.innerHTML = `<div class="celebrate"><div class="big">${mi.emoji}</div><h2>Mission complete!</h2>
        <p style="color:var(--muted)">${esc(mi.title)}</p>
        <div class="rewards">${first ? `<span class="chip">⭐ +${mi.xp || 50} XP</span><span class="chip">📒 +0.5 hrs logged</span>` : '<span class="chip">🔁 Review flight — nice!</span>'}</div>
        ${mi.phak ? `<p style="color:var(--muted);font-size:14px">📖 In your PHAK: ${esc(mi.phak)}</p>` : ''}</div>
        <div class="wrap">${nxt ? `<a class="btn" href="#/lesson/${id}/${nxt.id}" style="text-align:center;text-decoration:none">Next: ${esc(nxt.title)}</a>`
          : `<a class="btn" href="#/quiz/${id}" style="text-align:center;text-decoration:none">Take the Checkride quiz</a>`}
        <a class="btn ghost" href="#/ch/${id}" style="text-align:center;text-decoration:none">Back to chapter</a></div>`;
      checkBadge(c);
    };
    draw();
  }

  function renderCard(c) {
    switch (c.t) {
      case 'talk':
        return `<div class="talk"><div class="avatar">🧑‍✈️</div><div class="bubble"><div class="who">JAX · YOUR CFI</div>${c.html}</div></div>`;
      case 'diagram':
        return `<figure class="figure" style="margin:0">${c.svg}${c.caption ? `<figcaption>${c.caption}</figcaption>` : ''}</figure>${c.html ? `<div class="talk" style="margin-top:14px"><div class="avatar">🧑‍✈️</div><div class="bubble">${c.html}</div></div>` : ''}`;
      case 'fact':
        return `<div class="callout fact"><h3>⚡ REAL PILOT FACT</h3>${c.html}</div>`;
      case 'tryit':
        return `<div class="callout tryit"><h3>🧪 TRY IT YOURSELF</h3>${c.html}</div>`;
      case 'test':
        return `<div class="callout test"><h3>🎯 CHECKRIDE CORNER — how the FAA test asks it</h3>${c.html}</div>`;
      case 'check':
        return `<div class="who">QUICK CHECK</div><div class="q">${c.q}</div><div class="choices">${c.choices.map((ch, k) =>
          `<button class="choice" data-k="${k}"><span class="letter">${'ABC'[k] || k + 1}</span><span>${ch}</span></button>`).join('')}</div><div id="fb"></div>`;
      case 'hotspot':
        return `<div class="who">${c.title || 'TAP TO FIND'}</div><figure class="figure" style="margin:0"><div class="hotspot-wrap">${c.svg}${c.spots.map((s, k) =>
          `<button class="spot" data-k="${k}" style="left:${s.x}%;top:${s.y}%" aria-label="Spot ${k + 1}"></button>`).join('')}</div></figure>
          <p class="prompt" id="hp"></p>`;
      default: return '';
    }
  }

  function wireCard(c, unlock) {
    if (c.t === 'check') {
      document.querySelectorAll('.choice').forEach((b) => b.onclick = () => {
        const k = +b.dataset.k, ok = k === c.answer;
        document.querySelectorAll('.choice').forEach((x) => {
          x.disabled = true;
          if (+x.dataset.k === c.answer) x.classList.add('right');
          else if (x === b) x.classList.add('wrong'); else x.classList.add('dim');
        });
        ok ? SKY.sfx.good() : SKY.sfx.bad();
        document.getElementById('fb').innerHTML = `<div class="explain">${ok ? '<b class="ok">Nailed it! </b>' : '<b class="bad">Not quite. </b>'}${c.explain}</div>`;
        unlock();
      });
    }
    if (c.t === 'hotspot') {
      const order = shuffle(c.spots.map((_, k) => k));
      let at = 0;
      const hp = document.getElementById('hp');
      const ask = () => { hp.innerHTML = at < order.length ? `Tap: <em>${c.spots[order[at]].label}</em>` : '🎉 You found them all!'; };
      ask();
      document.querySelectorAll('.spot').forEach((b) => b.onclick = () => {
        if (at >= order.length || b.classList.contains('found')) return;
        const k = +b.dataset.k;
        if (k === order[at]) {
          b.classList.add('found'); b.textContent = '✓'; SKY.sfx.good(); at++; ask();
          if (at >= order.length) unlock();
        } else {
          SKY.sfx.bad(); b.classList.remove('miss'); void b.offsetWidth; b.classList.add('miss');
        }
      });
    }
  }

  // Checkride quiz
  async function quiz(id) {
    const c = await loadChapter(id);
    if (!c) return go('#/');
    const N = Math.min(c.quizLength || 12, c.quiz.length);
    const qs = shuffle(c.quiz).slice(0, N).map((q) => {
      const order = shuffle(q.choices.map((_, k) => k));
      return { ...q, choices: order.map((k) => q.choices[k]), answer: order.indexOf(q.answer) };
    });
    let i = 0, correct = 0;
    const missed = [];

    const draw = () => {
      const q = qs[i];
      $app.innerHTML = `<header class="topbar"><a class="icon-btn" href="#/ch/${id}" aria-label="Close">✕</a>
        <div class="progress"><i style="width:${(i / N) * 100}%"></i></div><span class="chip">✅ ${correct}</span></header>
        <div class="stage"><div class="who">CHECKRIDE · QUESTION ${i + 1} OF ${N}</div>
        <div class="q">${q.q}</div><div class="choices">${q.choices.map((ch, k) =>
          `<button class="choice" data-k="${k}"><span class="letter">${'ABC'[k]}</span><span>${ch}</span></button>`).join('')}</div><div id="fb"></div></div>
        <div class="footer-bar"><button class="btn" id="next" disabled>${i === N - 1 ? 'See results' : 'Next question'}</button></div>`;
      document.querySelectorAll('.choice').forEach((b) => b.onclick = () => {
        const k = +b.dataset.k, ok = k === q.answer;
        if (ok) correct++; else missed.push(q);
        document.querySelectorAll('.choice').forEach((x) => {
          x.disabled = true;
          if (+x.dataset.k === q.answer) x.classList.add('right'); else if (x === b) x.classList.add('wrong'); else x.classList.add('dim');
        });
        ok ? SKY.sfx.good() : SKY.sfx.bad();
        document.getElementById('fb').innerHTML = `<div class="explain">${ok ? '<b class="ok">Correct! </b>' : `<b class="bad">The answer is ${'ABC'[q.answer]}. </b>`}${q.explain}</div>`;
        document.getElementById('next').disabled = false;
        document.querySelector('.chip').textContent = `✅ ${correct}`;
      });
      document.getElementById('next').onclick = () => { if (i < N - 1) { i++; draw(); window.scrollTo(0, 0); } else results(); };
    };

    const results = () => {
      const score = correct / N;
      const prev = S.quiz[id] || { best: 0, tries: 0 };
      const prevBestCorrect = Math.round((prev.best || 0) * N);
      const gained = Math.max(0, correct - prevBestCorrect) * 10;
      S.quiz[id] = { best: Math.max(prev.best || 0, score), tries: (prev.tries || 0) + 1, last: today() };
      award(gained, 0.3, `Ch ${meta(id).num} Checkride: ${correct}/${N}`);
      const pass = score >= 0.8;
      if (pass) { SKY.sfx.win(); confetti(); }
      $app.innerHTML = `<div class="celebrate"><div class="big">${pass ? '🏆' : '🛬'}</div>
        <h2>${pass ? 'Checkride passed!' : 'Good practice flight'}</h2>
        <p style="color:var(--muted)">You scored <b>${correct}/${N}</b> (${Math.round(score * 100)}%). ${pass ? 'The real FAA test needs 70% — you’re above it!' : 'Score 80% to pass. Review and try again!'}</p>
        <div class="rewards">${gained ? `<span class="chip">⭐ +${gained} XP</span>` : ''}<span class="chip">📒 +0.3 hrs logged</span></div></div>
        <div class="wrap">${missed.length ? `<div class="section-title">Review what you missed</div><div class="list">${missed.map((q) =>
          `<div class="card"><strong>${q.q}</strong><div class="explain"><b class="ok">${q.choices[q.answer]}</b><br>${q.explain}</div></div>`).join('')}</div><div style="height:16px"></div>` : ''}
        <button class="btn" id="again">Try another checkride</button>
        <a class="btn ghost" href="#/ch/${id}" style="text-align:center;text-decoration:none">Back to chapter</a></div>`;
      document.getElementById('again').onclick = () => quiz(id);
      checkBadge(c);
    };
    draw();
  }

  // Flashcards
  async function cards(id) {
    const c = await loadChapter(id);
    if (!c) return go('#/');
    let deck = shuffle(c.glossary), i = 0;
    const draw = () => {
      const g = deck[i];
      $app.innerHTML = topbar('Word Hangar', `#/ch/${id}`, `<span class="chip">${i + 1}/${deck.length}</span>`) + `<div class="wrap">
        <p style="color:var(--muted);text-align:center;margin:4px 0 0">Tap the card to flip it.</p>
        <div class="flash" id="fl"><div class="flash-inner">
          <div class="flash-face flash-front">${esc(g.term)}<small>What does it mean?</small></div>
          <div class="flash-face flash-back"><small style="color:var(--brand);font-weight:800;margin-bottom:10px">${esc(g.term).toUpperCase()}</small>${g.def}</div></div></div>
        <div class="btn-row"><button class="btn ghost" id="prev" ${i === 0 ? 'disabled' : ''}>‹ Back</button><button class="btn" id="nx">${i === deck.length - 1 ? 'Shuffle & restart' : 'Next ›'}</button></div></div>`;
      document.getElementById('fl').onclick = (e) => e.currentTarget.classList.toggle('flipped');
      document.getElementById('prev').onclick = () => { if (i > 0) { i--; draw(); } };
      document.getElementById('nx').onclick = () => { if (i < deck.length - 1) i++; else { deck = shuffle(deck); i = 0; } draw(); };
    };
    draw();
  }

  // Mini-game
  async function game(id) {
    const c = await loadChapter(id);
    if (!c?.game) return go(`#/ch/${id}`);
    $app.innerHTML = topbar(esc(c.game.title), `#/ch/${id}`, xpChip()) + '<div id="gm"></div>';
    const done = S.game[id] = S.game[id] || [];
    const inst = SKY.games[c.game.engine].mount(document.getElementById('gm'), {
      config: c.game,
      done: done.slice(),
      sfx: SKY.sfx,
      onMission: (mid, title) => {
        if (done.includes(mid)) return false;
        done.push(mid);
        award(c.game.xpEach || 30, 0.3, `${c.game.title}: ${title}`);
        document.querySelector('.topbar .chip').textContent = `⭐ ${S.xp} XP`;
        return c.game.xpEach || 30;
      }
    });
    cleanup = () => inst.destroy();
  }

  function logbook() {
    $app.innerHTML = topbar('Pilot Logbook', '#/', `<span class="chip">📒 ${S.hours.toFixed(1)} hrs</span>`) + `<div class="wrap">
      <p style="color:var(--muted)">Real pilots log every flight. Here's every mission, quiz and sim session you've flown.</p>
      ${S.log.length ? `<div class="card" style="padding:6px 10px"><table class="log"><thead><tr><th>Date</th><th>Activity</th><th style="text-align:right">Hrs</th></tr></thead>
      <tbody>${S.log.slice(0, 200).map((e) => `<tr><td class="num" style="text-align:left">${esc(e.d.slice(5))}</td><td>${esc(e.what)}</td><td class="num">${e.h ? e.h.toFixed(1) : '—'}</td></tr>`).join('')}</tbody></table></div>`
        : '<div class="card">No entries yet. Fly your first mission!</div>'}</div>`;
  }

  function settings() {
    $app.innerHTML = topbar('Settings') + `<div class="wrap">
      <div class="card">
        <label class="field"><span>Callsign</span><input id="nm" maxlength="20" value="${esc(S.name)}"></label>
        <label class="toggle"><span><strong>Sound effects</strong><br><small style="color:var(--muted)">Chimes, buzzers and the stall horn</small></span><input type="checkbox" id="snd" ${S.sound ? 'checked' : ''}></label>
      </div>
      <div class="section-title">Back up progress</div>
      <div class="card">
        <p style="margin:0 0 8px;color:var(--muted);font-size:15px">Progress is saved on this device. Copy this code to move it to another device (or keep it safe), then paste it there.</p>
        <label class="field"><span>Backup code</span><textarea id="bk"></textarea></label>
        <div class="btn-row"><button class="btn ghost" id="exp">Make code</button><button class="btn" id="imp">Restore code</button></div>
      </div>
      <div class="section-title">Danger zone</div>
      <button class="btn ghost" id="rst" style="color:var(--bad)">Reset all progress</button>
      <p style="color:var(--muted);font-size:13px;text-align:center;margin-top:24px">Sky Cadet follows the FAA Pilot's Handbook of Aeronautical Knowledge (FAA-H-8083-25C). It's a study buddy — always use the official handbook and a certified instructor for real training.</p>
    </div>`;
    const nm = document.getElementById('nm');
    nm.onchange = () => { S.name = nm.value.trim().slice(0, 20) || S.name; save(); toast('Callsign updated'); };
    document.getElementById('snd').onchange = (e) => { S.sound = e.target.checked; save(); };
    document.getElementById('exp').onclick = () => {
      const bk = document.getElementById('bk');
      bk.value = btoa(unescape(encodeURIComponent(JSON.stringify(S))));
      bk.select();
      try { navigator.clipboard.writeText(bk.value).then(() => toast('Copied to clipboard')); } catch (e) { /* manual copy */ }
    };
    document.getElementById('imp').onclick = () => {
      try {
        const data = JSON.parse(decodeURIComponent(escape(atob(document.getElementById('bk').value.trim()))));
        if (typeof data.xp !== 'number') throw new Error('bad');
        S = Object.assign(fresh(), data); save(); toast('Progress restored!'); settings();
      } catch (e) { toast('That code didn’t work — check it was copied fully.'); }
    };
    document.getElementById('rst').onclick = () => {
      modal(`<div style="font-size:56px">🧹</div><h2>Start fresh?</h2>
        <p>This erases all XP, badges, quiz scores, logbook entries and the callsign on this device. It can’t be undone.</p>
        <button class="btn" id="rst-yes" style="background:var(--bad);box-shadow:none">Yes, erase everything</button>
        <button class="btn ghost" id="rst-no">Cancel</button>`, (el, close) => {
        el.querySelector('#rst-no').onclick = close;
        el.querySelector('#rst-yes').onclick = () => { S = fresh(); save(); close(); go('#/'); };
      });
    };
  }

  // ---------- Router ----------
  function go(h) { if (location.hash === h) route(); else location.hash = h; }
  function route() {
    if (cleanup) { cleanup(); cleanup = null; }
    document.querySelectorAll('.modal-back').forEach((m) => m.remove());
    modalQueue.length = 0;
    window.scrollTo(0, 0);
    const p = (location.hash.slice(2) || '').split('/');
    switch (p[0]) {
      case 'ch': return chapter(p[1]);
      case 'lesson': return lesson(p[1], p[2]);
      case 'quiz': return quiz(p[1]);
      case 'cards': return cards(p[1]);
      case 'game': return game(p[1]);
      case 'log': return logbook();
      case 'settings': return settings();
      default: return home();
    }
  }
  window.addEventListener('hashchange', route);

  // Preload published chapters so the home screen can show progress and "Up next".
  Promise.all(SKY.catalog.filter((m) => m.file).map((m) => loadChapter(m.id))).then(route);

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
