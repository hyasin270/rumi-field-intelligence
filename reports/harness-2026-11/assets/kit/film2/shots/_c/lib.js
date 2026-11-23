// shots/_c/lib.js · v2-shots-c shared helpers for stages 2 and 3 (2.0 to 3C2). Blocking: outputs/lanes/v2-shots-c/BLOCKING.md
// Reuses v2-shots-b's S1 helpers (the building as fitted, the 300, the layered shape) so stages 1 to 3 are one world.
// S1 comes from shots/_b/lib.js when it exists, else it is read out of a built stage-1 shot (shots/1.0/shot.js).
// Loaded by each shot.js with a synchronous read. Everything here is a pure function of t.
(function () {
  "use strict";
  function get(url) { try { const x = new XMLHttpRequest(); x.open("GET", url, false); x.send(); return (x.status === 0 || x.status === 200) && x.responseText ? x.responseText : null; } catch (e) { return null; } }
  // row texts for stages 2 and 3 (tools/rows.py); S1.at reads the global ROWS
  if (!window.ROWS_C) (0, eval)(get("../shots/_c/rows.js") || "window.ROWS_C={}");
  window.ROWS = Object.assign(window.ROWS || {}, window.ROWS_C);
  if (!window.S1) {
    let src = null;
    { const s = get("../shots/1.0/shot.js") || ""; const i = s.indexOf("var S1 = (function"), j = s.indexOf("\n})();", i); src = i >= 0 && j > i ? s.slice(i, j + 6) : null; }
    if (!src) throw new Error("v2-shots-c: S1 helpers not found (shots/_b/lib.js or shots/1.0/shot.js)");
    (0, eval)(src.replace(/^var S1 =/m, "window.S1 ="));
  }
  const S1 = window.S1, T = THREE, P = KIT.parts, tw = FILM.tw, lerp = FILM.lerp, clamp01 = FILM.clamp01, noise = FILM.noise;
  const C = (window.SC = {});
  // VL 15.76: the kit's locator snippet (the map on close frames, the ring at W), loaded once
  if (!window.locator) (0, eval)((get("snippets/locator.js") || "") + ";window.locator=locator;window.roomRing=roomRing;");
  const V3 = (p) => (Array.isArray(p) ? new T.Vector3(p[0], p[1], p[2]) : p.clone());
  C.V3 = V3; C.S1 = S1;
  const FH = 3.2;
  // the pavilion, and the slot columns (VL 07:29Z ruling item 3: one column each side, 1.0 m from the partition, at the front)
  C.PAV = (x, y, z) => new T.Vector3(x, y, z);
  C.SLOT_X = { west: -1.0, east: 1.0 }; C.SLOT_Z = -0.9;
  C.floorY = (f) => -f * FH;          // 0 = ground (pavilion floor), 1 = B1, 2 = B2

  // word time with a fallback estimated from the row text (S1.at), leading the word by `lead` ms (VL 6.6)
  C.at = (k, row, word, lead) => S1.at(k, row, word, lead == null ? 200 : lead);
  C.end = (k, row) => { const r = k.row(row); return r ? r.end : k.dur; };

  // the building as the story has it. stage 2: board, skills, gates fitted. stage 3: + store (installed at storeAt, or before).
  C.world = (k, stage, o) => {
    o = o || {};
    const fitted = { board: -1e9, skills: -1e9, gates: -1e9 };
    if (stage >= 3 && o.storeAt != null) fitted.store = o.storeAt;
    if (stage >= 4) fitted.store = -1e9;
    let W;
    if (o.standEmpty) {   // kit v0.7: the stand starts with every place empty (3A2 fills it); S1.world has no stand option
      const names = Object.keys(fitted);
      W = k.set.building({ fitted: names.filter((n) => fitted[n] < 0), stand: { empty: true } });
      names.forEach((n) => { if (fitted[n] >= 0) W.install(n, fitted[n]); });
    } else W = S1.world(k, fitted);
    if (S1.doorsAlways) S1.doorsAlways(k, W);
    W.fittedMap = fitted;
    // the job board as 1C5 leaves it (joins at 2.0, ruling 71): every card claimed but five, card 20 claimed by "agent 58"
    const board = W.parts.board;
    if (board && board.claim && !o.noBoard) { for (let i = 0; i < 28; i++) if (![3, 9, 20, 26, 27].includes(i)) board.claim(i, -1e9); board.claim(20, -1e9, { tag: "agent 58" }); }
    return W;
  };
  C.crowd = (k, W, o) => S1.crowd(k, W, Object.assign({ fitted: W.fittedMap }, o || {}));

  // ---------------------------------------------------------------- props
  // a wordless speech bubble: a flattened rounded body with a small tail. list of { t0, dur, path:[V3...], kind }
  // kind "rise": drifts up and leaves frame, shrinking out at the end. "fall": drops down a path (through the slots) and
  // turns into a page on landing (it flattens to a slab).
  C.bubbles = (k, list) => {
    const g = new T.Group(); k.scene.add(g);
    list.forEach((b, i) => {
      const m = new T.Group(); g.add(m);
      // b.tone: the meeting's warm tone (v2-visuals 120020 item 8: the marks become the stored meetings); b.tail: -1 or 1, the
      // side of the speaker, so the tail points at who said it
      const mb = b.tone ? new T.MeshStandardMaterial({ color: b.tone, roughness: 0.75 }) : P.mat("white");
      const mt = b.tone ? new T.MeshStandardMaterial({ color: b.toneDark || b.tone, roughness: 0.75 }) : P.mat("white");
      const body = P.add(m, P.rbox(0.62, 0.4, 0.12, mb, 0.18, 0.05), 0, 0, 0);
      const tail = P.add(m, P.rbox(0.14, 0.14, 0.1, mt, 0.04, 0.02), 0.18 * (b.tail || -1), -0.2, 0); tail.rotation.z = 0.7 * -(b.tail || -1);
      const pts = b.path.map(V3), curve = pts.length > 2 ? new T.CatmullRomCurve3(pts, false, "centripetal") : new T.LineCurve3(pts[0], pts[1]);
      k.each((t) => {
        const on = t >= b.t0 && t <= b.t0 + b.dur + (b.kind === "fall" && !b.vanish ? 1e9 : 0) && !(b.hide && t > b.hide[0] && t < b.hide[1]);   // b.hide: unseen while the camera travels past it
        m.visible = on; if (!on) return;
        const u = tw(t, b.t0, b.t0 + b.dur, b.kind === "fall" ? "in" : "sine");
        m.position.copy(curve.getPoint(u));
        const grow = tw(t, b.t0, b.t0 + 300, "back") * (b.size || 1);   // b.size: a smaller mark (3A2)
        if (b.kind === "rise") { const s = grow * (1 - tw(t, b.t0 + b.dur * 0.7, b.t0 + b.dur, "in")); m.scale.setScalar(Math.max(0.001, s)); m.rotation.z = 0.15 * Math.sin(t / 400 + i); }
        else { const land = tw(t, b.t0 + b.dur, b.t0 + b.dur + 250, "out"); m.scale.set(grow * lerp(1, 1.5, land), grow * lerp(1, 0.45, land), grow * lerp(1, 5.5, land)); tail.visible = land < 0.5; m.rotation.z = 0; if (b.land) m.position.copy(V3(b.land)); }
      });
    });
    return g;
  };
  // a page prop (white card) that follows timed waypoints: keys [{t, p:V3}] (linear in space, eased in time)
  C.card = (k, keys, o) => {
    o = o || {};
    const m = P.add(k.scene, P.rbox(o.w || 0.5, o.h || 0.05, o.d || 0.36, P.mat(o.mat || "card"), 0.03, 0.015), 0, 0, 0);
    let glow = null;
    if (o.glow) { m.material = new T.MeshStandardMaterial({ color: P.PAL.card || 0xffffff, roughness: 0.7, emissive: 0xffd27a, emissiveIntensity: 0.8 }); glow = m.material; }
    const K = keys.map((q) => ({ t: q.t, p: V3(q.p), e: q.e || "io" }));
    k.each((t) => {
      if (t < K[0].t || (o.t1 != null && t > o.t1)) { m.visible = false; return; }
      m.visible = true;
      let i = 0; while (i < K.length - 1 && t > K[i + 1].t) i++;
      if (i >= K.length - 1) { m.position.copy(K[K.length - 1].p); return; }
      const a = K[i], b = K[i + 1], u = tw(t, a.t, b.t, b.e);
      m.position.lerpVectors(a.p, b.p, u);
      if (glow) glow.emissiveIntensity = 0.6 + 0.3 * Math.sin(t / 180);
    });
    return m;
  };
  // the Rumi mark drawn on a canvas (coral disc, two eyes, a smile): for the pavilion laptops (2D) and the store tile
  let markTex = null;
  C.markTex = () => {
    if (markTex) return markTex;
    const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d");
    g.fillStyle = "#FBF8F2"; g.fillRect(0, 0, 256, 256);
    g.fillStyle = "#F06E42"; g.beginPath(); g.arc(128, 128, 92, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#FBF8F2"; g.beginPath(); g.arc(96, 112, 13, 0, 7); g.arc(160, 112, 13, 0, 7); g.fill();
    g.strokeStyle = "#FBF8F2"; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.arc(128, 132, 44, 0.2 * Math.PI, 0.8 * Math.PI); g.stroke();
    markTex = new T.CanvasTexture(c); markTex.colorSpace = T.SRGBColorSpace || markTex.colorSpace; return markTex;
  };
  // put a glowing screen face on a laptop from t0 (white, or the mark)
  C.laptopFace = (k, lap, t0, o) => {
    o = o || {};
    const s = lap.userData.screen; if (!s) return null;
    const mat = new T.MeshBasicMaterial({ map: o.mark ? C.markTex() : null, color: 0xffffff, toneMapped: false, transparent: true, opacity: 0, side: T.DoubleSide });
    const face = new T.Mesh(new T.PlaneGeometry(0.38, 0.25), mat); face.position.set(0, 0, 0.012); s.add(face);
    const back = face.clone(); back.position.set(0, 0, -0.012); back.rotation.y = Math.PI; s.add(back);
    k.each((t) => { mat.opacity = tw(t, t0, t0 + 250, "out"); face.visible = back.visible = t >= t0; });
    return face;
  };
  // the meeting table in the pavilion (3.0 on): a round white table that lowers in at t0 (or is there from the start)
  C.meetingTable = (k, W, t0, at, o) => {
    const g = new T.Group(); (W.parts.pav || k.scene).add(g); const p = V3(at || [0.3, 0, -2.9]); g.position.copy(p);
    P.add(g, new T.Mesh(new T.CylinderGeometry(0.95, 0.95, 0.08, 40), P.mat("white")), 0, 0.72, 0).castShadow = true;
    P.add(g, P.rbox(0.16, 0.7, 0.16, P.mat("white"), 0.06, 0.03), 0, 0.35, 0);
    const lap = k.set.part("laptop", {}); lap.position.set(0.15, 0, 0.35); lap.rotation.y = Math.PI; g.add(lap); g.laptop = lap;
    const page = P.add(g, P.rbox(0.42, 0.02, 0.3, P.mat("card"), 0.02, 0.01), -0.35, 0.77, -0.1); g.page = page;
    const step = P.add(g, P.rbox(0.3, 0.03, 0.08, P.mat("green", { roughness: 0.6 }), 0.015, 0.008), -0.35, 0.8, -0.18); step.visible = false; g.step = step;
    g.addStep = (ta) => { g.userData.step = ta; return g; };
    k.each((t) => { const u = t0 == null || t0 < 0 ? 1 : tw(t, t0, t0 + 600, "back"); g.visible = u > 0.001 && !(o && o.from != null && t < o.from); g.position.y = p.y + (1 - u) * 2.2;
      const ts = g.userData.step; step.visible = ts != null && t >= ts; if (step.visible) step.position.y = 0.8 + 0.5 * (1 - tw(t, ts, ts + 450, "out")); });
    return g;
  };
  // a screen's mount helper: returns a k.screen with events given relative to the mount
  C.has = (id) => { try { const x = new XMLHttpRequest(); x.open("GET", "../screens/" + id + "/screen.js", false); x.send(); return (x.status === 0 || x.status === 200) && !!x.responseText; } catch (e) { return false; } };
  // the docked label for a panel (VL 9.6), as kp-2B2 does it
  // VL 15.33: the name stands beside the panel at panel size only (fades as the grow starts), never at Full
  C.panelLabel = (k, id, t0, t1, name, gloss) => k.ui.text(id, t0, t1, `<div class="pin">${name}<small>${gloss}</small></div>`, { x: 96, y: 210 });
  // the pavilion as staged for stage 2 (v2-visuals' 2.0 block, 092100 item 1): the person at the west desk's east end,
  // the laptop whole beside them; the other people at the back wall, out of the queue's line and the panel's area
  // The pavilion's people. Frame 0 of 2.0 is 1C5's last frame: all six at the kit's own places (ruling 71). During 2.0's
  // wide opening they step to their stage-2 places; every later stage-2 shot (and 3.0) starts from those places.
  // Nobody behind the file, nobody cut by a frame edge at the room lens (v2-visuals 094318): one colleague behind the west
  // desk, one at the east desk, the other three step out to the pavilion's ends, beyond the room lens.
  // 3 stands in the back east corner, clear of 2 and of the desk colleague at W (v2-shots-f 181415, pre-read 2005)
  C.PAV_HOME = { 0: [-2.05, -2.75, Math.PI], 1: [-4.2, -1.7, 0.6], 2: [3.7, -1.4, -0.6], 3: [4.2, -4.4, -0.6], 4: [2.9, -3.9, 0.3], 5: [-3.3, -4.05, 0.2] };
  C.PAV_VIA = { 1: [[-1.3, -1.5]], 2: [], 3: [], 4: [], 5: [], 0: [] };
  C.pav2 = (k, W, o) => {
    o = o || {};
    const per = W.people[0];
    if (o.walkFrom != null) {   // 2.0 only: from the kit's places to the homes
      [0, 5, 1, 2, 3].forEach((i, j) => { const h = C.PAV_HOME[i], t0 = o.walkFrom + 160 * j;
        W.people[i].walk(t0, 1100, C.PAV_VIA[i].concat([[h[0], h[1]]])); W.people[i].turn(t0 + 1150, 300, h[2]); });
    } else {
      [0, 1, 2, 3, 4, 5].forEach((i) => { const h = C.PAV_HOME[i]; W.people[i].at(-1e9, [h[0], 0, h[1]], h[2]); });
    }
    if (o.faceLaptop) per.turn(-1e9, 1, [-3.0, 0.9, -3.2]);
    return per;
  };
  // VL 10 rule 8 (v2-check 115914): a docked label stays for the rest of the film. At W-list only the two west labels
  // show (VL 14.1); an east label docks on the pull back and goes to 0% while the list is up (as 1C5 does "skills", VL 15.19)
  C.docksWest = (k, t0, t1, stagger) => {   // stagger: ms between the two, so they arrive one at a time after a cut
    k.ui.dock(t0, { text: "beads", at: V3([-6.1, -1.6, -0.3]), side: "west", x: 290, t1 });
    k.ui.dock(t0 + (stagger || 0), { text: "hooks", at: V3([-6.1, -4.8, -0.3]), side: "west", x: 290, t1 });
  };
  // the meeting as 3.0 leaves it (3A1, 3A2 open on it): four people seated round the table, the person and the east desk
  // colleague at their stage-2 places (v2-check 115914: 3A1 had people at the kit's places, one cut by the right edge)
  // a standing meeting round the table (pre-read 1720: the rig's sit pose drops a body 86 to 108 px in one frame, so nobody
  // sits); each place 1.25 m from the table's centre, facing it; the person who spoke to the file stands back at the left
  C.MEET_SEATS = [[1, -1.3, -3.35, 1.3], [3, 1.3, -3.35, -1.3], [5, -0.7, -3.85, 0.6], [2, 0.7, -3.85, -0.6]];   // the ends set back, so the right end's feet are behind 3A1's call panel (v2-check b137)
  C.MEET_PER = [-1.85, -4.85, 0.4];   // behind the table's west end, clear of the back-left mover's path (v2-visuals 173730 item 2)
  C.seated = (k, W) => {
    C.pav2(k, W, { faceLaptop: true });
    C.MEET_SEATS.forEach(([pi, x, z, r]) => { const p = W.people[pi]; p.at(-1e9, [x, 0, z], r); });
    const q = C.MEET_PER; W.people[0].at(-1e9, [q[0], 0, q[1]], q[2]);
  };
  // stools for the meeting (v2-visuals 120020 item 7, VL 15.55): 0.45 m, white cap, toned side; dropped in with the table
  C.STOOL_H = 0.3; C.STOOL_R = 0.16; C.STOOL_BACK = 0.08;
  C.stools = (k, W, t0) => {
    const g = new T.Group(); (W.parts.pav || k.scene).add(g);
    // sized to the rig's sit pose (hips about 0.3 m up): the cap under the hips, set back from them so the thighs come
    // out over its edge (v2-visuals 122141 item 1)
    const H = C.STOOL_H, R = C.STOOL_R, BACK = C.STOOL_BACK;
    C.MEET_SEATS.forEach(([pi, x, z]) => {
      const dx = x - 0, dz = z + 2.7, dl = Math.hypot(dx, dz) || 1, sx = x + (dx / dl) * BACK, sz = z + (dz / dl) * BACK;
      P.add(g, new T.Mesh(new T.CylinderGeometry(R, R, H - 0.02, 28), new T.MeshStandardMaterial({ color: C.MEET_TONE, roughness: 0.75 })), sx, (H - 0.02) / 2, sz).castShadow = true;
      P.add(g, new T.Mesh(new T.CylinderGeometry(R + 0.005, R + 0.005, 0.025, 28), P.mat("white")), sx, H - 0.0125, sz);
    });
    k.each((t) => { const u = t0 == null || t0 < 0 ? 1 : tw(t, t0, t0 + 600, "back"); g.visible = u > 0.001; g.position.y = (1 - u) * 2.2; });
    return g;
  };
  // ruling 66: a question shot opens on the list whole, as the shot before left it; only the active line and ticks move.
  // activeFrom: the line that is dark at frame 0 (as left), activeTo: the line that fills at tAct.
  C.listWhole = (k, o) => {
    let T = 0; FILM._post.push((t) => { T = t; });
    const all = { 1: -5000, 2: -5000, 3: -5000, 4: -5000, 5: -5000 };
    const opt = { ticked: o.ticked || [], tickAt: o.tickAt, writeAt: all, t1: o.t1 };
    Object.defineProperty(opt, "active", { get: () => (T >= o.tAct ? o.activeTo : o.activeFrom) });
    const box = k.ui.questions(-5000, opt);
    k.cue(o.tAct, "question", { q: o.activeTo });
    // the change of line takes 330 ms, io (pre-reads 3.0 2300 and 2320: the disc, the bold and the grey each changed in
    // one frame): the new line's disc fills and its weight rises 500 to 600; the old line's weight falls and it greys
    FILM._post.push((t) => { if (!box) return; const u = FILM.tw(t, o.tAct, o.tAct + 330, "io"), mid = u > 0 && u < 1;
      const rt = box.querySelector('.q[data-n="' + o.activeTo + '"]'), rf = o.activeFrom ? box.querySelector('.q[data-n="' + o.activeFrom + '"]') : null;
      const n = rt && rt.querySelector(".n"), mix = (a, b) => Math.round(a + (b - a) * u);
      if (n) { n.style.background = mid ? "rgba(17,20,24," + u.toFixed(3) + ")" : ""; const c = mix(17, 255); n.style.color = mid ? "rgb(" + c + "," + c + "," + c + ")" : ""; }
      if (rt) rt.style.fontWeight = mid ? String(mix(500, 600)) : "";
      if (rf) { rf.style.fontWeight = mid ? String(mix(600, 500)) : ""; rf.style.color = mid ? "rgb(" + mix(17, 74) + "," + mix(20, 80) + "," + mix(24, 89) + ")" : ""; } });
  };
  C.camPav = (k) => k.cam.on(C.V3([-0.6, 0.9, -2.9]), { size: "room", px: 228, yaw: -14, focus: C.V3([-1.3, 0.5, -2.6]) });   // px 240 (was 270): the 2.0 file at 0.8 m pitch fits whole (v2-visuals 094318)
  // 2.0's file (v2-visuals 094318): 0.8 m between every pair, the last in front of the right desk; 2A opens on it
  C.FILE20 = [[-1.5, -2.85], [-0.7, -2.85], [0.1, -2.85], [0.9, -2.85], [1.7, -2.8]];   // 0.4 m deeper (110906 item 2); back 0.3 m west so the fifth clears the desk colleague (120020 item 11)
  // One meeting, stored in layers (3B1, 3B2): the kit's layers part as three clear steps, a small top, a middle and a wide
  // bottom of pages (COS 102926 item 3, the operator's note at 8:42). Sides in a warm mid tone, white caps on every top
  // (VL 15.28), so each step reads against a lit room. capAt: when the caps appear (after the shape has settled).
  C.MEET_TONE = 0xC9B89C;   // deeper than #DCCFB8: the page stack stands off the lit cream floor (prop_edge, VL 15.53)
  C.meetingShape = (k, at, o) => {
    o = o || {};
    const M = C.S1.part(k, "layers", at, { levels: [{ count: 1, mode: "slab", h: 0.14, w: 0.62 }, { count: 1, mode: "slab", h: 0.2, w: 1.25 }, { count: 24, w: 1.9 }], tone: C.MEET_TONE });
    const body = M.children[0], caps = []; M.caps = caps;
    M.levels.forEach((lv, li) => { const d = li === 2 ? 0.62 : 0.62 * 0.82;
      const c = new T.Mesh(new T.BoxGeometry(lv.w + 0.004, 0.016, d + 0.004), new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }));   // flush, no ledge line (120020 item 2)
      c.position.set(0, lv.y0 + lv.h + 0.007, 0); body.add(c); caps.push(c); });
    const capAt = o.capAt != null ? o.capAt : -1e9;
    k.each((t) => caps.forEach((c) => { c.visible = t >= capAt; }));
    if (li0Check(M)) M.levels[0].blocks[0].m.color.set(C.MEET_TONE);
    return M;
  };
  function li0Check(M) { return M.levels && M.levels[0] && M.levels[0].blocks && M.levels[0].blocks[0] && M.levels[0].blocks[0].m; }
  // 3A2's landed view (on the picked meeting, place 6, and the keeper west of it); 3B1 opens on it so the cut holds
  C.view3A2 = (k, W) => { const fp = W.stand.front(6), ag = C.S1.R("store", -0.4, 0, -2.3);
    return k.cam.on(C.V3([fp.x - 1.6, ag.y + 1.0, -3.0]), { size: "room", px: 270, yaw: -14, focus: C.V3([fp.x - 0.5, ag.y + 0.6, fp.z + 0.6]) }); };
  // the kit's meeting (VL 15.64, one prop per noun): placed in the scene at a world point, w = base width
  C.meeting = (k, at, o) => { o = o || {}; const M = KIT.set.PARTS.meeting(k, { w: o.w || 1.9 }); M.position.copy(V3(at)); k.scene.add(M); return M; };
  // the top front edge of step li (0 top, 2 bottom), world: where a label's dot sits
  C.stepPoint = (M, li) => { const st = M.steps[li]; M.updateMatrixWorld(true); return M.localToWorld(new T.Vector3(0, st.y0 + st.h, st.d / 2)); };
  // VL 15.54: a part lit as it is named takes solid #FFD666 on its sides (caps stay white), one at a time, 300 ms in and
  // 250 ms out. spans: [{li, i (or "all"), t0, t1}] on a layers part; replaces the kit's peach g.light for my shots.
  const LIT = new T.Color(0xffd666), LIT_SIDE = new T.Color(0xe8bc48);   // VL 15.81: #FFD666 on faces that look up, #E8BC48 on the sides
  C.litSolid = (k, shape, spans) => {
    // one per-frame pass per shape: a kit meeting (steps) does not reset its own colours, so every frame starts from the
    // side tone it was built with, then the spans that are on blend in. A layers part is reset by the kit's own track.
    if (!shape._litSpans) {
      shape._litSpans = [];
      let base = null, baseEm = null, held = false;   // the colours as the kit has them when a light begins (pre-read 3A2 2355: a base caught at setup blinked place 6 darker at f161)
      // the prop bar on a cream floor (v2-check 3B2 MAJOR, finding 212902): the light lands on the white cap as the one
      // yellow, and the sides take that yellow in shade, so the outline stays dark against the floor
      const capOf = (li) => (shape.steps ? shape.steps[li] && shape.steps[li].cap : shape.caps && shape.levels[li] && shape.levels[li].blocks.length === 1 ? shape.caps[li] : null);
      const capBase = new Map();
      (shape.steps ? shape.steps.map((st, li) => li) : (shape.levels || []).map((lv, li) => li)).forEach((li) => { const c = capOf(li); if (c && !capBase.has(c)) { c.material = c.material.clone(); capBase.set(c, c.material.color.clone()); } });
      const uOf = (sp, t) => tw(t, sp.t0, sp.t0 + 450, "io") * (sp.t1 == null ? 1 : 1 - tw(t, sp.t1, sp.t1 + (sp.out || 350), "io"));
      k.each((t) => {
        const any = shape._litSpans.some((sp) => uOf(sp, t) > 0);
        if (!any) { if (held) { if (base) shape.steps.forEach((st, i) => { st.m.color.copy(base[i]); st.m.emissive.copy(baseEm[i]); }); capBase.forEach((c0, c) => c.material.color.copy(c0)); held = false; } return; }
        if (!held) { base = shape.steps ? shape.steps.map((st) => st.m.color.clone()) : null; baseEm = shape.steps ? shape.steps.map((st) => st.m.emissive.clone()) : null; capBase.forEach((c0, c) => c0.copy(c.material.color)); held = true; }
        if (base) shape.steps.forEach((st, i) => { st.m.color.copy(base[i]); st.m.emissive.copy(baseEm[i]); });   // the stand's lift glow (set.js o.lift) comes back with the colour (pre-read 0400: place 6 stayed dark after its light)
        capBase.forEach((c0, c) => c.material.color.copy(c0));
        shape._litSpans.forEach((sp) => {
          const lv = shape.steps ? { blocks: [shape.steps[sp.li]] } : shape.levels[sp.li]; if (!lv || !lv.blocks[0]) return;
          const u = tw(t, sp.t0, sp.t0 + 450, "io") * (sp.t1 == null ? 1 : 1 - tw(t, sp.t1, sp.t1 + (sp.out || 350), "io"));   // measured on the clip as 300 ms or more in (pre-read 2000)   // 300 ms in, 250 out, even (pre-read 1655)
          if (u <= 0) return;
          const cap = capOf(sp.li); if (cap) cap.material.color.lerp(LIT, u);
          (sp.i === "all" || shape.steps ? lv.blocks : [lv.blocks[sp.i]]).forEach((bk) => { if (bk) { bk.m.color.lerp(cap ? (sp.side != null ? (sp._side || (sp._side = new T.Color(sp.side))) : LIT_SIDE) : LIT, u); if (shape.steps) bk.m.emissive.multiplyScalar(1 - u); else bk.m.emissive.setRGB(0, 0, 0); } });   // a step's glow fades with the light, no dark frame as it starts (pre-read 0400, 3A2 f160)   // sp.side: a deeper shade for a part on a step (board 20261112T005517 (b)); off unless a shot asks
        });
      });
    }
    spans.forEach((sp) => shape._litSpans.push(sp));
  };
  // a row of n small layered shapes (3B2: five meetings), each the shared S1.layers at a scale, three levels
  C.meetingLayers = () => [{ n: 1, w: 0.7, h: 0.1 }, { n: 1, w: 1.5, h: 0.32 }, { n: 1, w: 2.3, h: 0.7, base: true }];
  return C;
})();
