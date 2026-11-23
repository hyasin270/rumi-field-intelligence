// shots/_d/lib.js · v2-shots-d shared parts for stage 4 (4.0 to 4C2), built on KIT.parts.
// Local parts asked of v2-kit on the board (20261111T072636_v2-shots-d_question.md); replaced by kit calls as they land.
// Loaded by each shot.js with a synchronous read. Everything is a pure function of t (declared tracks, no state between frames).
(function () {
  "use strict";
  const { T, mat, rbox, add } = KIT.parts;
  const tw = FILM.tw, clamp01 = FILM.clamp01, lerp = FILM.lerp, noise = FILM.noise;
  const D = (window.SD = {});
  const V3 = (p) => (Array.isArray(p) ? new T.Vector3(p[0], p[1], p[2]) : p.clone());
  D.V3 = V3;

  // ------------------------------------------------------------ the film's shared world (141605 item 3: joins with 3C2 and stage 3)
  // Stages 1 to 3 build the building and the 300 with v2-shots-b's S1 (in shots/1.0/shot.js), read here the way v2-shots-c's lib does.
  if (!window.S1) {
    const get = (u) => { const x = new XMLHttpRequest(); x.open("GET", u, false); x.send(); return x.status === 200 || x.status === 0 ? x.responseText : null; };
    const s0 = get("../shots/1.0/shot.js") || "", i0 = s0.indexOf("var S1 = (function"), j0 = s0.indexOf("\n})();", i0);
    if (i0 < 0 || j0 < 0) throw new Error("v2-shots-d: S1 helpers not found in shots/1.0/shot.js");
    (0, eval)(s0.slice(i0, j0 + 6).replace(/^var S1 =/m, "window.S1 ="));
  }
  const S1 = window.S1; D.S1 = S1;
  // VL 15.76 (the map and the ring) and the 300 ms ease of the question list: the kit's shot-side snippets, loaded once
  if (!window.locator) { const x = new XMLHttpRequest(); x.open("GET", "snippets/locator.js", false); x.send(); (0, eval)(x.responseText + ";window.locator=locator;window.roomRing=roomRing;"); }
  if (!window.questionsEase) { const x = new XMLHttpRequest(); x.open("GET", "snippets/questions_ease.js", false); x.send(); (0, eval)(x.responseText + ";window.questionsEase=questionsEase;"); }
  // the building as stage 3 leaves it: four rooms fitted, the doors always shown, the job board as 1C5 left it (as v2-shots-c's C.world)
  // o.judge: install time for B3 west (null: bare; -1e9: fitted before the shot)
  D.world = function (k, o) {
    if (k.breathe) k.breathe();   /* VL 15.89 b (v2-visuals 082838): every render breathes, kit defaults */
    o = o || {}; const fitted = { board: -1e9, skills: -1e9, gates: -1e9, store: -1e9 };
    if (o.judge != null) fitted.judge = o.judge;
    const W = S1.world(k, fitted); if (S1.doorsAlways) S1.doorsAlways(k, W); W.fittedMap = fitted;
    const board = W.parts.board;
    if (board && board.claim) { for (let i = 0; i < 28; i++) if (![3, 9, 20, 26, 27].includes(i)) board.claim(i, -1e9); board.claim(20, -1e9, { tag: "agent 58" }); }
    return W;
  };
  // the 300 as stage 3 leaves them (S1.crowd). o.clear: S1's boxes (a member whose cell is in a box walks out at from / is out);
  // o.override(i, t): a place that wins over S1's (the judge's lanes); o.fitted adds to W.fittedMap
  D.crowd1 = function (k, W, o) {
    o = o || {}; const C = S1.crowd(k, W, { fitted: Object.assign({}, W.fittedMap, o.fitted || {}), clear: o.clear || [], avoid: o.avoid || [] });
    if (o.override) { const base = C.at; C.at = (i, t) => o.override(i, t) || base(i, t); }
    return C;
  };

  // a word time, or the fallback (estimated rows carry no words)
  D.w = (k, row, word, fb) => { const v = k.word(row, word); return v == null ? fb : v; };
  // a row's start / end (shot-local ms), or the fallback
  // the shot-local ms at which a row's name ends (timing.json name_end), for the name card and its chime (v2-voice 074901)
  let TJ = null; const tj = () => { if (!TJ) { const x = new XMLHttpRequest(); x.open("GET", "../" + (((typeof location !== "undefined" && new URLSearchParams(location.search).get("timing")) || "timing.json").replace(/^.*\//, "")), false);   /* ruling 140 (c): the page parameter timing (bare file name), default timing.json, as _e/lib.js:41 */ x.send(); TJ = JSON.parse(x.responseText); } return TJ; };
  D.nameEnd = (k, row, fb) => { try { const J = tj(), r = J.rows.find((q) => q.id === row), sh = r && J.shots.find((q) => q.id === r.shot);
      if (r && sh && r.name_end != null) return (r.name_end - sh.start) * 1000 + 50; if (r && sh && r.words && r.words.length) return (r.words[r.words.length - 1].end - sh.start) * 1000 + 50; } catch (e) {} return fb; };
  // the two-floor frame for 4A: the pavilion desk above and the B1 east desk below in one picture (v2-lead 074643 item 3)
  D.TF = { look: [1.75, -1.0, -2.5], dist: 14, yaw: -12, pitch: -6, size: "room" };
  D.PP = [2.25, 0, -2.35];   // the person in the two-floor frame: in front of the east desk, three-quarter to us
  // ruling 168 (iv): the fast film's card time: up to 0.3 s before the name's first word (name_end now holds its start), never before
  // the previous word ends; ms in shot time
  D.nameLead = (k, row, fb) => { try { const J = tj(), r = J.rows.find((q) => q.id === row), sh = r && J.shots.find((q) => q.id === r.shot);
      if (!r || !sh || r.name_end == null) return fb; const i = r.words.findIndex((w) => Math.abs(w.start - r.name_end) < 0.02);
      const prevEnd = i > 0 ? r.words[i - 1].end : r.name_end - 0.3; return (Math.max(r.name_end - 0.3, prevEnd) - sh.start) * 1000; } catch (e) { return fb; } };
  D.r = (k, row, fb) => { const r = k.row(row); return r && r.dur > 0 && r.dur < k.dur + 1 ? r : fb; };

  // ------------------------------------------------------------ places (from set.js / proto world.js)
  // pavilion east desk (x 2.9, z -3.4, top y 0.78); B1 east desk (room x 3.05, desk at local -1.4 → x 1.65, z -3.0, y -3.2)
  D.P = {
    pavDesk: [2.9, 0.8, -3.4], pavPerson: [2.9, 0, -4.25], mountain: [4.0, 0, -3.3],
    slotG: [1.0, 0, -0.32],                     // VL 1.9: the east column of slots, 1.0 m from the partition, cut at the front edge
    b1Desk: [1.65, -3.2 + 0.8, -3.0], b1Agent: [0.75, -3.2, -2.75], b1Folder: [2.1, -3.2 + 0.79, -3.05],
    judge: [-5.35, -9.6, -2.45],
    hatch: [-0.25, -9.6 + 1.0, -2.6],            // in the partition (x ~ -0.2) between B3 west and B3 east
    wayOut: [-5.75, -9.6 + 1.0, -2.6],           // the opening in the west side wall of B3 west
    core: [0, -4.8, -0.3],                       // the model, set in the B2 partition wall
  };

  // ------------------------------------------------------------ a track helper: k.track with a pure eval
  D.track = (k, fn) => k.track({ eval: fn });
  D.WR = { look: [-3.6, -3.4, -2.2], dist: 63, yaw: -14, pitch: -12, size: "wide" };

  // ------------------------------------------------------------ a page: a white sheet with grey (or navy) text bars
  // flights: [{t0, dur, from, to, arc, spin, ease}] in order; visible from `show` (default: first flight t0) to `hide`.
  D.page = function (k, o) {
    o = o || {}; const g = new T.Group(); k.scene.add(g);
    const sheet = add(g, rbox(0.34, 0.012, 0.46, mat("card"), 0.01, 0.004), 0, 0, 0);
    const bars = []; const ink = o.ink || "grey";
    for (let i = 0; i < (o.lines || 6); i++) { const b = add(g, rbox(i % 3 === 2 ? 0.16 : 0.24, 0.006, 0.026, mat(ink), 0.004, 0.002), -0.02 + (i % 3 === 2 ? -0.04 : 0), 0.009, -0.17 + i * 0.065); bars.push(b); }
    const P = { g, sheet, bars, flights: [], s: o.scale || 1, marks: [] };
    if (o.red) { P.redSheet = add(g, rbox(0.345, 0.014, 0.465, mat("refusal", { color: 0xC8372D, roughness: 0.6 }), 0.01, 0.004), 0, 0.002, 0); P.redSheet.material = P.redSheet.material.clone(); P.redSheet.material.transparent = true; P.redSheet.material.needsUpdate = true; }   // pre-read 2320: transparent from the start, or the fade never shows
    if (o.strip) { P.strip = add(g, rbox(0.3, 0.014, 0.05, mat("coral"), 0.008, 0.004), 0, 0.012, 0.2); }
    // ruling 92: the maker's name is one short tab at the page's top corner, a quarter of its width; o.tabOff hides it (it is seen to leave)
    if (o.tab) { P.tab = add(g, rbox(0.08, 0.014, 0.06, mat("coral"), 0.008, 0.004), 0.12, 0.012, -0.2); }
    if (o.mark) { P.markBar = add(g, rbox(0.2, 0.01, 0.03, mat("navy"), 0.006, 0.003), 0.02, 0.012, 0.05); P.markBar.rotation.y = 0.25; }
    P.fly = (t0, dur, from, to, op) => { P.flights.push(Object.assign({ t0, dur, from: V3(from), to: V3(to), arc: 0.6, spin: 0, ease: "io" }, op || {})); P.flights.sort((a, b) => a.t0 - b.t0); return P; };
    P.at = (t0, p) => P.fly(t0, 0, p, p);
    // P.hold(t0, t1, actor, local): from t0 to t1 the page rides in the actor's hands (pre-read 1634: never a page with no hand under it).
    // Agents and people are evaluated before these tracks, so the hand point is this frame's. local: a point in the actor's own frame
    // (agent default [0, 0.4, 0.42], the kit's carry point a little lower, under the visor; person default [0, 0.95, 0.35])
    P.holds = []; P.hold = (t0, t1, actor, local, tilt, ease, release) => { P.holds.push({ t0, t1, actor, tilt: tilt || 0, ease: ease || 0, release: release || null, local: local || (actor.kind === "person" ? [0, 0.95, 0.35] : [0, 0.4, 0.42]) }); return P; };   // release [dur, to]: from t1 the page leaves from the hand's own place to `to` (no jump)   // ease: ms to blend from where the page was into the hand (no jump)   // tilt: radians about x, -1.4 stands the page up to the lens
    P.writeLines = (t0, dur) => { P.write = { t0, dur }; return P; };
    D.track(k, (t) => {
      const show = o.show != null ? o.show : P.flights.length ? P.flights[0].t0 : 0, hide = o.hide != null ? o.hide : Infinity;
      g.visible = t >= show && t < hide;
      if (!g.visible) return;
      let p = P.flights.length ? P.flights[0].from.clone() : V3(o.at || [0, 0, 0]), rx = 0, ry = o.yaw || 0;
      for (const f of P.flights) { if (t < f.t0) break; const u = f.dur ? tw(t, f.t0, f.t0 + f.dur, f.ease) : 1; p = f.from.clone().lerp(f.to, u); p.y += f.arc * Math.sin(Math.PI * u); rx = f.spin * Math.sin(Math.PI * u); ry = (o.yaw || 0) + f.spin * 0.5 * u; }
      // pre-read 0020: a hold's point may be "R" or "L", the actor's own hand as posed, so a page rides a reaching hand
      const holdAt = (h) => { const r = h.actor.spr || h.actor.root; r.updateMatrixWorld(true); const L = h.local;
        if (typeof L === "string") return h.actor.hand(L);
        if (Array.isArray(L) && typeof L[0] === "string") { const q = h.actor.hand(L[0]), o = L[1], c = Math.cos(r.rotation.y), s = Math.sin(r.rotation.y); return q.add(V3([o[0] * c + o[2] * s, o[1], -o[0] * s + o[2] * c])); }
        return r.localToWorld(V3(L)); };
      for (const h of P.holds) if (h.release && t >= h.t1 && t < h.t1 + h.release[0]) { const r = h.actor.spr || h.actor.root; const q = holdAt(h); p = q.lerp(V3(h.release[1]), tw(t, h.t1, h.t1 + h.release[0], "lin")); rx = 0; ry = r.rotation.y; }
      // pre-read 2345: a hold that eases in straight after another hold starts from that hold's place and tilt, never from the page's rest
      for (const h of P.holds) if (t >= h.t0 && t < h.t1) { const r = h.actor.spr || h.actor.root; const q = holdAt(h), u = h.ease ? tw(t, h.t0, h.t0 + h.ease, "io") : 1;
        if (h.ease && u < 1) { const g0 = P.holds.find((x) => x !== h && Math.abs(x.t1 - h.t0) < 1); if (g0) { const r0 = g0.actor.spr || g0.actor.root; p = holdAt(g0); rx = g0.tilt; ry = r0.rotation.y; } }
        p = p.clone().lerp(q, u); rx = rx + (h.tilt - rx) * u; ry = ry + (r.rotation.y - ry) * u; }
      g.position.copy(p); g.rotation.set(rx, ry, 0); g.scale.setScalar(Math.max(0.01, (o.grow ? P.s * tw(t, show, show + 300, "out") : P.s) * (o.shrink ? 1 - tw(t, o.shrink[0], o.shrink[0] + o.shrink[1], "lin") : 1)));   // o.grow: it appears over 300 ms, never in one frame
      if (P.write) bars.forEach((b, i) => (b.visible = t >= P.write.t0 + (i / bars.length) * P.write.dur));
      if (P.strip) P.strip.visible = o.stripOff == null || t < o.stripOff;
      if (P.tab) P.tab.visible = o.tabOff == null || t < o.tabOff;
      if (P.redSheet) { const rv = tw(t, o.red[0], o.red[0] + 450, "lin") * (1 - tw(t, o.red[1] - 700, o.red[1], "lin")); P.redSheet.material.transparent = true; P.redSheet.material.opacity = rv; P.redSheet.visible = rv > 0.01; }
    });
    return P;
  };

  // ------------------------------------------------------------ the mountain of finished pages: a leaning stack that grows
  D.mountain = function (k, at, o) {
    o = o || {}; const g = new T.Group(); k.scene.add(g); g.position.copy(V3(at));
    const N = o.n || 46, sheets = [];
    for (let i = 0; i < N; i++) { const s = add(g, rbox(0.62, 0.05, 0.84, mat(i % 4 === 1 ? "paper" : "card"), 0.02, 0.01), (noise(i, 71) - 0.5) * 0.12, 0.025 + i * 0.052, (noise(i, 72) - 0.5) * 0.1); s.rotation.y = (noise(i, 73) - 0.5) * 0.35; sheets.push(s); }
    const M = { g, sheets, top: (t) => new T.Vector3(at[0], at[1] + 0.05 + 0.052 * M.count(t), at[2]) };
    // grow: count of sheets visible over [t0, t0+dur], from c0 to c1
    const grows = (o.grows || [{ t0: -1e9, dur: 0, c0: N, c1: N }]);
    M.count = (t) => { let c = grows[0].c0; for (const gr of grows) if (t >= gr.t0) c = Math.round(lerp(gr.c0, gr.c1, gr.dur ? tw(t, gr.t0, gr.t0 + gr.dur, "lin") : 1)); return c; };
    D.track(k, (t) => { const c = M.count(t); sheets.forEach((s, i) => { s.visible = i < c; }); });
    return M;
  };

  // ------------------------------------------------------------ a lit slot in a slab (pages pass through it)
  D.slot = function (k, at, o) {
    o = o || {}; const g = new T.Group(); k.scene.add(g); g.position.copy(V3(at));
    const glow = add(g, rbox(1.2, 0.34, 0.25, new T.MeshBasicMaterial({ color: 0xfff1d6, toneMapped: false }), 0.03, 0.01), 0, -0.15, 0);
    return { g, glow };
  };
  // v2-visuals 120529 item 3: the pavilion's glass side walls threw a clipped white lamp highlight on the floor side of 4B1/4B2;
  // in our shots the glass is matte (no highlight), same colour and opacity
  D.matteGlass = (k) => k.scene.traverse((m) => { const M = m.material; if (M && M.transparent && M.opacity === 0.2 && M.roughness === 0.15) { M.roughness = 0.95; M.metalness = 0; M.needsUpdate = true; } });
  // VL 15.56: in W-list the left column keeps "beads" and "hooks" (as v2-shots-c's C.docksWest, same points and x, so the cut from
  // 3C2 is clean), and "evals" from the last W-list frame of stage 4. o.evals: the time "evals" docks at x 290 (null: not yet)
  D.docksWest = (k, t0, t1, o) => { o = o || {};
    const out = [k.ui.dock(t0, { text: "beads", at: V3([-6.1, -1.6, -0.3]), side: "west", x: 290, t1 }), k.ui.dock(t0, { text: "hooks", at: V3([-6.1, -4.8, -0.3]), side: "west", x: 290, t1 })];
    if (o.evals != null) out.push(k.ui.dock(o.evals, { text: "evals", at: V3(o.evalsAt || [-6.1, -8.0, -0.3]), side: "west", x: 290, t1 }));
    return out; };
  // all six slots (VL 1.9): x +-1.0 in the ground slab and the two floor slabs
  D.slots = (k) => [0, -3.2, -6.4].forEach((y) => [-1, 1].forEach((sd) => D.slot(k, [sd * 1.0, y, -0.32])));

  // ------------------------------------------------------------ the skill folder (v2-shots-b's 1B3 object), local until the kit's
  // thick: [{t0, dur, to}] thickness in metres; pulses: [t0]; opens: [{t0, dur}] (the cover lifts a crack); at: flights like a page
  D.folder = function (k, o) {
    o = o || {}; const g = new T.Group(); k.scene.add(g);
    const body = add(g, rbox(0.46, 1, 0.34, mat("paper"), 0.02, 0.01), 0, 0.5, 0);
    const cover = add(g, rbox(0.47, 0.018, 0.35, mat("green", { roughness: 0.6 }), 0.01, 0.005), 0, 1, 0);   // VL 15.41: green cover
    const spine = add(g, rbox(0.03, 1, 0.34, mat("green", { roughness: 0.6 }), 0.01, 0.005), -0.235, 0.5, 0);
    const F = { g, thick: [], pulses: [], opens: [], flights: [] };
    F.thicken = (t0, dur, to) => { F.thick.push({ t0, dur, to }); return F; };
    F.pulse = (t0) => { F.pulses.push(t0); return F; };
    F.open = (t0, dur, op) => { F.opens.push(Object.assign({ t0, dur: dur || 900 }, op || {})); return F; };
    // pre-read 0502: how far open the cover is at t (0 to 1), so a hand can follow its free edge (S.reachUp op.track)
    F.openAt = (t) => { let op = o.ajar || 0; for (const s of F.opens) op = Math.max(op, s.hold ? tw(t, s.t0, s.t0 + (s.ramp || 600), "lin") * (1 - tw(t, s.t0 + s.dur - (s.ramp || 600), s.t0 + s.dur, "lin")) : Math.sin(Math.PI * clamp01((t - s.t0) / s.dur))); return op; };
    // o.hinge (4A2, ruling 76): the cover turns on its spine edge (local -x), so a hand can lift it; an open with {hold:true}
    // ramps in and out over 250 ms and stays open between; o.hingeAngle is the fully open angle in radians
    let piv = null; if (o.hinge) { piv = new T.Group(); g.add(piv); g.remove(cover); piv.add(cover); cover.position.set(0.235, 0, 0); piv.position.x = -0.235; }
    // release [dur, to] as P.hold: from t1 the book leaves from the hand's own place to `to`, turning to its own yaw (pre-read 2235)
    F.holds = []; F.hold = (t0, t1, actor, local, release) => { F.holds.push({ t0, t1, actor, release: release || null, local: local || (actor.kind === "person" ? [0, 0.95, 0.35] : [0, 0.4, 0.42]) }); return F; };   // as P.hold
    F.fly = (t0, dur, from, to, op) => { F.flights.push(Object.assign({ t0, dur, from: V3(from), to: V3(to), arc: 0.5, ease: "io" }, op || {})); F.flights.sort((a, b) => a.t0 - b.t0); return F; };
    F.thickAt = (t) => { let h = o.h || 0.04; for (const s of F.thick) if (t >= s.t0) h = lerp(h, s.to, tw(t, s.t0, s.t0 + s.dur, "out")); return h; };
    D.track(k, (t) => {
      const show = o.show != null ? o.show : -Infinity, hide = o.hide != null ? o.hide : Infinity; g.visible = t >= show && t < hide; if (!g.visible) return;
      let p = V3(o.at || [0, 0, 0]);
      for (const f of F.flights) { if (t < f.t0) break; const u = tw(t, f.t0, f.t0 + f.dur, f.ease); p = f.from.clone().lerp(f.to, u); p.y += f.arc * Math.sin(Math.PI * u); }
      let yawH = o.yaw || 0;
      for (const h of F.holds) if (h.release && t >= h.t1 && t < h.t1 + h.release[0]) { const r = h.actor.spr || h.actor.root; r.updateMatrixWorld(true); const u = tw(t, h.t1, h.t1 + h.release[0], "io"); p = r.localToWorld(V3(h.local)).lerp(V3(h.release[1]), u); yawH = r.rotation.y + ((o.yaw || 0) - r.rotation.y) * u; }
      for (const h of F.holds) if (t >= h.t0 && t < h.t1) { const r = h.actor.spr || h.actor.root; r.updateMatrixWorld(true); p = r.localToWorld(V3(h.local)); yawH = r.rotation.y; }
      g.position.copy(p); g.rotation.y = yawH;
      const h = F.thickAt(t); body.scale.y = h; body.position.y = h / 2; spine.scale.y = h; spine.position.y = h / 2; cover.position.y = h + 0.009;
      const op = F.openAt(t);
      if (piv) { piv.position.y = h + 0.009; piv.rotation.z = (o.hingeAngle || 0.45) * op; cover.position.set(0.235, 0, 0); }
      else { cover.rotation.z = -0.5 * op; cover.position.x = 0; }
      let sc = 1; for (const p0 of F.pulses) sc = Math.max(sc, 1 + 0.06 * Math.sin(Math.PI * clamp01((t - p0) / 380)));
      g.scale.setScalar((o.scale || 1) * sc);
    });
    return F;
  };

  // ------------------------------------------------------------ a mark that flies and becomes a line (navy correction, coral reason)
  D.mark = function (k, o) {
    const g = new T.Group(); k.scene.add(g); const m = add(g, rbox(0.22, 0.03, 0.04, mat(o.colour || "navy"), 0.01, 0.006), 0, 0, 0); m.scale.setScalar(o.scale || 1.7);
    const from = V3(o.from), to = V3(o.to);
    D.track(k, (t) => { const u = tw(t, o.t0, o.t0 + (o.dur || 700), "io"); g.visible = t >= o.t0 && u < 1; if (!g.visible) return;
      const p = from.clone().lerp(to, u); p.y += (o.arc != null ? o.arc : 0.4) * Math.sin(Math.PI * u); g.position.copy(p); g.rotation.set(0, 0, (1 - u) * 0.6); g.scale.set(1 - 0.4 * u, 1, 1); });
    return g;
  };

  // ------------------------------------------------------------ the crowd in the stage-4 state: fitted rooms stand in slots,
  // bare rooms mill. fitted(name, t) says whether a room is fitted at t. Each room takes members i with i % 6 == its index.
  const RO = ["board", "skills", "gates", "store", "judge", "teams"];
  D.crowd = function (k, W, C, o) {
    o = o || {}; const fittedAt = o.fittedAt || {}; const n = C.n;
    // o.areas {room: {x0, x1}} narrows a room for an S shot so the crowd keeps clear of the hero and the object (VL 5.3)
    const areas = RO.map((r) => { const a = W.area(r), ov = (o.areas || {})[r] || {}; return { x0: ov.x0 != null ? ov.x0 : a.x0 + 0.3, x1: ov.x1 != null ? ov.x1 : a.x1 - 0.3, z0: -3.3, z1: ov.z1 != null ? ov.z1 : a.z1, y: a.y, zMin: ov.x0 != null || ov.x1 != null || ov.z1 != null ? -5.5 : -99, still: !!ov.still }; });
    const extra = o.override || null;
    C.segs.push({ t0: -1e9, kind: "stage4", at(i, t) {
      if (extra) { const e = extra(i, t); if (e) return e; }
      const ri = i % 6, j = Math.floor(i / 6), fa = fittedAt[RO[ri]];
      // o.shift {room: {t0, dur, x0, x1}}: the room's area narrows over [t0, t0+dur], so its members walk clear (v2-visuals 141605 item 4)
      let A = areas[ri]; const sh = (o.shift || {})[RO[ri]]; if (sh) { const v = tw(t, sh.t0, sh.t0 + (sh.dur || 1), "io"); A = Object.assign({}, A, { x0: sh.x0 != null ? lerp(A.x0, sh.x0, v) : A.x0, x1: sh.x1 != null ? lerp(A.x1, sh.x1, v) : A.x1 }); }
      const fit = fa != null && t >= fa, u = fa != null ? tw(t, fa + 300 + noise(i, 9) * 600, fa + 1500 + noise(i, 9) * 600, "io") : 0;
      // the mill place
      const hx = FILM.halton(j + 1 + ri * 61, 2), hz = FILM.halton(j + 1 + ri * 61, 3), a = t / 1000;
      const w1 = 0.35 + 0.4 * noise(i, 11), w2 = 0.25 + 0.35 * noise(i, 12), p1 = 6.283 * noise(i, 13), p2 = 6.283 * noise(i, 14);
      const mx = lerp(A.x0, A.x1, hx) + 0.6 * Math.sin(w1 * a + p1), mz = lerp(Math.min(A.z0, A.z1 - 0.5), A.z1, hz) + 0.35 * Math.sin(w2 * a + p2);
      const myaw = Math.atan2(Math.cos(w1 * a + p1) * w1, 0.6 * Math.cos(w2 * a + p2) * w2);
      // the slot place: a staggered grid, front rows, facing the cut face
      const cols = Math.max(1, Math.floor((A.x1 - A.x0) / 0.62)), r = Math.floor(j / cols), c = j % cols;
      const sx = A.x0 + 0.31 + c * 0.62 + (r % 2) * 0.2, sz = A.z1 - 0.3 - r * 0.6, syaw = (noise(i, 42) - 0.5) * 0.4;
      const fu = fit ? u : 0;
      if (sz < A.zMin || mz < A.zMin) return { x: 0, y: -99, z: 0, yaw: 0, vis: false };
      const yy = lerp(myaw, syaw, fu), cf = D.CF || 0;   // TEMP pivot compensation (see D.CF)
      return { x: lerp(mx, sx, fu) - cf * Math.sin(yy), y: A.y + (1 - fu) * 0.04 * Math.abs(Math.sin(a * 6 + p1)), z: lerp(mz, sz, fu) - cf * Math.cos(yy), yaw: yy, vis: true, moving: fu < 1 };
    } });
    C.segs.sort((a, b) => a.t0 - b.t0);
    return C;
  };

  // ------------------------------------------------------------ the model: a small rounded block in the B2 partition (proposal)
  D.model = function (k, o) {
    o = o || {}; const g = new T.Group(); k.scene.add(g);
    const s = o.size || 1;
    const b = add(g, rbox(0.9 * s, 0.9 * s, 0.9 * s, mat("band", { roughness: 0.7 }), 0.2 * s, 0.1 * s), 0, 0, 0);   // VL 15.40: strap grey, no glow
    const M = { g, keys: [] };
    M.path = (keys) => { M.keys = keys.map((x) => Object.assign({}, x, { p: V3(x.p) })); return M; };   // [{t, p, ease}]
    D.track(k, (t) => {
      const ks = M.keys.length ? M.keys : [{ t: 0, p: V3(o.at || D.P.core) }];
      let p = ks[0].p.clone(); for (let i = 1; i < ks.length; i++) { if (t < ks[i - 1].t) break; p = ks[i - 1].p.clone().lerp(ks[i].p, tw(t, ks[i - 1].t, ks[i].t, ks[i].ease || "io")); }
      g.position.copy(p); g.visible = (o.show == null || t >= o.show) && (o.hide == null || t < o.hide);
      let sw = 1; for (const p0 of o.pulses || []) sw = Math.max(sw, 1 + 0.06 * Math.sin(Math.PI * clamp01((t - p0) / 600))); // v2-check 035159: o.shrink / o.grow = [t0, dur]: the block goes to nothing, or comes from nothing, in place (never through a floor)
      if (o.shrink) sw *= Math.max(0.001, 1 - tw(t, o.shrink[0], o.shrink[0] + o.shrink[1], "io"));
      if (o.grow) sw *= Math.max(0.001, tw(t, o.grow[0], o.grow[0] + o.grow[1], "io"));
      g.scale.setScalar(sw);
    });
    return M;
  };

  // the model's seat (VL 15.40): a flat slab-tone plate, 2.7 m square, on the partition behind the block
  D.seat = (k) => { const m = add(k.scene, rbox(2.75, 2.75, 0.06, mat("slab"), 0.08, 0.02), D.P.core[0], D.P.core[1], D.P.core[2] - 1.38); return m; };

  // ------------------------------------------------------------ the harness: one green bracket round the whole lower block
  // two square brackets [ ], drawn on from the top left round to the top right over dur
  D.bracket = function (k, o) {
    o = o || {}; const g = new T.Group(); k.scene.add(g);
    const x0 = -6.55, x1 = 6.55, y0 = -0.05, y1 = -10.05, z = 0.55, st = 0.9, th = 0.16, G = mat("green", { roughness: 0.6 });
    const segs = [
      { a: [x0 + st, y0], b: [x0, y0] }, { a: [x0, y0], b: [x0, y1] }, { a: [x0, y1], b: [x0 + st, y1] },
      { a: [x1 - st, y1], b: [x1, y1] }, { a: [x1, y1], b: [x1, y0] }, { a: [x1, y0], b: [x1 - st, y0] },
    ];
    const L = segs.map((s) => Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1])), tot = L.reduce((x, y) => x + y, 0);
    const meshes = segs.map(() => add(g, rbox(1, 1, th, G, 0.05, 0.03), 0, 0, z));
    D.track(k, (t) => {
      const u = o.t0 == null ? 1 : tw(t, o.t0, o.t0 + (o.dur || 900), "out"); let left = u * tot;
      let gl = 1; for (const p0 of o.pulses || []) gl = Math.max(gl, 1 + 0.35 * Math.sin(Math.PI * clamp01((t - p0) / 500)));
      segs.forEach((s, i) => { const f = clamp01(left / L[i]); left -= L[i]; const m = meshes[i]; m.visible = f > 0.001;
        const ax = s.a[0], ay = s.a[1], bx = lerp(ax, s.b[0], f), by = lerp(ay, s.b[1], f);
        m.position.set((ax + bx) / 2, (ay + by) / 2, z); m.scale.set(Math.max(th, Math.abs(bx - ax) + th), Math.max(th, Math.abs(by - ay) + th), 1);
        m.scale.z = gl; });
    });
    return { g, top: [x1 + 0.2, y0, z], side: [x1, -5, z] };
  };


  // ------------------------------------------------------------ B3 west fittings: the partition door and hatch, the way out and its bar
  // o: {installAt, doorCloseAt, hatchCloseAt, barAt, pass:[t], refuse:[t]}
  // B3 west after VL 15.20 (the booth turned a quarter): a 1.1 m wall from the back wall towards the cut face at x -4.2, stopping 0.6 m
  // short of it, seen end-on. West of it the judge at its desk (long side against the wall, under the hatch), turned 40 degrees to us.
  // East of it the room's 50 in lanes running east to west, turned 40 degrees to us, the head of the queue at the hatch. The maker's
  // coral strip comes off at the hatch and drops into a white tray on the maker's side. The bar on the back wall on the judge's side,
  // a warm slot above it: a pass goes over the bar into the slot, a fail stops under it. No black in the model (15.21).
  D.B3 = { wallX: -4.2, hatchZ: -1.45, judge: [-5.3, -9.6, -0.9], desk: [-4.6, -9.6, -1.45], deskTop: [-4.6, -9.6 + 0.37, -1.45],
    head: [-3.1, -9.6, -1.2], tray: [-3.7, -9.6 + 0.42, -0.62], bar: [-5.15, -9.6 + 0.9, -5.6], slotIn: [-5.15, -9.6 + 1.45, -5.85], under: [-5.15, -9.6 + 0.45, -5.4] };
  D.judgeRoom = function (k, o) {
    o = o || {}; const g = new T.Group(); k.scene.add(g); const y = -9.6, B = D.B3, X = B.wallX, hz = B.hatchZ;
    const W1 = mat("white"), warm = new T.MeshBasicMaterial({ color: 0xfff1d6, toneMapped: false });
    // the wall in three pieces around the hatch (z from -5.75 to -0.6); the hatch is 0.8 wide, 0.5 to 1.0 high
    const back = add(g, rbox(0.14, 1.1, 5.75 + hz - 0.4, W1, 0.05, 0.03), X, y + 0.55, (-5.75 + hz - 0.4) / 2);
    const front = add(g, rbox(0.14, 1.1, -0.6 - (hz + 0.4), W1, 0.05, 0.03), X, y + 0.55, (hz + 0.4 - 0.6) / 2);
    const sill = add(g, rbox(0.14, 0.5, 0.8, W1, 0.05, 0.03), X, y + 0.25, hz);
    const head = add(g, rbox(0.14, 0.1, 0.8, W1, 0.05, 0.03), X, y + 1.05, hz);
    const shutter = add(g, rbox(0.06, 0.48, 0.78, mat("paper"), 0.03, 0.02), X + 0.05, y + 0.76, hz);
    // the judge's desk against the wall under the hatch, long side along the wall
    const desk = new T.Group(); g.add(desk); desk.position.set(B.desk[0], y, B.desk[2]);
    add(desk, rbox(0.6, 0.06, 1.2, W1, 0.03, 0.02), 0, 0.33, 0); [[-0.24, -0.52], [0.24, -0.52], [-0.24, 0.52], [0.24, 0.52]].forEach(([x, z]) => add(desk, rbox(0.06, 0.32, 0.06, W1, 0.03, 0.01), x, 0.16, z));
    // the tray for the strips on the maker's side; strips pile in it
    const tray = new T.Group(); g.add(tray); tray.position.set(B.tray[0], y, B.tray[2]);
    add(tray, rbox(0.1, 0.38, 0.1, W1, 0.04, 0.02), 0, 0.19, 0); add(tray, rbox(0.42, 0.06, 0.5, W1, 0.03, 0.02), 0, 0.4, 0);
    const pile = []; for (let i = 0; i < 24; i++) { const m = add(tray, rbox(0.12, 0.014, 0.08, mat("coral"), 0.006, 0.003), -0.13 + (i % 3) * 0.13, 0.44 + Math.floor(i / 9) * 0.016, -0.16 + (Math.floor(i / 3) % 3) * 0.16); m.rotation.y = (noise(i, 83) - 0.5) * 0.3; pile.push(m); }
    // the way out on the back wall, judge's side: a white frame round a warm slot, and the green bar under it
    const frame = add(g, rbox(1.3, 0.3, 0.04, mat("slab"), 0.04, 0.02), B.slotIn[0], B.slotIn[1], -5.72);
    const glow = add(g, rbox(1.2, 0.2, 0.04, warm, 0.04, 0.01), B.slotIn[0], B.slotIn[1], -5.69);
    const bar = add(g, rbox(1.6, 0.14, 0.14, mat("green", { roughness: 0.6 }), 0.05, 0.03), B.bar[0], B.bar[1], -5.55);
    const barRed = add(g, rbox(1.62, 0.15, 0.15, mat("refusal", { color: 0xC8372D, roughness: 0.6 }), 0.05, 0.03), B.bar[0], B.bar[1], -5.55);
    // the partition hatch (things change side on a floor, VL 1.9): a white frame round a warm opening on the west face
    const pf = add(g, rbox(0.04, 0.68, 0.88, W1, 0.02, 0.01), -0.16, y + 0.9, -1.4); const pg2 = add(g, rbox(0.03, 0.5, 0.7, warm, 0.02, 0.01), -0.19, y + 0.9, -1.4);
    const parts = [back, front, sill, head, desk, tray, pf, pg2];
    parts.forEach((m) => (m.userData.y0 = m.position.y));
    const strips = o.strips || [];   // times a strip drops into the tray: the pile grows by one each time
    D.track(k, (t) => {
      const ins = o.installAt == null ? -1e9 : o.installAt, u = tw(t, ins, ins + 600, "out"), on = t >= ins;
      parts.forEach((m) => { m.visible = on; m.position.y = m.userData.y0 + (1 - u) * 2.6; });
      // the shutter: o.shutter = [[t, 1 (closed) | 0 (open)], ...]; default closed; each change takes 400 ms
      let sh = 1; for (const [tc, v] of o.shutter || []) { if (t < tc) break; const from = sh; sh = lerp(from, v, tw(t, tc, tc + 400, "out")); }
      shutter.visible = on && sh > 0.02; shutter.scale.y = Math.max(0.02, sh); shutter.position.y = y + 1.0 - 0.24 * sh;
      const n0 = o.pile0 == null ? 9 : o.pile0; let n = n0; for (const st of strips) if (t >= st + 300) n++; pile.forEach((m, i) => (m.visible = on && i < n));
      // pre-read 2345: the bar is drawn on in place over 700 ms, never whole in mid-air
      const ba = o.barAt == null ? Infinity : o.barAt, bu = isFinite(ba) ? tw(t, ba, ba + 900, "lin") : 1, over = 0.04 * Math.sin(Math.PI * clamp01((t - ba - 420) / 260));
      bar.visible = t >= ba; bar.position.y = B.bar[1]; frame.visible = glow.visible = false; frame.position.y = B.slotIn[1] + (1 - bu) * 2.6; glow.position.y = frame.position.y;   // v2-check b34: no blank card above the bar
      // red comes and goes over 300 ms, the green bar under it (pre-read 1634: no change of state in one frame)
      let off = 0, red = 0; for (const r of o.refuse || []) { off = Math.max(off, tw(t, r, r + 200, "io") * (1 - tw(t, r + 1100, r + 1300, "io"))); red = Math.max(red, tw(t, r + 200, r + 450, "io") * (1 - tw(t, r + 850, r + 1100, "io"))); }
      if (!bar.userData.g0) { bar.material = bar.material.clone(); bar.userData.g0 = bar.material.color.clone(); } bar.material.color.copy(bar.userData.g0).lerp(new T.Color(0xBDB6A8), off);
      barRed.material.transparent = true; barRed.material.opacity = red; barRed.visible = red > 0.01 && t >= ba;
      let gl = 1; for (const p0 of o.pass || []) gl = Math.max(gl, 1 + 0.4 * Math.sin(Math.PI * clamp01((t - p0) / 250))); bar.scale.set(Math.max(0.001, bu), gl, gl);
    });
    const pilePoint = (i) => [B.tray[0] - 0.13 + (i % 3) * 0.13, y + 0.44 + Math.floor(i / 9) * 0.016, B.tray[2] - 0.16 + (Math.floor(i / 3) % 3) * 0.16];
    return { g, shutter, bar, tray, pilePoint, hatch: [X, y + 0.8, hz], partHatch: [-0.3, y + 0.9, -1.4] };
  };

  // B3 west's 50 east of the wall, in lanes running east to west, turned 40 degrees to us (VL 15.20). Row 0 is the queue to the hatch;
  // rows in front of it start 0.9 m east of the wall so the head of the queue is never covered. Before t0 (the install) they mill.
  D.judgeLanes = (W, t0) => (i, t) => {
    if (i % 6 !== 4) return null; const j = Math.floor(i / 6), B = D.B3;
    const A = W.area("judge"), a = t / 1000, hx = FILM.halton(j + 1 + 4 * 61, 2), hz = FILM.halton(j + 1 + 4 * 61, 3);
    const p1 = 6.283 * noise(i, 13), p2 = 6.283 * noise(i, 14), w1 = 0.35 + 0.4 * noise(i, 11), w2 = 0.25 + 0.35 * noise(i, 12);
    const mx = lerp(A.x0 + 0.3, A.x1 - 0.3, hx) + 0.6 * Math.sin(w1 * a + p1), mz = lerp(-3.3, A.z1, hz) + 0.35 * Math.sin(w2 * a + p2);
    const myaw = Math.atan2(Math.cos(w1 * a + p1) * w1, 0.6 * Math.cos(w2 * a + p2) * w2);
    const r = Math.floor(j / 6), c = j % 6, sx = -3.45 + c * 0.75 + (r % 2) * 0.25, sz = B.head[2] - 2.2 - r * 0.62, syaw = -Math.PI / 2 + 0.7;
    if (sz < -5.5 || sx > -1.3) return { x: 0, y: -99, z: 0, yaw: 0, vis: false };
    const u = t0 == null ? 1 : tw(t, t0 + 300 + noise(i, 9) * 600, t0 + 1500 + noise(i, 9) * 600, "io");
    const br = 0;   // still (VL 15.25)
    // TEMP: the instanced crowd draws each member about D.CF m ahead of its place along its facing (seen in 4B3 at yaw -0.87);
    // compensate until v2-kit fixes the pivot (board 0845Z). Remove when the kit posts the fix.
    const cf = D.CF || 0; const cx = -cf * Math.sin(syaw), cz = -cf * Math.cos(syaw);
    return { x: lerp(mx, sx + cx, u), y: A.y, z: lerp(mz, sz + cz, u), yaw: u >= 1 ? syaw + br : myaw + (syaw - myaw) * u, vis: true, moving: u > 0 && u < 1, pin: u >= 1 };
  };
  // v2-visuals 145700 item 4 and 145800: the judge's room queues in ONE FILE along the room's front, its head at the booth hatch,
  // 0.62 m apart, nobody two abreast; the shot's own actor stands at the head (B.head). Members j < n stand in the file behind it,
  // the rest keep S1's places (clear the front and the judge's side with D.judgeClear). o.from: [t, dur] the file steps up one place
  // (the first member to the head); o.skip: how many leading places an actor holds instead (hidden members)
  D.judgeFile = (W, o) => { o = o || {}; const B = D.B3, n = o.n == null ? 2 : o.n, step = 0.8;   // 0.2 of a body or more apart on screen (pre-read 1634)
    return (i, t) => { if (i % 6 !== 4) return null; const j = Math.floor(i / 6); if (j >= n) return null;
      if (j < (o.skip || 0)) return { x: 0, y: -99, z: 0, yaw: 0, vis: false };
      let place = j + (o.atHead ? 0 : 1); let moving = false;   // o.atHead: no actor at the head, the file starts there
      if (o.from) { const u = tw(t, o.from[0] + j * 120, o.from[0] + j * 120 + o.from[1], "io"); place -= u; moving = u > 0 && u < 1; }
      return { x: B.head[0] + place * step, y: -9.6, z: B.head[2], yaw: -Math.PI / 2 + 0.6, vis: true, moving, pin: true };
    }; };
  D.judgeClear = [{ room: "judge", x0: -99, x1: 99 }];   // the judge's room holds the judge and the one file, nobody else (153507 item 4)
  // fade docked labels (the kit's dock() ends hard at t1) over [t1 - dur, t1]; runs after the layer's own update
  D.fadeDocks = (apis, t1, dur) => { dur = dur || 300; FILM._post.push((t) => { const f = 1 - tw(t, t1 - dur, t1); apis.forEach((a) => { if (!a) return; [a.el, a.line, a.dot].forEach((e) => { if (e) e.style.opacity = String((parseFloat(e.style.opacity || "1") || 0) * f); }); }); }); };
  D.CF = 0;   // v2-kit 093836: no pivot offset; the stray was the kit's hero-clear ring. Lanes are pinned instead.

  // the harness (VL 10.7): one green bracket, 4 px, on the page under the whole lower block, west edge to east edge, at y 960,
  // drawn from the centre outwards; "the harness" (44 px) centred under it. 2D, projected from the block's two bottom corners.
  D.harness = function (k, o) {
    o = o || {}; const ui = document.getElementById("ui");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("width", 1920); svg.setAttribute("height", 1080);
    svg.style.cssText = "position:absolute;left:0;top:0;pointer-events:none"; ui.appendChild(svg);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path"); path.setAttribute("fill", "none"); path.setAttribute("stroke", "#001F3F"); path.setAttribute("stroke-width", "4"); path.setAttribute("stroke-linecap", "round"); path.setAttribute("stroke-linejoin", "round"); svg.appendChild(path);
    const lab = document.createElement("div"); lab.className = "abs pin w"; lab.textContent = "the harness"; lab.style.cssText += ";text-align:center"; ui.appendChild(lab);
    FILM._post.push((t) => {
      const a = KIT.render.project(new T.Vector3(-6.2, -9.9, 0.2)), b = KIT.render.project(new T.Vector3(6.2, -9.9, 0.2));
      const Y = o.y || 934, cx = (a.x + b.x) / 2, half = (b.x - a.x) / 2;
      const u = o.t0 == null ? 1 : tw(t, o.t0, o.t0 + (o.dur || 900), "out"); const on = u > 0.001 && (o.t1 == null || t < o.t1);
      svg.style.visibility = on ? "visible" : "hidden"; if (!on) { lab.style.visibility = "hidden"; return; }
      let pulse = 0; for (const p0 of o.pulses || []) pulse = Math.max(pulse, Math.sin(Math.PI * clamp01((t - p0) / 500)));
      const fo = o.t1 == null ? 1 : 1 - tw(t, o.t1 - 450, o.t1); svg.style.opacity = fo;   // fades over 300 ms before it goes (pre-read 1634)
      path.setAttribute("stroke-width", 4 + 3 * pulse);
      const h = half * u; path.setAttribute("d", `M${cx - h} ${Y - 18 * u}L${cx - h} ${Y}L${cx + h} ${Y}L${cx + h} ${Y - 18 * u}`);
      const lu = o.labelAt == null ? 0 : tw(t, o.labelAt, o.labelAt + 400, "outExpo");
      lab.style.visibility = lu > 0 ? "visible" : "hidden"; lab.style.opacity = lu * fo; lab.style.left = (o.labelX != null ? o.labelX : Math.min(cx + half + 16, 1824 - lab.offsetWidth)) + "px"; lab.style.top = Y - lab.offsetHeight - 6 + 12 * (1 - lu) + "px";
    });
  };

  // a person placed by the shot (people never go below ground)
  D.person = (k, at, face) => k.person({ at, face: face || 0 });


  // ------------------------------------------------------------ the link frame (VL 15.22, ruling 44): one speaker upstairs, the
  // newcomer below, both within 1.0 m of the cut face; the speech marks are navy dashes in one line from the head through the slot
  // to the page (VL 15.7: 6 by 28 px, 14 px apart at the link frame's scale)
  // pre-read 2230: the kit's "carry" act swaps the arms in one frame. D.armsOut eases both arms forward to hold a page or book
  // in front of the body, rising over the first 22% of [t0, t0 + dur] and lowering over the last 22% (the kit's own envelope, as "tug"
  // uses, without its lean). Keep dur at 1400 ms or more so each change takes 300 ms or more.
  D.armsOut = (a, t0, dur) => { a.arms.push({ kind: "act", t0, name: "arms-out", dur, persist: false, a: { arms: "forward", env: true }, op: {} }); a.arms.sort((x, y) => x.t0 - y.t0); return a; };
  // 4A3 and 4B1: where the newcomer holds the navy page, in its local frame: to the right of the body and a little forward, so the
  // page comes off the table beside the body, never through it, and is in sight beside it (pre-read 2230)
  D.NP_LOCAL = [0.34, 0.4, 0.3];
  // the world point of an agent-local offset for an agent standing at `at` turned to `face` (KIT.SCALE.agent applied), to aim a hand at what it holds
  D.agentPoint = (at, face, l) => { const sc = typeof KIT.SCALE.agent === "number" ? KIT.SCALE.agent : 1, c = Math.cos(face), s = Math.sin(face); return [at[0] + sc * (l[0] * c + l[2] * s), at[1] + sc * l[1], at[2] + sc * (-l[0] * s + l[2] * c)]; };
  // B3 west makers: where a maker holds its page, above the tray table (y 0.42), so the page goes to the hatch with the reaching hand
  D.NP_GRIP = ["L", [0.13, 0.03, 0.03]];   // the navy page held up: the hand on its inner edge (pre-read 0055)
  D.MK_LOCAL = [0, 0.44, 0.42];   // just above the tray table and under the visor (self-check 2256)
  // pre-read 0020: a turn in n small eased steps reads as an even turn (one kit turn of any length reads as two or three frames)
  // pre-reads 0340 (4A1, 4A2, 4B5): a kit reach swings the arm in a straight line from hanging to the target, so a hand that ends
  // over a table or tray rises under its top, hidden, and pops out in a frame. D.reachUp lays the kit's own reach (hold, release,
  // lean, stretch all as the kit has them) and then bends the arm's path up: the hand rises close to the body above the top, then
  // goes over to the target; on release it comes back the same way. It wraps the agent's eval, so pages held "R" follow it.
  D.reachUp = (a, t0, dur, point, op) => {
    op = Object.assign({ hand: "R", hold: 600 }, op || {}); a.reach(t0, dur, point, op);
    const side = op.hand === "L" ? "L" : "R", sx = side === "L" ? 1 : -1, arm = a.spr.userData.arms[side === "L" ? 0 : 1];
    const G = Look.spriteGeometry(), mC = G.mittenC || 0.27, DOWN = new T.Vector3(0, -1, 0), Q = new T.Quaternion();
    const up = { t0, dur, hold: op.hold, track: op.track || null, until: op.until == null ? Infinity : op.until, rise: op.rise == null ? 0.55 : op.rise, fwd: op.fwd == null ? 0.5 : op.fwd, side: op.side == null ? 0.35 : op.side, ease: op.ease || "io", outKit: !!op.outKit, outMs: op.outMs || 0, base: null, point: V3(point) };   // op.until: a chained reach takes over from here
    (a._ups = a._ups || []).push(up);
    if (!a._upWrapped) { a._upWrapped = true; const orig = a.eval.bind(a);
      a.eval = (t) => { orig(t); if (!a.spr.visible) return;
        for (const u of a._ups) {
          const tIn1 = u.t0 + u.dur, tOut0 = tIn1 + u.hold, tOut1 = tOut0 + (u.outMs || u.dur * 0.8);   // op.outMs: a longer, straight let-go drawn here (pre-read 0616)
          // the rig writes each arm's matrix itself (matrixAutoUpdate off): matrix = inverse(squash scale) x compose(shoulder, turn, stretch)
          const sq = a.spr.userData.squash.scale, M4 = new T.Matrix4().makeScale(sq.x, sq.y, sq.z).multiply(arm.matrix), pos = new T.Vector3(), q0 = new T.Quaternion(), s0 = new T.Vector3();
          M4.decompose(pos, q0, s0);
          if (t < u.t0) { u.base = DOWN.clone().applyQuaternion(q0).normalize(); continue; }
          if (t >= u.until || t >= tOut1 || (!u.track && t >= tIn1 && t < tOut0) || (u.outKit && t >= tOut0)) continue;   // op.outKit: the kit draws the let-go itself (straight down, in front of the table); aim the reach at where the hand lets go   // op.track(t): a moving point the hand follows, held too
          const b = t >= tOut0 ? DOWN.clone().applyQuaternion(q0).normalize() : (u.base || new T.Vector3(sx * 0.12, -1, 0.05).normalize());   // pre-read 0607: on the way back, towards the arm the kit itself draws now (it ends at the base pose), so the hand-over is seamless
          const L = a.spr.worldToLocal(u.track ? V3(u.track(t)) : u.point.clone()).sub(new T.Vector3(sx * 0.30, 0.50, 0.065)), len = L.length(), d = L.clone().normalize();
          const stF = Math.max(1, Math.min(1.5, len / mC));
          const m = new T.Vector3(d.x * u.side + b.x * 0.3, u.rise, Math.max(0.05, d.z * u.fwd)).normalize();   // op.fwd: how far forward the hand goes while it rises (pre-read 0415: low, so it never passes under a table lip)
          const ez = (a0, a1) => u.ease === "soft" ? 0.5 * tw(t, a0, a1, "lin") + 0.5 * tw(t, a0, a1, "io") : tw(t, a0, a1, u.ease);   // "soft": half linear, so it starts moving at once and rises in even steps
          let v = t < tIn1 ? ez(u.t0, tIn1) : t < tOut0 ? 1 : 1 - ez(tOut0, tOut1);
          const dir = (u.outMs && t >= tOut0) ? b.clone().lerp(d, v).normalize() : b.clone().multiplyScalar((1 - v) * (1 - v)).addScaledVector(m, 2 * v * (1 - v)).addScaledVector(d, v * v).normalize();   // with outMs the let-go is straight, from the hold to the kit's own arm
          Q.setFromUnitVectors(DOWN, dir);
          arm.matrix.makeScale(1 / sq.x, 1 / sq.y, 1 / sq.z).multiply(new T.Matrix4().compose(pos, Q, new T.Vector3(1, 1 + (stF - 1) * v, 1)));
          arm.matrixWorldNeedsUpdate = true; a.spr.updateMatrixWorld(true);
        } };
    }
    return a;
  };
  /* v2-shots-b 082751: a second kit lean snaps (it eases from the pose's lean, not the lean in force); step it every frame on io */
  D.leanStep = (a, t0, dur, from, to) => { const n = Math.max(2, Math.round(dur / 33)); for (let i = 1; i <= n; i++) { const u = tw(t0 + dur * i / n, t0, t0 + dur, "io"); a.lean(t0 + dur * i / n, 0, [from[0] + (to[0] - from[0]) * u, from[1] + (to[1] - from[1]) * u]); } return a; };
  D.turnLin = (a, t0, dur, from, to, n) => { n = n || 8; let d = to - from; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; for (let i = 1; i <= n; i++) a.turn(t0 + (i - 1) * dur / n, dur / n, from + d * i / n); return a; };
  D.GAG = { at: [3.2, 1.15, -2.3], o: { size: "close", height: 1.37, px: 400, pitch: -8, focus: [3.6, 1.2, -2.8] } };   /* 4.0's close (its last frame); 4A1 opens on it (ruling 149) */
  D.SPK = [2.1, 0, -2.2];   // the kit's own place for the speaker (pre-read 2115: 4.0 no longer walks the people)
  // B1 east's table at 0.52 m in every close frame of stage 4 (an agent of 0.78 m can then put a hand on what lies on it; v2-visuals
  // 123551 allowed it for 4A2, and 4A1, 4A3 and 4B1 take the same table so the cuts join). Top at -3.2 + 0.525.
  D.lowDesk = (k, W) => { D.hide(k, W.parts.desk); const dk = k.set.part("desk", { w: 1.6, d: 0.9 }); k.scene.add(dk); dk.position.set(1.65, -3.2, -3.0); dk.scale.y = 0.52 / 0.765; return dk; };
  D.P.b1FolderLow = [2.2, -3.2 + 0.525, -2.78];   // the book where 4A2 has it, its hinge to the left
  D.HOLD = { at: [1.05, -0.7], face: 0.3, book: [1.1, 1.34, -0.57] };   // 145800 item 10: clear of the desk end, so the held book is on bare wall (the slot is in front, at z -0.32)   // 4B1's end and 4B2's start: the speaker at the east slot, book held up                   // the speaker, in front of the pavilion's east desk, clear of the post at x 1.5
  D.NEW = [0.55, -3.2, -0.75];                // the newcomer below, near the cut face
  D.LF = { look: [1.7, -0.88, -0.85], dist: 14.0, yaw: -10, pitch: -5, size: "room" };   /* pre-read 1455 (ruling 149 keeps the roof): 0.3 m right, so the person at the west table is not cut at the left edge */   // 141605 item 4: 60 px of air over the speaker's head
  // the kit's six pavilion people: the speaker is people[2]; the others stand away from the link frame (one speaker, alone)
  D.people = (W, o) => { const P = W.people; if (!P || !P.length) return null;
    P[2].at(0, D.SPK, 0.45); if (o && o.keep) return P[2];   /* ruling 149: 4A1 and 4A3 keep the roof as 4.0 leaves it (the kit's places) */ P[0].at(0, [-4.4, 0, -1.0], 0.4); P[1].at(0, [-4.4, 0, -2.6], 0.3); P[3].at(0, [-3.6, 0, -1.0], 0.3); P[4].at(0, [-3.75, 0, -2.6], 0.2); P[5].at(0, [-4.4, 0, -4.2], 0.2); return P[2]; };   // the others west, clear of the link frame's left edge;
  // 4.0 opens on 3C2's last frame, where the six people stand at the kit's places; they walk to the stage-4 places (D.people) over
  // [t0, t0+dur], so 4.0's last frame is 4A1's first (141605 item 3). Paths keep to the open middle of the pavilion floor.
  D.peopleWalk = (W, t0, dur) => { const P = W.people; if (!P || !P.length) return null;
    // one at a time and straight, so nobody walks inside another (PRE_SIGN 4): [index, target, face, start, dur]
    // pre-read 1740: each walks its own lane, clear of the desks, the standing speaker and the others: [index, path, face, start, dur]
    // pre-read 2030: places spread along x as well as depth, so the W camera never stacks two people; the speaker moves first and the long
    // walk passes behind it
    const go = [[2, [[2.2, -0.95]], 0.25, 0, 1300], [0, [[-4.4, -1.0]], 0.4, 0, 1000], [1, [[-4.4, -2.6]], 0.3, 200, 2000], [5, [[-2.0, -4.3], [-4.4, -4.2]], 0.2, 400, 2600],
      [3, [[3.0, -2.4], [-3.0, -2.4], [-3.6, -1.0]], 0.3, 1300, 3300], [4, [[2.0, -4.6], [-3.75, -4.6], [-3.75, -2.6]], 0.2, 600, 4000]];
    go.forEach(([i, pts, face, s0, du]) => { P[i].walk(t0 + s0, du, pts, { ease: "lin" }).turn(t0 + s0 + du + 50, 400, face, { blend: 300 }); });
    return P[2]; };
  D.blockAvoid = [{ x0: -1.5, x1: 1.5, z0: -1.75, z1: 1.2, y: -6.4 }];   // nobody stands inside the model block in B2 (v2-visuals 165906)
  D.B3avoid = [{ x0: -5.1, x1: -3.9, z0: -2.3, z1: -0.6, y: -9.6 }];   // the judge's desk and the booth in B3 west
  D.B3V = { look: [-4.15, -9.05, -0.95], size: "room", yaw: -6, pitch: -8, px: 300 };
  D.dashes = function (k, o) {
    const pts = o.path.map(V3), segL = [], g = new T.Group(); k.scene.add(g); let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = pts[i].distanceTo(pts[i - 1]); segL.push(l); L += l; }
    const at = (d) => { for (let i = 0; i < segL.length; i++) { if (d <= segL[i]) return { p: pts[i].clone().lerp(pts[i + 1], d / segL[i]), dir: pts[i + 1].clone().sub(pts[i]).normalize() }; d -= segL[i]; } return { p: pts[pts.length - 1].clone(), dir: new T.Vector3(0, -1, 0) }; };
    const gap = o.gap || 0.2, n = Math.ceil(L / gap) + 1, M = mat("navy", { roughness: 0.6 }), ds = [];
    const nm = o.burst ? o.burst * 2 : n;   // o.burst: groups of that many, one after another (two groups' worth of dashes, reused)
    for (let i = 0; i < nm; i++) ds.push(add(g, rbox(0.03, o.len || 0.13, 0.03, M, 0.012, 0.006), 0, 0, 0));
    const sp = o.arrive ? L / Math.max(0.3, (o.arrive - o.t0) / 1000) : (o.speed || 2.2);   // metres a second; o.arrive: the speed that lands the first dash at the path's end at that time (pre-read 0600)
    if (o.burst) {   // pre-read 0538: a fresh group of o.burst leaves the start every P metres until t1; each group runs the whole path
      const P = Math.max(L + gap * (o.burst + 1), (o.burst + 2) * gap);
      D.track(k, (t) => { const F = (t - o.t0) / 1000 * sp, kk = Math.floor(F / P), lastK = Math.floor(Math.max(0, (o.t1 - o.t0) / 1000 * sp) / P);
        ds.forEach((m, i) => { const grp = kk - Math.floor(i / o.burst), j = i % o.burst, d = F - grp * P - j * gap;
          const on = t >= o.t0 && grp >= 0 && grp <= lastK && d >= 0 && d <= L; m.visible = on; if (!on) return;
          const q = at(d); m.position.copy(q.p); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), q.dir); }); });
      return g;
    }
    D.track(k, (t) => { ds.forEach((m, i) => { const d = (t - o.t0) / 1000 * sp - i * gap; const per = o.burst ? Math.max(o.burst + 1, Math.ceil(L / gap) + 1) : 0, inGroup = !per || (i % per) < o.burst;   // o.burst: only that many travel together (VL item 7: three at a time), one group on the path at once
        const on = inGroup && t >= o.t0 && d >= 0 && d <= L && t < o.t1 + (L / sp) * 1000 && (t < o.t1 || d > (t - o.t1) / 1000 * sp);
        m.visible = on; if (!on) return; const q = at(d); m.position.copy(q.p); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), q.dir); }); });
    return g;
  };

  // ------------------------------------------------------------ hide a kit part at all times (k.each runs after the tracks)
  D.hide = (k, obj) => k.each(() => { if (obj) obj.visible = false; });
})();
