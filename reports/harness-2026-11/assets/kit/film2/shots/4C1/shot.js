// 4C1 · W to N · v2-shots-d. "The board, the skills, the hooks, the judges. All of it sits around the AI model, and it has a name.
// The harness." The move: the pull back to W-centre; each room lights on its word; the model glows; the bracket draws (VL 10.7).
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_d/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "4C1", type: "W to N", row: "4C1", dur: 12000,
  setup(k) {
    const S = window.SD, P = S.P, D = k.dur;
    const w = (x, fb) => S.w(k, "4C1.1", x, fb);
    const tB = w("board", 470), tS = w("skills", 1440), tH = w("hooks", 2630), tJ = w("judges", 3820), tAll = w("all", 4680), tModel = w("model", 7010), tName = w("name", 8460);
    const tEnd = (k.row("4C1.1") || { end: 10630 }).end, tLand = 0;   // VL 15.71: S (4B5) to W is a hard cut, no pull back
    const W = S.world(k, { judge: -1e9 }); S.hide(k, W.parts.bar); S.hide(k, W.parts.judge);
    const C = S.crowd1(k, W, { avoid: S.B3avoid.concat(S.blockAvoid) });   // W: the judge's room keeps its 50 (VL 15.71); nobody in the desk, the booth or the block   // the one file at the booth (v2-visuals 145700 item 4)
    S.judgeRoom(k, { barAt: -1e9, pile0: 3 }); S.slots(k);
    k.agent({ at: S.B3.judge, face: Math.PI / 2 - 0.7, name: "judge" }).act(0, "write");
    // the docked labels so far (VL 10.4), shown as the camera lands; evals docks on "the judges"
    const DK = [["beads", "a shared job board", "board", "west"], ["skills", "how we work,<br>written down", "skills", "east"], ["hooks", "what must never<br>happen unchecked", "gates", "west"]];
    // board 030158 (option C, cold Cut 1 item 5): each label docks as the voice names its room, with that room's glow; "the note taker" is not in the list said, so it is not docked
    DK.forEach(([tx, gl, r, side], i) => k.ui.dock(Math.max(tLand + 200, [tB, tS, tH][i] - 150), { text: tx, at: W.side(r), side }));   // names only (ruling 113 D); one at a time after the cut (pre-read 1634)
    k.ui.dock(Math.max(tJ - 150, tLand + 200), { text: "evals", at: W.side("judge"), side: "west" });
    [["board", tB], ["skills", tS], ["gates", tH], ["judge", tJ]].forEach(([r, t0]) => W.glow(r, Math.max(t0 - 150, tLand), 300, 1.3));
    S.seat(k); S.model(k, { at: P.core, size: 3, pulses: [tModel - 100] }); k.ui.dock(tModel + 100, { text: "the model", at: [P.core[0] + 1.55, P.core[1] - 1.3, P.core[2] + 1.4], side: "east", y: 690 });   // VL 15.40; stays lit into 4C2
    // ai_fast-4c (v2-shots-b 052608, ruling 165 b): the card gives way to the docked label 400 ms before the cut, so the label is whole
    // at 4C2's f000; v10, ai and op (D 12 s and more) keep tEnd + 1400
    const X = D < 11000 ? D - 400 : tEnd + 1400;
    S.harness(k, { t0: tName - 500, dur: 900, labelX: 1520, labelAt: X, pulses: [X - 350] });
    k.ui.nameCard(S.nameEnd(k, "4C1.1", tEnd + 50), { name: "the harness", t1: X, x: 96, y: 60 });   // v2-visuals 180519: top left, the named exception
    k.cue(tName - 500, "draw");
    const WR = k.cam.on([-2.04, -3.4, -2.2], { size: "wide", yaw: -14, pitch: -12, px: 0.78 * 1080 / (2 * Math.tan(Math.PI / 18) * 62) });   // v2-visuals 180519: the building 100 px right of W-centre, room for the card
    roomRing(k, W, "judge", 0, 300, { fade: 0 }); roomRing(k, W, "judge", 0, 600, { fade: 300 });   // hard on with the cut, eased off over the last 300 ms   // VL 15.76: out of B3 west, hard on with the cut, eased off
    k.cam.keys([{ t: 0, view: WR }, { t: D, hold: true, drift: false }]);
    return {};
  },
});
