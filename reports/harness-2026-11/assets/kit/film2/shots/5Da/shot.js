// 5Da · W · v2-shots-e (v1.0, ruling 99: cut from shots/5D/shot.js v0.5 lines 18-48 and the first camera key; TIMING v6).
// Row 5D.1. Frame 0 is 5C's last frame (ruling 87 b): the list whole with four ticks; question five ticks at 0.5 s, holds
// 1 s, the list leaves. The floor asleep; three calls arrive in turn (a tag, an invite, a notice), each wakes one agent,
// which sits again when done. Name card "reactive" whole until 3.5 s after its name, gone on the last frame (ruling 96).
// Nobody moves after the third woken agent sits (lead 151244 item 2): no keep-clear box in this shot.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_e/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "5Da", type: "W", row: "5Da", dur: 12333,
  setup(k) {
    const E = window.SE, D = k.dur, T = THREE, tw = FILM.tw;
    const Wb = E.world(k, E.ALL);
    const r1 = k.row("5D.1") || (E.FB["5D.1"] = { start: 300, end: 8933, dur: 8633 });
    const C = E.crowd(k, Wb, { fitted: E.ALL, sleep: [-5000, null], work: false, hideIdx: [18, 6 * 4 + 4, 6 * 2 + 5] });
    E.pale(k, C, -1000, 10, null);
    E.alwaysOn(k, new T.Vector3(...E.BOX), {}); // the always-on box, lit, as in 5C and R1
    // the list is whole from the first frame; question 5's tick lands at 0.5 s, holds 1 s, then the list leaves
    // v1.1 (pre-read 5D: the list faded in over f001 to f006): the list and 5C's two labels are whole at frame 0 (their t0
    // below zero); they leave together by 2.1 s (ruling 87 b); then the left column's three labels arrive (VL 15.56)
    k.ui.questions(-1000, { ticked: [1, 2, 3, 4], tickAt: { 5: 500 }, t1: 2100, writeAt: { 1: -2000, 2: -2000, 3: -2000, 4: -2000, 5: -2000 } });
    E.leftPin(k, -1000, { text: "a hook", small: "stops", right: 340, y: 205, at: E.R("gates", -2.6, 1.4, -1.0), t1: 2100 });
    E.leftPin(k, -1000, { text: "a webhook", small: "wakes", right: 340, y: 105, at: new T.Vector3(E.BOX[0], 1.0, E.BOX[2]), t1: 2100 }); // the dot on the box's top, clear of its light (pre-read 2035 item 2)
    // ruling 87 f: no docked labels in 5Da (they could not be whole inside x 96 at W-list; pre-read 1740 item 1)
    // three calls, each with its own sign, a line to one agent, which stands lit for 1.2 s and then sleeps again
    const ui0 = document.getElementById("ui"), svgNS = "http://www.w3.org/2000/svg";
    const csvg = document.createElementNS(svgNS, "svg"); csvg.setAttribute("width", "1920"); csvg.setAttribute("height", "1080"); csvg.style.cssText = "position:absolute;left:0;top:0;pointer-events:none"; ui0.appendChild(csvg);
    const SIGN = ['<text x="0" y="13" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="38" fill="#111418">@</text>',
      '<rect x="-17" y="-12" width="34" height="24" rx="4" fill="none" stroke="#111418" stroke-width="3.5"/><path d="M-17 -10 L0 3 L17 -10" fill="none" stroke="#111418" stroke-width="3.5"/>',
      '<path d="M-12 8 L-12 -2 A12 12 0 0 1 12 -2 L12 8 Z" fill="none" stroke="#111418" stroke-width="3.5" stroke-linejoin="round"/><path d="M-16 8 H16" stroke="#111418" stroke-width="3.5" stroke-linecap="round"/><circle cy="13" r="3.5" fill="#111418"/>'];
    const calls = [["board", 18], ["judge", 6 * 4 + 4], ["teams", 6 * 2 + 5]];
    // ruling 104 item 3: the first call on or after "Each", never under "Notice one thing about every agent"
    const tEach = E.at(k, "5D.1", "Each one", 0), callT = [300, 2000, 3700].map((d) => tEach + d); // the sign starts 300 ms before t0, so it is first seen on "Each"
    calls.forEach(([room, idx], i) => {
      const t0 = callT[i], sl = C.at(idx, 0), a = k.agent({ at: [sl.x, sl.y + 0.08, sl.z], face: 0.2, name: "w" + i });
      E.paleAgent(k, a, [[0, 1], [t0 + 400, 0], [t0 + 1700, 1]]);
      E.closedEyes(k, a, [[-1e9, t0 + 400], [t0 + 1700, null]]);
      a.act(0, "sleep").act(t0 + 400, "wake").fx(t0 + 450, "spark", { size: 56 }).act(t0 + 1700, "sleep");
      const g = document.createElementNS(svgNS, "g"); g.innerHTML = '<circle r="34" fill="#fff" stroke="#111418" stroke-width="3"/>' + SIGN[i]; csvg.appendChild(g);
      const ln = document.createElementNS(svgNS, "line"); ln.setAttribute("stroke", "#111418"); ln.setAttribute("stroke-width", "3"); csvg.insertBefore(ln, g);
      FILM._post.push((t) => { const on = t >= t0 - 300 && t < t0 + 1700; g.style.display = ln.style.display = on ? "" : "none"; if (!on) return;
        const b = KIT.render.project(new T.Vector3(E.BOX[0], 1.4, E.BOX[2])), q = KIT.render.project(new T.Vector3(sl.x, sl.y + 1.0, sl.z)), cx0 = b.x - 70, cy0 = b.y - 70;
        const v = tw(t, t0 - 300, t0) * (1 - tw(t, t0 + 1400, t0 + 1700)), u = tw(t, t0, t0 + 400, "out");
        g.setAttribute("transform", `translate(${cx0},${cy0}) scale(${0.6 + 0.4 * tw(t, t0 - 300, t0, "out")})`); g.style.opacity = v;
        ln.setAttribute("x1", cx0); ln.setAttribute("y1", cy0); ln.setAttribute("x2", FILM.lerp(cx0, q.x, u)); ln.setAttribute("y2", FILM.lerp(cy0, q.y, u)); ln.style.opacity = v; });
      k.cue(t0, ["message", "invite", "pulse"][i]); k.cue(t0 + 400, "wake");
    });
    // "reactive": whole until 3.5 s after it lands (ruling 96), gone on the last frame
    const tRe = E.after(k, "5D.1", "reactive");
    // fast-only branch (rulings 167 (2) and (4), 168 (i), (ii), (iv); kit layer dc81dab9 rise/lineAt): when D is under 10 s the card
    // leads the name's first word by up to 0.3 s but never before "is" ends, rises in 150 ms, brings its line in with it, and stands
    // stands to D-30 (t1 = D-30, as v2-visuals 061500 reads 168 (ii): the kit fades it over the 250 ms before t1, so it is gone
    // on the last frame, as this shot's rule 96 note says, and 5Db's first frame still matches). v10 (12.333 s), ai and op keep the call below unchanged.
    if (D < 10000) {
      let tL = tRe;
      try { const x = new XMLHttpRequest(); x.open("GET", E.TFILE, false); x.send(); const J = JSON.parse(x.responseText), q = J.rows.find((r) => r.id === "5D.1");
        const i = q.words.findIndex((w) => Math.abs(w.start - q.name_end) < 0.02), prevEnd = i > 0 ? q.words[i - 1].end : q.name_end - 0.3;
        tL = r1.start + (Math.max(q.name_end - 0.3, prevEnd) - q.start) * 1000; } catch (e) { tL = tRe; }
      k.ui.nameCard(tL, { name: "reactive", stamp: "waits to be asked", rise: 150, lineAt: 0, t1: D - 30 });
    } else
    k.ui.nameCard(tRe, { name: "reactive", stamp: "waits to be asked", t1: Math.min(tRe + 3500 + 250, D - 34) });
    k.cam.keys([{ t: 0, view: "W-list" }, { t: D + 1, hold: true }]);
    return {};
  },
});
