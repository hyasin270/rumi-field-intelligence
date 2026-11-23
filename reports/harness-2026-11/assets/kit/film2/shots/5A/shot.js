// 5A · S to N · v2-shots-e (v2.0 09:15Z, visuals 080638 5A: the operator walks in at most about 35 px a frame (was 50 to 59); the W pin leaves over 200 ms; W-left with its base out of the band, no push, so 5B1 opens on this last frame; k.breathe. v0.2: lead 074149 item 2, visuals 074104 item 7). The wall's four panels are white; one turns
// red with the same red ring the stuck agent stands in. A person comes in, looks along the wall, finds the red one, walks
// to that agent and frees it: the agent moves, its ring and the panel go green. Name card clear of the panel. Rest: W.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_e/lib.js", false); x.send(); (0, eval)(x.responseText); })();
(function(){const x=new XMLHttpRequest();x.open("GET","snippets/locator.js",false);x.send();(0,eval)(x.responseText+";window.locator=locator;window.roomRing=roomRing;");})(); // VL 15.76 map and ring
FILM.shot({
  id: "5A", type: "S", row: "5A", dur: 14000,
  setup(k) {
    const E = window.SE, D = k.dur, T = THREE, tw = FILM.tw;
    k.breathe(); // VL 15.89 b
    const Wb = E.world(k, E.FIVE);
    const y = E.roomY("teams"), cx = E.roomX("teams");
    const r1 = k.row("5A.1"), r2 = k.row("5A.2");
    /* ruling 165 (fast only, D under 10 s; v10 and ai 14.0, op 18.5, fast 7.87; v2-shots-b): at the signed times the cut to W came
       before the freeing. FAST: the operator frees the agent as it arrives (look + 3.0 s), the room holds until the freeing has read
       (+1.0 s) and the name card has stood 2.0 s, then the cut; the label docks 0.4 s into W. Signed versions keep their times. */
    const FAST = D < 10000, tFreeF = E.at(k, "5A.1", "look") + 3000, tB = FAST ? Math.min(D - 1500, Math.max(tFreeF + 1000, E.after(k, "5A.1", "operator") + 2000)) : Math.min(r2.end, D - 2700);
    const C = E.crowd(k, Wb, { fitted: E.FIVE, clear: [{ room: "teams", x0: 0.4, x1: 6, z0: -5.6, to: tB }] }); // the room as 5.0 left it
    const sA = [cx - 0.6, -2.6];
    const stuck = k.agent({ at: [sA[0], y, sA[1]], face: 0.3, name: "stuck" });
    stuck.act(0, "slump"); E.flatMouth(k, stuck, [[-1e9, FAST ? tFreeF : r2.start + 200]]);
    // 5.0's last frame (visuals 195758 item 1): the same three bystanders, the card at rest in B's hand
    const PA = [cx + 1.6, -4.25], PB = [cx + 2.35, -4.25];
    const roomAgents = [k.agent({ at: [PA[0], y, PA[1]], face: 0.5, name: "passA" }), k.agent({ at: [PB[0], y, PB[1]], face: -0.5, name: "passB" }),
    k.agent({ at: [sA[0] - 0.85, y, -4.0], face: 0.35, name: "h0" })];
    const card = new T.Group(); k.scene.add(card); KIT.parts.add(card, KIT.parts.rbox(0.22, 0.15, 0.02, KIT.parts.mat("white"), 0.015, 0.008), 0, 0, 0);
    card.position.set(PB[0] - 0.28, y + 0.2, PA[1] + 0.12); // where 5.0 leaves it card.rotation.set(-0.3, 0, 0);
    const tLook = E.at(k, "5A.1", "look"), tName = E.after(k, "5A.1", "operator");
    const tFree = FAST ? tFreeF : r2.start + 200;
    // panels on the left of the back wall; the third is the red one
    const dt = 700, times = [tLook - 1400, tLook - 700, tLook, null]; // the eye goes along the wall and lands on the red one on "look" (lead 195916)
    const pan = E.panels(k, new T.Vector3(cx - 0.9, y + 1.05, -5.55), { times, red: { 2: [-1e9, tFree] } }); // panel and ring clear together as the hand arrives
    // ruling 49: no words; each screen glows as it is looked at, about 0.7 s apart
    E.ring(k, new T.Vector3(sA[0], y, sA[1]), { tRed: -1e9, tGreen: tFree, tOff: tFree + 1400 } /* v1.6 (pre-read 0050 fault 3): green held about 1 s */); // ruling 40 / lead 175358: the ring clears as the person acts, before the tick
    // the operator: in from the east wall, looks along the panels, walks to the stuck one, frees it
    const p = k.person({ at: [cx - 3.8, y, -4.6], face: 1.57, blend: 350, settle: 300 }); // v2.1 (pre-read 1025): every pose change eases over 350 ms (the pointing arm snapped in one frame) and every walk eases in and out of the stride
    p.walk(-2700, 6000, [[cx - 3.8, y, -4.6], [cx - 1.4, y, -4.0]]); /* v2.0 (visuals 080638): the same path over 6.0 s, so the entry peaks near 35 px a frame (was 3.6 s, 50 to 59 px) */ /* v1.8b: 2.5 m in 3.6 s, stopping left of the stuck agent, not behind it */ /* v1.8 (v2-check 025222, join 57): 5.0's close frame has nobody here, so the operator walks in from the left edge after the cut, along the back wall to the panels; earlier entries: v1.6c just left of the pair, v1.6b behind them, v1.5 through the east wall */
    times.forEach((ti, i) => { if (ti != null) p.turn(ti - 200, 300, pan.pt(i === 2 ? 1.55 : i)); }); // the pointing hand is right of the body's line, so it aims a little left of the red panel (pre-read 2145)
    p.walk(times[2] - 1300, 1100, [[cx - 1.4, y, -4.0], [cx - 0.2, y, -4.85]]).turn(times[2] - 100, 200, Math.PI); // steps up to the red one
    p.pose(times[2], "point", { blend: 800 }).pose(times[2] + 900, "stand", { blend: 800 }); // v2.3 (pre-read 1305): 800 ms each way, so the hand moves under 40 px a frame // v2.2 (pre-read 1105): up and down over 500 and 450 ms, the walk after the arm is down // the hand on the red panel, on "look" (pre-read 2235: from afar it landed on the white one)
    p.walk(times[2] + 1750, 1000, [[cx - 0.2, y, -4.85], [sA[0] + 0.75, y, sA[1] - 0.2]]).turn(times[2] + 2750, 250, [sA[0], y + 0.8, sA[1]]);
    p.pose(tFree, "point", { blend: 800 }).pose(tFree + 900, "stand", { blend: 800 }); p.walk(tFree + 1750, 900, /* v2.2 (pre-read 1105): the walk began 100 ms into the arm's ease down and cut it to one frame */ [[sA[0] + 0.75, y, sA[1] - 0.2], [cx + 0.9, y, -4.7]]); p.at(tB, [6.4, -80, -3.2]); // stays by the freed agent; gone across the cut to W, where the operator is the one at the hatch (pre-read 2005)
    stuck.act(tFree + 300, "wake").fx(tFree + 400, "tick").act(tFree + 900, "hop").walk(tFree + 1400, 2000, [[sA[0], sA[1]], [sA[0] + 0.5, sA[1] + 0.8], [cx + 0.1, -1.4]] /* v1.6 (pre-read 0050 fault 4): stops short of the operator, who steps back */ /* along the clear front, away from the bystanders (pre-read 2355) */);
    k.cue(tFree + 400, "flow");
    // the card lands on the right, clear of the panels
    k.ui.nameCard(tName, { lineAt: FAST ? 0 : 1100, /* ruling 167 (4) */ name: "an operator", stamp: "For people, a manager", x: 1150, y: 150, t1: FAST ? tB : Math.min(Math.max(tName + 3500 + 250, r2.start + 1400), r2.end) }); /* gone as the camera pulls back (r2.end, 9.57 s) */ /* v1.7 (v2-check 020158, ruling 95): whole for 3.5 s */
    // rest: pull back to W; the operator at the hatch (east end); the label docks
    const tBack = tB;
    [stuck, ...roomAgents].forEach((a) => a.hide(tBack)); // v2.1 (pre-read 1045): gone across the cut, so in W they do not push the teams room's crowd (kit/crowd.js:137) and 5B1 opens on the same crowd
    k.person({ at: E.HATCH, face: -0.6 });
    const opPin = k.ui.dock(tBack + (FAST ? 400 : 2000), { text: "an operator", at: /* ruling 113 D: no small line */ new T.Vector3(E.HATCH[0], 0.9, E.HATCH[2]), side: "east", y: 262, t1: D - 300 }); // gone 0.3 s before the cut (visuals 195758)
    FILM._post.push((t) => { const u = 1 - tw(t, D - 500, D - 300); [opPin.el, opPin.line, opPin.dot].forEach((e) => { if (e) e.style.opacity = String(u * +(e.style.opacity || 1)); }); }); // v2.0: the pin leaves over 200 ms (was one frame)
    const Lk = E.R("teams", 0.3, 0.7, -2.9); // 5.0's room frame, so 5A opens on 5.0's last frame
    locator(k, { room: "teams", to: tBack }); roomRing(k, Wb, "teams", tBack, tBack + 600); // VL 15.76
    k.cam.keys([
      { t: 0, view: k.cam.on(Lk, { size: "room", px: 300, focus: [sA[0], y + 0.7, sA[1]] }) },
      { t: tBack - 1, hold: true },
      { t: tBack, view: E.WLEFT, cut: true }, // ruling 103 (d): the room to W is a hard cut; the room is full again across it. v2.0: the base out of the band
      { t: D + 1, hold: true, drift: false }, // v2.0: no push, so 5B1 opens on this frame (the crowd and the breath keep it alive)
    ]);
    return {};
  },
});
