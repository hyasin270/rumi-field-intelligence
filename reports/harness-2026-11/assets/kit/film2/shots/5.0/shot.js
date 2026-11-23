// 5.0 · W then S · v2-shots-e (v1.0 16:45Z: flat mouth, the three apart and turning, walkers out the back, a slower pale; v0.2: lead 074149 item 1, visuals 074104 item 6, VL 14.1 to 14.2). Question 5 lit in W
// (list at x 1180 until W-list lands) for 2 s; the list leaves; push in to bare B3 east. There: one agent stopped with a
// red ring while its neighbours walk round it; a pair passes one card back and forth (the loop). Then the previews.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_d/lib.js", false); x.send(); (0, eval)(x.responseText); })(); // 4C2's world, crowd, judge room and block, for frame 0 (ruling 120)
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_e/lib.js", false); x.send(); (0, eval)(x.responseText); })();
(function(){const x=new XMLHttpRequest();x.open("GET","snippets/locator.js",false);x.send();(0,eval)(x.responseText+";window.locator=locator;window.roomRing=roomRing;");})(); // VL 15.76 map and ring
FILM.shot({
  id: "5.0", type: "W", row: "5.0", dur: 12900,
  setup(k) {
    const E = window.SE, D = k.dur, T = THREE;
    k.breathe(); // VL 15.89 b
    // v1.4 (rulings 120, 87 a; v2-visuals 205546; v2-check 205625): frame 0 is 4C2's last frame. The same world, crowd, judge
    // room, seat and small model block, the three west labels as names only at x 290, the list with four ticks, and 4C2's camera
    // at the end of its drifted W-list hold. Question five lights on "Fifth"; list and labels leave together; the hard cut.
    const SD = window.SD, Wb = SD.world(k, { judge: -1e9 }); SD.hide(k, Wb.parts.bar); SD.hide(k, Wb.parts.judge);
    const y = E.roomY("teams"), cx = E.roomX("teams");
    const tQ = 0, tListOut = Math.max(2200, E.at(k, "5.0.1", "What happens") + 1400), tPush = tListOut + 250, tIn = tPush + 200; // ruling 103 (d): W to the room is a hard cut
    const tStuck = Math.max(tIn, E.at(k, "5.0.1", "stuck")), tLoop = Math.max(tIn + 600, E.at(k, "5.0.1", "loop"));
    // ruling 107 (script v1.6): the row ends on "jobs loop"; the person, the turn of three and the pale go with the cut sentence.
    // The shot ends on the jam and the card going round, to the cut.
    // the room's 50 mill, kept clear of a stage in front of the camera
    const C1 = SD.crowd1(k, Wb, { avoid: SD.B3avoid.concat(SD.blockAvoid), clear: ["gates", "store"].map((room) => ({ room, x0: -1.1, x1: 1.1, z0: -1.9, z1: -1.3 })) }); // 4C2's crowd exactly as 4C2 builds it (4C2/shot.js:11, its K 40 of 09:18Z), in the W-list hold only (v2.0, visuals 080334)
    { const T42 = (() => { try { const x = new XMLHttpRequest(); x.open("GET", E.TFILE || "../timing.json", false); /* ruling 138 (b): the version's own timing */ x.send(); return JSON.parse(x.responseText).shots.find((q) => q.id === "4C2").dur * 1000 - 33; } catch (e) { return 12434; } })(); const base = C1.at; C1.at = (i, t) => base(i, T42 + t); } // the crowd where 4C2's last frame leaves it (pre-read 2310: the milling room differed)
    const C = E.crowd(k, Wb, { fitted: E.FIVE, clear: [{ room: "teams", x0: 0.4, x1: 6, z0: -5.6 }, { x0: -6.2, x1: 6.2, z0: -1.6 }] }); // the close frame's room, after the cut
    k.each((t) => { C1.grp.visible = t < tPush; C.grp.visible = t >= tPush; });
    SD.judgeRoom(k, { barAt: -1e9, pile0: 3 }); SD.slots(k); k.agent({ at: SD.B3.judge, face: Math.PI / 2 - 0.7, name: "judge" }).act(0, "write"); SD.seat(k);
    { const c = SD.P.core; SD.model(k, { size: 2.1, hide: tPush }).path([{ t: 0, p: [c[0], c[1] - 0.3, c[2]] }]); }
    [["beads", "board"], ["hooks", "gates"], ["evals", "judge"]].forEach(([tx, r]) => { const dk = k.ui.dock(-1e6, { text: tx, at: Wb.side(r), side: "west", x: 290, t1: tListOut }); FILM._post.push((t) => { const v = 1 - FILM.tw(t, tListOut - 300, tListOut, "io"); [dk.el, dk.line, dk.dot].forEach((e) => { if (e) e.style.opacity = String(v * +(e.style.opacity || 1)); }); }); }); // they leave with the list, over its 300 ms
    // the stuck one: stands still, red ring; three neighbours walk round it
    const sA = [cx - 0.6, -2.6];
    const stuck = k.agent({ at: [sA[0], y, sA[1]], face: 0.3, name: "stuck", visibleFrom: tPush }); stuck.root.visible = false; // v2.2 (pre-read 1250): hidden at creation, so the crowd does not step away from it at f000 (it moves before the agent's first update)
    E.ring(k, new T.Vector3(sA[0], y, sA[1]), { tRed: tStuck - 200 });
    E.flatMouth(k, stuck, [[tStuck - 200, null]]); // ruling 87 e: flat while the ring is red (to the cut)
    stuck.act(tStuck, "slump").fx(tStuck + 100, "question", { size: 90, dur: 2600, dx: 0, dy: -30 });
    k.cue(tStuck, "bump");
    // the room's four panels (visuals 195758 item 1, lead 195916): white from the cut in; the one above the stuck one goes red on "stuck"
    const pnl = E.panels(k, new T.Vector3(cx - 0.9, y + 1.05, -5.55), { times: [], red: { 2: [tStuck - 400, 1e12] } }); k.each((t) => { pnl.visible = t >= tPush; }); // red over 300 ms; the room's things only after the cut (4C2 has none: pre-read 2235) // red over 300 ms, whole on "stuck"
    // every body on its own spot (0.2 of a body apart or more), none cut by the frame at rest (visuals 124618 items 10 to 12)
    const others = [];
    // v1.0 (16:45Z, pre-read stage5_e_1510 5.0 checks 4 and 5): the two walkers pass behind and leave the frame at the back
    // right before the camera lands, so no pair stands inside another and nobody rests cut by an edge
    // (v1.3) no walkers: nobody leaves the room in frame (ruling 103)
    // ruling 104 item 2 (v1.1, 17:00Z): "jobs loop" is a pair behind and right of the stuck one passing one card from one to
    // the other and straight back, twice, from "jobs"; it stops when the person arrives on "someone watches"
    const tJobs = E.at(k, "5.0.1", "jobs"), PA = [cx + 1.6, -4.25], PB = [cx + 2.35, -4.25]; // 0.35 m right of 17:15Z's still, clear of the person
    const pa = k.agent({ at: [PA[0], y, PA[1]], face: 0.5, name: "passA", visibleFrom: tPush }), pb = k.agent({ at: [PB[0], y, PB[1]], face: -0.5, name: "passB", visibleFrom: tPush }); pa.root.visible = false; pb.root.visible = false; const _unused = 0 /* three quarters to the lens (194118 item 3) */; others.push(pa, pb);
    const card = new T.Group(); k.scene.add(card); KIT.parts.add(card, KIT.parts.rbox(0.22, 0.15, 0.02, KIT.parts.mat("white"), 0.015, 0.008), 0, 0, 0);
    const leg = 480, gap = 100, legs = []; let tt = tJobs; for (let n = 0; tt + leg <= D - 100; n++) { legs.push([tt, n % 2]); tt += leg + gap; } if (legs.length && legs[legs.length - 1][1] === 1) legs.pop(); // round and round; it ends in B's hand, where 5A opens
    const hx = [PA[0] + 0.28, PB[0] - 0.28], hy = y + 0.2; // at the belly, well below the visors (pre-read 2110)
    k.each((t) => { let x = hx[0], up = 0; for (const [t0, dir] of legs) { if (t < t0) break; const u = FILM.tw(t, t0, t0 + leg, "io"); x = FILM.lerp(hx[dir], hx[1 - dir], u); up = Math.sin(Math.PI * u) * 0.08; }
      card.position.set(x, hy + up, PA[1] + 0.12); card.rotation.set(-0.3, 0, 0); card.visible = true; });
    legs.forEach(([t0, dir]) => { (dir ? pb : pa).reach(t0 - 150, leg + 300, [hx[1 - dir], hy, PA[1] + 0.12], { hold: 200 }); });
    k.cue(tJobs, "loop");
    // the three answers, each in this frame as it is said, no label (lead 105632 note 3, 124445):
    // a person walks in, stops beside the stuck one and faces it, whole and in front of nobody
    // (v1.6 cut) const watcher = k.person({ at: [6.6, y, -2.2], face: -1.57 }
    // (v1.6 cut) watcher.walk(tWatch - 1100, 2000, [[6.6, y, -2.2], [sA[0] + 
    // three agents near the hero, sharp, turn to face one spot
    // v1.0 (lead 151244 5.0 item 2): three apart (0.9 m or more), each side-on to us at first, all inside the frame; on
    // "big jobs" each turns to the one spot between them and leans in, so the turn reads from the front
    const spot = [sA[0] + 0.05, -4.6]; // h1 0.6 m further back: at 17:19Z it stood a third behind the stuck one
    const hud = [[sA[0] - 0.85, -4.0, 0.35]].map( /* one bystander facing the lens; 5A opens on the same three (visuals 195758) */(p, i) => { const a = k.agent({ at: [p[0], y, p[1]], face: p[2], name: "h" + i, visibleFrom: tPush }); a.root.visible = false; others.push(a); return a; });
    // (v1.6 cut) hud.forEach((a, i) => a.turn(tTeam + i * 150, 450, [spot[0],
    // in the last 2 s every agent but the stuck one pales to the sleepers' tone and holds (as 5C's sleepers)
    // (v1.6 cut) const tPale = Math.max(tSleep, D - 2000);
    // (v1.6 cut) others.forEach((a, i) => E.paleAgent(k, a, [[0, 0], [tPale +
    // (v1.6 cut) E.pale(k, C, tSleep, 900, null);
    { const qb = k.ui.questions(-1000, { active: 5, ticked: [1, 2, 3, 4], t1: tListOut, writeAt: { 1: -2000, 2: -2000, 3: -2000, 4: -2000, 5: -2000 } }); questionsEase(qb, { active: 5, activeAt: E.at(k, "5.0.1", "Fifth", 250), ms: 500 }); } // whole at frame 0, as 4C2 left it; five fills on "Fifth"
    // ruling 87 f: no docked labels at W-list here (they could not be whole inside x 96; pre-read 1740 item 9) // VL 15.56: the left column's labels in every W-list frame
    const Lk = E.R("teams", 0.3, 0.7, -2.9);
    locator(k, { room: "teams", from: tPush }); roomRing(k, Wb, "teams", tPush - 600, tPush); // whole to the cut (pre-read 1945 item 1) // VL 15.76
    k.cam.keys([
      { t: 0, view: Object.assign({}, window.CAMERA_RULES.views["W-list"], { dist: window.CAMERA_RULES.views["W-list"].dist * (1 - window.CAMERA_RULES.drift.push), yaw: window.CAMERA_RULES.views["W-list"].yaw + window.CAMERA_RULES.drift.yaw }) }, // 4C2's last frame: W-list at the end of its drift
      { t: tPush - 1, hold: true, drift: false },
      { t: tPush, view: k.cam.on(Lk, { size: "room", px: 300, focus: [sA[0], y + 0.7, sA[1]] }), cut: true },
      { t: D + 1, hold: true, drift: false }, // still to the cut, so 5A opens on this frame (pre-read 2145)
    ]);
    // the room's people and the card are not in 4C2's frame: they are in the room from the cut (pre-read 2235)
    /* v2.1 (pre-read 1045): visibleFrom tPush, not an opacity fade: the kit's crowd steps away from any agent whose root is visible (kit/crowd.js:137), so in W the four pushed 4C2's crowd out of place */ k.each((t) => { card.visible = t >= tPush; });
    return { stuck };
  },
});
