// 5Dc · S, the people's floor · cut by v2-shots-e from shots/5D/shot.js v0.5 lines 105-131 and the "proactive" card
// (ruling 99, TIMING v6); owner from the handover: v2-shots-f. Rows 5D.4, 5D.5. Hard cut in from 5Db, hard cut out to 5Dd.
// The team in a call; one person holds up the old lesson plan; a pause; the note taker's tile raises its hand and one line
// appears in the chat; a person turns and waves it in; only then the speaker's ring. "Running today" beside the tile on
// the last sentence of 5D.4. 5D.5 names "proactive" on this frame; the hand is still up and the ring still on at the last
// frame (ruling 99 item 6). In v0.5 this part ran from tC = r4.start - 150 to tDd = r5.start - 150 and then pulled back;
// here tC = 0 and nothing ends before the cut.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_e/lib.js", false); x.send(); (0, eval)(x.responseText); })();
// VL 15.76: the kit's locator snippet (v2-kit 18:2xZ), loaded as every snippet
(function(){if(window.locator)return;const x=new XMLHttpRequest();x.open("GET","snippets/locator.js",false);x.send();(0,eval)(x.responseText+";window.locator=locator;window.roomRing=roomRing;");})();
FILM.shot({
  id: "5Dc", type: "S", row: "5Dc", dur: 18867, screens: ["call-notetaker"],
  setup(k) {
    const E = window.SE, D = k.dur, T = THREE, P = KIT.parts, tw = FILM.tw;
    const Wb = E.world(k, E.ALL);
    if (!k.row("5D.4")) E.FB["5D.4"] = { start: 300, end: 12500, dur: 12200 };
    if (!k.row("5D.5")) E.FB["5D.5"] = { start: 13500, end: 18167, dur: 4667 };
    const tC = 0, tDd = D + 2000; // nothing in the call ends inside this shot
    const C = E.crowd(k, Wb, { fitted: E.ALL, sleep: [-5000, null], work: false });
    E.pale(k, C, -1000, 10, null);
    const ui = document.getElementById("ui"), F = "font-family:'Poppins';";
    const el = (html, css) => { const d = document.createElement("div"); d.style.cssText = "position:absolute;left:0;top:0;visibility:hidden;" + css; d.innerHTML = html; ui.appendChild(d); return d; };
    // the call (v2-screens 112012); people in the left third
    const lap = Wb.parts.laptops[1], lp = lap.getWorldPosition(new T.Vector3());
    Wb.people.forEach((q, i) => q.turn(-1e9, 1, 0.35 - 0.2 * (i % 3)));   // turned before frame 0, so nobody snaps at f001 (pre-read 5Dc_2110 item 3)
    // the kit's person 3 stood half behind the panel's left edge (VL 15.59) and, moved, inside the waver: the close frame draws
    // only who the line is about (VL 15.71 item 2), so it is not drawn here; this shot opens on a hard cut
    Wb.people[3].hide(-1e9); Wb.people[4].hide(-1e9);   // person 4 stood across the panel's left edge (18:05Z draft)
    // the holder is one of the room's own people (the kit's person 2), not a seventh body standing inside them (old f1278)
    const holder = Wb.people[2], hp = holder.root ? holder.root.position : new T.Vector3(2.1, 0, -2.2);
    // ruling 106 (d): no person's arm is up and no page stands across a person. The holder stands beside the desk's west end,
    // the old plan propped on the desk beside them, facing us (on a surface, VL 15.23); this shot opens on a hard cut
    const HX = 1.42, HZ = -2.35;   // 0.12 m east: the holder's left edge was at x 66 to 92 (pre-read 5Dc_2105 item 7, limit x 96)
    holder.at(-1e9, [HX, 0, HZ], 0.35);
    // the old lesson plan, the page of 3.0: white, four grey lines and its empty step slot
    const plan = new T.Group(); k.scene.add(plan); P.add(plan, P.rbox(0.42, 0.6, 0.02, P.mat("white"), 0.03, 0.01), 0, 0, 0);
    [0, 1, 2, 3].forEach((r) => P.add(plan, P.rbox(0.29, 0.04, 0.01, P.mat("grey"), 0.01, 0.005), 0, 0.2 - r * 0.1, 0.015));
    P.add(plan, P.rbox(0.29, 0.07, 0.008, P.mat("slab"), 0.01, 0.004), 0, -0.22, 0.015);
    plan.rotation.set(-0.3, 0.15, 0);
    k.each((t) => { plan.visible = t >= tC && t < tDd; plan.position.set(1.89, 1.07, -3.02); });   // 0.42 wide and 0.06 m west, so the laptop's lid shows whole beside it (pre-read 5Dc_2135 item 1)   // propped on the desk's top, beside the holder
    // ruling 124 b (v2-lead 081715; v2-visuals 081822): the holder faces the call until "acts", then turns to the old plan on the
    // desk and looks down at it, no further than three-quarter, over 300 ms (about f426 to f435), and holds that to the cut. No
    // arm goes up (106 d). The opening turn to the plan (tC + 200) is gone: the turn is the change on "acts".
    const tActs = E.at(k, "5D.5", "acts", 0), Y_ACTS = window.__HY != null ? window.__HY : 0.85, HEAD_DOWN = 0.35;   // head as the kit's write-stand
    holder.turn(tActs, 300, Y_ACTS);
    // VL 15.89: people and agents breathe in a room frame, so no run of frames repeats for 2 s (f355 to f425 was 2.4 s)
    k.breathe();
    // the look down: the kit re-poses a breathing person every frame, so this adds to a fresh pose (pure in t)
    // VL 15.89 (K 40 10:22Z: f000 to f066 frozen 2.2 s): as the call starts the holder turns to face us, the call (0.35 to 0,
    // 500 ms from 0.8 s); a head turn did not read on the plain head (stills 10:5xZ). "acts" then turns them from us to the plan.
    holder.turn(800, 500, 0);
    k.each((t) => { const u = tw(t, tActs, tActs + 300, "io"); if (u > 0) holder.root.userData.head.rotation.x += HEAD_DOWN * u; });
    const tHand = E.at(k, "5D.4", "raises"), tChat = E.at(k, "5D.4", "writing"), tInv = E.at(k, "5D.4", "invited"), tRun = E.at(k, "5D.4", "running");
    // the laptop the call grows from is the one on the holder's desk, beside the plan (pre-read 5Dc_2105 item 3: laptops[1] is
    // off to the right, so the panel's first frame stood 550 px wide in mid-air, f067)
    const PLAN = new T.Vector3(1.95, 1.07, -3.02);
    const lapIn = Wb.parts.laptops.slice().sort((a, b) => a.getWorldPosition(new T.Vector3()).distanceTo(PLAN) - b.getWorldPosition(new T.Vector3()).distanceTo(PLAN))[0];
    // ruling 119: the programme lead's ring on the call carries "invited"; no waver is built
    const t0s = tC;
    const ev = { hand: tHand - t0s, chat: tChat - t0s, invite: tInv - t0s, speak: tInv + 1300 - t0s };   // 0.3 s or more with no ring between the programme lead's and the note taker's (ruling 119; pre-read 5Dc_2110: 0.27 s)
    // Full from the hand until the note taker has been invited and speaks, so its written point is read at Full while it is
    // spoken (at panel size it is 26 px; v2-visuals 172456)
    const tFull = Math.max(tC + 1850 + 1500, tHand - 900), tUnfull = Math.min(tInv + 1300 + 300, tDd - 1400);
        const tIn = Math.max(tC + 1850, tHand - 2600);   /* v2-shots-f (VL 15.89; K 40 11:54Z f000 to f066 still 2.2 s): the plan is whole from f000, so 1.85 s keeps 151244 item 3's 1.5 s and the rest under 2 s */ // the plan is whole from 0.7 s, so 1.5 s or more before the panel grows (151244 item 3)
    // one screen for the whole call (v2-shots-f): Panel, Full and back with the kit's io grow, so it never snaps (the three
    // screens of v0.5 handed over between rects 30 px apart with an out-expo push: 154832 item 5, old f1121 to f1123)
    const sa = k.screen("call-notetaker", { t0: t0s, t1: tDd + 450, events: ev, to: { x: 690, y: 350, w: 1150, h: 647 }, opt: { joined: true, handStays: true } });   // v2-screens 203305: the hand stays up to the last frame (172456)   // docked low, top at y 350, from the first dock (172456)
    sa.pushIn(tIn, 450, { from: lapIn });
    sa.full(tFull, 600); sa.panel(tUnfull, 600);
    E.hardHide(sa);
    k.cue(tHand, "hand"); k.cue(tChat, "message");
    // the docked name of the screen, top left; "Running today" its second line on the last sentence (VL 15.48 item 4)
    const dn = el('<div style="' + F + 'font-weight:600;font-size:44px;color:#111418">the note taker</div><div class="run" style="' + F + 'font-weight:500;font-size:29px;color:#3C424B;opacity:0">Running today</div>', "left:260px;top:72px");
    // the docked name stands only while the panel does (VL 15.33)
    // it eases in over 400 ms and out over 250 ms at each edge, and is gone 0.5 s before the card starts to grow (pre-read 5Dc_2105
    // item 5: on and off in one frame at f107, f344, f532)
    FILM._post.push((t) => { const segs = [[tIn + 450, tFull - 150], [tUnfull + 600, tPro - 450 - 500]];
      let a = 0; for (const [s0, s1] of segs) a = Math.max(a, tw(t, s0, s0 + 400) * (1 - tw(t, s1 - 250, s1)));
      dn.style.visibility = a > 0.001 ? "visible" : "hidden"; dn.style.opacity = a; dn.querySelector(".run").style.opacity = tw(t, tRun, tRun + 400); });
    // "proactive" lands 50 ms after its name and stays 3.5 s; 5Dd carries it across the cut with this same line (ruling 99 item 3)
    const tPro = E.after(k, "5D.5", "proactive");
    // at the right, above the call panel, which docks low to make room (v2-visuals 172456); the docked name gives way
    k.ui.nameCard(tPro, { name: "proactive", stamp: "acts before anyone asks", t1: tPro + 3500 + 250, x: 1200, y: 140, lineAt: D < 16000 ? 0 : undefined /* 13 Nov 07:12Z (ruling 167 (4); v2-check 065107, v2-visuals 065205): in the fast film (5Dc 14.1 s; v10, ai, op 18.87 s) the small line comes in with the card; 5Dd reads the same condition */ });   // the same pixels as 5Dd's (v2-visuals 172456)
    // VL 15.76: the map while the room is in frame; it leaves with the room at Full and comes back with it
    // it goes as the panel reaches Full and comes back as the panel starts to leave Full (pre-read 5Dc_2105 item 6)
    window.locator(k, { room: "pav", from: 0, to: tFull + 600 }); window.locator(k, { room: "pav", from: tUnfull + 150 });   // with the room's first frame (v2-check 221848: about 3 frames early over the Full call)
    const meet = new T.Vector3(lp.x + 1.0, 1.1, lp.z + 1.4); // one metre west of v0.5, so the holder is whole at the left (151936 A1)
    k.cam.keys([{ t: 0, view: k.cam.on(meet, { size: "room", focus: [1.6, 1.0, -2.65] }) }, { t: D + 1, hold: true }]);   // focus on the holder (A2)
    return {};
  },
});
