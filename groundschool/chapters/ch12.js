// Chapter 12 — Weather Theory (PHAK FAA-H-8083-25C)
(() => {
  const { arrow, arcArrow, txt, lines, box, svg } = SKY.draw;

  const highLow = svg(320, 170, `
    <circle cx="80" cy="72" r="46" class="d-box"/><circle cx="240" cy="72" r="46" class="d-box"/>
    ${[0, 2.1, 4.2].map((a) => arcArrow(80, 72, 34, a, a + 1.4, 'd-thrust')).join('')}
    ${[0, 2.1, 4.2].map((a) => arcArrow(240, 72, 34, a + 1.4, a, 'd-weight')).join('')}
    ${txt(80, 80, 'H', 't-thrust d-text').replace('d-text', 'd-text" style="font-size:24px')}${txt(240, 80, 'L', 't-weight d-text').replace('d-text', 'd-text" style="font-size:24px')}
    ${txt(80, 136, 'HIGH: clockwise, outward', 't-thrust d-small')}${txt(80, 148, 'sinking air → usually fair', 'd-small')}
    ${txt(240, 136, 'LOW: counterclockwise, inward', 't-weight d-small')}${txt(240, 148, 'rising air → clouds & rain', 'd-small')}
    ${txt(160, 166, '(Northern Hemisphere)', 'd-small')}`,
    'In the Northern Hemisphere, air circulates clockwise and outward around highs and counterclockwise and inward around lows');

  const seaBreeze = svg(320, 160, `
    <rect x="0" y="110" width="150" height="50" style="fill:#7fb6ea"/><rect x="150" y="104" width="170" height="56" class="d-ground"/>
    ${txt(75, 140, 'Sea: stays cooler', 't-white d-text')}${txt(235, 136, 'Land: heats up fast', 'd-text')}
    ${arrow(130, 96, 196, 96, 'd-thrust', 3.5)}${arrow(236, 92, 236, 40, 'd-weight', 3)}${arrow(200, 28, 100, 28, 'd-muted', 2.5)}${arrow(70, 36, 70, 86, 'd-thrust', 3)}
    ${txt(160, 88, 'Cool sea air blows in', 't-thrust d-small')}${txt(244, 64, 'Warm air rises', 't-weight d-small', 'start')}${txt(150, 18, 'Return flow aloft', 'd-small')}`,
    'Sea breeze: land heats up during the day, warm air rises, and cool air from the sea flows in underneath');

  const clouds = (() => {
    const puff = (x, y, s = 1, cls = 'd-cloud') => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-22,6 Q-26,-6 -12,-8 Q-8,-20 6,-14 Q18,-20 22,-6 Q32,-2 24,8 Z" class="${cls}"/></g>`;
    return svg(320, 210, `
      <line x1="58" y1="190" x2="58" y2="10" class="d-ink" stroke-width="1.5"/>
      ${[[190, 'Surface'], [130, '6,500 ft'], [60, '20,000 ft']].map(([y, s]) => `<line x1="54" y1="${y}" x2="230" y2="${y}" class="d-muted" stroke-dasharray="3 4"/>` + txt(52, y + 3, s, 'd-small', 'end')).join('')}
      ${txt(146, 26, 'HIGH: cirrus, cirrostratus, cirrocumulus', 't-brand d-small')}<path d="M70,44 Q110,38 150,44 Q180,48 200,42" class="d-muted" stroke-width="2" style="fill:none"/>
      ${txt(130, 84, 'MIDDLE: altostratus, altocumulus', 't-brand d-small')}${puff(100, 108, 0.8)}${puff(150, 104, 0.8)}
      ${txt(130, 150, 'LOW: stratus, stratocumulus,', 't-brand d-small')}${txt(130, 160, 'nimbostratus', 't-brand d-small')}<rect x="70" y="168" width="130" height="12" rx="6" class="d-cloud"/>
      <path d="M244,188 Q236,150 252,130 Q244,96 262,70 Q256,40 270,28 L240,22 L310,18 L290,30 Q304,60 296,96 Q312,130 300,188 Z" class="d-cloud"/>
      ${txt(272, 204, 'VERTICAL DEVELOPMENT', 't-weight d-small')}${txt(272, 110, 'Cumulo-', 't-weight d-small')}${txt(272, 120, 'nimbus', 't-weight d-small')}`,
      'Cloud families by height: low, middle, high and vertically developed clouds like cumulonimbus');
  })();

  const storm = svg(320, 175, `
    <path d="M20,150 Q14,120 30,108 Q26,84 50,80 Q60,62 78,76 Q96,74 94,98 Q108,112 98,150 Z" class="d-cloud"/>
    ${arrow(46, 150, 46, 92, 'd-thrust', 2.5)}${arrow(72, 150, 72, 96, 'd-thrust', 2.5)}
    <path d="M116,150 Q110,110 124,92 Q118,60 140,50 L120,30 L210,26 L180,48 Q200,70 194,96 Q206,118 200,150 Z" class="d-cloud"/>
    ${arrow(140, 150, 140, 70, 'd-thrust', 2.5)}${arrow(176, 72, 176, 150, 'd-weight', 2.5)}
    ${[150, 162, 186].map((x) => `<line x1="${x}" y1="152" x2="${x - 4}" y2="166" class="d-thrust" stroke-width="2"/>`).join('')}
    <path d="M222,150 Q216,124 232,114 Q230,94 252,92 Q268,80 284,94 Q302,96 300,120 Q312,132 302,150 Z" class="d-cloud" opacity=".8"/>
    ${arrow(246, 104, 246, 150, 'd-weight', 2.5)}${arrow(282, 108, 282, 150, 'd-weight', 2.5)}
    ${txt(58, 14, '1. CUMULUS', 't-thrust d-small')}${txt(58, 24, 'updrafts', 'd-small')}
    ${txt(164, 14, '2. MATURE', 't-weight d-small')}${txt(240, 36, 'rain begins,', 'd-small', 'start')}${txt(240, 46, 'up + downdrafts', 'd-small', 'start')}
    ${txt(266, 74, '3. DISSIPATING', 't-muted d-small')}${txt(266, 84, 'downdrafts', 'd-small')}`,
    'Thunderstorm life cycle: cumulus stage with updrafts, mature stage with rain and both updrafts and downdrafts, dissipating stage with downdrafts');

  SKY.registerChapter({
    id: 'ch12',
    badge: { name: 'Weather Wise', emoji: '⛈️', desc: 'You understand how weather forms and which kinds can hurt a pilot.' },
    game: {
      engine: 'sort', title: 'Rapid Sort', blurb: 'Air, clouds, fog and fronts', xpEach: 30,
      rounds: [
        { id: 'stab', title: 'Stable or Unstable?', brief: 'Which kind of air mass gives you this?',
          buckets: ['Stable air', 'Unstable air'],
          items: [
            { t: 'Stratiform (layered) clouds', b: 0 }, { t: 'Cumuliform (puffy, towering) clouds', b: 1 }, { t: 'Smooth air', b: 0 },
            { t: 'Turbulence', b: 1 }, { t: 'Steady, continuous precipitation', b: 0 }, { t: 'Showers', b: 1 },
            { t: 'Poor visibility (haze, fog)', b: 0 }, { t: 'Good visibility', b: 1 }] },
        { id: 'cloud', title: 'Cloud Families', brief: 'Which family does each cloud belong to?',
          buckets: ['High', 'Middle', 'Low', 'Vertical development'],
          items: [
            { t: 'Cirrus', b: 0 }, { t: 'Stratus', b: 2 }, { t: 'Altocumulus', b: 1 }, { t: 'Cumulonimbus', b: 3 },
            { t: 'Altostratus', b: 1 }, { t: 'Cirrostratus', b: 0 }, { t: 'Nimbostratus', b: 2 }, { t: 'Towering cumulus', b: 3 }] },
        { id: 'fog', title: 'Name That Fog', brief: 'Which kind of fog is it?',
          buckets: ['Radiation', 'Advection', 'Upslope', 'Steam'],
          items: [
            { t: 'Clear, calm night; the ground cools', b: 0 }, { t: 'Moist ocean air blows over cold land', b: 1 },
            { t: 'Moist air pushed up a mountain slope', b: 2 }, { t: 'Cold air moves over warm water', b: 3 },
            { t: 'Common along coasts', b: 1 }, { t: 'Forms in low valleys, burns off in the morning', b: 0 },
            { t: 'Rolls in from the ocean with the sea breeze', b: 1, why: 'Wind carries moist sea air over colder land: advection fog.' },
            { t: 'Can lead to low-level turbulence and icing over lakes', b: 3 }] },
        { id: 'front', title: 'Cold Front or Warm Front?', brief: 'Which front is it?',
          buckets: ['Cold front', 'Warm front'],
          items: [
            { t: 'Moves fast', b: 0 }, { t: 'Moves slowly', b: 1 }, { t: 'Thunderstorms and showers', b: 0 },
            { t: 'Long, steady rain and low clouds', b: 1 }, { t: 'Clears quickly after it passes', b: 0 }, { t: 'Fog and low ceilings ahead of it', b: 1 }] }
      ]
    },
    missions: [
      {
        id: 'atmo', emoji: '🌐', title: 'Pressure & Circulation', blurb: 'Highs, lows and why the wind blows', minutes: 6, xp: 50,
        phak: 'Chapter 12 → “Atmosphere,” “Atmospheric Circulation,” “Atmospheric Pressure,” and “Coriolis Force”',
        cards: [
          { t: 'talk', html: `<p>Almost all weather happens in the lowest layer of the atmosphere, the <b>troposphere</b>. It reaches about 20,000 feet over the poles and around 48,000 feet over the equator. Above it is the <b>tropopause</b>, then the <b>stratosphere</b>, where airliners sometimes cruise above the weather.</p>` },
          { t: 'talk', html: `<p>All weather starts with the sun <b>heating the Earth unevenly</b>. That makes differences in pressure, and air moves from <b>high pressure toward low pressure</b>. That moving air is <b>wind</b>.</p><p>Every physical process of weather involves a <b>heat exchange</b>.</p>` },
          { t: 'diagram', svg: highLow, caption: 'Earth’s spin (the Coriolis force) bends the wind into spirals.',
            html: `<p>Lines on weather maps connecting equal pressure are called <b>isobars</b>. When they’re <b>close together</b>, the pressure changes quickly and the <b>wind is strong</b>.</p>` },
          { t: 'check', q: 'What causes the altimeter setting to differ from one weather station to another?',
            choices: ['Unequal heating of the Earth’s surface', 'Variation of terrain elevation', 'The Coriolis force'], answer: 0,
            explain: 'Uneven heating creates pressure differences, which is why you update your altimeter setting along the way.' },
          { t: 'test', html: `<ul><li>Every physical process of weather is accompanied by a <b>heat exchange</b>.</li><li>Pressure differences come from <b>unequal heating</b> of the Earth’s surface.</li><li>Northern Hemisphere: <b>clockwise</b> around highs, <b>counterclockwise</b> around lows.</li></ul>` }
        ]
      },
      {
        id: 'wind', emoji: '🌬️', title: 'Wind, Breezes & Turbulence', blurb: 'Sea breezes, mountain waves, microbursts', minutes: 7, xp: 50,
        phak: 'Chapter 12 → “Convective Currents,” “Effect of Obstructions on Wind,” “Low-Level Wind Shear,” and “Microbursts”',
        cards: [
          { t: 'diagram', svg: seaBreeze, caption: 'A sea breeze on a sunny day.',
            html: `<p>Land heats up faster than water. Warm air over the land rises, and <b>cool, dense air from over the water</b> flows in to replace it. At night it reverses: a <b>land breeze</b>. Rising warm air also makes <b>thermals</b>, powered by <b>solar heating</b>. Glider pilots love them!</p>` },
          { t: 'talk', html: `<p>Near the ground, <b>friction</b> slows the wind and changes its direction. That’s why the surface wind is often different from the wind a few thousand feet up.</p><p>Wind over buildings, hills and trees tumbles into <b>mechanical turbulence</b>. Strong wind over mountains can make <b>mountain waves</b>, sometimes marked by smooth, lens-shaped <b>lenticular clouds</b> with very strong winds inside.</p>` },
          { t: 'talk', html: `<p><b>Wind shear</b> is a sudden change in wind speed or direction. It can happen near a <b>temperature inversion with strong winds above it</b>, or near thunderstorms.</p><p>The scariest kind is a <b>microburst</b>: a short, violent downdraft. Downdrafts can reach <b>6,000 feet per minute</b>. Flying through one, you might get a 45-knot <b>headwind</b> (climbing), then a 45-knot <b>tailwind</b> (sinking): a total shear of <b>90 knots</b>!</p>` },
          { t: 'check', q: 'You hit a 45-knot headwind entering a microburst. What total shear should you expect across it?',
            choices: ['45 knots', '80 knots', '90 knots'], answer: 2,
            explain: 'A 45-knot headwind on one side, a 45-knot tailwind on the other: 90 knots total.' },
          { t: 'fact', html: `<p>Microbursts usually last less than 15 minutes, with the strongest winds for only 2 to 4 minutes. That’s why airports have wind shear alert systems, and pilots report wind shear right away.</p>` },
          { t: 'test', html: `<ul><li>Sea breezes are caused by <b>cool, dense air moving inland from over the water</b>.</li><li>Surface wind differs from wind aloft because of <b>friction</b>.</li><li>Low-level wind shear can occur with a <b>low-level temperature inversion with strong winds above it</b>.</li><li>Lenticular clouds can contain winds of <b>50 knots or more</b>.</li></ul>` }
        ]
      },
      {
        id: 'moist', emoji: '☁️', title: 'Moisture, Clouds & Fog', blurb: 'Dewpoint and cloud families', minutes: 7, xp: 50,
        phak: 'Chapter 12 → “Moisture and Temperature,” “Dew and Frost,” “Fog,” and “Clouds”',
        cards: [
          { t: 'talk', html: `<p>Water gets into the air by <b>evaporation</b> (liquid → gas) and <b>sublimation</b> (ice → gas). Warmer air can hold more water vapor.</p><p>The <b>dewpoint</b> is the temperature the air must cool to in order to become <b>saturated</b>. When the temperature and dewpoint get close (a small <b>“spread”</b>) and are getting closer, expect <b>fog or low clouds</b>.</p>` },
          { t: 'talk', html: `<p>Cool trick: estimate the <b>base of puffy cumulus clouds</b>. Divide the temperature-dewpoint spread by <b>4.4°F</b> (or <b>2.5°C</b>) and multiply by 1,000 to get the height above the ground.</p><p>Example: temperature 82°F, dewpoint 38°F. Spread = 44. 44 ÷ 4.4 = 10, so the cloud bases are about <b>10,000 ft AGL</b>.</p>` },
          { t: 'check', q: 'At an airport at 1,000 ft MSL, the temperature is 70°F and the dewpoint is 48°F. About where are the cumulus bases?',
            choices: ['5,000 ft MSL', '6,000 ft MSL', '4,000 ft MSL'], answer: 1,
            explain: 'Spread 22 ÷ 4.4 = 5, so 5,000 ft AGL. Add the 1,000 ft elevation: 6,000 ft MSL.' },
          { t: 'diagram', svg: clouds, caption: 'Clouds are grouped into families by height.',
            html: `<p>Clouds are named by family and shape: <b>cumulus</b> = heaped, <b>stratus</b> = layered, <b>cirrus</b> = wispy, <b>nimbus</b> = rain cloud. A <b>ceiling</b> is the lowest layer reported as <b>broken or overcast</b>, or the vertical visibility into an obscuration.</p>` },
          { t: 'talk', html: `<p>Fog is a cloud on the ground:</p><ul><li><b>Radiation fog</b>: clear, calm nights over low, flat land.</li><li><b>Advection fog</b>: moist air blown over a colder surface. Common near coasts, and it needs wind.</li><li><b>Upslope fog</b>: moist air pushed up a slope by the wind.</li><li><b>Steam fog</b>: cold air moving over warmer water.</li></ul><p><b>Frost</b> forms when the surface is at or below the dewpoint and the dewpoint is below freezing. Frost on wings spoils the smooth airflow and can keep you from lifting off. <b>Remove ALL frost before flight.</b></p>` },
          { t: 'test', html: `<ul><li>Clouds are grouped by <b>height range</b>.</li><li>“Nimbus” means <b>rain cloud</b>.</li><li>Fog that needs wind: <b>advection and upslope</b>.</li><li>Frost may <b>prevent the airplane from becoming airborne at normal takeoff speed</b>.</li></ul>` }
        ]
      },
      {
        id: 'stable', emoji: '📏', title: 'Stable vs. Unstable Air', blurb: 'Lapse rates and inversions', minutes: 6, xp: 50,
        phak: 'Chapter 12 → “Atmospheric Stability,” “Temperature Inversions,” and “Air Masses”',
        cards: [
          { t: 'talk', html: `<p><b>Stable air</b> resists going up or down, like a heavy ball in a bowl. <b>Unstable air</b> wants to keep rising once it gets a push, like a hot-air balloon.</p><p>We can tell which by the <b>actual lapse rate</b>, how fast the temperature drops as you go up. Fast cooling with height = unstable. Slow (or no) cooling = stable.</p>` },
          { t: 'talk', html: `<table style="width:100%;font-size:15px"><tr><th style="text-align:left">Stable air</th><th style="text-align:left">Unstable air</th></tr><tr><td>Stratiform clouds</td><td>Cumuliform clouds</td></tr><tr><td>Smooth air</td><td>Turbulence</td></tr><tr><td>Steady precipitation</td><td>Showers</td></tr><tr><td>Fair to poor visibility</td><td>Good visibility</td></tr></table>` },
          { t: 'check', q: 'What are the characteristics of a moist, unstable air mass?',
            choices: ['Cumuliform clouds and showery precipitation', 'Poor visibility and smooth air', 'Stratiform clouds and steady rain'], answer: 0,
            explain: 'Unstable air builds puffy, towering clouds and showers.' },
          { t: 'talk', html: `<p>Normally it gets colder as you go up. In a <b>temperature inversion</b>, it gets <b>warmer</b> as you go up. That makes a very stable layer that traps haze, smoke and fog near the ground: smooth air but poor visibility.</p><p>The most common ground-level inversion forms on a <b>clear, calm night</b> as the ground radiates its heat away.</p><p><b>Warming air from below</b> makes it <b>less stable</b>, like a sunny afternoon over a hot parking lot.</p>` },
          { t: 'test', html: `<ul><li>Stability is measured by the <b>actual lapse rate</b>.</li><li>Warming from below <b>decreases</b> stability.</li><li>An inversion means temperature <b>increases with altitude</b>.</li><li>Stable air → <b>poor visibility and steady precipitation</b>.</li></ul>` }
        ]
      },
      {
        id: 'fronts', emoji: '🌦️', title: 'Air Masses & Fronts', blurb: 'When two air masses collide', minutes: 6, xp: 50,
        phak: 'Chapter 12 → “Air Masses” and “Fronts”',
        cards: [
          { t: 'talk', html: `<p>An <b>air mass</b> is a huge body of air that takes on the temperature and moisture of where it formed: cold and dry over Canada, warm and humid over the Gulf of Mexico.</p><p>Where two air masses meet is a <b>front</b>. Crossing any front, you’ll always find a <b>wind shift</b>, plus usually a change in <b>temperature</b>, pressure and dewpoint.</p>` },
          { t: 'talk', html: `<ul><li>❄️ <b>Cold front</b>: cold air shoves under warm air like a bulldozer. It moves <b>fast</b>, with <b>cumulus clouds, showers and thunderstorms</b> along a narrow band. Afterward the sky often clears and it’s cooler.</li><li>🌡️ <b>Warm front</b>: warm air slides up over cold air. It moves <b>slowly</b>, with <b>stratus clouds, long steady rain</b>, low ceilings and fog spread over hundreds of miles.</li><li>↔️ <b>Stationary front</b>: neither side wins. Weather can hang around for days.</li><li>🔀 <b>Occluded front</b>: a fast cold front catches up to a warm front.</li></ul>` },
          { t: 'check', q: 'Which weather change ALWAYS happens when you fly across a front?',
            choices: ['A change in wind direction', 'Rain', 'A change in the type of clouds'], answer: 0,
            explain: 'A wind shift is the one sure sign of crossing a front.' },
          { t: 'fact', html: `<p>Pilots sometimes see a <b>squall line</b>: a line of strong thunderstorms that forms <b>ahead of</b> a cold front. Squall lines produce some of the most dangerous weather for airplanes.</p>` },
          { t: 'test', html: `<ul><li>Always a <b>change in wind direction</b> across a front.</li><li>One of the easiest changes to notice is a <b>change in temperature</b>.</li><li>Steady precipitation ahead of a front → <b>stratiform clouds with little or no turbulence</b>.</li></ul>` }
        ]
      },
      {
        id: 'storms', emoji: '⛈️', title: 'Thunderstorms & Icing', blurb: 'The biggest weather dangers', minutes: 7, xp: 50,
        phak: 'Chapter 12 → “Thunderstorms,” “Hazards,” and “Icing”',
        cards: [
          { t: 'talk', html: `<p>Thunderstorms need three ingredients:</p><ul><li>💧 <b>Sufficient water vapor</b> (high humidity).</li><li>🎈 An <b>unstable lapse rate</b>.</li><li>⬆️ A <b>lifting force</b> to get it started: a front, mountains, or heating from below.</li></ul>` },
          { t: 'diagram', svg: storm, caption: 'A thunderstorm’s three-stage life cycle.',
            html: `<p>The <b>mature stage</b> begins when <b>rain starts falling</b> from the base. That’s when the storm is most intense, with updrafts and downdrafts side by side.</p>` },
          { t: 'talk', html: `<p>Thunderstorm hazards: severe turbulence, hail (even miles outside the storm), lightning, icing, wind shear and even tornadoes. <b>Lightning</b> is the one hazard that comes with <b>every</b> thunderstorm. Stay <b>at least 20 miles</b> away from severe storms.</p><p>If you ever hit severe turbulence, keep the airplane in a <b>level flight attitude</b> and don’t chase altitude.</p>` },
          { t: 'check', q: 'Which stage of a thunderstorm is mostly downdrafts?',
            choices: ['Cumulus', 'Mature', 'Dissipating'], answer: 2,
            explain: 'Cumulus = updrafts. Mature = both, at peak intensity. Dissipating = downdrafts.' },
          { t: 'talk', html: `<p><b>Structural icing</b> needs two things: <b>visible moisture</b> (cloud or rain) and a temperature <b>at or below freezing</b> on the airplane.</p><ul><li><b>Clear ice</b>: big drops freeze slowly into heavy, smooth ice. <b>Freezing rain</b> builds ice fastest!</li><li><b>Rime ice</b>: tiny drops freeze instantly into rough, milky ice.</li></ul><p><b>Ice pellets</b> or freezing rain at the surface mean there’s a <b>warmer layer above</b> (an inversion), so there’s freezing rain at a higher altitude.</p>` },
          { t: 'test', html: `<ul><li>Ingredients: <b>high humidity, lifting force, unstable conditions</b>.</li><li>Mature stage starts when <b>precipitation begins falling</b>.</li><li>Always associated with a thunderstorm: <b>lightning</b>.</li><li>Most intense: <b>squall line</b> thunderstorms.</li><li>Structural icing requires <b>visible moisture</b>.</li></ul>` }
        ]
      }
    ],

    quizLength: 12,
    quiz: [
      { q: 'What causes variations in altimeter settings between weather reporting points?', choices: ['Unequal heating of the Earth’s surface.', 'Variation of terrain elevation.', 'Coriolis force.'], answer: 0, explain: 'Uneven heating creates pressure differences.' },
      { q: 'Every physical process of weather is accompanied by, or is the result of, a', choices: ['heat exchange.', 'movement of air.', 'pressure differential.'], answer: 0, explain: 'Heat exchange drives all weather.' },
      { q: 'The development of thermals depends upon', choices: ['solar heating.', 'a counterclockwise circulation of air.', 'temperature inversions.'], answer: 0, explain: 'The sun warms the ground, which warms the air above it.' },
      { q: 'What are the characteristics of a moist, unstable air mass?', choices: ['Cumuliform clouds and showery precipitation.', 'Poor visibility and smooth air.', 'Stratiform clouds and showery precipitation.'], answer: 0, explain: 'Unstable air builds cumulus clouds and showers.' },
      { q: 'What are characteristics of stable air?', choices: ['Poor visibility and steady precipitation.', 'Good visibility and steady precipitation.', 'Poor visibility and intermittent precipitation.'], answer: 0, explain: 'Stable air traps haze and gives steady rain.' },
      { q: 'A temperature inversion would most likely result in which weather condition?', choices: ['An increase in temperature as altitude is increased.', 'Clouds with extensive vertical development above an inversion aloft.', 'Good visibility in the lower levels of the atmosphere and poor visibility above an inversion aloft.'], answer: 0, explain: 'That’s the definition of an inversion.' },
      { q: 'The most frequent type of ground or surface-based temperature inversion is that which is produced by', choices: ['terrestrial radiation on a clear, relatively still night.', 'warm air being lifted rapidly aloft in the vicinity of mountainous terrain.', 'the movement of colder air under warm air.'], answer: 0, explain: 'The ground cools quickly on clear, calm nights.' },
      { q: 'What measurement can be used to determine the stability of the atmosphere?', choices: ['Actual lapse rate.', 'Atmospheric pressure.', 'Surface temperature.'], answer: 0, explain: 'How fast temperature drops with height tells you stability.' },
      { q: 'What would decrease the stability of an air mass?', choices: ['Warming from below.', 'Cooling from below.', 'Decrease in water vapor.'], answer: 0, explain: 'Warm air underneath wants to rise.' },
      { q: 'If the temperature/dewpoint spread is small and decreasing, and the temperature is 62 °F, what type weather is most likely to develop?', choices: ['Fog or low clouds.', 'Freezing precipitation.', 'Thunderstorms.'], answer: 0, explain: 'Air is near saturation.' },
      { q: 'What is the approximate base of the cumulus clouds if the surface air temperature at 1,000 feet MSL is 70 °F and the dewpoint is 48 °F?', choices: ['6,000 feet MSL.', '5,000 feet MSL.', '4,000 feet MSL.'], answer: 0, explain: '22 ÷ 4.4 = 5,000 ft AGL + 1,000 ft elevation.' },
      { q: 'At approximately what altitude above the surface would the pilot expect the base of cumuliform clouds if the surface air temperature is 82 °F and the dewpoint is 38 °F?', choices: ['10,000 feet AGL.', '9,000 feet AGL.', '11,000 feet AGL.'], answer: 0, explain: '44 ÷ 4.4 = 10.' },
      { q: 'What are the processes by which moisture is added to unsaturated air?', choices: ['Evaporation and sublimation.', 'Heating and condensation.', 'Supersaturation and evaporation.'], answer: 0, explain: 'Liquid → vapor and ice → vapor.' },
      { q: 'Which conditions result in the formation of frost?', choices: ['The temperature of the collecting surface is at or below the dewpoint of the adjacent air and the dewpoint is below freezing.', 'The temperature of the collecting surface is at or below freezing when small droplets of moisture fall on the surface.', 'The temperature of the surrounding air is at or below freezing when small drops of moisture fall on the collecting surface.'], answer: 0, explain: 'Frost forms by deposition, not by freezing droplets.' },
      { q: 'How does frost affect the lifting surfaces of an airplane on takeoff?', choices: ['Frost may prevent the airplane from becoming airborne at normal takeoff speed.', 'Frost will change the camber of the wing, increasing lift during takeoff.', 'Frost may cause the airplane to become airborne with a lower angle of attack at a lower indicated airspeed.'], answer: 0, explain: 'Frost spoils the smooth airflow and reduces lift.' },
      { q: 'What is meant by the term “dewpoint”?', choices: ['The temperature to which air must be cooled to become saturated.', 'The temperature at which condensation and evaporation are equal.', 'The temperature at which dew will always form.'], answer: 0, explain: 'Cool air to the dewpoint and it is saturated.' },
      { q: 'Clouds are divided into four families according to their', choices: ['height range.', 'outward shape.', 'composition.'], answer: 0, explain: 'Low, middle, high and vertical development.' },
      { q: 'The suffix “nimbus,” used in naming clouds, means', choices: ['a rain cloud.', 'a cloud with extensive vertical development.', 'a middle cloud containing ice pellets.'], answer: 0, explain: 'Nimbostratus and cumulonimbus both produce rain.' },
      { q: 'An almond or lens-shaped cloud which appears stationary, but which may contain winds of 50 knots or more, is referred to as', choices: ['a lenticular cloud.', 'an inactive frontal cloud.', 'a funnel cloud.'], answer: 0, explain: 'Lenticular clouds mark mountain waves.' },
      { q: 'What situation is most conducive to the formation of radiation fog?', choices: ['Warm, moist air over low, flatland areas on clear, calm nights.', 'Moist, tropical air moving over cold, offshore water.', 'The movement of cold air over much warmer water.'], answer: 0, explain: 'Radiation fog needs clear skies and calm wind.' },
      { q: 'What types of fog depend upon wind in order to exist?', choices: ['Advection fog and upslope fog.', 'Radiation fog and ice fog.', 'Steam fog and ground fog.'], answer: 0, explain: 'Both are made by moving air.' },
      { q: 'One weather phenomenon which will always occur when flying across a front is a change in the', choices: ['wind direction.', 'type of precipitation.', 'stability of the air mass.'], answer: 0, explain: 'A wind shift always happens at a front.' },
      { q: 'What conditions are necessary for the formation of thunderstorms?', choices: ['High humidity, lifting force, and unstable conditions.', 'High humidity, high temperature, and cumulus clouds.', 'Lifting force, moist air, and extensive cloud cover.'], answer: 0, explain: 'Moisture + instability + lift.' },
      { q: 'Which weather phenomenon signals the beginning of the mature stage of a thunderstorm?', choices: ['Precipitation beginning to fall.', 'The appearance of an anvil top.', 'Maximum growth rate of the clouds.'], answer: 0, explain: 'Rain at the base marks the mature stage.' },
      { q: 'During the life cycle of a thunderstorm, which stage is characterized predominately by downdrafts?', choices: ['Dissipating.', 'Cumulus.', 'Mature.'], answer: 0, explain: 'Downdrafts take over as the storm dies.' },
      { q: 'Thunderstorms which generally produce the most intense hazard to aircraft are', choices: ['squall line thunderstorms.', 'steady-state thunderstorms.', 'warm front thunderstorms.'], answer: 0, explain: 'Squall lines are often the most severe.' },
      { q: 'Which weather phenomenon is always associated with a thunderstorm?', choices: ['Lightning.', 'Heavy rain.', 'Hail.'], answer: 0, explain: 'No lightning, no thunder, no thunderstorm.' },
      { q: 'One in-flight condition necessary for structural icing to form is', choices: ['visible moisture.', 'small temperature/dewpoint spread.', 'stratiform clouds.'], answer: 0, explain: 'Plus temperatures at or below freezing.' },
      { q: 'In which environment is aircraft structural ice most likely to have the highest accumulation rate?', choices: ['Freezing rain.', 'Cumulus clouds with below freezing temperatures.', 'Freezing drizzle.'], answer: 0, explain: 'Big supercooled drops build clear ice very fast.' },
      { q: 'The presence of ice pellets at the surface is evidence that there', choices: ['is a temperature inversion with freezing rain at a higher altitude.', 'are thunderstorms in the area.', 'has been cold frontal passage.'], answer: 0, explain: 'Rain froze falling through colder air below a warm layer.' },
      { q: 'Maximum downdrafts in a microburst encounter may be as strong as', choices: ['6,000 ft/min.', '1,500 ft/min.', '4,500 ft/min.'], answer: 0, explain: 'Microburst downdrafts can reach 6,000 fpm.' },
      { q: 'Convective circulation patterns associated with sea breezes are caused by', choices: ['cool, dense air moving inland from over the water.', 'warm, dense air moving inland from over the water.', 'water absorbing and radiating heat faster than the land.'], answer: 0, explain: 'The land heats faster, and cool sea air flows in underneath.' }
    ],

    glossary: [
      { term: 'Troposphere', def: 'The lowest layer of the atmosphere, where almost all weather happens.' },
      { term: 'Isobar', def: 'A line on a map connecting points of equal pressure. Close together = strong wind.' },
      { term: 'Coriolis force', def: 'The effect of Earth’s rotation that bends moving air. To the right in the Northern Hemisphere.' },
      { term: 'High pressure', def: 'Sinking air, clockwise flow (NH), usually fair weather.' },
      { term: 'Low pressure', def: 'Rising air, counterclockwise flow (NH), usually clouds and precipitation.' },
      { term: 'Sea breeze', def: 'Cool air flowing from the sea onto warmer land during the day.' },
      { term: 'Wind shear', def: 'A sudden change in wind speed or direction.' },
      { term: 'Microburst', def: 'A small, intense downdraft with downdrafts up to 6,000 fpm.' },
      { term: 'Dewpoint', def: 'The temperature at which air becomes saturated.' },
      { term: 'Temperature-dewpoint spread', def: 'The gap between temperature and dewpoint. Small and shrinking means fog or low clouds.' },
      { term: 'Ceiling', def: 'The lowest broken or overcast layer, or vertical visibility into an obscuration.' },
      { term: 'Lapse rate', def: 'The rate temperature drops with altitude. It tells you how stable the air is.' },
      { term: 'Temperature inversion', def: 'A layer where temperature increases with altitude. Very stable.' },
      { term: 'Stable air', def: 'Resists vertical motion: stratus clouds, smooth air, steady rain, poor visibility.' },
      { term: 'Unstable air', def: 'Rises easily: cumulus clouds, turbulence, showers, good visibility.' },
      { term: 'Cold front', def: 'Cold air pushing under warm air: fast, with showers and thunderstorms.' },
      { term: 'Warm front', def: 'Warm air sliding over cold air: slow, with stratus clouds and steady rain.' },
      { term: 'Squall line', def: 'A line of severe thunderstorms, often ahead of a cold front.' },
      { term: 'Lenticular cloud', def: 'A lens-shaped cloud marking mountain waves and strong winds.' },
      { term: 'Radiation fog', def: 'Fog on clear, calm nights over low land.' },
      { term: 'Advection fog', def: 'Moist air blown over a colder surface. Common on coasts.' },
      { term: 'Structural icing', def: 'Ice on the airframe. Needs visible moisture and freezing temperatures.' },
      { term: 'Clear ice', def: 'Heavy, smooth ice from large drops, such as freezing rain.' },
      { term: 'Rime ice', def: 'Rough, milky ice from tiny drops that freeze instantly.' }
    ]
  });
})();
