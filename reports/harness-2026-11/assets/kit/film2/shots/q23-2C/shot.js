// 2C · X · v2-shots-c. "Finished work lands in the documents and email the team uses." The move: the page drops into the
// shared drive as three files, then one email from Rumi lands; the email is not opened (BLOCKING.md 2C).
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_c/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "q23-2C", type: "X", row: "2C", dur: 6230, screens: ["q23-drive-email"],
  setup(k) {
    k.breathe();   // VL 15.89 b (v2-visuals 082838): every render from now; signed renders are not redone for it
    const C = window.SC, V = C.V3, D = k.dur;
    const W = C.world(k, 2); C.crowd(k, W, {}); C.pav2(k, W, { faceLaptop: true });
    const tDocs = C.at(k, "2C.1", "documents", 300), tMail = C.at(k, "2C.1", "email", 300);
    // ruling 164 (c), fast only: under 4.0 s (AI-FAST 4c, 3.7 s) the pan to Gmail waits for the three files to land (tDocs + 650)
    // instead of starting with them; every other version (D >= 4000) draws as signed
    const swap = D < 4000 ? tDocs + 650 : Math.min(D - 2600, Math.max(tDocs + 1700, tMail - 700));
    const ev = { drop: 0, files: tDocs, swap, mail: swap + 750, hlRow: swap + 1350 };
    k.screen("q23-drive-email", { t0: 0, events: ev, opt: { dur: D }, to: "full" }).panel(D - 1500, 600);
    k.cue(0, "whoosh"); k.cue(ev.files, "stick"); k.cue(ev.files + 150, "stick"); k.cue(ev.files + 300, "stick"); k.cue(ev.mail, "message");
    k.cam.keys([{ t: 0, view: C.camPav(k) }, { t: D + 1, hold: true }]);
    return {};
  },
});
