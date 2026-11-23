// 4A1 · S · v2-shots-d. "Here is where skills come from. A person does the job once, and talks it through. An agent writes the steps
// down as a skill." Ruling 44: the link frame (VL 15.22) holds under 4 s: the speaker upstairs and the newcomer below, the speech marks
// in one navy line from the speaker's head through the slot to the newcomer's page. Then the camera follows the line down in one move to
// room size on the newcomer, who writes the steps down and slots the page into the green-spined book on "skill".
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_d/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "4A1", type: "S", row: "4A1", dur: 12000,
  setup(k) {
    const S = window.SD, P = S.P, D = k.dur;
    const tDoes = S.w(k, "4A1.1", "does", 2910), tTalks = S.w(k, "4A1.1", "talks", 4610), tAgent = S.w(k, "4A1.1", "agent", 6380), tWrites = S.w(k, "4A1.1", "writes", 6820), tSkill = S.w(k, "4A1.1", "skill", 8390);
    // ai_fast-4c (ruling 165 b): the hand is on the page from "agent", the turn and the reach are shorter, so the page is in the book
    // on "skill." and inside D - 500; v10, ai and op (D 12 s and more) read the old times
    const FAST = D < 10000, tW1 = FAST ? tAgent - 50 : tWrites - 200;
    const W = S.world(k); S.lowDesk(k, W);   // 141605 item 3: the film's shared building (S1), as stage 3 leaves it
    const C = S.crowd1(k, W, { clear: [{ room: "board", x0: -4.4, x1: 99 }, { room: "skills", x0: -99, x1: 99 }] });   // 141605 item 4: nobody cut by the link frame's left edge
    S.mountain(k, P.mountain, { n: 46 }); S.slots(k);
    // above: the one speaker works one lesson plan by hand, then looks up and talks it through
    // ruling 98 item 4: the person is seen doing the job from frame 0, a page in the hands and a hand working on it; then talks it through
    // holding it (4A3 opens on the same page in the hands)
    const spk = S.people(W, { keep: true }); spk.turn(tDoes - 600, 500, [1.0, 0, -0.32]).pose(0, "carry");   /* ruling 149: the roof as 4.0 leaves it, nobody moved */   // the person kit has no standing write pose ("write" sits), so the page is held and worked in the hands
    { const sp = S.page(k, { at: [S.SPK[0], 0.9, S.SPK[2]], show: 0, lines: 5 }); sp.hold(-1e6, 1e9, spk, [0, 0.86, 0.33], 0.6).writeLines(300, 2400); }   // blank at frame 0, as 4.0 ends; in the hands; its lines fill while the job is done (pre-read 1634)
    // the line of speech: navy dashes from the speaker's head, through the slot, to the newcomer's page
    const dx = 1.0 - S.SPK[0], dz = -0.32 - S.SPK[2], dl = Math.hypot(dx, dz), head = [S.SPK[0] + dx / dl * 0.25, 1.45, S.SPK[2] + dz / dl * 0.25], slotT = [1.0, 0.05, 0.25], slotB = [1.0, -0.45, 0.25], pagePt = S.agentPoint([2.68, -3.2, -2.44], 0.4, [-0.34, 0.32, 0.22]);   /* pre-read 0648: the last dash lands on the hand, above the page that now rides it */   // the dashes end on the held page, beside the book (pre-read 0020)
    // self-check 0020: faster, and the last dash lands by the pick-up, so none crosses the newcomer once it moves off
    // v2-check 051327: the line never crosses the newcomer's visor. It comes down the slot column (well left of the newcomer) to below
    // visor height, then across, low, to the page at the newcomer's side; three dashes travel at a time (VL item 7)
    const lowLeft = [0.6, -2.6, -1.05];   // pre-read 0622: down in front of the floor's front face (the slot under the shared floor is not seen), then low across the front of the room, clear of the table   // pre-read 0522: inside the frame and in front of the table, not across its top
    S.dashes(k, { t0: tW1 - 2700, t1: tW1 - 2700, arrive: tW1, path: [head, slotT, slotB, lowLeft, pagePt], burst: 3 });   /* pre-read 0600: one group of three leaves the speaker's head in the link frame and lands at the hand on the page as its lines appear */   /* pre-read 0538: groups of three keep coming; the last one reaches the page as its lines appear */   /* pre-read 0522: the first group leaves the speaker's head while the link frame still shows it */
    k.cue(tDoes, "speech");
    // below: the newcomer near the cut face, looking up as the line arrives, writing; then it walks to the desk and the page goes in
    const a = k.agent({ at: S.NEW, face: 0.35, name: "newcomer" });
    // 120529 item 6: at the desk, whole, before the push. 141605 item 2: the newcomer carries the page to the book (agents carry on a walk).
    // Ruling 98 item 3: its hand is on the page while the lines appear (the dashes end at that hand); turned 30 degrees to the table
    // from then until the page is in the book (145700 item 2); arms down when the hands are empty (153507 item 15)
    // pre-read 2230: the writer stands left of the page and the page lies right of its body, in sight; the reach lets go before the
    // arms go forward (each change 300 ms or more), and the page leaves the hand above the table top, never through it
    // pre-read 0020 (rebuilt): the kit moves one arm at a time, so there is no carry walk. The newcomer walks in beside the book with its
    // blank page low at its right side (the book side), in sight; its right hand is on the page while the lines appear; it turns to the
    // book in even steps (the page swings round its side, never through it); the same hand, page in it, reaches the cover's free end;
    // the cover opens under that hand and the page slides from the hand into the book; the hand stays on the open cover (4A2 opens here)
    // pre-read 0230: the page rides the newcomer's own right hand from the moment the hand reaches it, so it never jumps; the arm goes
    // back to its side before the second reach (the kit snaps a reach laid over another); the cover opens under the hand first, and only
    // then does the page leave the hand into the open book (it never sinks through a shut cover)
    const spot = [2.68, -2.44], tTurn = tW1 + (FAST ? 500 : 900), tLift = tTurn + (FAST ? 250 : 500), RCH = FAST ? 1000 : 1400, tOpen = tLift + RCH, tRel = tOpen + (FAST ? 200 : 300);   // the cover opens as the 1400 ms reach arrives
    const coverEdge = [2.2 - 0.235 + 0.47 * Math.cos(0.24) - 0.02, -3.2 + 0.525 + 0.07 + 0.47 * Math.sin(0.24), -2.72], bookIn = [2.2, -3.2 + 0.585, -2.78];
    const LOW = [-0.34, 0.22, 0.22], onPage = S.agentPoint([spot[0], -3.2, spot[1]], 0.4, [LOW[0], LOW[1] + 0.02, LOW[2]]);
    a.walk(tDoes - (FAST ? 800 : 400), 2300, [[0.6, -1.9], [1.7, -2.15], spot], { face: 0.4, ease: "lin" })   /* pre-read 0538: at the desk before the line comes low, so the line never crosses it */
     .reach(tW1 - 700, 700, onPage, { hand: "R", hold: tTurn - 200 - tW1 });
    S.reachUp(a, tLift, RCH, coverEdge, { hand: "R", hold: 1e5, lift: 0, rise: -0.15, fwd: 0.6, side: 1.1, ease: "soft" });   /* self-check 0455: sideways under the visor first, then up to the book */   /* pre-read 0415: slower and lower, so it rises in even steps and the page stays clear of the visor */   /* pre-read 0340: the hand rises above the table top, then over to the book */
    S.turnLin(a, tTurn, 600, 0.4, 0); S.turnLin(a, tRel + 1200, 900, 0, -1.15);
    const F = S.folder(k, { at: P.b1FolderLow, h: 0.04, hinge: true, hingeAngle: 0.24 });
    const pg = S.page(k, { show: 0, lines: 6, shrink: [tRel + 250, 650] });
    pg.hold(-1e6, tW1, a, ["R", [-0.14, 0, 0.06]], 0.55).writeLines(tW1, 550);   /* pre-read 0640: the blank page rides the newcomer's hand from frame 0, as it walks in (it slid along the floor with no hand) */
    pg.hold(tW1, tOpen + 300, a, ["R", [-0.14, 0, 0.06]], 0, 300, [450, bookIn]);   /* pre-read 0445: held on the outer side of the hand, so its tip stays off the visor as it rises */   /* pre-read 0340: flat in the hand, so it goes into the book flat */
    F.open(tOpen, 1e6, { hold: true }).thicken(tRel + (FAST ? 250 : 500), 450, 0.052).pulse(tRel + (FAST ? 550 : 850));
    k.cue(tRel + 250, "page-in");
    // camera: the link frame (from 4.0's end), then one following move down to room size on the newcomer
    const room = k.cam.on([1.6, -2.66, -2.9], { size: "close", height: 0.46, px: 260, pitch: -17, focus: [2.1, -2.4, -3.05] });   // ruling 60: the book 300 px from "writes the steps down"
    const tDown = Math.min(3900, tTalks - 500);
    locator(k, { room: "pav", changes: [[tDown + 1500, "skills"]] });   // VL 15.76: the link frame, then B1 east
    const G0 = k.cam.on(S.GAG.at, S.GAG.o), G40 = Object.assign({}, G0, { dist: G0.dist * (1 - 0.035), yaw: G0.yaw + 2.0 });   /* self-check 1447: 4.0 ends on its close after a full hold drift (camera_rules.js:24, push 0.035, yaw 2.0); f000 takes that pose (PSNR 20.4 without it) */
    k.cam.keys([{ t: 0, view: G40 }, { t: 1200, view: S.LF, ease: "io" }, { t: tDown, hold: true, drift: false },   /* ruling 149: f000 is 4.0's last frame (its close), then the move to the link frame by 1.2 s, before the line leaves the speaker */
     { t: tDown + 2400, view: room, ease: "io" }, { t: D, hold: true, drift: false }]);   /* pre-read 0612: the push keeps pace with the line, so it never leaves the frame; the line starts at the speaker's head, not its page */
    return { W, F };
  },
});
