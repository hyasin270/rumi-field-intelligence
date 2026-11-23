// 5Db · S, the agents' floor · cut by v2-shots-e from shots/5D/shot.js v0.5 lines 50-104 (ruling 99, TIMING v6);
// owner from the handover: v2-shots-f. Rows 5D.2, 5D.3. Hard cut in from 5Da, hard cut out to 5Dc.
// A clock card "About 25 minutes before"; no call arrives; the note taker gets up by itself. Four sources light in turn on
// their words (meetings, team chat, Notion, product data); one yellow field lifts from each onto the brief page. At "So
// it walks in" it takes the page and leaves. Small line under the page: "Reads only meetings marked public".
// In v0.5 this part ran from tB = r2.start - 150 to tC = r4.start - 150; here tB = 0 and tC = the shot's end.
// v2-shots-f (16:35Z on): one page (the panel goes into the hand, then the page shows); the page at the hand's side, below
// the visor, facing us; each yellow field moves inside the page only; the note taker leaves along the open front, facing us.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_e/lib.js", false); x.send(); (0, eval)(x.responseText); })();
// VL 15.76: the kit's locator snippet (v2-kit 18:2xZ), loaded as every snippet
(function(){if(window.locator)return;const x=new XMLHttpRequest();x.open("GET","snippets/locator.js",false);x.send();(0,eval)(x.responseText+";window.locator=locator;window.roomRing=roomRing;");})();
FILM.shot({
  id: "5Db", type: "S", row: "5Db", dur: 23333, screens: ["brief-page"],
  setup(k) {
    const E = window.SE, D = k.dur, T = THREE, P = KIT.parts, tw = FILM.tw;
    const Wb = E.world(k, E.ALL);
    const r3 = k.row("5D.3") || (E.FB["5D.3"] = { start: 11267, end: 18467, dur: 7200 });
    if (!k.row("5D.2")) E.FB["5D.2"] = { start: 300, end: 10767, dur: 10467 };
    const tB = 0, tC = D;
    const C = E.crowd(k, Wb, { fitted: E.ALL, sleep: [-5000, null], work: false,
      // the sleepers stay (VL 15.71 item 2 names them); clear only round the note taker and along its exit, for the whole
      // shot, so nobody slides at frame 0 (pre-read 5Db_1804, f000 to f004)
      clear: [{ room: "store", x0: 1.5, x1: 3.3, z0: -3.6 }, { room: "store", x0: 0.3, x1: 3.3, z0: -1.9 },
        // pre-read 5Db_2100 check 5: the sleeper at the frame's left edge (x 0 to 135) for the whole shot; the two front slots west of the box
        { room: "store", x0: 0.3, x1: 1.8 }, { room: "store", x0: 1.5, x1: 2.2, z0: -4.0 }] });   // 21:2xZ self-check: the frame's left edge is about x 1.6 at the note taker's depth, so the first two columns go at every depth
    E.pale(k, C, -1000, 10, null);
    const ys = E.roomY("store"), cs = E.roomX("store");
    const nt = k.agent({ at: [cs - 0.6, ys, -2.6], face: 0.35, name: "notetaker" });   // 0.1 m east: at cs - 0.7 its box crossed action safe x 96 from 4 s (K 40 lint C9, 01:4xZ)
    const tUp = E.at(k, "5D.2", "no longer");
    // asleep as a droop with closed eyes, eased upright on "no longer" (the sleep clip switched off in one frame: 41 px, f035)
    nt.lean(-1e9, 1, [0, 0.15]).fx(tUp + 100, "spark", { size: 64 });
    // the kit applies only the newest lean, added to the pose's own, so a second lean(tUp, 450, [0, 0]) dropped 0.15 to 0 in one
    // frame (pre-reads 5Db_2100, 5Db_2105: f035 to f036). Stepped every frame instead, io over 450 ms.
    for (let ms = 0; ms <= 450; ms += 33) nt.lean(tUp + ms, 0, [0, 0.15 * (1 - FILM.E.io(Math.min(1, ms / 450)))]);
    nt.lean(tUp + 460, 0, [0, 0]);
    E.closedEyes(k, nt, [[-1e9, tUp + 150]]);
    const ui = document.getElementById("ui"), F = "font-family:'Poppins';";
    const el = (html, css) => { const d = document.createElement("div"); d.style.cssText = "position:absolute;left:0;top:0;visibility:hidden;" + css; d.innerHTML = html; ui.appendChild(d); return d; };
    const chipCss = "left:260px;top:60px;background:#fff;border-radius:16px;padding:10px 18px;box-shadow:0 8px 20px rgba(17,20,24,.12);" + F + "font-size:36px;font-weight:600;color:#111418;max-width:520px";
    const clock = el('<span style="display:inline-flex;align-items:center;gap:12px"><svg width="40" height="40" viewBox="-12 -12 24 24"><circle r="10.5" fill="none" stroke="#111418" stroke-width="2"/><path d="M0 0V-6M0 0L4 3" stroke="#111418" stroke-width="2" stroke-linecap="round"/></svg>About 25 minutes before</span>', chipCss);
    const publicChip = el("Reads only meetings<br>marked public", chipCss + ";line-height:44px");
    // the four sources: small copies of what the viewer has seen, in a row above the panel, in the spoken order
    const TILE = [
      '<svg width="150" height="80" viewBox="0 0 150 80"><rect x="45" y="6" width="60" height="14" rx="4" fill="#E6DFD2"/><rect x="25" y="28" width="100" height="18" rx="4" fill="#E6DFD2"/><rect x="5" y="54" width="140" height="22" rx="4" fill="#E6DFD2"/></svg>',
      '<svg width="150" height="80" viewBox="0 0 150 80"><rect x="0" y="0" width="34" height="80" fill="#4A154B" opacity=".85"/><rect x="44" y="8" width="96" height="12" rx="4" fill="#E6DFD2"/><rect x="44" y="30" width="80" height="12" rx="4" fill="#E6DFD2"/><rect x="44" y="52" width="90" height="12" rx="4" fill="#E6DFD2"/></svg>',
      '<svg width="150" height="80" viewBox="0 0 150 80"><rect x="44" y="0" width="90" height="74" rx="6" fill="#fff" stroke="#D9D2C4" stroke-width="2"/><rect x="22" y="6" width="90" height="74" rx="6" fill="#fff" stroke="#D9D2C4" stroke-width="2"/><rect x="34" y="16" width="60" height="10" rx="3" fill="#111418"/><rect x="34" y="36" width="66" height="8" rx="3" fill="#E6DFD2"/><rect x="34" y="52" width="54" height="8" rx="3" fill="#E6DFD2"/><rect x="34" y="66" width="60" height="6" rx="3" fill="#E6DFD2"/></svg>',
      '<svg width="150" height="80" viewBox="0 0 150 80"><g fill="#E6DFD2">' + [0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => `<rect x="${6 + c * 36}" y="${6 + r * 25}" width="32" height="20" rx="3"/>`).join("")).join("") + "</g></svg>"];
    const tileX = [690, 920, 1150, 1380];
    const tiles = TILE.map((svg, i) => el(`<div style="width:200px;height:112px;box-sizing:border-box;border-radius:16px;background:#fff;box-shadow:0 8px 20px rgba(17,20,24,.12);display:flex;align-items:center;justify-content:center;border:4px solid transparent">${svg}</div>`, `left:${tileX[i]}px;top:60px`));
    const srcT = ["meetings", "chat", "Notion", "product"].map((w) => E.at(k, "5D.2", w));
    const tWalk = E.at(k, "5D.3", "walks");
    // ruling 107 h: the privacy line lights on "marked public" (script v1.6 says it in 5D.3); before TIMING v8 has that word, the row start
    const tPub = (k.word("5D.3", "marked") ?? (r3.start + 100)) - 100;
    // the brief in the panel's home (v2-screens' brief-page); each point lands as its yellow field arrives from its tile
    const PANEL = { x: 690, y: 196, w: 1150, h: 647 };
    const bT0 = srcT[0] - 300;
    // one yellow at a time (5Db_1804, f232 to f236): each travelling field leaves its tile on the word, or once the field before
    // it has cooled on the page (brief-page holds a landed field 600 ms and cools it in 250 ms), and the point lands with it
    const tS = []; srcT.forEach((ts, i) => tS.push(i ? Math.max(ts, tS[i - 1] + 500 + 870) : ts));
    const bev = { page: 0, p1: tS[0] + 500 - bT0, p2: tS[1] + 500 - bT0, p3: tS[2] + 500 - bT0, p4: tS[3] + 500 - bT0, foot: srcT[3] + 1200 - bT0, hl: r3.start - bT0, push: 1e9 };
    // the page in the note taker's hands (pre-read 5Db_2100: two pages, f586 to f624). One page: the kit's carry holds it at the
    // chest, in front of the carry pose's own card, so the brief is the only page seen. 0.26 by 0.34 m, slab white, four bars,
    // the first a yellow strip; it fades in over 200 ms as the panel lands in it
    const pg = new T.Group(); k.scene.add(pg); const pgMats = [];
    const pm = (m) => { m = m.clone(); m.transparent = true; pgMats.push(m); return m; };
    P.add(pg, P.rbox(0.26, 0.34, 0.025, pm(P.mat("white")), 0.02, 0.01), 0, 0, 0);
    [0, 1, 2, 3].forEach((r) => P.add(pg, P.rbox(0.18, 0.03, 0.01, pm(r ? P.mat("grey") : new T.MeshBasicMaterial({ color: 0xffd666 })), 0.008, 0.004), 0, 0.1 - r * 0.065, 0.016));
    // one hand holds the page by its inner edge, down at the body's side (pre-read 5Db_2135: two hands at the chest left the page
    // 100 px ahead of the hands on the walk, and the pose change moved the arms in one frame, f574). No pose change: the arm keeps
    // its idle swing and the page goes with the hand, every frame.
    const tPg = tWalk - 120;
    const pgAt = () => { const s = nt.spr; s.updateMatrixWorld(true); const hl = s.worldToLocal(nt.hand("L").clone());   // "L" is the arm on screen right as it faces us (stills 21:4xZ: "R" hid the page behind the body)
      return { p: s.localToWorld(new T.Vector3(hl.x + 0.11, hl.y - 0.05, hl.z + 0.05)), yaw: s.rotation.y }; };
    k.each((t) => { const a0 = pgAt(); pg.position.copy(a0.p); pg.rotation.set(-0.05, a0.yaw, 0);
      pg.visible = t >= tPg && t < tC; if (!pg.visible) return; const a = tw(t, tPg, tPg + 200); pgMats.forEach((m) => { m.opacity = a; }); });
    const bp = k.screen("brief-page", { t0: bT0, t1: tWalk + 500, to: PANEL, events: bev });
    bp.pushIn(bT0, 450, { from: () => { const a = KIT.render.project(new T.Vector3(cs - 0.7, ys + 0.6, -2.2)); return { x: a.x - 40, y: a.y - 50, w: 80, h: 100 }; } });
    // into the page at the hands (pre-read 5Db_2100: the target was read from the page before it was placed, so it jumped to the top left, f578)
    bp.pushOut(tWalk - 250, 250, { to: () => { const w = pgAt().p; const a = KIT.render.project(w); return { x: a.x - 26, y: a.y - 34, w: 52, h: 68 }; } });
    E.hardHide(bp);
    const field = el('<div style="width:1000px;height:56px;background:rgba(255,214,102,0.28);border:3px solid #FFD666;border-radius:10px;box-sizing:border-box"></div>', "");
    // ruling 123 (v2-lead 080625; v2-visuals 080334, VL 13.4 f389-f577): on "every point names its source" the four "Source:"
    // chips light one after another in the brief's order, 300 ms each, in the source tiles' green (the tiles lit the same way on
    // their words in 5D.2), and stay lit while the page is up; the yellow field stays on point 1. The chips are brief-page's
    // (v2-screens); this shot only styles them after the screen has drawn (its _post runs before this one), every frame from t.
    // VL 15.89 b (v2-visuals 082838): every render from now calls the kit's breath with its defaults
    k.breathe();
    // ruling 127 (v2-lead 084458): chip 1 on "every", chip 4 on "source", the two between evenly spaced, read from the word times
    const tSrc = E.at(k, "5D.3", "every"), tSrc4 = E.at(k, "5D.3", "source"), gap = Math.max(300, (tSrc4 - tSrc) / 3);
    const chips = Array.from(bp.root.querySelectorAll(".br-pt .ch"));
    const mixC = (a, b, u) => a.map((v, i) => Math.round(v + (b[i] - v) * u));
    FILM._post.push((t) => {
      chips.forEach((c, i) => { const g = tw(t, tSrc + i * gap, tSrc + i * gap + 300, "io"), bg = mixC([238, 240, 242], [226, 242, 230], g);
        c.style.background = `rgb(${bg.join(",")})`; c.style.boxShadow = g > 0 ? `inset 0 0 0 5px rgba(11,122,34,${g.toFixed(3)})` : "none"; });
    });
    FILM._post.push((t) => {
      const inB = t >= tB && t < tC;
      clock.style.visibility = inB && t < srcT[0] - 900 ? "visible" : "hidden"; clock.style.opacity = tw(t, tB + 150, tB + 550) * (1 - tw(t, srcT[0] - 1150, srcT[0] - 900));
      publicChip.style.visibility = inB && t >= tPub ? "visible" : "hidden"; publicChip.style.opacity = tw(t, tPub, tPub + 400);
      tiles.forEach((d, i) => { d.style.visibility = inB && t >= srcT[0] - 900 && t < tWalk ? "visible" : "hidden"; d.style.opacity = tw(t, srcT[0] - 900 + i * 120, srcT[0] - 500 + i * 120);
        // one tile lit at a time, on its word to the next word, each change over 300 ms (5Db_1804: two lit together, one-frame edges)
        const tOff = Math.min(srcT[i] + 1400, i < 3 ? srcT[i + 1] : 1e9), g = tw(t, srcT[i], srcT[i] + 300) * (1 - tw(t, tOff - 300, tOff));
        d.firstChild.style.borderColor = `rgba(11,122,34,${g.toFixed(3)})`;
        d.style.opacity = String(+d.style.opacity * (1 - tw(t, tWalk - 550, tWalk - 250))); });   // the row fades before the walk (it vanished in one frame, f464)
      const li = tS.findIndex((ts) => t >= ts && t < ts + 1170);
      if (inB && li >= 0) { const u = tw(t, tS[li], tS[li] + 500, "io"), y0 = 206, y1 = 290 + li * 112, x0 = Math.max(tileX[li] + 100, 830) - 500, x1 = 793;   // starts inside the page's top edge, centred under its own lit tile (124618 item 5; 5Db_1804: fields 1 and 2 began under Notion)
        field.style.visibility = "visible"; field.style.opacity = 1 - tw(t, tS[li] + 480, tS[li] + 680); field.style.transform = `translate(${FILM.lerp(x0, x1, u)}px,${FILM.lerp(y0, y1, u)}px) scale(${FILM.lerp(0.25, 1, u)},1)`; }
      else field.style.visibility = "hidden";
    });
    srcT.forEach((ts) => k.cue(ts, "light"));
    // it leaves west along the open front of the floor (in front of the partition's end, z -0.25), facing us 40 degrees, and
    // walks out of the frame's left edge; never into a wall (ruling 99 item 6; 154832 item 2)
    nt.turn(tWalk - 100, 350, -0.87).walk(tWalk + 300, 2600, [[cs - 1.0, -1.3], [0.8, -0.3], [-1.6, -0.25]], { face: -0.87 });
    k.cue(tWalk, "page");
    // VL 15.76: the map for the whole close frame
    window.locator(k, { room: "store" });
    const store = E.R("store", 1.4, 0.7, -2.9);
    k.cam.keys([{ t: 0, view: k.cam.on(store, { size: "room", px: 270, focus: [cs - 0.7, ys + 0.6, -2.6] }) }, { t: D + 1, hold: true }]);
    return {};
  },
});
