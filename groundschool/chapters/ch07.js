// Chapter 7 — Aircraft Systems (PHAK FAA-H-8083-25C)
(() => {
  const { arrow, txt, lines, box, svg } = SKY.draw;

  const strokes = (() => {
    const st = [['INTAKE', '“suck”', 78, 'in'], ['COMPRESSION', '“squeeze”', 44, ''], ['POWER', '“bang”', 78, 'spark'], ['EXHAUST', '“blow”', 44, 'out']];
    return svg(320, 160, st.map(([n, s, py, v], i) => {
      const x = 8 + i * 78, cx = x + 35;
      return `<line x1="${x + 10}" y1="28" x2="${x + 10}" y2="104" class="d-ink" stroke-width="3"/><line x1="${x + 60}" y1="28" x2="${x + 60}" y2="104" class="d-ink" stroke-width="3"/>
        <line x1="${x + 10}" y1="28" x2="${x + 60}" y2="28" class="d-ink" stroke-width="3"/>
        ${v === 'in' ? `<line x1="${x + 16}" y1="31" x2="${x + 26}" y2="38" class="d-thrust" stroke-width="3"/>${arrow(x + 12, 12, x + 20, 26, 'd-thrust', 2)}` : ''}
        ${v === 'out' ? `<line x1="${x + 54}" y1="31" x2="${x + 44}" y2="38" class="d-muted" stroke-width="3"/>${arrow(x + 52, 26, x + 62, 10, 'd-muted', 2)}` : ''}
        ${v === 'spark' ? `<text x="${cx}" y="${py - 14}" text-anchor="middle" class="t-accent d-text">💥</text>` : ''}
        <rect x="${x + 12}" y="${py}" width="46" height="14" rx="2" class="d-box" style="stroke:var(--ink)"/>
        <line x1="${cx}" y1="${py + 14}" x2="${cx}" y2="${py + 34}" class="d-ink" stroke-width="3"/>
        ${i === 0 || i === 2 ? arrow(x + 66, 50, x + 66, 82, 'd-accent', 2) : arrow(x + 66, 82, x + 66, 50, 'd-accent', 2)}
        ${txt(cx, 132, n, 't-brand d-small')}${txt(cx, 146, s, 'd-small')}`;
    }).join(''), 'The four strokes: intake, compression, power, exhaust');
  })();

  const carb = svg(320, 200, `
    <path d="M110,190 L110,130 Q110,105 128,96 L128,84 Q110,74 110,52 L110,10" class="d-ink" stroke-width="3" style="fill:none"/>
    <path d="M190,190 L190,130 Q190,105 172,96 L172,84 Q190,74 190,52 L190,10" class="d-ink" stroke-width="3" style="fill:none"/>
    ${arrow(150, 188, 150, 150, 'd-thrust', 3)}${arrow(150, 112, 150, 84, 'd-thrust', 4)}${arrow(150, 30, 150, 8, 'd-thrust', 3)}
    <line x1="190" y1="90" x2="160" y2="90" class="d-drag" stroke-width="3"/>${txt(240, 94, '⛽ Fuel nozzle', 't-drag d-small')}
    <line x1="122" y1="62" x2="178" y2="44" class="d-fill-ink" stroke-width="4" style="stroke:var(--ink)"/>${txt(52, 50, 'Throttle valve', 'd-small')}<line x1="78" y1="52" x2="118" y2="58" class="d-muted" stroke-width="1"/>
    ${[[129, 96], [171, 96], [131, 86], [169, 84], [124, 60], [176, 47]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" style="fill:#cfe8ff;stroke:#6aa9e8"/>`).join('')}
    ${txt(255, 52, '🧊 Ice forms', 't-thrust d-text')}${txt(255, 64, 'in the venturi and', 'd-small')}${txt(255, 74, 'on the throttle valve', 'd-small')}
    ${txt(52, 120, 'Venturi:', 'd-text')}${txt(52, 132, 'air speeds up,', 'd-small')}${txt(52, 142, 'gets colder', 'd-small')}
    ${txt(150, 199, 'Air in', 't-thrust d-small')}${txt(210, 14, 'To the engine', 'd-small', 'start')}`,
    'Float-type carburetor: air speeds up in the venturi, cools, and ice can form there and on the throttle valve');

  const knobs = svg(320, 120, `
    ${[[60, 'd-fill-ink', 'THROTTLE', 'black knob', 'sets manifold', 'pressure (power)'], [160, 'd-thrust', 'PROPELLER', 'blue knob', 'sets engine', 'RPM'], [260, 'd-weight', 'MIXTURE', 'red knob', 'sets fuel/air', 'ratio']].map(([x, c, n, k, a, b]) =>
      `<rect x="${x - 4}" y="14" width="8" height="40" rx="3" class="d-box"/><circle cx="${x}" cy="18" r="14" class="${c}"/>` +
      txt(x, 72, n, 'd-text') + txt(x, 84, k, 'd-small') + txt(x, 98, a, 'd-small') + txt(x, 108, b, 'd-small')).join('')}`,
    'Engine controls: black throttle, blue propeller, red mixture');

  SKY.registerChapter({
    id: 'ch07',
    badge: { name: 'Engine Whisperer', emoji: '⚙️', desc: 'You understand engines, props, fuel, carb ice and the systems that keep an airplane running.' },
    game: {
      engine: 'sort', title: 'Rapid Sort', blurb: 'Strokes, fuel colors and mixture', xpEach: 30,
      rounds: [
        { id: 'stroke', title: 'Name That Stroke', brief: 'Which of the four strokes is happening?',
          buckets: ['Intake', 'Compression', 'Power', 'Exhaust'],
          items: [
            { t: 'Piston moves down, fuel and air rush in', b: 0 }, { t: 'Piston moves up, squeezing the mixture', b: 1 },
            { t: 'Spark plug fires, piston is forced down', b: 2 }, { t: 'Piston moves up, burned gases pushed out', b: 3 },
            { t: '“Suck”', b: 0 }, { t: '“Squeeze”', b: 1 }, { t: '“Bang”', b: 2 }, { t: '“Blow”', b: 3 }] },
        { id: 'color', title: 'Fuel by Color', brief: 'Fuel is dyed so you can spot the wrong kind. Match the grade to its color.',
          buckets: ['Blue', 'Red', 'Green', 'Clear / straw'],
          items: [
            { t: '100LL avgas', b: 0, why: '100LL (low lead) is the most common avgas and it’s blue.' }, { t: 'Grade 80 avgas', b: 1 },
            { t: 'Grade 100 avgas', b: 2 }, { t: 'Jet A (turbine fuel)', b: 3 },
            { t: 'The fuel most training planes use', b: 0 }, { t: 'Fuel for jets and turboprops', b: 3 }] },
        { id: 'mix', title: 'Too Rich or Too Lean?', brief: 'Rich = too much fuel for the air. Lean = too little fuel.',
          buckets: ['Too rich', 'Too lean'],
          items: [
            { t: 'Climbed to 9,000 ft without touching the mixture', b: 0, why: 'Thinner air with the same fuel makes the mixture richer.' },
            { t: 'Engine runs rough up high, smooths out when leaned', b: 0 },
            { t: 'Fouled, sooty spark plugs', b: 0 }, { t: 'Detonation and high cylinder temperatures', b: 1 },
            { t: 'Engine overheating at full power', b: 1 }, { t: 'Carburetor heat just turned on', b: 0, why: 'Warm air is less dense, so carb heat enriches the mixture.' }] }
      ]
    },
    missions: [
      {
        id: 'engine', emoji: '🔥', title: 'How a Piston Engine Works', blurb: 'Suck, squeeze, bang, blow', minutes: 6, xp: 50,
        phak: 'Chapter 7 → “Powerplant,” “Reciprocating Engines,” and “Ignition System”',
        cards: [
          { t: 'talk', html: `<p>Most training airplanes have a <b>reciprocating engine</b>, a lot like a car engine. Pistons slide back and forth (they “reciprocate”) inside cylinders and turn a crankshaft, which turns the propeller.</p><p>The cylinders usually lie flat in two rows facing each other: a <b>horizontally opposed</b> engine. It’s compact, smooth and easy to cool.</p>` },
          { t: 'diagram', svg: strokes, caption: 'The four-stroke cycle. Pilots remember it as suck, squeeze, bang, blow.' },
          { t: 'talk', html: `<p>Airplane engines have <b>two spark plugs in every cylinder</b>, fired by <b>two magnetos</b>. Magnetos make their own electricity from the spinning engine, so the engine keeps running even if the airplane’s electrical system dies!</p><p>Dual ignition adds <b>safety</b> and <b>improves engine performance</b> because the fuel burns more completely.</p>` },
          { t: 'check', q: 'The airplane’s battery and alternator both fail in flight. What happens to the engine?',
            choices: ['It stops immediately', 'It keeps running, because the magnetos power the spark plugs', 'It runs only on one cylinder'], answer: 1,
            explain: 'Magnetos are independent of the electrical system. You’ll lose radios and electric instruments, but not the engine.' },
          { t: 'talk', html: `<p>⚠️ <b>Safety alert:</b> if a magneto’s ground wire (the “P-lead”) breaks, the magneto stays <b>on</b> even with the key off. Turning the propeller by hand could start the engine! That’s why you <b>always treat a propeller as if it’s live</b>.</p>` },
          { t: 'test', html: `<ul><li>Purpose of dual ignition → <b>improved engine performance</b> (and redundancy).</li><li>Broken magneto ground wire → the engine <b>could accidentally start if the propeller is moved</b>.</li></ul>` }
        ]
      },
      {
        id: 'prop', emoji: '🌀', title: 'Propellers', blurb: 'Fixed-pitch and constant-speed', minutes: 6, xp: 50,
        phak: 'Chapter 7 → “Propeller,” “Fixed-Pitch Propeller,” and “Adjustable-Pitch Propeller”',
        cards: [
          { t: 'talk', html: `<p>A propeller is really a <b>rotating wing</b>. Each blade is an airfoil, and its “lift” points forward as thrust.</p><p>The blade is <b>twisted</b>: steep near the hub, flatter near the tip. Why? The tip travels much faster than the root, so the twist keeps the angle of attack about the same along the whole blade.</p>` },
          { t: 'talk', html: `<p><b>Fixed-pitch propellers</b> have one blade angle, chosen by the designer:</p><ul><li>A <b>climb prop</b> (low pitch) is great for takeoff and climb.</li><li>A <b>cruise prop</b> (high pitch) is great for speed.</li></ul><p>The <b>tachometer</b> shows engine RPM, which is how you set power with a fixed-pitch prop.</p>` },
          { t: 'diagram', svg: knobs, caption: 'Airplanes with constant-speed props have three engine knobs.',
            html: `<p>A <b>constant-speed propeller</b> changes its blade angle automatically to hold the RPM you pick, like gears on a bike. The <b>throttle</b> controls power (shown on the <b>manifold pressure</b> gauge), and the <b>prop control</b> sets <b>RPM</b> (shown on the tachometer).</p>` },
          { t: 'check', q: 'With a constant-speed propeller, which setting should you avoid?',
            choices: ['High RPM with low manifold pressure', 'High manifold pressure with low RPM', 'Full rich mixture at low altitude'], answer: 1,
            explain: 'High manifold pressure with low RPM overstresses the engine. When adding power: RPM up first, then manifold pressure. When reducing: manifold pressure down first, then RPM.' },
          { t: 'fact', html: `<p>A constant-speed prop lets the pilot pick the most efficient blade angle for each phase of flight. That’s its big advantage over a fixed-pitch prop.</p>` },
          { t: 'test', html: `<ul><li>Constant-speed advantage → lets the pilot <b>select the blade angle for the most efficient performance</b>.</li><li>Throttle → <b>manifold pressure</b>. Prop control → <b>RPM</b>.</li><li>Avoid <b>high manifold pressure with low RPM</b>.</li></ul>` }
        ]
      },
      {
        id: 'carb', emoji: '🧊', title: 'Carburetors & Carb Ice', blurb: 'Ice on a summer day?!', minutes: 6, xp: 50,
        phak: 'Chapter 7 → “Induction Systems,” “Carburetor Systems,” “Carburetor Icing,” and “Carburetor Heat”',
        cards: [
          { t: 'talk', html: `<p>A <b>carburetor</b> mixes fuel with air before it goes into the cylinders. Most small planes use a <b>float-type carburetor</b>. Air rushes through a <b>venturi</b>, its pressure drops, and that pressure difference pulls fuel in. (Remember Bernoulli from Chapter 4?)</p>` },
          { t: 'diagram', svg: carb, caption: 'Where carburetor ice forms.',
            html: `<p>Two things chill the air: the pressure drop in the venturi, and fuel evaporating. Together they can cool the air by tens of degrees. If there’s moisture, <b>ice forms inside the carburetor</b>, even on a warm day!</p>` },
          { t: 'talk', html: `<p>Carb ice is most likely when the temperature is between <b>20°F and 70°F</b> (about −7°C to 21°C) with <b>high humidity</b> or visible moisture. It’s especially likely at <b>low power</b>, like during descents.</p><p>With a fixed-pitch prop, the <b>first sign is a loss of RPM</b>. Then the engine may run rough.</p>` },
          { t: 'check', q: 'Which conditions are most favorable for carburetor ice?',
            choices: ['Below freezing and very dry', '20°F to 70°F with high humidity', 'Above 90°F and dry'], answer: 1,
            explain: 'Carb ice loves cool-to-mild, humid air. It can happen on a summer morning!' },
          { t: 'talk', html: `<p>The cure is <b>carburetor heat</b>, which sends warm air from around the exhaust into the carburetor. When you pull it:</p><ul><li>RPM <b>drops</b> a little, because warm air is less dense. Carb heat <b>enriches the mixture</b>.</li><li>If ice was there, the RPM then <b>gradually rises</b> as the ice melts.</li></ul><p><b>Fuel-injected</b> engines don’t have a carburetor, so they’re much less likely to ice up. Their downsides: hard starts when hot, and vapor lock.</p>` },
          { t: 'test', html: `<ul><li>Float carburetors work on the <b>difference in air pressure at the venturi throat and the air inlet</b>.</li><li>First sign of carb ice (fixed-pitch prop) → <b>loss of RPM</b>.</li><li>Applying carb heat → <b>enriches the mixture</b>.</li></ul>` }
        ]
      },
      {
        id: 'fuel', emoji: '⛽', title: 'Fuel & Mixture', blurb: 'Leaning, detonation and fuel colors', minutes: 6, xp: 50,
        phak: 'Chapter 7 → “Mixture Control,” “Detonation,” “Preignition,” “Fuel Systems,” and “Fuel Grades”',
        cards: [
          { t: 'talk', html: `<p>Engines need the right ratio of fuel to air. As you climb, the air thins out but the same amount of fuel keeps flowing, so the mixture gets <b>too rich</b>. The pilot uses the red <b>mixture</b> knob to <b>lean</b> it, cutting fuel flow to match the thinner air.</p><p>Descending? Enrich it again. Forget to lean up high and you get a rough engine and fouled spark plugs.</p>` },
          { t: 'talk', html: `<p>Two kinds of bad burning:</p><ul><li><b>Detonation</b>: the fuel-air charge <b>explodes</b> instead of burning smoothly. Causes: wrong (too low) fuel grade, too lean a mixture, or too hot an engine. If you suspect it in a climb, <b>lower the nose</b> for more cooling airflow, enrich the mixture and reduce power.</li><li><b>Preignition</b>: the mixture ignites <b>before</b> the spark, often from a hot spot inside the cylinder.</li></ul>` },
          { t: 'check', q: 'You suspect detonation during climb-out. What’s the best first action?',
            choices: ['Lean the mixture', 'Lower the nose slightly to increase airspeed', 'Apply carburetor heat'], answer: 1,
            explain: 'More airspeed means more cooling air. Leaning would make it worse!' },
          { t: 'talk', html: `<p>Avgas is dyed so you can spot the grade: <b>100LL is blue</b> (the most common), <b>80 is red</b>, <b>100 is green</b>, and <b>Jet A is clear or straw-colored</b>. If the right grade isn’t available, use the <b>next higher</b> grade, never lower.</p><p><b>High-wing</b> planes can use gravity to feed fuel. <b>Low-wing</b> planes need fuel pumps. Before every flight, drain a sample from each <b>fuel sump</b> to check for water (it sinks to the bottom) and dirt.</p>` },
          { t: 'tryit', html: `<p>Pour some water and a little cooking oil into a clear glass and watch them separate. Water is heavier, so it sinks, just like water in a fuel tank. That’s why the drains are at the <b>lowest</b> points!</p>` },
          { t: 'test', html: `<ul><li>Lean at altitude to <b>decrease fuel flow to compensate for decreased air density</b>.</li><li>Wrong grade available → use the <b>next higher octane avgas</b>.</li><li>Fill the tanks after the last flight of the day to <b>prevent moisture condensation</b> in the empty space.</li></ul>` }
        ]
      },
      {
        id: 'electric', emoji: '🔋', title: 'Electrical, Oil & Cooling', blurb: 'Keeping the engine happy', minutes: 6, xp: 50,
        phak: 'Chapter 7 → “Electrical System,” “Oil Systems,” and “Engine Cooling Systems”',
        cards: [
          { t: 'talk', html: `<p>The <b>electrical system</b> (usually 14 or 28 volts) has a <b>battery</b> for starting and an engine-driven <b>alternator</b> that recharges it and powers the radios, lights and electric instruments. An <b>ammeter</b> shows whether the battery is charging, and <b>circuit breakers</b> protect each circuit.</p><p>If the alternator fails, the battery runs everything until it’s drained. Turn off what you don’t need!</p>` },
          { t: 'talk', html: `<p>Engine <b>oil</b> has four jobs:</p><ul><li><b>Lubricates</b> moving parts.</li><li><b>Cools</b> the inside of the engine.</li><li><b>Seals</b> the gap between the pistons and cylinder walls.</li><li><b>Cleans</b> by carrying dirt to the filter.</li></ul><p>Watch the <b>oil pressure</b> and <b>oil temperature</b> gauges. After starting, oil pressure should come up quickly (check your POH).</p>` },
          { t: 'check', q: 'An abnormally high oil temperature reading may be caused by…',
            choices: ['The oil level being too low', 'Oil with too high a viscosity', 'An excessively rich mixture'], answer: 0,
            explain: 'Less oil means less cooling. Always check the oil before flight!' },
          { t: 'talk', html: `<p>Airplane engines are <b>air-cooled</b>: fins on the cylinders and baffles guide air around them. Some planes have <b>cowl flaps</b> you can open for more cooling air.</p><p>An engine running too hot can lose power, burn too much oil, and suffer permanent damage. To cool it down: <b>enrich the mixture</b>, <b>open cowl flaps</b>, <b>increase airspeed</b> or <b>reduce power</b>.</p>` },
          { t: 'check', q: 'Oil and cylinder head temperatures are too high. What were you most likely doing?',
            choices: ['Using too much power with the mixture too lean', 'Flying with the mixture too rich', 'Flying with higher-than-normal oil pressure'], answer: 0,
            explain: 'Too much power plus too little fuel (fuel helps cool) makes an engine run hot.' },
          { t: 'test', html: `<ul><li>Reciprocating engines depend on the <b>circulation of lubricating oil</b> for internal cooling.</li><li>Excessively high engine temperatures cause <b>loss of power, excessive oil consumption, and possible permanent internal damage</b>.</li></ul>` }
        ]
      },
      {
        id: 'turbine', emoji: '🛩️', title: 'Turbines & More Systems', blurb: 'Jets, turbochargers, oxygen and CO', minutes: 5, xp: 50,
        phak: 'Chapter 7 → “Superchargers and Turbosuperchargers,” “Turbine Engines,” “Pressurized Aircraft,” “Oxygen Systems,” and “Ice Control Systems”',
        cards: [
          { t: 'talk', html: `<p>Engines lose power as the air thins with altitude. Two fixes:</p><ul><li><b>Supercharger</b>: an engine-driven air pump that squeezes more air into the engine.</li><li><b>Turbocharger</b>: does the same job but is spun by <b>exhaust gas</b>. It can keep sea-level power up to a “critical altitude.”</li></ul>` },
          { t: 'talk', html: `<p><b>Turbine engines</b> suck air in, compress it, burn fuel in it, and blast it out, spinning turbines along the way:</p><ul><li><b>Turbojet</b>: all thrust from the exhaust jet.</li><li><b>Turbofan</b>: a big fan pushes extra air around the core. Airliners use these!</li><li><b>Turboprop</b>: the turbine turns a propeller.</li><li><b>Turboshaft</b>: the turbine turns a shaft, as in helicopters.</li></ul>` },
          { t: 'check', q: 'A turbine engine that drives a propeller is called a…',
            choices: ['Turbofan', 'Turboprop', 'Turbojet'], answer: 1,
            explain: 'Turboprop = turbine + propeller. Many regional airliners and bush planes use them.' },
          { t: 'talk', html: `<p>Other systems you’ll meet: <b>hydraulics</b> (for brakes and retractable gear), <b>oxygen systems</b> and <b>pressurization</b> for high flight, and <b>anti-ice and deice</b> equipment.</p><p>⚠️ <b>Carbon monoxide (CO)</b> is a colorless, odorless gas in engine exhaust. A crack in the exhaust can leak it into the cabin through the heater. If you smell exhaust or get a headache, <b>turn off the heater</b>, open the fresh air vents, and land.</p>` },
          { t: 'fact', html: `<p>A big airliner turbofan like the GE90 makes over <b>100,000 pounds of thrust</b>, and its fan is more than 10 feet across. That’s taller than a basketball hoop!</p>` }
        ]
      }
    ],

    quizLength: 12,
    quiz: [
      { q: 'The operating principle of float-type carburetors is based on the', choices: ['difference in air pressure at the venturi throat and the air inlet.', 'automatic metering of air at the venturi as the aircraft gains altitude.', 'increase in air velocity in the throat of a venturi causing an increase in air pressure.'], answer: 0, explain: 'Air speeds up in the venturi, pressure drops, and fuel is drawn in.' },
      { q: 'Which condition is most favorable to the development of carburetor icing?', choices: ['Temperature between 20 and 70 °F and high humidity.', 'Any temperature below freezing and a relative humidity of less than 50 percent.', 'Temperature between 32 and 50 °F and low humidity.'], answer: 0, explain: 'Mild, humid air is the classic carb ice setup.' },
      { q: 'If an aircraft is equipped with a fixed-pitch propeller and a float-type carburetor, the first indication of carburetor ice would most likely be', choices: ['loss of RPM.', 'a drop in oil temperature and cylinder head temperature.', 'engine roughness.'], answer: 0, explain: 'RPM drops first; roughness can follow.' },
      { q: 'Applying carburetor heat will', choices: ['enrich the fuel/air mixture.', 'result in more air going through the carburetor.', 'not affect the fuel/air mixture.'], answer: 0, explain: 'Warm air is less dense, so the same fuel flow makes a richer mixture.' },
      { q: 'Detonation occurs in a reciprocating aircraft engine when', choices: ['the unburned charge in the cylinders explodes instead of burning normally.', 'hot spots in the combustion chamber ignite the fuel/air mixture in advance of normal ignition.', 'the spark plugs are fouled or shorted out or the wiring is defective.'], answer: 0, explain: 'The second choice describes preignition.' },
      { q: 'If a pilot suspects that the engine (with a fixed-pitch propeller) is detonating during climb-out, the corrective action to take would be to', choices: ['lower the nose slightly to increase airspeed.', 'lean the mixture.', 'apply carburetor heat.'], answer: 0, explain: 'More airspeed means more cooling.' },
      { q: 'The uncontrolled firing of the fuel/air charge in advance of normal spark ignition is known as', choices: ['pre-ignition.', 'combustion.', 'detonation.'], answer: 0, explain: 'Pre = before the spark.' },
      { q: 'The basic purpose of adjusting the fuel/air mixture at altitude is to', choices: ['decrease the fuel flow in order to compensate for decreased air density.', 'decrease the amount of fuel in the mixture in order to compensate for increased air density.', 'increase the amount of fuel in the mixture to compensate for the decrease in pressure and density of the air.'], answer: 0, explain: 'Thinner air needs less fuel.' },
      { q: 'During the run-up at a high-elevation airport, a pilot notes a slight engine roughness that is not affected by the magneto check but grows worse during the carburetor heat check. What would be the most logical initial action?', choices: ['Check the results obtained with a leaner setting of the mixture.', 'Taxi back to the flight line for a maintenance check.', 'Reduce manifold pressure to control detonation.'], answer: 0, explain: 'The mixture is probably too rich for the thin air. Carb heat made it richer still.' },
      { q: 'An abnormally high engine oil temperature indication may be caused by', choices: ['the oil level being too low.', 'operating with a too high viscosity oil.', 'operating with an excessively rich mixture.'], answer: 0, explain: 'Low oil = less cooling.' },
      { q: 'Excessively high engine temperatures will', choices: ['cause loss of power, excessive oil consumption, and possible permanent internal engine damage.', 'cause damage to heat-conducting hoses and warping of the cylinder cooling fins.', 'not appreciably affect an aircraft engine.'], answer: 0, explain: 'Heat is an engine’s enemy.' },
      { q: 'For internal cooling, reciprocating aircraft engines are especially dependent on', choices: ['the circulation of lubricating oil.', 'a properly functioning thermostat.', 'air flowing over the exhaust manifold.'], answer: 0, explain: 'Oil carries heat away from the inside of the engine.' },
      { q: 'If the engine oil temperature and cylinder head temperature gauges have exceeded their normal operating range, the pilot may have been operating with', choices: ['too much power and with the mixture set too lean.', 'the mixture set too rich.', 'higher-than-normal oil pressure.'], answer: 0, explain: 'High power + lean mixture = high temperatures.' },
      { q: 'What type fuel can be substituted for an aircraft if the recommended octane is not available?', choices: ['The next higher octane aviation gas.', 'The next lower octane aviation gas.', 'Unleaded automotive gas of the same octane rating.'], answer: 0, explain: 'Never use a lower grade.' },
      { q: 'Filling the fuel tanks after the last flight of the day is considered a good operating procedure because this will', choices: ['prevent moisture condensation by eliminating airspace in the tanks.', 'force any existing water to the top of the tank away from the fuel lines to the engine.', 'prevent expansion of the fuel by eliminating airspace in the tanks.'], answer: 0, explain: 'Less air in the tank means less moisture to condense into water.' },
      { q: 'One purpose of the dual ignition system on an aircraft engine is to provide for', choices: ['improved engine performance.', 'uniform heat distribution.', 'balanced cylinder head pressure.'], answer: 0, explain: 'Two sparks burn the mixture more completely, and it adds redundancy.' },
      { q: 'If the ground wire between the magneto and the ignition switch becomes disconnected, the most noticeable result will be that the engine', choices: ['could accidentally start if the propeller is moved with fuel in the cylinder.', 'will run very rough.', 'cannot be started with the switch in the ON position.'], answer: 0, explain: 'A “hot mag.” Always treat the prop as live.' },
      { q: 'A precaution for the operation of an engine equipped with a constant-speed propeller is to', choices: ['avoid high manifold pressure settings with low RPM.', 'avoid high RPM settings with high manifold pressure.', 'always use a rich mixture with high RPM settings.'], answer: 0, explain: 'High MP with low RPM can overstress the engine.' },
      { q: 'What is an advantage of a constant-speed propeller?', choices: ['Permits the pilot to select the blade angle for the most efficient performance.', 'Permits the pilot to select and maintain a desired cruising speed.', 'Provides a smoother operation with stable RPM and eliminates vibrations.'], answer: 0, explain: 'The pilot picks the RPM and the prop adjusts its angle to stay efficient.' },
      { q: 'How is engine operation controlled on an engine equipped with a constant-speed propeller?', choices: ['The throttle controls power output as registered on the manifold pressure gauge and the propeller control regulates engine RPM.', 'The throttle controls power output as registered on the manifold pressure gauge and the propeller control regulates a constant blade angle.', 'The throttle controls engine RPM as registered on the tachometer and the mixture control regulates the power output.'], answer: 0, explain: 'Throttle → manifold pressure. Prop knob → RPM.' },
      { q: 'An electrical system failure (battery and alternator) occurs during flight. In this situation, you would', choices: ['experience avionics equipment failure.', 'probably experience failure of the engine ignition system, fuel gauges, aircraft lighting system, and avionics equipment.', 'probably experience engine failure due to the loss of the engine-driven fuel pump.'], answer: 0, explain: 'Magnetos keep the engine running; electric equipment fails.' },
      { q: 'The color of 100LL aviation gasoline is', choices: ['blue.', 'red.', 'green.'], answer: 0, explain: '100LL = blue. 80 = red. 100 = green.' },
      { q: 'Why is the propeller blade twisted?', choices: ['To keep the angle of attack nearly constant along the blade, because the tip moves faster than the root.', 'To make it lighter.', 'To reduce noise only.'], answer: 0, explain: 'Less blade angle at the fast-moving tip keeps the whole blade working evenly.' }
    ],

    glossary: [
      { term: 'Reciprocating engine', def: 'A piston engine. Pistons move back and forth to turn a crankshaft.' },
      { term: 'Four-stroke cycle', def: 'Intake, compression, power, exhaust (suck, squeeze, bang, blow).' },
      { term: 'Magneto', def: 'An engine-driven generator that powers the spark plugs, independent of the electrical system.' },
      { term: 'Fixed-pitch propeller', def: 'A propeller with one blade angle that can’t be changed in flight.' },
      { term: 'Constant-speed propeller', def: 'A propeller that changes blade angle automatically to hold a chosen RPM.' },
      { term: 'Manifold pressure', def: 'Pressure in the engine’s intake, which shows power on engines with constant-speed props.' },
      { term: 'Tachometer', def: 'The gauge that shows engine RPM.' },
      { term: 'Carburetor', def: 'A device that mixes fuel and air using a venturi.' },
      { term: 'Carburetor ice', def: 'Ice that forms in the carburetor as the air cools in the venturi.' },
      { term: 'Carburetor heat', def: 'Warm air sent to the carburetor to prevent or melt ice. It enriches the mixture.' },
      { term: 'Fuel injection', def: 'A system that sprays fuel directly into the intake or cylinders. Less prone to icing.' },
      { term: 'Mixture', def: 'The ratio of fuel to air. Pilots lean it as they climb.' },
      { term: 'Detonation', def: 'Explosive, uncontrolled burning of the fuel/air charge in the cylinder.' },
      { term: 'Preignition', def: 'The fuel/air mixture igniting before the spark plug fires.' },
      { term: '100LL', def: 'The most common aviation gasoline: 100 octane, low lead, dyed blue.' },
      { term: 'Fuel sump', def: 'A drain at the low point of a tank where water and dirt collect.' },
      { term: 'Alternator', def: 'An engine-driven device that makes electricity and charges the battery.' },
      { term: 'Ammeter', def: 'A gauge that shows whether the battery is charging or discharging.' },
      { term: 'Cowl flaps', def: 'Adjustable openings in the cowling that let out more cooling air.' },
      { term: 'Turbocharger', def: 'A compressor spun by exhaust gas that pushes more air into the engine.' },
      { term: 'Turboprop', def: 'A turbine engine that drives a propeller.' },
      { term: 'Turbofan', def: 'A turbine engine with a large fan, used by most airliners.' },
      { term: 'Carbon monoxide', def: 'An odorless, colorless, poisonous gas in engine exhaust.' }
    ]
  });
})();
