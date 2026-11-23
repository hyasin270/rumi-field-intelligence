// P3a · S · v2-shots-a. One coaching visit: the coach can be in one place at a time; a coin drops for each visit.
// Row P3a.1 ("Take one job we know well, coaching a teacher. A coach travels to the school, watches a lesson, and talks it through. About forty dollars a visit.")
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_a/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "rolea-P3a", type: "S", row: "P3a", dur: 16000,
  setup(k) {
    const SA = window.SA, D = k.dur, w = (word, fb) => SA.w(k, "P3a.1", word, fb);
    SA.ground(k, { extent: 22 });
    SA.road(k, { len: 70, z: 0.6 });
    const xs = [-11, -5.2, 0.6, 6.4, 12.2];
    const sch = xs.map((x) => SA.school(k, { x, z: -3.2 }));
    const S2 = sch[1]; const tw = k.tw;
    // in school 2: a teacher at the board and six small children seated
    const teacher = k.person({ at: S2.spot(-1.1, -0.8), face: 0.4, height: SA.PH });
    const kids = []; for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) kids.push(k.person({ at: S2.spot(-0.7 + c * 0.75, 0.0 + r * 0.7), face: Math.PI, pose: "stand" }));
    k.each(() => kids.forEach((q) => q.root.scale.setScalar(0.55)));   // children: the kit locks a person's height, so the body is scaled every frame (a pose resets it)
    const coach = k.person({ at: [-12.9, 0.04, 0.2], face: Math.PI / 2, height: SA.PH });
    coach.walk(-400, 4000, [[-9.5, 0.2]]);   /* already walking at frame 0 (ruling 80; the kit's start blend falls before the shot) */   // walking from the first frame (ruling 80)
    const tCoach = w("coaching", 2100), tTrav = w("travels", 5400), tWatch = w("watches", 6900), tTalk = w("talks", 8400), tForty = w("forty", 10400);
    const tOpen = w("teacher", 3300);
    /* ai_fast-4c (rulings 163 to 165), read on D: at 9.1 s the tail after "forty" cannot play. FAST: the children file out
       350 ms apart at 1.6 m/s and are out of frame by about 8.4 s; the coach stays by the coin; the teacher settles by D - 500.
       v10, ai and op (D >= 13 s) are unchanged. */
    const FAST = D < 13000, GAP = FAST ? 350 : 600, SPD = FAST ? 1.6 : 1.2;
    k.each((t) => { const u = tw(t, tOpen, tOpen + 600, "io"); S2.open(u); S2.light(u); sch[2].open(0); });
    teacher.pose(tOpen, "point", { blend: 300 }); teacher.pose(tTalk - 600, "stand", { blend: 300 }); teacher.pose(FAST ? Math.min(tForty + 1700, D - 800) : tForty + 1700, "stand", { blend: 300 });   /* pre-read 2110: every change of pose over 300 ms */   /* the lesson is taught while the coach watches (v2-lead 200314); poses ease in kit v0.8.5 */
    // travels: along the road to school 2, then in at the door
    coach.walk(tTrav - 200, 1500, [[-7.5, 0.2], [S2.x + 1.15, 0.2]]);
    coach.walk(tTrav + 1300, 600, [[S2.x + 1.15, -0.6]]);   /* joins the walk before: no standing frame between (pre-read 2110, f187) */
    // watches: sits at the back of the class (towards the camera; the class faces the board)
    coach.walk(tTrav + 1900, Math.max(600, tWatch - tTrav - 2000), [[S2.x - 0.3, S2.z + 1.5]]);   /* the back centre: off the children's way out and clear of the teacher (pre-read 2110, f222) */ coach.turn(tWatch - 100, 300, Math.PI + 0.3);   /* 0.5 m clear of the nearest child (v2-visuals 200007 item 1) */   /* walks to the back of the class (no jump) */
    // talks it through: the children go, coach and teacher meet in the middle, face to face
    kids.forEach((q, i) => { const sp = S2.spot(-0.7 + (i % 3) * 0.75, 0.0 + Math.floor(i / 3) * 0.7), dp = [S2.x + 1.15, S2.z + 1.2], out = [[S2.x + 2.0, 0.6], [S2.x + (FAST ? 5.5 : 7.5) + (5 - i) * 0.3, 0.6]];   /* along the road's back half, clear of the coin at z 1.05 (pre-read 0025: at z 1.32 the coin left the frame) */
      const l1 = Math.hypot(dp[0] - sp[0], dp[1] - sp[2]), l2 = Math.hypot(out[0][0] - dp[0], out[0][1] - dp[1]) + Math.hypot(out[1][0] - out[0][0], 0), dur = (l1 + l2) / SPD * 1000;
      const xa = Math.acos(1 - 2 * l1 / (l1 + l2)) / Math.PI, tArr = tTalk - 3000 + (5 - i) * GAP,   /* the seat nearest the door leaves first, so nobody walks through a seated child (pre-read 2215 f198 to f249) */ tS = Math.round(tArr - xa * dur);   /* each crosses the door 600 ms after the one before: one file, a body apart (pre-read 2110, f166) */
      q.walk(tS, Math.round(dur), [dp].concat(out)); q.at(tS + Math.round(dur) + 30, [S2.x, -20, 0]); });   // they walk out at the door (ruling 80)
    coach.walk(tTalk - 250, 600, [[S2.x + 0.4, S2.z + 0.2]]); coach.turn(tTalk + 350, 300, S2.spot(-0.6, -0.2));
    teacher.walk(tTalk - 250, 600, [[S2.x - 0.5, S2.z - 0.1]]); teacher.turn(tTalk + 350, 300, S2.spot(0.5, 0.2)); teacher.pose(tTalk + 650, "hand-up", { blend: 300 });
    // about forty dollars a visit: one coin drops onto the cost stack beside the road
    const coin = KIT.set.PARTS.coin(k, { r: 0.22 }); /* lane rolea: no coin, no cost */ const cx = S2.x + 1.6;   /* the coach drops it on the road as they leave: from the hand, 300 ms */
    coin.fall(tForty - 200, [cx + 0.32, 0.8, 0.9], [cx + 0.32, 0.045, 0.98], 300);   /* on the road's top (0.04), not in it (pre-read 0120) */   /* lands in front, off the children's way along the road (pre-read 2310) */   /* from the reaching hand, in front of the body (pre-read 2110, f290) */
    coach.turn(tForty - 500, 300, [cx + 0.32, 0, 0.98]); coach.pose(tForty - 500, "point", { blend: 300 }); coach.pose(tForty + 100, "stand", { blend: 300 });
    /* lane rolea: no coin cue */
    if (0) k.ui.number(tForty - 150, { value: 40, prefix: "about $", unit: "a visit", from: 40, dur: 1, hold: 3000, x: 1080, y: 60 });
    // after: the coach leaves for school 3, still dark
    coach.walk(tForty - 1100, 800, [[cx, 0.45]]); if (!FAST) { coach.walk(tForty + 900, 700, [[S2.x + 1.15, 0.2]]); coach.walk(tForty + 1650, Math.max(800, D - tForty - 2600), [[S2.x + 3.2, 0.2]]); }   /* stops inside the frame */
    // the one move: a track along the road with the coach (house S angle)
    const on = (x, y) => k.cam.on([x, y + 0.85, -1.2], { size: "room", band: "S", height: 1.15, px: 250, yaw: -12, pitch: -9 });   // aim raised: the number stands on clear page (VL 15.42)
    k.cam.keys([{ t: 0, view: on(-8.6, 1.0) }, { t: tTrav - 200, hold: true },
      { t: tTrav + 2600, view: on(S2.x + 0.8, 1.0), ease: "io" }, { t: D, hold: true, drift: false }]);   /* no drift: its push carried the coin off the bottom edge (pre-read 0050) */   // one move (VL 4.5): the track with the coach
    return {};
  },
});
