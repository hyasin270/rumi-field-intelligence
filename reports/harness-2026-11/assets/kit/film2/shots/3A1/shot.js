// 3A1 · X · v2-shots-c. "So we built a meeting note taker of our own. It joins a call when someone invites it."
// The move: the call grows out of the meeting's laptop; the host invites the note taker and its tile joins (BLOCKING.md 3A1).
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_c/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "3A1", type: "X", row: "3A1", dur: 9870, screens: ["call-notetaker"],
  setup(k) {
    k.breathe();   // VL 15.89 b (v2-visuals 082838): every render from now; signed renders are not redone for it
    const C = window.SC, V = C.V3, D = k.dur;
    const W = C.world(k, 3); C.crowd(k, W, {});
    const tab = C.meetingTable(k, W, -1, [0.0, 0, -2.7]);
    W.parts.laptops.forEach((l, i) => C.laptopFace(k, l, -1000, { mark: i < 2 }));   // as 3.0 leaves them (pre-read 3.0 0030: the east desk laptop was blank at f000)
    C.seated(k, W);   // as 3.0 leaves the meeting
    const tInv = C.at(k, "3A1.1", "invites", 0);
    const sh = tInv - 5600; // the screen's own timeline, shifted so "Invite" is clicked on the word
    // ruling 164 (c), fast only (D under 7.0 s; AI-FAST 4c is 5.27 s): at the signed times the panel left Full 80 ms before the
    // "Invite" click and the join fell after the cut. FAST: the click stays on "invites", the join, the recording and the first
    // lines follow within 0.6 s at Full, and the panel takes the last 0.5 s. 3A2's fast branch reads the same clock. D >= 7000 as signed
    const FAST = D < 7000;
    const ev = FAST ? { cur: 2000 + sh, ppl: 3000 + sh, type: 3500 + sh, sug: 4100 + sh, invite: tInv, join: tInv + 250, rec: tInv + 500, lines: tInv + 600 }
      : { cur: 2000 + sh, ppl: 3000 + sh, type: 3500 + sh, sug: 4100 + sh, invite: tInv, join: tInv + 550, rec: tInv + 1200, lines: tInv + 1400 };
    const tPanel = FAST ? D - 500 : Math.min(D - 900, tInv + 3600);
    const scr = k.screen("call-notetaker", { t0: 0, events: ev, opt: { dur: D } });
    scr.pushIn(150, 900, { from: tab.laptop }); scr.full(tInv - 900); scr.panel(tPanel, FAST ? 500 : undefined);
    // VL 15.76: the map while the room is seen; it leaves as the call grows to Full and returns with the room
    locator(k, { room: "pav", from: 0, to: tInv - 900 + 420 }); locator(k, { room: "pav", from: tPanel + 120, to: D + 1 });
    k.cue(150, "whoosh"); k.cue(ev.invite, "click"); k.cue(ev.join, "message");
    k.cam.keys([{ t: 0, view: k.cam.on(V([0.6, 0.9, -2.6]), { size: "room", px: 280, yaw: -14 }) }, { t: D + 1, hold: true }]);
    return {};
  },
});
