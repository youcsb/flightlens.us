// Rapid Sort — a reusable tap-to-sort game. Each chapter supplies rounds:
//   { id, title, brief, buckets: ['A', 'B'], items: [{ t: 'text', b: bucketIndex, why: 'optional explanation' }] }
// Wrong answers come back later in the round, so every round ends with everything sorted correctly.
(() => {
  const SKY = window.SKY = window.SKY || {};
  SKY.games = SKY.games || {};
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function mount(root, opts) {
    const rounds = opts.config.rounds;
    const done = new Set(opts.done || []);
    let ri = rounds.findIndex((r) => !done.has(r.id));
    if (ri < 0) ri = 0;
    let r, queue, cur, mistakes, correct, t0, busy, timer;

    root.innerHTML = `<div class="game">
      <div class="mission-chips" id="chips"></div>
      <div class="brief"><strong id="rt"></strong><p id="rb"></p></div>
      <div id="play"></div>
    </div>`;
    const $ = (id) => root.querySelector('#' + id);

    function chips() {
      $('chips').innerHTML = rounds.map((x, k) =>
        `<button class="mchip ${k === ri ? 'on' : ''} ${done.has(x.id) ? 'done' : ''}" data-k="${k}">${done.has(x.id) ? '✓ ' : ''}${k + 1}. ${x.title}</button>`).join('');
      $('chips').querySelectorAll('.mchip').forEach((b) => b.onclick = () => { ri = +b.dataset.k; start(); });
    }

    function start() {
      clearTimeout(timer);
      r = rounds[ri];
      queue = shuffle(r.items.map((_, i) => i));
      mistakes = 0; correct = 0; t0 = Date.now(); busy = false;
      $('rt').textContent = `Round ${ri + 1}: ${r.title}`;
      $('rb').textContent = r.brief;
      $('play').innerHTML = `<div class="sort-card"><span class="sort-count" id="cnt"></span><span class="sort-streak" id="mis"></span><div class="sort-item" id="it"></div></div>
        <div class="sort-buckets">${r.buckets.map((b, k) => `<button class="bucket" data-k="${k}">${b}</button>`).join('')}</div>
        <div id="fb"></div>`;
      $('play').querySelectorAll('.bucket').forEach((b) => b.onclick = () => pick(+b.dataset.k, b));
      chips(); next();
    }

    function next() {
      if (!queue.length) return finish();
      cur = queue.shift(); busy = false;
      $('fb').innerHTML = '';
      $('play').querySelectorAll('.bucket').forEach((b) => b.classList.remove('right', 'wrong', 'hint'));
      const it = $('it');
      it.innerHTML = r.items[cur].t;
      it.style.animation = 'none'; void it.offsetWidth; it.style.animation = '';
      $('cnt').textContent = `${correct}/${r.items.length}`;
      $('mis').textContent = mistakes ? `✗ ${mistakes}` : '';
    }

    function pick(k, btn) {
      if (busy) return;
      busy = true;
      const it = r.items[cur];
      if (k === it.b) {
        correct++; btn.classList.add('right'); opts.sfx.good();
        $('cnt').textContent = `${correct}/${r.items.length}`;
        timer = setTimeout(next, 420);
      } else {
        mistakes++; opts.sfx.bad();
        btn.classList.add('wrong');
        $('play').querySelectorAll('.bucket')[it.b].classList.add('hint');
        queue.splice(Math.min(queue.length, 2 + Math.floor(Math.random() * 3)), 0, cur);
        $('fb').innerHTML = `<div class="explain"><b class="bad">It’s “${r.buckets[it.b]}.” </b>${it.why || ''} <span style="color:var(--muted)">You’ll see this one again.</span></div>
          <button class="btn" id="go" style="margin-top:12px">Got it</button>`;
        $('go').onclick = next;
      }
    }

    function finish() {
      const secs = Math.round((Date.now() - t0) / 1000);
      const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
      const xp = opts.onMission(r.id, r.title);
      done.add(r.id); chips(); opts.sfx.win();
      $('play').innerHTML = `<div class="card" style="text-align:center">
        <div class="stars">${'★'.repeat(stars)}<span style="opacity:.25">${'★'.repeat(3 - stars)}</span></div>
        <h2 style="margin:6px 0 4px">${stars === 3 ? 'Perfect sort!' : 'Round complete!'}</h2>
        <p style="color:var(--muted);margin:0 0 12px">${r.items.length} sorted in ${secs}s · ${mistakes} mistake${mistakes === 1 ? '' : 's'}</p>
        ${xp ? `<p><span class="chip">⭐ +${xp} XP</span> <span class="chip">📒 +0.3 hrs</span></p>` : ''}
        <div class="btn-row"><button class="btn ghost" id="again">↺ Play again</button><button class="btn" id="nxt">${ri < rounds.length - 1 ? 'Next round ›' : 'Round 1 ›'}</button></div></div>`;
      $('again').onclick = start;
      $('nxt').onclick = () => { ri = (ri + 1) % rounds.length; start(); };
    }

    start();
    return { destroy() { clearTimeout(timer); } };
  }

  SKY.games.sort = { mount };
})();
