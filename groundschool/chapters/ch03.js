// Chapter 3 — Aircraft Construction (PHAK FAA-H-8083-25C)
(() => {
  const { arrow, txt, lines, box, svg, planeSide } = SKY.draw;

  const gear = `<line x1="180" y1="102" x2="184" y2="124" class="d-ink" stroke-width="3"/><circle cx="184" cy="130" r="7" class="d-fill-ink"/>
    <line x1="230" y1="104" x2="233" y2="122" class="d-ink" stroke-width="3"/><circle cx="234" cy="128" r="6" class="d-fill-ink"/>`;
  const bigPlane = `${gear}${planeSide(160, 95, 1.4)}`;
  const parts = (labels) => svg(320, 200, `
    <line x1="10" y1="137" x2="310" y2="137" class="d-muted" stroke-width="1.5"/>
    ${bigPlane}
    ${labels ? `
      <line x1="178" y1="58" x2="178" y2="78" class="d-muted" stroke-width="1.5"/>${txt(178, 52, 'WINGS', 't-brand d-text')}
      <line x1="112" y1="160" x2="120" y2="98" class="d-muted" stroke-width="1.5"/>${txt(112, 172, 'FUSELAGE', 't-brand d-text')}
      <line x1="54" y1="40" x2="55" y2="58" class="d-muted" stroke-width="1.5"/>${txt(54, 34, 'EMPENNAGE (TAIL)', 't-brand d-text')}
      <line x1="282" y1="64" x2="250" y2="86" class="d-muted" stroke-width="1.5"/>${txt(282, 58, 'POWERPLANT', 't-brand d-text')}
      <line x1="208" y1="160" x2="188" y2="138" class="d-muted" stroke-width="1.5"/>${txt(216, 172, 'LANDING GEAR', 't-brand d-text')}` : ''}`,
    'Airplane with its five major parts: fuselage, wings, empennage, landing gear and powerplant');

  const fuselageTypes = svg(320, 140, `
    <rect x="8" y="30" width="92" height="56" class="d-ink" style="fill:none" stroke-width="2.5"/>
    ${[0, 1, 2, 3, 4].map((i) => `<line x1="${8 + i * 23}" y1="30" x2="${8 + i * 23}" y2="86" class="d-ink" stroke-width="2"/>`).join('')}
    ${[0, 1, 2, 3].map((i) => `<line x1="${8 + i * 23}" y1="${i % 2 ? 30 : 86}" x2="${31 + i * 23}" y2="${i % 2 ? 86 : 30}" class="d-brand" stroke-width="2"/>`).join('')}
    <rect x="114" y="30" width="92" height="56" rx="28" class="d-box" stroke-width="2.5" style="stroke:var(--ink)"/>
    ${[140, 160, 180].map((x) => `<line x1="${x}" y1="31" x2="${x}" y2="85" class="d-muted" stroke-width="1.5" stroke-dasharray="3 3"/>`).join('')}
    <rect x="220" y="30" width="92" height="56" rx="28" class="d-box" stroke-width="2.5" style="stroke:var(--ink)"/>
    ${[246, 266, 286].map((x) => `<line x1="${x}" y1="31" x2="${x}" y2="85" class="d-ink" stroke-width="2"/>`).join('')}
    ${[44, 58, 72].map((y) => `<line x1="230" y1="${y}" x2="302" y2="${y}" class="d-brand" stroke-width="2"/>`).join('')}
    ${txt(54, 108, 'TRUSS', 't-brand d-text')}${lines(54, 121, ['Welded tubes in', 'triangles (Warren)'], 'd-small', 'middle', 10)}
    ${txt(160, 108, 'MONOCOQUE', 't-brand d-text')}${lines(160, 121, ['The skin carries', 'the loads (like an egg)'], 'd-small', 'middle', 10)}
    ${txt(266, 108, 'SEMI-MONOCOQUE', 't-brand d-text')}${lines(266, 121, ['Skin + formers +', 'stringers (most planes)'], 'd-small', 'middle', 10)}
    ${txt(160, 16, 'Three ways to build a fuselage', 'd-text')}`,
    'Truss, monocoque and semi-monocoque fuselage construction');

  const wing = svg(320, 170, `
    <path d="M20,40 L300,46 L300,104 L20,110 Z" class="d-box" style="stroke:var(--ink)" stroke-width="2"/>
    <line x1="20" y1="58" x2="300" y2="61" class="d-weight" stroke-width="3"/><line x1="20" y1="88" x2="300" y2="90" class="d-weight" stroke-width="3"/>
    ${[50, 80, 110, 140, 170, 200, 230, 260, 290].map((x) => `<line x1="${x}" y1="${40 + (x - 20) * 0.021}" x2="${x}" y2="${110 - (x - 20) * 0.021}" class="d-muted" stroke-width="1.5"/>`).join('')}
    <path d="M200,95 L298,93 L300,104 L200,106 Z" class="d-accent" opacity=".85"/>
    <path d="M30,99 L150,97 L150,108 L30,110 Z" class="d-thrust" opacity=".75"/>
    ${txt(20, 30, 'Leading edge (front)', 'd-small', 'start')}${txt(20, 126, 'Trailing edge (back)', 'd-small', 'start')}
    ${txt(250, 142, 'AILERON', 't-accent d-text')}<line x1="250" y1="132" x2="250" y2="104" class="d-muted" stroke-width="1"/>
    ${txt(90, 142, 'FLAP', 't-thrust d-text')}<line x1="90" y1="132" x2="90" y2="108" class="d-muted" stroke-width="1"/>
    ${txt(160, 162, 'Red = spars (run tip to root) · Gray = ribs (shape the airfoil)', 'd-small')}
    ${txt(300, 30, 'Wingtip →', 'd-small', 'end')}`,
    'Top view of a wing showing spars, ribs, flap and aileron');

  const gearTypes = svg(320, 120, `
    <line x1="6" y1="82" x2="150" y2="82" class="d-muted" stroke-width="1.5"/><line x1="170" y1="82" x2="314" y2="82" class="d-muted" stroke-width="1.5"/>
    <line x1="90" y1="60" x2="90" y2="72" class="d-ink" stroke-width="2.5"/><circle cx="90" cy="76" r="6" class="d-fill-ink"/>
    <line x1="114" y1="60" x2="114" y2="72" class="d-ink" stroke-width="2.5"/><circle cx="114" cy="76" r="5" class="d-fill-ink"/>
    ${planeSide(80, 55, 0.7)}
    <line x1="262" y1="55" x2="262" y2="70" class="d-ink" stroke-width="2.5"/><circle cx="262" cy="76" r="6" class="d-fill-ink"/>
    <line x1="191" y1="60" x2="190" y2="74" class="d-ink" stroke-width="2"/><circle cx="190" cy="78" r="4" class="d-fill-ink"/>
    ${planeSide(240, 52, 0.7, -10)}
    ${txt(78, 104, 'TRICYCLE', 't-brand d-text')}${txt(78, 116, 'nosewheel in front', 'd-small')}
    ${txt(240, 104, 'CONVENTIONAL', 't-brand d-text')}${txt(240, 116, 'tailwheel (“taildragger”)', 'd-small')}`,
    'Tricycle gear with a nosewheel compared to conventional gear with a tailwheel');

  SKY.registerChapter({
    id: 'ch03',
    badge: { name: 'Hangar Expert', emoji: '🔧', desc: 'You know every major part of an airplane and how it’s built.' },
    game: {
      engine: 'sort', title: 'Rapid Sort', blurb: 'Sort airplane parts and designs', xpEach: 30,
      rounds: [
        { id: 'parts', title: 'Where Does It Go?', brief: 'Sort each part into one of the five major components.',
          buckets: ['Fuselage', 'Wings', 'Empennage', 'Landing gear', 'Powerplant'],
          items: [
            { t: 'Rudder', b: 2 }, { t: 'Aileron', b: 1 }, { t: 'Propeller', b: 4 }, { t: 'Cockpit', b: 0 }, { t: 'Elevator', b: 2 },
            { t: 'Flaps', b: 1 }, { t: 'Spar', b: 1 }, { t: 'Nosewheel', b: 3 }, { t: 'Cowling', b: 4, why: 'The cowling covers the engine.' },
            { t: 'Vertical stabilizer', b: 2 }, { t: 'Passenger cabin', b: 0 }, { t: 'Brakes', b: 3 }, { t: 'Engine', b: 4 }, { t: 'Trim tab on the elevator', b: 2 }] },
        { id: 'fuse', title: 'Fuselage Detective', brief: 'Which kind of fuselage construction is it?',
          buckets: ['Truss', 'Monocoque', 'Semi-monocoque'],
          items: [
            { t: 'Welded steel tubes in triangles', b: 0 }, { t: 'The skin alone carries the loads', b: 1 },
            { t: 'Skin plus formers, bulkheads and stringers', b: 2 }, { t: 'Used in most modern airplanes', b: 2 },
            { t: 'Like an eggshell or soda can', b: 1 }, { t: 'Warren truss design', b: 0 },
            { t: 'Old fabric-covered Piper Cub frame', b: 0 }, { t: 'Shares loads between skin and inner structure', b: 2 }] },
        { id: 'gear', title: 'Tricycle or Taildragger?', brief: 'Tricycle gear or conventional (tailwheel) gear?',
          buckets: ['Tricycle', 'Conventional'],
          items: [
            { t: 'Wheel under the nose', b: 0 }, { t: 'Small wheel at the tail', b: 1 }, { t: 'Better view over the nose while taxiing', b: 0 },
            { t: 'More likely to ground loop', b: 1 }, { t: 'Nicknamed a “taildragger”', b: 1 }, { t: 'Cessna 172', b: 0 },
            { t: 'Piper J-3 Cub', b: 1 }, { t: 'Allows harder braking without nosing over', b: 0 }] }
      ]
    },
    missions: [
      {
        id: 'big5', emoji: '✈️', title: 'The Big Five Parts', blurb: 'Every airplane, broken into five pieces', minutes: 5, xp: 50,
        phak: 'Chapter 3 → “Major Components”',
        cards: [
          { t: 'talk', html: `<p>From a tiny Cessna to a giant Airbus, almost every airplane has the same <b>five major components</b>. Learn these and you can walk around any airplane and know what you’re looking at.</p>` },
          { t: 'diagram', svg: parts(true), caption: 'Fuselage, wings, empennage, landing gear and powerplant.' },
          { t: 'talk', html: `<ul><li><b>Fuselage</b>: the body. It holds the crew, passengers and cargo, and everything else attaches to it.</li><li><b>Wings</b>: make the lift. They also hold the ailerons, flaps and often the fuel tanks.</li><li><b>Empennage</b> (say “EM-pen-ij”): the whole tail section.</li><li><b>Landing gear</b>: wheels, floats or skis for the ground or water.</li><li><b>Powerplant</b>: the engine and propeller.</li></ul>` },
          { t: 'hotspot', title: 'FIND THE PART', svg: parts(false), spots: [
            { x: 55.6, y: 40, label: 'Wings' }, { x: 37.5, y: 46, label: 'Fuselage' }, { x: 17, y: 31, label: 'Empennage (tail)' },
            { x: 76.6, y: 49, label: 'Powerplant' }, { x: 57.5, y: 65, label: 'Landing gear' }] },
          { t: 'check', q: 'Which major component includes the rudder and elevator?',
            choices: ['The wings', 'The empennage', 'The fuselage'], answer: 1,
            explain: 'The empennage is the whole tail: stabilizers, rudder, elevator and trim tabs.' },
          { t: 'fact', html: `<p>“Empennage” comes from the French word <i>empenner</i>, meaning “to feather an arrow.” The tail does for an airplane what feathers do for an arrow: keeps it pointed straight!</p>` }
        ]
      },
      {
        id: 'fuselage', emoji: '🥚', title: 'Inside the Fuselage', blurb: 'Truss, monocoque, semi-monocoque', minutes: 5, xp: 50,
        phak: 'Chapter 3 → “Fuselage” (Truss Structure, Monocoque, Semimonocoque)',
        cards: [
          { t: 'diagram', svg: fuselageTypes, caption: 'Engineers have three main ways to make a fuselage strong but light.' },
          { t: 'talk', html: `<ul><li><b>Truss</b>: a frame of tubes welded into triangles (a <b>Warren truss</b>), usually covered in fabric or thin metal. Strong, simple, great for older and homebuilt planes.</li><li><b>Monocoque</b> (“single shell”): the outer skin carries all the loads, like an eggshell or a soda can. Very light, but a dent can weaken the whole thing.</li><li><b>Semi-monocoque</b>: skin <i>plus</i> an inner skeleton of <b>formers</b>, <b>bulkheads</b> and <b>stringers</b>. Most modern airplanes use this.</li></ul>` },
          { t: 'check', q: 'An airplane whose outer skin carries ALL the structural loads has which type of fuselage?',
            choices: ['Truss', 'Monocoque', 'Semi-monocoque'], answer: 1,
            explain: 'Monocoque means “single shell”: the skin does all the work.' },
          { t: 'talk', html: `<p>Up front, a fireproof wall called the <b>firewall</b> separates the engine from the cabin. If there’s ever an engine fire, it buys the pilot precious time.</p>` },
          { t: 'tryit', html: `<p>Stand on an empty soda can (carefully, holding onto something). It holds you up! Now poke a tiny dent in the side and try again. Crunch. That’s monocoque strength, and why one dent matters.</p>` },
          { t: 'fact', html: `<p>Many new airplanes, like the <b>Cirrus SR22</b> and the <b>Boeing 787</b>, are built mostly from <b>composites</b>: layers of carbon or glass fiber glued in resin. Composites are strong, smooth and don’t rust. But damage can hide <i>inside</i> the layers (called <b>delamination</b>), so inspections need special care.</p>` }
        ]
      },
      {
        id: 'wings', emoji: '🪽', title: 'How Wings Are Built', blurb: 'Spars, ribs and wing types', minutes: 6, xp: 50,
        phak: 'Chapter 3 → “Wings”',
        cards: [
          { t: 'talk', html: `<p>Wings come in lots of setups:</p><ul><li><b>High-wing</b> (Cessna 172), <b>low-wing</b> (Piper Archer) or <b>mid-wing</b> (many fighter jets).</li><li><b>Monoplane</b> (one wing) or <b>biplane</b> (two stacked wings, like old stunt planes).</li><li><b>Cantilever</b> wings have no outside supports. <b>Strut-braced</b> wings have struts running from the fuselage to the wing.</li></ul>` },
          { t: 'diagram', svg: wing, caption: 'Looking down at a wing.',
            html: `<p>Inside, <b>spars</b> are the main beams running from root to tip. They carry most of the load. <b>Ribs</b> run front to back and give the wing its airfoil shape. <b>Stringers</b> and the <b>skin</b> finish it off.</p>` },
          { t: 'talk', html: `<p>On the back edge (trailing edge) of the wing:</p><ul><li><b>Ailerons</b> are near the <b>wingtips</b>. They roll the airplane.</li><li><b>Flaps</b> are closer to the <b>fuselage</b>. They add lift and drag for slow flight and landing.</li></ul><p>Many wings also hold the <b>fuel tanks</b>. Some are “wet wings,” where the sealed wing itself is the tank!</p>` },
          { t: 'check', q: 'What are the main load-carrying beams that run the length of a wing?',
            choices: ['Ribs', 'Spars', 'Stringers'], answer: 1,
            explain: 'Spars run root to tip and carry the main loads. Ribs give the wing its shape.' },
          { t: 'check', q: 'Which control surface is located near the wingtip on the trailing edge?',
            choices: ['Aileron', 'Flap', 'Elevator'], answer: 0,
            explain: 'Ailerons are outboard near the tips. Flaps are inboard near the fuselage.' },
          { t: 'fact', html: `<p>Airliner wings flex a LOT. During testing, a Boeing 787 wing was bent upward about <b>25 feet</b> at the tip without breaking. Flexing is a feature, not a flaw!</p>` }
        ]
      },
      {
        id: 'tail', emoji: '🪶', title: 'The Empennage', blurb: 'Stabilizers, rudder, elevator, trim', minutes: 5, xp: 50,
        phak: 'Chapter 3 → “Empennage”',
        cards: [
          { t: 'talk', html: `<p>The tail has two fixed fins with movable parts hinged to them:</p><ul><li><b>Vertical stabilizer</b> (fin) + <b>rudder</b>: keeps the nose straight and controls yaw.</li><li><b>Horizontal stabilizer</b> + <b>elevator</b>: keeps the airplane stable in pitch and moves the nose up and down.</li></ul>` },
          { t: 'talk', html: `<p>Some airplanes (like the Piper Cherokee) use a <b>stabilator</b>: the whole horizontal tail pivots as one piece. Stabilators are very powerful, so they have an <b>antiservo tab</b> on the back that makes them less sensitive and gives the pilot some “feel.”</p><p><b>Trim tabs</b> are small adjustable tabs on the trailing edge of control surfaces. They hold the controls in place so the pilot doesn’t have to keep pushing or pulling.</p>` },
          { t: 'check', q: 'A one-piece horizontal tail that pivots up and down as a single unit is called a…',
            choices: ['Stabilator', 'Ruddervator', 'Canard'], answer: 0,
            explain: 'A stabilator combines the horizontal stabilizer and elevator into one moving piece.' },
          { t: 'talk', html: `<p>Some airplanes have a <b>T-tail</b>, with the horizontal tail on top of the fin. It sits up out of the propeller’s blast and the wing’s downwash. That changes how it behaves at low speeds and when power changes.</p>` },
          { t: 'fact', html: `<p>The Beechcraft Bonanza’s famous <b>V-tail</b> has just two tail surfaces in a “V.” They’re called <b>ruddervators</b>, because each one works as both rudder AND elevator.</p>` }
        ]
      },
      {
        id: 'gear', emoji: '🛞', title: 'Landing Gear & Powerplant', blurb: 'Wheels, floats, engines and props', minutes: 6, xp: 50,
        phak: 'Chapter 3 → “Landing Gear” and “The Powerplant”',
        cards: [
          { t: 'diagram', svg: gearTypes, caption: 'The two main landing gear layouts.' },
          { t: 'talk', html: `<p><b>Tricycle gear</b> has a nosewheel. It gives you:</p><ul><li>More forceful braking without tipping onto the nose.</li><li>A better view over the nose when taxiing.</li><li>Less tendency to <b>ground loop</b> (spin around sideways on the ground).</li></ul><p><b>Conventional gear</b> (a tailwheel, or “taildragger”) is lighter and great for rough fields, but trickier to land. Pilots need a special <b>tailwheel endorsement</b>.</p>` },
          { t: 'talk', html: `<p>Gear can be <b>fixed</b> (always down) or <b>retractable</b> (folds up to cut drag). Many planes steer on the ground with a <b>steerable nosewheel</b> through the rudder pedals, and use <b>toe brakes</b> on top of the pedals. Pressing just one side (<b>differential braking</b>) helps with tight turns.</p><p>Swap the wheels for <b>floats</b> and you have a seaplane, or <b>skis</b> for snow!</p>` },
          { t: 'check', q: 'Which landing gear type is more likely to ground loop?',
            choices: ['Tricycle', 'Conventional (tailwheel)', 'Retractable tricycle'], answer: 1,
            explain: 'With the center of gravity behind the main wheels, a taildragger can swing around if not carefully controlled.' },
          { t: 'talk', html: `<p>The <b>powerplant</b> is the engine and propeller. The engine turns the prop, which pulls the airplane forward. The engine also powers the electrical system (through an alternator) and some instruments. A metal <b>cowling</b> covers the engine to streamline it and guide cooling air. You’ll go deep on engines in Chapter 7!</p>` },
          { t: 'test', html: `<p>FAA questions on construction usually test vocabulary:</p><ul><li>Empennage = vertical stabilizer, rudder, horizontal stabilizer, elevator (or stabilator), trim tabs.</li><li>Stabilator → uses an <b>antiservo tab</b>.</li><li>Monocoque = skin carries the loads; semi-monocoque = skin + substructure.</li></ul>` }
        ]
      }
    ],

    quizLength: 12,
    quiz: [
      { q: 'The five major components of most airplanes are the fuselage, wings, empennage, landing gear, and', choices: ['powerplant.', 'avionics.', 'flight controls.'], answer: 0, explain: 'The powerplant is the engine and propeller.' },
      { q: 'The empennage includes the', choices: ['vertical stabilizer, rudder, horizontal stabilizer, and elevator.', 'ailerons, flaps, and wingtips.', 'engine, propeller, and cowling.'], answer: 0, explain: 'Empennage = the tail section.' },
      { q: 'In a monocoque fuselage, the primary loads are carried by the', choices: ['outer skin.', 'welded steel tube frame.', 'longerons and diagonal braces.'], answer: 0, explain: 'Monocoque means “single shell.” The skin does the work.' },
      { q: 'A semi-monocoque fuselage', choices: ['shares loads between the skin and a substructure of formers, bulkheads, and stringers.', 'uses only welded tubes with fabric covering.', 'relies entirely on the skin with no internal structure.'], answer: 0, explain: 'Most modern airplanes are semi-monocoque.' },
      { q: 'A Warren truss is made of', choices: ['tubes arranged in triangles.', 'a thin stressed skin.', 'composite layers bonded with resin.'], answer: 0, explain: 'Triangles are very strong shapes, so trusses use them.' },
      { q: 'The main spanwise structural members of a wing are the', choices: ['spars.', 'ribs.', 'formers.'], answer: 0, explain: 'Spars carry the main bending loads from tip to root.' },
      { q: 'Wing ribs are used to', choices: ['give the wing its airfoil shape.', 'carry fuel to the engine.', 'connect the empennage to the fuselage.'], answer: 0, explain: 'Ribs run front to back and shape the airfoil.' },
      { q: 'A wing with no external struts or braces is called a', choices: ['cantilever wing.', 'semi-cantilever wing.', 'biplane wing.'], answer: 0, explain: 'Cantilever wings carry their loads internally.' },
      { q: 'Ailerons are normally located on the', choices: ['trailing edge of each wing, near the wingtips.', 'trailing edge of each wing, near the fuselage.', 'leading edge of the horizontal stabilizer.'], answer: 0, explain: 'Ailerons are outboard. Flaps are inboard.' },
      { q: 'A stabilator is', choices: ['a one-piece horizontal stabilizer that pivots up and down.', 'a fixed vertical fin.', 'a movable surface on the leading edge of the wing.'], answer: 0, explain: 'The whole horizontal tail moves as one piece.' },
      { q: 'What is the purpose of the antiservo tab on a stabilator?', choices: ['To make the stabilator less sensitive and give the pilot control “feel.”', 'To increase the stabilator’s sensitivity.', 'To lock the stabilator for takeoff.'], answer: 0, explain: 'It moves in the same direction as the stabilator’s trailing edge, resisting movement.' },
      { q: 'Which is an advantage of tricycle landing gear?', choices: ['It allows more forceful braking without nosing over.', 'It is lighter and better for rough fields.', 'It makes ground loops more likely.'], answer: 0, explain: 'Tricycle gear also gives better forward visibility and resists ground looping.' },
      { q: 'An airplane with a tailwheel has', choices: ['conventional landing gear.', 'tricycle landing gear.', 'retractable landing gear.'], answer: 0, explain: 'Conventional gear = taildragger.' },
      { q: 'The firewall', choices: ['separates the engine compartment from the cabin.', 'is a section of the wing that holds fuel.', 'protects the tail from engine exhaust.'], answer: 0, explain: 'It protects occupants from an engine fire.' },
      { q: 'The cowling’s main jobs are to', choices: ['streamline the engine and direct cooling air around it.', 'hold the propeller on the engine.', 'store engine oil.'], answer: 0, explain: 'The cowling reduces drag and helps cool the engine.' },
      { q: 'A potential disadvantage of composite construction is that', choices: ['damage such as delamination can be hidden inside the structure.', 'it rusts easily.', 'it cannot be formed into curved shapes.'], answer: 0, explain: 'Composites resist corrosion and form smooth shapes, but damage can hide inside.' },
      { q: 'Flaps are usually located on the', choices: ['inboard trailing edge of the wings.', 'outboard trailing edge of the wings.', 'leading edge of the vertical stabilizer.'], answer: 0, explain: 'Flaps are inboard, near the fuselage.' },
      { q: 'Control surfaces that act as both rudder and elevator on a V-tail are called', choices: ['ruddervators.', 'flaperons.', 'stabilators.'], answer: 0, explain: 'Ruddervators combine both jobs.' }
    ],

    glossary: [
      { term: 'Fuselage', def: 'The airplane’s body, holding the crew, passengers and cargo.' },
      { term: 'Empennage', def: 'The tail section: vertical and horizontal stabilizers, rudder, elevator and trim tabs.' },
      { term: 'Powerplant', def: 'The engine and propeller.' },
      { term: 'Truss structure', def: 'A fuselage frame of tubes, often welded into triangles (Warren truss).' },
      { term: 'Monocoque', def: '“Single shell”: the outer skin carries the loads.' },
      { term: 'Semi-monocoque', def: 'Skin plus formers, bulkheads and stringers share the loads. Used in most modern airplanes.' },
      { term: 'Firewall', def: 'A fireproof wall between the engine and the cabin.' },
      { term: 'Spar', def: 'The main beam running the length of a wing.' },
      { term: 'Rib', def: 'A front-to-back piece that gives the wing its airfoil shape.' },
      { term: 'Stringer', def: 'A thin lengthwise piece that stiffens the skin.' },
      { term: 'Cantilever wing', def: 'A wing with no external struts.' },
      { term: 'Aileron', def: 'A hinged surface near the wingtip that rolls the airplane.' },
      { term: 'Flap', def: 'A hinged surface near the wing root that adds lift and drag.' },
      { term: 'Vertical stabilizer', def: 'The fixed fin that keeps the nose pointed straight. The rudder hinges to it.' },
      { term: 'Horizontal stabilizer', def: 'The fixed horizontal tail surface. The elevator hinges to it.' },
      { term: 'Stabilator', def: 'A one-piece horizontal tail that pivots to control pitch.' },
      { term: 'Antiservo tab', def: 'A tab on a stabilator that makes it less sensitive and adds control feel.' },
      { term: 'Trim tab', def: 'A small adjustable tab that relieves control pressure.' },
      { term: 'Tricycle gear', def: 'Landing gear with a nosewheel in front.' },
      { term: 'Conventional gear', def: 'Landing gear with a tailwheel (“taildragger”).' },
      { term: 'Composite', def: 'Material made of fibers (carbon or glass) in resin: strong, light and corrosion-free.' }
    ]
  });
})();
