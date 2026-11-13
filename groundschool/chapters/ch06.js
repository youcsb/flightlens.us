// Chapter 6 — Flight Controls (PHAK FAA-H-8083-25C)
(() => {
  const { r, arrow, arcArrow, txt, lines, svg, planeTop, AIRFOIL } = SKY.draw;

  const mirror = (pts) => pts.map(([x, y]) => [320 - x, y]);
  const poly = (pts, cls) => `<polygon points="${pts.map(([x, y]) => `${r(x)},${r(y)}`).join(' ')}" class="${cls}"/>`;
  const AIL = [[205, 102.2], [234, 104.8], [234, 111.8], [205, 109.2]];
  const FLAP = [[172, 99.3], [200, 101.8], [200, 108.8], [172, 106.3]];
  const ELEV = [[164, 160], [196, 163], [196, 169], [164, 166]];
  const surfaces = (labels) => svg(320, 200, `
    ${planeTop(60, 0, 200)}
    ${poly(AIL, 'd-accent')}${poly(mirror(AIL), 'd-accent')}
    ${poly(FLAP, 'd-thrust')}${poly(mirror(FLAP), 'd-thrust')}
    ${poly(ELEV, 'd-lift')}${poly(mirror(ELEV), 'd-lift')}
    <line x1="160" y1="150" x2="160" y2="174" class="d-weight" stroke-width="4" stroke-linecap="round"/>
    <rect x="184" y="163.5" width="9" height="4" class="d-fill-ink"/>
    ${labels ? `
      <line x1="226" y1="113" x2="262" y2="132" class="d-muted" stroke-width="1"/>${txt(268, 142, 'AILERON', 't-accent d-text')}${txt(268, 153, '(roll)', 'd-small')}
      <line x1="140" y1="108" x2="96" y2="134" class="d-muted" stroke-width="1"/>${txt(70, 142, 'FLAP', 't-thrust d-text')}${txt(70, 153, '(lift & drag)', 'd-small')}
      <line x1="196" y1="168" x2="236" y2="178" class="d-muted" stroke-width="1"/>${txt(264, 182, 'ELEVATOR (pitch)', 't-lift d-text')}
      <line x1="160" y1="176" x2="130" y2="188" class="d-muted" stroke-width="1"/>${txt(96, 194, 'RUDDER (yaw)', 't-weight d-text')}
      <line x1="190" y1="166" x2="206" y2="194" class="d-muted" stroke-width="1"/>${txt(214, 198, 'trim tab', 'd-small', 'start')}` : ''}`,
    'Top view of an airplane showing ailerons, flaps, elevator, rudder and trim tab');

  const adverse = svg(320, 210, `
    ${planeTop(60, 0, 200)}
    ${poly(AIL, 'd-accent')}${poly(mirror(AIL), 'd-accent')}
    ${arrow(88, 112, 88, 168, 'd-drag', 4)}${arrow(232, 112, 232, 132, 'd-drag', 3)}
    ${arcArrow(160, 70, 46, -1.25, -1.95, 'd-weight')}
    ${txt(88, 184, 'Left aileron DOWN:', 'd-small')}${txt(88, 195, 'more lift, MORE drag', 't-drag d-small')}
    ${txt(240, 150, 'Right aileron UP:', 'd-small')}${txt(240, 161, 'less lift, less drag', 'd-small')}
    ${txt(160, 12, 'Rolling RIGHT… but the nose yaws LEFT!', 't-weight d-text')}`,
    'Adverse yaw: rolling right, the down-going left aileron makes more drag and pulls the nose left');

  const trim = svg(320, 130, `
    <path d="M30,62 C30,54 60,52 110,54 L178,58 L178,64 L110,68 C60,70 30,68 30,62 Z" class="d-plane"/>
    <g transform="rotate(-16 180 61)"><rect x="180" y="57" width="80" height="8" rx="4" class="d-lift"/></g>
    <g transform="rotate(22 257 39)"><rect x="257" y="36" width="30" height="6" rx="3" class="d-accent"/></g>
    <circle cx="180" cy="61" r="3.5" class="d-fill-ink"/>
    ${arrow(300, 92, 282, 56, 'd-thrust', 2.5)}${txt(304, 106, 'Air hits the tab', 't-thrust d-small', 'end')}
    ${txt(70, 92, 'Horizontal stabilizer', 'd-small')}${txt(210, 24, 'Elevator UP', 't-lift d-text')}${txt(282, 74, 'Tab DOWN', 't-accent d-small', 'end')}
    ${txt(160, 122, 'Nose-up trim: the tab moves down, pushing the elevator up', 'd-small')}`,
    'Trim tab deflected down holds the elevator up for nose-up trim');

  const MAIN = 'M0,0 C0,-8 20,-13 45,-12 C60,-11 68,-8 72,-6 L72,3 C40,4 15,3 15,3 C5,3 0,2 0,0 Z';
  const FLAPPC = 'M0,-6 C10,-5 22,-2 30,0 C20,1 8,2.5 0,3 Z';
  const panel = (ox, oy, kind, name, note) => {
    let body = '';
    if (kind === 'split') body = `<path d="${AIRFOIL}" class="d-plane" stroke-width="0.9"/><line x1="58" y1="3.5" x2="82" y2="18" class="d-thrust" stroke-width="3" stroke-linecap="round"/>`;
    else {
      const [dx, dy, ang] = kind === 'plain' ? [72, 0, 24] : kind === 'slotted' ? [74, 3, 26] : [86, 6, 22];
      body = `<path d="${MAIN}" class="d-plane" stroke-width="0.9"/><g transform="translate(${dx},${dy}) rotate(${ang})"><path d="${FLAPPC}" class="d-thrust" stroke-width="0.9"/></g>`;
    }
    return `<g transform="translate(${ox},${oy}) scale(1.15)">${body}</g>` + txt(ox + 52, oy + 38, name, 't-thrust d-text') + txt(ox + 52, oy + 50, note, 'd-small');
  };
  const flaps = svg(320, 150, panel(18, 26, 'plain', 'PLAIN', 'simplest') + panel(178, 26, 'split', 'SPLIT', 'plate drops from below') +
    panel(18, 98, 'slotted', 'SLOTTED', 'gap lets air flow through') + panel(178, 98, 'fowler', 'FOWLER', 'slides back: most lift'),
    'Four flap types: plain, split, slotted and Fowler');

  SKY.registerChapter({
    id: 'ch06',
    badge: { name: 'Stick & Rudder', emoji: '🕹️', desc: 'You know how every control surface moves and what it does to the airplane.' },
    game: {
      engine: 'sort', title: 'Rapid Sort', blurb: 'Controls, axes and which way surfaces move', xpEach: 30,
      rounds: [
        { id: 'axis', title: 'Roll, Pitch or Yaw?', brief: 'What motion does each control (or input) create?',
          buckets: ['Roll', 'Pitch', 'Yaw'],
          items: [
            { t: 'Ailerons', b: 0 }, { t: 'Elevator', b: 1 }, { t: 'Rudder', b: 2 }, { t: 'Stabilator', b: 1 },
            { t: 'Turning the yoke left', b: 0 }, { t: 'Pulling the yoke back', b: 1 }, { t: 'Pressing the right rudder pedal', b: 2 },
            { t: 'Flaperons moving in opposite directions', b: 0, why: 'Flaperons work as ailerons when they move opposite each other.' }] },
        { id: 'type', title: 'Primary or Secondary?', brief: 'Primary controls are needed to fly safely. Secondary ones improve performance or ease workload.',
          buckets: ['Primary', 'Secondary'],
          items: [
            { t: 'Ailerons', b: 0 }, { t: 'Flaps', b: 1 }, { t: 'Rudder', b: 0 }, { t: 'Trim tabs', b: 1 },
            { t: 'Elevator', b: 0 }, { t: 'Leading edge slats', b: 1 }, { t: 'Spoilers', b: 1 }, { t: 'Stabilator', b: 0 }] },
        { id: 'move', title: 'Up or Down?', brief: 'Which way does the surface move?',
          buckets: ['⬆️ Up', '⬇️ Down'],
          items: [
            { t: 'Yoke turned LEFT → left aileron', b: 0 }, { t: 'Yoke turned LEFT → right aileron', b: 1 },
            { t: 'Yoke turned RIGHT → left aileron', b: 1 }, { t: 'Yoke pulled BACK → elevator', b: 0 },
            { t: 'Yoke pushed FORWARD → elevator', b: 1 }, { t: 'Nose-up trim → elevator trim tab', b: 1, why: 'The tab moves opposite the elevator: tab down pushes the elevator up.' },
            { t: 'Flaps extended for landing', b: 1 }, { t: 'Spoiler deployed on the wing', b: 0 }] }
      ]
    },
    missions: [
      {
        id: 'primary', emoji: '🕹️', title: 'The Three Primary Controls', blurb: 'Ailerons, elevator, rudder', minutes: 5, xp: 50,
        phak: 'Chapter 6 → “Flight Control Systems” and “Primary Flight Controls”',
        cards: [
          { t: 'talk', html: `<p>Time to take the controls! The pilot has a <b>yoke</b> (or stick) for the hands and two <b>rudder pedals</b> for the feet. They move three <b>primary flight controls</b>:</p><ul><li><b>Ailerons</b>: roll (turn the yoke).</li><li><b>Elevator</b>: pitch (push or pull the yoke).</li><li><b>Rudder</b>: yaw (press the pedals).</li></ul>` },
          { t: 'diagram', svg: surfaces(true), caption: 'Where the control surfaces live.' },
          { t: 'hotspot', title: 'FIND THE CONTROL', svg: surfaces(false), spots: [
            { x: 68.75, y: 53.5, label: 'An aileron' }, { x: 42, y: 52, label: 'A flap' }, { x: 43.75, y: 82.5, label: 'The elevator' }] },
          { t: 'talk', html: `<p>Most small planes connect the controls to the surfaces with <b>cables, pulleys and push rods</b>. Big jets use hydraulics or <b>fly-by-wire</b>, where computers move the surfaces based on the pilot’s inputs.</p>` },
          { t: 'check', q: 'What is the purpose of the rudder?',
            choices: ['To control roll', 'To control yaw', 'To control pitch'], answer: 1,
            explain: 'The rudder yaws the nose left or right around the vertical axis.' },
          { t: 'test', html: `<ul><li>Ailerons → <b>roll</b> → longitudinal axis.</li><li>Elevator → <b>pitch</b> → lateral axis.</li><li>Rudder → <b>yaw</b> → vertical axis.</li></ul>` }
        ]
      },
      {
        id: 'ailerons', emoji: '↔️', title: 'Ailerons & Adverse Yaw', blurb: 'The sneaky side effect of rolling', minutes: 6, xp: 50,
        phak: 'Chapter 6 → “Ailerons” and “Adverse Yaw”',
        cards: [
          { t: 'talk', html: `<p>Turn the yoke <b>left</b>: the <b>left aileron goes up</b> and the <b>right aileron goes down</b>. The down aileron adds lift on the right wing, the up aileron spills lift on the left, and the airplane rolls left.</p><p>Easy trick: the aileron on the side you’re turning toward goes <b>up</b>.</p>` },
          { t: 'diagram', svg: adverse, caption: 'Adverse yaw: the down aileron drags its wing back.',
            html: `<p>Here’s the catch. The aileron that goes <b>down</b> makes more lift, and more lift means <b>more induced drag</b>. That drag pulls that wing back, so the nose yaws the <b>wrong way</b>, away from the turn. That’s <b>adverse yaw</b>.</p><p>The fix: add <b>rudder in the direction of the turn</b>. Using ailerons and rudder together is called <b>coordinated flight</b>.</p>` },
          { t: 'check', q: 'You roll into a RIGHT turn without using rudder. Which way does adverse yaw push the nose?',
            choices: ['Right', 'Left', 'Straight down'], answer: 1,
            explain: 'The left aileron goes down, makes more drag, and pulls the nose left. Add right rudder!' },
          { t: 'talk', html: `<p>Designers fight adverse yaw too:</p><ul><li><b>Differential ailerons</b>: the up aileron moves farther than the down one, adding drag on the correct side.</li><li><b>Frise-type ailerons</b>: the nose of the up aileron pokes into the airflow and adds drag.</li><li><b>Coupled ailerons and rudder</b>: linked so the rudder moves automatically.</li><li><b>Flaperons</b>: surfaces that act as both flaps and ailerons.</li></ul>` },
          { t: 'tryit', html: `<p>In a car with a grown-up driving, hold your hand flat out the window and tilt the front edge up. Feel it lift <i>and</i> get pushed back? More lift = more drag. That’s why the down aileron drags its wing back.</p>` },
          { t: 'test', html: `<p>Adverse yaw is caused by the <b>difference in induced drag</b> between the wings. The down-going aileron makes more lift and more drag. Counter it with <b>coordinated rudder</b>.</p>` }
        ]
      },
      {
        id: 'elevator', emoji: '↕️', title: 'Elevator, Stabilator & Rudder', blurb: 'Pitch and yaw controls', minutes: 6, xp: 50,
        phak: 'Chapter 6 → “Elevator,” “T-Tail,” “Stabilator,” “Canard,” “Rudder,” and “V-Tail”',
        cards: [
          { t: 'talk', html: `<p><b>Pull back</b> on the yoke: the elevator moves <b>up</b>. The air pushes the tail <b>down</b>, and the nose pitches <b>up</b>. Push forward and the opposite happens.</p><p>Remember: pull back = nose up, houses get bigger. Push forward = nose down, houses get bigger <i>fast</i>! 😅</p>` },
          { t: 'talk', html: `<ul><li><b>T-tail</b>: the elevator sits on top of the fin, above the prop blast and wing downwash. At low speed it needs bigger control movements.</li><li><b>Stabilator</b>: the whole horizontal tail moves. It’s so effective that an <b>antiservo tab</b> moves in the <b>same direction</b> as its trailing edge to make it less sensitive.</li><li><b>Canard</b>: a small wing in <b>front</b> of the main wing, like on the Rutan VariEze.</li></ul>` },
          { t: 'check', q: 'Which way does a stabilator’s antiservo tab move?',
            choices: ['The same direction as the stabilator’s trailing edge', 'Opposite to the stabilator’s trailing edge', 'It doesn’t move'], answer: 0,
            explain: 'Moving the same way resists the motion, making the stabilator less sensitive and giving the pilot feel.' },
          { t: 'talk', html: `<p><b>Rudder</b>: press the <b>right pedal</b>, the rudder swings <b>right</b>, the air pushes the tail <b>left</b>, and the nose yaws <b>right</b>. The rudder does <i>not</i> turn the airplane by itself. It keeps the turn coordinated and fights left-turning tendencies (remember Chapter 5?).</p><p>A <b>V-tail</b> combines rudder and elevator into two <b>ruddervators</b>.</p>` },
          { t: 'check', q: 'When you pull the yoke back, the elevator…',
            choices: ['Moves down and the nose drops', 'Moves up and the nose rises', 'Doesn’t move; the ailerons do'], answer: 1,
            explain: 'Elevator up → tail pushed down → nose pitches up.' },
          { t: 'fact', html: `<p>The Wright Flyer used a canard (front elevator) and twisted its wingtips with cables instead of ailerons. That “wing warping” was their secret to controlling roll!</p>` }
        ]
      },
      {
        id: 'flaps', emoji: '🛬', title: 'Flaps & Other Helpers', blurb: 'Secondary flight controls', minutes: 6, xp: 50,
        phak: 'Chapter 6 → “Secondary Flight Controls” (Flaps, Leading Edge Devices, Spoilers)',
        cards: [
          { t: 'talk', html: `<p><b>Flaps</b> are the most common secondary control. Extending them changes the wing’s camber, so it makes <b>more lift and more drag</b>. That lets you:</p><ul><li>Fly and land <b>slower</b>.</li><li>Descend at a <b>steeper angle without picking up speed</b>. Great for clearing trees on approach!</li></ul>` },
          { t: 'diagram', svg: flaps, caption: 'The four main kinds of flaps.' },
          { t: 'talk', html: `<p>Fowler flaps slide <b>back</b> and down, adding camber <i>and</i> wing area. That makes them the most effective at adding lift. Slotted flaps let high-energy air from under the wing flow over the flap to keep it working at bigger angles.</p>` },
          { t: 'check', q: 'One of the main functions of flaps during approach and landing is to…',
            choices: ['Decrease the angle of descent without increasing airspeed', 'Increase the angle of descent without increasing airspeed', 'Permit touchdown at a higher speed'], answer: 1,
            explain: 'Flaps add drag, so you can come down steeper without speeding up.' },
          { t: 'talk', html: `<p>More helpers:</p><ul><li><b>Leading edge slots and slats</b>: openings or movable pieces at the front of the wing that let it reach a higher angle of attack before stalling.</li><li><b>Spoilers</b>: panels that pop up from the top of the wing to “spoil” lift and add drag. Airliners use them to slow down and to stick to the runway after landing. Some also use them for roll.</li></ul>` },
          { t: 'fact', html: `<p>Next time you fly on an airliner, sit by the wing. Watch the slats slide out the front and the huge flaps roll out the back before landing. Then the spoilers pop up the moment the wheels touch down!</p>` }
        ]
      },
      {
        id: 'trim', emoji: '🎚️', title: 'Trim Tabs & Autopilots', blurb: 'Making the airplane fly itself', minutes: 5, xp: 50,
        phak: 'Chapter 6 → “Trim Tabs,” “Balance Tabs,” “Antiservo Tabs,” “Ground Adjustable Tabs,” “Adjustable Stabilizer,” and “Autopilot”',
        cards: [
          { t: 'talk', html: `<p>Holding back pressure on the yoke for an hour would wear out anyone. <b>Trim</b> fixes that. A <b>trim tab</b> is a small hinged surface on the trailing edge of a control surface. It holds the control where you want it, so the pressure goes away.</p>` },
          { t: 'diagram', svg: trim, caption: 'The tab moves OPPOSITE to the control surface.' },
          { t: 'talk', html: `<p>For <b>nose-up trim</b>, the tab moves <b>down</b>. The air pushing on it forces the elevator <b>up</b>. The pilot spins a trim wheel (or presses a trim switch) until there’s no pressure on the yoke.</p><p>Other kinds: <b>balance tabs</b>, <b>antiservo tabs</b>, <b>ground-adjustable tabs</b> (bent by a mechanic), and <b>adjustable stabilizers</b> (the whole stabilizer moves on a jackscrew, common on jets).</p>` },
          { t: 'check', q: 'What is the main purpose of a trim tab?',
            choices: ['To relieve the pilot of holding constant control pressure', 'To make the airplane roll faster', 'To lower the stall speed'], answer: 0,
            explain: 'Trim lets the airplane fly hands-off at the attitude you choose.' },
          { t: 'talk', html: `<p>An <b>autopilot</b> can hold a heading, altitude or even follow a GPS route. Simple ones control just the ailerons (a “wing leveler”). Advanced ones control pitch and roll and can fly approaches. The pilot is <b>always</b> responsible for watching what it’s doing!</p>` },
          { t: 'test', html: `<ul><li>Trim tabs move <b>opposite</b> to the control surface.</li><li>Antiservo tabs move in the <b>same</b> direction as the stabilator trailing edge.</li><li>Trim tabs <b>relieve control pressure</b>.</li></ul>` }
        ]
      }
    ],

    quizLength: 12,
    quiz: [
      { q: 'What is the purpose of the rudder on an airplane?', choices: ['To control yaw.', 'To control overbanking tendency.', 'To control roll.'], answer: 0, explain: 'The rudder controls movement about the vertical axis.' },
      { q: 'One of the main functions of flaps during approach and landing is to', choices: ['increase the angle of descent without increasing the airspeed.', 'decrease the angle of descent without increasing the airspeed.', 'permit a touchdown at a higher indicated airspeed.'], answer: 0, explain: 'Flaps add drag so you can descend steeper at the same speed.' },
      { q: 'The elevator controls movement around which axis?', choices: ['Lateral.', 'Longitudinal.', 'Vertical.'], answer: 0, explain: 'Pitch happens around the lateral axis.' },
      { q: 'Movement about the longitudinal axis (roll) is controlled by the', choices: ['ailerons.', 'elevator.', 'rudder.'], answer: 0, explain: 'Ailerons roll the airplane.' },
      { q: 'When the pilot turns the control yoke to the left, the', choices: ['left aileron moves up and the right aileron moves down.', 'left aileron moves down and the right aileron moves up.', 'both ailerons move up.'], answer: 0, explain: 'The aileron on the side you turn toward goes up.' },
      { q: 'Adverse yaw is caused by', choices: ['greater induced drag on the wing with the down-deflected aileron.', 'the propeller slipstream striking the vertical stabilizer.', 'the rudder moving opposite to the ailerons.'], answer: 0, explain: 'More lift on that wing also means more drag, pulling the nose away from the turn.' },
      { q: 'Adverse yaw is best counteracted by', choices: ['applying rudder in the direction of the turn.', 'applying rudder opposite the turn.', 'using more aileron.'], answer: 0, explain: 'Coordinated rudder keeps the nose pointed where you’re turning.' },
      { q: 'Pulling back on the control yoke causes the elevator to', choices: ['move up, pushing the tail down and the nose up.', 'move down, pushing the tail up and the nose down.', 'move up, pushing the tail up and the nose down.'], answer: 0, explain: 'Elevator up → tail down → nose up.' },
      { q: 'The antiservo tab on a stabilator moves', choices: ['in the same direction as the trailing edge of the stabilator.', 'opposite the trailing edge of the stabilator.', 'only when the trim wheel is moved.'], answer: 0, explain: 'It resists the motion, decreasing sensitivity and adding feel.' },
      { q: 'Which type of flap increases both wing camber and wing area?', choices: ['Fowler flap.', 'Plain flap.', 'Split flap.'], answer: 0, explain: 'Fowler flaps slide back as they extend, adding area and camber.' },
      { q: 'Leading edge slots and slats allow the wing to', choices: ['operate at a higher angle of attack before stalling.', 'fly faster in cruise.', 'reduce lift for descents.'], answer: 0, explain: 'They help keep air attached to the top of the wing at high angles of attack.' },
      { q: 'Spoilers are used to', choices: ['reduce lift and increase drag.', 'increase lift for takeoff.', 'trim the airplane in pitch.'], answer: 0, explain: 'They “spoil” the smooth airflow over the wing.' },
      { q: 'The purpose of a trim tab is to', choices: ['relieve the pilot of the need to maintain constant pressure on the flight controls.', 'increase the effectiveness of the ailerons.', 'replace the elevator in an emergency.'], answer: 0, explain: 'Trim makes hands-off flight possible.' },
      { q: 'For nose-up trim, the elevator trim tab moves', choices: ['down, which forces the elevator up.', 'up, which forces the elevator up.', 'down, which forces the elevator down.'], answer: 0, explain: 'Trim tabs move opposite to the control surface.' },
      { q: 'Pressing the right rudder pedal causes the nose to', choices: ['yaw to the right.', 'yaw to the left.', 'pitch up.'], answer: 0, explain: 'Rudder right → tail pushed left → nose right.' },
      { q: 'Differential ailerons reduce adverse yaw by', choices: ['raising one aileron a greater distance than the other is lowered.', 'moving both ailerons down together.', 'linking the ailerons to the elevator.'], answer: 0, explain: 'The up aileron adds extra drag on the correct side.' },
      { q: 'Which is a secondary flight control?', choices: ['Flaps.', 'Ailerons.', 'Elevator.'], answer: 0, explain: 'Primary = ailerons, elevator, rudder. Secondary = flaps, trim, slats, spoilers.' },
      { q: 'A small wing mounted ahead of the main wing that controls pitch is called a', choices: ['canard.', 'stabilator.', 'spoiler.'], answer: 0, explain: 'The Wright Flyer used a canard!' }
    ],

    glossary: [
      { term: 'Primary flight controls', def: 'Ailerons, elevator (or stabilator) and rudder: needed to control the airplane safely.' },
      { term: 'Secondary flight controls', def: 'Flaps, trim systems, leading edge devices and spoilers.' },
      { term: 'Yoke', def: 'The control wheel: turn it to roll, push or pull it to pitch.' },
      { term: 'Aileron', def: 'A surface near the wingtip that controls roll.' },
      { term: 'Elevator', def: 'A surface on the horizontal tail that controls pitch.' },
      { term: 'Rudder', def: 'A surface on the vertical tail that controls yaw.' },
      { term: 'Adverse yaw', def: 'The nose yawing away from a turn, caused by extra drag on the wing with the down aileron.' },
      { term: 'Coordinated flight', def: 'Using rudder together with ailerons so the airplane doesn’t slip or skid.' },
      { term: 'Differential ailerons', def: 'Ailerons where the up aileron travels farther than the down one, to reduce adverse yaw.' },
      { term: 'Frise-type aileron', def: 'An aileron whose nose pokes into the airflow when raised, adding drag to reduce adverse yaw.' },
      { term: 'Flaperon', def: 'A surface that works as both a flap and an aileron.' },
      { term: 'Stabilator', def: 'A one-piece movable horizontal tail.' },
      { term: 'Antiservo tab', def: 'A tab that moves the same way as the stabilator, reducing sensitivity.' },
      { term: 'T-tail', def: 'A tail with the horizontal stabilizer mounted on top of the fin.' },
      { term: 'Canard', def: 'A small forward wing used for pitch control.' },
      { term: 'Ruddervator', def: 'A V-tail surface that works as both rudder and elevator.' },
      { term: 'Flaps', def: 'Trailing edge surfaces that add lift and drag: plain, split, slotted and Fowler.' },
      { term: 'Slats / slots', def: 'Leading edge devices that delay the stall to higher angles of attack.' },
      { term: 'Spoilers', def: 'Panels on top of the wing that reduce lift and add drag.' },
      { term: 'Trim tab', def: 'A small tab that moves opposite the control surface to relieve control pressure.' },
      { term: 'Fly-by-wire', def: 'Flight controls moved by computers using electrical signals from the pilot’s inputs.' }
    ]
  });
})();
