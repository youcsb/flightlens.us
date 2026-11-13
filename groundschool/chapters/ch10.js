// Chapter 10 — Weight and Balance (PHAK FAA-H-8083-25C)
(() => {
  const { arrow, txt, lines, box, svg } = SKY.draw;

  const weightBar = svg(320, 120, `
    <rect x="10" y="34" width="170" height="36" rx="6" class="d-muted"/>
    <rect x="180" y="34" width="130" height="36" rx="6" class="d-ok"/>
    ${txt(95, 56, 'EMPTY WEIGHT', 't-white d-text')}${txt(245, 56, 'USEFUL LOAD', 't-white d-text')}
    ${lines(95, 86, ['airframe, engine, equipment,', 'unusable fuel, oil'], 'd-small', 'middle', 10)}
    ${lines(245, 86, ['pilot, passengers, baggage,', 'usable fuel'], 'd-small', 'middle', 10)}
    <line x1="10" y1="22" x2="310" y2="22" class="d-weight" stroke-width="2"/><line x1="10" y1="16" x2="10" y2="28" class="d-weight" stroke-width="2"/><line x1="310" y1="16" x2="310" y2="28" class="d-weight" stroke-width="2"/>
    ${txt(160, 14, 'MAXIMUM WEIGHT (never exceed!)', 't-weight d-text')}`,
    'Empty weight plus useful load must not exceed maximum weight');

  const beam = svg(320, 180, `
    <line x1="20" y1="110" x2="306" y2="110" class="d-ink" stroke-width="4" stroke-linecap="round"/>
    <line x1="20" y1="90" x2="20" y2="160" class="d-accent" stroke-width="3"/>${txt(22, 174, 'DATUM (0")', 't-accent d-small', 'start')}
    ${[[37, 'Pilot', '170 lb'], [74, 'Rear seat', '120 lb'], [48, 'Fuel', '180 lb'], [95, 'Bags', '40 lb']].map(([a, n, w], i) => {
      const x = 20 + a * 2.7;
      return `<rect x="${x - 18}" y="${70 - (i % 2) * 34}" width="36" height="28" rx="5" class="d-brand"/>` + txt(x, 82 - (i % 2) * 34, n, 't-white d-small') + txt(x, 92 - (i % 2) * 34, w, 't-white d-small') +
        `<line x1="${x}" y1="${98 - (i % 2) * 34}" x2="${x}" y2="110" class="d-brand" stroke-width="2"/>` + txt(x, 126, a + '"', 'd-small');
    }).join('')}
    <polygon points="${20 + 54 * 2.7},112 ${20 + 54 * 2.7 - 10},132 ${20 + 54 * 2.7 + 10},132" class="d-weight"/>${txt(20 + 54 * 2.7, 146, 'CG', 't-weight d-text')}
    ${arrow(20, 156, 20 + 37 * 2.7 - 2, 156, 'd-accent', 1.5)}${txt(70, 152, 'arm', 't-accent d-small')}
    ${txt(160, 14, 'Moment = Weight × Arm', 'd-text')}`,
    'Weights placed along a beam at different arms from the datum; the center of gravity is the balance point');

  SKY.registerChapter({
    id: 'ch10',
    badge: { name: 'Balance Master', emoji: '⚖️', desc: 'You can load an airplane safely and calculate its center of gravity.' },
    game: {
      engine: 'sort', title: 'Rapid Sort', blurb: 'Weight terms and CG effects', xpEach: 30,
      rounds: [
        { id: 'load', title: 'Empty Weight or Useful Load?', brief: 'Is it part of the empty weight, or the useful load?',
          buckets: ['Empty weight', 'Useful load'],
          items: [
            { t: 'The airframe', b: 0 }, { t: 'The engine', b: 0 }, { t: 'Unusable fuel', b: 0 }, { t: 'Installed radios', b: 0 },
            { t: 'The pilot', b: 1 }, { t: 'Passengers', b: 1 }, { t: 'Baggage', b: 1 }, { t: 'Usable fuel', b: 1 }] },
        { id: 'cg', title: 'Forward or Aft CG?', brief: 'Which CG location causes this?',
          buckets: ['Forward CG', 'Aft CG'],
          items: [
            { t: 'Higher stall speed', b: 0 }, { t: 'Lower stall speed', b: 1 }, { t: 'Harder to raise the nose for landing', b: 0 },
            { t: 'Less stable at all speeds', b: 1 }, { t: 'Slower cruise speed', b: 0 }, { t: 'Faster cruise speed', b: 1 },
            { t: 'Harder to recover from a stall or spin', b: 1 }, { t: 'More stable', b: 0 }] },
        { id: 'words', title: 'Weight & Balance Words', brief: 'Match the term.',
          buckets: ['Datum', 'Arm', 'Moment', 'CG'],
          items: [
            { t: 'The reference point all measurements start from', b: 0 }, { t: 'Distance from the reference point', b: 1 },
            { t: 'Weight × arm', b: 2 }, { t: 'Total moment ÷ total weight', b: 3 }, { t: 'The airplane’s balance point', b: 3 },
            { t: 'Measured in pound-inches', b: 2 }, { t: 'Measured in inches', b: 1 }, { t: 'Often the firewall or nose', b: 0 }] }
      ]
    },
    missions: [
      {
        id: 'why', emoji: '🏋️', title: 'Why Weight Matters', blurb: 'What happens when you overload', minutes: 5, xp: 50,
        phak: 'Chapter 10 → “Weight Control” and “Effects of Weight”',
        cards: [
          { t: 'talk', html: `<p>Every airplane has a <b>maximum weight</b> it’s certified for. Go over it and the airplane may not perform the way the POH promises. It could even break.</p><p>And it’s not just <i>how much</i> weight but <i>where</i> it goes. That’s the “balance” part.</p>` },
          { t: 'talk', html: `<p>An overweight airplane has:</p><ul><li>A higher takeoff speed and a <b>longer takeoff run</b>.</li><li>A <b>slower, weaker climb</b>.</li><li>A lower maximum altitude, shorter range and slower cruise.</li><li>A <b>higher stall speed</b>.</li><li>A faster approach and <b>longer landing roll</b>.</li><li>Extra stress on the structure and the nosewheel.</li></ul>` },
          { t: 'check', q: 'You load a plane over its maximum weight. What happens to its stall speed?',
            choices: ['It goes down', 'It goes up', 'It doesn’t change'], answer: 1,
            explain: 'More weight needs more lift, so the wing reaches its critical angle of attack at a higher speed.' },
          { t: 'fact', html: `<p>Bush pilots in Alaska fly into short, rough strips. Weighing every bag isn’t just a rule there. It decides whether you clear the trees at the end of the strip!</p>` },
          { t: 'test', html: `<p>Weight-and-balance problems are a big part of the FAA knowledge test. They often use loading graphs from the testing supplement, but the math is always <b>weight × arm = moment</b>.</p>` }
        ]
      },
      {
        id: 'terms', emoji: '📝', title: 'Weight Words', blurb: 'Empty weight, useful load and more', minutes: 5, xp: 50,
        phak: 'Chapter 10 → “Weight and Balance Terms”',
        cards: [
          { t: 'diagram', svg: weightBar, caption: 'Empty weight + useful load ≤ maximum weight.' },
          { t: 'talk', html: `<ul><li><b>Basic empty weight</b>: the airframe, engine, fixed equipment, <b>unusable fuel</b> and full oil (and other operating fluids).</li><li><b>Useful load</b>: everything you add: pilot, passengers, baggage and <b>usable fuel</b>.</li><li><b>Payload</b>: just the people and cargo.</li><li><b>Maximum takeoff weight</b>: the most it can weigh at the start of the takeoff roll.</li><li><b>Maximum landing weight</b>: the most it can weigh at touchdown.</li></ul>` },
          { t: 'talk', html: `<p>Numbers to memorize:</p><ul><li>Avgas: <b>6 pounds per gallon</b>.</li><li>Oil: <b>7.5 pounds per gallon</b>.</li><li>Jet A: about 6.7 pounds per gallon.</li></ul>` },
          { t: 'check', q: 'An airplane is 90 pounds over its maximum weight. How many gallons of avgas must be drained?',
            choices: ['10 gallons', '12 gallons', '15 gallons'], answer: 2,
            explain: '90 lb ÷ 6 lb per gallon = 15 gallons.' },
          { t: 'test', html: `<p>Older FAA questions say <b>empty weight includes unusable fuel and undrainable oil</b>. Newer “basic empty weight” includes full oil. Either way: unusable fuel is part of empty weight.</p>` }
        ]
      },
      {
        id: 'cg', emoji: '🎯', title: 'Arm, Moment & CG', blurb: 'Finding the balance point', minutes: 6, xp: 50,
        phak: 'Chapter 10 → “Principles of Weight and Balance Computations”',
        cards: [
          { t: 'talk', html: `<p>Think of an airplane as a seesaw. To figure out where it balances, measure everything from one fixed spot called the <b>datum</b>, usually the firewall or the tip of the nose.</p><ul><li><b>Arm</b>: how far something is from the datum, in inches. Positive if it’s behind the datum.</li><li><b>Moment</b>: <b>weight × arm</b>, in pound-inches. It’s how hard that weight “twists” the seesaw.</li><li><b>Center of gravity (CG)</b>: the balance point. <b>CG = total moment ÷ total weight</b>.</li></ul>` },
          { t: 'diagram', svg: beam, caption: 'Each weight has an arm. Together they set the balance point.' },
          { t: 'check', q: 'A 170 lb pilot sits at an arm of 37 inches. What’s the moment?',
            choices: ['207 lb-in', '6,290 lb-in', '4,600 lb-in'], answer: 1,
            explain: '170 × 37 = 6,290 pound-inches.' },
          { t: 'talk', html: `<p>The POH gives a <b>CG range</b> (the “envelope”): the CG must stay between a forward limit and an aft limit at every weight. The CG also <b>moves as you burn fuel</b>, so check it for both takeoff and landing.</p>` },
          { t: 'tryit', html: `<p>Balance a ruler on your finger. Now put a coin near one end. Where’s the new balance point? Move the coin closer to the middle and watch the balance point shift. That’s CG in action!</p>` }
        ]
      },
      {
        id: 'compute', emoji: '🧮', title: 'Doing the Math', blurb: 'A real weight-and-balance problem', minutes: 7, xp: 50,
        phak: 'Chapter 10 → “Weight and Balance Restrictions” and “Determining Loaded Weight and CG” (Computational Method)',
        cards: [
          { t: 'talk', html: `<p>Here’s the computational method, step by step:</p><ul><li>1️⃣ List every item with its <b>weight</b> and <b>arm</b>.</li><li>2️⃣ Multiply to get each <b>moment</b>.</li><li>3️⃣ Add up all the weights and all the moments.</li><li>4️⃣ <b>CG = total moment ÷ total weight</b>.</li><li>5️⃣ Check that the weight is under the max and the CG is inside the limits.</li></ul>` },
          { t: 'talk', html: `<p>Example:</p><ul><li>Empty airplane: 1,400 lb × 39" = 54,600</li><li>Front seats: 340 lb × 37" = 12,580</li><li>Fuel (30 gal): 180 lb × 48" = 8,640</li><li>Baggage: 80 lb × 95" = 7,600</li></ul><p><b>Total weight = 2,000 lb. Total moment = 83,420 lb-in.</b></p>` },
          { t: 'check', q: 'Using those totals (2,000 lb and 83,420 lb-in), where is the CG?',
            choices: ['39.0 inches', '41.7 inches', '43.4 inches'], answer: 1,
            explain: '83,420 ÷ 2,000 = 41.71 inches aft of the datum.' },
          { t: 'check', q: 'Fuel is 6 lb/gal. How much do 30 gallons weigh?',
            choices: ['180 lb', '150 lb', '225 lb'], answer: 0,
            explain: '30 × 6 = 180 pounds.' },
          { t: 'fact', html: `<p>Airline load planners do this same math for every single flight: passengers, bags, cargo and fuel. Sometimes they ask passengers to change seats to fix the balance!</p>` }
        ]
      },
      {
        id: 'shift', emoji: '↔️', title: 'Moving Weight Around', blurb: 'Forward vs. aft CG', minutes: 6, xp: 50,
        phak: 'Chapter 10 → “Effects of Weight on Balance” and “Weight-Shift Computations”',
        cards: [
          { t: 'talk', html: `<p><b>Forward CG</b> (nose-heavy):</p><ul><li>More stable, but the tail has to push down harder, which adds drag.</li><li><b>Higher stall speed</b> and <b>slower cruise</b>.</li><li>Harder to raise the nose for takeoff and landing.</li></ul><p><b>Aft CG</b> (tail-heavy):</p><ul><li><b>Less stable at all speeds</b>.</li><li>Lower stall speed and slightly faster cruise, but…</li><li><b>Much harder to recover from stalls and spins</b>. Dangerous!</li></ul>` },
          { t: 'talk', html: `<p>Shortcut for moving weight inside the airplane:</p><p style="text-align:center"><b>Change in CG = (weight moved × distance moved) ÷ total weight</b></p><p>Example: a 2,500 lb airplane, CG at 45". Move a 50 lb bag forward 50 inches. Change = 50 × 50 ÷ 2,500 = <b>1 inch forward</b>, so the new CG is 44".</p>` },
          { t: 'check', q: 'A 2,000 lb plane has its CG at 40". It burns 120 lb of fuel from tanks at 48". What’s the new CG?',
            choices: ['About 39.5"', 'About 40.5"', 'About 41.0"'], answer: 0,
            explain: 'New moment = 80,000 − (120 × 48 = 5,760) = 74,240. New weight = 1,880. 74,240 ÷ 1,880 ≈ 39.5". Burning fuel from behind the CG moves the CG forward.' },
          { t: 'check', q: 'Which CG location makes stall and spin recovery harder?',
            choices: ['Forward CG', 'Aft CG', 'It doesn’t matter'], answer: 1,
            explain: 'An aft CG gives the tail less leverage to lower the nose.' },
          { t: 'test', html: `<ul><li>Aft CG → <b>less stable at all speeds</b>.</li><li>Draining fuel to get under max weight: divide pounds over by <b>6</b> and round up.</li></ul>` }
        ]
      }
    ],

    quizLength: 12,
    quiz: [
      { q: 'Which items are included in the empty weight of an aircraft?', choices: ['Unusable fuel and undrainable oil.', 'Only the airframe, powerplant, and optional equipment.', 'Full fuel tanks and engine oil to capacity.'], answer: 0, explain: 'Unusable fuel is always part of empty weight.' },
      { q: 'If an aircraft is loaded 90 pounds over maximum certificated gross weight and fuel (gasoline) is drained to bring the aircraft weight within limits, how much fuel should be drained?', choices: ['15 gallons.', '10 gallons.', '12 gallons.'], answer: 0, explain: '90 ÷ 6 = 15 gallons.' },
      { q: 'An aircraft is loaded 110 pounds over maximum certificated gross weight. If fuel (gasoline) is drained to bring the aircraft weight within limits, how much fuel should be drained?', choices: ['18.4 gallons.', '15.7 gallons.', '16.2 gallons.'], answer: 0, explain: '110 ÷ 6 = 18.33, so drain at least 18.4 gallons.' },
      { q: 'The useful load of an airplane includes', choices: ['the pilot, passengers, baggage, and usable fuel.', 'the airframe and engine.', 'unusable fuel and full oil.'], answer: 0, explain: 'Useful load is everything you add to the empty airplane.' },
      { q: 'Moment is calculated by', choices: ['multiplying weight by arm.', 'dividing weight by arm.', 'adding weight and arm.'], answer: 0, explain: 'Moment = weight × arm.' },
      { q: 'The center of gravity is found by', choices: ['dividing the total moment by the total weight.', 'dividing the total weight by the total moment.', 'multiplying the total weight by the total arm.'], answer: 0, explain: 'CG = total moment ÷ total weight.' },
      { q: 'The arm is the', choices: ['horizontal distance from the datum to an item’s CG.', 'weight of an item multiplied by its distance.', 'vertical height of an item above the ground.'], answer: 0, explain: 'Arm is a distance, in inches, from the datum.' },
      { q: 'The datum is', choices: ['an imaginary vertical plane from which all horizontal measurements are taken.', 'the maximum weight of the airplane.', 'the point where the wing attaches to the fuselage.'], answer: 0, explain: 'The manufacturer picks the datum, often the firewall or nose.' },
      { q: 'An airplane weighs 2,000 lb with total moment 83,420 lb-in. Where is the CG?', choices: ['41.7 inches aft of datum.', '39.0 inches aft of datum.', '43.4 inches aft of datum.'], answer: 0, explain: '83,420 ÷ 2,000 = 41.71.' },
      { q: 'An airplane weighs 2,500 lb with its CG at 45 inches. If 50 lb of baggage is moved from an arm of 100 inches to 50 inches, the new CG is', choices: ['44.0 inches.', '46.0 inches.', '45.5 inches.'], answer: 0, explain: '50 × 50 ÷ 2,500 = 1 inch forward.' },
      { q: 'An airplane weighs 2,200 lb with its CG at 40.0 inches. 50 lb of baggage is added at 100 inches. The new CG is about', choices: ['41.3 inches.', '40.0 inches.', '42.5 inches.'], answer: 0, explain: '(88,000 + 5,000) ÷ 2,250 = 41.33 inches.' },
      { q: 'What happens when an airplane is loaded with the CG forward of the forward limit?', choices: ['It becomes nose-heavy and harder to raise the nose for takeoff and landing; stall speed increases.', 'It becomes less stable at all speeds.', 'Stall speed decreases.'], answer: 0, explain: 'Forward CG = nose-heavy, higher stall speed, slower cruise.' },
      { q: 'Loading an airplane to the most aft CG will cause the airplane to be', choices: ['less stable at all speeds.', 'less stable at slow speeds, but more stable at high speeds.', 'less stable at high speeds, but more stable at low speeds.'], answer: 0, explain: 'Aft CG reduces stability everywhere.' },
      { q: 'Which is an effect of operating an airplane above its maximum weight?', choices: ['Longer takeoff run and reduced rate of climb.', 'Lower stall speed.', 'Shorter landing roll.'], answer: 0, explain: 'Overweight hurts nearly every kind of performance.' },
      { q: 'Aviation gasoline weighs about', choices: ['6 pounds per gallon.', '7.5 pounds per gallon.', '8 pounds per gallon.'], answer: 0, explain: 'Avgas = 6 lb/gal. Oil = 7.5 lb/gal.' },
      { q: 'As fuel is burned from tanks located behind the CG, the CG', choices: ['moves forward.', 'moves aft.', 'does not move.'], answer: 0, explain: 'Removing weight behind the CG shifts the balance point forward.' }
    ],

    glossary: [
      { term: 'Maximum weight', def: 'The most the airplane is allowed to weigh.' },
      { term: 'Basic empty weight', def: 'Airframe, engine, fixed equipment, unusable fuel and full operating fluids, including oil.' },
      { term: 'Useful load', def: 'Pilot, passengers, baggage and usable fuel.' },
      { term: 'Payload', def: 'Passengers and cargo only.' },
      { term: 'Unusable fuel', def: 'Fuel that can’t be safely used in flight. Part of empty weight.' },
      { term: 'Datum', def: 'The reference point from which all arms are measured.' },
      { term: 'Arm', def: 'Horizontal distance in inches from the datum. Aft is positive.' },
      { term: 'Moment', def: 'Weight × arm, in pound-inches.' },
      { term: 'Center of gravity (CG)', def: 'The balance point: total moment ÷ total weight.' },
      { term: 'CG range / envelope', def: 'The forward and aft limits the CG must stay between.' },
      { term: 'Forward CG', def: 'Nose-heavy: more stable, higher stall speed, slower cruise.' },
      { term: 'Aft CG', def: 'Tail-heavy: less stable, harder stall and spin recovery.' },
      { term: 'Weight shift formula', def: 'Change in CG = weight moved × distance moved ÷ total weight.' },
      { term: 'Avgas weight', def: '6 pounds per gallon.' },
      { term: 'Oil weight', def: '7.5 pounds per gallon.' }
    ]
  });
})();
