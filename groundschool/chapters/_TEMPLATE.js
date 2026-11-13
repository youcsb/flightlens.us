// Copy this file to chapters/chNN.js, fill it in, then add  file: 'chapters/chNN.js'
// to that chapter's entry in chapters/index.js (sw.js caches it automatically).
// Diagram helpers live in SKY.draw (see js/draw.js); any chapter file is a full example.
(() => {
  SKY.registerChapter({
    id: 'chNN',                                   // must match the id in chapters/index.js
    badge: { name: 'Badge Name', emoji: '🏅', desc: 'What earning this badge means.' },
    game: {                                       // optional Rapid Sort game (js/sort-game.js)
      engine: 'sort', title: 'Rapid Sort', blurb: 'One-line teaser', xpEach: 30,
      rounds: [
        { id: 'r1', title: 'Round title', brief: 'Instructions', buckets: ['Bucket A', 'Bucket B'],
          items: [{ t: 'Thing to sort', b: 0, why: 'Optional explanation shown if wrong' }] }
      ]
    },

    missions: [
      {
        id: 'first', emoji: '✈️', title: 'Mission title', blurb: 'One-line teaser', minutes: 5, xp: 50,
        phak: 'Chapter NN → section names in the handbook',
        cards: [
          // Card types (HTML is allowed in html/q/choices/explain):
          { t: 'talk', html: '<p>Jax the instructor explains something.</p>' },
          { t: 'diagram', svg: '<svg viewBox="0 0 320 200">…</svg>', caption: 'Caption', html: '<p>Optional explanation below.</p>' },
          { t: 'check', q: 'Quick question?', choices: ['Wrong', 'Right', 'Wrong'], answer: 1, explain: 'Why.' },
          { t: 'hotspot', title: 'FIND IT', svg: '<svg …>', spots: [{ x: 50, y: 25, label: 'Thing' }] },  // x/y = % of the diagram
          { t: 'fact', html: '<p>Cool real-world fact.</p>' },
          { t: 'tryit', html: '<p>A safe experiment to try at home.</p>' },
          { t: 'test', html: '<p>How the FAA knowledge test asks about this.</p>' }
        ]
      }
    ],

    quizLength: 12,
    // FAA-style, 3 choices. Put the correct choice FIRST (answer: 0); the app shuffles them.
    quiz: [
      { q: 'Question?', choices: ['Correct', 'Wrong', 'Wrong'], answer: 0, explain: 'Why.' }
    ],

    glossary: [
      { term: 'Term', def: 'Kid-friendly definition.' }
    ]
  });
})();
