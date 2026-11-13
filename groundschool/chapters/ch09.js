// Chapter 9 — Flight Manuals and Other Documents (PHAK FAA-H-8083-25C)
(() => {
  const { txt, lines, box, svg } = SKY.draw;

  const arrow = svg(320, 150, `
    ${[['A', 'Airworthiness', 'certificate'], ['R', 'Registration', 'certificate'], ['R', 'Radio license', '(international)'], ['O', 'Operating', 'limitations'], ['W', 'Weight &', 'balance']].map(([l, a, b], i) => {
      const x = 4 + i * 63;
      return box(x, 20, 59, 110) + `<circle cx="${x + 29.5}" cy="50" r="20" class="${i === 2 ? 'd-muted' : 'd-brand'}"/>` + txt(x + 29.5, 57, l, 't-white d-text') +
        txt(x + 29.5, 92, a, 'd-small') + txt(x + 29.5, 104, b, 'd-small');
    }).join('')}
    ${txt(160, 146, 'Documents that must be on board: ARROW', 'd-text')}`,
    'ARROW: Airworthiness certificate, Registration, Radio station license, Operating limitations, Weight and balance');

  const poh = svg(320, 200, `
    ${['1 · General', '2 · Limitations', '3 · Emergency Procedures', '4 · Normal Procedures', '5 · Performance', '6 · Weight & Balance', '7 · Systems Description', '8 · Handling & Service', '9 · Supplements'].map((s, i) => {
      const y = 8 + i * 21;
      return `<rect x="40" y="${y}" width="240" height="18" rx="4" class="${i === 1 || i === 2 ? 'd-accent' : 'd-box'}"/>` + txt(52, y + 13, s, i === 1 || i === 2 ? 't-white d-text' : 'd-text', 'start');
    }).join('')}`,
    'The standard sections of a Pilot’s Operating Handbook');

  SKY.registerChapter({
    id: 'ch09',
    badge: { name: 'Paperwork Pro', emoji: '📘', desc: 'You know the POH, the required documents, inspections and ADs.' },
    game: {
      engine: 'sort', title: 'Rapid Sort', blurb: 'Documents, inspections and POH sections', xpEach: 30,
      rounds: [
        { id: 'onboard', title: 'On Board or Not?', brief: 'Must it be in the airplane for a normal flight inside the U.S.?',
          buckets: ['✅ Required on board', '❌ Not required on board'],
          items: [
            { t: 'Airworthiness certificate', b: 0 }, { t: 'Registration certificate', b: 0 }, { t: 'POH / operating limitations', b: 0 },
            { t: 'Weight and balance data', b: 0 }, { t: 'Aircraft maintenance logbooks', b: 1, why: 'Logbooks are kept by the owner, not carried in the plane.' },
            { t: 'Radio station license (domestic flight)', b: 1, why: 'Only needed for international flights.' }, { t: 'The bill of sale', b: 1 },
            { t: 'Your pilot certificate and medical', b: 0, why: 'Those must be with you as pilot in command.' }] },
        { id: 'interval', title: 'How Often?', brief: 'How often is each inspection or renewal due?',
          buckets: ['Every 12 calendar months', 'Every 24 calendar months', 'Every 100 hours', 'Every 7 years'],
          items: [
            { t: 'Annual inspection', b: 0 }, { t: 'ELT inspection', b: 0 }, { t: 'Transponder check', b: 1 },
            { t: '100-hour inspection (planes used for hire)', b: 2 }, { t: 'Aircraft registration renewal', b: 3 },
            { t: 'Third-class medical for a pilot age 40+', b: 1 }] },
        { id: 'pohsec', title: 'Find It in the POH', brief: 'Which POH section would you open?',
          buckets: ['Limitations', 'Emergency Procedures', 'Normal Procedures', 'Performance'],
          items: [
            { t: 'Never-exceed speed and max weight', b: 0 }, { t: 'Engine fire in flight', b: 1 }, { t: 'Preflight inspection checklist', b: 2 },
            { t: 'Takeoff distance charts', b: 3 }, { t: 'Engine failure after takeoff', b: 1 }, { t: 'Before-landing checklist', b: 2 },
            { t: 'Approved fuel grades and placards', b: 0 }, { t: 'Cruise speed and fuel burn tables', b: 3 }] }
      ]
    },
    missions: [
      {
        id: 'poh', emoji: '📖', title: 'The POH: Your Airplane’s Manual', blurb: 'What’s in the book', minutes: 5, xp: 50,
        phak: 'Chapter 9 → “Airplane Flight Manuals (AFM)” and “Pilot’s Operating Handbook (POH)”',
        cards: [
          { t: 'talk', html: `<p>Every airplane comes with an owner’s manual: the <b>Pilot’s Operating Handbook (POH)</b> or, officially, the <b>Airplane Flight Manual (AFM)</b>. It’s written by the manufacturer, and the important parts are <b>FAA-approved</b>.</p><p>It’s the most important book for that specific airplane. Even two Cessna 172s from different years can have different numbers!</p>` },
          { t: 'diagram', svg: poh, caption: 'Most POHs follow the same standard order.' },
          { t: 'talk', html: `<ul><li><b>Limitations</b>: things you must not exceed, like airspeeds (V<sub>NE</sub>), weights, engine limits, approved fuel and placards.</li><li><b>Emergency Procedures</b>: checklists for engine failures, fires and more.</li><li><b>Normal Procedures</b>: preflight, before takeoff, landing…</li><li><b>Performance</b>: charts for takeoff distance, climb, cruise and landing.</li><li><b>Weight & Balance / Equipment List</b>: how to load the plane safely.</li><li><b>Supplements</b>: info for extra equipment like a GPS or autopilot.</li></ul>` },
          { t: 'check', q: 'Where would you find the airplane’s never-exceed speed and maximum weight?',
            choices: ['Normal Procedures', 'Limitations', 'Systems Description'], answer: 1,
            explain: 'The Limitations section holds the hard limits: speeds, weights, engine limits and placards.' },
          { t: 'tryit', html: `<p>Many POHs are free online. Search for a “Cessna 172S POH” and flip through Section 4 (Normal Procedures). You’ll see the real checklists pilots use!</p>` }
        ]
      },
      {
        id: 'docs', emoji: '📄', title: 'Documents On Board: ARROW', blurb: 'What must be in the plane', minutes: 5, xp: 50,
        phak: 'Chapter 9 → “Aircraft Documents”',
        cards: [
          { t: 'diagram', svg: arrow, caption: 'Memory aid: ARROW.' },
          { t: 'talk', html: `<ul><li><b>Airworthiness certificate</b>: proves the airplane met FAA design standards. It stays valid as long as the airplane is maintained properly. It must be <b>displayed where passengers or crew can see it</b>.</li><li><b>Registration certificate</b>: shows who owns it. It’s good for <b>7 years</b>, then must be renewed.</li><li><b>Radio station license</b>: only required for <b>international</b> flights.</li><li><b>Operating limitations</b>: the POH/AFM, placards and instrument markings.</li><li><b>Weight and balance</b> info for that specific airplane.</li></ul>` },
          { t: 'check', q: 'Which of these is NOT required to be carried in the airplane?',
            choices: ['The registration certificate', 'The maintenance logbooks', 'The airworthiness certificate'], answer: 1,
            explain: 'Maintenance records are kept by the owner. Check them before you fly, but they don’t have to ride along.' },
          { t: 'fact', html: `<p>Many pilots also add the <b>pilot’s</b> documents: “<b>ARROW + PMI</b>” (Pilot certificate, Medical, photo ID). Those must be with you, not just in the plane!</p>` },
          { t: 'test', html: `<p>The airworthiness certificate must be <b>displayed at the cabin or cockpit entrance</b> so it’s readable by passengers or crew.</p>` }
        ]
      },
      {
        id: 'maint', emoji: '🔩', title: 'Inspections & Maintenance', blurb: 'Annual, 100-hour and more', minutes: 6, xp: 50,
        phak: 'Chapter 9 → “Aircraft Maintenance,” “Aircraft Inspections,” and “Preventive Maintenance”',
        cards: [
          { t: 'talk', html: `<p>The <b>owner or operator</b> is responsible for keeping the airplane airworthy. The <b>pilot</b> decides if it’s safe for each flight, through the <b>preflight inspection</b> and a check of the maintenance records.</p>` },
          { t: 'talk', html: `<ul><li><b>Annual inspection</b>: every airplane needs one within the previous <b>12 calendar months</b>.</li><li><b>100-hour inspection</b>: needed if the airplane carries people <b>for hire</b> or is used for <b>flight instruction for hire</b> by someone providing the plane. You may go up to <b>10 hours over</b> only to get to a place where it can be done, and those extra hours count toward the next one.</li><li>An annual inspection <b>can count as</b> a 100-hour inspection, but not the other way around.</li></ul>` },
          { t: 'check', q: 'An airplane had its 100-hour inspection at 1259.6 hours. When is the next one due?',
            choices: ['1349.6', '1359.6', '1369.6'], answer: 1,
            explain: '1259.6 + 100 = 1359.6 hours.' },
          { t: 'check', q: 'A 100-hour inspection was due at 3302.5 hours but was done at 3309.5. When is the next one due?',
            choices: ['3402.5', '3409.5', '3312.5'], answer: 0,
            explain: 'The 7 extra hours count against the next interval, so the next one is still due at 3402.5.' },
          { t: 'talk', html: `<p>Other required checks: <b>transponder</b> every <b>24 calendar months</b> and <b>ELT</b> (emergency locator transmitter) every <b>12 calendar months</b>. Replace the ELT battery after <b>1 hour of cumulative use</b> or half its useful life.</p><p>Pilots can do some simple <b>preventive maintenance</b> on airplanes they own or operate, like changing oil or tires, but it must be logged with a description, date, and the pilot’s signature and certificate number.</p>` },
          { t: 'test', html: `<ul><li>Annual done July 12 → next due by <b>July 31</b> next year (calendar months!).</li><li>Proof of an annual → an entry in the <b>maintenance records</b>.</li><li>Airworthiness can be determined by a <b>preflight inspection and a review of the maintenance records</b>.</li></ul>` }
        ]
      },
      {
        id: 'ads', emoji: '📢', title: 'Airworthiness Directives', blurb: 'Mandatory safety fixes', minutes: 4, xp: 50,
        phak: 'Chapter 9 → “Airworthiness Directives (ADs)” and “Special Flight Permits”',
        cards: [
          { t: 'talk', html: `<p>When the FAA finds an unsafe condition in a type of airplane, engine or part, it issues an <b>Airworthiness Directive (AD)</b>. ADs are <b>mandatory</b>: a required fix or inspection.</p><ul><li>Some are one-time fixes. Others are <b>recurring</b> (for example, “inspect every 100 hours”).</li><li>The <b>owner or operator</b> must make sure ADs are followed.</li><li>Compliance goes in the <b>maintenance records</b>.</li></ul>` },
          { t: 'check', q: 'Who is responsible for making sure ADs are complied with?',
            choices: ['The owner or operator', 'The FAA', 'The mechanic only'], answer: 0,
            explain: 'The owner/operator is responsible for airworthiness, including ADs.' },
          { t: 'talk', html: `<p>Can you fly a plane that hasn’t complied with an AD? Only if <b>the AD itself allows it</b>. Some give a grace period.</p><p>If an airplane isn’t airworthy but can still fly safely, the FAA can issue a <b>special flight permit</b> (a “ferry permit”) to fly it somewhere for repairs.</p>` },
          { t: 'fact', html: `<p>ADs are a big reason flying is so safe. When one airplane anywhere has a problem, every airplane of that type gets checked!</p>` }
        ]
      },
      {
        id: 'inop', emoji: '🚫', title: 'Broken Equipment', blurb: 'Can I still fly?', minutes: 4, xp: 50,
        phak: 'Chapter 9 → “Aircraft Owner/Operator Responsibilities” and inoperative equipment (14 CFR 91.213)',
        cards: [
          { t: 'talk', html: `<p>Say a light or instrument is broken during preflight. Can you still go? If the airplane has no Minimum Equipment List (most small planes don’t), ask:</p><ul><li>Is it required by the <b>equipment list</b>, the <b>type certificate</b>, an <b>AD</b>, or the <b>regulations</b> for the flight you’re doing (day, night)?</li><li>If not required, it must be <b>removed</b>, or <b>deactivated and placarded “INOPERATIVE”</b>.</li><li>Then the <b>pilot</b> decides whether it’s still safe.</li></ul>` },
          { t: 'check', q: 'A non-required cabin light is broken. Before flying, it must be…',
            choices: ['Ignored', 'Deactivated and placarded “INOPERATIVE” (or removed)', 'Fixed by the pilot'], answer: 1,
            explain: 'Inoperative equipment that isn’t required must be removed or deactivated and placarded.' },
          { t: 'tryit', html: `<p>Pilots remember day-VFR required equipment with “<b>A TOMATO FLAMES</b>”: Altimeter, Tachometer, Oil pressure, Manifold pressure (if needed), Airspeed, Temperature (for liquid-cooled engines), Oil temperature, Fuel gauge, Landing gear position, Anti-collision lights, Magnetic compass, ELT, Seat belts. Try saying it fast!</p>` }
        ]
      }
    ],

    quizLength: 12,
    quiz: [
      { q: 'Who is responsible for ensuring Airworthiness Directives (ADs) are complied with?', choices: ['Owner or operator.', 'Repair station.', 'Mechanic with inspection authorization (IA).'], answer: 0, explain: 'The owner/operator is responsible for airworthiness.' },
      { q: 'Which is true concerning required maintenance inspections?', choices: ['An annual inspection may be substituted for a 100-hour inspection.', 'A 100-hour inspection may be substituted for an annual inspection.', 'An annual inspection is required even if a progressive inspection system has been approved.'], answer: 0, explain: 'An annual covers a 100-hour, but not the reverse.' },
      { q: 'An aircraft had a 100-hour inspection when the tachometer read 1259.6. When is the next 100-hour inspection due?', choices: ['1359.6 hours.', '1349.6 hours.', '1369.6 hours.'], answer: 0, explain: 'Add 100 hours.' },
      { q: 'A 100-hour inspection was due at 3302.5 hours. It was actually done at 3309.5 hours. When is the next 100-hour inspection due?', choices: ['3402.5 hours.', '3409.5 hours.', '3312.5 hours.'], answer: 0, explain: 'Hours flown past the due time count toward the next inspection.' },
      { q: 'An aircraft’s annual condition inspection was performed on July 12, this year. The next annual inspection will be due no later than', choices: ['July 31, next year.', 'July 13, next year.', 'July 1, next year.'], answer: 0, explain: '12 calendar months: runs to the end of the month.' },
      { q: 'Which records or documents shall the owner or operator of an aircraft keep to show compliance with an applicable Airworthiness Directive?', choices: ['Aircraft maintenance records.', 'Airworthiness Certificate and Pilot’s Operating Handbook.', 'Airworthiness and Registration Certificates.'], answer: 0, explain: 'AD compliance is recorded in the maintenance records.' },
      { q: 'Completion of an annual condition inspection and the return of the aircraft to service should always be indicated by', choices: ['an appropriate notation in the aircraft maintenance records.', 'the relicensing date on the Registration Certificate.', 'an inspection sticker placed on the instrument panel.'], answer: 0, explain: 'It’s logged in the maintenance records.' },
      { q: 'The airworthiness of an aircraft can be determined by a preflight inspection and a', choices: ['review of the maintenance records.', 'statement from the owner or operator that the aircraft is airworthy.', 'logbook endorsement from a flight instructor.'], answer: 0, explain: 'Check the airplane AND its records.' },
      { q: 'May a pilot operate an aircraft that is not in compliance with an Airworthiness Directive (AD)?', choices: ['Yes, if allowed by the AD.', 'Yes, under VFR conditions only.', 'Yes, ADs are only voluntary.'], answer: 0, explain: 'ADs are mandatory, but some include allowances or grace periods.' },
      { q: 'When must batteries in an emergency locator transmitter (ELT) be replaced or recharged, if rechargeable?', choices: ['When the ELT has been in use for more than 1 cumulative hour.', 'After any inadvertent activation of the ELT.', 'When the ELT can no longer be heard over the airplane’s radio.'], answer: 0, explain: 'Also at 50% of the battery’s useful life.' },
      { q: 'Where must the airworthiness certificate be displayed?', choices: ['At the cabin or cockpit entrance so it is legible to passengers or crew.', 'In the glovebox with the POH.', 'It does not need to be in the aircraft.'], answer: 0, explain: 'It must be displayed where it can be read.' },
      { q: 'Which document is NOT required to be on board the aircraft for a domestic flight?', choices: ['The aircraft maintenance logbooks.', 'The registration certificate.', 'The weight and balance data.'], answer: 0, explain: 'Maintenance records are kept by the owner.' },
      { q: 'Under current rules, an aircraft registration certificate is valid for', choices: ['7 years.', '3 years.', 'the life of the aircraft.'], answer: 0, explain: 'Registrations must be renewed every 7 years.' },
      { q: 'A 100-hour inspection is required for an aircraft that', choices: ['carries persons for hire or is provided by the instructor for flight instruction for hire.', 'is privately owned and flown only by its owner.', 'has more than one engine.'], answer: 0, explain: 'Aircraft used for hire need 100-hour inspections in addition to annuals.' },
      { q: 'Preventive maintenance has been performed on an aircraft. What paperwork is required?', choices: ['The signature, certificate number, and kind of certificate held by the person approving the work and a description of the work must be entered in the aircraft maintenance records.', 'A full, detailed description of the work done must be entered in the airframe logbook only.', 'The date and the name of the person who did the work must be entered on the registration certificate.'], answer: 0, explain: 'All maintenance, including preventive, gets a proper records entry.' },
      { q: 'In which POH section would you find the never-exceed speed (VNE)?', choices: ['Limitations.', 'Normal Procedures.', 'Performance.'], answer: 0, explain: 'Airspeed limits are in Section 2: Limitations.' },
      { q: 'A transponder must have been inspected within the preceding', choices: ['24 calendar months.', '12 calendar months.', '100 hours.'], answer: 0, explain: 'Transponder checks are every 24 calendar months.' },
      { q: 'An inoperative piece of equipment that is not required for the flight must be', choices: ['removed, or deactivated and placarded “Inoperative.”', 'ignored by the pilot.', 'repaired before every flight.'], answer: 0, explain: 'This follows 14 CFR 91.213 for aircraft without an MEL.' }
    ],

    glossary: [
      { term: 'POH / AFM', def: 'The Pilot’s Operating Handbook / Airplane Flight Manual for a specific airplane.' },
      { term: 'Limitations section', def: 'The POH section with airspeed, weight, engine and other limits.' },
      { term: 'Airworthiness certificate', def: 'Shows the airplane met FAA standards. Valid while properly maintained. Must be displayed.' },
      { term: 'Registration certificate', def: 'Shows who owns the airplane. Valid for 7 years.' },
      { term: 'ARROW', def: 'Airworthiness, Registration, Radio license (international), Operating limitations, Weight & balance.' },
      { term: 'Annual inspection', def: 'Required inspection within the preceding 12 calendar months.' },
      { term: '100-hour inspection', def: 'Required every 100 hours for aircraft used for hire or rented for instruction.' },
      { term: 'Preventive maintenance', def: 'Simple maintenance a pilot-owner may do, like changing oil. Must be logged.' },
      { term: 'Airworthiness Directive (AD)', def: 'A mandatory FAA notice to fix or inspect an unsafe condition.' },
      { term: 'Special flight permit', def: 'Permission to fly an unairworthy but safe aircraft, for example to a repair shop.' },
      { term: 'ELT', def: 'Emergency Locator Transmitter: sends a distress signal after a crash.' },
      { term: 'Placard', def: 'A sign or label in the cockpit giving limits or warnings, like “INOPERATIVE.”' },
      { term: 'Owner/operator', def: 'The person responsible for keeping the aircraft airworthy and its records current.' },
      { term: 'Calendar month', def: 'Runs to the last day of the month, not to the exact date.' }
    ]
  });
})();
