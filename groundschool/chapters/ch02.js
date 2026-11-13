// Chapter 2 — Aeronautical Decision-Making (PHAK FAA-H-8083-25C)
(() => {
  const { txt, lines, box, svg } = SKY.draw;

  const pave = svg(320, 190, `
    ${[['P', 'PILOT', ['Am I fit to fly?', 'Experience, health,', 'IMSAFE check']], ['A', 'AIRCRAFT', ['Right plane for the trip?', 'Fuel, equipment,', 'performance']],
       ['V', 'ENVIRONMENT', ['Weather, terrain,', 'airports, airspace,', 'night?']], ['E', 'EXTERNAL PRESSURES', ['Schedules, people', 'waiting, wanting', 'to impress']]]
      .map(([l, h, d], i) => { const x = 6 + (i % 2) * 158, y = 6 + Math.floor(i / 2) * 92;
        return box(x, y, 150, 86) + `<circle cx="${x + 22}" cy="${y + 22}" r="15" class="d-brand"/>` + txt(x + 22, y + 27, l, 't-white d-text') +
          txt(x + 44, y + 26, h, 't-brand d-text', 'start') + lines(x + 12, y + 50, d, 'd-small', 'start', 11); }).join('')}`,
    'PAVE checklist: Pilot, Aircraft, enVironment, External pressures');

  const matrix = (() => {
    const like = ['Likely', 'Possible', 'Unlikely'], sev = ['Minor', 'Serious', 'Catastrophic'];
    const col = (i, j) => { const s = (2 - i) + j; return s >= 4 ? 'd-weight' : s === 3 ? 'd-accent' : s === 2 ? 'd-warn' : 'd-ok'; };
    const word = (i, j) => { const s = (2 - i) + j; return s >= 4 ? 'HIGH' : s === 3 ? 'SERIOUS' : s === 2 ? 'MEDIUM' : 'LOW'; };
    let body = txt(196, 14, 'SEVERITY →', 'd-small');
    sev.forEach((s, j) => { body += txt(118 + j * 70, 30, s, 'd-small'); });
    like.forEach((l, i) => {
      body += txt(70, 60 + i * 44, l, 'd-text', 'end');
      sev.forEach((_, j) => { body += `<rect x="${84 + j * 70}" y="${38 + i * 44}" width="66" height="40" rx="6" class="${col(i, j)}" opacity=".85"/>` + txt(117 + j * 70, 62 + i * 44, word(i, j), 't-white d-small'); });
    });
    body += txt(14, 110, 'LIKELIHOOD', 'd-small', 'start');
    return svg(320, 176, body, 'Risk matrix: likelihood versus severity. Likely and catastrophic is high risk; unlikely and minor is low risk.');
  })();

  const attitudes = svg(320, 230, `
    ${txt(6, 16, 'ATTITUDE', 't-weight d-small', 'start')}${txt(170, 16, 'ANTIDOTE (say it to yourself!)', 't-ok d-small', 'start')}
    ${[['Anti-authority', '“Don’t tell me!”', 'Follow the rules.', 'They are usually right.'],
       ['Impulsivity', '“Do it quickly!”', 'Not so fast.', 'Think first.'],
       ['Invulnerability', '“It won’t happen to me.”', 'It could happen', 'to me.'],
       ['Macho', '“I can do it.”', 'Taking chances', 'is foolish.'],
       ['Resignation', '“What’s the use?”', 'I’m not helpless.', 'I can make a difference.']]
      .map(([a, q, x1, x2], i) => { const y = 24 + i * 41;
        return box(4, y, 158, 37) + txt(12, y + 15, a, 't-weight d-text', 'start') + txt(12, y + 29, q, 'd-small', 'start') +
          box(168, y, 148, 37) + txt(176, y + 15, x1, 't-ok d-text', 'start') + txt(176, y + 29, x2, 'd-small', 'start'); }).join('')}`,
    'The five hazardous attitudes and their antidotes');

  SKY.registerChapter({
    id: 'ch02',
    badge: { name: 'Sharp Thinker', emoji: '🧠', desc: 'You can spot risk, catch hazardous attitudes, and make decisions like a real pilot in command.' },
    game: {
      engine: 'sort', title: 'Rapid Sort', blurb: 'Catch the hazardous attitudes', xpEach: 30,
      rounds: [
        { id: 'quote', title: 'Name That Attitude', brief: 'A pilot thinks this… which hazardous attitude is it?',
          buckets: ['Anti-authority', 'Impulsivity', 'Invulnerability', 'Macho', 'Resignation'],
          items: [
            { t: '“Those rules are for other pilots.”', b: 0 }, { t: '“Let’s just go — no time for the checklist!”', b: 1 },
            { t: '“Accidents happen to other people.”', b: 2 }, { t: '“Watch me squeeze through that weather.”', b: 3 },
            { t: '“Nothing I do will change anything now.”', b: 4 }, { t: '“The tower can’t tell me how to fly.”', b: 0 },
            { t: '“I’ll decide right now and figure it out later.”', b: 1 }, { t: '“I’ve flown in worse. I’m a great pilot.”', b: 3 },
            { t: '“It’s up to luck anyway.”', b: 4 }, { t: '“Ice? It never sticks to MY airplane.”', b: 2 }] },
        { id: 'anti', title: 'Match the Antidote', brief: 'Which hazardous attitude does each antidote fix?',
          buckets: ['Anti-authority', 'Impulsivity', 'Invulnerability', 'Macho', 'Resignation'],
          items: [
            { t: '“Follow the rules. They are usually right.”', b: 0 }, { t: '“Not so fast. Think first.”', b: 1 },
            { t: '“It could happen to me.”', b: 2 }, { t: '“Taking chances is foolish.”', b: 3 },
            { t: '“I’m not helpless. I can make a difference.”', b: 4 }] },
        { id: 'pave', title: 'PAVE It', brief: 'Sort each risk into the right PAVE box.',
          buckets: ['Pilot', 'Aircraft', 'enVironment', 'External pressures'],
          items: [
            { t: 'You slept only 4 hours last night', b: 0 }, { t: 'Thunderstorms forecast this afternoon', b: 2 },
            { t: 'The rental plane’s radio is acting up', b: 1 }, { t: 'You promised to be at a wedding by 5 p.m.', b: 3 },
            { t: 'You haven’t flown in 3 months', b: 0 }, { t: 'Mountains along the route', b: 2 },
            { t: 'Only enough fuel range with a tiny reserve', b: 1 }, { t: 'Friends are watching and you want to impress them', b: 3 },
            { t: 'You took cold medicine this morning', b: 0, why: 'Medication is part of the IMSAFE check of the pilot.' }, { t: 'It will be dark when you arrive', b: 2 }] }
      ]
    },
    missions: [
      {
        id: 'adm', emoji: '🧠', title: 'What Is ADM?', blurb: 'Why good pilots are good decision-makers', minutes: 5, xp: 50,
        phak: 'Chapter 2 → “History of ADM” and “Single-Pilot Resource Management”',
        cards: [
          { t: 'talk', html: `<p>Here’s a surprise: most airplane accidents aren’t caused by broken parts. <b>Human error</b> plays a part in most of them, often around <b>80%</b> of accidents.</p><p>So the FAA teaches a skill called <b>Aeronautical Decision-Making (ADM)</b>: a step-by-step way of thinking that helps pilots pick the best action every time.</p>` },
          { t: 'talk', html: `<p>ADM includes:</p><ul><li>Spotting <b>risks</b> before they become problems.</li><li>Knowing your own <b>attitudes</b> and when they’re steering you wrong.</li><li>Using all your <b>resources</b>: checklists, ATC, weather briefers, passengers, automation. This is called <b>Single-Pilot Resource Management (SRM)</b>.</li><li>Keeping <b>situational awareness</b>: always knowing what’s going on around you and what’s coming next.</li></ul>` },
          { t: 'fact', html: `<p>On January 15, 2009, US Airways Flight 1549 hit a flock of geese and lost both engines. In seconds, Captain <b>Sully Sullenberger</b> and First Officer <b>Jeff Skiles</b> decided they couldn’t make it to an airport and landed on the <b>Hudson River</b>. All 155 people survived. That’s ADM under pressure!</p>` },
          { t: 'check', q: 'What is the one common factor in most preventable accidents?',
            choices: ['Structural failure', 'Human error', 'Mechanical malfunction'], answer: 1,
            explain: 'Most accidents involve human factors, which is exactly why ADM is taught.' },
          { t: 'talk', html: `<p>One of the best ADM tools is setting <b>personal minimums</b>: your own rules that are stricter than the legal ones. For example: “As a new pilot, I won’t fly if the wind is over 15 knots or the clouds are lower than 3,000 feet.” Decide <i>before</i> the flight, when you’re calm.</p>` },
          { t: 'test', html: `<p>The FAA likes: <b>“Risk management, as part of the ADM process, relies on which features to reduce the risks?”</b> → <i>Situational awareness, problem recognition, and good judgment.</i></p>` }
        ]
      },
      {
        id: 'risk', emoji: '🚦', title: 'Spotting Risk: PAVE & IMSAFE', blurb: 'Checklists for your brain', minutes: 6, xp: 50,
        phak: 'Chapter 2 → “Risk Management,” “Assessing Risk,” “The PAVE Checklist,” and “IMSAFE”',
        cards: [
          { t: 'talk', html: `<p>Every flight has <b>hazards</b> (things that could hurt you) and <b>risk</b> (how likely and how bad). Pilots use simple checklists so they don’t miss anything.</p>` },
          { t: 'diagram', svg: pave, caption: 'PAVE: four places risk hides.' },
          { t: 'talk', html: `<p>The “P” in PAVE has its own checklist, <b>IMSAFE</b>. Ask yourself:</p><ul><li><b>I</b>llness: am I sick?</li><li><b>M</b>edication: am I taking anything that could affect me?</li><li><b>S</b>tress: is something bothering me?</li><li><b>A</b>lcohol: none in the last 8 hours (and much longer is smarter)?</li><li><b>F</b>atigue: did I sleep enough?</li><li><b>E</b>motion (or <b>E</b>ating): am I upset? Have I eaten and had water?</li></ul>` },
          { t: 'check', q: 'You have a cold and took a decongestant that says “may cause drowsiness.” Which IMSAFE letters are a problem?',
            choices: ['I and M', 'S and E', 'A and F'], answer: 0,
            explain: 'Illness AND Medication. Many over-the-counter medicines make pilots unsafe to fly. Ask an AME if you’re not sure.' },
          { t: 'diagram', svg: matrix, caption: 'A simple risk matrix. The PHAK uses a similar 4×4 version.',
            html: `<p>A <b>risk matrix</b> combines how <b>likely</b> something is with how <b>bad</b> it would be. Something unlikely but catastrophic still deserves serious attention. Your job is to <b>lower the risk</b>: wait for better weather, take more fuel, or bring an instructor.</p>` },
          { t: 'test', html: `<ul><li><b>PAVE</b> = Pilot, Aircraft, enVironment, External pressures.</li><li><b>IMSAFE</b> = Illness, Medication, Stress, Alcohol, Fatigue, Emotion/Eating.</li><li>External pressures (like “get-there-itis”) are among the most dangerous because they push you to ignore everything else.</li></ul>` }
        ]
      },
      {
        id: 'attitudes', emoji: '😤', title: 'The 5 Hazardous Attitudes', blurb: 'And the antidote for each', minutes: 6, xp: 50,
        phak: 'Chapter 2 → “Hazardous Attitudes and Antidotes”',
        cards: [
          { t: 'talk', html: `<p>Everyone has thoughts that can lead to bad decisions. The FAA names <b>five hazardous attitudes</b>. The trick isn’t to never have them. It’s to <b>catch</b> them and answer with an <b>antidote</b>.</p>` },
          { t: 'diagram', svg: attitudes, caption: 'Memorize these pairs. They’re on the FAA test, guaranteed.' },
          { t: 'check', q: 'A pilot thinks, “The weather is getting bad, but I’ve handled worse. I can do it.” Which attitude is this?',
            choices: ['Invulnerability', 'Macho', 'Resignation'], answer: 1,
            explain: 'Macho is about proving yourself and taking chances. Antidote: “Taking chances is foolish.”' },
          { t: 'check', q: 'What is the antidote for “Anti-authority”?',
            choices: ['“Not so fast. Think first.”', '“It could happen to me.”', '“Follow the rules. They are usually right.”'], answer: 2,
            explain: 'Anti-authority says “Don’t tell me!” The fix is remembering rules exist for good reasons.' },
          { t: 'talk', html: `<p>The FAA’s 3-step method when you notice a hazardous thought:</p><ul><li>1️⃣ <b>Recognize</b> it.</li><li>2️⃣ <b>Label</b> it as hazardous (“That’s my macho talking”).</li><li>3️⃣ <b>Correct</b> it by saying the antidote.</li></ul>` },
          { t: 'tryit', html: `<p>Next time you play a video game or sport, notice when you think “I’ve got this, no need to be careful” (macho) or “Whatever, I’ll lose anyway” (resignation). Spotting attitudes in everyday life makes it easier in the cockpit.</p>` },
          { t: 'test', html: `<p>Expect questions like: <b>“What should a pilot do when recognizing a thought as hazardous?”</b> → <i>Label that thought as hazardous, then correct it by stating the corresponding learned antidote.</i></p>` }
        ]
      },
      {
        id: 'models', emoji: '🔁', title: 'Decision Tools: 3P & DECIDE', blurb: 'Step-by-step thinking', minutes: 5, xp: 50,
        phak: 'Chapter 2 → “The Decision-Making Process,” “Perceive, Process, Perform (3P) Model,” and “The DECIDE Model”',
        cards: [
          { t: 'talk', html: `<p>The <b>3P model</b> is a loop you run over and over during a flight:</p><ul><li><b>Perceive</b> the hazards (using PAVE).</li><li><b>Process</b>: figure out how much risk each one causes.</li><li><b>Perform</b>: do something to lower the risk. Then start again!</li></ul>` },
          { t: 'talk', html: `<p>The <b>DECIDE model</b> is great when something changes or goes wrong:</p><ul><li><b>D</b>etect that something has changed.</li><li><b>E</b>stimate the need to react.</li><li><b>C</b>hoose a good outcome.</li><li><b>I</b>dentify actions to get there.</li><li><b>D</b>o the best action.</li><li><b>E</b>valuate how it worked.</li></ul>` },
          { t: 'check', q: 'What is the LAST step of the DECIDE model?',
            choices: ['Do', 'Evaluate', 'Estimate'], answer: 1,
            explain: 'Evaluate: check whether your action worked, then keep watching. Good decisions are a loop, not one-and-done.' },
          { t: 'talk', html: `<p>Another tool: the <b>5 Ps</b>. Check them before takeoff, before descent, and any time things change:</p><ul><li><b>Plan</b>: route, weather, fuel.</li><li><b>Plane</b>: is it working right?</li><li><b>Pilot</b>: how am I doing?</li><li><b>Passengers</b>: are they OK? Are they adding pressure?</li><li><b>Programming</b>: are the GPS and autopilot set up right?</li></ul>` },
          { t: 'fact', html: `<p>Airlines use the same ideas in <b>Crew Resource Management (CRM)</b>. Even a junior first officer is trained to speak up if something looks wrong. Lots of accidents were prevented because someone said “Captain, I’m not comfortable with this.”</p>` },
          { t: 'test', html: `<ul><li>3P = <b>Perceive, Process, Perform</b>.</li><li>DECIDE = <b>Detect, Estimate, Choose, Identify, Do, Evaluate</b>.</li></ul>` }
        ]
      },
      {
        id: 'pitfalls', emoji: '🪤', title: 'Traps Pilots Fall Into', blurb: 'Get-there-itis and friends', minutes: 6, xp: 50,
        phak: 'Chapter 2 → “Operational Pitfalls,” “Stress Management,” and “Situational Awareness”',
        cards: [
          { t: 'talk', html: `<p>Even experienced pilots fall into these <b>operational pitfalls</b>:</p><ul><li><b>Get-there-itis</b>: wanting to reach the destination so badly that you ignore warning signs.</li><li><b>Peer pressure</b>: letting others push your decisions.</li><li><b>Mind set</b>: not changing your plan even when things change.</li><li><b>Scud running</b>: flying lower and lower to stay under the clouds.</li><li><b>Continuing VFR into instrument conditions</b>: flying into clouds without instrument training. This often ends in spatial disorientation or hitting the ground.</li></ul>` },
          { t: 'talk', html: `<p>More traps:</p><ul><li><b>Duck-under syndrome</b>: sneaking below minimum altitudes to “just take a peek.”</li><li><b>Getting behind the aircraft</b>: the plane is doing things before you’ve thought about them.</li><li><b>Operating without enough fuel reserves</b>.</li><li><b>Neglecting flight planning, preflight inspections and checklists</b>.</li></ul>` },
          { t: 'check', q: 'What most often leads to spatial disorientation or hitting terrain when flying under VFR?',
            choices: ['Continued flight into instrument conditions', 'Getting behind the aircraft', 'Duck-under syndrome'], answer: 0,
            explain: 'Flying into clouds without instrument skills is one of the deadliest mistakes in general aviation.' },
          { t: 'talk', html: `<p><b>Stress</b> can be <b>acute</b> (sudden, like an engine sputter) or <b>chronic</b> (long-lasting, like problems at home). A little stress keeps you sharp; too much makes you miss things.</p><p><b>Situational awareness</b> means knowing where you are, what the airplane is doing, and what’s coming next. Fatigue, stress and too much heads-down screen time all chip away at it.</p>` },
          { t: 'fact', html: `<p>Pilots have a saying: <b>“It’s better to be on the ground wishing you were in the air than in the air wishing you were on the ground.”</b> Choosing NOT to fly is sometimes the best pilot decision of all.</p>` },
          { t: 'test', html: `<p>The FAA asks: <b>“The basic drive for a pilot to demonstrate the ‘right stuff’ can have an adverse effect on safety by…”</b> → <i>generating tendencies that lead to practices that are dangerous, often illegal, and may lead to a mishap.</i></p>` }
        ]
      }
    ],

    quizLength: 12,
    quiz: [
      { q: 'Risk management, as part of the ADM process, relies on which features to reduce the risks associated with each flight?', choices: ['Situational awareness, problem recognition, and good judgment.', 'Application of stress management and risk element procedures.', 'The mental process of analyzing all information in a particular situation and making a timely decision on what action to take.'], answer: 0, explain: 'Situational awareness, problem recognition and good judgment are the core of risk management.' },
      { q: 'What is the one common factor which affects most preventable accidents?', choices: ['Human error.', 'Structural failure.', 'Mechanical malfunction.'], answer: 0, explain: 'Human factors play a role in most accidents.' },
      { q: 'What is the antidote when a pilot has the hazardous attitude of “Anti-authority”?', choices: ['Follow the rules.', 'Rules do not apply in this situation.', 'I know what I am doing.'], answer: 0, explain: '“Follow the rules. They are usually right.”' },
      { q: 'What is the antidote when a pilot has the hazardous attitude of “Impulsivity”?', choices: ['Not so fast, think first.', 'It could happen to me.', 'Do it quickly to get it over with.'], answer: 0, explain: 'Slow down and think before acting.' },
      { q: 'What is the antidote when a pilot has the hazardous attitude of “Invulnerability”?', choices: ['It could happen to me.', 'It will not happen to me.', 'I can do it.'], answer: 0, explain: 'Accidents can happen to anyone, including you.' },
      { q: 'What is the antidote when a pilot has the hazardous attitude of “Macho”?', choices: ['Taking chances is foolish.', 'I can do it.', 'Nothing will happen.'], answer: 0, explain: 'Proving yourself isn’t worth the risk.' },
      { q: 'What is the antidote when a pilot has the hazardous attitude of “Resignation”?', choices: ['I’m not helpless.', 'What’s the use?', 'Someone else is responsible.'], answer: 0, explain: '“I’m not helpless. I can make a difference.”' },
      { q: 'What should a pilot do when recognizing a thought as hazardous?', choices: ['Label that thought as hazardous, then correct that thought by stating the corresponding learned antidote.', 'Avoid developing this hazardous thought.', 'Develop this hazardous thought and follow through with modified action.'], answer: 0, explain: 'Recognize, label, correct with the antidote.' },
      { q: 'Which of the following is the final step of the DECIDE model for effective risk management and Aeronautical Decision-Making?', choices: ['Evaluate.', 'Estimate.', 'Eliminate.'], answer: 0, explain: 'Detect, Estimate, Choose, Identify, Do, Evaluate.' },
      { q: 'What often leads to spatial disorientation or collision with ground/obstacles when flying under Visual Flight Rules (VFR)?', choices: ['Continual flight into instrument conditions.', 'Getting behind the aircraft.', 'Duck-under syndrome.'], answer: 0, explain: 'VFR flight into clouds is one of the leading causes of fatal accidents.' },
      { q: 'The basic drive for a pilot to demonstrate the “right stuff” can have an adverse effect on safety, by', choices: ['generating tendencies that lead to practices that are dangerous, often illegal, and may lead to a mishap.', 'a total disregard for any alternative course of action.', 'imposing a realistic assessment of piloting skills under stressful conditions.'], answer: 0, explain: 'This describes the operational pitfalls, like peer pressure and get-there-itis.' },
      { q: 'In the PAVE checklist, what does the “E” stand for?', choices: ['External pressures.', 'Engine.', 'Experience.'], answer: 0, explain: 'Pilot, Aircraft, enVironment, External pressures. (The V is the environment.)' },
      { q: 'In the IMSAFE checklist, what does the “M” stand for?', choices: ['Medication.', 'Mood.', 'Maintenance.'], answer: 0, explain: 'Illness, Medication, Stress, Alcohol, Fatigue, Emotion/Eating.' },
      { q: 'What are the three steps of the 3P model?', choices: ['Perceive, Process, Perform.', 'Plan, Prepare, Proceed.', 'Pilot, Plane, Passengers.'], answer: 0, explain: 'Perceive hazards, process the risk, perform actions to reduce it.' },
      { q: 'Which pitfall describes pushing on toward a destination despite worsening weather or a problem with the airplane?', choices: ['Get-there-itis.', 'Duck-under syndrome.', 'Loss of positional awareness.'], answer: 0, explain: 'Get-there-itis clouds judgment with the desire to arrive.' },
      { q: 'Scud running is', choices: ['pushing the pilot’s and aircraft’s limits by flying low to stay below clouds while trying to keep visual contact with the ground.', 'flying above a cloud layer and descending through a gap.', 'following another aircraft to an unfamiliar airport.'], answer: 0, explain: 'Scud running squeezes you between the clouds and the ground. Very dangerous.' },
      { q: 'Personal minimums are best described as', choices: ['a pilot’s own limits, set before flight, that are more conservative than legal minimums.', 'the minimum legal weather allowed for VFR.', 'the minimum fuel required by regulation.'], answer: 0, explain: 'Set them on the ground, when you are calm, and stick to them.' },
      { q: 'Using all available resources — ATC, checklists, automation, weather services and passengers — is the core idea of', choices: ['Single-Pilot Resource Management (SRM).', 'the DECIDE model.', 'personal minimums.'], answer: 0, explain: 'SRM is about managing everything available to a pilot flying alone.' },
      { q: 'A sudden, short-term stress such as an unexpected engine sputter is called', choices: ['acute stress.', 'chronic stress.', 'fatigue.'], answer: 0, explain: 'Acute stress is immediate; chronic stress builds up over a long time.' },
      { q: 'Under the regulations, no person may act as a crewmember within how many hours after drinking alcohol?', choices: ['8 hours.', '4 hours.', '12 hours.'], answer: 0, explain: '“8 hours bottle to throttle,” and blood alcohol must be under 0.04%. Waiting much longer is wiser.' }
    ],

    glossary: [
      { term: 'ADM', def: 'Aeronautical Decision-Making: a systematic way of thinking to choose the best action in every situation.' },
      { term: 'SRM', def: 'Single-Pilot Resource Management: using all available resources when flying alone.' },
      { term: 'CRM', def: 'Crew Resource Management: teamwork and communication skills used by airline crews.' },
      { term: 'Hazard', def: 'Something that could lead to harm, like bad weather or low fuel.' },
      { term: 'Risk', def: 'How likely a hazard is to cause harm, and how bad the harm could be.' },
      { term: 'PAVE', def: 'Risk checklist: Pilot, Aircraft, enVironment, External pressures.' },
      { term: 'IMSAFE', def: 'Self-check: Illness, Medication, Stress, Alcohol, Fatigue, Emotion/Eating.' },
      { term: '3P model', def: 'Perceive, Process, Perform: a repeating loop for managing risk.' },
      { term: 'DECIDE model', def: 'Detect, Estimate, Choose, Identify, Do, Evaluate.' },
      { term: '5 Ps', def: 'Plan, Plane, Pilot, Passengers, Programming: checkpoints throughout a flight.' },
      { term: 'Anti-authority', def: '“Don’t tell me!” Antidote: Follow the rules. They are usually right.' },
      { term: 'Impulsivity', def: '“Do it quickly!” Antidote: Not so fast. Think first.' },
      { term: 'Invulnerability', def: '“It won’t happen to me.” Antidote: It could happen to me.' },
      { term: 'Macho', def: '“I can do it.” Antidote: Taking chances is foolish.' },
      { term: 'Resignation', def: '“What’s the use?” Antidote: I’m not helpless. I can make a difference.' },
      { term: 'Get-there-itis', def: 'A strong urge to reach the destination that overrides good judgment.' },
      { term: 'Scud running', def: 'Flying low to stay under clouds while trying to keep sight of the ground.' },
      { term: 'Personal minimums', def: 'Your own safety limits, stricter than the legal ones.' },
      { term: 'Situational awareness', def: 'Knowing what is happening around you and what will happen next.' }
    ]
  });
})();
