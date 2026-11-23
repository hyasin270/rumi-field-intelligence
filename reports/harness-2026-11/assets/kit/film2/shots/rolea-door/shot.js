// rolea-door · S · lane rolea (Operator Harness Show, 23 Nov 2026). A new shot on P1a's set (the kit's tower, one lit storey):
// the small lit building and the line of people it serves, no title. The camera comes down from the wide view onto the
// door, then holds; three names dock on the building one after another, each lit for its beat: Teach Well (the door),
// Improve (the window with the person in it), Learn (the roof). Rests for s01: 3000, 6000, 9000, 12000.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_a/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "rolea-door", type: "S", dur: 13000,
  setup(k) {
    k.breathe();
    const SA = window.SA, D = k.dur;
    const s = SA.towerSet(k, { storeys: 0, warmth: 1 });
    // one person out of the door every 1.4 s, on this shot's own clock (no row)
    const times = []; for (let t = -16000; t <= D; t += 1400) times.push(t);
    SA.doorLine(k, { door: s.door, times });
    const d = s.door;
    // the three names: docked in one column right of the building, each on its part of the building
    // each label beside its own part, so no two leaders cross: Teach Well west of the building at the door's height,
    // Improve east at the window's height, Learn east and higher, on the roof's front edge
    const N = [["Teach Well", [d.x + 0.05, 2.05, d.z - 0.7], 2600, "west", 330, 420],
               ["Improve", [1.0, 1.75, 1.95], 5600, "east", 1290, 440],
               ["Learn", [0.0, 3.25, 0.6], 8600, "east", 1290, 250]];
    N.forEach(([text, at, t0, side, x, y]) => {
      const dk = k.ui.dock(t0, { text, at, side, x, y });
      dk.light(t0, 2900);
      k.cue(t0, "name");
    });
    const A0 = SA.p1Pose(d), WIDE = SA.pose([d.x + 2.8, 3.4, d.z + 0.6], 230, 2.15, -12, -9);
    k.cam.keys([{ t: 0, view: WIDE }, { t: 2400, view: A0, ease: "io" }, { t: D, hold: true }]);
    return s;
  },
});
