// Chapter 17 — Aeromedical Factors (PHAK FAA-H-8083-25C)
(() => {
  const { txt, lines, svg } = SKY.draw;

  const tuc = svg(320, 200, `
    ${txt(160, 14, 'Time of useful consciousness (approximate)', 'd-text')}
    ${[['20,000 ft', '30 min or more', 1.0], ['22,000 ft', '5–10 min', 0.75], ['25,000 ft', '3–5 min', 0.55], ['28,000 ft', '2½–3 min', 0.42], ['30,000 ft', '1–2 min', 0.3], ['35,000 ft', '30–60 sec', 0.17], ['40,000 ft', '15–20 sec', 0.08]].map(([a, t, f], i) => {
      const y = 28 + i * 24;
      return txt(70, y + 13, a, 'd-small', 'end') + `<rect x="78" y="${y}" width="${Math.max(6, f * 150)}" height="16" rx="4" class="${f < 0.35 ? 'd-weight' : f < 0.6 ? 'd-accent' : 'd-ok'}"/>` + txt(84 + Math.max(6, f * 150), y + 12, t, 'd-small', 'start');
    }).join('')}`,
    'Time of useful consciousness without oxygen shrinks from 30 minutes at 20,000 feet to about 15 seconds at 40,000 feet');

  const runways = svg(320, 150, `
    ${[[55, 22, 'NORMAL', 'looks right', ''], [160, 12, 'NARROW', 'looks HIGHER', '→ you fly too LOW'], [265, 36, 'WIDE', 'looks LOWER', '→ you fly too HIGH']].map(([cx, w, n, a, b]) =>
      `<polygon points="${cx - w / 3},20 ${cx + w / 3},20 ${cx + w * 1.4},100 ${cx - w * 1.4},100" class="d-runway"/>` +
      `<line x1="${cx}" y1="26" x2="${cx}" y2="96" style="stroke:#fff" stroke-width="1.5" stroke-dasharray="5 5"/>` +
      txt(cx, 118, n, 't-brand d-text') + txt(cx, 131, a, 'd-small') + (b ? txt(cx, 143, b, 't-weight d-small') : '')).join('')}`,
    'Runway width illusion: a narrow runway looks like you are high, a wide runway looks like you are low');

  SKY.registerChapter({
    id: 'ch17',
    badge: { name: 'Human Factors Hero', emoji: '🫀', desc: 'You know how your body and brain can trick you in flight, and how to stay safe.' },
    game: {
      engine: 'sort', title: 'Rapid Sort', blurb: 'Hypoxia types and illusions', xpEach: 30,
      rounds: [
        { id: 'hyp', title: 'Which Hypoxia?', brief: 'Name the type of hypoxia.',
          buckets: ['Hypoxic', 'Hypemic', 'Stagnant', 'Histotoxic'],
          items: [
            { t: 'Thin air at high altitude', b: 0 }, { t: 'Carbon monoxide from a leaky heater', b: 1 },
            { t: 'Pulling G’s; blood pools in the legs', b: 2 }, { t: 'Alcohol or certain drugs', b: 3 },
            { t: 'Just donated blood', b: 1 }, { t: 'Cold hands and feet, poor circulation', b: 2 }, { t: 'Unpressurized flight at 15,000 ft without oxygen', b: 0 }] },
        { id: 'land', title: 'Too Low or Too High?', brief: 'This landing illusion will make you tend to fly the approach…',
          buckets: ['Too LOW ⬇️', 'Too HIGH ⬆️'],
          items: [
            { t: 'Narrow runway', b: 0 }, { t: 'Wide runway', b: 1 }, { t: 'Upsloping runway', b: 0 }, { t: 'Downsloping runway', b: 1 },
            { t: 'Rain on the windscreen', b: 0 }, { t: 'Haze', b: 0 }, { t: 'Dark, featureless terrain at night (black hole)', b: 0 }] },
        { id: 'vest', title: 'Name That Illusion', brief: 'Your inner ear is being fooled. Which illusion is it?',
          buckets: ['The leans', 'Coriolis', 'Somatogravic', 'Graveyard spiral', 'Inversion'],
          items: [
            { t: 'Leveling out after a slow, unnoticed bank; you feel banked the other way', b: 0 },
            { t: 'Moving your head suddenly during a long, steady turn', b: 1 },
            { t: 'Fast acceleration on takeoff feels like the nose is pitching up', b: 2 },
            { t: 'In a long turn you feel level, lose altitude, and pull back, tightening the turn', b: 3 },
            { t: 'Abrupt change from climb to level flight feels like tumbling backward', b: 4 }] }
      ]
    },
    missions: [
      {
        id: 'fit', emoji: '🩺', title: 'Fit to Fly', blurb: 'Medicals, medicine, alcohol and diving', minutes: 5, xp: 50,
        phak: 'Chapter 17 → “Obtaining a Medical Certificate,” “Health and Physiological Factors,” “Alcohol,” “Drugs,” and “Altitude-Induced Decompression Sickness”',
        cards: [
          { t: 'talk', html: `<p>The most important part of the airplane is <b>you</b>! Before every flight, a pilot decides if they’re fit to fly (remember IMSAFE from Chapter 2).</p><ul><li><b>Medicines</b>: many over-the-counter drugs, like allergy pills that cause drowsiness, make flying unsafe. Check with an AME.</li><li><b>Alcohol</b>: no flying within <b>8 hours</b> of a drink, or with a blood alcohol of <b>0.04% or more</b>. Even then, alcohol can affect you for much longer.</li><li><b>Fatigue and dehydration</b> both slow your thinking.</li></ul>` },
          { t: 'talk', html: `<p><b>Scuba divers</b> have extra nitrogen dissolved in their blood. Flying too soon can cause <b>decompression sickness</b> (“the bends”). Wait at least <b>12 hours</b> after a normal dive before flying up to 8,000 feet, and <b>24 hours</b> before going higher or after a dive that needed decompression stops.</p>` },
          { t: 'check', q: 'How long after drinking alcohol must a pilot wait before flying, at minimum?',
            choices: ['4 hours', '8 hours', '24 hours'], answer: 1,
            explain: '8 hours “bottle to throttle” AND below 0.04% blood alcohol. Many pilots wait much longer, like 12 or 24 hours.' },
          { t: 'test', html: `<ul><li>No acting as crewmember within <b>8 hours</b> of alcohol or with <b>0.04%</b> or more blood alcohol.</li><li>After scuba diving: <b>12 hours</b> (up to 8,000 ft) or <b>24 hours</b> (above 8,000 ft or after controlled-ascent dives).</li></ul>` }
        ]
      },
      {
        id: 'hypoxia', emoji: '😵', title: 'Hypoxia & Hyperventilation', blurb: 'When your brain runs low on oxygen', minutes: 7, xp: 50,
        phak: 'Chapter 17 → “Hypoxia,” “Hyperventilation,” and “Carbon Monoxide (CO) Poisoning”',
        cards: [
          { t: 'talk', html: `<p><b>Hypoxia</b> means not enough oxygen reaching the brain and body. Four types:</p><ul><li><b>Hypoxic</b>: thin air at altitude. The oxygen pressure drops, so less gets into your blood.</li><li><b>Hypemic</b>: your blood can’t carry enough oxygen. Example: <b>carbon monoxide</b> poisoning or blood donation.</li><li><b>Stagnant</b>: blood isn’t flowing well, from pulling G’s or extreme cold.</li><li><b>Histotoxic</b>: your cells can’t use oxygen, from alcohol or drugs.</li></ul>` },
          { t: 'talk', html: `<p>Hypoxia is sneaky because you often feel <b>fine</b>, even <b>happy</b> (euphoria)! Other symptoms: headache, slower reactions, poor judgment, tingling, blurry vision, drowsiness and blue lips or fingernails (cyanosis).</p><p>Oxygen rules: above <b>12,500 ft</b> for more than 30 minutes, the crew must use oxygen. Above <b>14,000 ft</b>, the crew uses it the whole time. Above <b>15,000 ft</b>, everyone on board must be given oxygen.</p>` },
          { t: 'diagram', svg: tuc, caption: 'How long you can act sensibly without oxygen.' },
          { t: 'check', q: 'What causes hypoxia at high altitude?',
            choices: ['Too much carbon dioxide', 'A decrease in the partial pressure of oxygen', 'More nitrogen up high'], answer: 1,
            explain: 'The air is still about 21% oxygen up high, but at lower pressure, so less oxygen gets into your lungs and blood.' },
          { t: 'talk', html: `<p><b>Hyperventilation</b> is the opposite problem: breathing too fast, often from <b>stress, anxiety or fear</b>, blows off too much carbon dioxide. Symptoms look like hypoxia: dizziness, tingling, feeling hot or cold.</p><p>The fix: <b>slow your breathing</b>, breathe into a paper bag, or <b>talk out loud</b>.</p><p><b>Carbon monoxide</b> from a leaky exhaust is extra dangerous because it’s odorless. Large amounts cause <b>loss of muscle power</b>, and your risk goes <b>up with altitude</b>.</p>` },
          { t: 'test', html: `<ul><li>Hypoxia = <b>insufficient oxygen reaching the brain</b>.</li><li>Hyperventilation is usually caused by <b>emotional tension, anxiety or fear</b>. Fix: <b>slow the breathing rate, breathe into a bag, or talk aloud</b>.</li><li>Susceptibility to CO poisoning <b>increases as altitude increases</b>.</li></ul>` }
        ]
      },
      {
        id: 'ears', emoji: '👂', title: 'Ears & Spatial Disorientation', blurb: 'When your inner ear lies', minutes: 7, xp: 50,
        phak: 'Chapter 17 → “Middle Ear and Sinus Problems,” “Spatial Disorientation and Illusions,” and “Vestibular Illusions”',
        cards: [
          { t: 'talk', html: `<p>As you climb, air escapes from your middle ear easily. On the way <b>down</b>, air has to get back in through a tiny tube, so ear pain is usually worse during <b>descent</b>. Swallowing, yawning or gently blowing against a pinched nose (the <b>Valsalva</b> maneuver) helps. Flying with a cold can cause serious ear or sinus pain.</p>` },
          { t: 'talk', html: `<p>Your <b>inner ear</b> has fluid-filled tubes that sense motion. On the ground they’re great. In an airplane, especially in clouds or at night, they can be fooled. That’s <b>spatial disorientation</b>: your brain gets mixed-up signals about which way is up.</p><ul><li><b>The leans</b>: after a slow, unnoticed bank, you level out and feel banked the other way.</li><li><b>Coriolis illusion</b>: moving your head suddenly in a long turn. The most overwhelming one.</li><li><b>Graveyard spiral</b>: in a long turn you feel level, notice you’re losing altitude, pull back… and tighten the spiral.</li><li><b>Somatogravic illusion</b>: fast acceleration feels like pitching up, so you might push the nose down toward the ground.</li><li><b>Inversion illusion</b>: an abrupt change from climb to level flight feels like tumbling backward.</li></ul>` },
          { t: 'check', q: 'You’re flying in clouds and feel like you’re turning, but the instruments say you’re level. What should you do?',
            choices: ['Trust your feelings', 'Trust the instruments', 'Close your eyes and wait'], answer: 1,
            explain: 'When visual cues are gone, your body can’t be trusted. The instruments are right.' },
          { t: 'fact', html: `<p>Spatial disorientation is why pilots without instrument training must stay out of clouds. Studies show untrained pilots who fly into clouds often lose control within minutes.</p>` },
          { t: 'test', html: `<ul><li>Spatial disorientation is more likely when <b>visual cues are taken away</b>, as in IMC.</li><li>Overcome it by <b>relying on the aircraft instruments</b>.</li><li>Rapid acceleration on takeoff can create the illusion of <b>being in a nose-up attitude</b>.</li><li>An abrupt change from climb to level flight → illusion of <b>tumbling backwards</b>.</li></ul>` }
        ]
      },
      {
        id: 'vision', emoji: '👁️', title: 'Vision & Night Flying', blurb: 'Rods, cones and seeing in the dark', minutes: 6, xp: 50,
        phak: 'Chapter 17 → “Vision in Flight,” “Night Vision,” and “Night Vision Illusions”',
        cards: [
          { t: 'talk', html: `<p>Your eyes have two kinds of light sensors:</p><ul><li><b>Cones</b>, packed in the center of your vision, see color and detail but need good light.</li><li><b>Rods</b>, around the edges, see in dim light and spot motion, but not color.</li></ul><p>At night your cones don’t work well, so you have a <b>night blind spot</b> right in the center of your view!</p>` },
          { t: 'talk', html: `<p>Night flying tips:</p><ul><li>Your eyes take about <b>30 minutes</b> to fully adapt to the dark. Avoid bright <b>white</b> lights before flying. Dim <b>red</b> cockpit lights help keep your night vision.</li><li>Use <b>off-center viewing</b>: look a little to the side of an object so its light hits your rods. Scan <b>slowly</b>.</li></ul>` },
          { t: 'check', q: 'What is the best way to spot other traffic at night?',
            choices: ['Stare directly at where you expect it', 'Look slightly to the side and scan slowly', 'Scan the sky very quickly'], answer: 1,
            explain: 'Off-center viewing uses your rods, which see better in the dark.' },
          { t: 'talk', html: `<p>Night illusions:</p><ul><li><b>Autokinesis</b>: stare at a single still light in the dark and it seems to move.</li><li><b>False horizon</b>: sloping clouds, ground lights and stars can trick you into tilting the airplane.</li><li><b>Ground lighting</b>: a highway full of lights can look like a runway.</li></ul>` },
          { t: 'test', html: `<ul><li>Adapting eyes for night: avoid <b>bright white lights</b> for at least <b>30 minutes</b> before flight.</li><li>Most effective night scan: <b>scan slowly to permit off-center viewing</b>.</li><li>A stationary light that seems to move = <b>autokinesis</b>.</li><li>Sloping clouds and ground lights → <b>false horizon</b>.</li></ul>` }
        ]
      },
      {
        id: 'illusions', emoji: '🛬', title: 'Landing Illusions', blurb: 'When the runway tricks your eyes', minutes: 6, xp: 50,
        phak: 'Chapter 17 → “Optical Illusions” (Runway Width, Runway and Terrain Slopes, Featureless Terrain, Water Refraction, Haze, Fog, Ground Lighting)',
        cards: [
          { t: 'talk', html: `<p>Your brain judges your height on approach from how the runway <i>looks</i>. Unusual runways can fool you, and most of these illusions make you fly <b>too low</b>, which is the dangerous direction.</p>` },
          { t: 'diagram', svg: runways, caption: 'Runway width illusion.' },
          { t: 'talk', html: `<ul><li><b>Narrow runway</b>: looks like you’re higher than you are → you fly too <b>low</b>.</li><li><b>Wide runway</b>: looks low → you fly too <b>high</b>.</li><li><b>Upsloping runway or terrain</b>: looks high → too <b>low</b>.</li><li><b>Downsloping runway</b>: looks low → too <b>high</b>.</li><li><b>Featureless terrain</b> (water, snow, dark “black hole” at night): looks high → too <b>low</b>.</li><li><b>Rain on the windscreen</b>: looks high → too <b>low</b>.</li><li><b>Haze</b>: runway looks farther away → too <b>low</b>.</li><li><b>Fog</b>: can cause a pitch-up illusion, so pilots may steepen the approach.</li></ul>` },
          { t: 'check', q: 'Landing on an unusually narrow runway, you may tend to…',
            choices: ['Fly a higher approach than normal', 'Fly a lower approach than normal', 'Land long'], answer: 1,
            explain: 'A narrow runway looks like you’re high, so you descend too low. Use the PAPI or VASI to check!' },
          { t: 'fact', html: `<p>The best defense against landing illusions: use a <b>VASI or PAPI</b> when available, know the runway’s width and slope ahead of time (from the Chart Supplement), and cross-check your altimeter.</p>` },
          { t: 'test', html: `<ul><li>Narrow runway → appears <b>higher than actual</b>, leading to a <b>lower-than-normal approach</b>.</li><li>Rain on the windscreen → illusion of being <b>higher than actual</b>.</li><li>Haze → runway appears <b>farther</b> away than it is.</li><li>Upsloping runway → illusion of being <b>higher</b> than actual.</li></ul>` }
        ]
      }
    ],

    quizLength: 12,
    quiz: [
      { q: 'Hypoxia is the result of which of these conditions?', choices: ['Insufficient oxygen reaching the brain.', 'Excessive oxygen in the bloodstream.', 'Excessive carbon dioxide in the bloodstream.'], answer: 0, explain: 'Hypoxia = not enough oxygen.' },
      { q: 'What causes hypoxia?', choices: ['A decrease of oxygen partial pressure.', 'Excessive carbon dioxide in the atmosphere.', 'An increase in nitrogen content of the air at high altitudes.'], answer: 0, explain: 'Lower pressure means less oxygen enters the blood.' },
      { q: 'Rapid or extra deep breathing while using oxygen can cause a condition known as', choices: ['hyperventilation.', 'aerosinusitis.', 'aerotitis.'], answer: 0, explain: 'Breathing too much blows off carbon dioxide.' },
      { q: 'Which would most likely result in hyperventilation?', choices: ['Emotional tension, anxiety, or fear.', 'The excessive consumption of alcohol.', 'An extremely slow rate of breathing and insufficient oxygen.'], answer: 0, explain: 'Stress makes people breathe too fast.' },
      { q: 'A pilot experiencing the effects of hyperventilation should be able to restore the proper carbon dioxide level in the body by', choices: ['slowing the breathing rate, breathing into a paper bag, or talking aloud.', 'breathing spontaneously and deeply or gaining mental control of the situation.', 'increasing the breathing rate in order to increase lung ventilation.'], answer: 0, explain: 'Slow down and rebuild the CO₂ level.' },
      { q: 'Large accumulations of carbon monoxide in the human body result in', choices: ['loss of muscular power.', 'tightness across the forehead.', 'an increased sense of well-being.'], answer: 0, explain: 'CO poisoning can leave you too weak to act.' },
      { q: 'Susceptibility to carbon monoxide poisoning increases as', choices: ['altitude increases.', 'altitude decreases.', 'air pressure increases.'], answer: 0, explain: 'Less oxygen up high makes CO even more dangerous.' },
      { q: 'What preparation should a pilot make to adapt the eyes for night flying?', choices: ['Avoid bright white lights at least 30 minutes before the flight.', 'Wear sunglasses after sunset until ready for flight.', 'Avoid red lights at least 30 minutes before the flight.'], answer: 0, explain: 'Bright white light ruins dark adaptation.' },
      { q: 'What is the most effective way to use the eyes during night flight?', choices: ['Scan slowly to permit off-center viewing.', 'Look only at far away, dim lights.', 'Concentrate directly on each object for a few seconds.'], answer: 0, explain: 'Off-center viewing uses your rods.' },
      { q: 'The best method to use when looking for other traffic at night is to', choices: ['look to the side of the object and scan slowly.', 'scan the visual field very rapidly.', 'look to the side of the object and scan rapidly.'], answer: 0, explain: 'Slow scan, off-center.' },
      { q: 'Pilots are more subject to spatial disorientation if', choices: ['visual cues are taken away, as they are in instrument meteorological conditions (IMC).', 'they ignore the sensations of muscles and inner ear.', 'eyes are moved often in the process of cross-checking the flight instruments.'], answer: 0, explain: 'Without outside references, the inner ear takes over and can be fooled.' },
      { q: 'If a pilot experiences spatial disorientation during flight in a restricted visibility condition, the best way to overcome the effect is to', choices: ['rely upon the aircraft instrument indications.', 'concentrate on yaw, pitch, and roll sensations.', 'consciously slow the breathing rate until symptoms clear.'], answer: 0, explain: 'Trust the instruments.' },
      { q: 'A state of temporary confusion resulting from misleading information being sent to the brain by various sensory organs is defined as', choices: ['spatial disorientation.', 'hyperventilation.', 'hypoxia.'], answer: 0, explain: 'That’s the definition of spatial disorientation.' },
      { q: 'An abrupt change from climb to straight-and-level flight can create the illusion of', choices: ['tumbling backwards.', 'a nose up attitude.', 'a descent with the wings level.'], answer: 0, explain: 'The inversion illusion.' },
      { q: 'A rapid acceleration during takeoff can create the illusion of', choices: ['being in a nose up attitude.', 'spinning in the opposite direction.', 'diving into the ground.'], answer: 0, explain: 'The somatogravic illusion. Pilots may then push the nose down.' },
      { q: 'Abrupt head movement during a prolonged constant rate turn in IMC or simulated instrument conditions can cause', choices: ['pilot disorientation.', 'false horizon.', 'elevator illusion.'], answer: 0, explain: 'The Coriolis illusion is especially overwhelming.' },
      { q: 'A sloping cloud formation, an obscured horizon, and a dark scene spread with ground lights and stars can create an illusion known as', choices: ['false horizons.', 'elevator illusions.', 'autokinesis.'], answer: 0, explain: 'You might bank the airplane to match a false horizon.' },
      { q: 'In the dark, a stationary light will appear to move about when stared at for many seconds. This illusion is known as', choices: ['autokinesis.', 'somatogravic illusion.', 'ground lighting illusion.'], answer: 0, explain: 'Keep your eyes moving.' },
      { q: 'What illusion, if any, can rain on the windscreen create?', choices: ['Higher than actual.', 'Lower than actual.', 'Does not cause illusions.'], answer: 0, explain: 'You may then fly too low.' },
      { q: 'Haze can give the illusion that the aircraft is', choices: ['farther from the runway than it actually is.', 'closer to the runway than it actually is.', 'the same distance from the runway as when there is no restriction to visibility.'], answer: 0, explain: 'Pilots then tend to fly too low.' },
      { q: 'Due to visual illusion, when landing on a narrower-than-usual runway, the aircraft will appear to be', choices: ['higher than actual, leading to a lower-than-normal approach.', 'lower than actual, leading to a higher-than-normal approach.', 'higher than actual, leading to a higher-than-normal approach.'], answer: 0, explain: 'Narrow looks high, so you go low.' },
      { q: 'No person may act as a crewmember of a civil aircraft if alcoholic beverages have been consumed by that person within the preceding', choices: ['8 hours.', '12 hours.', '24 hours.'], answer: 0, explain: 'And blood alcohol must be under 0.04%.' },
      { q: 'A pilot made a recreational scuba dive that did not require a controlled ascent. Before flying up to 8,000 feet MSL, the pilot should wait at least', choices: ['12 hours.', '4 hours.', '48 hours.'], answer: 0, explain: '12 hours up to 8,000 ft; 24 hours above or after controlled-ascent dives.' },
      { q: 'Above what cabin pressure altitude must each occupant of the aircraft be provided with supplemental oxygen?', choices: ['15,000 feet MSL.', '12,500 feet MSL.', '14,000 feet MSL.'], answer: 0, explain: 'Crew rules start at 12,500 (after 30 min) and 14,000 (always). Passengers must be provided oxygen above 15,000.' },
      { q: 'Ear pain from trapped air is usually worse during', choices: ['descent.', 'climb.', 'cruise.'], answer: 0, explain: 'Air escapes the middle ear easily on climb, but must work its way back in during descent.' }
    ],

    glossary: [
      { term: 'Hypoxia', def: 'Not enough oxygen reaching the body and brain.' },
      { term: 'Hypoxic hypoxia', def: 'Caused by low oxygen pressure at altitude.' },
      { term: 'Hypemic hypoxia', def: 'Blood can’t carry enough oxygen, as with carbon monoxide or blood loss.' },
      { term: 'Stagnant hypoxia', def: 'Poor blood flow, as from G-forces or cold.' },
      { term: 'Histotoxic hypoxia', def: 'Cells can’t use oxygen, as with alcohol or drugs.' },
      { term: 'Time of useful consciousness', def: 'How long you can act effectively without oxygen at a given altitude.' },
      { term: 'Hyperventilation', def: 'Breathing too fast, blowing off too much carbon dioxide.' },
      { term: 'Carbon monoxide', def: 'An odorless, colorless gas from exhaust that causes hypemic hypoxia.' },
      { term: 'Valsalva maneuver', def: 'Gently blowing against a pinched nose to equalize ear pressure.' },
      { term: 'Spatial disorientation', def: 'Confusion about your position and motion because of misleading senses.' },
      { term: 'The leans', def: 'Feeling banked the opposite way after correcting a slow, unnoticed bank.' },
      { term: 'Coriolis illusion', def: 'Overwhelming tumbling sensation from moving your head in a prolonged turn.' },
      { term: 'Graveyard spiral', def: 'A tightening, descending turn caused by feeling level while actually turning.' },
      { term: 'Somatogravic illusion', def: 'Acceleration feels like pitching up; deceleration feels like pitching down.' },
      { term: 'Autokinesis', def: 'A still light in the dark that appears to move.' },
      { term: 'False horizon', def: 'Mistaking sloping clouds or ground lights for the real horizon.' },
      { term: 'Rods and cones', def: 'Rods see in dim light (night, peripheral); cones see color and detail.' },
      { term: 'Off-center viewing', def: 'Looking slightly to the side of an object at night so the rods can see it.' },
      { term: 'Dark adaptation', def: 'Takes about 30 minutes. Bright white light ruins it.' },
      { term: 'Black hole approach', def: 'Night approach over dark terrain that makes you feel high, so you fly too low.' }
    ]
  });
})();
