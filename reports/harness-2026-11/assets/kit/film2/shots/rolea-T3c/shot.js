// T3c · N · v2-shots-a. The same W; the floors below light under the people: "a shadow organisation".
// Rows T3c.1 ("People work above the surface. Agents work below it. We call this a shadow organisation.") and T3c.2
// ("Ours runs at Taleemabad, an education organisation in Pakistan, under one name, Rumi."), rest 3.5 s.
// Last frame = v2-shots-b's 1.0 first frame: the house W exactly, the five questions (none active), floors lit and bare,
// the crowd at b's S1.crowd state for its t = 0 (agreed on the board, 072037 and 0727).
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_a/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "rolea-T3c", type: "N", row: "T3c", dur: 19230,
  setup(k) {
    k.breathe();   /* VL 15.89 b (v2-visuals 082838): every render from now breathes, so no held frame repeats for 2 s */
    const SA = window.SA, D = k.dur, w = (row, word, fb) => SA.w(k, row, word, fb), T = THREE, tw = k.tw;
    const W = k.set.building({ stage: 0, closed: true }); W.open(-10000, 1);
    const C = SA.roomsCrowd(k, W, D);
    const tAbove = w("T3c.1", "above", 1000), tBelow = w("T3c.1", "below", 3400), tName = SA.r(k, "T3c.1").end + 50;
    const r2 = SA.r(k, "T3c.2");
    ["board", "skills", "gates", "store", "judge", "teams"].forEach((n, i) => W.glow(n, tBelow - 150 + i * 110, 800, 0.4));
    k.cue(tBelow - 150, "glow");
    if (0) { const card = k.ui.nameCard(tName, { name: "a shadow<br>organisation", t1: r2.start + 1800, x: 1124, y: 722 }); const nm = card.querySelector(".name"); if (nm) nm.style.fontSize = "96px"; }   /* VL 15.80: two lines at 96 px, box x 1124 to 1824, y 722 to 978, 40 px under the list (named exception) */
    // our name: the plaque lowers onto the pavilion roof on "Taleemabad"; "Rumi" pins the lower floors on its word (lead 074811 item 8)
    const tRumi = w("T3c.2", "rumi", r2.end - 500), tTal = Math.max(w("T3c.2", "taleemabad", r2.start + 1100), r2.start + 1800 + 350);   /* after the card has gone (one voice, 153200 item 14) */
    const plaque = k.set.part("sign", { text: "Taleemabad", w: 7.0, h: 1.6 }); plaque.position.set(0, 3.6, -1.2); k.scene.add(plaque);
    k.each((t) => { const u = k.tw(t, tTal - 200, tTal + 400, "out"), v = k.tw(t, D - 1500, D - 1100, "in"); plaque.visible = t > tTal - 200 && v < 0.999; plaque.position.y = 3.6 + 1.6 * (1 - u) + 14 * v;   /* lifts straight up out of frame */ });   /* lifts away with the line and labels, 1.1 s before the cut; it returns in R0 (ruling 107 i) */
    { const home = [[-3.0, -2.45, Math.PI], [-1.3, -2.9, -0.6], [2.1, -2.6, Math.PI], [3.5, -2.6, Math.PI], [2.9, -4.25, 0], [0.3, -3.7, 0.3]];   /* the six walk back to the kit's places before the cut (ruling 107 i) */
      const order = [0, 1, 5, 2, 4, 3], t0s = [-4600, -4300, -4000, -3900, -4900, -3900];   /* left to right, start i takes the i-th home by x, so no paths cross; the one going furthest back goes first (pre-read 2110, f574) */
      (W.people || []).forEach((p, i) => { const h = home[order[i]]; if (!h) return; p.walk(D + t0s[i], 2200, [[h[0], h[1]]]); p.turn(D - 1500 + i * 60, 400, h[2]);   /* one after another, never through each other */ }); }
    k.cue(tTal - 200, "install");
    // a change on each phrase of T3c.2 (director 081051 item 4): the six turn out to us on "education organisation", two lift a
    // hand on "Pakistan"; the rooms below brighten a step on "one name"
    const tEdu = w("T3c.2", "education", tTal + 1200), tPak = w("T3c.2", "pakistan", tTal + 2900), tOne = w("T3c.2", "one", tRumi - 900);
    /* VL 15.89 (pre-read 1000: f231 to f307 frozen on clean frames; the breath is under a pixel at W): while the card is up, the
       middle two of the six turn a little towards each other, then back to the lens before "education" */
    { const PP = W.people || [], ta = tName + 500, tb = Math.max(ta + 1500, Math.min(r2.start + 1400, tEdu - 900)); if (PP[2]) { PP[2].turn(ta, 600, 0.45); PP[2].turn(tb, 600, 0); } if (PP[3]) { PP[3].turn(ta + 150, 600, -0.45); PP[3].turn(tb + 150, 600, 0); } }
    (W.people || []).forEach((p, i) => { p.turn(tEdu + i * 90, 450, 0); if (i === 1 || i === 4) { p.pose(tPak + i * 60, "hand-up", { blend: 300 }); p.pose(tPak + 1600, "stand", { blend: 300 }); } });
    ["board", "skills", "gates", "store", "judge", "teams"].forEach((n, i) => W.glow(n, tOne + i * 80, 600, 0.6));
    // the list is off while the pins, the card and the names speak (one voice of text at a time, VL 7.1; labels hidden while
    // the list is up, VL 14.1); it returns for the last seconds, as 1.0 opens on it
    // T3b's last frame carried the list: it is there at T3c's first frame and leaves in 500 ms (v2-visuals 104433 item 4)
    if (0) k.ui.questions(-5000, { show: [1, 2, 3, 4, 5], x: 1168, y: 300 });   // ruling 80: up and still through the whole shot, T3b's place, 1.0's first frame
    // the six where T3b left them (the cut is not a jump)
    (W.people || []).forEach((p, i) => p.at(0, [-3.0 + i * 1.2, 0, -1.05], 0));
    // the ground line (on "above the surface"), the two labels on their own sentences, and Rumi as a bracket over every floor
    // below the line (v2-visuals 104433 items 1 to 5; lead 104646). Drawn in 2D on the projected model so they sit exactly.
    const ui = document.getElementById("ui"), NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg"); svg.setAttribute("width", "1920"); svg.setAttribute("height", "1080"); svg.style.cssText = "position:absolute;left:0;top:0"; ui.appendChild(svg);
    const ln = (wpx) => { const e = document.createElementNS(NS, "polyline"); e.setAttribute("stroke", "#34507A"); e.setAttribute("stroke-width", wpx); e.setAttribute("fill", "none"); e.setAttribute("stroke-linecap", "round"); svg.appendChild(e); return e; };
    const dot = () => { const e = document.createElementNS(NS, "circle"); e.setAttribute("r", "8"); e.setAttribute("fill", "#111418"); svg.appendChild(e); return e; };
    const lab = (txt) => { const d = document.createElement("div"); d.className = "abs pin w"; d.style.cssText = "position:absolute;left:0;top:0;text-align:right"; d.textContent = txt; ui.appendChild(d); return d; };
    const gl = ln(4), l1 = ln(3), l2 = ln(3), brk = ln(3), d1 = dot(), d2 = dot(), t1 = lab("your people"), t2 = lab("the agents"), t3 = lab("Rumi");
    const tLine = tAbove - 150, tL1 = tAbove + 300, tL2 = tBelow - 150, tOff = tName - 300, tR = tRumi - 150;
    const P = (x, y, z) => KIT.render.project(new T.Vector3(x, y, z));
    W.root.updateMatrixWorld(true); const bb = new T.Box3().setFromObject(W.root), X0 = bb.min.x, X1 = bb.max.x;   // the block's corners, measured
    const pavX0 = (W.parts.pav ? new T.Box3().setFromObject(W.parts.pav).min.x : -4.8);
    t2.innerHTML = "the<br>agents";
    FILM._post.push((t) => {
      const a = P(X0, 0.02, 0.05), b = P(X1, 0.02, 0.05), g = tw(t, tLine, tLine + 600, "io");
      const gm = g * Math.min(1, (1080 - a.x) / Math.max(1, b.x - a.x));   /* stops 40 px clear of the list (pre-read 2110, f260) */
      gl.setAttribute("points", `${a.x},${a.y} ${a.x + (b.x - a.x) * gm},${a.y + (b.y - a.y) * gm}`); gl.style.opacity = (g > 0 ? 1 : 0) * (1 - tw(t, D - 1500, D - 1100, "io"));   /* gone before the cut: 1.0 opens without it */
      const left = P(X0, -3.0, 0).x, pavLeft = P(pavX0, 1.2, -0.7).x;                                   // the block's left wall on screen
      const show = (el, t0, t1x) => { const v = tw(t, t0, t0 + 420, "outExpo") * (1 - tw(t, t1x, t1x + 300, "io"));   /* leaves over 300 ms (pre-read 2110) */ el.style.opacity = v; return v; };
      // "your people": dot on the first person, leader to 12 px short of the text, text 24 px or more left of the block
      const pp = (W.people || [])[0]; const ph = pp ? P(pp.root.position.x, 0.9, pp.root.position.z) : P(-3, 0.9, -1);
      const v1 = show(t1, tL1, tOff), x1 = Math.max(96, pavLeft - 110 - t1.offsetWidth), y1 = ph.y - 170;   /* 60 px clear of the roof (153200 item 13) */   // on the page above the block, left of the pavilion
      t1.style.transform = `translate(${x1}px,${y1 - t1.offsetHeight / 2}px)`;
      l1.setAttribute("points", `${x1 + t1.offsetWidth + 12},${y1} ${ph.x},${ph.y}`); l1.style.opacity = v1; d1.setAttribute("cx", ph.x); d1.setAttribute("cy", ph.y); d1.style.opacity = v1;
      // "the agents": dot on an agent in the west middle room
      const ah = P(-3.4, -6.4 + 0.45, -2.2), v2 = show(t2, tL2, tOff), wallAt = Math.min(left, P(X0, -6.4 + 0.45, 0.05).x, P(X0, -6.4 + 0.45, -4).x), x2 = wallAt - 72 - t2.offsetWidth, y2 = ah.y;   /* v2-visuals 080638: 60 px of air measured at the label's own height (the wall slants), plus 12 px margin: the projected wall point sits about 9 px right of the face seen (pre-read 0850 T3c: 59 px) */
      t2.style.transform = `translate(${x2}px,${y2 - t2.offsetHeight / 2}px)`;
      l2.setAttribute("points", `${x2 + t2.offsetWidth + 12},${y2} ${ah.x},${ah.y}`);   /* the leader starts 12 px from the text, as "your people" does (it stopped 49 px short) */ l2.style.opacity = v2; d2.setAttribute("cx", ah.x); d2.setAttribute("cy", ah.y); d2.style.opacity = v2;
      // "Rumi": a bracket down the block's left side from the top floor to the bottom floor, the name beside it
      const top = P(X0, -0.3, 0), bot = P(X0, -9.6, 0), bx = Math.min(top.x, bot.x) - 16, v3 = show(t3, tR, D - 1500);   /* leaves before the cut */
      brk.setAttribute("points", `${bx + 10},${top.y} ${bx},${top.y} ${bx},${bot.y} ${bx + 10},${bot.y}`); brk.style.opacity = v3;
      t3.style.transform = `translate(${bx - 60 - t3.offsetWidth}px,${(top.y + bot.y) / 2 - t3.offsetHeight / 2}px)`;
    });
    // the hold drifts in and lands exactly on the house W at the last frame (VL 4.5 drift; join to 1.0)
    const Wv = k.cam.named("W-list"), DR = window.CAMERA_RULES.drift, push = typeof DR === "number" ? DR : DR.push, dyaw = typeof DR === "number" ? 0 : DR.yaw;
    const start = Wv;   // the house W-list exactly; the hold's drift then ends at SA.drifted(W-list), which 1.0 starts from (posted to v2-shots-b)
    k.cam.keys([{ t: 0, view: start }, { t: D, hold: true, drift: false }]);   /* no drift: the last frame is the plain W-list that 1.0 opens on (pre-read 0000: 12.6% jump at the cut) */
    return {};
  },
});
