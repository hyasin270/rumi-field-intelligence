// T1a · S to W · v2-shots-a. VISUAL_LANGUAGE_v2 15.18 "meet them close, then count them" (director 074811 item 2, 075107).
// Opens low on the page by the closed block's west end: four agents walk past towards it, faces seen, 2.5 s. One move: a pull
// back to W-centre while the rest stream in from both sides and from behind. They gather beside the block and in front of its
// face, turned to us, and stay. The counter sits on the block's closed face (150 px), lands on 300 and holds. The six people
// stand in one row at the pavilion's front edge from the moment the counter lands.
// Row T1a.1 ("Tomorrow morning, three hundred very talented strangers arrive at your organisation, wanting to help."), rest 5 s.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_a/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "T1a", type: "W", row: "T1a", dur: 13400,
  setup(k) {
    const SA = window.SA, D = k.dur, w = (word, fb) => SA.w(k, "T1a.1", word, fb), r = SA.r(k, "T1a.1");
    const W = k.set.building({ stage: 0, closed: true, ground: true });
    (function(){const x=new XMLHttpRequest();x.open("GET","snippets/fills_with_face.js",false);x.send();(0,eval)(x.responseText+";window.fillsWithFace=fillsWithFace;");})(); window.fillsWithFace(k, W);   // v2-kit 161851: no lamp shows through the closed face
    const y = W.pageY;
    const tThree = w("three", 1800), tStr = w("strangers", 3900), tHelp = w("wanting", 7100);
    // the first four, close: walking past the camera towards the block's west end, three-quarter to us
    const first = [0, 1, 2, 3].map((i) => k.agent({ at: [-24.4 + i * 1.1, y, -0.6 + i * 0.35], face: 0.8 }));
    first.forEach((a, i) => a.walk(0, 2700 + i * 200, [[-22.9 + i * 1.1, 1.0 + i * 0.25], [-22.4 + i * 1.1, 1.9 + (i % 2) * 0.3]]).turn(3000 + i * 200, 500, 0.2 * (i - 1.5)));
    // then they walk on to the block and join the crowd beside it, so nobody is left at the frame's edge at rest
    first.forEach((a, i) => a.walk(2750 + i * 40, 2600, [[-18.2 + i * 0.9, 2.2], [-15.8 + i * 0.75, 1.6 - (i % 2) * 0.5]]).turn(5500 + i * 40, 500, 0.3));   /* pre-read 0140: they went out by the lower left f130 to f177 as the aim slid east; they now set off as the slide starts and are inside the W frame when it ends */
    // the rest: from both sides and from behind, each on its own path, gathering beside the block and in front of its face
    const C = k.crowd(296, { seed: 7 });
    const from = [W.page(32, 48, -14, 8), W.page(-30, 22, -60, -40)];   /* from behind and the east only: arrivals from the west passed close to the low camera through the four (K 8 23:54Z) */
    const to = SA.T1A_TO(W);
    { const a0 = tThree - 600, a1 = a0 + Math.max(5600, tHelp - tThree + 900); C.arrive(-1800, a1 + 1800, { from, to, spread: 0.6 }); }   /* already walking at frame 0: the far line never pops in (pre-read 2335 f034); lands as before */
    // the counter on the closed face; lands on 300 as the last arrive, then holds
    const tLand = D < 7500 ? Math.min(tHelp + 300, Math.max(w("hundred", 1700) + 1600, D - 3000)) : tHelp + 300;   /* ai_fast-4c (rulings 165, 166): "300" is the row's figure and stands 2.5 s; the count starts on "hundred" and lands by D - 3000 (3.3 s at 4c), held 3.0 s; v10, ai and op unchanged */
    // the count, on the closed face (150 px, green), holds on 300 until the cut (VL 15.18, ruling 47 item 3)
    SA.heldNumber(k, tLand - 1600, D + 1000, { value: 300, from: 0, dur: 1500, at: [0, -5.2, 0.4] });
    k.cue(tThree, "crowd"); k.cue(tLand, "count");
    // the six people: one row at the pavilion's front edge, evenly spaced, facing out, from the frame the counter lands
    (W.people || []).forEach((p, i) => { p.walk(tStr + i * 120, Math.max(800, tLand - tStr - 900), [[-3.0 + i * 1.2, -1.05]]); p.turn(tLand - 300, 400, 0); });
    // the rest is not a still: two of the people wave down to the crowd, one after the other (VL 6.1)
    const ppl = W.people || []; if (ppl[1]) { ppl[1].pose(tLand + 1500, "hand-up", { blend: 300 }); ppl[1].pose(tLand + 3000, "stand", { blend: 300 }); } if (ppl[4]) { ppl[4].pose(tLand + 3600, "hand-up", { blend: 300 }); ppl[4].pose(tLand + 5200, "stand", { blend: 300 }); }
    // one move: from low and close by the west end, back to W-centre (v2-visuals 200912 item 2). The camera pulls straight back
    // first (distance front-loaded, aim back-loaded), so the building enters the frame no larger than its W size and is never passed.
    // Look raised 0.35 m so the far line of arrivals sits clear above the four heads. The opening stands 5 m further west of the block
    // than before, so its west corner is never close to the camera in the pull back (K 8 of 21:58Z and 22:33Z, 3.4 s).
    const low = { look: [-20.9, y + 0.85, 1.6], dist: 10.0, yaw: -14, pitch: -3 }, Wc = k.cam.named("W-centre");
    const CP = { yw: 0, xw: -10, len: 4000, e: 3, s0: 0.3 } /*CP*/, YW = CP.yw, t0 = 2500, t1 = 2500 + (D < 7500 ? Math.max(2500, D - 3000) : CP.len),   /* ai_fast-4c (ruling 165), read on D: at 6.3 s the one move ends at D - 500, not after the cut; v10, ai and op unchanged */ io = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2), L = (a, b, u) => a + (b - a) * u;
    const at = (s) => { const ud = 1 - Math.pow(1 - Math.min(1, s / CP.s0), CP.e),   /* pre-read 0630: the pull back now ends before any turn or slide, so the block can only come in at its W distance */ ss = Math.min(1, Math.max(0, (s - CP.s0) / (1 - CP.s0))), ul = ss * ss * (3 - 2 * ss);   /* pre-read 0140: the block still came in through the top, 1.13x its W size; the camera now reaches its W distance and height before the aim moves east */
      return { look: [0, 1, 2].map((j) => L(low.look[j] + (j === 0 ? CP.xw * Math.sin(Math.PI / 2 * Math.min(1, s / CP.s0)) : 0), Wc.look[j], j === 1 ? ud : ul))   /* pre-read 0630: turning orbited the camera 25 m towards the block; the aim now trucks west while it pulls back, then east to W, the camera's direction held */   /* the aim's height travels with the distance (early), its slide east comes late */   /* the aim lifts in the middle of the move, so the block and pavilion enter whole (pre-read 0050 f100) */, dist: Math.exp(L(Math.log(low.dist), Math.log(Wc.dist), ud)), yaw: L(low.yaw, Wc.yaw, ul) + YW * Math.sin(Math.PI * Math.min(1, s / 0.75)) * (1 - ul),   /* the view turns a little away from the block while it pulls back, then back with the aim, so the block comes in at its W size */ pitch: L(low.pitch, Wc.pitch, ud)   /* rises with the distance: from higher up the block's top sits lower in frame (pre-read 2335 f102) */ }; };
    k.cam.keys([{ t: 0, view: low }, { t: t0, hold: true, drift: false }, { t: t1, view: "W-centre", ease: "io" }, { t: D, hold: true }]);   /* one move (VL 4.5) */
    /* the same one move, the same ends and ease; only its path is shaped (distance first, aim later) so the camera never passes the block */
    { const ev = k.cam.eval; k.cam.eval = (t) => { const p = ev(t); if (t <= t0 || t >= t1) return p;
      const q = Object.assign({}, p, at(io((t - t0) / (t1 - t0)))); k.cam.current = q; return q; }; }
    return { W, C };
  },
});
