// 2A · X · v2-shots-f (from v2-shots-c). "They come to where the team already works. Quick questions go in the team chat,
// which for us is Slack. Tag Rumi, and the answer comes back in the thread."
// Ruling 101 and v2-visuals 160523: the chat docks as a window in 3B2's home (x 984 to 1824, y 300 to 741) showing the
// channel name and the message field at their Full size, so the typed question reads from 5.19 s; the pin above its left
// edge carries "the team chat" from 1.05 s and grows "Slack" on the word (VL 15.69); the question is sent inside the window
// on "Tag"; from 8.25 s (Slack's 2.0 s stood) the window opens round the words to Full in 500 ms; "1 reply" lands at Full
// on "answer", then the thread and the answer. The person at the laptop and the file of five stay whole in x 96 to 944.
// The one camera move: from 2.0's last frame, widen and slide so the room's people sit left of the window (0 to 1.0 s),
// before the window grows from the laptop.
(function () { const get = (u) => { const x = new XMLHttpRequest(); x.open("GET", u, false); x.send(); return x.responseText; }; (0, eval)(get("../shots/_c/lib.js")); (0, eval)(get("../shots/_f/lib.js")); })();
FILM.shot({
  id: "2A", type: "X", row: "2A", dur: 14000, screens: ["slack-quick"],
  setup(k) {
    const C = window.SC, F = window.SF, V = C.V3, D = k.dur;
    const W = C.world(k, 2); C.crowd(k, W, {}); C.pav2(k, W, { faceLaptop: true });
    const lap = W.parts.laptops[0]; C.laptopFace(k, lap, -1000, {});   // lit from frame 0, as 2.0 leaves it (pre-read 2.0_2240 D)
    // the five as 2.0 left them, on the same walk: the tail's last steps carry across the cut (v2-visuals 180159 (a))
    // fast-only branch (ruling 165 b; with 2.0's fast branch, which cuts W to the room on the join and keeps the five behind the
    // back wall): when D is under 12 s (the fast film's 9.27 s) the five stand at their places from frame 0 (2A opens on a hard cut,
    // VL 15.71: a room's crowd changes only across a cut), so the window grows at 1.5 s; the open follows the pin's 2.0 s with no
    // 8.25 s floor; and the reply, thread and answer key off the open in v10's order, the answer whole 0.5 s before the cut.
    // v10 (14.0 s), ai (14.0 s) and op (15.3 s) keep every time below.
    const FAST2A = D < 12000, SH = FAST2A ? -1e6 : -F.D20;
    const FW = F.file20Walk(k, SH), tTail = Math.max(...FW.map((x) => x.tEnd));
    F.walkEase(FW, -SH);   // the bob on 2.0's clock across the cut, and set down softly at each stop (2A_2255, 2A_2320)
    const tSay = C.at(k, "2A.1", "team", 0), tName = C.at(k, "2A.1", "Slack", 0), tTag = C.at(k, "2A.2", "Tag", 0), tAns = C.at(k, "2A.2", "answer", 0);
    const tOpen = FAST2A ? tName + 2280 : Math.max(tName + 2280, 8250);   // the pin leaves 250 ms before the open, so "Slack" still stands its 2.0 s (pre-read 2A_2105 item 2)                         // the pin with "Slack" stands 2.0 s, then the window opens
    const tCam = 1000, tGrow = Math.max(tCam + 500, tTail + 200);      // the laptop whole 0.5 s before the grow (VL 15.30); the window docks 0.2 s after the fifth stops (180159 item 2)
    const ev = { type: Math.max(tSay + 600, tGrow + 450), send: tTag,   // typing starts once the window is in (pre-read 2A_2255 item 1)
      // fast (pre-read 2.0_2A_fast_0705 item 1: "Rumi is typing" stood one frame with the answer 250 ms after the thread): the answer
      // 530 ms after the thread, so the typing line stands about 9 frames, as v10's L280 to L288
      reply: FAST2A ? tOpen + 500 : Math.max(tOpen + 520, tAns), thread: FAST2A ? tOpen + 550 : tAns + 300, ans: FAST2A ? tOpen + 1080 : tAns + 800 };
    const HOME = { x: 984, y: 300, w: 840, h: 441 };
    const scr = k.screen("slack-quick", { t0: 0, events: ev, to: HOME, fit: "cover", opt: { dock: [0, tOpen], dockRect: { w: 840, h: 441 }, dockFit: "cover" } });
    scr.pushIn(tGrow, 450, { from: lap }); scr.full(tOpen, 500);
    F.pin2(k, { t0: tGrow, tName, t1: tOpen - 250, x: 984,   // gone before the window opens round it (pre-read 2A_2030: the header ran through the pin, f250 to f254)
    bottom: 276, name: "Slack", plain: "the team chat" });
    // VL 15.76: the map while the room is in frame; it leaves with the room as the window opens to Full
    window.locator(k, { room: "pav", from: 0, to: tOpen + 250 });
    k.cue(tGrow, "whoosh"); k.cue(ev.type, "type"); k.cue(ev.send, "message"); k.cue(ev.reply, "message");
    // the room to the left of the window: the person, the laptop and the five whole inside x 96 to 944
    // v2-visuals 170054: about 170 px a metre, aimed high: the pavilion in the lower half, white page above, nobody from B1
    // 160 px a metre: the laptop whole from x 110, the tail ends by x 930, the west colleague wholly out of frame; aimed high,
    // the pavilion in the lower half and nobody from B1 in frame (v2-visuals 170054)
    // 21:4xZ (pre-read 2A_2030 item 3: the person and laptop at x 38 to 107): 6% wider and same aim; stills 21:5xZ: person x 111, tail 942
    // 2A_2105: 3% wider again for the hold's drift (the person touched x 96 at f247), aimed 0.12 m higher so the heads of the room below
    // leave the bottom edge (x 1116 to 1321, y 1066 to 1079)
    const wide = k.cam.on(V([2.1, 2.7, -2.6]),   // 2A_2135: stills 21:5xZ, aim 2.2 showed more of the room below; 2.62 left a head-top bobbing into y 1076 (2A_2235), so 2.7
      { size: "room", px: 113, yaw: -14, focus: V([-0.8, 0.5, -2.4]) });
    // VL 15.71 item 2: a close frame draws only who the sentence is about. The three east colleagues (kit people 2, 3, 4) are
    // not drawn from 2.0's hard cut through 2A and 2B2; every W frame keeps all six (no window then stands over a half body)
    [2, 3, 4].forEach((i) => W.people[i].hide(-1e9));
    // the wider frame (21:4xZ) reaches the west colleague (person 1, PAV_HOME x -4.2) at x 0 to 10 once the camera has moved; it is
    // out of frame at f000 (2.0's last frame), so it is not drawn here either (VL 15.71 item 2)
    W.people[1].hide(-1e9);
    k.cam.keys([
      { t: 0, view: C.camPav(k) },
      { t: 0, hold: true, drift: !FAST2A },   // fast: no drift on this zero-length hold (camera.js:53 put the whole 3.5% drift on f000 to f001, pre-read item 4; after 2.0's hard cut it read as a nudge)
      { t: tCam, view: wide, ease: "io" },
      { t: D + 1, hold: true },
    ]);
    window.__f2a = { tSay, tName, tTag, tAns, tOpen, ev, tTail, tGrow };
    return {};
  },
});
