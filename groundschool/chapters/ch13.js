// Chapter 13 — Aviation Weather Services (PHAK FAA-H-8083-25C)
(() => {
  const { txt, lines, svg } = SKY.draw;

  const tok = (x, y, w, s, cls, l1, l2) => `<rect x="${x}" y="${y}" width="${w}" height="24" rx="5" class="${cls}" opacity=".9"/>` +
    `<text x="${x + w / 2}" y="${y + 16}" text-anchor="middle" class="t-white d-text" style="font-family:ui-monospace,Menlo,monospace">${s}</text>` +
    txt(x + w / 2, y + 38, l1, 'd-small') + (l2 ? txt(x + w / 2, y + 48, l2, 'd-small') : '');
  const metar = svg(320, 190, `
    ${tok(4, 14, 48, 'METAR', 'd-muted', 'report type', '')}${tok(56, 14, 42, 'KBOS', 'd-brand', 'airport', '(Boston)')}
    ${tok(102, 14, 66, '121754Z', 'd-brand', '12th day,', '17:54 UTC')}${tok(172, 14, 112, '27015G25KT', 'd-thrust', 'wind 270° true, 15 kt,', 'gusting 25')}
    ${tok(4, 104, 44, '10SM', 'd-ok', 'visibility', '10 miles')}${tok(52, 104, 60, 'FEW035', 'd-accent', 'few clouds', '3,500 ft AGL')}
    ${tok(116, 104, 60, 'BKN250', 'd-accent', 'broken', '25,000 ft')}${tok(180, 104, 54, '18/09', 'd-weight', 'temp 18°C', 'dewpoint 9°C')}
    ${tok(238, 104, 60, 'A3001', 'd-drag', 'altimeter', '30.01 inHg')}`,
    'A decoded METAR: METAR KBOS 121754Z 27015G25KT 10SM FEW035 BKN250 18/09 A3001');

  SKY.registerChapter({
    id: 'ch13',
    badge: { name: 'Weather Decoder', emoji: '📡', desc: 'You can read METARs, TAFs and weather advisories like a pro.' },
    game: {
      engine: 'sort', title: 'Rapid Sort', blurb: 'Decode METARs and advisories', xpEach: 30,
      rounds: [
        { id: 'tok', title: 'METAR Decoder', brief: 'What does each piece of a METAR report?',
          buckets: ['Wind', 'Visibility', 'Clouds', 'Temp / Dewpoint', 'Altimeter'],
          items: [
            { t: '<code>27015G25KT</code>', b: 0 }, { t: '<code>10SM</code>', b: 1 }, { t: '<code>BKN035</code>', b: 2 }, { t: '<code>18/12</code>', b: 3 },
            { t: '<code>A3001</code>', b: 4 }, { t: '<code>1/2SM</code>', b: 1 }, { t: '<code>OVC008</code>', b: 2 }, { t: '<code>VRB03KT</code>', b: 0 },
            { t: '<code>M02/M05</code>', b: 3, why: '“M” means minus: −2°C temperature, −5°C dewpoint.' }, { t: '<code>A2985</code>', b: 4 }, { t: '<code>SCT250</code>', b: 2 }, { t: '<code>00000KT</code>', b: 0, why: 'Calm wind.' }] },
        { id: 'airmet', title: 'Which AIRMET?', brief: 'AIRMETs come in three flavors. Which one covers it?',
          buckets: ['Sierra', 'Tango', 'Zulu'],
          items: [
            { t: 'IFR conditions (low clouds, poor visibility)', b: 0 }, { t: 'Moderate turbulence', b: 1 }, { t: 'Moderate icing', b: 2 },
            { t: 'Mountains hidden by clouds', b: 0 }, { t: 'Freezing level', b: 2 }, { t: 'Sustained surface winds of 30+ knots', b: 1 }] },
        { id: 'brief', title: 'Which Briefing?', brief: 'Pick the right type of weather briefing.',
          buckets: ['Standard', 'Abbreviated', 'Outlook'],
          items: [
            { t: 'First full briefing before your flight', b: 0 }, { t: 'Your flight is 6+ hours away', b: 2 },
            { t: 'Updating a briefing you already got', b: 1 }, { t: 'Planning tomorrow morning’s trip tonight', b: 2 },
            { t: 'You just need one or two items', b: 1 }, { t: 'Complete overview of the route', b: 0 }] }
      ]
    },
    missions: [
      {
        id: 'obs', emoji: '👀', title: 'Weather Observations', blurb: 'What’s happening right now', minutes: 5, xp: 50,
        phak: 'Chapter 13 → “Observations,” “Surface Aviation Weather Observations,” and “Pilot Weather Reports (PIREPs)”',
        cards: [
          { t: 'talk', html: `<p>Weather info comes in two kinds: <b>observations</b> (what’s happening now) and <b>forecasts</b> (what’s expected). Let’s start with observations.</p><ul><li><b>ASOS / AWOS</b>: automated weather stations at airports that measure wind, visibility, clouds, temperature and pressure.</li><li><b>METAR</b>: the routine hourly weather report for an airport.</li><li><b>SPECI</b>: a special report issued when the weather changes a lot between hours.</li><li><b>Radar</b>: shows where the precipitation is.</li></ul>` },
          { t: 'talk', html: `<p>Some of the best information comes from other pilots: <b>PIREPs</b> (pilot reports). They report things no ground station can see, like cloud tops, turbulence and icing up high.</p><ul><li><b>UA</b> = routine PIREP.</li><li><b>UUA</b> = <b>urgent</b> PIREP (severe turbulence, severe icing, wind shear, hail…).</li></ul><p>If you see something interesting, file a PIREP. You might save someone a bumpy ride!</p>` },
          { t: 'check', q: 'A PIREP coded “UUA” is…',
            choices: ['A routine report', 'An urgent report', 'An update to a TAF'], answer: 1,
            explain: 'UUA = urgent: hazardous conditions like severe icing, severe turbulence or wind shear.' },
          { t: 'fact', html: `<p>Many airports broadcast their latest weather on a radio frequency called <b>ATIS</b> (or ASOS/AWOS). Pilots listen before talking to the tower. Each update gets a phonetic letter like “Information Bravo.”</p>` }
        ]
      },
      {
        id: 'metar', emoji: '🔤', title: 'Decoding a METAR', blurb: 'Read weather like a secret code', minutes: 7, xp: 50,
        phak: 'Chapter 13 → “Aviation Routine Weather Report (METAR)”',
        cards: [
          { t: 'talk', html: `<p>A METAR looks like a secret code, but it always goes in the same order. Once you know it, you can read one in seconds!</p>` },
          { t: 'diagram', svg: metar, caption: 'A real-style METAR, piece by piece.' },
          { t: 'talk', html: `<ul><li><b>Wind</b>: direction (from, in degrees <b>true</b>) and speed in knots. <code>G</code> = gusts, <code>VRB</code> = variable, <code>00000KT</code> = calm.</li><li><b>Visibility</b> in <b>statute miles</b>.</li><li><b>Weather</b>: <code>RA</code> rain, <code>SN</code> snow, <code>TS</code> thunderstorm, <code>BR</code> mist, <code>FG</code> fog, <code>HZ</code> haze. <code>−</code> light, <code>+</code> heavy.</li><li><b>Clouds</b>: <code>FEW</code>, <code>SCT</code> (scattered), <code>BKN</code> (broken), <code>OVC</code> (overcast), with height in hundreds of feet <b>above ground</b>. The lowest BKN or OVC is the <b>ceiling</b>.</li><li><b>Temp/dewpoint</b> in °C (<code>M</code> = minus).</li><li><b>Altimeter</b>: <code>A2992</code> = 29.92 inHg.</li></ul>` },
          { t: 'check', q: '<code>METAR KINK 121845Z 11012G18KT 15SM SKC 25/17 A3000</code> — What is the wind?',
            choices: ['110° true at 12 knots, gusts to 18', '120° at 11 knots, gusts to 18', '110° magnetic at 18 knots'], answer: 0,
            explain: 'First 3 digits = direction (110°, true), next 2 = speed (12), G18 = gusts to 18 knots.' },
          { t: 'check', q: '<code>METAR KMDW 121856Z 32005KT 1 1/2SM +RA BR OVC007 17/16 A2980</code> — What’s the ceiling?',
            choices: ['Overcast at 7,000 ft', 'Overcast at 700 ft', 'No ceiling'], answer: 1,
            explain: 'OVC007 = overcast at 700 ft AGL. Plus heavy rain and mist with 1½ miles visibility. Not a day for a new pilot!' },
          { t: 'test', html: `<ul><li>METAR winds are <b>true</b>. ATIS and tower winds are <b>magnetic</b>.</li><li>Cloud heights are <b>AGL</b>, in hundreds of feet.</li><li>Visibility is in <b>statute miles</b>.</li></ul>` }
        ]
      },
      {
        id: 'taf', emoji: '🔮', title: 'Forecasts: TAFs & Winds Aloft', blurb: 'What the weather will do', minutes: 7, xp: 50,
        phak: 'Chapter 13 → “Terminal Aerodrome Forecasts (TAF),” “Graphical Forecasts for Aviation (GFA),” and “Wind and Temperature Aloft Forecast (FB)”',
        cards: [
          { t: 'talk', html: `<p>A <b>Terminal Aerodrome Forecast (TAF)</b> predicts the weather within <b>5 statute miles</b> of an airport, usually for 24 or 30 hours. It uses the same codes as a METAR, plus some change groups:</p><ul><li><code>FM1500</code>: <b>from</b> 1500Z, a new set of conditions.</li><li><code>TEMPO</code>: <b>temporary</b> changes, each lasting less than an hour.</li><li><code>PROB30</code>: a 30% chance.</li><li><code>BECMG</code>: <b>becoming</b>, a gradual change.</li><li><code>P6SM</code>: visibility of more than 6 statute miles.</li></ul>` },
          { t: 'check', q: 'Which forecast tells you the expected weather at your destination airport around your arrival time?',
            choices: ['The TAF for that airport', 'The winds aloft forecast', 'A METAR from your departure airport'], answer: 0,
            explain: 'TAFs are airport-specific forecasts.' },
          { t: 'talk', html: `<p>The <b>Wind and Temperature Aloft Forecast (FB)</b> gives winds at different altitudes in a four-digit code (direction <b>true</b>, speed in knots) plus temperature in °C:</p><ul><li><code>3627-08</code> = 360° at 27 knots, −8°C.</li><li><code>9900+02</code> = <b>light and variable</b> (under 5 knots), +2°C.</li><li><code>7319-20</code> = winds over 99 knots! Subtract 50 from the direction (230°) and add 100 to the speed (119 knots). −20°C.</li></ul>` },
          { t: 'check', q: 'Decode the winds aloft: <code>2335+05</code>',
            choices: ['230° at 35 knots, +5°C', '235° at 5 knots', '230° at 3 knots, 5°C'], answer: 0,
            explain: 'First two digits ×10 = direction (230°), next two = speed (35 kt), then the temperature (+5°C).' },
          { t: 'talk', html: `<p>For the big picture, pilots use the <b>Graphical Forecasts for Aviation (GFA)</b> at aviationweather.gov: interactive maps of clouds, weather, icing and turbulence. <b>Prog charts</b> (prognostic charts) forecast where fronts and weather systems will be in 12 and 24 hours.</p>` },
          { t: 'test', html: `<ul><li>TAF covers <b>5 SM</b> around the airport center.</li><li>Winds aloft are in <b>true</b> direction and <b>knots</b>. <code>9900</code> = light and variable.</li><li>The <b>convective outlook</b> describes chances for severe and general thunderstorms.</li></ul>` }
        ]
      },
      {
        id: 'advis', emoji: '⚠️', title: 'AIRMETs & SIGMETs', blurb: 'In-flight weather warnings', minutes: 6, xp: 50,
        phak: 'Chapter 13 → “In-Flight Weather Advisories” (AIRMET, SIGMET, Convective SIGMET)',
        cards: [
          { t: 'talk', html: `<p><b>AIRMETs</b> warn about weather that’s especially important to <b>small airplanes</b>. Three kinds, easy to remember:</p><ul><li><b>Sierra</b> (S for “Sight”): IFR conditions and mountain obscuration.</li><li><b>Tango</b> (T for “Turbulence”): moderate turbulence, sustained surface winds of 30+ knots, and low-level wind shear.</li><li><b>Zulu</b> (Z looks like a freezing zigzag): moderate icing and freezing levels.</li></ul>` },
          { t: 'talk', html: `<p><b>SIGMETs</b> warn of weather that’s hazardous to <b>all aircraft</b>, even big jets:</p><ul><li>Severe icing (not from thunderstorms).</li><li>Severe or extreme turbulence.</li><li>Dust or sandstorms dropping visibility below 3 miles.</li><li>Volcanic ash.</li></ul><p><b>Convective SIGMETs</b> are all about thunderstorms: tornadoes, lines of thunderstorms, embedded thunderstorms, large areas of strong storms, and hail <b>¾ inch or bigger</b>.</p>` },
          { t: 'check', q: 'Which advisory would warn about severe icing NOT associated with thunderstorms?',
            choices: ['AIRMET Zulu', 'SIGMET', 'Convective SIGMET'], answer: 1,
            explain: 'Severe icing = SIGMET. Moderate icing = AIRMET Zulu. Thunderstorm-related = convective SIGMET.' },
          { t: 'fact', html: `<p>In 1982, a British Airways 747 flew through volcanic ash over Indonesia and <b>all four engines quit</b>. The crew glided while trying restarts, and the engines came back to life as they dropped out of the ash cloud. That’s why volcanic ash gets its own SIGMET!</p>` },
          { t: 'test', html: `<ul><li>SIGMETs are issued for hazards to <b>all aircraft</b>.</li><li>Convective SIGMETs include <b>tornadoes, embedded thunderstorms, and hail ¾ inch or greater</b>.</li></ul>` }
        ]
      },
      {
        id: 'brief', emoji: '☎️', title: 'Getting a Weather Briefing', blurb: 'Standard, abbreviated, outlook', minutes: 5, xp: 50,
        phak: 'Chapter 13 → “Briefings” and “Weather Charts”',
        cards: [
          { t: 'talk', html: `<p>Before a flight, pilots get an official weather briefing from <b>Flight Service</b> (call 1-800-WX-BRIEF or go online) or from approved online sources. There are three types:</p><ul><li><b>Standard briefing</b>: the full picture, when you have no other info.</li><li><b>Abbreviated briefing</b>: to update earlier info or get a few specific items.</li><li><b>Outlook briefing</b>: when you’ll leave <b>6 or more hours</b> from now. It’s for planning.</li></ul>` },
          { t: 'check', q: 'You want weather for a flight tomorrow morning. Which briefing?',
            choices: ['Standard', 'Abbreviated', 'Outlook'], answer: 2,
            explain: 'Departure 6+ hours away → outlook. Get a standard briefing closer to departure.' },
          { t: 'talk', html: `<p>Charts pilots use:</p><ul><li><b>Surface analysis chart</b>: current fronts and pressure systems.</li><li><b>Prog charts</b>: forecast fronts and weather.</li><li><b>Convective outlook</b>: thunderstorm risk for the next days.</li><li><b>Radar and satellite</b>: where the rain and clouds are.</li></ul><p>In flight, airplanes with <b>ADS-B In</b> can receive free weather (radar, METARs, TAFs) right on a tablet through <b>FIS-B</b>.</p>` },
          { t: 'tryit', html: `<p>Go to <b>aviationweather.gov</b> and look up the METAR for the airport nearest you. Decode it yourself, then check whether you got it right!</p>` }
        ]
      }
    ],

    quizLength: 12,
    quiz: [
      { q: 'METAR KINK 121845Z 11012G18KT 15SM SKC 25/17 A3000. The wind direction and speed at KINK was', choices: ['110° true at 12 knots, gusts 18 knots.', '121° magnetic at 8 knots, gusts 45 knots.', '012° true at 11 knots, gusts 18 knots.'], answer: 0, explain: 'Direction 110° true, speed 12, gusts 18.' },
      { q: 'METAR KBOI 121854Z 13004KT 30SM SCT150 17/6 A3015. The wind at KBOI is', choices: ['130° true at 4 knots.', '130° magnetic at 4 knots.', '040° true at 13 knots.'], answer: 0, explain: 'METAR winds are true.' },
      { q: 'METAR KMDW 121856Z 32005KT 1 1/2SM +RA BR OVC007 17/16 A2980. What are the conditions at KMDW?', choices: ['Visibility 1½ SM in heavy rain and mist, overcast at 700 feet.', 'Visibility 1½ SM in light rain, overcast at 7,000 feet.', 'Visibility 15 SM, overcast at 700 feet.'], answer: 0, explain: '+RA = heavy rain, BR = mist, OVC007 = overcast 700 ft.' },
      { q: 'In a METAR, cloud heights are reported in', choices: ['hundreds of feet above ground level.', 'thousands of feet above mean sea level.', 'hundreds of feet above mean sea level.'], answer: 0, explain: 'BKN035 = broken at 3,500 ft AGL.' },
      { q: 'A UUA in a pilot weather report indicates', choices: ['an urgent PIREP.', 'a routine PIREP.', 'an upper-air observation.'], answer: 0, explain: 'UUA = urgent.' },
      { q: 'A Terminal Aerodrome Forecast (TAF) covers an area within', choices: ['5 statute miles of the center of the airport.', '10 statute miles of the airport.', '25 nautical miles of the airport.'], answer: 0, explain: 'TAFs cover 5 SM around the airport center.' },
      { q: 'Which primary source contains information regarding the expected weather at the destination airport at the ETA?', choices: ['Terminal Aerodrome Forecast.', 'Low-level prog chart.', 'Weather depiction chart.'], answer: 0, explain: 'TAFs forecast airport weather.' },
      { q: 'In a TAF, “FM1500” means', choices: ['from 1500Z, a rapid change to new conditions.', 'forecast valid only at 1500Z.', 'conditions becoming gradually different after 1500Z.'], answer: 0, explain: 'FM = from. BECMG = becoming (gradual).' },
      { q: 'What values are used for winds aloft forecasts?', choices: ['True direction and knots.', 'Magnetic direction and knots.', 'True direction and MPH.'], answer: 0, explain: 'All forecast winds are true direction, in knots.' },
      { q: 'A winds aloft forecast of “9900+02” means', choices: ['light and variable winds, temperature +2 °C.', '990° at 0 knots.', 'wind 99 knots, temperature +2 °C.'], answer: 0, explain: '9900 = light and variable (less than 5 knots).' },
      { q: 'Decode the winds aloft forecast “7319-20.”', choices: ['230° at 119 knots, −20 °C.', '730° at 19 knots, −20 °C.', '190° at 73 knots, −20 °C.'], answer: 0, explain: 'Direction over 50 means winds over 99 knots: subtract 50 from the direction and add 100 to the speed.' },
      { q: 'SIGMETs are issued as a warning of weather conditions hazardous to', choices: ['all aircraft.', 'small aircraft only.', 'large aircraft only.'], answer: 0, explain: 'AIRMETs focus on small aircraft; SIGMETs affect everyone.' },
      { q: 'Which in-flight advisory would contain information on severe icing not associated with thunderstorms?', choices: ['SIGMET.', 'Convective SIGMET.', 'AIRMET.'], answer: 0, explain: 'Severe icing = SIGMET.' },
      { q: 'What information is contained in a Convective SIGMET?', choices: ['Tornadoes, embedded thunderstorms, and hail ¾ inch or greater in diameter.', 'Severe icing, severe turbulence, or widespread dust storms lowering visibility to less than 3 miles.', 'Surface winds greater than 40 knots or thunderstorms of any intensity.'], answer: 0, explain: 'The second choice describes a regular SIGMET.' },
      { q: 'AIRMET Sierra covers', choices: ['IFR conditions and mountain obscuration.', 'moderate turbulence.', 'moderate icing.'], answer: 0, explain: 'Sierra = sight. Tango = turbulence. Zulu = icing.' },
      { q: 'To get a complete weather overview for the planned flight, the pilot should request', choices: ['a standard briefing.', 'an outlook briefing.', 'an abbreviated briefing.'], answer: 0, explain: 'Standard = the full picture.' },
      { q: 'When requesting weather information for the following morning, a pilot should request', choices: ['an outlook briefing.', 'a standard briefing.', 'an abbreviated briefing.'], answer: 0, explain: 'Departure 6+ hours away → outlook.' },
      { q: 'To update a previous weather briefing, a pilot should request', choices: ['an abbreviated briefing.', 'a standard briefing.', 'an outlook briefing.'], answer: 0, explain: 'Abbreviated = update or specific items.' },
      { q: 'Which weather forecast describes prospects for an area coverage of both severe and general thunderstorms during the following 24 hours?', choices: ['Convective outlook.', 'Terminal aerodrome forecast.', 'Radar summary and weather depiction chart.'], answer: 0, explain: 'The convective outlook covers thunderstorm risk.' },
      { q: 'In a METAR, “M04/M07” means', choices: ['temperature −4 °C, dewpoint −7 °C.', 'temperature 4 °C, dewpoint 7 °C.', 'visibility 4 miles, ceiling 700 feet.'], answer: 0, explain: 'M = minus.' }
    ],

    glossary: [
      { term: 'METAR', def: 'The routine hourly weather observation for an airport.' },
      { term: 'SPECI', def: 'A special, unscheduled weather report for a significant change.' },
      { term: 'ASOS / AWOS', def: 'Automated weather observing systems at airports.' },
      { term: 'ATIS', def: 'A recorded broadcast of airport weather and info, named with a phonetic letter.' },
      { term: 'PIREP', def: 'A pilot weather report. UA = routine, UUA = urgent.' },
      { term: 'TAF', def: 'Terminal Aerodrome Forecast: weather forecast within 5 SM of an airport.' },
      { term: 'FM / TEMPO / BECMG', def: 'TAF change groups: from, temporary, becoming.' },
      { term: 'FB (winds aloft)', def: 'Forecast of wind (true, knots) and temperature at various altitudes.' },
      { term: 'GFA', def: 'Graphical Forecasts for Aviation: interactive weather maps.' },
      { term: 'Prog chart', def: 'A forecast chart showing where fronts and weather will be.' },
      { term: 'AIRMET', def: 'Advisory for weather hazardous mainly to light aircraft: Sierra, Tango, Zulu.' },
      { term: 'SIGMET', def: 'Advisory for weather hazardous to all aircraft, like severe icing or turbulence.' },
      { term: 'Convective SIGMET', def: 'Advisory for thunderstorm hazards: tornadoes, lines, embedded storms, big hail.' },
      { term: 'Standard briefing', def: 'A complete weather briefing for a planned flight.' },
      { term: 'Abbreviated briefing', def: 'A briefing to update earlier info or answer specific questions.' },
      { term: 'Outlook briefing', def: 'A planning briefing for a departure 6 or more hours away.' },
      { term: 'FIS-B', def: 'Free weather broadcast to aircraft with ADS-B In.' },
      { term: 'Ceiling (METAR)', def: 'The lowest BKN or OVC layer.' }
    ]
  });
})();
