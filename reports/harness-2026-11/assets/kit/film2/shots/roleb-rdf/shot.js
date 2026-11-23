// roleb-rdf · X · lane roleb (s24 Prove it). Inside the model, B1 east, the skills room's desk (kp-2B2's set): the agent
// that makes each region's weekly charts. The weekly charts grow out of its laptop: a title card, then Full for the Teach Well
// chart and the Improve chart (Tanzania, 21 to 27 Oct, aggregate images), then back into the laptop; the agent turns
// to us and hops: the number showed where the region reads it.
FILM.shot({
  id: "roleb-rdf", type: "X", dur: 15000, screens: ["roleb-rdf"],
  setup(k) {
    k.breathe();
    const W = k.set.building({ fitted: ["board", "skills", "gates", "store", "judge", "teams"] });
    const deskP = W.parts.desk.getWorldPosition(new k.T.Vector3());
    const lap = k.set.part("laptop", {}); lap.position.set(deskP.x + 0.2, deskP.y, deskP.z); lap.rotation.y = 0.5; k.scene.add(lap);
    const C = k.crowd(300, { seed: 9 });
    const lanesE = [{ x0: 5.0, x1: 5.75, z0: -5.3, z1: -0.7, y: -3.2 }];
    C.place(0, [lanesE, W.area("board"), W.area("gates"), W.area("store"), W.area("judge"), W.area("teams")].flat());
    C.slots(1, { area: lanesE, index: (i) => Math.floor(i / 6), only: (st) => st.y > -3.3 && st.y < -3.1 && st.x > 4.9, dur: 1 });
    const ag = [deskP.x + 1.05, -3.2, deskP.z + 0.55];
    const a = k.agent({ at: ag, face: 1.35, name: "rdf" });
    const T0 = 300, tFull = 3400, tTeach = 4000, tImpr = 7600, tPanel = 10200, tOut = 10900;
    const scr = k.screen("roleb-rdf", { t0: T0, t1: tOut + 700, events: { title: 0, teach: tTeach - T0, improve: tImpr - T0 } });
    scr.pushIn(T0, 600, { from: lap }); scr.full(tFull); scr.panel(tPanel); scr.pushOut(tOut, 600, { to: lap });
    a.act(200, "write");
    a.turn(tOut + 500, 400, 0.25).act(tOut + 900, "hop").act(tOut + 1900, "proud");
    k.cue(T0, "whoosh"); k.cue(tTeach, "message"); k.cue(tImpr, "message"); k.cue(tOut + 900, "tick");
    k.cam.keys([
      { t: 0, view: k.cam.on([ag[0] + 1.3, -2.75, ag[2] - 0.2], { size: "close", yaw: -14, pitch: -8, focus: [ag[0], -2.85, ag[2]], aperture: 0.3 }) },
      { t: tOut, hold: true, drift: false },
      { t: tOut + 1800, view: k.cam.on([ag[0] + 0.3, -2.7, ag[2]], { size: "room", yaw: -14, pitch: -10 }), ease: "io" },
      { t: 15001, hold: true },
    ]);
    return {};
  },
});
