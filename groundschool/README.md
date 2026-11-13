# Sky Cadet ✈️

Pilot ground school made fun. Sky Cadet is a kid-friendly study buddy that follows the FAA **Pilot's Handbook of Aeronautical Knowledge (FAA-H-8083-25C)** chapter by chapter.

It's a Progressive Web App (PWA), which means:
- it runs in any web browser,
- on iPhone or iPad you can add it to the Home Screen so it looks and works like a real app,
- it works offline once loaded,
- there's no App Store and no build step. It's plain HTML, CSS and JavaScript.

## What's inside

| Part | What it does |
|---|---|
| **Route map** (home) | All 17 PHAK chapters as waypoints, with XP, rank, a logbook-hours counter and a day streak |
| **Missions** | Bite-sized lessons with Jax the flight instructor, diagrams, tap-to-find games, quick checks, real-pilot facts and "Checkride Corner" tips on how the FAA test words things |
| **Trim Master** (Ch 5) | A small flight simulator: set throttle and pitch, then watch lift, weight, thrust, drag and angle of attack change live. Five missions: level flight, climb, slow flight, stall recovery and descent |
| **Checkride quiz** | Real FAA-style questions with 3 choices (A/B/C), shuffled every time, with an explanation for each answer. Pass with 80% to earn the chapter badge |
| **Word Hangar** | Flip-card glossary of key terms |
| **Logbook** | Every mission, quiz and sim session gets logged, like a real pilot logbook |

Progress is saved on the device. Settings → *Back up progress* makes a code you can paste into another device.

## Run it on your computer

```bash
cd sky-cadet
python3 -m http.server 8642
```
Then open http://localhost:8642.

**To try it on an iPhone on the same Wi-Fi:** run the command above, find your Mac's IP address (System Settings → Wi-Fi → Details), and open `http://<that-ip>:8642` in Safari. Offline mode only turns on once the app is hosted on HTTPS (see below).

## Put it on the internet (free) so it lives on his iPhone

Any static host works. Two easy options:

- **GitHub Pages:** push this folder to a GitHub repo, then go to Settings → Pages → Deploy from branch.
- **Netlify:** drag the `sky-cadet` folder onto https://app.netlify.com/drop (you'll need a free account to keep the site).

Then on the iPhone: open the site in **Safari** → tap **Share** → **Add to Home Screen**.

## Editing chapters

All 17 PHAK chapters are built. Each lives in its own file, `chapters/ch01.js` through `chapters/ch17.js`, so you can tweak one without touching the others:

- **Lessons**: `missions` → `cards` (talk, diagram, check, hotspot, fact, tryit, test).
- **Checkride quiz**: `quiz`. Write the correct answer first; the app shuffles the choices.
- **Rapid Sort game**: `game.rounds` (buckets plus items to sort). Chapter 5 uses the Trim Master flight sim instead.
- **Flashcards**: `glossary`.

To add a brand-new chapter, copy `chapters/_TEMPLATE.js`, then add `file: 'chapters/yourfile.js'` to its entry in `chapters/index.js`. The offline cache picks it up automatically. After deploying changes, bump `VERSION` in `sw.js` so phones refresh their cache.

## Files

```
index.html            app shell + iOS home-screen tags
manifest.webmanifest  PWA name, colors, icons
sw.js                 offline support (network-first, cache fallback)
css/app.css           all styling (light and dark mode)
js/app.js             screens, progress, XP, quiz, flashcards, logbook
js/trim-game.js       Trim Master flight model + renderer
chapters/index.js     table of contents (all 17 PHAK chapters)
chapters/ch05.js      Chapter 5: Aerodynamics of Flight (full)
chapters/_TEMPLATE.js starting point for new chapters
icons/                app icons
```

---
Sky Cadet is a study aid. Use the official FAA handbook and a certificated flight instructor for real training.
