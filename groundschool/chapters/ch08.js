// Chapter 8 — Flight Instruments (PHAK FAA-H-8083-25C)
(() => {
  const { r, arrow, txt, lines, box, svg } = SKY.draw;

  const gauge = (x, y, label) => `<circle cx="${x}" cy="${y}" r="24" class="d-box" style="stroke:var(--ink)" stroke-width="2"/>` + txt(x, y + 4, label, 'd-text');
  const pitotStatic = svg(320, 175, `
    <rect x="8" y="28" width="40" height="8" rx="4" class="d-thrust"/>${arrow(2, 22, 18, 22, 'd-thrust', 2)}
    ${txt(28, 16, 'Pitot tube', 't-thrust d-small')}
    <circle cx="20" cy="140" r="7" class="d-lift" style="fill:var(--surface)" stroke-width="3"/>${txt(20, 162, 'Static port', 't-lift d-small')}
    <path d="M48,32 L100,32 L100,52" class="d-thrust" stroke-width="3" style="fill:none"/>
    <path d="M27,140 L280,140 M120,140 L120,84 M200,140 L200,84 M280,140 L280,84" class="d-lift" stroke-width="3" style="fill:none"/>
    ${gauge(110, 60, 'ASI')}${gauge(200, 60, 'ALT')}${gauge(280, 60, 'VSI')}
    ${txt(110, 102, 'airspeed', 'd-small')}${txt(200, 102, 'altimeter', 'd-small')}${txt(280, 102, 'vertical speed', 'd-small')}
    ${txt(170, 16, 'Blue = pitot (ram air) · Green = static air', 'd-small')}`,
    'Pitot-static system: the pitot tube feeds only the airspeed indicator; the static port feeds airspeed, altimeter and vertical speed');

  const asi = (() => {
    const cx = 160, cy = 102;
    const ang = (v) => (135 + (v - 30) / 150 * 270) * Math.PI / 180;
    const pt = (v, rad) => [cx + Math.cos(ang(v)) * rad, cy + Math.sin(ang(v)) * rad];
    const arc = (v1, v2, rad, cls, w) => { const [x1, y1] = pt(v1, rad), [x2, y2] = pt(v2, rad); const large = (v2 - v1) / 150 * 270 > 180 ? 1 : 0;
      return `<path d="M${r(x1)},${r(y1)} A${rad},${rad} 0 ${large} 1 ${r(x2)},${r(y2)}" class="${cls}" stroke-width="${w}" style="fill:none"/>`; };
    const lab = (v, s, cls) => { const [x, y] = pt(v, 94); return txt(r(x), r(y + 4), s, cls); };
    const [rx1, ry1] = pt(163, 60), [rx2, ry2] = pt(163, 82);
    const [nx, ny] = pt(105, 54);
    return svg(320, 200, `
      <circle cx="${cx}" cy="${cy}" r="86" style="fill:#1f2937;stroke:var(--ink)" stroke-width="2.5"/>
      ${arc(40, 85, 62, 'd-ink', 6).replace('d-ink', 'd-ink" style="stroke:#fff;fill:none')}
      ${arc(48, 129, 72, 'd-ok', 8)}${arc(129, 163, 72, 'd-warn', 8)}
      <line x1="${r(rx1)}" y1="${r(ry1)}" x2="${r(rx2)}" y2="${r(ry2)}" class="d-weight" stroke-width="5"/>
      ${lab(34, 'V<tspan font-size="7">S0</tspan>', 'd-small')}${lab(56, 'V<tspan font-size="7">S1</tspan>', 'd-small')}${lab(85, 'V<tspan font-size="7">FE</tspan>', 'd-small')}
      ${lab(129, 'V<tspan font-size="7">NO</tspan>', 'd-small')}${lab(163, 'V<tspan font-size="7">NE</tspan>', 't-weight d-small')}
      <line x1="${cx}" y1="${cy}" x2="${r(nx)}" y2="${r(ny)}" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="5" fill="#fff"/>
      ${txt(cx, cy + 34, 'KNOTS', 't-white d-small')}${txt(cx, cy + 50, '(Cessna 172 example)', 't-white d-small')}`,
      'Airspeed indicator with white arc, green arc, yellow arc and red line');
  })();

  const highLow = svg(320, 150, `
    <line x1="10" y1="40" x2="310" y2="40" class="d-thrust" stroke-width="2.5" stroke-dasharray="7 5"/>
    <path d="M10,40 Q160,52 310,96" class="d-weight" stroke-width="3" style="fill:none"/>
    <path d="M0,150 L0,128 Q80,118 160,126 T320,120 L320,150 Z" class="d-ground"/>
    ${txt(14, 32, 'Altimeter still shows 5,000 ft', 't-thrust d-text', 'start')}
    ${txt(306, 114, 'Real altitude: LOWER!', 't-weight d-text', 'end')}
    ${txt(44, 80, 'HIGH pressure', 'd-text')}${txt(268, 66, 'LOW pressure', 'd-text')}
    ${txt(160, 146, '“High to low, look out below!”', 'd-text')}`,
    'Flying from high to low pressure without resetting the altimeter: it reads higher than your actual altitude');

  const variation = svg(320, 160, `
    <line x1="160" y1="140" x2="160" y2="20" class="d-ink" stroke-width="3"/>${txt(160, 14, 'TRUE NORTH (North Pole)', 'd-text')}
    <line x1="160" y1="140" x2="195" y2="26" class="d-weight" stroke-width="3"/>${txt(236, 40, 'MAGNETIC NORTH', 't-weight d-text')}
    <path d="M160,80 A60,60 0 0 1 177.6,82.6" class="d-accent" stroke-width="3" style="fill:none"/>${txt(200, 96, 'Variation', 't-accent d-text')}
    ${txt(70, 120, 'East variation: subtract', 'd-small')}${txt(70, 132, 'West variation: add', 'd-small')}${txt(70, 146, '“East is least, West is best”', 't-brand d-small')}`,
    'Variation is the angle between true north and magnetic north');

  SKY.registerChapter({
    id: 'ch08',
    badge: { name: 'Instrument Ace', emoji: '🧭', desc: 'You can read every gauge on the panel and know how each one can fool you.' },
    game: {
      engine: 'sort', title: 'Rapid Sort', blurb: 'Instrument systems, airspeed arcs, altitudes', xpEach: 30,
      rounds: [
        { id: 'sys', title: 'What Powers It?', brief: 'Which system does each instrument depend on?',
          buckets: ['Pitot-static', 'Gyroscopic', 'Magnetic'],
          items: [
            { t: 'Airspeed indicator', b: 0 }, { t: 'Altimeter', b: 0 }, { t: 'Vertical speed indicator', b: 0 },
            { t: 'Attitude indicator', b: 1 }, { t: 'Heading indicator', b: 1 }, { t: 'Turn coordinator', b: 1 },
            { t: 'Whiskey compass', b: 2, why: 'The magnetic compass is nicknamed the “whiskey compass” because it floats in alcohol-like fluid.' },
            { t: 'Uses rigidity in space', b: 1 }] },
        { id: 'arcs', title: 'Airspeed Arcs', brief: 'Which marking on the airspeed indicator is it?',
          buckets: ['White arc', 'Green arc', 'Yellow arc', 'Red line'],
          items: [
            { t: 'Flap operating range', b: 0 }, { t: 'Normal operating range', b: 1 }, { t: 'Caution: smooth air only', b: 2 },
            { t: 'Never exceed speed (VNE)', b: 3 }, { t: 'Bottom = stall speed in landing configuration (VS0)', b: 0 },
            { t: 'Bottom = stall speed clean (VS1)', b: 1 }, { t: 'Top = max flap extended speed (VFE)', b: 0 },
            { t: 'Top = max structural cruising speed (VNO)', b: 1 }] },
        { id: 'alts', title: 'Which Altitude?', brief: 'Pilots use five kinds of altitude. Match each one.',
          buckets: ['Indicated', 'True', 'Absolute', 'Pressure', 'Density'],
          items: [
            { t: 'What the altimeter reads', b: 0 }, { t: 'Height above mean sea level (MSL)', b: 1 },
            { t: 'Height above the ground (AGL)', b: 2 }, { t: 'Altimeter set to 29.92', b: 3 },
            { t: 'Pressure altitude corrected for temperature', b: 4 }, { t: 'Used for flight levels above 18,000 ft', b: 3 },
            { t: 'Used to figure airplane performance', b: 4 }, { t: 'Shown on charts for mountain tops', b: 1 }] }
      ]
    },
    missions: [
      {
        id: 'pitot', emoji: '🌬️', title: 'The Pitot-Static System', blurb: 'Two holes run three instruments', minutes: 5, xp: 50,
        phak: 'Chapter 8 → “Pitot-Static Flight Instruments” and “Blockage of the Pitot-Static System”',
        cards: [
          { t: 'talk', html: `<p>Three instruments work by sensing air pressure:</p><ul><li>The <b>pitot tube</b> sticks into the wind and feels <b>ram (impact) pressure</b>. Only the <b>airspeed indicator</b> uses it.</li><li>The <b>static port</b>, a small hole on the side of the airplane, feels the still outside air pressure. The <b>airspeed indicator</b>, <b>altimeter</b> and <b>vertical speed indicator</b> all use it.</li></ul>` },
          { t: 'diagram', svg: pitotStatic, caption: 'The pitot-static system.' },
          { t: 'talk', html: `<p>What if something blocks the holes, like ice or a bug nest?</p><ul><li><b>Pitot tube blocked</b>: the airspeed indicator stops working right. If the drain hole is blocked too, it acts like an <b>altimeter</b>, showing more speed as you climb!</li><li><b>Static port blocked</b>: the altimeter <b>freezes</b>, the VSI reads <b>zero</b>, and the airspeed is wrong.</li></ul><p>Many planes have an <b>alternate static source</b> inside the cabin. Because cabin pressure is a bit lower, using it makes the altimeter and airspeed read a little <b>high</b>.</p>` },
          { t: 'check', q: 'Which instrument(s) become inoperative if the STATIC vents are clogged?',
            choices: ['Airspeed only', 'Altimeter only', 'Airspeed, altimeter and vertical speed'], answer: 2,
            explain: 'All three use static pressure. Only the airspeed indicator uses the pitot tube.' },
          { t: 'fact', html: `<p>That’s why pilots put a <b>pitot cover</b> on when the plane is parked: bugs and wasps love to build nests in pitot tubes. Always remove it before flight. Many have a bright <b>“REMOVE BEFORE FLIGHT”</b> streamer!</p>` },
          { t: 'test', html: `<ul><li>Pitot tube clogged → <b>airspeed</b> is affected.</li><li>Static vents clogged → <b>airspeed, altimeter and vertical speed</b> are affected.</li></ul>` }
        ]
      },
      {
        id: 'asi', emoji: '⏱️', title: 'Airspeed & V-Speeds', blurb: 'Reading the colored arcs', minutes: 6, xp: 50,
        phak: 'Chapter 8 → “Airspeed Indicator,” “Types of Airspeed,” and “Airspeed Indicator Markings”',
        cards: [
          { t: 'talk', html: `<p>There are four kinds of airspeed:</p><ul><li><b>Indicated airspeed (IAS)</b>: what the gauge shows.</li><li><b>Calibrated airspeed (CAS)</b>: IAS corrected for instrument and position errors.</li><li><b>True airspeed (TAS)</b>: your actual speed through the air. It’s higher than indicated as you climb into thinner air.</li><li><b>Groundspeed</b>: your speed over the ground, which is TAS plus or minus the wind.</li></ul>` },
          { t: 'diagram', svg: asi, caption: 'Each color tells you something important.',
            html: `<ul><li><b>White arc</b>: flap operating range. Bottom = <b>V<sub>S0</sub></b> (stall speed with flaps and gear down). Top = <b>V<sub>FE</sub></b> (max speed with flaps extended).</li><li><b>Green arc</b>: normal operating range. Bottom = <b>V<sub>S1</sub></b> (stall speed, clean). Top = <b>V<sub>NO</sub></b> (max structural cruising speed).</li><li><b>Yellow arc</b>: caution range. Smooth air only!</li><li><b>Red line</b>: <b>V<sub>NE</sub></b>, never exceed.</li></ul>` },
          { t: 'check', q: 'You’re flying in the yellow arc and hit bumpy air. What should you do?',
            choices: ['Keep going; yellow is fine anytime', 'Slow down into the green arc', 'Extend the flaps'], answer: 1,
            explain: 'The yellow arc is for smooth air only. In turbulence, slow down. Never extend flaps above the white arc!' },
          { t: 'talk', html: `<p>Some important speeds are <b>not</b> marked on the gauge:</p><ul><li><b>V<sub>A</sub></b>: maneuvering speed (remember it from Chapter 5). It changes with weight.</li><li><b>V<sub>X</sub></b>: best angle of climb.</li><li><b>V<sub>Y</sub></b>: best rate of climb.</li></ul><p>You’ll find them in the POH.</p>` },
          { t: 'test', html: `<p>FAA questions show an airspeed indicator picture and ask things like “What is the full flap operating range?” (the <b>white arc</b>) or “What is the maximum structural cruising speed?” (the <b>top of the green arc</b>). Maneuvering speed is <b>not</b> marked.</p>` }
        ]
      },
      {
        id: 'alt', emoji: '🏔️', title: 'The Altimeter', blurb: 'High to low, look out below', minutes: 6, xp: 50,
        phak: 'Chapter 8 → “Altimeter,” “Types of Altitude,” and “Setting the Altimeter”',
        cards: [
          { t: 'talk', html: `<p>An altimeter is really a <b>barometer</b>. Inside are sealed <b>aneroid wafers</b> that expand as outside pressure drops (when you climb) and squeeze as it rises. Gears turn that into feet on the dial.</p><p>Since air pressure changes with the weather, you set the current local <b>altimeter setting</b> in the little <b>Kollsman window</b>. Set correctly, the altimeter shows your altitude above sea level.</p>` },
          { t: 'talk', html: `<p>Five kinds of altitude:</p><ul><li><b>Indicated</b>: what the altimeter reads.</li><li><b>True</b>: actual height above mean sea level (MSL).</li><li><b>Absolute</b>: height above the ground (AGL).</li><li><b>Pressure</b>: what it reads with <b>29.92</b> set.</li><li><b>Density</b>: pressure altitude corrected for temperature.</li></ul><p>Before takeoff, set the local altimeter setting (or the field elevation). At or above <b>18,000 feet</b>, everyone sets <b>29.92</b>.</p>` },
          { t: 'diagram', svg: highLow, caption: 'Forget to reset the altimeter and it can lie to you.',
            html: `<p>Fly from <b>high pressure to low pressure</b> without resetting, and the altimeter reads <b>higher</b> than you really are. You might be dangerously close to the ground! The same thing happens flying into <b>colder</b> air. “High to low (or hot to cold), look out below.”</p>` },
          { t: 'check', q: 'You change the altimeter setting from 29.15 to 29.85. What happens to the indicated altitude?',
            choices: ['It goes up 70 feet', 'It goes up 700 feet', 'It goes down 700 feet'], answer: 1,
            explain: 'A change of 0.70 inHg ≈ 700 feet (about 1,000 ft per inch). Raising the setting raises the indicated altitude.' },
          { t: 'test', html: `<ul><li>Low → high pressure without resetting: altimeter reads <b>lower</b> than actual.</li><li>High → low: reads <b>higher</b> than actual (dangerous!).</li><li>Indicated = true altitude only <b>at sea level under standard conditions</b> (or with the correct setting at field elevation).</li><li>Colder than standard air → true altitude is <b>lower</b> than indicated.</li></ul>` }
        ]
      },
      {
        id: 'gyro', emoji: '🌀', title: 'VSI & Gyro Instruments', blurb: 'Spinning tops that show attitude', minutes: 6, xp: 50,
        phak: 'Chapter 8 → “Vertical Speed Indicator,” “Gyroscopic Flight Instruments,” “Attitude Indicator,” “Heading Indicator,” and “Turn Indicators”',
        cards: [
          { t: 'talk', html: `<p>The <b>vertical speed indicator (VSI)</b> shows how fast you’re climbing or descending in feet per minute. It shows the <b>trend</b> right away, but the exact <b>rate</b> lags behind by several seconds.</p>` },
          { t: 'talk', html: `<p><b>Gyroscopes</b> are fast-spinning wheels with two superpowers:</p><ul><li><b>Rigidity in space</b>: a spinning gyro stays pointed the same way no matter how you tilt around it.</li><li><b>Precession</b>: push on it, and it reacts 90° later in the direction of spin.</li></ul><p>Gyros are spun by a <b>vacuum pump</b> or electricity.</p>` },
          { t: 'talk', html: `<ul><li><b>Attitude indicator</b> (uses rigidity): shows pitch and bank against an artificial horizon. Read the bank from the <b>little airplane compared to the horizon bar</b>. In level flight, adjust the <b>little airplane to sit on the horizon bar</b>.</li><li><b>Heading indicator</b> (uses rigidity): shows heading without the compass’s bouncing. Precession makes it drift, so <b>reset it to the magnetic compass</b> about every 15 minutes.</li><li><b>Turn coordinator</b> (uses precession): shows the rate of roll and rate of turn. A <b>standard-rate turn</b> is <b>3° per second</b>, which is a full circle in 2 minutes.</li></ul>` },
          { t: 'check', q: 'A turn coordinator shows…',
            choices: ['Pitch and bank angle', 'Movement around the yaw and roll axes', 'Altitude changes'], answer: 1,
            explain: 'It shows the rate of roll and the rate of turn (yaw). The attitude indicator shows pitch and bank.' },
          { t: 'talk', html: `<p>Under the turn coordinator is the <b>inclinometer</b>: a ball in a curved glass tube. It shows if your turn is coordinated. If the ball slides off-center, <b>“step on the ball”</b>: press the rudder pedal on the side the ball went.</p>` },
          { t: 'test', html: `<ul><li>Attitude indicator in level flight → align the <b>miniature airplane to the horizon bar</b>.</li><li>Direction of bank → the <b>relationship of the miniature airplane to the horizon bar</b>.</li><li>Turn coordinator → movement about the <b>yaw and roll axes</b>.</li></ul>` }
        ]
      },
      {
        id: 'compass', emoji: '🧲', title: 'The Magnetic Compass', blurb: 'Variation, deviation and turning errors', minutes: 6, xp: 50,
        phak: 'Chapter 8 → “Compass Systems,” “Magnetic Variation,” “Magnetic Deviation,” and “Dip Errors”',
        cards: [
          { t: 'talk', html: `<p>The magnetic compass needs no power, so it always works. But it has quirks!</p>` },
          { t: 'diagram', svg: variation, caption: 'Magnetic north isn’t where the North Pole is.',
            html: `<p><b>Variation</b> is the angle between <b>true north</b> and <b>magnetic north</b>. It depends on where you are, and it’s shown on charts by dashed magenta <b>isogonic lines</b>. Changing a true heading to a magnetic one: <b>“East is least, West is best”</b>. Subtract east variation, add west.</p>` },
          { t: 'talk', html: `<p><b>Deviation</b> is error caused by magnetic fields <i>inside</i> the airplane: radios, wiring, metal. A small <b>compass correction card</b> in the cockpit lists it for different headings.</p>` },
          { t: 'talk', html: `<p>The compass gets confused when you turn or change speed. In the Northern Hemisphere:</p><ul><li><b>Turning error</b>: turning from a <b>north</b> heading, the compass first swings the <b>opposite</b> way and lags. Turning from <b>south</b>, it leads. Memory aid: <b>UNOS</b>, Undershoot North, Overshoot South (when rolling out).</li><li><b>Acceleration error</b> (on east or west headings): <b>ANDS</b>, Accelerate North, Decelerate South.</li></ul><p>The compass is only accurate in <b>straight, level, unaccelerated flight</b>.</p>` },
          { t: 'check', q: 'You’re heading EAST and you speed up. What does the compass do (Northern Hemisphere)?',
            choices: ['Shows a turn toward the north', 'Shows a turn toward the south', 'Stays perfectly steady'], answer: 0,
            explain: 'ANDS: Accelerate North. It’s a false indication; you’re still heading east.' },
          { t: 'test', html: `<ul><li>Variation = angle between <b>true and magnetic north</b>.</li><li>Deviation = <b>magnetic fields within the aircraft</b>.</li><li>Accelerating on an east or west heading → compass shows a <b>turn toward north</b>.</li><li>Rolling into a right turn from a <b>south</b> heading → the compass shows a right turn, but <b>faster</b> than it’s really happening.</li></ul>` }
        ]
      },
      {
        id: 'glass', emoji: '🖥️', title: 'Glass Cockpits', blurb: 'Screens instead of round dials', minutes: 4, xp: 50,
        phak: 'Chapter 8 → “Electronic Flight Display,” “Attitude and Heading Reference System (AHRS),” and “Air Data Computer (ADC)”',
        cards: [
          { t: 'talk', html: `<p>Many newer planes replace the “six-pack” of round dials with big screens:</p><ul><li>The <b>PFD</b> (Primary Flight Display) shows attitude, airspeed, altitude, vertical speed and heading all in one place.</li><li>The <b>MFD</b> (Multi-Function Display) shows maps, engine data, traffic and weather.</li></ul>` },
          { t: 'talk', html: `<p>Behind the screens:</p><ul><li><b>AHRS</b> (Attitude and Heading Reference System) uses solid-state sensors, not spinning gyros, to figure out attitude and heading.</li><li><b>ADC</b> (Air Data Computer) reads the pitot-static pressures and computes airspeed, altitude and vertical speed.</li></ul><p>Glass cockpits still have <b>backup instruments</b> in case the screens fail.</p>` },
          { t: 'check', q: 'Which component computes airspeed and altitude in a glass cockpit?',
            choices: ['AHRS', 'Air Data Computer (ADC)', 'Magnetic compass'], answer: 1,
            explain: 'The ADC takes pitot and static pressures and turns them into airspeed, altitude and vertical speed.' },
          { t: 'fact', html: `<p>Glass cockpits are amazing, but they can pull your eyes inside the cockpit. Great pilots keep looking <b>outside</b> for traffic, especially near airports.</p>` }
        ]
      }
    ],

    quizLength: 12,
    quiz: [
      { q: 'Which instrument will become inoperative if the pitot tube becomes clogged?', choices: ['Airspeed.', 'Altimeter.', 'Vertical speed.'], answer: 0, explain: 'Only the airspeed indicator uses pitot pressure.' },
      { q: 'Which instrument(s) will become inoperative if the static vents become clogged?', choices: ['Airspeed, altimeter, and vertical speed.', 'Airspeed only.', 'Altimeter only.'], answer: 0, explain: 'All three use static pressure.' },
      { q: 'If it is necessary to set the altimeter from 29.15 to 29.85, what change occurs?', choices: ['700-foot increase in indicated altitude.', '70-foot increase in indicated altitude.', '70-foot increase in density altitude.'], answer: 0, explain: 'About 1,000 feet per inch: 0.70 inch ≈ 700 feet.' },
      { q: 'If a flight is made from an area of low pressure into an area of high pressure without the altimeter setting being adjusted, the altimeter will indicate', choices: ['lower than the actual altitude above sea level.', 'higher than the actual altitude above sea level.', 'the actual altitude above sea level.'], answer: 0, explain: 'Low to high: the altimeter reads low (you’re actually higher).' },
      { q: 'If a flight is made from an area of high pressure into an area of lower pressure without the altimeter setting being adjusted, the altimeter will indicate', choices: ['higher than the actual altitude above sea level.', 'lower than the actual altitude above sea level.', 'the actual altitude above sea level.'], answer: 0, explain: '“High to low, look out below.”' },
      { q: 'Under what condition is indicated altitude the same as true altitude?', choices: ['When at sea level under standard conditions.', 'If the altimeter has no mechanical error.', 'When at 18,000 feet MSL with the altimeter set at 29.92.'], answer: 0, explain: 'Only in standard conditions do they match.' },
      { q: 'Under which condition will true altitude be lower than indicated altitude?', choices: ['In colder than standard air temperature.', 'In warmer than standard air temperature.', 'When density altitude is higher than indicated altitude.'], answer: 0, explain: 'Cold air is denser and “shrinks,” so you’re lower than the altimeter shows.' },
      { q: 'What is true altitude?', choices: ['The vertical distance of the aircraft above sea level.', 'The vertical distance of the aircraft above the surface.', 'The height above the standard datum plane.'], answer: 0, explain: 'True altitude = MSL. Absolute altitude = AGL.' },
      { q: 'What is absolute altitude?', choices: ['The vertical distance of the aircraft above the surface.', 'The altitude read directly from the altimeter.', 'The vertical distance of the aircraft above sea level.'], answer: 0, explain: 'Absolute altitude is height above ground level.' },
      { q: 'What is pressure altitude?', choices: ['The altitude indicated when the barometric pressure scale on the altimeter is set to 29.92.', 'The indicated altitude corrected for position and installation error.', 'The indicated altitude corrected for nonstandard temperature and pressure.'], answer: 0, explain: '29.92 in the Kollsman window gives pressure altitude.' },
      { q: 'Prior to takeoff, the altimeter should be set to which altitude or altimeter setting?', choices: ['The current local altimeter setting, if available, or the departure airport elevation.', 'The corrected density altitude of the departure airport.', 'The corrected pressure altitude for the departure airport.'], answer: 0, explain: 'Use the local setting; if none, set the field elevation.' },
      { q: 'On an airspeed indicator, the white arc represents the', choices: ['flap operating range.', 'normal operating range.', 'caution range.'], answer: 0, explain: 'White = flaps. Green = normal. Yellow = caution.' },
      { q: 'The upper limit of the green arc on the airspeed indicator is', choices: ['the maximum structural cruising speed (VNO).', 'the never-exceed speed (VNE).', 'the maximum flap extended speed (VFE).'], answer: 0, explain: 'Green arc top = VNO. Red line = VNE. White arc top = VFE.' },
      { q: 'The lower limit of the white arc on the airspeed indicator is', choices: ['the power-off stall speed in the landing configuration (VS0).', 'the power-off stall speed in a specified configuration (VS1).', 'the maximum flap extended speed (VFE).'], answer: 0, explain: 'Bottom of white = VS0. Bottom of green = VS1.' },
      { q: 'Which airspeed limitation is NOT marked on the airspeed indicator?', choices: ['Maneuvering speed (VA).', 'Never-exceed speed (VNE).', 'Maximum flap extended speed (VFE).'], answer: 0, explain: 'VA changes with weight, so it isn’t marked. Find it in the POH.' },
      { q: 'The proper adjustment to make on the attitude indicator during level flight is to align the', choices: ['miniature airplane to the horizon bar.', 'horizon bar to the miniature airplane.', 'horizon bar to the level-flight indication.'], answer: 0, explain: 'You adjust the little airplane to sit on the horizon.' },
      { q: 'How should a pilot determine the direction of bank from an attitude indicator?', choices: ['By the relationship of the miniature airplane to the deflected horizon bar.', 'By the direction of deflection of the banking scale.', 'By the direction of deflection of the horizon bar.'], answer: 0, explain: 'Compare the little airplane to the horizon bar.' },
      { q: 'A turn coordinator provides an indication of the', choices: ['movement of the aircraft about the yaw and roll axes.', 'angle of bank up to but not exceeding 30°.', 'attitude of the aircraft with reference to the longitudinal axis.'], answer: 0, explain: 'It shows rate of roll and rate of turn.' },
      { q: 'In the Northern Hemisphere, a magnetic compass will normally indicate a turn toward the north if', choices: ['the aircraft is accelerated while on an east or west heading.', 'a left turn is entered from an east heading.', 'a right turn is entered from a west heading.'], answer: 0, explain: 'ANDS: Accelerate North, Decelerate South.' },
      { q: 'During flight, when are the indications of a magnetic compass accurate?', choices: ['Only in straight-and-level unaccelerated flight.', 'As long as the airspeed is constant.', 'During turns if the bank does not exceed 18°.'], answer: 0, explain: 'Any turning or speed change causes errors.' },
      { q: 'Deviation in a magnetic compass is caused by the', choices: ['magnetic fields within the aircraft distorting the lines of magnetic force.', 'presence of flaws in the permanent magnets of the compass.', 'difference in the location between true north and magnetic north.'], answer: 0, explain: 'The third choice is variation.' },
      { q: 'The angular difference between true north and magnetic north is', choices: ['magnetic variation.', 'magnetic deviation.', 'compass acceleration error.'], answer: 0, explain: 'Variation is shown by isogonic lines on charts.' },
      { q: 'What should be the indication on the magnetic compass as you roll into a standard rate turn to the right from a south heading in the Northern Hemisphere?', choices: ['The compass will indicate a turn to the right, but at a faster rate than is actually occurring.', 'The compass will initially indicate a turn to the left.', 'The compass will remain on south for a short time, then gradually catch up.'], answer: 0, explain: 'Turning from south, the compass leads (overshoot south).' },
      { q: 'A standard-rate turn is a turn of', choices: ['3° per second (360° in 2 minutes).', '2° per second (360° in 3 minutes).', '6° per second (360° in 1 minute).'], answer: 0, explain: 'Standard rate = 3° per second.' }
    ],

    glossary: [
      { term: 'Pitot tube', def: 'A forward-facing tube that senses ram air pressure for the airspeed indicator.' },
      { term: 'Static port', def: 'A flush hole that senses outside still-air pressure for the ASI, altimeter and VSI.' },
      { term: 'Alternate static source', def: 'A backup static source inside the cabin. Makes the altimeter and ASI read slightly high.' },
      { term: 'Indicated airspeed', def: 'The speed shown on the airspeed indicator.' },
      { term: 'True airspeed', def: 'Actual speed through the air: indicated airspeed corrected for altitude and temperature.' },
      { term: 'Groundspeed', def: 'Speed over the ground: true airspeed plus or minus the wind.' },
      { term: 'VS0', def: 'Stall speed in the landing configuration (bottom of the white arc).' },
      { term: 'VS1', def: 'Stall speed in a specified (usually clean) configuration (bottom of the green arc).' },
      { term: 'VFE', def: 'Maximum flap extended speed (top of the white arc).' },
      { term: 'VNO', def: 'Maximum structural cruising speed (top of the green arc).' },
      { term: 'VNE', def: 'Never-exceed speed (the red line).' },
      { term: 'Kollsman window', def: 'The small window on the altimeter where the pilot sets the altimeter setting.' },
      { term: 'Altimeter setting', def: 'The local pressure value set in the altimeter so it reads correct altitude.' },
      { term: 'True altitude', def: 'Height above mean sea level (MSL).' },
      { term: 'Absolute altitude', def: 'Height above ground level (AGL).' },
      { term: 'VSI', def: 'Vertical speed indicator: shows climb or descent rate in feet per minute.' },
      { term: 'Rigidity in space', def: 'A spinning gyro’s tendency to stay pointed the same way.' },
      { term: 'Precession', def: 'A gyro’s reaction to a force, showing up 90° later in the direction of rotation.' },
      { term: 'Attitude indicator', def: 'A gyro instrument showing pitch and bank against an artificial horizon.' },
      { term: 'Heading indicator', def: 'A gyro instrument showing heading. Reset it to the compass periodically.' },
      { term: 'Turn coordinator', def: 'Shows rate of roll and rate of turn. Includes the inclinometer ball.' },
      { term: 'Standard-rate turn', def: '3° per second: a full circle in 2 minutes.' },
      { term: 'Variation', def: 'The angle between true north and magnetic north.' },
      { term: 'Deviation', def: 'Compass error caused by magnetic fields inside the aircraft.' },
      { term: 'PFD / MFD', def: 'Primary Flight Display and Multi-Function Display in a glass cockpit.' }
    ]
  });
})();
