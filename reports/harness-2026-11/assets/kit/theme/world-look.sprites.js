/* world-look-sprite-v3.js: rig v3, the plump newcomer with the band (assets-sprites, R4b session 4; C11, OPERATOR DECISION).
   Owner: assets-sprites (build/sprites/). The engine copies this file over build/theme/world-look.sprites.js (same sort
   position, after world-look.js and before world.js). It is the v2 kit (build/sprites/world-look.sprites.js, as merged by
   the engine with its albedo and Look.spriteKey hook) with the same surface: every export, every pose and clip name and
   every parameter is unchanged, so no scene file changes for the swap.

   What changes (C11.1, measured from operator/references/OPERATOR_PREFERRED_sprites_look_2026-11-10.png; the numbers are
   in outputs/lanes/assets-sprites/measures/MEASURES.md, session 4):
   1. The body is an egg 1.43 to 1 (H 1.00 m, W 0.70 m), widest 0.38 of the height from the base, matte clay coral.
   2. A matte grey strap round the head at the window's centre (one tone, no shine), sunk in a shallow groove of the body's
      own surface so it never stands proud; its grey runs round the window as the frame (the v2 "lip" node, now grey).
   3. The window: a larger white stadium, 2.0 to 1 face on and 0.80 of the body's width, set into the body; the Rumi mark
      FILE is its decal at 0.54 of the window's width (never a drawn face).
   4. Two short rounded mittens; no legs; a soft wide contact shadow.
   5. New option book: true (the sprite carries a closed book in its left mitten in any pose without a prop; "read" opens
      it in both mittens as before). v2 mitten targets ({tgt}) are scaled into v3's body (V2S) so the poses keep their
      meaning.
   The face stays rigid (translation and uniform scale only); Dot's pencil is the one difference between newcomers. */
