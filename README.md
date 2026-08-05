# Everett Altmann — plane spotting

Static site. Plain HTML, CSS and JavaScript. No framework, no build step.
Hosted on GitHub Pages.

---

## Adding a photograph

**The filename is the caption.** Drop a file into the right folder, named like
a controller's flight strip, and the site picks it up:

```
images/<collection>/NN - REG - TYPE - OPERATOR - FIELD.jpg
```

| Piece      | What it is                          | Example              |
|------------|-------------------------------------|----------------------|
| `NN`       | order on the page — see below       | `04`                 |
| `REG`      | registration (leave out if unknown) | `N510DN`, `D-AIKS`   |
| `TYPE`     | aircraft type                       | `A350-900`, `737-800`|
| `OPERATOR` | airline or operator                 | `Delta Air Lines`    |
| `FIELD`    | where you shot it                   | `KSEA`, `Seafair`    |

So:

```
images/widebodies/01 - N510DN - A350-900 - Delta Air Lines - KSEA.jpg
```

Any field you don't know, just leave it out. `03 - 737-800 - Alaska Airlines -
KSEA.jpg` works fine — the strip closes the gap and nothing shows as blank.

### The numbers

- **01–49** are Everett's own photographs.
- **50 and up** are stand-ins from Wikimedia Commons, waiting to be replaced.

That split means adding your own photo never collides with a stand-in, and the
front page can show only your own frames. The numbers are sort keys only — they
never appear on the site, so gaps are fine.

To replace a stand-in: delete the `50 - …` file, add yours as `04 - …`, and
remove its line from `credits.html`.

### Then rebuild the index

```bash
python3 tools/index-photos.py
```

This regenerates `assets/photos.js`, which is what the site actually reads.
**A photo added without this step will not appear.** Pushing to GitHub runs it
automatically (`.github/workflows/index-photos.yml`), so uploads through the
GitHub web interface work too.

### Resize first

Camera originals are 20–30× larger than they need to be:

```bash
sips -Z 2200 -s format jpeg -s formatOptions 80 "photo.jpg" --out "photo.jpg"
```

HEIC from an iPhone works the same way — `sips` converts it to JPEG on the way
through. Browsers can't display HEIC, so everything published has to be JPEG.

---

## Writing about the airplanes

Two places, for two different jobs:

- **`assets/aircraft.js`** — describes an aircraft *type*. Write the 737-800
  entry once and every 737-800 you ever add inherits it. Unlisted types fall
  back to the closest match, so `737-900ER` picks up `737-900`.
- **`assets/notes.js`** — describes *one photograph*. A rare livery, where you
  were standing, why the catch mattered. Keyed by the image path.

Both show up under the photograph in the lightbox. The note wins if there's one.

---

## Adding or removing a collection

1. Edit `COLLECTIONS` in `tools/index-photos.py` (slug, display name, blurb).
2. Make the folder `images/<slug>/`.
3. Copy any gallery page — e.g. `widebodies.html` — to `<slug>.html` and change
   the two places the slug appears.
4. Run the indexer.

Navigation, the board on the front page, and the counts all update themselves.

---

## Preview it locally

```bash
python3 tools/serve.py
```

Then open <http://localhost:8747>. Ctrl-C to stop — **stop it explicitly**, it
won't exit on its own.

---

## Layout

```
index.html            front page — hero, statement, own frames, the board
about.html            Everett's own words
credits.html          attribution for the stand-in photographs
<collection>.html     one gallery page per collection

assets/site.css       the whole design system
assets/site.js        chrome, strips, justified rows, lightbox
assets/photos.js      GENERATED — do not edit by hand
assets/aircraft.js    what each aircraft type is
assets/notes.js       notes on individual photographs

images/<collection>/  the photographs
originals/            camera originals — not published (see .gitignore)
tools/index-photos.py rebuilds photos.js from the images folders
tools/serve.py        local preview server
```

---

## Publishing

Pushing to `main` deploys. GitHub Pages serves the repository root.

Repository must stay **public** — Pages on a private repo needs a paid plan.
