// parts_b.js (film2 kit, v2-kit / Opus builder B): props and acts for the prologue shots P1a to T3c (BLOCKING.md section 3).
// Every part is registered in KIT.set.PARTS (shots call S.add("tower", {...})). Methods take times in ms and only record them;
// eval(t) (registered with k.track) rebuilds the whole visual state from t alone, so frames render in any order.
// Colours come only from PAL; every edge is an rbox or a round primitive. No Math.random (FILM.noise), no timers.
// Scale: the kit's own (sprite about 1.3 tall, Look.person 2.15 tall, kit door 2.1): props are sized against those.
(function () {
  "use strict";
  const { T, PAL, mat, rbox, add } = KIT.parts;
  const PARTS = KIT.set.PARTS;
  const tw = FILM.tw, clamp01 = FILM.clamp01, lerp = FILM.lerp, noise = FILM.noise, E = FILM.E;
  const V3 = (p) => (p == null ? null : Array.isArray(p) ? new T.Vector3(p[0], p[1] || 0, p[2]) : p.clone());
  const sortT = (l) => l.sort((a, b) => a.t0 - b.t0);

  // ---------------------------------------------------------------- small helpers
  function cyl(rt, rb, h, m, seg) { const me = new T.Mesh(new T.CylinderGeometry(rt, rb, h, seg || 28), typeof m === "string" ? mat(m) : m); me.castShadow = me.receiveShadow = true; return me; }
  function sph(r, m) { const me = new T.Mesh(new T.SphereGeometry(r, 20, 14), typeof m === "string" ? mat(m) : m); me.castShadow = me.receiveShadow = true; return me; }
  function cap(r, len, m) { const me = new T.Mesh(new T.CapsuleGeometry(r, len, 6, 14), typeof m === "string" ? mat(m) : m); me.castShadow = me.receiveShadow = true; return me; }
  // a world point into an object's parent space (the parent's world matrix refreshed, itself only)
  function toParent(obj, w) { const p = obj.parent; if (!p) return w.clone(); p.updateWorldMatrix(true, false); return p.worldToLocal(w.clone()); }
  function setWorld(obj, w) { obj.position.copy(toParent(obj, w)); }
  function worldOf(obj, local) { obj.updateWorldMatrix(true, false); return obj.localToWorld(V3(local || [0, 0, 0])); }
  // the rest position of a part: where S.add put it (captured on the first eval, before any track moves it)
  function home(obj) { if (!obj.userData._home) { obj.userData._home = { p: obj.position.clone(), r: obj.rotation.clone(), s: obj.scale.clone() }; } return obj.userData._home; }
  // piecewise-keyed scalar: keys [{t0, dur, to, ease}] from v0
  function keyed(keys, v0, t, ease) { let v = v0; for (const q of keys) { if (q.t0 > t) break; v = lerp(v, q.to, tw(t, q.t0, q.t0 + q.dur, q.ease || ease || "io")); } return v; }
  // a 4% overshoot settle (VL 6.4: a part is installed, 600 ms, out with 4% overshoot)
  const settle = (u) => E.out(clamp01(u / 0.8)) + 0.04 * Math.sin(Math.PI * clamp01((u - 0.55) / 0.45));
  const hex = (n) => "#" + n.toString(16).padStart(6, "0");
  // what an actor (agent or person) holds things with, in world space: between the mittens / in front of the chest
  function grip(a, op) {
    op = op || {};
    if (Array.isArray(a) || (a && a.isVector3)) return V3(a);
    if (a && a.spr) return a.spr.localToWorld(new T.Vector3(0, op.y != null ? op.y : 0.6, op.z != null ? op.z : 0.46));
    if (a && a.root) { const fs = (a.root.userData.fig && a.root.userData.fig.scale.y) || 1; a.root.updateWorldMatrix(true, false); return a.root.localToWorld(new T.Vector3(0, (op.y != null ? op.y : 1.2) * fs, (op.z != null ? op.z : 0.42) * fs)); }
    if (typeof a === "function") return a();
    return new T.Vector3();
  }
  const yawOf = (a) => (a && a.spr ? a.spr.rotation.y : a && a.root ? a.root.rotation.y : 0);

  // ---------------------------------------------------------------- acts that fit the ACTS shape (actors.js)
  const ACTS = KIT.actors.ACTS, TUG_P = 900;
  Object.assign(ACTS, {
    // hands forward at chest height with a little bounce: the body under three props in the air (PARTS.juggle)
    juggle: { dur: 2000, pose: "watch", body: (u, e, t) => ({ k: 1 + 0.025 * Math.sin(t / 72) * e, lift: 0.02 * Math.abs(Math.sin(t / 144)) * e }), env: true },
    // face pressed up against glass: both arms up, squashed, head tipped back (PARTS.press)
    press: { dur: 2000, pose: "drop", body: (u, e, t) => ({ k: 1 - 0.07 * e + 0.015 * Math.sin(t / 160) * e, lean: [0.03 * Math.sin(t / 400) * e, -0.12 * e] }), env: true },
    // a two-actor tug on one prop, in phase with PARTS.tug (period 900 ms): a leans back while b gives, then the reverse
    "tug-a": { dur: 1600, arms: "forward", body: (u, e, t) => ({ lean: [0, -(0.07 + 0.05 * Math.sin(2 * Math.PI * t / TUG_P)) * e] }), env: true },
    "tug-b": { dur: 1600, arms: "forward", body: (u, e, t) => ({ lean: [0, -(0.07 - 0.05 * Math.sin(2 * Math.PI * t / TUG_P)) * e] }), env: true },
  });

  // ---------------------------------------------------------------- a generic mover for any prop (tokens, notes, coins)
  // KIT.partsB.mover(k, obj).at(t0, p).to(t0, dur, p, {ease, arc, spin}).hide(t0).show(t0).scale(t0, dur, s)
  function mover(k, obj) {
    const segs = [], vis = [], scl = [];
    const M = {
      obj,
      at(t0, p) { segs.push({ t0, dur: 0, p: V3(p), kind: "at" }); sortT(segs); return M; },
      to(t0, dur, p, op) { segs.push(Object.assign({ t0, dur, p: V3(p), kind: "to" }, op || {})); sortT(segs); return M; },
      hide(t0) { vis.push({ t0, on: false }); sortT(vis); return M; },
      show(t0) { vis.push({ t0, on: true }); sortT(vis); return M; },
      scale(t0, dur, s, ease) { scl.push({ t0, dur, to: s, ease: ease || "out" }); sortT(scl); return M; },
      eval(t) {
        const h = home(obj);
        let p = null, from = null;
        for (const s of segs) {
          if (s.t0 > t) break;
          if (s.kind === "at") { p = s.p.clone(); continue; }
          const a = p ? p.clone() : obj.parent ? worldOf(obj.parent, h.p) : h.p.clone();
          const u = tw(t, s.t0, s.t0 + s.dur, s.ease || "io");
          p = a.clone().lerp(s.p, u); if (s.arc) p.y += s.arc * Math.sin(Math.PI * u);
          if (s.spin) obj.rotation.y = h.r.y + s.spin * u;
        }
        if (p) setWorld(obj, p); else obj.position.copy(h.p);
        let on = vis.length ? !vis[0].on : true; for (const v of vis) { if (v.t0 > t) break; on = v.on; }
        obj.visible = on;
        obj.scale.copy(h.s).multiplyScalar(keyed(scl, 1, t, "out"));
      },
    };
    k.track(M); return M;
  }

  // ================================================================ 1. the tower (P1a, P1b, P2)
  // The small non-profit's building: one lit storey with a door and windows; grow(t0, dur, storeys) stacks peopled storeys on it
  // (and keyed back down); light(t0, dur, warmth) moves its glow from warm (1) to cool (0). Origin: centre of the ground, front at +z.
  // o: w 5, d 3.6, sh 2.9 (storey height), max 6 (storeys above ground), storeys 0 (at t 0), warmth 1, doorX -w/4.
  PARTS.tower = function (k, o) {
    o = o || {};
    const g = new T.Group(), W = o.w || 5, D = o.d || 3.6, SH = o.sh || 2.9, MAX = o.max || 6, PL = 0.22;
    const doorX = o.doorX != null ? o.doorX : -W / 4;
    const pane = new T.MeshStandardMaterial({ color: PAL.wallWarm, emissive: new T.Color(PAL.wallWarm), emissiveIntensity: 0.6, roughness: 0.6 });
    const glass = new T.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.06, roughness: 0.15, depthWrite: false });   // v2-kit: VL 15.32, no tint on the glass
    const deep = mat("navy", { roughness: 0.7 });
    add(g, rbox(W + 0.6, PL, D + 0.6, mat("white"), 0.1, 0.06), 0, PL / 2, 0);
    // a window: a frame that stands out 0.24, a lit pane at the back, a small navy figure inside (head and shoulders), glass in front
    function windowAt(parent, x, y, ww, wh, seed, person) {
      const z = D / 2, f = 0.09;
      add(parent, rbox(ww - 0.04, wh - 0.04, 0.05, pane, 0.04, 0.015), x, y, z + 0.02);
      add(parent, rbox(ww + 2 * f, f, 0.26, mat("white"), 0.04, 0.02), x, y + wh / 2 + f / 2, z + 0.11);
      add(parent, rbox(ww + 2 * f, f, 0.3, mat("white"), 0.04, 0.02), x, y - wh / 2 - f / 2, z + 0.13);
      [-1, 1].forEach((s) => add(parent, rbox(f, wh, 0.26, mat("white"), 0.035, 0.02), x + s * (ww / 2 + f / 2), y, z + 0.11));
      if (person) {
        const dx = (noise(seed, 3) - 0.5) * ww * 0.35, hs = 0.85 + 0.25 * noise(seed, 4);
        const b = add(parent, cap(0.15 * hs, 0.16 * hs, deep), x + dx, y - wh / 2 + 0.16 * hs, z + 0.1); b.scale.set(1.35, 1, 0.8);
        add(parent, sph(0.12 * hs, deep), x + dx, y - wh / 2 + 0.43 * hs, z + 0.1);
      }
      const gl = new T.Mesh(new T.PlaneGeometry(ww, wh), glass); gl.position.set(x, y, z + 0.23); parent.add(gl);
    }
    // the ground storey
    const base = new T.Group(); base.position.y = PL; g.add(base);
    add(base, rbox(W, SH, D, mat("wall"), 0.16, 0.07), 0, SH / 2, 0);
    add(base, rbox(1.36, 2.42, 0.18, mat("white"), 0.06, 0.03), doorX, 1.21, D / 2 + 0.05);
    const leaf = add(base, rbox(1.06, 2.28, 0.1, new T.MeshStandardMaterial({ color: 0xfff1dc, emissive: 0xffe7c4, emissiveIntensity: 0.9, roughness: 0.8 }), 0.06, 0.03), doorX, 1.14, D / 2 + 0.04);   // v2-kit: VL 15.21, an open doorway with warm light, never black
    add(base, rbox(1.7, 0.1, 0.55, mat("white"), 0.04, 0.03), doorX, 2.55, D / 2 + 0.3);          // a small canopy
    add(base, rbox(1.6, 0.08, 0.7, mat("white"), 0.03, 0.02), doorX, 0.04, D / 2 + 0.36).receiveShadow = true; // the step
    const wx0 = doorX + 0.95, wx1 = W / 2 - 0.3, wn = Math.max(1, Math.floor((wx1 - wx0) / 1.15));
    for (let i = 0; i < wn; i++) windowAt(base, wx0 + (i + 0.5) * (wx1 - wx0) / wn, 1.55, 0.95, 1.05, 50 + i, i % 2 === 0);
    if (doorX - 0.7 > -W / 2 + 1.0) windowAt(base, (-W / 2 + doorX - 0.68) / 2, 1.55, 0.8, 1.05, 60, true);
    const lamp = new T.PointLight(0xffe7c4, 0, 5.5, 1.6); lamp.position.set(doorX, 2.4, D / 2 + 1.0); base.add(lamp);
    // upper storeys: each arrives already peopled (a figure in most windows)
    const storeys = [];
    const nw = Math.max(2, Math.floor((W - 0.6) / 1.3));
    for (let j = 1; j <= MAX; j++) {
      const s = new T.Group(); g.add(s); s.visible = false;
      add(s, rbox(W - 0.12, SH - 0.06, D - 0.12, mat("wall"), 0.16, 0.07), 0, (SH - 0.06) / 2 + 0.03, 0);
      add(s, rbox(W + 0.1, 0.12, D + 0.1, mat("white"), 0.05, 0.04), 0, 0.03, 0);                 // the floor band
      for (let i = 0; i < nw; i++) windowAt(s, -W / 2 + 0.3 + (i + 0.5) * (W - 0.6) / nw, SH * 0.52, 0.9, 1.1, j * 13 + i, noise(j * 13 + i, 7) < 0.82);
      storeys.push(s);
    }
    const roof = new T.Group(); g.add(roof);
    add(roof, rbox(W + 0.5, 0.26, D + 0.5, mat("white"), 0.12, 0.08), 0, 0.13, 0);
    add(roof, rbox(W * 0.32, 0.4, D * 0.36, mat("white"), 0.1, 0.06), W * 0.18, 0.26 + 0.2, -D * 0.15); // a roof box: reads as a house
    const grows = [], lights = [], n0 = o.storeys || 0, w0 = o.warmth != null ? o.warmth : 1;
    let roofY = PL + SH;
    const warm = new T.Color(PAL.wallWarm), cool = new T.Color(PAL.glass), lw = new T.Color(0xffe7c4), lc = new T.Color(0xdde6ef), roomWarm = new T.Color(0xf8f2e8), roomCool = new T.Color(0xeef1f4);
    g.grow = (t0, dur, storeys) => { grows.push({ t0, dur, to: storeys, ease: "lin" }); sortT(grows); return g; };
    g.light = (t0, dur, warmth) => { lights.push({ t0, dur, to: warmth, ease: "io" }); sortT(lights); return g; };
    g.storeys = (t) => keyed(grows, n0, t, "lin");
    g.warmth = (t) => keyed(lights, w0, t, "io");
    g.eval = (t) => {
      const n = g.storeys(t); let y = PL + SH;
      storeys.forEach((s, i) => {
        const u = clamp01(n - i), e = u <= 0 ? 0 : settle(u);
        s.visible = e > 0.002; s.position.y = y; s.scale.y = Math.max(0.002, e); y += SH * e;
      });
      roof.position.y = y; roofY = y;
      const w = g.warmth(t);
      // VL 15.32: the room behind the glass reads as a lit room wall (about 230), cooler as warmth drops, never grey
      pane.emissive.copy(roomCool).lerp(roomWarm, w); pane.emissiveIntensity = 0.72 + 0.2 * w; pane.color.copy(roomCool).lerp(roomWarm, w);
      leaf.material.emissive.copy(roomCool).lerp(lw, w); leaf.material.emissiveIntensity = 0.65 + 0.3 * w;
      lamp.color.copy(lc).lerp(lw, w); lamp.intensity = 2.2 * w + 0.4;
    };
    k.track(g);
    g.door = () => worldOf(g, [doorX, PL, D / 2 + 0.75]);      // the step in front of the door (world)
    g.inside = () => worldOf(g, [doorX, PL, D / 2 - 0.9]);     // just inside the door (people start here)
    g.top = () => worldOf(g, [0, roofY + 0.26, 0]);            // the roof (after eval at the current t)
    g.size = [W + 0.6, PL + SH * (1 + MAX) + 0.3];
    g.userData.leaf = leaf; g.userData.storeys = storeys; g.userData.roof = roof;
    return g;
  };

  // ================================================================ 2. a line of people: KIT.people(k, n, o) (k.people when the core exposes it)
  // n persons (KIT.actors.person, navy), reused round-robin. flow(t0, dur, {from:[x,y,z], path:[[x,z],...], rate, speed, jitter})
  // emits people at `rate` per second (a number, or keyed [[t, r], ...] piecewise linear in shot ms); each walks from `from`
  // along the path (walk pose) and is gone at its end. o: height, parent, face. Returns {list, times, flow}.
  KIT.people = function (k, n, o) {
    o = o || {}; n = Math.max(1, Math.min(n || 12, 40));
    const list = [], busy = [], hid = [0, -80, 0];
    for (let i = 0; i < n; i++) { list.push(KIT.actors.person(k, { at: hid, face: o.face || 0, height: o.height, parent: o.parent, name: "line" + i })); busy.push(-1e9); }
    const L = { list, times: [], n };
    const rateAt = (r, t) => {
      if (typeof r === "number") return r;
      if (!Array.isArray(r) || !r.length) return 1;
      if (t <= r[0][0]) return r[0][1];
      for (let i = 1; i < r.length; i++) if (t <= r[i][0]) return lerp(r[i - 1][1], r[i][1], (t - r[i - 1][0]) / Math.max(1, r[i][0] - r[i - 1][0]));
      return r[r.length - 1][1];
    };
    let count = 0;
    L.flow = function (t0, dur, f) {
      f = f || {};
      const from = V3(f.from || [0, 0, 0]), path = f.path || [[from.x + 4, from.z]];
      const speed = f.speed || 1.2 * ((o.height || 2.15) / 2.15), jit = f.jitter != null ? f.jitter : 0.35;
      // emission times: explicit, or the integral of the rate crossing whole numbers (the first at t0)
      let times = f.times ? f.times.slice() : [];
      if (!f.times) { let acc = 1 - (f.phase || 0); for (let t = t0; t < t0 + dur; t += 20) { if (acc >= 1) { times.push(t); acc -= 1; } acc += rateAt(f.rate == null ? 1 : f.rate, t) * 0.02; } }
      for (const tE of times) {
        const j = count++;
        const off = (noise(j, 21) - 0.5) * 2 * jit, offz = (noise(j, 22) - 0.5) * jit;
        const pts = path.map((q, i) => [q[0] + (i ? off * 0.6 : off * 0.3), q[1] + (i ? offz : 0)]);
        let len = 0, prev = [from.x, from.z]; for (const q of pts) { len += Math.hypot(q[0] - prev[0], q[1] - prev[1]); prev = q; }
        const travel = Math.round((len / speed) * 1000 * (0.92 + 0.16 * noise(j, 23)));
        // the first person free at tE (round robin from j)
        let pick = -1; for (let s = 0; s < n; s++) { const i = (j + s) % n; if (busy[i] < tE - 30) { pick = i; break; } }
        if (pick < 0) continue;   // pool exhausted: this emission is skipped (raise n)
        const P = list[pick];
        P.at(tE - 1, from.toArray(), Math.atan2(pts[0][0] - from.x, pts[0][1] - from.z));
        P.walk(tE, travel, pts);
        P.at(tE + travel + 1, [from.x, -80, from.z]);
        busy[pick] = tE + travel + 2; L.times.push(tE);
      }
      L.times.sort((a, b) => a - b);
      return L;
    };
    return L;
  };

  // ================================================================ 3. parts
  // ---- school: one room on a plinth; the front is a shutter that rolls up to open it. open(t0, dur), close(t0, dur),
  // light(t0, dur, to 0..1). spot(dx, dz) a world point on its floor; door() world point in front of its door. o: w 4.6 d 3.6 h 2.6
  PARTS.school = function (k, o) {
    o = o || {};
    const g = new T.Group(), W = o.w || 4.6, D = o.d || 3.6, H = o.h || 2.6, PL = 0.18;
    add(g, rbox(W + 0.4, PL, D + 0.4, mat("white"), 0.08, 0.05), 0, PL / 2, 0);
    add(g, rbox(W, H, 0.14, mat("wall"), 0.05, 0.03), 0, PL + H / 2, -D / 2);
    [-1, 1].forEach((s) => add(g, rbox(0.14, H, D, mat("wall"), 0.05, 0.03), s * W / 2, PL + H / 2, 0));
    add(g, rbox(W + 0.5, 0.22, D + 0.5, mat("white"), 0.1, 0.06), 0, PL + H + 0.11, 0);
    add(g, rbox(2.0, 0.9, 0.06, mat("ink", { roughness: 0.6 }), 0.05, 0.02), -0.6, PL + 1.45, -D / 2 + 0.1);   // the board
    // the front: a shutter (wall-warm) with a door and two windows, anchored at the top
    const front = new T.Group(); front.position.set(0, PL + H, D / 2); g.add(front);
    const fp = add(front, rbox(W + 0.02, H, 0.14, mat("wallWarm"), 0.05, 0.03), 0, -H / 2, 0);
    const dr = add(front, rbox(0.9, 1.8, 0.05, mat("ink", { roughness: 0.5 }), 0.05, 0.02), 1.3, -H + 0.9, 0.08);
    [-1.4, -0.2].forEach((x) => add(front, rbox(0.8, 0.6, 0.05, mat("glass", { roughness: 0.3 }), 0.05, 0.02), x, -H + 1.6, 0.08));
    const roll = add(g, cyl(0.12, 0.12, W, "white", 20), 0, PL + H - 0.08, D / 2 + 0.12); roll.rotation.z = Math.PI / 2;
    const lamp = new T.PointLight(0xfff1dd, 0, 6, 1.6); lamp.position.set(0, PL + H - 0.5, 0.3); g.add(lamp);
    const opens = [], lights = [];
    g.open = (t0, dur) => { opens.push({ t0, dur: dur || 600, to: 1, ease: "io" }); sortT(opens); return g; };
    g.close = (t0, dur) => { opens.push({ t0, dur: dur || 600, to: 0, ease: "io" }); sortT(opens); return g; };
    g.light = (t0, dur, to) => { lights.push({ t0, dur: dur || 600, to: to == null ? 1 : to, ease: "io" }); sortT(lights); return g; };
    const o0 = o.open ? 1 : 0, l0 = o.lit ? 1 : 0;
    g.eval = (t) => {
      const u = keyed(opens, o0, t, "io");
      front.scale.y = Math.max(0.002, 1 - u); front.visible = u < 0.995;
      roll.scale.set(1 + 0.5 * u, 1, 1 + 0.5 * u);
      lamp.intensity = 3.2 * keyed(lights, l0, t, "io");
    };
    k.track(g);
    g.spot = (dx, dz) => worldOf(g, [dx, PL, dz]).toArray();
    g.door = () => worldOf(g, [1.3, PL, D / 2 + 0.6]);
    g.dims = { W, D, H, PL };
    return g;
  };

  // ---- road: a soft clay strip along x with a few schools behind it. o: len 24, w 2.0, schools 3 (or [x...]), gap.
  // road.schools[i] are school parts; road.point(x) the world point on the road's centre at x.
  PARTS.road = function (k, o) {
    o = o || {};
    const g = new T.Group(), L = o.len || 24, Wd = o.w || 2.0;
    add(g, rbox(L, 0.06, Wd, mat("grey", { roughness: 0.95 }), 0.03, 0.025), 0, 0.03, 0);
    for (let x = -L / 2 + 0.8; x < L / 2 - 0.6; x += 1.4) add(g, rbox(0.7, 0.02, 0.12, mat("white"), 0.01, 0.008), x + 0.35, 0.065, 0);
    const xs = Array.isArray(o.schools) ? o.schools : (() => { const n = o.schools == null ? 3 : o.schools, gp = o.gap || L / Math.max(1, n); return Array.from({ length: n }, (_, i) => -L / 2 + gp * (i + 0.5)); })();
    g.schools = xs.map((x) => { const s = PARTS.school(k, o.school || {}); s.position.set(x, 0, -(Wd / 2 + 0.5 + (s.dims.D + 0.4) / 2)); g.add(s); return s; });
    g.point = (x) => worldOf(g, [x, 0.06, 0]);
    return g;
  };

  // ---- meter: a gauge on a post; to(t0, dur, value 0..1) swings the needle. o: value 0, h 1.1 (dial centre height), r 0.42
  PARTS.meter = function (k, o) {
    o = o || {};
    const g = new T.Group(), H = o.h || 1.1, R = o.r || 0.42, A0 = (2 * Math.PI) / 3;
    add(g, rbox(0.5, 0.08, 0.36, mat("white"), 0.04, 0.03), 0, 0.04, 0);
    add(g, rbox(0.14, H, 0.14, mat("white"), 0.05, 0.03), 0, H / 2, 0);
    const dial = new T.Group(); dial.position.set(0, H, 0.08); g.add(dial);
    const rim = add(dial, cyl(R + 0.06, R + 0.06, 0.12, "white", 48), 0, 0, 0); rim.rotation.x = Math.PI / 2;
    const face = add(dial, cyl(R, R, 0.02, "card", 48), 0, 0, 0.065); face.rotation.x = Math.PI / 2;
    for (let i = 0; i <= 10; i++) { const a = A0 - (i / 10) * 2 * A0, big = i % 5 === 0; const tk = add(dial, rbox(0.028, big ? 0.1 : 0.06, 0.02, mat(big ? "ink" : "grey"), 0.01, 0.006), -Math.sin(a) * (R - 0.08), Math.cos(a) * (R - 0.08), 0.08); tk.rotation.z = a; }
    const needle = new T.Group(); needle.position.z = 0.1; dial.add(needle);
    add(needle, rbox(0.035, R - 0.06, 0.02, mat("ink", { roughness: 0.5 }), 0.012, 0.006), 0, (R - 0.06) / 2, 0);
    add(needle, sph(0.05, "ink"), 0, 0, 0.01);
    const keys = [], v0 = o.value || 0;
    g.to = (t0, dur, value) => { keys.push({ t0, dur: dur || 500, to: value, ease: "out" }); sortT(keys); return g; };
    g.value = (t) => keyed(keys, v0, t, "out");
    g.eval = (t) => { let v = g.value(t); for (const q of keys) if (t >= q.t0 && t < q.t0 + q.dur + 300) v += 0.02 * Math.sin(Math.PI * clamp01((t - q.t0 - q.dur * 0.7) / 300)) * Math.sign(q.to - v0 || 1); needle.rotation.z = A0 - clamp01(v) * 2 * A0; };
    k.track(g);
    g.dialPoint = () => worldOf(dial, [0, 0, 0.12]);
    return g;
  };

  // ---- clock: a wall clock (hang it on a wall; origin at its bottom). sweep(t0, dur, fromH, toH) runs the hands. o: h 9, r 0.45
  PARTS.clock = function (k, o) {
    o = o || {};
    const g = new T.Group(), R = o.r || 0.45;
    const dial = new T.Group(); dial.position.y = R + 0.06; g.add(dial);
    const rim = add(dial, cyl(R + 0.06, R + 0.06, 0.1, "white", 48), 0, 0, 0); rim.rotation.x = Math.PI / 2;
    const face = add(dial, cyl(R - 0.02, R - 0.02, 0.02, "card", 48), 0, 0, 0.05); face.rotation.x = Math.PI / 2;
    for (let i = 0; i < 12; i++) { const a = (i / 12) * 2 * Math.PI, big = i % 3 === 0; const tk = add(dial, rbox(big ? 0.04 : 0.025, big ? 0.1 : 0.06, 0.02, mat(big ? "ink" : "grey"), 0.01, 0.006), Math.sin(a) * (R - 0.1), Math.cos(a) * (R - 0.1), 0.065); tk.rotation.z = -a; }
    const hh = new T.Group(), mh = new T.Group(); hh.position.z = 0.075; mh.position.z = 0.09; dial.add(hh); dial.add(mh);
    add(hh, rbox(0.05, R * 0.5, 0.02, mat("ink", { roughness: 0.5 }), 0.02, 0.006), 0, R * 0.22, 0);
    add(mh, rbox(0.035, R * 0.78, 0.02, mat("ink", { roughness: 0.5 }), 0.015, 0.006), 0, R * 0.36, 0);
    add(dial, sph(0.04, "ink"), 0, 0, 0.1);
    const sweeps = [], h0 = o.h != null ? o.h : 9;
    g.sweep = (t0, dur, fromH, toH) => { sweeps.push({ t0, dur, from: fromH, to: toH }); sortT(sweeps); return g; };
    g.hour = (t) => { let h = h0; for (const s of sweeps) { if (s.t0 > t) break; h = lerp(s.from, s.to, tw(t, s.t0, s.t0 + s.dur, "io")); } return h; };
    g.eval = (t) => { const h = g.hour(t); mh.rotation.z = -((h % 1) * 2 * Math.PI); hh.rotation.z = -(((h % 12) / 12) * 2 * Math.PI); };
    k.track(g);
    return g;
  };

  // ---- coin: a plain clay coin (white with a grey rim; o.colour "green" for funding). fall(t0, from, to, dur) drops it on a
  // world point with a small bounce; back(t0, dur) flies it back up to where it fell from and it is gone. Hidden until its first fall
  // unless o.rest (sitting where S.add put it).
  // the coin (v2-visuals 113600, VL 15.51): one brass coin, never a stack. Top #E2BE74, side #B08A48, rim and edge lines
  // #96703A; thickness a tenth of its width; a milled edge of 26 upright lines; one raised ring on the top, a seventh of the
  // width in from the rim. o.colour still overrides (legacy shots), brass is the default.
  function coinMesh(o) {
    const g = new T.Group(), r = o.r || 0.22, th = 0.2 * r;
    if (o.colour) {
      const c = o.colour; add(g, cyl(r, r, th, mat(c, { roughness: 0.55 }), 32), 0, th / 2, 0);
      const rim = new T.Mesh(new T.TorusGeometry(r - 0.02, 0.018, 8, 32), mat(c === "green" ? "greenSoft" : "grey", { roughness: 0.6 })); rim.rotation.x = Math.PI / 2; rim.position.y = th + 0.002; rim.castShadow = true; g.add(rim);
      return g;
    }
    const top = new T.MeshStandardMaterial({ color: 0xe2be74, roughness: 0.42, metalness: 0.25 }), side = new T.MeshStandardMaterial({ color: 0xb08a48, roughness: 0.5, metalness: 0.2 }), line = new T.MeshStandardMaterial({ color: 0x96703a, roughness: 0.55, metalness: 0.15 });
    const body = new T.Mesh(new T.CylinderGeometry(r, r, th, 48), [side, top, top]); body.position.y = th / 2; body.castShadow = body.receiveShadow = true; g.add(body);
    for (let i = 0; i < 26; i++) { const a = (i / 26) * 2 * Math.PI, m = new T.Mesh(new T.BoxGeometry(0.012 * r / 0.22, th * 0.8, 0.008), line); m.position.set(Math.sin(a) * (r + 0.002), th / 2, Math.cos(a) * (r + 0.002)); m.rotation.y = a; g.add(m); }
    const ring = new T.Mesh(new T.TorusGeometry(r - (2 * r) / 7, 0.012 * r / 0.22 + 0.004, 8, 48), line); ring.rotation.x = Math.PI / 2; ring.position.y = th + 0.003; ring.castShadow = true; g.add(ring);
    return g;
  }
  PARTS.coin = function (k, o) {
    o = o || {};
    const g = new T.Group(), body = coinMesh(o); g.add(body);
    const ev = [], seed = o.seed || 0;
    g.fall = (t0, from, to, dur) => { ev.push({ kind: "fall", t0, from: V3(from), to: V3(to), dur: dur || 700 }); sortT(ev); return g; };
    g.back = (t0, dur) => { ev.push({ kind: "back", t0, dur: dur || 500 }); sortT(ev); return g; };
    g.eval = (t) => {
      const h = home(g); let vis = !!o.rest, p = null, rx = 0, rz = 0, last = null;
      for (const e of ev) {
        if (e.t0 > t) break;
        if (e.kind === "fall") {
          last = e; vis = true; const u = clamp01((t - e.t0) / e.dur);
          p = e.from.clone().lerp(e.to, u); p.y = lerp(e.from.y, e.to.y, u * u);
          if (u >= 1) { const b = clamp01((t - e.t0 - e.dur) / 260); p.y += 0.07 * Math.sin(Math.PI * b) * (1 - b * 0.4); }
          const spin = (1 - u) * (3 + 2 * noise(seed, 5)); rx = spin; rz = spin * 0.6;
        } else if (e.kind === "back" && last) {
          const u = tw(t, e.t0, e.t0 + e.dur, "in"); p = last.to.clone().lerp(last.from, u); rx = 2 * u; vis = u < 1;
        }
      }
      g.visible = vis;
      if (p) setWorld(g, p); else g.position.copy(h.p);
      body.rotation.set(rx, 0, rz);
    };
    k.track(g); return g;
  };
  // ---- coinShower: n coins falling onto an area (P1b). o: n 16, area {x0,x1,z0,z1,y}, times [ms...] (one per coin, or t0/t1 to
  // spread them), height 7, colour. back(t0, dur, gap) sends them all back up in reverse order (P2).
  PARTS.coinShower = function (k, o) {
    o = o || {};
    const g = new T.Group(), n = o.n || 16, a = o.area || { x0: -1, x1: 1, z0: -1, z1: 1, y: 0 }, Hh = o.height || 7;
    const times = o.times || Array.from({ length: n }, (_, i) => Math.round(lerp(o.t0 || 0, o.t1 || 3000, (i + 0.3 * noise(i, 31)) / n)));
    g.coins = [];
    for (let i = 0; i < n; i++) {
      const c = PARTS.coin(k, { colour: o.colour, seed: i, r: o.r }); g.add(c);
      const x = lerp(a.x0, a.x1, noise(i, 32)), z = lerp(a.z0, a.z1, noise(i, 33)), y = (a.y || 0) + (o.stack ? 0.075 * Math.floor(noise(i, 34) * 3) : 0);
      c.userData.drop = { from: [x + (noise(i, 35) - 0.5), y + Hh, z], to: [x, y, z] };
      c.fall(times[i % times.length], c.userData.drop.from, c.userData.drop.to, o.dur || 750);
      g.coins.push(c);
    }
    g.back = (t0, dur, gap) => { g.coins.slice().reverse().forEach((c, i) => c.back(t0 + i * (gap == null ? 40 : gap), dur || 500)); return g; };
    return g;
  };

  // ---- phone2: a phone propped on a small stand, screen facing +z. glow(t0, dur) lights the screen; state(t0, "tick"|"dash"|"off"|"on");
  // send(t0) a small wave leaves the screen upwards; receive(t0) a wave comes down into it. o: tilt 0.3, size 1, stand true.
  let phoneTex = null;
  function phoneTextures() {
    if (phoneTex) return phoneTex;
    const mk = (draw) => { const c = document.createElement("canvas"); c.width = 128; c.height = 240; const x = c.getContext("2d"); x.fillStyle = hex(PAL.card); x.fillRect(0, 0, 128, 240); draw(x); const tx = new T.CanvasTexture(c); tx.colorSpace = T.SRGBColorSpace; return tx; };
    const lines = (x) => { x.fillStyle = hex(PAL.grey); [[16, 40, 70], [16, 64, 56], [40, 100, 72], [40, 124, 60], [16, 160, 64]].forEach(([a, b, w]) => { x.beginPath(); x.roundRect(a, b, w, 12, 6); x.fill(); }); };
    phoneTex = {
      on: mk(lines),
      tick: mk((x) => { x.strokeStyle = hex(PAL.green); x.lineWidth = 18; x.lineCap = "round"; x.lineJoin = "round"; x.beginPath(); x.moveTo(30, 122); x.lineTo(56, 150); x.lineTo(100, 92); x.stroke(); }),
      dash: mk((x) => { x.strokeStyle = hex(PAL.grey); x.lineWidth = 18; x.lineCap = "round"; x.beginPath(); x.moveTo(38, 120); x.lineTo(90, 120); x.stroke(); }),
    };
    return phoneTex;
  }
  function waveIcon(m, w, h) {
    const g = new T.Group(), hs = [0.35, 0.7, 1, 0.6, 0.85, 0.4, 0.25];
    hs.forEach((s, i) => add(g, rbox(w * 0.09, h * s, w * 0.09, typeof m === "string" ? mat(m) : m, w * 0.04, w * 0.02), -w / 2 + (i + 0.5) * w / hs.length, 0, 0));
    return g;
  }
  PARTS.phone2 = function (k, o) {
    o = o || {};
    const g = new T.Group(), s = o.size || 1, tilt = o.tilt != null ? o.tilt : 0.3, PW = 0.3 * s, PH = 0.56 * s;
    const body = new T.Group(); g.add(body);
    if (o.stand !== false) add(g, rbox(0.26 * s, 0.08 * s, 0.22 * s, mat("white"), 0.03, 0.02), 0, 0.04 * s, -0.04 * s);
    body.position.set(0, 0.02 * s, 0.04 * s); body.rotation.x = -tilt;
    add(body, rbox(PW, PH, 0.04 * s, mat("ink", { roughness: 0.4 }), 0.05 * s, 0.015 * s), 0, PH / 2, 0);
    const tex = phoneTextures();
    const sm = new T.MeshBasicMaterial({ color: PAL.ink, map: tex.on, toneMapped: false });
    const scr = new T.Mesh(new T.PlaneGeometry(PW * 0.86, PH * 0.88), sm); scr.position.set(0, PH / 2, 0.022 * s); body.add(scr);
    const wv = waveIcon("ink", 0.24 * s, 0.14 * s); wv.visible = false; g.add(wv);
    const st = [], waves = [], dark = new T.Color(PAL.ink).lerp(new T.Color(0x000000), 0.1), lit = new T.Color(0xffffff);
    if (o.on) st.push({ t0: -1e9, s: "on", dur: 0 });
    g.glow = (t0, dur) => { st.push({ t0, s: "on", dur: dur == null ? 250 : dur }); sortT(st); return g; };
    g.state = (t0, s2, dur) => { st.push({ t0, s: s2, dur: dur == null ? 200 : dur }); sortT(st); return g; };
    g.send = (t0, dur) => { waves.push({ t0, dur: dur || 600, dir: 1 }); sortT(waves); return g; };
    g.receive = (t0, dur) => { waves.push({ t0, dur: dur || 600, dir: -1 }); sortT(waves); return g; };
    g.eval = (t) => {
      let cur = { s: "off", t0: -1e9, dur: 0 }, prev = "off"; for (const q of st) { if (q.t0 > t) break; prev = cur.s; cur = q; }
      const u = cur.dur ? tw(t, cur.t0, cur.t0 + cur.dur, "out") : 1;
      const on = cur.s !== "off", wasOn = prev !== "off";
      const b = on ? (wasOn ? 1 : u) : (wasOn ? 1 - u : 0);
      sm.color.copy(dark).lerp(lit, b); sm.map = cur.s === "tick" ? tex.tick : cur.s === "dash" ? tex.dash : tex.on;
      const pop = on && !wasOn ? 0.06 * Math.sin(Math.PI * clamp01((t - cur.t0) / 300)) : 0; scr.scale.setScalar(1 + pop);
      wv.visible = false;
      for (const w of waves) { if (w.t0 > t || t > w.t0 + w.dur) continue; const v = tw(t, w.t0, w.t0 + w.dur, "io"), p = w.dir > 0 ? v : 1 - v;
        wv.visible = true; wv.position.set(0, PH * 0.6 + 0.9 * s * p, 0.2 * s); wv.scale.setScalar(Math.max(0.01, w.dir > 0 ? 1 - Math.max(0, (p - 0.7) / 0.3) : Math.min(1, p / 0.2 + 0.0001))); }
    };
    k.track(g);
    g.screenPoint = () => worldOf(scr, [0, 0, 0.01]);
    g.userData.screen = scr;
    return g;
  };

  // ---- small props, sized against the sprite's mittens. Each lies as it would on a desk; origin at its bottom centre.
  PARTS.pen = function (k, o) { const g = new T.Group(), L = (o && o.len) || 0.34; const b = add(g, cyl(0.026, 0.026, L * 0.78, "white", 16), -L * 0.11, 0.026, 0); b.rotation.z = Math.PI / 2;
    const tip = add(g, cyl(0.026, 0.004, L * 0.16, "ink", 16), L * 0.36, 0.026, 0); tip.rotation.z = -Math.PI / 2;
    const cl = add(g, rbox(L * 0.25, 0.012, 0.016, mat("ink"), 0.005, 0.004), -L * 0.32, 0.054, 0); cl.castShadow = true;
    const end = add(g, sph(0.026, "ink"), -L * 0.5, 0.026, 0); end.scale.set(0.5, 1, 1); return g; };
  PARTS.ruler = function (k, o) { const g = new T.Group(), L = (o && o.len) || 0.5; add(g, rbox(L, 0.018, 0.08, mat("paper"), 0.008, 0.006), 0, 0.009, 0);
    for (let i = 0; i <= 10; i++) add(g, rbox(0.008, 0.006, i % 5 ? 0.022 : 0.036, mat("ink"), 0.002, 0.002), -L / 2 + 0.03 + i * (L - 0.06) / 10, 0.02, -0.04 + (i % 5 ? 0.011 : 0.018)); return g; };
  PARTS.calculator = function (k, o) { const g = new T.Group(); add(g, rbox(0.22, 0.045, 0.3, mat("white"), 0.03, 0.015), 0, 0.0225, 0);
    add(g, rbox(0.17, 0.012, 0.07, mat("ink", { roughness: 0.4 }), 0.01, 0.005), 0, 0.047, -0.09);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) add(g, rbox(0.042, 0.016, 0.036, mat(c === 2 && r === 3 ? "green" : "grey"), 0.012, 0.006), -0.055 + c * 0.055, 0.048, -0.02 + r * 0.047); return g; };
  PARTS.stamp = function (k, o) { const g = new T.Group(); add(g, rbox(0.2, 0.06, 0.14, mat("grey"), 0.02, 0.015), 0, 0.03, 0); add(g, rbox(0.21, 0.014, 0.15, mat("green", { roughness: 0.6 }), 0.02, 0.006), 0, 0.007, 0);
    add(g, cyl(0.032, 0.04, 0.14, "white", 18), 0, 0.13, 0); add(g, sph(0.065, "ink"), 0, 0.23, 0).scale.set(1, 0.85, 1); return g; };
  PARTS.magnifier = function (k, o) { const g = new T.Group(), R = (o && o.r) || 0.15; const lens = new T.Group(); lens.position.y = 0.3 + R; g.add(lens);
    const rim = new T.Mesh(new T.TorusGeometry(R, 0.028, 10, 36), mat("grey", { roughness: 0.6 })); rim.castShadow = true; lens.add(rim);
    lens.add(new T.Mesh(new T.CircleGeometry(R, 32), new T.MeshStandardMaterial({ color: PAL.glass, transparent: true, opacity: 0.28, roughness: 0.1, side: T.DoubleSide, depthWrite: false })));
    add(g, cap(0.03, 0.22, "ink"), 0, 0.14, 0); add(g, cyl(0.04, 0.04, 0.05, "grey", 16), 0, 0.29, 0); return g; };
  PARTS.clipboard = function (k, o) { const g = new T.Group(); add(g, rbox(0.32, 0.44, 0.02, mat("tableEdge"), 0.03, 0.008), 0, 0.22, 0);
    add(g, rbox(0.27, 0.35, 0.008, mat("card"), 0.015, 0.003), 0, 0.2, 0.014);
    [0.3, 0.25, 0.2, 0.15].forEach((y, i) => add(g, rbox(i % 2 ? 0.14 : 0.18, 0.012, 0.004, mat("grey"), 0.004, 0.002), -0.03, y, 0.02));
    add(g, rbox(0.12, 0.05, 0.03, mat("ink"), 0.015, 0.008), 0, 0.42, 0.016);
    if (o && o.flat) { const w = new T.Group(); while (g.children.length) w.add(g.children[0]); w.rotation.x = -Math.PI / 2; g.add(w); } return g; };

  // ---- binders: a stack lying flat. drop(t0, gap) lands them one by one from above; topple(t0, dir) spills the stack sideways
  // (dir +1 towards +x). o: n 7, floor (local y where they come to rest after the topple, default 0).
  PARTS.binders = function (k, o) {
    o = o || {};
    const g = new T.Group(), n = o.n || 7, BW = 0.5, BT = 0.09, BD = 0.38, cols = ["white", "card", "paper", "white", "grey", "card", "paper"];
    const bs = [];
    for (let i = 0; i < n; i++) { const b = new T.Group(); g.add(b);
      add(b, rbox(BW, BT, BD, mat(cols[i % cols.length]), 0.03, 0.02), 0, 0, 0);
      add(b, rbox(0.012, BT * 0.7, BD * 0.5, mat("grey"), 0.004, 0.004), -BW / 2 - 0.004, 0, 0);
      add(b, rbox(0.06, BT * 0.5, 0.02, mat("ink"), 0.01, 0.005), -BW / 2 + 0.08, 0, BD / 2 + 0.002);
      b.userData = { y: BT / 2 + i * BT * 1.02, rz: (noise(i, 71) - 0.5) * 0.08, ry: (noise(i, 72) - 0.5) * 0.25, dx: (noise(i, 73) - 0.5) * 0.06 }; bs.push(b); }
    let drop = null, top = null;
    g.drop = (t0, gap) => { drop = { t0, gap: gap == null ? 170 : gap }; return g; };
    g.topple = (t0, dir) => { top = { t0, dir: dir || 1 }; return g; };
    g.eval = (t) => {
      bs.forEach((b, i) => {
        const u = b.userData; let x = u.dx, y = u.y, rz = 0, ry = u.ry, vis = true, sq = 1;
        if (drop) { const ti = drop.t0 + i * drop.gap, v = clamp01((t - ti) / 380); vis = t >= ti; y = u.y + 2.4 * (1 - v * v); if (v >= 1) sq = 1 - 0.12 * Math.sin(Math.PI * clamp01((t - ti - 380) / 200)); }
        if (top && t >= top.t0) {
          const j = n - 1 - i, v = tw(t, top.t0 + j * 55, top.t0 + j * 55 + 620, "in"), d = top.dir;
          const fx = d * (0.25 + 0.2 * i + 0.1 * noise(i, 74)), fy = (o.floor || 0) + BT / 2 + (i % 3) * BT * 0.9;
          x = lerp(u.dx, fx, v); y = lerp(u.y, fy, v) + (0.15 + 0.03 * i) * Math.sin(Math.PI * v); rz = -d * Math.PI * v; ry = u.ry + d * 0.6 * noise(i, 75) * v;
          if (v >= 1) sq = 1 - 0.1 * Math.sin(Math.PI * clamp01((t - top.t0 - j * 55 - 620) / 180));
        }
        b.visible = vis; b.position.set(x, y, 0); b.rotation.set(0, ry, rz); b.scale.set(1, sq, 1);
      });
    };
    k.track(g);
    g.topPoint = () => worldOf(g, [0, n * BT * 1.02 + 0.02, 0]);
    return g;
  };

  // ---- map: a paper map hanging from a rod (origin: the rod's centre). Rolled at first; unroll(t0, dur) rolls it down, front shows
  // only the building's outline; flip(t0, dur) turns it over (the back is blank). heldBy(actor, t0, t1) keeps the rod in the
  // actor's hand between t0 and t1 (heldBy(A, t0, t1, {side:"L"|"R"|"front", y})): beside it by default, one mitten reaching the rod. o: w 0.9, h 0.75, open false.
  let mapTex = null;
  function mapTexture() {
    if (mapTex) return mapTex;
    const c = document.createElement("canvas"); c.width = 512; c.height = 614; const x = c.getContext("2d");
    x.fillStyle = hex(PAL.paper); x.fillRect(0, 0, 512, 614);
    x.strokeStyle = hex(PAL.ink); x.lineWidth = 7; x.lineJoin = "round"; x.lineCap = "round";
    x.beginPath(); x.roundRect(64, 250, 384, 290, 18); x.stroke();                     // the block
    x.beginPath(); x.moveTo(40, 250); x.lineTo(472, 250); x.stroke();                 // the ground line
    x.beginPath(); x.roundRect(166, 150, 180, 100, 10); x.stroke();                   // the pavilion
    x.lineWidth = 4; x.beginPath(); x.moveTo(64, 395); x.lineTo(448, 395); x.moveTo(256, 250); x.lineTo(256, 540); x.stroke(); // floors, rooms: empty
    x.strokeStyle = hex(PAL.grey); x.lineWidth = 3; x.strokeRect(22, 22, 468, 570);
    mapTex = new T.CanvasTexture(c); mapTex.colorSpace = T.SRGBColorSpace; return mapTex;
  }
  PARTS.map = function (k, o) {
    o = o || {};
    const g = new T.Group(), Wm = o.w || 0.9, Hm = o.h || 0.75;
    const piv = new T.Group(); g.add(piv);
    const rod = add(piv, cyl(0.03, 0.03, Wm + 0.12, "white", 16), 0, 0, 0); rod.rotation.z = Math.PI / 2;
    const sheet = new T.Group(); piv.add(sheet);
    const pg = new T.PlaneGeometry(Wm, Hm); pg.translate(0, -Hm / 2, 0);
    const front = new T.Mesh(pg, new T.MeshStandardMaterial({ map: mapTexture(), roughness: 0.85 })); front.position.z = 0.004; front.castShadow = true; sheet.add(front);
    const back = new T.Mesh(pg, new T.MeshStandardMaterial({ color: PAL.paper, roughness: 0.85 })); back.rotation.y = Math.PI; back.position.z = -0.004; back.castShadow = true; sheet.add(back);
    const roll = add(piv, cyl(1, 1, Wm, "paper", 24), 0, 0, 0); roll.rotation.z = Math.PI / 2;
    const unr = [], flips = [], holds = [], u0 = o.open ? 1 : 0;
    g.unroll = (t0, dur) => { unr.push({ t0, dur: dur || 700, to: 1, ease: "out" }); sortT(unr); return g; };
    g.rollUp = (t0, dur) => { unr.push({ t0, dur: dur || 500, to: 0, ease: "io" }); sortT(unr); return g; };
    g.flip = (t0, dur) => { flips.push({ t0, dur: dur || 600, to: flips.length + 1, ease: "io" }); sortT(flips); return g; };
    // side "L" (the sprite's own left = screen right when it faces us) | "R" | "front" (hung in front of the body, under the face)
    g.heldBy = (A, t0, t1, op) => { op = op || {}; const side = op.side || "L", sx = side === "L" ? 1 : side === "R" ? -1 : 0;
      const at = sx ? new T.Vector3(sx * (Wm / 2 + 0.38), op.y || 1.32, 0.22) : new T.Vector3(0, op.y || 0.68, 0.5);
      holds.push({ A, t0, t1: t1 == null ? 1e9 : t1, at });
      if (A.spr && sx && A.reach) { A.spr.updateMatrixWorld(true); A.reach(t0, 350, A.spr.localToWorld(new T.Vector3(sx * 0.42, at.y, at.z)), { hand: side, hold: Math.max(0, (t1 == null ? 1e7 : t1 - t0) - 700) }); }
      else if (A.pose) { A.pose(t0, "climb"); if (t1 != null && A.idle) A.idle(t1); }
      return g; };
    g.eval = (t) => {
      const u = keyed(unr, u0, t, "out");
      sheet.scale.y = Math.max(0.002, u); sheet.visible = u > 0.003;
      const r = 0.035 + 0.075 * (1 - u); roll.scale.set(r, 1, r); roll.position.set(0, -Hm * u - r * 0.6, 0.0);
      piv.rotation.y = Math.PI * keyed(flips, 0, t, "io");
      const h = home(g); let held = null; for (const q of holds) if (t >= q.t0 && t < q.t1) held = q;
      if (held) { setWorld(g, held.A.spr ? held.A.spr.localToWorld(held.at.clone()) : grip(held.A, { y: 1.4 })); g.rotation.set(0, yawOf(held.A), 0); }
      else { g.position.copy(h.p); g.rotation.copy(h.r); }
    };
    k.track(g);
    return g;
  };

  // ---- stickyNote: a small square note lying flat (o.lines false = blank). blow(t0, path, dur) carries it away on a wind path of
  // world points, fluttering; settle(t0, to, dur) drifts it down onto a world point; blank(t0) clears its writing.
  PARTS.stickyNote = function (k, o) {
    o = o || {};
    const g = new T.Group(), S = o.size || 0.18, seed = o.seed || 0;
    const body = new T.Group(); g.add(body);
    add(body, rbox(S, S, 0.012, mat("paper"), S * 0.08, 0.005), 0, 0, 0);
    const ln = new T.Group(); body.add(ln);
    [0.04, 0, -0.04].forEach((y, i) => add(ln, rbox(S * (i === 2 ? 0.4 : 0.62), 0.012, 0.004, mat("grey"), 0.005, 0.002), -S * 0.06, y, 0.008));
    ln.visible = o.lines !== false;
    body.rotation.x = -Math.PI / 2; body.position.y = 0.006;
    const ev = []; let blankAt = null;
    g.blow = (t0, path, dur) => { ev.push({ kind: "blow", t0, dur: dur || 1600, pts: path.map(V3) }); sortT(ev); return g; };
    g.settle = (t0, to, dur) => { ev.push({ kind: "settle", t0, dur: dur || 1800, to: V3(to) }); sortT(ev); return g; };
    g.blank = (t0) => { blankAt = t0; return g; };
    g.eval = (t) => {
      const h = home(g); let p = null, fl = 0, rx = -Math.PI / 2, rz = 0, ry = 0;
      for (const e of ev) {
        if (e.t0 > t) break;
        const start = p ? p.clone() : worldOf(g.parent, h.p);
        if (e.kind === "blow") {
          const u = tw(t, e.t0, e.t0 + e.dur, "in"), c = new T.CatmullRomCurve3([start].concat(e.pts), false, "centripetal");
          p = c.getPointAt(u); fl = Math.min(1, u * 4);
        } else {
          const u = tw(t, e.t0, e.t0 + e.dur, "out"); p = start.clone().lerp(e.to, u); p.x += 0.25 * Math.sin(u * Math.PI * 3) * (1 - u); fl = 1 - u;
        }
      }
      if (p) setWorld(g, p); else g.position.copy(h.p);
      const ph = t / 130 + noise(seed, 81) * 6;
      body.rotation.set(rx + fl * 0.9 * Math.sin(ph), ry + fl * 2.0 * Math.sin(ph * 0.37), rz + fl * 0.7 * Math.cos(ph * 0.8));
      ln.visible = o.lines !== false && !(blankAt != null && t >= blankAt);
    };
    k.track(g);
    return g;
  };

  // ---- pages: a mountain of finished pages (instanced). o: count 140, r 0.9 (base radius), h 1.1. land(t0) one more page lands on top.
  PARTS.pages = function (k, o) {
    o = o || {};
    const g = new T.Group(), n = o.count || 220, R = o.r || 1.0, Hh = o.h || 1.1, PW = 0.42, PD = 0.3;
    const geo = rbox(PW, 0.014, PD, mat("paper"), 0.006, 0.005).geometry;
    const A = new T.InstancedMesh(geo, mat("paper"), Math.ceil(n / 2)), B = new T.InstancedMesh(geo, mat("card"), Math.ceil(n / 2));
    [A, B].forEach((m) => { m.castShadow = m.receiveShadow = true; g.add(m); });
    const d = new T.Object3D(); let ia = 0, ib = 0;
    for (let i = 0; i < n; i++) {
      const f = i / n, yf = 1 - Math.sqrt(1 - f), rr = (R * (1 - yf) + 0.05) * Math.sqrt(noise(i, 91)), a = noise(i, 92) * Math.PI * 2;
      d.position.set(Math.cos(a) * rr, Hh * yf + 0.007, Math.sin(a) * rr * 0.85);
      const tl = 0.12 + 0.25 * (1 - yf); d.rotation.set((noise(i, 93) - 0.5) * tl, noise(i, 94) * Math.PI, (noise(i, 95) - 0.5) * tl); d.updateMatrix();
      if (i % 2) A.setMatrixAt(ia++, d.matrix); else B.setMatrixAt(ib++, d.matrix);
    }
    A.count = ia; B.count = ib;
    const lands = [];
    g.land = (t0) => { const pg = add(g, rbox(PW, 0.014, PD, mat("card"), 0.006, 0.005), 0, 0, 0); pg.visible = false; lands.push({ t0, pg, i: lands.length }); sortT(lands); return g; };
    g.eval = (t) => { lands.forEach((L) => { const u = clamp01((t - L.t0) / 900), e = E.out(u); L.pg.visible = t >= L.t0;
      L.pg.position.set(0.2 * Math.sin(u * 7) * (1 - u), Hh + 0.02 + L.i * 0.016 + 1.6 * (1 - e), 0); L.pg.rotation.set(0.5 * Math.sin(u * 9) * (1 - u), 0.6 + L.i, 0.4 * Math.cos(u * 8) * (1 - u)); }); };
    k.track(g);
    g.topPoint = () => worldOf(g, [0, Hh + 0.05, 0]);
    return g;
  };

  // ---- rubric: an upright page on a small foot with four rows, each a line and a green tick. draw(t0, gap) writes the rows on
  // one by one (otherwise all drawn). o: flat true lies it on the table.
  function tickMesh(s, m) { const g = new T.Group(); const a = add(g, rbox(0.022 * s, 0.06 * s, 0.012, m, 0.008, 0.004), -0.018 * s, -0.008 * s, 0); a.rotation.z = 0.75;
    const b = add(g, rbox(0.022 * s, 0.11 * s, 0.012, m, 0.008, 0.004), 0.02 * s, 0.012 * s, 0); b.rotation.z = -0.6; return g; }
  PARTS.rubric = function (k, o) {
    o = o || {};
    const g = new T.Group(), inner = new T.Group(); g.add(inner);
    const PW = 0.6, PH = 0.8;
    add(inner, rbox(PW, PH, 0.02, mat("card"), 0.04, 0.008), 0, PH / 2 + 0.04, 0);
    add(inner, rbox(PW * 0.55, 0.04, 0.008, mat("ink"), 0.012, 0.003), -PW * 0.12, PH - 0.06, 0.014);
    const rows = [];
    for (let i = 0; i < 4; i++) { const y = PH - 0.2 - i * 0.15;
      const lg = new T.Group(); lg.position.set(-PW / 2 + 0.07, y, 0.014); inner.add(lg);
      add(lg, rbox(0.32, 0.03, 0.006, mat("grey"), 0.012, 0.002), 0.16, 0, 0);
      const tk = tickMesh(1, mat("green", { roughness: 0.6 })); tk.position.set(PW / 2 - 0.11, y, 0.018); inner.add(tk);
      rows.push({ lg, tk }); }
    if (!o.flat) { const ft = add(g, rbox(PW * 0.7, 0.04, 0.22, mat("white"), 0.02, 0.012), 0, 0.02, -0.04); inner.position.z = 0.02; inner.rotation.x = -0.12; void ft; }
    else { inner.rotation.x = -Math.PI / 2; inner.position.set(0, 0.012, PH / 2 + 0.04); }
    let draw = null;
    g.draw = (t0, gap) => { draw = { t0, gap: gap == null ? 170 : gap }; return g; };
    g.eval = (t) => { rows.forEach((r, i) => { let a = 1, b = 1;
      if (draw) { const ti = draw.t0 + i * (draw.gap + 300); a = tw(t, ti, ti + 400, "outExpo"); b = tw(t, ti + 250, ti + 600, "back"); }
      r.lg.scale.x = Math.max(0.001, a); r.lg.visible = a > 0.001; r.tk.scale.setScalar(Math.max(0.001, b)); r.tk.visible = b > 0.001; }); };
    k.track(g);
    return g;
  };

  // ---- tokens for P3b (also used on the stations): wave, textLines, score. Small upright icons, bottom at the origin.
  PARTS.wave = function (k, o) { const g = new T.Group(), s = (o && o.size) || 1; const w = waveIcon("ink", 0.42 * s, 0.26 * s); w.position.y = 0.15 * s; g.add(w); return g; };
  PARTS.textLines = function (k, o) { const g = new T.Group(), s = (o && o.size) || 1;
    add(g, rbox(0.42 * s, 0.32 * s, 0.03 * s, mat("card"), 0.03 * s, 0.01 * s), 0, 0.16 * s, 0);
    [0.82, 0.62, 0.74, 0.5].forEach((f, i) => add(g, rbox(0.34 * s * f, 0.03 * s, 0.01, mat("grey"), 0.012 * s, 0.004), -0.17 * s + 0.17 * s * f, 0.26 * s - i * 0.065 * s, 0.02 * s)); return g; };
  PARTS.score = function (k, o) { const g = new T.Group(), s = (o && o.size) || 1, of = (o && o.of) || 5, n = (o && o.n) != null ? o.n : 3;
    const ring = new T.Mesh(new T.TorusGeometry(0.15 * s, 0.03 * s, 12, 36), mat("green", { roughness: 0.6 })); ring.position.y = 0.2 * s; ring.castShadow = true; g.add(ring);
    add(g, cyl(0.13 * s, 0.13 * s, 0.03 * s, "card", 32), 0, 0.2 * s, 0).rotation.x = Math.PI / 2;
    const tk = tickMesh(1.4 * s, mat("green", { roughness: 0.6 })); tk.position.set(0, 0.2 * s, 0.03 * s); g.add(tk);
    for (let i = 0; i < of; i++) add(g, sph(0.028 * s, i < n ? "green" : "grey"), (i - (of - 1) / 2) * 0.075 * s, 0.03 * s, 0.02);
    return g; };

  // ---- station: P3b's three steps in a row. light(t0, i) lights step i (0..2): its panel glows warm, its lamp turns green, its icon
  // pops. Icons: a wave, lines of text, a score. point(i, "in"|"out"|"top") world points for things that travel. o: gap 1.6
  PARTS.station = function (k, o) {
    o = o || {};
    const g = new T.Group(), gap = o.gap || 1.6, icons = o.icons || ["wave", "textLines", "score"];
    add(g, rbox(gap * 2 + 1.5, 0.08, 1.0, mat("white"), 0.04, 0.03), 0, 0.04, 0);
    const units = [];
    for (let i = 0; i < 3; i++) {
      const u = new T.Group(); u.position.x = (i - 1) * gap; g.add(u);
      add(u, rbox(1.0, 0.7, 0.7, mat("white"), 0.12, 0.05), 0, 0.08 + 0.35, 0);
      const pm = new T.MeshStandardMaterial({ color: PAL.grey, emissive: new T.Color(PAL.wallWarm), emissiveIntensity: 0, roughness: 0.7 });
      add(u, rbox(0.66, 0.32, 0.04, pm, 0.06, 0.015), 0, 0.46, 0.35);
      const dm = new T.MeshStandardMaterial({ color: PAL.grey, roughness: 0.6 });
      add(u, sph(0.045, dm), 0.38, 0.7, 0.36);
      add(u, rbox(0.06, 0.24, 0.12, mat("ink", { roughness: 0.5 }), 0.025, 0.012), -0.5, 0.45, 0);   // the slot in
      add(u, rbox(0.16, 0.05, 0.3, mat("white"), 0.02, 0.012), 0.56, 0.2, 0.1);                      // the tray out
      const ic = PARTS[icons[i]](k, { size: 0.9 }); ic.position.set(0, 0.78, 0); u.add(ic);
      units.push({ u, pm, dm, ic, t0: null });
    }
    g.light = (t0, i) => { units[i].t0 = t0; return g; };
    g.eval = (t) => units.forEach((s) => { const on = s.t0 != null && t >= s.t0, e = on ? tw(t, s.t0, s.t0 + 400, "out") : 0;
      s.pm.emissiveIntensity = 0.95 * e; s.pm.color.set(PAL.grey).lerp(new T.Color(PAL.wallWarm), e); s.dm.color.set(on ? PAL.green : PAL.grey); s.ic.scale.setScalar(1 + (on ? 0.18 * Math.sin(Math.PI * clamp01((t - s.t0) / 320)) : 0)); });
    k.track(g);
    g.point = (i, which) => worldOf(units[i].u, which === "in" ? [-0.62, 0.45, 0] : which === "out" ? [0.6, 0.26, 0.1] : [0, 1.35, 0]);
    return g;
  };

  // ================================================================ 4. acts as parts
  // ---- juggle: KIT.set.PARTS.juggle(k, {actor, props:[a,b,c], t0, t1, period}) (or S.add("juggle", {...})). The props sit where
  // they were put until t0 - 400, rise from the mittens into an orbit above the head, and at t1 come down caught, stacked in the
  // mittens, and stay held. Declares actor.act(t0, "juggle"). The props are owned by the juggle for the whole shot.
  PARTS.juggle = function (k, o) {
    const g = new T.Group(), A = o.actor, props = o.props || [], t0 = o.t0 || 0, t1 = o.t1 == null ? t0 + 3000 : o.t1, P = o.period || 900;
    if (A.act) A.act(t0, "juggle", { dur: t1 - t0 + 300 });
    if (A.pose && o.hold !== false) A.pose(t1 + 300, "watch");
    const loc = new T.Vector3();
    g.eval = (t) => {
      props.forEach((pr, i) => {
        const h = home(pr);
        const catchL = new T.Vector3(0, 0.62 + i * 0.07, 0.46);
        const ph = (2 * Math.PI * (t - t0)) / P + (i * 2 * Math.PI) / props.length;
        const orbit = new T.Vector3(0.38 * Math.cos(ph), 1.55 + 0.28 * Math.sin(ph), 0.3 + 0.05 * Math.sin(ph * 2));
        if (t < t0 - 400) { pr.position.copy(h.p); pr.rotation.copy(h.r); return; }
        let u;
        if (t < t0) { u = tw(t, t0 - 400, t0, "io"); loc.copy(catchL); const wp = A.spr.localToWorld(loc.clone()); const hp = worldOf(pr.parent, h.p); setWorld(pr, hp.lerp(wp, u)); pr.rotation.set(0, yawOf(A), 0); return; }
        if (t < t1) {
          const a = tw(t, t0, t0 + 350 + i * 120, "out"), b = tw(t, t1 - 350 + i * 80, t1 + i * 80, "io");
          loc.copy(catchL).lerp(orbit, a * (1 - b));
          setWorld(pr, A.spr.localToWorld(loc.clone()));
          const sp = (1 - b) * a; pr.rotation.set(sp * ph * 1.3 + i, yawOf(A), sp * ph * 0.9);
          return;
        }
        setWorld(pr, A.spr.localToWorld(catchL.clone())); pr.rotation.set(0, yawOf(A), 0);
      });
    };
    k.track(g);
    return g;
  };

  // ---- tug: KIT.set.PARTS.tug(k, {a, b, prop, t0, t1, amp, before, after}). Each frame the prop sits between the two actors'
  // grips and moves back and forth (period 900 ms, in phase with the acts "tug-a"/"tug-b" it declares on agents; persons get pose
  // "carry"). before/after: "home" (where it was put) | "a" | "b" | "mid". Works for agents, persons, or fixed points.
  PARTS.tug = function (k, o) {
    const g = new T.Group(), a = o.a, b = o.b, pr = o.prop, t0 = o.t0 || 0, t1 = o.t1 == null ? t0 + 3000 : o.t1, amp = o.amp == null ? 0.1 : o.amp;
    const declare = (x, name) => { if (x && x.act && x.spr) x.act(t0, name, { dur: t1 - t0 }); else if (x && x.pose && x.root) { x.pose(t0, "carry"); x.pose(t1, "stand"); } };
    declare(a, "tug-a"); declare(b, "tug-b");
    const place = (where) => { const ga = grip(a), gb = grip(b); return where === "a" ? ga : where === "b" ? gb : ga.lerp(gb, 0.5); };
    g.eval = (t) => {
      const h = home(pr);
      const where = t < t0 ? o.before || "home" : t >= t1 ? o.after || "mid" : null;
      if (where === "home") { pr.position.copy(h.p); pr.rotation.copy(h.r); return; }
      const ga = grip(a), gb = grip(b), yaw = Math.atan2(gb.x - ga.x, gb.z - ga.z) + Math.PI / 2;
      let p;
      if (where) p = place(where);
      else {
        const e = tw(t, t0, t0 + 300, "out") * (1 - tw(t, t1 - 250, t1, "io"));
        const s = Math.sin((2 * Math.PI * t) / TUG_P), dir = ga.clone().sub(gb).setY(0).normalize();
        p = ga.clone().lerp(gb, 0.5).addScaledVector(dir, amp * s * e);
        p.y += 0.02 * Math.sin((4 * Math.PI * t) / TUG_P) * e;
      }
      setWorld(pr, p); pr.rotation.set(0, yaw, where ? 0 : 0.05 * Math.sin((2 * Math.PI * t) / TUG_P));
    };
    k.track(g);
    return g;
  };

  // ---- press: KIT.set.PARTS.press(k, {actor, glassY, at:[x,z], t0, t1, rise, face, stool, hands}). The agent walks up (A.walk with a y)
  // until its head meets the glass at glassY, presses (act "press": arms up, squashed, head back) and drops back at t1.
  // stool: true builds a low white block under it (present all shot) when the rise is more than a hop. Returns the group.
  PARTS.press = function (k, o) {
    const g = new T.Group(), A = o.actor, t0 = o.t0 || 0, t1 = o.t1 == null ? t0 + 2500 : o.t1, rise = o.rise || 450;
    let headTop = 1.05; if (A.spr) { A.spr.updateMatrixWorld(true); const bb = new T.Box3().setFromObject(A.spr); if (!bb.isEmpty()) headTop = bb.max.y - A.spr.position.y; }
    const p0 = A.spr ? A.spr.position.clone() : new T.Vector3();
    const x = o.at ? o.at[0] : p0.x, z = o.at ? o.at[1] : p0.z, y0 = o.y0 != null ? o.y0 : p0.y;
    // v0.8.15 hands: true, the mittens flat on the glass beside the head: act press { reach: glassY, squash: 0.80 } and the agent
    // rises to where its crown meets the glass at that squash (contact: it squashes on the way up, never through the glass)
    const y = o.hands ? Math.max(y0, o.glassY - headTop * 0.80) : Math.max(y0, o.glassY - headTop);   // the drop pose stretches 6%, the press squashes 7%: the head just meets the glass
    if (o.stool == null) o.stool = y - y0 > 0.3;
    if (o.stool && y - y0 > 0.05) { const hS = y - y0; const st = rbox(0.75, hS, 0.6, mat("white"), 0.08, 0.04); st.position.set(x, y0 + hS / 2, z); g.add(st); }
    const face = o.face != null ? o.face : 0;
    if (o.at) A.walk(t0 - 900, 850, [[x, z]], { face });
    A.walk(t0, rise, [[x, y, z]], { face, ease: "out" });
    A.act(t0 + rise * 0.6, "press", Object.assign({ dur: t1 - t0 - rise * 0.6 + 200 }, o.hands ? { reach: o.glassY, squash: 0.80 } : {}));
    A.walk(t1, 380, [[x, o.stool ? y : y0, z]], { face, ease: "in" });
    g.glassPoint = () => new T.Vector3(x, o.glassY, z);
    return g;
  };

  KIT.partsB = { mover: (k, obj) => mover(k, obj), grip, coinMesh, ACTS_ADDED: ["juggle", "press", "tug-a", "tug-b"] };
})();
