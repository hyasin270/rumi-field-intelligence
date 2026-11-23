// E2 · N · v2-shots-e, owner v2-shots-f from 12 Nov 08:17Z (ruling 124) (v0.4: the one line in its one setting, the same call as P2; visuals 080158 item 3, 090900 item 7).
// E1's building with its patch and its line of people below; the camera rises once so the line of type sits on clear page.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_a/lib.js", false); x.send(); (0, eval)(x.responseText); })();
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_e/lib.js", false); x.send(); (0, eval)(x.responseText); })();
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_f/lib.js", false); x.send(); (0, eval)(x.responseText); })();   // v2-shots-f (ruling 124): SF.endLine
FILM.shot({
  id: "rolea-E2", type: "N", row: "E2", dur: 8500,
  setup(k) {
    const SA = window.SA, E = window.SE, D = k.dur;
    // one person a second out of the door (SA.lineTimes keys to P1a's clock, which is outside this shot)
    const E_line = (a, b) => { const o = []; for (let t = Math.ceil(a / 1000) * 1000; t <= b; t += 1000) o.push(t); return o; };
    const s = SA.towerSet(k, { storeys: 0, warmth: 1 }), d = s.door;
    const patch = k.set.part("patch", { w: 5.0 + 2.4, d: 3.6 + 2.4 }); k.scene.add(patch); patch.position.set(0, 0.004, 0); if (patch.eval) k.track(patch);
    // E1's line as it ends: three ranks walking in along the front into the lit door (ruling 70, VL 15.49)
    const into = (dz, dx) => [[d.x + 14 + dx, d.z + 2.6 + dz], [d.x + 4 + dx, d.z + 2.2 + dz], [d.x + 1.3, d.z + 0.5 + dz * 0.3], [d.x + 0.15, d.z + 0.45 + dz * 0.8], [d.x - 3.0, d.z + 0.55 + dz], [d.x - 10.0, d.z + 0.7 + dz]]; /* v1.3 (pre-read 2250): the door is shut, so each is served at it and walks on out of the frame (lead 175358 item 8) */ // v1.2: they walk on through the door and out of sight behind the wall, so nobody stands in the doorway (pre-read 2155); v1.1 (visuals 200912): the last metres run across the frame, not into the lens, so nobody stacks behind anyone at the door
    const start = [d.x + 16, 0, d.z + 2.7];
    // v1.0 (17:10Z, pre-read E2 check 4): the same even beat as E1, so E1's last frame and this first frame carry the same line
    // v1.5 (pre-read 0020 E2 faults 1 and 2): E1's two flows replayed, every arrival shifted by E1's length, so this first frame
    // holds E1's last frame's walkers in the same places. E1's length comes from timing.json; E1's glow (file 2 starts) is
    // 7189 ms into E1 on TIMING v8 (pre-read 0020: glow cue 6989 ms = "headcount" - 200).
    // ruling 138 (b): E.TFILE (_e/lib.js) is ?timing=<file> in a version render, timing.json otherwise
    let D1 = 12533; try { const x = new XMLHttpRequest(); x.open("GET", E.TFILE || "../timing.json", false); x.send(); const sh = JSON.parse(x.responseText).frames ? null : null; const tj = JSON.parse(x.responseText); const f = (tj.shots || []).find((q) => q.id === "E1"); if (f) D1 = Math.round(f.dur * 1000); } catch (e) {}
    // v2-shots-f (ruling 124 a; v2-visuals 080946 E2): E1's two ranks, replayed on E1's clock shifted by E1's length, so this
    // first frame holds E1's last frame's walkers. E1's glow (rank B's start) is read from timing.json, not hard-set.
    let tB1 = 7189; try { const x = new XMLHttpRequest(); x.open("GET", E.TFILE || "../timing.json", false); x.send(); const tj = JSON.parse(x.responseText);
      const e1 = (tj.shots || []).find((q) => q.id === "E1"), w = ((tj.rows || []).find((q) => q.id === "E1.1") || { words: [] }).words.find((q) => /^headcount/i.test(q.w));
      if (e1 && w) tB1 = Math.round((w.start - e1.start) * 1000) - 200; } catch (e) {}
    window.SF.endLine(k, d, { shift: D1, tB: tB1 - 300 });
    k.breathe();   // VL 15.89 b
    const r = k.row("E2.1"), tUnder = E.at(k, "E2.1", "It's the era");
    // the one line in its setting, then "It's the era of the underdog." at half its size, both on clear page (rulings 66, 67)
    // ruling 137 item 6 (COS 104800): his line, "Stay small, stay lean, and reach more people.", broken after "lean," in the same block
    if (0) k.ui.text("one", r.start - 150, tUnder + 200, /* ruling 118: gives way on "It's" over 300 ms */ '<div style="font-family:\'Fredoka\';font-weight:600;font-size:84px;line-height:100px;color:#111418;text-align:center;width:1500px">Stay small, stay lean,<br>and reach more people.</div>', { x: 210, y: 130 });
    // ruling 118: "It's the era of the underdog." alone in the same block, 84 px, ink, whole before "underdog", held to the cut
    if (0) k.ui.text("under", tUnder + 150, null, '<div style="font-family:\'Fredoka\';font-weight:600;font-size:84px;line-height:100px;color:#111418;text-align:center;width:1500px">It’s the era of the underdog.</div>', { x: 210, y: 180 });   // ruling 124 f: the curly apostrophe on screen
    // opens on E1's last frame and holds (no move under the type)
    k.cam.keys([{ t: 0, view: SA.pose([d.x + 2.8, 3.4, d.z + 0.6], 230, 2.15, -12, -9) }, { t: D + 1, hold: true }]);
    return s;
  },
});
