// Chapter 11 — Aircraft Performance (PHAK FAA-H-8083-25C)
(() => {
  const { arrow, txt, lines, box, svg } = SKY.draw;

  const vxvy = svg(320, 170, `
    <rect x="0" y="140" width="320" height="30" class="d-ground"/>
    <rect x="10" y="136" width="110" height="6" rx="2" class="d-runway"/>
    <line x1="120" y1="138" x2="310" y2="30" class="d-thrust" stroke-width="3" stroke-dasharray="7 5"/>
    <line x1="120" y1="138" x2="250" y2="20" class="d-weight" stroke-width="3.5"/>
    <path d="M196,140 L188,104 L204,104 Z" class="d-ok"/><rect x="194" y="104" width="4" height="0" class="d-ok"/>
    <path d="M200,140 L192,96 L208,96 Z" class="d-ok" opacity=".8"/>
    ${txt(258, 16, 'Vx: best ANGLE', 't-weight d-text', 'start')}${txt(270, 28, 'clears obstacles', 'd-small', 'start')}
    ${txt(236, 60, 'Vy: best RATE', 't-thrust d-text', 'start')}${txt(236, 72, 'most height per minute', 'd-small', 'start')}
    ${txt(200, 158, 'Tall trees at the end of the runway', 'd-small')}`,
    'Vx gives the steepest climb over a short distance; Vy gives the most altitude per minute');

  const crosswind = svg(320, 200, `
    <rect x="140" y="20" width="40" height="170" rx="4" class="d-runway"/>${txt(160, 182, '36', 't-white d-text')}
    ${arrow(250, 40, 172, 104, 'd-accent', 4)}${txt(262, 32, 'Wind 030° at 20 kt', 't-accent d-text', 'end')}
    <line x1="250" y1="40" x2="250" y2="104" class="d-thrust" stroke-width="2" stroke-dasharray="5 4"/>
    ${arrow(250, 104, 190, 104, 'd-thrust', 3)}${txt(258, 124, 'Crosswind ≈ 10 kt', 't-thrust d-text', 'start')}
    ${arrow(120, 40, 120, 92, 'd-ok', 3)}${txt(112, 60, 'Headwind', 't-ok d-small', 'end')}${txt(112, 72, '≈ 17 kt', 't-ok d-small', 'end')}
    ${txt(16, 150, '30° off: crosswind = ½ wind', 'd-small', 'start')}${txt(16, 162, '45° off: ≈ 0.7 × wind', 'd-small', 'start')}${txt(16, 174, '60° off: ≈ 0.9 × wind', 'd-small', 'start')}`,
    'Wind 30 degrees off the runway splits into a headwind of about 17 knots and a crosswind of about 10 knots');

  const ceilings = svg(320, 170, `
    <line x1="40" y1="150" x2="300" y2="150" class="d-ink" stroke-width="2"/><line x1="40" y1="150" x2="40" y2="14" class="d-ink" stroke-width="2"/>
    ${txt(296, 166, 'CLIMB RATE →', 'd-small', 'end')}${txt(46, 12, 'ALTITUDE', 'd-small', 'start')}
    <line x1="270" y1="150" x2="40" y2="24" class="d-thrust" stroke-width="3"/>
    <circle cx="58" cy="34" r="5" class="d-accent"/><line x1="40" y1="34" x2="58" y2="34" class="d-muted" stroke-dasharray="3 3"/>
    ${txt(66, 38, 'Service ceiling: still climbing 100 fpm', 't-accent d-small', 'start')}
    <circle cx="40" cy="24" r="5" class="d-weight"/>${txt(50, 22, 'Absolute ceiling: 0 fpm', 't-weight d-small', 'start')}
    ${txt(232, 140, 'Sea level: best climb', 'd-small', 'end')}`,
    'Climb rate shrinks with altitude, reaching 100 feet per minute at the service ceiling and zero at the absolute ceiling');

  SKY.registerChapter({
    id: 'ch11',
    badge: { name: 'Performance Pro', emoji: '📈', desc: 'You can predict how far, how fast and how high your airplane can go.' },
    game: {
      engine: 'sort', title: 'Rapid Sort', blurb: 'Density altitude, takeoff distance, Vx vs. Vy', xpEach: 30,
      rounds: [
        { id: 'da', title: 'High or Low Density Altitude?', brief: 'High density altitude means worse performance.',
          buckets: ['High DA 😓', 'Low DA 💪'],
          items: [
            { t: 'Hot summer afternoon', b: 0 }, { t: 'Mountain airport', b: 0 }, { t: 'Cold winter morning at sea level', b: 1 },
            { t: 'Humid, muggy day', b: 0 }, { t: 'High barometric pressure, cool air', b: 1 }, { t: 'Denver in July', b: 0 },
            { t: 'Beach airport in January', b: 1 }, { t: 'Low pressure and heat wave', b: 0 }] },
        { id: 'roll', title: 'Longer or Shorter Takeoff?', brief: 'Does each condition make the takeoff roll longer or shorter?',
          buckets: ['Longer 🐢', 'Shorter 🚀'],
          items: [
            { t: 'Headwind', b: 1 }, { t: 'Tailwind', b: 0 }, { t: 'Uphill runway', b: 0 }, { t: 'Downhill runway', b: 1 },
            { t: 'Tall wet grass', b: 0 }, { t: 'Heavy load', b: 0 }, { t: 'Hot day', b: 0 }, { t: 'Light load on a cold day', b: 1 }] },
        { id: 'vxvy', title: 'Vx or Vy?', brief: 'Which climb speed fits?',
          buckets: ['Vx (best angle)', 'Vy (best rate)'],
          items: [
            { t: 'Clear the trees at the end of a short strip', b: 0 }, { t: 'Reach cruise altitude fastest', b: 1 },
            { t: 'Most altitude per distance', b: 0 }, { t: 'Most altitude per minute', b: 1 },
            { t: 'The slower of the two speeds', b: 0 }, { t: 'Normal climb after obstacles are cleared', b: 1 }] }
      ]
    },
    missions: [
      {
        id: 'da', emoji: '🌡️', title: 'Density Altitude in Action', blurb: 'Calculating how “high” the air feels', minutes: 7, xp: 50,
        phak: 'Chapter 11 → “Density Altitude,” “Pressure Altitude,” and “Effects of Pressure, Temperature, and Humidity on Density”',
        cards: [
          { t: 'talk', html: `<p>Remember from Chapter 4: <b>density altitude</b> is the altitude the airplane “feels like” it’s flying at. Every number in the POH’s performance charts depends on it. Let’s calculate it!</p>` },
          { t: 'talk', html: `<p><b>Step 1: Pressure altitude.</b> Set 29.92 in the altimeter and read it, or calculate:</p><p style="text-align:center"><b>PA = field elevation + (29.92 − altimeter setting) × 1,000</b></p><p>Example: elevation 1,380 ft, altimeter setting 29.82. (29.92 − 29.82) × 1,000 = 100, so PA = <b>1,480 ft</b>.</p>` },
          { t: 'check', q: 'An airport is at 5,000 ft and the altimeter setting is 30.12. What’s the pressure altitude?',
            choices: ['5,200 ft', '4,800 ft', '5,000 ft'], answer: 1,
            explain: '(29.92 − 30.12) × 1,000 = −200. 5,000 − 200 = 4,800 ft. High pressure makes the pressure altitude lower.' },
          { t: 'talk', html: `<p><b>Step 2: Compare to standard temperature.</b> Standard is 15°C at sea level, minus 2°C per 1,000 ft.</p><p><b>Step 3: Rule of thumb.</b> Density altitude goes up about <b>120 feet for every 1°C above standard</b>.</p><p>Example: PA 5,000 ft, temperature 25°C. Standard at 5,000 ft is 5°C, so it’s 20°C hotter. 20 × 120 = 2,400. Density altitude ≈ <b>7,400 ft</b>!</p>` },
          { t: 'check', q: 'What is the standard temperature at 3,000 feet?',
            choices: ['15°C', '9°C', '12°C'], answer: 1,
            explain: '15 − (2 × 3) = 9°C.' },
          { t: 'test', html: `<p>On the real test you’ll often use a <b>density altitude chart</b> from the testing supplement. The idea is the same: <b>higher temperature or lower pressure raises density altitude</b> and hurts performance. An increase in ambient temperature increases density altitude.</p>` }
        ]
      },
      {
        id: 'takeoff', emoji: '🛫', title: 'Takeoff & Landing Factors', blurb: 'Wind, slope, surface, weight', minutes: 6, xp: 50,
        phak: 'Chapter 11 → “Takeoff and Landing Performance,” “Runway Surface and Gradient,” and “Water on the Runway and Dynamic Hydroplaning”',
        cards: [
          { t: 'talk', html: `<p>Things that make a takeoff <b>longer</b>:</p><ul><li>⬆️ High density altitude (high, hot, humid).</li><li>⚖️ More weight.</li><li>🌬️ A <b>tailwind</b>. Even a small one adds a lot of distance!</li><li>⛰️ An <b>uphill</b> runway.</li><li>🌱 Grass, mud, snow or standing water.</li></ul><p>A <b>headwind</b> shortens both takeoff and landing, because you reach flying speed with less groundspeed. That’s why we take off and land <b>into the wind</b>.</p>` },
          { t: 'check', q: 'Which helps shorten your takeoff roll?',
            choices: ['A tailwind', 'A headwind', 'An uphill runway'], answer: 1,
            explain: 'A headwind gives you airspeed before you even move, so you need less runway.' },
          { t: 'talk', html: `<p>Landing is affected the same way, plus <b>braking</b>. Wet or icy runways cut braking a lot. At high speed on standing water, tires can ride up on the water and lose contact. That’s <b>hydroplaning</b>.</p><p>Rule of thumb from the PHAK: hydroplaning can start around <b>9 × √(tire pressure)</b> knots. Tires at 36 psi → 9 × 6 = <b>54 knots</b>.</p>` },
          { t: 'fact', html: `<p>Many pilots add a <b>50% safety margin</b> to POH takeoff and landing distances. The book numbers come from brand-new airplanes flown by test pilots on perfect days!</p>` },
          { t: 'test', html: `<ul><li>Headwind → <b>shorter</b> takeoff and landing.</li><li>Tailwind → <b>longer</b>.</li><li>Upslope → longer takeoff.</li><li>Higher density altitude → longer takeoff and weaker climb.</li></ul>` }
        ]
      },
      {
        id: 'climb', emoji: '⛰️', title: 'Climbs & Ceilings', blurb: 'Vx, Vy and how high you can go', minutes: 6, xp: 50,
        phak: 'Chapter 11 → “Climb Performance” and “Service Ceiling / Absolute Ceiling”',
        cards: [
          { t: 'diagram', svg: vxvy, caption: 'Two climb speeds, two jobs.',
            html: `<ul><li><b>V<sub>X</sub> (best angle of climb)</b>: the most altitude in the <b>shortest distance</b>. Use it to clear obstacles.</li><li><b>V<sub>Y</sub> (best rate of climb)</b>: the most altitude in the <b>shortest time</b>. Use it for normal climbs.</li></ul><p>Climb performance depends on <b>excess power</b>: power available beyond what you need for level flight.</p>` },
          { t: 'check', q: 'Trees stand at the end of a short runway. Which speed should you climb at?',
            choices: ['Vx', 'Vy', 'VNE'], answer: 0,
            explain: 'Vx gives the steepest climb, so you gain the most height before reaching the trees.' },
          { t: 'diagram', svg: ceilings, caption: 'Climb performance fades as the air thins.',
            html: `<p>As you climb, there’s less excess power, so climb rate shrinks.</p><ul><li><b>Service ceiling</b>: the altitude where the airplane can still climb only <b>100 feet per minute</b>.</li><li><b>Absolute ceiling</b>: the airplane can’t climb at all. Here V<sub>X</sub> and V<sub>Y</sub> become the same speed.</li></ul>` },
          { t: 'test', html: `<ul><li>Most altitude in a given <b>distance</b> → V<sub>X</sub>. In a given <b>time</b> → V<sub>Y</sub>.</li><li>Service ceiling = <b>100 fpm</b> max climb. Absolute ceiling = <b>0 fpm</b>.</li><li>V<sub>X</sub> increases and V<sub>Y</sub> decreases with altitude until they meet at the absolute ceiling.</li></ul>` }
        ]
      },
      {
        id: 'cruise', emoji: '🗺️', title: 'Range, Endurance & Wind', blurb: 'Going far vs. staying up long', minutes: 6, xp: 50,
        phak: 'Chapter 11 → “Range Performance” and “Crosswind and Headwind Component Chart”',
        cards: [
          { t: 'talk', html: `<p>Two different goals:</p><ul><li><b>Range</b>: the farthest <b>distance</b> on your fuel. For propeller planes, fly near <b>L/D max</b> (remember the drag curve?).</li><li><b>Endurance</b>: the longest <b>time</b> in the air. Fly at the speed that needs the <b>least power</b>, which is a bit slower.</li></ul><p>A headwind steals range: same fuel burn, less groundspeed. A tailwind adds range.</p>` },
          { t: 'diagram', svg: crosswind, caption: 'Breaking the wind into headwind and crosswind.',
            html: `<p>Every airplane has a <b>maximum demonstrated crosswind</b> in the POH. To find the crosswind part of the wind, use the angle between the wind and the runway: about <b>½</b> at 30°, <b>0.7</b> at 45°, <b>0.9</b> at 60°, and all of it at 90°.</p>` },
          { t: 'check', q: 'Runway 27, wind 300° at 20 knots. About how much crosswind?',
            choices: ['5 knots', '10 knots', '20 knots'], answer: 1,
            explain: 'The wind is 30° off the runway (300 − 270), so the crosswind is about half of 20 = 10 knots.' },
          { t: 'check', q: 'Runway 18, wind 240° at 14 knots. About how much crosswind?',
            choices: ['7 knots', '10 knots', '12 knots'], answer: 2,
            explain: '60° off the runway → about 0.9 × 14 ≈ 12 knots.' },
          { t: 'test', html: `<p>The FAA test uses a <b>crosswind component chart</b>. Find the angle between wind and runway, follow the wind speed arc, and read the crosswind (sideways) and headwind (down) components.</p>` }
        ]
      },
      {
        id: 'charts', emoji: '📊', title: 'Reading Performance Charts', blurb: 'Tables, graphs and interpolation', minutes: 5, xp: 50,
        phak: 'Chapter 11 → “Performance Charts” and “Interpolation”',
        cards: [
          { t: 'talk', html: `<p>The POH’s Performance section has charts for takeoff distance, climb, cruise, fuel burn and landing. They come as <b>tables</b> or <b>graphs</b>. Always read the <b>conditions</b> at the top, like “paved, level, dry runway” and the flap setting.</p>` },
          { t: 'talk', html: `<p>Often your numbers fall between two rows. Then you <b>interpolate</b>: find the value partway between.</p><p>Example: a takeoff table says the ground roll is <b>900 ft at 2,000 ft</b> pressure altitude and <b>1,100 ft at 4,000 ft</b>. At 3,000 ft (halfway), the roll is about <b>1,000 ft</b>.</p>` },
          { t: 'check', q: 'Landing roll is 500 ft at 0°C and 560 ft at 20°C. About what is it at 10°C?',
            choices: ['500 ft', '530 ft', '560 ft'], answer: 1,
            explain: '10°C is halfway between, so it’s halfway between 500 and 560: 530 ft.' },
          { t: 'tryit', html: `<p>Find a takeoff distance chart in an online POH. Pick a temperature and altitude where you live today and see how much runway the airplane would need. Then try a hot day in Denver!</p>` },
          { t: 'test', html: `<p>Expect several chart questions. Read carefully, use a straightedge, and remember that “ground roll” is shorter than the distance “to clear a 50-foot obstacle.”</p>` }
        ]
      }
    ],

    quizLength: 12,
    quiz: [
      { q: 'Which factor would tend to increase the density altitude at a given airport?', choices: ['An increase in ambient temperature.', 'An increase in barometric pressure.', 'A decrease in relative humidity.'], answer: 0, explain: 'Hotter air is thinner, raising density altitude.' },
      { q: 'What effect does high density altitude, as compared to low density altitude, have on propeller efficiency and why?', choices: ['Efficiency is reduced because the propeller exerts less force at high density altitudes than at low density altitudes.', 'Efficiency is increased due to less friction on the propeller blades.', 'Efficiency is reduced due to the increased force of the propeller in the thinner air.'], answer: 0, explain: 'Thin air gives the prop less to push against.' },
      { q: 'Field elevation is 1,380 feet and the altimeter setting is 29.82. What is the pressure altitude?', choices: ['1,480 feet.', '1,280 feet.', '1,380 feet.'], answer: 0, explain: '(29.92 − 29.82) × 1,000 = 100. 1,380 + 100 = 1,480.' },
      { q: 'Field elevation is 5,000 feet and the altimeter setting is 30.12. What is the pressure altitude?', choices: ['4,800 feet.', '5,200 feet.', '5,000 feet.'], answer: 0, explain: '(29.92 − 30.12) × 1,000 = −200.' },
      { q: 'Pressure altitude is 5,000 feet and the temperature is 25 °C. Using the rule of thumb of 120 feet per degree, the density altitude is about', choices: ['7,400 feet.', '5,000 feet.', '2,600 feet.'], answer: 0, explain: 'Standard at 5,000 ft is 5 °C; 20 °C hotter × 120 = 2,400 ft added.' },
      { q: 'What is the standard temperature at 3,000 feet?', choices: ['9 °C.', '15 °C.', '12 °C.'], answer: 0, explain: '15 − 6 = 9 °C.' },
      { q: 'Which airspeed would a pilot use to gain the most altitude in the shortest horizontal distance, such as to clear an obstacle?', choices: ['Vx.', 'Vy.', 'VA.'], answer: 0, explain: 'Vx = best angle.' },
      { q: 'Which airspeed gives the greatest gain in altitude in the shortest time?', choices: ['Vy.', 'Vx.', 'VNO.'], answer: 0, explain: 'Vy = best rate.' },
      { q: 'The service ceiling is the altitude at which the airplane', choices: ['can climb at a maximum of 100 feet per minute.', 'can no longer climb at all.', 'reaches its maximum speed.'], answer: 0, explain: 'Zero climb is the absolute ceiling.' },
      { q: 'At the absolute ceiling,', choices: ['Vx and Vy are the same.', 'Vx is higher than Vy.', 'the airplane can still climb 100 fpm.'], answer: 0, explain: 'There is no excess power left, so best angle and best rate meet.' },
      { q: 'How does a headwind affect takeoff and landing distances?', choices: ['It decreases both.', 'It increases both.', 'It has no effect.'], answer: 0, explain: 'You need less groundspeed to reach flying airspeed.' },
      { q: 'An uphill (upsloping) runway will', choices: ['increase the takeoff distance.', 'decrease the takeoff distance.', 'not affect the takeoff distance.'], answer: 0, explain: 'You’re accelerating uphill against gravity.' },
      { q: 'Runway 36, wind 030° at 20 knots. What is the approximate crosswind component?', choices: ['10 knots.', '17 knots.', '20 knots.'], answer: 0, explain: '30° off the runway: crosswind ≈ ½ the wind. (17 knots is the headwind.)' },
      { q: 'For a propeller-driven airplane, maximum range is generally obtained at', choices: ['the airspeed for L/D max.', 'the airspeed for minimum power required.', 'full throttle.'], answer: 0, explain: 'Maximum endurance is at minimum power required; maximum range at L/D max.' },
      { q: 'Using the rule of thumb, at about what speed could a tire inflated to 36 psi begin to hydroplane?', choices: ['54 knots.', '36 knots.', '72 knots.'], answer: 0, explain: '9 × √36 = 9 × 6 = 54 knots.' },
      { q: 'A takeoff table shows 900 ft at 2,000 ft pressure altitude and 1,100 ft at 4,000 ft. The ground roll at 3,000 ft is about', choices: ['1,000 ft.', '900 ft.', '1,100 ft.'], answer: 0, explain: 'Halfway between, by interpolation.' },
      { q: 'Compared to a lightly loaded airplane, a heavily loaded airplane will have', choices: ['a longer takeoff run and lower climb rate.', 'a shorter takeoff run and higher climb rate.', 'the same performance.'], answer: 0, explain: 'Weight hurts takeoff and climb.' }
    ],

    glossary: [
      { term: 'Pressure altitude', def: 'Altitude read with 29.92 set. PA = elevation + (29.92 − setting) × 1,000.' },
      { term: 'Density altitude', def: 'Pressure altitude corrected for nonstandard temperature.' },
      { term: 'Standard temperature', def: '15°C at sea level, minus 2°C per 1,000 feet.' },
      { term: 'Vx', def: 'Best angle of climb speed: most altitude in the shortest distance.' },
      { term: 'Vy', def: 'Best rate of climb speed: most altitude in the shortest time.' },
      { term: 'Excess power', def: 'Power available beyond what’s needed for level flight. It’s what makes climbs possible.' },
      { term: 'Service ceiling', def: 'Altitude where maximum climb rate drops to 100 feet per minute.' },
      { term: 'Absolute ceiling', def: 'Altitude where the airplane can no longer climb.' },
      { term: 'Range', def: 'How far the airplane can fly on its fuel.' },
      { term: 'Endurance', def: 'How long the airplane can stay airborne on its fuel.' },
      { term: 'Crosswind component', def: 'The part of the wind blowing across the runway.' },
      { term: 'Headwind component', def: 'The part of the wind blowing straight down the runway toward you.' },
      { term: 'Ground roll', def: 'Distance on the runway before liftoff (or after touchdown).' },
      { term: 'Hydroplaning', def: 'Tires riding on a layer of water, losing braking and steering.' },
      { term: 'Interpolation', def: 'Finding a value between two numbers in a table.' }
    ]
  });
})();
