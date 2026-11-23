// 4B4 · X · v2-shots-d. "Beside every score it writes its reason, and quotes the line."
// The judge writes its note at the desk; the note grows to Full (VL 14.11) while it is read and goes back into the desk in the last
// 1.5 s, so the judge is seen whole before and after. v2-screens judge-note (REBUILT, "An example"), events on k.word.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_d/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "4B4", type: "X", row: "4B4", dur: 9000, screens: ["judge-note"],
  setup(k) {
    const S = window.SD, B = S.B3, D = k.dur, y = -9.6;
    const w = (x, fb) => S.w(k, "4B4.1", x, fb);
    const W = S.world(k, { judge: -1e9 }); S.hide(k, W.parts.bar); S.hide(k, W.parts.judge);
    const C = S.crowd1(k, W, { override: S.judgeFile(W, { n: 1, atHead: true }), clear: S.judgeClear, avoid: S.B3avoid });   // the one file at the booth (v2-visuals 145700 item 4)
    S.judgeRoom(k, { strips: [], pile0: 3 });   // the three tabs from 4B2 and 4B3 (ruling 102)
    const judge = k.agent({ at: B.judge, face: Math.PI / 2 - 0.7, name: "judge" });
    S.folder(k, { at: [B.deskTop[0], B.deskTop[1], B.hatchZ - 0.4], h: 0.16 });
    // pre-read 2320 (join from 4B3): the desk as 4B3 leaves it, 4B2's marked page with its dots, page one on it, page two on top (the note)
    const onDesk = [B.deskTop[0], B.deskTop[1] + 0.02, B.hatchZ + 0.15], top1 = [onDesk[0], onDesk[1] + 0.02, onDesk[2]], top2 = [onDesk[0] + 0.03, onDesk[1] + 0.04, onDesk[2] - 0.03];
    S.page(k, { at: onDesk, show: 0, scale: 1.3 }); S.page(k, { at: top1, show: 0, scale: 1.3 });
    for (let d = 0; d < 4; d++) { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.01, 20), KIT.parts.mat(d < 3 ? "coral" : "grey")); m.position.set(onDesk[0] - 0.15 + d * 0.1, onDesk[1] + 0.03, onDesk[2] + 0.12); k.scene.add(m); }
    const note = S.page(k, { at: top2, show: 0, scale: 1.3 });
    // pre-read 1634: the panel grows from frame 0 over 450 ms with its content in it; the booth does not drift between its two looks
    // ai_fast-4c (ruling 165 b, pre-read 0720): at 4.13 s the quote and the highlight fell after the push-out; the fast branch puts the
    // quote on "and" and the highlight on "quotes", and times the push-out from the highlight; v10, ai and op (5.5 s and more) keep theirs
    const FAST = D < 5000, tQ = FAST ? w("and", 2970) - 150 : w("quotes", 2970), tHL = FAST ? w("and", 2970) : w("line", 3550) - 150;   // v2-visuals 082703: the highlight on "and quotes" so it holds 0.5 s and the room 0.5 s before the cut
    const tPO = FAST ? tHL + 900 : D - 1600, msPO = FAST ? 350 : 900;   // the highlight eases in 400 ms (judge-note screen.js:88), then holds 0.5 s whole before the push-out   // v2-check 082614: the quote and the highlight stand 0.5 s or more before the push-out
    const scr = k.screen("judge-note", { t0: 0, to: "full", events: { page: 0, note: w("beside", 300) + 400, score: w("score", 960), why: w("reason", 2010), quote: tQ, hl: tHL, push: 4400 } });
    scr.pushIn(0, 700, { from: note.g }).pushOut(tPO, msPO, { to: note.g });
    k.cue(w("beside", 300) + 400, "message"); k.cue(tHL, "highlight");
    locator(k, { room: "judge", from: 0, to: 70 }); locator(k, { room: "judge", from: tPO + 110 });   // VL 15.76: the map is away while the panel is up, back with the room
    k.cam.keys([{ t: 0, view: k.cam.on(S.B3V.look, S.B3V) }, { t: D, hold: true, drift: false }]);
    return {};
  },
});
