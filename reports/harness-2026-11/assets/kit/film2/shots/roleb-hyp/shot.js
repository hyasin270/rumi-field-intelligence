// roleb-hyp · S · lane roleb (s23 Ship on a hypothesis). A table set: a board of eight cards; the operator and an FSB walk
// up from either side. Presses 2 to 5: the camera closes on each ingredient card as it goes up (the card words about 72 px
// at 1920, 48 at 1280), the card in play carries an amber frame, and the operator walks along the board to stand by it and
// point. Press 6: the camera pulls back and to the right so the whole board sits left of the scene's list (x 0 to 1100);
// the lesson-plan row goes up. Press 7: that row turns over to the quizzes-at-home example.
FILM.shot({
  id: "roleb-hyp", type: "S", dur: 18600,
  setup(k) {
    k.breathe();
    const tw = FILM.tw;
    const S = k.set.table({ w: 13, d: 6 });
    const B = S.add("board", { at: [0, 0, -2.4], cards: [2, 4], cardW: 1.55, cardH: 0.95, gap: 0.09, y: 0.45, labelPx: 150 });
    const cards = B.userData.cards;
    const TOP = ["What you see", "Why, in their words", "What might help", "If… then…"];
    const LP = ["11 to 16 pages each", "Too long for a phone", "Pages for the phone", "Then more get used"];
    const QZ = ["No learning data", "No way to collect it", "A quiz sent home", "Then scores come back"];
    TOP.forEach((s, i) => B.label(i, s));
    LP.forEach((s, i) => B.label(4 + i, s));
    // card centres (board at z -2.4, cards 0.1 in front): x per column, y per row
    const CX = [-2.455, -0.815, 0.825, 2.465], Y0 = 2.165, Z = -2.3;
    const tTop = [3900, 6300, 8600, 10900], tLP = 13600, tQZ = 16000;
    QZ.forEach((s, i) => B.flip(4 + i, tQZ + i * 140, [s], { hold: 1e9, px: 150 }));
    const reveal = cards.map((c, i) => (i < 4 ? tTop[i] : tLP + (i - 4) * 160));
    // the card in play: an amber frame (the board's own frame, VL amber), from its press to the next; no tags
    const litTo = [tTop[1], tTop[2], tTop[3], tLP - 400];
    k.each((t) => cards.forEach((c, i) => {
      const u = tw(t, reveal[i], reveal[i] + 420, "back"), d = c.userData;
      c.visible = t >= reveal[i]; c.scale.setScalar(Math.max(0.001, u));
      d.tag.visible = false; d.fr.visible = i < 4 && t >= reveal[i] && t < litTo[i];
    }));
    // the people: the operator walks along the board to each card; the FSB keeps the right end
    const op = k.person({ at: [-7.2, 0.0, -0.6], face: Math.PI / 2, settle: 300, blend: 300 });
    const fsb = k.person({ at: [7.2, 0.0, -0.6], face: -Math.PI / 2, settle: 300, blend: 300 });
    op.walk(150, 2300, [[-4.0, -1.3]]); op.turn(2500, 400, 0.95);
    fsb.walk(350, 2300, [[4.0, -1.3]]); fsb.turn(2700, 400, -0.95);
    let prev = [-4.0, -1.3];
    tTop.forEach((t0, i) => {
      const to = [CX[i] - 0.95, -1.3];
      if (i > 0) { op.walk(t0 - 700, 800, [to]); op.turn(t0 + 120, 300, 0.95); }
      else { op.walk(t0 - 500, 600, [to]); op.turn(t0 + 120, 300, 0.95); }
      op.pose(t0 + 250, "point", { blend: 300 }); op.pose(t0 + 1700, "stand", { blend: 300 });
      prev = to;
    });
    fsb.pose(tTop[2] + 200, "hand-up", { blend: 300 }); fsb.pose(tTop[2] + 1500, "stand", { blend: 300 });
    fsb.pose(tTop[3] + 300, "point", { blend: 300 }); fsb.pose(tTop[3] + 1600, "stand", { blend: 300 });
    // the examples (round 4): the board sinks away (the scene's panel carries the example); the operator and the FSB meet
    // in the middle and talk it through, the operator pointing for the lesson plans, the FSB for the quizzes
    k.each((t) => { const u = tw(t, tLP - 900, tLP - 150, "in"); B.position.y = -3.2 * u; B.visible = u < 0.999; });
    op.walk(tLP - 900, 1300, [[-1.05, -1.6]]); op.turn(tLP + 420, 300, 1.25);
    fsb.walk(tLP - 800, 1300, [[1.05, -1.6]]); fsb.turn(tLP + 520, 300, -1.25);
    op.pose(tLP + 800, "point", { blend: 300 }); op.pose(tLP + 2200, "stand", { blend: 300 });
    fsb.pose(tQZ + 100, "point", { blend: 300 }); fsb.pose(tQZ + 1600, "stand", { blend: 300 }); op.pose(tQZ + 300, "hand-up", { blend: 300 }); op.pose(tQZ + 1500, "stand", { blend: 300 });
    tTop.forEach((t0) => k.cue(t0, "tick")); k.cue(tLP, "pages"); k.cue(tQZ, "pages");
    const pose = (look, dist, yaw, pitch) => ({ pose: { look, dist, yaw: yaw == null ? -8 : yaw, pitch: pitch == null ? -7 : pitch } });
    const close = (i) => pose([CX[i] + 0.2, 1.42, Z], 9.0, -8, -6);
    // the board left of x 1100 with both people: look right of the board's centre, pulled back
    const wideL = (d, y) => pose([3.4, y || 1.35, -2.0], d || 28, -8, -9);
    k.cam.keys([
      Object.assign({ t: 0 }, pose([0, 1.3, -2.0], 30, -14, -12)),
      Object.assign({ t: 2900, ease: "io" }, pose([0, 1.3, -2.0], 19.5, -8, -9)),
      { t: tTop[0] - 500, hold: true, drift: false },
      Object.assign({ t: tTop[0] + 900, ease: "io" }, close(0)),
      { t: tTop[1] - 500, hold: true, drift: false },
      Object.assign({ t: tTop[1] + 600, ease: "io" }, close(1)),
      { t: tTop[2] - 500, hold: true, drift: false },
      Object.assign({ t: tTop[2] + 600, ease: "io" }, close(2)),
      { t: tTop[3] - 500, hold: true, drift: false },
      Object.assign({ t: tTop[3] + 600, ease: "io" }, close(3)),
      { t: tLP - 900, hold: true, drift: false },
      Object.assign({ t: tLP + 1100, ease: "io" }, pose([1.8, 0.85, -1.6], 12, -8, -8)),
      { t: tQZ - 300, hold: true, drift: false },
      Object.assign({ t: tQZ + 1300, ease: "io" }, pose([1.7, 0.8, -1.6], 11.2, -11, -8)),
      { t: 18601, hold: true },
    ]);
    return { B };
  },
});
