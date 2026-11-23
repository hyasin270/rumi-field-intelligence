// P3c · S · v2-shots-a. Cuts from P3b's room to a higher view of it (the teacher with the phone, school 3): "about $0.70 a session" over them.
// One move, a pull back: the other schools light one after another (the same coaching reaching all of them); about 6,000.
// "Matched human scorers about four times in five": five score cards, a person's mark beside the model's; four pairs agree and
// go green, the fifth stays plain (no red: ruling 36). "The coach now goes where a person is needed most": one school stays
// dark, and the coach walks to it. Row P3c.1 (frozen v1.2). Director's notes: board 074811 item 3.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_a/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "rolea-P3c", type: "S", row: "P3c", dur: 15300,
  setup(k) {
    const SA = window.SA, D = k.dur, tw = k.tw, { T } = KIT.parts;
    const r = SA.r(k, "P3c.1"), f = (i) => r.start + (r.end - r.start) * i / 28, w = (word, i) => SA.w(k, "P3c.1", word, f(i));
    SA.ground(k, { extent: 26 });
    SA.road(k, { len: 90, z: 0.6 });
    // school 3 (P3b's) and its teacher with the phone, then eight more schools behind and beside it
    const S3 = SA.school(k, { x: 0.6, z: -3.2 });
    const teacher = k.person({ at: S3.spot(-1.3, 0.2), face: 0.9, height: SA.PH }); teacher.pose(0, "phone");
    const desk = k.set.part("desk", { w: 1.0 }); desk.position.set(S3.x - 0.6, 0.18, S3.z + 0.4); desk.scale.setScalar(0.62); k.scene.add(desk);
    /* P3b's phone on the desk, as in P3b's last frame (pre-read 0030: the cut lost it) */
    { const phone = k.set.part("phone", {}); phone.scale.setScalar(0.42); phone.position.set(S3.x - 0.55, 0.18 + 0.62 * 0.81, S3.z + 0.45); phone.rotation.x = -0.35; k.scene.add(phone); }
    const spots = [[-5.2, -3.2], [6.4, -3.2], [12.2, -3.2], [-2.3, -9.4], [3.5, -9.4], [9.3, -9.4], [15.1, -9.4], [18.0, -3.2]];
    const others = spots.map(([x, z]) => SA.school(k, { x, z }));
    if (D < 13000) { S3.rollDoor = true; others.forEach((s) => { s.rollDoor = true; }); }   /* fast: no one-frame door pop (v2-shots-f 083442) */
    const dark = others[2];                       // the one still dark: front row, right of school 3
    const tSev = w("seventy", 2), tSix = w("six", 5), tMatch = w("matched", 11), tFour = w("four", 14), tCoach = w("coach", 21), tNeed = w("needed", 26);
    /* ai_fast-4c (rulings 165, 166), read on D: at 10.8 s the coach's walk and turn ran past the cut and "about $0.70" (held 2.6 s)
       sat under "about 6,000" in the same place. FAST: the walk ends at D - 900 and the turn at D - 500; "$0.70" leaves 450 ms
       before "6,000" rises. v10, ai and op (15 s and longer) unchanged. */
    const FAST = D < 13000, tWalk0 = tCoach - 6200, walkEnd = FAST ? Math.floor((D - 1700) / 500) * 500 : tWalk0 + 9000, walkDur = FAST ? Math.min(9000, walkEnd - tWalk0) : 9000, tCoachTurn = FAST ? walkEnd - 200 : tCoach + 2850;   /* VL 15.89 g: the walk ends on a 500 ms mark, the turn starts before it, nothing starts in the 300 ms after */   /* v2-shots-f 083442: the coach at rest by D - 500 (walk D - 1700, turn by D - 1300, point, stand by D - 500) */
    k.each((t) => {
      S3.open(1); S3.light(1);
      others.forEach((s, i) => { if (s === dark) { const u = tw(t, tCoach + 300, tCoach + 1200, "io"); s.open(u); s.light(u); return; }
        const a = tSix - 1200 + i * 260, u = tw(t, a, a + 400, "out"); s.open(u * 0.999); s.light(u); });
    });
    k.cue(tSix - 1200, "lights");
    // the coach: in from the left on the road, past the lit schools, to the dark one; sits beside its teacher
    const coach = k.person({ at: [-6.5, 0.04, 0.7], face: Math.PI / 2, height: SA.PH });   /* out of the first framing (v2-visuals 200007 P3c) */
    const lone = k.person({ at: dark.spot(-0.6, -0.4), face: 0.3, height: SA.PH });
    coach.walk(tWalk0, walkDur, [[2.5, 0.04, 0.7], [dark.x - 0.5, 0.04, 0.7], [dark.x + 0.05, 0.04, 0.6], [dark.x + 0.38, 0.04, 0.3], [dark.x + 0.5, 0.04, -0.2], [dark.x + 0.5, 0.04, -1.42],   /* a wide arc round the corner: the turn spreads over many frames (pre-read 0335 f323) */ [dark.x + 0.45, 0.18, -1.62], [dark.x + 0.3, 0.18, dark.z + 0.2]]);   /* one walk round the corner and in: two eased walks stopped him at the join (pre-read 0245 f318) */   /* rounds the corner, so the next walk does not start with a snap turn (pre-read 0120 f335) */   /* stops inside the right edge (pre-read 2110, f326) */ /* starts inside the frame */   /* about 2 m/s, never a dash (153200 item 6) */
       /* chained to the walk before (no frozen stride), along the ground to the front edge, then one step up onto the floor (pre-read 0030) */   /* up onto the room's floor at 0.18 (pre-read 2340: he stood 0.14 m in it) */
    coach.turn(tCoachTurn, 350, dark.spot(-0.6, -0.4)); lone.turn(tCoach + 1700, 400, dark.spot(0.3, 0)); 
    /* the last seconds are not a still (ruling 80; pre-read 2215 f372 to f451): the two talk, one gesture each */
    lone.turn(D - 3100, 400, [dark.x + 0.3, 0, dark.z + 0.2]); lone.pose(D - 2700, "point", { blend: 300 });   /* points to the coach at chest height: a raised arm hid behind her head and the beam (pre-read 2340) */   /* turns to the coach first, so the raised arm is seen (pre-read 2310) */ lone.pose(D - 1700, "stand", { blend: 300 }); coach.pose(FAST ? Math.max(D - 1500, walkEnd + 300) : D - 1500, "point", { blend: 300 }); coach.pose(D < 13000 ? D - 800 : D - 500, "stand", { blend: 300 });
    // the numbers: about $0.70 over the teacher with the phone; then about 6,000 as the schools light
    if (0) k.ui.number(tSev - 200, { value: 70, prefix: "about $0.", unit: "a session", from: 70, dur: 1, hold: FAST ? 2000 : 2600, x: 930, y: 60 });   /* fast (v2-lead 085342): "$0.70" whole about 1.6 s */
    /* fast: "6,000" rises as "$0.70" finishes leaving (t0 + 2000 + 400) and leaves before the score panel rises in the same band */
    const t6k = FAST ? (tSev - 200) + 2000 + 400 : tSix - 150, h6k = FAST ? Math.max(1200, (Math.max(tSix + 2900, tMatch - 400) - 400) - t6k) : 2800;
    if (0) k.ui.number(t6k, { value: 6000, prefix: "about ", unit: "sessions", from: 6000, dur: 1, hold: h6k, x: 930, y: 60 });   // lands on 6,000, never counts through (v2-check 080901 item 1)
    // five score cards (2D pull-out, VL 9.10): a person's mark and the model's mark side by side; four agree and go green
    const box = document.createElement("div"); box.className = "abs"; box.style.cssText = "left:0;top:0;width:1920px;height:1080px"; document.getElementById("ui").appendChild(box);
    const marks = [[3, 3], [2, 2], [4, 4], [3, 2], [3, 3]], cards = [];
    // one panel, words once at the left, five columns of two rows of dots at twice the old size (v2-visuals 174926 item 3)
    const panel = document.createElement("div");
    panel.style.cssText = "position:absolute;left:250px;top:64px;width:1420px;height:236px;background:#fff;border-radius:26px;box-shadow:0 18px 50px rgba(60,40,10,.18);opacity:0";
    box.appendChild(panel); panel.style.display = "none";
    const lab = (txt, y) => { const d = document.createElement("div"); d.textContent = txt; d.style.cssText = `position:absolute;left:34px;top:${y}px;font:500 40px/1 'Poppins',sans-serif;color:#3C424B`; panel.appendChild(d); };
    lab("person", 52); lab("model", 140);
    const dots = (n, col) => [0, 1, 2, 3].map((j) => `<i style="display:inline-block;width:40px;height:40px;border-radius:50%;margin:0 5px;background:${j < n ? col : "transparent"};border:5px solid ${col};box-sizing:border-box"></i>`).join("");
    marks.forEach(([pm, mm], i) => { const c = document.createElement("div");
      c.style.cssText = `position:absolute;left:${200 + i * 240}px;top:24px;width:218px;height:188px;border-radius:20px;border:5px solid #fff;box-sizing:border-box;padding:22px 0 0 8px`;
      c.innerHTML = `<div>${dots(pm, "#34507A")}</div><div style="margin-top:38px">${dots(mm, "#111418")}</div>`;
      panel.appendChild(c); cards.push({ c, agree: pm === mm, i }); });
    const tC0 = Math.max(tSix + 2900, tMatch - 400), tC1 = Math.min(tCoach - 400, tFour + 3200);
    FILM._post.push((t) => { const v = tw(t, tC0, tC0 + 450, "io") * (1 - tw(t, tC1, tC1 + 450, "io"));   /* 450 ms in and out (pre-read 2110, check 15) */ panel.style.opacity = v; panel.style.transform = `translateY(${24 * (1 - v)}px)`;
      cards.forEach((q) => { const g = q.agree ? tw(t, tFour + q.i * 140, tFour + q.i * 140 + 450, "sine") : 0;
        const mix = (a, b) => `rgb(${a.map((x, j) => Math.round(x + (b[j] - x) * g)).join(",")})`; q.c.style.borderColor = mix([255, 255, 255], [11, 122, 34]); q.c.style.background = mix([255, 255, 255], [238, 247, 238]); }); });
    cards.forEach((q) => { if (q.agree) k.cue(tFour + q.i * 140, "tick"); });
    // one move: from P3b's last framing back to the schools, the road and the dark one
    const start = k.cam.on([S3.x - 0.3, 2.25, S3.z + 0.6], { size: "room", band: "S", height: 1.15, px: 185, yaw: -12, pitch: -9 });   /* 1.6 times wider than P3b's room, so the cut reads as a cut, not a jump (pre-read 0120) */   /* a cut from P3b's room to a higher view of the same room and its phone: on P3b's exact frame the number would sit on the roofs (K 8 00:42Z); this framing clears them by about 60 px (pre-read 2340) */
    k.cam.keys([{ t: 0, view: start }, { t: Math.max(900, tSev + 600), hold: true }, { t: Math.max(tSev + 2800, tSix + 400), view: { look: [6.0, 2.2, -4.2], dist: 30, yaw: -12, pitch: -14 }, ease: "io" }, { t: D, hold: true }]);   /* one move from P3b's frame, starting at once, so "a session" is over clear page by the time it lands */
    return {};
  },
});
