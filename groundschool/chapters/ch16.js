// Chapter 16 — Navigation (PHAK FAA-H-8083-25C)
(() => {
  const { arrow, txt, lines, box, svg, planeTop } = SKY.draw;

  const chain = svg(320, 120, `
    ${[['TRUE', 'COURSE', 'TC'], ['TRUE', 'HEADING', 'TH'], ['MAGNETIC', 'HEADING', 'MH'], ['COMPASS', 'HEADING', 'CH']].map(([a, b, c], i) => {
      const x = 6 + i * 80;
      return box(x, 30, 68, 50, i === 3 ? 'd-accent' : 'd-box') + txt(x + 34, 50, a, i === 3 ? 't-white d-small' : 'd-small') + txt(x + 34, 61, b, i === 3 ? 't-white d-small' : 'd-small') + txt(x + 34, 74, c, i === 3 ? 't-white d-text' : 't-brand d-text') +
        (i < 3 ? arrow(x + 69, 55, x + 79, 55, 'd-ink', 2) : '');
    }).join('')}
    ${txt(87, 98, '± wind', 'd-small')}${txt(87, 108, 'correction', 'd-small')}${txt(167, 98, '± variation', 'd-small')}${txt(167, 108, 'E least, W best', 't-brand d-small')}${txt(247, 98, '± deviation', 'd-small')}${txt(247, 108, '(compass card)', 'd-small')}
    ${txt(160, 18, '“TV Makes Dull Children”: True, Variation, Magnetic, Deviation, Compass', 'd-small')}`,
    'Converting true course to compass heading: correct for wind, then variation, then deviation');

  const crab = svg(320, 180, `
    <line x1="160" y1="170" x2="160" y2="10" class="d-ok" stroke-width="3" stroke-dasharray="8 5"/>${txt(172, 20, 'Course (where you want to go)', 't-ok d-small', 'start')}
    <g transform="rotate(-14 160 95)">${planeTop(120, 55, 80)}<line x1="160" y1="58" x2="160" y2="20" class="d-thrust" stroke-width="2.5"/></g>
    ${txt(52, 26, 'Heading', 't-thrust d-text')}${txt(52, 38, '(where the nose points)', 'd-small')}
    ${arrow(16, 120, 96, 120, 'd-accent', 4)}${txt(40, 140, 'Wind from', 't-accent d-small')}${txt(40, 151, 'the left', 't-accent d-small')}
    ${txt(240, 120, 'Crab INTO the wind:', 'd-text')}${txt(240, 133, 'the nose points a bit left,', 'd-small')}${txt(240, 144, 'the plane tracks straight', 'd-small')}`,
    'Wind correction: with wind from the left, point the nose slightly left so the airplane tracks along the course');

  const globe = svg(320, 170, `
    <circle cx="90" cy="85" r="70" class="d-sky" style="stroke:var(--ink)" stroke-width="2"/>
    ${[-42, -21, 21, 42].map((d) => `<line x1="${90 - Math.sqrt(70 * 70 - d * d)}" y1="${85 + d}" x2="${90 + Math.sqrt(70 * 70 - d * d)}" y2="${85 + d}" class="d-thrust" stroke-width="1.5"/>`).join('')}
    <line x1="20" y1="85" x2="160" y2="85" class="d-thrust" stroke-width="3"/>
    ${[22, 46].map((rx) => `<ellipse cx="90" cy="85" rx="${rx}" ry="70" class="d-weight" stroke-width="1.5" style="fill:none"/>`).join('')}
    <line x1="90" y1="15" x2="90" y2="155" class="d-weight" stroke-width="3"/>
    ${txt(240, 50, 'LATITUDE', 't-thrust d-text')}${lines(240, 64, ['Lines running east-west,', 'measured N or S of the', 'equator (0° to 90°)'], 'd-small', 'middle', 11)}
    ${txt(240, 112, 'LONGITUDE', 't-weight d-text')}${lines(240, 126, ['Lines running north-south,', 'measured E or W of the', 'prime meridian (0° to 180°)'], 'd-small', 'middle', 11)}`,
    'A globe with latitude lines parallel to the equator and longitude lines running pole to pole');

  SKY.registerChapter({
    id: 'ch16',
    badge: { name: 'Cross-Country Captain', emoji: '🧭', desc: 'You can plan a flight, correct for wind, and navigate by chart, VOR and GPS.' },
    game: {
      engine: 'sort', title: 'Rapid Sort', blurb: 'Cruising altitudes, nav methods, add or subtract', xpEach: 30,
      rounds: [
        { id: 'alt', title: 'Pick the Cruising Altitude', brief: 'VFR above 3,000 ft AGL: which altitude fits this MAGNETIC COURSE?',
          buckets: ['Odd thousands + 500 (3,500, 5,500…)', 'Even thousands + 500 (4,500, 6,500…)'],
          items: [
            { t: '090°', b: 0 }, { t: '270°', b: 1 }, { t: '045°', b: 0 }, { t: '180°', b: 1 },
            { t: '359°', b: 1 }, { t: '179°', b: 0 }, { t: '135°', b: 0 }, { t: '200°', b: 1 }] },
        { id: 'method', title: 'How Are You Navigating?', brief: 'Which navigation method is it?',
          buckets: ['Pilotage', 'Dead reckoning', 'VOR', 'GPS'],
          items: [
            { t: 'Following a highway and a lake you see out the window', b: 0 }, { t: 'Computing heading and time from the wind', b: 1 },
            { t: 'Tracking a radial from a ground station', b: 2 }, { t: 'Satellites tell you your exact position', b: 3 },
            { t: 'Checking off landmarks on the chart', b: 0 }, { t: '“At 110 knots, I’ll reach the town in 18 minutes”', b: 1 },
            { t: 'Needs 4 satellites for a 3D position', b: 3 }, { t: 'Identified by its Morse code', b: 2 }] },
        { id: 'math', title: 'Add or Subtract?', brief: 'When working from TRUE toward COMPASS, do you add or subtract?',
          buckets: ['➕ Add', '➖ Subtract'],
          items: [
            { t: 'East variation', b: 1, why: '“East is least”: subtract.' }, { t: 'West variation', b: 0, why: '“West is best”: add.' },
            { t: 'Wind from the right (correct right)', b: 0 }, { t: 'Wind from the left (correct left)', b: 1 },
            { t: 'TH 090°, 10°E variation → MH?', b: 1, why: '090 − 10 = 080°.' }, { t: 'TH 090°, 10°W variation → MH?', b: 0, why: '090 + 10 = 100°.' }] }
      ]
    },
    missions: [
      {
        id: 'charts', emoji: '🗺️', title: 'Reading a Sectional', blurb: 'The pilot’s road map', minutes: 6, xp: 50,
        phak: 'Chapter 16 → “Aeronautical Charts” and “Sectional Charts”',
        cards: [
          { t: 'talk', html: `<p>VFR pilots navigate with <b>sectional charts</b>, detailed maps at a scale of <b>1:500,000</b>. That’s about <b>7 nautical miles per inch</b>. Charts are updated every 56 days, so always use a current one.</p><p>Busy areas also have <b>VFR terminal area charts</b> at twice the detail (1:250,000).</p>` },
          { t: 'talk', html: `<p>What you’ll find on a sectional:</p><ul><li><b>Airports</b>: <b>blue</b> symbols have a control tower; <b>magenta</b> symbols don’t. Next to each is a data block with its name, frequencies, elevation, lighting and longest runway.</li><li><b>Obstacles</b> like towers: the <b>bold</b> number is the height above sea level (MSL); the number in <b>(parentheses)</b> is the height above ground (AGL).</li><li><b>Maximum Elevation Figures (MEF)</b>: big numbers in each grid square showing the highest obstacle or terrain plus a margin. A big 3 with a small 4 = 3,400 ft MSL.</li><li>Airspace, terrain colors, roads, rivers, and towns.</li></ul>` },
          { t: 'check', q: 'An obstruction on a chart is labeled “1,549 (649).” What does (649) mean?',
            choices: ['Height above mean sea level', 'Height above the ground', 'Its radio frequency'], answer: 1,
            explain: 'Parentheses = AGL. The bold number is MSL.' },
          { t: 'tryit', html: `<p>Open VFRMap.com and find an airport near you. Is the symbol blue or magenta? Read its data block: what’s the field elevation and longest runway?</p>` }
        ]
      },
      {
        id: 'latlong', emoji: '🌐', title: 'Latitude, Longitude & Time', blurb: 'The world’s grid', minutes: 5, xp: 50,
        phak: 'Chapter 16 → “Latitude and Longitude (Meridians and Parallels)” and “Time Zones”',
        cards: [
          { t: 'diagram', svg: globe, caption: 'Every spot on Earth has a latitude and longitude.' },
          { t: 'talk', html: `<p>Each degree is split into <b>60 minutes</b>. Here’s a handy fact: <b>1 minute of latitude = 1 nautical mile</b>. That’s why pilots and sailors use nautical miles!</p><p>The Earth turns 15° every hour, so time zones are about 15° of longitude wide. Aviation uses <b>Zulu time (UTC)</b> so everyone is on the same clock. Eastern Standard Time is UTC − 5.</p>` },
          { t: 'check', q: 'You depart at 10:30 a.m. Eastern Standard Time (UTC−5). What time is that in Zulu?',
            choices: ['0530Z', '1530Z', '1030Z'], answer: 1,
            explain: 'Add 5 hours: 1030 + 5 = 1530Z.' },
          { t: 'fact', html: `<p>Before GPS, airline navigators used sextants to measure the angles of stars, just like sailors. Some old airliners even had a little glass bubble on the roof for star sightings!</p>` }
        ]
      },
      {
        id: 'course', emoji: '📐', title: 'From True Course to Compass', blurb: 'Wind, variation and deviation', minutes: 7, xp: 50,
        phak: 'Chapter 16 → “Measurement of Direction,” “Variation,” “Deviation,” and “Effect of Wind”',
        cards: [
          { t: 'talk', html: `<p>When you draw a line on the chart from airport A to airport B and measure it with a plotter, you get the <b>true course</b> (measured from true north). But you can’t just point the airplane that way. You need three corrections.</p>` },
          { t: 'diagram', svg: chain, caption: 'Work left to right to get the heading you actually fly.' },
          { t: 'diagram', svg: crab, caption: 'Wind pushes you sideways, so you crab into it.',
            html: `<p>The angle you turn into the wind is the <b>wind correction angle (WCA)</b>. Wind from the left → correct left (subtract). Wind from the right → correct right (add). The wind also changes your <b>groundspeed</b>: a headwind slows you down, a tailwind speeds you up.</p>` },
          { t: 'check', q: 'True course 090°. Wind from the north needs 10° of left correction. Variation is 5°E. What’s the magnetic heading?',
            choices: ['075°', '085°', '095°'], answer: 0,
            explain: 'TC 090 − 10 (left WCA) = TH 080. Then 5°E: east is least → 080 − 5 = MH 075°.' },
          { t: 'test', html: `<p>Pilots solve wind problems with an <b>E6B flight computer</b> (a fancy circular slide rule) or an electronic version. On the FAA test you might find a wind correction angle, true heading and groundspeed from the true course, true airspeed and wind.</p>` }
        ]
      },
      {
        id: 'planning', emoji: '📋', title: 'Planning a Cross-Country', blurb: 'Time, fuel, altitude, flight plan', minutes: 7, xp: 50,
        phak: 'Chapter 16 → “Pilotage,” “Dead Reckoning,” “Flight Planning,” and “Filing a VFR Flight Plan”',
        cards: [
          { t: 'talk', html: `<p>Two classic ways to navigate:</p><ul><li><b>Pilotage</b>: flying by landmarks you see on the ground and on the chart.</li><li><b>Dead reckoning</b>: calculating your heading, groundspeed and time between checkpoints, then flying it.</li></ul><p>Most pilots use both, plus GPS.</p>` },
          { t: 'talk', html: `<p>The basic math: <b>time = distance ÷ groundspeed</b>, and <b>fuel = time × fuel burn</b>.</p><p>Example: 120 NM at a groundspeed of 90 knots = <b>1 hour 20 minutes</b>. At 9 gallons per hour, that’s <b>12 gallons</b>.</p><p>VFR fuel rules: you must have enough to reach your destination plus <b>30 minutes</b> (day) or <b>45 minutes</b> (night) at normal cruise. Smart pilots carry more!</p>` },
          { t: 'check', q: 'Your true airspeed is 110 knots with a 20-knot direct headwind. What is your groundspeed?',
            choices: ['130 knots', '90 knots', '110 knots'], answer: 1,
            explain: 'A headwind subtracts: 110 − 20 = 90 knots.' },
          { t: 'talk', html: `<p><b>VFR cruising altitudes</b> (more than 3,000 ft above the ground) keep traffic separated by direction. Based on your <b>magnetic course</b>:</p><ul><li><b>0° to 179°</b> (eastbound): <b>odd</b> thousands + 500 → 3,500, 5,500, 7,500…</li><li><b>180° to 359°</b> (westbound): <b>even</b> thousands + 500 → 4,500, 6,500…</li></ul><p>Memory trick: “<b>East is odd, West is even</b>… and eventually you get there!”</p>` },
          { t: 'talk', html: `<p>File a <b>VFR flight plan</b> with Flight Service. It’s like telling someone where you’re hiking. Open it after takeoff and <b>close it when you land</b>. If you don’t, search and rescue may start looking for you about <b>30 minutes after your ETA</b>!</p>` },
          { t: 'test', html: `<ul><li>Odd thousands + 500 → <b>magnetic course</b> 0° through 179°.</li><li>A VFR flight plan must be closed by the pilot with <b>Flight Service</b> (the tower doesn’t do it).</li></ul>` }
        ]
      },
      {
        id: 'radio', emoji: '📶', title: 'VOR, GPS & Getting Unlost', blurb: 'Radio navigation and the 5 Cs', minutes: 7, xp: 50,
        phak: 'Chapter 16 → “Radio Navigation,” “VHF Omnidirectional Range (VOR),” “Global Positioning System (GPS),” and “Lost Procedures”',
        cards: [
          { t: 'talk', html: `<p>A <b>VOR</b> is a ground radio station that sends out 360 “spokes” called <b>radials</b>. Radials point <b>FROM</b> the station and are measured from <b>magnetic</b> north. The 090 radial runs straight east from the station.</p><ul><li>Turn the <b>OBS</b> knob to pick a course. The needle (<b>CDI</b>) shows if you’re left or right of it, and a <b>TO/FROM</b> flag shows whether that course takes you toward or away from the station.</li><li>The only sure way to identify a VOR is its <b>Morse code</b> identifier.</li><li>You can test a VOR receiver at a <b>VOT</b> test signal: the needle centers at <b>0° FROM</b> or <b>180° TO</b>, no matter where you are.</li></ul>` },
          { t: 'check', q: 'Centering the CDI on a VOT test signal, the OBS and flag should read…',
            choices: ['0° FROM or 180° TO', '0° TO or 180° FROM', '180° FROM only if you’re north of it'], answer: 0,
            explain: 'A VOT acts like you’re sitting on the 360° radial: 0° FROM, or 180° TO.' },
          { t: 'talk', html: `<p><b>GPS</b> uses a network of satellites. A receiver needs at least <b>4 satellites</b> for a 3D position (latitude, longitude and altitude). It checks its own accuracy with <b>RAIM</b> (which needs 5) or with WAAS.</p><p><b>DME</b> measures distance to a ground station. It’s <b>slant range</b>, so directly over the station it still shows your altitude as distance!</p>` },
          { t: 'talk', html: `<p>Lost? Don’t panic! Remember the <b>5 Cs</b>:</p><ul><li><b>Climb</b>: see farther and get better radio reception.</li><li><b>Communicate</b>: call ATC or Flight Service. Use 121.5 MHz in an emergency.</li><li><b>Confess</b>: tell them you’re lost. Controllers help lost pilots all the time.</li><li><b>Comply</b>: follow their instructions.</li><li><b>Conserve</b>: reduce power to save fuel.</li></ul>` },
          { t: 'test', html: `<ul><li>Positive VOR identification → <b>Morse code identifier</b>.</li><li>VOT check → <b>0° FROM or 180° TO, regardless of position</b>.</li><li>Magnetic bearing to an NDB = <b>magnetic heading + relative bearing</b>.</li></ul>` }
        ]
      }
    ],

    quizLength: 12,
    quiz: [
      { q: 'Each person operating an aircraft at a VFR cruising altitude shall maintain an odd-thousand plus 500-foot altitude while on a', choices: ['magnetic course of 0° through 179°.', 'magnetic heading of 0° through 179°.', 'true course of 0° through 179°.'], answer: 0, explain: 'It’s based on magnetic course.' },
      { q: 'Which cruising altitude is appropriate for a VFR flight on a magnetic course of 135°?', choices: ['Odd thousands plus 500 feet.', 'Even thousands plus 500 feet.', 'Even thousands.'], answer: 0, explain: '0–179° → odd + 500.' },
      { q: 'Which VFR cruising altitude is acceptable for a flight on a magnetic course of 270°, more than 3,000 feet AGL?', choices: ['6,500 feet.', '7,500 feet.', '7,000 feet.'], answer: 0, explain: '180–359° → even + 500.' },
      { q: 'True course 090°, wind correction 10° left, variation 5°E. What is the magnetic heading?', choices: ['075°.', '085°.', '095°.'], answer: 0, explain: '090 − 10 = 080; east is least: 080 − 5 = 075.' },
      { q: 'A true heading of 270° with a variation of 10°W gives a magnetic heading of', choices: ['280°.', '260°.', '270°.'], answer: 0, explain: 'West is best: add.' },
      { q: 'The angle between true north and magnetic north, used to convert true to magnetic, is', choices: ['variation.', 'deviation.', 'wind correction angle.'], answer: 0, explain: 'Deviation is the aircraft’s own compass error.' },
      { q: 'How long will a 120 NM flight take at a groundspeed of 90 knots?', choices: ['1 hour 20 minutes.', '1 hour 10 minutes.', '1 hour 30 minutes.'], answer: 0, explain: '120 ÷ 90 = 1.33 hours = 1:20.' },
      { q: 'A flight of 1 hour 20 minutes at a fuel burn of 9 gallons per hour will use about', choices: ['12 gallons.', '9 gallons.', '15 gallons.'], answer: 0, explain: '1.33 × 9 = 12.' },
      { q: 'For a day VFR flight, an airplane must carry enough fuel to fly to the first point of intended landing and, assuming normal cruising speed, to fly after that for at least', choices: ['30 minutes.', '45 minutes.', '1 hour.'], answer: 0, explain: '30 minutes by day, 45 minutes at night.' },
      { q: 'One minute of latitude is equal to', choices: ['1 nautical mile.', '1 statute mile.', '60 nautical miles.'], answer: 0, explain: 'That’s where nautical miles come from.' },
      { q: 'A flight departs at 1030 EST (UTC−5). What is the departure time in Zulu?', choices: ['1530Z.', '0530Z.', '1030Z.'], answer: 0, explain: 'Add 5 hours.' },
      { q: 'When the course deviation indicator (CDI) needle is centered during a VOR receiver check using a VOT, the omnibearing selector and TO/FROM indicator should read', choices: ['0° FROM or 180° TO, regardless of the pilot’s position from the VOT.', '0° TO or 180° FROM, regardless of the pilot’s position from the VOT.', '180° FROM, only if the pilot is due north of the VOT.'], answer: 0, explain: 'The VOT broadcasts the 360° radial everywhere.' },
      { q: 'The only positive method of identifying a VOR is by its', choices: ['Morse code identifier.', 'frequency on the chart.', 'location on the sectional.'], answer: 0, explain: 'Always listen to the identifier.' },
      { q: 'VOR radials are oriented', choices: ['from the station, referenced to magnetic north.', 'to the station, referenced to true north.', 'from the station, referenced to true north.'], answer: 0, explain: 'Radials go FROM the station, measured from magnetic north.' },
      { q: 'How should a VFR flight plan be closed at the completion of the flight at a controlled airport?', choices: ['The pilot must close the flight plan with the nearest FSS or other FAA facility upon landing.', 'The tower will automatically close the flight plan when the aircraft turns off the runway.', 'The tower will relay the instructions to the nearest FSS when the aircraft contacts the tower for landing.'], answer: 0, explain: 'Closing it is always the pilot’s job.' },
      { q: 'A GPS receiver needs signals from at least how many satellites to give a three-dimensional position?', choices: ['4.', '3.', '6.'], answer: 0, explain: '4 for latitude, longitude and altitude (plus time).' },
      { q: 'An ADF shows a relative bearing of 140° while the magnetic heading is 315°. What is the magnetic bearing to the station?', choices: ['095°.', '175°.', '275°.'], answer: 0, explain: 'MH + RB = 315 + 140 = 455 − 360 = 095°.' },
      { q: 'Navigation by visual reference to landmarks is called', choices: ['pilotage.', 'dead reckoning.', 'radio navigation.'], answer: 0, explain: 'Dead reckoning uses computed headings and times.' },
      { q: 'On a sectional chart, an obstruction labeled “1,549 (649)” is', choices: ['1,549 feet MSL and 649 feet AGL.', '1,549 feet AGL and 649 feet MSL.', '1,549 feet tall with a 649-foot antenna.'], answer: 0, explain: 'Parentheses = above ground level.' },
      { q: 'The scale of a sectional chart is', choices: ['1:500,000.', '1:250,000.', '1:1,000,000.'], answer: 0, explain: 'Terminal area charts are 1:250,000.' }
    ],

    glossary: [
      { term: 'Sectional chart', def: 'The main VFR navigation map, at 1:500,000 scale.' },
      { term: 'Terminal area chart', def: 'A more detailed VFR chart (1:250,000) around busy airports.' },
      { term: 'MEF', def: 'Maximum Elevation Figure: highest terrain or obstacle in a grid square, plus a margin.' },
      { term: 'Latitude', def: 'Distance north or south of the equator, 0° to 90°.' },
      { term: 'Longitude', def: 'Distance east or west of the prime meridian, 0° to 180°.' },
      { term: 'Nautical mile', def: '1 minute of latitude, about 6,076 feet.' },
      { term: 'True course', def: 'The course measured from true north on the chart.' },
      { term: 'Wind correction angle', def: 'The angle you turn into the wind to stay on course.' },
      { term: 'True heading', def: 'True course corrected for wind.' },
      { term: 'Magnetic heading', def: 'True heading corrected for variation.' },
      { term: 'Compass heading', def: 'Magnetic heading corrected for deviation. What you fly on the compass.' },
      { term: 'Groundspeed', def: 'Speed over the ground: true airspeed plus or minus wind.' },
      { term: 'Pilotage', def: 'Navigating by landmarks.' },
      { term: 'Dead reckoning', def: 'Navigating by computed heading, groundspeed and time.' },
      { term: 'E6B', def: 'A flight computer for wind, time, speed and fuel problems.' },
      { term: 'VFR cruising altitudes', def: 'Above 3,000 AGL: odd + 500 for 0–179° magnetic course, even + 500 for 180–359°.' },
      { term: 'VFR flight plan', def: 'A plan filed with Flight Service so search and rescue knows where to look.' },
      { term: 'VOR', def: 'A ground radio station that broadcasts 360 magnetic radials.' },
      { term: 'Radial', def: 'A magnetic bearing extending FROM a VOR station.' },
      { term: 'VOT', def: 'A VOR test signal: centered needle reads 0° FROM or 180° TO.' },
      { term: 'GPS', def: 'Satellite navigation. Needs 4 satellites for a 3D position.' },
      { term: '5 Cs', def: 'Lost procedure: Climb, Communicate, Confess, Comply, Conserve.' }
    ]
  });
})();
