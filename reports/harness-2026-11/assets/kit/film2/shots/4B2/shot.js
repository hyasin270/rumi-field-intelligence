// 4B2 · S to N · v2-shots-d. "So a second AI model marks the work against it. A check like this is called an eval."
// Ruling 98 and v2-visuals 145700 / 145800 / 153507 (re-blocked 16:15Z). The picture keeps up with the words:
// - 0 s: 4B1's last frame, the speaker holding the book in both hands at the east slot. The book goes into the slot; the camera drops
//   with it to B3 west and lands by 1.5 s, the booth already installing and the judge in frame.
// - the standard: a carrier on the judge's room side takes the book from the partition hatch, carries it along the front and puts it
//   through the booth hatch onto the judge's desk.
// - the work: the head of the queue (one file along the front, 0.62 m apart) hands one page into the hatch; its short coral tab is seen
//   to come off into the tray (ruling 92); the page goes through to the desk.
// - the judge reads, and the first coral score dot is down by 3.8 s; "an eval" on name_end, clear of the booth wall.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_d/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "4B2", type: "S to N", row: "4B2", dur: 9000,
  setup(k) {
    const S = window.SD, B = S.B3, D = k.dur, y = -9.6, H = S.HOLD, st = H.at, FAST = D < 9000;   // ai_fast-4c (ruling 166): the card on the name's first word
    const tIn = 400;   // the booth installs while the camera drops, so it has landed when the camera arrives
    const tP = 2550, tTab = tP + 600;   // the head of the file hands the page in; its tab comes off
    const W = S.world(k, { judge: tIn }); S.hide(k, W.parts.bar); S.hide(k, W.parts.judge);
    const C = S.crowd1(k, W, { override: S.judgeFile(W, { n: 0 }), clear: S.judgeClear, avoid: S.B3avoid });
    S.slots(k); S.mountain(k, S.P.mountain, { n: 54 });
    const J = S.judgeRoom(k, { installAt: tIn, shutter: [[2500, 0]], pile0: 0, strips: [tTab + 100] });   // the resting tab shows as the flight lands (strips show 300 ms after their time)   // the tab stays in the tray
    // the speaker: as 4B1 ends, the book in both hands at the east slot; it goes into the slot
    const spk = S.people(W); spk.at(0, [st[0], 0, st[1]], H.face).pose(0, "carry");
    const hand = [st[0] - 0.05, 0.95, st[1] + 0.35], top = [1.0, 0.1, -0.32], sb3 = [1.0, y + 1.0, -0.32], ph = [-0.5, y + 0.9, -1.4];
    const bh = [B.wallX + 0.15, y + 0.505, B.hatchZ], folderAt = [B.deskTop[0], B.deskTop[1], B.hatchZ - 0.4];
    // pre-read 2010 and VL 15.71: a hard cut from the pavilion to B3 west at 0.7 s (no fall through two rooms). The book goes into the
    // slot and out of sight; after the cut a carrier comes in from the right, behind the file, holding it, puts it through the booth hatch
    // and leaves the same way, whole out of the frame. Every walk linear.
    // pre-read 2235: the book never leaves the hands in the pavilion; it is held, still, to the hard cut at 0.45 s (nothing sinks alone)
    const tCut = 450, cIn = [-0.45, -2.1], cB = [-3.65, -1.95], tGo = tCut, tPut = tCut + 1250, tDesk = tPut + 300;
    const carrier = k.agent({ at: [cIn[0], y, cIn[1]], face: -Math.PI / 2, name: "carrier" });
    // pre-read 0135: the carrier walks three-quarter to us (never its back), turns in even steps, and leaves the same way
    carrier.walk(tGo, tPut - tGo - 50, [cB], { ease: "lin", face: -Math.PI / 2 + 0.5 }).reach(tPut - 100, 375, bh, { hand: "R", hold: 200 })
      .walk(tDesk + 650, 1150, [cIn], { ease: "lin", face: Math.PI / 2 - 0.5 }).hide(tDesk + 1820);
    S.turnLin(carrier, tPut - 550, 500, -Math.PI / 2 + 0.5, -Math.PI / 2 + 0.6); S.turnLin(carrier, tDesk + 50, 300, -Math.PI / 2 + 0.6, -0.3);   /* pre-read 0405: turned further to the lens, so the rising book passes beside the visor */   // pre-read 0230: it stays three-quarter to the lens at the hatch, so its visor is seen S.turnLin(carrier, tDesk + 350, 300, -0.3, Math.PI / 2 - 0.5);
    const F = S.folder(k, { h: 0.16, show: 0, at: hand });
    // after the cut the carrier holds it at sill height; from its hand it slides flat onto the sill (VL 15.82), then through to the desk
    F.hold(tCut, tPut, carrier, [0, 0.2, 0.46], [400, bh])   /* pre-reads 0230 and 0345: held at the waist, well under the visor; it rises to the sill as it goes in */.fly(tDesk, 1, bh, bh, { arc: 0 }).fly(tDesk, 350, bh, folderAt, { arc: 0, ease: "lin" });
    // the head of the queue hands the work in: one page with its tab; the tab comes off at the hatch into the tray (ruling 92)
    const atHatch = [B.wallX + 0.1, y + 0.56, B.hatchZ], inHand = [B.head[0] - 0.3, y + 0.45, B.head[2] + 0.05], onDesk = [B.deskTop[0], B.deskTop[1] + 0.02, B.hatchZ + 0.15];
    const mk = k.agent({ at: B.head, face: -Math.PI / 2 + 0.7, name: "maker" });
    { const mk2 = k.agent({ at: [B.head[0] + 0.8, y, B.head[2]], face: -Math.PI / 2 + 0.6, name: "maker2" }); S.page(k, { show: 0, tab: true, scale: 1.3, at: [B.head[0] + 0.5, y + 0.24, B.head[2] + 0.1] }).hold(-1e6, 1e9, mk2, S.MK_LOCAL); }   // place 1, its work in hand (pre-read 2055)
    mk.reach(tP - 400, 600, atHatch, { hand: "R", hold: 300 });   // pre-read 2320: over 600 ms, no one-frame reach
    const pg = S.page(k, { show: 0, tab: true, tabOff: tTab + 130, scale: 1.3 });   // the flying tab is out before the page's own goes (pre-read 0055)
    // pre-read 0020: the page rides the reaching hand itself (the arm cannot stretch to the hatch), then slides from the hand into it
    pg.hold(-1e6, tP - 400, mk, S.MK_LOCAL).hold(tP - 400, tP + 200, mk, "R", 0, 300, [400, atHatch]).fly(tP + 600, 300, atHatch, onDesk, { arc: 0, ease: "lin" });   // from the hand's own place into the hatch, then through it
    S.mark(k, { colour: "coral", t0: tTab, dur: 400, from: atHatch, to: J.pilePoint(0), arc: 0.06, scale: 0.45 });   // lands where it rests (ruling 102)
    // the judge: in frame from 0.7 s; reads the page, the first coral dot down by 3.8 s
    const judge = k.agent({ at: B.judge, face: Math.PI / 2 - 0.7, name: "judge" }); judge.hide(0).show(tCut - 50);
    // pre-read 2345: a kit reach lets go over 0.8 of its length, eased, so 700 ms reads as a hand easing off, not a snap
    judge.reach(tTab - 300, 1100, onDesk, { hand: "L", hold: 1900 });   // the hand on the page while it marks; no "read" act, so nothing covers the visor
    const tMark = 3450;
    const dots = []; for (let d = 0; d < 4; d++) { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.01, 20), KIT.parts.mat(d < 3 ? "coral" : "grey")); m.position.set(onDesk[0] - 0.15 + d * 0.1, onDesk[1] + 0.03, onDesk[2] + 0.12); k.scene.add(m); dots.push(m); }
    k.each((t) => dots.forEach((m, d) => (m.visible = t >= (d < 3 ? tMark + d * 90 : tMark))));
    k.cue(0, "drop"); k.cue(tIn, "install"); k.cue(tPut, "hatch"); k.cue(tTab, "tab"); k.cue(tMark, "stamp");
    k.ui.nameCard(FAST ? S.nameLead(k, "4B2.1", 6300) : S.w(k, "4B2.1", "eval", 6500), Object.assign({ name: "an eval", stamp: "For people, an appraisal", x: 190, y: 205, t1: D - 300 }, FAST ? { t1: D - 30, rise: 150, lineAt: 0 } : {}));   /* ruling 167 (4), 168: the fast card leads by up to 0.3 s, rises in 150 ms, its line with it, to the cut */   /* ruling 138 (d): the card on its word ("eval", as 4B3 lands on "blind", v2-lead 114845); gone 0.3 s before the cut (v2-visuals 103709). The signed v10 render keeps its own folder */   // v2-check 033136: whole about 3.5 s, to the cut
    const camTop = k.cam.on([2.75, 1.1, -1.7], { size: "close", px: 380, height: 1.15, focus: [2.6, 1.0, -1.6] });
    locator(k, { room: "pav", changes: [[tCut, "judge"]] });   // VL 15.76: the cut to B3 west
    k.cam.keys([{ t: 0, view: camTop }, { t: tCut - 1, hold: true, drift: false }, { t: tCut, view: k.cam.on(S.B3V.look, S.B3V), cut: true }, { t: D, hold: true, drift: false }]);
    return { W, J, C };
  },
});
