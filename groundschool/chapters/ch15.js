// Chapter 15 — Airspace (PHAK FAA-H-8083-25C)
(() => {
  const { arrow, txt, lines, box, svg } = SKY.draw;

  const profile = svg(320, 210, `
    <rect x="0" y="0" width="320" height="34" class="d-box"/>${txt(160, 22, 'CLASS A · 18,000 ft MSL up to FL600 · IFR only', 't-brand d-small')}
    <rect x="0" y="34" width="320" height="130" class="d-sky"/>${txt(160, 50, 'CLASS E (controlled) — everything not A, B, C, D or G', 't-muted d-small')}
    <polygon points="10,62 130,62 130,100 115,100 115,135 100,135 100,186 40,186 40,135 25,135 25,100 10,100" style="fill:rgba(37,99,235,.28);stroke:#2563eb" stroke-width="2"/>
    ${txt(70, 82, 'CLASS B', 't-thrust d-text')}${txt(70, 94, 'to ~10,000 MSL', 'd-small')}
    <polygon points="165,130 245,130 245,158 225,158 225,186 185,186 185,158 165,158" style="fill:rgba(192,38,211,.25);stroke:#c026d3" stroke-width="2"/>
    ${txt(205, 124, 'CLASS C', 'd-text').replace('d-text', 'd-text" style="fill:#c026d3')}${txt(205, 146, '4,000 AGL', 'd-small')}
    <rect x="266" y="146" width="40" height="40" rx="2" style="fill:rgba(37,99,235,.12);stroke:#2563eb" stroke-width="2" stroke-dasharray="5 3"/>
    ${txt(286, 130, 'CLASS D', 't-thrust d-small')}${txt(286, 141, '2,500 AGL', 'd-small')}
    <line x1="0" y1="164" x2="320" y2="164" class="d-muted" stroke-dasharray="4 4"/>${txt(140, 160, '1,200 AGL', 'd-small')}
    <rect x="0" y="186" width="320" height="24" class="d-ground"/>${txt(150, 200, 'CLASS G (uncontrolled) near the ground', 'd-small')}
    ${[[70, 186], [205, 186], [286, 186]].map(([x, y]) => `<rect x="${x - 10}" y="${y - 2}" width="20" height="4" class="d-runway"/>`).join('')}`,
    'Side view of U.S. airspace classes: A on top, B like an upside-down wedding cake, C with a shelf, D cylinder, E everywhere else, G near the ground');

  const clearance = svg(320, 170, `
    <path d="M100,70 Q92,40 124,38 Q136,12 168,24 Q196,10 212,36 Q244,36 236,70 Z" class="d-cloud"/>
    <line x1="168" y1="74" x2="168" y2="118" class="d-weight" stroke-width="2"/>${txt(176, 100, '500 ft below', 't-weight d-text', 'start')}
    <line x1="168" y1="8" x2="168" y2="20" class="d-weight" stroke-width="2"/>${txt(176, 16, '1,000 ft above', 't-weight d-text', 'start')}
    <line x1="240" y1="54" x2="300" y2="54" class="d-weight" stroke-width="2"/>${txt(270, 46, '2,000 ft', 't-weight d-text')}${txt(270, 68, 'horizontal', 'd-small')}
    ${txt(160, 146, '“3-152”: 3 miles visibility, 1,000 above,', 'd-text')}${txt(160, 160, '500 below, 2,000 horizontal (Class C, D, E below 10,000)', 'd-small')}`,
    'Basic VFR cloud clearance: 500 feet below, 1,000 feet above, 2,000 feet horizontal, with 3 miles visibility');

  SKY.registerChapter({
    id: 'ch15',
    badge: { name: 'Airspace Navigator', emoji: '🗺️', desc: 'You know every class of airspace, its rules, and how to spot it on a chart.' },
    game: {
      engine: 'sort', title: 'Rapid Sort', blurb: 'Airspace classes, chart symbols, special use', xpEach: 30,
      rounds: [
        { id: 'class', title: 'Name That Airspace', brief: 'Which class of airspace is described?',
          buckets: ['A', 'B', 'C', 'D', 'E', 'G'],
          items: [
            { t: 'Starts at 18,000 ft MSL; IFR only', b: 0 }, { t: 'Upside-down wedding cake; need a clearance', b: 1 },
            { t: 'Two rings up to 4,000 AGL; talk to ATC first', b: 2 }, { t: 'Control tower, up to about 2,500 AGL', b: 3 },
            { t: 'Uncontrolled airspace', b: 5 }, { t: 'Controlled airspace that isn’t A, B, C or D', b: 4 },
            { t: 'Around the busiest airports, like Atlanta', b: 1 }, { t: 'Day VFR below 1,200 AGL: 1 SM, clear of clouds', b: 5 },
            { t: 'Federal airways start here at 1,200 AGL', b: 4 }, { t: 'All pilots set 29.92', b: 0 }] },
        { id: 'chart', title: 'Chart Symbols', brief: 'On a sectional chart, which airspace is shown?',
          buckets: ['Class B', 'Class C', 'Class D', 'Class E (surface)', 'Class E (from 700 AGL)'],
          items: [
            { t: 'Solid blue lines', b: 0 }, { t: 'Solid magenta lines', b: 1 }, { t: 'Dashed blue line', b: 2 },
            { t: 'Dashed magenta line', b: 3 }, { t: 'Fuzzy magenta shading (vignette)', b: 4 }] },
        { id: 'sua', title: 'Special Use Airspace', brief: 'Which kind of special use airspace?',
          buckets: ['Prohibited', 'Restricted', 'MOA', 'Alert', 'Warning'],
          items: [
            { t: 'P-56 over the White House', b: 0 }, { t: 'Artillery firing; need permission when active', b: 1 },
            { t: 'Military training; VFR allowed but be careful', b: 2 }, { t: 'Lots of pilot training; everyone watch out', b: 3 },
            { t: 'Hazards over international waters', b: 4 }, { t: 'Flight is never allowed (without special permission)', b: 0 },
            { t: 'Invisible hazards like missiles', b: 1 }, { t: 'Fighter jets practicing dogfights', b: 2 }] }
      ]
    },
    missions: [
      {
        id: 'classes', emoji: '🎂', title: 'The Airspace Layer Cake', blurb: 'Controlled vs. uncontrolled', minutes: 6, xp: 50,
        phak: 'Chapter 15 → “Controlled Airspace” and “Uncontrolled Airspace”',
        cards: [
          { t: 'talk', html: `<p>The sky looks empty, but it’s divided into invisible zones called <b>airspace classes</b>, each with its own rules. Think of it like roads: highways, neighborhood streets and parking lots all have different rules.</p>` },
          { t: 'diagram', svg: profile, caption: 'U.S. airspace from the side.' },
          { t: 'talk', html: `<ul><li><b>Class A</b>: 18,000 ft MSL up to FL600. <b>IFR only</b>, and everyone sets their altimeter to 29.92.</li><li><b>Class B</b>: around the busiest airports.</li><li><b>Class C</b>: around busy airports with radar.</li><li><b>Class D</b>: around airports with a control tower.</li><li><b>Class E</b>: all the other controlled airspace. Often starts at 1,200 ft AGL (or 700 ft near some airports) and goes up to 17,999 ft.</li><li><b>Class G</b>: <b>uncontrolled</b> airspace, usually close to the ground.</li></ul>` },
          { t: 'check', q: 'In which class of airspace is VFR flight NOT allowed?',
            choices: ['Class A', 'Class B', 'Class G'], answer: 0,
            explain: 'Class A (18,000 ft and up) is for IFR flights only.' },
          { t: 'test', html: `<p>Federal airways are Class E airspace extending <b>from 1,200 feet above the surface up to and including 17,999 feet MSL</b>.</p>` }
        ]
      },
      {
        id: 'bcd', emoji: '🗼', title: 'Class B, C & D Rules', blurb: 'What you need to get in', minutes: 7, xp: 50,
        phak: 'Chapter 15 → “Class B Airspace,” “Class C Airspace,” and “Class D Airspace”',
        cards: [
          { t: 'talk', html: `<p><b>Class B</b>, the big leagues:</p><ul><li>You need an ATC <b>clearance</b>. Listen for “<b>cleared into the Class Bravo</b>.”</li><li>At least a <b>private pilot certificate</b>, or a student pilot with the right endorsement.</li><li>A transponder with altitude reporting (<b>Mode C</b>) and <b>ADS-B Out</b>, including inside the <b>30 NM “Mode C veil”</b> around it.</li></ul>` },
          { t: 'talk', html: `<p><b>Class C</b>:</p><ul><li>A <b>5 NM</b> inner ring from the surface to 4,000 ft AGL, and a <b>10 NM</b> shelf from 1,200 to 4,000 ft AGL.</li><li>Establish <b>two-way radio communication</b> before entering. That means ATC answers using <b>your callsign</b>.</li><li>Mode C transponder and ADS-B Out required.</li></ul><p><b>Class D</b>: usually up to <b>2,500 ft AGL</b> around a towered airport. Establish two-way radio communication before entering.</p>` },
          { t: 'check', q: 'You call Class C approach and hear: “Aircraft calling, standby.” Can you enter?',
            choices: ['Yes, they answered', 'No, they didn’t use your callsign', 'Yes, if you stay low'], answer: 1,
            explain: 'Two-way communication requires ATC to respond with YOUR callsign. “Aircraft calling, standby” doesn’t count.' },
          { t: 'talk', html: `<p>Speed limits:</p><ul><li><b>250 knots</b> below 10,000 ft MSL.</li><li><b>200 knots</b> at or below 2,500 ft AGL within 4 NM of the main airport in Class C or D.</li><li><b>200 knots</b> under the shelf of Class B or in a VFR corridor.</li></ul><p>(No worries in a Cessna. It can’t go that fast!)</p>` },
          { t: 'test', html: `<ul><li>Class B → <b>private pilot certificate or student with endorsements</b>.</li><li>Class C → <b>two-way radio and a Mode C transponder</b> (plus ADS-B Out).</li><li>Class C vertical limit → normally <b>4,000 ft AGL</b>.</li><li>Departing a satellite airport inside Class C → contact ATC <b>as soon as practicable after takeoff</b>.</li></ul>` }
        ]
      },
      {
        id: 'vfr', emoji: '☁️', title: 'VFR Weather Minimums', blurb: 'How close to clouds you can fly', minutes: 7, xp: 50,
        phak: 'Chapter 15 → airspace classes and VFR weather minimums (14 CFR 91.155)',
        cards: [
          { t: 'talk', html: `<p>VFR pilots must see where they’re going, so each airspace class has minimum <b>visibility</b> and <b>distance from clouds</b>. Why stay away from clouds? An airplane flying IFR could pop out of one right in front of you!</p>` },
          { t: 'diagram', svg: clearance, caption: 'The most common cloud clearance rule.' },
          { t: 'talk', html: `<ul><li><b>Class B</b>: 3 SM, <b>clear of clouds</b>.</li><li><b>Class C, D, and E below 10,000 MSL</b>: 3 SM, 500 below, 1,000 above, 2,000 horizontal (“3-152”).</li><li><b>Class E at or above 10,000 MSL</b>: <b>5 SM</b>, 1,000 below, 1,000 above, <b>1 SM</b> horizontal.</li><li><b>Class G, daytime, 1,200 AGL or below</b>: <b>1 SM, clear of clouds</b>.</li></ul><p>To take off or land at an airport inside Class B, C, D or surface E, the weather must be at least a <b>1,000-ft ceiling and 3 SM visibility</b>. If it isn’t, you can ask for <b>special VFR</b> (1 SM, clear of clouds). At night, special VFR requires an instrument rating and an IFR-equipped airplane.</p>` },
          { t: 'check', q: 'What is the minimum visibility for VFR flight in Class D airspace?',
            choices: ['1 statute mile', '3 statute miles', '5 statute miles'], answer: 1,
            explain: 'Class D uses 3-152: 3 SM visibility, 500 below, 1,000 above, 2,000 horizontal.' },
          { t: 'check', q: 'Flying VFR in Class E at 11,500 ft MSL, what visibility do you need?',
            choices: ['3 SM', '5 SM', '1 SM'], answer: 1,
            explain: 'At or above 10,000 MSL (and above 1,200 AGL), visibility goes up to 5 SM: you’re going faster up there.' },
          { t: 'test', html: `<ul><li>Below 1,200 AGL in controlled airspace → <b>2,000 ft</b> horizontal from clouds.</li><li>Visibility increases to <b>5 SM at 10,000 MSL</b> (if above 1,200 AGL).</li><li>Class G, 700 AGL or below, daytime → <b>1 mile and clear of clouds</b>.</li></ul>` }
        ]
      },
      {
        id: 'sua', emoji: '🚧', title: 'Special Use Airspace', blurb: 'Military zones, TFRs and more', minutes: 6, xp: 50,
        phak: 'Chapter 15 → “Special Use Airspace” and “Other Airspace Areas”',
        cards: [
          { t: 'talk', html: `<ul><li><b>Prohibited areas</b> (P-): no flying, for security reasons. Example: P-56 over the White House.</li><li><b>Restricted areas</b> (R-): invisible hazards like artillery or missiles. Don’t enter when active without permission from the <b>controlling agency</b>.</li><li><b>Warning areas</b> (W-): like restricted areas, but over international waters.</li><li><b>Military Operations Areas (MOAs)</b>: military training. VFR flight is allowed, but use <b>extreme caution</b> when they’re active.</li><li><b>Alert areas</b> (A-): lots of pilot training. <b>All pilots</b> are responsible for avoiding collisions.</li><li><b>Controlled firing areas</b>: activities stop when aircraft approach. Not shown on charts.</li></ul>` },
          { t: 'check', q: 'You want to fly through an active restricted area. What do you need?',
            choices: ['An IFR flight plan', 'Prior permission from the controlling agency', 'Nothing; just fly through quickly'], answer: 1,
            explain: 'Restricted areas can contain invisible hazards. Get permission from the controlling agency first.' },
          { t: 'talk', html: `<p>Other areas to know:</p><ul><li><b>TFRs</b> (Temporary Flight Restrictions): pop-up no-fly zones for things like wildfires, presidential visits or big stadium events. Always check NOTAMs!</li><li><b>Military Training Routes (MTRs)</b>: fast, low-flying jets.</li><li><b>Parachute jump areas</b>.</li><li><b>Washington, DC Special Flight Rules Area</b>: special procedures and training required.</li></ul>` },
          { t: 'fact', html: `<p>Pilots who bust a TFR may be intercepted by military jets or helicopters! If that ever happens, follow their signals and tune to 121.5 MHz.</p>` },
          { t: 'test', html: `<ul><li>MOA → <b>exercise extreme caution</b> when military activity is happening.</li><li>Restricted area → <b>prior authorization from the controlling agency</b>.</li><li>Alert area → collision avoidance is up to <b>all pilots</b>.</li></ul>` }
        ]
      },
      {
        id: 'charts', emoji: '🧭', title: 'Airspace on the Chart', blurb: 'Colors and lines on a sectional', minutes: 5, xp: 50,
        phak: 'Chapter 15 and Chapter 16 → airspace depiction on sectional charts',
        cards: [
          { t: 'talk', html: `<p>On a <b>sectional chart</b>, airspace is drawn with colors and line styles:</p><ul><li><b>Class B</b>: solid <b>blue</b> lines.</li><li><b>Class C</b>: solid <b>magenta</b> lines.</li><li><b>Class D</b>: dashed <b>blue</b> line.</li><li><b>Class E to the surface</b>: dashed <b>magenta</b> line.</li><li><b>Class E starting at 700 AGL</b>: fuzzy <b>magenta</b> shading (a “vignette”).</li><li><b>Class E starting at 1,200 AGL</b>: fuzzy <b>blue</b> shading.</li></ul>` },
          { t: 'talk', html: `<p>Numbers like <b>70/30</b> inside a Class B or C ring mean the top is <b>7,000 ft MSL</b> and the bottom is <b>3,000 ft MSL</b> (in hundreds of feet). <b>SFC</b> means it starts at the surface. A Class D ceiling shows in a dashed box, like <b>[25]</b> = 2,500 ft MSL.</p>` },
          { t: 'check', q: 'On a sectional, a dashed blue line around an airport means…',
            choices: ['Class B', 'Class C', 'Class D'], answer: 2,
            explain: 'Dashed blue = Class D. Solid blue = Class B. Solid magenta = Class C.' },
          { t: 'tryit', html: `<p>The FAA’s sectional charts are free online. Search for “VFRMap” and find your town. Can you spot Class B, C and D airspace near you?</p>` }
        ]
      }
    ],

    quizLength: 12,
    quiz: [
      { q: 'What minimum pilot certification is required for operation within Class B airspace?', choices: ['Private pilot certificate or student pilot certificate with appropriate logbook endorsements.', 'Recreational pilot certificate.', 'Private pilot certificate with an instrument rating.'], answer: 0, explain: 'Student pilots need specific endorsements.' },
      { q: 'What minimum radio and transponder equipment is required for operation within Class C airspace?', choices: ['Two-way radio communications equipment and a transponder with altitude reporting (Mode C), plus ADS-B Out.', 'Two-way radio communications equipment only.', 'A transponder only.'], answer: 0, explain: 'Talk to ATC, and let radar see your altitude.' },
      { q: 'Unless otherwise authorized, two-way radio communications with Air Traffic Control are required for landings or takeoffs', choices: ['at all tower controlled airports regardless of weather conditions.', 'at all tower controlled airports only when weather conditions are less than VFR.', 'at all tower controlled airports within Class D airspace only when weather conditions are less than VFR.'], answer: 0, explain: 'Tower airports always need radio contact.' },
      { q: 'The vertical limit of Class C airspace above the primary airport is normally', choices: ['4,000 feet AGL.', '1,200 feet AGL.', '3,000 feet AGL.'], answer: 0, explain: 'Class C usually goes up to 4,000 ft AGL.' },
      { q: 'Unless otherwise specified, Federal Airways include that Class E airspace extending upward from', choices: ['1,200 feet above the surface up to and including 17,999 feet MSL.', '700 feet above the surface up to and including 17,999 feet MSL.', 'the surface up to and including 18,000 feet MSL.'], answer: 0, explain: 'Airways start at 1,200 AGL.' },
      { q: 'Normal VFR operations in Class D airspace with an operating control tower require the ceiling and visibility to be at least', choices: ['1,000 feet and 3 miles.', '1,000 feet and 1 mile.', '2,500 feet and 3 miles.'], answer: 0, explain: 'Basic VFR minimums in a surface area.' },
      { q: 'What minimum flight visibility is required for VFR flight operations on an airway below 10,000 feet MSL?', choices: ['3 miles.', '1 mile.', '4 miles.'], answer: 0, explain: 'Airways are Class E: 3 SM below 10,000 MSL.' },
      { q: 'During operations within controlled airspace at altitudes of less than 1,200 feet AGL, the minimum horizontal distance from clouds requirement for VFR flight is', choices: ['2,000 feet.', '1,000 feet.', '1,500 feet.'], answer: 0, explain: '3-152: 2,000 ft horizontal.' },
      { q: 'VFR flight in controlled airspace above 1,200 feet AGL and below 10,000 feet MSL requires a minimum visibility and vertical cloud clearance of', choices: ['3 miles, and 500 feet below or 1,000 feet above the clouds in controlled airspace.', '5 miles, and 1,000 feet below or 1,000 feet above the clouds at all altitudes.', '5 miles, and 1,000 feet below or 1,000 feet above the clouds only in Class A airspace.'], answer: 0, explain: 'That’s 3-152.' },
      { q: 'The minimum flight visibility for VFR flight increases to 5 statute miles beginning at an altitude of', choices: ['10,000 feet MSL if above 1,200 feet AGL.', '14,500 feet MSL.', '10,000 feet MSL regardless of height above ground.'], answer: 0, explain: 'Higher means faster traffic and more room needed.' },
      { q: 'What minimum visibility and clearance from clouds are required for VFR operations in Class G airspace at 700 feet AGL or below during daylight hours?', choices: ['1 mile visibility and clear of clouds.', '1 mile visibility, 500 feet below, 1,000 feet above, and 2,000 feet horizontal clearance from clouds.', '3 miles visibility and clear of clouds.'], answer: 0, explain: 'Class G, low and in daylight: 1 SM and clear of clouds.' },
      { q: 'What are the minimum requirements for airplane operations under special VFR in Class D airspace at night?', choices: ['The pilot must be instrument rated, and the airplane must be IFR equipped.', 'The airplane must be under radar surveillance at all times while in Class D airspace.', 'The airplane must be equipped for IFR with an altitude reporting transponder.'], answer: 0, explain: 'Night special VFR needs an instrument-rated pilot and IFR airplane.' },
      { q: 'Unless otherwise authorized or required by ATC, the maximum indicated airspeed at which a person may operate an aircraft below 10,000 feet MSL is', choices: ['250 knots.', '200 knots.', '288 knots.'], answer: 0, explain: '250 knots below 10,000 MSL.' },
      { q: 'At or below 2,500 feet AGL within 4 NM of the primary airport of Class C or D airspace, the maximum indicated airspeed is', choices: ['200 knots.', '250 knots.', '156 knots.'], answer: 0, explain: '200 knots near Class C and D airports.' },
      { q: 'What action should a pilot take when operating under VFR in a Military Operations Area (MOA)?', choices: ['Exercise extreme caution when military activity is being conducted.', 'Obtain a clearance from the controlling agency prior to entering the MOA.', 'Operate only on the airways that transverse the MOA.'], answer: 0, explain: 'VFR flight through an MOA is legal, but be careful.' },
      { q: 'Flight through a restricted area should not be accomplished unless the pilot has', choices: ['received prior authorization from the controlling agency.', 'filed an IFR flight plan.', 'received prior permission from the commanding officer of the nearest military base.'], answer: 0, explain: 'The controlling agency grants permission.' },
      { q: 'Responsibility for collision avoidance in an alert area rests with', choices: ['all pilots.', 'the controlling agency.', 'Air Traffic Control.'], answer: 0, explain: 'Everyone watches out in alert areas.' },
      { q: 'Under what condition may an aircraft operate from a satellite airport within Class C airspace?', choices: ['The pilot must contact ATC as soon as practicable after takeoff.', 'The pilot must file a flight plan prior to departure.', 'The pilot must monitor ATC until clear of the Class C airspace.'], answer: 0, explain: 'Contact ATC soon after takeoff.' },
      { q: 'On a sectional chart, Class C airspace is shown with', choices: ['solid magenta lines.', 'solid blue lines.', 'dashed blue lines.'], answer: 0, explain: 'B = solid blue, C = solid magenta, D = dashed blue.' },
      { q: 'In which class of airspace are VFR flights prohibited?', choices: ['Class A.', 'Class B.', 'Class C.'], answer: 0, explain: 'Class A is IFR only.' }
    ],

    glossary: [
      { term: 'Controlled airspace', def: 'Airspace where ATC service is provided: Classes A, B, C, D and E.' },
      { term: 'Uncontrolled airspace', def: 'Class G airspace.' },
      { term: 'Class A', def: '18,000 ft MSL to FL600. IFR only; altimeters set to 29.92.' },
      { term: 'Class B', def: 'Airspace around the busiest airports. Requires an ATC clearance.' },
      { term: 'Class C', def: 'Around busy radar airports. Two-way radio contact required. Usually to 4,000 ft AGL.' },
      { term: 'Class D', def: 'Around towered airports, usually to 2,500 ft AGL. Two-way radio required.' },
      { term: 'Class E', def: 'Controlled airspace that isn’t A, B, C or D.' },
      { term: 'Class G', def: 'Uncontrolled airspace, usually near the surface.' },
      { term: 'Mode C veil', def: '30 NM around Class B where an altitude-reporting transponder and ADS-B Out are required.' },
      { term: 'ADS-B Out', def: 'Equipment that broadcasts your GPS position to ATC and other aircraft.' },
      { term: '3-152', def: 'VFR minimums: 3 SM visibility, 1,000 above, 500 below, 2,000 horizontal from clouds.' },
      { term: 'Special VFR', def: 'ATC permission to operate in a surface area below basic VFR weather: 1 SM, clear of clouds.' },
      { term: 'Prohibited area', def: 'Airspace where flight is not allowed, for national security.' },
      { term: 'Restricted area', def: 'Airspace with invisible hazards. Need permission when active.' },
      { term: 'MOA', def: 'Military Operations Area: VFR allowed, but use extreme caution.' },
      { term: 'Alert area', def: 'Airspace with lots of pilot training or unusual activity.' },
      { term: 'Warning area', def: 'Hazardous airspace over international waters.' },
      { term: 'TFR', def: 'Temporary Flight Restriction, published by NOTAM.' },
      { term: 'Sectional chart', def: 'The VFR map pilots use, showing terrain, airports and airspace.' }
    ]
  });
})();
