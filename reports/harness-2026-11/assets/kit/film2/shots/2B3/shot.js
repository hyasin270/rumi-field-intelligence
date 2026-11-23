// 2B3 · X · v2-shots-c. "They settle it there, in comments." The move: comment, reply with a reason, agreement, Resolved,
// at twice the screen's own pace (lead 07:27Z: at most 6 s) (BLOCKING.md 2B3).
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_c/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "2B3", type: "X", row: "2B3", dur: 6000, screens: ["notion-comments"],
  setup(k) {
    k.breathe();   // VL 15.89 b (v2-visuals 082838): every render from now; signed renders are not redone for it
    const C = window.SC, V = C.V3, D = k.dur;
    const W = C.world(k, 2); C.crowd(k, W, {}); C.pav2(k, W, { faceLaptop: true });
    const f = Math.min(1, D / 6000), tC = C.at(k, "2B3.1", "comments", 300);
    // ruling 164 (c), fast only (D under 4.0 s; AI-FAST 4c is 2.37 s): scaled, "Resolved" ticked at 1.93 s and stood whole 0.27 s
    // (v2-visuals 083635, v2-check 083750). FAST: the reply at 1.30 s and "Resolved" at 1.55 s, whole about 0.6 s. D >= 4000 as signed
    const ev = { anchor: Math.min(400, tC - 500), c1: Math.max(900, tC - 200), typing: 2000 * f, c2: 2700 * f, c3: D < 4000 ? 1300 : 4100 * f, resolve: D < 4000 ? 1550 : 4900 * f };
    k.screen("notion-comments", { t0: 0, events: ev, to: "full" });
    k.cue(ev.c1, "message"); k.cue(ev.c2, "message"); k.cue(ev.c3, "message"); k.cue(ev.resolve, "tick");
    k.cam.keys([{ t: 0, view: C.camPav(k) }, { t: D + 1, hold: true }]);
    return {};
  },
});
