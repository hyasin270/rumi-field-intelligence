// core.js (film2 kit, v2-kit): FILM.shot, the clock, timing rows, easing, seeded noise, the page contract.
// A shot is a function of time: setup(k) once, then every frame is drawn from t alone (API.md section 1).
(function () {
  "use strict";
  const T = THREE;
  const q = new URLSearchParams(location.search);
  // ?timing=<bare file name> (ruling 138 b, 140 c as amended 122100; v2-shots-b 121738): every read of ../timing.json,
  // the kit's own fetch below and any XHR a shot or lib makes, goes to that file. Default unchanged.
  const TFILE = (q.get("timing") || "timing.json").replace(/^.*\//, "");
  const _open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, u, ...a) { if (typeof u === "string" && /(^|\/)timing\.json$/.test(u)) u = u.replace(/timing\.json$/, TFILE); return _open.call(this, m, u, ...a); };
  const W = 1920, H = 1080;
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const E = {
    lin: (x) => x, out: (x) => 1 - Math.pow(1 - x, 3), in: (x) => x * x * x,
    io: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    outExpo: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)), sine: (x) => 0.5 - 0.5 * Math.cos(Math.PI * x),
    back: (x) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); },
    spring: (x) => 1 - Math.exp(-6.5 * x) * Math.cos(11 * x),
    hold: (x) => (x >= 1 ? 1 : 0),
  };
  const ease = (e) => (typeof e === "function" ? e : E[e || "io"] || E.io);
  function tw(t, t0, t1, e) { return ease(e)(clamp01((t - t0) / Math.max(1e-6, t1 - t0))); }
  const lerp = (a, b, u) => a + (b - a) * u;
  // a hashed 0..1 value for (i, salt): deterministic variety (never Math.random)
  function noise(i, salt) { const x = Math.sin((i + 1) * 127.1 + (salt || 0) * 311.7 + 74.7) * 43758.5453; return x - Math.floor(x); }
  function halton(i, b) { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; }
  const V = (x, y, z) => (Array.isArray(x) ? new T.Vector3(x[0], x[1], x[2]) : x && x.isVector3 ? x.clone() : new T.Vector3(x, y, z));

  const FILM = (window.FILM = { W, H, E, tw, lerp, clamp01, noise, halton, V, ease, _def: null, _cues: [], _evals: [], _post: [] });
  FILM.shot = function (def) { FILM._def = def; };

  // ---------------------------------------------------------------- timing.json (v2-cut owns it; read only)
  let TIMING = null;
  async function loadTiming() {
    if (location.protocol !== "file:" && !window.__VFS) { try { const r = await fetch("../" + TFILE); if (r.ok) TIMING = await r.json(); } catch (e) { TIMING = null; } }
    if (!TIMING) { try { const x = new XMLHttpRequest(); x.open("GET", "../" + TFILE, false); x.send(); if (x.responseText) TIMING = JSON.parse(x.responseText); } catch (e) { TIMING = null; } }
    FILM.timing = TIMING;
  }
  // film2-timing/1 (v2-cut, film2/tools/TIMING.md): shots[] and rows[] in film seconds
  const shotOf = (id) => TIMING && (TIMING.shots || []).find((x) => x.id === id);
  const rowsOfShot = (id) => (TIMING ? (TIMING.rows || []).filter((r) => r.shot === id) : []);
  const rowById = (id) => TIMING && (TIMING.rows || []).find((r) => r.id === id || r.id === String(id).replace("-", "."));
  // v2-screens' load order: _lib/fonts.css, _lib/screens.css, _lib/sdk.js, then per screen uses.js, its helpers, screen.js
  const js = (src) => new Promise((res) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => { console.error("missing " + src); res(); }; document.head.appendChild(s); });
  const css = (href) => new Promise((res) => { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; l.onload = res; l.onerror = res; document.head.appendChild(l); });
  async function loadScreens(ids) {
    const B = "../screens/";
    await css(B + "_lib/fonts.css"); await css(B + "_lib/screens.css"); await js(B + "_lib/sdk.js");
    window.SCREEN.uses = window.SCREEN.uses || {};
    const done = new Set();
    for (const id of ids) {
      await js(B + id + "/uses.js");
      for (const h of window.SCREEN.uses[id] || []) if (!done.has(h)) { done.add(h); await js(B + h); }
      await js(B + id + "/screen.js");
    }
  }
  // ---------------------------------------------------------------- the boot
  FILM.boot = async function () {
    const id = q.get("shot") || "_blank";
    const quality = q.get("q") || "draft";
    await loadTiming();
    for (const f of ["400 40px 'Poppins'", "500 40px 'Poppins'", "600 40px 'Poppins'", "700 40px 'Poppins'", "500 40px 'Fredoka'", "600 40px 'Fredoka'", "700 40px 'Fredoka'"]) await document.fonts.load(f); await document.fonts.ready;
    // the shot file
    await new Promise((res, rej) => { const s = document.createElement("script"); s.src = `../shots/${id}/shot.js`; s.onload = res; s.onerror = () => rej(new Error("no shot file for " + id)); document.head.appendChild(s); })
      .catch((e) => { console.error(String(e)); FILM.shot({ id, type: "N", dur: 1000, setup() {} }); });
    const def = FILM._def;
    if (def.screens && def.screens.length) await loadScreens(def.screens);
    const R = KIT.render.init(document.getElementById("c"), quality);
    const myShot = shotOf(def.row || def.id);
    const h0 = (def.handles && def.handles[0]) || 0, h1 = (def.handles && def.handles[1]) || 0;
    let rowStart = 0, dur = typeof def.dur === "function" ? null : def.dur || 5000;
    if (myShot) { rowStart = myShot.start * 1000 - h0; dur = myShot.dur * 1000 + h0 + h1; }
    // a row id (1A3.1) or a shot id (1A3: from its first row's start to its last row's end), in shot-local ms
    function span(id) {
      const r = rowById(id); if (r) return { start: r.start * 1000 - rowStart, end: r.end * 1000 - rowStart, row: r };
      const rs = rowsOfShot(id); if (rs.length) return { start: rs[0].start * 1000 - rowStart, end: rs[rs.length - 1].end * 1000 - rowStart, rows: rs };
      return null;
    }
    // the context handed to the shot
    const k = {
      T, W, H, E, tw, lerp, clamp01, noise, halton, V, quality, id: def.id, type: def.type || "S",
      scene: R.scene, renderer: R.renderer,
      get dur() { return FILM.dur; },
      row(rid) {
        const sp = span(rid || def.row || def.id);
        if (!sp) return rid == null || rid === (def.row || def.id) ? { start: 0, end: FILM.dur, dur: FILM.dur } : null;
        return { start: sp.start, end: sp.end, dur: sp.end - sp.start };
      },
      // the time a word is spoken (real narration only; null on an estimate)
      word(rid, w) {
        const r = rowById(rid); const rs = r ? [r] : rowsOfShot(rid);
        const want = String(w).toLowerCase().replace(/[^\w']/g, "");
        for (const x of rs) for (const y of x.words || []) if (String(y.w || y.word || "").toLowerCase().replace(/[^\w']/g, "") === want) return y.start * 1000 - rowStart;
        return null;
      },
      cue(t, name, o) { FILM._cues.push(Object.assign({ t: Math.round(t), name }, o || {})); },
      // register anything with eval(t): evaluated every frame in the order added
      // tracks run in phases: actors and the crowd (0) before props and parts (1), so a prop can follow a posed hand
      track(obj, o) { obj._phase = o && o.phase != null ? o.phase : obj.kind === "agent" || obj.kind === "person" || obj.segs ? 0 : 1; FILM._evals.push(obj); FILM._sorted = false; return obj; },
      // a per-frame function, after the tracks (for custom parts); MUST be pure in t
      each(fn) { FILM._evals.push({ eval: fn, _phase: 2 }); FILM._sorted = false; },
    };
    FILM.k = k;
    k.cam = KIT.camera.make(k);
    k.set = KIT.set.make(k);
    k.agent = (o) => KIT.actors.agent(k, o);
    k.person = (o) => KIT.actors.person(k, o);
    k.crowd = (n, o) => KIT.crowd.make(k, n, o);
    k.ui = KIT.layer.make(k);
    k.screen = (sid, o) => KIT.screens.mount(k, sid, o);
    k.fx = KIT.layer.fxMark;
    k.people = (n, o) => (KIT.people ? KIT.people(k, n, o) : (console.error("k.people: parts_b.js has not defined KIT.people yet"), null));
    // freeze: inside [t0, t1] every track sees t0, except those listed (and the camera unless camera:true). After t1 the
    // tracks see real time again, so declare nothing that should continue smoothly across the window.
    const freezes = [];
    // v0.9.0 (v2-visuals 081602, VL 15.89): k.breathe() gives every agent and person in the shot a continuous breath while
    // they stand (a held act, a pose, idle), so no held room frame repeats for 2 s. Off unless the shot calls it (or the page
    // has breathe=1), so signed frames do not change. o: { amp (agent squash, default 0.02), period ms (default 2600) }
    k._breath = q.get("breathe") === "1" ? { amp: 0.02, period: 2600 } : null;
    k.breathe = (o) => { k._breath = Object.assign({ amp: 0.02, period: 2600 }, o || {}); return k; };
    k.freeze = (t0, t1, o) => { freezes.push({ t0, t1, except: new Set((o && o.except) || []), camera: !!(o && o.camera) }); return k; };
    k._timeFor = (obj, t) => { for (const f of freezes) if (t > f.t0 && t < f.t1 && !f.except.has(obj)) return f.t0; return t; };
    k._camTime = (t) => { for (const f of freezes) if (f.camera && t > f.t0 && t < f.t1) return f.t0; return t; };
    // grade: a page-coloured veil over the picture with a soft hole round each excepted actor (the T3a freeze)
    const grades = [];
    k.grade = (t0, dur, o) => { grades.push({ t0, dur, dim: (o && o.dim) != null ? o.dim : 0.6, except: (o && o.except) || [], t1: o && o.t1, out: (o && o.out) || 400 }); return k; };
    FILM._post.unshift((t) => KIT.render.veil(t, grades));
    // light presets (VL 3: a shot never changes the light): a no-op unless CAMERA_RULES.allowLight is true
    k.light = (t0, dur, o) => { KIT.render.lightKey(t0, dur, o || {}); return k; };
    FILM.dur = dur;
    if (typeof def.dur === "function") FILM.dur = def.dur(k);
    const state = def.setup ? def.setup(k) || {} : {};
    FILM.state = state;
    FILM.draw = function (ms) {
      const t = ms;
      if (!FILM._sorted) { FILM._evals = FILM._evals.map((o, i) => [o, i]).sort((a, b) => (a[0]._phase || 0) - (b[0]._phase || 0) || a[1] - b[1]).map((x) => x[0]); FILM._sorted = true; }
      for (const o of FILM._evals) o.eval(k._timeFor(o, t));
      if (def.render) def.render(t, state, k);
      KIT.render.evalLight(t);
      const pose = k.cam.eval(k._camTime(t));
      KIT.render.draw(pose, t);
      for (const fn of FILM._post) fn(t);       // the 2D layers that project world points use the camera at rest
      return true;
    };
    FILM.cues = () => FILM._cues.slice().sort((a, b) => a.t - b.t);
    FILM.lint = (ms) => KIT.camera.lintAt(k, ms);
    FILM.info = () => ({ id: def.id, type: def.type, dur: FILM.dur, quality, timing: TIMING ? TIMING.version : null, row: !!myShot, K: KIT.render.state.K });
    // textures (the mark) and fonts before the first frame
    await KIT.render.ready();
    await document.fonts.ready;
    FILM.ready = true;
    if (q.get("t") !== null) { FILM.draw(+q.get("t")); document.title = "ready"; }
    else document.title = "ready";
  };
  FILM.whenReady = () => new Promise((r) => { const w = () => (FILM.ready === true ? r(true) : setTimeout(w, 30)); w(); });
  window.KIT = window.KIT || {};
  // VL 14.6: one scale for every shot. An agent (hero or crowd) and a person never change size; shots cannot override.
  // v0.3 default: the crowd's 0.78 m for every agent (so a hand-over is seamless) and a person at 0.78 / 0.57 = 1.37 m.
  KIT.SCALE = { agent: 0.78, person: 1.37 };
})();
