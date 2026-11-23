// 5Dd · W, then the slow push · v2-shots-e (v1.0, ruling 99, TIMING v6; ruling 87 d; v2-visuals 151936 B; ruling 73 b).
// Row 5D.6. A hard cut from the call to W; the "proactive" card is carried across the cut at the age it had (same line as
// 5Dc, a start time below zero). 5Da's three call marks come back at half strength with no lines; then one hand mark in
// the same ring stands on the note taker, which stands clear in front of the meeting table, its hand up, the only agent in
// colour. A slow push from W over the row (ease in and out) to the pavilion at 1.6 times its W size with the top floor whole
// below it; the last 2 s hold. "From reactive to proactive" arrives after the camera lands, on clear page right of the
// building. On "begun" one neighbour lifts its head and stays pale. R0 opens on this last frame.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_e/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "5Dd", type: "W", row: "5Dd", dur: 12533,
  setup(k) {
    const E = window.SE, D = k.dur, T = THREE, tw = FILM.tw;
    const Wb = E.world(k, E.ALL);
    const r6 = k.row("5D.6") || (E.FB["5D.6"] = { start: 300, end: 9033, dur: 8733 });
    const C = E.crowd(k, Wb, { fitted: E.ALL, sleep: [-5000, null], work: false, hideIdx: [1] });
    E.pale(k, C, -1000, 10, null);
    E.alwaysOn(k, new T.Vector3(...E.BOX), {}); // the always-on box, lit, as in 5C and R1
    const lap = Wb.parts.laptops[1], lp = lap.getWorldPosition(new T.Vector3());
    // the note taker, clear of the people, in front of the meeting table, hand up from the first frame
    const NT = [lp.x - 1.3, 0, lp.z + 2.1]; // visuals 172016: another 0.3 m west // v1.1 (visuals 171219 item 3): 0.6 m forward and west, bare floor round it
    const nt2 = k.agent({ at: NT, face: 0.1, name: "notetaker-up" }); nt2.act(0, "raise-hand");
    const glow = new T.PointLight(0xfff1dd, 5, 3.5, 1.4); glow.position.set(NT[0], 1.8, NT[2] + 0.7); k.scene.add(glow);
    const nIdx = 1, nsl = C.at(nIdx, 0), nb2 = k.agent({ at: [nsl.x, nsl.y + 0.08, nsl.z], face: 0.1, name: "neighbour" });
    E.paleAgent(k, nb2, [[0, 1]]); E.closedEyes(k, nb2, [[-1e9, E.at(k, "5D.6", "begun")]]); nb2.act(0, "sleep").act(E.at(k, "5D.6", "begun"), "look");
    // the "proactive" card from 5Dc, the same line; its "name" cue belongs to 5Dc, so drop the copy this shot makes
    const tPro = E.after(k, "5D.5", "proactive"), nc0 = FILM._cues.length;
    k.ui.nameCard(tPro, { name: "proactive", stamp: "acts before anyone asks", t1: tPro + 3500 + 250, x: 1200, y: 140, lineAt: E.shotDur("5Dc") < 16000 ? 0 : undefined /* 13 Nov 07:12Z: as 5Dc's card (its length decides), so the carried card crosses the cut with its line */ }); // visuals 172456: the same pixels as 5Dc
    FILM._cues.splice(nc0).filter((c) => c.t >= 0).forEach((c) => FILM._cues.push(c));
    // the marks (ruling 87 d): 5Da's three call signs at half strength, no lines, beside the box; then the hand mark in the
    // same 68 px ring over the note taker, full strength
    const ui0 = document.getElementById("ui"), svgNS = "http://www.w3.org/2000/svg";
    const csvg = document.createElementNS(svgNS, "svg"); csvg.setAttribute("width", "1920"); csvg.setAttribute("height", "1080"); csvg.style.cssText = "position:absolute;left:0;top:0;pointer-events:none"; ui0.appendChild(csvg);
    const SIGN = ['<text x="0" y="13" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="38" fill="#111418">@</text>',
      '<rect x="-17" y="-12" width="34" height="24" rx="4" fill="none" stroke="#111418" stroke-width="3.5"/><path d="M-17 -10 L0 3 L17 -10" fill="none" stroke="#111418" stroke-width="3.5"/>',
      '<path d="M-12 8 L-12 -2 A12 12 0 0 1 12 -2 L12 8 Z" fill="none" stroke="#111418" stroke-width="3.5" stroke-linejoin="round"/><path d="M-16 8 H16" stroke="#111418" stroke-width="3.5" stroke-linecap="round"/><circle cy="13" r="3.5" fill="#111418"/>'];
    const HAND = '<path d="M-9 14 L-9 -2 M-9 -2 L-9 -14 M-3 -2 L-3 -18 M3 -2 L3 -17 M9 0 L9 -12 M-9 14 Q-9 18 -4 18 L6 18 Q12 18 13 10 L15 -2" fill="none" stroke="#111418" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M-9 4 L-15 -4" stroke="#111418" stroke-width="3.5" stroke-linecap="round"/>';
    const ring = (inner) => { const g = document.createElementNS(svgNS, "g"); g.innerHTML = '<circle r="34" fill="#fff" stroke="#111418" stroke-width="3"/>' + inner; csvg.appendChild(g); return g; };
    const cm = SIGN.map(ring), hm = ring(HAND);
    const tMarks = E.at(k, "5D.6", "reactive"), tHand = E.at(k, "5D.6", "spots");
    FILM._post.push((t) => {
      const b = KIT.render.project(new T.Vector3(E.BOX[0], 1.4, E.BOX[2]));
      cm.forEach((g, i) => { const v = 0.5 * tw(t, tMarks + i * 150, tMarks + 300 + i * 150);
        g.style.display = v > 0 ? "" : "none"; g.setAttribute("transform", `translate(${Math.max(140, b.x - 70)},${Math.max(98 + 168, b.y - 70) - i * 84}) scale(0.85)`); g.style.opacity = v; });
      const q = KIT.render.project(new T.Vector3(NT[0], 1.0, NT[2])), u = tw(t, tHand - 300, tHand, "out"); // ring centred 70 px above the head (171219 item 4)
      hm.style.display = u > 0 ? "" : "none"; hm.setAttribute("transform", `translate(${q.x},${q.y - 70}) scale(${0.6 + 0.4 * u})`); hm.style.opacity = u;
    });
    k.cue(tHand, "hand");
    // lead 171257 item 2: from "tells" the two people nearest the note taker turn to face it; nobody walks
    const tTells = E.at(k, "5D.6", "tells");
    // the people stand in the pavilion's own space: measure and aim in world space, then turn in the pavilion's frame (pre-read 1740 item 3)
    const ntW = new T.Vector3(NT[0], 0.9, NT[2]);
    Wb.people.map((q) => ({ q, d: q.root.getWorldPosition(new T.Vector3()).distanceTo(ntW) })).sort((a, b) => a.d - b.d).slice(0, 2)
      .forEach(({ q }, i) => { const loc = q.root.parent.worldToLocal(ntW.clone()); q.turn(tTells + i * 150, 500, [loc.x, loc.y, loc.z]); });
    // the push: W to the pavilion at 1.6 times its W size, top floor whole; the line arrives after the camera lands
    const tLand = D - 2000;
    k.ui.text("turn", tLand + 100, null, '<div style="font-family:\'Fredoka\';font-weight:600;font-size:64px;color:#111418;line-height:76px;width:594px">From reactive<br>to proactive</div>', { x: 1230, y: 130 }); // visuals 171219 item 1: top right, level with the pavilion
    // visuals 171219: the push stays at 1.6 (the 1.45 of 17:05Z is withdrawn)
    const push = { look: [3.2, -0.4, -2.2], dist: 58.2 / 1.6, yaw: -14, pitch: -12 };
    k.cam.keys([{ t: 0, view: "W-list" }, { t: r6.start, hold: true }, { t: tLand, view: push, ease: "io" }, { t: D + 1, hold: true, drift: false }]); // the end frame holds still (pre-read 1740 item 1)
    return {};
  },
});
