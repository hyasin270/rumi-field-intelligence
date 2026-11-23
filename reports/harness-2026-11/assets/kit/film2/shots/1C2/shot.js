// 1C2 (v2-shots-b). BUILT FILE: edit outputs/lanes/v2-shots-b/tools/src/1C2.js and lib.js, then run tools/build.py.
// words v1.6a FROZEN (11 Nov 2026, 18:08Z: one word, "the", added in 5D.3 on `v2-check`'s ear note, board 20261111T180651_v2-check_pass.md, so the row is not heard as taking back 5D.2's list; old script tools/words_v2.v1.6.py). v1.6 (11 Nov 2026, 18:05Z; ruling 107 in FILM_V2_PLAN section 5, after three cold viewers watched Cut 0, `outputs/lanes/v2-cold/COLD_cut0.md`: T2 gains two rows that say what goes wrong on day one, in the words the stages use later; T3c.2 says teachers and the team know it by one name; 5.0.1 loses its preview sentence; 5D.3 says the privacy line; R1.6 says the line that stood under the second run; rests changed after T2.1 and R1.5; old script tools/words_v2.v1.5.py. Before that, v1.5: ruling 65 in FILM_V2_PLAN section 5: one word added in 5D.2, "each team meeting", because the brief is written for internal meetings only, `v2-check` WORDS_CHECK_v1.4, board 20261111T104724_v2-check_answer.md. Before that, v1.4: ruling 63 in FILM_V2_PLAN section 5: the operator pointed us at the note taker's code, so old rows 5D.2 and 5D.3 become three, 5D.2 to 5D.4, with the brief before the meeting and the raised hand; old 5D.4 and 5D.5 are now 5D.5 and 5D.6, words unchanged; board 20261111T104119_COS_answer.md. Before that, v1.3: ruling 61 in FILM_V2_PLAN section 5. From v1.2: the two 5D rows are replaced by five and the rest after 5C.2 is 2.0 s, because the operator said on 11 Nov that the note taker now speaks in meetings, live, and asked for reactive to proactive to be emphasised (board 20261111T102658_COS_answer.md). No other row changed. Any later change is a numbered ruling) · built 2026-11-11T22:05Z
var ROWS = {"1C2.1": "Putting untested work live. Telling a whole region about an outage. Letting internal details slip into a message."};
// S1: stage 1 helpers (v2-shots-b). Inlined into every stage-1 shot.js by tools/build.py (never edit a built shot.js).
// Everything here is a pure function of t (kit API section 1). Rooms, crowd state and props follow BLOCKING.md.
var S1 = (function () {
  "use strict";
  const T = THREE, P = KIT.parts, tw = FILM.tw, lerp = FILM.lerp, clamp01 = FILM.clamp01, noise = FILM.noise, halton = FILM.halton;
  const FH = 3.2, RX = 3.05;
  // room centres in world space (set.js ROOMS): floor y, side x
  const ROOMS = { board: [1, -1], skills: [1, 1], gates: [2, -1], store: [2, 1], judge: [3, -1], teams: [3, 1] };
  const ORDER = ["board", "skills", "gates", "store", "judge", "teams"];
  const roomY = (n) => -ROOMS[n][0] * FH;
  const roomX = (n) => ROOMS[n][1] * RX;
  // a point in a room: local [x, y, z] (x from the room centre, y from its floor, z world depth)
  const R = (n, x, y, z) => new T.Vector3(roomX(n) + x, roomY(n) + y, z);
  const area = (n) => { const sd = ROOMS[n][1]; return { x0: sd < 0 ? -5.7 : 0.45, x1: sd < 0 ? -0.45 : 5.7, z0: -5.3, z1: -0.6, y: roomY(n) }; };

  let TIMING_ = null;
  function timingRow(id) {
    if (TIMING_ === null) { try { const x = new XMLHttpRequest(); x.open("GET", "../timing.json", false); x.send(); TIMING_ = x.status === 200 || x.status === 0 ? JSON.parse(x.responseText) : {}; } catch (e) { TIMING_ = {}; } }
    return (TIMING_.rows || []).find((r) => r.id === id) || null;
  }
  // ------------------------------------------------------------ word-anchored time (VL 6.6: lead the word by ~200 ms)
  // ROWS is injected by build.py from design/WORDS_v2.rows.json: { "1A3.1": "If two reach ..." }
  function at(k, rowId, word, lead) {
    lead = lead == null ? 200 : lead;
    // the phrase's first word, at its occurrence in the row (k.word returns the first match of a single word)
    let w = null;
    if (word) { const text = (ROWS[rowId] || "").toLowerCase(), i = text.indexOf(String(word).toLowerCase()), first = String(word).split(/\s+/)[0];
      const nth = i < 0 ? 0 : (text.slice(0, i).match(new RegExp("\\b" + first.toLowerCase().replace(/[^a-z0-9]/g, ""), "g")) || []).length;
      w = nth === 0 ? k.word(rowId, first) : (k.words ? k.words(rowId, first, nth) : null); }
    const r = k.row(rowId);
    if (w != null) return Math.max(0, w - lead);
    if (!r) return 0;
    const text = (ROWS[rowId] || ""), i = word ? text.toLowerCase().indexOf(String(word).toLowerCase()) : 0;
    const f = i < 0 ? 0 : i / Math.max(1, text.length);
    return Math.max(0, r.start + f * r.dur - lead);
  }
  // the end of a word (for name cards: + 50 ms after the name ends, VL 6.6)
  function after(k, rowId, word) {
    const r = k.row(rowId); if (!r) return 0;
    const text = (ROWS[rowId] || ""), lo = text.toLowerCase(), i = lo.lastIndexOf(String(word).toLowerCase());
    // the narration's own name_end (timing.json rows[].name_end, film seconds) + 50 ms (VL 6.6); read once, synchronously
    const TR = timingRow(rowId);
    if (TR && TR.name_end != null && TR.name && TR.name.toLowerCase().endsWith(String(word).toLowerCase())) return TR.name_end * 1000 - (TR.start * 1000 - r.start) + 50;
    if (TR && TR.words && TR.words.length) { const lw = String(word).split(/\s+/).pop().toLowerCase();
      for (let j = TR.words.length - 1; j >= 0; j--) { const x = TR.words[j]; if (String(x.w).toLowerCase().replace(/[^a-z0-9']/g, "") === lw.replace(/[^a-z0-9']/g, "")) return x.end * 1000 - (TR.start * 1000 - r.start) + 50; } }
    // a name that ends its row ends when the row's speech ends
    if (i >= 0 && lo.slice(i + word.length).replace(/[^a-z0-9]/g, "") === "") return r.end + 50;
    // otherwise: the start of the next spoken word
    const rest = text.slice(i + word.length).trim().split(/\s+/)[0] || "";
    const wNext = rest ? k.word(rowId, rest) : null;
    if (wNext != null) return wNext;
    const f = i < 0 ? 1 : (i + word.length) / Math.max(1, text.length);
    return r.start + f * r.dur + 50;
  }

  // ------------------------------------------------------------ the building, fitted as the story has it
  // fitted: { board: t, skills: t, gates: t } (-1e9 = before this shot). Bare rooms stay unlit.
  function world(k, fitted) {
    const names = Object.keys(fitted || {});
    const Wb = k.set.building({ fitted: names.filter((n) => fitted[n] < 0) });
    names.forEach((n) => { if (fitted[n] >= 0) Wb.install(n, fitted[n]); });
    if (Wb.parts && Wb.parts.board) { snip("claim_ease", ["claimEase"]); window.claimEase(Wb.parts.board, { ms: 300 }); }   // v2-kit 195510
    return Wb;
  }
  // the three doors in B2 west stand bare before the rail is installed (BLOCKING 1C1): show the doors always,
  // let only the rail lower in. Call after world(); evaluated after the building's own eval.
  function doorsAlways(k, Wb) {
    const doors = Wb.parts.doors || [];
    k.each(() => doors.forEach((d) => { d.visible = true; d.position.y = d.userData.y0; }));
    return doors;
  }

  // ------------------------------------------------------------ the 300 (VL 5.3, 14.5): 50 a room on a grid of 8 x 7 cells
  // (0.66 x 0.67 m, so never closer than 0.62 m). Bare rooms mill in place (headings turn, a small sway); fitted rooms face front.
  // o.clear: [{room, x0, x1, z0?, z1?, to?}] world boxes kept free for the hero in an S shot (VL 5.3: 1.2 m clear). A member
  // whose cell is in a box is out of the frame while the box holds; at c.to it walks back in from the room's open front (VL 6.2).
  // o.avoid: furniture boxes for the kit's separation. Every member's place is a pure function of (i, t).
  function crowd(k, Wb, o) {
    o = o || {};
    const C = k.crowd(300, { seed: 7, avoid: o.avoid || [] });
    const fitted = o.fitted || {};
    const COLS = 8, ROWS = 7;
    const perm = {}; // a fixed shuffle of the 56 cells for each room
    ORDER.forEach((n, r) => { perm[n] = Array.from({ length: COLS * ROWS }, (_, c) => c).sort((p, q) => noise(p, 300 + r) - noise(q, 300 + r)); });
    const cellXZ = (n, c) => { const a = area(n), sx = (a.x1 - a.x0) / COLS, sz = (a.z1 - a.z0) / ROWS, r = Math.floor(c / COLS), cc = c % COLS;
      return { x: a.x0 + sx / 2 + cc * sx, z: a.z1 - sz / 2 - r * sz }; };
    const inBox = (c, x, z) => x > c.x0 && x < c.x1 && (c.z0 == null || z > c.z0) && (c.z1 == null || z < c.z1);
    const stepCache = new Map();
    function stepMember(st) {
      const key = st.room + st.near.join(","); if (stepCache.has(key)) return stepCache.get(key);
      let best = -1, bd = 1e9; for (let i = 0; i < 300; i++) { if (ORDER[i % 6] !== st.room) continue; const c = cellXZ(st.room, perm[st.room][Math.floor(i / 6)]);
        const d = Math.hypot(c.x - st.near[0], c.z - st.near[1]); if (d < bd) { bd = d; best = i; } }
      stepCache.set(key, best); return best;
    }
    C.at = function (i, t) {
      const n = ORDER[i % 6], j = Math.floor(i / 6), a = area(n);
      const cell = cellXZ(n, perm[n][j]);
      let x = cell.x + 0.05 * (noise(i, 21) - 0.5), z = cell.z + 0.05 * (noise(i, 22) - 0.5), y = a.y;
      const s = t / 1000, p1 = 6.283 * noise(i, 13), w1 = 0.25 + 0.3 * noise(i, 11);
      // mill: the heading wanders over the whole circle, a small sway (bodies keep their gaps)
      let yaw = 3.2 * Math.sin(w1 * s * 0.6 + p1) + 1.4 * Math.sin(0.37 * s + 2 * p1), moving = true;
      x += 0.04 * Math.sin(w1 * s + p1); z += 0.03 * Math.sin(0.8 * w1 * s + 2 * p1); y += 0.03 * Math.abs(Math.sin(s * 4 + p1));
      const tf = fitted[n];
      if (tf != null && t >= tf) {
        const pp = { board: [-3.05, -5.6], skills: [3.85, -5.4], gates: [-3.05, -5.6], store: [3.05, -5], judge: [-3.05, -4.1], teams: [3.05, -4] }[n];
        const d = Math.hypot(cell.x - pp[0], cell.z - pp[1]) * 110, u = tf < 0 ? 1 : tw(t, tf + 200 + d, tf + 1400 + d, "io");
        x = lerp(x, cell.x, u); z = lerp(z, cell.z, u); y = lerp(y, a.y, u); yaw = lerp(yaw, 0.25 * (noise(i, 42) - 0.5), u); moving = u < 1;
      }
      // ruling 103 / VL 15.71: a room's crowd changes only across a cut or while out of frame. A clear box hides its members
      // from c.from (default always) until c.to (default never); nobody is ever seen to walk out or back in.
      let vis = true;
      for (const c of o.clear || []) {
        if (c.room !== n || !inBox(c, cell.x, cell.z)) continue;
        if ((c.from == null || t >= c.from) && (c.to == null || t < c.to)) { vis = false; break; }
      }
      // VL 15.71 item 4/5: the one member who steps out of its lane into the aisle before a cut in (dir +1), or back to its
      // slot after a cut out (dir -1), 0.6 s, one step; o.steps: [{room, near: [x, z], aisle: [x, z], t0, dir}]
      for (const st of o.steps || []) {
        if (st.room !== n || stepMember(st) !== i) continue;
        const u = st.dir > 0 ? tw(t, st.t0, st.t0 + 600, "io") : 1 - tw(t, st.t0, st.t0 + 600, "io");
        if (u > 0) { x = lerp(x, st.aisle[0], u); z = lerp(z, st.aisle[1], u); yaw = lerp(yaw, st.face || 0, u); moving = moving || (u > 0 && u < 1); }
      }
      return { x, y, z, yaw, vis, moving };
    };
    return C;
  }
  // a kit part placed in the world (k.set.part does not place; VL parts are 1:1 with the model's scale)
  function part(k, name, at, opts) {
    const p = k.set.part(name, opts || {}); p.position.set(at[0], at[1], at[2]); if (opts && opts.face) p.rotation.y = opts.face;
    k.scene.add(p); k.scene.updateMatrixWorld(true); return p;
  }
  // the rail in B2 west turns refusal red when it refuses and back to green as "Do this instead" arrives (ruling 40)
  function railColour(k, Wb, tRed, tGreen) {
    const rail = Wb.parts.gate; if (!rail) return;
    const m = rail.material.clone(); rail.material = m; const G = new THREE.Color(0xE8A200), Rd = new THREE.Color(0xc8372d);
    k.each((t) => { const u = (tRed == null ? 0 : tw(t, tRed, tRed + 250)) * (tGreen == null ? 1 : 1 - tw(t, tGreen, tGreen + 600, "io")); m.color.copy(G).lerp(Rd, u); });
  }

  // ------------------------------------------------------------ props
  const pageMat = () => P.mat("card");
  // a folder that two can hold, and that tears in two at tTear (1A1)
  function tearFolder(k, parent, at, tTear, aSide, bSide) {
    const g = new T.Group(); parent.add(g); g.position.copy(at);
    const L = P.add(g, P.rbox(0.26, 0.34, 0.05, P.mat("paper"), 0.03, 0.012), -0.13, 0, 0);
    const Rr = P.add(g, P.rbox(0.26, 0.34, 0.05, P.mat("paper"), 0.03, 0.012), 0.13, 0, 0);
    k.each((t) => {
      const shake = t < tTear ? 0.03 * Math.sin(t / 70) * tw(t, tTear - 1600, tTear - 1300) : 0;
      g.position.set(at.x + shake, at.y, at.z);
      const u = tw(t, tTear, tTear + 420, "out"), f = tw(t, tTear + 500, tTear + 1100, "in");
      L.position.set(-0.13 - 0.45 * u, -f * (at.y - 0.03 - aSide), 0); L.rotation.z = 0.5 * u + 1.2 * f;
      Rr.position.set(0.13 + 0.45 * u, -f * (at.y - 0.03 - bSide), 0); Rr.rotation.z = -0.5 * u - 1.2 * f;
    });
    return g;
  }
  // binders landing on a desk one by one, then spilling off the far edge (1B2)
  function stack(k, parent, top, o) {
    const g = new T.Group(); parent.add(g); const items = [];
    const n = o.n || 9, h = 0.15;
    for (let i = 0; i < n; i++) {
      const w = 0.5 + 0.12 * noise(i, 3), d = 0.36 + 0.06 * noise(i, 4);
      const m = P.add(g, P.rbox(w, h, d, P.mat(i % 3 === 1 ? "paper" : "card"), 0.03, 0.02), 0, 0, 0);
      items.push({ m, t0: o.t0 + i * (o.gap || 330), y: top.y + h / 2 + i * h, x: top.x + 0.05 * (noise(i, 5) - 0.5), z: top.z + 0.04 * (noise(i, 6) - 0.5), r: 0.25 * (noise(i, 7) - 0.5) });
    }
    k.each((t) => items.forEach((it, i) => {
      const u = tw(t, it.t0, it.t0 + 380, "in"), vis = t >= it.t0;
      it.m.visible = vis; if (!vis) return;
      let x = it.x, y = lerp(it.y + 2.4, it.y, u), z = it.z, rz = it.r * (1 - u) * 3, rx = 0;
      // the desk bows: the stack sinks a little when full
      y -= 0.04 * tw(t, o.t0 + n * (o.gap || 330) - 400, o.t0 + n * (o.gap || 330));
      // spill: the top few slide off the far (+x) edge and fall
      if (o.spill != null && i >= n - (o.spillN || 4)) {
        const d = (i - (n - (o.spillN || 4))) * 90, s = tw(t, o.spill + d, o.spill + d + 700, "in");
        x += 1.0 * s; y = lerp(y, top.y - 0.72 + h / 2 + 0.02 * i, s * s); rz = -1.4 * s; z += 0.3 * s * (noise(i, 9) - 0.2);
      }
      if (o.sweep != null) { const s = tw(t, o.sweep + i * 60, o.sweep + i * 60 + 500, "in"); x -= 3.0 * s; it.m.visible = s < 0.99; }
      if (o.lift != null) { const s = tw(t, o.lift + (n - 1 - i) * 70, o.lift + (n - 1 - i) * 70 + 600, "in"); y += 2.8 * s; it.m.visible = it.m.visible && s < 0.999; }   // back up where it came from
      it.m.position.set(x, y, z); it.m.rotation.set(rx, it.r, rz);
    }));
    return g;
  }
  // a slim skill folder (shared with v2-shots-d): opens at tOpen (the cover lifts)
  function skillFolder(k, parent, at, o) {
    o = o || {};
    const g = new T.Group(); parent.add(g); g.position.copy(at);
    P.add(g, P.rbox(0.46, 0.04, 0.34, P.mat("white"), 0.03, 0.012), 0, 0.02, 0);
    P.add(g, P.rbox(0.42, 0.03, 0.3, P.mat("paper"), 0.02, 0.01), 0, 0.05, 0);
    const pivot = new T.Group(); pivot.position.set(-0.23, 0.07, 0); g.add(pivot);
    const cover = P.add(pivot, P.rbox(0.46, 0.025, 0.34, P.mat("white"), 0.03, 0.01), 0.23, 0, 0);
    g.open = (t0) => { g.userData.open = t0; return g; };
    k.each((t) => { const t0 = g.userData.open; pivot.rotation.z = t0 == null ? 0 : 2.6 * tw(t, t0, t0 + 500, "out"); cover.visible = true; });
    return g;
  }
  // the layered shape (progressive disclosure; shared with v2-shots-c): levels from the top, each wider.
  // levels: [{n: 1}, {n: 7}, {n: 1, base: true}]. light(t0, path=[level, index] list, stopAt). dim(t0). lift(t0, level, index).
  function layers(k, parent, at, o) {
    o = o || {};
    const g = new T.Group(); parent.add(g); g.position.copy(at);
    const lv = o.levels || [{ n: 1, w: 0.7, h: 0.08 }, { n: 7, w: 2.2, h: 0.3 }, { n: 1, w: 2.9, h: 0.55, base: true }];
    const blocks = []; let y = 0;
    for (let L = lv.length - 1; L >= 0; L--) {
      const l = lv[L], row = [], gap = 0.05, bw = (l.w - (l.n - 1) * gap) / l.n;
      for (let i = 0; i < l.n; i++) {
        const m = new T.MeshStandardMaterial({ color: P.PAL[l.base ? "paper" : "card"], roughness: 0.8, emissive: 0xffe2a0, emissiveIntensity: 0 });
        const b = P.add(g, P.rbox(bw, l.h, 0.6 + 0.12 * (lv.length - L), m, 0.04, 0.02), -l.w / 2 + bw / 2 + i * (bw + gap), y + l.h / 2, 0);
        b.userData = { m, y0: y + l.h / 2, L, i }; row.push(b);
      }
      blocks[L] = row; y += l.h + 0.03;
    }
    g.height = y; g.blocks = blocks; const lights = [], dims = [], lifts = [];
    g.light = (t0, path, op) => { lights.push({ t0, path, step: (op && op.step) || 420, off: op && op.off }); return g; };
    g.dim = (t0, keep) => { dims.push({ t0, keep: keep || [] }); return g; };
    g.lift = (t0, L, i) => { lifts.push({ t0, L, i }); return g; };
    g.grow = (t0, dur) => { g.userData.grow = [t0, dur]; return g; };
    g.pt = (L, i) => { const b = blocks[L][i || 0]; g.updateMatrixWorld(true); return b.localToWorld(new T.Vector3(0, 0, 0.35)); };
    k.each((t) => {
      const gr = g.userData.grow; const s = gr ? tw(t, gr[0], gr[0] + gr[1], "io") : 1;
      g.visible = s > 0.001; g.scale.set(lerp(0.4, 1, s), Math.max(0.001, s), lerp(0.6, 1, s));
      blocks.forEach((row) => row.forEach((b) => {
        let e = 0;
        for (const l of lights) l.path.forEach((p, j) => { if (p[0] === b.userData.L && p[1] === b.userData.i) { const ta = l.t0 + j * l.step; e = Math.max(e, 0.9 * tw(t, ta, ta + 300, "out") * (l.off != null ? 1 - tw(t, l.off, l.off + 400) : 1)); } });
        let dm = 1; for (const d of dims) if (!d.keep.some((p) => p[0] === b.userData.L && p[1] === b.userData.i)) dm = Math.min(dm, 1 - 0.55 * tw(t, d.t0, d.t0 + 500));
        b.userData.m.emissiveIntensity = e; b.userData.m.color.setHex(P.PAL[b.userData.L === lv.length - 1 && lv[lv.length - 1].base ? "paper" : "card"]).multiplyScalar(dm);
        let ly = 0, lz = 0; for (const l of lifts) if (l.L === b.userData.L && l.i === b.userData.i) { const u = tw(t, l.t0, l.t0 + 600, "back"); ly = 0.12 * u; lz = 0.35 * u; }
        b.position.y = b.userData.y0 + ly; b.position.z = lz;
      }));
    });
    return g;
  }
  // a tower of pages rising out of a folder (1B5), and settling down at tSettle
  function tower(k, parent, at, o) {
    const g = new T.Group(); parent.add(g); g.position.copy(at);
    const n = o.n || 40, H = o.height || 3.0, pages = [];
    for (let i = 0; i < n; i++) { const m = P.add(g, P.rbox(0.42 + 0.03 * noise(i, 2), 0.05, 0.3, P.mat(i % 4 ? "card" : "paper"), 0.01, 0.008), 0, 0, 0); pages.push(m); }
    k.each((t) => {
      const u = tw(t, o.t0, o.t0 + (o.dur || 2400), "out"), sd = o.settle != null ? tw(t, o.settle, o.settle + 1100, "io") : 0;
      pages.forEach((p, i) => {
        const f = i / (n - 1), y = 0.05 + f * H * u, sway = 0.06 * f * f * Math.sin(t / 600 + i * 0.4) * u;
        p.position.set(sway + 0.04 * (noise(i, 4) - 0.5) * f, lerp(y, 0.05, sd), 0.03 * (noise(i, 5) - 0.5));
        p.rotation.y = 0.3 * (noise(i, 6) - 0.5) * f; p.visible = (u > 0.001 || i === 0) && sd < 0.98;
      });
    });
    return g;
  }
  // a small gate by the board (1C5): an arm that is down, and lifts at tLift
  function gate(k, parent, at, o) {
    const g = new T.Group(); parent.add(g); g.position.copy(at);
    P.add(g, P.rbox(0.18, 1.0, 0.18, P.mat("white"), 0.06, 0.03), 0, 0.5, 0);
    const piv = new T.Group(); piv.position.set(0, 0.82, 0); g.add(piv);
    P.add(piv, P.rbox(1.2, 0.12, 0.12, P.mat("green", { roughness: 0.6 }), 0.05, 0.03), 0.62, 0, 0);
    k.each((t) => {
      const ins = o.install != null ? tw(t, o.install, o.install + 600, "out") : 1;
      g.visible = ins > 0; g.position.y = at.y + (1 - ins) * 2.4;
      piv.rotation.z = o.lift != null ? 1.3 * tw(t, o.lift, o.lift + 450, "out") * (1 - tw(t, o.lift + 1800, o.lift + 2300)) : 0;
    });
    return g;
  }
  // a simple box prop (envelope, card, hatch) that can be carried
  function box(parent, at, w, h, d, m) { const b = P.rbox(w, h, d, P.mat(m || "card"), Math.min(w, h) * 0.15, 0.012); b.position.copy(at); parent.add(b); return b; }
  // a door leaf that swings open (the kit's door has userData.leaf; the hinge is its left edge)
  function swing(k, door, t0, dur, ang) {
    const leaf = door.userData.leaf; if (!leaf) return;
    const piv = new T.Group(), w = 0.95; piv.position.set(-w / 2, 0, leaf.position.z); door.add(piv);
    door.remove(leaf); piv.add(leaf); leaf.position.x = w / 2; leaf.position.z = 0;
    k.each((t) => { piv.rotation.y = -(ang || 1.1) * tw(t, t0, t0 + (dur || 900), "io"); });
  }
  // the skills room's desk stands before the shelf is installed (BLOCKING 1B1): keep the desk, let the shelf lower in
  function deskAlways(k, Wb) {
    const d = Wb.parts.desk; d.position.x = -0.85; k.each(() => { d.visible = true; d.position.y = d.userData.y0; }); return d;
  }
  // a stand-in for a v2-screens panel until the real screen lands: a flat white panel (VL 9.2) with lines that arrive
  function panel(k, t0, t1, o) {
    const html = `<div style="width:1150px;min-height:${o.h || 800}px;background:#fff;border-radius:26px;box-shadow:0 30px 80px rgba(60,40,10,.22),0 6px 18px rgba(60,40,10,.10);padding:56px 64px;box-sizing:border-box;font-family:'Poppins'">` +
      (o.title ? `<div style="font-size:${o.full !== false ? 48 : 36}px;font-weight:500;color:#4A5059;margin-bottom:26px">${o.title}</div>` : "") +
      o.lines.map((l, j) => `<div class="pl" data-j="${j}" style="font-size:${(l.px || 44) * (o.full !== false ? 1.45 : 1)}px;font-weight:${l.w || 500};color:${l.c || "#111418"};padding:14px 18px;border-radius:12px;margin:4px 0">${l.text}</div>`).join("") + `</div>`;
    const full = o.full !== false;
    const d = full ? (function () {
      const box = document.createElement("div"); box.className = "abs"; box.style.cssText = "width:1920px;height:1080px;transform-origin:0 0";
      box.innerHTML = html.replace("width:1150px;min-height:" + (o.h || 800) + "px", "width:1920px;height:1080px;border-radius:0;display:flex;flex-direction:column;justify-content:center").replace("padding:56px 64px", "padding:120px 260px");
      document.getElementById("ui").appendChild(box);
      // grows out of the panel rect (VL 9.3) to full frame, 450 ms; back at t1
      FILM._post.push((t) => { const g = tw(t, t0, t0 + 450, "io") * (1 - tw(t, t1 - 450, t1, "io")); const vis = t >= t0 && t <= t1;
        const x = lerp(660, 0, g), y = lerp(120, 0, g), sc = lerp(1150 / 1920, 1, g);
        box.style.visibility = vis ? "visible" : "hidden"; box.style.opacity = vis ? Math.min(1, 0.3 + 2 * tw(t, t0, t0 + 450)) * (1 - tw(t, t1 - 200, t1)) : 0;
        box.style.transform = `translate(${x}px,${y}px) scale(${sc})`; });
      return box; })() : k.ui.text(o.id || "panel", t0, t1, html, { x: o.x == null ? 660 : o.x, y: o.y == null ? 120 : o.y });
    const rows = () => d.querySelectorAll(".pl");
    FILM._post.push((t) => rows().forEach((r, j) => { const l = o.lines[j], ta = l.at == null ? t0 : l.at; const u = tw(t, ta, ta + 420, "outExpo");
      r.style.opacity = u; r.style.transform = `translateX(${24 * (1 - u)}px)`;
      const h = l.hl ? tw(t, l.hl, l.hl + 300) * (l.hlOff ? 1 - tw(t, l.hlOff, l.hlOff + 250) : 1) : 0;
      r.style.background = h > 0 ? `rgba(255,214,102,${0.28 * h})` : "transparent"; r.style.boxShadow = h > 0 ? `inset 0 0 0 3px rgba(230,180,60,${0.6 * h})` : "none"; }));
    return d;
  }
  // a 3 px green line traced once round a set of world points (1B7, "Remember this shape"; VL 8.9)
  function trace(k, t0, dur, ptsFn, t1) {
    const NS = "http://www.w3.org/2000/svg", svg = document.createElementNS(NS, "svg");
    svg.setAttribute("width", 1920); svg.setAttribute("height", 1080); svg.style.cssText = "position:absolute;left:0;top:0;overflow:visible";
    const pl = document.createElementNS(NS, "polygon"); pl.setAttribute("fill", "none"); pl.setAttribute("stroke", "#E8A200"); pl.setAttribute("stroke-width", "3"); pl.setAttribute("stroke-linejoin", "round");
    svg.appendChild(pl); document.getElementById("ui").appendChild(svg);
    FILM._post.push((t) => {
      if (t < t0 || (t1 != null && t > t1 + 400)) { svg.style.visibility = "hidden"; return; }
      svg.style.visibility = "visible";
      const ps = ptsFn().map((v) => KIT.render.project(v)); pl.setAttribute("points", ps.map((p) => p.x.toFixed(1) + "," + p.y.toFixed(1)).join(" "));
      let L = 0; for (let i = 0; i < ps.length; i++) { const a = ps[i], b = ps[(i + 1) % ps.length]; L += Math.hypot(b.x - a.x, b.y - a.y); }
      pl.setAttribute("stroke-dasharray", L); pl.setAttribute("stroke-dashoffset", L * (1 - tw(t, t0, t0 + dur, "io")));
      svg.style.opacity = t1 == null ? 1 : 1 - tw(t, t1, t1 + 400);
    });
  }
  // B2 west, the gates room (hooks): the doors stand bare from 1C1; door 0 carries the "Go live" sign (the T2 gag)
  function gatesRoom(k, Wb) {
    const doors = doorsAlways(k, Wb);
    const s = k.set.part("sign", { text: "Go live", w: 1.2, h: 0.34 });
    s.position.set(0, 2.45, 0.1); doors[0].add(s);   // ruling 113 E, 116 item 6
    return doors;
  }
  const DOORX = [-4.55, -3.05, -1.55], GY = -6.4;   // the kit's doors and rails (v0.8.1)
  // shared stage-1 constants: keep-clear boxes for S shots, and the B1 east desk
  const CLR = {
    board: [{ room: "board", x0: -6, x1: 0 }, { room: "skills", x0: 0, x1: 3.4 }],
    skills: [{ room: "skills", x0: 0, x1: 6 }, { room: "board", x0: -2.6, x1: 0 }],
    gates: [{ room: "gates", x0: -6, x1: 0 }],
  };
  const DESK = { x: 2.2, top: -2.435, z: -3.0 }, HERO_DESK = [0.8, -3.2, -2.75], DESK_AVOID = { x0: 1.3, x1: 3.1, z0: -3.5, z1: -2.5, y: -3.2 };
  const withTo = (list, to) => list.map((c) => Object.assign({ to }, c));
  const withFrom = (list, from) => list.map((c) => Object.assign({ from }, c));
  // B2 west's three doors as the kit's door2, with their signs (the building's own doors are hidden)
  function doors2(k, Wb, labels, showAt) {
    k.each(() => (Wb.parts.doors || []).forEach((d) => (d.visible = false)));
    const ds = DOORX.map((x, j) => part(k, "door2", [x, GY, -5.7], { label: labels[j], signW: 1.75, em: 0.17 }));
    snip("state_ease", ["railEase", "doorLightEase"]); window.doorLightEase(ds);   // the light changes evenly (v2-kit 180645)
    // VL 15.21: nothing black but the pavilion door; the handles are room grey
    ds.forEach((d) => d.traverse((m) => { if (m.isMesh && m.geometry && m.geometry.type === "SphereGeometry") m.material = KIT.parts.mat("grey"); }));
    // each sign arrives with its sentence (lead 083937 item 6): grows on its plate, 400 ms
    if (showAt) ds.forEach((d, j) => { const sg = d.userData.sign; if (!sg || showAt[j] == null) return; const s0 = sg.scale.clone();
      k.each((t) => { const u = tw(t, showAt[j], showAt[j] + 400, "outExpo"); sg.visible = u > 0.001; sg.scale.set(s0.x * lerp(0.6, 1, u), s0.y * lerp(0.6, 1, u), s0.z); }); });
    return ds;
  }
  // the lesson plans the newcomer carries: a few loose pages, held (VL 15.23)
  function plans(k) {
    const g = new THREE.Group(); k.scene.add(g);
    for (let i = 0; i < 5; i++) { const p = KIT.parts.rbox(0.36, 0.012, 0.27, KIT.parts.mat(i % 2 ? "paper" : "card"), 0.004, 0.004); p.position.set(0.012 * (i % 3) - 0.01, i * 0.014, 0.01 * (i % 2)); p.rotation.y = 0.05 * (i - 2); g.add(p); }
    return g;
  }
  // the gates room camera, one framing for 1C1's landing, 1C2 and 1C3 (v2-visuals 084120 item 8): carriers whole, signs inside
  // v2-check 213549 (VL 15.24): the signs are each sentence's key word, so the carriers and the door signs are both sharp at K 40:
  // focus between the carriers' plane and the door plane, at half the room's final aperture
  const gatesCam = (k) => k.cam.on(new THREE.Vector3(-3.1, GY + 1.0, -5.0), { size: "room", px: 230, pitch: -4, focus: new THREE.Vector3(-3.1, GY + 1.2, -4.3),
    aperture: ((window.CAMERA_RULES && window.CAMERA_RULES.apertureFinal && window.CAMERA_RULES.apertureFinal.room) || 0) * 0.5 });
  // a refusal mark over a head, 90 px, refusal red (ruling 45 item 5)
  function stopMark(k, t0, actor) {
    k.fx(k, { t0, kind: "stop", anchor: () => actor.head(), size: 90, dur: 1100, dy: -70, dx: 0 });
    const els = document.querySelectorAll("#fx .fxm"); const el = els[els.length - 1];
    if (el) el.querySelectorAll("circle,path").forEach((p) => { if (p.getAttribute("fill") === "#fff") p.setAttribute("fill", "#C8372D"); p.setAttribute("stroke", p.tagName === "path" ? "#fff" : "#C8372D"); });
  }
  // a white card that grows out of a world object and holds lines (1A5's card back; VL 4.6: words on their own white card)
  function backCard(k, t0, t1, from, lines, o) {
    o = o || {};
    const box = document.createElement("div"); box.className = "abs namecard"; box.style.cssText += ";padding:30px 44px";
    box.innerHTML = lines.map((l) => `<div class="pin" style="margin:8px 0">${l.html}</div>`).join("");
    document.getElementById("ui").appendChild(box);
    const rows = box.querySelectorAll(".pin");
    FILM._post.push((t) => {
      if (t < t0 || t > t1) { box.style.visibility = "hidden"; return; }
      const src = KIT.render.project(typeof from === "function" ? from() : new THREE.Box3().setFromObject(from).getCenter(new THREE.Vector3()));
      const g = tw(t, t0, t0 + 450, "io"), out = tw(t, t1 - 300, t1, "in");
      const X = Math.min(o.x || 1100, 1824 - box.offsetWidth), Y = o.y || 220;
      const x = lerp(src.x, X, g * (1 - out)), y = lerp(src.y, Y, g * (1 - out)), sc = lerp(0.15, 1, g * (1 - out));
      box.style.visibility = "visible"; box.style.opacity = Math.min(1, 3 * g) * (1 - out); box.style.transform = `translate(${x}px,${y}px) scale(${sc})`;
      rows.forEach((r, j) => { const L = lines[j], ta = L.at == null ? t0 : L.at, u = tw(t, ta, ta + 400, "outExpo"); r.style.opacity = L.hidden ? u : 0.25 + 0.75 * u; if (L.hidden) { const g2 = tw(t, ta - 250, ta, "out"); r.style.overflow = "hidden"; r.style.maxHeight = (g2 * 220) + "px"; r.style.marginTop = (g2 * 8) + "px"; r.style.marginBottom = (g2 * 8) + "px"; }
        if (L.count) { const c = L.count, v = Math.round(lerp(0, c.value, tw(t, ta + 100, ta + 100 + (c.dur || 1500), "out"))); const n = r.querySelector(".cnt"); if (n) n.textContent = v.toLocaleString("en-GB"); } });
    });
    return box;
  }
  // VL 15.28 / 15.52: the layered shape's steps in the part tone (#DCCFB8 sides) with a white cap on each step, top included
  const PART_TONE = 0xDCCFB8;
  function toneLayers(k, L) {
    (L.levels || []).forEach((lv) => { if (lv.mode !== "slab" && lv.mode !== "row") return; lv.blocks.forEach((b) => {
      b.m.color.set(PART_TONE); if (b.c0) b.c0.set(PART_TONE);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(b.w - 0.012, 0.014, b.d - 0.012), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }));
      cap.position.set(0, b.h / 2 + 0.008, 0); cap.castShadow = true; b.piv.add(cap); }); });
    return L;
  }
  // nothing in the model is black but the pavilion door (VL 15.21): grey any ink knob or cap on a part
  function greyKnobs(obj) { obj.traverse((m) => { if (m.isMesh && m.material && m.material.color && m.material.color.getHex() === 0x111418) m.material = KIT.parts.mat("band"); }); return obj; }
  // a leader from a world point to a screen box's left edge, with a dot on the point (1A5's note on the wall)
  function leader(k, t0, t1, ptFn, box) {
    const ln = document.createElement("div"), dt = document.createElement("div"); ln.className = "lead"; dt.className = "dot";
    document.getElementById("ui").append(ln, dt);
    FILM._post.push((t) => { const on = t >= t0 && t <= t1, v = on ? tw(t, t0, t0 + 400) * (1 - tw(t, t1 - 300, t1)) : 0;
      ln.style.opacity = dt.style.opacity = v; if (!on) return;
      const a = KIT.render.project(ptFn()), r = box.getBoundingClientRect(), sx = r.left - 14, sy = r.top + r.height / 2, dx = a.x - sx, dy = a.y - sy;
      ln.style.left = sx + "px"; ln.style.top = sy - 1.5 + "px"; ln.style.width = Math.hypot(dx, dy) * tw(t, t0, t0 + 500, "out") + "px"; ln.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
      dt.style.left = a.x + "px"; dt.style.top = a.y + "px"; });
  }
  // ruling 82 row 2: three rails, one a door, each on its own two posts (kit `rail`: install, stop = red, go = green).
  // The building's one long rail is hidden. Returns [rail0, rail1, rail2] at the doors' x, z -3.9.
  function rails(k, Wb, hideUntil) {
    const RL = Wb.parts.rails;   // kit v0.8.1: one rail a door; the room must be fitted (gates) for their group to stand
    snip("state_ease", ["railEase", "doorLightEase"]); window.railEase(RL);   // 300 ms colour changes (v2-kit 180645)
    if (hideUntil != null) RL.forEach((r) => r.install(hideUntil));
    return RL;
  }
  // ruling 82 row 3: a card's done face, the coral name tag (kit claim) and a short blank time line beside it, from t0
  function doneFace(k, board, i, t0, tag) {
    const cards = board.userData.cards, c = cards[i]; if (!c) return;
    if (c.userData.claimAt == null || c.userData.claimAt > t0) board.claim(i, t0, tag ? { tag } : undefined);   // a card already claimed keeps its claim and its tag   // a card already named keeps its tag
    if (!c.userData.doneBar) {
      const bar = KIT.parts.rbox(0.15, 0.028, 0.02, KIT.parts.mat("band"), 0.01, 0.006); bar.position.set(0.47 * 0.16, -0.39 * 0.24, 0.07); c.add(bar);
      c.userData.doneBar = bar; c.userData.doneAt = t0;
      k.each((t) => { const u = tw(t, c.userData.doneAt, c.userData.doneAt + 300, "out"); bar.visible = u > 0.001; bar.scale.set(Math.max(0.001, u), 1, 1); });
    } else c.userData.doneAt = Math.min(c.userData.doneAt, t0);
  }
  // v2-kit's tear_ease.js (150144): folder2's one-to-two change opens over dur (VL: 400 ms or more), shot-side, no kit change
  function tearEase(k, F, a, b, tTear, o) {
    const dur = (o && o.dur) || 450, hA = F.children[1], hB = F.children[2], home = F.position.clone();
    const P = (v) => { F.parent.updateWorldMatrix(true, false); return F.parent.worldToLocal(v); };
    k.track({ eval(t) {
      if (t < tTear || t > tTear + dur) return;
      const u = FILM.tw(t, tTear, tTear + dur, "io");
      const mid = P(a.hand("R")).add(P(b.hand("L"))).multiplyScalar(0.5).sub(home);
      [hA, hB].forEach((h) => { h.position.lerpVectors(mid, h.position.clone(), u); h.rotation.x *= u; });
    } });
  }
  // the three of 1A1 at the board room's west end from the end of 1A2 (continuity into 1A3 to 1A5)
  const WEST3 = [[-5.45, -4.15, 0.6], [-5.5, -3.35, 0.7], [-4.95, -4.95, 0.5]];
  function west3(k) { return WEST3.map(([x, z, f], j) => k.agent({ at: [x, -3.2, z], face: f, name: "w" + j })); }
  // v2-visuals 164621: across a W/S change the camera may lean, not travel. W eases in by 6% towards the room over the last
  // 0.6 s; cut; S opens 4% wider and settles in over 0.5 s. cutOut: S eases out 4% over its last 0.5 s; cut; W opens 6% in
  // and eases out over 0.6 s, then holds.
  function lean(k, view, toward, f) { const p = Object.assign({}, typeof view === "string" ? k.cam.named(view) : view);
    p.dist = p.dist * (1 - f); if (toward) { const tv = toward.isVector3 ? [toward.x, toward.y, toward.z] : toward; p.look = p.look.map((v, j) => v + (tv[j] - v) * f); } return p; }
  // a cut time halfway between two frames at 30 fps: no frame can fall between the camera's cut and the crowd's change
  const SNIP_ = {};
  function snip(name, names) {
    if (SNIP_[name]) return; const x = new XMLHttpRequest(); x.open("GET", "snippets/" + name + ".js", false); x.send();
    (0, eval)(x.responseText + ";" + names.map((n) => "window." + n + "=" + n + ";").join("")); SNIP_[name] = 1;
  }
  // VL 15.76: the map on every close frame of a room (from the first frame after a cut in, to the last before a cut out)
  function loc(k, room, o) { snip("locator", ["locator", "roomRing"]); return window.locator(k, Object.assign({ room }, o || {})); }
  // VL 15.76: the ring round the room at W, the 0.6 s before a cut in or after a cut out, eased 300 ms (v2-visuals 180745)
  // going in (t1 is the cut) it eases on over 300 ms and is whole for its last 300 ms; coming out (t0 is the cut) it is hard on with
  // the cut and eases off over its last 300 ms (v2-visuals 180745). The snippet's own fade eases both ends, so the opacity is set here.
  function ring(k, Wb, room, t0, t1, out) {
    snip("locator", ["locator", "roomRing"]); const r = window.roomRing(k, Wb, room, t0, t1, {});
    const svg = [...document.querySelectorAll("#ui .roomring")].pop(), wrap = document.createElement("div");
    wrap.style.cssText = "position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none;opacity:0";
    if (svg) { svg.parentNode.insertBefore(wrap, svg); wrap.appendChild(svg); }
    FILM._post.push((t) => { wrap.style.opacity = t < t0 || t >= t1 ? 0 : out ? 1 - tw(t, t1 - 300, t1, "lin") : tw(t, t0, t0 + 300, "lin"); });   // even over 9 frames (pre-read 2130)
    return r;
  }
  function boardDone(k, Wb) { const b = Wb.parts.board; if (!b) return; for (let i = 0; i < 28; i++) doneFace(k, b, i, -1e9); }
  function snapCut(t) { return (Math.floor(t * 0.03) + 0.5) / 0.03; }
  function cutIn(k, W, S, tCut, toward) {
    const Sw = Object.assign({}, S); Sw.dist = S.dist * 1.04;
    return [{ t: 0, view: W }, { t: tCut - 600, hold: true, drift: false }, { t: tCut, view: lean(k, W, toward, 0.06), ease: "io" },
            { t: tCut, view: Sw, cut: true }, { t: tCut + 500, view: S, ease: "out" }];
  }
  function cutOut(k, S, W, tCut, toward) {
    const Sw = Object.assign({}, S); Sw.dist = S.dist * 1.04;
    return [{ t: tCut - 500, hold: true, drift: false }, { t: tCut, view: Sw, ease: "io" }, { t: tCut, view: lean(k, W, toward, 0.06), cut: true }, { t: tCut + 600, view: W, ease: "out" }];
  }
  return { boardDone, snip, loc, ring, snapCut, lean, cutIn, cutOut, WEST3, west3, tearEase, rails, doneFace, toneLayers, greyKnobs, leader, HERO_DESK, plans, gatesCam, stopMark, CLR, DESK, DESK_AVOID, withTo, withFrom, doors2, backCard, part, railColour, gatesRoom, DOORX, GY, deskAlways, panel, trace, ROOMS, ORDER, R, area, roomX, roomY, at, after, world, doorsAlways, crowd, tearFolder, stack, skillFolder, layers, tower, gate, box, swing };
})();