(function () {
  "use strict";
  if (typeof THREE === "undefined" || !window.Look) return;
  var T = THREE, L0 = window.Look, TOK = L0.TOK, roundedBox = L0.roundedBox, blob = L0.blob;

  /* ---------------------------------------------------------------- colours from tokens.css (fallbacks are the v3 values) */
  function tok(name, fb) {
    try {
      var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      if (/^#[0-9a-f]{6}$/i.test(v)) return parseInt(v.slice(1), 16);
    } catch (e) { /* no document: use the fallback */ }
    return fb;
  }
  var C = {
    coral: tok("--sprite", 0xF06E42),
    // the body's albedo, pre-compensated through the stage light and the tone curve (as the paper is) so the rendered
    // body's dominant tone lands on --sprite: #F06E42 itself rendered #F07048 to #F07850 (design-qa qa_frame.py, C10.5-2)
    bodyAlbedo: tok("--look-sprite-albedo", 0xF06A3C),
    visor: tok("--sprite-visor", 0xFFFFFF),
    ink: tok("--ink", 0x111418),
    judge: tok("--sprite-judge", 0x111418),
    card: tok("--ground-lift", 0xFFFFFF),
    clay: tok("--clay", 0xD9D5CC),
    clayDeep: tok("--clay-deep", 0xB8B3A8),
    // the strap and the window's frame: one matte grey, measured off the reference (median #777675); no token yet, asked of
    // engine as --sprite-band (board, session 4)
    band: tok("--sprite-band", 0x77767A)
  };

  /* ---------------------------------------------------------------- the body (rig v3, C11: the plump sprite with the band) */
  // Measured from the operator's reference (outputs/lanes/assets-sprites/measures/MEASURES.md, session 4): an egg 1.43 to 1
  // (H 1.00, W 0.70), widest 0.38 of the height from the base; a matte grey strap 0.078 tall round the head at the window's
  // centre, sunk in a shallow groove; the window a white stadium 2.0 to 1 seen face on (0.80 of the body's width), framed by
  // the strap's grey running round it, set into the body; the mark FILE 0.54 of the window's width; two short mittens.
  var markAspect = 663 / 258;
  var SPR = {
    H: 1.00, R: 0.350,              // height 1.00, width 0.70: 1.43 to 1
    yW: 0.38,                       // the widest point, above the base
    nBot: 2.1, nTop: 2.8,           // superellipse exponents: a round foot, a broad dome (the reference's plump top)
    seg: 96, rows: 104, padM: 160,
    armR0: 0.062, armWaist: 0.055, armR2: 0.066, armLen: 0.27, armFlat: 0.86,
    shoulderY: 0.50, shoulderIn: 0.040, shoulderZ: 0.065,
    visorY: 0.625, visA: 0.292, visB: 0.128,          // the window: arc half-length and half-height on the body
    winH: 0.005, winBV: 0.022, winBulge: 0.002,
    // the frame: the strap's grey running round the window, flush with the surface, rolling down into the recess
    frameW: 0.038, frameLift: 0.0006, rimR: 0.010, rimDrop: 0.016, lipIn: 0.030, lipFloor: 0.026,
    winSink: 0.009, winRise: 0.005, endFrom: 0.40, endShallow: 0.70,
    // the body under the face sinks below the frame and the glass (4 mm just inside the frame's edge, 50 mm under the glass)
    sinkEdge: 0.004, bodySink: 0.050,
    // the strap: a band of the body's own surface, sunk gD in a groove with soft walls, one matte grey
    bandY: 0.625, bandH: 0.078, gD: 0.004, gWall: 0.012,
    markW: 0.290,                   // 0.54 of the window's width, as in the reference; clear space 0.6 of its height
    // the lean bends the body below the face: g(y) rises from 0 at the base to 1 under the frame, so the face moves rigidly
    bend0: 0.05, bend1: 0.44
  };
  // v2's pose data is in v2 sprite space (H 1.27, W 0.552): mitten targets scale into v3 by these factors
  // (y also drops by dy: held things sit at the belly, under the window, as the reference holds its book)
  var V2S = { x: 0.700 / 0.552, y: 1.00 / 1.27, z: 0.700 / 0.552, dy: -0.11 };
  // where a scaled v2 target does not fit the egg, v3 sets its own (in v3 metres; the pose name and its meaning unchanged)
  var POSE_V3 = {
    // none needed at present: the V2S scale and drop carry every v2 target (kept for the scene lanes' asks)
  };

  // the analytic egg: radius at height y (r = 0 at the base and the crown)
  function eggR(y) {
    var P = SPR, t;
    if (y <= P.yW) { t = Math.max(0, Math.min(1, (P.yW - y) / P.yW)); return P.R * Math.pow(1 - Math.pow(t, P.nBot), 1 / P.nBot); }
    t = Math.max(0, Math.min(1, (y - P.yW) / (P.H - P.yW))); return P.R * Math.pow(1 - Math.pow(t, P.nTop), 1 / P.nTop);
  }
  function profile(n) {
    // by angle on each half, so the points crowd where the curve turns (the foot, the crown)
    var P = SPR, pts = [], i, th, nb = Math.round(n * 0.42), nt = n - nb;
    for (i = 0; i <= nb; i++) {
      th = Math.PI / 2 * (1 - i / nb);
      pts.push([P.R * Math.pow(Math.cos(th), 2 / P.nBot), P.yW - P.yW * Math.pow(Math.sin(th), 2 / P.nBot)]);
    }
    for (i = 1; i <= nt; i++) {
      th = Math.PI / 2 * i / nt;
      pts.push([P.R * Math.pow(Math.cos(th), 2 / P.nTop), P.yW + (P.H - P.yW) * Math.pow(Math.sin(th), 2 / P.nTop)]);
    }
    pts[0][0] = 0; pts[pts.length - 1][0] = 0;
    return pts;
  }
  var SURF = null;
  function surfTable() {
    if (SURF) return SURF;
    var raw = profile(4000), cum = [0], i;
    for (i = 1; i < raw.length; i++) cum.push(cum[i - 1] + Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]));
    var L = cum[cum.length - 1], N = 2000, tab = [], j = 0;
    for (i = 0; i <= N; i++) {
      var s = L * i / N;
      while (j < cum.length - 2 && cum[j + 1] < s) j++;
      var f = (s - cum[j]) / Math.max(1e-9, cum[j + 1] - cum[j]);
      var dx = raw[j + 1][0] - raw[j][0], dy = raw[j + 1][1] - raw[j][1], dl = Math.hypot(dx, dy) || 1;
      tab.push({ x: raw[j][0] + f * dx, y: raw[j][1] + f * dy, nr: dy / dl, ny: -dx / dl });
    }
    SURF = { L: L, N: N, tab: tab };
    return SURF;
  }
  function at(s) {
    var S = surfTable(), u = Math.max(0, Math.min(S.N, s / S.L * S.N)), i = Math.min(S.N - 1, Math.floor(u)), f = u - i;
    var a = S.tab[i], b = S.tab[i + 1], nr = a.nr + f * (b.nr - a.nr), ny = a.ny + f * (b.ny - a.ny), nl = Math.hypot(nr, ny);
    return { x: a.x + f * (b.x - a.x), y: a.y + f * (b.y - a.y), nr: nr / nl, ny: ny / nl };
  }
  function sAtY(y) {
    var S = surfTable(), i;
    for (i = 1; i <= S.N; i++) if (S.tab[i].y >= y && S.tab[i].x > 0.05) {
      var a = S.tab[i - 1], b = S.tab[i], f = (y - a.y) / Math.max(1e-9, b.y - a.y);
      return S.L * (i - 1 + f) / S.N;
    }
    return S.L / 2;
  }
  function radiusAt(y) { return at(sAtY(y)).x; }

  // the recess is shallower towards the window's ends (where the body turns away from the viewer), so the walls never
  // hide the glass's ends in a front view; u is the position along the arc
  function sinkScale(u) {
    var t = Math.max(0, Math.min(1, (Math.abs(u) / SPR.visA - SPR.endFrom) / (1 - SPR.endFrom)));
    return 1 - SPR.endShallow * t * t * (3 - 2 * t);
  }
  function visLift(d, u) {
    // the glass: its edge winSink below the surface, rising over winBV, then a faint crown; all of it below the surface
    var P = SPR, m = sinkScale(u || 0), base = -P.winSink * m;
    if (d <= 0) return base;
    var q = Math.min(1, d / P.winBV), h = base + P.winRise * m * Math.sqrt(1 - (1 - q) * (1 - q));
    var f = Math.max(0, Math.min(1, (d - P.winBV) / (P.visB - P.winBV)));
    return h + P.winBulge * m * (1 - (1 - f) * (1 - f));
  }
  // the frame: flush with the surface (a hair above, frameLift, so it never fights the body) out to its edge, then a soft
  // roll down into the recess, under the glass's edge
  function lipLift(d, u) {
    var P = SPR;
    if (d <= -P.rimR) return P.frameLift;
    var w = Math.min(1, (d + P.rimR) / (P.rimR + P.lipIn));
    return P.frameLift * (1 - w) - P.rimDrop * sinkScale(u || 0) * (1 - Math.cos(Math.PI * w)) / 2;
  }
  // how far a point (u along the arc, v along the profile from the window's centre) lies inside the window's outline
  function faceD(u, v) { return -stadiumSD(u, v, SPR.visA, SPR.visB); }
  function stadiumSD(u, v, a, b) { var dx = Math.max(Math.abs(u) - (a - b), 0); return Math.sqrt(dx * dx + v * v) - b; }
  function onBody(sC, R0, u, v, h, out) {
    var S = at(sC + v), phi = u / R0, r = S.x + h * S.nr;
    out.push(r * Math.sin(phi), S.y + h * S.ny, r * Math.cos(phi));
  }
  function padGeometry(ds, lift) {
    var P = SPR, a = P.visA, b = P.visB, c = a - b, sC = sAtY(P.visorY), R0 = at(sC).x, M = SPR.padM;
    var per = 4 * c + 2 * Math.PI * b, k;
    var pos = [], uv = [], idx = [];
    function ringPt(j, d) {
      var s = per * j / M, rr = b - d, x, y, th;
      if (s < 2 * c) { x = -c + s; y = rr; }
      else if (s < 2 * c + Math.PI * b) { th = Math.PI / 2 - (s - 2 * c) / b; x = c + rr * Math.cos(th); y = rr * Math.sin(th); }
      else if (s < 4 * c + Math.PI * b) { x = c - (s - 2 * c - Math.PI * b); y = -rr; }
      else { th = -Math.PI / 2 - (s - 4 * c - Math.PI * b) / b; x = -c + rr * Math.cos(th); y = rr * Math.sin(th); }
      return [x, y];
    }
    ds.forEach(function (d) {
      for (var j = 0; j < M; j++) { var p = ringPt(j, d); onBody(sC, R0, p[0], p[1], lift(d, p[0]), pos); uv.push(0.5 + p[0] / (2 * a), 0.5 + p[1] / (2 * b)); }
    });
    for (k = 0; k < ds.length - 1; k++) for (var j = 0; j < M; j++) {
      var j1 = (j + 1) % M, A0 = k * M + j, A1 = k * M + j1, B0 = (k + 1) * M + j, B1 = (k + 1) * M + j1;
      idx.push(A0, A1, B1, A0, B1, B0);
    }
    var g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals();
    var n = g.attributes.normal, probe = Math.floor(ds.length / 2) * M + Math.round(M * 0.1);
    if (n.getZ(probe) < 0) { g.setIndex(idx.slice().reverse()); g.computeVertexNormals(); }
    g.userData = { sC: sC, R0: R0 };
    return g;
  }
  function visorGeometry() {
    var P = SPR, ds = [0], k;
    for (k = 1; k <= 8; k++) ds.push(P.winBV * (1 - Math.cos(k / 8 * Math.PI / 2)));
    for (k = 1; k <= 9; k++) ds.push(P.winBV + (P.visB - P.winBV) * k / 9);
    return padGeometry(ds, visLift);
  }
  // the grey frame (rig v3): from its outer edge (-frameW) flush to -rimR, the roll into the recess to lipIn, a floor under
  // the glass's edge. Built as v2's "lip" (same node, same name) so every caller still finds it; only its material is grey.
  function lipGeometry() {
    var P = SPR, ds = [], k, d0 = -P.frameW;
    for (k = 0; k <= 6; k++) ds.push(d0 + (-P.rimR - d0) * (1 - Math.cos(k / 6 * Math.PI / 2)));
    for (k = 1; k <= 12; k++) ds.push(-P.rimR + (P.rimR + P.lipIn) * k / 12);
    for (k = 1; k <= 3; k++) ds.push(P.lipIn + P.lipFloor * k / 3);
    return padGeometry(ds, lipLift);
  }
  // the strap's groove: 0 outside the band, gD on its floor, soft walls gWall wide
  function grooveW(y) {
    var P = SPR, y0 = P.bandY - P.bandH / 2, y1 = P.bandY + P.bandH / 2;
    if (y <= y0 || y >= y1) return 0;
    var a = Math.min(1, (y - y0) / P.gWall), b = Math.min(1, (y1 - y) / P.gWall), u = Math.min(a, b);
    return 0.5 - 0.5 * Math.cos(Math.PI * u);
  }
  // how far the body sinks at face distance d (positive inside the window): nothing outside the frame, a hair just inside
  // its edge, then deep under the roll and the glass, so the frame and the glass always cover it
  function bodySinkAt(d) {
    var P = SPR;
    if (d < -P.frameW) return 0;
    var t = Math.max(0, Math.min(1, (d + P.frameW - 0.012) / 0.03));
    return P.sinkEdge + (P.bodySink - P.sinkEdge) * t * t * (3 - 2 * t);
  }
  // the body's lathe profile: the egg resampled evenly by arc length, with rows exactly on the strap's edges and walls
  function bodyProfile() {
    var P = SPR, S = surfTable(), n = P.rows, ys = [], i, s, out = [];
    var y0 = P.bandY - P.bandH / 2, y1 = P.bandY + P.bandH / 2, cut = [y0, y0 + P.gWall * 0.5, y0 + P.gWall, y1 - P.gWall, y1 - P.gWall * 0.5, y1];
    var sc = cut.map(sAtY), list = [];
    for (i = 0; i <= n; i++) list.push(S.L * i / n);
    list = list.filter(function (q) { return sc.every(function (c) { return Math.abs(q - c) > S.L / n * 0.35; }); }).concat(sc);
    list.sort(function (a, b) { return a - b; });
    list.forEach(function (q) { var A = at(q), w = grooveW(A.y) * P.gD; out.push({ s: q, r: Math.max(0, A.x - w * A.nr), y: A.y - w * A.ny }); });
    out[0].r = 0; out[out.length - 1].r = 0;
    return { pts: out, y0: y0, y1: y1 };
  }
  // the body and the strap: one lathe, split by rows into two meshes (coral, grey) sharing their edge rings, with the face
  // region pushed in under the frame and the glass, so the recess reads from every side
  function bodyAndBand() {
    var P = SPR, BP = bodyProfile(), pts = BP.pts, sC = sAtY(P.visorY), R0 = at(sC).x, np = pts.length, M = P.seg;
    var pos = [], uv = [], k, j;
    for (k = 0; k <= M; k++) {
      var phi = 2 * Math.PI * k / M, sn = Math.sin(phi), cs = Math.cos(phi);
      for (j = 0; j < np; j++) {
        var q = pts[j], r = q.r, y = q.y;
        if (cs > 0 && r > 0.05) {
          var uu = (phi > Math.PI ? phi - 2 * Math.PI : phi) * R0, d = faceD(uu, q.s - sC), sk = bodySinkAt(d);
          if (sk > 0) { var A = at(q.s); r -= sk * A.nr; y -= sk * A.ny; }
        }
        pos.push(r * sn, y, r * cs); uv.push(k / M, j / (np - 1));
      }
    }
    function mesh(test) {
      var idx = [], used = {}, map = [], P2 = [], U2 = [], I2 = [];
      for (k = 0; k < M; k++) for (j = 0; j < np - 1; j++) {
        var ym = (pts[j].y + pts[j + 1].y) / 2;
        if (!test(ym)) continue;
        var a = k * np + j, b = (k + 1) * np + j, c = (k + 1) * np + j + 1, d2 = k * np + j + 1;
        if (j > 0) idx.push(a, b, d2);
        if (j < np - 2) idx.push(b, c, d2);
      }
      idx.forEach(function (v) { if (used[v] == null) { used[v] = P2.length / 3; map.push(v); P2.push(pos[3 * v], pos[3 * v + 1], pos[3 * v + 2]); U2.push(uv[2 * v], uv[2 * v + 1]); } I2.push(used[v]); });
      var g = new T.BufferGeometry(); g.userData.src = map;
      g.setAttribute("position", new T.Float32BufferAttribute(P2, 3)); g.setAttribute("uv", new T.Float32BufferAttribute(U2, 2));
      g.setIndex(I2); return g;
    }
    var inBand = function (y) { return y > BP.y0 && y < BP.y1; };
    // normals from the whole lathe, so the seam between coral and grey is smooth
    var whole = new T.BufferGeometry(), all = [];
    whole.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    for (k = 0; k < M; k++) for (j = 0; j < np - 1; j++) {
      var a = k * np + j, b = (k + 1) * np + j, c = (k + 1) * np + j + 1, d3 = k * np + j + 1;
      if (j > 0) all.push(a, b, d3); if (j < np - 2) all.push(b, c, d3);
    }
    whole.setIndex(all); whole.computeVertexNormals();
    // the lathe's seam (k = 0 and k = M) carries two copies of each vertex: average them so no line shows down the front
    var wn = whole.attributes.normal;
    for (j = 0; j < np; j++) {
      var i0 = j, i1 = M * np + j, nx = wn.getX(i0) + wn.getX(i1), ny = wn.getY(i0) + wn.getY(i1), nz = wn.getZ(i0) + wn.getZ(i1), nl = Math.hypot(nx, ny, nz) || 1;
      wn.setXYZ(i0, nx / nl, ny / nl, nz / nl); wn.setXYZ(i1, nx / nl, ny / nl, nz / nl);
    }
    function withNormals(test) {
      var g = mesh(test), src = g.userData.src, nn = [];
      for (var i = 0; i < src.length; i++) nn.push(wn.getX(src[i]), wn.getY(src[i]), wn.getZ(src[i]));
      delete g.userData.src;
      g.setAttribute("normal", new T.Float32BufferAttribute(nn, 3)); g.computeBoundingSphere();
      return g;
    }
    var body = withNormals(function (y) { return !inBand(y); }), band = withNormals(inBand);
    body.userData = { band: false }; band.userData = { band: true };
    return { body: body, band: band };
  }
  function decalGeometry(sC, R0) {
    var P = SPR, mw = P.markW, mh = mw / markAspect, g = new T.PlaneGeometry(mw, mh, 72, 20), p = g.attributes.position, out = [];
    for (var k = 0; k < p.count; k++) {
      var u = p.getX(k), v = p.getY(k), d = -stadiumSD(u, v, P.visA, P.visB);
      onBody(sC, R0, u, v, visLift(d, u) + 0.0015, out);
    }
    for (k = 0; k < p.count; k++) p.setXYZ(k, out[3 * k], out[3 * k + 1], out[3 * k + 2]);
    g.computeVertexNormals(); g.computeBoundingSphere(); g.computeBoundingBox();
    return g;
  }
  function armGeometry() {
    // a short rounded mitten: a round cap at the shoulder, a soft waist, a fuller round end (the reference's stubby arms)
    var P = SPR, ap = [], r0 = P.armR0, r2 = P.armR2, yc2 = -(P.armLen - r2), steps = 12, i, t;
    for (i = 0; i <= steps; i++) { t = Math.PI / 2 * i / steps; ap.push([r0 * Math.sin(t), r0 * Math.cos(t)]); }
    for (i = 1; i < 12; i++) {
      var u = i / 12, sm = u * u * (3 - 2 * u), w = Math.pow(Math.sin(Math.PI * u), 2) * ((r0 + r2) / 2 - P.armWaist);
      ap.push([r0 + (r2 - r0) * sm - w, yc2 * u]);
    }
    for (i = 0; i <= steps; i++) { t = Math.PI / 2 * i / steps; ap.push([r2 * Math.cos(t), yc2 - r2 * Math.sin(t)]); }
    ap.reverse(); ap[0][0] = 0; ap[ap.length - 1][0] = 0;
    var g = new T.LatheGeometry(ap.map(function (q) { return new T.Vector2(q[0], q[1]); }), 28);
    g.scale(1, 1, P.armFlat);
    g.userData = { mittenC: -yc2 };
    return g;
  }

  /* ---------------------------------------------------------------- the pencil: a rounded ink capsule, a soft point */
  var PEN = { r: 0.0175, len: 0.205, tip: 0.048, tipR: 0.0045 };
  function pencilGeometry() {
    // a lathe along +y: a round cap at y = 0, the barrel, then a cone easing to a rounded point at y = len (the tip)
    var P = PEN, pts = [], i, t, yb = P.len - P.tip;
    for (i = 0; i <= 10; i++) { t = Math.PI / 2 * i / 10; pts.push([P.r * Math.sin(t), P.r * (1 - Math.cos(t))]); }
    for (i = 1; i <= 4; i++) pts.push([P.r, P.r + (yb - P.r) * i / 4]);
    for (i = 1; i <= 12; i++) { var u = i / 12, e = u * u * (3 - 2 * u); pts.push([P.r + (P.tipR - P.r) * e, yb + (P.tip - P.tipR) * u]); }
    for (i = 1; i <= 6; i++) { t = Math.PI / 2 * i / 6; pts.push([P.tipR * Math.cos(t), P.len - P.tipR + P.tipR * Math.sin(t)]); }
    pts[pts.length - 1][0] = 0;
    var g = new T.LatheGeometry(pts.map(function (q) { return new T.Vector2(q[0], q[1]); }), 24);
    g.translate(0, -P.len / 2, 0);   // centred: +y half is the tip
    return g;
  }
  // tucked: behind the window's right end (the sprite's +x side, screen right in a front view), tip down and forward,
  // its top standing out of the silhouette so the tell reads at 480 px; clear of the lip and of the mark's clear space
  // rig v3: just past the frame's end (phi 1.02 rad), at the window's upper half, so the strap's grey frames it
  var TUCK = { phi: 1.13, y: 0.66, out: 0.016, tilt: [-0.36, -0.91, 0.20] };

  /* ---------------------------------------------------------------- props a pose can hold */
  var bookGeo = null;
  function bookGeometry() {
    if (bookGeo) return bookGeo;
    var BW = 0.14, BH = 0.18;
    var cover = roundedBox(BW, BH, 0.012, 0.005, 3).clone(); cover.translate(BW / 2, 0, 0);
    var pages = roundedBox(BW - 0.012, BH - 0.016, 0.016, 0.006, 3).clone(), pp = pages.attributes.position, pw = BW - 0.012;
    for (var i = 0; i < pp.count; i++) {
      var x = pp.getX(i) + pw / 2, uu = Math.max(0, Math.min(1, x / pw));
      pp.setXYZ(i, x + 0.003, pp.getY(i), pp.getZ(i) + 0.014 + 0.016 * (1 - Math.pow(1 - uu, 2)) * (pp.getZ(i) > 0 ? 1 : 0.6));
    }
    pages.computeVertexNormals();
    var block = roundedBox(BW - 0.012, BH - 0.014, 0.024, 0.008, 3).clone(); block.translate(BW / 2 + 0.004, 0, 0);
    bookGeo = { cover: cover, pages: pages, block: block, W: BW, H: BH };
    return bookGeo;
  }
  function pageTexture() {
    var c = document.createElement("canvas"); c.width = 256; c.height = 320;
    var g = c.getContext("2d"); g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, 256, 320);
    g.strokeStyle = "rgba(43,48,54,0.16)"; g.lineWidth = 5; g.lineCap = "round";
    for (var y = 70; y <= 250; y += 30) { g.beginPath(); g.moveTo(40, y); g.lineTo(y === 250 ? 150 : 216, y); g.stroke(); }
    var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8;
    return t;
  }
  // a held card: a rounded slab, landscape, its face +z (white for work, ink for the judge)
  // session 2 (design-qa FAIL): corners rounded in plan (R), every edge rolled (half the thickness), the face a faint pillow
  // so the key light grades across it
  var CARD = { w: 0.20, h: 0.13, d: 0.010, R: 0.022, bulge: 0.0025 };
  // a card held in one (left) mitten by its lower edge, reaching in towards the middle (write, judge-write)
  var PCARD = new T.Vector3(-0.085 * 0.700 / 0.552, 0.055 * 1.00 / 1.27, 0.035 * 0.700 / 0.552);   // v2's offset in v3 space
  // a rounded slab: every vertex of a graded box grid projected onto (a rounded rectangle of corner radius R - r) + a ball r
  function cardGeometry() {
    var C0 = CARD, r = C0.d / 2, hx = C0.w / 2, hy = C0.h / 2, Rc = C0.R - r, ax = hx - C0.R, ay = hy - C0.R, sx = 7, sz = 3;
    var g = new T.BoxGeometry(C0.w, C0.h, C0.d, 2 * sx + 1, 2 * sx + 1, 2 * sz + 1);
    function remap(u, half, zone, seg) {
      var N = 2 * seg + 1, i = Math.round((u + half) / (2 * half) * N);
      if (i <= seg) return -half + zone * (1 - Math.cos(i / seg * Math.PI / 2));
      return half - zone * (1 - Math.cos((N - i) / seg * Math.PI / 2));
    }
    var pos = g.attributes.position, nor = g.attributes.normal, p = new T.Vector3(), c = new T.Vector3(), n = new T.Vector3();
    for (var k = 0; k < pos.count; k++) {
      p.set(remap(pos.getX(k), hx, C0.R, sx), remap(pos.getY(k), hy, C0.R, sx), remap(pos.getZ(k), r, r, sz));
      var cx = Math.max(-ax, Math.min(ax, p.x)), cy = Math.max(-ay, Math.min(ay, p.y)), ex = p.x - cx, ey = p.y - cy, el = Math.hypot(ex, ey);
      if (el > Rc) { cx += ex / el * Rc; cy += ey / el * Rc; } else { cx = p.x; cy = p.y; }
      c.set(cx, cy, 0); n.subVectors(p, c);
      if (n.lengthSq() < 1e-12) n.set(nor.getX(k), nor.getY(k), nor.getZ(k));
      n.normalize(); p.copy(c).addScaledVector(n, r);
      // the pillow: z grows by w * bulge * f(x, y), the normal tilts by the slope, w = n.z (front +, back -, edges ~0)
      var u = cx / (hx - r), v = cy / (hy - r), f = Math.max(0, (1 - u * u) * (1 - v * v)), w = n.z;
      var fx = -2 * u / (hx - r) * (1 - v * v), fy = -2 * v / (hy - r) * (1 - u * u);
      p.z += w * C0.bulge * f;
      n.set(n.x - w * C0.bulge * fx, n.y - w * C0.bulge * fy, n.z).normalize();
      pos.setXYZ(k, p.x, p.y, p.z); nor.setXYZ(k, n.x, n.y, n.z);
    }
    g.computeBoundingSphere(); g.computeBoundingBox();
    return g;
  }

  // the contact shadow: soft and wide (about 1.4 x the body's width in the reference), darkest under the foot
  var BLOB = { w: 1.05, d: 0.82 };
  var sprBlobTex = null;
  function spriteBlobTexture() {
    if (sprBlobTex) return sprBlobTex;
    var c = document.createElement("canvas"); c.width = c.height = 256;
    var g = c.getContext("2d"), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, TOK.shadow + "0.50)"); gr.addColorStop(0.42, TOK.shadow + "0.34)"); gr.addColorStop(0.62, TOK.shadow + "0.12)");
    gr.addColorStop(0.82, TOK.shadow + "0.03)"); gr.addColorStop(1, TOK.shadow + "0)");
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    sprBlobTex = new T.CanvasTexture(c); sprBlobTex.colorSpace = T.SRGBColorSpace;
    return sprBlobTex;
  }

  var spriteGeo = null;
  function spriteGeometry() {
    if (spriteGeo) return spriteGeo;
    var P = SPR;
    var bb = bodyAndBand(), body = bb.body, band = bb.band, lip = lipGeometry();
    var vg = visorGeometry(), dg = decalGeometry(vg.userData.sC, vg.userData.R0), arm = armGeometry();
    var leg = new T.BufferGeometry();
    leg.setAttribute("position", new T.Float32BufferAttribute([], 3)); leg.setAttribute("normal", new T.Float32BufferAttribute([], 3));
    leg.setAttribute("uv", new T.Float32BufferAttribute([], 2)); leg.setIndex([]);
    spriteGeo = { body: body, band: band, lip: lip, visor: vg, decal: dg, arm: arm, leg: leg, pencil: pencilGeometry(), card: cardGeometry(),
      visorY: P.visorY, vw: 2 * P.visA, vh: 2 * P.visB, visorCY: P.visorY, mittenC: arm.userData.mittenC, H: P.H, W: 2 * P.R,
      markW: P.markW, markH: P.markW / markAspect, R0: vg.userData.R0, markBox: dg.boundingBox.clone() };
    return spriteGeo;
  }
  var spriteMats = {};
  function spriteMaterials(renderer, clip) {
    var key = clip ? "clip" : "plain";
    if (spriteMats[key]) return spriteMats[key];
    var cp = clip || null;
    spriteMats[key] = {
      // sheen 0.15, clearcoat 0.4, env 0.6: engine's stage-light coral (board 20261109T213927), on the body only, never the window or mark
      // rig v3 (C11.3): matte clay, no hard specular: the clearcoat is a faint broad sheen of the light, never a hot spot
      body: new T.MeshPhysicalMaterial({ color: C.bodyAlbedo, roughness: 0.56, metalness: 0, clearcoat: 0.12, clearcoatRoughness: 0.6,
        sheen: 0.15, sheenColor: new T.Color(0xFFD9C8), sheenRoughness: 0.6, envMapIntensity: 0.6, clippingPlanes: cp }),
      // the strap and the frame: one matte grey, no clearcoat, no sheen
      band: new T.MeshStandardMaterial({ color: C.band, roughness: 0.86, metalness: 0, envMapIntensity: 0.45, clippingPlanes: cp }),
      // the window: a satin white with depth (a soft broad gloss, as in the reference), never a hard glint
      visor: new T.MeshPhysicalMaterial({ color: C.visor, roughness: 0.3, metalness: 0, clearcoat: 0.5, clearcoatRoughness: 0.28,
        sheen: 0.4, sheenColor: new T.Color(0xFFFFFF), sheenRoughness: 0.45, envMapIntensity: 0.9, clippingPlanes: cp }),
      decal: new T.MeshBasicMaterial({ map: L0.markTexture(renderer), alphaTest: 0.02, alphaToCoverage: true, polygonOffset: true,
        polygonOffsetFactor: -4, toneMapped: false, clippingPlanes: cp }),
      // the pencil: ink with a gloss coat, so it reads as a lit object, never a flat line
      pencil: new T.MeshPhysicalMaterial({ color: C.ink, roughness: 0.34, metalness: 0, clearcoat: 0.9, clearcoatRoughness: 0.12,
        envMapIntensity: 1.0, clippingPlanes: cp }),
      card: new T.MeshStandardMaterial({ color: C.card, roughness: 0.5, metalness: 0, envMapIntensity: 0.6, clippingPlanes: cp }),
      inkCard: new T.MeshPhysicalMaterial({ color: C.judge, roughness: 0.4, metalness: 0, clearcoat: 0.5, clearcoatRoughness: 0.2,
        envMapIntensity: 0.9, clippingPlanes: cp }),
      book: new T.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5, metalness: 0, envMapIntensity: 0.6, clippingPlanes: cp }),
      page: new T.MeshStandardMaterial({ color: 0xFFFFFF, map: pageTexture(), roughness: 0.7, metalness: 0, envMapIntensity: 0.5,
        clippingPlanes: cp })
    };
    // the stage's sprite key (world.js Look.spriteKey: no received shadow, a camera fill), installed on the cached body
    // itself so every sprite, the crowd and every fade clone compiles with it (C10.5-2)
    spriteMats[key].body.onBeforeCompile = function (sh) { if (window.Look && window.Look.spriteKey) window.Look.spriteKey(sh); };
    return spriteMats[key];
  }

  /* ---------------------------------------------------------------- the pose library (build/sprites/poses.json) */
  // poses.json, inlined by inline_poses.py (file:// needs no fetch); edit poses.json, never this line
  var POSE_DATA = /*@POSES@*/{"_about":"The newcomer's pose library (assets-sprites, R4; SPRITES.md v2.1 \u00a72 to \u00a74, LOOPS.md \u00a71). Scene lanes call poses and clips by name: Look.pose(spr, 'reach'), Look.animate(spr, 'idle-breathe', t + Look.phase(i)). Sprite space: metres, base on y = 0, the face towards +z, +x is the sprite's own left (screen right in a front view). An arm is {dir:[x,y,z], st} (a direction and a stretch along the arm) or {tgt:[x,y,z]} (where the mitten goes); stretch is capped at 1.5 and never thickens. k is the body's squash (1 rest, volume kept); lean [x, z] bends the body below the face, so the face moves by translation only; lift raises the whole sprite (the contact shadow shrinks); turn is a body turn on the spot in radians. pencil: tuck | hand | none (Dot only; others ignore it). prop: book | card | ink-card. The face (window, lip, mark) never rotates, squashes, tints or blinks. Edit this file, then run python3 build/sprites/inline_poses.py to copy it into world-look.sprites.js.","version":"assets-sprites poses v1.1, 2026-11-09 (pose review)","poses":{"idle":{"L":{"dir":[0.22,-0.95,0.22]},"R":{"dir":[-0.22,-0.95,0.22]}},"walk":{"L":{"dir":[0.26,-0.94,0.18]},"R":{"dir":[-0.26,-0.94,0.18]},"lean":[0,0.025]},"reach":{"L":{"dir":[0.22,0.62,0.76],"st":1.42},"R":{"dir":[-0.3,-0.93,0.1]},"lean":[0,0.03],"k":1.02},"write":{"L":{"tgt":[0.13,0.5,0.36]},"R":{"tgt":[-0.07,0.67,0.36]},"pencil":"hand","prop":"card","lean":[0,0.03]},"write-wall":{"L":{"dir":[0.3,-0.9,0.3]},"R":{"dir":[-0.35,0.35,0.87],"st":1.3},"pencil":"hand","lean":[0,0.05],"k":1.02},"carry":{"L":{"tgt":[0.12,0.54,0.34]},"R":{"tgt":[-0.12,0.54,0.34]},"prop":"card"},"read":{"L":{"tgt":[0.15,0.5,0.38]},"R":{"tgt":[-0.15,0.5,0.38]},"prop":"book"},"bump":{"L":{"dir":[0.35,0.1,0.93]},"R":{"dir":[-0.35,0.1,0.93]},"lean":[0,-0.07],"k":0.96},"sit-puzzled":{"L":{"dir":[0.85,-0.45,0.25]},"R":{"dir":[-0.85,-0.45,0.25]},"lean":[0.05,0],"k":0.9},"climb":{"L":{"tgt":[0.2,0.64,0.33]},"R":{"tgt":[-0.2,0.64,0.33]},"lean":[0,0.06],"k":1.03},"hover":{"L":{"dir":[0.75,-0.6,0.2]},"R":{"dir":[-0.75,-0.6,0.2]},"lift":0.2,"k":1.02},"drop":{"L":{"dir":[0.28,0.96,0.05],"st":1.2},"R":{"dir":[-0.28,0.96,0.05],"st":1.2},"k":1.06},"point":{"L":{"dir":[0.8,0.25,0.55],"st":1.3},"R":{"dir":[-0.22,-0.95,0.22]},"lean":[0.02,0.02]},"watch":{"L":{"tgt":[0.06,0.5,0.34]},"R":{"tgt":[-0.06,0.5,0.34]},"lean":[0.03,0.035]},"raise-hand":{"L":{"dir":[0.22,-0.95,0.22]},"R":{"dir":[-0.32,0.94,0.1],"st":1.3},"k":1.03},"sleep":{"L":{"dir":[0.16,-0.99,0.05]},"R":{"dir":[-0.16,-0.99,0.05]},"lean":[0.11,0.02],"k":0.93},"fade":{"L":{"dir":[0.22,-0.95,0.22]},"R":{"dir":[-0.22,-0.95,0.22]},"opacity":0},"wave":{"L":{"dir":[0.62,0.74,0.26],"st":1.22},"R":{"dir":[-0.22,-0.95,0.22]},"wobble":{"arm":"L","axis":[0.3,-0.05,0.0],"period":500}},"hang-pencil":{"L":{"dir":[0.22,-0.95,0.22]},"R":{"dir":[-0.5,0.72,0.48],"st":1.35},"pencil":"hand","lean":[0,0.04],"k":1.03},"take-pencil":{"L":{"dir":[0.22,-0.95,0.22]},"R":{"dir":[-0.5,0.72,0.48],"st":1.35},"pencil":"hand","lean":[0,0.04],"k":1.03},"judge-write":{"L":{"tgt":[0.13,0.5,0.36]},"R":{"tgt":[-0.07,0.67,0.36]},"prop":"ink-card","pencil":"none","lean":[0,0.03]},"neutral":{"L":{"dir":[0.22,-0.95,0.22]},"R":{"dir":[-0.22,-0.95,0.22]}},"curious":{"L":{"dir":[0.6,0.45,0.66],"st":1.1},"R":{"dir":[-0.22,-0.95,0.22]},"lean":[0.02,0.04]},"happy":{"L":{"dir":[0.55,-0.55,0.3]},"R":{"dir":[-0.55,-0.55,0.3]},"k":1.04},"puzzled":{"L":{"dir":[0.88,0.2,0.42]},"R":{"dir":[-0.88,0.2,0.42]},"lean":[0.06,0],"k":0.97},"determined":{"L":{"tgt":[0.12,0.54,0.35]},"R":{"tgt":[-0.12,0.54,0.35]},"prop":"card","lean":[0,0.06],"k":0.98}},"clips":{"idle-breathe":{"frames":12,"period":4000,"used":"everywhere; the default loop; once in 4.0 s, rest for the remainder","keys":[{"t":0,"pose":"idle"},{"t":500,"pose":"idle","set":{"k":1.03},"ease":"inOutSine"},{"t":1000,"pose":"idle","ease":"inOutSine"}],"rest":"idle"},"walk-cycle":{"frames":8,"period":1000,"used":"s05 arrival, s06, s13, s22 (the engine moves the sprite along its path; this is the bob in place); period 1000 ms (two hops), divides the 4 s beat","keys":[{"t":0,"pose":"walk"},{"t":83,"pose":"walk","set":{"k":0.95},"ease":"outQuad"},{"t":250,"pose":"walk","set":{"lift":0.06,"k":1.04},"ease":"outQuad"},{"t":417,"pose":"walk","set":{"k":0.96},"ease":"inQuad"},{"t":500,"pose":"walk","ease":"inOutSine"},{"t":583,"pose":"walk","set":{"k":0.95},"ease":"outQuad"},{"t":750,"pose":"walk","set":{"lift":0.06,"k":1.04},"ease":"outQuad"},{"t":917,"pose":"walk","set":{"k":0.96},"ease":"inQuad"},{"t":1000,"pose":"walk","ease":"inOutSine"}],"rest":"walk"},"reach-claim":{"frames":10,"period":4000,"used":"s07 (two sprites, one card)","keys":[{"t":0,"pose":"idle"},{"t":250,"pose":"curious","ease":"inOutSine"},{"t":580,"pose":"reach","ease":"outBack"},{"t":830,"pose":"reach","set":{"k":1.04},"ease":"inOutSine"},{"t":1000,"pose":"reach","ease":"inOutSine"}],"rest":"reach"},"read-flip":{"frames":8,"period":4000,"used":"s08, s09","keys":[{"t":0,"pose":"read"},{"t":330,"pose":"read","set":{"lean":[0,0.03],"k":1.02},"ease":"inOutSine"},{"t":667,"pose":"read","ease":"inOutSine"}],"rest":"read"},"bump-sit":{"frames":10,"period":8000,"used":"s10 (once, then still)","keys":[{"t":0,"pose":"walk"},{"t":170,"pose":"bump","ease":"outQuad"},{"t":420,"pose":"bump","set":{"k":0.92},"ease":"inOutSine"},{"t":830,"pose":"sit-puzzled","ease":"inOutCubic"}],"rest":"sit-puzzled"},"hatch-climb":{"frames":10,"period":4000,"used":"s11, s21 (the scene moves the sprite up through the hatch)","keys":[{"t":0,"pose":"drop"},{"t":330,"pose":"climb","ease":"inOutSine"},{"t":580,"pose":"climb","set":{"k":0.94},"ease":"inOutSine"},{"t":830,"pose":"idle","set":{"k":1.05},"ease":"outQuad"},{"t":1000,"pose":"idle","ease":"inOutSine"}],"rest":"idle"},"hover-drift":{"frames":16,"period":4000,"used":"s12 (loop): rising and settling 0.2 m, the seam at the low point with arms at rest","keys":[{"t":0,"pose":"hover","set":{"lift":0.1}},{"t":2000,"pose":"hover","set":{"lift":0.3,"k":1.03},"ease":"inOutSine"},{"t":4000,"pose":"hover","set":{"lift":0.1},"ease":"inOutSine"}],"rest":"hover"},"drop-and-rise":{"frames":14,"period":4000,"used":"s12: drop two layers and come back up (the scene moves the sprite down; this is the body)","keys":[{"t":0,"pose":"hover"},{"t":250,"pose":"drop","ease":"inOutSine"},{"t":580,"pose":"drop","set":{"k":1.08},"ease":"inQuad"},{"t":830,"pose":"hover","set":{"k":0.94},"ease":"outQuad"},{"t":1170,"pose":"hover","ease":"inOutSine"}],"rest":"hover"},"write-correct":{"frames":8,"period":4000,"used":"s14 (the correction flies to the recipe); loop-safe: pen lifted at the seam, card always in hand","keys":[{"t":0,"pose":"write","set":{"R":{"tgt":[-0.09,0.72,0.37]}}},{"t":250,"pose":"write","ease":"inOutSine"},{"t":420,"pose":"write","set":{"R":{"tgt":[-0.03,0.655,0.37]},"lean":[0,0.05]},"ease":"inOutSine"},{"t":667,"pose":"write","ease":"inOutSine"},{"t":830,"pose":"write","set":{"R":{"tgt":[-0.09,0.72,0.37]}},"ease":"inOutSine"},{"t":4000,"pose":"write","set":{"R":{"tgt":[-0.09,0.72,0.37]}}}],"rest":"write"},"judge-write":{"frames":8,"period":4000,"used":"s15 (loop, two variants: judge-write and judge-write-b); pen lifted at the seam","keys":[{"t":0,"pose":"judge-write"},{"t":170,"pose":"judge-write","set":{"R":{"tgt":[-0.09,0.67,0.36]}},"ease":"inOutSine"},{"t":330,"pose":"judge-write","set":{"R":{"tgt":[-0.05,0.66,0.37]}},"ease":"inOutSine"},{"t":500,"pose":"judge-write","set":{"R":{"tgt":[-0.08,0.65,0.36]}},"ease":"inOutSine"},{"t":667,"pose":"judge-write","ease":"inOutSine"}],"rest":"judge-write"},"judge-write-b":{"frames":8,"period":4000,"used":"s15 (the second variant: a longer stroke, then a look up)","keys":[{"t":0,"pose":"judge-write"},{"t":250,"pose":"judge-write","set":{"R":{"tgt":[-0.1,0.665,0.36]}},"ease":"inOutSine"},{"t":500,"pose":"judge-write","set":{"R":{"tgt":[-0.03,0.655,0.37]}},"ease":"inOutSine"},{"t":667,"pose":"judge-write","set":{"lean":[0,0.0],"k":1.02},"ease":"inOutSine"},{"t":830,"pose":"judge-write","ease":"inOutSine"}],"rest":"judge-write"},"hand-up":{"frames":6,"period":4000,"used":"s21 (the hand stays up)","keys":[{"t":0,"pose":"idle"},{"t":170,"pose":"raise-hand","set":{"R":{"dir":[-0.85,0.2,0.48],"st":1.1}},"ease":"outQuad"},{"t":330,"pose":"raise-hand","set":{"k":1.05},"ease":"outBack"},{"t":500,"pose":"raise-hand","ease":"inOutSine"}],"rest":"raise-hand"},"shift-end-fade":{"frames":6,"period":4000,"used":"s06, s22 (the end-of-shift dissolve)","keys":[{"t":0,"pose":"idle"},{"t":170,"pose":"idle","set":{"k":0.97},"ease":"inOutSine"},{"t":500,"pose":"fade","set":{"k":1.02},"ease":"inOutSine"}],"rest":"fade"},"pencil-hook":{"frames":8,"period":4000,"used":"s22: Dot hangs the pencil (pencil leaves the hand at 420 ms: the scene shows Look.pencil() on the hook from then); held with no pencil to the end of the period (plays once: looping it would put the pencil back at the tuck)","keys":[{"t":0,"pose":"idle","set":{"pencil":"tuck"}},{"t":170,"pose":"idle","set":{"pencil":"hand"},"ease":"inOutSine"},{"t":400,"pose":"hang-pencil","ease":"inOutSine"},{"t":440,"pose":"hang-pencil","set":{"pencil":"none"},"ease":"inOutSine"},{"t":830,"pose":"idle","set":{"pencil":"none"},"ease":"inOutSine"},{"t":4000,"pose":"idle","set":{"pencil":"none"},"ease":"inOutSine"}],"rest":"idle"},"pencil-take":{"frames":8,"period":4000,"used":"s22 p3: tomorrow's newcomer takes the pencil from the hook (the pencil enters the mitten at 250 ms: the scene hides the hook's pencil then)","keys":[{"t":0,"pose":"idle","set":{"pencil":"none"}},{"t":240,"pose":"take-pencil","set":{"pencil":"none"},"ease":"inOutSine"},{"t":260,"pose":"take-pencil","ease":"inOutSine"},{"t":580,"pose":"idle","set":{"pencil":"hand"},"ease":"inOutSine"},{"t":667,"pose":"happy","set":{"pencil":"tuck"},"ease":"outBack"},{"t":830,"pose":"idle","set":{"pencil":"tuck"},"ease":"inOutSine"}],"rest":"idle"},"wave-once":{"frames":6,"period":0,"used":"s24 p3, then idle-breathe (plays once; period 0 means no repeat); the wobble switches on and off at 250 ms and 1500 ms, where its phase is zero, so the arm never jumps","keys":[{"t":0,"pose":"idle"},{"t":500,"pose":"wave","ease":"inOutSine"},{"t":1250,"pose":"wave","ease":"inOutSine"},{"t":1750,"pose":"idle","ease":"inOutSine"}],"rest":"idle"},"hop":{"frames":8,"period":4000,"used":"happy: a card claimed, work passed; arrival hop (s05)","keys":[{"t":0,"pose":"idle"},{"t":120,"pose":"happy","set":{"k":0.92},"ease":"outQuad"},{"t":300,"pose":"happy","set":{"lift":0.12,"k":1.07},"ease":"outQuad"},{"t":480,"pose":"happy","set":{"lift":0.0,"k":0.93},"ease":"inQuad"},{"t":667,"pose":"idle","ease":"outBack"}],"rest":"idle"},"shrug":{"frames":8,"period":4000,"used":"puzzled: the fence, the signless corridor","keys":[{"t":0,"pose":"idle"},{"t":420,"pose":"puzzled","ease":"outBack"},{"t":830,"pose":"puzzled","ease":"inOutSine"},{"t":1170,"pose":"idle","ease":"inOutSine"}],"rest":"idle"},"sleep-breathe":{"frames":12,"period":8000,"used":"a sleeping newcomer (the body tilts; the mark never changes)","keys":[{"t":0,"pose":"sleep"},{"t":2000,"pose":"sleep","set":{"k":0.95},"ease":"inOutSine"},{"t":4000,"pose":"sleep","ease":"inOutSine"}],"rest":"sleep"}},"strips":{"index":"strips/strips.json","clips":["wave-once","idle-breathe"],"note":"25 fps PNG frames plus one lossless WebP grid per clip, Dot with the pencil tucked, for the s24 overlay (engine/module, 2026-11-10)"}}/*@END@*/;

  var DOWN = new T.Vector3(0, -1, 0), V = new T.Vector3(), V2 = new T.Vector3(), Q = new T.Quaternion(), M4 = new T.Matrix4(),
    SINV = new T.Matrix4(), ONE = new T.Vector3(1, 1, 1);

  function shoulderRest(side) {
    var P = SPR, rr = radiusAt(P.shoulderY), sz = P.shoulderZ;
    return new T.Vector3(side * (Math.sqrt(rr * rr - sz * sz) - P.shoulderIn), P.shoulderY, sz);
  }
  var SH = { L: null, R: null };
  function sh(side) { if (!SH.L) { SH.L = shoulderRest(1); SH.R = shoulderRest(-1); } return side === "L" ? SH.L : SH.R; }

  // an arm spec ({dir:[x,y,z], st} or {tgt:[x,y,z]}) to a unit direction and a stretch in 1..1.5
  function armOf(spec, side) {
    var G = spriteGeometry(), d, st;
    if (spec && spec.tgt3) {
      d = new T.Vector3(spec.tgt3[0], spec.tgt3[1], spec.tgt3[2]).sub(sh(side)); st = d.length() / G.mittenC;
    } else if (spec && spec.tgt) {
      d = new T.Vector3(spec.tgt[0] * V2S.x, spec.tgt[1] * V2S.y + V2S.dy, spec.tgt[2] * V2S.z).sub(sh(side)); st = d.length() / G.mittenC;
    } else {
      var a = spec && spec.dir ? spec.dir : (side === "L" ? [0.22, -0.95, 0.22] : [-0.22, -0.95, 0.22]);
      d = new T.Vector3(a[0], a[1], a[2]); st = spec && spec.st != null ? spec.st : 1;
    }
    return { dir: d.normalize(), st: Math.max(1, Math.min(1.5, st)) };
  }
  // a pose by name to a full parameter set (every field present)
  function resolve(name, over) {
    var src = (POSE_DATA && POSE_DATA.poses && POSE_DATA.poses[name]) || (POSE_DATA && POSE_DATA.poses && POSE_DATA.poses.idle) || {};
    var o = Object.assign({}, src, POSE_V3[name] || {}, over || {});
    return {
      name: name,
      L: armOf(o.L, "L"), R: armOf(o.R, "R"),
      k: o.k != null ? o.k : 1, lean: o.lean ? o.lean.slice() : [0, 0], lift: o.lift || 0, turn: o.turn || 0,
      pencil: o.pencil || "tuck", prop: o.prop || null, opacity: o.opacity != null ? o.opacity : 1,
      wobble: o.wobble || null
    };
  }
  var EASE = {
    inOutSine: function (u) { return 0.5 - 0.5 * Math.cos(Math.PI * u); },
    inOutCubic: function (u) { return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    outQuad: function (u) { return 1 - (1 - u) * (1 - u); },
    inQuad: function (u) { return u * u; },
    outBack: function (u) { var c1 = 1.2, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); }
  };
  function mixArm(a, b, u) { return { dir: a.dir.clone().lerp(b.dir, u).normalize(), st: a.st + (b.st - a.st) * u }; }
  function mix(a, b, u) {
    var h = u >= 0.5 ? b : a;
    return { name: h.name, L: mixArm(a.L, b.L, u), R: mixArm(a.R, b.R, u), k: a.k + (b.k - a.k) * u,
      lean: [a.lean[0] + (b.lean[0] - a.lean[0]) * u, a.lean[1] + (b.lean[1] - a.lean[1]) * u],
      lift: a.lift + (b.lift - a.lift) * u, turn: a.turn + (b.turn - a.turn) * u, opacity: a.opacity + (b.opacity - a.opacity) * u,
      pencil: h.pencil, prop: h.prop, wobble: h.wobble };
  }

  /* ---------------------------------------------------------------- the lean: a bend below the face (per sprite, cached) */
  function bendG(y) { var P = SPR, u = Math.max(0, Math.min(1, (y - P.bend0) / (P.bend1 - P.bend0))); return u * u * (3 - 2 * u); }
  function bendDG(y) { var P = SPR, u = (y - P.bend0) / (P.bend1 - P.bend0); return u <= 0 || u >= 1 ? 0 : 6 * u * (1 - u) / (P.bend1 - P.bend0); }
  // the body and the coral rim around the window bend together (the rim is skin, so it squashes and bends with the body;
  // only the glass and the mark stay rigid)
  function leanBody(spr, lx, lz) {
    var ud = spr.userData, G = spriteGeometry();
    if (Math.abs(lx) < 1e-4 && Math.abs(lz) < 1e-4) {
      if (ud.body.geometry !== G.body) ud.body.geometry = G.body;
      if (ud.lip.geometry !== G.lip) ud.lip.geometry = G.lip;
      if (ud.band && ud.band.geometry !== G.band) ud.band.geometry = G.band;
      ud.leanNow = [0, 0]; return;
    }
    if (ud.leanNow && Math.abs(ud.leanNow[0] - lx) < 1e-4 && Math.abs(ud.leanNow[1] - lz) < 1e-4) return;
    if (!ud.bodyOwn) ud.bodyOwn = G.body.clone();
    if (!ud.lipOwn) ud.lipOwn = G.lip.clone();
    if (!ud.bandOwn) ud.bandOwn = G.band.clone();
    [[ud.bodyOwn, G.body, ud.body], [ud.lipOwn, G.lip, ud.lip], [ud.bandOwn, G.band, ud.band]].forEach(function (b) {
      var g = b[0], p = g.attributes.position, n = g.attributes.normal, p0 = b[1].attributes.position, n0 = b[1].attributes.normal;
      for (var i = 0; i < p.count; i++) {
        var y = p0.getY(i), gy = bendG(y), dg = bendDG(y), nx = n0.getX(i), ny = n0.getY(i), nz = n0.getZ(i);
        p.setXYZ(i, p0.getX(i) + lx * gy, y, p0.getZ(i) + lz * gy);
        // normals by the inverse transpose of the bend's Jacobian
        var mx = nx, my = ny - (lx * nx + lz * nz) * dg, mz = nz, ml = Math.hypot(mx, my, mz) || 1;
        n.setXYZ(i, mx / ml, my / ml, mz / ml);
      }
      p.needsUpdate = true; n.needsUpdate = true; g.computeBoundingSphere();
      b[2].geometry = g;
    });
    ud.leanNow = [lx, lz];
  }

  /* ---------------------------------------------------------------- the rig: pose parameters to meshes */
  // a mesh inside the squash group whose net transform must be rigid: matrix = inverse(squash scale) x T R S
  function setRigid(m, pos, quat, scl) {
    m.matrixAutoUpdate = false;
    M4.compose(pos, quat, scl);
    m.matrix.multiplyMatrices(SINV, M4);
    m.matrixWorldNeedsUpdate = true;
  }
  function propGroup(spr, kind, M) {
    var ud = spr.userData;
    if (ud.propKind === kind) return ud.propObj;
    if (ud.propObj) { ud.squash.remove(ud.propObj); ud.propObj = null; }
    ud.propKind = kind;
    if (!kind) return null;
    var g = new T.Group();
    if (kind === "book-closed") {
      var B2 = bookGeometry(), cl = new T.Group();
      [-1, 1].forEach(function (s2) {
        var cv2 = new T.Mesh(B2.cover, M.book); cv2.castShadow = true; cv2.receiveShadow = true;
        cv2.position.z = s2 * 0.017; cl.add(cv2);
      });
      var pk = new T.Mesh(B2.block, M.book); pk.castShadow = true; pk.receiveShadow = true; cl.add(pk);
      cl.position.x = -B2.W / 2; g.add(cl);
    } else if (kind === "book") {
      var B = bookGeometry();
      [-1, 1].forEach(function (s) {
        var half = new T.Group(), cv = new T.Mesh(B.cover, M.book), pg = new T.Mesh(B.pages, M.page);
        cv.castShadow = pg.castShadow = true; cv.receiveShadow = pg.receiveShadow = true;
        half.add(cv); half.add(pg); half.scale.x = s; half.rotation.y = -s * 0.22;
        g.add(half);
      });
    } else {
      var c = new T.Mesh(spriteGeometry().card, kind === "ink-card" ? M.inkCard : M.card);
      c.castShadow = true; c.receiveShadow = true; g.add(c);
    }
    g.userData.prop = kind;
    ud.squash.add(g); ud.propObj = g;
    return g;
  }
  function applyPose(spr, P) {
    var ud = spr.userData, G = spriteGeometry(), M = ud.mats, k = P.k, rk = Math.sqrt(k), s = 1 / rk, lx = P.lean[0], lz = P.lean[1];
    ud.state = P;
    ud.squash.scale.set(1 / rk, k, 1 / rk);
    ud.squash.position.y = P.lift;
    ud.squash.rotation.y = 0;
    SINV.makeScale(rk, 1 / k, rk);
    leanBody(spr, lx, lz);
    // the face: translation and uniform scale only (the mark never rotates, squashes or changes)
    V.set(lx * s, SPR.visorY * (k - s), lz * s); V2.set(s, s, s); Q.identity();
    [ud.visor, ud.decal].forEach(function (m) { setRigid(m, V, Q, V2); });
    // arms: rigid, at the squashed and bent shoulder, by direction, stretched along their length only
    var mitt = {};
    ["L", "R"].forEach(function (side, i) {
      var a = P[side], s0 = sh(side), gy = bendG(s0.y), arm = ud.arms[i];
      var pos = new T.Vector3((s0.x + lx * gy) * s, s0.y * k, (s0.z + lz * gy) * s);
      Q.setFromUnitVectors(DOWN, a.dir);
      setRigid(arm, pos, Q, V2.set(1, a.st, 1));
      arm.userData.reach = G.mittenC * a.st;
      mitt[side] = pos.clone().addScaledVector(a.dir, G.mittenC * a.st);
    });
    // the pencil (Dot only): tucked on the face, or in the right mitten tip first along the arm
    if (ud.pencil) {
      var pm = ud.pencil;
      if (P.pencil === "none") pm.visible = false;
      else if (P.pencil === "hand") {
        pm.visible = true;
        // writing on a held card: tip down onto the card; a raised arm (hook, wall): the pencil carries on along the arm
        var d = P.prop === "card" ? mitt.L.clone().add(PCARD).sub(mitt.R).normalize()
          : P.R.dir.y > 0.2 ? P.R.dir.clone().add(new T.Vector3(0, 0, 0.35)).normalize()
          : P.R.dir.clone().add(new T.Vector3(0, -0.35, 0.55)).normalize();
        Q.setFromUnitVectors(new T.Vector3(0, 1, 0), d);
        setRigid(pm, mitt.R.clone().addScaledVector(d, PEN.len * 0.28), Q, V2.set(1, 1, 1));
      } else {
        pm.visible = true;
        var tp = tuckPos(), td = new T.Vector3(TUCK.tilt[0], TUCK.tilt[1], TUCK.tilt[2]).normalize();
        Q.setFromUnitVectors(new T.Vector3(0, 1, 0), td);
        V.set(tp.x * s + lx * s, SPR.visorY * k + tp.y * s, tp.z * s + lz * s);
        setRigid(pm, V, Q, V2.set(s, s, s));
      }
    }
    // a held prop, placed between the mittens (book, card) or in the left mitten (the judge's ink card)
    var kind = P.prop || (ud.carryBook ? "book-closed" : null);
    var pg = propGroup(spr, kind, M);
    if (pg) {
      var c;
      if (kind === "book-closed") {
        // held upright against the body's side by the left mitten, spine down, the front cover facing out
        c = mitt.L.clone().add(new T.Vector3(-0.02, 0.06, 0.05));
        Q.setFromEuler(new T.Euler(-0.12, 0.55, 0.08));
      } else if (P.prop === "book") {
        c = mitt.L.clone().add(mitt.R).multiplyScalar(0.5); c.y += 0.045; c.z += 0.03;
        Q.setFromEuler(new T.Euler(-0.55, 0, 0));
      } else if (P.prop === "card") {
        // two mittens grip its lower corners, the card standing above them; with a pencil in play, the left mitten holds it
        c = mitt.L.clone().add(mitt.R).multiplyScalar(0.5); c.y += 0.05; c.z += 0.02;
        if (P.pencil !== "tuck") c = mitt.L.clone().add(PCARD);
        Q.setFromEuler(new T.Euler(P.pencil !== "tuck" ? -0.45 : -0.25, 0, 0));
      } else {   // ink-card in the left mitten
        c = mitt.L.clone().add(PCARD);
        Q.setFromEuler(new T.Euler(-0.45, 0.1, 0));
      }
      setRigid(pg, c, Q, V2.set(1, 1, 1));
    }
    // fade: per-sprite transparent copies of the materials, made once, only when a sprite fades
    setOpacity(spr, P.opacity);
    // the contact shadow shrinks and lightens as the sprite leaves the floor
    var bs = Math.max(0.3, 1 - P.lift * 2.5);
    ud.blob.scale.set(BLOB.w * bs, 1, BLOB.d * bs);
    ud.blob.material.opacity = Math.max(0.25, 1 - P.lift * 3) * P.opacity;
    // a body turn on the spot (the mark turns with the whole sprite, never on its own)
    ud.squash.rotation.y = P.turn;
    if (P.turn) ud.squash.updateMatrix();
  }
  function tuckPos() {
    var r = radiusAt(TUCK.y) + PEN.r * 0.15 + TUCK.out;
    return new T.Vector3(r * Math.sin(TUCK.phi), TUCK.y - SPR.visorY, r * Math.cos(TUCK.phi));
  }
  function setOpacity(spr, a) {
    var ud = spr.userData;
    if (a >= 0.999 && !ud.fading) return;
    if (!ud.fadeMats) {
      ud.fadeMats = new Map();
      spr.traverse(function (m) {
        if (!m.isMesh || m === ud.blob) return;
        if (!ud.fadeMats.has(m.material)) { var c = m.material.clone(); c.transparent = true; c.onBeforeCompile = m.material.onBeforeCompile; ud.fadeMats.set(m.material, c); }
        m.userData.matSolid = m.material; m.material = ud.fadeMats.get(m.material);
      });
    }
    ud.fading = a < 0.999;
    ud.fadeMats.forEach(function (c) { c.opacity = a; c.depthWrite = a > 0.98; });
    // a fading sprite stops casting its shadow-map shadow halfway, so nothing is left on the floor at 0
    spr.traverse(function (m) { if (m.isMesh && m !== ud.blob) { if (m.userData.castSolid == null) m.userData.castSolid = m.castShadow; m.castShadow = m.userData.castSolid && a > 0.5; } });
    if (!ud.fading) {   // back to the shared solid materials
      spr.traverse(function (m) { if (m.isMesh && m.userData.matSolid) { m.material = m.userData.matSolid; delete m.userData.matSolid; } });
      ud.fadeMats = null;
    }
  }

  /* ---------------------------------------------------------------- the sprite */
  function sprite(renderer, o) {
    o = o || {};
    var G = spriteGeometry(), M = spriteMaterials(renderer, o.clip);
    var root = new T.Group(), squash = new T.Group(); root.add(squash);
    var body = new T.Mesh(G.body, M.body); body.castShadow = true; body.receiveShadow = true;
    var band = new T.Mesh(G.band, M.band); band.castShadow = true; band.receiveShadow = true;
    var lip = new T.Mesh(G.lip, M.band); lip.castShadow = true; lip.receiveShadow = true;
    var visor = new T.Mesh(G.visor, M.visor); visor.castShadow = true; visor.receiveShadow = true;
    var decal = new T.Mesh(G.decal, M.decal); decal.renderOrder = 7;
    var aL = new T.Mesh(G.arm, M.body), aR = new T.Mesh(G.arm, M.body);
    [aL, aR].forEach(function (a) { a.castShadow = true; a.receiveShadow = true; });
    [body, band, lip, visor, decal, aL, aR].forEach(function (m) { squash.add(m); });
    var pen = null;
    if (o.pencil) { pen = new T.Mesh(G.pencil, M.pencil); pen.castShadow = true; pen.receiveShadow = true; pen.name = "pencil"; squash.add(pen); }
    var shd = blob(BLOB.w, BLOB.d); shd.material.map = spriteBlobTexture(); shd.position.y = 0.004; root.add(shd);
    root.userData = { squash: squash, body: body, band: band, lip: lip, visor: visor, decal: decal, arms: [aL, aR], legs: [], blob: shd,
      pencil: pen, mats: M, book: null, carryBook: !!o.book, kind: o.judge ? "judge" : (o.pencil ? "dot" : "newcomer") };
    var name = o.pose || (o.judge ? "judge-write" : "idle");
    if (name === "stand") name = "idle";
    var P = resolve(name);
    if (!o.pencil && P.pencil === "hand") P.pencil = "none";
    applyPose(root, P);
    root.userData.pose = name;
    root.userData.book = root.userData.propKind === "book" ? root.userData.propObj : null;
    return root;
  }
  // world.js's eased squash: s in -1..1, volume kept, the base on the floor; the face stays rigid
  function squash(spr, s) {
    var ud = spr.userData, P = Object.assign({}, ud.state || resolve("idle"));
    P.k = 1 + 0.035 * s;
    applyPose(spr, P);
  }
  // set a named pose (with optional overrides, e.g. { lean: [0, 0.05] })
  function pose(spr, name, over) {
    var P = resolve(name, over);
    if (!spr.userData.pencil && P.pencil === "hand") P.pencil = "none";
    applyPose(spr, P); spr.userData.pose = name;
    return P;
  }

  /* ---------------------------------------------------------------- clips: keyframes over time, a pure function of t */
  function clipAt(name, t) {
    var C0 = POSE_DATA && POSE_DATA.clips && POSE_DATA.clips[name];
    if (!C0) return resolve(name);
    var per = C0.period || 0, tt = per ? ((t % per) + per) % per : Math.max(0, t), keys = C0.keys, i;
    var kp = keys.map(function (kk) { return kk._r || (kk._r = resolve(kk.pose, kk.set)); });
    if (tt <= keys[0].t) return kp[0];
    for (i = 1; i < keys.length; i++) if (tt <= keys[i].t) {
      var u = (tt - keys[i - 1].t) / Math.max(1, keys[i].t - keys[i - 1].t);
      return mix(kp[i - 1], kp[i], (EASE[keys[i].ease] || EASE.inOutSine)(u));
    }
    return C0.rest ? resolve(C0.rest) : kp[kp.length - 1];
  }
  function wobbleAt(P, t) {
    // an in-place oscillation added on top of a pose (the wave, the judge's pen strokes); period divides 4000 ms
    var w = P.wobble; if (!w) return P;
    var ph = Math.sin(2 * Math.PI * ((t % w.period) / w.period)), a = P[w.arm], ax = w.axis;
    var d = a.dir.clone().add(new T.Vector3(ax[0] * ph, ax[1] * ph, ax[2] * ph)).normalize();
    var o = Object.assign({}, P); o[w.arm] = { dir: d, st: a.st };
    return o;
  }
  function animate(spr, name, t, over) {
    var P = clipAt(name, t);
    P = wobbleAt(P, t);
    if (over) P = Object.assign({}, P, over);
    if (!spr.userData.pencil && P.pencil === "hand") P = Object.assign({}, P, { pencil: "none" });
    applyPose(spr, P); spr.userData.pose = name;
    return P;
  }
  // deterministic phase stagger by sprite index (LOOPS §1: a crowd never breathes in unison)
  function phase(i, period) { var x = Math.sin(i * 127.1 + 31.7) * 43758.5453; return Math.floor((x - Math.floor(x)) * (period || 4000)); }

  /* ---------------------------------------------------------------- the two scales */
  // projected height in px of a sprite and of its mark, for the 40 px rule and the 210 px floor
  function measure(spr, camera, viewH) {
    spr.updateMatrixWorld(true);
    // rig v3: the mark's corners are read off the decal as posed (its own matrix carries the rigid face transform), and the
    // width is returned too (markWpx: world.js's found-sprite gate reads the mark's width, C11.4); viewW defaults to the
    // camera's aspect times viewH
    var G = spriteGeometry(), top = new T.Vector3(0, G.H, 0), base = new T.Vector3(0, 0, 0), bb = G.markBox, cy = (bb.min.y + bb.max.y) / 2;
    var mt = new T.Vector3(0, bb.max.y, bb.max.z), mb = new T.Vector3(0, bb.min.y, bb.max.z);
    var ml = new T.Vector3(bb.min.x, cy, bb.min.z), mr = new T.Vector3(bb.max.x, cy, bb.min.z), dec = spr.userData.decal;
    [top, base].forEach(function (v) { spr.localToWorld(v); v.project(camera); });
    [mt, mb, ml, mr].forEach(function (v) { dec.localToWorld(v); v.project(camera); });
    var vw = viewH * (camera.aspect || 16 / 9);
    var fwd = new T.Vector3(0, 0, 1).transformDirection(spr.matrixWorld), toCam = camera.position.clone().sub(spr.getWorldPosition(new T.Vector3())).normalize();
    return { spritePx: Math.abs(top.y - base.y) / 2 * viewH, markPx: Math.abs(mt.y - mb.y) / 2 * viewH,
      markWpx: Math.hypot((mr.x - ml.x) / 2 * vw, (mr.y - ml.y) / 2 * viewH), facing: fwd.dot(toCam) };
  }
  // the crowd's yaw: three-quarter back to the camera (SPRITES §2), turned left or right by index
  function crowdYaw(x, z, cam, i) {
    var toCam = Math.atan2(cam.x - x, cam.z - z), side = (phase(i, 2) ? 1 : -1);
    return toCam + Math.PI + side * 0.55;
  }
  // the crowd's parts in sprite space (stand pose, no pencil): coral merged, the window, the mark; for one InstancedMesh each
  function crowdParts(renderer, clip) {
    // rig v3: the crowd is under 40 px, so its parts are built at a lower tessellation (about 12k triangles a sprite);
    // the grey (strap and frame) is its own part
    var proto = sprite(renderer, { clip: clip }), sq = proto.userData.squash, ud = proto.userData, lo = lowGeometry();
    proto.updateMatrixWorld(true);
    var M = ud.mats, coral = [], grey = [], out = [];
    sq.children.forEach(function (m) {
      if (!m.isMesh) return;
      var src = m === ud.body ? lo.body : m === ud.band ? lo.band : m === ud.lip ? lo.lip : m === ud.visor ? lo.visor : m.geometry;
      var g = src.clone().applyMatrix4(m.matrix);
      if (m === ud.visor) out.push({ name: "visor", geometry: g, material: M.visor, castShadow: false });
      else if (m === ud.decal) out.push({ name: "decal", geometry: g, material: M.decal, castShadow: false, renderOrder: 7 });
      else if (m === ud.band || m === ud.lip) grey.push(g);
      else coral.push(g);
    });
    out.unshift({ name: "band", geometry: mergeIndexed(grey), material: M.band, castShadow: true });
    out.unshift({ name: "coral", geometry: mergeIndexed(coral), material: M.body, castShadow: true });
    return out;
  }
  var lowGeo = null;
  function lowGeometry() {
    if (lowGeo) return lowGeo;
    var keep = { seg: SPR.seg, rows: SPR.rows, padM: SPR.padM };
    SPR.seg = 48; SPR.rows = 56; SPR.padM = 80;
    try { var bb = bodyAndBand(); lowGeo = { body: bb.body, band: bb.band, lip: lipGeometry(), visor: visorGeometry() }; }
    finally { Object.assign(SPR, keep); }
    return lowGeo;
  }
  function mergeIndexed(list) {
    var P = [], N = [], U = [], I = [], base = 0;
    list.forEach(function (g) {
      var p = g.attributes.position, n = g.attributes.normal, u = g.attributes.uv;
      for (var k = 0; k < p.count; k++) { P.push(p.getX(k), p.getY(k), p.getZ(k)); N.push(n.getX(k), n.getY(k), n.getZ(k)); U.push(u ? u.getX(k) : 0, u ? u.getY(k) : 0); }
      var idx = g.index; for (var j = 0; j < idx.count; j++) I.push(idx.getX(j) + base);
      base += p.count;
    });
    var out = new T.BufferGeometry();
    out.setAttribute("position", new T.Float32BufferAttribute(P, 3)); out.setAttribute("normal", new T.Float32BufferAttribute(N, 3));
    out.setAttribute("uv", new T.Float32BufferAttribute(U, 2)); out.setIndex(I);
    return out;
  }
  // a loose pencil (s22: on the hook by the ledger, until the new newcomer takes it); tip down
  function pencil(renderer, o) {
    o = o || {};
    var M = spriteMaterials(renderer, o.clip), m = new T.Mesh(spriteGeometry().pencil, M.pencil);
    m.castShadow = true; m.receiveShadow = true; m.rotation.z = Math.PI; m.name = "pencil";
    return m;
  }

  /* ---------------------------------------------------------------- the people above: smooth faceless clay figures (R8d)
     v2 (assets-sprites R4, crowd/CROWD_PEOPLE.md): a soft, chunky, faceless clay figure, Pixar-clean. Every joint is a
     pivot inside an overlapping round part, so no seam or gap shows: the head sits down over a neck that rises from the
     torso, the arms hang from round shoulder caps sunk into the torso, the legs start inside a rounded pelvis, elbows and
     knees bend (sit, write, phone, carry). Heights in metres for a 2.15 m figure; feet at y = 0, facing +z. */
  var PERSON = { H: 2.15, hipY: 0.95, shoulderY: 1.54, shoulderX: 0.188, neckY: 1.74, legX: 0.104,
    upper: 0.34, fore: 0.29, thigh: 0.45, shin: 0.41 };
  var personGeo = null;
  function lathe(pts, seg) { return new T.LatheGeometry(pts.map(function (q) { return new T.Vector2(q[0], q[1]); }), seg || 40); }
  function smoothProfile(knots, n) {
    // a Catmull-Rom through [r, y] knots, closed at both ends on the axis
    var c = new T.SplineCurve(knots.map(function (k) { return new T.Vector2(k[0], k[1]); }));
    var pts = c.getPoints(n || 48).map(function (v) { return [Math.max(0, v.x), v.y]; });
    pts[0][0] = 0; pts[pts.length - 1][0] = 0;
    return pts;
  }
  // a tapered capsule hanging from its pivot: radius r0 at y = 0, r1 at y = -len, round caps both ends
  function limb(r0, r1, len) {
    var pts = [], k, a;
    for (k = 0; k <= 12; k++) { a = Math.PI / 2 * (1 - k / 12); pts.push([r1 * Math.cos(a), -len - r1 * Math.sin(a)]); }
    for (k = 0; k <= 12; k++) { a = Math.PI / 2 * k / 12; pts.push([r0 * Math.cos(a), r0 * Math.sin(a)]); }
    pts[0][0] = 0; pts[pts.length - 1][0] = 0;
    return lathe(pts, 32);
  }
  function personGeometry() {
    if (personGeo) return personGeo;
    var P = PERSON;
    // the torso, pelvis to neck in one lathe (relative to the hip pivot): a soft rounded trunk, broad round shoulders
    var torso = lathe(smoothProfile([[0, -0.14], [0.16, -0.12], [0.212, -0.03], [0.205, 0.12], [0.192, 0.25], [0.212, 0.42],
      [0.228, 0.55], [0.218, 0.635], [0.17, 0.695], [0.10, 0.745], [0.09, 0.80], [0.08, 0.88], [0, 0.92]], 72), 56);
    torso.scale(1, 1, 0.76);
    var shoulder = new T.SphereGeometry(0.084, 40, 24); shoulder.scale(1.05, 0.8, 0.95);
    // the head: a smooth egg, a touch large for friendliness (about 1/6 of the height), sunk over the neck
    var head = new T.SphereGeometry(0.168, 56, 40); head.scale(0.92, 1.06, 0.97); head.translate(0, 0.17, 0.012);
    var upper = limb(0.072, 0.060, P.upper), fore = limb(0.060, 0.052, P.fore);
    var hand = new T.SphereGeometry(0.066, 28, 18); hand.scale(0.85, 1.12, 0.92); hand.translate(0, -0.05, 0.004);
    var thigh = limb(0.102, 0.080, P.thigh), shin = limb(0.080, 0.062, P.shin);
    var foot = new T.SphereGeometry(0.076, 32, 20); foot.scale(0.98, 0.62, 1.62); foot.translate(0, -0.055, 0.06);
    // the plumber's toolbelt (s18): a soft clay-deep ring at the waist and two rounded pouches
    var belt = lathe(smoothProfile([[0.196, 0.0], [0.212, 0.005], [0.218, 0.04], [0.212, 0.075], [0.196, 0.08]], 24), 56);
    belt.scale(1, 1, 0.78); belt.translate(0, 0.03, 0);
    var pouch = roundedBox(0.10, 0.13, 0.065, 0.026, 4);
    personGeo = { torso: torso, shoulder: shoulder, head: head, upper: upper, fore: fore, hand: hand, thigh: thigh, shin: shin,
      foot: foot, belt: belt, pouch: pouch };
    return personGeo;
  }
  var personMats = {};
  function personMaterials(clip) {
    var key = clip ? "clip" : "plain";
    if (personMats[key]) return personMats[key];
    personMats[key] = {
      clay: new T.MeshPhysicalMaterial({ color: C.clay, roughness: 0.62, metalness: 0, clearcoat: 0.12, clearcoatRoughness: 0.55,
        sheen: 0.18, sheenColor: new T.Color(0xFFF8EE), sheenRoughness: 0.7, envMapIntensity: 0.5, clippingPlanes: clip || null }),
      deep: new T.MeshPhysicalMaterial({ color: C.clayDeep, roughness: 0.58, metalness: 0, clearcoat: 0.12, clearcoatRoughness: 0.55,
        envMapIntensity: 0.55, clippingPlanes: clip || null })
    };
    return personMats[key];
  }
  /* poses: arms [[out, up, forward] direction of the upper arm (out is away from the body on that side), elbow bend];
     arm 0 is the figure's right, arm 1 its left. legs [hip flex, knee bend] per leg; torso lean; head [yaw, nod]. */
  var PERSON_POSES = {
    stand: { arms: [[[0.13, -1, 0.02], 0.12], [[0.13, -1, 0.02], 0.12]], legs: [[0, 0], [0, 0]], torso: 0, head: [0, 0] },
    walk: { arms: [[[0.10, -1, 0.02], 0.25], [[0.10, -1, 0.02], 0.25]], legs: [[0, 0], [0, 0]], torso: 0.04, head: [0, 0] },
    sit: { arms: [[[0.10, -1, 0.14], 1.05], [[0.10, -1, 0.14], 1.05]], legs: [[1.57, 1.57], [1.57, 1.57]], torso: 0.04, head: [0, 0.06], sit: true },
    write: { arms: [[[0.02, -0.75, 0.62], 1.15], [[0.16, -0.85, 0.45], 1.25]], legs: [[1.57, 1.57], [1.57, 1.57]], torso: 0.22, head: [0, 0.38], sit: true },
    point: { arms: [[[0.13, -1, 0.02], 0.12], [[0.30, 0.08, 0.95], 0.05]], legs: [[0, 0], [0, 0]], torso: 0, head: [0.25, 0] },
    "hand-up": { arms: [[[0.13, -1, 0.02], 0.12], [[0.22, 1, 0.08], 0.18]], legs: [[0, 0], [0, 0]], torso: 0, head: [0, -0.05] },
    phone: { arms: [[[0.13, -1, 0.02], 0.12], [[0.55, -0.45, 0.35], 2.5]], legs: [[0, 0], [0, 0]], torso: 0, head: [0.12, 0.18] },
    carry: { arms: [[[0.04, -0.92, 0.32], 1.35], [[0.04, -0.92, 0.32], 1.35]], legs: [[0, 0], [0, 0]], torso: -0.03, head: [0, 0.12] }
  };
  /* Look.person({ pose, plumber, clip, height }): pose in stand | walk | sit | write | point | hand-up | phone | carry.
     Faceless: the head is a smooth egg, no features. The plumber wears a clay-deep belt with two pouches (s18).
     A seated pose puts the hips at 0.50 m (a 0.42 m seat). userData: fig, hips, head (the neck pivot), legs, arms, blob. */
  function person(o) {
    o = o || {};
    var P = PERSON, G = personGeometry(), M = personMaterials(o.clip), g = new T.Group(), fig = new T.Group(); g.add(fig);
    function add(geo, m, p) { var x = new T.Mesh(geo, m); x.castShadow = true; x.receiveShadow = true; p.add(x); return x; }
    var hips = new T.Group(); hips.position.y = P.hipY; fig.add(hips);
    add(G.torso, M.clay, hips);
    var neck = new T.Group(); neck.position.y = P.neckY - P.hipY; hips.add(neck); add(G.head, M.clay, neck);
    var legs = [], arms = [];
    [-1, 1].forEach(function (sd) {
      var lg = new T.Group(); lg.position.set(sd * P.legX, P.hipY, 0); fig.add(lg); add(G.thigh, M.clay, lg);
      var kn = new T.Group(); kn.position.y = -P.thigh; lg.add(kn); add(G.shin, M.clay, kn);
      var an = new T.Group(); an.position.y = -P.shin; kn.add(an); add(G.foot, M.clay, an);
      lg.userData.knee = kn; legs.push(lg);
      var ag = new T.Group(); ag.position.set(sd * P.shoulderX, P.shoulderY - P.hipY, 0); hips.add(ag); add(G.upper, M.clay, ag);
      var el = new T.Group(); el.position.y = -P.upper; ag.add(el); add(G.fore, M.clay, el);
      var wr = new T.Group(); wr.position.y = -P.fore; el.add(wr); add(G.hand, M.clay, wr);
      ag.userData.elbow = el; ag.userData.side = sd; arms.push(ag);
    });
    if (o.plumber) {
      add(G.belt, M.deep, hips);
      [-1, 1].forEach(function (sd) {
        var p = add(G.pouch, M.deep, hips); p.position.set(sd * 0.175, -0.04, 0.11); p.rotation.y = sd * 0.55;
      });
    }
    var shd = blob(1.0, 0.75, { clip: o.clip }); shd.position.y = 0.004; g.add(shd);
    var sc = (o.height || P.H) / P.H; fig.scale.setScalar(sc);
    g.userData = { fig: fig, hips: hips, head: neck, legs: legs, arms: arms, blob: shd, live: false, plumber: !!o.plumber };
    personPose(g, o.pose || "stand", 0);
    return g;
  }
  var PQ = new T.Quaternion(), PX = new T.Vector3(1, 0, 0);
  // set a person's pose; t (ms) drives the walk cycle (period 1000 ms) and nothing else
  function personPose(g, name, t) {
    var P = PERSON_POSES[name] || PERSON_POSES.stand, ud = g.userData, walk = name === "walk";
    var ph = walk ? Math.sin(2 * Math.PI * ((t || 0) % 1000) / 1000) : 0;
    ud.arms.forEach(function (a, i) {
      var A = P.arms[i], sd = a.userData.side, d = new T.Vector3(sd * A[0][0], A[0][1], A[0][2]).normalize();
      a.quaternion.setFromUnitVectors(DOWN, d);
      if (walk) a.quaternion.premultiply(PQ.setFromAxisAngle(PX, (i ? 0.32 : -0.32) * ph));
      a.userData.elbow.rotation.x = -(A[1] + (walk ? 0.12 * (1 + (i ? ph : -ph)) : 0));
    });
    ud.legs.forEach(function (l, i) {
      var Lg = P.legs[i], flex = Lg[0], knee = Lg[1];
      if (walk) { var s = i ? -ph : ph; flex = 0.36 * s; knee = 0.08 + 0.45 * Math.max(0, -s); }
      l.rotation.x = -flex; l.userData.knee.rotation.x = knee;
      l.userData.knee.children[1].rotation.x = P.sit ? 0 : -knee * 0.5;   // keep the sole near flat
    });
    ud.hips.rotation.x = P.torso || 0;
    ud.head.rotation.set(P.head[1] || 0, P.head[0] || 0, 0);
    ud.fig.position.y = P.sit ? -(PERSON.hipY - 0.50) : 0;
    if (walk) ud.fig.position.y = 0.018 * Math.abs(Math.cos(Math.PI * ((t || 0) % 1000) / 1000)) - 0.012;
    ud.blob.scale.set(P.sit ? 1.15 : 1.0, 1, P.sit ? 1.1 : 0.75);
    ud.pose = name;
  }
  // a head turn for the people round the meeting table (s21): yaw in radians, eased by the caller
  function personHead(g, yaw) { g.userData.head.rotation.y = yaw; }

  Object.assign(window.Look, {
    sprite: sprite, squash: squash, spriteGeometry: spriteGeometry, spriteMaterials: spriteMaterials,
    pose: pose, animate: animate, phase: phase, poses: function () { return POSE_DATA; }, measure: measure,
    crowdYaw: crowdYaw, crowdParts: crowdParts, pencil: pencil,
    person: person, personPose: personPose, personHead: personHead,
    SPRITE_KIT: { version: "assets-sprites rig v3 (R4b, C11)", SPR: SPR, PEN: PEN, TUCK: TUCK, CARD: CARD, V2S: V2S, BLOB: BLOB }
  });
})();
