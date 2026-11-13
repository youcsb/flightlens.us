// Chapter 4 — Principles of Flight (PHAK FAA-H-8083-25C)
(() => {
  const { arrow, txt, lines, box, svg, AIRFOIL } = SKY.draw;

  const composition = svg(320, 110, `
    ${txt(160, 18, 'What air is made of', 'd-text')}
    <rect x="10" y="32" width="234" height="36" rx="6" class="d-brand"/>
    <rect x="244" y="32" width="63" height="36" class="d-ok"/>
    <rect x="307" y="32" width="5" height="36" rx="2" class="d-accent"/>
    ${txt(127, 55, 'NITROGEN 78%', 't-white d-text')}${txt(275, 55, 'OXYGEN', 't-white d-small')}${txt(275, 64, '21%', 't-white d-small')}
    <line x1="309" y1="70" x2="300" y2="86" class="d-muted" stroke-width="1"/>${txt(312, 98, '1% other gases (argon, CO₂…)', 'd-small', 'end')}`,
    'Air is about 78 percent nitrogen, 21 percent oxygen and 1 percent other gases');

  const standard = svg(320, 200, `
    <rect x="128" y="20" width="16" height="164" rx="8" class="d-sky" style="stroke:var(--line)"/>
    ${[[184, 'Sea level', '15°C (59°F)', '29.92 inHg'], [102, '5,000 ft', '5°C', '≈24.9 inHg'], [20, '10,000 ft', '−5°C', '≈20.6 inHg']].map(([y, a, t, p]) =>
      `<line x1="120" y1="${y}" x2="152" y2="${y}" class="d-ink" stroke-width="2"/>` + txt(112, y + 4, a, 'd-text', 'end') +
      txt(162, y - 2, t, 't-weight d-text', 'start') + txt(162, y + 11, p, 't-thrust d-small', 'start')).join('')}
    ${txt(250, 70, 'Going up:', 'd-text')}${txt(250, 86, '−2°C per 1,000 ft', 't-weight d-small')}${txt(250, 100, '≈ −1 inHg per 1,000 ft', 't-thrust d-small')}${txt(250, 114, '(near sea level)', 'd-small')}`,
    'Standard atmosphere: sea level 15 degrees C and 29.92 inches of mercury, getting colder and lower pressure with altitude');

  const R = 12, S = 2.1, LE = [60, 105];
  const cosR = Math.cos(R * Math.PI / 180), sinR = Math.sin(R * Math.PI / 180);
  const airfoil = (labels) => svg(320, 200, `
    <g transform="translate(${LE[0]},${LE[1]}) rotate(${-R}) scale(${S})"><path d="${AIRFOIL}" class="d-plane" stroke-width="0.8"/></g>
    <line x1="20" y1="${(LE[1] + 40 * Math.tan(R * Math.PI / 180)).toFixed(1)}" x2="${(LE[0] + 210 * cosR).toFixed(1)}" y2="${(LE[1] - 210 * sinR).toFixed(1)}" class="d-weight" stroke-width="1.8" stroke-dasharray="6 4"/>
    ${arrow(4, 105, 48, 105, 'd-thrust', 3)}
    <path d="M${(60 - 34 * cosR).toFixed(1)},${(105 + 34 * sinR).toFixed(1)} A34,34 0 0 1 26,105" class="d-accent" stroke-width="2.5" style="fill:none"/>
    ${labels ? `
      ${txt(60, 132, 'Leading edge', 'd-text')}${txt(268, 48, 'Trailing edge', 'd-text')}
      ${txt(147, 36, 'Upper camber', 't-brand d-text')}${txt(170, 124, 'Lower camber', 't-brand d-small')}
      ${txt(236, 96, 'Chord line', 't-weight d-text')}
      ${txt(4, 96, 'Relative wind', 't-thrust d-small', 'start')}
      <line x1="40" y1="150" x2="28" y2="112" class="d-muted" stroke-width="1"/>${txt(44, 162, 'Angle of attack (between chord line and relative wind)', 't-accent d-small', 'start')}` : ''}`,
    'Airfoil with leading edge, trailing edge, camber, chord line, relative wind and angle of attack');

  const venturi = svg(320, 130, `
    <path d="M10,20 L100,20 Q160,52 220,52 L310,20" class="d-ink" stroke-width="3" style="fill:none"/>
    <path d="M10,110 L100,110 Q160,78 220,78 L310,110" class="d-ink" stroke-width="3" style="fill:none"/>
    ${arrow(20, 65, 60, 65, 'd-thrust', 3)}${arrow(130, 65, 210, 65, 'd-thrust', 5)}${arrow(262, 65, 302, 65, 'd-thrust', 3)}
    ${txt(55, 46, 'Slower air', 'd-small')}${txt(55, 92, 'higher pressure', 't-weight d-small')}
    ${txt(170, 40, 'FASTER air', 't-thrust d-text')}${txt(170, 98, 'LOWER pressure', 't-weight d-text')}
    ${txt(272, 46, 'Slower again', 'd-small')}`,
    'Venturi tube: air speeds up in the narrow part, and its pressure drops');

  const pressure = svg(320, 150, `
    <g transform="translate(60,80) rotate(-5) scale(2)"><path d="${AIRFOIL}" class="d-plane" stroke-width="0.8"/></g>
    ${[90, 120, 150, 180, 210].map((x, i) => arrow(x, 52 - i * 0, x, 26 - (i < 2 ? 8 : 0), 'd-lift', 2.5)).join('')}
    ${[100, 150, 200].map((x) => arrow(x, 120, x, 96, 'd-lift', 2)).join('')}
    ${txt(160, 14, 'LOW pressure on top pulls up', 't-lift d-text')}
    ${txt(160, 140, 'HIGHER pressure underneath pushes up', 't-lift d-text')}`,
    'Pressure around a wing: low pressure above and higher pressure below both create lift');

  SKY.registerChapter({
    id: 'ch04',
    badge: { name: 'Lift Scientist', emoji: '🔬', desc: 'You understand the atmosphere, density altitude, Newton, Bernoulli and how airfoils make lift.' },
    game: {
      engine: 'sort', title: 'Rapid Sort', blurb: 'Air density, Newton vs. Bernoulli, airfoil parts', xpEach: 30,
      rounds: [
        { id: 'dens', title: 'Thicker or Thinner?', brief: 'Does each change make the air MORE dense (better performance) or LESS dense (worse)?',
          buckets: ['More dense 💪', 'Less dense 😓'],
          items: [
            { t: 'Climbing higher', b: 1 }, { t: 'A hot summer afternoon', b: 1 }, { t: 'A cold winter morning', b: 0 },
            { t: 'Very humid air', b: 1, why: 'Water vapor is lighter than air, so humid air is less dense.' }, { t: 'Dry air', b: 0 },
            { t: 'Higher barometric pressure', b: 0 }, { t: 'A mountain airport', b: 1 }, { t: 'An airport at sea level', b: 0 }] },
        { id: 'law', title: 'Newton or Bernoulli?', brief: 'Which idea explains it?',
          buckets: ['Newton', 'Bernoulli'],
          items: [
            { t: 'The wing pushes air down, so the air pushes the wing up', b: 0 },
            { t: 'Faster air over the curved top has lower pressure', b: 1 },
            { t: 'A cruising plane keeps cruising unless a force changes it', b: 0, why: 'That’s Newton’s first law: inertia.' },
            { t: 'Air speeds up in the narrow part of a tube', b: 1, why: 'That’s the venturi effect.' },
            { t: 'Force = mass × acceleration', b: 0 }, { t: 'The propeller throws air back and the plane moves forward', b: 0 },
            { t: 'A shower curtain gets pulled toward the running water', b: 1 }, { t: 'As air speeds up, its pressure drops', b: 1 }] },
        { id: 'foil', title: 'Airfoil Anatomy', brief: 'Match each description to the airfoil term.',
          buckets: ['Leading edge', 'Trailing edge', 'Chord line', 'Camber', 'Angle of attack'],
          items: [
            { t: 'The rounded front of the wing', b: 0 }, { t: 'The thin back edge of the wing', b: 1 },
            { t: 'Straight line from front edge to back edge', b: 2 }, { t: 'The curve of the wing’s surface', b: 3 },
            { t: 'Angle between the chord line and the relative wind', b: 4 }, { t: 'Where the air first meets the wing', b: 0 },
            { t: 'Where the upper and lower airflow meet again', b: 1 }, { t: 'Exceed its critical value and you stall', b: 4 }] }
      ]
    },
    missions: [
      {
        id: 'atmos', emoji: '🌍', title: 'The Ocean of Air', blurb: 'What air is and how it changes with height', minutes: 5, xp: 50,
        phak: 'Chapter 4 → “Structure of the Atmosphere” and “Atmospheric Pressure”',
        cards: [
          { t: 'talk', html: `<p>Airplanes swim through an ocean too: an ocean of <b>air</b>. Air has weight, and all that air piled above us presses down on everything. At sea level it’s about <b>14.7 pounds on every square inch</b>!</p>` },
          { t: 'diagram', svg: composition, caption: 'You breathe mostly nitrogen. The oxygen is the part your body (and the engine) needs.' },
          { t: 'talk', html: `<p>Because air pressure and temperature change every day, pilots use an agreed-upon “average day” called the <b>standard atmosphere</b>:</p><ul><li>Sea level temperature: <b>15°C (59°F)</b></li><li>Sea level pressure: <b>29.92 inches of mercury (inHg)</b>, also written as <b>1013.2 millibars</b></li></ul>` },
          { t: 'diagram', svg: standard, caption: 'In the standard atmosphere, it gets colder and the pressure drops as you climb.' },
          { t: 'check', q: 'What are the standard temperature and pressure at sea level?',
            choices: ['15°C and 29.92 inHg', '59°C and 1013.2 inHg', '0°C and 30.00 inHg'], answer: 0,
            explain: '15°C (which is 59°F) and 29.92 inHg (1013.2 mb). Watch for trick answers that mix up °C and °F!' },
          { t: 'fact', html: `<p>Mount Everest’s summit (29,032 feet) has only about <b>one-third</b> of sea-level air pressure. Climbers often carry oxygen. Airliners fly even higher, which is why their cabins are pressurized!</p>` },
          { t: 'test', html: `<ul><li>Standard sea level: <b>15°C / 59°F</b> and <b>29.92 inHg / 1013.2 mb</b>.</li><li>Standard lapse rate: temperature drops <b>2°C per 1,000 feet</b>; pressure drops about <b>1 inHg per 1,000 feet</b> in the lower atmosphere.</li></ul>` }
        ]
      },
      {
        id: 'density', emoji: '🥵', title: 'Thin Air: Density Altitude', blurb: 'High, hot and humid = trouble', minutes: 6, xp: 50,
        phak: 'Chapter 4 → “Pressure Altitude,” “Density Altitude,” and “Effect of Pressure, Temperature, and Humidity on Density”',
        cards: [
          { t: 'talk', html: `<p>Airplanes LOVE thick, dense air. Dense air means:</p><ul><li>More air for the wings to grab, so <b>more lift</b>.</li><li>More oxygen for the engine, so <b>more power</b>.</li><li>More air for the propeller to bite, so <b>more thrust</b>.</li></ul>` },
          { t: 'talk', html: `<p>Three things make air <b>less dense</b>:</p><ul><li>⬆️ <b>Altitude</b>: less pressure up high.</li><li>🌡️ <b>Heat</b>: warm air expands and spreads out.</li><li>💧 <b>Humidity</b>: surprise! Water vapor is <i>lighter</i> than air, so moist air is less dense.</li></ul><p>Pilots sum it up as <b>“high, hot and humid”</b>: the worst combo for performance.</p>` },
          { t: 'talk', html: `<p><b>Density altitude</b> is the altitude the airplane “feels like” it’s at. Officially, it’s <b>pressure altitude corrected for nonstandard temperature</b>.</p><p>On a hot day at a mountain airport, your plane might perform as if it were thousands of feet higher: a <b>longer takeoff roll</b>, a <b>weaker climb</b>, and less engine power.</p>` },
          { t: 'check', q: 'Which conditions will HURT takeoff and climb performance the most?',
            choices: ['Low temperature, low humidity, low density altitude', 'High temperature, high humidity, high density altitude', 'High pressure, cold air, dry air'], answer: 1,
            explain: 'High, hot and humid means thin air. Expect a long takeoff roll and a weak climb.' },
          { t: 'fact', html: `<p>Leadville, Colorado has an airport at <b>9,934 feet</b>. On a hot summer afternoon its density altitude can top <b>13,000 feet</b>. Many small planes can barely climb there, so pilots plan carefully and often fly early in the morning when it’s cool.</p>` },
          { t: 'test', html: `<ul><li>High density altitude <b>reduces climb performance</b> (and takeoff performance).</li><li>High humidity <b>decreases</b> performance.</li><li>Density altitude = <b>pressure altitude corrected for nonstandard temperature</b>.</li></ul><p>You’ll calculate density altitude in Chapter 11!</p>` }
        ]
      },
      {
        id: 'newton', emoji: '🍎', title: 'Newton’s Laws of Flight', blurb: 'Three laws that explain motion', minutes: 5, xp: 50,
        phak: 'Chapter 4 → “Newton’s Basic Laws of Motion”',
        cards: [
          { t: 'talk', html: `<p>Sir Isaac Newton figured out three laws of motion in 1687. Every one of them shows up in an airplane:</p><ul><li><b>1st law (inertia)</b>: things keep doing what they’re doing (sitting still or moving in a straight line) unless a force changes them.</li><li><b>2nd law</b>: Force = mass × acceleration. A stronger push gives a bigger change in speed.</li><li><b>3rd law</b>: for every action there is an <b>equal and opposite reaction</b>.</li></ul>` },
          { t: 'talk', html: `<p>The 3rd law is the star:</p><ul><li>The <b>propeller</b> throws air backward, so the airplane is pushed forward.</li><li>The <b>wing</b> is tilted to deflect air <b>downward</b>, so the air pushes the wing <b>upward</b>. That’s lift!</li></ul>` },
          { t: 'check', q: 'A wing deflects air downward, and the air pushes the wing up. Which law is this?',
            choices: ['Newton’s 1st law', 'Newton’s 3rd law', 'Bernoulli’s principle'], answer: 1,
            explain: 'Action (air pushed down) and reaction (wing pushed up). That’s the 3rd law.' },
          { t: 'tryit', html: `<p>Sit on a skateboard (on a flat, safe surface) and throw a heavy ball forward. You roll backward! That’s the same 3rd-law push that moves airplanes and rockets.</p>` },
          { t: 'test', html: `<p>FAA wording: <b>“For every action there is an equal and opposite reaction”</b> is Newton’s third law. It explains part of how lift is made, as air is deflected downward by the wing.</p>` }
        ]
      },
      {
        id: 'bernoulli', emoji: '💨', title: 'Bernoulli & the Venturi', blurb: 'Fast air, low pressure', minutes: 5, xp: 50,
        phak: 'Chapter 4 → “Bernoulli’s Principle of Differential Pressure” and “Airfoil Design”',
        cards: [
          { t: 'talk', html: `<p>Daniel Bernoulli, a Swiss scientist, discovered that <b>when a fluid (like air) speeds up, its pressure drops</b>.</p>` },
          { t: 'diagram', svg: venturi, caption: 'A venturi tube: squeeze the air through a narrow spot and it speeds up and its pressure drops.' },
          { t: 'talk', html: `<p>A wing works a bit like half a venturi. The curved upper surface makes air speed up over the top, so the pressure on top is <b>lower</b> than underneath. The higher pressure below pushes up toward the lower pressure above. More lift!</p><p>Bernoulli and Newton aren’t competing ideas. They’re two ways of describing the <b>same</b> lift.</p>` },
          { t: 'diagram', svg: pressure, caption: 'Most of a wing’s lift comes from the low pressure on top.' },
          { t: 'tryit', html: `<p>Hold a strip of paper just under your bottom lip so it droops down. Blow hard straight across the top. The paper <b>rises</b>! Fast air over the top means lower pressure, just like a wing.</p>` },
          { t: 'check', q: 'Which statement relates to Bernoulli’s principle?',
            choices: ['For every action there is an equal and opposite reaction.', 'Air traveling faster over the curved upper surface of an airfoil causes lower pressure on the top surface.', 'An object at rest stays at rest.'], answer: 1,
            explain: 'Faster air = lower pressure. The other two are Newton’s laws.' },
          { t: 'fact', html: `<p>The engines in many small planes use a <b>venturi</b> inside the carburetor to suck fuel into the air. That pressure drop also cools the air, which can cause <b>carburetor ice</b>. You’ll learn about that in Chapter 7.</p>` }
        ]
      },
      {
        id: 'airfoil', emoji: '📐', title: 'Anatomy of an Airfoil', blurb: 'Chord, camber and angle of attack', minutes: 6, xp: 50,
        phak: 'Chapter 4 → “Airfoil Design,” “Low Pressure Above,” “High Pressure Below,” and “Pressure Distribution”',
        cards: [
          { t: 'diagram', svg: airfoil(true), caption: 'Slice a wing front to back and you get an airfoil.' },
          { t: 'talk', html: `<ul><li><b>Leading edge</b>: the rounded front.</li><li><b>Trailing edge</b>: the thin back.</li><li><b>Chord line</b>: an imaginary straight line from leading edge to trailing edge.</li><li><b>Camber</b>: the curve of the upper and lower surfaces. Most wings curve more on top.</li><li><b>Relative wind</b>: the airflow the wing feels, opposite the direction it’s moving.</li><li><b>Angle of attack</b>: the angle between the <b>chord line</b> and the <b>relative wind</b>.</li></ul>` },
          { t: 'hotspot', title: 'FIND IT ON THE AIRFOIL', svg: airfoil(false), spots: [
            { x: 18.75, y: 52.5, label: 'Leading edge' }, { x: 82.5, y: 31, label: 'Trailing edge' }, { x: 46, y: 28, label: 'Upper camber' },
            { x: 62, y: 40, label: 'Chord line' }, { x: 6, y: 52.5, label: 'Relative wind' }] },
          { t: 'talk', html: `<p>Don’t confuse <b>angle of attack</b> with <b>angle of incidence</b>! Angle of incidence is the fixed angle at which the wing is bolted to the fuselage (chord line vs. the airplane’s longitudinal axis). The pilot can’t change it. Angle of attack changes all the time as you fly.</p><p>Lift always acts <b>perpendicular to the relative wind</b>, not straight up!</p>` },
          { t: 'check', q: 'The angle of attack is the angle between the chord line and the…',
            choices: ['Longitudinal axis', 'Relative wind', 'Horizon'], answer: 1,
            explain: 'Chord line vs. relative wind. Angle of incidence is the one measured against the longitudinal axis.' },
          { t: 'talk', html: `<p>The point where the total lift acts is the <b>center of pressure</b>. In normal flight, as the angle of attack increases, the center of pressure moves <b>forward</b>. As angle of attack decreases, it moves back.</p>` },
          { t: 'test', html: `<ul><li>Angle of attack = <b>chord line vs. relative wind</b>.</li><li>Angle of incidence = <b>chord line vs. longitudinal axis</b>.</li><li>Lift = the force acting <b>perpendicular to the relative wind</b>.</li></ul>` }
        ]
      }
    ],

    quizLength: 12,
    quiz: [
      { q: 'What are the standard temperature and pressure values for sea level?', choices: ['15 °C and 29.92 inches Hg.', '59 °C and 1013.2 millibars.', '59 °F and 29.92 millibars.'], answer: 0, explain: '15°C (59°F) and 29.92 inHg (1013.2 mb).' },
      { q: 'What is the standard temperature lapse rate?', choices: ['2 °C per 1,000 feet.', '3 °C per 1,000 feet.', '1 °F per 1,000 feet.'], answer: 0, explain: 'In the standard atmosphere, temperature drops about 2°C every 1,000 feet.' },
      { q: 'Air is made up of approximately', choices: ['78% nitrogen, 21% oxygen, and 1% other gases.', '78% oxygen, 21% nitrogen, and 1% other gases.', '50% nitrogen and 50% oxygen.'], answer: 0, explain: 'Mostly nitrogen. Oxygen is about one-fifth.' },
      { q: 'What effect, if any, does high humidity have on aircraft performance?', choices: ['It decreases performance.', 'It increases performance.', 'It has no effect on performance.'], answer: 0, explain: 'Humid air is less dense, so performance goes down.' },
      { q: 'Which combination of atmospheric conditions will reduce aircraft takeoff and climb performance?', choices: ['High temperature, high relative humidity, and high density altitude.', 'Low temperature, low relative humidity, and low density altitude.', 'High temperature, low relative humidity, and low density altitude.'], answer: 0, explain: 'High, hot and humid is the worst.' },
      { q: 'What effect does high density altitude have on aircraft performance?', choices: ['It reduces climb performance.', 'It increases engine performance.', 'It increases takeoff performance.'], answer: 0, explain: 'Thin air means less lift, less power and less thrust.' },
      { q: 'Density altitude is', choices: ['pressure altitude corrected for nonstandard temperature.', 'the altitude read directly from the altimeter.', 'the height above the ground.'], answer: 0, explain: 'It’s the altitude the airplane “feels” it is flying at.' },
      { q: 'As air temperature increases, air density', choices: ['decreases.', 'increases.', 'stays the same.'], answer: 0, explain: 'Warm air expands and becomes less dense.' },
      { q: 'Air density is', choices: ['directly proportional to pressure and inversely proportional to temperature.', 'inversely proportional to pressure and directly proportional to temperature.', 'not affected by pressure or temperature.'], answer: 0, explain: 'More pressure = denser. More heat = less dense.' },
      { q: 'Which statement relates to Bernoulli’s principle?', choices: ['Air traveling faster over the curved upper surface of an airfoil causes lower pressure on the top surface.', 'For every action there is an equal and opposite reaction.', 'An additional upward force is generated as the lower surface of the wing deflects air downward.'], answer: 0, explain: 'Bernoulli: faster flow, lower pressure.' },
      { q: '“For every action there is an equal and opposite reaction” is', choices: ['Newton’s third law of motion.', 'Newton’s first law of motion.', 'Bernoulli’s principle.'], answer: 0, explain: 'The 3rd law explains thrust and part of lift.' },
      { q: 'The angle of attack is the angle between the', choices: ['chord line of the wing and the relative wind.', 'longitudinal axis and the relative wind.', 'chord line of the wing and the longitudinal axis.'], answer: 0, explain: 'The third choice describes the angle of incidence.' },
      { q: 'The angle of incidence is the angle between the', choices: ['wing chord line and the longitudinal axis of the airplane.', 'wing chord line and the relative wind.', 'relative wind and the horizon.'], answer: 0, explain: 'It’s fixed by the designer; the pilot can’t change it.' },
      { q: 'Lift on a wing is most properly defined as the', choices: ['force acting perpendicular to the relative wind.', 'differential pressure acting perpendicular to the chord of the wing.', 'reduced pressure resulting from laminar flow over the upper camber of an airfoil, which acts perpendicular to the mean camber.'], answer: 0, explain: 'Lift is measured perpendicular to the relative wind.' },
      { q: 'The curvature of an airfoil’s upper and lower surfaces is called', choices: ['camber.', 'chord.', 'incidence.'], answer: 0, explain: 'Camber = curve. Most wings have more camber on top.' },
      { q: 'In the normal flight range, as the angle of attack increases, the center of pressure', choices: ['moves forward.', 'moves aft.', 'does not move.'], answer: 0, explain: 'Higher angle of attack moves the center of pressure forward.' },
      { q: 'Why does a wing produce lower pressure on its upper surface?', choices: ['Air flowing over the curved upper surface speeds up, which lowers its pressure.', 'The upper surface is heated by the sun.', 'Air molecules are heavier above the wing.'], answer: 0, explain: 'Faster flow over the top means lower pressure (Bernoulli).' },
      { q: 'Water vapor makes air less dense because', choices: ['water vapor molecules are lighter than the nitrogen and oxygen they replace.', 'humid air is always colder.', 'water vapor increases air pressure.'], answer: 0, explain: 'H₂O is lighter than N₂ and O₂, so moist air weighs less per cubic foot.' }
    ],

    glossary: [
      { term: 'Atmosphere', def: 'The envelope of air around Earth: about 78% nitrogen, 21% oxygen, 1% other gases.' },
      { term: 'Standard atmosphere', def: 'An agreed-upon “average day”: 15°C and 29.92 inHg at sea level.' },
      { term: 'Lapse rate', def: 'How fast temperature drops with altitude. Standard is 2°C per 1,000 feet.' },
      { term: 'inHg', def: 'Inches of mercury: a unit of air pressure. Standard sea level is 29.92.' },
      { term: 'Air density', def: 'How much air is packed into a space. Higher, hotter or more humid air is less dense.' },
      { term: 'Pressure altitude', def: 'The altitude shown when the altimeter is set to 29.92.' },
      { term: 'Density altitude', def: 'Pressure altitude corrected for nonstandard temperature: the altitude the airplane “feels.”' },
      { term: 'Newton’s 3rd law', def: 'For every action there is an equal and opposite reaction.' },
      { term: 'Bernoulli’s principle', def: 'As the speed of a fluid increases, its pressure decreases.' },
      { term: 'Venturi', def: 'A narrowing tube where air speeds up and its pressure drops.' },
      { term: 'Airfoil', def: 'A shape designed to make lift as air flows around it, like a wing.' },
      { term: 'Leading edge', def: 'The front edge of an airfoil.' },
      { term: 'Trailing edge', def: 'The back edge of an airfoil.' },
      { term: 'Chord line', def: 'An imaginary straight line from the leading edge to the trailing edge.' },
      { term: 'Camber', def: 'The curvature of an airfoil’s surfaces.' },
      { term: 'Relative wind', def: 'The airflow the wing feels, opposite to its flight path.' },
      { term: 'Angle of attack', def: 'The angle between the chord line and the relative wind.' },
      { term: 'Angle of incidence', def: 'The fixed angle between the wing’s chord line and the airplane’s longitudinal axis.' },
      { term: 'Center of pressure', def: 'The point where the total lift force acts on the wing.' }
    ]
  });
})();
