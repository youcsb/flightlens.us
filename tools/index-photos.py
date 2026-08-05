#!/usr/bin/env python3
"""
Rebuild assets/photos.js from whatever is sitting in the images/ folders.

Run this after you add, remove, rename, or reorder photographs:

    python3 tools/index-photos.py

How the filenames work
----------------------
The filename IS the logbook entry. Write it the way you'd write a strip:

    images/<collection>/NN - REG - TYPE - OPERATOR - FIELD.jpg

    NN         two digits, sets the order on the page
    REG        registration, e.g. N510DN or 9V-SHI  (leave it out if unknown)
    TYPE       aircraft type, e.g. A350-900, 737 MAX 8, FA-18 Super Hornet
    OPERATOR   airline or operator, e.g. Delta Air Lines
    FIELD      where you shot it, e.g. KSEA, KPAE, Seafair

So this file:

    images/widebodies/01 - N510DN - A350-900 - Delta Air Lines - KSEA.jpg

becomes the first photograph in Widebodies, and its strip reads
N510DN / A350-900 / Delta Air Lines / KSEA.

Any field you don't know, just leave out — "03 - 737-800 - Alaska Airlines -
KSEA.jpg" works fine and the strip closes the gap. Nothing empty ever shows.

The type also looks itself up in assets/aircraft.js. If the type is described
there, the lightbox shows that description too, so every 737-800 you ever add
gets the write-up automatically.

No dependencies. Reads JPEG/PNG/WebP dimensions straight from the file header.
"""

import json
import os
import re
import struct
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES = os.path.join(ROOT, "images")
OUTPUT = os.path.join(ROOT, "assets", "photos.js")

# Order here is the order collections appear in the nav and on the home page.
# To add a collection: add a line here, make images/<slug>/, and copy one of
# the gallery pages (e.g. widebodies.html) to <slug>.html.
COLLECTIONS = [
    ("widebodies", "Widebodies",
     "Twin-aisle metal. The long-haul airplanes that make Sea-Tac feel like a "
     "bigger airport than it is."),
    ("narrowbodies", "Narrowbodies",
     "737s and A320s, all day long. The backbone of everything that happens "
     "here."),
    ("regional", "Regional",
     "Short hops on small jets and turboprops. Easy to overlook, and some of "
     "my favorite shapes on the field."),
    ("military", "Military",
     "Whatever the Navy and the Air Force bring through. Seafair week is the "
     "best flying of the year."),
]

EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")

# A registration is either hyphenated (9V-SHI, G-ECOH, B-7837) or runs letters,
# digits, then letters again (N510DN, JA01XJ). That second shape is what keeps
# type codes like E175, CRJ900 and A320 from being mistaken for registrations —
# they have no trailing letters. If yours does look like a type code, hyphenate
# it or put it in the filename anyway and fix the odd one by hand.
REGISTRATION = re.compile(
    r"^(?:[A-Z0-9]{1,2}-[A-Z0-9]{3,5}|[A-Z]{1,2}\d{1,4}[A-Z]{1,3})$")
# A field is an ICAO/IATA code — KSEA, KPAE, EGSU — or a named place.
ICAO = re.compile(r"^[A-Z]{3,4}$")


def jpeg_size(fh):
    fh.seek(2)
    while True:
        marker = fh.read(2)
        if len(marker) < 2 or marker[0] != 0xFF:
            return None
        code = marker[1]
        (length,) = struct.unpack(">H", fh.read(2))
        # Start-of-frame markers carry the dimensions.
        if code in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
                    0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
            fh.read(1)
            height, width = struct.unpack(">HH", fh.read(4))
            return width, height
        fh.seek(length - 2, os.SEEK_CUR)


def png_size(fh):
    fh.seek(16)
    return struct.unpack(">II", fh.read(8))


