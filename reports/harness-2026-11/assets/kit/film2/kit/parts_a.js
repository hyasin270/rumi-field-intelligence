// parts_a.js (film2 kit, v2-kit lane, builder A): shared props for stage 1 and the lanes that reuse them.
// layers, skillFolder, folder2, stack, door2, rail, note, hatch, tag, gate, envelope. See PARTS_A.md.
// Contract (API.md 1): every method only records times; eval(t) computes the whole visual state from t alone.
// Scale: the agent sprite is 1.0 m tall (VL 1.5). Every edge rounded (rbox). Colours from PAL, one job each (VL 2).
(function () {
  "use strict";
  const { T, PAL, mat, rbox, add } = KIT.parts;
  const PARTS = KIT.set.PARTS;
  const tw = FILM.tw, clamp01 = FILM.clamp01, lerp = FILM.lerp, noise = FILM.noise;
  const REFUSAL = new T.Color(0xc8372d);           // VL 2 "refusal": a hook or gate saying no (not in render.js PAL yet)
  const GLOW = new T.Color(0xffb35c);              // warm lamp light as emission (the rooms' glow), never a surface hue
  const WARM = new T.Color(0xffe6c2);              // what a white surface turns under that light
  const PAGE = new T.Color(PAL.page), GREEN = new T.Color(PAL.green), BLACK = new T.Color(0x000000);
  const bump = (t, t0, dur) => Math.sin(Math.PI * clamp01((t - t0) / dur));
  // the house install move (set.js): 600 ms out, 4% overshoot
  const installU = (t, t0) => tw(t, t0, t0 + 600, "out") + 0.04 * bump(t, t0 + 420, 260);
  // a material of its own (for parts that change colour or glow)
  const own = (name, extra) => new T.MeshStandardMaterial(Object.assign({ color: PAL[name] !== undefined ? PAL[name] : name, roughness: 0.82, metalness: 0 }, extra || {}));
  const V3 = (a) => (a == null ? null : Array.isArray(a) ? new T.Vector3(a[0], a[1], a[2]) : a.clone());

  // ---------------------------------------------------------------- a readable plate (canvas texture, local font, wraps)
  const measureCtx = document.createElement("canvas").getContext("2d");
  function wrapLines(text, font, maxPx) {
    measureCtx.font = font; const words = String(text).split(/\s+/), lines = []; let cur = "";
    for (const w of words) { const nx = cur ? cur + " " + w : w; if (cur && measureCtx.measureText(nx).width > maxPx) { lines.push(cur); cur = w; } else cur = nx; }
    if (cur) lines.push(cur); return lines;
  }
  // em: type size in metres (0.17 m reads at about 39 px when a 1.0 m sprite is 230 px tall: the room size)
  function plate(text, o) {
    o = o || {}; const em = o.em || 0.17, PX = 600, padX = o.padX != null ? o.padX : em * 0.55, padY = o.padY != null ? o.padY : em * 0.45, maxW = o.maxW || 1.45;
    const fpx = Math.round(em * PX), font = `${o.weight || 600} ${fpx}px 'Poppins'`;
    let lines = wrapLines(text, font, (maxW - 2 * padX) * PX);
    measureCtx.font = font; const widest = Math.max(...lines.map((s) => measureCtx.measureText(s).width)) / PX;
    const w = Math.max(o.minW || 0, widest + 2 * padX), lh = em * 1.14, h = Math.max(o.minH || 0, lines.length * lh + 2 * padY);
    const g = new T.Group(), th = o.th || 0.05;
    const pad = add(g, rbox(w, h, th, o.mat || mat("card"), Math.min(w, h) * 0.2, Math.min(0.015, th * 0.3)), 0, 0, 0);
    const c = document.createElement("canvas"), fw = w - 0.03, fh = h - 0.03; c.width = Math.round(fw * PX); c.height = Math.round(fh * PX);
    const x = c.getContext("2d"); x.fillStyle = o.bg || "#fdfcf9"; x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = o.ink || "#111418"; x.font = font; x.textAlign = "center"; x.textBaseline = "middle";
    const y0 = c.height / 2 - ((lines.length - 1) * lh * PX) / 2;
    lines.forEach((s, i) => x.fillText(s, c.width / 2, y0 + i * lh * PX + fpx * 0.05));
    const tx = new T.CanvasTexture(c); tx.colorSpace = T.SRGBColorSpace; tx.anisotropy = 8;
    const face = add(g, new T.Mesh(new T.PlaneGeometry(fw, fh), new T.MeshStandardMaterial({ map: tx, roughness: 0.7 })), 0, 0, th / 2 + 0.002);
    g.userData = { w, h, lines, face, pad }; return g;
  }
  KIT.partsA = { plate, REFUSAL, GLOW };

  // ================================================================ 1. layers: progressive disclosure (the layered shape)
  // levels: [{count, label?, mode?: "slab"|"row"|"sheets", w?, h?}] from the top. Origin centre-bottom; front face +z.
  PARTS.layers = function (k, o) {
    const levels = o.levels || [{ count: 1 }, { count: 7 }, { count: 24 }];
    const n = levels.length, W = o.w || 1.9, D = o.d || 0.62, topW = o.topW || Math.min(0.62, W * 0.34), gapY = 0.035;
    const g = new T.Group(), body = add(g, new T.Group());
    const spec = levels.map((L, li) => {
      const mode = L.mode || (L.count === 1 ? "slab" : L.count > 12 ? "sheets" : "row");
      const w = L.w || (n === 1 ? W : lerp(topW, W, li / (n - 1)));
      const h = L.h || (mode === "slab" ? 0.06 : mode === "row" ? 0.26 : Math.min(0.017 * L.count, 0.42));
      return { mode, w, h, count: L.count, label: L.label, blocks: [] };
    });
    let yy = 0; for (let li = n - 1; li >= 0; li--) { spec[li].y0 = yy; yy += spec[li].h + (li ? gapY : 0); }
    g.size = [W, yy]; g.levels = spec;
    const blocks = [];
    spec.forEach((s, li) => {
      for (let i = 0; i < s.count; i++) {
        let bw, bh, bd = D, x = 0, y, z = 0, name = "card";
        if (s.mode === "row") { const gp = 0.04; bw = (s.w - gp * (s.count - 1)) / s.count; bh = s.h; x = -s.w / 2 + bw / 2 + i * (bw + gp); y = s.y0 + bh / 2; bd = D * 0.62; z = D / 2 - bd / 2 - 0.02; }
        else if (s.mode === "sheets") { const sh = s.h / s.count; bw = s.w - 0.04 * noise(i, 3); bh = Math.max(0.008, sh * 0.8); x = (noise(i, 5) - 0.5) * 0.03; z = (noise(i, 6) - 0.5) * 0.025; y = s.y0 + s.h - sh * (i + 0.5); name = i % 3 === 1 ? "paper" : "white"; }
        else { bw = s.w; bh = s.h; y = s.y0 + bh / 2; bd = D * 0.82; }
        if (o.tone && li > 0) name = o.tone;   // v2-kit: a mid tone so the shape reads on a lit white room (VL 2.4); the top stays white
        const m = own(name), piv = add(body, new T.Group(), x, y, z);
        const mesh = add(piv, rbox(bw, bh, bd, m), 0, 0, 0);
        const b = { li, i, piv, mesh, m, c0: m.color.clone(), home: new T.Vector3(x, y, z), w: bw, h: bh, d: bd, key: li + ":" + i, st: null, ord: 0, lift: null, lid: null };
        s.blocks.push(b); blocks.push(b);
      }
    });
    const blk = (l, i) => (spec[l] && spec[l].blocks[i]) || null;
    let settle = null; const lights = [], ripples = [], dims = [], moves = [];
    let traceAt = null, tube = null, tubeN = 0, p0 = null, yaw0 = 0;

    // blocks fly from the tower and settle into the shape, bottom up; stagger 60 to 170 ms (VL 6.4); total = stagger x (units - 1) + fly
    g.settleFrom = (t0, dur, tower) => {
      dur = dur || 1200; const units = [];
      for (let li = n - 1; li >= 0; li--) {
        const s = spec[li];
        if (s.mode === "sheets") { const per = Math.ceil(s.count / 6); for (let i = s.count - 1; i >= 0; i -= per) { const u = []; for (let j = i; j > i - per && j >= 0; j--) u.push(s.blocks[j]); units.push(u); } }
        else s.blocks.forEach((b) => units.push([b]));
      }
      const N = units.length, stagger = Math.max(60, Math.min(170, (dur - 450) / Math.max(1, N - 1))), fly = Math.max(450, dur - stagger * (N - 1));
      units.forEach((u, ui) => u.forEach((b, j) => { b.st = t0 + ui * stagger + j * 12; b.ord = ui; }));
      settle = { t0, tower, N, fly, stagger, span: stagger * (N - 1) + fly };
      if (tower && tower.releaseTower) tower.releaseTower(t0, stagger * (N - 1) + 200);
      return g;
    };
    // a soft warm light runs down one path, level by level (~1000 ms), and stops (stays on) at the last block of the path
    // path: [i0, i1, ...] one index per level from the top, or [[level, index], ...]; or null, then built from stopAt
    g.light = (t0, path, op) => {
      op = op || {}; let steps = [];
      if (Array.isArray(path) && path.length) steps = Array.isArray(path[0]) ? path.map((p) => [p[0], p[1]]) : path.map((ix, l) => [l, ix]);
      const stop = op.stopAt;
      if (!steps.length && stop) { for (let l = 0; l <= stop.level; l++) steps.push([l, l === stop.level ? stop.index : Math.round((spec[l].count - 1) * (spec[stop.level].count > 1 ? stop.index / (spec[stop.level].count - 1) : 0.5))]); }
      if (stop) { const at = steps.findIndex((s) => s[0] === stop.level && s[1] === stop.index); if (at >= 0) steps = steps.slice(0, at + 1); }
      lights.push({ t0, steps, dur: op.dur || (steps.length > 1 ? 1000 : 400) }); lights.sort((a, b) => a.t0 - b.t0); return g;
    };
    g.unlight = (t0) => { lights.push({ t0, steps: [], dur: 300 }); lights.sort((a, b) => a.t0 - b.t0); return g; };
    // the blocks of one level light faintly in turn and dim (e.g. "seven steps"), gap 170 ms
    g.ripple = (t0, level, op) => { ripples.push({ t0, level, gap: (op && op.gap) || 170 }); return g; };
    // everything except one block (or a list) goes pale (to 40%); undim(t0) brings it back
    g.dim = (t0, except, op) => { const ex = new Set((except == null ? [] : Array.isArray(except) ? except : [except]).map((e) => e.level + ":" + e.index)); dims.push({ t0, ex, on: true, to: (op && op.to) || 0.7 }); dims.sort((a, b) => a.t0 - b.t0); return g; };
    g.undim = (t0) => { dims.push({ t0, ex: new Set(), on: false, to: 0 }); dims.sort((a, b) => a.t0 - b.t0); return g; };
    // one block lifts out (600 ms, out, 4% overshoot) and tilts open (a lid on a hinge at its back edge)
    g.lift = (t0, level, index) => {
      const b = blk(level, index); if (!b) return g; b.lift = t0;
      if (!b.lid) { const hp = add(b.piv, new T.Group(), 0, b.h / 2, -b.d / 2); add(hp, rbox(b.w, 0.03, b.d, b.m, 0.012, 0.008), 0, 0.015, b.d / 2); b.lid = hp; }
      return g;
    };
    // world point at the top front of a block, at its home (for pinned labels)
    g.levelPoint = (level, index) => { const b = blk(level, index || 0); g.updateWorldMatrix(true, true); return body.localToWorld(new T.Vector3(b.home.x, b.home.y + b.h / 2, b.home.z + b.d / 2)); };
    g.pin = (t0, level, index, text, op) => k.ui.pin(t0, Object.assign({ text, at: g.levelPoint(level, index) }, op || {}));
    // move the whole shape (to: local [x,y,z] in its parent), with an optional yaw (rad)
    g.move = (t0, dur, to, op) => { if (!p0) { p0 = g.position.clone(); yaw0 = g.rotation.y; } moves.push({ t0, dur, to: to ? V3(to) : null, yaw: op && op.yaw != null ? op.yaw : null, ease: (op && op.ease) || "io" }); moves.sort((a, b) => a.t0 - b.t0); return g; };
    g.turn = (t0, dur, yaw) => g.move(t0, dur, null, { yaw });
    // one thin green tube traced once round the outline (stepped profile, rounded corners), drawn on over 900 ms
    g.trace = (t0, op) => {
      traceAt = t0; const m = (op && op.margin) || 0.06, z = D / 2 + 0.05, r = 0.035;
      const xr = (l) => spec[l].w / 2 + m, top = (l) => spec[l].y0 + spec[l].h;
      // bottom edge, up the right side step by step, over the top, down the left side step by step
      const L = [[-xr(n - 1), 0.012], [xr(n - 1), 0.012]];
      for (let l = n - 1; l >= 0; l--) { L.push([xr(l), top(l) + m]); if (l > 0) L.push([xr(l - 1), top(l) + m]); }
      for (let l = 0; l < n; l++) { if (l > 0) L.push([-xr(l - 1), top(l) + m]); L.push([-xr(l), top(l) + m]); }
      const P = L.map((p) => new T.Vector3(p[0], p[1], z)), path = new T.CurvePath();
      const start = P[0].clone().lerp(P[1], 0.5); let last = start;
      for (let i = 1; i <= P.length; i++) {
        const c = P[i % P.length], pv = P[i - 1], nx = P[(i + 1) % P.length];
        const a = c.clone().add(pv.clone().sub(c).setLength(Math.min(r, pv.distanceTo(c) / 2))), bq = c.clone().add(nx.clone().sub(c).setLength(Math.min(r, nx.distanceTo(c) / 2)));
        path.add(new T.LineCurve3(last, a)); path.add(new T.QuadraticBezierCurve3(a, c, bq)); last = bq;
      }
      path.add(new T.LineCurve3(last, start));
      tubeN = 700; const geo = new T.TubeGeometry(path, tubeN, (op && op.radius) || 0.013, 8, false);
      tube = add(body, new T.Mesh(geo, mat("green", { roughness: 0.6 })), 0, 0, 0); tube.castShadow = true; tube.visible = false;
      return g;
    };
    // the glow a block carries at t (0..1)
    function lightVal(b, t) {
      let v = 0;
      for (const e of lights) {
        if (e.t0 > t) break;
        const fadeOld = 1 - tw(t, e.t0, e.t0 + 300, "io"); let cur = 0;
        const P = e.steps.length, s = e.steps.findIndex((q) => q[0] === b.li && q[1] === b.i);
        if (s >= 0) { const ts = e.t0 + (P > 1 ? (e.dur * s) / (P - 1) : 0); const rise = tw(t, ts - 120, ts + 220, "io"); cur = s < P - 1 ? rise * lerp(1, 0.22, tw(t, ts + 260, ts + 660, "io")) : rise; }
        v = Math.max(cur, v * fadeOld);
      }
      for (const r of ripples) if (r.level === b.li) v = Math.max(v, 0.45 * bump(t, r.t0 + b.i * r.gap, 520));
      return v;
    }
    function dimVal(b, t) { let v = 0; for (const e of dims) { if (e.t0 > t) break; const target = e.on && !e.ex.has(b.key) ? e.to : 0; v = lerp(v, target, tw(t, e.t0, e.t0 + 500, "io")); } return v; }
    function srcOf(b, t) {
      const tower = settle.tower, f = 1 - b.ord / settle.N; let w;
      if (tower && tower.towerPoint) w = tower.towerPoint(b.st, f);
      else if (tower) { tower.updateWorldMatrix(true, false); w = tower.localToWorld(new T.Vector3(0, ((tower.userData && tower.userData.towerH) || 1) * f, 0)); }
      else w = body.localToWorld(new T.Vector3(b.home.x, b.home.y + 1.5, b.home.z));
      return body.worldToLocal(w);
    }
    g.eval = (t) => {
      if (p0) {
        let p = p0.clone(), yaw = yaw0;
        for (const mv of moves) { if (mv.t0 > t) break; const u = tw(t, mv.t0, mv.t0 + mv.dur, mv.ease); if (mv.to) p.lerp(mv.to, u); if (mv.yaw != null) yaw = lerp(yaw, mv.yaw, u); }
        g.position.copy(p); g.rotation.y = yaw;
      }
      g.updateWorldMatrix(true, true);
      for (const b of blocks) {
        const p = b.home.clone(); let rx = 0, rz = 0, sx = 1, sy = 1, vis = true;
        if (settle && b.st != null) {
          if (t < b.st) vis = false;
          else {
            const u = tw(t, b.st, b.st + settle.fly, "out");
            if (u < 1) { const src = srcOf(b, t); p.lerpVectors(src, b.home, u); p.y += Math.sin(Math.PI * u) * 0.25; rz = (1 - u) * (noise(b.ord, 11) - 0.5) * 1.2; rx = (1 - u) * (noise(b.ord, 12) - 0.5) * 0.7; }
            const q = bump(t, b.st + settle.fly * 0.72, 260); sy = 1 - 0.14 * q; sx = 1 + 0.07 * q;
          }
        }
        if (b.lift != null && t >= b.lift) {
          const u = installU(t, b.lift); p.y += 0.3 * u; p.z += 0.28 * u; rx += 0.38 * u;
          b.lid.rotation.x = -0.95 * tw(t, b.lift + 250, b.lift + 850, "out");
        } else if (b.lid) b.lid.rotation.x = 0;
        b.piv.visible = vis; b.piv.position.copy(p); b.piv.rotation.set(rx, 0, rz); b.piv.scale.set(sx, sy, sx);
        const lv = lightVal(b, t), dv = dimVal(b, t) * (1 - lv);
        b.m.color.copy(b.c0).lerp(WARM, 0.7 * lv).lerp(PAGE, dv);
        b.m.emissive.copy(GLOW).multiplyScalar(0.4 * lv);
        const op = 1 - dv * 0.75; b.m.transparent = op < 0.999; b.m.opacity = op; b.mesh.castShadow = op > 0.6;
      }
      if (tube) {
        const u = traceAt == null ? 0 : tw(t, traceAt, traceAt + 900, "io");
        tube.visible = u > 0; tube.geometry.setDrawRange(0, Math.floor(u * tubeN) * 8 * 6);
      }
    };
    k.track(g); return g;
  };

  // ================================================================ 2. skillFolder: one slim white folder (blank spine)
  // Lies flat; origin centre-bottom; spine on the left (-x). Never moves its own position (A.carry owns obj.position).
  PARTS.skillFolder = function (k, o) {
    // VL 15.41: the skill book, one object: green cover and spine (0xE8A200), paper page block, 0.34 m
    const W = o.w || 0.34, D = o.d || 0.25, CT = 0.012, th0 = o.th || 0.022, NT = o.towerPages || 56, COVER = mat("green", { roughness: 0.6 });
    const g = new T.Group(), body = add(g, new T.Group());
    add(body, rbox(W, CT, D, COVER, 0.03, 0.005), 0, CT / 2, 0);
    const pages = add(body, rbox(W - 0.03, 0.02, D - 0.025, mat("paper"), 0.01, 0.004), 0.008, 0, 0);
    const spine = add(body, rbox(CT * 1.6, 0.04, D, COVER, 0.006, 0.004), -W / 2, 0, 0);
    const hinge = add(body, new T.Group(), -W / 2, 0, 0);
    add(hinge, rbox(W, CT, D, COVER, 0.03, 0.005), W / 2, CT / 2, 0);
    const opens = [], thick = [], adds = [], towers = [], releases = [];
    const towerMeshes = []; let tg = null;
    g.open = (t0, amount) => { opens.push({ t0, to: amount == null ? 1 : amount }); opens.sort((a, b) => a.t0 - b.t0); return g; };
    g.close = (t0) => g.open(t0, 0);
    g.thicken = (t0, by) => { thick.push({ t0, by: by == null ? 0.01 : by }); return g; };
    g.addPage = (t0, op) => {
      const m = add(body, rbox(W - 0.04, 0.006, D - 0.035, mat("card"), 0.01, 0.002), 0, 0, 0); m.visible = false;
      adds.push({ t0, m, from: op && op.from ? V3(op.from) : null, i: adds.length }); return g;
    };
    g.tower = (t0, dur, height, op) => {
      if (!tg) { tg = add(body, new T.Group()); for (let j = 0; j < NT; j++) { const m = add(tg, rbox(W * 0.9, 0.012, D * 0.9, mat(j % 4 === 1 ? "paper" : "card"), 0.01, 0.003), 0, 0, 0); m.visible = false; towerMeshes.push(m); } }
      towers.push({ t0, dur: dur || 2400, h: height || 3, ease: (op && op.ease) || "io" }); return g;
    };
    g.releaseTower = (t0, span) => { releases.push({ t0, span }); return g; };
    const thAt = (t) => { let th = th0; for (const e of thick) th += e.by * tw(t, e.t0, e.t0 + 400, "out"); for (const a of adds) th += 0.006 * tw(t, a.t0 + 420, a.t0 + 560, "out"); return th; };
    const towerH = (t) => { let h = 0; for (const e of towers) if (t >= e.t0) h = e.h * tw(t, e.t0, e.t0 + e.dur, e.ease); return h; };
    const released = (t) => { let r = 0; for (const e of releases) r = Math.max(r, tw(t, e.t0, e.t0 + e.span, "io")); return r; };
    const pageLocal = (t, j, H, th) => { const f = (j + 1) / NT, y = CT + th + H * f; const sway = Math.sin(t / 1400) * 0.05 * (y / 3);
      const fl = Math.sin(t / 380 + j * 1.7) * 0.012 * f; return new T.Vector3(sway + fl + (noise(j, 21) - 0.5) * 0.02, y, (noise(j, 22) - 0.5) * 0.02); };
    // a world point on the tower at fraction f of its height, as it stands at t (for layers.settleFrom)
    g.towerPoint = (t, f) => { const H = towerH(t); g.updateWorldMatrix(true, true); const j = Math.max(0, Math.min(NT - 1, Math.round(f * NT) - 1)); return body.localToWorld(pageLocal(t, j, H, thAt(t))); };
    g.topPoint = () => { g.updateWorldMatrix(true, true); return body.localToWorld(new T.Vector3(0, CT + thAt(1e9) + 0.02, 0)); };
    g.eval = (t) => {
      const th = thAt(t);
      pages.scale.y = th / 0.02; pages.position.y = CT + th / 2;
      spine.scale.y = (th + 2 * CT) / 0.04; spine.position.y = (th + 2 * CT) / 2;
      let a = 0; for (const e of opens) { if (e.t0 > t) break; a = lerp(a, e.to, tw(t, e.t0, e.t0 + 500, "out")); }
      hinge.position.y = CT + th; hinge.rotation.z = a * 2.85;
      for (const ad of adds) {
        const u = tw(t, ad.t0, ad.t0 + 440, "out"), on = t >= ad.t0 && t < ad.t0 + 470; ad.m.visible = on; if (!on) continue;
        const to = new T.Vector3(0.01, CT + th + 0.006, 0); let from = new T.Vector3(0, CT + th + 0.6, 0.12);
        if (ad.from) { body.updateWorldMatrix(true, false); from = body.worldToLocal(ad.from.clone()); }
        ad.m.position.lerpVectors(from, to, u); ad.m.position.y += Math.sin(Math.PI * u) * 0.12;
        ad.m.rotation.set((1 - u) * 0.5 * Math.sin(t / 90), 0, (1 - u) * 0.3);
      }
      if (tg) {
        const H = towerH(t), keep = 1 - released(t);
        towerMeshes.forEach((m, j) => {
          const p = pageLocal(t, j, H, th), f = (j + 1) / NT;
          m.visible = H > 0.001 && p.y > CT + th + 0.012 && f <= keep + 1e-6;
          m.position.copy(p); m.rotation.set(Math.sin(t / 510 + j) * 0.05 * f, Math.sin(j * 2.3) * 0.12, Math.sin(t / 430 + j * 0.7) * 0.06 * f);
        });
      }
    };
    g.userData.kind = "skillFolder"; k.track(g); return g;
  };

  // ================================================================ 3. folder2: one job folder two agents hold at once, which tears
  PARTS.folder2 = function (k, o) {
    const L = o.len || 0.6, D = o.d || 0.28, TH = 0.04;
    const g = new T.Group();
    const whole = add(g, rbox(L, TH, D, mat("paper"), 0.035, 0.012), 0, TH / 2, 0);
    const half = (sd) => { const h = add(g, new T.Group()); add(h, rbox(L / 2 - 0.01, TH, D, mat("paper"), 0.03, 0.012), sd * (L / 4 + 0.005), 0, 0);
      for (let i = 0; i < 4; i++) { const tooth = add(h, rbox(0.045, TH * 0.9, 0.045, mat("paper"), 0.01, 0.006), 0.004 * sd, 0, -D / 2 + 0.035 + i * (D - 0.07) / 3); tooth.rotation.y = Math.PI / 4; }
      h.visible = false; return h; };
    const hA = half(-1), hB = half(1);
    let held = null, tearAt = null; const tugs = [];
    const P = (v) => { g.parent.updateWorldMatrix(true, false); return g.parent.worldToLocal(v); };
    g.heldBy = (t0, a, b) => {
      held = { t0, a, b }; const home = g.position.clone();
      // registered now, after the agents, so their hands are already placed this frame
      k.track({ eval(t) {
        g.position.copy(home); g.rotation.set(0, 0, 0);
        const on = t >= held.t0; let pA = null, pB = null, dir = new T.Vector3(1, 0, 0);
        if (on) { pA = P(held.a.hand("R")); pB = P(held.b.hand("L")); dir = pB.clone().sub(pA); }
        const yaw = Math.atan2(-dir.z, dir.x), roll = Math.atan2(dir.y, Math.hypot(dir.x, dir.z)), dn = dir.clone().normalize();
        const tg = tugs.reduce((s, e) => s + Math.sin((t - e.t0) / 95) * 0.03 * (t >= e.t0 && t <= e.t0 + e.dur ? bump(t, e.t0, e.dur) : 0), 0);
        if (tearAt == null || t < tearAt) {
          whole.visible = true; hA.visible = hB.visible = false;
          if (on) { const u = tw(t, held.t0, held.t0 + 250, "out"), mid = pA.clone().add(pB).multiplyScalar(0.5).addScaledVector(dn, tg);
            const loc = mid.sub(home); whole.position.set(0, TH / 2, 0).lerp(loc, u); whole.rotation.set(0, yaw * u, roll * u); }
          else { whole.position.set(0, TH / 2, 0); whole.rotation.set(0, 0, 0); }
        } else {
          whole.visible = false; hA.visible = hB.visible = true;
          const kick = bump(t, tearAt, 300) * Math.exp(-(t - tearAt) / 400);
          // each half's outer end stays in its holder's hand
          [[hA, pA, 1], [hB, pB, -1]].forEach(([h, p, sd]) => { h.position.copy(p.clone().addScaledVector(dn, sd * L / 2).sub(home)); h.rotation.set(sd * 0.25 * kick, yaw, roll + sd * 0.35 * kick); });
        }
      } });
      return g;
    };
    g.tug = (t0, dur) => { tugs.push({ t0, dur: dur || 1400 }); return g; };
    g.tear = (t0) => { tearAt = t0; return g; };
    return g;
  };

  // ================================================================ 4. stack: binders on a desk (origin = the desk top)
  PARTS.stack = function (k, o) {
    const BW = o.w || 0.4, BD = o.d || 0.3, BH = o.h || 0.075, floorY = o.floorY != null ? o.floorY : -0.765, edge = o.edge || 0.45;
    const g = new T.Group(), binders = [], loose = []; let spillAt = null, sweepAt = null;
    const binder = (i) => { const b = add(g, new T.Group()); add(b, rbox(BW, BH, BD, mat(["white", "paper", "card"][i % 3]), 0.025, 0.012), 0, 0, 0);
      add(b, rbox(0.03, BH * 1.02, BD * 0.96, mat("grey"), 0.01, 0.006), -BW / 2 + 0.012, 0, 0); b.visible = false; return b; };
    g.drop = (t0, n, op) => {
      op = op || {}; const gap = op.gap || 170;
      for (let i = 0; i < n; i++) { const s = binders.length, m = binder(s);
        binders.push({ m, t0: t0 + i * gap, slot: s, from: V3(op.from || [-1.4, 2.0, 0.3]), home: new T.Vector3((noise(s, 31) - 0.5) * 0.05, s * BH + BH / 2, (noise(s, 32) - 0.5) * 0.04), yaw: (noise(s, 33) - 0.5) * 0.25, spill: null, sweep: null }); }
      return g;
    };
    // pages and the top two binders (declared so far) slide off the far edge (-z) and fall to the floor
    g.spill = (t0, op) => {
      spillAt = t0; const top = binders.slice(-2).reverse(); top.forEach((b, i) => (b.spill = { t0: t0 + 120 + i * 160, i }));
      const H = binders.length * BH, np = (op && op.pages) || 8;
      for (let i = 0; i < np; i++) { const m = add(g, rbox(BW * 0.85, 0.008, BD * 0.85, mat(i % 2 ? "card" : "paper"), 0.01, 0.003), 0, 0, 0); m.visible = false; loose.push({ m, t0: t0 + i * 70, i, y0: H + 0.006 * i }); }
      return g;
    };
    // every binder still on the desk slides off to one side, top first, 250 ms each, and is gone
    g.sweep = (t0, op) => { sweepAt = t0; const dirx = op && op.to === "right" ? 1 : -1; binders.filter((b) => !b.spill).reverse().forEach((b, i) => (b.sweep = { t0: t0 + i * 120, dirx })); return g; };
    g.height = () => binders.length * BH;
    g.eval = (t) => {
      for (const b of binders) {
        const m = b.m; if (t < b.t0) { m.visible = false; continue; }
        m.visible = true; const ux = tw(t, b.t0, b.t0 + 380, "out"), uy = tw(t, b.t0, b.t0 + 380, "in");
        const p = new T.Vector3(lerp(b.from.x, b.home.x, ux), lerp(b.from.y, b.home.y, uy), lerp(b.from.z, b.home.z, ux));
        const q = bump(t, b.t0 + 360, 220); let sx = 1 + 0.12 * q, sy = 1 - 0.25 * q, rx = 0, rz = (1 - ux) * 0.6, yaw = b.yaw;
        if (b.spill && t >= b.spill.t0) {
          const s = b.spill.t0, u1 = tw(t, s, s + 320, "in"), u2 = tw(t, s + 320, s + 820, "in");
          p.z = lerp(b.home.z, -edge - 0.1, u1) - 0.35 * u2; p.y = lerp(b.home.y, floorY + BH / 2, u2); rx = -1.3 * u2 * (1 - 0.4 * tw(t, s + 820, s + 1000, "out")); rz = 0.4 * u2 * (b.spill.i ? -1 : 1);
          const land = bump(t, s + 800, 200); sy *= 1 - 0.18 * land;
        }
        if (b.sweep && t >= b.sweep.t0) { const u = tw(t, b.sweep.t0, b.sweep.t0 + 250, "in"); p.x += b.sweep.dirx * 3.2 * u; m.visible = u < 1; }
        m.position.copy(p); m.rotation.set(rx, yaw, rz); m.scale.set(sx, sy, sx);
      }
      for (const l of loose) {
        const m = l.m, on = t >= l.t0; m.visible = on; if (!on) continue;
        const u1 = tw(t, l.t0, l.t0 + 300, "in"), u2 = tw(t, l.t0 + 300, l.t0 + 1200, "out"), sw = Math.sin((t - l.t0) / 140 + l.i) * 0.12 * (1 - tw(t, l.t0 + 1000, l.t0 + 1300));
        m.position.set((noise(l.i, 41) - 0.5) * 0.5 * u2 + sw, lerp(l.y0, floorY + 0.004 + 0.008 * l.i, u2), lerp(0, -edge - 0.05, u1) - (0.25 + 0.5 * noise(l.i, 42)) * u2);
        m.rotation.set((noise(l.i, 43) - 0.5) * 0.6 * Math.sin(Math.PI * u2), noise(l.i, 44) * 1.5 * u2, sw * 1.5);
      }
    };
    k.track(g); return g;
  };

  // ================================================================ 5. door2: a door in a frame, a readable sign above; open(t0), light(t0)
  PARTS.door2 = function (k, o) {
    const w = o.w || 0.95, h = o.h || 2.05, J = 0.13;
    const g = new T.Group(), fm = own("white");
    add(g, rbox(J, h + J, 0.2, fm, 0.05, 0.03), -w / 2 - J / 2, (h + J) / 2, 0);
    add(g, rbox(J, h + J, 0.2, fm, 0.05, 0.03), w / 2 + J / 2, (h + J) / 2, 0);
    add(g, rbox(w + 2 * J, J, 0.2, fm, 0.05, 0.03), 0, h + J / 2, 0);
    // v0.7 (v2-check 130752): a toned outer bead, 0.04 m, just behind the white frame, so the frame's outer edge steps
    // against the wall (white 240 / bead / wall 231). o.bead: false leaves it off; o.beadTone sets it (default 0xd6c9b3)
    if (o.bead !== false) { const B = 0.04, bd = own(o.beadTone || 0xd6c9b3);
      add(g, rbox(B, h + J + B, 0.16, bd, 0.015, 0.008), -w / 2 - J - B / 2, (h + J + B) / 2, -0.03);
      add(g, rbox(B, h + J + B, 0.16, bd, 0.015, 0.008), w / 2 + J + B / 2, (h + J + B) / 2, -0.03);
      add(g, rbox(w + 2 * J + 2 * B, B, 0.16, bd, 0.015, 0.008), 0, h + J + B / 2, -0.03); }
    const bm = own(0xf0cf98); add(g, rbox(w + 0.02, h, 0.04, bm, 0.02, 0.01), 0, h / 2, -0.1);   // VL 15.21: the warm light inside an opening, a step below its white frame
    const hinge = add(g, new T.Group(), -w / 2, 0, 0.02);
    const leafM = own(o.colour || 0xebe2d3), leaf = add(hinge, rbox(w - 0.02, h - 0.02, 0.07, leafM, 0.05, 0.025), w / 2, h / 2, 0);   // v2-kit: one step darker than its wall and frame
    const knob = add(hinge, new T.Mesh(new T.SphereGeometry(0.045, 16, 12), mat("band")), w * 0.84, h * 0.47, 0.06); knob.castShadow = true;   // VL 15.21
    let sign = null;
    if (o.label) { sign = plate(o.label, { em: o.em || 0.17, maxW: o.signW || Math.max(w + 2 * J + 0.2, 1.45) }); sign.position.set(0, h + J + 0.1 + sign.userData.h / 2, 0.06); g.add(sign); }
    const lamp = new T.PointLight(0xfff0dc, 0, 3.2, 1.6); lamp.position.set(0, h * 0.75, 0.7); g.add(lamp);
    const opens = [], lights = [];
    g.open = (t0, amount) => { opens.push({ t0, to: amount == null ? 1 : amount }); opens.sort((a, b) => a.t0 - b.t0); return g; };
    g.close = (t0) => g.open(t0, 0);
    g.light = (t0, on) => { lights.push({ t0, to: on === false ? 0 : 1 }); lights.sort((a, b) => a.t0 - b.t0); return g; };
    g.signPoint = () => { g.updateWorldMatrix(true, true); return sign ? sign.localToWorld(new T.Vector3(0, -sign.userData.h / 2, 0.04)) : g.localToWorld(new T.Vector3(0, h, 0.1)); };
    g.handle = () => { g.updateWorldMatrix(true, true); return knob.getWorldPosition(new T.Vector3()); };
    g.userData.leaf = leaf; g.userData.sign = sign; g.size = [w + 2 * J, h + J];
    g.eval = (t) => {
      let a = 0; for (const e of opens) { if (e.t0 > t) break; a = lerp(a, e.to, tw(t, e.t0, e.t0 + 900, "io")); }
      let l = 0; for (const e of lights) { if (e.t0 > t) break; l = lerp(l, e.to, tw(t, e.t0, e.t0 + 600, "io")); }
      hinge.rotation.y = 1.35 * a;
      // v2-kit (v2-check 123343, VL 15.53): a lit door keeps its edges. The frame never glows (white, its own tone); the leaf
      // stays the slab tone with a faint warmth, 8 or more below its frame; the light shows in the gap behind an open leaf
      fm.color.set(PAL.white); fm.emissive.setRGB(0, 0, 0);
      bm.emissive.copy(GLOW).multiplyScalar(0.1 * a);
      leafM.emissive.copy(GLOW).multiplyScalar(0.05 * l);
      lamp.intensity = 0.25 * l;
    };
    k.track(g); return g;
  };

  // ---------------------------------------------------------------- rail: the green rail that installs (lowers in, 600 ms, 4% overshoot)
  PARTS.rail = function (k, o) {
    const w = o.w || 4.6, g = new T.Group(), inner = add(g, new T.Group());
    const barM = own("green", { roughness: 0.6 }); add(inner, rbox(w, 0.16, 0.16, barM, 0.07, 0.04), 0, 0.95, 0);
    [-w / 2 + 0.1, w / 2 - 0.1].forEach((x) => add(inner, rbox(0.2, 1.1, 0.2, mat("white"), 0.08, 0.04), x, 0.55, 0));
    let at = null; const reds = [];
    g.install = (t0) => { at = t0; return g; };
    // v0.7 (ruling 81 item 5): each rail its own red. stop(t0) turns this rail's bar red (250 ms); v0.8.5 (ruling 113 E,
    // v2-lead 194852): no note by default, the red rail says it; stop(t0, {text}) lifts a note with that text. go(t0) turns
    // it green again and any note goes back. Set per rail; the others stay green.
    let note = null;
    g.stop = (t0, op) => { reds.push({ t: t0, on: true }); reds.sort((a, b) => a.t - b.t);
      if (op && op.text && op.note !== false) { if (!note) { note = PARTS.note(k, { text: op.text, redFor: 1e9 }); note.position.set(0, 0.95, 0.12); g.add(note); } note.lift(t0); }
      return g; };
    g.go = (t0) => { reds.push({ t: t0, on: false }); reds.sort((a, b) => a.t - b.t); if (note) note.back(t0); return g; };
    g.barPoint = () => { g.updateWorldMatrix(true, true); return g.localToWorld(new T.Vector3(0, 0.95, 0.1)); };
    g.eval = (t) => { if (at != null) { inner.visible = t >= at; inner.position.y = (1 - installU(t, at)) * 2.6; }
      let r = 0, last = null; for (const e of reds) { if (e.t > t) break; last = e; }
      if (last) r = last.on ? tw(t, last.t, last.t + 250, "out") : 1 - tw(t, last.t, last.t + 250, "in");
      barM.color.copy(GREEN).lerp(REFUSAL, r); };
    k.track(g); return g;
  };

  // ---------------------------------------------------------------- note: a small white note that lifts from a barrier (red edge <= 3 s)
  // Place it at the barrier's bar (origin inside the bar). lift(t0) rises 0.5 m and faces the camera; back(t0) returns into the bar.
  PARTS.note = function (k, o) {
    const g = new T.Group(), inner = add(g, new T.Group());
    const p = plate(o.text || "", { em: o.em || 0.09, minW: 0.36, minH: 0.22, maxW: 0.6, th: 0.02 }); inner.add(p);
    const em = own(REFUSAL.getHex(), { roughness: 0.6 }); const edge = add(inner, rbox(p.userData.w + 0.04, p.userData.h + 0.04, 0.014, em, 0.04, 0.005), 0, 0, -0.006);
    let at = null, backAt = null; const red = o.redFor || 2800;
    g.lift = (t0) => { at = t0; return g; };
    g.back = (t0) => { backAt = t0; return g; };
    g.eval = (t) => {
      if (at == null || t < at) { inner.visible = false; return; }
      const u = tw(t, at, at + 450, "outExpo"), ub = backAt != null ? tw(t, backAt, backAt + 250, "in") : 0;
      inner.visible = ub < 1; const r = u * (1 - ub);
      inner.position.set(0, 0.5 * r + 0.02, 0.06 * r); inner.scale.setScalar(0.35 + 0.65 * r); inner.rotation.x = -0.12 * r;
      em.color.copy(REFUSAL).lerp(new T.Color(PAL.white), tw(t, at + red - 250, at + red, "in"));
    };
    k.track(g); return g;
  };

  // ---------------------------------------------------------------- hatch: a small side hatch with a "Testing" sign; open(t0)
  PARTS.hatch = function (k, o) {
    const w = o.w || 0.62, h = o.h || 0.62, y0 = o.y || 0.08, J = 0.09, g = new T.Group();
    add(g, rbox(J, h + 2 * J, 0.16, mat("white"), 0.04, 0.02), -w / 2 - J / 2, y0 + h / 2, 0);
    add(g, rbox(J, h + 2 * J, 0.16, mat("white"), 0.04, 0.02), w / 2 + J / 2, y0 + h / 2, 0);
    add(g, rbox(w + 2 * J, J, 0.16, mat("white"), 0.04, 0.02), 0, y0 + h + J / 2, 0);
    add(g, rbox(w + 2 * J, J, 0.16, mat("white"), 0.04, 0.02), 0, y0 - J / 2 + 0.001, 0);
    const bm = own("wallWarm"); add(g, rbox(w, h, 0.03, bm, 0.02, 0.01), 0, y0 + h / 2, -0.07);
    const hinge = add(g, new T.Group(), 0, y0 + h, 0.02);
    add(hinge, rbox(w - 0.02, h - 0.02, 0.05, mat("white"), 0.05, 0.02), 0, -h / 2, 0);
    add(hinge, rbox(0.14, 0.035, 0.035, mat("ink"), 0.012, 0.01), 0, -h * 0.82, 0.04);
    const s = plate(o.label || "Testing", { em: o.em || 0.17, maxW: 1.4 }); s.position.set(0, y0 + h + J + 0.08 + s.userData.h / 2, 0.04); g.add(s);
    const opens = [];
    g.open = (t0, amount) => { opens.push({ t0, to: amount == null ? 1 : amount }); return g; };
    g.close = (t0) => g.open(t0, 0);
    g.eval = (t) => { let a = 0; for (const e of opens) { if (e.t0 > t) break; a = lerp(a, e.to, tw(t, e.t0, e.t0 + 600, "io")); } hinge.rotation.x = 1.25 * a; bm.emissive.copy(GLOW).multiplyScalar(0.45 * a); };
    k.track(g); return g;
  };

  // ---------------------------------------------------------------- tag: a tiny dated tag pinned onto a barrier; pin(t0) arrives from above-front
  PARTS.tag = function (k, o) {
    const g = new T.Group(), inner = add(g, new T.Group());
    const p = plate(o.text || "Mar", { em: o.em || 0.1, minW: 0.28, th: 0.025 }); p.position.y = -p.userData.h / 2 - 0.02; inner.add(p);
    const pin = add(inner, new T.Mesh(new T.SphereGeometry(0.025, 14, 10), mat("ink")), 0, -0.035, 0.02); pin.castShadow = true;
    let at = null;
    g.pin = (t0) => { at = t0; return g; };
    g.eval = (t) => {
      if (at == null) return; inner.visible = t >= at; if (t < at) return;
      const u = tw(t, at, at + 420, "outExpo"), q = bump(t, at + 380, 180);
      inner.position.set(0, 0.35 * (1 - u), 0.3 * (1 - u) - 0.02 * q); inner.rotation.z = (1 - u) * 0.4; inner.scale.setScalar(1 + 0.06 * q);
    };
    k.track(g); return g;
  };

  // ================================================================ 6. gate: a small gate beside the board; bounce(t0), lift(t0)
  PARTS.gate = function (k, o) {
    const L = o.len || 1.0, Y = o.armY || 0.62, g = new T.Group();
    add(g, rbox(0.16, Y + 0.18, 0.16, mat("white"), 0.06, 0.03), 0, (Y + 0.18) / 2, 0);
    add(g, rbox(0.1, Y - 0.05, 0.1, mat("white"), 0.04, 0.02), L, (Y - 0.05) / 2, 0);
    const am = own("white", { roughness: 0.6 }), piv = add(g, new T.Group(), 0, Y, 0.11);
    add(piv, rbox(L + 0.08, 0.1, 0.08, am, 0.04, 0.02), (L + 0.08) / 2 - 0.04, 0, 0);
    const cap = add(piv, new T.Mesh(new T.CylinderGeometry(0.07, 0.07, 0.06, 24), mat("ink")), 0, 0, 0.05); cap.rotation.x = Math.PI / 2; cap.castShadow = true;
    const bounces = [], lifts = [];
    g.bounce = (t0) => { bounces.push(t0); return g; };
    g.lift = (t0) => { lifts.push({ t0, to: 1 }); lifts.sort((a, b) => a.t0 - b.t0); return g; };
    g.lower = (t0) => { lifts.push({ t0, to: 0 }); lifts.sort((a, b) => a.t0 - b.t0); return g; };
    g.eval = (t) => {
      let a = 0, green = 0; for (const e of lifts) { if (e.t0 > t) break; a = lerp(a, e.to, tw(t, e.t0, e.t0 + 500, "back")); green = lerp(green, e.to, tw(t, e.t0, e.t0 + 300, "io")); }
      let red = 0, wob = 0; for (const b of bounces) { if (t < b) continue; red = Math.max(red, bump(t, b, 360)); wob += 0.07 * Math.sin((t - b) / 32) * Math.exp(-(t - b) / 160) * (t < b + 700 ? 1 : 0); }
      piv.rotation.z = 1.35 * a + wob;
      am.color.set(PAL.white).lerp(GREEN, green).lerp(REFUSAL, red); am.emissive.copy(REFUSAL).multiplyScalar(0.25 * red);
    };
    k.track(g); return g;
  };

  // ================================================================ 7. envelope: size "big" | "small"; lies flat; origin centre-bottom
  PARTS.envelope = function (k, o) {
    const big = o.size === "big", w = big ? 0.46 : 0.26, d = big ? 0.3 : 0.17, th = big ? 0.035 : 0.022, g = new T.Group();
    add(g, rbox(w, th, d, mat("card"), th * 0.4, th * 0.3), 0, th / 2, 0);
    const s = new T.Shape(); s.moveTo(-w / 2 + 0.01, d / 2 - 0.01); s.lineTo(w / 2 - 0.01, d / 2 - 0.01); s.lineTo(0, -d * 0.08); s.closePath();
    const fg = new T.ExtrudeGeometry(s, { depth: 0.004, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.006, bevelSegments: 2 });
    const flap = add(g, new T.Mesh(fg, mat("paper")), 0, th + 0.002, 0); flap.rotation.x = -Math.PI / 2; flap.castShadow = flap.receiveShadow = true;
    g.size = [w, d]; return g;
  };
})();
