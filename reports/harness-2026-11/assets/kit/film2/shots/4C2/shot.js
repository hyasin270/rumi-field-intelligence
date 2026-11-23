// 4C2 · W · v2-shots-d. "The model is rented. The harness is yours. In our experience, the stronger the harness, the cheaper the model
// that can do the job." The move: the swap. The model slides out and lifts away; a block at 0.7 lowers in (VL 1.8). Question four ticks.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_d/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "4C2", type: "W", row: "4C2", dur: 14000,
  setup(k) {
    const S = window.SD, P = S.P, D = k.dur, R = S.r(k, "4C2.1", { start: 300, end: 10500 });
    const f = (x) => R.start + x * (R.end - R.start);
    const tRented = S.w(k, "4C2.1", "rented", f(0.15)), tYours = S.w(k, "4C2.1", "yours", f(0.3)), tStrong = S.w(k, "4C2.1", "stronger", f(0.5)), tCheap = S.w(k, "4C2.1", "cheaper", f(0.75));
    const W = S.world(k, { judge: -1e9 }); S.hide(k, W.parts.bar); S.hide(k, W.parts.judge);
    const C = S.crowd1(k, W, { avoid: S.B3avoid.concat(S.blockAvoid), clear: ["gates", "store"].map((room) => ({ room, x0: -1.1, x1: 1.1, z0: -1.9, z1: -1.3 })) });
    // pre-reads 0416 to 0535: rooms' cells start 0.45 m either side of the partition (S1 area), so the cells nearest the seat are at
    // x = +-0.78; the kit's block-avoid box pushes the row at z -1.61 in behind the seat, where it stands in the empty seat. Only that
    // row of that column is out (behind the block in 4C1 and 5.0); the front row (z -0.94), pushed beside the block, stays
    S.judgeRoom(k, { barAt: -1e9, pile0: 3 }); S.slots(k);
    k.agent({ at: S.B3.judge, face: Math.PI / 2 - 0.7, name: "judge" }).act(0, "write");
    const DK = [["beads", "a shared job board", "board", "west"], ["skills", "how we work,<br>written down", "skills", "east"], ["hooks", "what must never<br>happen unchecked", "gates", "west"], ["evals", "is the work good enough?", "judge", "west"]];
    const tLand = Math.min(tCheap, R.end - 600);
    // ai_fast-4c (ruling 165 b): the list framing on "the model that can do the job", the move 900 ms, the tick by D - 500;
    // v10, ai and op (D 12 s and more) read the old times
    // op-13 (word map): the row ends at 36.9 s of 38.9, so the v10 tail would tick after the cut (cue at 39.1 s); LATE takes the same
    // compact list on the model's words. v10, ai and op-12 (row end + 2.2 s inside D - 0.5 s) are unchanged
    const FAST = D < 10000, LATE = R.end + 2200 > D - 500, CL = FAST || LATE, LM = CL ? 900 : 1300, QA = CL ? 800 : 1300, TK = CL ? 1200 : 1900;
    const tL = CL ? tLand + 200 : R.end + 300;   // the list framing: docked labels and the bracket leave while the list is up (VL 14.1)
    // VL 15.56 (v2-visuals 120529 item 9): "beads", "hooks" and "evals" stay docked in the left column through the truck and to the cut
    // (x 290, as in every W-list frame); only the east labels, "the model" and the bracket leave while the list comes
    // over the truck the three west labels slide to the W-list column (right edge x 290) and their glosses fade (W-list holds the word only)
    const eastDocks = []; DK.forEach(([tx, gl, r, side]) => { if (side !== "west") { eastDocks.push(k.ui.dock(-1e6, { text: tx, at: W.side(r), side, t1: tL })); return; }   // names only (ruling 113 D)
      const o = { text: tx, at: W.side(r), side, x: 500 }, dk = k.ui.dock(-1e6, o);
      k.each((t) => { const u = FILM.tw(t, tL, tL + LM, "io"); o.x = 500 - 210 * u; const sm = dk.el.querySelector("small"); if (sm) { sm.style.opacity = 1 - FILM.tw(t, tL - 300, tL + 200); sm.style.display = u >= 1 ? "none" : ""; } }); });
    const c = P.core, outP = [c[0], c[1], c[2] + 1.6], sky = [c[0], c[1] + 22, c[2] + 1.6];
    S.seat(k);   // VL 15.40: the seat stays; the first block leaves whole, the smaller arrives from outside (ruling 60)
    // v2-check 035159 and pre-read 0405: the old block shrinks to nothing in its own seat; the new one grows from nothing in the seat.
    // Nothing moves, so nothing passes through a floor, the pavilion or the agents at the room's front.
    S.model(k, { size: 3, hide: tRented + 1700, shrink: [tRented + 200, 1400] }).path([{ t: 0, p: c }]);   /* pre-read 0405: it goes to nothing in its own seat, through nobody */
    S.model(k, { size: 2.1, show: tLand - 1400, grow: [tLand - 1400, 1400] }).path([{ t: 0, p: [c[0], c[1] - 0.3, c[2]] }]);   /* grows from nothing in the seat, whole on "cheaper" */
    k.cue(tRented, "lift"); k.cue(tLand, "install");
    eastDocks.push(k.ui.dock(-1e6, { text: "the model", at: [c[0] + 1.55, c[1] - 1.3, c[2] + 1.4], side: "east", y: 690, t1: tL }));
    S.fadeDocks(eastDocks, tL, 450);   // east labels and the model fade over 300 ms, never gone in one frame
    S.harness(k, { labelX: 1520, labelAt: -1e6, pulses: [tYours, tStrong], t1: tL });
    ["board", "skills", "gates", "judge"].forEach(   /* board 030158: the four rooms the voice lists */ (r, i) => W.glow(r, tStrong + i * 120, 300, 1.3));
    { const qb = k.ui.questions(tL + QA, { active: null, ticked: [1, 2, 3], tickAt: { 4: tL + TK } }); questionsEase(qb, { tickAt: { 4: tL + TK }, ms: 300 }); }   // the tick fades and grows over 300 ms
    const WR = k.cam.on([-2.04, -3.4, -2.2], { size: "wide", yaw: -14, pitch: -12, px: 0.78 * 1080 / (2 * Math.tan(Math.PI / 18) * 62) });   // as 4C1 (v2-visuals 180519)
    k.cam.keys([{ t: 0, view: WR }, { t: tL, hold: true, drift: false }, { t: tL + LM, view: "W-list", ease: "io" }, { t: D, hold: true }]);
    return {};
  },
});
