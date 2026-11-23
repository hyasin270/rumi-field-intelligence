// roleb-huddle · copy of 3.0 (lane roleb, s25 Huddles): the same meeting upstairs; the one speech mark with words says what
// the team is seeing, and the drop to the agent below (who was not there and did not hear) is the cost of a skipped huddle.
// 3.0 · W to room · v2-shots-c. "Third question. How do they find out what is going on? Much of what an organisation
// knows is said out loud, and never written down. / Upstairs, a team changes how it writes lesson plans. Downstairs,
// nobody hears." Moves: push in to the meeting; words rise and are gone; one speech mark carries a lesson-plan page that
// changes layout; then the link frame (lead 082814 item 8, at most 4 s): both floors, the agent below writing the old way.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_c/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "roleb-huddle", type: "W", row: "3.0", dur: 17130,
  setup(k) {
    const C = window.SC, S1 = C.S1, V = C.V3, D = k.dur;
    k.breathe();   // VL 15.89 (v2-visuals 081602): everyone standing breathes, so no held room frame repeats for 2 s (kit v0.9.0)
    const W = C.world(k, 3);
    const hero = S1.R("skills", -1.4, 0, -1.0);
    const tQ = C.at(k, "3.0.1", "Third", 150), tPush = 1500;   // VL 15.71: W cuts to the meeting at 1.5 s (no push)
    // ruling 66: open on the list whole as 2D leaves it (2 dark and ticked); question 3 fills at 0.15 s
    C.listWhole(k, { ticked: [1, 2], activeFrom: 2, activeTo: 3, tAct: 150, t1: tPush });
    C.pav2(k, W, { faceLaptop: true });
    // 2D's last frame (pre-read 2300 item 4): its five hands and the lone agent stand as 2D leaves them until the cut,
    // then the crowd is laid round them as 2D lays it, so the lower rooms match across the join
    { const y1 = C.floorY(1), y2 = C.floorY(2);
      [[-2.75, y1, -1.3], [-1.85, y1, -1.45], [-0.95, y1, -1.3], [-1.0, y2, -1.3], [-2.4, y2, -1.4], [1.95, y1, -1.4]].forEach((h, i) => k.agent({ at: h, face: 0.25, name: "h2D" + i }).hide(tPush)); }
    { const OFF2D = 11433, Cr = C.crowd(k, W, { clear: [{ room: "skills", x0: -0.5, x1: 6.0, from: 1500 + OFF2D }, { room: "board", x0: -6.0, x1: 0.5, from: 1500 + OFF2D }, { room: "gates", x0: -6.0, x1: 0.5, from: 1500 + OFF2D }, { room: "store", x0: -0.5, x1: 6.0, from: 1500 + OFF2D }] }), at0 = Cr.at.bind(Cr); Cr.at = (i, t) => at0(i, t + OFF2D); }   // the crowd carries on from 2D's clock (2D is 11.433 s), so the lower rooms face as 2D leaves them (pre-read 0000); the clears move with it   // VL 15.71: the close link frame draws only the agent below; both B1 rooms clear after the cut, out of frame (pre-read 2140)   // clears after the cut, while the room is out of frame, so 3.0 opens as 2D ends (pre-read 2055)
    C.docksWest(k, -5000, tPush);   // as 2D leaves them   // ruling 71 item 5: the people start where 2D left them
    // white screens, never black (VL 15.21)
    W.parts.laptops.forEach((l, i) => C.laptopFace(k, l, -1000, { mark: i < 2 }));   // Rumi's face stays on the two laptops 2D lit
    // roleb: a huddle, not a meeting: no table; the region's team stands in a half ring open to us, and a wall clock runs a quarter
    // of an hour from nine (the short daily stand-up). s14 shows the same room as a sit-round meeting with a table.
    const clk = KIT.set.PARTS.clock(k, { r: 0.33 }); clk.position.set(2.45, 1.1, -4.55); k.scene.add(clk); clk.sweep(tPush, 11000, 9, 9.25);
    // VL 15.71: W shows the pavilion as 2D left it; the hard cut lands on the meeting already formed (the close frame draws
    // who the sentence is about), so nobody walks through anybody (pre-read 2055): four round the table standing, two behind
    // it and one at each end, and the person who faced the file back behind its west end
    const RC = [0.1, -2.75], RR = 1.3;
    const ring = (deg) => { const r = deg * Math.PI / 180, x = RC[0] + RR * Math.sin(r), z = RC[1] + RR * Math.cos(r); return [x, z, Math.atan2(RC[0] - x, RC[1] - z)]; };
    const seats = [ring(250), ring(110), ring(194), ring(166)];   // the speakers keep 3.0's order: left, right, back left, back right
    [1, 3, 5, 2].forEach((pi, i) => { const s = seats[i]; W.people[pi].at(tPush, [s[0], 0, s[1]], s[2]); });
    [[0, 222], [4, 138]].forEach(([pi, d]) => { const s = ring(d); W.people[pi].at(tPush, [s[0], 0, s[1]], s[2]); });
    const tSaid = C.at(k, "3.0.1", "said out loud", 300), tNever = C.at(k, "3.0.1", "never written", 200);
    const tUp = C.at(k, "3.0.2", "Upstairs", 300), tChange = C.at(k, "3.0.2", "changes", 200), tDown = C.at(k, "3.0.2", "Downstairs", 250), tNobody = C.at(k, "3.0.2", "nobody", 200);
    // words said (v2-visuals 120020 item 8): warm marks, one at a time from one speaker, tail towards them; each rises
    // 0.5 m and shrinks away well under the roof, so none leaves through the top of the frame while it can be read
    const B = [], TONE = { tone: C.MEET_TONE, toneDark: 0xB7A487 };
    const said = [0, 1, 3, 2, 0], t0s = tSaid - 1300, step = (tNever + 300 - t0s) / said.length;
    said.forEach((si, i) => { const s = seats[si], t0 = t0s + i * step;
      B.push(Object.assign({ t0, dur: step * 0.95, kind: "rise", tail: s[0] < 0 ? -1 : 1, path: [[s[0], 1.7, s[1]], [s[0] * 0.95, 1.85, s[1] + 0.1], [s[0] * 0.9, 2.0, s[1] + 0.15]] }, TONE)); });
    C.bubbles(k, B);
    // ruling 78: the decision is one large speech mark with its words, tail to its speaker (the person in seat 0). It
    // grows on "changes", holds whole and still 2.1 s, then rises and fades to nothing in the first second of the drop:
    // the picture of "never written down". The only mark with words until 3B1; nothing else of it stays in the frame.
    const tLink = Math.max(tDown - 600, D - 4000), tIn = tChange, tStill = tIn + 350, tOut = Math.max(tStill + 2050, tLink + 300), tGone = tOut + 700;
    const head = V([seats[2][0], 1.3, seats[2][1]]);
    const anchor = V([0.6, 1.95, -3.2]);   // the mark's place in the room (about x 960, y 270 on the held framing); the drop carries it up and out   // the speaker stands behind the table, back left, so the mark stands over bare wall (v2-visuals 173730 item 3)
    const mk = k.ui.text("decision", tIn, tGone, '<svg class="dm-tail" width="1920" height="1080" style="position:absolute;left:0;top:0;overflow:visible"><path fill="#fff" stroke="#e6ded0" stroke-width="3"/></svg>' +
      '<div class="dm-face" style="position:absolute;left:0;top:0;width:560px;box-sizing:border-box;background:#fff;border:3px solid #e6ded0;border-radius:64px;box-shadow:0 8px 26px rgba(17,20,24,.14);padding:30px 44px;font-size:40px;line-height:1.18;color:#111418;text-align:center">Teachers say the plans are too long</div>', {});
    const face = mk.querySelector(".dm-face"), tail = mk.querySelector(".dm-tail path");
    FILM._post.push((t) => {
      if (t < tIn || t > tGone) return;
      const g = FILM.tw(t, tIn, tStill, "outExpo"), up = FILM.tw(t, tOut, tGone, "in"), fade = 1 - FILM.tw(t, tOut, tOut + 450, "io");   // gone before it can reach y 60 (pre-read 2300)
      const ap = KIT.render.project(anchor), w = 560, h = face.offsetHeight, cx = ap.x, cy = ap.y - 40 * up, x0 = cx - w / 2, y0 = cy - h / 2;
      mk.style.transform = "none"; mk.style.opacity = fade; mk.style.visibility = fade > 0.002 ? "visible" : "hidden";
      face.style.left = x0 + "px"; face.style.top = y0 + "px"; face.style.transform = `scale(${0.35 + 0.65 * g})`; face.style.transformOrigin = "30% 100%";
      const hp = KIT.render.project(head), bx = x0 + w * 0.3, by = y0 + h - 6, dx = hp.x - bx, dy = hp.y - by, L = Math.hypot(dx, dy) || 1;
      // the tail ends within 40 px of its speaker's head (v2-visuals 143258 item 1)
      const tipL = Math.max(0, L - 30) * g * (1 - FILM.tw(t, tOut - 200, tOut + 150, "io")), tx = bx + (dx / L) * tipL, ty = by + (dy / L) * tipL;
      tail.setAttribute("d", `M${bx - 34},${by} L${tx},${ty} L${bx + 34},${by} Z`);
    });
    k.cue(tIn, "stick");
    // downstairs: one agent, face to us, still writing a lesson plan the old way; it does not hear
    const a = k.agent({ at: [hero.x, hero.y, hero.z], face: 0.15, name: "below" });
    a.hide(-1e9); a.show(tPush); a.root.visible = false;   // hidden before frame 0 too: the crowd clears visible agents by last frame's state (pre-read 2320 item 1)   // not in 2D, so not at W before the cut
    a.act(0, "write"); a.fx(tNobody, "question", { dur: D - tNobody + 3000 });   // the "?" stays to the cut (v2-lead 200314)
    k.cue(tSaid, "murmur");
    // VL 15.71 / ruling 103: W and the meeting are joined by a hard cut; the ring is on the pavilion for W's last 0.6 s.
    // The map (VL 15.76) is on from the cut: the pavilion, then B1 east as the link drop lands on the agent below
    roomRing(k, W, "pav", tPush - 600, tPush);
    locator(k, { room: "pav", from: tPush, to: D + 1, changes: [[tLink + 1300, "skills"]] });
    k.cam.keys([
      { t: 0, view: "W-list" },
      { t: tPush - 1, hold: true, drift: false },
      { t: tPush, view: k.cam.on(V([0.1, 0.8, -2.6]), { size: "room", px: 285, yaw: -14 }), cut: true },
      { t: tLink, hold: true, drift: false },
      { t: tLink + 1300, view: k.cam.on(V([0.6, -1.2, -2.4]), { size: "room", px: 110, yaw: -14 }), ease: "io" },   // both floors whole: heads upstairs, the agent below (v2-visuals 200106 item 1)
      { t: D + 1, hold: true, drift: false },   // at rest once landed (pre-read 2300)
    ]);
    return {};
  },
});
