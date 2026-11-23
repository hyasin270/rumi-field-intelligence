// T3a · N · v2-shots-a. The chaos freezes and dims; one stranger steps forward: "an AI agent". Then one small task in three
// steps with three tools (look something up, open a file, send a message), a tick each; then three stay lit.
// Rows T3a.1 ("The strangers are not people. Each one is an AI agent."), T3a.2 ("An agent is an AI model with tools. It uses
// them, step by step, to finish a task."), T3a.3 ("Three hundred is a thought experiment. The problem is the same with three.")
// Lead ruling 071857 E2 (2): freeze, name card on T3a.1, the three steps on T3a.2, three sprites stay lit on T3a.3.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_a/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "T3a", type: "N", row: "T3a", dur: 20700,
  setup(k) {
    k.breathe();   /* VL 15.89 b (v2-visuals 082838): every render from now breathes, so no held frame repeats for 2 s */
    const SA = window.SA, D = k.dur, tw = k.tw, { T } = KIT.parts;
    const r1 = SA.r(k, "T3a.1"), r2 = SA.r(k, "T3a.2"), r3 = SA.r(k, "T3a.3");
    const f = (r, i, n) => r.start + (r.end - r.start) * i / n;
    // inside the model, the board room (B1 west): the day-one crowd milling, then frozen (v2-shots-b's S1.crowd, hero 12)
    const W = k.set.building({ stage: 0, people: false });
    window.locator(k, { room: "board" });   /* VL 15.76 */
    const tFreeze = SA.w(k, "T3a.1", "not", f(r1, 3, 10)), tName = r1.end + 50;   // the name ends the row; the card's word lands 50 ms after it (VL 6.6)
    const c0 = W.room("board");
    const R1 = Object.assign({}, W.area("board"), { z0: -4.4, z1: -3.3 }), R2 = Object.assign({}, W.area("board"), { x0: W.area("board").x0 + 0.62, z0: -3.3, z1: -2.2 });   /* two staggered ranks (194335 item 2) */
    /* nobody straight behind one of the three as the final camera sees them (pre-read 2110 check 4; K 8 22:00Z): skip a spot within
       0.8 m of the line from that camera through each front agent, at the spot's depth */
    const Cx = c0.x - 0.4 - 9.19 * Math.sin(12 * Math.PI / 180) * Math.cos(5 * Math.PI / 180), Cz = -1.3 + 9.19 * Math.cos(12 * Math.PI / 180) * Math.cos(5 * Math.PI / 180);
    const fronts = [[c0.x - 0.9, -1.0], [c0.x + 0.45, -1.05], [c0.x - 2.15, -1.05]];   /* the three's final places only: K 8 22:38Z emptied the room */
    const isPlayer = (pt) => fronts.some(([fx, fz]) => Math.abs(pt.x - (Cx + (fx - Cx) * (pt.z - Cz) / (fz - Cz))) < 0.5);
    SA.spacedCrowd(k, [R1, R2], { gap: 1.25, seed: 12, freezeAt: tFreeze, skip: isPlayer, yaw: 0.45 });   /* every face to the lens within 30 degrees (194335 item 1) */   /* a body's width apart (pre-read T3a: back row pressed); frozen on "not people" */
    const c = W.room("board");
    // the hero (member 12) steps forward out of the frozen crowd to the front of the room
    const hero = k.agent({ at: [-3.95, c.y, -1.9], face: 0.1 }); SA.badge(k, hero);   /* in the front row from the first frame (no pop-in, pre-read f043) */
    hero.walk(tFreeze + 400, 1800, [[c.x - 0.9, -1.0]]);   /* at a walk, about 0.7 m/s */ hero.turn(tFreeze + 1700, 300, 0.25);
    // two more who will stay lit with the hero on T3a.3 (members of the same room)
    const twoA = k.agent({ at: [-2.6, c.y, -1.9], face: -0.1 }), twoB = k.agent({ at: [-5.2, c.y, -1.9], face: 0.2 });
    k.cue(tFreeze, "freeze");
    k.ui.nameCard(tName, { name: "an AI agent", t1: Math.max(tName + 2800, r2.start + 400), x: 1060, y: 70 });   /* grows in its place (153200 item 5) */
    // T3a.2 (ruling 82 row 8): the newcomer's tools come up one at a time, each in its hand: the magnifier (look something
    // up), the pen (write), the calculator (work it out); 300 ms later the two neighbours beside it show the same tool, smaller.
    // All are put away on "finish a task". Every tool is held, none floats (note 74 item 5); nothing black (VL 15.43).
    const tTools = SA.w(k, "T3a.2", "tools", f(r2, 7, 16)), tStep = SA.w(k, "T3a.2", "step", f(r2, 11, 16)), tFin = SA.w(k, "T3a.2", "finish", f(r2, 14, 16));
    const tIn = [tTools - 100, tStep - 100, Math.max(tStep + 900, tFin - 900)], tAway = tFin + 400;
    const H = [c.x - 0.9, c.y, -1.0];
    // ruling 107 (i), VL: three tools in two hands, a flat white tray 0.5 m wide held below the visor, the magnifier, the pen and
    // the calculator standing on it in the order named, 12 px apart; up for well over 1 s around "tools", put down on "finish a
    // task". Each tray rests at its agent's feet from the first frame, so it comes from somewhere (VL 6.2). The neighbours lift
    // theirs 300 ms later, smaller (ruling 82 row 8).
    window.T3A_ROT = window.T3A_ROT || { magnifier: [0.55, 0, 0], pen: [0, 0, 0.5], calculator: [0.55, 0, 0] };   /* pre-read 0615: leaned back, the magnifier sank into the visor rim; it now leans forward, away from the body; the pen is propped up at 29 degrees so it reads */   /* kit parts: pen and calculator lie flat at 0, the magnifier stands; the magnifier and calculator lean back 43 degrees so they read from the lens without rising over the visor */
    const tray = (sc, at) => { const g = new THREE.Group(); k.scene.add(g); g.scale.setScalar(sc);
      KIT.parts.add(g, KIT.parts.rbox(0.62, 0.03, 0.28, KIT.parts.mat("white"), 0.04, 0.012), 0, 0.015, 0);
      [["magnifier", -0.25, 0.62], ["pen", -0.02, 1.3], ["calculator", 0.235, 1.2]]   /* pre-read 0700: gaps under 12 px; tray 0.62 m */.forEach(([n, x, s2]) => { const t = KIT.set.PARTS[n](k, {}); g.add(t); t.scale.setScalar(s2 * 0.55);
        t.traverse((m) => { if (m.isMesh) { m.castShadow = true; if (m.material && m.material.color && m.material.color.getHex() === 0x111418) m.material = KIT.parts.mat("band"); } });
        t.position.set(x, 0.03, 0); t.rotation.set(window.T3A_ROT[n][0], window.T3A_ROT[n][1], window.T3A_ROT[n][2]); t.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(t); t.position.y += 0.03 - (bb.min.y - g.position.y) / g.scale.y; });   /* pre-read 0230: standing tools crossed the faces; they now lie flat on the tray, resting on it */
      g.position.set(at[0], at[1], at[2]); return g; };
    const tUp = tTools - 900, tDown = tAway;
    const who = [{ a: hero, at: [H[0], c.y, -0.62], sc: 1, lag: 0 }, { a: twoA, at: [H[0] + 1.35, c.y, -0.67], sc: 0.8, lag: 300 }, { a: twoB, at: [H[0] - 1.25, c.y, -0.67], sc: 0.8, lag: 300 }];
    /* pre-read 0030: an agent cannot bend, so a tray set on the floor left the hands. Each tray now rests on a small white box at the
       height the agent holds it, and is lifted from it and set back on it (ruling 107 i: put down with the hands) */
    /* pre-read 0230: the boxes in front hid the bodies and were sized at scale 1 (the kit draws agents at 0.78), so the tray sank into
       them. Each tray now waits on a low white side table beside its agent, its top at the real carry height (0.46 + lift) x 0.78 */
    const LIFT = window.T3A_LIFT == null ? -0.15 : window.T3A_LIFT, hyT = (0.46 + LIFT) * KIT.SCALE.agent - 0.01;
    /* pre-read 0750: the arms only swing between the sides and the chest, so the hands never went to the table. Each agent now turns
       to its table (the carry point is 0.4 m in front of the body), takes the tray in its hands there, and turns back to the lens with it;
       it puts it down the same way. Each table stands 0.44 m from its agent, at 69 degrees to its right (left for the left neighbour) */
    const face0 = [0.25, -0.15, 0.3], P0 = [[H[0], -1.0], [H[0] + 1.35, -1.05], [H[0] - 1.25, -1.05]];
    who.forEach((w, j) => { w.th = j === 0 ? 1.45 : j === 2 ? -1.0 : 1.3; w.td = j === 2 ? 650 : 500;   /* the left one turns less far and slower: its tray swept 56 px a frame (pre-read 0820) */ w.f0 = face0[j]; const R = j === 2 ? 0.58 : 0.5; w.at = [P0[j][0] + R * Math.sin(w.th), c.y + hyT, P0[j][1] + R * Math.cos(w.th)];   /* pre-read 0805: the hero's table stood in front (its ring over the visor) and trays at rest cut the neighbours' arms: further round to the side and 0.5 m out; the left one 0.58 m (pre-read 0835: its tray lay over the arm) */
      KIT.parts.add(k.scene, KIT.parts.rbox(0.3, hyT, 0.3, KIT.parts.mat("white"), 0.03, 0.01), w.at[0], c.y + hyT / 2, w.at[2]); });
    who.forEach((w, j) => { w.tray = tray(w.sc, w.at); w.a.turn(tUp + w.lag - 50 - w.td, w.td, w.th); w.a.turn(tUp + w.lag + 420, w.td, w.f0); w.a.turn(tDown + w.lag - 50 - w.td, w.td, w.th); w.a.turn(tDown + w.lag + 650, w.td, w.f0);   /* 500 ms turns (pre-read 0805: the left tray swept 70 px a frame) */ w.tray.rotation.y = w.th;   /* on its table the tray already lies square to the hands that will take it (0805: it turned 90 degrees in one frame) */   /* to the table, back to the lens; again for the put-down */ w.a.act(tUp + w.lag, "carry", { blend: 400, prop: false });   /* v2-kit 080051: no v1 held card on the chest */   /* pre-read 0735: the arms were set before the tray moved; they now rise with it over the same 400 ms */ w.a.carry(tUp + w.lag, w.tray, { lift: j === 0 ? LIFT - 0.06 : LIFT, offset: [0, 0, 0.08] });   /* the hero's tray 0.06 lower in the carry's local units (about 4.7 cm in the room): its ring met the visor white (pre-reads 0635, 0700) */   /* held 8 cm further out from the body (pre-read 0615) */   /* held at the arms' height (pre-read 0100: at lift -0.32 the tray sat at the feet, 40 to 60 px under the arms) */ w.a.idle(tDown + w.lag + 330, { blend: 300 });   /* and drop only once the tray is down on its table */   /* put down by hand below: the kit's put starts at the visor, without the lift (pre-read 2110, f365) */
      // the tray rises from its table over 400 ms into the carrying arms (the kit's carry would place it in one frame)
      k.each((t) => { if (t >= tDown + w.lag) { const d = k.tw(t, tDown + w.lag, tDown + w.lag + 400, "io"); const held = w.tray.position.clone(); if (t >= tDown + w.lag + 420) { w.tray.position.set(w.at[0], w.at[1], w.at[2]); w.tray.rotation.set(0, w.th, 0); return; }   /* set down: it stays square on its table while the agent turns back (0805: it turned back by itself) */ w.tray.position.set(held.x + (w.at[0] - held.x) * d, held.y + (w.at[1] - held.y) * d, held.z + (w.at[2] - held.z) * d + 0.12 * Math.sin(Math.PI * d)); return; }
        const u = k.tw(t, tUp + w.lag, tUp + w.lag + 400, "io"); if (t < tUp + w.lag || u >= 1) return; const held = w.tray.position.clone(); w.tray.position.set(w.at[0] + (held.x - w.at[0]) * u, w.at[1] + (held.y - w.at[1]) * u, w.at[2] + (held.z - w.at[2]) * u + 0.12 * Math.sin(Math.PI * u))   /* pre-read 0635: an upward arc carried the tools past the visors; it now bows towards the lens, below the faces */; }); });
    k.each((t) => who.forEach((w, j) => { w.tray.children.slice(1).forEach((tl, i) => { const p = 1 + 0.06 * Math.sin(Math.PI * k.clamp01((t - tIn[i] - w.lag) / 380)); tl.scale.setScalar((i === 1 ? 1.3 : i === 2 ? 1.2 : 0.62) * 0.55 * p); }); }));
    who.forEach((w) => tIn.forEach((t0, i) => { w.a.fx(t0 + w.lag + 450, "spark"); }));   /* each step: its tool pulses on the tray, a spark */
    tIn.forEach((t0) => k.cue(t0 + 450, "step"));
    /* the hands hold the tray: no other arm acting; no hop (the badge swings) */
    // the two neighbours step up beside the newcomer before the tools (they are the "three" of T3a.3 too)
    twoA.walk(tTools - 2700, 1500, [[H[0] + 1.35, -1.05]]);   /* arrive 1.2 s before "tools", before they turn to their tables */
    twoB.walk(tTools - 2600, 1500, [[H[0] - 1.25, -1.05]]);
    // T3a.3: "start with three": two more step forward beside the newcomer, all three sharp in front of the full-coral crowd
    const tThree = SA.w(k, "T3a.3", "three", r3.end - 1400);
    k.cue(tThree - 200, "three");
    // one move in, one out: the room, push in to the newcomer for the card and the tools, back out to see the three
    const F = (pose, fx) => Object.assign(pose, { focus: fx, aperture: k.quality === "final" ? 0.04 : 0 });
    const hf = [c.x - 0.9, c.y + 0.4, -1.0], up = (pz) => Object.assign(pz, { pitch: -5 });   // tilted up: no floor lip or room below in frame (item 9)
    k.cam.keys([{ t: 0, view: F(up(SA.pose([c.x, c.y + 0.9, -2.6], 220, 0.78)), [c.x, c.y + 0.4, -2.6]) }, { t: tFreeze + 400, hold: true },
      { t: tFreeze + 2600, view: F(up(SA.pose([c.x - 0.4, c.y + 0.92, -1.3], 260, 0.78)), hf) }, { t: D, hold: true }]);   // one move (VL 4.5)
    return {};
  },
});
