// 4A3 · S · v2-shots-d. "A correction can become a new line in the skill. Our lesson-plan skill carries a hundred and fifty-five.
// This is where a general AI starts to sound like you." Head: the link frame (under 1 s here), the speaker makes one navy stroke on a
// page; the stroke travels down the slot and the camera follows it in one move to the book, which it enters just after "skill".
// Then the rain of strokes, "155 / corrections" on clear wall from "hundred" (its last frame reads 155), the navy page once (ruling 29.6).
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_d/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "4A3", type: "S", row: "4A3", dur: 13000,
  setup(k) {
    const S = window.SD, P = S.P, D = k.dur;
    const tCorr = S.w(k, "4A3.1", "correction", 340), tSkill = S.w(k, "4A3.1", "skill", 2360), tOur = S.w(k, "4A3.1", "our", 3140), tHundred = S.w(k, "4A3.1", "hundred", 5610), tFive = S.w(k, "4A3.1", "fifty-five", 6320), tThis = S.w(k, "4A3.1", "this", 7400), tYou = S.w(k, "4A3.1", "you", 10780);
    const W = S.world(k); S.lowDesk(k, W);   // 141605 item 3: the film's shared building (S1), as stage 3 leaves it
    const C = S.crowd1(k, W, { clear: [{ room: "board", x0: -4.4, x1: 99 }, { room: "skills", x0: -99, x1: 99 }] });
    S.mountain(k, P.mountain, { n: 46 }); S.slots(k);
    const tOffPav = tSkill + 150;   /* pre-read 1320: the page vanished and the arms dropped in one frame at f037 in the link frame; both now happen once the camera is down on B1 and the pavilion is out of frame */
    const spk = S.people(W, { keep: true }); spk.turn(-20, 1, [1.0, 0, -0.32]).pose(0, "carry").pose(tOffPav, "stand");   // 141605 item 2: the page is in the hands
    /* v2-check 142800 (ruling 103): the newcomer stood at the desk in f000 where 4A2's last frame has empty floor. The link frame shows the
       whole room, so it is not in the room at the cut: it walks in once the camera is down on B1, from the close frame's right edge along
       the back lane behind the desk (taker 3 has left by that lane, gone at f096), and is at its place well before it writes */
    /* ruling 148 and self-check 1415: behind the desk the rain of dashes crossed its visor (f128 to f131), so it comes along the front of
       the desk (the lead's fallback), nearer the lens than the dashes, so they pass behind it */
    const tNcIn = S.w(k, "4A3.1", "skill", 2360) + 940, nc0 = [3.9, -2.15];   /* ruling 153: after the camera lands on B1 (tSkill + 150), whatever the read's timing; 3300 ms in v10 */
    const a = k.agent({ at: [nc0[0], -3.2, nc0[1]], face: -1.57, name: "newcomer" });
    a.hide(0).show(tNcIn).walk(tNcIn, 1400, [[1.2, -2.15]], { ease: "lin" }).walk(tNcIn + 1400, 650, [[0.82, -2.4]], { ease: "lin" }); S.turnLin(a, tNcIn + 1500, 900, Math.atan2(-0.38, -0.25), 0.5, 27);   /* pre-read 1452: "out" stretched the last stride (a 23 px landing at f161) and the late turn kept the eyes away 0.70 s; a slower linear last leg, the turn starting inside it */   /* pre-read 1435: the walk stopped dead (31 to 1.5 px) and the 8-step turn stuttered; the last leg slows into the stop, the turn in 27 even steps */
    const F = S.folder(k, { at: P.b1FolderLow, h: 0.052, hinge: true, hingeAngle: 0.24 });
    // the join from 4A2 (pre-read 1740): its list, coin and third taker, hand on the open cover; the hand lets it down, the taker goes
    const TOP = -3.2 + 0.525;
    const icon = new THREE.Group(); k.scene.add(icon); const KP = KIT.parts, tick = new THREE.MeshStandardMaterial({ color: 0xE8A200, roughness: 0.6 });
    KP.add(icon, KP.rbox(0.56, 0.06, 0.16, KP.mat("slab"), 0.02, 0.01), 0, 0.03, 0); KP.add(icon, KP.rbox(0.5, 0.66, 0.03, KP.mat("card"), 0.04, 0.01), 0, 0.39, 0);
    for (let r = 0; r < 4; r++) { KP.add(icon, KP.rbox(0.26, 0.03, 0.02, KP.mat("grey"), 0.01, 0.005), 0.04, 0.55 - r * 0.13, 0.02); KP.add(icon, KP.rbox(0.06, 0.06, 0.02, tick, 0.02, 0.008), -0.16, 0.55 - r * 0.13, 0.02); }
    icon.position.set(1.2, TOP, -3.15); icon.rotation.y = 0.2;
    let coin = null; try { coin = k.set.part("coin", { r: 0.14 }); } catch (e) { coin = null; }
    if (coin) { if (coin.parent) coin.parent.remove(coin); k.scene.add(coin); coin.position.set(1.62, TOP, -2.85); }
    icon.scale.setScalar(0.6); if (coin) k.each(() => { coin.visible = true; });   // the kit's coin is hidden until shown (4A2's join)
    { const t3 = k.agent({ at: [2.68, -3.2, -2.44], face: -0.7, name: "taker 3" }); F.open(-400, 1300, { hold: true });
      /* pre-read 1320: the kit let go at 700 ms, before the cover landed, and the arm dropped 48 px in one frame (f023 to f024). As in 4A2: the hand follows the cover's free edge down (S.reachUp track), lets go along a straight 700 ms path once the cover is down, and only then walks off */
      const edge = (u) => [2.2 - 0.235 + 0.47 * Math.cos(0.24 * u) - 0.02, TOP + 0.07 + 0.47 * Math.sin(0.24 * u), -2.78 + 0.06];
      const under = (t) => { const e = edge(F.openAt(t)); return [e[0] + 0.03, e[1] - 0.07, e[2] + 0.18]; };
      const tLet = 950, tWalk = tLet + 750;
      S.reachUp(t3, -1000, 900, under(-100), { hand: "R", hold: tLet - (-1000 + 900), lift: 0, track: under, rise: 0.5, fwd: 0.2, ease: "soft", outMs: 700 });
      t3.walk(tWalk, 1600, [[3.3, -3.95], [4.9, -4.0]], { ease: "lin", face: 0.3 }).turn(tWalk + 1650, 400, 0.3); }
    const fp = [2.2, -3.2 + 0.585, -2.78], slotB = [1.0, -0.45, -0.32];
    // the one stroke: made on the speaker's page, it lifts and travels down the slot into the book
    S.page(k, { at: [S.SPK[0], 0.9, S.SPK[2]], show: 0, hide: tOffPav, lines: 5, mark: true }).hold(-1e6, 1e9, spk, [0, 0.86, 0.33], 0.6);   // in the hands, as 4A1 leaves it
    const hand = [S.SPK[0] - 0.35, 0.8, S.SPK[2] + 0.35];
    S.dashes(k, { t0: tCorr + 300, t1: tSkill - 600, path: [hand, [1.0, 0.05, -0.32], slotB, fp], speed: 3.2 });
    // the lid never moves on its own (pre-read 1740)
    F.pulse(tSkill + 200); k.cue(tCorr, "stroke"); k.cue(tSkill + 100, "line-in");
    // pre-read 2345: no "look" here, it lifted the near hand off the held page
    // the rain: thirty strokes down the slot, faster and faster, each into the book; the book thickens; 155 counts while it is said
    S.dashes(k, { t0: tOur, t1: tFive + 500, path: [[1.0, 0.4, -0.32], slotB, fp], speed: 4.4, gap: 0.27 });   // 145700 item 3: a dash length of gap between dashes, never a rod
    F.thicken(tOur, tFive + 800 - tOur, 0.16);
    k.ui.number(tHundred - 100, { value: 157, from: 157, unit: "corrections", dur: 1, stay: true, x: 260, y: 170 });   // ruling 98 item 6: lands whole as 155 on "a hundred and fifty-five", no count through other numbers
    k.cue(tHundred - 250, "number");
    { const n0 = document.querySelectorAll(".numcard").length; FILM._post.push((t) => { const b = document.querySelectorAll(".numcard")[n0 - 1]; if (b) b.style.filter = `opacity(${FILM.tw(t, tHundred - 100, tHundred + 300, "lin") * (1 - FILM.tw(t, D - 1000, D - 500, "lin"))})`; }); }   // gone 0.5 s before the cut (141605 item 4)
    // "sound like you": the newcomer's next page writes in navy once; held up on "you"; then it rises to the slot (to 4B1)
    // self-check 2316: on this camera the table top is at the newcomer's head height, so a page on the table hides behind the head. The
    // newcomer holds its blank page low at its side from the first frame (it arrives across the cut); its other hand is on the page while
    // the navy lines appear; on "sound like you" it lifts the page up to the lens beside the body (as 4B1 opens)
    const LOW = [0.34, 0.22, 0.22], tWr = tThis + 650, wDur = Math.max(1500, tYou - tThis - 1600), nAt = [0.82, -3.2, -2.4], rUp = Math.max(tYou - 800, tWr + wDur), tUp = rUp + 100;
    const np = S.page(k, { ink: "navy", lines: 6, show: tNcIn }); np.hold(-1e6, tUp, a, LOW, 0.55).writeLines(tWr, wDur - 400);
    // ruling 98 item 5: the newcomer writes the navy page, its hand on it while the lines appear; arms down otherwise (153507 item 15)
    const onPage = S.agentPoint(nAt, 0.5, [LOW[0], LOW[1] + 0.02, LOW[2]]);
    // pre-read 0020: the writing hand lets go before the lift; then the same hand reaches up beside the body and the page rides it (4B1 opens on that reach)
    a.reach(tWr - 400, 375, onPage, { hand: "L", hold: wDur - 300 }).reach(rUp, 700, S.agentPoint(nAt, 0.5, S.NP_LOCAL), { hand: "L", hold: 1e5 });
    // ruling 98 item 5: lifted to the lens, its navy lines 150 px tall or more, from "sound like you" to the cut (held into 4B1)
    // pre-read 2030: the page comes forward beside the newcomer (never across its visor) into its hand, navy side to the lens
    np.hold(tUp, 1e9, a, S.NP_GRIP, 1.35, 450); k.cue(tUp, "lift");
    const close = k.cam.on([1.55, -2.45, -2.6], { size: "close", px: 400, focus: [1.4, -2.5, -2.7] });
    locator(k, { room: "pav", changes: [[tSkill + 150, "skills"]] });   // VL 15.76
    k.cam.keys([{ t: 0, view: S.LF }, { t: tCorr + 600, hold: true, drift: false }, { t: tSkill + 150, view: close, ease: "io" }, { t: D, hold: true, drift: false }]);   // 141605 item 3: 4B1 opens on this exact pose
    return { F };
  },
});
