// 2.0 · W · v2-shots-f (from v2-shots-c). "Second question. Where do we talk to them?"
// Frame 0 is 1C5's last frame (rulings 71, 93): the list whole, question 1 ticked, "beads" and "hooks" docked, the six
// people at the kit's places, the gates room at the kit's rest. Question 2 fills at 0.15 s and is lit 2 s or more before the
// list leaves (VL 14.2). The five arrive round the pavilion's east end from behind its opaque back wall (v2-visuals 160200
// item 1), single file, one at a time, on one route at one speed (SF.file20Walk), and from the pavilion's front edge each is
// turned 40 degrees towards us while it walks and while it queues. The people step to their stage 2 places only after
// 1.5 s (ruling 71 b). A hard cut at 4.35 s to room size (ruling 103); the person holds the file off, then turns to the laptop 2A grows from.
(function () { const get = (u) => { const x = new XMLHttpRequest(); x.open("GET", u, false); x.send(); return x.responseText; }; (0, eval)(get("../shots/_c/lib.js")); (0, eval)(get("../shots/_f/lib.js")); })();
FILM.shot({
  id: "2.0", type: "W", row: "2.0", dur: 5733,
  setup(k) {
    const C = window.SC, F = window.SF, D = k.dur;
    // fast-only branch (ruling 165 b; COS 044515; v2-cut drift.md "2.0: line 45 const tTurn = D - 700"): when D is under 4 s (the
    // fast film's 2.93 s) the shot stays on the W frame for its question and the W-to-room hard cut moves onto the 2.0 to 2A join
    // (the same hard cut, ruling 71 c), so: the crowd carries on from 1C5's fast length (read from the timing file), the
    // colleagues walk home from 0.3 s, the list and the two labels hold to the cut, the ring is on for the last 0.6 s, the five
    // do not leave the back wall (2A's fast branch draws them at their places), and the person turns to the laptop at D-700.
    // v10 (5.73 s), ai and op keep every time below.
    const FAST20 = D < 4000;
    let C1C5 = 9500;
    if (FAST20) { try { const x = new XMLHttpRequest(); x.open("GET", "../" + ((new URLSearchParams(location.search).get("timing")) || "timing.json").replace(/^.*\//, ""), false); x.send();
      const J = JSON.parse(x.responseText), q = J.shots.find((z) => z.id === "1C5"); if (q) C1C5 = Math.round(q.dur * 1000); } catch (e) { C1C5 = 9500; } }
    const W = C.world(k, 2, { noBoard: true });
    // the crowd carries on from 1C5's clock: its rooms mill as a function of t, so frame 0 is drawn at 1C5's end
    // (timing.json 1C5 9.5 s), or the lower rooms' agents turn and move at the cut (pre-read 2.0_2255 B, 21 to 23% differ)
    { const Cr = C.crowd(k, W, {}), at0 = Cr.at.bind(Cr); Cr.at = (i, t) => at0(i, t + C1C5); }
    // frame 0 is 1C5's last frame (rulings 71, 93). Pre-read 2.0_2240 B: the rooms differed. As 1C5 leaves them
    // (v2-shots-b tools/src/1C5.js): the three door2s with ruling 113's signs, rail one green and two and three red, the
    // board's done faces with card 26 "agent 58", and the small gate by the board with its arm up.
    S1.doors2(k, W, ["Go live", "Tell a region", "Send a message"]);
    const RL = S1.rails(k, W); RL[0].stop(-1e9, { note: false }).go(-1e8); RL[1].stop(-1e9, { note: false }); RL[2].stop(-1e9, { note: false });
    { const board = W.parts.board; for (let i = 0; i < 28; i++) if (![3, 9, 20, 26, 27].includes(i)) S1.doneFace(k, board, i, -1e9);
      if (!FAST20) S1.doneFace(k, board, 26, -1e9, "agent 58"); }   // fast: card 26 stays unclaimed, as 1C5's fast branch leaves it (no fetch drawn; the 2.0 K 40 at 07:34Z showed it done at f000, 1C5/ai_fast f130 does not)   // card 26 since 22:56Z (v2-shots-b 235320)
    { const g = S1.greyKnobs(S1.part(k, "gate", [-2.1, -3.2, -3.5], { armY: 0.4 })); if (!FAST20) g.lift(-1e9); }   // fast: the arm down, as 1C5's fast branch leaves it (it draws no fetch and no lift; v2-shots-b 071624)
    const tLeave = FAST20 ? D + 400 : 2550;   // fast: whole to the cut (layer.js fades over the 400 ms before tLeave)   // the list and the two labels fade over the 400 ms before this (layer.js life), so q2 is lit 2.0 s
    C.listWhole(k, { ticked: [1], activeFrom: 1, activeTo: 2, tAct: 150, t1: tLeave });
    F.listFade(k, 150, 1, 2, 300);   // question 2 lights over 300 ms (pre-read 2.0_1720: one frame, f004 to f005)
    const tCut = FAST20 ? D : tLeave + 1800;   // the W-to-room hard cut (fast: on the join)
    C.docksWest(k, -5000, tCut);   // the two labels stay on the W frame and go with the cut (they vanished in one frame, f076)
    // person 2 stops between the two at the east desk in the picture (x 3.05: at 3.55 it lined up with person 3 in perspective, pre-read 2.0_2315 C), not in front of one (pre-read 2.0_2255 C: one navy outline
    // with two heads, f088 to f130); 2.0 only, the close frames do not draw person 2 (VL 15.71 item 2)
    C.PAV_HOME = Object.assign({}, C.PAV_HOME, { 2: [3.05, -1.4, -0.6] });
    const per = C.pav2(k, W, { walkFrom: FAST20 ? 300 : 1500 }), lap = W.parts.laptops[0];

    // the five (v2-visuals 180159 (a)): 0.68 m apart behind the back wall (hidden), they leave it one at a time 0.35 s apart, on
    // one route at one speed (round the east corner post, down the east end outside the glass, along the front, in at the
    // front, along the file line), so at W only one is on the lens-ward leg at a time; each stops at its place, the lead 1.0 m
    // from the person (VL 15.37), the tail 0.78 m from the east desk's corner. The tail lands 0.8 s into 2A, which carries the
    // same walk (SF.file20Walk with shift -D20). Each is turned 40 degrees towards us from the front edge on.
    let FW = [];
    if (!FAST20) {
    FW = F.file20Walk(k, 0); const Q = FW.map((x) => x.a);
    F.walkEase(FW, 0);   // each stop sets down softly (the kit drops the walk bob in one frame)
    const tLead = FW[0].tEnd;
    // the person faces the file as it comes in, the lead stops by them, then the turn to the laptop
    per.turn(tLead - 900, 400, [0, 0, -2.4]);   // turns to the file as it arrives; no raised arm (its pose snapped in one frame, f141, f147)
    k.cue(tLead - 60, "stop");
    }
    const tTurn = D - 700;
    per.turn(tTurn, 450, [-3.0, 0.9, -3.2]);
    C.laptopFace(k, lap, tTurn + 250, {});
    [2, 3, 4].forEach((i) => W.people[i].hide(tCut));
    // VL 15.76: the ring round the pavilion for the last 0.6 s of W (eased on over 300 ms), then the map in the room frame
    // the snippet eases out as well as in, so a hard ring holds the last 300 ms whole (VL 15.76: whole for the last 300 ms)
    window.roomRing(k, W, "pav", tCut - 600, tCut, { fade: 300 });
    window.roomRing(k, W, "pav", tCut - 300, tCut);
    if (!FAST20) window.locator(k, { room: "pav", from: tCut });   // from the hard cut, the room frame draws only who the line is about (VL 15.71 item 2); they stay in every W frame
    k.cam.keys([
      { t: 0, view: "W-list" },
      { t: tCut, hold: true },
      // ruling 71 c, ruling 103 item 4, VL 15.71 item 3: W to the room is a hard cut, where the push used to land
      ...(FAST20 ? [] : [{ t: tCut, view: C.camPav(k), cut: true }]),
      { t: D + 1, hold: true, drift: false },   // the next shot opens on this exact view (fast: 2A opens on the room, the hard cut)
    ]);
    window.__f20 = { tIn: FW.map((x) => x.tIn), tEnd: FW.map((x) => x.tEnd) };
    return {};
  },
});
