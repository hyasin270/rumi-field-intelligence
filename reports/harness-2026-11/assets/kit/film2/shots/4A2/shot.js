// 4A2 · S · v2-shots-d. "Work it out once, and use it every time after. That is a fixed cost, paid once, shared by every later job."
// Ruling 76 (v2-lead) takes v2-visuals' 113908 frame whole: room size (a taker 300 to 320 px tall), the table about 560 px wide at
// x 560 to 1120, the list and the brass coin on its left half, the book at its right end with the hinge to the left so it opens
// towards the taker. The taker's mark is the table's right end (x 1160 to 1420), three-quarter to us, the near hand on the open cover
// for 0.8 s or more. Three takers, one at a time, three ways: (1) in from the right edge and out by it; (2) in from the bottom right
// and out along the shelf to the back right; (3) in along the shelf from the back right, at the book with its hand on the cover when
// "amortisation" lands, held to the cut. No coral in frame but the taker of the moment; the crowd stays east of the right edge.
// Each leaves with empty hands; the book never lifts. "amortisation" on the wall at the upper left, its dot on the book.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_d/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "4A2", type: "S", row: "4A2", dur: 9100,
  setup(k) {
    const S = window.SD, D = k.dur;
    // board 062102 / v2-cut 062133 (timing v9, option 1): at 11.0 s each user leaves before the next arrives, with slow let-gos;
    // at 9.1 s (timing v8) the tighter schedule below stands
    const LONG = D > 10500, FAST = !LONG && D < 9000, NC = LONG ? { hold: 3250, out: 800 } : FAST ? { hold: 3600, out: 700 } : { hold: 3150, out: 700 };   // ai_fast-4c: "after." starts at 2.9 s, the hand stays on the cover to it (ruling 105)
    const tUse = S.w(k, "4A2.1", "use", 1350), tFixed = S.w(k, "4A2.1", "fixed", 3840), tShared = S.w(k, "4A2.1", "shared", 5580);
    const W = S.world(k);   // 141605 item 3: the film's shared building (S1), as stage 3 leaves it
    // the crowd keeps east of the frame's right edge (113908 item 5)
    const C = S.crowd1(k, W, { clear: [{ room: "skills", x0: -99, x1: 99 }] });   // no coral in frame but the taker (113908 item 5)
    S.people(W);   // no slots here: the B1 floor slot's glow sat cut at the frame's foot (pre-read 1634, check 5)
    // v2-visuals 123551 item 2 (VL 15.39): the body stays on the floor and the arm reaches, so this shot's table top is 0.52 m
    const FL = -3.2, TOP = FL + 0.525; S.hide(k, W.parts.desk); { const dk = k.set.part("desk", { w: 1.6, d: 0.9 }); k.scene.add(dk); dk.position.set(1.65, FL, -3.0); dk.scale.y = 0.52 / 0.765; }   // the kit's B1 desk, its top at 0.52 m
    const book = [2.2, TOP, -2.78];
    const F = S.folder(k, { at: book, h: 0.052, hinge: true, hingeAngle: 0.24 });
    // the taker's mark: the table's right end, a little in front of the book, three-quarter to us
    const spot = [2.68, -2.44], faceAt = -0.7;
    const edge = (u) => [book[0] - 0.235 + 0.47 * Math.cos(0.24 * u) - 0.02, TOP + 0.07 + 0.47 * Math.sin(0.24 * u), book[2] + 0.06];   // the cover's free edge
    // three visits; hold is the time the hand is on the cover; the last holds to the cut
    // pre-read 1634 (v2-visuals): every walk linear and under 40 px a frame at 30 fps; nobody appears in one frame. The first taker is
    // 4A1's newcomer, already at the book with its hand on the cover (the join from 4A1). in: [start, ms, path]; tOn: hand on the cover
    const LIN = { ease: "lin" };
    // Ruling 105: the newcomer's hand on the open cover through "use it every time after" (to 2.15 s), then it leaves by the right edge;
    // the second comes in from the right edge (front) and leaves the same way; the third comes along the shelf from the back. Every walk
    // linear and under 40 px a frame at 30 fps (pre-read 1740: 700 ms was 41 to 48 px).
    // pre-read 2030 (ruling 105, third condition): each hand-over at a different place, with an empty beat between: the newcomer leaves
    // along the shelf (back right); the second comes in and goes out at the right front; the third comes along the shelf. All linear,
    // under 40 px a frame at 30 fps. The label is gone (ruling 107 b), so the third may arrive later.
    const SHELF = LONG || FAST ? [[4.0, -3.7], [5.8, -4.1]] : [[3.3, -3.95], [5.0, -4.05]];   /* v2-check 073228: at 4c the short path ended in frame and the walker vanished at the edge (f148, f214); FAST walks out past it */   /* pre-read 0752: the shelf path ended in frame (x 5.0) and the body vanished there; at 11.0 s it walks out past the right edge, the same speed */
    const V = [
      { at: spot, tOn: 0, hold: NC.hold, out: SHELF, outMs: LONG || FAST ? 1430 : 1300 },   // self-check 0610: it is gone (4.46 s) before the second reaches the book (4.4 s + 120)
      { show: LONG ? 4760 : FAST ? 3200 : 3400, inT: LONG ? 4760 : FAST ? 3200 : 3400, inMs: LONG ? 800 : FAST ? 900 : 1000, path: [[4.6, -2.0], spot], hold: 900, out: [[4.6, -2.0]], outMs: LONG ? 850 : 950 },   /* pre-read 0752: in once the newcomer is out of frame; same arrival time */
      { show: 0, inT: 0, inMs: 1300, path: [[5.6, -4.05], [3.3, -3.95], spot], hold: 0 },
    ];
    // pre-read 0155: the second user reaches only once its turn in is done, lets go (the cover shuts as the hand leaves) and only then turns away
    const T2 = LONG ? { reach: 100, rDur: 800, rHold: 600, outAt: 700, outMs: 700 } : FAST ? { reach: 100, rDur: 700, rHold: 600, outAt: 300 } : { reach: 100, rDur: 800, rHold: 600, outAt: 500 };   // self-check 0605: in 500 ms later (it met the newcomer at the book); the lift and lowering (300 ms each) fill rHold   // pre-read 0502: the cover lifts (300 ms), is held, and is lowered (300 ms) under the hand, all inside rHold
    V[2].show = V[1].inT + V[1].inMs + T2.reach + T2.rDur + T2.rHold + T2.outAt + (LONG ? V[1].outMs : 0); V[2].inT = V[2].show;
    // ai_fast-4c (ruling 164 c, 7.9 s): the third sets off along the back shelf while the second is still at the book, so its cover is
    // whole open about 7.3 s, 0.6 s before the cut (the last cue lands before D - 500). v10, ai and op are untouched: the branch reads D.
    // draft 0519: the third passed behind the second at the book (two bodies stacked); so in the fast branch the second leaves along
    // the back shelf and the third comes in from the right front, the two paths never cross
    if (FAST) { V[1].out = [[5.8, -3.2]]; V[1].outMs = 1450;   /* v2-visuals 073334: the second leaves side-on to the right edge, not its back into the room */ V[2].show = V[2].inT = 5600;   /* draft 0530: at 5400 the third met the second turning away at the book */ V[2].inMs = 900; V[2].path = [[4.6, -2.0], spot]; }   // the third sets off as the second walks away (at 11.0 s: once it is gone)
    // ruling (v2-lead 074632, B): in the fast film the book has two users: the newcomer to "after.", then one taker from the right
    // front, its hand on the cover on "shared" and the cover whole open to the cut; nobody crosses (v2-visuals 074627)
    if (FAST) { const tB = tShared - 120 - 1200; V.splice(1, 2, { show: tB, inT: tB, inMs: 1200, path: [[5.4, -1.9], spot], hold: 0 }); }   // starts outside the right edge (no body appears half in frame)
    let tLand = 0;
    V.forEach((v, i) => {
      const s0 = v.at || v.path[0], last = !v.out;
      const b = k.agent({ at: [s0[0], FL, s0[1]], face: v.at ? -1.15 : -1.4, name: i === 0 ? "newcomer" : "taker " + (i + 1) });
      const tAt = v.at ? 0 : v.inT + v.inMs, tOn = v.at ? 0 : tAt + 120;
      const hold = last ? D - tOn + 400 : v.hold;
      if (v.show > 0) b.hide(0).show(v.show);
      if (!v.at) b.walk(v.inT, v.inMs, v.path.slice(1), Object.assign({}, LIN, i === 1 || (FAST && i === 2) ? { face: -0.5 } : { face: -0.9 }));
      if (!v.at) { const pp = v.path, q0 = pp[pp.length - 2], q1 = pp[pp.length - 1]; S.turnLin(b, tAt - 600, 900, i === 1 || (FAST && i === 2) ? -0.5 : -0.9, -1.15); }   // pre-read 0020: an even turn
      // pre-read 0502: the cover never passes through a hand. Each user's hand follows the cover's free edge (just under it) while it
      // lifts the cover, holds it and lowers it; the hand lets go only once the cover is down. The newcomer arrives with it open (4A1).
      const under = (t) => { const e = edge(F.openAt(t)); return LONG ? [e[0] + 0.03, e[1] - 0.07, e[2] + 0.18] : [e[0] + 0.09, e[1] - 0.07, e[2] + 0.12]; };   /* pre-read 0752: the hand hid behind the body as the cover moved; nearer the lens and the book's end */   /* pre-read 0528: in front of the cover's end (towards the lens), so the cover is never drawn across the hand */   // pre-read 0515: outside the free edge and below it (the mitten is about 0.1 m), so the hand holds the edge from beside it and never lies on the shut cover
      if (i === 0) { const tDown = FAST ? 2900 : 2450; F.open(-1000, tDown + 1000, { hold: true, ramp: 300 }); S.reachUp(b, -1000, 900, under(tDown), { hand: "R", hold: tDown + 1000 - 900, lift: 0, track: under, rise: 0.3, fwd: 0.3, ease: "soft", outMs: NC.out });   /* pre-read 0545: a slower, gentler let-go (it snapped 90 to 125 px) */   /* ruling 105: open under the hand to 2.15 s, lowered to 2.55 s, let go, then it walks (pre-read 0528: walking while letting go jumped the arm) */ S.turnLin(b, tOn + 800, 600, -1.15, faceAt); }
      else if (i === 1 && !last) { const tO = tAt + T2.reach + T2.rDur, tR = tO + T2.rHold; S.reachUp(b, tAt + T2.reach, T2.rDur, under(tAt + T2.reach + T2.rDur + T2.rHold), Object.assign({ hand: "R", hold: T2.rHold, lift: 0, rise: 0.35, fwd: 0.3, ease: "soft", track: under }, LONG ? { rise: 0.5, fwd: 0.2, outMs: T2.outMs } : { outKit: true }));   /* pre-read 0752: the kit's let-go stepped 50 px; the hand passed through the table's lip (rises closer to the body) */ F.open(tO, T2.rHold, { hold: true, ramp: 300 }); }
      else { const r0 = LONG || FAST ? 0 : 200, r3 = LONG || FAST ? 700 : 800, tO = tAt + r0 + r3; S.turnLin(b, tOn + 800, 600, -1.15, faceAt); S.reachUp(b, tAt + r0, r3, edge(0), Object.assign({ hand: "R", hold: hold, lift: 0, rise: 0.35, fwd: 0.3, ease: "soft", track: under }, LONG ? { rise: 0.5, fwd: 0.2 } : {}));   /* pre-read 0752: through the lip at f308; a slower reach (700 ms) rising closer to the body */ F.open(tO, 1e6, { hold: true, ramp: LONG ? 200 : 300 }); }   /* pre-read 0815: the cover was still rising at the cut; whole open by f324, held 6 frames */
      k.cue(tOn, "page", { soft: true });
      // pre-read 2345: through the lens-facing side over 1 s, its only turn after the book (no look-at-us turn for the second user)
      // pre-read 2230 and 2320: the second user turns to its way out (a fixed heading; a kit turn holds after it ends) over 500 ms
      // before it walks; the newcomer leaves as before (it passed)
      if (!last) { const tOff = i === 1 ? tAt + T2.reach + T2.rDur + T2.rHold + T2.outAt : tOn + hold; if (i === 1) S.turnLin(b, tOff - 100, 800, -1.15, Math.atan2(v.out[0][0] - spot[0], v.out[0][1] - spot[1])); b.walk(tOff, v.outMs, v.out, LIN).hide(tOff + v.outMs + 10); }
      if (last) tLand = tOn;
    });
    // ruling 107 b: "amortisation" is no longer in the film, said or shown; the plain sentence carries it
    // P3d's fixed-cost mark on the table's left half: the scoring guide, four ticked rows, and the brass coin in front of it
    const icon = new THREE.Group(); k.scene.add(icon); const KP = KIT.parts, tick = new THREE.MeshStandardMaterial({ color: 0xE8A200, roughness: 0.6 });
    KP.add(icon, KP.rbox(0.56, 0.06, 0.16, KP.mat("slab"), 0.02, 0.01), 0, 0.03, 0); KP.add(icon, KP.rbox(0.5, 0.66, 0.03, KP.mat("card"), 0.04, 0.01), 0, 0.39, 0);
    for (let r = 0; r < 4; r++) { KP.add(icon, KP.rbox(0.26, 0.03, 0.02, KP.mat("grey"), 0.01, 0.005), 0.04, 0.55 - r * 0.13, 0.02); KP.add(icon, KP.rbox(0.06, 0.06, 0.02, tick, 0.02, 0.008), -0.16, 0.55 - r * 0.13, 0.02); }
    icon.position.set(1.2, TOP, -3.15); icon.rotation.y = 0.2;
    let coin = null; try { coin = k.set.part("coin", { r: 0.14 }); } catch (e) { coin = null; }
    if (coin) { if (coin.parent) coin.parent.remove(coin); k.scene.add(coin); coin.position.set(1.62, TOP, -2.85); }
    k.each((t) => { const u = FILM.tw(t, tFixed - 200, tFixed + 400, "out"), s = Math.max(0.01, u);
      icon.visible = u > 0.01; icon.scale.setScalar(0.6 * s); if (coin) { coin.visible = u > 0.01; coin.scale.setScalar(s); } });
    k.cue(tFixed - 200, "install", { soft: true });
    const frame = k.cam.on([2.0, -2.72, -2.9], { size: "room", px: 310, pitch: -9, yaw: -10, focus: [2.4, -2.6, -2.9] });
    locator(k, { room: "skills" });   // VL 15.76
    k.cam.keys([{ t: 0, view: frame }, { t: D, hold: true }]);
    return { F };
  },
});
