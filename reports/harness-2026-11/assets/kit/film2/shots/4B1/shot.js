// 4B1 · S · v2-shots-d. "Three hundred agents produce more than anyone can read. But you have already written down what good looks like,
// in the skill." The move: the rise. The navy page goes up the slot and the camera follows it to the pavilion; pages keep piling on the
// mountain; on "But" the book comes up the slot, the speaker takes it in hand and holds it up beside the mountain (VL 15.23).
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_d/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "4B1", type: "S", row: "4B1", dur: 9770,
  setup(k) {
    const S = window.SD, P = S.P, D = k.dur;
    const tRead = S.w(k, "4B1.1", "read", 3500), tBut = S.w(k, "4B1.1", "but", 4160), tWritten = S.w(k, "4B1.1", "written", 5620), tSkill = S.w(k, "4B1.1", "skill", 8620);
    const W = S.world(k); S.lowDesk(k, W);   // 141605 item 3: the film's shared building (S1), as stage 3 leaves it
    const C = S.crowd1(k, W, { clear: [{ room: "skills", x0: -99, x1: 99, to: 1700 }] });
    // the newcomer where 4A3 leaves it (at the table's west end, after its hop), so the cut from 4A3 joins; nobody cut by the right edge
    { const nc = k.agent({ at: [0.82, -3.2, -2.4], face: 0.5, name: "newcomer" }); S.page(k, { ink: "navy", lines: 6, show: 0, at: [0.86, -2.78, -2.2] }).hold(-1e6, 1e9, nc, S.NP_GRIP, 1.35); nc.reach(-1000, 700, S.agentPoint([0.82, -3.2, -2.4], 0.5, S.NP_LOCAL), { hand: "L", hold: 1e6 }); }   // as 4A3 ends: the navy page held up to the lens
    // VL 15.46, a cut carries everything across: the thick book on the B1 table as 4A3 leaves it ("155" leaves before 4A3's cut)
    S.folder(k, { at: P.b1FolderLow, h: 0.16, hinge: true, hide: tBut });
    // as 4A3 ends: the list and coin on the table, the third taker by the shelf
    { const TOP = -3.2 + 0.525;
    const icon = new THREE.Group(); k.scene.add(icon); const KP = KIT.parts, tick = new THREE.MeshStandardMaterial({ color: 0xE8A200, roughness: 0.6 });
    KP.add(icon, KP.rbox(0.56, 0.06, 0.16, KP.mat("slab"), 0.02, 0.01), 0, 0.03, 0); KP.add(icon, KP.rbox(0.5, 0.66, 0.03, KP.mat("card"), 0.04, 0.01), 0, 0.39, 0);
    for (let r = 0; r < 4; r++) { KP.add(icon, KP.rbox(0.26, 0.03, 0.02, KP.mat("grey"), 0.01, 0.005), 0.04, 0.55 - r * 0.13, 0.02); KP.add(icon, KP.rbox(0.06, 0.06, 0.02, tick, 0.02, 0.008), -0.16, 0.55 - r * 0.13, 0.02); }
    icon.position.set(1.2, TOP, -3.15); icon.rotation.y = 0.2;
    let coin = null; try { coin = k.set.part("coin", { r: 0.14 }); } catch (e) { coin = null; }
    if (coin) { if (coin.parent) coin.parent.remove(coin); k.scene.add(coin); coin.position.set(1.62, TOP, -2.85); }
    icon.scale.setScalar(0.6); if (coin) k.each(() => { coin.visible = true; }); }
    k.agent({ at: [4.9, -3.2, -4.0], face: 0.3, name: "taker 3" });
    S.slots(k); S.matteGlass(k);
    const M = S.mountain(k, P.mountain, { n: 54, grows: [{ t0: -1e9, dur: 0, c0: 40, c1: 40 }, { t0: 900, dur: tRead - 900, c0: 40, c1: 50 }, { t0: tRead, dur: D - 400 - tRead, c0: 50, c1: 54 }] });   /* VL 15.89 (v2-check 081507: f076 to f130 frozen 3.7 s): the pile keeps growing, a sheet about every 1.5 s, to 54 at the cut as 4B2 opens */
    const up = [1.0, 0.35, -0.32], top = [P.mountain[0], M.top(1350).y + 0.03, P.mountain[2]];
    // 141605 item 2: the followed page lands on the pile's top and becomes its next sheet (no page over the pile)
    // pre-read 1634: no page lands on the pile without a hand; the rise reveals the pile growing on its own top
    // v2-visuals 120529 item 2: no loose pages; the pile grows on its own top (the twelve pages that flew up the slot are gone)
    k.cue(900, "pages");
    let spk = S.people(W);
    /* self-check 0937 (jumps.py f084, 57): the world's people have no settle, so the speaker's walk starts mid-stride in one frame. The same person, made with the kit's settle (300 ms blend into and out of the stride), in the same place */
    { const old = spk; spk = k.person({ at: S.SPK, face: 0.45, parent: old.root.parent, settle: 300 }); old.hide(-1e9); W.people[2] = spk; }
    spk.turn(tRead - 2200, 500, 0.9).pose(tRead - 2000, "point", { blend: 300 }).pose(tRead - 1100, "stand", { blend: 300 });   // the arm is down before the walk starts   // kit v0.8.4 blends
    // 141605 items 1 and 2: a walking person's arms swing, so nothing is carried on a walk. The speaker walks to the east slot first,
    // empty-handed; the book comes up the slot into the hands (carry pose, standing) and is held up there, the pile in the same frame
    const st = S.HOLD.at, hold = S.HOLD.book, inHand = [st[0] - 0.05, 0.95, st[1] + 0.35];
    // pre-read 2230: the book shows from the start of its rise, under the floor, so it comes up out of the slot whole, never from the air;
    // the walk ends before "But" and the stride blends into the carry pose (a "walk" key before the stop, kit v0.8.4 blend)
    const tUp = tBut - 500, wEnd = tRead + 400;
    const F = S.folder(k, { at: [1.0, -0.6, -0.32], h: 0.16, show: tUp, hinge: true, hingeAngle: 0.15 });   /* self-check 0900: at 0.3 the open cover reached the chin (f215) */
    F.open(tWritten + 100, tSkill - 150 - (tWritten + 100), { hold: true, ramp: 1200 });   /* VL 15.89 (stills.py 08:39Z: f171 to f260 frozen 3.0 s; the pile's top is above the frame, the speaker too small for the breath to count): on "written down what good looks like" the held book's cover opens a crack and closes again, slowly, shut before the pulse on "skill" and 4B2's first frame */
    spk.walk(tRead - 700, 1100, [st], { ease: "lin" }).turn(wEnd - 100, 400, S.HOLD.face);
    F.fly(tUp, 1400, [1.0, -0.6, -0.32], inHand, { arc: 0, ease: "io" })
     .pulse(tSkill + 50);   // held out at the chest in both hands; no raised arm until the kit blends a person's poses (pre-read 1740)   // the arm and the book rise together; in the last half second they come down to the hands (ruling 98: 4B2 sends it down from there)
    spk.pose(wEnd - 300, "walk").pose(wEnd, "carry", { blend: 400 });   // the hands are ready before the book reaches them
    k.cue(tBut + 700, "lift");
    W.people.forEach((p, i) => { if (i !== 2) p.turn(900 + i * 120, 500, [P.mountain[0], 1, P.mountain[2]]).turn(tBut + 300 + i * 100, 500, [S.HOLD.at[0], 1, S.HOLD.at[1]]); });
    const low = k.cam.on([1.55, -2.45, -2.6], { size: "close", px: 400, focus: [1.4, -2.5, -2.7] }), topV = k.cam.on([2.75, 1.1, -1.7], { size: "close", px: 380, height: 1.15, focus: [2.6, 1.0, -1.6] });
    locator(k, { room: "skills", changes: [[1700, "pav"]] });   // VL 15.76: the rise lands in the pavilion
    k.cam.keys([{ t: 0, view: low }, { t: 1700, view: topV, ease: "io" }, { t: D, hold: true, drift: false }]);   // 4B2 opens on this exact pose
    return { F, M };
  },
});
