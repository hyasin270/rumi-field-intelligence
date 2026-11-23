/* film2/screens/_lib/sdk.js · v2-screens (Opus, rumi7), 2026-11-11.
   The screen side of the kit's mount contract (film2/kit/API.md section 8):
     SCREEN.define({ id, dur, events, build(root, opt), render(root, t, ev, opt) })
   build() runs once and makes every element; render() runs per frame and MUST set every
   moving property from t alone (no state kept between frames, no CSS transitions or animations,
   no Math.random, no Date). A frame at time t is always the same frame.
   Load order on any page: _lib/fonts.css, _lib/screens.css, _lib/sdk.js, then the product
   helpers a screen needs (_lib/slack.js, _lib/notion.js ...), then screens/<id>/screen.js. */
(function () {
  const S = (window.SCREEN = window.SCREEN || {});
  S.defs = S.defs || {};
  if (!S.define) S.define = (d) => { S.defs[d.id] = d; return d; };

  // Where _lib lives, so screens can reference the mark and shared images by URL.
  const me = document.currentScript && document.currentScript.src;
  const BASE = me ? me.replace(/sdk\.js(\?.*)?$/, "") : "";

  const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
  const E = {
    lin: (u) => u,
    io: (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2),
    out: (u) => 1 - Math.pow(1 - u, 3),
    in: (u) => u * u * u,
    outExpo: (u) => (u >= 1 ? 1 : 1 - Math.pow(2, -10 * u)),
    sine: (u) => -(Math.cos(Math.PI * u) - 1) / 2,
    back: (u) => { const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); },
    // a soft settle with one small overshoot; reaches 1 and stays
    spring: (u) => (u >= 1 ? 1 : 1 - Math.exp(-6.5 * u) * Math.cos(9.5 * u)),
  };
  const tw = (t, t0, dur, ease) => (E[ease || "io"] || E.io)(clamp01((t - t0) / Math.max(1, dur)));
  const lerp = (a, b, u) => a + (b - a) * u;
  // hashed 0..1, deterministic
  const noise = (i, salt) => { let h = (i * 374761393 + (salt || 0) * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; h = h ^ (h >>> 16); return ((h >>> 0) % 100000) / 100000; };

  // Typing with a human rhythm: per-character gaps vary by a hashed amount, longer after spaces
  // and punctuation. Returns how many characters are shown at t. cps = average characters a second.
  const typeTimes = (text, cps, salt) => {
    const out = []; let acc = 0; const base = 1000 / (cps || 16);
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      let g = base * (0.55 + 0.9 * noise(i, salt || 7));
      if (c === " ") g *= 1.25; if (/[.,?!:]/.test(c)) g *= 2.2;
      acc += g; out.push(acc);
    }
    return out;
  };
  const typed = (text, t, t0, cps, salt) => {
    if (t < t0) return 0; const tt = typeTimes(text, cps, salt); let n = 0;
    while (n < tt.length && tt[n] <= t - t0) n++; return n;
  };
  const typeDur = (text, cps, salt) => { const tt = typeTimes(text, cps, salt); return tt.length ? tt[tt.length - 1] : 0; };

  // A message or block arriving: fade, rise and a short settle. u in 0..1.
  const arrive = (el, t, t0, o) => {
    o = o || {}; const dur = o.dur || 420, dy = o.dy == null ? 26 : o.dy, sc = o.scale == null ? 0.985 : o.scale;
    const u = clamp01((t - t0) / dur), e = (E[o.ease] || E.out)(u); // o.ease: opt-in (judge-note sine); default cubic out, unchanged
    el.style.opacity = t < t0 ? 0 : e;
    el.style.transform = `translateY(${(1 - e) * dy}px) scale(${lerp(sc, 1, e)})`;
    return u;
  };
  const vis = (el, on) => { el.style.visibility = on ? "inherit" : "hidden"; };
  const op = (el, v) => { el.style.opacity = v; };

  // Cursor: a list of keys [{t, x, y}] with eased travel between them; returns the position at t.
  const path = (keys, t, ease) => {
    if (t <= keys[0].t) return keys[0];
    for (let i = 1; i < keys.length; i++) if (t <= keys[i].t) {
      const a = keys[i - 1], b = keys[i], u = (E[ease || "io"])(clamp01((t - a.t) / (b.t - a.t)));
      return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u) };
    }
    return keys[keys.length - 1];
  };
  // Place the shared cursor element (made by S.lib.cursorEl) and its press/ring.
  const cursorAt = (cur, keys, t, clicks, o) => {
    o = o || {};
    const on = t >= (o.show == null ? keys[0].t : o.show) && (o.hide == null || t < o.hide);
    const fadeIn = o.show == null ? 1 : clamp01((t - o.show) / 250);
    const fadeOut = o.hide == null ? 1 : 1 - clamp01((t - (o.hide - 250)) / 250);
    const p = path(keys, t);
    cur.style.opacity = on ? Math.min(fadeIn, fadeOut) : 0;
    let press = 1;
    (clicks || []).forEach((c) => { const d = t - c; if (d >= 0 && d < 260) press = Math.min(press, 1 - 0.18 * Math.sin((d / 260) * Math.PI)); });
    cur.style.transform = `translate(${p.x}px, ${p.y}px) scale(${press})`;
    return p;
  };
  // A click ring that grows and fades at each click time, at point p.
  const ringAt = (ring, t, tc, p) => {
    const d = t - tc, u = clamp01(d / 380);
    if (d < 0 || d > 380) { ring.style.opacity = 0; return; }
    ring.style.opacity = 0.9 * (1 - u);
    ring.style.transform = `translate(${p.x}px, ${p.y}px) scale(${0.4 + 1.2 * E.out(u)})`;
  };
  // The one highlight (VISUAL_LANGUAGE_v2 9.5): put el over box {x,y,w,h} from t0 to t1, 300 ms in, 250 ms out.
  const hl = (el, box, t, t0, t1) => {
    if (!box || t < t0 || (t1 != null && t >= t1)) { el.style.opacity = 0; return; }
    const a = Math.min(clamp01((t - t0) / 300), t1 == null ? 1 : clamp01((t1 - t) / 250));
    Object.assign(el.style, { left: box.x + "px", top: box.y + "px", width: box.w + "px", height: box.h + "px", opacity: a });
  };
  // An element's box in root pixels (works when the kit scales the root).
  const boxOf = (root, e, pad) => { pad = pad || 0; const rr = root.getBoundingClientRect(), sc = rr.width / 1920, b = e.getBoundingClientRect();
    return { x: (b.left - rr.left) / sc - pad, y: (b.top - rr.top) / sc - pad, w: b.width / sc + 2 * pad, h: b.height / sc + 2 * pad }; };
  const el = (tag, cls, html, parent) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; };
  const cursorEl = (root) => el("div", "s-cursor", null, root);
  const ringEl = (root) => el("div", "s-ring", null, root);
  const mark = (cls) => `<img class="${cls || "s-mark"}" src="${BASE}rumi-mark.png" alt="">`;
  // Avatar: the Rumi mark on white, or role initials on a role colour (roles, never names).
  const ROLE = {
    "Product manager": ["PM", "#2E5E8C"], "Assessment specialist": ["AS", "#6B4C9A"], "Programme lead": ["PL", "#2F7D5B"],
    "Content lead": ["CL", "#A3532C"], "Field coach lead": ["FC", "#8C6A1F"], "Designer": ["DE", "#9A3D6B"],
    "Data lead": ["DL", "#2C6E7F"], "Engineer": ["EN", "#4A5560"], "Teacher": ["T", "#2F7D5B"], "Loan officer": ["LO", "#2E5E8C"],
    "Field assistant": ["FA", "#8C6A1F"], "Lesson plans lead": ["LP", "#A3532C"],
  };
  const avatar = (who, cls) => who === "Rumi"
    ? `<div class="s-av s-av-rumi ${cls || ""}">${mark("s-av-mark")}</div>`
    : `<div class="s-av ${cls || ""}" style="background:${(ROLE[who] || ["?", "#555"])[1]}">${(ROLE[who] || [who.slice(0, 2).toUpperCase()])[0]}</div>`;
  // A clock face whose hands sweep from h0 to h1 (hours) over [t0, t0+dur].
  const clockSVG = () => `<svg viewBox="0 0 100 100" class="s-clock"><circle cx="50" cy="50" r="44" fill="#fff" stroke="currentColor" stroke-width="7"/><line class="hh" x1="50" y1="50" x2="50" y2="27" stroke="currentColor" stroke-width="8" stroke-linecap="round"/><line class="mh" x1="50" y1="50" x2="50" y2="16" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="50" r="5" fill="currentColor"/></svg>`;
  const clockAt = (svgRoot, t, t0, dur, h0, h1) => {
    const u = E.io(clamp01((t - t0) / dur)), h = lerp(h0, h1, u);
    const hh = svgRoot.querySelector(".hh"), mh = svgRoot.querySelector(".mh");
    hh.setAttribute("transform", `rotate(${(h % 12) * 30} 50 50)`);
    mh.setAttribute("transform", `rotate(${(h * 360) % 360} 50 50)`);
  };
  const hhmm = (h) => { const H = Math.floor(h), M = Math.floor((h - H) * 60); return `${String(H).padStart(2, "0")}:${String(M).padStart(2, "0")}`; };
  // Merge defaults with a shot's overrides.
  const evMerge = (def, over) => Object.assign({}, def || {}, over || {});

  S.lib = { hl, boxOf, BASE, E, clamp01, tw, lerp, noise, typed, typeDur, arrive, vis, op, path, cursorAt, ringAt, el, cursorEl, ringEl, mark, avatar, ROLE, clockSVG, clockAt, hhmm, evMerge };

  // Mount helper used by preview.html and, if it wants it, by the kit's screens.js.
  S.mount = (id, root, opt) => {
    const d = S.defs[id]; if (!d) throw new Error("no screen " + id);
    opt = opt || {}; root.classList.add("scr", "scr-" + id);
    d.build(root, opt);
    const ev = evMerge(d.events, opt.events);
    // A shot may pass its own length (opt.dur); screens read it as this.dur, so a slow push runs to the shot's end.
    const dur = opt.dur || d.dur, self = Object.assign(Object.create(d), { dur });
    return { def: d, dur, ev, draw: (t) => d.render.call(self, root, t, ev, opt) };
  };
})();
