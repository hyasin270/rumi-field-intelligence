// roleb-visit · S · lane roleb (s27 School visits). From P3a's set (a road of one-room schools; the FoP numbers and the
// coin are gone): an operator walks to a school once a fortnight. Teach Well: the lesson at the board, watched from the
// back. Improve: the conversation with the teacher after. Learn: the children's work, left on their places. Then the
// operator walks on, back up the road to the regional team, and the camera pulls back over the road of schools.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_a/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "roleb-visit", type: "S", dur: 17000,
  setup(k) {
    const SA = window.SA, D = k.dur, T = THREE, P = KIT.parts, tw = k.tw;
    k.breathe();
    SA.ground(k, { extent: 22 });
    SA.road(k, { len: 70, z: 0.6 });
    const xs = [-11, -5.2, 0.6, 6.4, 12.2];
    const sch = xs.map((x) => SA.school(k, { x, z: -3.2 }));
    const S2 = sch[1];
    const teacher = k.person({ at: S2.spot(-1.1, -0.8), face: 0.4, height: SA.PH });
    const seats = []; for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) seats.push(S2.spot(-0.7 + c * 0.75, 0.0 + r * 0.7));
    const kids = seats.map((sp) => k.person({ at: sp, face: Math.PI, pose: "stand" }));
    k.each(() => kids.forEach((q) => q.root.scale.setScalar(0.55)));
    const op = k.person({ at: [-12.9, 0.04, 0.2], face: Math.PI / 2, height: SA.PH });
    op.walk(-400, 4000, [[-9.5, 0.2]]);
    const tOpen = 2000, tTrav = 2600, tWatch = 5000, tTalk = 8600, tWork = 10600, tGo = 13300;
    k.each((t) => { const u = tw(t, tOpen, tOpen + 600, "io"); S2.open(u); S2.light(u); sch[2].open(0); });
    // Teach Well: the lesson at the board
    teacher.pose(tOpen, "point", { blend: 300 }); teacher.pose(tTalk - 600, "stand", { blend: 300 });
    op.walk(tTrav - 200, 1500, [[-7.5, 0.2], [S2.x + 1.15, 0.2]]);
    op.walk(tTrav + 1300, 600, [[S2.x + 1.15, -0.6]]);
    op.walk(tTrav + 1900, Math.max(600, tWatch - tTrav - 2000), [[S2.x - 0.3, S2.z + 1.5]]); op.turn(tWatch - 100, 300, Math.PI + 0.3);
    // Improve: the children go out for their break; the operator and the teacher talk it through
    const GAP = 600, SPD = 1.2, outAt = [];
    kids.forEach((q, i) => { const sp = seats[i], dp = [S2.x + 1.15, S2.z + 1.2], out = [[S2.x + 2.0, 0.6], [S2.x + 7.5 + (5 - i) * 0.3, 0.6]];
      const l1 = Math.hypot(dp[0] - sp[0], dp[1] - sp[2]), l2 = Math.hypot(out[0][0] - dp[0], out[0][1] - dp[1]) + Math.hypot(out[1][0] - out[0][0], 0), dur = (l1 + l2) / SPD * 1000;
      const xa = Math.acos(1 - 2 * l1 / (l1 + l2)) / Math.PI, tArr = tTalk - 3000 + (5 - i) * GAP, tS = Math.round(tArr - xa * dur);
      outAt[i] = tS; q.walk(tS, Math.round(dur), [dp].concat(out)); q.at(tS + Math.round(dur) + 30, [S2.x, -20, 0]); });
    op.walk(tTalk - 250, 600, [[S2.x + 0.4, S2.z + 0.2]]); op.turn(tTalk + 350, 300, S2.spot(-0.6, -0.2));
    teacher.walk(tTalk - 250, 600, [[S2.x - 0.5, S2.z - 0.1]]); teacher.turn(tTalk + 350, 300, S2.spot(0.5, 0.2)); teacher.pose(tTalk + 650, "hand-up", { blend: 300 }); teacher.pose(tTalk + 1700, "stand", { blend: 300 });
    // Learn: each child's notebook stays on their place; the two look at them together
    seats.forEach((sp, i) => { const nb = P.add(k.scene, P.rbox(0.34, 0.03, 0.25, P.mat("card"), 0.02, 0.01), sp[0], 0.2, sp[2] - 0.1); nb.rotation.y = 0.25 * (FILM.noise(i, 5) - 0.5);
      const ln = P.add(nb, P.rbox(0.22, 0.012, 0.03, P.mat("ink"), 0.005, 0.003), -0.02, 0.02, -0.04); const ln2 = P.add(nb, P.rbox(0.15, 0.012, 0.03, P.mat("ink"), 0.005, 0.003), -0.05, 0.02, 0.04);
      k.each((t) => { nb.visible = t >= outAt[i] + 200; }); });
    op.walk(tWork - 100, 900, [[S2.x - 0.05, S2.z + 0.75]]); op.turn(tWork + 800, 300, seats[1]); op.pose(tWork + 1000, "point", { blend: 300 }); op.pose(tWork + 2300, "stand", { blend: 300 });
    teacher.walk(tWork + 100, 900, [[S2.x - 1.0, S2.z + 0.55]]); teacher.turn(tWork + 1000, 300, seats[0]);
    // then: back up the road, to agree with the regional team what changes
    op.walk(tGo, 800, [[S2.x + 1.15, -0.6]]); op.walk(tGo + 800, 500, [[S2.x + 1.15, 0.2]]); op.walk(tGo + 1300, 2000, [[S2.x + 4.6, 0.2]]); op.turn(tGo + 3350, 300, 0.2);
    teacher.walk(tGo + 300, 900, [[S2.x - 1.1, S2.z - 0.8]]); teacher.turn(tGo + 1250, 300, 0.4);
    k.cue(tOpen, "lights"); k.cue(tWork + 1000, "tick");
    const on = (x, y, px) => k.cam.on([x, y + 0.85, -1.2], { size: "room", band: "S", height: 1.15, px: px || 250, yaw: -12, pitch: -9 });
    k.cam.keys([{ t: 0, view: on(-8.6, 0.45) }, { t: tTrav - 200, hold: true },
      { t: tTrav + 2600, view: on(S2.x + 0.8, 0.45), ease: "io" }, { t: tWork - 200, hold: true, drift: false },
      { t: tWork + 1200, view: on(S2.x + 0.1, 0.25, 300), ease: "io" }, { t: tGo, hold: true, drift: false },
      { t: tGo + 3000, view: on(S2.x + 2.2, 0.6, 150), ease: "io" }, { t: D + 1, hold: true, drift: false }]);
    return {};
  },
});
