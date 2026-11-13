// Small SVG helpers shared by every chapter's diagrams. Colors come from CSS classes in css/app.css.
(() => {
  const SKY = window.SKY = window.SKY || {};
  const r = (n) => Math.round(n * 10) / 10;

  const arrow = (x1, y1, x2, y2, cls, w = 3.5) => {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 8;
    const p = (ang, len) => `${r(x2 + Math.cos(ang) * len)},${r(y2 + Math.sin(ang) * len)}`;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}" stroke-linecap="round"/>` +
      `<polygon points="${p(a, h)} ${p(a + 2.5, h)} ${p(a - 2.5, h)}" class="${cls}" stroke-width="1"/>`;
  };

  const arcArrow = (cx, cy, rad, a0, a1, cls) => {
    const pt = (a) => [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
    const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
    const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0, sweep = a1 > a0 ? 1 : 0;
    const tan = a1 + (sweep ? Math.PI / 2 : -Math.PI / 2), h = 6;
    const q = (ang) => `${r(x1 + Math.cos(ang) * h)},${r(y1 + Math.sin(ang) * h)}`;
    return `<path d="M${r(x0)},${r(y0)} A${rad},${rad} 0 ${large} ${sweep} ${r(x1)},${r(y1)}" class="${cls}" stroke-width="2.5" style="fill:none"/>` +
      `<polygon points="${q(tan)} ${q(tan + 2.5)} ${q(tan - 2.5)}" class="${cls}"/>`;
  };

  const txt = (x, y, s, cls = 'd-text', anchor = 'middle') => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${s}</text>`;
  const lines = (x, y, arr, cls = 'd-text', anchor = 'middle', gap = 12) => arr.map((s, i) => txt(x, y + i * gap, s, cls, anchor)).join('');
  const box = (x, y, w, h, cls = 'd-box', rx = 8) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="${cls}"/>`;
  const svg = (w, h, body, label) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">${body}</svg>`;

  // Side-view high-wing trainer, nose right, CG at (tx,ty).
  const planeSide = (tx, ty, s = 1, rot = 0) => `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${s}) translate(-100,-50)">
    <path class="d-plane" d="M160,52 Q158,44 145,43 L80,41 Q65,40 35,36 L28,22 L20,22 L22,42 Q22,47 30,48 L140,58 Q155,58 160,52 Z"/>
    <path class="d-plane" style="fill:var(--accent)" d="M92,38 L134,38 Q137,40 134,42 L92,42 Q89,40 92,38 Z"/>
    <path class="d-window" d="M128,44 L141,45 L148,51 L128,50 Z"/>
    <rect x="160" y="37" width="2.5" height="30" rx="1" class="d-fill-ink" opacity=".55"/>
    <circle cx="161" cy="52" r="3" class="d-fill-ink"/></g>`;

  const TOP = [[0.50, 0.12], [0.53, 0.15], [0.545, 0.24], [0.545, 0.40], [0.88, 0.50], [0.88, 0.56], [0.545, 0.53], [0.532, 0.74], [0.68, 0.80], [0.68, 0.845], [0.52, 0.83], [0.50, 0.87]];
  const topPts = TOP.concat(TOP.slice(1, -1).reverse().map(([x, y]) => [1 - x, y]));
  // Top-view airplane, nose up, fitted in a size×size square at (ox,oy).
  const planeTop = (ox, oy, size) => `<polygon class="d-plane" points="${topPts.map(([x, y]) => `${r(ox + x * size)},${r(oy + y * size)}`).join(' ')}"/>`;

  // Front/rear view: wing span, fuselage circle and fin.
  const planeFront = (cx, cy, span, rot = 0) => `<g transform="translate(${cx},${cy}) rotate(${rot})">
    <rect x="${-span / 2}" y="-3" width="${span}" height="6" rx="3" class="d-plane"/>
    <line x1="0" y1="-12" x2="0" y2="-32" class="d-ink" stroke-width="3" stroke-linecap="round"/>
    <rect x="-24" y="-14" width="48" height="4" rx="2" class="d-plane"/>
    <circle cx="0" cy="0" r="13" class="d-plane"/></g>`;

  // Airfoil: chord 100 wide starting at (0,0), nose at left.
  const AIRFOIL = 'M0,0 C0,-8 20,-13 45,-12 C70,-11 90,-5 100,0 C80,2 40,4 15,3 C5,3 0,2 0,0 Z';

  SKY.draw = { r, arrow, arcArrow, txt, lines, box, svg, planeSide, planeTop, planeFront, AIRFOIL };
})();
