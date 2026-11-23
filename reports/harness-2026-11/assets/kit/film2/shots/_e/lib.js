// shots/_e/lib.js · v2-shots-e shared helpers for 5.0 .. E3 (built on KIT.parts; replaced by kit calls as they land).
// Loaded by each shot.js with a synchronous read, after shots/_e/rows.js. Every helper is a pure function of t.
(function () {
  "use strict";
  const load = (p) => { const x = new XMLHttpRequest(); x.open("GET", p, false); x.send(); (0, eval)(x.responseText); };
  if (!window.E_ROWS) load("../shots/_e/rows.js");
  const T = THREE, P = KIT.parts, tw = FILM.tw, lerp = FILM.lerp, clamp01 = FILM.clamp01, noise = FILM.noise, halton = FILM.halton;
  const E = (window.SE = {});
  const FH = 3.2, RX = 3.05;
  const ROOMS = { board: [1, -1], skills: [1, 1], gates: [2, -1], store: [2, 1], judge: [3, -1], teams: [3, 1] };
  const ORDER = ["board", "skills", "gates", "store", "judge", "teams"];
  E.ROOMS = ROOMS; E.ORDER = ORDER; E.FH = FH; E.RX = RX;
  E.roomY = (n) => -ROOMS[n][0] * FH;
  E.roomX = (n) => ROOMS[n][1] * RX;
  E.R = (n, x, y, z) => new T.Vector3(E.roomX(n) + (x || 0), E.roomY(n) + (y || 0), z == null ? -3.0 : z);
  E.area = (n) => { const sd = ROOMS[n][1]; return { x0: sd < 0 ? -5.7 : 0.45, x1: sd < 0 ? -0.45 : 5.7, z0: -5.3, z1: -0.6, y: E.roomY(n) }; };
  E.pav = (x, y, z) => new T.Vector3(x || 0, y || 0, z == null ? -3.0 : z);

  // ---------------------------------------------------------------- word-anchored time (VL 6.6: lead the word by ~200 ms)
  // k.word when the narration is real; otherwise the word's place in the row's text, spread over the row's span.
  // E.FB[rowId] = {start, end, dur}: a stand-in span for a row the current timing.json does not carry yet
  E.FB = {};
  const rowOf = (k, id) => E.FB[id] || k.row(id) || null;
  E.at = function (k, rowId, word, lead) {
    lead = lead == null ? 200 : lead;
    // a phrase is looked up by its longest word (first match of a short word like "a" would land early)
    const key = word ? String(word).split(" ").sort((x, y) => y.length - x.length)[0] : null;
    let w = key && !E.FB[rowId] ? k.word(rowId, key) : null;
    if (w != null && key !== String(word).split(" ")[0]) { const r0 = rowOf(k, rowId), text = (window.E_ROWS[rowId] || "").toLowerCase(), i = text.indexOf(String(word).toLowerCase()), j = text.indexOf(key.toLowerCase(), Math.max(0, i));
      if (r0 && i >= 0 && j >= i) w -= (j - i) / Math.max(1, text.length) * r0.dur; }
    const r = rowOf(k, rowId);
    if (w != null) return Math.max(0, w - lead);
    if (!r) return 0;
    const text = (window.E_ROWS[rowId] || ""), i = word ? text.toLowerCase().indexOf(String(word).toLowerCase()) : 0;
    const f = i < 0 ? 0 : i / Math.max(1, text.length);
    return Math.max(0, r.start + f * r.dur - lead);
  };
  // the end of a word (name cards land 50 ms after the name ends)
  // timing.json's rows (name_end: the film time the name's last syllable ends, real narration only)
  // ruling 138 (b): a version render passes ?timing=<file> (timing_op_render.json, timing_ai.json); without it, timing.json as before
  E.TFILE = "../" + (((typeof location !== "undefined" && new URLSearchParams(location.search).get("timing")) || "timing.json").replace(/^.*\//, ""));
  let TROWS = null; try { const x = new XMLHttpRequest(); x.open("GET", E.TFILE, false); x.send(); TROWS = {}; for (const q of JSON.parse(x.responseText).rows || []) TROWS[q.id] = q; } catch (e) { TROWS = {}; }
  E.after = function (k, rowId, word) {
    const r = rowOf(k, rowId); if (!r) return 0;
    const q = E.FB[rowId] ? null : TROWS[rowId]; if (q && q.name_end != null) return r.start + (q.name_end - q.start) * 1000 + 50;
    const text = (window.E_ROWS[rowId] || ""), lo = text.toLowerCase(), i = lo.lastIndexOf(String(word).toLowerCase());
    const f = i < 0 ? 1 : (i + word.length) / Math.max(1, text.length);
    return Math.min(r.end, r.start + f * r.dur) + 50;
  };

  // ---------------------------------------------------------------- the building, fitted as the story has it
  // fitted: { board: -1, ..., teams: t } (-1 = before this shot; a time = installed in view)
  E.world = function (k, fitted) {
    const names = Object.keys(fitted || {});
    const Wb = k.set.building({ fitted: names.filter((n) => fitted[n] < 0) });
    names.forEach((n) => { if (fitted[n] >= 0) Wb.install(n, fitted[n]); });
    // stage 1's doors stand from the start (v2-shots-b): keep them visible
    const doors = Wb.parts.doors || [];
    k.each(() => doors.forEach((d) => { d.visible = true; if (d.userData.y0 != null) d.position.y = d.userData.y0; }));
    return Wb;
  };
  E.ALL = { board: -1, skills: -1, gates: -1, store: -1, judge: -1, teams: -1 };
  E.FIVE = { board: -1, skills: -1, gates: -1, store: -1, judge: -1 };
  // a shot's length in ms from timing.json (for a crowd's tShift across a join)
  E.shotDur = function (id) { try { const x = new XMLHttpRequest(); x.open("GET", E.TFILE, false); x.send(); const J = JSON.parse(x.responseText), s = (J.shots || []).find((q) => q.id === id); return s ? Math.round((s.end - s.start) * 1000) : 0; } catch (e) { return 0; } };
  // v2.0 (visuals 080334/080638/080739: "the base in the band"): the kit's W-left with the look point 0.9 m lower, so the
  // sand base sits above y 920 (it reached y 957). 5A ends and 5B1 opens on it, so the two match.
  E.WLEFT = { name: "W-left", look: [1.9, -3.6, -2.2], dist: 63, yaw: -14, pitch: -12 };
  // a walk that never shows the back of the head: turn first (250 ms) to the walk's heading clamped to +-lim rad of the lens
  // (three-quarter at most), then walk holding that yaw (the kit's finished turn holds the yaw through the walk)
  E.walk3q = function (a, t0, dur, from, to, lim) { lim = lim == null ? 1.25 : lim; const yaw = Math.atan2(to[0] - from[0], to[1] - from[1]);
    const c = Math.max(-lim, Math.min(lim, Math.abs(yaw) > Math.PI / 2 ? Math.sign(yaw) * lim : yaw));
    a.turn(t0 - 250, 250, c); a.walk(t0, dur, [from, to], { face: c }); return a; };

  // ---------------------------------------------------------------- the 300 (VL 5.3), 50 a room, as v2-shots-b places them
  // o.fitted: as world(). o.sleep: [t0, t1] (lanes hold, members slump). o.jam: { t0, room } (a bunch closes up behind
  // one stopped member). o.flow: { room, t0 } members in a fitted room walk a slow loop between their slots and the object.
  // o.hideIdx: member indices hidden (handed over to full agents).
  E.crowd = function (k, Wb, o) {
    o = o || {};
    const C = k.crowd(300, { seed: 7 });
    const fitted = o.fitted || {}, hide = new Set(o.hideIdx || []);
    const slotOf = (n, j) => { const a = E.area(n), cols = 8, sx = (a.x1 - a.x0) / cols, sz = (a.z1 - a.z0) / 7, r = Math.floor(j / cols), c = j % cols;
      return { x: a.x0 + sx / 2 + c * sx + (r % 2 ? sx * 0.25 : -sx * 0.25), z: a.z1 - sz / 2 - r * sz }; };
    const partPt = { board: [-3.05, -5.6], skills: [3.85, -5.4], gates: [-3.05, -5.6], store: [3.05, -5], judge: [-3.05, -4.1], teams: [3.05, -4] };
    C.slotOf = slotOf;
    C.at = function (i, t) {
      const n = ORDER[i % 6], j = Math.floor(i / 6), a = E.area(n);
      const bx = lerp(a.x0 + 0.3, a.x1 - 0.3, halton(j + 1, 2)), bz = lerp(a.z0 + 0.3, a.z1 - 0.2, halton(j + 1, 3));
      const tm = t + (o.tShift || 0); // v2.0: o.tShift (ms) carries the milling on from the shot before, so a cut does not re-deal the crowd
      const s = tm / 1000, w1 = 0.3 + 0.35 * noise(i, 11), w2 = 0.22 + 0.3 * noise(i, 12), p1 = 6.283 * noise(i, 13), p2 = 6.283 * noise(i, 14);
      let x = bx + 0.55 * Math.sin(w1 * s + p1), z = bz + 0.4 * Math.sin(w2 * s + p2);
      let yaw = Math.atan2(Math.cos(w1 * s + p1) * w1, 0.6 * Math.cos(w2 * s + p2) * w2), y = a.y + 0.04 * Math.abs(Math.sin(s * 5 + p1)), moving = true;
      const tf = fitted[n];
      if (tf != null && t >= tf) {
        const sl = slotOf(n, j), pp = partPt[n], d = Math.hypot(sl.x - pp[0], sl.z - pp[1]) * 110;
        const u = tf < 0 ? 1 : tw(t, tf + 200 + d, tf + 1400 + d, "io");
        x = lerp(x, sl.x, u); z = lerp(z, sl.z, u); yaw = lerp(yaw, (noise(i, 42) - 0.5) * 0.5, u); y = lerp(y, a.y, u); moving = u < 1;
        // working: a share of a fitted room's members step to the object and back (the floor "flows")
        if (u >= 1 && o.work !== false && noise(i, 61) < 0.22) {
          const per = 5200 + 2400 * noise(i, 62), ph = ((((tm + per * noise(i, 63)) % per) + per) % per) / per; // positive modulo, so a negative tShift is continuous
          const g = ph < 0.5 ? FILM.E.io(clamp01(ph * 2)) : FILM.E.io(clamp01(2 - ph * 2));
          x = lerp(sl.x, lerp(sl.x, pp[0], 0.55), g); z = lerp(sl.z, lerp(sl.z, pp[1] + 0.9, 0.55), g);
          yaw = ph < 0.5 ? Math.atan2(pp[0] - sl.x, pp[1] - sl.z) : Math.atan2(sl.x - pp[0], sl.z - pp[1]);
          moving = true;
        }
      }
      // the jam (5.0): in the jam room, members close up into a short queue behind the stopped one
      if (o.jam && n === o.jam.room && j < 9) {
        const u = tw(t, o.jam.t0 + j * 90, o.jam.t0 + 1100 + j * 90, "io"), q = o.jam.at;
        const qx = q[0] + 0.62 * (j + 1) * (o.jam.dir || 1) + 0.08 * (noise(i, 71) - 0.5), qz = q[1] + 0.25 * (noise(i, 72) - 0.5);
        x = lerp(x, qx, u); z = lerp(z, qz, u); yaw = lerp(yaw, -Math.PI / 2 * (o.jam.dir || 1), u); if (u >= 1) moving = false;
        if (o.jam.free != null) { const f = tw(t, o.jam.free + j * 120, o.jam.free + 1600 + j * 120, "io"); const sl = slotOf(n, j); x = lerp(x, sl.x, f); z = lerp(z, sl.z, f); moving = f > 0 && f < 1; }
      }
      // sleep: hold, slump (sink a little, lean forward)
      let asleep = false;
      if (o.sleep) { const u = tw(t, o.sleep[0] + noise(i, 81) * 600, o.sleep[0] + 600 + noise(i, 81) * 600, "io") * (o.sleep[1] != null ? 1 - tw(t, o.sleep[1] + noise(i, 82) * 500, o.sleep[1] + 400 + noise(i, 82) * 500, "io") : 1);
        if (u > 0) { y -= 0.08 * u; moving = moving && u < 0.5; if (tf != null) { const sl = slotOf(n, j); x = lerp(x, sl.x, u); z = lerp(z, sl.z, u); yaw = lerp(yaw, (noise(i, 42) - 0.5) * 0.5, u); } } if (u >= 0.5) asleep = true; }
      // v2.0 (visuals 080739 R1 item 4): o.breathe [t0, t1]: the asleep rise and settle 0 to 3 cm on a 3.6 to 4.6 s breath, each at its own phase, eased in and out, so no frame repeats
      if (asleep && o.breathe) { const b = tw(t, o.breathe[0], o.breathe[0] + 600) * (1 - tw(t, o.breathe[1] - 600, o.breathe[1])); y += b * 0.015 * (1 - Math.cos(tm / (575 + 160 * noise(i, 84)) + 6.283 * noise(i, 83))); } // v1.1: the kit's asleep set (closed eyes, VL 10.2/15.2; visuals 171728 item 1)
      // keep-clear boxes in S shots (VL 5.3): members inside are out of the room while the box is on
      let vis = !hide.has(i) && !(o.hideFrom && o.hideFrom[i] != null && t >= o.hideFrom[i]);
      // members in a keep-clear box walk out through the open front (VL 6.2: nothing vanishes) as it starts, and walk back
      // in as it ends; a box with no start is clear from the first frame
      for (const c of o.clear || []) { if (c.room && c.room !== n) continue;
        if (!(x > c.x0 && x < c.x1 && (c.z0 == null || z > c.z0) && (c.z1 == null || z < c.z1))) continue;
        // ruling 103 (c): a room changes only across a cut or out of frame, so the box switches at its times and nobody walks
        const uo = c.from == null || t >= c.from ? 1 : 0, ui = c.to != null && t >= c.to ? 1 : 0, u = c.slide ? tw(t, c.slide[0], c.slide[1], "io") /* v2.1 (ruling 143 a): out through the side wall across a move, seen */ : uo * (1 - ui);
        if (u <= 0) continue; const side = ROOMS[n][1];
        if (c.slide) { z = lerp(z, -5.25 + 0.15 * noise(i, 79), u); yaw = lerp(yaw, Math.PI, u * (1 - u) * 1.2); } /* v2.1 (ruling 143 a): the aisle steps back through the room to the back wall and is gone behind the back rows as the move ends; never out past a wall */
        else { x = lerp(x, side * (6.6 + noise(i, 78)), u); yaw = lerp(yaw, side * Math.PI / 2, u); } /* out through the room's outer wall, never towards the lens */ moving = moving || (u > 0 && u < 1); if (u >= 1) vis = false; }
      return { x, y, z, yaw, vis, moving, asleep };
    };
    return C;
  };
  // "z" marks over a share of sleeping members, staggered
  E.zMarks = function (k, C, t0, t1, n) {
    for (let m = 0; m < (n || 14); m++) {
      const i = Math.floor(noise(m, 91) * 300), st = t0 + 300 + noise(m, 92) * 1500;
      for (let tt = st; tt < t1 - 600; tt += 2600) k.fx(k, { t0: tt, kind: "z", dur: 2400, size: 34, anchor: () => { const p = C.at(i, tt); return new T.Vector3(p.x, p.y + 0.95, p.z); } });
    }
  };

  // ---------------------------------------------------------------- a glowing job token along a 3D path (5C, R1)
  // pts: [[x,y,z]...]; legs: [{t0, t1, from, to}] index ranges along pts. trail: a faint line drawn behind it that stays.
  E.token = function (k, o) {
    const g = new T.Group(); k.scene.add(g); g.scale.setScalar(o.scale || 1);
    const m = new T.MeshStandardMaterial({ color: P.PAL.coral, emissive: 0xf06e42, emissiveIntensity: 0.6, roughness: 0.6 });
    const body = new T.Mesh(P.rbox ? new T.BoxGeometry(0.34, 0.24, 0.05) : new T.BoxGeometry(0.34, 0.24, 0.05), m); g.add(body);
    const halo = new T.Mesh(new T.SphereGeometry(0.32, 16, 12), new T.MeshBasicMaterial({ color: 0xf6a07f, transparent: true, opacity: 0.35, depthWrite: false })); g.add(halo);
    const pts = o.pts.map((p) => new T.Vector3(...p));
    const seg = []; let L = 0; for (let i = 1; i < pts.length; i++) { const l = pts[i].distanceTo(pts[i - 1]); seg.push(l); L += l; }
    const cum = [0]; seg.forEach((l) => cum.push(cum[cum.length - 1] + l));
    const posAt = (s) => { s = clamp01(s) * L; for (let i = 0; i < seg.length; i++) if (s <= cum[i + 1] + 1e-6) return pts[i].clone().lerp(pts[i + 1], seg[i] ? (s - cum[i]) / seg[i] : 0); return pts[pts.length - 1].clone(); };
    // the trail: a tube along the whole path, revealed with progress (drawRange)
    let trail = null;
    if (o.trail) {
      const curve = new T.CatmullRomCurve3(pts, false, "catmullrom", 0.01);
      const geo = new T.TubeGeometry(curve, 400, 0.035 * (o.scale || 1), 6, false);
      trail = new T.Mesh(geo, new T.MeshBasicMaterial({ color: 0xf06e42, transparent: true, opacity: 0.55, depthWrite: false })); k.scene.add(trail);
    }
    // progress s(t): o.keys = [[t, s], ...] eased between
    const keys = o.keys;
    const sAt = (t) => { if (t <= keys[0][0]) return keys[0][1]; for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], FILM.E.io(clamp01((t - keys[i - 1][0]) / Math.max(1, keys[i][0] - keys[i - 1][0])))); return keys[keys.length - 1][1]; };
    g.sAt = sAt; g.posAt = posAt; g.at = (t) => posAt(sAt(t));
    k.each((t) => {
      const on = t >= (o.t0 != null ? o.t0 : keys[0][0]) && (o.t1 == null || t <= o.t1);
      g.visible = on; const s = sAt(t), p = posAt(s); g.position.copy(p);
      halo.scale.setScalar(1 + 0.12 * Math.sin(t / 160));
      if (trail) { const tot = trail.geometry.index ? trail.geometry.index.count : 0; trail.visible = t >= keys[0][0]; trail.geometry.setDrawRange(0, Math.floor(tot * clamp01(o.trailAll != null && t >= o.trailAll ? 1 : s) / 6) * 6);
        trail.material.opacity = 0.5 * (o.trailFade != null ? 1 - tw(t, o.trailFade, o.trailFade + 800) : 1) + (o.trailGlow != null ? 0.4 * Math.sin(Math.PI * clamp01((t - o.trailGlow) / 1400)) : 0); }
    });
    return g;
  };

  // ---------------------------------------------------------------- small props
  E.box = (parent, at, w, h, d, m, r) => { const b = P.rbox(w, h, d, typeof m === "string" ? P.mat(m) : m, r != null ? r : Math.min(w, h, d) * 0.3, 0.01); b.position.copy(at); parent.add(b); return b; };
  E.glowMat = (hex, level) => new T.MeshStandardMaterial({ color: P.PAL.white, emissive: hex || 0xffd27a, emissiveIntensity: level || 0, roughness: 0.7 });
  // a small lit box that never sleeps (the always-on service; 5C, R1): lowers in at tIn, glows; pulse(t0) brightens
  E.alwaysOn = function (k, at, o) {
    o = o || {}; const g = new T.Group(); k.scene.add(g); g.position.copy(at);
    const gm = E.glowMat(0xffc85a, 0);
    E.box(g, new T.Vector3(0, 0.45, 0), 0.9, 0.9, 0.7, P.mat("white"), 0.12);
    const face = E.box(g, new T.Vector3(0, 0.5, 0.36), 0.6, 0.5, 0.04, gm, 0.08);
    if (o.green !== false) { const gl = new T.Mesh(new T.SphereGeometry(0.09, 20, 14), new T.MeshStandardMaterial({ color: 0xF5B301, emissive: 0xF5B301, emissiveIntensity: 1.2 })); gl.position.set(0, 0.78, 0.38); g.add(gl); } // VL 10.5: one green light
    const light = new T.PointLight(0xffd59a, 0, 4, 1.6); light.position.set(0, 1.0, 0.8); g.add(light);
    const pulses = o.pulses || [];
    k.each((t) => {
      const ins = o.tIn != null ? tw(t, o.tIn, o.tIn + 600, "back") : 1; g.visible = ins > 0.001; g.position.y = at.y + (1 - ins) * 2.6;
      let e = (o.base || 0.55) * ins + 0.08 * Math.sin(t / 700); for (const p of pulses) e += 0.9 * Math.sin(Math.PI * clamp01((t - p) / 700));
      gm.emissiveIntensity = Math.max(0, e); light.intensity = 2.2 * Math.max(0, e);
    });
    g.pulses = pulses; return g;
  };
  // four small wall panels that light in turn (5A)
  E.panels = function (k, at, o) {
    const g = new T.Group(); k.scene.add(g); g.position.copy(at);
    const ms = [0, 1, 2, 3].map(() => E.glowMat(0xffe2a0, 0));
    // each place is a small screen: an ink frame and a pale face; the stopped one's face is refusal red, then green
    ms.forEach((m, i) => { E.box(g, new T.Vector3((i - 1.5) * 1.05, 0, 0), 0.84, 0.62, 0.05, P.mat("ink"), 0.06); E.box(g, new T.Vector3((i - 1.5) * 1.05, 0, 0.035), 0.7, 0.48, 0.02, m, 0.04); });
    k.each((t) => ms.forEach((m, i) => {
      const t0 = o.times[i]; let e = o.white || t0 == null ? 0 : 0.8 * tw(t, t0 - 100, t0 + 200, "out") * (1 - tw(t, t0 + 700, t0 + 1000, "in"));
      m.emissive.setHex(0xffe2a0);
      m.color.setHex(0xe9eef2);
      if (o.red && o.red[i] != null) { const r0 = o.red[i][0], r1 = o.red[i][1], W0 = new T.Color(0xe9eef2), RD = new T.Color(0xc8372d), GR = new T.Color(0xE8A200); const ur = tw(t, r0, r0 + 450, "sine"), ug = tw(t, r1, r1 + 450, "sine"); if (ur > 0) { const c = W0.clone().lerp(RD, ur).lerp(GR, ug); m.color.copy(c); m.emissive.copy(c); e = FILM.lerp(e, 0.35, ur); } } // v1.5: red and green over 300 ms (pre-read 2140)
      m.emissiveIntensity = e;
    }));
    g.pt = (i) => g.localToWorld(new T.Vector3((i - 1.5) * 1.05, 0, 0.1));
    return g;
  };
  return E;
})();
// ---------------------------------------------------------------- the finished map (VL 10.4): every docked label, already in place
(function () {
  const E = window.SE, T = THREE, P = KIT.parts, tw = FILM.tw;
  E.BOX = [-5.4, 0, -1.4]; E.HATCH = [6.55, 0, -1.3]; E.WF = -6.55; // west face and hatch on the 0.9 m side slabs (kit v0.3, BLK 7.0)
  E.docks = function (k, t0, o) {
    o = o || {}; const V = (a) => new T.Vector3(...a);
    const L = [
      ["slack", "Slack, Notion", "where people and agents talk", [-3.0, 0.95, -3.2], "west"],
      ["webhook", "a webhook", "the tap on the shoulder", [E.BOX[0], 0.4, E.BOX[2]], "west"],
      ["bead", "beads", "a shared job board", [-6.0, -2.3, -0.6], "west"],
      ["hook", "hooks", "what must never<br>happen unchecked", [-6.0, -4.8, -0.6], "west"],
      ["judge", "evals", "is the work good enough?", [-6.0, -8.0, -0.6], "west"],
      ["people", "your people", "above the surface", [3.5, 1.1, -2.6], "east"],
      ["operator", "an operator", "the person who unblocks", [E.HATCH[0] + 0.5, 0.9, E.HATCH[2]], "east"],
      ["skill", "skills", "how we work, written down", [3.85, -1.9, -5.0], "east"],
      ["store", "the note taker", "what was said, kept", [3.05, -5.6, -4.6], "east"],
      ["teams", "agent teams", "for the big jobs", [3.05, -8.85, -4.0], "east"],
    ];
    const DOCKY = {"slack": 150, "webhook": 262, "bead": 372, "hook": 574, "judge": 776, "people": 150, "operator": 262, "skill": 372, "store": 574, "teams": 776}; // VL 10.4 label tops
    const out = {};
    L.filter(([id]) => !o.only || o.only.includes(id)).forEach(([id, text, small, at, side], i) => { out[id] = k.ui.dock(t0 + (o.stagger ? i * 110 : 0), { text, small: (o.smallMap && o.smallMap[id]) || (o.only && id === "judge" ? "is the work<br>good enough?" : small), at: V(at), side, t1: o.t1, y: o.yMap ? o.yMap[id] : o.freeY ? undefined : DOCKY[id], x: o.only && side === "west" ? 290 : undefined }); });
    // light(id, t0, dur): the label turns green for its beat (emulated until the kit's dock.light lands)
    const lights = [];
    E.lightDock = (id, ta, dur) => lights.push({ id, ta, dur: dur || 2600 });
    const hushes = []; E.hush = (side, ta, tb) => hushes.push({ side, ta, tb });
    const sideOf = {}; L.forEach(([id, , , , side]) => (sideOf[id] = side));
    FILM._post.push((t) => { for (const id in out) { let h = 1; for (const q of hushes) if (q.side === sideOf[id]) h = Math.min(h, 1 - 0.88 * tw(t, q.ta - 250, q.ta) * (1 - tw(t, q.tb, q.tb + 300)));
      for (const q of E.overlays || []) { if (q.side !== sideOf[id]) continue; const u = tw(t, q.ta - 250, q.ta) * (1 - tw(t, q.tb, q.tb + 300)); if (u <= 0) continue;
        const r = out[id].el.getBoundingClientRect(), R = q.rect, under = r.right > R.x && r.left < R.x + R.w && r.bottom > R.y && r.top < R.y + R.h;
        h = Math.min(h, under ? 1 - u : 1 - 0.8 * u); }
      out[id].el.style.opacity = h < 1 ? String(h * +(out[id].el.style.opacity || 1)) : out[id].el.style.opacity;
      const ln = out[id].line || out[id].el.nextSibling, dt = out[id].dot || (ln && ln.nextSibling); if (h < 1) { if (ln) ln.style.opacity = String(h * +(ln.style.opacity || 1)); if (dt) dt.style.opacity = String(h * +(dt.style.opacity || 1)); } let on = 0; for (const l of lights) if (l.id === id) on = Math.max(on, tw(t, l.ta, l.ta + 250) * (1 - tw(t, l.ta + l.dur, l.ta + l.dur + 300)));
      out[id].el.style.color = on > 0.5 ? "#001F3F" : ""; out[id].el.style.fontWeight = on > 0.5 ? "700" : ""; } });
    return out;
  };
  // the roof sign: a white board on two posts on the pavilion roof; text a then (from tFlip) text b, flipping over 500 ms
  E.roofSign = function (k, a, b, tFlip, o) { o = Object.assign({ w: 7.6, h: 1.6 }, o || {});
    o = o || {}; const g = new T.Group(); k.scene.add(g); g.position.set(o.x || 0, 3.0, o.z || -1.0);
    const mk = (tx) => { const s = KIT.set.sign(tx, o.w || 6.4, o.h || 1.3); s.children.forEach((c) => { if (c.material && c.material.map) { c.position.z = 0.06; c.material.polygonOffset = true; c.material.polygonOffsetFactor = -2; c.material.polygonOffsetUnits = -2; } }); /* v1.8: the kit puts the type 2 mm off the board; from S1's far camera they z-fought (K 40 f369 to f378), so the type stands 35 mm proud */ return s; };
    const sa = mk(a), sb = b ? mk(b) : null; const piv = new T.Group(); piv.position.y = 0.95; g.add(piv);
    piv.add(sa); sa.position.set(0, 0, 0.02); if (sb) { piv.add(sb); sb.position.set(0, 0, -0.02); sb.rotation.y = Math.PI; }
    k.each((t) => { const u = tFlip != null ? tw(t, tFlip, tFlip + 500, "io") : 0; piv.rotation.x = 0; piv.rotation.y = Math.PI * u; g.visible = o.from == null || t >= o.from; if (o.back != null) piv.rotation.y = Math.PI * (u - tw(t, o.back, o.back + 500, "io")); /* v1.7 (pre-read S1 0050, K 40 f369 to f378): the two back-to-back boards z-fought at a distance; only the face turned to us draws once the flip is past half way */ if (sb) { const f = Math.abs(Math.cos(piv.rotation.y)); const front = Math.cos(piv.rotation.y) >= 0; sa.visible = front || f < 0.2; sb.visible = !front || f < 0.2; } });
    return g;
  };
})();
// ---------------------------------------------------------------- v1.6 additions (rings, centred labels, overlays)
(function () {
  const E = window.SE, T = THREE, P = KIT.parts, tw = FILM.tw;
  // a ring on the floor round a thing: refusal red from tRed, green from tGreen (5A: the tile and the agent it points at)
  E.ring = function (k, follow, o) {
    const red = new T.MeshStandardMaterial({ color: 0xc8372d, emissive: 0xc8372d, emissiveIntensity: 0.35, roughness: 0.6 });
    const m = new T.Mesh(new T.TorusGeometry(o.r || 0.55, 0.05, 10, 48), red); m.rotation.x = Math.PI / 2; k.scene.add(m);
    k.each((t) => { const p = typeof follow === "function" ? follow(t) : follow; m.position.set(p.x, p.y + 0.04, p.z);
      const on = t >= o.tRed && (o.tOff == null || t < o.tOff); m.visible = on; const g = o.tGreen != null && t >= o.tGreen;
      const gu = o.tGreen != null ? tw(t, o.tGreen, o.tGreen + 450, "sine") : 0; red.color.setHex(0xc8372d).lerp(new T.Color(0xE8A200), gu); red.emissive.copy(red.color); /* red to green over 300 ms (pre-read 2310) */ m.scale.setScalar(on ? FILM.E.back(Math.min(1, (t - o.tRed) / 400)) * (o.tOff != null ? Math.max(0.001, 1 - tw(t, o.tOff - 300, o.tOff, "io")) : 1) : 1); }); // shrinks away over 300 ms before tOff (pre-read 2355)
    return m;
  };
  // a label centred straight above a world point, with a vertical leader (S1)
  E.above = function (k, t0, o) {
    const ui = document.getElementById("ui"), d = document.createElement("div"), ln = document.createElement("div");
    d.className = "abs pin w"; d.innerHTML = o.text; d.style.position = "absolute"; d.style.textAlign = "center"; ui.appendChild(d);
    ln.style.cssText = "position:absolute;width:3px;background:#111418;"; ui.appendChild(ln);
    FILM._post.push((t) => { const v = tw(t, t0, t0 + 400, "outExpo") * (o.t1 != null ? 1 - tw(t, o.t1 - 250, o.t1) : 1); if (v <= 0) { d.style.visibility = ln.style.visibility = "hidden"; return; }
      const a = KIT.render.project(o.at), w = d.offsetWidth, h = d.offsetHeight, y = a.y - o.dy;
      d.style.visibility = ln.style.visibility = "visible"; d.style.opacity = ln.style.opacity = v;
      d.style.left = "0px"; d.style.top = "0px"; d.style.transform = `translate(${Math.max(96, Math.min(1824 - w, a.x - w / 2))}px,${y - h - 6 + 16 * (1 - v)}px)`;
      ln.style.left = a.x - 1.5 + "px"; ln.style.top = y + "px"; ln.style.height = Math.max(0, a.y - y - 8) + "px"; if (o.noLead) ln.style.visibility = "hidden"; });
  };
  // overlays in W (VL 14.14, 9.11): while an overlay rect holds, docked labels under it go to 0, the rest of its side to 20%
  E.overlays = [];
  E.overlay = (rect, side, ta, tb) => E.overlays.push({ rect, side, ta, tb });
})();
// ---------------------------------------------------------------- v0.3 helpers: a left-column pin (x 96 to 300), room z marks
(function () {
  const E = window.SE, T = THREE, tw = FILM.tw;
  E.leftPin = function (k, t0, o) {
    const ui = document.getElementById("ui"), d = document.createElement("div"), ln = document.createElement("div"), dt = document.createElement("div");
    d.className = "abs pin w r"; d.innerHTML = o.text + (o.small ? `<small style="font-size:36px">${o.small}</small>` : ""); ui.appendChild(d); ln.className = "lead"; ui.appendChild(ln); dt.className = "dot"; ui.appendChild(dt);
    FILM._post.push((t) => { const v = tw(t, t0, t0 + 400, "outExpo") * (o.t1 != null ? 1 - tw(t, o.t1 - 250, o.t1) : 1);
      if (v <= 0) { d.style.visibility = ln.style.visibility = dt.style.visibility = "hidden"; return; }
      d.style.visibility = ln.style.visibility = dt.style.visibility = "visible";
      const a = KIT.render.project(o.at), w = d.offsetWidth, h = d.offsetHeight, right = o.right || 330, ly = (o.y != null ? o.y : a.y) - h / 2;
      if (o.greenAt != null) d.style.color = t >= o.greenAt && (o.greenTo == null || t < o.greenTo) ? "#001F3F" : ""; d.style.opacity = v; d.style.transform = `translate(${right - w - 24 * (1 - v)}px,${ly}px)`;
      const sx = right + 14, sy = ly + h / 2, dx = a.x - sx, dy = a.y - sy;
      ln.style.left = sx + "px"; ln.style.top = sy - 1.5 + "px"; ln.style.width = Math.hypot(dx, dy) * tw(t, t0 + 100, t0 + 600, "out") + "px"; ln.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`; ln.style.opacity = v * 0.85;
      dt.style.left = a.x + "px"; dt.style.top = a.y + "px"; dt.style.opacity = v; });
  };
  // one large "z" per room (VL note 074104 item 10), 44 px
  E.roomZ = function (k, t0, t1) { E.ORDER.forEach((n, i) => { for (let tt = t0 + i * 180; tt < t1 - 800; tt += 2600) k.fx(k, { t0: tt, kind: "z", dur: 2400, size: 64, anchor: () => E.R(n, 0.6, 1.4, -2.0) }); }); };
})();
// ---------------------------------------------------------------- v0.4: the asleep tone (VL 15.2, until the kit's C.asleep)
// The crowd's coral body material is cloned per crowd and lerped to #F5B298 between t0 and t1 (and back from t2 to t3).
(function () {
  const E = window.SE, T = THREE, tw = FILM.tw;
  E.pale = function (k, C, t0, dur, back) {
    const coral = new T.Color(0xf06e42), pale = new T.Color(0xf5b298), mats = [];
    C.grp.children.forEach((im) => { const m = im.material; if (!m || !m.color) return; const c = m.color; if (Math.abs(c.r - coral.r) + Math.abs(c.g - coral.g) + Math.abs(c.b - coral.b) > 0.25) return;
      const mm = m.clone(); im.material = mm; mats.push({ mm, base: c.clone() }); });
    k.each((t) => { let u = tw(t, t0, t0 + (dur || 600), "io"); if (back) u *= 1 - tw(t, back, back + 600, "io"); mats.forEach((q) => q.mm.color.copy(q.base).lerp(pale, u)); });
  };
})();
// a hidden screen stays hidden: a child that sets visibility:visible shows through a hidden wrap, so display:none it too
(function () { const E = window.SE; E.hardHide = function (...scrs) { FILM._post.push(() => scrs.forEach((s) => { if (!s || !s.wrap) return; const hid = s.wrap.style.visibility === "hidden"; s.wrap.style.display = hid ? "none" : ""; if (!hid) s.wrap.style.opacity = "1"; })); }; })();
// a label centred under a world point with a short vertical leader (12 px gap to the words), clamped inside x 96 to 1824
(function () { const E = window.SE, tw = FILM.tw;
  E.below = function (k, t0, o) { const ui = document.getElementById("ui"), d = document.createElement("div"), ln = document.createElement("div");
    d.className = "abs pin w"; d.innerHTML = o.text; d.style.cssText += ";position:absolute;left:0;top:0;text-align:center"; ui.appendChild(d); ln.style.cssText = "position:absolute;width:3px;background:#111418"; ui.appendChild(ln);
    FILM._post.push((t) => { const v = tw(t, t0, t0 + 400, "outExpo") * (o.t1 != null ? 1 - tw(t, o.t1 - 250, o.t1) : 1); if (v <= 0) { d.style.visibility = ln.style.visibility = "hidden"; return; }
      const a = KIT.render.project(o.at), w = d.offsetWidth, top = a.y + (o.dy || 60); d.style.visibility = ln.style.visibility = "visible"; d.style.opacity = ln.style.opacity = v;
      d.style.transform = `translate(${Math.max(96, Math.min(1824 - w, a.x - w / 2))}px,${top}px)`; ln.style.left = a.x - 1.5 + "px"; ln.style.top = a.y + 6 + "px"; ln.style.height = Math.max(0, top - a.y - 18) + "px"; }); };
})();
// a full agent's body goes to the asleep tone (or back), so a visible agent can sleep and wake like the crowd (VL 15.2)
(function () { const E = window.SE, T = THREE, tw = FILM.tw;
  E.paleAgent = function (k, a, keys, dur) { const coral = new T.Color(0xf06e42), pale = new T.Color(0xf5b298), mats = [];
    a.root.traverse((m) => { if (!m.isMesh || !m.material || !m.material.color) return; const c = m.material.color; if (Math.abs(c.r - coral.r) + Math.abs(c.g - coral.g) + Math.abs(c.b - coral.b) > 0.25) return; const mm = m.material.clone(); m.material = mm; mats.push({ mm, base: c.clone() }); });
    // keys: [[t, 0|1], ...] 1 = pale; eased 500 ms between
    k.each((t) => { let v = keys[0][1]; for (let i = 1; i < keys.length; i++) if (t >= keys[i][0]) v = FILM.lerp(keys[i - 1][1], keys[i][1], tw(t, keys[i][0], keys[i][0] + (dur || 500), "sine")); mats.forEach((q) => q.mm.color.copy(q.base).lerp(pale, v)); }); };
})();
// ---------------------------------------------------------------- v1.0 (16:40Z): a flat mouth for a stopped agent (lead 105017,
// rulings 87 e and 95): the mark's layout (663 x 258, the two dots at the top corners) with a straight mouth in place of the
// smile. E.flatMouth(k, agent, [[t0, t1], ...]): the agent's own face material, flat inside each window, the mark outside.
(function () {
  const E = window.SE, T = THREE; let flatTex = null;
  function flat() {
    if (flatTex) return flatTex;
    const c = document.createElement("canvas"); c.width = 663; c.height = 258; const g = c.getContext("2d");
    g.fillStyle = g.strokeStyle = "#0b1a3f"; g.lineCap = "round";
    [[66, 62], [597, 62]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 46, 0, 2 * Math.PI); g.fill(); });
    g.lineWidth = 20; g.beginPath(); g.moveTo(200, 196); g.lineTo(463, 196); g.stroke();
    flatTex = new T.CanvasTexture(c); flatTex.colorSpace = T.SRGBColorSpace; flatTex.anisotropy = 8; return flatTex;
  }
  E.flatMouth = function (k, a, wins) {
    const dec = a.spr && a.spr.userData && a.spr.userData.decal; if (!dec) { console.error("flatMouth: no decal on " + a.name); return; }
    const m0 = dec.material, m1 = m0.clone(); m1.map = flat(); m1.needsUpdate = true;
    k.each((t) => { dec.material = wins.some(([t0, t1]) => t >= t0 && (t1 == null || t < t1)) ? m1 : m0; });
  };
})();
// ---------------------------------------------------------------- v1.0 (17:10Z): E.evenFlow, a line of people whose arrivals at
// the path's end are evenly spaced (pre-read E1/E2 checks 4: clumps at the door). KIT.people's flow varies each walk's length by
// 0.92 to 1.08 (noise(j, 23)); this inverts that exact formula so each person reaches the door on its own beat.
// E.evenFlow(L, { from, path, arrivals: [ms...], j0, speed }): j0 = the flow's emission count so far (0 for a fresh k.people).
(function () {
  const E = window.SE;
  E.evenFlow = function (L, o) {
    const from = o.from, path = o.path, speed = o.speed || 1.2; let len = 0, prev = [from[0], from[2]];
    for (const q of path) { len += Math.hypot(q[0] - prev[0], q[1] - prev[1]); prev = q; }
    const mean = (len / speed) * 1000, arr = o.minEmit == null ? o.arrivals : o.arrivals.filter((a) => a - mean * 0.92 >= o.minEmit); // v1.1: minEmit, nobody walks in before it
    let j = o.j0 || 0; const times = arr.map((a) => { const tr = Math.round((len / speed) * 1000 * (0.92 + 0.16 * FILM.noise(j++, 23))); return a - tr; });
    return L.flow(Math.min(...times), 1, { from, path, times, jitter: 0, speed });
  };
})();
// ---------------------------------------------------------------- v1.1 (17:30Z): closed eyes on a full agent while it sleeps,
// the crowd's asleep face (kit crowd.js closedEyes: two flat arcs, the smile kept), so a sleeping full agent matches its floor.
(function () {
  const E = window.SE, T = THREE; let tex = null;
  function closed() {
    if (tex) return tex;
    const c = document.createElement("canvas"); c.width = 663; c.height = 258; const g = c.getContext("2d");
    g.strokeStyle = "#0b1a3f"; g.lineCap = "round"; g.lineWidth = 18;
    g.beginPath(); g.moveTo(108, 118); g.bezierCurveTo(170, 250, 495, 250, 556, 118); g.stroke();
    g.lineWidth = 22; [[66, 70], [597, 70]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y - 22, 50, Math.PI * 0.2, Math.PI * 0.8); g.stroke(); });
    tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 8; return tex;
  }
  // E.closedEyes(k, agent, [[t0, t1], ...]): eyes closed inside each window (t1 null: to the end)
  E.closedEyes = function (k, a, wins) {
    const dec = a.spr && a.spr.userData && a.spr.userData.decal; if (!dec) { console.error("closedEyes: no decal on " + a.name); return; }
    const m0 = dec.material, m1 = m0.clone(); m1.map = closed(); m1.needsUpdate = true;
    k.each((t) => { dec.material = wins.some(([t0, t1]) => t >= t0 && (t1 == null || t < t1)) ? m1 : m0; });
  };
})();
// ---------------------------------------------------------------- v1.2 (18:05Z): the recap frame (VL 15.75, ruling 106 f) for R0
// and R1's last frame. The building at 1.25 times its W-centre size, centred, its base at y 915 so the throughline fits the band
// under it; the ten names only (44 px, no small lines), five each side, each 60 px clear of the building, leaders level or
// rising, arriving one at a time 300 ms apart. E.recapView() -> the camera pose; E.recap(k, t0, {t1, stagger, order}) -> docks.
(function () {
  const E = window.SE, T = THREE;
  const camOf = (P) => { const yw = P.yaw * Math.PI / 180, pt = P.pitch * Math.PI / 180, lk = new T.Vector3(...P.look);
    const pos = lk.clone().addScaledVector(new T.Vector3(Math.sin(yw) * Math.cos(pt), -Math.sin(pt), Math.cos(yw) * Math.cos(pt)), P.dist);
    const c = new T.PerspectiveCamera(20, 1920 / 1080, 0.1, 500); c.position.copy(pos); c.lookAt(lk); c.updateMatrixWorld(true); c.updateProjectionMatrix(); return c; };
  const proj = (c, v) => { const q = new T.Vector3(...v).project(c); return { x: (q.x + 1) * 960, y: (1 - q.y) * 540 }; };
  const CORNERS = []; [-6.55, 6.55].forEach((x) => [3.6, -9.96].forEach((y) => [0.2, -6.2].forEach((z) => CORNERS.push([x, y, z]))));
  let VIEW = null; const TOPS = [[-3.8, 5.6, -1.0], [3.8, 5.6, -1.0]]; // the roof plaque's top corners (E.roofSign: y 3.0 + 0.95 + 1.6)
  E.recapView = function () {
    if (VIEW) return VIEW;
    // as large as fits, up to 1.25 times W-centre: the plaque's top (y 5.6) at y 70 or lower, the base at y 915
    const P = { look: [0, -3.4, -2.2], dist: 62 / 1.25, yaw: -14, pitch: -12 }, K = (d) => 1 / (1080 / (2 * d * Math.tan(10 * Math.PI / 180)));
    const ext = () => { const c = camOf(P), ps = TOPS.concat(CORNERS).map((q) => proj(c, q)); return { top: Math.min(...ps.map((p) => p.y)), base: Math.max(...CORNERS.filter((q) => q[1] < -9).map((q) => proj(c, q).y)), xs: ps.map((p) => p.x) }; };
    for (let i = 0; i < 60; i++) { const e = ext(), span = e.base - e.top, want = 915 - 70;
      if (span > want + 2) P.dist *= span / want; else if (span < want - 2 && P.dist > 62 / 1.25 + 0.01) P.dist = Math.max(62 / 1.25, P.dist * span / want);
      const e2 = ext(); P.look[1] -= (e2.base - 915) * K(P.dist); if (Math.abs(e2.base - 915) < 2 && e2.base - e2.top <= want + 2) break; }
    const e = ext(), cx = (Math.min(...e.xs) + Math.max(...e.xs)) / 2; P.look[0] += (cx - 960) * K(P.dist);
    VIEW = P; return P;
  };
  const L = [["slack", "Slack, Notion", [-3.0, 0.6, -3.2], "west"], /* dots on chests, not heads (v2-check 225933) */ ["webhook", "a webhook", [E.BOX[0], 0.4, E.BOX[2]], "west"],
    ["bead", "beads", [-6.0, -2.3, -0.6], "west"], ["hook", "hooks", [-6.0, -4.8, -0.6], "west"], ["judge", "evals", [-6.0, -8.0, -0.6], "west"],
    ["people", "your people", [3.5, 1.1, -2.6], "east"], ["operator", "an operator", [E.HATCH[0], 0.7, E.HATCH[2]], "east"] /* on the person at the hatch (ruling 116 item 4) */,
    ["skill", "skills", [3.85, -1.9, -5.0], "east"], ["store", "the note taker", [3.05, -5.6, -4.6], "east"], ["teams", "agent teams", [3.05, -8.85, -4.0], "east"]];
  E.recap = function (k, t0, o) {
    o = o || {}; const P = E.recapView(), c = camOf(P), xs = CORNERS.map((q) => proj(c, q).x), x0 = Math.min(...xs), x1 = Math.max(...xs);
    const H = 56, GAP = 66, out = {};
    ["west", "east"].forEach((side) => {
      const rows = L.filter((q) => q[3] === side).map((q) => ({ q, ay: proj(c, q[2]).y })).sort((a, b) => b.ay - a.ay);
      let prev = 1e9; rows.forEach((r) => { r.cy = Math.min(r.ay, prev - GAP); prev = r.cy; });
      const lift = Math.max(0, 54 + H / 2 - rows[rows.length - 1].cy); rows.forEach((r) => (r.cy += lift)); // keep the top one inside y 54
      if (side === "east" && o.eastTop != null) { const top = Math.min(...rows.map((r) => r.cy)) - H / 2, dn = Math.max(0, o.eastTop - top); rows.forEach((r) => (r.cy += dn)); } // room for "how it could work" (VL 15.79)
      rows.forEach((r) => { r.side = side; });
      out[side] = rows;
    });
    const order = o.order || ["slack", "webhook", "bead", "hook", "judge", "people", "operator", "skill", "store", "teams"];
    const docks = {};
    order.forEach((id, i) => { const r = out.west.concat(out.east).find((z) => z.q[0] === id); if (!r) return;
      docks[id] = k.ui.dock(t0 + i * (o.stagger == null ? 300 : o.stagger), { text: r.q[1], small: "", at: new T.Vector3(...r.q[2]), side: r.side, t1: o.t1,
        x: r.side === "west" ? Math.round(x0 - 104) : Math.round(x1 + 84), /* 60 px clear at the leader end too (pre-read 2130) */ y: Math.round(r.cy - H / 2) }); });
    return docks;
  };
})();
// ---------------------------------------------------------------- v1.3 (18:25Z): R1's end state, for S1's first frame (ruling 108 item 2):
// the green route fully drawn with its six dots, the newcomer lit on its white disc in the hooks room, the green rail, the
// officer in the pavilion. All of it goes over [tA, tB]: the route, dots and rail fade, the newcomer pales and closes its eyes.
(function () {
  const E = window.SE, T = THREE, P = KIT.parts, tw = FILM.tw;
  E.r1Tail = function (k, tA, tB) {
    const y1 = -3.2, y2 = -6.4, y3 = -9.6, zc = 0.12, off = [-3.0, 0, -2.45];
    const route = [[E.BOX[0], 0.3, zc], [E.WF, 0.3, zc], [E.WF, y1 + 0.15, zc], [-4.4, y1 + 0.15, zc], [-3.05, y1 + 0.15, zc], [0, y1 + 0.15, zc], [3.0, y1 + 0.15, zc], [1.0, y1 + 0.15, zc], [1.0, y2 + 0.15, zc], [3.05, y2 + 0.15, zc], [0, y2 + 0.15, zc], [-3.05, y2 + 0.15, zc],
      [-1.0, y2 + 0.15, zc], [-1.0, y3 + 0.15, zc], [-3.05, y3 + 0.15, zc], [E.WF, y3 + 0.15, zc], [E.WF, 0.3, zc], [off[0], 0.3, zc]];
    const curve = new T.CurvePath(); for (let i = 1; i < route.length; i++) curve.add(new T.LineCurve3(new T.Vector3(...route[i - 1]), new T.Vector3(...route[i])));
    const gm = new T.MeshBasicMaterial({ color: 0xE8A200, transparent: true }); const tube = new T.Mesh(new T.TubeGeometry(curve, 600, 0.085, 8, false), gm); k.scene.add(tube);
    const dots = [[-3.05, y1], [3.0, y1], [3.05, y2], [-3.05, y2], [-3.05, y3], [off[0], 0]].map(([x, yy]) => { const d = new T.Mesh(new T.SphereGeometry(0.15, 16, 12), gm); d.position.set(x, yy + 0.15, zc + 0.02); k.scene.add(d); return d; });
    const railM = new T.MeshStandardMaterial({ color: 0xE8A200, roughness: 0.6, transparent: true }); const rail = P.rbox(1.8, 0.14, 0.14, railM, 0.06, 0.03); rail.position.set(-3.05, y2 + 0.9, -1.85); k.scene.add(rail);
    const nc = k.agent({ at: [-3.05, y2, -1.3], face: 0.0, name: "newcomer" }); if (window.SA && window.SA.badge) window.SA.badge(k, nc);
    E.paleAgent(k, nc, [[0, 0], [tA, 1]], tB - tA); E.closedEyes(k, nc, [[tB, null]]); nc.act(tB, "sleep");
    const discM = P.mat("white").clone(); discM.transparent = true; const disc = new T.Mesh(new T.CircleGeometry(0.62, 40), discM); disc.rotation.x = -Math.PI / 2; disc.position.set(-3.05, y2 + 0.012, -1.3); k.scene.add(disc);
    k.person({ at: [off[0], 0, -2.1], face: 0 }).pose(-2000, "hand-up"); /* v1.3: R1's officer now stands on the kit desk person's spot */ // faces us, as R1 turned it // up at frame 0, as R1 ends
    k.each((t) => { const v = 1 - tw(t, tA, tB); gm.opacity = v; railM.opacity = v; discM.opacity = v; tube.visible = rail.visible = disc.visible = v > 0.001; dots.forEach((d) => (d.visible = v > 0.001)); });
    return { nc };
  };
})();
// ---------------------------------------------------------------- v1.4 (19:40Z): the note taker after 5Dd, asleep in the pavilion
// (R0 puts it to sleep as the line leaves; R1 and S1 carry it pale with closed eyes, so the cuts R0 to R1 to S1 match)
(function () {
  const E = window.SE, T = THREE;
  E.ntAsleep = function (k, Wb, from) {
    const lp = Wb.parts.laptops[1].getWorldPosition(new T.Vector3()), NT = [lp.x - 1.3, 0, lp.z + 2.1];
    const a = k.agent({ at: NT, face: 0.1, name: "notetaker-asleep" }); a.act(from == null ? -1000 : from, "sleep");
    E.paleAgent(k, a, [[0, from == null ? 1 : 0], [from == null ? 0 : from, 1]], 600); E.closedEyes(k, a, [[(from == null ? -1e9 : from + 600), null]]);
    return a;
  };
})();