// 1C2 · S · one framing (shared with 1C1's landing and 1C3). Three sentences, three doors: each door's sign arrives and the door
// lights as its sentence starts; each carrier stands at its own door: the newcomer with its plans at "Go live", then an agent with
// a big envelope at "Skip the tests", then one with a small envelope at "Send a message". Nothing stops them yet.
FILM.shot({
  id: "1C2", type: "S", row: "1C2", dur: 9000,
  setup(k) {
    const row = "1C2.1", D = k.dur, Y = S1.GY, X = S1.DOORX;
    const t1 = S1.at(k, row, "untested"), t2 = S1.at(k, row, "whole region"), t3 = S1.at(k, row, "internal details");
    const Wb = S1.world(k, { board: -1e9, skills: -1e9, gates: -1e9 }); S1.rails(k, Wb, 1e12);   // no rail yet
    const doors = S1.doors2(k, Wb, ["Go live", "Skip the tests", "Send a message"], [-1e9, t2 - 150, t3 - 150]);
    S1.crowd(k, Wb, { fitted: { board: -1e9, skills: -1e9 }, clear: S1.CLR.gates });
    doors[0].open(-1e6, 0.8);
    const tEndRow = k.row(row).end;
    doors[0].light(t1).light(t2 - 150, false); doors[1].light(t2 - 150).light(t3 - 150, false).open(t2 + 900, 0.8); doors[2].light(t3 - 150).light(tEndRow + 300, false).open(t3 + 900, 0.8);
    S1.part(k, "hatch", [-5.65, Y, -5.6], { label: "Testing", w: 0.5 });   // the set's hatch, there from 1C1 so 1C3 to 1C4 joins
    const N = k.agent({ at: [X[0] - 0.33, Y, -3.1], face: -0.5, name: "newcomer" });
    N.carry(0, S1.plans(k), { lift: -0.14 }); N.act(t1, "look");
    const B = k.agent({ at: [-0.3, Y, -1.8], face: -0.8, name: "region" });   // outside the right edge until it walks in
    B.carry(0, S1.part(k, "envelope", [0, 0, 0], { size: "big" }), { lift: -0.14 }); B.walk(t2 - 900, 2100, [[X[1] - 0.2, -2.6], [X[1] - 0.63, -3.05]], { face: -0.6 });
    const Cc = k.agent({ at: [-0.1, Y, -1.6], face: -0.4, name: "internal" });
    Cc.carry(0, S1.part(k, "envelope", [0, 0, 0], { size: "small" }), { lift: -0.14 }); Cc.walk(t3 - 900, 2100, [[X[2] - 0.4, -2.6], [X[2] - 0.88, -3.05]], { face: -0.5 });   // in front of door three, seen from the lens
    k.cam.keys([{ t: 0, view: S1.gatesCam(k) }, { t: D + 1, hold: true, drift: false }]);   // held still: 1C1, 1C2, 1C3 join on one frame
    S1.loc(k, "gates");   // VL 15.76
    return {};
  },
});
