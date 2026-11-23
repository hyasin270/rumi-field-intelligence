// 2D · W · v2-shots-c. "The team sees one colleague. Below the surface, it is as many agents as the job needs."
// The move: the pull back from the laptop to the whole building; one name above, a job passed through many hands below;
// question two ticks in the rest (BLOCKING.md 2D).
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_c/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "2D", type: "W", row: "2D", dur: 11400, screens: ["drive-email"],
  setup(k) {
    k.breathe();   // VL 15.89 b (v2-visuals 082838): every render from now; signed renders are not redone for it
    const C = window.SC, S1 = C.S1, V = C.V3, D = k.dur;
    const W = C.world(k, 2); C.pav2(k, W, { faceLaptop: true });   // the crowd comes after the heroes are placed (ruling 83 item 7)
    const lap0 = W.parts.laptops[0], lap1 = W.parts.laptops[1];
    const scr = k.screen("drive-email", { t0: 0, events: { drop: -9000, files: -7500, swap: -6000, mail: -5000, hlRow: -4400 }, opt: { dur: 6200 } });
    scr.full(-10000); scr.pushOut(150, 600, { to: lap0 });   // frame 0 is 2C's last: the screen at Full (pre-read 2005)
    const tOne = C.at(k, "2D.1", "colleague", 300), tBelow = C.at(k, "2D.1", "Below", 200), tNeeds = C.at(k, "2D.1", "needs", 200);
    C.laptopFace(k, lap0, tOne - 300, { mark: true }); C.laptopFace(k, lap1, tOne - 180, { mark: true });
    // ruling 164 (c), fast only (D under 8.0 s; AI-FAST 4c is 5.93 s): at the signed pace only three of the five hands were reached,
    // the page never came home and the tick fell before the list. FAST runs the same pass at about 0.6 of the signed pace, both
    // replies home by about 4.7 s, the list written 0.9 s before the tick and the tick 0.8 s before the cut. D >= 8000 as signed
    const FAST = D < 8000, Q = FAST ? { down: 400, land: 300, first: 450, step: 280, slotA: 150, slotB: 200, slotC: 120, upA: 150, upB: 400, e0: 500, eLand: 300, eWork: 450, eHold: 1000, eUpA: 200, eUpB: 400 }
      : { down: 1000, land: 500, first: 750, step: 480, slotA: 250, slotB: 350, slotC: 200, upA: 250, upB: 650, e0: 1200, eLand: 500, eWork: 750, eHold: 2000, eUpA: 300, eUpB: 650 };
    let tList = Math.max(C.end(k, "2D.1") - 200, D - 3800);
    k.ui.pin(tOne - 100, { text: "Rumi", at: V([2.4, 0.95, -3.45]), side: "left", dx: -150, dy: -230, t1: Math.max(900, tOne + 500) });   // gone at the cut to W
    // ruling 82 row 4 (2D.1 "Below the surface, it is as many agents as the job needs"): on "Below" a line drops from each
    // of the two screens that show Rumi. Under the west one a page passes along five agents in two rooms (B1 west, then
    // down the west slot to B2 west) and the last hand sends the reply back up the same line. Under the east one, one agent
    // in B1 east does the whole job alone. Everyone else stands as they are. Hold 1.5 s, then the tick.
    const tDrop = C.at(k, "2D.1", "Below", 100), FZ = -0.35, y1 = C.floorY(1), y2 = C.floorY(2), hy = 0.95;
    const LW = [-3.0, 0.9, -3.2], LE = [2.4, 0.95, -3.45];
    const WX = -3.0, EX = 2.4;
    // the five hands (heroes, face to us; the crowd keeps its ring round them)
    const HW = [[-2.75, y1, -1.3], [-1.85, y1, -1.45], [-0.95, y1, -1.3], [-1.0, y2, -1.3], [-2.4, y2, -1.4]];
    HW.forEach((h, i) => k.agent({ at: h, face: 0.25, name: "hand" + i }));
    const solo = k.agent({ at: [EX - 0.45, y1, -1.4], face: 0.25, name: "solo" });
    const hp = (h) => [h[0] + 0.35, h[1] + hy, h[2] + 0.35];
    const t0W = tDrop + Q.down, step = Q.step;
    const kw = [{ t: t0W, p: [WX, 0.9, FZ] }, { t: t0W + Q.land, p: [WX, y1 + hy, FZ], e: "in" }, { t: t0W + Q.first, p: hp(HW[0]) }];
    let tt = t0W + Q.first;
    [1, 2].forEach((i) => { tt += step; kw.push({ t: tt, p: hp(HW[i]) }); });
    tt += Q.slotA; kw.push({ t: tt, p: [-1.0, y1 + 0.2, -0.9] }); tt += Q.slotB; kw.push({ t: tt, p: [-1.0, y2 + hy, -0.9], e: "in" }); tt += Q.slotC; kw.push({ t: tt, p: hp(HW[3]) });
    tt += step; kw.push({ t: tt, p: hp(HW[4]) });
    const tUpW = tt + Q.upA; kw.push({ t: tUpW, p: [WX, y2 + hy, FZ] }, { t: tUpW + Q.upB, p: LW, e: "out" });
    C.card(k, kw, { glow: true, w: 0.42, d: 0.3, t1: tUpW + Q.upB + 50 });
    const tHands = [t0W + Q.first, t0W + Q.first + step, t0W + Q.first + 2 * step, kw[kw.length - 4].t, kw[kw.length - 3].t];
    HW.forEach((h, i) => { const ta = tHands[i]; k.fx(k, { t0: ta, kind: "spark", anchor: () => V(hp(h)), dur: 450, size: 30 }); k.cue(ta, "stick", { soft: true }); });
    // the routes follow the page (VL 15.3: drawn behind it, never ahead): at W the path of the work and a dot at each
    // hand say "many agents" where a 15 px page alone cannot. West: down, along five hands, down the slot, back to the line.
    const wPts = [[WX, 0.9, FZ], { at: [WX, y1 + hy, FZ], dot: false }].concat(HW.slice(0, 3).map((h) => ({ at: hp(h), dot: false })),
      [[-1.0, y1 + 0.2, -0.9], [-1.0, y2 + hy, -0.9]], HW.slice(3).map((h) => ({ at: hp(h), dot: false })), [{ at: [WX, y2 + hy, FZ], dot: false }, [WX, y1 + hy, FZ], [WX, 0.9, FZ]]);   // and back up the same line
    const wT = [tDrop, tDrop + (FAST ? 350 : 600), tHands[0], tHands[1], tHands[2], kw[5].t, kw[6].t, tHands[3], tHands[4], tUpW, tUpW + (FAST ? 180 : 300), tUpW + Q.upB];
    const P3 = wPts.map((q) => V(Array.isArray(q) ? q : q.at)), cum = [0]; for (let i = 1; i < P3.length; i++) cum.push(cum[i - 1] + P3[i].distanceTo(P3[i - 1]));
    const rW = { points: wPts, keys: wT.map((t, i) => [t, cum[i] / cum[cum.length - 1]]) }; k.ui.route(tDrop, rW);   // t1 set after the tick time is known
    // the solo job: down, worked at alone, back up
    const t0E = tDrop + Q.e0, tWork = t0E + Q.eWork, tUpE = Math.max(tWork + Q.eHold, tUpW - 300);
    C.card(k, [{ t: t0E, p: [EX, 0.95, FZ] }, { t: t0E + Q.eLand, p: [EX, y1 + hy, FZ], e: "in" }, { t: tWork, p: [EX - 0.15, y1 + 0.7, -1.1] }, { t: tUpE, p: [EX - 0.15, y1 + 0.7, -1.1] }, { t: tUpE + Q.eUpA, p: [EX, y1 + hy, FZ] }, { t: tUpE + Q.eUpA + Q.eUpB, p: LE, e: "out" }], { glow: true, w: 0.42, d: 0.3, t1: tUpE + 1000 });
    const ePts = [[EX, 0.95, FZ], { at: [EX, y1 + hy, FZ], dot: false }, { at: [EX - 0.15, y1 + 0.7, -1.1], dot: false }];
    const rE = { points: ePts, keys: [[tDrop + 150, 0], [tDrop + (FAST ? 450 : 750), 0.7], [tWork, 1]] }; k.ui.route(tDrop + 150, rE);
    solo.act(tWork, "write"); solo.idle(tUpE - 100);
    const tHome = Math.max(tUpW + Q.upB, tUpE + Q.eUpA + Q.eUpB);
    // ruling 83 item 7: five and one must be counted at 480 px. Each hero stands alone on bare floor (1.2 m clear) while the
    // work moves; once both replies are home the crowd walks back in from the open front, settled before the cut
    C.crowd(k, W, {});   // ruling 82: everyone else stands as they are
    k.cue(tUpW + Q.upB, "message"); k.cue(tUpE + Q.eUpA + Q.eUpB, "message");
    // ruling 83 item 7: five and one counted at 480 px. A body-sized green ring (the route's green: work taken) lands on each
    // hand as the page reaches it, and on the lone agent as it starts; all six hold to the tick, then go
    const ringAt = [[...HW[0]], [...HW[1]], [...HW[2]], [...HW[3]], [...HW[4]], [EX - 0.45, y1, -1.4]].map((h) => V([h[0], h[1] + 0.42, h[2]]));
    const ringT = tHands.concat([tWork - 300]);
    const NS = "http://www.w3.org/2000/svg", svg = document.createElementNS(NS, "svg");
    svg.setAttribute("width", 1920); svg.setAttribute("height", 1080); svg.style.cssText = "position:absolute;left:0;top:0;overflow:visible;pointer-events:none";
    document.getElementById("ui").appendChild(svg);
    const rings = ringAt.map(() => { const c = document.createElementNS(NS, "circle"); c.setAttribute("fill", "none"); c.setAttribute("stroke", "#E8A200"); c.setAttribute("stroke-width", 6); svg.appendChild(c); return c; });
    let tRingOff = 1e9;
    FILM._post.push((t) => rings.forEach((c, i) => {
      const on = FILM.tw(t, ringT[i], ringT[i] + 250, "back") * (1 - FILM.tw(t, tRingOff, tRingOff + 300, "in"));
      if (on <= 0.001) { c.style.visibility = "hidden"; return; }
      const p = KIT.render.project(ringAt[i]), q = KIT.render.project(V([ringAt[i].x, ringAt[i].y + 0.5, ringAt[i].z]));
      const r = Math.max(13, Math.abs(p.y - q.y) * 0.72);
      c.style.visibility = "visible"; c.setAttribute("cx", p.x); c.setAttribute("cy", p.y); c.setAttribute("r", r * on); c.style.opacity = Math.min(1, on);
    }));
    const tTick = FAST ? Math.max(tHome + 250, D - 800) : Math.min(D - 500, Math.max(C.end(k, "2D.1") + 400, tHome + 1500));   // hold 1.5 s after both replies are home
    if (FAST) tList = Math.min(tList, tTick - 900);
    tRingOff = tTick + (FAST ? 150 : 300); rW.t1 = rE.t1 = tTick + (FAST ? 300 : 600);   // the routes and rings go after the tick, so 2D ends as 3.0 opens (pre-read 2055)
    k.ui.questions(tList, { active: 2, ticked: [1], tickAt: { 2: tTick }, writeAt: { 1: tList, 2: tList, 3: tList, 4: tList, 5: tList } });
    // VL 15.71 / ruling 103: the room-size frame and W are joined by a hard cut, not a pull back. The map is on the
    // pavilion frames (VL 15.76) from the moment the screen has gone; the ring is on the pavilion for W's first 0.6 s;
    // "beads" and "hooks" dock one at a time once W is up
    const tCut = Math.max(900, tOne + 500);
    locator(k, { room: "pav", from: 150, to: tCut });
    roomRing(k, W, "pav", tCut, tCut + 600);
    C.docksWest(k, tCut + 150, null, 300);
    k.cam.keys([
      { t: 0, view: C.camPav(k) },
      { t: tCut - 1, hold: true, drift: false },
      { t: tCut, view: "W-list", cut: true },
      { t: D + 1, hold: true, drift: false }   // no drift into the cut: the next shot opens on this exact view,
    ]);
    return {};
  },
});
