// Chapter 14 — Airport Operations (PHAK FAA-H-8083-25C)
(() => {
  const { arrow, txt, lines, box, svg } = SKY.draw;

  const runway = svg(320, 200, `
    <rect x="10" y="50" width="300" height="56" style="fill:#4b5563"/>
    ${[18, 30].map((x) => `<path d="M${x},58 L${x + 10},78 L${x},98" style="stroke:#facc15;fill:none" stroke-width="3"/>`).join('')}
    <line x1="50" y1="50" x2="50" y2="106" style="stroke:#facc15" stroke-width="2"/>
    ${[60, 88].map((x) => arrow(x, 78, x + 18, 78, 'd-white', 2.5).replace(/d-white/g, 'd-ink" style="stroke:#fff;fill:#fff')).join('')}
    ${[60, 70, 80, 90].map((y) => `<polygon points="${112},${y - 4} ${120},${y} ${112},${y + 4}" style="fill:#fff"/>`).join('')}
    <rect x="120" y="50" width="4" height="56" style="fill:#fff"/>
    ${[54, 62, 70, 82, 90, 98].map((y) => `<rect x="128" y="${y}" width="18" height="4" style="fill:#fff"/>`).join('')}
    <text x="0" y="0" transform="translate(166,78) rotate(90)" text-anchor="middle" style="fill:#fff;font:800 22px ui-rounded,system-ui">9</text>
    <rect x="200" y="58" width="22" height="7" style="fill:#fff"/><rect x="200" y="91" width="22" height="7" style="fill:#fff"/>
    ${[234, 262, 290].map((x) => `<rect x="${x}" y="76.5" width="16" height="3" style="fill:#fff"/>`).join('')}
    <rect x="252" y="106" width="30" height="70" style="fill:#6b7280"/>
    <line x1="252" y1="122" x2="282" y2="122" style="stroke:#facc15" stroke-width="2" stroke-dasharray="4 3"/><line x1="252" y1="126" x2="282" y2="126" style="stroke:#facc15" stroke-width="2" stroke-dasharray="4 3"/>
    <line x1="252" y1="131" x2="282" y2="131" style="stroke:#facc15" stroke-width="2"/><line x1="252" y1="135" x2="282" y2="135" style="stroke:#facc15" stroke-width="2"/>
    ${txt(28, 30, 'Blast pad', 'd-small')}${txt(28, 40, '(chevrons)', 'd-small')}${txt(90, 30, 'Displaced', 'd-small')}${txt(90, 40, 'threshold', 'd-small')}
    ${txt(136, 124, 'Threshold', 'd-small')}${txt(166, 40, 'Runway 9', 'd-small')}${txt(211, 124, 'Aiming point', 'd-small')}
    ${txt(244, 152, 'Hold short:', 'd-small', 'end')}${txt(244, 162, 'stop at the', 'd-small', 'end')}${txt(244, 172, 'SOLID lines', 'd-small', 'end')}
    ${txt(160, 196, 'Landing direction →', 'd-text')}`,
    'Runway markings: blast pad chevrons, displaced threshold arrows, threshold bars, runway number, aiming point, centerline and a hold short line');

  const signs = svg(320, 130, `
    <rect x="8" y="14" width="68" height="30" rx="3" style="fill:#dc2626"/>${txt(42, 35, '9-27', 't-white d-text')}
    <rect x="88" y="14" width="34" height="30" rx="3" style="fill:#111827;stroke:#facc15" stroke-width="2"/><text x="105" y="35" text-anchor="middle" style="fill:#facc15;font:800 15px ui-rounded,system-ui">B</text>
    <rect x="134" y="14" width="56" height="30" rx="3" style="fill:#facc15"/><text x="162" y="35" text-anchor="middle" style="fill:#111827;font:800 15px ui-rounded,system-ui">← A</text>
    <rect x="202" y="14" width="34" height="30" rx="3" style="fill:#111827"/><text x="219" y="35" text-anchor="middle" style="fill:#fff;font:800 15px ui-rounded,system-ui">3</text>
    <rect x="248" y="14" width="64" height="30" rx="3" style="fill:#dc2626"/><text x="280" y="35" text-anchor="middle" style="fill:#fff;font:800 12px ui-rounded,system-ui">⛔ NO ENTRY</text>
    ${lines(42, 62, ['MANDATORY', 'Runway hold', 'position'], 'd-small', 'middle', 10)}${lines(105, 62, ['LOCATION', 'You are on', 'taxiway B'], 'd-small', 'middle', 10)}
    ${lines(162, 62, ['DIRECTION', 'Taxiway A', 'is to the left'], 'd-small', 'middle', 10)}${lines(219, 62, ['DISTANCE', '3,000 ft of', 'runway left'], 'd-small', 'middle', 10)}
    ${lines(280, 62, ['MANDATORY', 'Do not', 'enter'], 'd-small', 'middle', 10)}
    ${txt(160, 120, 'Red = must obey · Black/yellow = where you are · Yellow/black = where to go', 'd-small')}`,
    'Airport signs: red mandatory signs, black location signs, yellow direction signs and runway distance remaining signs');

  const pattern = svg(320, 200, `
    <rect x="90" y="148" width="140" height="12" rx="2" class="d-runway"/>${txt(160, 176, 'Runway 9 →', 'd-small')}
    <path d="M230,154 L280,154 Q300,154 300,134 L300,70 Q300,50 280,50 L60,50 Q40,50 40,70 L40,134 Q40,154 60,154 L90,154" class="d-thrust" stroke-width="2.5" style="fill:none" stroke-dasharray="7 4"/>
    ${arrow(255, 154, 268, 154, 'd-thrust', 2.5)}${arrow(300, 110, 300, 96, 'd-thrust', 2.5)}${arrow(180, 50, 166, 50, 'd-thrust', 2.5)}${arrow(40, 94, 40, 108, 'd-thrust', 2.5)}${arrow(64, 154, 78, 154, 'd-thrust', 2.5)}
    ${arrow(250, 6, 186, 44, 'd-accent', 3)}${txt(256, 16, '45° entry', 't-accent d-text', 'start')}
    ${txt(266, 170, 'Departure', 'd-small')}${txt(306, 100, 'Crosswind', 'd-small', 'start').replace('start', 'end').replace('x="306"', 'x="292"')}
    ${txt(150, 70, 'DOWNWIND (about 1,000 ft AGL)', 't-thrust d-text')}${txt(48, 100, 'Base', 'd-small', 'start')}${txt(70, 144, 'Final', 'd-small')}
    ${txt(160, 110, 'Standard pattern: LEFT turns', 'd-text')}`,
    'Left-hand traffic pattern with departure, crosswind, downwind, base and final legs and a 45 degree entry to midfield downwind');

  const papi = svg(320, 200, [
    [['W', 'W', 'W', 'W'], 'Too high'], [['W', 'W', 'W', 'R'], 'Slightly high'], [['W', 'W', 'R', 'R'], 'On glidepath ✓'],
    [['W', 'R', 'R', 'R'], 'Slightly low'], [['R', 'R', 'R', 'R'], 'Too low!']].map(([ls, s], i) => {
      const y = 22 + i * 38;
      return ls.map((c, j) => `<circle cx="${40 + j * 26}" cy="${y}" r="10" style="fill:${c === 'W' ? '#fff' : '#ef4444'};stroke:#6b7280" stroke-width="1.5"/>`).join('') +
        txt(160, y + 4, s, i === 2 ? 't-ok d-text' : i === 4 ? 't-weight d-text' : 'd-text', 'start');
    }).join(''), 'PAPI lights: four white is too high, two white two red is on glidepath, four red is too low');

  SKY.registerChapter({
    id: 'ch14',
    badge: { name: 'Airport Insider', emoji: '🛬', desc: 'You can read signs, lights and markings and fly a perfect traffic pattern.' },
    game: {
      engine: 'sort', title: 'Rapid Sort', blurb: 'Signs, light guns and PAPI lights', xpEach: 30,
      rounds: [
        { id: 'signs', title: 'Read the Sign', brief: 'What kind of airport sign is it?',
          buckets: ['Mandatory (red)', 'Location (black)', 'Direction (yellow)'],
          items: [
            { t: 'Red background, white letters', b: 0 }, { t: 'Black background, yellow letters and border', b: 1 },
            { t: 'Yellow background, black letters and an arrow', b: 2 }, { t: '“9-27” at a hold short line', b: 0 },
            { t: 'Tells you which taxiway you’re on', b: 1 }, { t: 'Points the way to taxiway C', b: 2 },
            { t: '“NO ENTRY”', b: 0 }, { t: 'Never has an arrow', b: 1 }] },
        { id: 'gground', title: 'Light Gun: On the Ground', brief: 'Your radio died. The tower flashes a light at you on the ground. What does it mean?',
          buckets: ['Cleared to taxi', 'Cleared for takeoff', 'Stop', 'Taxi clear of runway', 'Return to start'],
          items: [
            { t: 'Flashing green', b: 0 }, { t: 'Steady green', b: 1 }, { t: 'Steady red', b: 2 }, { t: 'Flashing red', b: 3 }, { t: 'Flashing white', b: 4 }] },
        { id: 'gair', title: 'Light Gun: In the Air', brief: 'Now you’re flying near the airport. What does the light mean?',
          buckets: ['Cleared to land', 'Return for landing', 'Give way, keep circling', 'Airport unsafe — don’t land'],
          items: [
            { t: 'Steady green', b: 0 }, { t: 'Flashing green', b: 1, why: 'Flashing green in the air = return for landing (then expect steady green).' }, { t: 'Steady red', b: 2 }, { t: 'Flashing red', b: 3 }] },
        { id: 'papi', title: 'PAPI Check', brief: 'Read the four PAPI lights (left to right).',
          buckets: ['Too high', 'Slightly high', 'On glidepath', 'Slightly low', 'Too low'],
          items: [
            { t: '⚪⚪⚪⚪', b: 0 }, { t: '⚪⚪⚪🔴', b: 1 }, { t: '⚪⚪🔴🔴', b: 2 }, { t: '⚪🔴🔴🔴', b: 3 }, { t: '🔴🔴🔴🔴', b: 4 }] }
      ]
    },
    missions: [
      {
        id: 'radio', emoji: '📻', title: 'Airports, Towers & Radio', blurb: 'Talking like a pilot', minutes: 6, xp: 50,
        phak: 'Chapter 14 → “Airport Categories,” “Radio Communications,” and “Air Traffic Control (ATC) Services”',
        cards: [
          { t: 'talk', html: `<p>Some airports have a <b>control tower</b> that tells everyone when to taxi, take off and land. Many smaller airports are <b>nontowered</b>: pilots coordinate by announcing their position on a shared frequency called the <b>CTAF</b> (Common Traffic Advisory Frequency), often the <b>UNICOM</b>.</p><p>The <b>Chart Supplement</b> lists every public airport’s runways, frequencies and services.</p>` },
          { t: 'talk', html: `<p>Pilots use the <b>phonetic alphabet</b> so letters can’t be confused: Alpha, Bravo, Charlie, Delta, Echo, Foxtrot… Numbers are said one at a time (“one two three”), and 9 is “<b>niner</b>.”</p><p>Aviation uses <b>Zulu time</b> (UTC), the time in Greenwich, England, so everyone worldwide uses the same clock.</p>` },
          { t: 'talk', html: `<p>Your <b>transponder</b> sends a 4-digit code to ATC radar. Know these:</p><ul><li><b>1200</b>: normal VFR flying.</li><li><b>7500</b>: hijacking.</li><li><b>7600</b>: lost radio communications.</li><li><b>7700</b>: emergency.</li></ul><p>When changing codes, avoid accidentally passing through 7500, 7600 or 7700!</p>` },
          { t: 'check', q: 'ATC says “radar service terminated, squawk VFR.” What code do you set?',
            choices: ['0000', '1200', '7700'], answer: 1,
            explain: '1200 is the VFR code.' },
          { t: 'tryit', html: `<p>Search for <b>LiveATC</b> and listen to a real control tower. See if you can catch an airplane’s callsign, the runway, and the phonetic letters!</p>` }
        ]
      },
      {
        id: 'markings', emoji: '🛣️', title: 'Runway Markings & Signs', blurb: 'Reading the pavement', minutes: 7, xp: 50,
        phak: 'Chapter 14 → “Airport Markings and Signs”',
        cards: [
          { t: 'talk', html: `<p><b>Runway numbers</b> are the runway’s <b>magnetic</b> direction divided by 10. Runway 9 points about 090° magnetic; the other end is Runway 27 (270°).</p>` },
          { t: 'diagram', svg: runway, caption: 'Runway markings, from the approach end.',
            html: `<ul><li><b>Displaced threshold</b> (white arrows): you can use it for <b>taxiing and takeoff</b> (and rollout from the other direction), but <b>don’t land</b> on it.</li><li><b>Blast pad / stopway</b> (yellow chevrons): not for taxi, takeoff or landing.</li><li><b>Closed runway</b>: big yellow or white X.</li><li><b>Hold short line</b>: two solid + two dashed yellow lines. Stop on the <b>solid side</b>.</li></ul>` },
          { t: 'check', q: 'The area before a displaced threshold (marked with white arrows) may be used for…',
            choices: ['Landing', 'Taxiing and takeoff', 'Nothing; it’s closed'], answer: 1,
            explain: 'You can taxi and take off on it (and roll out from the opposite direction), but not touch down there.' },
          { t: 'diagram', svg: signs, caption: 'Airport signs are color-coded.' },
          { t: 'test', html: `<ul><li>Runway 9/27 → about <b>090° and 270° magnetic</b>.</li><li>Hold at the hold short line on the <b>solid-line</b> side.</li><li>Pilots must <b>read back</b> all hold short instructions.</li></ul>` }
        ]
      },
      {
        id: 'lights', emoji: '💡', title: 'Airport Lighting', blurb: 'Beacons, PAPIs and clicking the mic', minutes: 6, xp: 50,
        phak: 'Chapter 14 → “Airport Lighting,” “Airport Beacon,” “Visual Glideslope Indicators,” and “Pilot-Controlled Lighting”',
        cards: [
          { t: 'talk', html: `<p>The rotating <b>airport beacon</b> tells you what kind of airport it is at night:</p><ul><li><b>White and green</b>: lighted land airport.</li><li><b>Two quick white flashes between green</b>: military airport.</li><li><b>White and yellow</b>: water (seaplane) airport.</li><li><b>Green, yellow and white</b>: heliport.</li></ul><p>If the beacon is on during the <b>day</b> at a controlled airport, the weather may be below VFR minimums!</p>` },
          { t: 'talk', html: `<p>Runway edge lights are <b>white</b>. The threshold shows <b>green</b> to arriving airplanes, and the runway end shows <b>red</b>. Taxiway edges are <b>blue</b> and taxiway centerlines are <b>green</b>.</p>` },
          { t: 'diagram', svg: papi, caption: 'A PAPI shows if you’re on the right glidepath.',
            html: `<p>Older <b>VASI</b> lights use two bars: “<b>red over white, you’re all right</b>; red over red, you’re dead; white over white, you’re high as a kite.” When an airport has a VASI, stay <b>at or above</b> the glide slope until a lower altitude is needed for landing.</p>` },
          { t: 'check', q: 'A PAPI shows three white lights and one red. You are…',
            choices: ['Slightly high', 'On glidepath', 'Slightly low'], answer: 0,
            explain: 'More white = higher. 2 white + 2 red is on glidepath.' },
          { t: 'talk', html: `<p>At many small airports, the runway lights are <b>pilot-controlled</b>: you click your microphone on the CTAF. <b>7 clicks</b> in 5 seconds = high intensity, <b>5 clicks</b> = medium, <b>3 clicks</b> = low.</p>` },
          { t: 'test', html: `<ul><li>Civil land airport beacon → <b>white and green</b>. Heliport → <b>green, yellow and white</b>.</li><li>Daytime beacon in Class D → weather may be <b>below basic VFR</b>.</li><li>Medium-intensity lights → click 7 times, then <b>5 times within 5 seconds</b>.</li></ul>` }
        ]
      },
      {
        id: 'pattern', emoji: '🔲', title: 'The Traffic Pattern', blurb: 'The racetrack around every runway', minutes: 6, xp: 50,
        phak: 'Chapter 14 → “Traffic Patterns,” “Wind Direction Indicators,” and “Segmented Circle”',
        cards: [
          { t: 'diagram', svg: pattern, caption: 'The traffic pattern keeps everyone in a predictable line.',
            html: `<p>Five legs: <b>departure → crosswind → downwind → base → final</b>. Unless the airport says otherwise, all turns are to the <b>left</b>. Pattern altitude is usually about <b>1,000 feet AGL</b>.</p>` },
          { t: 'talk', html: `<p>Arriving at a nontowered airport? The recommended entry is to fly <b>45° to the downwind leg</b>, joining it at <b>midfield</b>, at pattern altitude. Announce your position on the CTAF on each leg.</p><p>Which runway? Take off and land <b>into the wind</b>. Check the <b>wind sock</b> (it points <i>away</i> from the wind) or the <b>segmented circle</b>, which also shows whether a runway uses right or left traffic.</p>` },
          { t: 'check', q: 'What is the recommended way to enter the traffic pattern?',
            choices: ['Fly 45° to the downwind leg and join at midfield, at pattern altitude', 'Fly straight in to final from 10 miles out', 'Cross over the runway and join base leg'], answer: 0,
            explain: 'The 45° entry gives you a great view of other traffic.' },
          { t: 'fact', html: `<p>Busy airports like Oshkosh during the EAA AirVenture fly-in handle thousands of airplanes. Controllers sometimes land three airplanes on one runway at the same time, using colored dots painted on the pavement!</p>` },
          { t: 'test', html: `<p>At a nontowered airport in Class G airspace, make <b>all turns to the left</b> unless otherwise indicated.</p>` }
        ]
      },
      {
        id: 'safety', emoji: '👀', title: 'Right-of-Way & See and Avoid', blurb: 'Who goes first, and spotting traffic', minutes: 7, xp: 50,
        phak: 'Chapter 14 → “Right-of-Way Rules,” “Collision Avoidance,” “Runway Incursion Avoidance,” and “ATC Light Signals”',
        cards: [
          { t: 'talk', html: `<p><b>Right-of-way</b> rules (who has to move out of the way):</p><ul><li>An aircraft <b>in distress</b> beats everyone.</li><li>The least maneuverable goes first: <b>balloon → glider → airship → airplane/helicopter</b>.</li><li>Same type, converging: the aircraft <b>on the right</b> has right-of-way.</li><li><b>Head-on</b>: both turn <b>right</b>.</li><li><b>Overtaking</b>: the slower one has right-of-way. Pass on its <b>right</b>.</li><li><b>Landing</b>: the <b>lower</b> aircraft has right-of-way, but can’t use that to cut in front.</li></ul>` },
          { t: 'check', q: 'An airplane and an airship are converging. The airship is to the LEFT of the airplane. Who has the right-of-way?',
            choices: ['The airship', 'The airplane', 'Both turn right'], answer: 0,
            explain: 'An airship is less maneuverable than an airplane, so it has the right-of-way no matter which side it’s on.' },
          { t: 'talk', html: `<p><b>See and avoid</b>: it’s your job to spot other aircraft. Scan the sky in short, regular eye movements, about <b>10° at a time</b>, pausing about a second on each part.</p><p>Here’s the sneaky part: an airplane on a <b>collision course</b> doesn’t seem to move. It just stays in the same spot on your windshield and slowly gets bigger. <b>No relative motion = danger!</b></p>` },
          { t: 'talk', html: `<p>If your radio fails near a towered airport, the tower uses a <b>light gun</b>:</p><table style="width:100%;font-size:14px"><tr><th style="text-align:left">Light</th><th style="text-align:left">On the ground</th><th style="text-align:left">In the air</th></tr><tr><td>Steady green</td><td>Cleared for takeoff</td><td>Cleared to land</td></tr><tr><td>Flashing green</td><td>Cleared to taxi</td><td>Return for landing</td></tr><tr><td>Steady red</td><td>Stop</td><td>Give way, keep circling</td></tr><tr><td>Flashing red</td><td>Taxi clear of runway</td><td>Airport unsafe, don’t land</td></tr><tr><td>Flashing white</td><td>Return to starting point</td><td>—</td></tr><tr><td>Alternating red/green</td><td colspan="2">Exercise extreme caution</td></tr></table>` },
          { t: 'talk', html: `<p>Taxiing in strong wind? Position the controls so the wind can’t lift a wing or flip the plane:</p><ul><li><b>Quartering headwind</b>: aileron <b>up</b> on the side the wind is coming from (turn the yoke <i>toward</i> the wind).</li><li><b>Quartering tailwind</b>: aileron <b>down</b> on the wind side, elevator down. Pilots say “<b>dive away from the wind</b>.”</li></ul>` },
          { t: 'test', html: `<ul><li>Aircraft in distress has right-of-way over <b>all</b>.</li><li>Glider and airplane head-on → <b>both give way to the right</b>.</li><li>Collision course → <b>no apparent relative motion</b>.</li><li>Steady green in flight → <b>cleared to land</b>. Flashing white on the ground → <b>return to the starting point</b>.</li></ul>` }
        ]
      }
    ],

    quizLength: 12,
    quiz: [
      { q: 'The numbers 9 and 27 on a runway indicate that the runway is oriented approximately', choices: ['090° and 270° magnetic.', '009° and 027° true.', '090° and 270° true.'], answer: 0, explain: 'Runway numbers are magnetic headings divided by 10.' },
      { q: 'When approaching to land on a runway served by a visual approach slope indicator (VASI), the pilot shall', choices: ['maintain an altitude at or above the glide slope.', 'maintain an altitude that captures the glide slope at least 2 miles downwind from the runway threshold.', 'remain on the glide slope and land between the two-light bar.'], answer: 0, explain: 'Stay at or above until a lower altitude is necessary for landing.' },
      { q: 'A slightly high glide slope indication from a precision approach path indicator (PAPI) is', choices: ['three white lights and one red light.', 'four white lights.', 'two white lights and two red lights.'], answer: 0, explain: 'Four white is high; two and two is on path.' },
      { q: 'A lighted heliport may be identified by a', choices: ['green, yellow, and white rotating beacon.', 'flashing yellow light.', 'blue lighted square landing area.'], answer: 0, explain: 'Heliports use green, yellow and white.' },
      { q: 'A military air station can be identified by a rotating beacon that emits', choices: ['two quick, white flashes between green flashes.', 'white and green alternating flashes.', 'green, yellow, and white flashes.'], answer: 0, explain: 'Dual-peaked white flashes between greens = military.' },
      { q: 'An airport’s rotating beacon operated during daylight hours indicates', choices: ['that weather at the airport located in Class D airspace is below basic VFR weather minimums.', 'there are obstructions on the airport.', 'the Air Traffic Control tower is not in operation.'], answer: 0, explain: 'A daytime beacon can signal IFR conditions.' },
      { q: 'To set the high intensity runway lights on medium intensity, the pilot should click the microphone seven times, and then click it', choices: ['five times within five seconds.', 'one time within four seconds.', 'three times within three seconds.'], answer: 0, explain: '7 = high, 5 = medium, 3 = low.' },
      { q: 'The portion of a runway before a displaced threshold, marked with arrows, may be used for', choices: ['taxiing and takeoff.', 'landing.', 'taxiing and landing.'], answer: 0, explain: 'Don’t touch down before the displaced threshold.' },
      { q: 'A steady green light signal directed from the control tower to an aircraft in flight is a signal that the pilot', choices: ['is cleared to land.', 'should give way to other aircraft and continue circling.', 'should return for landing.'], answer: 0, explain: 'Steady green in the air = cleared to land.' },
      { q: 'A flashing white light signal from the control tower to a taxiing aircraft is an indication to', choices: ['return to the starting point on the airport.', 'taxi at a faster speed.', 'taxi only on taxiways and not cross runways.'], answer: 0, explain: 'Flashing white = return to start.' },
      { q: 'While on final approach for landing, an alternating green and red light followed by a flashing red light is received from the control tower. The pilot should', choices: ['exercise extreme caution and abandon the approach, realizing the airport is unsafe for landing.', 'discontinue the approach, fly the same traffic pattern and approach again, and land.', 'abandon the approach, circle the airport to the right, and expect a flashing white light.'], answer: 0, explain: 'Alternating = caution; flashing red in the air = airport unsafe.' },
      { q: 'If Air Traffic Control advises that radar service is terminated when the pilot is departing Class C airspace, the transponder should be set to code', choices: ['1200.', '0000.', '4096.'], answer: 0, explain: '1200 = VFR.' },
      { q: 'When making routine transponder code changes, pilots should avoid inadvertent selection of which codes?', choices: ['7500, 7600, 7700.', '0700, 1700, 7000.', '1200, 1500, 7000.'], answer: 0, explain: 'Hijack, lost comm and emergency.' },
      { q: 'Which aircraft has the right-of-way over all other air traffic?', choices: ['An aircraft in distress.', 'A balloon.', 'An aircraft on final approach to land.'], answer: 0, explain: 'Distress beats everything.' },
      { q: 'What action should the pilots of a glider and an airplane take if on a head-on collision course?', choices: ['Both pilots should give way to the right.', 'The airplane pilot should give way to the left.', 'The glider pilot should give way to the right.'], answer: 0, explain: 'Head-on: everyone turns right.' },
      { q: 'When two or more aircraft are approaching an airport for the purpose of landing, the right-of-way belongs to the aircraft', choices: ['at the lower altitude, but it shall not take advantage of this rule to cut in front of or to overtake another.', 'that has the other to its right.', 'that is the least maneuverable.'], answer: 0, explain: 'Lower aircraft has right-of-way when landing.' },
      { q: 'An airplane and an airship are converging. If the airship is left of the airplane’s position, which aircraft has the right-of-way?', choices: ['The airship.', 'The airplane.', 'Each pilot should alter course to the right.'], answer: 0, explain: 'Less maneuverable aircraft has right-of-way.' },
      { q: 'The most effective method of scanning for other aircraft for collision avoidance during daylight hours is to use', choices: ['a series of short, regularly spaced eye movements to search each 10-degree sector.', 'regularly spaced concentration on the 3-, 9-, and 12-o’clock positions.', 'peripheral vision by scanning small sectors and utilizing off-center viewing.'], answer: 0, explain: 'Short sweeps, about 10° at a time.' },
      { q: 'How can you determine if another aircraft is on a collision course with your aircraft?', choices: ['There will be no apparent relative motion between your aircraft and the other aircraft.', 'The other aircraft will always appear to get larger and closer at a rapid rate.', 'The nose of each aircraft is pointed at the same point in space.'], answer: 0, explain: 'If it stays in the same spot on the windshield, watch out!' },
      { q: 'When approaching to land at an airport without an operating control tower in Class G airspace, the pilot should', choices: ['make all turns to the left, unless otherwise indicated.', 'enter and fly a traffic pattern at 800 feet AGL.', 'fly a left-hand traffic pattern at 800 feet AGL.'], answer: 0, explain: 'Left traffic is standard.' },
      { q: 'The recommended entry position to an airport traffic pattern is', choices: ['to enter 45° at the midpoint of the downwind leg at traffic pattern altitude.', '45° to the base leg just below traffic pattern altitude.', 'to cross directly over the airport at traffic pattern altitude and join the downwind leg.'], answer: 0, explain: 'The 45° entry to midfield downwind.' },
      { q: 'When taxiing with strong quartering tailwinds, which aileron positions should be used?', choices: ['Aileron down on the side from which the wind is blowing.', 'Aileron up on the side from which the wind is blowing.', 'Neutral.'], answer: 0, explain: '“Dive away from the wind.”' },
      { q: 'Which aileron positions should a pilot generally use when taxiing in strong quartering headwinds?', choices: ['Aileron up on the side from which the wind is blowing.', 'Aileron down on the side from which the wind is blowing.', 'Neutral.'], answer: 0, explain: 'Turn the yoke into the wind.' }
    ],

    glossary: [
      { term: 'CTAF', def: 'Common Traffic Advisory Frequency: where pilots announce positions at nontowered airports.' },
      { term: 'UNICOM', def: 'A non-government radio station at an airport, often used as the CTAF.' },
      { term: 'Chart Supplement', def: 'The FAA directory of airports, with runways, frequencies and services.' },
      { term: 'Zulu time', def: 'Coordinated Universal Time (UTC), used for all aviation times.' },
      { term: 'Squawk', def: 'The 4-digit transponder code. 1200 = VFR, 7700 = emergency.' },
      { term: 'Displaced threshold', def: 'A threshold moved down the runway. The area before it is for taxi and takeoff, not landing.' },
      { term: 'Hold short line', def: 'Two solid and two dashed yellow lines. Stop on the solid side.' },
      { term: 'Mandatory sign', def: 'Red with white letters. You must obey it, for example a runway holding position.' },
      { term: 'Location sign', def: 'Black with yellow letters. Shows which taxiway or runway you are on.' },
      { term: 'Direction sign', def: 'Yellow with black letters and an arrow. Shows the way to a taxiway.' },
      { term: 'Airport beacon', def: 'A rotating light. White/green = civil land airport.' },
      { term: 'VASI / PAPI', def: 'Lights that show if you are on the correct glidepath to the runway.' },
      { term: 'Pilot-controlled lighting', def: 'Runway lights turned on by clicking the mic: 7 high, 5 medium, 3 low.' },
      { term: 'Traffic pattern', def: 'The standard path around a runway: departure, crosswind, downwind, base, final.' },
      { term: 'Segmented circle', def: 'A ground marker showing wind direction and traffic pattern direction.' },
      { term: 'Right-of-way', def: 'Who must give way. Aircraft in distress first, then balloon, glider, airship, airplane.' },
      { term: 'See and avoid', def: 'The pilot’s duty to watch for and avoid other aircraft.' },
      { term: 'Light gun signals', def: 'Colored lights from the tower used when radios don’t work.' },
      { term: 'Runway incursion', def: 'An aircraft, vehicle or person on a runway where they shouldn’t be.' }
    ]
  });
})();
