// 5C · W to N · v2-shots-e (v1.1 17:10Z: ruling 104, the camera follows the notice; v1.0 16:55Z: ruling 87 b join, card clear, notice over the heads). The floor sleeps. Upstairs a person tags Rumi; a notice runs to the small lit box by the door
// (name card "a webhook"); the box never sleeps; a pulse runs down the west face and wakes one agent. On "A hook stops.
// A webhook wakes." the hooks room pulses, then the box; two small labels.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_e/lib.js", false); x.send(); (0, eval)(x.responseText); })();
(function(){const x=new XMLHttpRequest();x.open("GET","snippets/locator.js",false);x.send();(0,eval)(x.responseText+";window.locator=locator;window.roomRing=roomRing;");})(); // VL 15.76 map and ring
FILM.shot({
  id: "5C", type: "W", row: "5C", dur: 19767, screens: ["slack-quick"],
  setup(k) {
    const E = window.SE, D = k.dur, T = THREE;
    const fitted = Object.assign({}, E.ALL);
    const Wb = E.world(k, fitted);
    const tSleep = E.at(k, "5C.1", "should not"), tTag = E.at(k, "5C.1", "tags"), tNotice = E.at(k, "5C.1", "sends"), tName = E.after(k, "5C.1", "webhook");
    const tReach = E.at(k, "5C.2", "reaches"), tWake = E.at(k, "5C.2", "wakes one"), tHook = E.at(k, "5C.2", "A hook"), tWh = E.at(k, "5C.2", "A webhook");
    /* ruling 165 (fast only, D under 17 s; v10 19.8, ai 21.4, op 25.1, fast 15.3): the cut back to W 1.5 s after "wakes one" or just
       before "A hook", so "a hook" pins on its word; the list arrives at D-1300, whole and held to the cut (v2-shots-b) */
    const FAST = D < 17000;
    const tCut = FAST ? Math.max(tWake + 2200, tHook - 150) : Math.max(tWake + 2800, tHook - 150);   /* FAST: the woken agent is whole in colour at tWake + 1700 (paleAgent 800 ms from + 900) and holds 0.5 s before the cut (v2-shots-b, 4c render 06:35Z) */
    const wakeIdx = 6 * 3; // front row of B1 west, so it is findable at W // a member in B1 west (board), taken over by a full agent at the wake
    const tSwap = tWake - 1700; /* v1.6 (pre-read 2255): the hand-over happens in frame B, where the room is small, not in frame C */ // the pale sleeper is swapped for the full agent as the notice reaches it (visuals 110413 item 5)
    const C = E.crowd(k, Wb, { fitted, sleep: [tSleep, null], hideFrom: { [wakeIdx]: tSwap } }); // a hard hand-over to an identical sleeping agent, which then wakes over 300 ms (pre-read 2110)
    E.roomZ(k, tSleep, tTag - 1000); // v1.3: the sleep marks end before the chat window docks (they drew over it, 17:14Z stills)
    E.pale(k, C, tSleep, 900, null);
    // the agent that wakes: asleep in its slot, then hops up and walks to the board
    const sl = C.at(wakeIdx, tSleep + 2000);
    const ag = k.agent({ at: [sl.x, sl.y + 0.08, sl.z], face: sl.yaw, name: "woken" }); ag.fade(-40, 1, 0); /* v2.1 (pre-read 1035): hidden before frame 0, so it never shows at f000 */ ag.fade(tSwap, 1, 1); E.closedEyes(k, ag, [[-1e9, tWake + 1000], [tCut + 200, null]]); E.paleAgent(k, ag, [[0, 1], [tWake + 900, 0], [tCut + 200, 1]], 800); /* v2.0 (visuals 080739): 480 measured 267 ms in W; 800 */ /* v1.7 (pre-read 0020 item 2): measured 233 ms at 300, so 480 */ ag.act(tCut + 200, "sleep"); // it sleeps again in 5C's rest, so 5Da opens on an all-asleep floor (join, pre-read 1945 item 7)
    const disc = new T.Mesh(new T.CircleGeometry(0.62, 40), KIT.parts.mat("white")); disc.rotation.x = -Math.PI / 2; k.scene.add(disc);
    k.each((t) => { const q = ag.root.position; disc.position.set(q.x, q.y + 0.012, q.z); disc.visible = t >= tWake + 900 && t < tCut + 200; }); // only while it is awake, so 5C's last frame matches 5Da's first
    E.closedEyes(k, ag, [[tSleep + 600, tWake + 900]]);
    ag.act(tSwap - 1500, "slump", { dur: tWake + 1300 - (tSwap - 1500) }).fx(tWake + 900, "spark", { size: 72 }) /* v1.5 (pre-read 2210): asleep as a long slump, which the kit eases out, so the wake takes 400 ms, not one frame */.turn(tWake + 1500, 400, -0.35).act(tWake + 2000, "hop");
    k.cue(tWake + 900, "wake");
    // ruling 104 item 1 and VL 15.73 (v2-visuals 165307), v1.2 17:20Z. Frame A W (to 3.6 s); move 1 (3.6 to 4.6 s) to frame B,
    // the pavilion's west end: the box outside the door (lit from frame 0), the person at the west desk, the chat docked at
    // x 984 to 1824. "tags Rumi": the @Rumi tag lit (slack-quick tagOn). "sends a notice": 5Da's @ mark leaves the tag, crosses
    // left at head height through the doorway and waits 0.5 m above the box, bobbing; the window leaves 7.6 to 7.9 s. The name
    // card on "webhook". "reaches a small service": the mark drops into the box (300 ms), the box pulses then burns steady.
    // Move 2 (12.6 to 13.7 s): a green pulse leaves the box down the west face and the camera goes down with it to frame C.
    const pav = Wb.parts.laptops[0];
    const tServ = E.at(k, "5C.2", "small service");
    const boxAt = new T.Vector3(...E.BOX); // the same box every whole-building shot draws
    const tLeave = tNotice, tWait = tNotice + 1900, /* 30 px a frame at most */ tDrop = Math.max(tWait + 400, tReach), tIn2 = tDrop + 300, tGo = Math.max(tIn2 + 600, tWake - 1300), tArr = tWake + 750; // the pulse reaches the agent as it wakes (pre-read 1945 item 8)
    const box = E.alwaysOn(k, boxAt, { green: false, base: 1.1, pulses: [tIn2, tGo] }); // lit brighter: it is the one lit thing (VL 15.73)
    // VL 10.5 (visuals 171728 item 2): one green light on the box's face, on from frame 0, one pulse as the notice lands, steady after
    const gl = new T.Mesh(new T.SphereGeometry(0.09, 20, 14), new T.MeshStandardMaterial({ color: 0xF5B301, emissive: 0xF5B301, emissiveIntensity: 1.2 })); gl.position.set(0, 0.78, 0.38); box.add(gl);
    k.each((t) => { const p = Math.sin(Math.PI * FILM.clamp01((t - tIn2) / 600)); gl.scale.setScalar(1 + 0.6 * p); gl.material.emissiveIntensity = 1.2 + 1.5 * p; });
    const WIN = { x: 984, y: 300, w: 840, h: 441 }, tW0 = tTag - 2600, tWout = tNotice + 1000;
    const chat = k.screen("slack-quick", { t0: tW0, t1: tWout + 400, to: WIN, fit: "cover", opt: { dock: [0, 1e9] },
      events: { type: 300, send: 2300, tagOn: tTag - tW0, tagOff: tWout - tW0, reply: 1e9, thread: 1e9, ans: 1e9, thanks: 1e9 } });
    chat.pushIn(4600, 600, { from: pav }); /* grows while the camera lands, up by 4.6 s (VL 15.73) */ chat.pushOut(tWout, 500, { to: pav }); E.hardHide(chat); // the push out had been commented away (pre-read 2110)
    k.cue(tTag, "message");
    const svgNS = "http://www.w3.org/2000/svg", nsvg = document.createElementNS(svgNS, "svg"); nsvg.setAttribute("width", "1920"); nsvg.setAttribute("height", "1080"); nsvg.style.cssText = "position:absolute;left:0;top:0;pointer-events:none"; document.getElementById("ui").appendChild(nsvg);
    const mk = document.createElementNS(svgNS, "g"); mk.innerHTML = '<circle r="34" fill="#fff" stroke="#111418" stroke-width="3"/><text x="0" y="13" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="38" fill="#111418">@</text>'; nsvg.appendChild(mk);
    const pulse = document.createElementNS(svgNS, "circle"); pulse.setAttribute("r", "16"); pulse.setAttribute("fill", "#E8A200"); nsvg.appendChild(pulse);
    const above = new T.Vector3(boxAt.x, 2.0, boxAt.z), door = new T.Vector3(-4.6, 3.4, -1.2); // over the heads, 40 px clear (pre-read 1945 item 2)
    const down = [[boxAt.x, 0.5, boxAt.z], [E.WF, 0.4, 0.15], [E.WF, -1.7, 0.15], [-5.9, -1.7, -1.0], [sl.x, sl.y + 1.05, sl.z]].map((q) => new T.Vector3(...q));
    const curve = new T.CatmullRomCurve3(down, false, "centripetal", 0.5);
    FILM._post.push((t) => {
      const ab = KIT.render.project(above), dr = KIT.render.project(door), bx = KIT.render.project(new T.Vector3(boxAt.x, 0.6, boxAt.z));
      if (t < tLeave - 200 || t >= tIn2) mk.style.display = "none";
      else { mk.style.display = ""; let x, y, sc = 1;
        if (t < tWait) { const u = FILM.tw(t, tLeave, tWait, "sine"), x0 = WIN.x + 110, y0 = WIN.y + 250;
          // tag -> doorway -> above the box, at head height
          if (u < 0.6) { const v = u / 0.6, lift = 120 * Math.sin(Math.PI / 2 * Math.min(1, v / 0.12)) * (v < 0.6 ? 1 : 1 - (v - 0.6) / 0.4); x = FILM.lerp(x0, dr.x, v); y = FILM.lerp(y0, dr.y, v) - lift; } /* v1.7 (pre-read 0020 item 1): rises first, so it clears the head at the panel edge */ else { const v = (u - 0.6) / 0.4; x = FILM.lerp(dr.x, ab.x, v); y = FILM.lerp(dr.y, ab.y, v); } }
        else if (t < tDrop) { x = ab.x; y = ab.y + 6 * Math.sin((t - tWait) / 420); }
        else { const v = FILM.tw(t, tDrop, tIn2, "in"); x = ab.x; y = FILM.lerp(ab.y, bx.y, v); sc = 1 - 0.6 * v; }
        mk.setAttribute("transform", `translate(${x},${y}) scale(${sc})`); mk.style.opacity = FILM.tw(t, tLeave - 200, tLeave); }
      if (t < tGo || t >= tArr + 250) pulse.style.display = "none";
      else { const q = KIT.render.project(curve.getPoint(FILM.tw(t, tGo, tArr, "io"))); pulse.style.display = ""; pulse.setAttribute("cx", q.x); pulse.setAttribute("cy", q.y); pulse.style.opacity = 1 - FILM.tw(t, tArr, tArr + 250); }
    });
    k.cue(tNotice, "pulse"); k.cue(tIn2, "arrive"); k.cue(tGo, "pulse");
    k.ui.nameCard(tName, { lineAt: FAST ? 0 : 1100, /* ruling 167 (4) */ x: 1124, y: 80, /* v2.0: 60 px or more above the roof; base above the people (194218 item 1) */ name: "a webhook", stamp: "For people,<br>a tap on the shoulder", t1: Math.max(tName + 3500, Math.min(tName + 3750, tGo - 150)) }); /* v2.1 (pre-read 1035): gone before move 2 lifts the building under it, whole for 3.5 s or more */ /* v1.8 (v2-check 032826, ruling 96): rides move 2 and leaves on it, as 5A's leaves on its pull-back; the tGo cap cut it to 2.7 s */ // ruling 95: 3.5 s; gone before move 2
    // the pair: a hook stops / a webhook wakes
    Wb.glow("gates", Math.max(tHook, tCut + 60), 1100, 0.6);
    E.leftPin(k, Math.max(tHook, tCut + 60), { text: "a hook", small: "stops", right: 340, y: 205, at: E.R("gates", -2.6, 1.4, -1.0) });
    E.leftPin(k, Math.max(tWh, tCut + 400), { text: "a webhook", small: "wakes", right: 340, y: 105, at: boxAt.clone().add(new T.Vector3(0, 1.0, 0)) });
    // v1.0 (ruling 87 b): the cut back is to W-list, the frame 5Da opens on; in the rest the list arrives once, whole, with
    // four ticks, and holds to the cut (5Da ticks question five at 0.5 s and takes the list and these two labels away)
    const tRest = FAST ? Math.min((k.row("5C.2") || { end: D - 2000 }).end, D - 1300) : (k.row("5C.2") || { end: D - 2000 }).end;
    k.ui.questions(tRest, { ticked: [1, 2, 3, 4], writeAt: { 1: tRest - 2000, 2: tRest - 2000, 3: tRest - 2000, 4: tRest - 2000, 5: tRest - 2000 } });
    k.cue(tHook, "barrier"); k.cue(tWh, "wake");
    // the camera (VL 15.73): A, move 1, B held with drift, move 2 down with the pulse, C, then the straight cut to W-list (D)
    const WL5C = { look: [3.8, -3.6, -2.2], dist: 63, yaw: -14, pitch: -12 }; // v2.0 (visuals 080739): the base out of the band; 5B2 ends on the same view
    const atBox = { look: [-0.3, 4.15, -2.0], dist: 28, yaw: -14, pitch: -12 }; // v2.1: 2.9 m higher than v1.x (1.27 to 4.15; pre-read 1035 found heads still cut at 3.8), so the card has clear page above the roof and the top floor's rows are out of frame, not cut by the lower edge // box and person in x 96 to 944, the window at the right
    const onAg = k.cam.on(new T.Vector3(sl.x + 0.3, sl.y + 1.15, sl.z - 0.2), { size: "room", px: 240, focus: [sl.x, sl.y + 0.5, sl.z] });
    locator(k, { room: "pav", from: 4600, to: tCut, changes: [[tWake - 400, "board"]] /* as the camera lands in the board room (pre-read 2255) */ }); roomRing(k, Wb, "board", tCut, tCut + 600); // whole on the first W frame (194218 item 2) // VL 15.76: frame B the pavilion, C the board room; the ring on the way out
    k.cam.keys([{ t: 0, view: WL5C }, { t: 3600, hold: true }, { t: 4600, view: atBox, ease: "io" }, { t: tGo, hold: true },
      { t: tWake - 400, view: onAg, ease: "io" }, { t: tCut - 1, hold: true }, { t: tCut, view: "W-list", cut: true }, { t: D + 1, hold: true, drift: false }]); // no drift: 5Da opens on exactly this frame (pre-read 2035)
    return {};
  },
});
