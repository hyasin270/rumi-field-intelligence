// E1 · S · v2-shots-e, owner v2-shots-f from 12 Nov 08:17Z (ruling 124) (v0.4: on v2-shots-a's P1a set, the kit's tower; visuals 090900 items 6-7). P1a's first frame again,
// with the other ending: it stays one storey; on "headcount" the highlight patch (P2's part) spreads under it; on "the
// small one" the line at its door widens to three streams. One move in the rest: a slow rise.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_a/lib.js", false); x.send(); (0, eval)(x.responseText); })();
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_e/lib.js", false); x.send(); (0, eval)(x.responseText); })();
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_f/lib.js", false); x.send(); (0, eval)(x.responseText); })();   // v2-shots-f (ruling 124): SF.endLine
FILM.shot({
  id: "E1", type: "S", row: "E1", dur: 12000,
  setup(k) {
    const SA = window.SA, E = window.SE, D = k.dur;
    // one person a second out of the door (SA.lineTimes keys to P1a's clock, which is outside this shot)
    const E_line = (a, b) => { const o = []; for (let t = Math.ceil(a / 1000) * 1000; t <= b; t += 1000) o.push(t); return o; };
    const s = SA.towerSet(k, { storeys: 0, warmth: 1 });
    const tHead = E.at(k, "E1.1", "headcount"), tSmall = E.at(k, "E1.1", "small one");
    const patch = k.set.part("patch", { w: 5.0 + 2.4, d: 3.6 + 2.4 }); k.scene.add(patch); patch.position.set(0, 0.004, 0); if (patch.fadeIn) patch.fadeIn(tHead - 200, 900); if (patch.eval) k.track(patch);
    k.cue(tHead - 200, "glow");
    const d = s.door;
    // the line of people coming to the door grows (ruling 70; VL 15.49): one rank of about seven, walking in along the front
    // from the right edge into the lit door; from the glow a second rank walks in beside it, half a step along, 0.5 m nearer,
    // and reaches the door end within 2 s; a third rank in the right half only. Still walking at the last frame.
    const into = (dz, dx) => [[d.x + 14 + dx, d.z + 2.6 + dz], [d.x + 4 + dx, d.z + 2.2 + dz], [d.x + 1.3, d.z + 0.5 + dz * 0.3], [d.x + 0.15, d.z + 0.45 + dz * 0.8], [d.x - 3.0, d.z + 0.55 + dz], [d.x - 10.0, d.z + 0.7 + dz]]; /* v1.3 (pre-read 2250): the door is shut, so each is served at it and walks on out of the frame (lead 175358 item 8) */ // v1.2: they walk on through the door and out of sight behind the wall, so nobody stands in the doorway (pre-read 2155); v1.1 (visuals 200912): the last metres run across the frame, not into the lens, so nobody stacks behind anyone at the door
    const start = [d.x + 16, 0, d.z + 2.7];
    // v1.0 (17:10Z, pre-read E1 check 4): each file reaches the door on its own beat, the files half a second apart, so the
    // door takes one person at a time and no pair walks inside another (E.evenFlow inverts the kit's walk-length noise)
    // v2-shots-f (ruling 124 a; v2-visuals 080638 E1 faults 1 and 3, VL 15.49): two ranks from the right edge on the floor band,
    // one constant speed, rank B from the glow 0.5 m nearer and half a beat behind (SF.endLine). The old near file walked up
    // from below the frame, and the kit's eased walk bunched each file at its start, so two bodies shared one outline.
    window.SF.endLine(k, d, { shift: 0, tB: tHead - 300, endStand: true });   // v2-visuals 193600: feet together on the last frame in every version
    // VL 15.89 b
    k.breathe();
    const A0 = SA.p1Pose(d);
    // ends on E2's first frame: the building and the line below y 600, the title area clear (VL 15.46, 15.49)
    k.cam.keys([{ t: 0, view: A0 }, { t: k.row("E1.1").end - 1200, hold: true } /* v2-shots-f (pre-read E1E2_0905 check 15): the rise takes 2.7 s, not 1.5 s, so no body steps over 40 px in a frame (41 to 44 px, f348 to f356); the end view is unchanged, so the join holds */, { t: D, view: SA.pose([d.x + 2.8, 3.4, d.z + 0.6], 230, 2.15, -12, -9), ease: "io" }]);
    return s;
  },
});
