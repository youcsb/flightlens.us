// Chapter 5 — Aerodynamics of Flight (PHAK FAA-H-8083-25C)
(() => {
  const { r, arrow, arcArrow, txt, svg, planeSide, planeTop, planeFront } = SKY.draw;

  // ---------- Diagrams ----------
  const fourForces = (labels = true) => svg(320, 200, `
    ${planeSide(160, 100, 1)}
    ${arrow(165, 92, 165, 22, 'd-lift')}${arrow(160, 108, 160, 180, 'd-weight')}
    ${arrow(224, 102, 296, 102, 'd-thrust')}${arrow(78, 98, 18, 98, 'd-drag')}
    ${labels ? txt(190, 30, 'LIFT', 't-lift d-text') + txt(190, 180, 'WEIGHT', 't-weight d-text') + txt(272, 92, 'THRUST', 't-thrust d-text') + txt(44, 88, 'DRAG', 't-drag d-text') : ''}`,
    'Airplane with four arrows: lift up, weight down, thrust forward, drag back');

  const dragCurve = (() => {
    const k = 0.00216, c = 2700;
    const dp = (x) => k * (x - 40) ** 2, di = (x) => c / (x - 30);
    const pts = (f) => { const a = []; for (let x = 50; x <= 290; x += 6) a.push(`${x},${r(Math.max(14, 165 - f(x)))}`); return a.join(' '); };
    let mx = 50, mv = 1e9;
    for (let x = 50; x <= 290; x++) { const v = dp(x) + di(x); if (v < mv) { mv = v; mx = x; } }
    const my = 165 - mv;
    return svg(320, 200, `
      <line x1="40" y1="168" x2="304" y2="168" class="d-ink" stroke-width="2"/><line x1="40" y1="168" x2="40" y2="14" class="d-ink" stroke-width="2"/>
      ${txt(300, 186, 'AIRSPEED →', 'd-small', 'end')}${txt(12, 20, 'DRAG', 'd-small', 'start')}
      <polyline points="${pts(dp)}" fill="none" class="d-thrust" stroke-width="3" style="fill:none"/>
      <polyline points="${pts(di)}" fill="none" class="d-lift" stroke-width="3" style="fill:none"/>
      <polyline points="${pts((x) => dp(x) + di(x))}" fill="none" class="d-drag" stroke-width="4" style="fill:none"/>
      <line x1="${mx}" y1="${r(my)}" x2="${mx}" y2="168" class="d-muted" stroke-dasharray="4 4" stroke-width="1.5"/>
      <circle cx="${mx}" cy="${r(my)}" r="6" class="d-accent"/>
      ${txt(mx, r(my) - 12, 'L/D MAX (least drag)', 't-accent d-text')}
      ${txt(300, 104, 'Parasite', 't-thrust d-text', 'end')}${txt(255, 144, 'Induced', 't-lift d-text')}${txt(120, 40, 'TOTAL DRAG', 't-drag d-text')}`,
      'Drag curve: parasite drag rises with speed, induced drag falls, total drag is U-shaped with L/D max at the bottom');
  })();

  const vortices = svg(320, 160, `
    ${planeFront(160, 70, 230)}
    ${arcArrow(42, 76, 16, -0.3, 4.2, 'd-brand')}${arcArrow(42, 76, 8, 0.2, 4.6, 'd-brand')}
    ${arcArrow(278, 76, 16, 3.44, -1.06, 'd-brand')}${arcArrow(278, 76, 8, 2.94, -1.46, 'd-brand')}
    ${arrow(120, 92, 120, 130, 'd-muted', 2.5)}${arrow(160, 96, 160, 138, 'd-muted', 2.5)}${arrow(200, 92, 200, 130, 'd-muted', 2.5)}
    ${txt(160, 152, 'Downwash behind the wing', 'd-small')}
    ${txt(160, 22, 'Seen from behind: air spills around the tips', 'd-text')}
    ${txt(42, 112, 'Vortex', 't-brand d-text')}${txt(278, 112, 'Vortex', 't-brand d-text')}`,
    'Front view of an airplane with swirling vortices at each wingtip');

  const wakeLanding = svg(320, 175, `
    <rect x="0" y="142" width="320" height="33" class="d-ground"/>
    <rect x="140" y="139" width="175" height="6" rx="2" class="d-runway"/>
    <line x1="10" y1="40" x2="200" y2="140" class="d-weight" stroke-width="2.5" stroke-dasharray="6 5"/>
    ${[40, 80, 120, 160].map((x) => { const y = 40 + 100 * (x - 10) / 190 + 14; return `<circle cx="${x}" cy="${r(y)}" r="5" class="d-muted" fill="none" stroke-width="2" style="fill:none"/><circle cx="${x + 9}" cy="${r(y + 2)}" r="3" class="d-muted" fill="none" stroke-width="2" style="fill:none"/>`; }).join('')}
    <line x1="10" y1="22" x2="250" y2="140" class="d-lift" stroke-width="3"/>
    <circle cx="200" cy="140" r="5" class="d-weight"/><circle cx="250" cy="140" r="5" class="d-lift"/>
    ${txt(206, 162, 'Jet touches down', 't-weight d-small', 'end')}${txt(238, 162, 'You touch down', 't-lift d-small', 'start')}
    ${txt(60, 26, 'Your path: ABOVE the jet', 't-lift d-text', 'start')}${txt(14, 128, 'Vortices sink below the jet’s path', 'd-small', 'start')}
    ${txt(310, 78, 'Jet’s path (dashed)', 't-weight d-text', 'end')}`,
    'Landing behind a jet: stay above its glide path and touch down past its touchdown point');

  const groundEffect = svg(320, 160, `
    <rect x="0" y="128" width="320" height="32" class="d-ground"/>
    ${planeFront(160, 98, 220)}
    <ellipse cx="44" cy="112" rx="14" ry="6" class="d-brand" fill="none" stroke-width="2" style="fill:none"/>
    <ellipse cx="276" cy="112" rx="14" ry="6" class="d-brand" fill="none" stroke-width="2" style="fill:none"/>
    <line x1="300" y1="98" x2="300" y2="128" class="d-accent" stroke-width="2"/><line x1="294" y1="98" x2="306" y2="98" class="d-accent" stroke-width="2"/><line x1="294" y1="128" x2="306" y2="128" class="d-accent" stroke-width="2"/>
    <line x1="50" y1="56" x2="270" y2="56" class="d-muted" stroke-width="1.5"/><line x1="50" y1="51" x2="50" y2="61" class="d-muted" stroke-width="1.5"/><line x1="270" y1="51" x2="270" y2="61" class="d-muted" stroke-width="1.5"/>
    ${txt(160, 48, '1 wingspan', 'd-small')}${txt(300, 88, 'less than', 't-accent d-small')}${txt(300, 152, 'ground', 'd-small')}
    ${txt(160, 26, 'Ground squashes the vortices → less induced drag', 'd-text')}`,
    'Airplane flying low over the ground, closer than one wingspan, with flattened vortices');

  const axes = (labels = true) => svg(320, 240, `
    ${planeTop(60, 6, 200)}
    <line x1="160" y1="12" x2="160" y2="226" class="d-weight" stroke-width="2.5" stroke-dasharray="7 5"/>
    <line x1="24" y1="104" x2="296" y2="104" class="d-thrust" stroke-width="2.5" stroke-dasharray="7 5"/>
    <circle cx="160" cy="104" r="9" class="d-lift" style="fill:var(--surface)" stroke-width="3"/><circle cx="160" cy="104" r="3" class="d-lift"/>
    ${labels ? txt(168, 22, 'LONGITUDINAL → ROLL', 't-weight d-text', 'start') + txt(304, 82, 'LATERAL → PITCH', 't-thrust d-text', 'end') + txt(150, 138, 'VERTICAL → YAW', 't-lift d-text', 'end') + txt(160, 238, 'All three axes cross at the center of gravity (CG)', 'd-small') : ''}`,
    'Top view of an airplane showing longitudinal, lateral and vertical axes crossing at the CG');

  const stabilityBowls = svg(320, 120, `
    <path d="M10,40 Q55,110 100,40" class="d-ink" fill="none" stroke-width="3" style="fill:none"/><circle cx="55" cy="66" r="9" class="d-accent"/>
    <line x1="115" y1="75" x2="205" y2="75" class="d-ink" stroke-width="3"/><circle cx="160" cy="66" r="9" class="d-accent"/>
    <path d="M220,90 Q265,20 310,90" class="d-ink" fill="none" stroke-width="3" style="fill:none"/><circle cx="265" cy="46" r="9" class="d-accent"/>
    ${txt(55, 102, 'POSITIVE', 't-lift d-text')}${txt(55, 112, 'rolls back', 'd-small')}
    ${txt(160, 102, 'NEUTRAL', 'd-text')}${txt(160, 112, 'stays put', 'd-small')}
    ${txt(265, 102, 'NEGATIVE', 't-weight d-text')}${txt(265, 112, 'keeps going', 'd-small')}`,
    'Marble in a bowl (positive stability), on a flat surface (neutral), on a hill (negative)');

  const tailBalance = svg(320, 180, `
    ${planeSide(160, 95, 1)}
    ${arrow(172, 86, 172, 20, 'd-lift')}${arrow(150, 102, 150, 165, 'd-weight')}${arrow(84, 84, 84, 124, 'd-drag', 3)}
    <circle cx="150" cy="96" r="5" class="d-fill-ink"/>
    ${txt(178, 30, 'Lift (center of lift)', 't-lift d-text', 'start')}${txt(158, 170, 'Weight at the CG', 't-weight d-text', 'start')}
    ${txt(84, 142, 'Tail pushes', 't-drag d-text')}${txt(84, 152, 'DOWN', 't-drag d-text')}`,
    'CG slightly ahead of the center of lift, balanced by a small downward force from the tail');

  const turn = svg(320, 220, `
    ${planeFront(160, 125, 200, 30)}
    <line x1="160" y1="47" x2="205" y2="47" class="d-muted" stroke-dasharray="4 4" stroke-width="1.5"/>
    <line x1="205" y1="47" x2="205" y2="125" class="d-muted" stroke-dasharray="4 4" stroke-width="1.5"/>
    ${arrow(160, 125, 160, 50, 'd-lift', 2.5)}${arrow(160, 125, 202, 125, 'd-accent', 3)}${arrow(160, 125, 203, 52, 'd-lift', 4)}${arrow(160, 128, 160, 200, 'd-weight')}
    ${txt(210, 44, 'TOTAL LIFT', 't-lift d-text', 'start')}${txt(155, 70, 'Vertical lift', 't-lift d-small', 'end')}${txt(155, 79, '(holds you up)', 'd-small', 'end')}
    ${txt(212, 122, 'Horizontal lift', 't-accent d-text', 'start')}${txt(212, 132, '(turns you!)', 'd-small', 'start')}${txt(168, 210, 'WEIGHT', 't-weight d-text', 'start')}
    ${txt(18, 22, 'Rear view · 30° bank to the right', 'd-small', 'start')}`,
    'Rear view of a banked airplane: total lift tilts, splitting into vertical and horizontal parts');

  const loadBars = (() => {
    const data = [['0°', 1.0], ['30°', 1.15], ['45°', 1.41], ['60°', 2.0], ['75°', 3.86]];
    return svg(320, 200, `
      <line x1="24" y1="166" x2="306" y2="166" class="d-ink" stroke-width="2"/>
      <line x1="24" y1="${166 - 3.8 * 36}" x2="306" y2="${166 - 3.8 * 36}" class="d-weight" stroke-dasharray="5 4" stroke-width="1.5"/>
      ${txt(28, 166 - 3.8 * 36 - 5, 'Trainer limit: 3.8 G', 't-weight d-small', 'start')}
      ${data.map(([l, g], i) => { const x = 40 + i * 54, h = g * 36; return `<rect x="${x}" y="${r(166 - h)}" width="38" height="${r(h)}" rx="6" class="${l === '60°' ? 'd-accent' : 'd-brand'}" stroke-width="0"/>` + txt(x + 19, r(160 - h), g.toFixed(2) + ' G', 'd-text') + txt(x + 19, 182, l, 'd-text'); }).join('')}
      ${txt(165, 197, 'BANK ANGLE (level turn)', 'd-small')}`,
      'Bar chart of load factor by bank angle: 0° 1 G, 30° 1.15 G, 45° 1.41 G, 60° 2 G, 75° 3.86 G');
  })();

  const AIRFOIL = 'M0,0 C0,-8 20,-13 45,-12 C70,-11 90,-5 100,0 C80,2 40,4 15,3 C5,3 0,2 0,0 Z';
  const stall = svg(320, 170, `
    <g transform="translate(30,78) rotate(-5)"><path d="${AIRFOIL}" class="d-plane"/></g>
    <path d="M6,50 Q70,36 150,48" class="d-brand" fill="none" stroke-width="2" style="fill:none"/>
    <path d="M6,60 Q70,50 150,60" class="d-brand" fill="none" stroke-width="2" style="fill:none"/>
    <path d="M6,94 Q80,92 150,88" class="d-brand" fill="none" stroke-width="2" style="fill:none"/>
    <g transform="translate(180,96) rotate(-20)"><path d="${AIRFOIL}" class="d-plane"/></g>
    <path d="M166,58 Q190,52 208,62" class="d-brand" fill="none" stroke-width="2" style="fill:none"/>
    ${arcArrow(230, 50, 9, 3.4, 8.6, 'd-weight')}${arcArrow(258, 54, 11, 3.4, 8.6, 'd-weight')}${arcArrow(292, 62, 9, 3.4, 8.6, 'd-weight')}
    <path d="M166,112 Q240,118 314,112" class="d-brand" fill="none" stroke-width="2" style="fill:none"/>
    ${arrow(6, 140, 50, 140, 'd-muted', 2)}${txt(56, 143, 'Relative wind', 'd-small', 'start')}
    ${txt(80, 22, 'LOW ANGLE OF ATTACK', 't-lift d-text')}${txt(80, 33, 'Smooth flow = lots of lift', 'd-small')}
    ${txt(240, 22, 'PAST CRITICAL AoA', 't-weight d-text')}${txt(240, 33, 'Flow separates = STALL', 'd-small')}`,
    'Wing at low angle of attack with smooth airflow compared to a wing at high angle of attack with turbulent separated airflow');

  const pFactor = svg(320, 190, `
    <circle cx="160" cy="105" r="66" class="d-muted" style="fill:var(--surface-2)" stroke-width="2"/>
    <line x1="160" y1="39" x2="160" y2="171" class="d-muted" stroke-dasharray="4 4" stroke-width="1.5"/>
    <rect x="155" y="44" width="10" height="122" rx="5" class="d-fill-ink" opacity=".75"/>
    <circle cx="160" cy="105" r="8" class="d-fill-ink"/>
    ${arcArrow(160, 105, 52, -1.2, 1.2, 'd-accent')}
    <circle cx="122" cy="105" r="6" class="d-thrust" stroke-width="0"/><circle cx="199" cy="105" r="15" class="d-thrust" stroke-width="0"/>
    <circle cx="122" cy="105" r="2" fill="#fff"/><circle cx="199" cy="105" r="5" fill="#fff"/>
    ${txt(48, 100, 'Ascending', 'd-text')}${txt(48, 111, 'blade:', 'd-small')}${txt(48, 120, 'small bite', 'd-small')}
    ${txt(272, 100, 'Descending', 'd-text')}${txt(272, 111, 'blade: BIG bite', 'd-small')}${txt(272, 120, '= more thrust', 'd-small')}
    ${arcArrow(160, 250, 225, -1.3, -1.85, 'd-weight')}${txt(160, 14, '← Nose yaws LEFT', 't-weight d-text')}
    ${txt(160, 186, 'Pilot’s view of the prop, nose high (climb)', 'd-small')}`,
    'Propeller disk seen from the cockpit: the right descending blade makes more thrust than the left, yawing the nose left');

  SKY.registerChapter({
    id: 'ch05',
    badge: { name: 'Aero Ace', emoji: '🦅', desc: 'You mastered the four forces, drag, stalls, turns and left-turning tendencies. That’s real aerodynamics!' },
    game: { engine: 'trim', title: 'Trim Master', blurb: 'Fly a real flight model', missionCount: 5, xpEach: 30 },
    missions: [
      {
        id: 'forces', emoji: '⚖️', title: 'The Four Forces', blurb: 'The tug-of-war behind every flight', minutes: 5, xp: 50,
        phak: 'Chapter 5 → “Forces Acting on the Aircraft” (Thrust, Drag, Lift, Weight)',
        cards: [
          { t: 'talk', html: `<p>Hey cadet! I’m <b>Jax</b>, your <b>CFI</b> — that’s pilot-speak for <i>Certified Flight Instructor</i>.</p><p>Every flight you ever take is a four-way tug-of-war. Learn these four forces and the rest of this chapter clicks into place.</p>` },
          { t: 'diagram', svg: fourForces(true), caption: 'Lift pulls up. Weight pulls down. Thrust pulls forward. Drag pulls back.' },
          { t: 'talk', html: `<ul><li><b style="color:var(--lift)">Lift</b> — made by the wings moving through the air. It acts at a right angle (perpendicular) to the oncoming air, called the <b>relative wind</b>.</li><li><b style="color:var(--weight)">Weight</b> — gravity pulling the airplane toward the center of the Earth. It acts through the <b>center of gravity (CG)</b>.</li><li><b style="color:var(--thrust)">Thrust</b> — the forward push from the propeller or jet engine.</li><li><b style="color:var(--drag)">Drag</b> — the air pushing back, holding you back. It acts parallel to the relative wind.</li></ul>` },
          { t: 'hotspot', title: 'FIND THE FORCES', svg: fourForces(false), spots: [
            { x: 51.5, y: 28, label: 'Lift' }, { x: 50, y: 72, label: 'Weight' }, { x: 81, y: 51, label: 'Thrust' }, { x: 15, y: 49, label: 'Drag' }] },
          { t: 'talk', html: `<p>Here’s the big idea. When the airplane is in <b>steady, unaccelerated flight</b> — not speeding up, slowing down, or changing direction — the forces are <b>balanced</b>. Engineers call this <b>equilibrium</b>.</p><p>In straight-and-level cruise: <b>Lift = Weight</b> and <b>Thrust = Drag</b>.</p><p>Balanced doesn’t mean stopped! A plane cruising at 120 knots with balanced forces just keeps doing exactly that. (Thanks, Newton’s first law.)</p>` },
          { t: 'check', q: 'A Cessna is cruising straight and level at a steady 110 knots. Which is true?',
            choices: ['Thrust is greater than drag — it’s moving forward!', 'Thrust equals drag.', 'Lift is greater than weight.'], answer: 1,
            explain: 'Steady speed means no acceleration, so the forces balance. Thrust only beats drag while you’re <i>speeding up</i>.' },
          { t: 'talk', html: `<p>Pilots also care about how much lift a wing makes for each pound of drag. That’s the <b>lift-to-drag ratio (L/D)</b>.</p><p>A high-performance glider can glide more than <b>50 feet forward</b> for every foot it drops. A Cessna 172 manages about <b>9 to 1</b>. The Space Shuttle glided home at only about <b>4 or 5 to 1</b> — astronauts joked it flew like a brick!</p>` },
          { t: 'fact', html: `<p>A fully loaded Airbus A380 weighs over <b>1.2 million pounds</b> at takeoff. To lift all that, its wings make over 1.2 million pounds of lift. Same four forces as a little Cessna — just bigger numbers.</p>` },
          { t: 'test', html: `<p>The FAA loves this one: <b>“When are the four forces in equilibrium?”</b> → <i>During unaccelerated flight.</i></p><p>And: <b>straight-and-level flight</b> → <i>lift equals weight, and thrust equals drag.</i></p><p>Watch out for wrong answers like “when the aircraft is at rest on the ground.”</p>` }
        ]
      },
      {
        id: 'drag', emoji: '🪂', title: 'Drag: The Air Fights Back', blurb: 'Parasite vs. induced drag', minutes: 6, xp: 50,
        phak: 'Chapter 5 → “Drag” (Parasite Drag, Induced Drag, Lift/Drag Ratio)',
        cards: [
          { t: 'talk', html: `<p>Drag comes in two families, and they behave in <b>opposite</b> ways. Master this and you’ll understand why every airplane has a “sweet spot” speed.</p>` },
          { t: 'talk', html: `<p><b>Family 1: Parasite drag</b> — drag from anything that doesn’t help make lift. There are three kinds:</p><ul><li><b>Form drag</b> — the shape shoving air out of the way. Fat, blunt shapes = more drag. That’s why airplanes are streamlined and wheels get “wheel pants.”</li><li><b>Interference drag</b> — where airflows crash into each other, like where the wing meets the fuselage. Smooth curved covers called <i>fairings</i> help.</li><li><b>Skin friction drag</b> — air rubbing against the surface. Rivet heads, dirt and even squished bugs add to it!</li></ul><p>Parasite drag grows <b>fast</b> as you speed up — about four times as much if you go twice as fast.</p>` },
          { t: 'check', q: 'Squished bugs on the front edge of the wing mostly add which kind of drag?',
            choices: ['Induced drag', 'Interference drag', 'Skin friction drag'], answer: 2,
            explain: 'Anything that makes the surface rough adds skin friction drag. Pilots wipe bugs off the leading edge during preflight!' },
          { t: 'talk', html: `<p><b>Family 2: Induced drag</b> — the price you pay for making lift.</p><p>The air under the wing is at higher pressure than the air on top. Some of it sneaks around the wingtips, forming swirling <b>vortices</b> and tilting the lift slightly backward. That backward part is induced drag.</p><p>It’s biggest when the wing works hardest: <b>slow speed, high angle of attack</b>. As you go faster, induced drag <b>shrinks</b>.</p>` },
          { t: 'diagram', svg: dragCurve, caption: 'Add the two together and you get a U-shaped curve.',
            html: `<p>Slow → induced drag is huge. Fast → parasite drag is huge. At the bottom of the U, total drag is the <b>lowest</b>. That’s <b style="color:var(--accent)">L/D max</b>: the most lift for the least drag. It’s closely tied to your airplane’s <b>best glide speed</b>.</p>` },
          { t: 'check', q: 'As airspeed increases, what happens to induced drag?',
            choices: ['It increases', 'It decreases', 'It stays the same'], answer: 1,
            explain: 'At high speed the wing needs only a small angle of attack, so induced drag gets smaller. Parasite drag is the one that grows with speed.' },
          { t: 'tryit', html: `<p>In a swimming pool, sweep your hand through the water flat like a knife, then with your palm facing forward. Feel the difference? That’s <b>form drag</b>. Water is about 800 times denser than air, so you can really feel it.</p>` },
          { t: 'test', html: `<p>Memory hook: <b>Induced drag is the one that gets smaller as you go faster.</b> Parasite drag gets bigger.</p><p>The FAA may also show you a drag-curve chart and ask where <b>L/D max</b> is. It’s always at the bottom of the total drag curve.</p>` }
        ]
      },
      {
        id: 'vortices', emoji: '🌪️', title: 'Vortices & Ground Effect', blurb: 'Invisible tornadoes and the air cushion', minutes: 7, xp: 50,
        phak: 'Chapter 5 → “Wingtip Vortices” and “Ground Effect” (wake turbulence is also in Ch 14)',
        cards: [
          { t: 'diagram', svg: vortices, caption: 'High-pressure air under the wing curls up around the tips to the low-pressure top.',
            html: `<p>Those swirls are <b>wingtip vortices</b>, like two sideways tornadoes trailing behind every airplane. Together they’re called <b>wake turbulence</b>.</p><p>Key fact: vortices exist <b>only when the wing is making lift</b>. They start when the nose lifts off the runway (rotation) and stop when the wheels touch down.</p>` },
          { t: 'talk', html: `<p>Vortices are strongest when the airplane is <b>Heavy, Clean, and Slow</b>. “Clean” means gear and flaps up. Remember <b>HCS</b>.</p><p>A big jet’s vortices can flip a small plane. They <b>sink</b> slowly below the jet’s flight path and drift with the wind.</p><p>The sneakiest wind is a <b>light quartering tailwind</b>. It can push a jet’s vortices forward into your touchdown zone and keep them hanging around.</p>` },
          { t: 'diagram', svg: wakeLanding, caption: 'Landing behind a big jet: stay above, land beyond.',
            html: `<p><b>Landing behind a big jet:</b> stay <b>above</b> its approach path and land <b>beyond</b> its touchdown point.</p><p><b>Taking off behind a big jet:</b> lift off <b>before</b> its rotation point and climb <b>above</b> its path (or turn upwind).</p>` },
          { t: 'check', q: 'You’re departing right after a heavy jet. How should you avoid its wake?',
            choices: ['Stay below and downwind of its path', 'Stay above and upwind of its path', 'Stay below and upwind of its path'], answer: 1,
            explain: 'Vortices sink and drift downwind, so you want to be above and upwind of them.' },
          { t: 'diagram', svg: groundEffect, caption: 'Ground effect kicks in when you’re within about one wingspan of the ground.',
            html: `<p>Close to the ground, the runway squashes the vortices and downwash. That <b>reduces induced drag</b>, so the plane feels like it’s floating on a cushion of air.</p><p>On landing, too much speed makes you <b>float</b> down the runway. On takeoff, the plane can lift off <b>before</b> it’s really fast enough. Then, climbing out of ground effect, induced drag jumps back and the plane can sink. So don’t force it off the ground early!</p>` },
          { t: 'check', q: 'Ground effect is most likely to cause which problem?',
            choices: ['Becoming airborne before reaching takeoff speed', 'Slamming onto the runway during landing', 'Not being able to lift off at normal speed'], answer: 0,
            explain: 'Less induced drag near the ground means the airplane can get airborne too early, then sink once it climbs out of ground effect.' },
          { t: 'fact', html: `<p>Pelicans and seabirds skim inches above the waves to save energy. That’s ground effect! The Soviets even built a giant ground-effect vehicle nicknamed the <b>“Caspian Sea Monster.”</b> It flew just a few meters above the water.</p>` },
          { t: 'test', html: `<p>Classic FAA questions:</p><ul><li>Vortices are created only when the aircraft is <b>developing lift</b>.</li><li>Strongest when <b>heavy, clean, and slow</b>.</li><li>Vortices <b>sink below</b> the aircraft that made them.</li><li>Landing behind a large aircraft: <b>above its path, land beyond its touchdown point</b>.</li><li>Leaving ground effect: <b>induced drag increases</b> and you need more thrust.</li></ul>` }
        ]
      },
      {
        id: 'axes', emoji: '🎯', title: 'Roll, Pitch & Yaw', blurb: 'The three axes and stability', minutes: 7, xp: 50,
        phak: 'Chapter 5 → “Axes of an Aircraft” and “Aircraft Design Characteristics” (Stability)',
        cards: [
          { t: 'diagram', svg: axes(true), caption: 'Every airplane rotates around three imaginary lines that all cross at the CG.' },
          { t: 'talk', html: `<ul><li><b style="color:var(--weight)">Longitudinal axis</b> runs the <b>long</b> way, nose to tail. Rotating around it is <b>ROLL</b>, controlled by the <b>ailerons</b>. Picture a rotisserie chicken spinning.</li><li><b style="color:var(--thrust)">Lateral axis</b> runs side to side, wingtip to wingtip (like a <i>lateral</i> pass in football). Rotating around it is <b>PITCH</b> (nose up/down), controlled by the <b>elevator</b>. Picture a seesaw.</li><li><b style="color:var(--lift)">Vertical axis</b> goes straight down through the plane. Rotating around it is <b>YAW</b> (nose left/right), controlled by the <b>rudder</b>. Like shaking your head “no.”</li></ul>` },
          { t: 'hotspot', title: 'FIND THE AXIS', svg: axes(false), spots: [
            { x: 50, y: 12, label: 'Longitudinal axis (ROLL)' }, { x: 88, y: 43.3, label: 'Lateral axis (PITCH)' }, { x: 50, y: 43.3, label: 'Vertical axis (YAW) — at the CG' }] },
          { t: 'diagram', svg: stabilityBowls, caption: 'Static stability: what happens right after something bumps you?',
            html: `<p>A <b>stable</b> airplane, when a gust bumps it, wants to go back to where it was, like a marble in a bowl. That first reaction is <b>static stability</b>.</p><p><b>Dynamic stability</b> is what happens over time: do the wobbles get smaller and die out (good!) or get bigger (yikes)?</p>` },
          { t: 'diagram', svg: tailBalance, caption: 'Most airplanes are balanced like a seesaw.',
            html: `<p>Designers put the <b>CG slightly ahead of the center of lift</b>, so the nose naturally wants to drop. The horizontal tail pushes <b>down</b> a little to balance it. That’s <b>longitudinal (pitch) stability</b>.</p><ul><li><b>CG too far forward:</b> very stable but nose-heavy. Harder to raise the nose for landing, and stall speed goes up.</li><li><b>CG too far aft (back):</b> <b>less stable at all speeds</b>, and stalls and spins are harder to recover from. Dangerous!</li></ul><p>That’s why pilots do <b>weight and balance</b> before every flight (Chapter 10).</p>` },
          { t: 'check', q: 'Pulling back on the yoke raises the nose. Which axis is the airplane rotating around?',
            choices: ['Longitudinal', 'Vertical', 'Lateral'], answer: 2,
            explain: 'Nose up/down is pitch, around the lateral (wingtip-to-wingtip) axis, controlled by the elevator.' },
          { t: 'talk', html: `<p>Two more stability tricks:</p><ul><li><b>Dihedral</b> — wings angled up in a slight “V.” If one wing dips, it ends up making a bit more lift, which helps roll the plane back level. High-wing planes also get a <b>keel effect</b>: the heavy fuselage hangs below the wing like a pendulum.</li><li><b>Directional stability</b> — the vertical tail works like feathers on an arrow, keeping the nose pointed into the wind.</li></ul>` },
          { t: 'fact', html: `<p>Fighter jets like the <b>F-16</b> are designed to be slightly <b>unstable</b> on purpose. It makes them incredibly agile. A flight computer makes tiny corrections many times a second so the pilot can fly it. That’s called <b>fly-by-wire</b>.</p>` },
          { t: 'test', html: `<p>Watch the tricky wording! <b>“Longitudinal stability”</b> is about <b>pitch</b>, so it’s controlled by the <b>elevator</b>, even though pitch happens around the <i>lateral</i> axis.</p><ul><li>Longitudinal stability depends on the <b>location of the CG relative to the center of lift</b>.</li><li>Aft CG → <b>less stable at all speeds</b>.</li><li>An inherently stable airplane <b>requires less effort to control</b>.</li></ul>` }
        ]
      },
      {
        id: 'turns', emoji: '🔄', title: 'Turns & Pulling G’s', blurb: 'Load factor and why climbs need thrust', minutes: 7, xp: 50,
        phak: 'Chapter 5 → “Aerodynamic Forces in Flight Maneuvers” and “Load Factors”',
        cards: [
          { t: 'talk', html: `<p>Quick question: what turns an airplane? Most people guess the rudder. <b>Nope!</b></p><p>You <b>bank</b> the wings with the ailerons, which tilts the lift. Now part of the lift points sideways, and that sideways part, the <b>horizontal component of lift</b>, pulls the airplane around the turn.</p>` },
          { t: 'diagram', svg: turn, caption: 'Bank the wings and lift tilts. The horizontal part does the turning.' },
          { t: 'talk', html: `<p>Here’s the catch. With lift tilted, less of it is holding you up. To stay level in a turn, you pull back a little to make <b>more total lift</b>.</p><p>That extra lift is the <b>G-force</b> pushing you into your seat. Pilots call it <b>load factor</b>: how many times its own weight the wing is carrying.</p>` },
          { t: 'diagram', svg: loadBars, caption: 'Load factor in a level turn climbs fast past 45° of bank.',
            html: `<p>In a <b>60° bank you pull 2 G’s</b>. You and the airplane both feel twice as heavy. At 75° it’s almost 4 G’s! Most trainers (the “normal” category) are built for <b>3.8 G</b>.</p>` },
          { t: 'check', q: 'What is the load factor in a 60° banked, level turn?',
            choices: ['1.5 G', '2 G', '3 G'], answer: 1,
            explain: 'In a 60° bank, the wings must carry twice the airplane’s weight to hold altitude.' },
          { t: 'talk', html: `<p>More load means a <b>higher stall speed</b>. In a 60° bank (2 G), stall speed is about <b>41% higher</b>. A plane that normally stalls at 48 knots would stall around <b>68 knots</b>!</p><p>The faster you fly, the more G-load the wing <i>can</i> create. That’s why there’s a <b>maneuvering speed (V<sub>A</sub>)</b>. Below it, the wing will stall before you can overstress the airplane with a big control input or a nasty gust.</p>` },
          { t: 'talk', html: `<p>One more surprise: a steady climb isn’t powered by “extra lift.” It’s powered by <b>extra thrust</b>. Add power, hold a climb attitude, and the extra thrust carries you uphill.</p><p>In a <b>steady</b> climb or descent, the forces are still balanced. The sum of the forward forces equals the sum of the rearward forces. You’ll feel this in the <b>Trim Master</b> sim!</p>` },
          { t: 'fact', html: `<p>Fighter pilots pull up to <b>9 G’s</b>. They wear G-suits that squeeze their legs to keep blood in their brains. Without one, they could “gray out” or even black out!</p>` },
          { t: 'test', html: `<ul><li>What makes an airplane turn? → <b>The horizontal component of lift</b> (not centrifugal force!).</li><li>60° bank level turn → <b>2 G’s</b>.</li><li>Increased load factor → airplane <b>stalls at a higher airspeed</b>.</li><li>Steady descent → <b>forward forces equal rearward forces</b>.</li></ul>` }
        ]
      },
      {
        id: 'stalls', emoji: '⚠️', title: 'Stalls & Spins', blurb: 'When the wing gives up', minutes: 7, xp: 50,
        phak: 'Chapter 5 → “Stalls” and “Spins”',
        cards: [
          { t: 'talk', html: `<p>Plot twist: an airplane stall has <b>nothing to do with the engine</b>. It’s a <b>wing</b> thing.</p><p>Remember <b>angle of attack (AoA)</b>, the angle between the wing’s chord line and the oncoming air (relative wind)? Raise it and you get more lift… up to a point.</p>` },
          { t: 'diagram', svg: stall, caption: 'Past the critical angle of attack, airflow separates from the top of the wing.',
            html: `<p>Past that point, the air can’t follow the curved top of the wing anymore. It breaks away and tumbles, and lift drops off a cliff. That tipping point is the <b>critical angle of attack</b>, usually somewhere around 15–20° for small planes.</p>` },
          { t: 'talk', html: `<p>This is the #1 thing the FAA wants you to know:</p><p style="font-size:19px"><b>A wing can stall at ANY airspeed, in ANY attitude, at ANY power setting, if you exceed the critical angle of attack.</b></p><p>Stall <i>speed</i> changes with weight, G-load and flaps. But the critical <i>angle</i> stays the same, no matter how heavy you are.</p>` },
          { t: 'check', q: 'What actually causes a wing to stall?',
            choices: ['The engine quits', 'Flying with the nose too high', 'Exceeding the critical angle of attack'], answer: 2,
            explain: 'Engine failure doesn’t stall a wing, and you can stall nose-low too (like pulling hard in a dive). It’s all about angle of attack.' },
          { t: 'talk', html: `<p><b>Warning signs:</b> the stall horn, mushy controls, and a shaking called <b>buffet</b>.</p><p><b>Recovery, every time:</b></p><ul><li>1️⃣ <b>Lower the nose</b> to reduce angle of attack. This is the cure!</li><li>2️⃣ Add full power.</li><li>3️⃣ Level the wings and climb away gently.</li></ul><p>Pulling back to “hold the nose up” makes a stall <i>worse</i>.</p>` },
          { t: 'talk', html: `<p>A <b>spin</b> is a stall plus yaw: one wing is <i>more</i> stalled than the other, so the airplane rolls and corkscrews downward. In a spin, <b>both wings are stalled</b>. No stall, no spin!</p><p>Common recovery memory aid, <b>PARE</b>: <b>P</b>ower idle, <b>A</b>ilerons neutral, <b>R</b>udder opposite the spin, <b>E</b>levator forward. Private pilots learn to <i>recognize and avoid</i> spins. Spin training is done only with an instructor in an airplane approved for it.</p>` },
          { t: 'check', q: 'During a spin to the left, which wing(s) are stalled?',
            choices: ['Only the left wing', 'Both wings', 'Neither wing'], answer: 1,
            explain: 'Both wings are stalled in a spin. One is just stalled more deeply than the other, which keeps the rotation going.' },
          { t: 'fact', html: `<p>On many Cessnas, the stall warning isn’t electric. It’s a little <b>reed</b> inside a hole in the wing’s leading edge that whistles when the angle of attack gets high. During preflight, pilots test it by covering the hole with a tissue and gently <b>sucking</b> air through it. 🎵</p>` },
          { t: 'test', html: `<ul><li>A wing can stall <b>at any airspeed and in any flight attitude</b>.</li><li>The critical AoA <b>stays the same regardless of gross weight</b>.</li><li>To spin, an aircraft must first be <b>stalled</b>.</li><li>In a spin, <b>both wings are stalled</b>.</li></ul>` }
        ]
      },
      {
        id: 'leftturn', emoji: '↩️', title: 'Why Planes Want to Go Left', blurb: 'Torque, P-factor & friends', minutes: 6, xp: 50,
        phak: 'Chapter 5 → “Basic Propeller Principles” (Torque and P-Factor, Gyroscopic Action, Corkscrew Effect, Asymmetric Loading)',
        cards: [
          { t: 'talk', html: `<p>Most American airplane engines spin the propeller <b>clockwise</b> as seen from the cockpit. That causes four sneaky effects that all try to turn the plane <b>LEFT</b>.</p><p>That’s why instructors yell “<b>Right rudder!</b>” during takeoff. You’ll hear it a LOT.</p>` },
          { t: 'talk', html: `<ul><li>🔁 <b>Torque reaction</b> — Newton’s third law. The prop spins right, so the airplane wants to roll left.</li><li>🌀 <b>Spiraling slipstream</b> (corkscrew effect) — air behind the prop corkscrews around the fuselage and hits the <b>left side</b> of the tail fin, pushing the nose left.</li><li>🧭 <b>Gyroscopic precession</b> — a spinning prop is a gyroscope. Push on it, and the push shows up 90° later in the direction of rotation. It matters most when the tail rises on takeoff in a tailwheel airplane.</li><li>⚙️ <b>P-factor</b> (asymmetric loading) — when the nose is high, the <b>descending blade on the right</b> takes a bigger bite of air than the rising blade on the left. More thrust on the right yaws the nose left.</li></ul>` },
          { t: 'diagram', svg: pFactor, caption: 'P-factor: at high angle of attack, the right side of the prop pulls harder.' },
          { t: 'check', q: 'When are left-turning tendencies the STRONGEST?',
            choices: ['Low airspeed, high power, high angle of attack', 'High airspeed, low power, low angle of attack', 'Cruising at high speed'], answer: 0,
            explain: 'Takeoff and climb: slow, full power, nose high. That’s when you need the most right rudder.' },
          { t: 'check', q: 'P-factor is caused by…',
            choices: ['The airplane rolling opposite the propeller', 'The descending blade on the right making more thrust than the ascending blade on the left', 'Gyroscopic forces acting 90° ahead'], answer: 1,
            explain: 'At high angles of attack the descending (right) blade meets the air at a bigger angle, so it makes more thrust.' },
          { t: 'fact', html: `<p>Some twin-engine trainers, like the <b>Piper Seminole</b>, have <b>counter-rotating</b> propellers. One spins each way, so the left-turning effects cancel out. Clever!</p>` },
          { t: 'test', html: `<ul><li>Torque effect is greatest at <b>low airspeed, high power, high angle of attack</b>.</li><li>P-factor = <b>the descending blade on the right produces more thrust than the ascending blade on the left</b>.</li></ul><p>Don’t mix up P-factor with gyroscopic precession. Precession is the “90° ahead” one.</p>` }
        ]
      },
      {
        id: 'mach', emoji: '🚀', title: 'Bonus: Breaking the Sound Barrier', blurb: 'High-speed flight', minutes: 4, xp: 50,
        phak: 'Chapter 5 → “High-Speed Flight”',
        cards: [
          { t: 'talk', html: `<p>Time for the fun stuff! The <b>speed of sound</b> is about <b>661 knots (761 mph)</b> at sea level on a standard day. It gets slower in colder air, and up where airliners cruise it’s only about <b>573 knots</b>.</p><p>Your <b>Mach number</b> is your speed divided by the speed of sound. Mach 1 = the speed of sound. Mach 2 = twice as fast.</p>` },
          { t: 'talk', html: `<p>The PHAK splits speed into ranges:</p><ul><li><b>Subsonic</b>: below Mach 0.75</li><li><b>Transonic</b>: Mach 0.75 to 1.20, where some of the air over the wing is already supersonic</li><li><b>Supersonic</b>: Mach 1.20 to 5.00</li><li><b>Hypersonic</b>: above Mach 5</li></ul><p>When air hits supersonic speed it forms <b>shock waves</b>. Airliners use <b>swept-back wings</b> to delay those effects and fly faster efficiently.</p>` },
          { t: 'check', q: 'A Boeing 787 cruising at Mach 0.85 is in which speed range?',
            choices: ['Subsonic', 'Transonic', 'Supersonic'], answer: 1,
            explain: 'Mach 0.75 to 1.20 is transonic. Many airliners cruise in the transonic range!' },
          { t: 'fact', html: `<p>On <b>October 14, 1947</b>, Chuck Yeager became the first pilot to fly faster than sound in level flight, in the rocket-powered <b>Bell X-1</b> “Glamorous Glennis.” He did it with two broken ribs from a horseback riding accident a few days earlier!</p>` },
          { t: 'fact', html: `<p><b>Concorde</b> carried passengers at about <b>Mach 2</b>, crossing the Atlantic in around 3½ hours. Today NASA’s <b>X-59</b> is testing ways to fly supersonic with a soft “thump” instead of a loud sonic boom.</p>` }
        ]
      }
    ],

    quizLength: 12,
    // Write the correct choice first (answer: 0). The app shuffles choices and labels them A/B/C like the FAA test.
    quiz: [
      { q: 'The four aerodynamic forces acting on an airplane during flight are', choices: ['lift, weight, thrust, and drag.', 'power, velocity, gravity, and drag.', 'lift, gravity, power, and friction.'], answer: 0, explain: 'Lift opposes weight; thrust opposes drag.' },
      { q: 'When are the four forces that act on an airplane in equilibrium?', choices: ['During unaccelerated flight.', 'When the aircraft is accelerating.', 'When the aircraft is at rest on the ground.'], answer: 0, explain: 'Equilibrium means no acceleration: steady speed and direction. That includes steady climbs and descents.' },
      { q: 'What is the relationship of lift, drag, thrust, and weight when the airplane is in straight-and-level flight?', choices: ['Lift equals weight and thrust equals drag.', 'Lift, drag, and weight equal thrust.', 'Lift and weight equal thrust and drag.'], answer: 0, explain: 'Opposite forces balance: lift vs. weight, thrust vs. drag.' },
      { q: 'Which is true regarding the forces acting on an aircraft in a steady-state descent?', choices: ['The sum of all forward forces is equal to the sum of all rearward forces.', 'The sum of all upward forces is less than the sum of all downward forces.', 'The sum of all rearward forces is greater than the sum of all forward forces.'], answer: 0, explain: 'Steady means unaccelerated, so the forces are balanced.' },
      { q: 'As airspeed increases in level flight, induced drag', choices: ['decreases.', 'increases.', 'stays the same.'], answer: 0, explain: 'At higher speeds the wing needs less angle of attack, so induced drag shrinks. Parasite drag is the one that grows.' },
      { q: 'Bugs, dirt, and rivet heads on the wing mostly add which type of drag?', choices: ['Skin friction drag.', 'Induced drag.', 'Interference drag.'], answer: 0, explain: 'Rough surfaces increase skin friction drag, a type of parasite drag.' },
      { q: 'The airspeed where total drag is lowest is also where the airplane achieves its', choices: ['maximum lift-to-drag ratio (L/D max).', 'maximum speed.', 'stall speed.'], answer: 0, explain: 'The bottom of the total drag curve is L/D max, closely tied to best glide speed.' },
      { q: 'Wingtip vortices are created only when an aircraft is', choices: ['developing lift.', 'operating at high airspeeds.', 'heavily loaded.'], answer: 0, explain: 'No lift, no vortices. They begin at rotation and end at touchdown.' },
      { q: 'Wingtip vortices created by large aircraft tend to', choices: ['sink below the aircraft generating the turbulence.', 'rise into the traffic pattern.', 'rise into the takeoff or landing path of a crossing runway.'], answer: 0, explain: 'Vortices sink and drift with the wind, leveling off below the flight path.' },
      { q: 'Wingtip vortices are strongest when the generating aircraft is', choices: ['heavy, clean, and slow.', 'light, dirty, and fast.', 'heavy, dirty, and fast.'], answer: 0, explain: 'Remember HCS: Heavy, Clean (gear and flaps up), Slow. The wing is working at a high angle of attack.' },
      { q: 'When landing behind a large aircraft, the pilot should avoid wake turbulence by staying', choices: ['above the large aircraft’s final approach path and landing beyond its touchdown point.', 'below the large aircraft’s final approach path and landing before its touchdown point.', 'above the large aircraft’s final approach path and landing before its touchdown point.'], answer: 0, explain: 'Vortices sink below the jet’s path and stop at its touchdown point. Stay above, land beyond.' },
      { q: 'When departing behind a heavy aircraft, the pilot should avoid wake turbulence by maneuvering the aircraft', choices: ['above and upwind from the heavy aircraft.', 'below and downwind from the heavy aircraft.', 'below and upwind from the heavy aircraft.'], answer: 0, explain: 'Vortices sink and drift downwind, so stay above and upwind.' },
      { q: 'The wind condition that requires maximum caution when avoiding wake turbulence on landing is a', choices: ['light, quartering tailwind.', 'light, quartering headwind.', 'strong headwind.'], answer: 0, explain: 'A light quartering tailwind can push vortices into your touchdown zone and keep them there.' },
      { q: 'What is ground effect?', choices: ['The result of the interference of the surface of the Earth with the airflow patterns about an airplane.', 'The result of an alteration in airflow patterns increasing induced drag about the wings of an airplane.', 'The result of the disruption of the airflow patterns about the wings of an airplane to the point where the wings will no longer support the airplane in flight.'], answer: 0, explain: 'Within about one wingspan of the ground, the surface squashes the vortices and downwash, which reduces induced drag.' },
      { q: 'Ground effect is most likely to result in which problem?', choices: ['Becoming airborne before reaching recommended takeoff speed.', 'Settling to the surface abruptly during landing.', 'Inability to get airborne even though airspeed is sufficient for normal takeoff needs.'], answer: 0, explain: 'Reduced induced drag lets the airplane lift off early, then it may sink after leaving ground effect.' },
      { q: 'An airplane leaving ground effect will', choices: ['experience an increase in induced drag and require more thrust.', 'experience a reduction in ground friction and require a slight power reduction.', 'require a lower angle of attack to maintain the same lift coefficient.'], answer: 0, explain: 'Out of ground effect, induced drag returns to normal, so you need more thrust.' },
      { q: 'About which axis does an airplane pitch (nose up and down)?', choices: ['Lateral axis.', 'Longitudinal axis.', 'Vertical axis.'], answer: 0, explain: 'The lateral axis runs wingtip to wingtip. The elevator controls pitch.' },
      { q: 'Longitudinal stability involves the motion of the airplane controlled by its', choices: ['elevator.', 'rudder.', 'ailerons.'], answer: 0, explain: 'Longitudinal stability is about pitch, which the elevator controls.' },
      { q: 'What determines the longitudinal stability of an airplane?', choices: ['The location of the CG with respect to the center of lift.', 'The effectiveness of the horizontal stabilizer, rudder, and rudder trim tab.', 'The relationship of thrust and lift to weight and drag.'], answer: 0, explain: 'The CG sits ahead of the center of lift, balanced by tail down-force. That’s the key to pitch stability.' },
      { q: 'Loading an airplane to the most aft CG will cause the airplane to be', choices: ['less stable at all speeds.', 'less stable at slow speeds, but more stable at high speeds.', 'less stable at high speeds, but more stable at low speeds.'], answer: 0, explain: 'Aft CG reduces stability at every speed and makes stall/spin recovery harder.' },
      { q: 'An airplane said to be inherently stable will', choices: ['require less effort to control.', 'be difficult to stall.', 'not spin.'], answer: 0, explain: 'A stable airplane tends to return to steady flight by itself, so it’s easier to fly.' },
      { q: 'What force makes an airplane turn?', choices: ['The horizontal component of lift.', 'The vertical component of lift.', 'Centrifugal force.'], answer: 0, explain: 'Banking tilts the lift; its sideways (horizontal) part pulls the airplane around the turn.' },
      { q: 'What is the load factor in a 60° banked, level turn?', choices: ['2 G’s.', '1.5 G’s.', '3 G’s.'], answer: 0, explain: 'At 60° of bank the wings carry twice the airplane’s weight.' },
      { q: 'During an approach to a stall, an increased load factor will cause the airplane to', choices: ['stall at a higher airspeed.', 'have a tendency to spin.', 'be more difficult to control.'], answer: 0, explain: 'More G-load means the wing needs more lift, so it reaches the critical angle of attack at a higher speed.' },
      { q: 'The amount of excess load that can be imposed on an airplane’s wing varies directly with the airplane’s', choices: ['speed.', 'CG.', 'abruptness at which the load is applied.'], answer: 0, explain: 'The faster you go, the more lift (and load) the wing can make before it stalls. That’s why maneuvering speed exists.' },
      { q: 'The angle of attack at which an airplane wing stalls will', choices: ['remain the same regardless of gross weight.', 'increase if the CG is moved forward.', 'change with an increase in gross weight.'], answer: 0, explain: 'Stall SPEED changes with weight, but the critical ANGLE of attack does not.' },
      { q: 'An airplane wing can stall', choices: ['at any airspeed and in any flight attitude.', 'only when the airspeed is too slow.', 'only when the nose is pitched high above the horizon.'], answer: 0, explain: 'Exceed the critical angle of attack and the wing stalls, no matter the speed or attitude.' },
      { q: 'What is the FIRST thing to do when recovering from a stall?', choices: ['Reduce the angle of attack by lowering the nose.', 'Add full power.', 'Pull back on the yoke to stop the descent.'], answer: 0, explain: 'Only reducing the angle of attack un-stalls the wing. Power helps, but comes second.' },
      { q: 'In what flight condition must an aircraft be placed in order to spin?', choices: ['Stalled.', 'Partially stalled with one wing low.', 'In a steep diving spiral.'], answer: 0, explain: 'No stall, no spin. A spin is an aggravated stall with yaw.' },
      { q: 'During a spin to the left, which wing(s) are stalled?', choices: ['Both wings are stalled.', 'Neither wing is stalled.', 'Only the left wing is stalled.'], answer: 0, explain: 'Both are stalled; one is just more deeply stalled than the other.' },
      { q: 'In what flight condition is torque effect the greatest in a single-engine airplane?', choices: ['Low airspeed, high power, high angle of attack.', 'Low airspeed, low power, low angle of attack.', 'High airspeed, high power, high angle of attack.'], answer: 0, explain: 'Think takeoff and climb: slow, full power, nose high. Right rudder!' },
      { q: 'The left turning tendency of an airplane caused by P-factor is the result of the', choices: ['propeller blade descending on the right, producing more thrust than the ascending blade on the left.', 'clockwise rotation of the engine and the propeller turning the airplane counterclockwise.', 'gyroscopic forces applied to the rotating propeller blades acting 90° in advance of the point the force was applied.'], answer: 0, explain: 'The other two choices describe torque and gyroscopic precession.' },
      { q: 'What causes an airplane (except a T-tail) to pitch nosedown when power is reduced and controls are not adjusted?', choices: ['The downwash on the elevators from the propeller slipstream is reduced and elevator effectiveness is reduced.', 'The CG shifts forward when thrust and drag are reduced.', 'When thrust is reduced to less than weight, lift is also reduced and the wings can no longer support the weight.'], answer: 0, explain: 'Less prop wash over the tail means less tail down-force, so the nose drops.' },
      { q: 'An airliner cruising at Mach 0.85 is flying in which speed range?', choices: ['Transonic.', 'Subsonic.', 'Supersonic.'], answer: 0, explain: 'Transonic is Mach 0.75 to 1.20.' }
    ],

    glossary: [
      { term: 'Lift', def: 'The upward force made by the wings. It acts perpendicular to the relative wind.' },
      { term: 'Weight', def: 'Gravity pulling the airplane toward the center of the Earth, acting through the CG.' },
      { term: 'Thrust', def: 'The forward force from the propeller or jet engine.' },
      { term: 'Drag', def: 'The rearward force that resists motion through the air. It acts parallel to the relative wind.' },
      { term: 'Equilibrium', def: 'When opposing forces balance. Happens in steady, unaccelerated flight.' },
      { term: 'Relative wind', def: 'The airflow the wing feels, opposite to the airplane’s flight path.' },
      { term: 'Angle of attack', def: 'The angle between the wing’s chord line and the relative wind.' },
      { term: 'Critical angle of attack', def: 'The angle of attack where the wing stalls. It’s the same at any weight or airspeed.' },
      { term: 'Stall', def: 'A sudden loss of lift when the critical angle of attack is exceeded.' },
      { term: 'Spin', def: 'An aggravated stall with autorotation: the airplane corkscrews down with both wings stalled.' },
      { term: 'Parasite drag', def: 'Drag from anything that doesn’t help make lift: form, interference and skin friction. Increases with speed.' },
      { term: 'Form drag', def: 'Drag caused by an object’s shape pushing air out of the way.' },
      { term: 'Interference drag', def: 'Drag where airflows meet and mix, like where the wing joins the fuselage.' },
      { term: 'Skin friction drag', def: 'Drag from air rubbing against the airplane’s surface.' },
      { term: 'Induced drag', def: 'Drag created as a by-product of making lift. Decreases as airspeed increases.' },
      { term: 'L/D max', def: 'The highest lift-to-drag ratio, found where total drag is lowest. Tied to best glide speed.' },
      { term: 'Wingtip vortices', def: 'Swirling air off the wingtips, caused by high-pressure air under the wing curling up to the low-pressure top.' },
      { term: 'Wake turbulence', def: 'The swirling vortices left behind an aircraft. Strongest behind heavy, clean, slow aircraft.' },
      { term: 'Ground effect', def: 'Reduced induced drag when flying within about one wingspan of the ground.' },
      { term: 'Center of gravity (CG)', def: 'The airplane’s balance point, where all of its weight is considered to act.' },
      { term: 'Longitudinal axis', def: 'The nose-to-tail line. Movement around it is ROLL (ailerons).' },
      { term: 'Lateral axis', def: 'The wingtip-to-wingtip line. Movement around it is PITCH (elevator).' },
      { term: 'Vertical axis', def: 'The top-to-bottom line through the CG. Movement around it is YAW (rudder).' },
      { term: 'Static stability', def: 'The first reaction after a disturbance: return (positive), stay (neutral), or keep going (negative).' },
      { term: 'Dynamic stability', def: 'How the motion behaves over time after a disturbance. Do the oscillations die out?' },
      { term: 'Dihedral', def: 'The upward “V” angle of the wings. Helps keep the airplane level in roll.' },
      { term: 'Load factor', def: 'The total load on the wings divided by the airplane’s weight, measured in G’s.' },
      { term: 'Maneuvering speed (VA)', def: 'The speed below which full, abrupt control movement won’t overstress the airplane.' },
      { term: 'Torque', def: 'The airplane’s tendency to roll left in reaction to the propeller spinning right.' },
      { term: 'P-factor', def: 'Left yaw at high angle of attack because the descending (right) prop blade takes a bigger bite of air.' },
      { term: 'Gyroscopic precession', def: 'A force on a spinning object takes effect 90° later in the direction of rotation.' },
      { term: 'Mach number', def: 'Your speed divided by the speed of sound. Mach 1 is the speed of sound.' }
    ]
  });
})();
