// T3b · W · v2-shots-a. The 300 (gathered in front since T1a) file in at the door in the block's face; the ground line draws
// and the front drops: people above, the 300 below in six bare rooms, milling. The camera trucks to W-list, then the five
// questions write on. Pins "your people" and "the agents" in x 96 to 290 (VL 14.1). Row T3b.1 ("So what would you build, so
// that all of them can help? The same things a good organisation builds for any new colleague. It comes down to five questions.")
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_a/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "T3b", type: "W", row: "T3b", dur: 18000,
  setup(k) {
    k.breathe();   /* VL 15.89 b (v2-visuals 082838): every render from now breathes, so no held frame repeats for 2 s */
    const SA = window.SA, D = k.dur, r = SA.r(k, "T3b.1"), f = (i) => r.start + (r.end - r.start) * i / 29;
    const w = (word, i) => SA.w(k, "T3b.1", word, f(i));
    const W = k.set.building({ stage: 0, closed: true, ground: true });
    window.roomRing(k, W, "board", 0, 600);   /* coming out of T3a's board room (VL 15.76) */
    (function(){const x=new XMLHttpRequest();x.open("GET","snippets/fills_with_face.js",false);x.send();(0,eval)(x.responseText+";window.fillsWithFace=fillsWithFace;");})(); window.fillsWithFace(k, W);   // v2-kit 161851: no lamp shows through the closed face
    const c3 = k.row("T3c");
    /* ai_fast-4c (v2-shots-e 082615): T3c's crowd runs on t - D(T3c), so this shot's last frame meets it only when shift = D + D(T3c).
       v10 approximated that as T3c's row end + 3.5 s (T3c's tail after its row). FAST reads D(T3c) from the timing file; v10, ai, op as signed. */
    const durT3c = (() => { try { const x = new XMLHttpRequest(); x.open("GET", "../timing.json", false); x.send(); const sh = (JSON.parse(x.responseText).shots || []).find((q) => q.id === "T3c"); return sh ? sh.dur * 1000 : null; } catch (e) { return null; } })();
    const shift = (D < 12000 && durT3c) ? D + durT3c : (c3 ? c3.end + 3500 : D + 19230);
    const C = SA.roomsCrowd(k, W, shift);
    /* ruling 133, v2-visuals 095412: TIMING v10 cut T3b to 15.0 s, so T3c's row ends 3.0 s earlier in this shot's time and the shift
       above is 3.0 s smaller than when T3b was 18.0 s. The crowd's clock is held 3.0 s back until 3.0 s (f000 as signed, the T3a join),
       gains the 3.0 s over an eased ramp from 3.0 s to 13.0 s, and runs on the new clock from 13.0 s, so f449's crowd is the old f539's
       (T3c f000). Nothing else reads this clock */
    { const at1 = C.at; C.at = (i, t) => at1(i, t - 3000 * (1 - k.tw(t, 3000, Math.min(13000, D < 12000 ? D - 500 : 13000), "io"))); }   /* ai_fast-4c (v2-shots-e 082615): the ramp ends at D - 500 in fast, so the last frame's crowd is T3c's f000 */
    // ruling 103: no crowd is seen to enter a room; the 300 are inside when this shot opens (T1b to T3a sit between)
    const tBuild = w("build", 4), tHelp = w("help", 10), tCol = w("colleague", 21), tFive = w("five", 27);
    const tLine = Math.max(tBuild + 300, 2900);
    W.open(tLine + 700, 2100);
    // the dropped face keeps going, out of frame in 300 ms, instead of vanishing at the foot of the frame (153200 item 4)
    { const cv = W.parts.cover, t0 = tLine + 700, tEnd = t0 + 2100; k.each((t) => { if (t < t0) return; const u = k.tw(t, tEnd - 300, tEnd + 300, "in"); cv.visible = t < tEnd + 300; cv.position.y -= 8 * u; }); }   // no ground line: it read as a stray leader (v2-visuals 074103, 102700 item 2)   // the door goes with the face
    k.cue(tLine, "line"); k.cue(tLine + 700, "open");
    // (the six stay in their row from T1a; one walks to the glass and looks down on "colleague")
    (W.people || []).forEach((p, i) => p.at(0, [-3.0 + i * 1.2, 0, -1.05], 0));
    /* ai_fast-4c (rulings 165, 166), read on D: at 9.3 s the five questions wrote 8.1 to 10.1 s and T3c opens on all five.
       FAST: the truck ends before "It comes down to", the five write from "It" 330 ms apart, all whole by D - 500; v10, ai, op unchanged */
    const FAST = D < 12000, tIt = w("it", 23);
    const tTruck = FAST ? Math.min(Math.max(tLine + 3200, tFive - 1500), tIt - 1000) : Math.max(tLine + 3200, tFive - 1500);
    const tQ = FAST ? Math.min(tFive, tIt) : tFive, dQ = FAST ? Math.min(500, (D - 800 - tQ) / 4) : 500;
    // (the line and the two labels belong to T3c, on their own sentences: v2-visuals 104433 items 1 to 3, lead 104646)
    k.ui.questions(tQ, { show: [1, 2, 3, 4, 5], x: 1168, y: 300, writeAt: { 1: tQ, 2: tQ + dQ, 3: tQ + 2 * dQ, 4: tQ + 3 * dQ, 5: tQ + 4 * dQ } });   // ruling 80
    (W.people || []).forEach((p, i) => { for (let tt = 600 + i * 450, j = i; tt < D; tt += 2100 + 300 * (i % 3), j++) p.turn(tt, 700, (j % 2 ? 0.5 : -0.5) * (i % 2 ? 1 : -1)); });   /* the six keep working: eased turns, no pose snaps (pre-read T3b f319 to f536) */
    k.cam.keys([{ t: 0, view: "W-centre" }, { t: tTruck, hold: true }, { t: tTruck + 900, view: "W-list", ease: "io" }, { t: D, hold: true, drift: false }]);
    /* VL 15.89: the opening hold's drift eases in on a sine, so f018 to f088 measured frozen even with k.breathe(). Over the hold the
       same drift now runs linearly; it ends where the kit's drifted hold ends, so the truck to W-list starts with no pop */
    { const DR = window.CAMERA_RULES.drift, ev = k.cam.eval, p0 = ev(0);
      k.cam.eval = (t) => { const p = ev(t); if (t <= 0 || t >= tTruck) return p; const u = t / tTruck; const q = Object.assign({}, p, { dist: p0.dist * (1 - DR.push * u), yaw: p0.yaw + DR.yaw * u }); k.cam.current = q; return q; }; }   // ends exactly on W-list: T3c starts here
    return {};
  },
});
