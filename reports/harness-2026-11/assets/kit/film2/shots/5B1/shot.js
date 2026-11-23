// 5B1 · S to N · v2-shots-e (v2.16 06:00Z: SHORT lineAt 0; v2.15 05:45Z: SHORT card to the last frame, 5B2 carries it; v2.14 05:05Z 13 Nov: SHORT for ai_fast-4c, see tRedraw; v2.0 08:40Z, visuals 080334 5B1 list: the table, desk and laptop stand from the close frame's first frame; the room's crowd is gone across the cut; the team walks in from the open front at about 1.1 m/s, three-quarter at most; the table group sits 0.6 m east so the name card lands on clear floor under the panels; the finder's stroke is navy; focus racks to the note for the strike; W-left's base out of the band. v0.2: lead 074149 item 3, visuals 074104 item 8). One agent alone under a card that keeps
// unrolling. The round table lowers in; four come to it. The fault-finder sits across the table from the rest, facing
// them; it strikes one note on the board and the maker redraws it. Notes and labels arrive one at a time. Name card.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_e/lib.js", false); x.send(); (0, eval)(x.responseText); })();
(function(){const x=new XMLHttpRequest();x.open("GET","snippets/locator.js",false);x.send();(0,eval)(x.responseText+";window.locator=locator;window.roomRing=roomRing;");})(); // VL 15.76 map and ring
FILM.shot({
  id: "5B1", type: "S", row: "5B1", dur: 16533,
  setup(k) {
    const E = window.SE, D = k.dur, T = THREE, P = KIT.parts, tw = FILM.tw;
    const r1 = k.row("5B1.1"), r2 = k.row("5B1.2");
    const tTeam = E.at(k, "5B1.2", "team"), tOne = E.at(k, "5B1.2", "member's"), tFaults = E.at(k, "5B1.2", "faults"), tName = E.after(k, "5B1.2", "agent team");
    const fitted = Object.assign({}, E.FIVE, { teams: -1 }); // v2.1 (pre-read 1025, join from 5A): the table installed from the start but hidden until the cut, so the W matches 5A's last frame
    const Wb = E.world(k, fitted);
    const y = E.roomY("teams"), cx = E.roomX("teams"), tz = -4.0;
    const C = E.crowd(k, Wb, { tShift: E.shotDur("5A"), /* v2.0: the crowd carries on from 5A's last frame */ fitted: Object.assign({}, E.FIVE, { teams: 1700 }) /* v2.1: the teams room mills as in 5A until the cut */, clear: [{ room: "teams", x0: -99, x1: 99, from: 1700 }] /* v2.0: every member of the teams room is out across the cut (the corner pair) */ });
    // alone (visuals 090900 item 10): one job card across the whole back wall, slab sides, many grey lines, written on as
    // the agent works; the agent under its left third, at its small desk, looking up at it
    const desk = k.set.part("desk", { w: 0.9, d: 0.6 }); desk.position.set(cx + 0.3, y, -5.3); k.scene.add(desk); // v2.3 (pre-read 1120): narrower, its left leg 40 px or more from the card; v2.4 (pre-read 1305): added again (a comment had swallowed it) // v2.1 (pre-read 0910): against the back wall under the long card's left third, clear of the name card; it stays
    const big = new T.Group(); k.scene.add(big); big.position.set(cx + 1.15, y + 2.2, -5.62); big.scale.x = 0.52; // the east two thirds; the room's panels keep the west (visuals 195758 item 1)
    E.panels(k, new T.Vector3(cx - 0.9, y + 1.05, -5.55), { times: [], red: { 2: [-1e9, -1e9 + 1] } }); // the same four panels as 5.0 and 5A, the freed one green
    P.add(big, P.rbox(5.6, 0.9, 0.08, P.mat("slab"), 0.06, 0.03), 0, 0, 0); P.add(big, P.rbox(5.48, 0.8, 0.04, P.mat("card"), 0.05, 0.02), 0, 0, 0.05);
    const lines = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) lines.push(P.add(big, P.rbox(0.62 + 0.18 * FILM.noise(r * 6 + c, 3), 0.045, 0.012, P.mat("grey"), 0.01, 0.005), -2.45 + c * 0.86 + 0.3, 0.27 - r * 0.18, 0.08));
    k.each((t) => { const u = tw(t, r1.start, r1.end, "lin"); lines.forEach((l, i) => { l.visible = i / lines.length < 0.15 + 0.85 * u; }); const room = t >= 1700; big.visible = room; desk.visible = room; nb.visible = room; lap.visible = room; const tb = Wb.parts.teams; if (tb) tb.visible = room; }); // v2.1: the room's own things appear across the cut (5A's W has none of them)
    const lone = k.agent({ at: [cx - 0.4, y, -4.75], face: -0.3, name: "lone", visibleFrom: 1700 }); lone.root.visible = false; // v2.3b: hidden at creation (pre-read 1250 on 5.0: the crowd moves before the agent's first update) // at its desk, from the cut (v2.1: in W it would push the crowd, kit/crowd.js:137)
    lone.act(r1.start + 600, "write") /* v2.0: no lean (lean() snaps back upright in one frame, v2-shots-b 082751) */.act(E.at(k, "5B1.1", "slow"), "slump").turn(E.at(k, "5B1.1", "argues"), 400, 0.5).act(E.at(k, "5B1.1", "argues") + 400, "shrug").fx(E.at(k, "5B1.1", "argues") + 300, "drop", { size: 56 });
    // the team: makers on the near side facing the table (three-quarter to us), the fault-finder across, facing us
    const TX = 0.6; /* v2.0: the table group 0.6 m east */ const look = [cx + TX, y + 0.8, tz + 2.5];
    // makers behind the table facing us; the fault-finder on the near right, side-on to them (VL 5.1)
    // makers at the table's ends and back, three-quarter to us; the newcomer front left; the fault-finder front right,
    // across from the makers (VL 5.1, 14.8; visuals 081510 item 7)
    // v2.0: back left, back (left of the note board), right; the newcomer front centre; the finder front right. No head
    // left of x 907 on screen while the card is up, no seat under the note board
    const seats = [[cx + 0.0, tz - 0.6], [cx + 1.15, tz + 1.0], null, [cx + 0.15, tz + 1.35]]; // v2.3 (pre-read 1120): the mender front right of the table, off the lens line through the finder's spot at the board // v2.2 (pre-read 1005): back left 40 px clear of the card; the mender at the table's east side, one step from the note // v2.0: a team of four (two makers, the newcomer, the finder), as 5B2 has
    const ff = [cx + 0.95, tz + 1.55]; // v2.2: the finder rests front centre-right, inside the frame
    // in from the open front, staggered, at about 1.1 m/s (was 3.3 m/s from the right edge)
    const from = [[cx - 1.6, -0.6], [cx + 2.0, -0.6]]; // each passes the seated newcomer 0.85 m or more away // below the frame's lower edge until they walk; parallel paths 1.1 m apart
    const makers = from.map((f, i) => { const a = k.agent({ at: [f[0], y, f[1]], face: 0.0, name: "m" + i, visibleFrom: tTeam + [-300, -1600][i] }); a.root.visible = false; const d = Math.hypot(seats[i][0] - f[0], seats[i][1] - f[1]), dur = Math.round(d / 1.1 * 1000), t0 = tTeam + [-300, -1600][i]; // after the newcomer has crossed; the back maker first
      E.walk3q(a, t0, dur, f, seats[i]); a.turn(t0 + dur + 50, 300, look); return a; });
    { const via = [cx - 0.6, -3.3], d1 = Math.round(Math.hypot(via[0] - (cx - 0.55), via[1] + 4.75) / 1.0 * 1000), d2 = Math.round(Math.hypot(seats[3][0] - via[0], seats[3][1] - via[1]) / 1.0 * 1000);
      E.walk3q(lone, tTeam - 1700, d1, [cx - 0.55, -4.75], via); E.walk3q(lone, tTeam - 1700 + d1 + 280, d2, via, seats[3]); lone.turn(tTeam - 1700 + d1 + 330 + d2, 300, look); } // round the table's west edge // first, before the makers cross its path
    const tN = [tOne - 2000, tOne - 500, tFaults - 700], tStrike = tFaults + 150, SHORT = D - tStrike < 5000 /* v2.14 (ai_fast-4c, 12.7 s: the strike is 3.2 s from the end, v2-cut RENDER_LIST_4c row 59 "pin@14.72" lost): the mender sets off on the stroke (tStrike + 50) and the pin (the stroke clearing) lands at 12.09 s, inside [last word 12.10, D-500 12.20] (ruling 165 b); the walk back moves into 5B2. Every length with 5 s or more after the strike (v10, op, ai) runs as v2.13 */, MS = SHORT ? -850 : 0 /* ruling 165 (b): the pin at tRedraw falls inside [last word, D-500] */, tRedraw = tStrike + 3400 + MS, tStrikeW = tStrike - 1400; // v2.1: the mend on "That is an agent team", so the maker walks at a walking pace
    const finder = k.agent({ at: [cx + 2.6, y, -1.25], face: 0, name: "finder", visibleFrom: 1700 }); finder.root.visible = false;
    const fIn = [cx + 2.9, -0.6], fVia = [cx + 2.75, -3.2]; finder.at(0, [fIn[0], y, fIn[1]], 0); // v2.2: in from the right, straight to the board as the line names its job (no rest before the strike)
    const fNote = [cx + 2.95, -5.0]; { const d1 = Math.hypot(fVia[0] - fIn[0], fVia[1] - fIn[1]) / 1.1 * 1000, d2 = Math.hypot(fNote[0] - fVia[0], fNote[1] - fVia[1]) / 1.1 * 1000, tA = tStrike - 600 - d1 - d2 - 250;
      E.walk3q(finder, tA, Math.round(d1), fIn, fVia); E.walk3q(finder, tA + d1 + 250, Math.round(d2), fVia, fNote); } finder.turn(tStrike - 580, 250, -1.3); /* side-on beside the note, never its back (v2.0: the finished turn held its yaw through the walks; each walk now turns first) */
    if (!SHORT) finder.turn(tRedraw + 900, 350, 0.0); // v2.3 (pre-read 1120): it stays at the board's right end, turns to us once the note is mended, and rests there
    k.cue(tTeam, "install");
    // the board on the back wall: notes arrive one at a time; the finder strikes the third; its maker redraws it
    const nb = new T.Group(); k.scene.add(nb); nb.position.set(cx + 1.6, y - 0.7, -5.5); // the board 0.4 m lower, in reach of an agent's hand (pre-read 2145)
    P.add(nb, P.rbox(2.0, 0.8, 0.06, P.mat("slab"), 0.06, 0.02), 0, 1.25, 0);
    const notes = [0, 1, 2].map((i) => { const n = P.add(nb, P.rbox(0.5, 0.4, 0.03, P.mat("card"), 0.04, 0.01), -0.62 + i * 0.62, 1.25, 0.05); [0.08, -0.06].forEach((yy, j) => P.add(n, P.rbox(j ? 0.24 : 0.34, 0.035, 0.012, P.mat("ink"), 0.01, 0.005), -0.04, yy, 0.02)); return n; });
    const strike = P.add(nb, P.rbox(0.56, 0.05, 0.02, new T.MeshStandardMaterial({ color: 0x34507a, roughness: 0.6 }) /* v2.0, VL 2 / table: navy is the hand-made correction mark; red is only for stopped (was red, ruling 113 I) */, 0.02, 0.01), 0.62, 1.25, 0.08); strike.rotation.z = -0.55;
    
    k.each((t) => { notes.forEach((n, i) => { const u = tw(t, tN[i], tN[i] + 400, "out"); let vis = u > 0, yy = 1.25 + (1 - u) * 0.25;
        /* v1.1 (pre-read 2005): the struck note stays; it is mended in place, the red stroke clears */
        n.visible = vis; n.position.y = yy; });
      const m = tw(t, tStrike, tStrike + 350, "out"); const c = 1 - tw(t, tRedraw, tRedraw + 300); strike.visible = m > 0 && c > 0.01; strike.scale.x = Math.max(0.01, m * c); });
    // labels: at most two at once (VL 14.4)
    const lab = ["finding", "idea", "challenge"];
    // ruling 113 I: the notes are blank; no word under them
    if (0) lab.forEach((tx, i) => E.below(k, tN[i], { text: tx, at: nb.localToWorld(new T.Vector3(-0.62 + i * 0.62, 1.03, 0.1)), dy: 60, t1: i === 2 ? tName - 450 : tN[i + 1] - 60 })); // under its own slip, inside the frame (visuals 110413 item 2)
    finder.reach(tStrike - 350, 400, nb.localToWorld(new T.Vector3(0.62, 1.25, 0.1)), { hand: "R", hold: 500 });
    k.cue(tStrike, "mark");
    const mk = makers[1], mVia = [cx + 1.35, -3.55], mAt = [cx + 1.7, -4.9]; /* v2.8 (pre-read 1600): 0.1 m east, 40 px or more from the newcomer */ // v2.6 (pre-read 1425): further west on the way (head was 6 px from the finder at f398) and at the note's west edge, so the note and the hand show beside the head // v2.4 (pre-read 1305): the route keeps 40 px left of the finder on screen (probe of this camera: x 1563 at the turn), round the smaller table; v2.5 (pre-read 1335): this comment had swallowed the walk
    if (!SHORT) mk.act(tStrike + 200, "slump"); E.walk3q(mk, tStrike + 900 + MS, 800, seats[1], mVia); E.walk3q(mk, tStrike + 1750 + MS, 1150, mVia, mAt); mk.turn(tStrike + 2950 + MS, 300, 0.25) /* v2.9 (K 8 16:18Z crops): faces us at the note, so its left hand (the +x, board side) is seen reaching back to the note */ /* side-on to the note, its right hand to the board: never its back */.act(tStrike + 3300 + MS, "write", { blend: 350 }); /* v2.11 (pre-read 1820): starts once the walk and the turn have landed (it cut the walk's bob), and the pad stays in its hand to the end, as the newcomer's does (idle dropped the pad in one frame) */ /* v2.10: facing us at the note, it writes the correction on its pad as the stroke clears (a reach went behind the body; a raised hand came up on the far side) */ /* v2.8: facing east, its left hand is the one on the board side */ /* v2.7 (pre-read 1520): the hand to the note's west edge, within reach, so it is seen at the note; no hop (its arms came within 37 px of the newcomer) */
    if (!SHORT) { mk.turn(tRedraw + 750, 250, -0.3); mk.walk(tRedraw + 1000, 2000, [mVia, seats[1]], { face: -0.3 }); mk.turn(tRedraw + 3000, 300, look); mk.act(tRedraw + 2990, "write", { blend: 300 }); } /* v2.14: SHORT ends with the mender at the note, pad in front; 5B2 walks it back */ /* v2.13 (pre-read 1935): the walk's end drops the held act; re-held from its last step, blended, so the pad stays in front (it snapped to rest at f541) */ /* v2.12 (pre-read 1835): one walk and the turn at its last step, no gaps, so the write pose holds all the way (the arms fell to rest in each 50 ms gap) */ // in front of the note it mends, then back to its seat // back to its seat, out of the finder's line (pre-read 2310)
    k.cue(tRedraw, "pin");
    k.ui.nameCard(tName, { name: "an agent team", stamp: "For people, a project team", x: 96, y: 640, t1: SHORT ? D + 1000 : D - 100, lineAt: SHORT ? 0 : undefined /* v2.16 (ruling 167 (4); v2-check 055128, v2-visuals 062500): in the fast film the small line comes in with the card */ }); /* v2.15 (ruling 166, a name card 2.0 s): SHORT has 1.33 s between the name's first word and D-100, and the join may grow only 0.29 s; so the card stands whole to the last frame and 5B2 carries it 0.45 s more */ // v2.0: on clear floor, 40 px or more under the panels and clear of the back-left maker
    // the laptop on the table (5B2 grows from it); all turn to it in the extra second
    k.each(() => { const tb = Wb.parts.teams; if (tb) { tb.scale.y = 0.5; tb.children.forEach((m) => { m.scale.x = m.scale.z = 0.5; }); /* v2.7 (pre-read 1520): a 0.5 m table (v2.6 0.6 clipped the mender by 4 cm; was 1.0), so the mender passes it on the west route */ if (tb.userData.x0 == null) tb.userData.x0 = tb.position.x; tb.position.x = tb.userData.x0 + TX; } });
    const lap = k.set.part("laptop", {}); lap.position.set(cx + TX, y - 0.35, tz + 0.1); k.scene.add(lap);
    lap.traverse((m) => { if (m.isMesh && m.material && m.material.color && m.material.color.getHex() === 0x111418) m.material = KIT.parts.mat("white"); });
    // v2.1: the laptop shows from the cut, with the table (see the k.each above)
    // (v1.1, pre-read 2005) nobody turns away to the laptop: faces stay to the lens under the name card
    k.person({ at: E.HATCH, face: -0.6 }); // v2.0 (join 5A to 5B1): the operator at the hatch, as 5A ends
    k.breathe(); // VL 15.89 b
    const Lk = E.R("teams", -0.4, 1.15, -3.7);
    locator(k, { room: "teams", from: 1700 }); roomRing(k, Wb, "teams", 1100, 1700); // VL 15.76
    k.cam.keys([
      { t: 0, view: E.WLEFT }, // v2.0: the base out of the band
      { t: 1699, hold: true, drift: false },
      { t: 1700, view: k.cam.on(Lk, { size: "room", px: 270, focus: [cx - 0.55, y + 0.7, -4.75] }), cut: true }, // ruling 103 (d), lead 175358: a hard cut to the room; focus on the lone agent
      { t: tTeam + 900, rack: [cx + TX - 0.2, y + 0.7, -3.0], dur: 700 }, // v2.0: the team at the table
      { t: tStrikeW - 300, rack: [cx + 2.3, y + 0.6, -5.1], dur: 500 }, // v2.0 (VL 13.3): the finder and its note sharp while the line is about them
      ...(SHORT ? [] : [{ t: tRedraw + 1500, rack: [cx + TX - 0.2, y + 0.7, -3.0], dur: 600 }]), // v2.14: SHORT keeps the note sharp to the cut; 5B2 racks back
      { t: D + 1, hold: true, drift: false }, // v2.4 (pre-read 1305): no push under the card; 5B2 opens on this frame
    ]);
    return { lap };
  },
});
