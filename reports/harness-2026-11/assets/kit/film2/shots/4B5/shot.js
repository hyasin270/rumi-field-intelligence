// 4B5 · S · v2-shots-d. "Before we trust a judge, we test it against people's marks. Then its bar is enforced. Work under it goes back to
// be revised. / In one region, about nineteen lesson plans in twenty cleared it."
// Two loops, both seen (ruling 29). The bar on the back wall on the judge's side (VL 15.20): a pass goes over it into the warm slot; a
// fail stops under it and goes back through the hatch to its maker. In the rest after 4B5.2 the judge's reason goes into the book.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_d/lib.js", false); x.send(); (0, eval)(x.responseText); })();
FILM.shot({
  id: "4B5", type: "S", row: "4B5", dur: 17570,
  setup(k) {
    const S = window.SD, B = S.B3, D = k.dur, y = -9.6, tw = FILM.tw;
    const R1 = S.r(k, "4B5.1", { start: 300, end: 10430 }), R2 = S.r(k, "4B5.2", { start: 10930, end: 15830 });
    const f1 = (f) => R1.start + f * (R1.end - R1.start);
    const tThen = S.w(k, "4B5.1", "then", f1(0.46)), tEnf = S.w(k, "4B5.1", "enforced", f1(0.56)), tWork = S.w(k, "4B5.1", "work", f1(0.62)), tBack = S.w(k, "4B5.1", "back", f1(0.8));
    const W = S.world(k, { judge: -1e9 }); S.hide(k, W.parts.bar); S.hide(k, W.parts.judge);
    const C = S.crowd1(k, W, { override: S.judgeFile(W, { n: 0 }), clear: S.judgeClear, avoid: S.B3avoid });   // the one file at the booth (v2-visuals 145700 item 4)
    const desk = [B.deskTop[0] + 0.05, B.deskTop[1] + 0.02, B.hatchZ + 0.15], folderAt = [B.deskTop[0], B.deskTop[1], B.hatchZ - 0.4];
    const bh = [B.wallX + 0.15, y + 0.56, B.hatchZ], maker = [B.head[0] - 0.1, y + 0.75, B.hatchZ];
    const over = [B.bar[0], B.bar[1] + 0.35, -5.3], into = [B.slotIn[0], B.slotIn[1], -5.75], under = [B.under[0], B.under[1], -5.3];
    const passes = [], refuses = [], shut = [];
    const deep = [into[0], into[1], into[2] - 0.25];
    let nPile = 0; const onBar = (n) => [B.bar[0] - 0.65 + (n % 6) * 0.26 + ((n * 7) % 5) * 0.02, B.bar[1] + 0.08 + Math.floor(n / 6) * 0.014, -5.5 + ((n * 3) % 4) * 0.02];   // a wide pile, too many pages to count (v2-lead 200402 note 2)   // the cleared pages' pile on top of the bar, full strength, to the cut
    const goOut = (p, t0) => { const n = nPile++; p.fly(t0, 750, desk, onBar(n), { arc: 0.35 }); passes.push(t0 + 550); };   // one low arc over the bar onto the pile (pre-read 2120)   // one arc over the bar onto the pile, never hanging above it (pre-read 2055)
    // ruling 107 c: the stopped page goes back to its maker, comes again through the hatch, and clears
    // pre-read 2345: from the hatch it eases into the maker's reaching hand, and leaves again from the hand into the hatch (no jump)
    const bhP = [bh[0] + 0.15, y + 0.56, bh[2]], /* pre-read 0618: the turn to the lens laid the page across the eye; back to the 0605 staging, offered to v2-visuals with the staging question */ bhHand = [bhP[0], bhP[1] + 0.07, bhP[2]];   /* pre-read 0545: the page waits where the hand will hold it (no drop or rise), at the height 0525 kept off the visor; the hand rests on top of it */   // pre-read 0415: the page comes out of the hatch to where the maker's hand can reach it
    // pre-read 0145: a page with no maker's hand comes out of the slot itself (it grows from inside the hatch), never from the makers' side
    const inSlot = [B.wallX - 0.03, y + 0.56, bh[2]];
    // pre-read 0020: into the reaching hand at the hatch, back to the body as the arm comes in, into the hand again as it reaches, and from the hand into the hatch
    /* VL 15.85 (v2-visuals 075430 item 2, option B): the refused page goes back through the hatch on its own and lies on the maker's tray,
       flat, never above the opening (VL 15.82); the maker leans to it (a body act, no arm); after the pause the same page slides back in
       through the hatch and clears. No hand holds a page at the hatch, so nothing carried crosses the visor (PRE_SIGN v1.4 check 7). */
    const trayP = [B.tray[0] - 0.13, y + 0.47, B.tray[2] + 0.08];   /* pre-read 0850: at -0.05/-0.12 its far end lay on the visor's lower corner f319 to f358; to the tray's left and near side, clear of the maker */   /* on the tray's top (y 0.43), clear of the strip pile */
    const goBack = (p, t0, mkA, tRe) => { p.fly(t0, 700, desk, under, { arc: 0.4 }).fly(t0 + 900, 1200, under, bhP, { arc: 0.08 })
      .fly(t0 + 2150, 500, bhP, trayP, { arc: 0, ease: "io" })   /* out of the hatch onto the tray, flat, 500 ms */
      .fly(tRe + 50, 550, trayP, [bh[0], y + 0.56, bh[2]], { arc: 0, ease: "io" })   /* the same page back into the hatch; pre-read 0850: it ended at bhP and the next move began 0.15 further in (57 px jump) */
      .fly(tRe + 600, 300, [bh[0], y + 0.56, bh[2]], desk, { arc: 0, ease: "lin" }); goOut(p, tRe + 1250);
      refuses.push(t0 + 700); shut.push([t0 + 1800, 0], [t0 + 2600, 1], [tRe - 300, 0], [tRe + 900, 1]); k.cue(t0 + 700, "stop"); k.cue(t0 + 750, "bounce"); k.cue(tRe + 1800, "pass"); };
    { const p1 = S.page(k, { scale: 1.5, show: tWork - 900, grow: true }); p1.fly(tWork - 900, 1, inSlot, inSlot, { arc: 0 }).fly(tWork - 850, 300, inSlot, desk, { arc: 0, ease: "lin" }); goOut(p1, tWork - 300); }   // it lands on the bar and stays (v2-visuals 203000)
    const mk = k.agent({ at: B.head, face: -Math.PI / 2 + 0.7, name: "maker" });
    // pre-read 2345 (join from 4B4): the desk as 4B4 leaves it, 4B2's marked page with its dots, page one and page two
    { const od = [B.deskTop[0], B.deskTop[1] + 0.02, B.hatchZ + 0.15]; S.page(k, { at: od, show: 0, scale: 1.3 }); S.page(k, { at: [od[0], od[1] + 0.02, od[2]], show: 0, scale: 1.3 }); S.page(k, { at: [od[0] + 0.03, od[1] + 0.04, od[2] - 0.03], show: 0, scale: 1.3 });
      for (let d = 0; d < 4; d++) { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.01, 20), KIT.parts.mat(d < 3 ? "coral" : "grey")); m.position.set(od[0] - 0.15 + d * 0.1, od[1] + 0.03, od[2] + 0.12); k.scene.add(m); } }
    /* ruling 153 (word map): in his read "goes back" comes 9 s after "work"; the refused page is timed from "back" (its flight back through the hatch starts on it, as in v10), so the loop shows the words as he says them. In v10 the two times are 10 ms apart and tW2 = tWork */
    const tBackW = S.w(k, "4B5.1", "back", tWork + 1810), tW2 = (tBackW - 1800 - tWork > 500) ? tBackW - 1800 : tWork;
    const tRe = tW2 + (D < 14000 ? 4200 : 5100);   /* ai_fast-4c (ruling 165 b): the page rests on the tray 0.9 s, not 1.8 s, so it passes about 1 s before the cut; v10 and op (17.9 s, 48.7 s) keep 5100 */ { const p2 = S.page(k, { scale: 1.5, show: tW2 + 150, red: [tW2 + 1400, tW2 + 2300] }); p2.fly(tW2 + 150, 1, [bh[0], y + 0.56, bh[2]], [bh[0], y + 0.56, bh[2]], { arc: 0 }).fly(tW2 + 200, 300, [bh[0], y + 0.56, bh[2]], desk, { arc: 0, ease: "lin" }); goBack(p2, tW2 + 700, mk, tRe); }   // through the hatch, like every page (VL 15.82)
    for (let i = 0; i < 13; i++) { const t0 = R2.start + 500 + i * 330; if (t0 > tRe + 300 && t0 < tRe + 2100) continue; /* pre-read 0850: the returned page goes through alone, so it is seen to come again */ const p = S.page(k, { scale: 1.5, show: t0 - 600, grow: true }); p.fly(t0 - 600, 1, inSlot, inSlot, { arc: 0 }).fly(t0 - 550, 300, inSlot, desk, { arc: 0, ease: "lin" }); goOut(p, t0); }   // each comes through the hatch (VL 15.82), lies on the desk, then clears   // ruling 55: the one stop is in 4B5.1, on "goes back"
    const J = S.judgeRoom(k, { barAt: tThen + 100, pass: passes.filter((x, i) => i < 2 || i % 4 === 0), refuse: refuses, shutter: shut, strips: [], pile0: 3 });
    k.cue(tThen + 100, "install");
    // the maker at the head of the queue takes the page back, slumps, turns to redo it
    // pre-read 2345: one arm move at a time, each reach 700 ms (the kit lets go over 0.8 of it), the slump between them
    // pre-read 0400: three chained reaches, each starting where the last left the arm (S.reachUp): take the page at the hatch, draw it
    // back to the body above the tray (the work comes back), and put it through again. No slump (an act takes the arms in one frame).
    /* VL 15.85: the maker stays at the head of the file, already facing the tray, and leans to the page as it lands (no arm),
       holds, and straightens before the page slides back in */
    const tLandT = tW2 + 700 + 2650;
    mk.lean(tLandT - 150, 500, [0, 0.07]); S.leanStep(mk, tRe - 650, 450, [0, 0.07], [0, 0]);   /* v2-shots-b 082751: a second kit lean snaps; stepped every frame */
    k.ui.pin(tEnf - 200, { text: "the bar", at: [B.bar[0] + 0.7, B.bar[1], -5.5], side: "right", dx: 360, dy: -160, t1: R1.end + 800 });
    // pre-read 2235: the kit's pin changes in 133 to 200 ms; a 400 ms ramp over its label, leader and dot (in from its start, out to R1.end + 300)
    { const els = ["pin", "lead", "dot"].map((c) => { const a = document.querySelectorAll("#ui ." + c.split(" ")[0]); return a[a.length - 1]; }).filter(Boolean);
      FILM._post.push((t) => { const v = tw(t, tEnf - 300, tEnf + 300, "io") * (1 - tw(t, R1.end - 300, R1.end + 300, "io")); els.forEach((e) => { e.style.filter = `opacity(${v})`; }); }); }   // ruling 107 c: no 85
    // ruling 55: the count on "nineteen", whole for 3 s, on its own white chip, touching neither the bar, the way out nor a label
    const tWhole = S.w(k, "4B5.2", "nineteen", R2.start + 1900) + 800, tN = tWhole - 800;   // ruling 69 a: whole for 3 s from about 13.7 s
    const chip = k.ui.text("count", tN - 300, D + 600, '<div class="sd-count"><div class="n">1,953</div><div class="u">of 2,038 lesson plans · one region</div></div>', { x: 1150, y: 64 });   // ruling 107 c: one count, whole on "nineteen", to the cut
    const cst = document.createElement("style"); cst.textContent = '.sd-count{background:#fff;border-radius:26px;box-shadow:0 10px 30px rgba(17,20,24,.12);padding:22px 40px 26px}.sd-count .r{font:500 34px "Poppins";color:#3C424B}.sd-count .n{font:600 112px "Poppins";color:#001F3F;line-height:1.05;font-variant-numeric:tabular-nums}.sd-count .u{font:500 36px "Poppins";color:#111418}'; document.head.appendChild(cst);
    // pre-read 2235: the card comes up over 400 ms and is whole on "nineteen"
    FILM._post.push((t) => { const e = document.querySelector(".sd-count"); if (e) e.style.filter = `opacity(${tw(t, tN - 300, tN + 300, "io")})`; });
    // pre-read 1634 check 2: the figure lands whole, never rolling through wrong numbers, and the card sits inside the safe line
    k.cue(tN, "number");
    const judge = k.agent({ at: B.judge, face: Math.PI / 2 - 0.7, name: "judge" }); judge.reach(tWork - 700, 300, desk, { hand: "L", hold: 1200 });   // a hand on the work, no snap
    // test against people's marks (ruling 29): three pairs; pairs one and three match and tick; pair two is one dot apart, no tick
    // v2-visuals 200243 items 1 and 2, ruling 113, v2-lead 200402 note 1: the test panel is P3c's panel (one idea, one picture): rows
    // "people" and "the judge", five pairs, a green box round each pair that agrees (four of five); no count. Top of the wall, x 300 to 1710
    { const tP0 = R1.start + 200, tP1 = Math.max(5000, S.w(k, "4B5.1", "marks", 3800) + 600), tBox = R1.start + 900;
      const box = document.createElement("div"); box.className = "abs"; box.style.cssText = "left:0;top:0;width:1920px;height:1080px"; document.getElementById("ui").appendChild(box);
      const marks = [[3, 3], [2, 2], [4, 4], [3, 2], [3, 3]], cards = [];
      const panel = document.createElement("div"); panel.style.cssText = "position:absolute;left:300px;top:75px;width:1410px;height:240px;background:#fff;border-radius:26px;box-shadow:0 18px 50px rgba(60,40,10,.18);opacity:0"; box.appendChild(panel);
      const lab = (txt, y) => { const d = document.createElement("div"); d.textContent = txt; d.style.cssText = `position:absolute;left:30px;top:${y}px;font:500 36px/1 'Poppins',sans-serif;color:#3C424B`; panel.appendChild(d); };
      lab("people", 54); lab("the judge", 142);
      const dots = (n, col) => [0, 1, 2, 3].map((j) => `<i style="display:inline-block;width:38px;height:38px;border-radius:50%;margin:0 5px;background:${j < n ? col : "transparent"};border:5px solid ${col};box-sizing:border-box"></i>`).join("");
      marks.forEach(([pm, mm], i) => { const c = document.createElement("div"); c.style.cssText = `position:absolute;left:${210 + i * 236}px;top:24px;width:212px;height:190px;border-radius:20px;border:5px solid #fff;box-sizing:border-box;padding:22px 0 0 8px`;
        c.innerHTML = `<div>${dots(pm, "#34507A")}</div><div style="margin-top:38px">${dots(mm, "#F06E42")}</div>`; panel.appendChild(c); cards.push({ c, agree: pm === mm, i }); });
      FILM._post.push((t) => { const v = tw(t, tP0, tP0 + 500, "io") * (1 - tw(t, tP1, tP1 + 400, "io")); panel.style.opacity = v; panel.style.transform = `translateY(${24 * (1 - v)}px)`;
        cards.forEach((q) => { const g = q.agree ? tw(t, tBox + q.i * 160, tBox + q.i * 160 + 500, "lin") : 0; const mix = (a, b) => `rgb(${a.map((x, j) => Math.round(x + (b[j] - x) * g)).join(",")})`; q.c.style.borderColor = mix([255, 255, 255], [11, 122, 34]); q.c.style.background = mix([255, 255, 255], [238, 247, 238]); }); });
      cards.forEach((q) => { if (q.agree) k.cue(tBox + q.i * 160, "tick", { soft: true }); }); }
    // loop 2 (the rest): the judge's reason flies into the book as a new line, the same move as 4A3
    const F = S.folder(k, { at: folderAt, h: 0.16 }); const tR = R2.end + 200;
    // ruling 107 c: nothing goes to the skill folder (no row says it)
    locator(k, { room: "judge" });   // VL 15.76
    k.cam.keys([{ t: 0, view: k.cam.on(S.B3V.look, S.B3V) }, { t: D, hold: true, drift: false }]);
    return { J };
  },
});
