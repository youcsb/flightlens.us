// Chapter 1 — Introduction to Flying (PHAK FAA-H-8083-25C)
(() => {
  const { txt, lines, box, svg, planeSide } = SKY.draw;

  const timeline = (() => {
    const pts = [
      [30, '1903', 'Wright Flyer', 'first flight'],
      [82, '1927', 'Lindbergh', 'crosses Atlantic'],
      [134, '1947', 'Yeager breaks', 'sound barrier'],
      [186, '1958', 'FAA is', 'created'],
      [238, '1969', 'Boeing 747', 'first flies'],
      [290, 'NOW', 'Your turn!', '']
    ];
    return svg(320, 200, `
      <line x1="16" y1="100" x2="304" y2="100" class="d-ink" stroke-width="3"/>
      ${pts.map(([x, yr, a, b], i) => {
        const up = i % 2 === 0;
        return `<circle cx="${x}" cy="100" r="7" class="${yr === 'NOW' ? 'd-accent' : 'd-brand'}"/>` +
          `<line x1="${x}" y1="${up ? 93 : 107}" x2="${x}" y2="${up ? 70 : 130}" class="d-muted" stroke-width="1.5"/>` +
          (up ? txt(x, 40, yr, 't-brand d-text') + lines(x, 52, [a, b], 'd-small', 'middle', 10)
              : txt(x, 146, yr, yr === 'NOW' ? 't-accent d-text' : 't-brand d-text') + lines(x, 158, [a, b], 'd-small', 'middle', 10));
      }).join('')}`,
      'Timeline of aviation: 1903 Wright Flyer, 1927 Lindbergh, 1947 sound barrier, 1958 FAA created, 1969 Boeing 747, and now you');
  })();

  const ladder = (() => {
    const steps = [['Student', 'age 16'], ['Sport /', 'Recreational'], ['Private', 'age 17'], ['Commercial', 'age 18'], ['Airline', 'Transport · 23']];
    return svg(320, 200, steps.map(([a, b], i) => {
      const x = 8 + i * 62, y = 150 - i * 28, h = 190 - y;
      return box(x, y, 58, h, i === 2 ? 'd-accent' : 'd-box', 6) + txt(x + 29, y + 16, a, i === 2 ? 't-white d-text' : 'd-text') + txt(x + 29, y + 28, b, i === 2 ? 't-white d-small' : 'd-small');
    }).join('') + txt(8, 22, 'Each step up = more privileges', 'd-text', 'start') + txt(8, 36, '(ages are minimums for airplanes)', 'd-small', 'start'),
    'Pilot certificate staircase: student, sport or recreational, private, commercial, airline transport pilot');
  })();

  const categories = svg(320, 170, `
    ${box(6, 10, 150, 72)}${txt(81, 30, 'AIRPLANE', 't-brand d-text')}${lines(81, 46, ['Single-engine land', 'Multiengine land', 'Single/multi sea'], 'd-small', 'middle', 11)}
    ${box(164, 10, 150, 72)}${txt(239, 30, 'ROTORCRAFT', 't-brand d-text')}${lines(239, 46, ['Helicopter', 'Gyroplane'], 'd-small', 'middle', 11)}
    ${box(6, 90, 150, 72)}${txt(81, 110, 'LIGHTER-THAN-AIR', 't-brand d-text')}${lines(81, 126, ['Balloon', 'Airship (blimp)'], 'd-small', 'middle', 11)}
    ${box(164, 90, 150, 72)}${txt(239, 110, 'MORE CATEGORIES', 't-brand d-text')}${lines(239, 126, ['Glider · Powered-lift', 'Powered parachute', 'Weight-shift-control'], 'd-small', 'middle', 11)}`,
    'Aircraft categories with their classes');

  SKY.registerChapter({
    id: 'ch01',
    badge: { name: 'Cleared for Takeoff', emoji: '🎫', desc: 'You know aviation’s history, how the FAA works, and the path to your pilot certificate.' },
    game: {
      engine: 'sort', title: 'Rapid Sort', blurb: 'Sort aircraft, certificates and privileges', xpEach: 30,
      rounds: [
        { id: 'cat', title: 'Name That Category', brief: 'Sort each aircraft into its category — the way pilot certificates group them.',
          buckets: ['Airplane', 'Rotorcraft', 'Glider', 'Lighter-than-air'],
          items: [
            { t: 'Cessna 172', b: 0 }, { t: 'Boeing 737', b: 0 }, { t: 'Robinson R44 helicopter', b: 1 }, { t: 'Gyroplane (autogyro)', b: 1, why: 'A gyroplane has a spinning rotor, so it’s a rotorcraft.' },
            { t: 'Sailplane with no engine', b: 2 }, { t: 'Hot air balloon', b: 3 }, { t: 'Goodyear blimp', b: 3, why: 'Blimps are airships, which are lighter-than-air.' },
            { t: 'Piper Cub', b: 0 }, { t: 'Black Hawk helicopter', b: 1 }, { t: 'Glider towed up by a tow plane', b: 2 }] },
        { id: 'priv', title: 'Can a Private Pilot Do It?', brief: 'Private pilots can’t fly for hire — but they can do a LOT. Yes or no?',
          buckets: ['✅ Yes', '❌ No'],
          items: [
            { t: 'Take friends flying and split the fuel bill evenly', b: 0, why: 'Sharing costs equally (pro rata) is allowed.' },
            { t: 'Get paid to fly a sightseeing tour', b: 1, why: 'Flying for compensation or hire needs a commercial certificate.' },
            { t: 'Fly across the country on vacation', b: 0 },
            { t: 'Charge passengers the full cost of the flight', b: 1, why: 'The pilot must pay at least an equal share.' },
            { t: 'Fly at night (after night training)', b: 0 },
            { t: 'Advertise “airplane rides for sale”', b: 1 },
            { t: 'Rent an airplane from a flight school', b: 0 },
            { t: 'Fly as a paid airline pilot', b: 1, why: 'That takes an Airline Transport Pilot certificate.' }] },
        { id: 'who', title: 'Who or What Is It?', brief: 'Match each description to the right part of the aviation world.',
          buckets: ['FAA', 'AIM', 'Advisory Circular', 'NOTAM'],
          items: [
            { t: 'Writes the rules and issues pilot certificates', b: 0 },
            { t: 'The official guide to flight procedures and ATC', b: 1, why: 'AIM = Aeronautical Information Manual.' },
            { t: 'Helpful guidance that isn’t a rule', b: 2, why: 'Advisory Circulars are informational, not regulations.' },
            { t: '“Runway 9 closed for repairs today”', b: 3, why: 'NOTAM = Notice to Air Missions: time-critical info.' },
            { t: 'Part of the U.S. Department of Transportation', b: 0 },
            { t: 'A temporary flight restriction alert', b: 3 },
            { t: 'Explains radio phraseology and airport lighting', b: 1 },
            { t: 'Has numbers like “AC 00-6”', b: 2 }] }
      ]
    },
    missions: [
      {
        id: 'history', emoji: '📜', title: 'From Kitty Hawk to Today', blurb: 'How people learned to fly', minutes: 5, xp: 50,
        phak: 'Chapter 1 → “History of Flight” and “History of the Federal Aviation Administration”',
        cards: [
          { t: 'talk', html: `<p>Welcome to ground school, cadet! I’m <b>Jax</b>, your <b>CFI</b> (Certified Flight Instructor). Before we fly, let’s meet the people who figured it out first.</p>` },
          { t: 'talk', html: `<p>On <b>December 17, 1903</b>, near Kitty Hawk, North Carolina, <b>Orville Wright</b> made the first powered, controlled, sustained flight in a heavier-than-air machine. It lasted <b>12 seconds</b> and covered <b>120 feet</b>. That’s shorter than the wingspan of a Boeing 747!</p><p>The Wrights’ big breakthrough wasn’t just the engine. It was <b>control</b>: they figured out how to roll, pitch and yaw the airplane on purpose.</p>` },
          { t: 'diagram', svg: timeline, caption: 'Less than 70 years from a 12-second hop to a 747.' },
          { t: 'talk', html: `<p>Early airplanes found a job carrying <b>airmail</b> starting in <b>1918</b>. Flying was dangerous, so the government stepped in with rules:</p><ul><li><b>1926</b>: Air Commerce Act. The first licensing of pilots and aircraft.</li><li><b>1938</b>: Civil Aeronautics Act.</li><li><b>1958</b>: Federal Aviation Act creates the <b>Federal Aviation Agency</b>.</li><li><b>1967</b>: It joins the new Department of Transportation and becomes the <b>Federal Aviation Administration (FAA)</b>.</li></ul>` },
          { t: 'check', q: 'How long was the very first Wright Brothers flight?',
            choices: ['About 12 seconds', 'About 12 minutes', 'About 1 hour'], answer: 0,
            explain: '12 seconds and 120 feet. Later that day Wilbur flew 852 feet in 59 seconds.' },
          { t: 'fact', html: `<p><b>Bessie Coleman</b> couldn’t find a U.S. flight school that would teach a Black woman, so she learned French and earned her pilot license in France in <b>1921</b>. She became the first African American woman to hold a pilot license and a famous stunt pilot.</p>` },
          { t: 'test', html: `<p>History questions are rare on the FAA test, but you should know the <b>FAA</b> was created by the <b>Federal Aviation Act of 1958</b> and is part of the <b>Department of Transportation</b>.</p>` }
        ]
      },
      {
        id: 'faa', emoji: '🏛️', title: 'Meet the FAA', blurb: 'Who makes the rules of the sky', minutes: 5, xp: 50,
        phak: 'Chapter 1 → “Role of the Federal Aviation Administration”',
        cards: [
          { t: 'talk', html: `<p>The FAA is like the referee <i>and</i> the rule book of U.S. aviation. It:</p><ul><li>Writes the <b>regulations</b>, found in <b>Title 14 of the Code of Federal Regulations (14 CFR)</b>. Pilots call them the <b>FARs</b>.</li><li>Issues <b>pilot certificates</b> and <b>medical certificates</b>.</li><li>Runs <b>air traffic control</b>.</li><li>Certifies airplanes, mechanics and airports.</li></ul>` },
          { t: 'talk', html: `<p>Your local FAA office is the <b>Flight Standards District Office (FSDO</b>, said “FIZZ-doe”). It handles things like pilot certification, accident prevention and safety seminars.</p>` },
          { t: 'talk', html: `<p>The FAA publishes tons of helpful stuff. The big ones:</p><ul><li><b>AIM</b> (Aeronautical Information Manual): how to actually operate in the system: radio calls, lights, procedures.</li><li><b>Advisory Circulars (ACs)</b>: helpful guidance, <i>not</i> regulations.</li><li><b>NOTAMs</b> (Notices to Air Missions): time-sensitive alerts like closed runways or temporary flight restrictions.</li><li><b>Chart Supplement</b>: info about every public airport.</li><li><b>Airman Certification Standards (ACS)</b>: exactly what you’ll be tested on.</li></ul>` },
          { t: 'check', q: 'A runway is closed for repairs for the next two days. Where would pilots find out?',
            choices: ['An Advisory Circular', 'A NOTAM', 'The pilot’s logbook'], answer: 1,
            explain: 'NOTAMs carry time-critical information like closed runways and temporary flight restrictions. Always check them before you fly!' },
          { t: 'fact', html: `<p>The PHAK you’re reading is published by the FAA, and the questions on your knowledge test come from FAA books like it. You’re literally reading the source material!</p>` },
          { t: 'test', html: `<ul><li>Regulations = <b>14 CFR</b> (the FARs).</li><li>Advisory Circulars are <b>informational only</b>.</li><li>The <b>ACS</b> tells you exactly which knowledge and skills each test covers.</li></ul>` }
        ]
      },
      {
        id: 'aircraft', emoji: '🚁', title: 'Types of Aircraft', blurb: 'Category, class and type', minutes: 5, xp: 50,
        phak: 'Chapter 1 → “Aircraft Types and Categories”',
        cards: [
          { t: 'talk', html: `<p>To the FAA, not everything that flies is an “airplane.” Pilot certificates sort aircraft three ways:</p><ul><li><b>Category</b>: the big family. Airplane, rotorcraft, glider, lighter-than-air, powered-lift, powered parachute, weight-shift-control.</li><li><b>Class</b>: a group within the category, like <b>single-engine land</b> or <b>multiengine sea</b>.</li><li><b>Type</b>: a specific model. You need a <b>type rating</b> for big airplanes (over 12,500 lb) and jets.</li></ul>` },
          { t: 'diagram', svg: categories, caption: 'Categories (big boxes) and some of their classes.' },
          { t: 'check', q: 'A helicopter belongs to which category?',
            choices: ['Airplane', 'Rotorcraft', 'Powered-lift'], answer: 1,
            explain: 'Helicopters and gyroplanes are both classes of the rotorcraft category.' },
          { t: 'talk', html: `<p>Watch out for a tricky twist! When the FAA talks about certifying <b>airplanes themselves</b>, “category” means something else: <b>normal, utility, acrobatic</b> and so on. Those describe what the airplane is built to handle (remember the 3.8 G limit from Chapter 5?).</p>` },
          { t: 'fact', html: `<p>A <b>light-sport aircraft</b> is a small, simple aircraft that a <b>sport pilot</b> can fly. Some pilots start this way because training takes fewer hours.</p>` },
          { t: 'test', html: `<p>Classic question: <b>“With respect to the certification of airmen, which is a category of aircraft?”</b> → <i>Airplane, rotorcraft, glider, lighter-than-air.</i></p><p>And <b>class</b> → <i>single-engine land and sea, multiengine land and sea.</i></p>` }
        ]
      },
      {
        id: 'certs', emoji: '🪪', title: 'The Pilot Certificate Ladder', blurb: 'Student to airline captain', minutes: 6, xp: 50,
        phak: 'Chapter 1 → “Pilot Certifications”',
        cards: [
          { t: 'diagram', svg: ladder, caption: 'Pilot certificates, from first solo to airline captain.' },
          { t: 'talk', html: `<ul><li><b>Student pilot</b>: lets you fly solo once your instructor signs you off. No passengers!</li><li><b>Sport pilot</b>: small light-sport aircraft, daytime, one passenger.</li><li><b>Recreational pilot</b>: a step up, still with limits.</li><li><b>Private pilot</b>: the big one. Fly almost anywhere, day or night, with passengers. Just not for pay.</li><li><b>Commercial pilot</b>: you can get paid to fly.</li><li><b>Airline Transport Pilot (ATP)</b>: required to be an airline captain. Usually needs <b>1,500 hours</b>.</li></ul>` },
          { t: 'talk', html: `<p>The private pilot rule about money is important. You can’t be paid, but you <b>can split costs</b> with passengers: fuel, oil, airport fees and rental fees. You have to pay <b>at least an equal share</b> (pilots say “pro rata”).</p>` },
          { t: 'check', q: 'You and two friends fly to the beach. The trip costs $300 in fuel and rental. What’s the least you, the private pilot, must pay?',
            choices: ['$0, your friends can pay it all', '$100', '$300'], answer: 1,
            explain: '$300 split three ways is $100. You must pay at least your pro rata share.' },
          { t: 'talk', html: `<p>On top of certificates, pilots add <b>ratings</b> (like an <b>instrument rating</b> for flying in clouds) and <b>endorsements</b> (instructor sign-offs for things like tailwheel airplanes or high-performance airplanes).</p>` },
          { t: 'fact', html: `<p>Many airline pilots built their 1,500 hours by working as <b>flight instructors</b>, teaching new students while getting paid to fly. Teaching is one of the best ways to learn!</p>` },
          { t: 'test', html: `<p>A private pilot may <b>not pay less than the pro rata share</b> of the operating expenses (fuel, oil, airport expenditures, rental fees) of a flight with passengers.</p><p>Whenever you act as pilot in command, carry your <b>pilot certificate</b>, a <b>photo ID</b>, and a <b>current medical certificate</b> (if one is required).</p>` }
        ]
      },
      {
        id: 'path', emoji: '🧭', title: 'Your Path to Private Pilot', blurb: 'Medical, training, written and checkride', minutes: 6, xp: 50,
        phak: 'Chapter 1 → “Selecting a Flight School,” “How To Find a Reputable Flight Program,” and “The Student Pilot”',
        cards: [
          { t: 'talk', html: `<p>Here’s the roadmap from today to private pilot:</p><ul><li>1️⃣ Get a <b>medical certificate</b> from an <b>Aviation Medical Examiner (AME)</b>, a doctor approved by the FAA.</li><li>2️⃣ Get a <b>student pilot certificate</b>. You can solo at <b>16</b>.</li><li>3️⃣ Train with an instructor. At least <b>40 hours</b> (20 with an instructor, 10 solo) under Part 61.</li><li>4️⃣ Pass the <b>knowledge test</b> (the written).</li><li>5️⃣ Pass the <b>practical test</b> (the “checkride”) with an examiner. You can take it at <b>17</b>.</li></ul>` },
          { t: 'talk', html: `<p><b>Medical certificates</b> come in 1st, 2nd and 3rd class. Private pilots need a <b>third-class</b> medical:</p><ul><li>If you’re <b>under 40</b>, it lasts <b>60 calendar months</b> (5 years).</li><li>If you’re <b>40 or older</b>, it lasts <b>24 calendar months</b>.</li></ul><p>“Calendar months” means it runs out at the <b>end of the month</b>. Some experienced pilots can use <b>BasicMed</b> instead.</p>` },
          { t: 'check', q: 'A 17-year-old gets a third-class medical on March 10. When does it expire for private pilot privileges?',
            choices: ['March 10, 2 years later', 'March 31, 5 years later', 'March 31, 2 years later'], answer: 1,
            explain: 'Under 40 → 60 calendar months, and it runs to the end of the month. March 31, five years later.' },
          { t: 'talk', html: `<p><b>Part 61 or Part 141?</b> These are two kinds of flight schools, named after their rule sections:</p><ul><li><b>Part 61</b>: flexible, often one instructor working around your schedule. Minimum 40 hours.</li><li><b>Part 141</b>: an FAA-approved, structured syllabus with regular checks. Minimum 35 hours.</li></ul><p>Most people need more than the minimum. The national average is a lot higher, so don’t worry if it takes you longer!</p>` },
          { t: 'talk', html: `<p>The <b>knowledge test</b> has <b>60 multiple-choice questions</b>, you get <b>2.5 hours</b>, and you need <b>70%</b> to pass. You need an instructor’s sign-off (or a home-study course) before you can take it.</p><p>The <b>checkride</b> has an oral exam plus a flight with a <b>Designated Pilot Examiner (DPE)</b>, who grades you against the ACS.</p>` },
          { t: 'tryit', html: `<p>Visit a local airport with a grown-up. Many have a viewing area, a pilot shop or a flight school. Ask about a <b>discovery flight</b>, a short first lesson where you actually take the controls!</p>` },
          { t: 'test', html: `<ul><li>Third-class medical, under 40 → <b>60 calendar months</b>. 40 and over → <b>24 calendar months</b>.</li><li>To act as PIC, have your <b>pilot certificate</b>, <b>photo ID</b> and <b>medical</b> (if required) with you.</li></ul>` }
        ]
      }
    ],

    quizLength: 12,
    quiz: [
      { q: 'With respect to the certification of airmen, which is a category of aircraft?', choices: ['Airplane, rotorcraft, glider, lighter-than-air.', 'Single-engine land and sea, multiengine land and sea.', 'Normal, utility, acrobatic, limited.'], answer: 0, explain: 'For pilot certificates, categories are the big families: airplane, rotorcraft, glider, lighter-than-air, and others.' },
      { q: 'With respect to the certification of airmen, which is a class of aircraft?', choices: ['Single-engine land and sea, multiengine land and sea.', 'Airplane, rotorcraft, glider, lighter-than-air.', 'Lighter-than-air, airship, hot air balloon, gas balloon.'], answer: 0, explain: 'Classes divide a category; for airplanes: single-engine and multiengine, land and sea.' },
      { q: 'With respect to the certification of aircraft, which is a category of aircraft?', choices: ['Normal, utility, acrobatic.', 'Airplane, rotorcraft, glider.', 'Landplane, seaplane.'], answer: 0, explain: 'When certifying the aircraft itself, category describes its intended use and strength: normal, utility, acrobatic.' },
      { q: 'According to regulations pertaining to privileges and limitations, a private pilot may', choices: ['not pay less than the pro rata share of the operating expenses of a flight with passengers, provided the expenses involve only fuel, oil, airport expenditures, or rental fees.', 'act as pilot in command of an aircraft carrying a passenger for compensation if the flight is in connection with a business or employment.', 'not be paid in any manner for the operating expenses of a flight.'], answer: 0, explain: 'Private pilots can share costs, but must pay at least their equal share.' },
      { q: 'What document(s) must be in your personal possession or readily accessible in the aircraft while operating as pilot in command?', choices: ['An appropriate pilot certificate and an appropriate current medical certificate if required.', 'Certificates showing accomplishment of a checkout in the aircraft and a current flight review.', 'A pilot certificate with an endorsement showing an annual flight review and a logbook showing recency of experience.'], answer: 0, explain: 'Pilot certificate plus medical (when required). You also need a photo ID.' },
      { q: 'A third-class medical certificate is issued to a 36-year-old pilot on August 10. To exercise private pilot privileges, it is valid until midnight on', choices: ['August 31, 5 years later.', 'August 10, 2 years later.', 'August 31, 2 years later.'], answer: 0, explain: 'Under 40 at the exam → 60 calendar months, ending on the last day of the month.' },
      { q: 'For private pilot operations, a third-class medical certificate issued to a 41-year-old pilot on July 15 will expire at midnight on', choices: ['July 31, 2 years later.', 'July 15, 2 years later.', 'July 31, 1 year later.'], answer: 0, explain: '40 or older → 24 calendar months, ending on the last day of the month.' },
      { q: 'What is the minimum age to receive a student pilot certificate for airplanes?', choices: ['16', '14', '17'], answer: 0, explain: '16 for airplanes. (Glider and balloon student pilots can be 14.)' },
      { q: 'What is the minimum age to receive a private pilot certificate for airplanes?', choices: ['17', '16', '18'], answer: 0, explain: '17 for private pilot (airplane). Commercial is 18 and ATP is 23.' },
      { q: 'Under Part 61, what is the minimum total flight time for a private pilot certificate (airplane)?', choices: ['40 hours', '35 hours', '20 hours'], answer: 0, explain: '40 hours under Part 61, including at least 20 hours of instruction and 10 hours solo. Part 141 schools can do it in 35.' },
      { q: 'Which law created the agency we now call the FAA?', choices: ['The Federal Aviation Act of 1958', 'The Air Commerce Act of 1926', 'The Civil Aeronautics Act of 1938'], answer: 0, explain: 'The 1958 act created the Federal Aviation Agency. It became the Federal Aviation Administration in 1967.' },
      { q: 'Federal aviation regulations are found in', choices: ['Title 14 of the Code of Federal Regulations (14 CFR).', 'the Aeronautical Information Manual (AIM).', 'Advisory Circulars.'], answer: 0, explain: '14 CFR holds the rules. The AIM and ACs give guidance and procedures.' },
      { q: 'Advisory Circulars (ACs) are', choices: ['informational guidance and not regulatory.', 'binding regulations pilots must obey.', 'notices of temporary airport closures.'], answer: 0, explain: 'ACs explain and give guidance; they are not rules themselves.' },
      { q: 'Time-critical information such as a closed runway or a temporary flight restriction is published as a', choices: ['NOTAM.', 'Advisory Circular.', 'Chart Supplement update.'], answer: 0, explain: 'NOTAM = Notice to Air Missions. Check them before every flight.' },
      { q: 'Which document lists exactly what knowledge and skills are tested for a pilot certificate?', choices: ['The Airman Certification Standards (ACS).', 'The Chart Supplement.', 'The aircraft’s POH.'], answer: 0, explain: 'The ACS is the “answer key” for what examiners evaluate.' },
      { q: 'Which certificate is required to act as pilot in command for compensation or hire?', choices: ['Commercial pilot (or higher).', 'Private pilot.', 'Recreational pilot.'], answer: 0, explain: 'Getting paid to fly requires at least a commercial certificate.' },
      { q: 'A type rating is required to act as pilot in command of', choices: ['a large aircraft (over 12,500 lb) or a turbojet-powered airplane.', 'any airplane with retractable landing gear.', 'any multiengine airplane.'], answer: 0, explain: 'Big airplanes and jets need a type rating for that specific model.' },
      { q: 'The practical test (checkride) is graded using', choices: ['the Airman Certification Standards.', 'the score from your knowledge test.', 'your instructor’s logbook entries only.'], answer: 0, explain: 'Examiners evaluate you against the ACS for your certificate.' },
      { q: 'What score is needed to pass an FAA airman knowledge test?', choices: ['70%', '80%', '90%'], answer: 0, explain: '70% passes. (Sky Cadet asks for 80% so you have a safety margin!)' },
      { q: 'A local FAA office that handles general aviation certification and safety is called a', choices: ['Flight Standards District Office (FSDO).', 'Flight Service Station (FSS).', 'Air Route Traffic Control Center (ARTCC).'], answer: 0, explain: 'FSDOs handle pilot certification, inspections and safety programs.' }
    ],

    glossary: [
      { term: 'FAA', def: 'Federal Aviation Administration: the U.S. agency that regulates aviation, certifies pilots and aircraft, and runs air traffic control.' },
      { term: '14 CFR (FARs)', def: 'Title 14 of the Code of Federal Regulations: the official aviation rules.' },
      { term: 'AIM', def: 'Aeronautical Information Manual: the official guide to flight procedures and air traffic control.' },
      { term: 'Advisory Circular (AC)', def: 'FAA guidance that explains things but is not a regulation.' },
      { term: 'NOTAM', def: 'Notice to Air Missions: time-critical info like closed runways or temporary flight restrictions.' },
      { term: 'FSDO', def: 'Flight Standards District Office: your local FAA office.' },
      { term: 'ACS', def: 'Airman Certification Standards: exactly what you’ll be tested on for a certificate.' },
      { term: 'Category (airmen)', def: 'A broad grouping of aircraft: airplane, rotorcraft, glider, lighter-than-air, and others.' },
      { term: 'Class (airmen)', def: 'A grouping within a category, like single-engine land or multiengine sea.' },
      { term: 'Type rating', def: 'Permission to fly a specific large (over 12,500 lb) or jet aircraft model.' },
      { term: 'Pro rata share', def: 'An equal share of costs. A private pilot must pay at least this much.' },
      { term: 'AME', def: 'Aviation Medical Examiner: a doctor approved by the FAA to give pilot medical exams.' },
      { term: 'Third-class medical', def: 'Medical certificate for private pilots: 60 calendar months if under 40, 24 if 40 or older.' },
      { term: 'Part 61 / Part 141', def: 'Two kinds of flight training: flexible (61) or FAA-approved structured syllabus (141).' },
      { term: 'Knowledge test', def: 'The FAA “written” test: 60 questions, 2.5 hours, 70% to pass.' },
      { term: 'Checkride', def: 'The practical test: an oral exam plus a flight with an examiner.' },
      { term: 'DPE', def: 'Designated Pilot Examiner: a person the FAA authorizes to give checkrides.' },
      { term: 'Light-sport aircraft', def: 'A small, simple aircraft that a sport pilot can fly.' }
    ]
  });
})();
