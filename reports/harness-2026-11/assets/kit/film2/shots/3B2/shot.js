// 3B2 · S then X · v2-shots-c. "Ask what that team decided, and an agent reads the top lines, opens one summary, and
// answers. It does not need the transcript." The move: a light runs across five top lines, drops into one summary and
// stops; the answer goes up to the chat (BLOCKING.md 3B2). The 3.5 s rest after the row is shot 3C2.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_c/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "3B2", type: "S", row: "3B2", dur: 10600, screens: ["chat-answer"],
  setup(k) {
    k.breathe();   // VL 15.89 b (v2-visuals 082838): every render from now; signed renders are not redone for it
    const C = window.SC, S1 = C.S1, V = C.V3, D = k.dur;
    const W = C.world(k, 3, { storeAt: -1e9 });
    // ruling 77: the question first. The chat docks small at the right at 0.9 s with the field coach lead's question; the
    // agent turns to the row within 0.5 s; the light runs one top at a time and drops into the fourth summary, which stays
    // yellow (the chat's chip is that yellow); the chat grows to Full for the answer, on "answers", for 3 s or more.
    // the row stands forward with bare floor behind it (143258 item 2); the reader close behind it (154700 item 2);
    // four meetings: the row fits x 96 to 1000 beside the docked chat at the S lens
    const y = -6.4, z = -1.9, xs = [0, 1, 2].map((i) => 1.0 + 0.735 * i);   // three meetings about 270 px wide each, so a lit top passes the prop bar (pre-read 1750); four at that size do not fit beside the docked chat
    C.crowd(k, W, { fitted: { board: -1e9, skills: -1e9, gates: -1e9 }, clear: [{ room: "store", x0: 0.3, x1: 5.8, z0: -5.0 }] });
    const QT = new URLSearchParams(location.search), m3dz = QT.has("m3dz") ? +QT.get("m3dz") : 0.4, m3dx = QT.has("m3dx") ? +QT.get("m3dx") : -0.05;   // 0.05 m west: 33 px clear of the docked chat (ruling 85 (d), 24 px; pre-read 0400 found 12)   // test hooks only (render_shot --qs); defaults are the built shot
    const zs = [z, z, z + m3dz];   // 03:50Z: the third 0.4 m forward, so its lit top's back edge stands against the stand's darker rows (prop_edge top 3: 93%, weakest 81%; at -0.35 it was 64%, back 25%)   // the third set back so its lit top's back edge stands against the stand's first row, not the pale tread (v2-check 005612)
    const L = xs.map((x, i) => C.meeting(k, [x + (i === 2 ? m3dx : 0), y, zs[i]], { w: 1.9 * 0.355 }));   // the kit's meeting (VL 15.64)
    // ruling 85 item 2: the four on the floor came from the stand: four places stand empty from frame 0, 3B1's (2) among them
    [4, 5, 6].forEach((i) => W.stand.empty(i));   // 6 is 3B1's place; the three on the floor came from these   // the same object as 3B1's meeting
    const tTop = C.at(k, "3B2.1", "top lines", 250), tOne = C.at(k, "3B2.1", "one summary", 200);
    const tAns = C.at(k, "3B2.1", "answers", 200), tNeed = C.at(k, "3B2.1", "transcript", 600), tEnd = C.end(k, "3B2.1");
    const tDock = 900, tGrow = Math.min(tAns - 600, tOne + 600), tBack = Math.min(D - 1000, tEnd - 1000);
    // the reader stands behind the row, visor to us (VL 15.55), two thirds of it above the tops
    const zr = -2.45, a = k.agent({ at: [xs[0] + 0.2, y, zr], face: 0.35, name: "reader" });
    a.act(tDock + 200, "look"); a.turn(tDock + 700, 300, 0.25);
    // it walks to the middle of the row before the light runs, then reads along it: its turn follows the lit top, and it
    // looks up to us only as the answer goes out (v2-lead 154518)
    const ax = xs[1];   // behind the middle meeting
    a.walk(tTop - 1300, 900, [[ax, zr]], { face: 0.3 });
    xs.forEach((x, i) => a.turn(tTop + 220 * i - 100, 220, Math.max(-0.75, Math.min(0.75, Math.atan2(x - ax, z - zr)))));
    a.turn(tOne - 250, 250, Math.max(-0.75, Math.min(0.75, Math.atan2(xs[1] - ax, z - zr)))).reach(tOne, 450, V([xs[1], y + 0.2, z - 0.1]), { hand: "R", hold: 700 });
    a.turn(tGrow - 300, 350, 0.2);   // looks up as the answer goes out
    const SIDE = 0xC99A2E;   // (b), board 20261112T005517 and v2-check 005612: a lit part on a step takes the yellow in deeper shade on its sides
    const spans = xs.map((x, i) => ({ li: 0, t0: tTop + 220 * i, t1: tOne - 380, side: SIDE }));   // the tops go out before the summary lights (pre-read 2005)   // ruling 85 item 3: each top stays lit until the summary lights, so all four are seen lit together
    L.forEach((g, i) => { C.litSolid(k, g, [spans[i]]); k.cue(spans[i].t0, "tick-soft"); });
    C.litSolid(k, L[1], [{ li: 1, t0: tOne, t1: tGrow + 650, side: SIDE }]);   // the light drops into the middle meeting's summary
    k.cue(tOne, "stick");
    const scr = k.screen("chat-answer", { t0: tDock, to: { x: 984, y: 300, w: 840, h: 441 }, fit: "cover", events: { q: 0, typing: Math.max(0, tTop - tDock), ans: tAns + 300 - tDock, src: Math.max(tAns + 1000 - tDock, tNeed - tDock), thanks: 9e9 }, opt: { dock: [0, tGrow - tDock] } });
    scr.pushIn(tDock, 600, { from: { x: 1420, y: 520, w: 60, h: 34 } }); scr.full(tGrow);   // Full to the cut: no faded panel left in the room (154700 item 1, check batch 69)
    locator(k, { room: "store", from: 0, to: tGrow });   // VL 15.76: it leaves as the chat grows to Full
    k.cue(tDock, "message"); k.cue(tGrow, "whoosh"); k.cue(tAns + 300, "message");
    k.cam.keys([
      { t: 0, view: k.cam.on(V([(xs[0] + xs[2]) / 2 + 1.26, y + 0.55, -2.3]), { size: "room", px: 270, yaw: -14, focus: V([xs[1], y + 0.3, (z + zr) / 2]) }) },   // one focus for the reader and the row
      { t: D + 1, hold: true },
    ]);
    return {};
  },
});
