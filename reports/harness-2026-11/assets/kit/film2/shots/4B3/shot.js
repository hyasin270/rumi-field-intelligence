// 4B3 · S to N · v2-shots-d. "The second model gets the work and the standard, and nothing else. It is called a blind judge."
// The booth turned a quarter (VL 15.20): the wall end-on, the maker east of it, the judge west of it, in one glance. At the hatch the
// maker's coral strip comes off and drops into the tray; the page goes through to the judge, who lays a hand on the folder (the
// standard); on "nothing else" the shutter closes. While "a blind judge" is lit, a second page: the strip leaves first, then the judge
// looks (v2-lead 081626, v2-visuals 081649 item 4).
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_d/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "4B3", type: "S to N", row: "4B3", dur: 11000,
  setup(k) {
    const S = window.SD, B = S.B3, D = k.dur, y = -9.6, FAST = D < 9000;   // ai_fast-4c (ruling 165 b, 166): the card on the name's first word; maker3 in sooner
    const tWork = S.w(k, "4B3.1", "work", 1570), tStd = S.w(k, "4B3.1", "standard", 2450), tNothing = S.w(k, "4B3.1", "nothing", 3780);
    const tName = S.nameEnd(k, "4B3.1", 7600);
    const W = S.world(k, { judge: -1e9 }); S.hide(k, W.parts.bar); S.hide(k, W.parts.judge);
    const t1 = tWork - 900, t2 = tName + 150;
    const tA = Math.max(t1, 1350);   // page one is handed in by maker2, once it has stepped up
    // the one file as 4B2 leaves it; the maker2 actor holds place 1, the next member steps up when the maker leaves
    const C = S.crowd1(k, W, { override: S.judgeFile(W, { n: 1, skip: 1 }), clear: S.judgeClear, avoid: S.B3avoid });
    const atHatch = [B.wallX + 0.1, y + 0.56, B.hatchZ], onDesk = [B.deskTop[0], B.deskTop[1] + 0.02, B.hatchZ + 0.15], folderAt = [B.deskTop[0], B.deskTop[1], B.hatchZ - 0.4];
    const tr = [B.tray[0], y + 0.46, B.tray[2]], top1 = [onDesk[0], onDesk[1] + 0.02, onDesk[2]], top2 = [onDesk[0] + 0.03, onDesk[1] + 0.04, onDesk[2] - 0.03];
    const J = S.judgeRoom(k, { shutter: [[tA - 300, 0], [tNothing, 1], [t2 - 300, 0], [t2 + 900, 1]], pile0: 1, strips: [tA + 450, t2 + 450] });   // 4B2's tab is already there
    // pre-read 1634 for every page: it grows in the maker's hands over 300 ms; it rides in those hands under the visor; the hand puts
    // it into the hatch (low, clear of the post); the tab is seen to go into the tray and stays there; the page slides flat onto the desk
    // and stays on the desk, the judge's hand on it. Ruling 91: grey lines only; ruling 92: the tab.
    const pageAt = (t0, maker, land, show) => { const pg = S.page(k, { show: show || 0, scale: 1.3, tab: true, tabOff: t0 + 680 });
      pg.hold(-1e6, t0 - 450, maker, S.MK_LOCAL).hold(t0 - 450, t0 + 150, maker, "R", 0, 300, [400, atHatch]).fly(t0 + 550, 300, atHatch, land, { arc: 0, ease: "lin" }); return pg; };
    // pre-read 0020: the page rides the reaching hand itself, then slides from the hand into the hatch   // pre-read 2320: the arm reaches over 600 ms; straight through the slot in 270 ms
    // pre-read 2235: the page leaves with the reach (the hand arrives at t0 + 150), above the tray table, never from below it
    const tabOff = (t0, idx) => S.mark(k, { colour: "coral", t0: t0 + 550, dur: 400, from: atHatch, to: J.pilePoint(idx), arc: 0.06, scale: 0.45 });   // lands where it rests (ruling 102)
    S.folder(k, { at: folderAt, h: 0.16 });
    // 4B2's marked page with its three coral dots stays where 4B2 left it; page one lands on top of it
    { S.page(k, { at: onDesk, show: 0, scale: 1.3 }); for (let d = 0; d < 4; d++) { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.01, 20), KIT.parts.mat(d < 3 ? "coral" : "grey")); m.position.set(onDesk[0] - 0.15 + d * 0.1, onDesk[1] + 0.03, onDesk[2] + 0.12); k.scene.add(m); } }
    const judge = k.agent({ at: S.B3.judge, face: Math.PI / 2 - 0.7, name: "judge" });
    // pre-read 2345: one reach at a time (a later reach takes the arms at once), each 700 ms, so each hand eases on and off
    { const r1 = tA + 300, r2 = Math.max(tStd - 200, r1 + 1100 + 880); judge.reach(r1, 1100, top1, { hand: "L", hold: 0 }).reach(r2, 1100, [folderAt[0], folderAt[1] + 0.18, folderAt[2]], { hand: "R", hold: 1200 }); }
    // pre-read 2055: no page appears from nothing. As 4B2 ends, the head (empty-handed) leaves behind the file; maker2 (place 1, its page in
    // hand since 4B2) steps up and hands page one; a third maker walks in from the right with page two and stays at the head (as 4B4 opens)
    const mk = k.agent({ at: B.head, face: -Math.PI / 2 + 0.7, name: "maker" });
    // pre-read 2235: the head keeps 4B2's last turn on the cut, then turns to us over 350 ms before it walks
    mk.turn(0, 350, 0.4).walk(350, 1300, [[-3.2, -2.1], [-0.6, -2.1]], { face: 0.4, ease: "lin" }).hide(1660);
    const mk2 = k.agent({ at: [B.head[0] + 0.8, y, B.head[2]], face: -Math.PI / 2 + 0.6, name: "maker2" });
    mk2.walk(200, 650, [[B.head[0], B.head[2]]], { ease: "lin" }).turn(850, 300, -Math.PI / 2 + 0.7).reach(tA - 450, 600, atHatch, { hand: "R", hold: 250 })
      .walk(tA + 500, 1300, [[-3.2, -2.1], [-0.6, -2.1]], { face: 0.4, ease: "lin" }).hide(tA + 1810);
    const tC = FAST ? Math.max(tA + 1300, t2 - 1600) : Math.max(tA + 1900, tNothing + 1300), mk3 = k.agent({ at: [-0.75, y, B.head[2]], face: -Math.PI / 2, name: "maker3" }); mk3.hide(0).show(tC);
    mk3.walk(tC, FAST ? Math.max(900, t2 - 500 - tC) : Math.min(1900, t2 - 500 - tC), [[B.head[0], B.head[2]]], { ease: "lin" }).reach(t2 - 450, 600, atHatch, { hand: "R", hold: 250 }); S.turnLin(mk3, t2 - 650, 500, -Math.PI / 2, -Math.PI / 2 + 0.7);
    pageAt(tA, mk2, top1); tabOff(tA, 1); k.cue(tA + 550, "tab"); k.cue(tNothing, "shutter");
    // page two, during the name card: the tab leaves first, then the judge looks, still turned to us
    pageAt(t2, mk3, top2, tC); tabOff(t2, 2); k.cue(t2 + 550, "tab");
    // pre-read 2345: no "look" here (its arms left the page in one frame)
    k.ui.nameCard(FAST ? S.nameLead(k, "4B3.1", tName) : S.w(k, "4B3.1", "blind", 7090), Object.assign({ name: "a blind judge", stamp: "For people, an external examiner", x: 1060, y: 180, t1: D - 300 }, FAST ? { t1: D - 30, rise: 150, lineAt: 0 } : {}));   /* ruling 167 (4), 168 */   /* v2-visuals 103709: a name card is gone 0.3 s before the cut (check 15); its fade ends at t1. v2-lead 114845 (rulings 95, 96): it lands on "blind", the name's first word; the chime follows the card */   // v2-check 033136: whole about 3.5 s, to the cut. Clear of the partition (pre-read 1634)
    const v = k.cam.on(S.B3V.look, S.B3V);
    locator(k, { room: "judge" });   // VL 15.76
    k.cam.keys([{ t: 0, view: v }, { t: D, hold: true, drift: false }]);
    return { J };
  },
});
