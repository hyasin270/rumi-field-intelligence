// q5-whole · W · lane q5, for s28 "The whole harness" (Operator Harness Show, 23 Nov 2026). Built from R0's recap frame
// (E.recapView, and E.recap's layout copied here so the names can differ) with every FoP leftover gone: the roof sign reads
// "Taleemabad" and never turns, no "how it could work", no lender screens, no other sectors. Your people upstairs, the
// operator at the hatch, the agents below at work. Eleven names in the order the show met them, at most five a press, each
// room lighting as its name lands; then the camera rises so the closing line has the band under the building.
// v2 (integrator second pass): "Slack, Notion, Google, email" as one label; "the tiers" beside the note taker's store.
// Rests (for scenes/s28): 3600, 8100, 12400, 16200.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_e/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "q5-whole", type: "W", dur: 16800,
  setup(k) {
    const E = window.SE, T = THREE, tw = FILM.tw, D = k.dur;
    k.breathe();
    const Wb = E.world(k, E.ALL);
    E.crowd(k, Wb, { fitted: E.ALL });
    E.alwaysOn(k, new T.Vector3(...E.BOX), {});
    k.person({ at: E.HATCH, face: -0.6 }); // the operator at the hatch (R1's place)
    const sg = E.roofSign(k, "Taleemabad", null, null);
    k.each((t) => { const u = tw(t, 900, 1350, "back"); sg.visible = u > 0.001; sg.scale.set(1, Math.max(0.001, u), 1); });
    // ---- the recap layout (as _e/lib.js E.recap, VL 15.75), with this show's names
    const V = E.recapView();
    const camOf = (P) => { const yw = P.yaw * Math.PI / 180, pt = P.pitch * Math.PI / 180, lk = new T.Vector3(...P.look);
      const pos = lk.clone().addScaledVector(new T.Vector3(Math.sin(yw) * Math.cos(pt), -Math.sin(pt), Math.cos(yw) * Math.cos(pt)), P.dist);
      const c = new T.PerspectiveCamera(20, 1920 / 1080, 0.1, 500); c.position.copy(pos); c.lookAt(lk); c.updateMatrixWorld(true); c.updateProjectionMatrix(); return c; };
    const proj = (c, v) => { const q = new T.Vector3(...v).project(c); return { x: (q.x + 1) * 960, y: (1 - q.y) * 540 }; };
    const CORNERS = []; [-6.55, 6.55].forEach((x) => [3.6, -9.96].forEach((y) => [0.2, -6.2].forEach((z) => CORNERS.push([x, y, z]))));
    const c = camOf(V), xs = CORNERS.map((q) => proj(c, q).x), x0 = Math.min(...xs), x1 = Math.max(...xs);
    const L = [["slack", "Slack, Notion,<br>Google, email", [-3.0, 0.6, -3.2], "west", 2], ["webhook", "a webhook", [E.BOX[0], 0.4, E.BOX[2]], "west", 1],
      ["bead", "beads", [-6.0, -2.3, -0.6], "west", 1], ["hook", "hooks", [-6.0, -4.8, -0.6], "west", 1], ["judge", "evals", [-6.0, -8.0, -0.6], "west", 1],
      ["people", "your people", [3.5, 1.1, -2.6], "east", 1], ["operator", "an operator", [E.HATCH[0], 0.7, E.HATCH[2]], "east", 1],
      ["skill", "skills", [3.85, -1.9, -5.0], "east", 1], ["store", "the note taker", [3.9, -5.4, -4.6], "east", 1], ["tiers", "the tiers", [2.0, -5.9, -5.4], "east", 1],
      ["teams", "agent teams", [3.05, -8.85, -4.0], "east", 1]];
    const H = 56, pos = {};
    ["west", "east"].forEach((side) => {
      const rows = L.filter((q) => q[3] === side).map((q) => ({ q, h: H * q[4], ay: proj(c, q[2]).y })).sort((a, b) => b.ay - a.ay);
      let prev = null; rows.forEach((r) => { r.cy = prev ? Math.min(r.ay, prev.cy - (prev.h / 2 + r.h / 2 + 12)) : Math.min(r.ay, 1000 - r.h / 2); prev = r; });
      const top = Math.min(...rows.map((r) => r.cy - r.h / 2)), lift = Math.max(0, 54 - top); rows.forEach((r) => { r.cy += lift; pos[r.q[0]] = r; });
    });
    // ---- the order the show met them: your people; then the rules, the talk and the note taker; then the rest
    const room = { bead: "board", skill: "skills", hook: "gates", store: "store", tiers: "store", judge: "judge", teams: "teams" };
    const T1 = ["bead", "skill", "hook", "slack", "store"], T2 = ["tiers", "judge", "operator", "teams", "webhook"], gap = 650;
    const times = { people: 2300 }; T1.forEach((id, i) => (times[id] = 4300 + i * gap)); T2.forEach((id, i) => (times[id] = 8800 + i * gap));
    Object.keys(times).forEach((id) => { const r = pos[id], side = r.q[3];
      k.ui.dock(times[id], { text: r.q[1], small: "", at: new T.Vector3(...r.q[2]), side, x: side === "west" ? Math.round(x0 - 104) : Math.round(x1 + 84), y: Math.round(r.cy - r.h / 2) }).light(times[id], 1300);
      if (room[id]) Wb.glow(room[id], times[id], 1e6, 0.55); k.cue(times[id], "chime-light"); });
    // the people upstairs: one walks to a colleague's desk and back while the names land (no frozen roof)
    { const pp = Wb.people && Wb.people[1]; if (pp && pp.walk) pp.turn(4200, 250, 1.3).walk(4450, 1500, [[-0.5, -3.2]]).turn(6000, 300, 1.25).turn(9200, 300, -1.3).walk(9500, 1500, [[-1.3, -2.6]]).turn(11000, 400, -0.35); }
    // the closing line's band: the camera rises a little (the building moves up and back) after the last name
    const V2 = { look: [V.look[0], V.look[1] - 1.1, V.look[2]], dist: V.dist * 1.12, yaw: V.yaw, pitch: V.pitch };
    k.cam.keys([{ t: 0, view: "W" }, { t: 200, hold: true, drift: false }, { t: 2000, view: V, ease: "io" }, { t: 12800, hold: true, drift: false },
      { t: 14200, view: V2, ease: "io" }, { t: D + 1, hold: true, drift: false }]);
    return {};
  },
});
