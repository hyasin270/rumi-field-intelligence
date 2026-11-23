// 4.0 · W · v2-shots-d. "Fourth question. Does the work sound like us, and is it good enough?"
// Stage opener (VL 14.2): the question lights in the list framing for 2 s, the list leaves in 250 ms, then the camera pushes to the gag:
// the mountain of finished pages beside the pavilion's east desk, still growing, ending on the two-floor frame where 4A1 plays.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_d/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "4.0", type: "W", row: "4.0", dur: 6000,
  setup(k) {
    const S = window.SD, P = S.P, D = k.dur;
    const W = S.world(k);   // 141605 item 3: the film's shared building (S1), as stage 3 leaves it
    const C = S.crowd1(k, W);   // as 3C2 leaves them; the skills room keeps its 50 while in frame (ruling 103, VL 15.71)
    /* ruling 134 / 130 a (v2-check 095430: the crowd turned at the cut): the unfitted rooms mill on the shot clock, so the crowd is read at 3C2's clock: f000 is 3C2's f000104 */
    { const base = C.at, T3C2 = 104000 / 30; C.at = (i, t) => base(i, t + T3C2); }
    const tQ = S.w(k, "4.0.1", "fourth", 300), tDoes = S.w(k, "4.0.1", "does", 1340), tEnough = S.w(k, "4.0.1", "enough", 4440);
    const tList = tQ + 2000;
    // v2-visuals 120529 item 8: the list is whole from frame 0 (3C2's last frame) and "beads" and "hooks" are docked left (VL 15.56)
    { const qb = k.ui.questions(-700, { active: 4, ticked: [1, 2, 3], t1: tList + 250, writeAt: { 1: -1e6, 2: -1e6, 3: -1e6, 4: -1e6, 5: -1e6 } }); questionsEase(qb, { active: 4, activeAt: tQ, ms: 300 }); }   // the ring fills over 300 ms on "Fourth"
    S.fadeDocks(S.docksWest(k, -1e6, tList + 250), tList + 250, 300);   // they leave with the list, over 300 ms (pre-read 2030)
    // the mountain: pages rise up the slot columns from the rooms below and pile beside the east desk
    // the pile still gains pages after the camera lands (ruling 98)
    /* ruling 134: no stack at f000 (3C2 has none). From 3.0 s pages drop onto the stack in bundles of five, one every 150 ms, each
       landing from 0.5 m above (as 1B2's blocks land); 40 by 4.05 s, before "enough?"; the signed tail (40 to 46 over 4.9 to
       5.7 s) keeps the close frame from 5.2 s as signed */
    const M = S.mountain(k, P.mountain, { n: 46, grows: [{ t0: -1e9, dur: 0, c0: 0, c1: 0 }] });
    const tD0 = Math.min(3000, tEnough - 1250), land = (i) => i < 40 ? tD0 + Math.floor(i / 5) * 150 : 4900 + (i - 40) * 160;
    S.track(k, (t) => { M.sheets.forEach((sh, i) => { const tl = land(i), on = t >= tl - 150; sh.visible = on; if (!on) return;
      sh.position.y = 0.025 + i * 0.052 + 0.5 * (1 - FILM.tw(t, tl - 150, tl, "in")); }); });
    S.slots(k);
    // 141605: no loose pages; the pile grows on its own top (the eighteen pages that flew up the slots are gone)
    k.cue(tD0, "pages"); k.cue(tEnough, "pages");
    const spk40 = W.people[2];   /* ruling 134: the kit's stand pose at f000, as 3C2 leaves the people */   // pre-read 2115: nobody walks in the pavilion; the people move across the cut to 4A1 (ruling 103)
    // the speaker picks up the page 4A1 opens on: it grows in the hands over 300 ms once the walk is done (pre-read 1740, join to 4A1)
    /* ruling 134, option A (board 100603): on "enough?" the last page comes down in front of the speaker and the hands rise into
       the carry pose to take it at the chest (450 ms), no turn, no walk; the blank page 4A1 opens on */
    { const hw = [S.SPK[0] + 0.33 * Math.sin(0.45), 0.86, S.SPK[2] + 0.33 * Math.cos(0.45)], tH = tEnough, tIn = tEnough + 450;
      spk40.pose(tH, "carry", { blend: 450 });
      S.page(k, { show: tH - 50, lines: 5 }).fly(tH - 50, 500, [hw[0] - 0.7, hw[1] + 0.25, hw[2] + 0.6], hw, { arc: 0, ease: "lin", spin: 0.5 })   /* self-check 1326: at z + 0.2 it passed behind the torso (f131 to f134); from the front left, towards the lens. self-check 1322: from 0.6 m up it crossed the head as the camera pushed (f134 to f136); from shoulder height the path stays under the chin. pre-read 1310: the fall read as an edge-on sliver landing on the desk line, with 49 and 54 px steps; now one straight diagonal from up and to the left, 0.38 m clear of the head at head height, about 22 px a frame, tilted towards the lens mid-flight so it reads as a page, flat again as the hands take it */.hold(tIn, 1e9, spk40, [0, 0.86, 0.33], 0.6, 250).writeLines(1e9, 1); }   /* pre-read 1050: falling from straight above it crossed the head (f136 to f138); now from the speaker's left (self-check 1058: from the right it crossed the person behind the desk), below the head; the turn to the held tilt over 250 ms (38 px in one frame at 120) */   // the blank page the job starts on, in the hands from frame 0   // blank, as 4A1 opens k.agent({ at: S.NEW, face: 0.35, name: "newcomer" });
    S.folder(k, { at: P.b1Folder, h: 0.04, show: 4700 });   /* pre-read 1050: 3C2's f000104 has no folder there; it comes on once its room has left the frame (about f136) */   // 141605 item 3: the book is on the table as 4A1 opens
    // 141605 item 3: question 4 stays a ring (as 3C2 leaves it) until "Fourth"; this runs after the layer's own update

    const gag = k.cam.on([3.2, 1.15, -2.3], { size: "close", height: 1.37, px: 400, pitch: -8, focus: [3.6, 1.2, -2.8] });
    locator(k, { room: "pav", from: Math.min(D - 400, tList + 2950) });   // VL 15.76: the map once the push lands in the pavilion
    k.cam.keys([{ t: 0, view: "W-list" }, { t: tList + 250, hold: true }, { t: Math.min(D - 400, tList + 2950), view: gag, ease: "io" }, { t: D, hold: true }]);
    // the push ends on the gag in the pavilion (the pile, still growing, and the speaker); 4A1 cuts to the link frame. With the film's
    // shared crowd the skills room below is full, and only a cut may clear it (as stage 1 does), so the push no longer lands on B1
    return { W, C };
  },
});
