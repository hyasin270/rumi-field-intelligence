// 3A2 · S · v2-shots-c. "About thirteen hundred meetings so far, each one kept where any agent can find it."
// The move: the store is fitted in B2 east and what is said falls down the slots into it as pages; on "find", one agent
// draws one meeting out of a stack and reads it, and holds it into 3B1 (lead 082814 item 10).
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_c/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "3A2", type: "S", row: "3A2", dur: 9000, screens: ["call-notetaker"],
  setup(k) {
    k.breathe();   // VL 15.89 b (v2-visuals 082838): every render from now; signed renders are not redone for it
    const C = window.SC, S1 = C.S1, V = C.V3, D = k.dur;
    const tInst = 700;
    const W = C.world(k, 3, { storeAt: tInst, standEmpty: true });   // the stand installs empty and fills as what is said lands (VL 15.64)
    const ag = S1.R("store", -0.4, 0, -2.3);
    C.crowd(k, W, { fitted: { board: -1e9, skills: -1e9, gates: -1e9 }, clear: [{ room: "store", x0: 0.3, x1: 5.8, z0: -5.0 }] });
    const tab = C.meetingTable(k, W, -1, [0.0, 0, -2.7]); C.laptopFace(k, tab.laptop, -1000, {});
    C.seated(k, W);   // as 3.0 leaves the meeting
    // fast only (D under 7.0 s): 3A1's fast branch clicks "Invite" on its word and packs join, recording and lines into 0.6 s, so
    // f000 here reads 3A1's clock from the word itself (k.word on row 3A1.1, before this shot, so negative). D >= 7000 as signed
    const tI = D < 7000 ? k.word("3A1.1", "invites") : null, sh1 = tI == null ? 0 : tI - 5600;
    const scr = k.screen("call-notetaker", { t0: 0, events: tI != null ? { cur: 2000 + sh1, ppl: 3000 + sh1, type: 3500 + sh1, sug: 4100 + sh1, invite: tI, join: tI + 250, rec: tI + 500, lines: tI + 600 }
      : { cur: -6145, ppl: -5145, type: -4645, sug: -4045, invite: -2545, join: -1995, rec: -1345, lines: -1145 }, opt: { dur: 10000 } });   // 3A1's events less its 7.7 s, so f000 shows 3A1's last lines (pre-read 2305)
    scr.pushOut(0, 1200, { to: tab.laptop, ease: "io", fade: "soft" });   // soft: whole at f000, as 3A1 ends (pre-read 2305)   // a 1.2 s close, so the cut from 3A1's panel does not jump (pre-read 2110)
    k.cue(tInst, "install");
    const tNum = C.at(k, "3A2.1", "thirteen", 200), tFind = C.at(k, "3A2.1", "find", 300);
    // VL 15.64 / ruling 81: each speech mark comes down the east slot and lands on an empty place of the stand as a
    // meeting. Pre-read 1655: none flies until the camera has landed (no mark at the lens, none vanishing over the table,
    // 3A1's last frame has none either); each travels under the store's ceiling, above the keeper's head, then drops onto
    // its place and vanishes as its meeting lowers in. Front and middle tiers first; the top tier after "about 1,300
    // meetings" has gone, so no meeting lands behind its words.
    const ST = W.stand, N = ST.places.length, yC = ag.y + 1.4, dur = 600;   // lower, under the number, and fewer in the air at once (pre-read 2030)
    const tNumIn = Math.max(tNum, 2000), tNumOut = tNumIn + 2700, tA = 2000 + dur, tB = tFind - 300, tC = tNumOut + 100;
    // landing order spread across the stand (pre-read 2305: marks crossed), so marks in the air at once are far apart
    const spread = (n, s) => { const o = []; for (let j = 0; j < n; j++) o.push((j * s) % n); return o; }, gcd = (a, b) => (b ? gcd(b, a % b) : a);
    const strideFor = (n) => { for (let s = Math.max(2, Math.round(n / 3)); s < n; s++) if (gcd(s, n) === 1) return s; return 1; };
    const PICK = 6, fp = ST.front(PICK);
    const a = k.agent({ at: [ag.x, ag.y, ag.z], face: 0.35, name: "keeper" });
    a.walk(tFind - 2300, 1900, [[fp.x - 1.2, fp.z + 0.25]], { face: 0.6 });   // a walking pace (pre-read 1750: 41 to 45 px a frame); it stops 1.2 m west, at the meeting's own depth, so floor shows between them
    // ruling 164 (c), fast only (D under 7.0 s; AI-FAST 4c is 5.23 s): with the signed 1.2 s hold the arm was still up at the cut and
    // 3B1 opens with it down. FAST holds the reach so the arm is down 150 ms before the cut (kit: in 450, hold, back 360). D >= 7000 as signed
    a.reach(tFind - 300, 450, V([fp.x - 0.45, fp.y + 0.15, fp.z]), { hand: "R", hold: D < 7000 ? Math.max(200, D - 150 - (tFind - 300) - 810) : 1200 });
    // v2-visuals 080334 (look read s26): a mark sat on the keeper's dome (f125 to f128), a front mark fell across a landed
    // middle meeting (f115 to f120) and two pairs overlapped (f104 to f112). The landings are now scheduled in screen space,
    // in 3A2's landed view (the camera holds still from 2000 ms, so every flight is seen from one place): front tier, then
    // middle, then top, so no mark ever falls in front of a meeting already landed; a flight starts only when its mark stays
    // clear of the keeper (body, dome and reach), of every other mark in the air, and of the number while it shows.
    const PV = C.view3A2(k, W), TH = window.THREE, cam3 = new TH.PerspectiveCamera(PV.fov || 20, 1920 / 1080, 0.05, 500);
    { const yw = (PV.yaw * Math.PI) / 180, pt = (PV.pitch * Math.PI) / 180, lk = V(PV.look);
      cam3.position.copy(lk).addScaledVector(new TH.Vector3(Math.sin(yw) * Math.cos(pt), -Math.sin(pt), Math.cos(yw) * Math.cos(pt)), PV.dist);
      cam3.up.set(0, 1, 0); cam3.lookAt(lk); cam3.updateProjectionMatrix(); cam3.updateMatrixWorld(true); }
    const pj = (x, y, z) => { const p = new TH.Vector3(x, y, z).project(cam3); return [(p.x * 0.5 + 0.5) * 1920, (-p.y * 0.5 + 0.5) * 1080]; };
    const boxOf = (cx, y0, y1, cz, hw, hd, pad) => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9;
      for (const dx of [-hw, hw]) for (const yy of [y0, y1]) for (const dz of [-hd, hd]) { const q = pj(cx + dx, yy, cz + dz); a = Math.min(a, q[0]); b = Math.min(b, q[1]); c = Math.max(c, q[0]); d = Math.max(d, q[1]); }
      return [a - pad, b - pad, c + pad, d + pad]; };
    const hit = (p, q) => p[0] < q[2] && q[0] < p[2] && p[1] < q[3] && q[1] < p[3];
    const markBox = (i, t0, t, pad) => { const q = ST.point(i), s = Math.min(1, Math.max(0, (t - t0) / dur)), y = q.y + hTop[i] - (hTop[i] - 0.35) * s * s * s;
      return boxOf(q.x, y - 0.19, y + 0.14, q.z + 0.3, 0.21, 0.04, pad); };
    const keeperBox = (t) => { const w = a.where(t), reach = t > tFind - 400 ? 0.55 : 0;   // the dome is the top; the reach adds the arm to the east
      const b1 = boxOf(w.x, ag.y, ag.y + 0.95, w.z, 0.3, 0.3, 14); if (!reach) return b1; const b2 = boxOf(w.x + reach / 2, ag.y + 0.2, ag.y + 0.7, w.z, reach / 2 + 0.1, 0.2, 14);
      return [Math.min(b1[0], b2[0]), Math.min(b1[1], b2[1]), Math.max(b1[2], b2[2]), Math.max(b1[3], b2[3])]; };
    const hTop = new Array(N).fill(0.9), TEXT = [930, 50, 1840, 270], textOn = (t) => t > tNumIn - 100 && t < tNumOut - 50;   // the number is gone by f139 (4633 ms)
    const GAP = 100, T0 = 2000, LAST = tFind + 60, flights = [], log = [];
    const meetBox = (g) => { const q = ST.centre(g); return boxOf(q.x, q.y - ST.H / 2, q.y + ST.H / 2, q.z, 0.4, 0.35, 0); };
    const pathBox = (j, h) => { const q = ST.point(j); return boxOf(q.x, q.y + 0.35 - 0.19, q.y + (h || hTop[j]) + 0.14, q.z + 0.3, 0.21, 0.04, 0); };
    // a place under the number drops its mark from lower, so it clears the words and can land while they show
    for (let i = 0; i < N; i++) for (const h of [0.9, 0.8, 0.7, 0.6, 0.55]) { hTop[i] = h; if (!hit(pathBox(i, h), [TEXT[0] - 6, TEXT[1] - 6, TEXT[2] + 6, TEXT[3] + 6])) break; }
    // a mark may not fall in front of a meeting of a higher tier already there: so a place whose meeting would lie across a
    // lower place's falling mark waits until that lower place has had its mark (only where the two overlap on screen)
    const cross = (j, g) => ST.places[g].tier > ST.places[j].tier && hit(pathBox(j), meetBox(g));
    const ok = (i, t0) => { for (let t = t0; t <= t0 + dur; t += 33) { const mb = markBox(i, t0, t, 6);
        if (hit(mb, keeperBox(t))) return "keeper@" + t; if (textOn(t) && hit(mb, TEXT)) return "text@" + t;
        for (const f of flights) if (t >= f.t0 && t <= f.t0 + dur && hit(mb, markBox(f.i, f.t0, t, 6))) return "mark" + f.i + "@" + t; }
      return null; };
    let cur = T0; const rem = spread(7, 3).map((c) => [c, 7 + c, 14 + c]).reduce((x, y) => x.concat(y), []).sort((x, y) => ST.places[x].tier - ST.places[y].tier);
    while (rem.length) { let got = null;
      const allowed = rem.filter((i) => !rem.some((j) => cross(j, i)));
      for (let t0 = cur; t0 + dur <= LAST && !got; t0 += 20) { const c = allowed.filter((i) => !ok(i, t0)); if (c.length) got = [c[0], t0]; }
      if (!got) { got = [allowed[0], cur]; log.push("FORCED " + allowed[0] + " at " + cur + ": " + ok(allowed[0], cur)); }
      flights.push({ i: got[0], t0: got[1] }); rem.splice(rem.indexOf(got[0]), 1); cur = got[1] + GAP; }
    const tLand = new Array(N); flights.forEach((f) => { tLand[f.i] = f.t0 + dur; });
    // landed meetings never lie across a mark in the air (in front of it): checked, logged for the render log
    flights.forEach((f) => { flights.forEach((g) => { if (g.i === f.i || tLand[g.i] - 60 >= f.t0 + dur) return; const q = ST.centre(g.i);
      const mbox = boxOf(q.x, q.y - ST.H / 2, q.y + ST.H / 2, q.z, 0.4, 0.35, 0); for (let t = Math.max(f.t0, tLand[g.i] - 60); t <= f.t0 + dur; t += 33) if (hit(markBox(f.i, f.t0, t, 0), mbox) && ST.places[g.i].tier > ST.places[f.i].tier) { log.push("ACROSS " + f.i + " over " + g.i + " at " + t); break; } }); });
    console.warn("3A2 schedule " + JSON.stringify(flights.map((f) => [f.i, f.t0])) + " hTop " + JSON.stringify(hTop) + " " + (log.join("; ") || "clean"));
    window.__3A2 = { flights, log };
    const landAt = (i) => tLand[i];
    const B = [];
    for (let i = 0; i < N; i++) { const tl = landAt(i), t0 = tl - dur, land = ST.point(i);
      B.push({ t0, dur, kind: "fall", vanish: true, size: 0.6, tone: C.MEET_TONE, toneDark: 0xB7A487,
        path: [[land.x, land.y + hTop[i], land.z + 0.3], [land.x, land.y + (hTop[i] + 0.35) / 2, land.z + 0.3], [land.x, land.y + 0.35, land.z + 0.3]] });   // a short drop over its own place, under the number and inside the frame (pre-read 2355)
      ST.fill(i, tl - 60, { from: 0.03, dur: 240 }); }   // the meeting appears in its place as its mark lands, not in the air before (pre-read 2030)
    C.bubbles(k, B); k.cue(tA - dur, "pages-fall");
    k.ui.number(tNumIn, { value: 1450, from: 1450, dur: 1, prefix: "about ", unit: "meetings", hold: 2700, x: 955, y: 60 });   // after the camera lands in the store, on bare wall (120020 item 10, 122141 item 3)
    // on "find" the keeper goes to one meeting on the stand and reads it where it is kept: it lights (VL 15.54: the one
    // yellow, as an agent reads it). 3B1 brings that same meeting (place 6, the front tier's east end) out. The keeper
    // stands 0.85 m west of it with floor between, and keeps facing it (no point away, pre-read 1655)
    C.litSolid(k, ST.unit(PICK), [0, 1, 2].map((li) => ({ li, t0: tFind, t1: null, side: 0xC99A2E })));   // v2-check 012840: the east side was 8% against the side wall; the deeper side tone 3B2 uses (board 20261112T005517 (b))
       // lit to the cut, 300 ms or more in (pre-read 2110); 3B1 opens lit
    k.cue(tFind, "page");
    // VL 15.76: the map from the moment the call screen has gone; the pavilion, then the store as the camera lands in it
    locator(k, { room: "pav", from: 0, to: D + 1, changes: [[2000, "store"]] });
    k.cam.keys([
      { t: 0, view: k.cam.on(V([0.6, 0.9, -2.6]), { size: "room", px: 280, yaw: -14 }) },
      { t: 600, hold: true },
      { t: 2000, view: C.view3A2(k, W), ease: "io" },   // the picked meeting (place 6) and the keeper inside the frame; 3B1 opens on this view
      { t: D + 1, hold: true, drift: false },   // 3B1 opens on this exact view (pre-read 1750)
    ]);
    return {};
  },
});
