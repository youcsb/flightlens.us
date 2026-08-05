/* ==========================================================================
   What each airplane is.

   Keyed by the TYPE you put in the filename. When a photograph's type isn't
   listed here exactly, the site falls back to the longest key that starts the
   same way — so "737-900ER" picks up the "737-900" note, and "A330-343" picks
   up "A330". Add a type here once and every photograph of it gets the write-up,
   including the ones you haven't taken yet.
   ========================================================================== */

window.TYPES = {

  /* Widebodies -------------------------------------------------------- */

  "A350-900":
    "Carbon-fiber widebody, and the easiest one to spot: curved wingtips that " +
    "sweep up like a blade, and a black mask painted around the cockpit " +
    "windows. Delta flies them out of Sea-Tac on the long Europe runs.",

  "A330-300":
    "The stretched A330. Same wing as the shorter one with a lot more fuselage " +
    "behind it, which makes it look low and flat coming down the taxiway.",

  "A330-200":
    "The short A330. Same wing, less body, so the tail looks oversized for it. " +
    "Hawaiian runs them out to the islands.",

  "A330":
    "Airbus's first big twin and still everywhere. To tell it from a 767: " +
    "bigger wing, flat wingtip fences, and the main gear sits further back.",

  "787-9":
    "The Dreamliner. Carbon-fiber wings that bend a long way up on the climb, " +
    "and the sawtooth edge on the back of the engine nacelles is what makes it " +
    "so much quieter than anything its size.",

  "777-200ER":
    "Extended-range 777. The engines are close to the diameter of a 737 " +
    "fuselage, and the six wheels on each main gear give it away every time.",

  "777-200":
    "The original 777 — six wheels per main gear, long clean wings, no " +
    "winglets. The airplane Boeing built the modern widebody around.",

  /* Narrowbodies ------------------------------------------------------ */

  "737":
    "The most common airliner in the sky, and most of what moves through " +
    "Sea-Tac on any given day.",

  "737-800":
    "The one Alaska flies more than anything else. Blended winglets, long thin " +
    "body, and the flattened bottom on the engine cowls that every 737 has.",

  "737-900":
    "A stretched -800. Same wing and engines, more rows behind them.",

  "737 MAX 8":
    "Newest 737. The split-tip winglet — pointing up and down at once — is the " +
    "quickest tell, and the engines sit further forward and higher on the wing.",

  "757-200":
    "Long wing, tall gear, and far more engine than the airframe really needs, " +
    "so it climbs away steeper than anything else that size. Ask any spotter " +
    "for a favorite and this is usually the answer.",

  "A320-200":
    "Airbus's answer to the 737. Rounder nose, wingtip fences instead of " +
    "winglets, and a much smoother join where the wing meets the body.",

  /* Regional ---------------------------------------------------------- */

  "E175":
    "Embraer's regional jet. The wing sits low with the engines hung under it, " +
    "which is the fast way to tell it from a CRJ.",

  "CRJ900":
    "Engines mounted on the tail, wing low and completely clean. A stretched " +
    "version of the CRJ, and a tight squeeze inside.",

  "Dash 8 Q400":
    "A turboprop quick enough to keep up with the jets on short runs. Tall " +
    "gear, high wing, and six-blade props you hear well before you see it. " +
    "Horizon flies them all over the Northwest.",

  /* Freight ----------------------------------------------------------- */

  "747-400 Dreamlifter":
    "A 747 rebuilt with a swollen fuselage to fly 787 sections into Paine " +
    "Field. The entire tail swings open sideways to load. Boeing only ever " +
    "built four of them.",

  "767-300F":
    "Freighter 767 — no cabin windows down the side, and a large cargo door " +
    "ahead of the wing. FedEx and UPS move most of theirs overnight.",

  "747-400F":
    "Freighter 747. The nose hinges straight up so cargo can load through the " +
    "front, which is why the flight deck sits on the upper deck at all.",

  "747-400ERF":
    "Extended-range freighter 747 — more fuel and a heavier takeoff weight " +
    "than the standard freighter.",

  /* Military ---------------------------------------------------------- */

  "FA-18 Super Hornet":
    "What the Blue Angels fly now. Rectangular intakes, tails canted outward, " +
    "and the strakes ahead of the wing pull vapor off the air in a hard turn.",

  "C-17 Globemaster III":
    "Four-engine airlifter with a huge T-tail and winglets. It can put itself " +
    "into a short dirt strip and reverse back out again under its own power.",

  "KC-135 Stratotanker":
    "The Air Force's tanker, built off the same design that became the 707. " +
    "The boom operator lies down in the tail to fly the boom into the receiver.",

  "F-15C Eagle":
    "Air-superiority fighter — twin tails and an enormous wing for its weight, " +
    "which is why it can turn and climb the way it does.",

  "F-15EX Eagle II":
    "The newest Eagle. Same shape the Air Force has flown since the seventies, " +
    "with current radar, systems, and a lot more it can carry.",

  "F-15E Strike Eagle":
    "Two-seat Eagle built to hit ground targets as well as fight in the air. " +
    "Darker paint, and conformal fuel tanks molded along the intakes.",

  /* Vintage ----------------------------------------------------------- */

  "B-17G Flying Fortress":
    "Second World War heavy bomber. Four radial engines, a chin turret under " +
    "the nose, and a sound you feel in your chest before you hear it.",

  "P-51 Mustang":
    "Long-range escort fighter with a Merlin engine up front and a radiator " +
    "scoop under the belly. Nothing on a warbird ramp looks faster standing " +
    "still.",

  "DC-3":
    "The airplane that made airlines into a business anyone could use. " +
    "Tailwheel, two radials, and plenty of them still flying after ninety " +
    "years.",

  "DC-6A":
    "Four-engine piston airliner, and pressurized, so it could fly above the " +
    "weather. The last generation before jets took the work away.",
};
