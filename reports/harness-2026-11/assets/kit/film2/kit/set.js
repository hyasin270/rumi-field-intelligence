// set.js (film2 kit, v2-kit): the building in cross-section (W) and the table-top stage (S), built from importable parts.
// The building is v2-visuals' prototype model (outputs/lanes/v2-visuals/proto/world.js): a block of ground cut open at the
// front (z = 0); on the surface (y = 0) a glass pavilion, the people; cut into the block two floors, the agents.
// x: -8..8 is the building, the block runs -12.5..12.5; floors: G y 0, B1 y -3.2, B2 y -6.4; depth z -6..0.
// Every part is a function of t through declared state (claim(i, t0), install(name, t0)), never a callback.
(function () {
  "use strict";
  const { T, PAL, mat, rbox, add, rrShape } = KIT.parts;
  const MEET_TONE = 0xC9B89C, RISER_TONE = 0xB3A48B;   // v0.8 (v2-check 132524): risers and back board ~20 luma under the meeting, so a meeting's outline steps at S
  const FILL = 1.5, FILL_BOTTOM = 1.2;   // v2-visuals 142413: 1.2 on the bottom floor (its open front and visors sat on the limit)
  let CAP_MAT_ = null; const capMat = () => CAP_MAT_ || (CAP_MAT_ = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }));   // VL 15.64: the meeting's sides, risers and the store's back board (as _c/lib.js C.MEET_TONE)
  const FH = 3.2, DEPTH = 6, HALF = 8, BLOCK = 12.5;
  const tw = FILM.tw, clamp01 = FILM.clamp01;

  // ---------------------------------------------------------------- a text sign as a texture (local fonts)
  function signTex(text, o) {
    o = o || {}; const c = document.createElement("canvas"), w = o.w || 1024, h = o.h || 256; c.width = w; c.height = h;
    const g = c.getContext("2d"); g.fillStyle = o.bg || "#fdfcf9"; g.fillRect(0, 0, w, h);
    g.fillStyle = o.ink || "#111418"; let px = o.px || 120; g.font = `${o.weight || 600} ${px}px 'Poppins'`; g.textBaseline = "middle";
    // fit: one line that is too wide shrinks until it fits 90% of the width
    if (!o.wrap) { const widest = Math.max(...String(text).split("\n").map((ln) => g.measureText(ln).width)); if (widest > w * 0.9) { px = Math.floor(px * w * 0.9 / widest); g.font = `${o.weight || 600} ${px}px 'Poppins'`; } }
    // lines: split on \n, then wrap to the width when o.wrap
    let lines = String(text).split("\n");
    if (o.wrap) { const out = []; lines.forEach((ln) => { let cur = ""; ln.split(" ").forEach((wd) => { const tr = cur ? cur + " " + wd : wd; if (g.measureText(tr).width > w * 0.9 && cur) { out.push(cur); cur = wd; } else cur = tr; }); out.push(cur); }); lines = out; }
    const lh = px * 1.18, top = h / 2 - (lines.length - 1) * lh / 2 + 6;
    g.textAlign = o.align === "left" ? "left" : "center";
    lines.forEach((ln, i) => g.fillText(ln, o.align === "left" ? w * 0.05 : w / 2, top + i * lh));
    const tx = new T.CanvasTexture(c); tx.colorSpace = T.SRGBColorSpace; tx.anisotropy = 8; return tx;
  }
  const cardTex = (lines, cw, ch, o) => signTex(lines.join("\n"), Object.assign({ w: 1024, h: Math.round(1024 * ch / cw), wrap: true }, o || {}));
  function sign(text, w, h, o) {
    const g = new T.Group(); const pad = add(g, rbox(w, h, 0.05, mat("card"), Math.min(w, h) * 0.18, 0.015));
    const face = new T.Mesh(new T.PlaneGeometry(w * 0.92, h * 0.8), new T.MeshStandardMaterial({ map: signTex(text, Object.assign({ w: 1024, h: Math.round(1024 * h / w) }, o)), roughness: 0.7 }));
    face.position.z = 0.027; g.add(face); pad.castShadow = true; return g;
  }

  // ---------------------------------------------------------------- parts (each returns a Group; centre-bottom at its origin)
  const PARTS = {
    // the job board: rows x cols cards; cardPoint(i) is the front face of a card (world).
    // claim(i, t0, {tag}) puts an agent's coral tag on from t0 (the frame turns green); label(i, text) writes the job on a
    // card; flip(i, t0, lines, {hold}) turns a card over to show its back and back again; ripple(t0, share) claims a share of
    // the free cards one by one, 60 ms apart.
    board(k, o) {
      const rows = (o.cards && o.cards[0]) || 4, cols = (o.cards && o.cards[1]) || 7, cw = o.cardW || 0.47, ch = o.cardH || 0.39, gap = o.gap || 0.07;
      const BW = cols * cw + (cols - 1) * gap + 0.4, BH = rows * ch + (rows - 1) * gap + 0.4, y0 = o.y == null ? 0.9 : o.y;
      const g = new T.Group();
      add(g, rbox(BW, BH, 0.12, mat(o.panel || "slab"), 0.12, 0.04), 0, y0 + BH / 2, 0);   // the panel one step darker than its cards
      if (y0 > 0.05) [-BW / 2 + 0.25, BW / 2 - 0.25].forEach((x) => add(g, rbox(0.1, y0, 0.1, mat("white"), 0.04, 0.02), x, y0 / 2, 0));
      const cards = [];
      const textMat = (lines, o2) => new T.MeshStandardMaterial({ map: cardTex(lines, cw, ch, o2), roughness: 0.7, transparent: false });
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const cg = new T.Group(), inner = new T.Group(); cg.add(inner);
        const x = -BW / 2 + 0.2 + cw / 2 + c * (cw + gap), y = y0 + BH - 0.2 - ch / 2 - r * (ch + gap);
        const fr = add(inner, rbox(cw + 0.06, ch + 0.06, 0.05, mat("green", { roughness: 0.6 }), 0.05, 0.02), 0, 0, -0.01); fr.visible = false;
        add(inner, rbox(cw, ch, 0.07, mat("card"), 0.04, 0.02), 0, 0, 0.012);
        const l1 = add(inner, rbox(cw * 0.45, 0.025, 0.02, mat("grey"), 0.01, 0.006), -cw * 0.15, ch * 0.18, 0.05), l2 = add(inner, rbox(cw * 0.3, 0.025, 0.02, mat("grey"), 0.01, 0.006), -cw * 0.22, ch * 0.04, 0.05);
        const tag = add(inner, rbox(cw * 0.34, ch * 0.2, 0.03, mat("coral", { roughness: 0.6 }), 0.02, 0.008), -cw * 0.2, -ch * 0.24, 0.06); tag.visible = false;
        cg.position.set(x, y, 0.1); cg.userData = { inner, fr, tag, lines: [l1, l2], claimAt: null, flip: null, face: null, back: null }; g.add(cg); cards.push(cg);
      }
      g.userData.cards = cards;
      g.cardPoint = (i) => { const c = cards[i]; g.updateMatrixWorld(true); return c.localToWorld(new T.Vector3(-cw * 0.2, -ch * 0.24, 0.1)); };
      // a point on the card's lower frame edge, beside the tag (VL: the hand lands there, the tag stays clear)
      g.edgePoint = (i, side, edge) => { const c = cards[i]; g.updateMatrixWorld(true); return c.localToWorld(new T.Vector3((side === "left" ? -1 : 1) * cw * 0.3, edge === "top" ? ch / 2 - 0.03 : -ch / 2 + 0.03, 0.08)); };
      g.claim = (i, t0, op) => { const u = cards[i].userData; u.claimAt = t0;
        if (op && op.tag) { const tw2 = cw * 0.62, th2 = ch * 0.26; const m = new T.Mesh(new T.PlaneGeometry(tw2, th2), new T.MeshStandardMaterial({ map: signTex(op.tag, { w: 512, h: Math.round(512 * th2 / tw2), bg: "#F06E42", ink: "#ffffff", px: 150 }), roughness: 0.6 }));
          u.tag.visible = false; u.tag = m; m.scale.set(0.9, 0.9, 1); m.position.set((op.side === "right" ? 1 : -1) * cw * 0.17, -ch * 0.34, 0.08); m.visible = false; u.inner.add(m); }   // put the tag on the side away from the reaching arm
        return g; };
      g.label = (i, text) => { const u = cards[i].userData; u.lines.forEach((l) => (l.visible = false));
        const m = new T.Mesh(new T.PlaneGeometry(cw * 0.94, ch * 0.56), new T.MeshStandardMaterial({ map: signTex(text, { w: 1024, h: Math.round(1024 * ch * 0.56 / (cw * 0.94)), bg: "#FDFCF9", px: o.labelPx || 128, weight: 700, wrap: true }), roughness: 0.7 }));
        m.position.set(0, ch * 0.19, 0.05); u.inner.add(m); u.face = m; return g; };
      g.flip = (i, t0, lines, op) => { const u = cards[i].userData; u.flip = { t0, hold: (op && op.hold) || 2600 };
        const m = new T.Mesh(new T.PlaneGeometry(cw * 0.94, ch * 0.9), new T.MeshStandardMaterial({ map: signTex(lines.join("\n"), { w: 1024, h: Math.round(1024 * ch * 0.9 / (cw * 0.94)), bg: "#FDFCF9", px: (op && op.px) || 74, wrap: true, align: "left" }), roughness: 0.7 }));
        m.rotation.y = Math.PI; m.position.set(0, 0, -0.03); u.inner.add(m); u.back = m; return g; };
      g.ripple = (t0, share, op) => { const free = cards.map((c, i) => i).filter((i) => cards[i].userData.claimAt == null);
        free.forEach((i, n) => { if (FILM.noise(i, 77) < share) cards[i].userData.claimAt = t0 + Math.floor(FILM.noise(i, 78) * free.length * share) * ((op && op.gap) || 60); }); return g; };
      g.eval = (t) => cards.forEach((c) => { const u = c.userData, on = u.claimAt != null && t >= u.claimAt; u.fr.visible = on; u.tag.visible = on;
        const s = on ? 1 + 0.18 * Math.sin(Math.PI * clamp01((t - u.claimAt) / 360)) : 1; c.scale.setScalar(s); c.position.z = 0.1 - (on ? 0.03 * Math.sin(Math.PI * clamp01((t - u.claimAt) / 240)) : 0);
        if (u.flip) { const f = u.flip, a1 = tw(t, f.t0, f.t0 + 420, "io"), a2 = tw(t, f.t0 + 420 + f.hold, f.t0 + 840 + f.hold, "io"), ang = Math.PI * (a1 - a2);
          u.inner.rotation.y = ang; c.position.z += 0.25 * Math.sin(ang); } });
      k.track(g); g.size = [BW, y0 + BH]; return g;
    },
    // a door in a frame, with an optional sign above it
    door(k, o) {
      const g = new T.Group(), w = o.w || 1.0, h = o.h || 2.1;
      add(g, rbox(w + 0.24, h + 0.12, 0.16, mat("white"), 0.08, 0.04), 0, (h + 0.12) / 2, 0);
      const leaf = add(g, rbox(w, h, 0.1, mat(o.colour || "wallWarm"), 0.06, 0.03), 0, h / 2, 0.06);
      const knob = add(g, new T.Mesh(new T.SphereGeometry(0.05, 16, 12), mat("band")), w * 0.32, h * 0.48, 0.14); knob.castShadow = true;   // VL 15.21: nothing black
      if (o.label) { const s = sign(o.label, Math.max(w + 0.4, o.label.length * 0.16), 0.36); s.position.set(0, h + 0.38, 0.05); g.add(s); g.userData.sign = s; }
      g.userData.leaf = leaf; return g;
    },
    // a barrier that drops in front of something at t0 (hooks)
    barrier(k, o) {
      const g = new T.Group(), w = o.w || 1.6; const bar = add(g, rbox(w, 0.14, 0.14, mat("green", { roughness: 0.6 }), 0.06, 0.03), 0, 0.95, 0);
      [-w / 2, w / 2].forEach((x) => add(g, rbox(0.16, 1.05, 0.16, mat("white"), 0.06, 0.03), x, 0.52, 0));
      g.dropAt = (t0) => { g.userData.t0 = t0; return g; };
      g.eval = (t) => { const t0 = g.userData.t0; if (t0 == null) return; const u = tw(t, t0, t0 + 380, "back"); bar.position.y = 0.95 + 1.6 * (1 - u); bar.visible = t >= t0 - 1; };
      k.track(g); return g;
    },
    desk(k, o) {
      const g = new T.Group(), w = o.w || 1.6, d = o.d || 0.85; add(g, rbox(w, 0.09, d, mat("white"), 0.04, 0.03), 0, 0.72, 0);
      [-w / 2 + 0.12, w / 2 - 0.12].forEach((x) => add(g, rbox(0.09, 0.7, d - 0.15, mat("white"), 0.04, 0.03), x, 0.35, 0)); return g;
    },
    // VL 15.21: nothing in the model is black; the screen is pale
    laptop(k, o) { const g = new T.Group(); add(g, rbox(0.42, 0.025, 0.3, mat("grey"), 0.01, 0.01), 0, 0.78, 0); const s = add(g, rbox(0.42, 0.28, 0.02, mat("white", { roughness: 0.4 }), 0.01, 0.008), 0, 0.92, -0.15); s.rotation.x = -0.25;
      const scr = add(g, new T.Mesh(new T.PlaneGeometry(0.38, 0.24), new T.MeshBasicMaterial({ color: 0xf4f1ea, toneMapped: false })), 0, 0.92, -0.138); scr.rotation.x = -0.25; g.userData.screen = scr; return g; },
    // the skill book (VL 15.5): one object everywhere; white cover, green spine, 0.34 m tall
    book(k, o) { const g = new T.Group(), h = 0.34, w = 0.25, d = o.thick || 0.06;
      // VL 15.41: green cover and spine, paper page block
      add(g, rbox(d, h, w, mat("green", { roughness: 0.6 }), 0.01, 0.008), 0, h / 2, 0); add(g, rbox(d * 0.7, h * 0.94, w * 0.96, mat("paper"), 0.006, 0.004), 0.004, h / 2, 0.012);
      if (o.flat) g.rotation.z = Math.PI / 2; return g; },
    // the highlight patch (VL 15.13): rgba(255,214,102,0.28) with a 3 px edge, 0.3 m corners, on the ground
    patch(k, o) { const g = new T.Group(), w = o.w || 4, d = o.d || 3;
      const fill = new T.Mesh(new T.ShapeGeometry(rrShape(w, d, 0.3)), new T.MeshBasicMaterial({ color: 0xffd666, transparent: true, opacity: 0.28, depthWrite: false, toneMapped: false })); fill.rotation.x = -Math.PI / 2; fill.position.y = 0.004; g.add(fill);
      const edge = new T.Mesh(new T.ShapeGeometry((() => { const sh = rrShape(w, d, 0.3), hole = rrShape(w - 0.05, d - 0.05, 0.28); sh.holes.push(hole); return sh; })()), new T.MeshBasicMaterial({ color: 0xf0b428, transparent: true, opacity: 0.55, depthWrite: false, toneMapped: false })); edge.rotation.x = -Math.PI / 2; edge.position.y = 0.005; g.add(edge);
      g.fadeIn = (t0, dur) => { k.track({ eval(t) { const u = tw(t, t0, t0 + (dur || 600), "io"); fill.material.opacity = 0.28 * u; edge.material.opacity = 0.55 * u; g.visible = u > 0; } }); return g; }; return g; },
    folder(k, o) { const g = new T.Group(); add(g, rbox(0.42, 0.06, 0.3, mat(o.colour || "paper"), 0.03, 0.015), 0, 0.03, 0); return g; },
    phone(k, o) { const g = new T.Group(); add(g, rbox(0.34, 0.66, 0.05, mat("ink", { roughness: 0.4 }), 0.06, 0.02), 0, 0.33, 0);
      const scr = add(g, new T.Mesh(new T.PlaneGeometry(0.29, 0.58), new T.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })), 0, 0.33, 0.027); g.userData.screen = scr; return g; },
    sign(k, o) { return sign(o.text || "", o.w || 1.6, o.h || 0.4); },
    // ONE MEETING (VL 15.64, ruling 81): the three-step block of 3B1, one set of proportions for every meeting in the film,
    // taken from shots/_c/lib.js meetingShape at 1.9 m base: top 0.62 x 0.14, middle 1.25 x 0.20, bottom 1.90 x 0.408
    // (24 pages), 0.035 between steps, depth 0.62 at the bottom and 0.508 above; sides #C9B89C, a white cap 0.016 on every
    // step. o.w = the base width (the size may change, the proportions never). Origin centre-bottom, front +z.
    // g.steps = [{mesh, m (its own side material), cap, y0, h, w, d}] from the top; g.H = height to the top of the top cap.
    meeting(k, o) { o = o || {}; const s = (o.w || 1.9) / 1.9, g = new T.Group(), tone = o.tone != null ? o.tone : MEET_TONE;
      const L = [{ w: 0.62, h: 0.14, d: 0.62 * 0.82 }, { w: 1.25, h: 0.2, d: 0.62 * 0.82 }, { w: 1.9, h: 0.408, d: 0.62 }];
      let y = 0; for (let i = 2; i >= 0; i--) { L[i].y0 = y; y += L[i].h + (i ? 0.035 : 0); }
      g.steps = L.map((l) => { const m = new T.MeshStandardMaterial({ color: tone, roughness: 0.82, metalness: 0 });
        const mesh = add(g, rbox(l.w * s, l.h * s, l.d * s, m, Math.min(0.03, 0.08 * l.h * s), Math.min(0.012, 0.03 * l.h * s)), 0, (l.y0 + l.h / 2) * s, 0);
        const cap = add(g, new T.Mesh(new T.BoxGeometry(l.w * s + 0.004, 0.016 * s, l.d * s + 0.004), capMat()), 0, (l.y0 + l.h + 0.007) * s, 0);
        cap.castShadow = cap.receiveShadow = true; return { mesh, m, cap, y0: l.y0 * s, h: l.h * s, w: l.w * s, d: l.d * s }; });
      g.H = (L[0].y0 + L[0].h + 0.016) * s; g.W = 1.9 * s; g.D = 0.62 * s; g.tone = tone; return g; },
    // THE STAND (VL 15.64): o.tiers 3, o.per 7 a tier, o.pitch 0.84 m, o.w 0.8 m base per meeting, o.depth 0.8 m a tier, rises one
    // meeting's height a tier; treads in the floor's tone (slab), risers and back board in the meeting's tone; the board ends
    // o.board 0.3 m above the top caps. Places are numbered 0..20: front tier left to right (0..6), then the middle, the top last.
    // Pitch: VL 15.64 asks 0.9 m; B2 east is 5.98 m wall to wall, so 7 x 0.9 does not fit; 0.84 leaves 0.07 m each side.
    // Default: every place filled. o.empty: true starts every place empty. Times are ms on the shot clock; all recorded, eval(t).
    stand(k, o) { o = o || {};
      const NT = o.tiers || 3, NP = o.per || 7, P = o.pitch || 0.84, MW = o.w || 0.8, TD = o.depth || 0.8, BOARD = o.board != null ? o.board : 0.3;
      const g = new T.Group(), proto = PARTS.meeting(k, { w: MW }), MH = proto.H, back = -DEPTH + 0.2 + (o.gap || 0.02);   // the inner face of the back wall
      const x0 = o.x != null ? o.x : 0.06, span = (NP - 1) * P + MW + 0.06;
      const tread = mat("slab"), riser = new T.MeshStandardMaterial({ color: o.riserTone != null ? o.riserTone : RISER_TONE, roughness: 0.85 });
      g.places = []; g.H = MH; g.pitch = P;
      for (let ti = 0; ti < NT; ti++) {
        const zf = back + (NT - ti) * TD, zc = zf - TD / 2, yt = ti * MH;   // tier ti: front edge zf, tread top yt (tier 0 sits on the floor)
        if (ti > 0) { add(g, rbox(span, MH, TD, riser, 0.02, 0.01), x0, yt - MH / 2, zc);   // the riser block under the tread
          add(g, rbox(span, 0.02, TD, tread, 0.008, 0.004), x0, yt - 0.01, zc); }               // the tread, floor tone, flush on top
        for (let i = 0; i < NP; i++) {
          const m = PARTS.meeting(k, { w: MW }); m.position.set(x0 + (i - (NP - 1) / 2) * P, yt, zc + (o.forward != null ? o.forward : 0.12)); g.add(m);
          g.places.push({ i: ti * NP + i, tier: ti, col: i, m, home: m.position.clone(), ev: [] });
        }
      }
      // the back board behind the top tier, ending BOARD above the top caps
      const topY = (NT - 1) * MH + MH + BOARD; add(g, rbox(span, topY, 0.06, riser, 0.02, 0.01), x0, topY / 2, back + 0.03);
      // v0.7 (ruling 83 item 3): the key comes in through the cut face and laid a sun patch on the front tier's middle, so one
      // meeting read as chosen. A shadow-only cover over the stand (never drawn) keeps the key off it; the room lamps light it evenly.
      if (o.shade) { const sh = new T.Mesh(new T.BoxGeometry(span + 0.4, 0.02, NT * TD + 0.3), new T.MeshBasicMaterial({ colorWrite: false, depthWrite: false }));
        sh.castShadow = true; sh.receiveShadow = false; sh.position.set(x0, o.shadeY != null ? o.shadeY : 2.2, back + (NT * TD) / 2 + 0.15); g.add(sh); g.shade = sh; }
      // v0.7 (ruling 83 item 3), the real cause: the lamps of the room below hang 0.01 m under this floor's slab and point
      // lights cast no shadow, so they lit the front tier's faces from 0.7 m. The stand's materials ignore any point light
      // below its own floor (a plane in view space, set each frame from the camera). Room lamps above it, key, sky: unchanged.
      { const U = { value: new T.Vector4(0, 1, 0, 0) }, nv = new T.Vector3(), pv = new T.Vector3(), cap = capMat().clone(), seen = new Set();
        const patch = (m) => { if (seen.has(m)) return; seen.add(m); m.onBeforeCompile = (sh) => { sh.uniforms.uFloorV = U;
            sh.fragmentShader = "uniform vec4 uFloorV;\n" + sh.fragmentShader.replace("#include <lights_fragment_begin>", THREE.ShaderChunk.lights_fragment_begin.replace(
              "getPointLightInfo( pointLight, geometryPosition, directLight );", "getPointLightInfo( pointLight, geometryPosition, directLight ); if ( dot( uFloorV.xyz, pointLight.position ) + uFloorV.w < 0.0 ) directLight.color = vec3( 0.0 );")); };
          m.customProgramCacheKey = () => "kit-stand-belowcut"; m.needsUpdate = true; };
        const upd = (r, sc, cam) => { const fy = g.getWorldPosition(pv).y - 0.05; nv.set(0, 1, 0).transformDirection(cam.matrixWorldInverse);
          const P = new T.Vector3(0, fy, 0).applyMatrix4(cam.matrixWorldInverse); U.value.set(nv.x, nv.y, nv.z, -nv.dot(P) + (window.__standCull === 0 ? 1e4 : window.__standCull === -1 ? -1e4 : 0)); };
        g.traverse((ob) => { if (!ob.isMesh || ob === g.shade) return;
          if (ob.material === capMat()) ob.material = cap; else if (ob.material === tread) ob.material = ob.material.clone();
          patch(ob.material); ob.onBeforeRender = upd; }); }
      // o.lift (default 0.3, measured even at 168 to 181 on the front tier at S): a flat lift on the stand's toned sides (emissive = tone x lift), for v2-visuals to set the level
      const LIFT = o.lift != null ? o.lift : 0.3; if (LIFT) g.traverse((ob) => { if (ob.isMesh && ob.material && ob.material.color && ob.material.color.getHex() === MEET_TONE) ob.material.emissive.setHex(MEET_TONE).multiplyScalar(LIFT); });
      const allEmpty = !!o.empty;
      const P_ = (i) => g.places[i]; const list = (i) => (i === "all" ? g.places : (Array.isArray(i) ? i : [i]).map(P_)).filter(Boolean);
      const push = (i, e) => list(i).forEach((p) => { p.ev.push(e); p.ev.sort((a, b) => a.t - b.t); });
      // fill(i, t0, {dur 600}): the meeting lowers into its place (the house install: 600 ms, 4% overshoot) and is there after
      g.fill = (i, t0, op) => { push(i, { t: t0, on: true, dur: (op && op.dur) || 600, from: (op && op.from) || 0.6 }); return g; };
      // take(i, t0): the place is empty from t0 (the shot brings its own meeting out from g.point(i)); the gap stays seen
      g.take = (i, t0) => { push(i, { t: t0, on: false }); return g; };
      g.empty = (i, t0) => g.take(i, t0 == null ? -1e9 : t0);
      // fillRun(t0, t1, {from 0, to 20}): fill places in order, evenly from t0 to t1 (3A1, 3A2: left to right, the top tier last)
      g.fillRun = (t0, t1, op) => { op = op || {}; const a = op.from || 0, b = op.to != null ? op.to : g.places.length - 1, n = b - a;
        for (let i = a; i <= b; i++) g.fill(i, n ? t0 + ((t1 - t0) * (i - a)) / n : t0, op); return g; };
      // where things are (world): the top centre of the top cap, the front centre of the bottom step, the place's centre
      const W_ = (p, v) => { g.updateWorldMatrix(true, true); return g.localToWorld(v); };
      g.point = (i) => { const p = P_(i); return W_(p, p.home.clone().add(new T.Vector3(0, MH, 0))); };
      g.front = (i) => { const p = P_(i); return W_(p, p.home.clone().add(new T.Vector3(0, MH * 0.25, p.m.D / 2))); };
      g.centre = (i) => { const p = P_(i); return W_(p, p.home.clone().add(new T.Vector3(0, MH * 0.5, 0))); };
      g.unit = (i) => P_(i).m;   // the meeting group: .steps[k].m is that step's own side material (for VL 15.54's yellow)
      g.lit = (i, t0, t1) => { const p = P_(i); (p.lits = p.lits || []).push({ t0, t1 }); return g; };   // VL 15.54 #FFD666 on its sides
      const LIT = new T.Color(0xffd666), BASE = new T.Color(MEET_TONE);
      g.eval = (t) => g.places.forEach((p) => {
        let on = !allEmpty, last = null; for (const e of p.ev) { if (e.t > t) break; on = e.on; last = e; }
        p.m.visible = on; if (!on) return;
        let dy = 0; if (last && last.on && t < last.t + last.dur + 300) { const u = tw(t, last.t, last.t + last.dur, "out") + 0.04 * Math.sin(Math.PI * FILM.clamp01((t - last.t - 420) / 260)); dy = (1 - u) * last.from; }
        p.m.position.y = p.home.y + dy;
        let L = 0; (p.lits || []).forEach((s) => { L = Math.max(L, tw(t, s.t0, s.t0 + 300, "out") * (s.t1 == null ? 1 : 1 - tw(t, s.t1, s.t1 + 250, "in"))); });
        p.m.steps.forEach((st) => st.m.color.copy(BASE).lerp(LIT, L));
      });
      k.track(g); return g; },
    block(k, o) { const g = new T.Group(); add(g, rbox(o.w || 1, o.h || 1, o.d || 1, mat(o.colour || "white")), 0, (o.h || 1) / 2, 0); return g; },
  };

  // ---------------------------------------------------------------- the building (W)
  // v2-visuals' model (proto/world.js, 07:16Z; VISUAL_LANGUAGE_v2 section 1): three floors of two rooms, every room touching
  // a side. x: -6.1..6.1 is the building; the block runs to +-8.7. Floors: G y 0, B1 -3.2, B2 -6.4, B3 -9.6. Depth z -6..0.
  // Rooms (1.3): B1 west board (beads), B1 east skills, B2 west gates (hooks), B2 east store (note taker),
  // B3 west judge (evals, the gate), B3 east teams. Each part is installed in view (1.4): it lowers in, 600 ms, 4% overshoot,
  // and its room's warm light comes on. A room not yet fitted stays bare and unlit.
  const HB = 6.1, BLK = 7.0, NF = 3, RX = 3.05;   // VL 14.15: the side slabs are 0.9 m beyond the rooms
  const ROOMS = { board: [1, -1], skills: [1, 1], gates: [2, -1], store: [2, 1], judge: [3, -1], teams: [3, 1] };
  const ORDER = ["board", "skills", "gates", "store", "judge", "teams"];
  function building(k, o) {
    o = o || {};
    const scene = k.scene, w = { rooms: {}, parts: {}, FH, DEPTH, HALF: HB, RX, NF, people: [] };
    const root = new T.Group(); scene.add(root); w.root = root;
    KIT.render.state.extent = 17; KIT.render.state.centre.set(0, -4, -2);
    const floor = new T.Mesh(new T.PlaneGeometry(400, 400), new T.ShadowMaterial({ opacity: 0.2, color: 0x4a3c28 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -NF * FH - 0.36; floor.receiveShadow = true; scene.add(floor);
    // the white ground around the model at surface level (for arrivals over the page); takes shadows only
    if (o.ground) { const gr = new T.Mesh(new T.PlaneGeometry(400, 400), new T.ShadowMaterial({ opacity: 0.16, color: 0x4a3c28 })); gr.rotation.x = -Math.PI / 2; gr.position.set(0, 0.001, -DEPTH - 2 - 200); gr.receiveShadow = true; scene.add(gr); w.ground = gr; }
    const earth = mat("earth", { roughness: 0.95 }), slab = o.slabColour != null ? mat("slab", { color: o.slabColour }) : mat("slab"), wall = mat("wall"), warm = mat("wallWarm");
    const TH = NF * FH + 0.3;
    [-1, 1].forEach((sd) => add(root, rbox(BLK - HB, TH, DEPTH + 2, earth, 0.18, 0.12), sd * (HB + (BLK - HB) / 2), -TH / 2, -(DEPTH + 2) / 2));
    add(root, rbox(2 * HB + 0.2, TH, 2, earth, 0.1, 0.05), 0, -TH / 2, -DEPTH - 1);
    add(root, rbox(2 * HB + 0.2, 0.34, DEPTH + 0.1, earth, 0.1, 0.05), 0, -NF * FH - 0.17, -DEPTH / 2);
    w.parts.slabG = add(root, rbox(2 * HB + 0.3, 0.3, DEPTH, slab, 0.1, 0.06), 0, -0.15, -DEPTH / 2);
    w.parts.floors = []; const lights = {};
    for (let f = 1; f <= NF; f++) {
      const g = new T.Group(); root.add(g); w.parts.floors.push(g);
      add(g, rbox(2 * HB, 0.26, DEPTH, slab, 0.1, 0.06), 0, -f * FH - (f < NF ? 0.13 : 0.11), -DEPTH / 2);   // v0.8 (VL recipe 133703 #5): the bottom floor has its slab too
      add(g, rbox(2 * HB, FH - 0.3, 0.2, warm, 0.05, 0.03), 0, -(f - 0.5) * FH - 0.15, -DEPTH + 0.1);
      add(g, rbox(0.24, FH - 0.3, DEPTH - 0.4, wall, 0.08, 0.05), 0, -(f - 0.5) * FH - 0.15, -DEPTH / 2 - 0.2);
    }
    // VL 3: every room has a cool-white base light at its ceiling centre (fitted or bare), and a warm glow on top when fitted
    // VL 3 / 15.17 and v2-visuals' bar (wall 235 to 240, floor 200 to 215): a lamp near the back wall under the ceiling, so
    // the wall carries the light and the open front of the floor does not clip; east rooms sit further from the key, x1.15.
    // Measured per room at K 40 with tools/light_measure.py on shots/kt-light (v2-kit, 10:1xZ).
    const BASE = o.baseLight != null ? o.baseLight : 5.2;
    // per room: [strength x BASE, lamp z, lamp drop under the ceiling], measured at K 40 so each wall is 235 to 240 and its
    // floor 200 to 215 (tools/light_measure.py on shots/kt-light). B3 gets the least sky, so its lamp sits further forward.
    // v2-visuals 115500: two lamps a room, 1.6 m either side of the room's middle, z -2.4, 0.25 m under the ceiling; one lamp
    // cannot light a wall evenly. Per room: [strength of each lamp, z, drop]; tuned at K 40 on shot frames (LIGHT READY 2).
    const LAMP = Object.assign({ board: [4.1, -2.9, 0.25], skills: [3.4, -2.9, 0.25], gates: [3.75, -2.9, 0.25], store: [3.45, -2.9, 0.25], judge: [3.8, -2.9, 0.25], teams: [3.8, -2.9, 0.25] }, o.lamps || {});   // v0.8: judge, teams 3.7 (no leak, the six rooms want about the same lamp)
    const LS = o.lampScale != null ? o.lampScale : 1.95;   // v0.8 (133703 #2), signed at 1.95 (v2-visuals 142413)   // calibrated at door height (mid wall), not under the ceiling
    for (const n in ROOMS) { const [f, sd] = ROOMS[n]; const Lp = LAMP[n];
      // the lamp nearer the central partition x0.85, the outer one x1.15: the partition end of every wall ran hot
      // v0.8, LIGHT READY 3 (v2-visuals 133703 #1): each room lamp is a spot in the same place, aimed 3 m below the ceiling at
      // z -5.6, so it washes the back wall and lights nothing above it (the point lights shone up through the slab into the room above)
      [-1.8, 1.8].forEach((dx) => { const inner = sd * dx < 0, x = sd * RX + dx, y = -(f - 1) * FH - (o.lightDrop != null ? o.lightDrop : Lp[2]);
        const b = new T.SpotLight(0xf3f6ff, Lp[0] * LS * (inner ? 0.85 : 1.15), o.lightReach || 5.5, 1.05, 0.6, 1.1); b.position.set(x, y, o.lightZ != null ? o.lightZ : Lp[1]);
        b.target.position.set(x, -(f - 1) * FH - 3, -5.6); root.add(b.target); root.add(b); });
      // v0.8 (133703 #4): a front fill a room, in the open front, for the low light on the bodies the leak used to give
      const FF = o.fill != null ? o.fill : f === NF ? FILL_BOTTOM : FILL; if (FF) { const ff = new T.PointLight(0xfff6ea, FF, 8, 1.1); ff.position.set(sd * RX, -f * FH + (o.fillY != null ? o.fillY : 1.2), 1.5); root.add(ff); }
      const p = new T.PointLight(0xffe9cc, 4.2, 4.5, 1.6); p.position.set(sd * RX, -(f - 1) * FH - 1.2, -2.2); root.add(p); lights[n] = p; }
    w.parts.cover = add(root, rbox(2 * HB + 0.24, NF * FH + 0.02, 0.5, earth, 0.1, 0.06), 0, -NF * FH / 2 - 0.31, 0.2);
    w.parts.cover.visible = !!o.closed;
    // the pavilion on the surface
    const pav = new T.Group(); root.add(pav); w.parts.pav = pav;
    // the pavilion's own lamp: one light for the people's floor in every shot (v2-visuals 085930 item 12)
    [-2.0, 2.0].forEach((dx) => { const pl = new T.PointLight(0xf6f3ee, o.pavLight != null ? o.pavLight : 4.9, o.lightReach || 5.5, 1.1); pl.position.set(dx, 2.45, o.pavLampZ != null ? o.pavLampZ : -3.3); pav.add(pl); });   // v0.8.1: nearer its back wall; these point lamps also reach B1 through the ground slab, so B1's lamps are set with them on   // two lamps, as the rooms
    const PW = 9, PD = 4.6, PH = 2.7, pz = -3.0; w.PW = PW;
    add(pav, rbox(PW + 0.7, 0.26, PD + 0.7, mat("white"), 0.12, 0.08), 0, PH + 0.13, pz);
    add(pav, rbox(PW, PH, 0.12, mat("wall"), 0.05, 0.03), 0, PH / 2, pz - PD / 2);
    const glass = new T.MeshStandardMaterial({ color: PAL.glass, transparent: true, opacity: 0.2, roughness: 0.95, depthWrite: false });   // v0.8.1 (134906 item 3, VL 15.65): matte, no mirror highlight
    [-PW / 2, PW / 2].forEach((x) => { const g = new T.Mesh(new T.BoxGeometry(0.05, PH, PD), glass); g.position.set(x, PH / 2, pz); pav.add(g); });
    [[-PW / 2, pz + PD / 2], [PW / 2, pz + PD / 2], [-PW / 2, pz - PD / 2], [PW / 2, pz - PD / 2]].forEach(([x, z]) => add(pav, rbox(0.14, PH, 0.14, mat("white"), 0.06, 0.03), x, PH / 2, z));   // VL 15.36: four corner posts only
    add(pav, rbox(1.3, 1.9, 0.1, warm, 0.06, 0.03), 0, 1.25, pz - PD / 2 + 0.09);
    [[-3.0, -3.2, 1.7], [2.9, -3.4, 2.4]].forEach(([x, z, wd]) => { const d = PARTS.desk(k, { w: wd }); d.position.set(x, 0, z); pav.add(d); });
    w.parts.laptops = [[-3.0, -3.2], [2.4, -3.4]].map(([x, z]) => { const g = PARTS.laptop(k, {}); g.position.set(x, 0, z); pav.add(g); return g; });
    // the people stand three-quarter to us (v2-visuals 085930 item 7), each turned a little toward its desk
    if (o.people !== false) [[-3.0, -2.1, 0.55], [-1.3, -2.6, -0.35], [2.1, -2.2, 0.45], [3.5, -2.3, -0.5], [2.9, -3.9, 0.3], [0.3, -3.4, 0.2]].forEach(([x, z, r]) => {
      w.people.push(KIT.actors.person(k, { at: [x, 0, z], face: r, parent: pav })); });
    w.parts.door = add(pav, rbox(0.1, 2.1, 1.0, mat("ink", { roughness: 0.5 }), 0.04, 0.03), -PW / 2 - 0.02, 1.05, pz + 0.9);
    const room = (name) => { const [f, sd] = ROOMS[name]; const g = new T.Group(); g.position.set(sd * RX, -f * FH, 0); w.parts.floors[f - 1].add(g); w.rooms[name] = g; return g; };
    const kit = {}; // what each room is fitted with (the parts that lower in)
    // B1 west: the job board (beads)
    { const R = room("board"); const b = PARTS.board(k, { cards: [4, 7], y: 0.42 }); b.position.set(0, 0, -DEPTH + 0.3); R.add(b); w.parts.board = b; w.cards = b.userData.cards; kit.board = [b]; }
    w.setCard = (i, t0) => w.parts.board.claim(i, t0 == null ? -1e9 : t0);
    // B1 east: the skills shelf and a desk
    { const R = room("skills"); const shelf = new T.Group(); add(R, shelf, 0.8, 0, -DEPTH + 0.55); w.parts.shelf = shelf;
      add(shelf, rbox(2.2, 2.5, 0.5, mat("white"), 0.08, 0.04), 0, 1.25, 0);
      for (let r = 0; r < 3; r++) { add(shelf, rbox(2.0, 0.62, 0.1, warm, 0.04, 0.02), 0, 0.55 + r * 0.74, 0.22); for (let bb = 0; bb < 12; bb++) { const hgt = 0.44 + 0.1 * FILM.halton(r * 12 + bb + 1, 2); add(shelf, rbox(0.06, hgt, 0.34, mat("green", { roughness: 0.6 }), 0.02, 0.01), -0.88 + bb * 0.16, 0.26 + r * 0.74 + hgt / 2, 0.3); } }   // VL 15.41: thin green books
      const d = PARTS.desk(k, { w: 1.6, d: 0.9 }); d.position.set(-1.4, 0, -3.0); R.add(d); w.parts.desk = d; kit.skills = [shelf, d]; }
    // B2 west: the gates (hooks): three doors behind one green rail
    { const R = room("gates"); w.parts.doors = [-1.5, 0, 1.5].map((x) => { const d = PARTS.door(k, { w: 0.95, h: 2.05, colour: "slab" }); d.position.set(x, 0, -DEPTH + 0.3); R.add(d); return d; });   // one step darker than the wall
      // v0.8.1 (ruling 82 row 2, v2-visuals 143600): one rail a door, each on its own two posts, 0.9 of the door's width.
      // w.parts.rails[i] is PARTS.rail (stop/go each its own red). w.parts.gate stays for old shots: setting its material sets all three bars.
      const rail = new T.Group(); R.add(rail); w.parts.rails = [-1.5, 0, 1.5].map((x) => { const r = PARTS.rail(k, { w: 0.9 * 0.95 }); r.position.set(x, 0, -3.9); rail.add(r); return r; });
      const bars = w.parts.rails.map((r) => r.children[0].children[0]);
      w.parts.gate = { parent: rail, get material() { return bars[0].material; }, set material(m) { bars.forEach((b) => (b.material = m)); }, bars };
      kit.gates = [...w.parts.doors, rail]; }
    // B2 east: the store of what was said. VL 15.64 (v2-visuals 125453): a raked stand of layered meetings, three tiers of
    // seven along the back wall, a back board behind the top tier; nothing else in the store. PARTS.stand, below.
    { const R = room("store"); const st = PARTS.stand(k, o.stand || {}); R.add(st); w.parts.store = st; w.stand = st; kit.store = [st]; }
    // B3 west: the judge's desk and the bar (evals, the gate)
    { const R = room("judge"); const d = PARTS.desk(k, { w: 2.2, d: 1.0 }); d.position.set(0, 0, -4.1); R.add(d); for (let j = 0; j < 5; j++) add(d, rbox(0.5, 0.035, 0.38, mat("card"), 0.02, 0.01), -0.5, 0.79 + j * 0.037, 0.05);
      w.parts.judge = d; w.parts.bar = add(R, rbox(2.9, 0.12, 0.12, mat("green", { roughness: 0.6 }), 0.05, 0.03), 0, 1.75, -5.55); kit.judge = [d, w.parts.bar]; }
    // B3 east: a team table
    { const R = room("teams"); const tbl = new T.Group(); R.add(tbl); const tb = new T.Mesh(new T.CylinderGeometry(1.0, 1.0, 0.1, 48), mat("white")); tb.castShadow = tb.receiveShadow = true; add(tbl, tb, 0, 0.7, -4.0);
      const tl = new T.Mesh(new T.CylinderGeometry(0.16, 0.3, 0.68, 24), mat("white")); tl.castShadow = true; add(tbl, tl, 0, 0.34, -4.0); w.parts.teams = tbl; kit.teams = [tbl]; }
    // fitted state: o.stage = how many rooms are fitted at t = 0 (in ORDER), or o.fitted = [names]; install(name, t0) in view
    const inst = {}; const st0 = o.fitted ? null : o.stage == null ? 6 : o.stage;
    ORDER.forEach((n, i) => (inst[n] = (o.fitted ? o.fitted.includes(n) : i < st0) ? -1e9 : null));
    for (const n in kit) kit[n].forEach((p) => (p.userData.y0 = p.position.y));
    w.install = (name, t0) => { inst[name] = t0; return w; };
    // the section: the front face drops away (closed: true at t = 0)
    let openAt = null, openDur = 2100; w.open = (t0, dur) => { openAt = t0; openDur = dur || 2100; w.parts.cover.visible = true; return w; };
    // a bare room's faint light (before it is fitted)
    const glows = []; w.glow = (name, t0, dur, level) => { glows.push({ name, t0, dur: dur || 800, level: level == null ? 0.35 : level }); return w; };
    // the ground line: a thin dark rounded rod along the surface, drawn from the centre outwards
    const gl = new T.Mesh(new T.CylinderGeometry(0.035, 0.035, 2 * BLK, 16), mat("ink", { roughness: 0.5 })); gl.rotation.z = Math.PI / 2; gl.position.set(0, 0.02, 0.05); gl.visible = false; root.add(gl);
    let glAt = null, glDur = 900; w.groundLine = (t0, dur) => { glAt = t0; glDur = dur || 900; return w; };
    // the ground slab turns to glass; the floor below shows through
    let glassAt = null, glassDur = 1200; const slabM0 = w.parts.slabG.material, slabG2 = slabM0.clone(); slabG2.transparent = true;
    w.glass = (t0, dur) => { glassAt = t0; glassDur = dur || 1200; return w; };
    w.fittedAt = (name) => inst[name];
    w.eval = (t) => { for (const n in kit) { const t0 = inst[n], on = t0 != null && t >= t0; const u = on ? tw(t, t0, t0 + 600, "out") : 0;
        const over = on ? 0.04 * Math.sin(Math.PI * clamp01((t - t0 - 420) / 260)) : 0;
        kit[n].forEach((p) => { p.visible = on; p.position.y = p.userData.y0 + (1 - u) * 2.6 - over * 0.6; });
        const GL = o.glow != null ? o.glow : 1.6; let L = on ? GL * tw(t, t0, t0 + 600, "io") : 0;   // the warm glow: about 8% brighter (VL 3)
        for (const g of glows) if (g.name === n && t >= g.t0) L = Math.max(L, GL * g.level * tw(t, g.t0, g.t0 + g.dur, "io"));
        lights[n].intensity = L; }
      if (openAt != null) { const u = tw(t, openAt, openAt + openDur, "io"); w.parts.cover.position.y = -NF * FH / 2 - 0.31 - u * (NF * FH + 1.5); w.parts.cover.visible = u < 0.999; }
      if (glAt != null) { const u = tw(t, glAt, glAt + glDur, "out"); gl.visible = u > 0.001; gl.scale.set(1, Math.max(0.001, u), 1); }
      if (glassAt != null) { const u = tw(t, glassAt, glassAt + glassDur, "io"); if (u > 0) { w.parts.slabG.material = slabG2; slabG2.opacity = 1 - 0.7 * u; slabG2.color.set(PAL.slab).lerp(new T.Color(PAL.glass), u); slabG2.depthWrite = u < 0.5; } else w.parts.slabG.material = slabM0; }
    };
    k.track(w);
    // where things are: a room's centre on its floor, its side wall (for docked labels), a floor or room as an area
    w.room = (n) => { const [f, sd] = ROOMS[n]; return new T.Vector3(sd * RX, -f * FH, -3.0); };
    w.side = (n) => { const [f, sd] = ROOMS[n]; return new T.Vector3(sd * HB, -(f - 0.5) * FH, -0.3); };
    w.area = (n) => { if (n === "surface") return { x0: -5.6, x1: 5.6, z0: -0.5, z1: 2.5, y: 0 }; const [f, sd] = ROOMS[n]; return { x0: sd < 0 ? -5.7 : 0.45, x1: sd < 0 ? -0.45 : 5.7, z0: -5.3, z1: -0.6, y: -f * FH }; };
    w.keepClear = (n) => { const [f, sd] = ROOMS[n], R = w.rooms[n]; const b = new T.Box3(); kit[n].forEach((p) => b.expandByObject(p)); return { x0: b.min.x - 0.45, x1: b.max.x + 0.45, z0: b.min.z - 0.45, z1: b.max.z + 0.45, y: -f * FH }; };   // VL 15.6
    w.floor = (n) => { if (n === "surface") return w.area("surface"); const f = +String(n).replace(/\D/g, ""); return { x0: -5.7, x1: 5.7, z0: -5.3, z1: -0.6, y: -f * FH }; };
    w.part = (n) => w.parts[n];
    w.ROOMS = ROOMS; w.ORDER = ORDER; w.pageY = -NF * FH - 0.36;
    w.page = (x0, x1, z0, z1) => ({ x0, x1, z0, z1, y: w.pageY });
    return w;
  }

  // ---------------------------------------------------------------- the table-top stage (S)
  function table(k, o) {
    o = o || {}; const g = new T.Group(); k.scene.add(g);
    const w = o.w || 6, d = o.d || 4, at = o.at || [0, 0, 0]; g.position.set(at[0], at[1], at[2]);
    if (!table.n) { KIT.render.state.extent = Math.max(w, d) * 0.9 + 1; KIT.render.state.centre.set(at[0], at[1] + 0.5, at[2] - 0.5);
      // the paper ground takes shadows only (one for all tables)
      const floor = new T.Mesh(new T.PlaneGeometry(400, 400), new T.ShadowMaterial({ opacity: 0.18, color: 0x4a3c28 })); floor.rotation.x = -Math.PI / 2; floor.position.y = at[1] - 0.2; floor.receiveShadow = true; k.scene.add(floor); }
    table.n = (table.n || 0) + 1;
    let slab = null; if (o.slab !== false) slab = add(g, rbox(w, 0.2, d, mat("table", { roughness: 0.9 }).clone(), 0.12, 0.08), 0, -0.1, -d / 2 + 1.0);
    const S = { root: g, w, d, slab };
    // the camera goes down through the table top: the slab fades out over dur
    S.cutaway = (t0, dur) => { if (!slab) return S; slab.material.transparent = true; k.track({ eval(t) { const u = tw(t, t0, t0 + (dur || 600), "io"); slab.material.opacity = 1 - u; slab.visible = u < 0.999; slab.material.depthWrite = u < 0.3; } }); return S; };
    S.point = (x, y, z) => g.localToWorld(new T.Vector3(x, y, z));
    S.add = (name, oo) => { oo = oo || {}; const p = PARTS[name](k, oo); const a = oo.at || [0, 0, 0]; p.position.set(a[0], a[1], a[2]); if (oo.face) p.rotation.y = oo.face; if (oo.scale) p.scale.setScalar(oo.scale); g.add(p); g.updateMatrixWorld(true); return p; };
    return S;
  }
  function make(k) { return { building: (o) => building(k, o), table: (o) => table(k, o), part: (name, o) => { if (!PARTS[name]) throw new Error("no part " + name + " (have: " + Object.keys(PARTS).join(", ") + ")"); return PARTS[name](k, o || {}); }, parts: PARTS, sign: (t, w, h) => sign(t, w, h), signTex }; }
  KIT.set = { make, PARTS, FH, DEPTH, HALF, signTex, sign };
})();
