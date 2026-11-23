// roleb-week · X · lane roleb (s26 The weekly meeting). From 3A1's set (the meeting upstairs, as 3.0 leaves it): the
// operators' weekly meeting. The hour grows out of the meeting's laptop as a panel (20 / 10 / 30 minutes, each part lit
// as it is named), goes to Full for the two cases, and goes back into the laptop; then the camera pulls back to the
// whole building, people upstairs and the agents below: what one region learns goes into the house for every region.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_c/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "roleb-week", type: "X", dur: 19000, screens: ["roleb-week"],
  setup(k) {
    k.breathe();
    const C = window.SC, V = C.V3, D = k.dur;
    const W = C.world(k, 4); C.crowd(k, W, {});
    const tab = C.meetingTable(k, W, -1, [0.0, 0, -2.7]);
    W.parts.laptops.forEach((l, i) => C.laptopFace(k, l, -1000, { mark: i < 2 }));
    C.seated(k, W);
    const T0 = 150, tFull = 5200, tPanel = 12200, tOut = 13000, tBack = 13500;
    // screen clock: the three parts light 1.2 s apart once the panel lands; the cases at Full
    const ev = { s1: 1300, s2: 2300, s3: 3300, c1: tFull + 700 - T0, c2: 9400 - T0 };
    const scr = k.screen("roleb-week", { t0: T0, t1: tOut + 700, events: ev, opt: { dur: D } });
    scr.pushIn(T0, 900, { from: tab.laptop }); scr.full(tFull); scr.panel(tPanel); scr.pushOut(tOut, 600, { to: tab.laptop });
    // the meeting turns to the screen as each part is named, and one person raises a hand in the questions part
    W.people[2].pose(T0 + ev.s2 + 100, "hand-up", { blend: 300 }); W.people[2].pose(T0 + ev.s3, "stand", { blend: 300 });
    W.people[0].pose(T0 + ev.s1 + 100, "point", { blend: 300 }); W.people[0].pose(T0 + ev.s2, "stand", { blend: 300 });
    locator(k, { room: "pav", from: 0, to: tFull + 420 }); locator(k, { room: "pav", from: tPanel + 120, to: tBack });
    k.cue(T0, "whoosh"); k.cue(T0 + ev.c1, "message"); k.cue(T0 + ev.c2, "message");
    k.cam.keys([
      { t: 0, view: k.cam.on(V([0.6, 0.9, -2.6]), { size: "room", px: 280, yaw: -14 }) },
      { t: tBack, hold: true, drift: false },
      { t: tBack + 2600, view: "W", ease: "io" },
      { t: D + 1, hold: true },
    ]);
    return {};
  },
});
