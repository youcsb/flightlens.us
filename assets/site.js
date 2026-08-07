/* ==========================================================================
   Everett Altmann — plane spotting

   Four jobs:
     1. Build the masthead, menu and footer once, so every page stays in sync.
     2. Build strips — the flight-progress-strip caption that carries the
        registration, type, operator and field for every photograph.
     3. Hang photographs in justified rows: each plate's flex-grow is set to
        its aspect ratio, so a row lands on one height with no cropping.
     4. Run the lightbox.
   ========================================================================== */

(function () {
  "use strict";

  var LOG = window.LOG;
  if (!LOG) return;

  var TYPES = window.TYPES || {};
  var NOTES = window.NOTES || {};

  var page = document.body.dataset.page || "";
  var reduceMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function rooms() {
    return LOG.order.map(function (slug) {
      var c = LOG.collections[slug];
      return {
        slug: slug,
        href: slug + ".html",
        name: c.name,
        blurb: c.blurb,
        count: c.photos.length,
        cover: c.photos[0]
      };
    });
  }

  /* Every photograph Everett took himself, in collection order. */
  function ownPhotos() {
    var picks = [];
    LOG.order.forEach(function (slug) {
      var c = LOG.collections[slug];
      c.photos.forEach(function (p) {
        if (p.own) picks.push(Object.assign({ from: c.name }, p));
      });
    });
    return picks;
  }

  /* ------------------------------------------------------------------------
     The type write-up

     Exact match first. Otherwise the longest key that starts the same way, so
     "737-900ER" inherits "737-900" and "A330-343" inherits "A330". A type
     nobody has described yet simply shows nothing.
     ------------------------------------------------------------------------ */

  function describe(type) {
    if (!type) return "";
    if (TYPES[type]) return TYPES[type];
    var best = "";
    Object.keys(TYPES).forEach(function (key) {
      if (type.indexOf(key) === 0 && key.length > best.length) best = key;
    });
    return best ? TYPES[best] : "";
  }

  /* ------------------------------------------------------------------------
     The strip

     Only the fields that exist get a column, so a photograph with no
     registration is one column shorter and still looks finished.
     ------------------------------------------------------------------------ */

  function buildStrip(photo) {
    var strip = el("div", "strip");
    strip.appendChild(el("span", "strip-tab"));

    function cell(text, className) {
      strip.appendChild(el("span", "strip-cell" + (className ? " " + className : ""), text));
    }

    if (photo.reg) cell(photo.reg, "strip-reg");
    if (photo.type) cell(photo.type);
    if (photo.op) cell(photo.op, "strip-op");
    if (photo.field) cell(photo.field, "strip-field");

    return strip;
  }

  function readStrip(photo) {
    return [photo.reg, photo.type, photo.op, photo.field]
      .filter(Boolean).join(", ");
  }

  /* ------------------------------------------------------------------------
     Masthead, menu, footer
     ------------------------------------------------------------------------ */

  function buildChrome() {
    var list = rooms();

    /* The flight simulator. It is a separate app on its own origin — a
       ~100 MB WebGL build with its own terrain data — so it is linked rather
       than embedded, but it appears in the nav as a collection would. */
    var SIM_URL = "https://youcsb.github.io/flightlens-sim/";

    var bar = el("header", "masthead");
    bar.setAttribute("data-solid", page === "home" ? "false" : "true");

    var mark = el("a", "wordmark");
    mark.href = "index.html";
    mark.innerHTML = 'Everett Altmann <em>Sea-Tac</em>';
    bar.appendChild(mark);

    var nav = el("nav", "nav");
    nav.setAttribute("aria-label", "Collections");

    list.forEach(function (item) {
      var link = el("a", null, item.name);
      link.href = item.href;
      if (page === item.slug) link.setAttribute("aria-current", "page");
      nav.appendChild(link);
    });

    [["Flight Sim", SIM_URL, "sim"], ["About", "about.html", "about"]].forEach(function (t) {
      var link = el("a", null, t[0]);
      link.href = t[1];
      if (page === t[2]) link.setAttribute("aria-current", "page");
      nav.appendChild(link);
    });

    bar.appendChild(nav);

    var toggle = el("button", "menu-toggle", "Menu");
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    bar.appendChild(toggle);

    /* Full-screen menu for small screens */
    var menu = el("div", "menu");
    menu.setAttribute("data-open", "false");
    menu.setAttribute("aria-hidden", "true");

    var close = el("button", "menu-close", "Close");
    close.type = "button";
    menu.appendChild(close);

    list.forEach(function (item) {
      var link = el("a", "menu-link");
      link.href = item.href;
      if (page === item.slug) link.setAttribute("aria-current", "page");
      link.appendChild(el("span", null, item.name));
      link.appendChild(el("em", null, String(item.count)));
      menu.appendChild(link);
    });

    var foot = el("div", "menu-foot");
    [["Flight Sim", SIM_URL], ["About", "about.html"], ["Credits", "credits.html"]].forEach(function (t) {
      var link = el("a", null, t[0]);
      link.href = t[1];
      foot.appendChild(link);
    });
    menu.appendChild(foot);

    function setMenu(open) {
      menu.setAttribute("data-open", String(open));
      menu.setAttribute("aria-hidden", String(!open));
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("is-locked", open);
      if (open) menu.querySelector(".menu-link").focus();
      else toggle.focus();
    }

    toggle.addEventListener("click", function () { setMenu(true); });
    close.addEventListener("click", function () { setMenu(false); });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.dataset.open === "true") setMenu(false);
    });

    document.body.insertBefore(menu, document.body.firstChild);
    document.body.insertBefore(bar, document.body.firstChild);

    /* The bar is bare against the sky at the very top, and takes a background
       the moment anything scrolls under it — the headline sits high in the
       hero, so waiting any longer lets the two collide. */
    if (page === "home") {
      var onScroll = function () {
        bar.setAttribute("data-solid", String(window.scrollY > 24));
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  function buildFooter() {
    var host = document.querySelector("[data-footer]");
    if (!host) return;

    var foot = el("footer", "site-foot wrap");
    var total = LOG.order.reduce(function (n, slug) {
      return n + LOG.collections[slug].photos.length;
    }, 0);

    foot.appendChild(el("span", "mono", "Everett Altmann"));
    foot.appendChild(el("span", "mono", "Seattle–Tacoma International"));
    foot.appendChild(el("span", "mono", total + " photographs"));

    var credits = el("a", "mono", "Credits");
    credits.href = "credits.html";
    foot.appendChild(credits);

    foot.appendChild(el("span", "mono spacer", "© " + new Date().getFullYear()));
    host.replaceWith(foot);
  }

  /* ------------------------------------------------------------------------
     The hang

     Photographs group into rows until their aspect ratios add up to about
     TARGET. Inside a row, flex-grow: <aspect> makes each width proportional to
     its shape, which lands every image on one height.
     ------------------------------------------------------------------------ */

  var TARGET = 2.7;
  var MAX_PER_ROW = 3;

  function makeRows(photos) {
    var rows = [];
    var current = [];
    var sum = 0;

    photos.forEach(function (photo) {
      var aspect = photo.w / photo.h;

      // A panorama earns the row to itself — hanging one beside a normal
      // frame squashes both.
      if (current.length === 0 && aspect >= 2.2) {
        rows.push([photo]);
        return;
      }

      current.push(photo);
      sum += aspect;

      // A portrait beside two wide frames ends up a sliver. Cap the row at two
      // once there's an upright in it.
      var hasPortrait = current.some(function (p) { return p.w / p.h < 0.9; });
      var limit = hasPortrait ? 2 : MAX_PER_ROW;

      if (sum >= TARGET || current.length >= limit) {
        rows.push(current);
        current = [];
        sum = 0;
      }
    });

    if (current.length) rows.push(current);
    return rows;
  }

  function makePlate(photo, index, onOpen) {
    var plate = el("figure", "plate");
    plate.style.flexGrow = String(photo.w / photo.h);
    plate.dataset.seen = reduceMotion ? "true" : "false";

    var frame = el("button", "plate-frame");
    frame.type = "button";
    frame.setAttribute("aria-label", "View " + readStrip(photo) + " full screen");

    var img = new Image();
    img.src = photo.s;
    img.alt = readStrip(photo);
    img.width = photo.w;
    img.height = photo.h;
    img.loading = "lazy";
    img.decoding = "async";
    frame.appendChild(img);
    frame.addEventListener("click", function () { onOpen(index); });

    plate.appendChild(frame);
    plate.appendChild(buildStrip(photo));
    return plate;
  }

  function renderHang(host, photos, onOpen) {
    var index = 0;
    makeRows(photos).forEach(function (row) {
      var node = el("div", "hang-row");
      if (row.length === 1) node.dataset.solo = "true";
      row.forEach(function (photo) {
        node.appendChild(makePlate(photo, index++, onOpen));
      });
      host.appendChild(node);
    });
    watchPlates(host);
  }

  function watchPlates(host) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      host.querySelectorAll(".plate").forEach(function (p) {
        p.dataset.seen = "true";
      });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.dataset.seen = "true";
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.03 });

    host.querySelectorAll(".plate").forEach(function (plate) {
      observer.observe(plate);
    });
  }

  /* ------------------------------------------------------------------------
     Lightbox
     ------------------------------------------------------------------------ */

  function createLightbox() {
    var photos = [];
    var at = 0;
    var lastFocus = null;

    var box = el("div", "lightbox");
    box.setAttribute("data-open", "false");
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Photograph");

    var bar = el("div", "lightbox-bar");
    var close = el("button", "lightbox-close", "Close");
    close.type = "button";
    bar.appendChild(close);

    var stage = el("div", "lightbox-stage");
    var img = new Image();
    img.alt = "";
    stage.appendChild(img);

    var prev = el("button", "lightbox-nav");
    prev.type = "button";
    prev.dataset.dir = "prev";
    prev.setAttribute("aria-label", "Previous photograph");

    var next = el("button", "lightbox-nav");
    next.type = "button";
    next.dataset.dir = "next";
    next.setAttribute("aria-label", "Next photograph");

    stage.appendChild(prev);
    stage.appendChild(next);

    var foot = el("div", "lightbox-foot");
    var stripHost = el("div");
    var note = el("p", "lightbox-note");
    var count = el("span", "lightbox-count");
    foot.appendChild(stripHost);
    foot.appendChild(note);
    foot.appendChild(count);

    box.appendChild(bar);
    box.appendChild(stage);
    box.appendChild(foot);
    document.body.appendChild(box);

    function show(i) {
      at = (i + photos.length) % photos.length;
      var photo = photos[at];

      img.style.opacity = "0";
      var loader = new Image();
      loader.onload = function () {
        img.src = photo.s;
        img.alt = readStrip(photo);
        img.style.opacity = "1";
      };
      loader.src = photo.s;

      stripHost.replaceChildren(buildStrip(photo));

      // The note about this exact frame wins; otherwise say what the type is.
      note.textContent = NOTES[photo.s] || describe(photo.type);
      count.textContent = (at + 1) + " / " + photos.length;

      // Warm the neighbours so arrowing through feels instant.
      [at + 1, at - 1].forEach(function (n) {
        var neighbour = photos[(n + photos.length) % photos.length];
        if (neighbour) new Image().src = neighbour.s;
      });
    }

    function open(list, i) {
      photos = list;
      lastFocus = document.activeElement;
      box.setAttribute("data-open", "true");
      document.body.classList.add("is-locked");
      show(i);
      close.focus();
    }

    function shut() {
      box.setAttribute("data-open", "false");
      document.body.classList.remove("is-locked");
      if (lastFocus) lastFocus.focus();
    }

    close.addEventListener("click", shut);
    prev.addEventListener("click", function () { show(at - 1); });
    next.addEventListener("click", function () { show(at + 1); });

    document.addEventListener("keydown", function (event) {
      if (box.dataset.open !== "true") return;
      if (event.key === "Escape") shut();
      if (event.key === "ArrowLeft") show(at - 1);
      if (event.key === "ArrowRight") show(at + 1);
      if (event.key === "Tab") {
        // Keep focus inside the dialog.
        event.preventDefault();
        var stops = [close, prev, next];
        var i = stops.indexOf(document.activeElement);
        stops[(i + (event.shiftKey ? -1 : 1) + stops.length) % stops.length].focus();
      }
    });

    return { open: open };
  }

  /* ------------------------------------------------------------------------
     The bay — collections racked like strips waiting to be worked
     ------------------------------------------------------------------------ */

  function renderBay(host) {
    var bay = el("div", "bay");

    rooms().forEach(function (item) {
      var strip = el("a", "bay-strip");
      strip.href = item.href;

      strip.appendChild(el("span", "strip-tab"));

      var thumb = new Image();
      thumb.className = "bay-thumb";
      thumb.src = item.cover.s;
      thumb.alt = "";
      thumb.loading = "lazy";
      strip.appendChild(thumb);

      var text = el("div", "bay-text");
      text.appendChild(el("span", "bay-name", item.name));
      text.appendChild(el("span", "bay-blurb", item.blurb));
      strip.appendChild(text);

      strip.appendChild(el("span", "mono bay-count",
        item.count + (item.count === 1 ? " frame" : " frames")));

      bay.appendChild(strip);
    });

    host.appendChild(bay);
  }

  /* ------------------------------------------------------------------------
     Wire up whichever page we're on
     ------------------------------------------------------------------------ */

  buildChrome();
  buildFooter();

  var lightbox = createLightbox();

  var bayHost = document.querySelector("[data-bay]");
  if (bayHost) {
    renderBay(bayHost);
    var bayCount = document.querySelector("[data-bay-count]");
    if (bayCount) {
      var n = LOG.order.length;
      bayCount.textContent = n + (n === 1 ? " collection" : " collections");
    }
  }

  /* Home page: Everett's own frames, across every collection. */
  var ownHost = document.querySelector("[data-own]");
  if (ownHost) {
    var mine = ownPhotos();
    renderHang(ownHost, mine, function (i) { lightbox.open(mine, i); });

    var ownCount = document.querySelector("[data-own-count]");
    if (ownCount) {
      ownCount.textContent = mine.length + " frames, all mine";
    }
  }

  /* Gallery pages */
  var galleryHost = document.querySelector("[data-gallery]");
  if (galleryHost) {
    var slug = galleryHost.dataset.gallery;
    var collection = LOG.collections[slug];
    if (collection) {
      renderHang(galleryHost, collection.photos, function (i) {
        lightbox.open(collection.photos, i);
      });

      var title = document.querySelector("[data-room-title]");
      if (title) title.textContent = collection.name;

      var blurb = document.querySelector("[data-blurb]");
      if (blurb) blurb.textContent = collection.blurb;

      var count = document.querySelector("[data-count]");
      if (count) {
        count.textContent = collection.photos.length + " photographs";
      }

      var onward = document.querySelector("[data-onward]");
      if (onward) {
        var order = LOG.order;
        var nextSlug = order[(order.indexOf(slug) + 1) % order.length];
        var link = el("a");
        link.href = nextSlug + ".html";
        link.appendChild(el("span", "mono", "Next collection"));
        link.appendChild(el("span", "onward-name",
          LOG.collections[nextSlug].name));
        onward.appendChild(link);
      }
    }
  }
})();
