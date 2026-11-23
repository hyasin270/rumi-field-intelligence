// shots/_a/lib.js · v2-shots-a shared helpers for P1a..T3c (built on KIT.parts; replaced by kit calls as they land).
// Loaded by each shot.js with a synchronous read (file:// with --allow-file-access-from-files).
(function () {
  "use strict";
  const { T, PAL, mat, rbox, add } = KIT.parts;
  const tw = FILM.tw, clamp01 = FILM.clamp01, lerp = FILM.lerp, noise = FILM.noise;
  const A = (window.SA = {}); A.PH = 1.15; // a person's height (VISUAL_LANGUAGE_v2 1.5)

  // ---- lights: warmth -1 (cool grey) .. 0 .. +1 (warm). Lights are found in the scene (the kit keeps them private).
  A.lights = function (k) {
    const L = { dir: [], hemi: null };
    k.scene.traverse((o) => { if (o.isDirectionalLight) L.dir.push({ l: o, c: o.color.clone(), i: o.intensity }); if (o.isHemisphereLight) L.hemi = { l: o, c: o.color.clone(), g: o.groundColor.clone() }; });
    const warm = new T.Color(0xffd9ad), cool = new T.Color(0xd8e2ee);
    L.set = (v) => { L.dir.forEach((d, j) => { const c = d.c.clone(); if (v > 0) c.lerp(warm, v * (j === 0 ? 0.55 : 0.3)); else c.lerp(cool, -v * (j === 0 ? 0.6 : 0.4)); d.l.color.copy(c); d.l.intensity = d.i * (1 - Math.max(0, -v) * 0.12); });
      if (L.hemi) { const c = L.hemi.c.clone(); if (v > 0) c.lerp(warm, v * 0.25); else c.lerp(cool, -v * 0.35); L.hemi.l.color.copy(c); } };
    return L;
  };

  // ---- the small organisation: a one-storey pavilion (the same model the W view carries), with storeys that grow and rewind
  // origin = centre of the ground-floor front edge; +z towards camera. Storey height SH.
  A.SH = 2.9;
  A.pavilion = function (k, o) {
    o = o || {}; const g = new T.Group(); (o.parent || k.scene).add(g); if (o.at) g.position.set(...o.at);
    const W = o.w || 9, D = o.d || 4.2, SH = A.SH;
    const glassM = new T.MeshStandardMaterial({ color: PAL.glass, transparent: true, opacity: 0.18, roughness: 0.15, depthWrite: false });
    const P = { g, W, D, storeys: [], doorX: o.doorX != null ? o.doorX : -W * 0.22 };
    // plinth
    add(g, rbox(W + 0.8, 0.22, D + 0.8, mat("white"), 0.1, 0.06), 0, 0.11, -D / 2);
    function storey(i) {
      const s = new T.Group(); s.position.y = 0.22 + i * SH; g.add(s);
      add(s, rbox(W, SH - 0.2, 0.14, mat("wall"), 0.05, 0.03), 0, (SH - 0.2) / 2, -D);          // back wall
      [-1, 1].forEach((sd) => add(s, rbox(0.14, SH - 0.2, D, mat("wall"), 0.05, 0.03), sd * (W / 2 - 0.07), (SH - 0.2) / 2, -D / 2));
      // front: glass with white mullions
      const gl = new T.Mesh(new T.PlaneGeometry(W - 0.3, SH - 0.3), glassM); gl.position.set(0, (SH - 0.2) / 2, -0.02); s.add(gl);
      for (let m = 0; m <= 4; m++) add(s, rbox(0.12, SH - 0.2, 0.14, mat("white"), 0.04, 0.02), -W / 2 + 0.06 + m * (W - 0.12) / 4, (SH - 0.2) / 2, 0);
      add(s, rbox(W + 0.3, 0.2, D + 0.3, mat("white"), 0.08, 0.05), 0, SH - 0.1, -D / 2);         // slab / roof
      s.userData.i = i; return s;
    }
    P.ground = storey(0);
    // the doorway in the ground floor: a warm frame, open
    add(P.ground, rbox(1.5, 2.3, 0.18, mat("wallWarm"), 0.05, 0.03), P.doorX, 1.15, 0.02).visible = false;
    const fr = new T.Group(); P.ground.add(fr); fr.position.set(P.doorX, 0, 0.05);
    add(fr, rbox(0.14, 2.3, 0.2, mat("white"), 0.04, 0.02), -0.72, 1.15, 0); add(fr, rbox(0.14, 2.3, 0.2, mat("white"), 0.04, 0.02), 0.72, 1.15, 0); add(fr, rbox(1.58, 0.16, 0.2, mat("white"), 0.04, 0.02), 0, 2.32, 0);
    // upper storeys, each peopled with small seated figures in the deep tone
    const deep = new T.MeshStandardMaterial({ color: 0x34507a, roughness: 0.7 });
    const nUp = o.maxStoreys || 6;
    for (let i = 1; i <= nUp; i++) {
      const s = storey(i); s.visible = false;
      for (let j = 0; j < 7; j++) { const x = -W / 2 + 0.9 + j * (W - 1.8) / 6, z = -D * (0.35 + 0.3 * noise(i * 7 + j, 3));
        add(s, rbox(0.9, 0.08, 0.5, mat("white"), 0.03, 0.02), x, 0.75, z + 0.35);
        const b = add(s, new T.Mesh(new T.CapsuleGeometry(0.22, 0.45, 4, 10), deep), x, 0.75, z); b.castShadow = true;
        add(s, new T.Mesh(new T.SphereGeometry(0.2, 14, 10), deep), x, 1.32, z).castShadow = true; }
      P.storeys.push(s);
    }
    // n(t) = storeys above ground (float). Each storey lands with a small squash.
    P.grow = (n) => { P.storeys.forEach((s, j) => { const u = clamp01(n - j); s.visible = u > 0.001; const e = FILM.E.back(u); s.scale.set(1, Math.max(0.02, e), 1); s.position.y = 0.22 + (j + 1) * SH + (1 - u) * 1.2; }); };
    P.door = () => new T.Vector3(g.position.x + P.doorX, g.position.y, g.position.z);
    P.top = (n) => g.position.y + 0.22 + (n + 1) * SH;
    return P;
  };

  // ---- coins (funding): green discs that fall onto a point; pure in t
  A.coins = function (k, o) {
    const n = o.n || 16, g = new T.Group(); k.scene.add(g);
    const geo = new T.CylinderGeometry(0.26, 0.26, 0.07, 28), m = mat("green", { roughness: 0.5 });
    const list = [];
    for (let i = 0; i < n; i++) { const c = new T.Mesh(geo, m); c.castShadow = true; g.add(c);
      list.push({ c, t0: o.times[i % o.times.length] + (i >= o.times.length ? 0 : 0), x: o.area.x0 + (o.area.x1 - o.area.x0) * noise(i, 41), z: o.area.z0 + (o.area.z1 - o.area.z0) * noise(i, 42), sp: noise(i, 43) }); }
    return { g, list, eval(t, yLand, back) {
      list.forEach((q, i) => { const fall = 900, u = clamp01((t - q.t0) / fall); const y0 = yLand + 9;
        let y = u < 1 ? lerp(y0, yLand, u * u) : yLand + 0.04 * Math.abs(Math.sin(Math.min(1, (t - q.t0 - fall) / 300) * Math.PI)) * (1 - Math.min(1, (t - q.t0 - fall) / 300));
        let vis = t >= q.t0;
        if (back != null && t > back.t0) { const b = clamp01((t - back.t0 - i * 25) / back.dur); y = lerp(yLand, y0, b * b); vis = b < 1; }
        q.c.visible = vis; q.c.position.set(q.x, y + 0.035, q.z); q.c.rotation.set(u < 1 ? (t / 120 + i) : 0, 0, u < 1 ? (t / 160 + i) : 0); });
    } };
  };

  // ---- a line of people coming out of a door and walking off; rate keyed by a function (people per second) -> schedule
  // schedule: list of exit times. Each person is a kit person reused round-robin.
  A.peopleLine = function (k, o) {
    const n = o.pool || 10, ppl = [], door = o.door, out = o.path; // path: [[x,z],...] from the step outward
    const times = o.times;
    for (let i = 0; i < n; i++) ppl.push(k.person({ at: [door.x, 0.22, door.z - 1.2], face: 0 }));
    times.forEach((t0, j) => {
      const p = ppl[j % n];
      p.at(t0 - 1, [door.x, 0.22, door.z - 1.0], 0);
      p.walk(t0, 900, [[door.x, door.z + 0.6]]);                         // out through the door onto the step
      if (o.helped) p.pose(t0 + 900, "hand-up");                         // a small lift of the hand: helped
      p.pose(t0 + 1500, "stand");
      p.walk(t0 + 1500, o.walkDur || 5200, out.map((q) => [q[0] + (noise(j, 9) - 0.5) * 0.5, q[1] + (noise(j, 10) - 0.5) * 0.4]));
      p.at(t0 + 1500 + (o.walkDur || 5200) + 10, [door.x, -20, door.z - 1.2], 0);   // gone (below the page) until reused
    });
    return ppl;
  };
})();
// ---- a wide table-top ground whose edges never enter frame (top at y 0); S.add like the kit's table
(function () {
  const A = window.SA, { T, mat, rbox, add } = KIT.parts;
  A.ground = function (k, o) {
    o = o || {}; const S = k.set.table({ w: 1, d: 1, slab: false });
    const w = o.w || 80, d = o.d || 44, z0 = o.z0 != null ? o.z0 : -26;
    if (o.slab) add(S.root, rbox(w, 0.3, d, mat("table", { roughness: 0.9 }), 0.2, 0.1), 0, -0.15, z0 + d / 2);
    else { const gr = new T.Mesh(new T.PlaneGeometry(400, 400), new T.ShadowMaterial({ opacity: 0.2, color: 0x4a3c28 })); gr.rotation.x = -Math.PI / 2; gr.position.y = 0.001; gr.receiveShadow = true; S.root.add(gr); }
    KIT.render.state.extent = o.extent || 18; KIT.render.state.centre.set(0, 1, -1);
    return S;
  };
})();
// ---- the P1/P2 set: the small organisation on a table-top, three workers inside, light control
(function () {
  const A = window.SA, T = THREE;
  A.orgSet = function (k, o) {
    o = o || {};
    const S = A.ground(k);
    const P = A.pavilion(k, { at: [0, 0, 0], w: 9, d: 4.2, doorX: -2.2, maxStoreys: 6 });
    // inside: two desks, three workers
    const d1 = S.add("desk", { at: [-0.2, 0.22, -2.6], w: 1.8 }), d2 = S.add("desk", { at: [2.6, 0.22, -2.6], w: 1.8 });
    const wk = [k.person({ at: [-0.2, 0.22, -3.3], face: 0 }), k.person({ at: [2.6, 0.22, -3.3], face: 0 }), k.person({ at: [-3.4, 0.22, -2.4], face: 0.9 })];
    wk[0].pose(0, "write"); wk[1].pose(0, "phone"); wk[2].pose(0, "stand");
    const L = A.lights(k);
    return { S, P, wk, L, door: P.door() };
  };
  // read the scene-local words (null-safe): word time or fallback
  A.w = (k, row, word, fb) => { const v = k.word(row, word); return v == null ? fb : v; };
  A.r = (k, row) => k.row(row) || { start: 0, end: k.dur, dur: k.dur };
})();
// ---- P3: the coaching table-top. A road along x, schools behind it, a stack of plain clay coins per visit (the cost).
(function () {
  const A = window.SA, { T, PAL, mat, rbox, add } = KIT.parts, tw = FILM.tw, clamp01 = FILM.clamp01, lerp = FILM.lerp;
  // a one-room school: white walls, roof, a dark board; the front is a cover that rolls up to open (pure in t via open(t))
  A.school = function (k, o) {
    const g = new T.Group(); k.scene.add(g); g.position.set(o.x, 0, o.z || -3.2);
    const W = 3.8, D = 3.0, H = 2.1;
    add(g, rbox(W + 0.4, 0.18, D + 0.4, mat("white"), 0.08, 0.05), 0, 0.09, 0);
    add(g, rbox(W, H, 0.14, mat("wall"), 0.05, 0.03), 0, H / 2, -D / 2);
    [-1, 1].forEach((s) => add(g, rbox(0.14, H, D, mat("wall"), 0.05, 0.03), s * W / 2, H / 2, 0));
    add(g, rbox(W + 0.5, 0.22, D + 0.5, mat("white"), 0.1, 0.06), 0, H + 0.11, 0);
    add(g, rbox(1.6, 0.7, 0.06, mat("ink", { roughness: 0.6 }), 0.04, 0.02), -0.5, 1.25, -D / 2 + 0.1);
    const front = add(g, rbox(W + 0.02, H, 0.16, mat("wallWarm"), 0.05, 0.03), 0, H / 2, D / 2);
    const door = add(g, rbox(0.7, 1.4, 0.04, mat("band", { roughness: 0.6 }), 0.04, 0.02), 1.15, 0.75, D / 2 + 0.09);
    const lamp = new T.PointLight(0xfff1dd, 0, 6, 1.6); lamp.position.set(0, H - 0.5, 0.3); g.add(lamp);
    const S = { g, W, D, H, x: o.x, z: o.z || -3.2,
      open(u) { front.scale.y = Math.max(0.001, 1 - u); front.position.y = H - (H * (1 - u)) / 2; front.visible = u < 0.999; if (S.rollDoor) { const b = Math.max(0.05, H * u), h = 1.45 - b; door.visible = h > 0.002 && u < 0.999; door.scale.y = Math.max(0.001, h / 1.4); door.position.y = b + h / 2; } else door.visible = u < 0.2; },   /* rollDoor (opt-in, P3c fast; v2-shots-f 083442): the door rolls up with the front instead of vanishing at 20% */
      light(u) { lamp.intensity = 3.2 * u; },
      spot: (dx, dz) => [o.x + dx, 0.18, (o.z || -3.2) + dz] };
    S.open(0);
    return S;
  };
  // the road: a long low slab
  A.road = function (k, o) { const g = add(k.scene, rbox(o.len || 60, 0.04, o.w || 1.6, mat("slab", { roughness: 0.95 }), 0.02, 0.01), o.x || 0, 0.02, o.z || 0.4); return g; };
  // a stack of coins that grows: one coin per time in `times`; pure in t
  A.coinStack = function (k, o) {
    const g = new T.Group(); k.scene.add(g); g.position.set(...o.at);
    const geo = new T.CylinderGeometry(o.r || 0.32, o.r || 0.32, 0.1, 30), m = mat("white", { roughness: 0.55 }), rim = mat("grey", { roughness: 0.6 });
    const coins = o.times.map((t0, i) => { const c = new T.Mesh(geo, i % 2 ? m : m); c.castShadow = true; c.receiveShadow = true; g.add(c);
      const r = new T.Mesh(new T.TorusGeometry((o.r || 0.32) - 0.02, 0.025, 8, 30), rim); r.rotation.x = Math.PI / 2; r.position.y = 0.05; c.add(r); return { c, t0, i }; });
    return { g, eval(t) { coins.forEach((q) => { const u = clamp01((t - q.t0) / 420), y = q.i * 0.105 + 0.05; q.c.visible = t >= q.t0; q.c.position.set((FILM.noise(q.i, 3) - 0.5) * 0.06, y + (1 - FILM.E.out(u)) * 1.6, (FILM.noise(q.i, 4) - 0.5) * 0.06); }); } };
  };
})();
// ---- P3b: the three steps. Stations (white boxes), tokens that travel between them (wave, text, score), a rubric page.
(function () {
  const A = window.SA, { T, mat, rbox, add } = KIT.parts, tw = FILM.tw, clamp01 = FILM.clamp01, lerp = FILM.lerp;
  A.station = function (k, at) { const g = new T.Group(); k.scene.add(g); g.position.set(...at);
    add(g, rbox(1.1, 0.75, 0.8, mat("white"), 0.14, 0.06), 0, 0.375, 0);
    add(g, rbox(0.5, 0.06, 0.08, mat("ink"), 0.03, 0.01), -0.0, 0.62, 0.41); return g; };
  A.token = function (k, kind) { const g = new T.Group(); k.scene.add(g);
    if (kind === "wave") [0.14, 0.3, 0.22, 0.38, 0.18, 0.28, 0.12].forEach((h, i) => add(g, rbox(0.05, h, 0.05, mat("ink"), 0.02, 0.01), -0.24 + i * 0.08, 0, 0));
    if (kind === "text") { add(g, rbox(0.62, 0.42, 0.04, mat("card"), 0.05, 0.02), 0, 0, 0); [0.42, 0.34, 0.46].forEach((w, i) => add(g, rbox(w, 0.04, 0.03, mat("grey"), 0.015, 0.008), -0.05 + (w - 0.46) / 2, 0.11 - i * 0.1, 0.03)); }
    if (kind === "score") { add(g, rbox(0.62, 0.42, 0.04, mat("card"), 0.05, 0.02), 0, 0, 0); for (let i = 0; i < 4; i++) add(g, new T.Mesh(new T.SphereGeometry(0.055, 14, 10), mat(i < 3 ? "green" : "grey")), -0.21 + i * 0.14, 0, 0.04); }
    g.traverse((m) => { if (m.isMesh) m.castShadow = true; }); g.visible = false; return g; };
  // move a token along a hop from a to b between t0 and t0+dur; visible from t0 to tEnd
  A.hop = (obj, t, t0, dur, a, b, tEnd, h) => { const on = t >= t0 && t < (tEnd == null ? t0 + dur : tEnd); obj.visible = on; if (!on) return;
    const u = FILM.E.io(clamp01((t - t0) / dur)); obj.position.set(lerp(a[0], b[0], u), lerp(a[1], b[1], u) + Math.sin(Math.PI * u) * (h || 0.6), lerp(a[2], b[2], u)); obj.rotation.y = -0.2; };
  A.rubric = function (k, at) { const g = new T.Group(); k.scene.add(g); g.position.set(...at);
    add(g, rbox(0.8, 1.05, 0.05, mat("card"), 0.06, 0.02), 0, 0.53, 0);
    for (let i = 0; i < 4; i++) { add(g, rbox(0.42, 0.05, 0.03, mat("grey"), 0.015, 0.008), 0.08, 0.86 - i * 0.2, 0.04); add(g, new T.Mesh(new T.SphereGeometry(0.045, 12, 8), mat("green")), -0.25, 0.86 - i * 0.2, 0.05); }
    g.rotation.x = -0.18; return g; };
})();
// ---- small props (rounded clay), and a hard-cut key helper
(function () {
  const A = window.SA, { T, mat, rbox, add } = KIT.parts;
  const sh = (g) => { g.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return g; };
  A.prop = function (k, kind, o) {
    o = o || {}; const g = new T.Group(); (o.parent || k.scene).add(g);
    if (kind === "pen") { add(g, new T.Mesh(new T.CapsuleGeometry(0.035, 0.34, 4, 10), mat("ink")), 0, 0, 0); }
    if (kind === "ruler") add(g, rbox(0.5, 0.08, 0.025, mat("white"), 0.015, 0.008), 0, 0, 0);
    if (kind === "calc") { add(g, rbox(0.2, 0.28, 0.05, mat("ink"), 0.03, 0.01), 0, 0, 0); add(g, rbox(0.15, 0.06, 0.02, mat("white"), 0.01, 0.005), 0, 0.08, 0.03); }
    if (kind === "folder") add(g, rbox(0.55, 0.4, 0.06, mat("paper"), 0.04, 0.015), 0, 0, 0);
    if (kind === "binder") add(g, rbox(0.62, 0.16, 0.46, mat(o.alt ? "card" : "white"), 0.03, 0.015), 0, 0, 0);
    if (kind === "note") add(g, rbox(0.2, 0.2, 0.01, mat("paper"), 0.01, 0.004), 0, 0, 0);
    if (kind === "page") { if (o.slab) { add(g, rbox(0.44, 0.58, 0.035, mat("slab"), 0.02, 0.01), 0, 0, -0.012); } add(g, rbox(0.42, 0.56, 0.012, mat("paper"), 0.02, 0.006), 0, 0, 0.012); }
    if (kind === "map") { const m = add(g, rbox(1.2, 0.8, 0.05, mat("slab"), 0.02, 0.01), 0, 0, 0); add(m, rbox(1.16, 0.76, 0.01, mat("white"), 0.015, 0.005), 0, 0, 0.026); g.userData.sheet = m;
      // only the model's outline on it (a thin grey frame), blank inside
      // the model's outline as P4 and T1a show it (lead ruling 62 item 2): the block and the pavilion on top, nothing inside
      const L = (x, y, w, h) => add(m, rbox(w, h, 0.01, mat("navy"), 0.004, 0.002), x, y, 0.035);
      L(0, -0.33, 0.8, 0.025); L(0, 0.08, 0.8, 0.025); L(-0.4, -0.125, 0.025, 0.43); L(0.4, -0.125, 0.025, 0.43);
      L(0, 0.32, 0.5, 0.025); L(-0.24, 0.2, 0.025, 0.24); L(0.24, 0.2, 0.025, 0.24); }
    if (kind === "magnifier") { const r = new T.Mesh(new T.TorusGeometry(0.16, 0.035, 10, 28), mat("ink")); g.add(r); add(g, new T.Mesh(new T.CapsuleGeometry(0.035, 0.22, 4, 8), mat("ink")), 0, -0.3, 0); }
    if (kind === "speech") { const b = add(g, rbox(0.5, 0.32, 0.08, mat("white"), 0.14, 0.03), 0, 0, 0); }
    if (kind === "pile") { for (let i = 0; i < (o.n || 40); i++) add(g, rbox(0.46, 0.012, 0.6, mat(i % 3 ? "card" : "paper"), 0.01, 0.004), (FILM.noise(i, 5) - 0.5) * 0.12 * (1 + i / 30), 0.006 + i * 0.03, (FILM.noise(i, 6) - 0.5) * 0.1).rotation.y = (FILM.noise(i, 7) - 0.5) * 0.4; }
    if (o.at) g.position.set(...o.at);
    return sh(g);
  };
  // a hard cut inside a shot: a key whose pose jumps at t
  A.cut = (t, view) => ({ t, view, ease: "hold", drift: false });
})();
// ---- a direct camera pose that frames a subject of height h (m) at px pixels tall, centred on look (the lens is 20 deg)
(function () { window.SA.pose = (look, px, h, yaw, pitch) => ({ look, dist: (h || 1) * 1080 / (2 * Math.tan(10 * Math.PI / 180) * (px || 290)), yaw: yaw == null ? -12 : yaw, pitch: pitch == null ? -9 : pitch }); })();
// ---- the hero badge (VL 5.4: a white chest badge with a coral strip, the newcomer only), and a dimming veil with holes
(function () {
  const A = window.SA, { T, mat, rbox, add } = KIT.parts;
  A.badge = function (k, agent) { const b = new T.Group(); add(b, rbox(0.2, 0.14, 0.03, mat("white"), 0.03, 0.01), 0, 0, 0); add(b, rbox(0.2, 0.04, 0.035, mat("coral"), 0.015, 0.008), 0, 0.045, 0.002);
    b.position.set(0, 0.42, 0.36); b.rotation.x = -0.15; agent.spr.add(b); b.traverse((m) => { if (m.isMesh) m.castShadow = true; }); return b; };
  // veil(t) -> opacity 0..max; holes: functions returning world points (actor centres); radius px
  A.veil = function (k, o) {
    const d = document.createElement("div"); d.style.cssText = "position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none"; document.getElementById("ui").appendChild(d);
    FILM._post.push((t) => { const v = o.amount(t); if (v <= 0.001) { d.style.visibility = "hidden"; return; } d.style.visibility = "visible";
      const holes = o.holes(t).map((p) => { const s = KIT.render.project(p); return `radial-gradient(circle at ${s.x}px ${s.y}px, #000 ${o.r || 150}px, transparent ${(o.r || 150) + 90}px)`; });
      d.style.background = `rgba(251,250,247,${v})`; const m = holes.length ? holes.join(",") : "none";
      d.style.webkitMaskImage = holes.length ? `linear-gradient(#000,#000), ${m}` : "none"; d.style.webkitMaskComposite = "xor"; d.style.maskComposite = "exclude"; d.style.maskImage = d.style.webkitMaskImage; });
    return d;
  };
})();
// ---- the 300 in six rooms, from v2-shots-b's S1.crowd (so the cut T3c -> 1.0 is continuous). tShift: b's t = t - tShift.
(function () {
  const A = window.SA;
  A.roomsCrowd = function (k, W, tShift, opt) {
    if (!window.S1) { window.ROWS = window.ROWS || {};
      const x = new XMLHttpRequest(); x.open("GET", "file:///Users/haroonyasin/Documents/Projects/April%202026/Rumi%2010%20April%202026/06_Logs%20%26%20Misc/Reports/Active/FoP%20Shadow%20Org%20Deck%20-%20Nov%202026/outputs/lanes/v2-shots-b/tools/lib.js", false); x.send();
      (0, eval)(x.responseText + "\n;window.S1 = S1;"); }
    const C = window.S1.crowd(k, W, opt || {}); const at0 = C.at, fz = opt && opt.freezeAt; C.at = (i, t) => at0(i, (fz != null ? Math.min(t, fz) : t) - tShift); return C;
  };
})();
// W-left (VISUAL_LANGUAGE_v2 10.1): the model left of centre, the right third clear for the list or a card
(function () { window.SA.WL = { look: [1.9, -2.3, -2.2], dist: 63, yaw: -14, pitch: -12, name: "W-left" }; })();
// ---- P1/P2 on the kit's tower: the shared set, the drift-compensated join, the funding coins
(function () {
  const A = window.SA, { T, mat, rbox, add } = KIT.parts;
  A.drifted = (p) => { const DR = window.CAMERA_RULES.drift, push = typeof DR === "number" ? DR : DR.push, dy = typeof DR === "number" ? 0 : DR.yaw; return Object.assign({}, p, { dist: p.dist * (1 - push), yaw: p.yaw + dy }); };
  A.P1 = { doorLook: (S) => [S.door.x + 2.2, 1.6, S.door.z + 0.6], PH: 2.15 };
  A.towerSet = function (k, o) {
    o = o || {}; A.ground(k, { extent: 24 });
    const S = k.set.table({ w: 1, d: 1, slab: false });
    const tw = S.add("tower", Object.assign({ at: [0, 0, 0], storeys: o.storeys || 0, warmth: o.warmth == null ? 1 : o.warmth }, o.tower || {}));
    k.track(tw); tw.eval && tw.eval(0);
    const door = tw.door();
    const ppl = k.people(14, {});
    return { S, tower: tw, door, ppl };
  };
  A.p1Path = (d) => [[3.15, d.z + 0.05], [3.6, d.z + 1.0], [d.x + 6, d.z + 2.2], [d.x + 15, d.z + 2.6]];   /* round the right-hand corner the camera never sees (pre-read 1750: nobody through the door panel) */
  A.p1Pose = (d) => A.pose([d.x + 2.4, 1.5, d.z + 0.8], 300, 2.15, -12, -8);
  A.p1Wide = () => A.pose([0, 9.8, 0], 860, 21, -12, -8);
})();
// ---- the P1 line on one clock across P1a, P1b, P2: emissions every 1000 ms of film time from P1a's first frame
(function () {
  const A = window.SA;
  A.p1Zero = (k) => { const r = k.row("P1a.1"); return r ? r.start - 300 : 0; };         // P1a's first frame, in this shot's ms
  A.lineTimes = (k, t0, t1, keep) => { const z = A.p1Zero(k), out = []; for (let n = -20; n < 200; n++) { const tl = z + n * 1400; /* one every 1.4 s: never two at the door at once (PRE_SIGN check 4) */ if (tl < t0 || tl > t1) continue; if (!keep || keep(tl, n)) out.push(tl); } return out; };
})();
// ---- the door in the closed block's face (T1a, T3b) and the T1a end state of the crowd, rebuilt for T3b
(function () {
  const A = window.SA;
  A.faceDoor = (k, W) => { const d = k.set.part("door", { w: 1.3, h: 2.2, colour: "ink" }); d.scale.setScalar(1.5); d.position.set(0, W.pageY, 0.3); k.scene.add(d); return d; };
  A.T1A_TO = (W) => [W.page(-13.4, -9.4, -6.5, 1.0), W.page(9.4, 13.4, -6.5, 2.4), W.page(-8.4, 8.4, 0.8, 3.0)];   /* inside the W frame with margin (v2-check note 74 item 6) */
})();
// ---- a kit part placed, added and tracked in one call
(function () { window.SA.kp = (k, name, o, at, rotY) => { const g = KIT.set.PARTS[name](k, o || {}); if (!g.parent) k.scene.add(g); if (at) g.position.set(at[0], at[1], at[2]); if (rotY) g.rotation.y = rotY; if (g.eval && !g._tracked) { k.track(g); g._tracked = true; } return g; }; })();

