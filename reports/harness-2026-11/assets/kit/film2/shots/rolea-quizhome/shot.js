// rolea-quizhome · S · lane rolea (Operator Harness Show, 23 Nov 2026). A new shot on the P3 table-top (the road, one school):
// the quiz that goes home. A home across the road from the school: a child on a phone, a grown-up beside them. The camera
// opens on the home, then pulls back to take in the school, where the teacher holds a phone. A quiz card leaves the teacher's
// phone, arcs over the road and lands at the child; a tick over the child; a score card arcs back to the teacher, who lifts
// a hand. No words in the picture. Rests for s04: 2600 (the child at home), 10900 (the score back at school).
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_a/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "rolea-quizhome", type: "S", dur: 12000,
  setup(k) {
    k.breathe();
    const SA = window.SA, { T, mat, rbox, add } = KIT.parts;
    SA.ground(k, { extent: 22 });
    SA.road(k, { len: 70, z: 0.6 });
    // the school, open and lit, the teacher holding a phone
    const S = SA.school(k, { x: -3.4, z: -3.2 });
    k.each(() => { S.open(1); S.light(1); });
    const teacher = k.person({ at: S.spot(-0.2, 0.5), face: 0.75, height: SA.PH });
    teacher.pose(0, "stand").pose(4300, "phone", { blend: 400 }).pose(10200, "hand-up", { blend: 300 });
    // the home: a smaller room with a pitched roof, its front open, warm inside
    const HX = 4.4, HZ = -3.0, HW = 3.0, HD = 2.4, HH = 1.8;
    const home = new T.Group(); k.scene.add(home); home.position.set(HX, 0, HZ);
    add(home, rbox(HW + 0.4, 0.16, HD + 0.4, mat("white"), 0.08, 0.05), 0, 0.08, 0);
    add(home, rbox(HW, HH, 0.14, mat("wallWarm"), 0.05, 0.03), 0, HH / 2, -HD / 2);
    [-1, 1].forEach((s) => add(home, rbox(0.14, HH, HD, mat("wallWarm"), 0.05, 0.03), s * HW / 2, HH / 2, 0));
    [-1, 1].forEach((s) => { const r = add(home, rbox(HW / 2 + 0.55, 0.16, HD + 0.5, mat("white"), 0.06, 0.04), s * (HW / 4 + 0.12), HH + 0.42, 0); r.rotation.z = -s * 0.52; });
    add(home, rbox(0.8, 0.6, 0.06, mat("white"), 0.04, 0.02), 0.7, 1.15, -HD / 2 + 0.1);   // a window on the back wall
    const lamp = new T.PointLight(0xfff1dd, 2.6, 5, 1.6); lamp.position.set(0, HH - 0.4, 0.2); home.add(lamp);
    const child = k.person({ at: [HX - 0.35, 0.16, HZ + 0.25], face: 0.5, height: SA.PH });
    child.pose(0, "stand").pose(700, "phone", { blend: 400 });
    k.each(() => child.root.scale.setScalar(0.58));   // a child: the kit locks a person's height, so the body is scaled every frame
    const adult = k.person({ at: [HX + 0.65, 0.16, HZ - 0.15], face: -0.35, height: SA.PH });
    adult.pose(0, "stand").pose(8300, "point", { blend: 300 }).pose(9400, "stand", { blend: 300 });
    // the quiz goes home, the score comes back: P3b's tokens, a little larger, on high arcs over the road
    const quiz = SA.token(k, "text"), score = SA.token(k, "score"); quiz.scale.setScalar(1.35); score.scale.setScalar(1.35);
    const tHand = S.spot(0.05, 0.75), cHand = [HX - 0.25, 0.95, HZ + 0.6];
    const a = [tHand[0], 1.45, tHand[2]], b = cHand, back = [tHand[0] + 0.75, 1.25, tHand[2] + 0.2];   // the score lands beside the teacher, not over the face
    const T0 = 5600, T1 = 7400, T2 = 8900, T3 = 10500;
    k.each((t) => { SA.hop(quiz, t, T0, T1 - T0, a, b, T1 + 500, 1.8); SA.hop(score, t, T2, T3 - T2, b, back, 12001, 1.8); });
    k.cue(T0, "send"); k.cue(T1, "message"); k.cue(T3, "message");
    child.fx(T1 + 700, "tick");
    teacher.fx(T3 + 100, "tick");
    // the camera: close on the home, then one pull back over the road to the school and the home together
    const onHome = k.cam.on([HX - 0.1, 1.05, HZ + 0.7], { size: "room", band: "S", height: 1.15, px: 240, yaw: -12, pitch: -9 });
    const wide = k.cam.on([0.5, 1.0, -2.4], { size: "room", band: "S", height: 1.15, px: 150, yaw: -12, pitch: -10 });
    k.cam.keys([{ t: 0, view: onHome }, { t: 2900, hold: true }, { t: 5300, view: wide, ease: "io" }, { t: 12000, hold: true }]);
    return {};
  },
});
