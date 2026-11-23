// T1b · S · v2-shots-a. Three close beats, each on its sentence: skill (juggling three tools); the blank map; the notes leaving.
// Row T1b.1 ("They can do almost anything. They know nothing about you. And when a task ends, they forget what they learned.")
// Three table-tops placed far apart in the world; the camera hard-cuts between them (same size, same angle).
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_a/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "T1b", type: "S", row: "T1b", dur: 12000,
  setup(k) {
    const SA = window.SA, D = k.dur, tw = k.tw, w = (word, fb) => SA.w(k, "T1b.1", word, fb);
    const tAny = w("almost", 1100), tKnow = w("know", 3400), tTask = w("task", 5900), tForget = w("forget", 7400), tEnd = SA.r(k, "T1b.1").end;
    const FLY = D < 8000 ? 1000 : 1400, STG = D < 8000 ? 60 : 110;   /* ai_fast-4c (ruling 165), read on D: at 6.4 s the notes fly 1.0 s, 60 ms apart, gone by D - 500; v10, ai and op unchanged */
    const c1 = tKnow - 900, c2 = w("and", 5000) - 200;              // cut points
    SA.ground(k, { extent: 60 });
    const X = [0, 40, 80];
    // beat 1: juggling a pen, a ruler and a calculator, then catching all three
    const a1 = k.agent({ at: [X[0], 0, 0], face: -0.15 });
    const tools = ["pen", "ruler", "calculator"].map((n) => { const g = SA.kp(k, n, {}); g.scale.setScalar(n === "ruler" ? 1.15 : 1.6);
      g.traverse((m) => { if (m.isMesh && m.material && m.material.color && m.material.color.getHex() === 0x111418) m.material = KIT.parts.mat("band"); }); return g; });   // nothing black (VL 15.43)   // the kit's nameable tools (a tip, keys, marks)
    a1.act(0, "juggle", { dur: c1 + 600 });   /* eased in and out: no arm snap (pre-read T1b f038) */
    // beat 2: a map of your organisation, unrolled: blank inside
    const a2 = k.agent({ at: [X[1] - 0.35, 0, 0], face: 0.35 });
    const map = SA.prop(k, "map", { at: [X[1] + 0.95, 0.62, 0.35] }); map.rotation.y = -0.35;
    [-0.42, 0.42].forEach((fx) => { const f = KIT.parts.add(map, KIT.parts.rbox(0.06, 0.24, 0.18, KIT.parts.mat("slab"), 0.02, 0.01), fx, -0.5, -0.02); f.castShadow = true; });   // two short feet on the page
    a2.turn(c1 + 300, 400, [X[1] + 0.95, 0.5, 0.35]); a2.turn(c1 + 1500, 400, 0.35); a2.fx(Math.min(c1 + 1900, c2 - 1300), "question");   /* up 1.3 s before the cut (pre-read 2225 item 3) */
    // beat 3: finishes a page (tick), and its notes blow off the desk
    const a3 = k.agent({ at: [X[2] - 0.3, 0, -0.1], face: 0.5 });
    const desk = k.set.part("desk", { w: 1.4 }); desk.scale.setScalar(0.55); desk.position.set(X[2] + 0.55, 0, 0); k.scene.add(desk);
    const page = SA.prop(k, "page", { at: [X[2] + 0.5, 0.45, 0.05] }); page.rotation.x = -Math.PI / 2;
    const notes = []; for (let i = 0; i < 6; i++) { const n = SA.prop(k, "note"); n.rotation.x = -Math.PI / 2; notes.push(n); }
    a3.fx(tTask + 300, "spark"); a3.act(D < 8000 ? tForget + 250 : tForget + 500, "shrug");   /* ai_fast-4c: the shrug 250 ms after "forget", so it is whole about 0.75 s and still up at the cut (on "forget" it ended and dropped in the last 6 frames) */   /* no write clip: it brought a page into the hand (f125 to f156) */   // a spark: a tick in a circle belongs to the list only (v2-visuals 120220)
    k.each((t) => {
      // juggling: three tools on staggered arcs above the hands until the catch
      // three lanes above the head, each tool rising and falling out of phase, turning flat to us at the top of its arc;
      // no tool crosses another or the head (v2-visuals 104102 item 1); all caught at the end of the beat
      const catchAt = c1 - 300, CW = 1950;   /* pre-read 0705: 40+ px a frame; the catch takes 200 ms more, the hold 150 ms less */
      tools.forEach((p, i) => { const ph = (t / 900 + i / 3) % 1, h = Math.sin(Math.PI * ph), u = tw(t, catchAt - CW, i === 2 ? catchAt - 250 : catchAt, "io");   /* the calculator lands first (pre-read 0340) */
        const lane = new THREE.Vector3(X[0] + [-0.78, 0, 0.74][i], 1.02 + 0.42 * h, 0.42), held = !a1.spr ? lane.clone() : a1.spr.localToWorld(new THREE.Vector3([-0.46, 0.46, 0.46][i], [0.3, 0.4, 0.3][i], [0.32, 0.3, 0.32][i]));   /* pen in the left hand; calculator in the right with the ruler laid on it: nothing on the head, which bobs with the breath (pre-read 0100) */   /* pen and calculator into the hands at the sides, the ruler flat on top of the head: nothing crosses the face (pre-read 0030) */
        p.position.copy(lane.clone().lerp(held, u)); if (i === 1) { const uh = tw(t, catchAt - CW, catchAt - 350, "io"), uv = tw(t, catchAt - 1550, catchAt, "io"), yHi = 1.42;   /* slide and drop overlap in one curve: no hang, no fast drop (pre-read 0705) */
          const hx = held.x + 0.25;   /* rests on the calculator's right, its left end clear of the face as it drops */
          p.position.set(lane.x + (hx - lane.x) * uh, (1 - uv) * (lane.y + (yHi - lane.y) * uh) + uv * held.y, lane.z + (held.z - lane.z) * uh); }   /* pre-read 0340: the ruler slid across the calculator's face; it now goes over the top while the calculator comes down, then drops straight onto it */   /* out to the right and forward of the calculator, never through it (pre-read 0300) */   /* the ruler swings out to the right as it comes down, so it never crosses the face (pre-read 0230) */   /* caught stacked at the belly where the hands are, below the visor (pre-read 2310: the stack hid the face) */
        p.rotation.set(Math.PI / 2 * (0.6 + 0.4 * h) * (1 - u), 0.15 * Math.sin(t / 400 + i), (1 - h) * 0.6 * (i - 1) * (1 - u)); });
      // the map unrolls from a scroll (scale x) and is held up
      map.visible = t > c1 - 100;
      // the notes: on the desk until the tick, then lift and blow off to the right, turning
      // the finished page goes last, so the table ends bare and holds 1 s (lead ruling 62 item 2)
      { const t0 = tTask + 400 + 6 * STG, u = tw(t, t0, t0 + FLY, "in"); page.position.set(X[2] + 0.5 + u * 4.5, 0.45 + u * 1.6 + Math.sin(u * 8) * 0.1 * u, 0.05 + u * 0.8); page.rotation.set(-Math.PI / 2 + u * 5, u * 2, u * 3); page.visible = u < 0.98; }
      notes.forEach((n, i) => { const t0 = tTask + 400 + i * STG, u = tw(t, t0, t0 + FLY, "in"); const bx = X[2] + 0.2 + (i % 3) * 0.24, bz = -0.15 + Math.floor(i / 3) * 0.26;
        n.position.set(bx + u * (4 + i * 0.6), 0.46 + u * (1.4 + 0.5 * Math.sin(i)) + Math.sin(u * 9 + i) * 0.1 * u, bz + u * 0.8); n.rotation.set(-Math.PI / 2 + u * 6 * (i % 2 ? 1 : -1), u * 3, u * 4); });
    });
    a1.hide(c1); a2.hide(c2);   // off-screen after their beat
    k.cue(c1, "cut"); k.cue(c2, "cut"); k.cue(tTask + 400, "whoosh");
    const on = (x, y) => SA.pose([x, y, 0.1], 400, 0.78, -10, -8);
    k.cam.keys([
      { t: 0, view: on(X[0], 0.6) }, { t: c1 - 1, hold: true },
      { t: c1, view: on(X[1] + 0.3, 0.55), cut: true }, { t: c2 - 1, hold: true },
      { t: c2, view: on(X[2] + 0.2, 0.5), cut: true }, { t: D, hold: true },
    ]);
    return {};
  },
});