// ---- a number that counts up and holds until t1 (house .numcard style), anchored to a world point or a pixel spot
(function () { window.SA.heldNumber = function (k, t0, t1, o) {
  const box = document.createElement("div"); box.className = "abs numcard"; box.style.textAlign = "center";
  const num = document.createElement("div"); num.className = "num w"; box.appendChild(num);
  if (o.unit) { const u = document.createElement("div"); u.className = "unit w"; u.textContent = o.unit; box.appendChild(u); }
  document.getElementById("ui").appendChild(box);
  FILM._post.push((t) => { const v = Math.min(FILM.tw(t, t0, t0 + 400, "outExpo"), 1 - FILM.tw(t, t1 - 250, t1, "in")); box.style.visibility = v <= 0.002 ? "hidden" : "visible"; box.style.opacity = v;
    const u = FILM.tw(t, t0 + 100, t0 + 100 + (o.dur || 1500), "out"); num.textContent = (o.prefix || "") + Math.round(FILM.lerp(o.from || 0, o.value, u)).toLocaleString("en-GB");
    let x = o.x, y = o.y; if (o.at) { const s = KIT.render.project(o.at); x = s.x - box.offsetWidth / 2; y = s.y - box.offsetHeight / 2; }
    box.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`; });
  return box; }; })();

// ---- P1b's last framing (the queue at people size, the tower behind) and P1b's wide (the whole tower): P2 starts on P1b's end
(function () { const A = window.SA; A.p1Back = (d) => A.pose([d.x - 3.6, 10.0, d.z + 0.4], 830, 23.0, -12, -8); /* the whole tower and the queue to its left, at rest (note 74 item 3) */ A.p1WideAll = () => A.pose([0, 10.6, 0], 820, 23.5, -12, -8); })();
// ---- a spaced crowd: n members on a jittered grid one body's width apart (VL 15.39) in the given areas, each turning and
// swaying on its own (alive, never inside another). Uses the kit's instanced crowd with its own place function.
(function () { window.SA.spacedCrowd = function (k, areas, o) {
  o = o || {}; const gap = o.gap || 1.0, pts = [];
  const span = (lo, hi) => { const out = []; if (hi - lo < gap) { out.push((lo + hi) / 2); return out; } for (let v = lo + gap / 2; v <= hi - gap / 2 + 1e-6; v += gap) out.push(v); return out; };   /* an area thinner than the gap gives one row */
  areas.forEach((a, ai) => { span(a.x0, a.x1).forEach((x) => span(a.z0, a.z1).forEach((z) => pts.push({ x, z, y: a.y, ai }))); });
  const C = k.crowd(pts.length, { seed: o.seed || 5 }); const N = FILM.noise;
  C.pts = pts; C.at = (i, t) => { if (o.freezeAt != null) t = Math.min(t, o.freezeAt); const p = pts[i], s = t / 1000, ph = 6.283 * N(i, 3), j = 0.12; if (o.skip && o.skip(p)) return { x: p.x, y: p.y - 80, z: p.z, yaw: 0, vis: false, moving: false };
    return { x: p.x + (N(i, 1) - 0.5) * j * 2 + 0.06 * Math.sin(s * (0.4 + 0.3 * N(i, 5)) + ph), y: p.y, z: p.z + (N(i, 2) - 0.5) * j * 2 + 0.05 * Math.cos(s * (0.35 + 0.3 * N(i, 6)) + ph),
      yaw: (N(i, 4) - 0.5) * (o.yaw != null ? o.yaw : 2.4) + (o.yaw != null ? 0.1 : 0.5) * Math.sin(s * 0.3 + ph), vis: true, moving: false }; };
  return C; }; })();

/* ---- the kit's brass coin for every coin stack (v2-kit snippets/coin_stack.js; v2-visuals 153200 item 7) */
(function () { try { const x = new XMLHttpRequest(); x.open("GET", "snippets/coin_stack.js", false); x.send(); (0, eval)(x.responseText + ";window.coinStackBrass=coinStackBrass;");
  window.SA.coinStack = (k, o) => window.coinStackBrass(k, Object.assign({ drop: 0.5, dur: 300 }, o)); } catch (e) { console.error("coin_stack snippet: " + e); } })();
/* ---- where the line of people starts: inside the building behind the open doorway, so nobody appears in view (note 74 item 1) */
(function () { window.SA.p1From = (d) => [2.2, d.y, d.z - 1.9];   /* behind the right-hand wall, out of sight */ })();
/* ---- the locator (VL 15.76; v2-kit snippets/locator.js): the map on close frames of a room, the ring at W across a cut */
(function () { try { const x = new XMLHttpRequest(); x.open("GET", "snippets/locator.js", false); x.send(); (0, eval)(x.responseText + ";window.locator=locator;window.roomRing=roomRing;"); } catch (e) { console.error("locator snippet: " + e); } })();
/* ---- the people line through the lit door (v2-visuals 195549): each walker steps out of the light. A clipping plane at the
   door's face hides the part of the body still behind it, so nobody passes through a wall or the door panel in view.
   One global clock (P1a's first frame), one walker per emission index, a real stride at about 1.3 m/s. */
(function () {
  const A = window.SA, T = THREE;
  A.doorPlane = (d) => new T.Plane(new T.Vector3(0, 0, 1), -(d.z - 0.64));            /* the door face: door() z minus 0.64 */
  A.clipBody = (p, plane) => { p.root.traverse((m) => { if (m.isMesh && m.material) { m.material = m.material.clone(); m.material.clippingPlanes = [plane]; } }); return p; };
  /* pre-read 2110: the plane read as a body assembling in pieces, and feet stood inside the step. Now each walker appears on the
     step's top in the right half of the lit doorway, fades up over 300 ms (VL: things change over 300 ms) and steps down. */
  /* a person's fade (the kit gives fade to agents only): own materials, opacity keyed in time, 300 ms io by default */
  A.fadable = (k, p) => { if (p.fade) return p;
    /* pre-read 2310: any see-through fade shows the body's overlapping parts darker. So the body stays solid and comes out of
       the light in colour: it starts the warm white of the lit door and darkens to its own colour over the fade (no alpha). */
    const mats = []; p.root.traverse((m) => { if (m.isMesh && m.material && m !== p.root.userData.blob) { m.material = m.material.clone(); mats.push({ m: m.material, c: m.material.color.clone(), e: m.material.emissive ? m.material.emissive.clone() : null }); } });
    const warm = new THREE.Color(0xefe0ca), warmE = new THREE.Color(0xffe7c4), leafE = new THREE.Color(0xf6eedd)   /* red at 239 before light (pre-read 0330: 0xfff1dc clipped; 0345: 0xf4e5cf still clipped the crown and shoulder by 2 to 6 levels) */   /* start at the lit leaf's colour (pre-read 0050: 0xe6d6bd read as a tan figure, 42 levels darker than the leaf) */, blob = p.root.userData.blob, keys = [];
    p.fade = (t0, dur, to) => { keys.push({ t0, dur, to }); keys.sort((a, b) => a.t0 - b.t0); return p; };
    k.each((t) => { let op = 1; for (const f of keys) { if (f.t0 > t) break; op = FILM.lerp(op, f.to, FILM.tw(t, f.t0, f.t0 + Math.max(1, f.dur), "io")); }
      const vis = op > 0.004; const sIn = p.inGoer ? 0.78 * Math.pow(Math.min(1, op / 0.45), 2) : 1;   /* self-check 0545: mid-fade heads still 4 to 16 px at 255 on the step under the key light; their lit share is 0.78 of the leavers' */   /* pre-read 0530: the head clipped while glow rose under the key light; the key light now goes first */   /* pre-read 0515 P2: in-goers ended as a beige figure 20 to 45 under the leaf and popped; over their last part they lose the key light and end on the leaf's own glow */
      mats.forEach((q) => { q.m.visible = vis; q.m.color.copy(warm).multiplyScalar(0.46 * sIn).lerp(q.c, op); if (q.e) q.m.emissive.copy(leafE).multiplyScalar((0.27 + (A.inGlow - 0.27) * (1 - sIn)) * (1 - op)).add(q.e.clone().multiplyScalar(op)); });   /* pre-read 0415: unlit start was flat; half lit warm for shading and 0.3 glow; 0430: 0.55 and 0.35 still clipped the crown by 1 to 3 levels */   /* pre-read 0400: any lit start colour clips on the crown under the key light; the body starts unlit, glowing the leaf's own colour, and its lit colour comes in as it steps out */ if (blob) blob.visible = op > 0.5; }); return p; };
  A.stepTop = (d) => d.y + 0.08;
  A.doorPath = (d) => [[d.x + 0.65, A.stepTop(d), d.z - 0.3], [d.x + 1.3, 0, d.z + 0.5], [d.x + 2.6, 0, d.z + 1.35], [d.x + 5.5, 0, d.z + 1.9],   /* in front of P1b's coin piles (pre-read 2215 P1b f063) */ [d.x + 30, 0, d.z + 2.9]];   /* ends well out of every frame (pre-read 2110: P1b vanish) */
  A.inGlow = 1.0;
  A.doorIn = (k, p, d, tIn, dur) => { const top = A.stepTop(d); A.fadable(k, p); p.inGoer = true;
    /* in at the left half of the doorway: up the step and into the light. The fade runs while the body crosses the step,
       from 0.2 m in front of the leaf to its face, timed from the path (the walk is eased over its whole length); then it is
       gone inside (pre-read 0050: a fixed share of the walk faded people short of the door or cut them at the leaf) */
    const pts = [[d.x - 0.35, 0, d.z + 0.3], [d.x - 0.35, top, d.z - 0.2], [d.x - 0.35, top, d.z - 4.2]];   /* pre-read 0230 P2: the walk eased to a stop inside 1.2 m, so they faded standing; the path runs 4 m in, so they are still at pace in the doorway */
    const start = p.root.position.clone(); let L1 = 0, prev = [start.x, start.z]; pts.slice(0, 2).forEach((q) => { L1 += Math.hypot(q[0] - prev[0], q[2] - prev[1]); prev = [q[0], q[2]]; });
    const Lt = L1 + 4.0, at = (u) => tIn + Math.acos(1 - 2 * Math.min(1, u)) / Math.PI * dur, tA = Math.round(at(L1 / Lt)), tB = Math.round(at((L1 + 0.42) / Lt));
    p.walk(tIn, dur, pts); p.fade(tA, Math.max(120, tB - tA), 0); p.at(tB + 20, [d.x, -80, d.z]); return tB + 20; };   /* returns the frame time they are gone */   /* walks on into the light and fades while still walking (pre-read 0025: stopped and dissolved) */
  A.doorLine = function (k, o) {
    /* each walk starts out of sight inside the building, so a walker is already at pace when they fade up in the doorway
       (the kit's walk eases over its whole length; starting at the door made them bunch there: P2 K 8 of 21:54Z) */
    const d = o.door, pool = [], N = o.pool || 20, step = o.step || 1400, top = A.stepTop(d), from = [d.x + 0.25, top, d.z - 3.4], path = o.path || A.doorPath(d);
    const pts0 = [[d.x + 0.25, top, d.z - 0.5]].concat(path);
    let len = 0, prev = [from[0], from[2]], lIn = 0; pts0.forEach((q, j) => { const x = q[0], z = q[q.length - 1]; len += Math.hypot(x - prev[0], z - prev[1]); prev = [x, z]; if (j === 0) lIn = len; });
    const dur = Math.round(len / (o.speed || 1.3) * 1000), xIn = Math.acos(1 - 2 * lIn / len) / Math.PI, lead = Math.round(xIn * dur);
    for (let i = 0; i < N; i++) pool.push(A.fadable(k, k.person({ at: [from[0], -80, from[2]], face: 0 })));
    o.times.forEach((t0) => { const n = Math.round((t0 - A.p1Zero(k)) / step), p = pool[((n % N) + N) % N], ts = t0 - lead;
      const jit = (FILM.noise(n + 40, 7) - 0.5) * 0.35, pts = pts0.map((q, j) => (j < 3 ? q : [q[0] + jit, q[1], q[2] + (j > 3 ? jit * 0.6 : 0)]));
      p.at(ts - 1, from, 0); p.fade(ts - 1, 1, 0); p.fade(t0 + 120, t0 + 120 < 0 ? 1 : 400, 1);   /* starts once the whole body, trailing leg too, is clear of the leaf's face (pre-read 0050: a leg stump for 3 frames) */ p.walk(ts, dur, pts); p.at(ts + dur + 1, [from[0], -80, from[2]], 0); });
    return { pool, dur };
  };
})();
/* ---- v2-kit 213815 (v0.8.11): every person in this lane's shots settles from a walk into the held pose over 300 ms io */
(function () { if (FILM._saSettle) return; FILM._saSettle = true; const shot = FILM.shot;
  FILM.shot = function (spec) { const s0 = spec.setup; spec.setup = function (k) { const p = k.person; k.person = (o) => p.call(k, Object.assign({ settle: 300 }, o || {})); return s0.call(this, k); }; return shot.call(FILM, spec); }; })();
/* ---- pre-read 2335: the building's own people are made by KIT.actors.person directly (kit/set.js:273), so the k.person wrapper
   above missed them. The default goes on KIT.actors.person, which k.person also calls (kit/core.js:101). */
(function () { if (!window.KIT || !KIT.actors || KIT.actors._saSettle) return; const ap = KIT.actors.person; KIT.actors._saSettle = true;
  KIT.actors.person = function (k, o) { return ap.call(this, k, Object.assign({ settle: 300 }, o || {})); }; })();