def webp_size(fh):
    fh.seek(12)
    chunk = fh.read(4)
    if chunk == b"VP8X":
        fh.seek(24)
        raw = fh.read(6)
        return ((raw[0] | raw[1] << 8 | raw[2] << 16) + 1,
                (raw[3] | raw[4] << 8 | raw[5] << 16) + 1)
    if chunk == b"VP8L":
        fh.seek(21)
        bits = struct.unpack("<I", fh.read(4))[0]
        return (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1
    if chunk == b"VP8 ":
        fh.seek(26)
        width, height = struct.unpack("<HH", fh.read(4))
        return width & 0x3FFF, height & 0x3FFF
    return None


def dimensions(path):
    """Return (width, height), or a 3:2 guess if the header can't be read."""
    try:
        with open(path, "rb") as fh:
            head = fh.read(4)
            if head[:2] == b"\xff\xd8":
                return jpeg_size(fh) or (2400, 1600)
            if head == b"\x89PNG":
                return png_size(fh)
            if head == b"RIFF":
                return webp_size(fh) or (2400, 1600)
    except Exception as err:
        print(f"  could not read size of {os.path.basename(path)}: {err}")
    return (2400, 1600)


def sort_key(filename):
    match = re.match(r"^\s*(\d+)\s*-\s*", filename)
    return (0, int(match.group(1)), filename) if match else (1, 0, filename.lower())


def parse(filename):
    """Pull the strip fields out of the filename. Missing fields come back ''."""
    stem = os.path.splitext(filename)[0]
    parts = [p.strip() for p in stem.split(" - ") if p.strip()]

    # Drop the leading order number; it's positional only.
    if parts and re.fullmatch(r"\d+", parts[0]):
        parts.pop(0)

    reg = ""
    if parts and REGISTRATION.match(parts[0]):
        reg = parts.pop(0)

    field = ""
    if len(parts) > 1 and (ICAO.match(parts[-1]) or len(parts) > 2):
        field = parts.pop()

    typ = parts.pop(0) if parts else ""
    operator = " - ".join(parts) if parts else ""

    return {"reg": reg, "type": typ, "op": operator, "field": field}


def read_collection(slug):
    folder = os.path.join(IMAGES, slug)
    if not os.path.isdir(folder):
        print(f"  images/{slug}/ not found — skipping")
        return []
    names = [n for n in os.listdir(folder)
             if n.lower().endswith(EXTENSIONS) and not n.startswith(".")]
    photos = []
    for name in sorted(names, key=sort_key):
        width, height = dimensions(os.path.join(folder, name))
        entry = parse(name)
        entry["s"] = f"images/{slug}/{name}"
        entry["w"] = width
        entry["h"] = height
        # Numbers under 50 are Everett's own frames; 50 and up are the
        # stand-ins waiting to be replaced. The front page shows only his.
        order = re.match(r"^\s*(\d+)", name)
        entry["own"] = bool(order) and int(order.group(1)) < 50
        photos.append(entry)
    return photos


def main():
    if not os.path.isdir(IMAGES):
        print(f"No images folder at {IMAGES}")
        return 1

    lines = [
        "// Generated by tools/index-photos.py — do not edit by hand.",
        "// Add or rename files in images/<collection>/ and run the script again.",
        "window.LOG = {",
        "  order: " + json.dumps([slug for slug, _, _ in COLLECTIONS]) + ",",
        "  collections: {",
    ]

    total = 0
    for slug, name, blurb in COLLECTIONS:
        photos = read_collection(slug)
        total += len(photos)
        print(f"  {name}: {len(photos)} photographs")
        lines.append(f"    {json.dumps(slug)}: {{")
        lines.append(f"      name: {json.dumps(name)},")
        lines.append(f"      blurb: {json.dumps(blurb)},")
        lines.append("      photos: [")
        for p in photos:
            lines.append(
                "        { "
                + ", ".join(f"{k}: {json.dumps(p[k])}" for k in
                            ("reg", "type", "op", "field", "s"))
                + f', w: {p["w"]}, h: {p["h"]}'
                + (", own: true" if p["own"] else "")
                + " },"
            )
        lines.append("      ]")
        lines.append("    },")

    lines += ["  }", "};", ""]

    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    with open(OUTPUT, "w") as fh:
        fh.write("\n".join(lines))

    print(f"\nWrote {total} photographs to assets/photos.js")
    return 0


if __name__ == "__main__":
    sys.exit(main())
