// 3B1 · S to N · v2-shots-c. "Here is that shape again. A short summary first, and more depth only when needed. It is
// called progressive disclosure. / Each meeting is stored in layers. On top, one line. Under it, a summary. At the bottom,
// every word." The move: stage one's layered shape (the kit part 1B7 uses, with its green trace) comes down to the store
// and is named; then the meeting the agent holds settles into the same shape, three levels (lead 082814 item 11).
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_c/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "3B1", type: "S", row: "3B1", dur: 20230,
  setup(k) {
    k.breathe();   // VL 15.89 b (v2-visuals 082838): every render from now; signed renders are not redone for it
    const C = window.SC, S1 = C.S1, V = C.V3, D = k.dur;
    const W = C.world(k, 3, { storeAt: -1e9 });
    const home = S1.R("store", 0.65, 0, -1.9);   // 0.25 m west of 0.9 so place 6's gap stands clear of the hero (ruling 85 item 1)   // 0.5 m nearer and 0.7 m along: the gap between two stacks, then floor, behind the top cap (120020 item 1)
    C.crowd(k, W, { fitted: { board: -1e9, skills: -1e9, gates: -1e9 }, clear: [{ room: "store", x0: 0.3, x1: 5.8, z0: -5.0 }] });
    const tAgain = C.at(k, "3B1.1", "shape again", 300), tShort = C.at(k, "3B1.1", "short summary", 200), tDepth = C.at(k, "3B1.1", "more depth", 200);
    const tName = k.row("3B1.1").end + 50, tLayers = C.at(k, "3B1.2", "stored in layers", 300);
    // the stage-one shape (S1.part = the kit's layers, as 1B7 builds it), down the east slot from the B1 east shelf
    const L = S1.part(k, "layers", [home.x, home.y, home.z], { tone: 0xEFE6D8 });
    // it comes in under the store ceiling, above the keeper's head, and drops onto its place (pre-read 1655: it slid through the keeper)
    const yC = home.y + 2.0, pth = new THREE.LineCurve3(V([home.x, home.y + 3.2, home.z]), home.clone());   // down the store's east slot, along under the ceiling, onto its place (pre-read 2000: it whipped along the top edge)
    k.each((t) => { const u = FILM.tw(t, tAgain + 500, tAgain + 1700, "io"); L.position.copy(pth.getPoint(u));   // drops once the keeper has passed behind its place (pre-read 2145)
      const sh = 1 - FILM.tw(t, tLayers - 350, tLayers + 150, "io"); L.scale.setScalar(Math.max(0.001, sh)); L.visible = sh > 0.002 && t >= tAgain + 500; });   // unseen until its drop begins (pre-read 2255)   // it shrinks away in 500 ms as the meeting rises (pre-read 1655: it vanished in one frame)
    C.litSolid(k, L, [{ li: 0, i: 0, t0: tShort, t1: tDepth - 380 }, { li: 1, i: 3, t0: tDepth, t1: tLayers - 380 }]);   // VL 15.54, one at a time
    L.trace(tName - 900);
    k.cue(tName - 900, "trace");
    // v2-check 115914 item 2: the card lands on "progressive" and holds name and gloss whole for 2 s or more
    const tCard = C.at(k, "3B1.1", "progressive", -450);   // ruling 97: t0 = "progressive" + 0.45 s, so the card starts to grow as the word starts
    k.ui.nameCard(tCard, { name: "progressive disclosure", gloss: "For people, a contents page before the chapters", from: L, t1: C.at(k, "3B1.2", "layers", 150), x: 930, y: 60 });   // y 60: 40 px or more above the front tier's caps (pre-read 1655); ruling 96: 3.5 s or more whole, gone before "layers"
    // ruling 83 item 5 / VL 15.64: on "stored in layers" one meeting is seen to come out of the stand (place 2, the one the
    // keeper read in 3A2), forward to the floor, growing to the hero's size; its place stays empty and in frame to the cut
    const fp6 = W.stand.front(6), a = k.agent({ at: [fp6.x - 1.2, home.y, fp6.z + 0.25], face: 0.6, name: "keeper" });   // where 3A2 left it   // whole in frame (COS 102926 item 3), level with the meeting so its visor is in focus (PRE_SIGN 3)
    // 3B1 opens on 3A2's last frame: the keeper by place 6, then it walks along the front to its place by the hero
        a.turn(0, 400, -0.45); a.walk(400, 1600, [[fp6.x - 1.4, fp6.z + 0.7], [home.x - 1.45, home.z - 0.8], [home.x - 1.45, home.z + 0.2]], { face: -0.45 });   // behind the hero's spot, never near the lens; faces the way it walks (pre-read 2000)
    a.idle(2000); a.turn(tLayers - 200, 350, 0.9);
    const PICK = 6, ST = W.stand; ST.take(PICK, tLayers); C.litSolid(k, ST.unit(PICK), [0, 1, 2].map((li) => ({ li, t0: -1e9, t1: 600, out: 500, side: 0xC99A2E })));   /* the same side tone as 3A2 ends (join) */    // opens lit, as 3A2 ends, and goes out over 350 ms
    const from = ST.point(PICK).clone(), M = C.meeting(k, [home.x, home.y, home.z], { w: 1.9 }), s0 = 0.8 / 1.9;
    from.y -= ST.H;   // point() is the top of the cap; the meeting's origin is its base
    k.each((t) => { const u = FILM.tw(t, tLayers, tLayers + 1300, "io"); M.visible = t >= tLayers;
      M.position.set(FILM.lerp(from.x, home.x, u), FILM.lerp(from.y, home.y, u) + 0.35 * Math.sin(Math.PI * u), FILM.lerp(from.z, home.z, u)); M.scale.setScalar(FILM.lerp(s0, 1, u));
      if (t < tLayers + 1400) M.steps.forEach((st) => st.m.emissive.setHex(C.MEET_TONE).multiplyScalar(0.3 * (1 - u))); });   // it leaves the stand in the stand's lift (set.js o.lift 0.3) and loses it over the rise, so the take does not snap cream to grey (pre-read 0400 #2, f344)
    k.cue(tLayers, "lift");
    locator(k, { room: "store", from: 0, to: D + 1 });   // VL 15.76
    const tTop = C.at(k, "3B1.2", "On top", 200), tSum = C.at(k, "3B1.2", "Under it", 200), tAll = C.at(k, "3B1.2", "every word", 200);
    C.litSolid(k, M, [{ li: 0, t0: tTop, t1: tSum - 380 }, { li: 1, t0: tSum, t1: tAll - 380 }, { li: 2, t0: tAll, t1: null }]);   // each step as it is named, one at a time
    const pinAt = (li) => () => C.stepPoint(M, li);
    k.ui.pin(tTop, { text: "one line", at: pinAt(0), side: "right", dx: 640, dy: 130 });   // leaders run over floor, under the front tier (pre-read 1655)   // labels on the bare east wall, x 1430+ (135123 item 1)
    k.ui.pin(tSum, { text: "the summary", at: pinAt(1), side: "right", dx: 640, dy: 135 });
    k.ui.pin(tAll, { text: "every word", at: pinAt(2), side: "right", dx: 640, dy: 108 });
    k.cam.keys([
      { t: 0, view: C.view3A2(k, W) },   // 3A2's last frame
      { t: 300, hold: true },
      // while the name card is up, a framing with bare wall above the stand, so the card lies on wall (pre-read 1750)
      { t: tAgain + 1800, view: k.cam.on(V([home.x + 0.35, home.y + 1.15, home.z + 0.1]), { size: "room", px: 230, yaw: -12, pitch: -9, focus: home }), ease: "io" },
      { t: C.at(k, "3B1.2", "layers", 150), hold: true },   // held while the card is up (pre-read 2000)
      { t: C.at(k, "3B1.2", "layers", 150) + 700, view: k.cam.on(V([home.x + 0.35, home.y + 0.6, home.z + 0.3]), { size: "room", px: 300, yaw: -12, pitch: -21, focus: home }), ease: "io" },   // pitch -17: the white tops show, so the steps read
      { t: D + 1, hold: true },
    ]);
    return {};
  },
});
