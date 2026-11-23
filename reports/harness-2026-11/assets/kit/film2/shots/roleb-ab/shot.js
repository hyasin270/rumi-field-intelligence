// roleb-ab · S · lane roleb (s24 Prove it, presses 1 to 3). A table set: two groups of teachers, A gets the change and B
// does not. Press 1: the bar goes up on the back wall before anything ships. Press 2: three people (the operator, a
// builder, the field team) turn to measure; both columns start to rise. Press 3: at scale, each group grows to twelve and
// the columns finish: A clears the bar (it turns amber), B stays under it. No number on screen.
FILM.shot({
  id: "roleb-ab", type: "S", dur: 11000,
  setup(k) {
    k.breathe();
    const tw = FILM.tw, P = KIT.parts;
    const S = k.set.table({ w: 15, d: 7.4 });
    S.add("block", { at: [0, 0, -4.5], w: 13.4, h: 3.5, d: 0.2, colour: "wallWarm" });
    const bar = S.add("block", { at: [0, 2.15, -4.25], w: 12.4, h: 0.14, d: 0.16, colour: "green" });
    const sA = S.add("sign", { text: "A: gets the change", w: 3.4, h: 0.55 }); sA.position.set(-3.4, 3.0, -4.32);
    const sB = S.add("sign", { text: "B: does not", w: 3.4, h: 0.55 }); sB.position.set(3.4, 3.0, -4.32);
    const HA = 2.7, HB = 1.65;
    const colA = S.add("block", { at: [-3.4, 0, -3.6], w: 1.7, h: HA, d: 0.8, colour: "navy" });
    const colB = S.add("block", { at: [3.4, 0, -3.6], w: 1.7, h: HB, d: 0.8, colour: "grey" });
    const matA = colA.children[0].material = colA.children[0].material.clone();
    const tBar = 1300, tM = 3500, tScale = 6100, tUp = 7000;
    const hA = (t) => (1.15 * tw(t, tM + 300, tM + 1700, "io") + 1.55 * tw(t, tUp, tUp + 1500, "io")) / HA;
    const hB = (t) => (1.0 * tw(t, tM + 300, tM + 1700, "io") + 0.65 * tw(t, tUp, tUp + 1500, "io")) / HB;
    const amber = new THREE.Color(0xE8A200), navy = new THREE.Color(0x34507a);
    k.each((t) => {
      bar.scale.x = Math.max(0.001, tw(t, tBar, tBar + 650, "outExpo")); bar.visible = t >= tBar;
      colA.scale.y = Math.max(0.001, hA(t)); colB.scale.y = Math.max(0.001, hB(t)); colA.visible = colB.visible = t >= tM + 300;
      matA.color.copy(navy).lerp(amber, tw(t, tUp + 1300, tUp + 1700, "io"));
    });
    k.ui.pin(tBar + 500, { text: "the bar", at: [0, 2.15, -4.15], side: "right", dx: 30, dy: 100 });
    // the two groups: four each from the start, twelve each at scale
    const people = [];
    [-1, 1].forEach((side) => { for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      const x = side * (1.9 + c * 1.02) , z = -2.1 + r * 0.95, n = r * 4 + c;
      const p = k.person({ at: [x, 0, z], face: side * -0.25 });
      const tIn = n < 4 ? -1e9 : tScale + (n - 4) * 70 + (side > 0 ? 35 : 0);
      people.push({ p, tIn });
    } });
    k.each((t) => people.forEach(({ p, tIn }) => { const u = tIn < 0 ? 1 : tw(t, tIn, tIn + 380, "back"); p.root.visible = t >= tIn; p.root.scale.setScalar(Math.max(0.001, u)); }));
    // the three who measure: the operator, a builder, the field team; they turn to the columns and point
    const m = [[-0.75, 0.35], [0, 0.55], [0.75, 0.35]].map(([x, z], i) => k.person({ at: [x, 0, z], face: 0, blend: 300 }));
    m.forEach((p, i) => { p.turn(tM - 100 + i * 120, 400, Math.PI + (i - 1) * 0.5); });
    m[0].pose(tM + 300, "point", { blend: 300 }); m[0].pose(tM + 2400, "stand", { blend: 300 });
    m[2].pose(tM + 500, "point", { blend: 300 }); m[2].pose(tM + 2600, "stand", { blend: 300 });
    m.forEach((p, i) => { p.turn(tUp + 1900 + i * 100, 400, (i - 1) * -0.3); });
    m[1].pose(tUp + 2200, "hand-up", { blend: 300 }); m[1].pose(tUp + 3300, "stand", { blend: 300 });
    k.cue(tBar, "install"); k.cue(tM, "tick"); k.cue(tUp + 1500, "pass");
    const pose = (look, dist, yaw, pitch) => ({ pose: { look, dist, yaw: yaw == null ? -10 : yaw, pitch: pitch == null ? -11 : pitch } });
    k.cam.keys([
      Object.assign({ t: 0 }, pose([0, 0.8, -1.8], 31, -14, -13)),
      Object.assign({ t: 2200, ease: "io" }, pose([0, 0.75, -2.0], 21.5)),
      { t: tScale - 200, hold: true },
      Object.assign({ t: tScale + 1800, ease: "io" }, pose([0, 0.85, -2.0], 23.5, -6, -12)),
      { t: 11001, hold: true },
    ]);
    return {};
  },
});
