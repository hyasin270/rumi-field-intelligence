// 2B1 · X · v2-shots-c. "Deep work needs more room. The agent says where things stand. The product manager says, let me
// know when you're done." The move: two messages arrive in turn, on the same panel as 2A (BLOCKING.md 2B1).
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_c/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "2B1", type: "X", row: "2B1", dur: 10000, screens: ["slack-status"],
  setup(k) {
    k.breathe();   // VL 15.89 b (v2-visuals 082838): every render from now; signed renders are not redone for it
    const C = window.SC, V = C.V3, D = k.dur;
    const W = C.world(k, 2); C.crowd(k, W, {}); C.pav2(k, W, { faceLaptop: true });
    const tAg = C.at(k, "2B1.1", "agent says", 250), tPm = C.at(k, "2B1.1", "product manager", 150), tLet = C.at(k, "2B1.1", "let me know", 150);
    const ev = { m1: tAg, type: tPm, m2: tLet };
    k.screen("slack-status", { t0: 0, events: ev, to: "full" });
    k.cue(ev.m1, "message"); k.cue(ev.type, "type"); k.cue(ev.m2, "message");
    k.cam.keys([{ t: 0, view: C.camPav(k) }, { t: D + 1, hold: true }]);
    return {};
  },
});
