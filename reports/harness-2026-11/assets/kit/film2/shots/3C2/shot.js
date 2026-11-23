// 3C2 · W · v2-shots-c. No voice: the 3.5 s rest after 3B2.1 ends stage three. A hard cut from the store to the whole
// building (VL 15.71, ruling 103 items 1 and 4; v2-visuals 181217, ruling 109 b): every room holds its crowd in lanes, the
// store full; the ring is on the store for the first 0.6 s so the viewer knows the room just left (VL 15.76); "beads" and
// "hooks" dock one at a time from the first still frame; the list arrives whole and question three ticks. 4.0 opens on
// this last frame (v2-shots-d).
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_c/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "3C2", type: "W", row: "3C2", dur: 3500,
  setup(k) {
    k.breathe();   // VL 15.89 b (v2-visuals 082838): every render from now; signed renders are not redone for it
    const C = window.SC, D = k.dur;
    const W = C.world(k, 3, { storeAt: -1e9 });
    C.crowd(k, W, { fitted: { board: -1e9, skills: -1e9, gates: -1e9, store: -1e9 } });   // the store full, in its lanes
    roomRing(k, W, "store", 0, 600);
    C.docksWest(k, 100, null, 300);   // no east label in W-list (VL 15.56)
    const tList = 1000;
    k.ui.questions(tList, { active: null, ticked: [1, 2], tickAt: { 3: Math.min(D - 600, tList + 900) }, writeAt: { 1: tList, 2: tList, 3: tList, 4: tList, 5: tList } });
    k.cam.keys([
      { t: 0, view: "W-list" },
      { t: D + 1, hold: true, drift: false },   // 4.0 opens on this exact view
    ]);
    return {};
  },
});
