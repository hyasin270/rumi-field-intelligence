// 2B2 · X · v2-shots-f (from v2-shots-c). "Later, a link arrives. It opens a page in Notion, with the mockups and the open
// questions." The move: the link card grows into the Notion page, one continuous push, and in the same 800 ms the screen
// comes back from Full to the panel, so the page lands at panel size in the room with its pin beside it (v2-visuals 160200
// item 2). The pin: its plain line as the page lands, "Notion" growing in on the word (ruling 100, VL 15.69), both lines
// 2.0 s or more (ruling 96), gone as the grow to Full starts (VL 15.33). Then Full for the mockups and the open questions.
(function () { const get = (u) => { const x = new XMLHttpRequest(); x.open("GET", u, false); x.send(); return x.responseText; }; (0, eval)(get("../shots/_c/lib.js")); (0, eval)(get("../shots/_f/lib.js")); })();
FILM.shot({
  id: "2B2", type: "X", row: "2B2", dur: 10200, screens: ["slack-notion"],
  setup(k) {
    const C = window.SC, F = window.SF, D = k.dur;
    const W = C.world(k, 2); C.crowd(k, W, {}); C.pav2(k, W, { faceLaptop: true });
    [2, 3, 4].forEach((i) => W.people[i].hide(-1e9));   // as in 2A: the close frame draws only who the sentence is about (VL 15.71 item 2)
    const tLink = C.at(k, "2B2.1", "link", 250), tOpen = C.at(k, "2B2.1", "opens", 250);
    const tName = C.at(k, "2B2.1", "Notion", 0);            // the word's start: the name grows no earlier (ruling 100)
    // fast-only branch (ruling 165 b; v2-check 045050: 2B2 snaps at the cut, the grow to Full ending 80 ms before it): when D is
    // under 7 s (fast 6.33 s, about 6.57 s with the 2B2.1 to 2B3.1 join grown 0.22 s under ruling 166) the page goes to Full at
    // tName + 2250 over 450 ms, so the pin still stands its 2.0 s and Full holds 0.5 s before the cut. v10 (10.2 s), ai (10.2 s)
    // and op (7.7 s) keep tName + 2300 over 600 ms.
    const FAST2B2 = D < 7000, gFull = FAST2B2 ? 450 : 600;
    const tFull = tName + (FAST2B2 ? 2250 : 2300);           // both lines 2.0 s, the pin gone 250 ms before the grow to Full (pre-read 2B2_2135 M: the page slid over the fading pin)
    const ev = { clock: 0, m3: tLink, cur: tLink + 800, click: tOpen - 100, open: tOpen + 50,
      hlMock: C.at(k, "2B2.1", "mockups", 0), hlQ: C.at(k, "2B2.1", "questions", 0),
      hlEnd: D - 450 };   // v2-screens 213823: the highlight is gone by the last frame, which equals 2B3's frame 0 (with push: false)   // each lights on its word, never before (v2-visuals 162133)
    // mounted at the panel (with to: "full" the kit's panel target is the full frame, so panel() would go nowhere); Full
    // from before frame 0, as 2B1 leaves it
    const scr = k.screen("slack-notion", { t0: 0, events: ev, to: "panel", opt: { open: "link", push: false } });   // the page comes out of the link (213823 item 1)
    scr.full(-1000, 1);
    scr.panel(ev.open, 800);                                 // one move with the link's grow into the page (screen.js: 800 ms io)
    scr.full(tFull, gFull);
    F.pin2(k, { t0: ev.open + 800, tName, t1: tFull - 250, x: 260,   // arrives once the panel has landed (2B2_2135 B)
    bottom: 292, name: "Notion", plain: "For people, a workshop<br>in a meeting room" });   // two balanced lines (VL 15.31): one line ended 16 px from the panel
    // VL 15.76: the map comes with the room as the screen leaves Full and leaves with it; a top-left pin starts at x 260
    window.locator(k, { room: "pav", from: ev.open, to: tFull + gFull });   // on while any of the room shows (2B2_2135 L)
    k.cue(ev.m3, "message"); k.cue(ev.click, "click"); k.cue(ev.open, "open");
    k.cam.keys([{ t: 0, view: C.camPav(k) }, { t: D + 1, hold: true }]);
    window.__f2b2 = { tLink, tOpen, tName, tFull, ev };
    return {};
  },
});
