// T2 · S · v2-shots-a. Day one with no system: six gags, each the opening picture of a later stage, now inside the real model
// (v2-visuals: S shots sit inside the model; director 074811 item 6: same gags, same order).
//   1 board room (B1 W) the tug = 1A1 · 2 store room (B2 E; B1 E holds gag 5's agents) the binders = 1B2 · 3 gates room (B2 W) GO LIVE = 1C1
//   4 pavilion: the queue at one desk = 2.0 · 5 pavilion meeting over the glass, agents pressing up from B1 = 3.0
//   6 pavilion: the mountain of pages = 4.0
// Row T2.1 ("Leave them to it, and this is day one.") over the milling crowd and a clock at nine; then 18 s music-led.
// Hard cuts on the beat between the six (cut: true keys). The 300 mill in every bare room behind (v2-shots-b's S1.crowd).
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_a/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "T2", type: "S", row: "T2", dur: 21700,
  setup(k) {
    const SA = window.SA, D = k.dur, tw = k.tw, { T } = KIT.parts;
    const r = SA.r(k, "T2.1");
    const W = k.set.building({ stage: 0, people: false });
    const R = (n) => W.room(n);                                            // a room's floor centre (z -3)
    const cB = R("board"), cS = R("store"), cG = R("gates");
    // the crowd behind every gag, kept clear of the actors' front zone in the three gag rooms
    // the crowd: fewer and spaced (a body's width apart), milling; in the three gag rooms it keeps to the back, 1.2 m behind
    // the actors (VL 15.29, 15.39; v2-check 104158 MAJOR; v2-visuals 104433 item 11)
    const back = (n) => { const a = W.area(n); return Object.assign({}, a, { z0: a.z0, z1: -3.5 }); };
    const clip = (a, x0, x1) => Object.assign({}, a, { x0: x0 == null ? a.x0 : x0, x1: x1 == null ? a.x1 : x1 });
    const areas = [clip(back("board"), -5.1), back("skills"), clip(back("gates"), null, -2.85), back("store"), W.area("judge"), W.area("teams")];   /* none behind the GO LIVE door, none at the board room's left edge (note 74 item 4) */
    SA.spacedCrowd(k, areas, { gap: 1.0, seed: 21, skip: (pt) => (Math.abs(pt.y + 3.2) < 0.1 && pt.x > 1.6 && pt.x < 4.2) || (Math.abs(pt.y - W.room("board").y) < 0.1 && pt.x > W.room("board").x - 1.6 && pt.x < W.room("board").x + 2.3) });   /* nobody behind the stack (194118 item 2), nor behind the tug (K 8 22:12Z, 0 to 3 s) */   /* nobody behind the stack (194118 item 2) */
    // ruling 107 (h): each tableau opens about 0.5 s before its own sentence (rows T2.2, T2.3, v1.6) and holds to the end of it.
    // Five tableaux, five sentences; the mountain had no sentence and is gone.
    const W2 = (row, word, fb) => SA.w(k, row, word, fb);
    const G = [W2("T2.2", "two", 3970) - 500, W2("T2.2", "buried", 6980) - 1500, W2("T2.2", "untested", 9740) - 1500, W2("T2.3", "queue", 12670) - 650, W2("T2.3", "downstairs", 15580) - 950, D + 2000].map(Math.round);
    const gl = (i) => G[i + 1] - G[i];
    window.locator(k, { room: "board", changes: [[G[1], "store"], [G[2], "gates"], [G[3], "pav"], [G[4], "skills"]] });   /* VL 15.76: the map on every room frame; the glass gag is read from below */
    // opening: the board room's crowd milling, a clock at nine on the back wall
    const clock = SA.kp(k, "clock", { r: 0.3 }, [cB.x + 1.7, cB.y + 0.95, -5.82]);
    k.each((t) => { clock.visible = t < G[4]; });   /* no clock in the glass gag (v2-visuals 104433 item 10; pre-read 0000) */
    // 1 · the tug (1A1): two agents, one job folder, a third idle and shrugs
    const a1 = k.agent({ at: [cB.x - 0.54, cB.y, -1.6], face: 1.25 }), b1 = k.agent({ at: [cB.x + 0.62, cB.y, -1.6], face: -1.25 }), c1 = k.agent({ at: [cB.x + 1.55, cB.y, -1.5], face: -0.15 });
    const fold = k.set.part("folder", {}); k.scene.add(fold); fold.scale.x = 1.16;   /* as long as the gap between the hands (pre-read 0050: 140 to 160 px of folder against 160 to 205 px) */ fold.position.set(cB.x, cB.y + 0.45, -1.6);
    const dummy = new THREE.Object3D(); k.scene.add(dummy); SA.kp(k, "tug", { a: a1, b: b1, prop: dummy, t0: -1200, t1: G[1] + 900, before: "mid", after: "mid", amp: 0.02 });   /* the kit's tug declares the pull acts; the folder itself is placed below */
    /* pre-read 0300: the kit sets the folder level at the grips' midpoint, so the left mitten (lower than the kit's grip point) never reached it.
       Each frame the folder now runs along the line between the two mittens' own points, tilted to meet both, its length the gap plus 6 cm */
    { fold.scale.x = 1; fold.rotation.set(0, 0, 0); fold.updateMatrixWorld(true); const nb = new THREE.Box3().setFromObject(fold), nL = nb.max.x - nb.min.x, GP = window.T2_GRIP || { a: [0, 0.49, 0.41], b: [0, 0.47, 0.44] };
      k.each((t) => { a1.eval(t); b1.eval(t); const ga = a1.spr.localToWorld(new THREE.Vector3(...GP.a)), gb = b1.spr.localToWorld(new THREE.Vector3(...GP.b));
        const dx = gb.x - ga.x, dz = gb.z - ga.z, L = Math.hypot(dx, dz), e = t < G[1] + 900 ? 1 : 0, sw = 0.02 * Math.sin(2 * Math.PI * t / 900) * e;
        const p = ga.clone().lerp(gb, 0.5); p.x -= dx / L * sw; p.z -= dz / L * sw; fold.position.copy(p);
        fold.rotation.set(0, Math.atan2(dx, dz) + Math.PI / 2, Math.atan2(ga.y - gb.y, L)); fold.scale.x = (Math.hypot(L, ga.y - gb.y) + 0.06) / nL; }); }   /* a small sway, so the folder stays in both hands (pre-read 0000: at amp 0.1 it slid off them) */   /* hands on from before frame 0 to past the cut (pre-read 2335 f000, f152) */   // held between them from the first frame
    c1.act(G[0] + 1300, "shrug");
    // 2 · the binders (1B2): a small desk, binders land one by one until the stack tips over the agent
    const a2 = k.agent({ at: [cS.x - 0.1, cS.y, -1.4], face: 0.2 });
    const heap = [[-0.34, 0.08, 0.2, 0.2], [0.34, 0.08, 0.2, -0.25], [0, 0.08, 0.42, 0.1], [-0.36, 0.25, 0.12, -0.6], [0.36, 0.25, 0.12, 0.5], [-0.12, 0.2, 0.42, 0.3],
      [-0.3, 0.42, 0.16, 0.9], [0.3, 0.42, 0.14, -0.8]];     // [dx, y, dz, yaw]: a heap round the body; nothing in front of the visor's top half (v2-visuals 194118 item 1)
    const bnds = heap.map((h, i) => SA.prop(k, "binder", { alt: i % 2 }));
    a2.act(G[1] + 1900, "slump", { dur: 1200 });
    // 3 · GO LIVE (1C1): an agent marches a stack of pages at a big door; it swings open, nothing stops it
    const door3 = SA.kp(k, "door2", { w: 1.1, h: 2.0, label: "Go live" }, [cG.x + 1.3, cG.y, -3.1]);   // the same door2 as 1C1 to 1C3 (ruling 45)
    door3.open(G[2] + 1450); const leaf = null;
    const a3 = k.agent({ at: [cG.x - 1.6, cG.y, -1.2], face: 1.6 }); const pg3 = SA.prop(k, "pile", { n: 6 });
    a3.carry(G[2] - 60, pg3, { lift: -0.3 });   /* pages low, the visor clear */ a3.act(G[2] - 60, "proud", { dur: 1400 }); a3.walk(G[2] + 100, 1500, [[cG.x - 0.3, -1.7], [cG.x + 0.55, -2.55]]); a3.turn(G[2] + 600, 450, -0.35); a3.turn(G[2] + 1250, 450, Math.PI / 2 - 0.3); a3.act(G[2] + 2100, "hop");   /* ends side-on at the door, its face to us, and pushes it (no back to us: pre-read T2 f347) */   /* a look back at us over the pages (153200 item 9) */
    // 4 · the queue (2.0): one person at a desk in the pavilion, agents crowd it with questions; the person leans back
    const p4 = k.person({ at: [-3.0, 0, -3.95], face: 0 }); p4.pose(G[3] + 1400, "hand-up", { blend: 1000 });
    const q4 = [0, 1, 2, 3, 4].map((i) => { const ag = k.agent({ at: [-2.0 + i * 0.78, 0, -2.6 + (i % 2) * 0.35], face: -0.9 - i * 0.08 }); ag.fx(G[3] + 200 + i * 150, "question"); return ag; });
    // 5 · the glass ceiling (3.0): a meeting at a table upstairs, speech rising; below, three agents stand one on another's
    // head and the top one presses its hands flat on a glass pane let into the ceiling under the table (v2-visuals 104433 item 10)
    const tb5 = k.set.part("desk", { w: 1.6 }); k.scene.add(tb5); tb5.position.set(2.9, 0, -1.25);
    const m5 = [[2.0, -1.25, 1.4], [2.9, -1.95, 0], [3.8, -1.25, -1.4]].map(([x, z, f]) => k.person({ at: [x, 0, z], face: f }));
    const speech = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(() => SA.prop(k, "speech"));   /* the meeting talks all through the gag */
    const paneM = new THREE.MeshStandardMaterial({ color: 0xbfd6e2, transparent: true, opacity: 0.55, roughness: 0.1 });
    const pane = KIT.parts.add(k.scene, KIT.parts.rbox(1.5, 0.27, 0.04, paneM, 0.03, 0.01), 2.9, -0.185, 0.02);   /* pre-read 0700: the press pose's mittens stop under the crown; the glass's lip now hangs 5 cm below the slab, so the raised hands meet it */
    /* pre-read 2245: bases ran into crowns at 0.74 m and the top hands stopped 90 px short of the glass. One body apart (0.78 m), on a white crate 0.5 m high */
    { const crate = KIT.parts.add(k.scene, KIT.parts.rbox(0.8, 0.59, 0.8, KIT.parts.mat("white"), 0.05, 0.02), 2.9, -3.2 + 0.295, -0.75); crate.castShadow = true; }
    const stack = [0, 1, 2].map((j) => k.agent({ at: [2.9, -3.2 + 0.59 + j * 0.78, -0.75]   /* pre-read 0650 fault 3: the hands stopped 22 to 35 px under the glass; the crate is 6 cm taller (9 cm put the crown into the slab) */, face: 0.1 * (j - 1) }));
    const press5 = stack; stack[2].act(G[4] + 300, "press", { dur: D - G[4] - 300 });
    /* pre-read 0700: the press pose stops the mittens level with the visor top, under the crown, so lifting the stack only pushed the
       head into the slab. The top agent now tips back 17 degrees (0.3 rad) from its feet as it presses, so the face turns up to the meeting
       (pre-read 0740: at 34 degrees the hands dropped about 5 px) (k.each runs after the agents, so the tilt holds) */
    k.each((t) => { const u = tw(t, G[4] + 300, G[4] + 900, "io"); if (u <= 0 || !stack[2].spr) return; stack[2].spr.rotation.x = -0.3 * u; stack[2].spr.updateMatrixWorld(true); }); /* no slump in the middle: it shortened the body and left the top one standing on air (pre-read 2245 f457) */
    // (the mountain gag is gone: no row names it, ruling 107): a person with a magnifying glass before a mountain of finished pages; one more lands
    
    k.each((t) => {
      speech.forEach((sp, i) => { const t0 = G[4] + i * 700, u = tw(t, t0, t0 + 1800, "out"); sp.visible = t > t0 && u < 1; sp.position.set(2.2 + i * 0.5, 1.5 + u * 0.9, -1.6); sp.scale.setScalar(0.6 * (1 - 0.6 * u)); });
      bnds.forEach((bd, i) => { const [dx, y, dz, yw] = heap[i], t0 = G[1] + 150 + i * 230, u = tw(t, t0, t0 + 260, "in");
        bd.visible = t > t0 - 40; bd.position.set(cS.x - 0.1 + dx, cS.y + y + 0.08 + (1 - u) * 2.6, -1.4 + dz); bd.rotation.set(0.1 * Math.sin(i), yw, 0.15 * Math.cos(i * 2)); });
      clock.sweep && 0;
    });
    clock.sweep(0, D, 9.0, 9.4);
    // each gag's actors are seen only in their own gag (no stray bodies at the edge of the next frame)
    [[a1, b1, c1], [a2], [a3], q4, press5].forEach((grp, i) => grp.forEach((a) => a.hide(G[i + 1])));
    /* a sound for each tableau at its hit (ruling 107; v2-voice 180104) */ k.cue(G[0] + 400, "bounce"); k.cue(G[3] + 300, "question"); k.cue(G[4] + 500, "press");
    k.cue(G[1] + 150, "pages"); k.cue(G[2] + 1450, "door");
    const P = (x, y, z, px, h) => SA.pose([x, y, z], px || 290, h || 0.78);
    const views = [P(cB.x + 0.6, cB.y + 0.5, -1.7, 280), P(cS.x, cS.y + 0.7, -1.7, 270), P(cG.x + 0.2, cG.y + 1.0, -2.0, 220),
      P(-1.7, 0.6, -2.9, 230), P(2.9, -0.9, -1.4, 150), P(2.9, 0.75, -3.0, 230)];
    const keys = [{ t: 0, view: P(cB.x + 0.3, cB.y + 0.6, -2.8, 220) }, { t: G[0] - 1, hold: true }];
    views.forEach((v, i) => { keys.push({ t: G[i], view: v, cut: true }); keys.push({ t: (G[i + 1] || D) - 1, hold: true }); });
    k.cam.keys(keys);
    return {};
  },
});
