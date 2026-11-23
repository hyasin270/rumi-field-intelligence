// crowd.js (film2 kit, v2-kit): the 300. v1's sprite (Look.crowdParts: the same rig v3, lower tessellation), instanced:
// one draw call per material. Each member's place is a pure function of (i, t), replayed through the declared modes.
// Modes run from their t0 until the next mode's t0: arrive, move, mill, lanes, rows, still. handOver(i, t) swaps one
// member for a full agent at the same place and yaw.
(function () {
  "use strict";
  const T = THREE, tw = FILM.tw, noise = FILM.noise, halton = FILM.halton, lerp = FILM.lerp, clamp01 = FILM.clamp01;
  const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  // a member's cell in an area (or in one of several areas: member i goes to areas[i % n])
  function cellIn(area, i, n, salt) {
    if (Array.isArray(area)) { const m = area.length; return cellIn(area[i % m], Math.floor(i / m), Math.ceil(n / m), salt); }
    const a = halton(i + 1 + (salt || 0) * 17, 2), b = halton(i + 1 + (salt || 0) * 17, 3);
    return { x: lerp(area.x0, area.x1, a), y: area.y || 0, z: lerp(area.z0, area.z1, b) };
  }
  // VL 5.3 slots: a staggered grid, 0.66 m by 0.68 m, in an area
  function slotIn(area, i, n) {
    if (Array.isArray(area)) { const m = area.length; return slotIn(area[i % m], Math.floor(i / m), Math.ceil(n / m)); }
    const sx = 0.66, sz = 0.68, cols = Math.max(1, Math.floor((area.x1 - area.x0) / sx)), r = Math.floor(i / cols), c = i % cols;
    return { x: area.x0 + sx / 2 + c * sx + (r % 2) * sx * 0.33, y: area.y || 0, z: area.z1 - sz / 2 - r * sz };
  }
  function polyAt(pts, s) { // pts [[x,z]...], s in metres along it (wraps)
    let L = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    s = ((s % L) + L) % L; for (let i = 0; i < seg.length; i++) { if (s <= seg[i]) { const u = s / seg[i]; return { x: lerp(pts[i][0], pts[i + 1][0], u), z: lerp(pts[i][1], pts[i + 1][1], u), yaw: Math.atan2(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]), L }; } s -= seg[i]; }
    const e = pts[pts.length - 1]; return { x: e[0], z: e[1], yaw: 0, L };
  }
  // the closed-eye face: the mark's layout (663 x 258, dots at the two top corners, the smile between) with the dots as flat arcs
  let closedTex = null;
  function closedEyes() {
    if (closedTex) return closedTex;
    const c = document.createElement("canvas"); c.width = 663; c.height = 258; const g = c.getContext("2d");
    g.strokeStyle = "#0b1a3f"; g.lineCap = "round"; g.lineWidth = 18;
    g.beginPath(); g.moveTo(108, 118); g.bezierCurveTo(170, 250, 495, 250, 556, 118); g.stroke();
    g.lineWidth = 22; [[66, 70], [597, 70]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y - 22, 50, Math.PI * 0.2, Math.PI * 0.8); g.stroke(); });
    closedTex = new T.CanvasTexture(c); closedTex.colorSpace = T.SRGBColorSpace; closedTex.anisotropy = 8; return closedTex;
  }
  function make(k, n, o) {
    o = o || {}; if (n === 0) throw new Error("k.crowd(0): no members. A place function built from areas found no points (check each area against its gap; v2-kit 20:5xZ)"); n = n == null ? 300 : n; const seed = o.seed || 0, SC = KIT.SCALE.agent;   // VL 5.3 / 14.6: locked
    const parts = Look.crowdParts(k.renderer);
    const grp = new T.Group(); (o.parent || k.scene).add(grp);
    const meshes = parts.map((p) => { const im = new T.InstancedMesh(p.geometry, p.material, n); im.castShadow = !!p.castShadow; im.receiveShadow = true; im.frustumCulled = false; if (p.renderOrder) im.renderOrder = p.renderOrder; grp.add(im); return im; });
    // VL 15.2: an asleep set of the same parts: the body at #F5B298, the face with closed eyes (two flat arcs where the mark's
    // dots are, the smile kept); no bob, no turn, settled 6% lower
    const sleepMeshes = parts.map((p) => { let m = p.material;
      if (p.name === "coral") { m = p.material.clone(); m.color = new T.Color(0xf5b298); m.onBeforeCompile = p.material.onBeforeCompile; }
      else if (p.name === "decal") { m = p.material.clone(); m.map = closedEyes(); }
      const im = new T.InstancedMesh(p.geometry, m, n); im.castShadow = !!p.castShadow; im.receiveShadow = true; im.frustumCulled = false; if (p.renderOrder) im.renderOrder = p.renderOrder; grp.add(im); return im; });
    const segs = [], handed = {};
    const init = o.start ? (i) => Object.assign(cellIn(o.start, i, n, seed), { yaw: (noise(i, seed + 3) - 0.5) * 0.8, vis: true }) : () => ({ x: 0, y: 0, z: 0, yaw: 0, vis: false });
    const C = { n, grp, segs };
    const add = (s) => { segs.push(s); segs.sort((a, b) => a.t0 - b.t0); return C; };
    // over the horizon (or from an area) to cells in an area; staggered, each at its own pace
    C.arrive = (t0, dur, op) => add({ t0, kind: "arrive", at(i, t, st) {
      const from = op.from === "horizon" || !op.from ? { x0: -70, x1: 70, z0: -150, z1: -110, y: 0 } : op.from;
      const s0 = st.vis ? st : Object.assign(cellIn(from, i, n, seed + 1), { yaw: 0 });
      const to = cellIn(op.to, i, n, seed + (op.salt || 2));
      const delay = noise(i, seed + 5) * (op.spread != null ? op.spread : 0.55) * dur, travel = dur - delay;
      const u = tw(t, t0 + delay, t0 + delay + travel * (0.75 + 0.25 * noise(i, seed + 6)), "sine");
      const x = lerp(s0.x, to.x, u) + Math.sin(u * Math.PI) * (noise(i, seed + 7) - 0.5) * 6, z = lerp(s0.z, to.z, u);
      const moving = u > 0 && u < 1; const walkPh = (t + noise(i, seed + 8) * 1000) / 1000;
      const yaw = moving ? Math.atan2(to.x - s0.x, to.z - s0.z) : u >= 1 ? (noise(i, seed + 3) - 0.5) * 0.9 : s0.yaw;
      return { x, y: lerp(s0.y, to.y, u) + (moving ? 0.07 * Math.abs(Math.sin(Math.PI * 2 * walkPh)) : 0), z, yaw, vis: true, moving };
    } });
    C.move = (t0, dur, op) => C.arrive(t0, dur, Object.assign({ spread: 0.3 }, op, { from: "current" }));
    // each wanders round where it stands: chaos
    C.mill = (t0, dur, op) => add({ t0, kind: "mill", at(i, t, st) {
      const r = (op && op.radius) || 0.9, a = (t - t0) / 1000, w1 = 0.35 + 0.4 * noise(i, seed + 11), w2 = 0.25 + 0.35 * noise(i, seed + 12), p1 = 6.28 * noise(i, seed + 13), p2 = 6.28 * noise(i, seed + 14);
      const fade = tw(t, t0, t0 + 700, "io");
      const dx = r * fade * (Math.sin(w1 * a + p1) - Math.sin(p1)), dz = r * 0.6 * fade * (Math.sin(w2 * a + p2) - Math.sin(p2));
      const vx = Math.cos(w1 * a + p1) * w1, vz = 0.6 * Math.cos(w2 * a + p2) * w2;
      const yaw = st.yaw + wrap(Math.atan2(vx, vz) - st.yaw) * fade;
      return { x: st.x + dx, y: st.y + 0.05 * Math.abs(Math.sin(a * 6 + p1)) * fade, z: st.z + dz, yaw, vis: st.vis, moving: true };
    } });
    // a share of them move in lanes along polylines (order); the rest stand still
    C.lanes = (t0, dur, op) => add({ t0, kind: "lanes", at(i, t, st) {
      if (noise(i, seed + 21) > (op.share != null ? op.share : 1)) return Object.assign({}, st, { moving: false });
      const L = op.lanes, li = i % L.length, sp = op.speed || 1.1, gap = op.gap || 0.9;
      const idx = Math.floor(i / L.length), p = polyAt(L[li], idx * gap + sp * (t - t0) / 1000);
      const u = tw(t, t0, t0 + (op.join || 1200), "io");
      return { x: lerp(st.x, p.x, u), y: op.y != null ? op.y : st.y, z: lerp(st.z, p.z, u), yaw: st.yaw + wrap(p.yaw - st.yaw) * u, vis: st.vis, moving: true };
    } });
    // neat rows in an area, all facing one way: the crowd falls into order
    C.rows = (t0, dur, op) => add({ t0, kind: "rows", at(i, t, st) {
      const a = op.area, cols = op.cols || Math.ceil(Math.sqrt(n * (a.x1 - a.x0) / Math.max(0.1, a.z1 - a.z0))), r = Math.floor(i / cols), c = i % cols, rowsN = Math.ceil(n / cols);
      const x = lerp(a.x0, a.x1, cols > 1 ? c / (cols - 1) : 0.5), z = lerp(a.z0, a.z1, rowsN > 1 ? r / (rowsN - 1) : 0.5);
      const d = noise(i, seed + 31) * 0.4 * dur, u = tw(t, t0 + d, t0 + d + dur * 0.6, "io");
      return { x: lerp(st.x, x, u), y: lerp(st.y, a.y || 0, u), z: lerp(st.z, z, u), yaw: st.yaw + wrap((op.face || 0) - st.yaw) * u, vis: st.vis, moving: u > 0 && u < 1 };
    } });
    // VL 5.3: a fitted room's agents glide to slots and face the cut face (within 20 degrees), 1.2 s, as a wave from the object
    C.slots = (t0, op) => add({ t0, kind: "slots", at(i, t, st) {
      const inA = !op.only || op.only(st); if (!inA) return Object.assign({}, st, { moving: false });
      const sl = slotIn(op.area, op.index ? op.index(i) : i, n), from = op.from ? (Array.isArray(op.from) ? op.from : [op.from.x, op.from.y, op.from.z]) : null;
      const d = from ? Math.hypot(st.x - from[0], st.z - from[2]) * (op.wave || 110) : noise(i, seed + 41) * 400, u = tw(t, t0 + d, t0 + d + (op.dur || 1200), "io");
      return { x: lerp(st.x, sl.x, u), y: lerp(st.y, sl.y, u), z: lerp(st.z, sl.z, u), yaw: st.yaw + wrap((noise(i, seed + 42) - 0.5) * 0.5 - st.yaw) * u, vis: st.vis, moving: u > 0 && u < 1 };
    } });
    // in at a door, staggered; each shrinks into the door and, if a "to" area is given, appears there after a beat (hidden:
    // true keeps them out of sight until a later mode places them)
    C.enter = (t0, dur, op) => add({ t0, kind: "enter", at(i, t, st) {
      const d = Array.isArray(op.door) ? { x: op.door[0], y: op.door[1], z: op.door[2] } : op.door;
      const delay = noise(i, seed + 51) * dur * 0.7, walk = dur * 0.3 * (0.7 + 0.3 * noise(i, seed + 52));
      const u = tw(t, t0 + delay, t0 + delay + walk, "sine"), gone = tw(t, t0 + delay + walk * 0.9, t0 + delay + walk + 200, "in");
      if (gone < 1) return { x: lerp(st.x, d.x, u), y: lerp(st.y, d.y, u), z: lerp(st.z, d.z, u), yaw: u > 0 ? Math.atan2(d.x - st.x, d.z - st.z) : st.yaw, vis: st.vis, s: 1 - gone, moving: u > 0 && u < 1 };
      if (!op.to || op.hidden) return { x: d.x, y: d.y, z: d.z, yaw: st.yaw, vis: false, s: 0 };
      const c = cellIn(op.to, i, n, seed + 53), back = tw(t, t0 + delay + walk + (op.gap || 600), t0 + delay + walk + (op.gap || 600) + 300, "back");
      return { x: c.x, y: c.y, z: c.z, yaw: (noise(i, seed + 3) - 0.5) * 0.8, vis: back > 0, s: back, moving: false };
    } });
    // everyone turns to face the cut face (towards the camera), each within a spread, staggered (VL 5.3)
    C.face = (t0, dur, op) => add({ t0, kind: "face", at(i, t, st) { op = op || {}; const target = (op.yaw || 0) + (noise(i, seed + 61) - 0.5) * (op.spread != null ? op.spread : 0.6);
      const d = noise(i, seed + 62) * (dur || 1200) * 0.5, u = tw(t, t0 + d, t0 + d + (dur || 1200) * 0.5, "io"); return Object.assign({}, st, { yaw: st.yaw + wrap(target - st.yaw) * u, moving: false }); } });
    // asleep from t0 (all, or those op.only(st) says), each settling over 600 ms; wake(t0) undoes it
    C.sleep = (t0, op) => add({ t0, kind: "sleep", at: (i, t, st) => (op && op.only && !op.only(st, i) ? Object.assign({}, st) : Object.assign({}, st, { asleep: true, moving: false })) });
    C.wake = (t0, op) => add({ t0, kind: "wake", at: (i, t, st) => (op && op.only && !op.only(st, i) ? Object.assign({}, st) : Object.assign({}, st, { asleep: false })) });
    C.still = (t0) => add({ t0, kind: "still", at: (i, t, st) => Object.assign({}, st, { moving: false }) });
    C.hide = (t0) => add({ t0, kind: "hide", at: (i, t, st) => Object.assign({}, st, { vis: false }) });
    C.place = (t0, area) => add({ t0, kind: "place", at: (i, t, st) => Object.assign(cellIn(area, i, n, seed + 4), { yaw: (noise(i, seed + 3) - 0.5) * 0.8, vis: true, moving: false }) });
    C._placeOld = (t0, area) => add({ t0, kind: "place", at: (i, t, st) => Object.assign(cellIn(area, i, n, seed + 4), { yaw: (noise(i, seed + 3) - 0.5) * 0.8, vis: true, moving: false }) });
    // the member's place at t (pure)
    C.at = function (i, t) {
      let st = init(i);
      for (let j = 0; j < segs.length; j++) {
        const s = segs[j], nx = segs[j + 1]; if (s.t0 > t) break;
        if (nx && nx.t0 <= t) st = s.at(i, nx.t0, st); else return s.at(i, t, st);
      }
      return st;
    };
    // at t, member i becomes a full agent (same place, same yaw); the agent then takes its own tracks from t
    C.handOver = function (i, t) {
      const s = C.at(i, t); handed[i] = t;
      const a = k.agent({ at: [s.x, s.y, s.z], face: s.yaw, visibleFrom: t, name: "member" + i });
      return a;
    };
    const M = new T.Matrix4(), Q = new T.Quaternion(), P = new T.Vector3(), S = new T.Vector3(), Y = new T.Vector3(0, 1, 0);
    // VL 14.5: no two agents closer than 0.62 m centre to centre; nobody through furniture (keep-clear boxes) or a hero
    const MIN = o.spacing || 0.62, avoid = (o.avoid || []).slice(), HERO = o.heroClear != null ? o.heroClear : MIN * 1.3;
    C.avoid = (box) => { avoid.push(box); return C; };
    function separate(list, t) {
      const live = list.filter((s) => s.vis && !s.hid);
      const heroes = (KIT.actors.all || []).filter((a) => a.kind === "agent" && a.root.visible && !String(a.name).startsWith("member")).map((a) => a.root.position);
      for (let it = 0; it < 3; it++) {
        const cell = new Map(), key = (x, z) => Math.floor(x / MIN) + "," + Math.floor(z / MIN);
        live.forEach((s, j) => { const kk = key(s.x, s.z); if (!cell.has(kk)) cell.set(kk, []); cell.get(kk).push(j); });
        live.forEach((s, j) => {
          const cx = Math.floor(s.x / MIN), cz = Math.floor(s.z / MIN);
          for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) for (const m of cell.get((cx + dx) + "," + (cz + dz)) || []) {
            if (m <= j) continue; const q = live[m]; if (Math.abs(q.y - s.y) > 1) continue;
            const ex = q.x - s.x, ez = q.z - s.z, d = Math.hypot(ex, ez);
            if (d < MIN && !(s.pin && q.pin)) { const push = (MIN - d) / 2 + 1e-4, ux = d > 1e-6 ? ex / d : Math.cos(j * 2.39), uz = d > 1e-6 ? ez / d : Math.sin(j * 2.39); s.x -= ux * push; s.z -= uz * push; q.x += ux * push; q.z += uz * push; }
          }
          if (!s.pin) for (const h of heroes) { if (Math.abs(h.y - s.y) > 1) continue; const ex = s.x - h.x, ez = s.z - h.z, d = Math.hypot(ex, ez); if (d < HERO && d > 1e-6) { s.x = h.x + ex / d * HERO; s.z = h.z + ez / d * HERO; } }
          if (!s.pin) for (const b of avoid) { if (b.y != null && Math.abs(b.y - s.y) > 1) continue; if ((b.t0 != null && t < b.t0) || (b.t1 != null && t >= b.t1)) continue; if (s.x > b.x0 && s.x < b.x1 && s.z > b.z0 && s.z < b.z1) {
            const opts = [[s.x - b.x0, b.x0 - 0.01, null], [b.x1 - s.x, b.x1 + 0.01, null], [s.z - b.z0, null, b.z0 - 0.01], [b.z1 - s.z, null, b.z1 + 0.01]].sort((a, c) => a[0] - c[0])[0];
            if (opts[1] != null) s.x = opts[1]; else s.z = opts[2]; } }
        });
      }
    }
    C.eval = function (t) {
      const list = []; for (let i = 0; i < n; i++) { const s = Object.assign({}, C.at(i, t)); s.hid = handed[i] != null && t >= handed[i]; list.push(s); }
      separate(list, t);
      // visible members are packed at the front of each set and the draw count is set, so hidden and other-set members cost
      // nothing on the GPU (instances carry no per-member data, so their order does not matter)
      let na = 0, ns = 0;
      for (let i = 0; i < n; i++) {
        const s = list[i], hid = !s.vis || s.hid; const ms = s.s == null ? 1 : s.s; if (hid || ms <= 0.001) continue;
        const asl = !!s.asleep, br = asl ? 0.94 : 1 + 0.018 * Math.sin(t / 420 + noise(i, seed + 9) * 6.283);
        P.set(s.x, s.y, s.z); Q.setFromAxisAngle(Y, s.yaw); S.set(SC * ms, SC * br * ms, SC * ms);
        M.compose(P, Q, S); const j = asl ? ns++ : na++; for (const m of asl ? sleepMeshes : meshes) m.setMatrixAt(j, M);
      }
      for (const m of meshes) m.count = na; for (const m of sleepMeshes) m.count = ns;
      for (const m of meshes.concat(sleepMeshes)) m.instanceMatrix.needsUpdate = true;
    };
    k.track(C);
    return C;
  }
  KIT.crowd = { make };
})();
