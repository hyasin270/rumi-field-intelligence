// q5-night · S and W · lane q5, for s21 "Agents at night" (Operator Harness Show, 23 Nov 2026). A new shot from the kit, no
// film row. The teams room (B3 east): the operator at the centre of a swarm of six, each agent with an inbox on a post;
// plain messages (envelopes) pass between them. Night: back out to W, the sky turns navy, the people upstairs go home, the
// floors work on. Morning: the sky clears, the operator comes back; "staging" (the safe copy) lights and opens, the
// operator looks; then "production" lights: the operator's go. Last: the operator tests it end to end on the phone.
// Every frame is pure in t. Rests (for scenes/s21): 4700, 9500, 17200, 24600, 28700, 33600.
(function () { const x = new XMLHttpRequest(); x.open("GET", "../shots/_e/lib.js", false); x.send(); (0, eval)(x.responseText); })();
(function(){const x=new XMLHttpRequest();x.open("GET","snippets/locator.js",false);x.send();(0,eval)(x.responseText+";window.locator=locator;window.roomRing=roomRing;");})();
FILM.shot({
  id: "q5-night", type: "S", dur: 34200,
  setup(k) {
    const E = window.SE, T = THREE, P = KIT.parts, tw = FILM.tw, D = k.dur;
    k.breathe();
    const Wb = E.world(k, E.ALL);
    E.crowd(k, Wb, { fitted: E.ALL, clear: [{ room: "teams", x0: -99, x1: 99 }] });
    const y = E.roomY("teams"), cx = E.roomX("teams");
    // the room's own round table goes: the swarm stands where it stood
    k.each(() => { if (Wb.parts.teams) Wb.parts.teams.visible = false; });
    // ---- times
    const tNight0 = 11600, tNight1 = 13600, tDawn0 = 17600, tDawn1 = 19400;
    const tStage = 21900, tLook = 24300, tProd = 26300, tPhone = 29000, tCheck1 = 31000, tCheck2 = 31900;
    // ---- the two doors on the back wall: staging (the safe copy) and production
    const door = (x, label) => { const d = k.set.part("door2", { label, signW: 1.7, em: 0.24 }); d.position.set(x, y, -5.55); k.scene.add(d); return d; };
    const dS = door(cx - 1.05, "staging"), dP = door(cx + 1.05, "production");
    dS.light(tStage); dS.open(tStage + 400, 0.7); dP.light(tProd); dP.open(tProd + 400, 0.7);
    k.cue(tStage, "light"); k.cue(tProd, "light");
    // ---- the operator, at the centre
    const OP = [cx, y, -3.4];
    const op = k.person({ at: OP, face: 0, blend: 300, settle: 300 });
    op.pose(2300, "point").pose(3600, "stand");
    // leaves for the night (out by the room's east side), back in the morning
    op.turn(9800, 300, 1.4).walk(10100, 1500, [[cx + 2.6, -2.6], [cx + 3.4, -1.4]], { face: 1.4 });
    op.walk(19600, 1700, [[cx + 2.6, -2.6], [cx - 0.1, -3.6]], { face: -0.9 });
    op.turn(21300, 400, [cx - 1.05, y + 1.2, -5.5]).pose(tLook - 400, "point").pose(tLook + 900, "stand");
    op.turn(tProd - 700, 400, [cx + 1.05, y + 1.2, -5.5]).pose(tProd - 300, "point").pose(tProd + 1200, "stand");
    op.turn(tPhone - 400, 400, 0.1).pose(tPhone, "phone");
    op.fx(tLook + 300, "tick");
    k.each((t) => { const r = op.root || op; r.visible = !(t > 11650 && t < 19550); });
    // ---- the swarm: six agents round the operator, each with an inbox on a post beside it
    const RING = [[-1.6, -4.55, 0.5], [-1.85, -3.6, 0.75], [-1.25, -2.75, 0.5], [1.25, -2.75, -0.5], [1.85, -3.6, -0.75], [1.6, -4.55, -0.55]];
    const A = RING.map(([dx, z, f], i) => k.agent({ at: [cx + dx, y, z], face: f, name: "swarm" + i }));
    const TRAY = RING.map(([dx, z]) => [cx + dx + (dx < 0 ? -0.55 : 0.55), y, z + 0.15]);
    TRAY.forEach(([x, yy, z]) => { const g = new T.Group(); g.position.set(x, yy, z); k.scene.add(g);
      P.add(g, P.rbox(0.06, 0.5, 0.06, P.mat("white"), 0.02, 0.01), 0, 0.25, 0);
      P.add(g, P.rbox(0.36, 0.05, 0.26, P.mat("white"), 0.02, 0.01), 0, 0.52, 0);
      P.add(g, P.rbox(0.36, 0.08, 0.02, P.mat("white"), 0.01, 0.005), 0, 0.57, 0.12); });
    // each inbox has a small amber flag that rises when its first message lands (an inbox with something in it)
    const firstIn = {}; [[0, 3, 5000], [4, 1, 5700], [2, 5, 6400], [5, 0, 7100], [1, 4, 7800], [3, 2, 8500]].forEach(([s0, r0, t0]) => { if (firstIn[r0] == null) firstIn[r0] = t0 + 750; });
    TRAY.forEach(([x, yy, z], i) => { const piv = new T.Group(); piv.position.set(x + (RING[i][0] < 0 ? -0.2 : 0.2), yy + 0.55, z - 0.02); k.scene.add(piv);
      const fm = new T.MeshStandardMaterial({ color: 0xF5B301, roughness: 0.5 }); const pole = P.rbox(0.03, 0.34, 0.03, fm, 0.01, 0.005); pole.position.y = 0.17; piv.add(pole);
      const fl = P.rbox(0.16, 0.1, 0.02, fm, 0.01, 0.005); fl.position.set(RING[i][0] < 0 ? -0.08 : 0.08, 0.29, 0); piv.add(fl);
      k.each((t) => { const u = tw(t, firstIn[i], firstIn[i] + 350, "back"); piv.rotation.z = (RING[i][0] < 0 ? 1 : -1) * (Math.PI / 2) * (1 - u); }); });
    // briefed: they turn to the operator, then a small hop each as their brief lands
    A.forEach((a, i) => { a.act(2700 + i * 140, "hop"); });
    // ---- messages: an envelope leaves a sender and lands in another agent's inbox (a short arc), then waits there
    const MSG = [[0, 3, 5000], [4, 1, 5700], [2, 5, 6400], [5, 0, 7100], [1, 4, 7800], [3, 2, 8500],
      [0, 4, 14200], [5, 1, 15000], [2, 3, 15800], [4, 0, 20200], [1, 5, 21000]];
    const FLY = 750, stackN = {};
    MSG.forEach(([s, r, t0], m) => {
      const e = k.set.part("envelope", { size: "small" }); k.scene.add(e);
      const n = (stackN[r] = (stackN[r] || 0) + 1);
      const a0 = new T.Vector3(cx + RING[s][0] * 0.82, y + 0.62, RING[s][1] + 0.25), b0 = new T.Vector3(TRAY[r][0], y + 0.55 + 0.025 * n, TRAY[r][2]);
      A[s].act(t0 - 250, "carry", { dur: 400, prop: false });
      A[r].act(t0 + FLY + 100, "read", { dur: 1100 });
      k.each((t) => { if (t < t0) { e.visible = false; return; } e.visible = true; const u = tw(t, t0, t0 + FLY, "io");
        e.position.lerpVectors(a0, b0, u); e.position.y += Math.sin(Math.PI * u) * 0.9; e.rotation.y = 0.3 * Math.sin(Math.PI * u); });
      if (t0 < 12000) k.cue(t0, "message");
    });
    // ---- night: the sky turns navy, the people upstairs go home through the pavilion door, the lamps dim; morning reverses it
    const page = k.scene.background.clone(), navy = new T.Color(0x0d2340);
    const nightU = (t) => tw(t, tNight0, tNight1, "io") * (1 - tw(t, tDawn0, tDawn1, "io"));
    k.each((t) => { k.scene.background.copy(page).lerp(navy, nightU(t)); });
    const lamps = []; Wb.parts.pav.traverse((o) => { if (o.isPointLight) lamps.push([o, o.intensity]); });
    k.each((t) => { const u = nightU(t); lamps.forEach(([l, i0]) => { l.intensity = i0 * (1 - 0.75 * u); }); });
    (Wb.people || []).forEach((p, i) => { const r = p.root || p; const t0 = tNight1 - 400 + i * 260;
      p.walk(t0, 1400, [[-4.0, -2.2], [-4.9, -2.1]]); k.each((t) => { r.visible = !(t > t0 + 1450 && t < tDawn1 - 300); }); });
    // the floors work on: every room stays lit through the night
    E.ORDER.forEach((n) => Wb.glow(n, tNight0 + 600, tDawn1 - tNight0, 0.45));
    // the clock and the moon (48 px floor)
    k.ui.text("pm", tNight1 - 200, tDawn0 + 200, '<div style="font-family:\'Poppins\';font-weight:600;font-size:56px;color:#FAF7F2;display:flex;align-items:center;gap:26px"><svg width="86" height="86" viewBox="0 0 86 86"><path d="M58 8a36 36 0 1 0 22 52A30 30 0 0 1 58 8z" fill="#F5B301"/></svg>11 pm</div>', { x: 1440, y: 120 });
    k.ui.text("am", tDawn1 - 200, 24400, '<div style="font-family:\'Poppins\';font-weight:600;font-size:56px;color:#001F3F;display:flex;align-items:center;gap:26px"><svg width="86" height="86" viewBox="0 0 86 86"><circle cx="43" cy="43" r="17" fill="#F5B301"/><g stroke="#F5B301" stroke-width="6" stroke-linecap="round"><path d="M43 6v12M43 68v12M6 43h12M68 43h12M17 17l8 8M61 61l8 8M17 69l8-8M61 25l8-8"/></g></svg>7 am</div>', { x: 1440, y: 120 });
    // the end-to-end checks beside the operator's phone
    const chk = (t1) => `<svg width="52" height="52" viewBox="0 0 52 52" style="opacity:${t1}"><circle cx="26" cy="26" r="24" fill="#F5B301"/><path d="M14 27l8 8 16-17" fill="none" stroke="#001F3F" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const panel = document.createElement("div"); panel.style.cssText = "position:absolute;left:1080px;top:230px;width:744px;box-sizing:border-box;padding:34px 40px;border-radius:28px;background:#FFFFFF;box-shadow:0 18px 40px rgba(0,31,63,.16);font-family:'Poppins';color:#001F3F;";
    document.getElementById("ui").appendChild(panel);
    FILM._post.push((t) => { const v = tw(t, tPhone + 700, tPhone + 1150, "out"); panel.style.visibility = v > 0 ? "visible" : "hidden"; panel.style.opacity = v; panel.style.transform = `translateY(${24 * (1 - v)}px)`;
      const c1 = tw(t, tCheck1, tCheck1 + 300), c2 = tw(t, tCheck2, tCheck2 + 300);
      panel.innerHTML = `<div style="font-family:'Fredoka';font-weight:600;font-size:56px;line-height:1.1;margin-bottom:22px">End to end</div>`
        + `<div style="display:flex;align-items:center;gap:22px;font-size:48px;font-weight:500;line-height:1.15;margin:14px 0">${chk(c1)}On WhatsApp, yourself</div>`
        + `<div style="display:flex;align-items:center;gap:22px;font-size:48px;font-weight:500;line-height:1.15;margin:14px 0">${chk(c2)}The browser tests</div>`; });
    k.cue(tCheck1, "tick"); k.cue(tCheck2, "tick");
    A.forEach((a, i) => { a.act(tProd + 900 + i * 120, "hop"); });
    // in the morning one of the swarm shows what it built: it steps to the staging door and holds the work up
    A[0].turn(tStage - 1500, 300, 0.9).walk(tStage - 1400, 1300, [[cx - 1.2, -4.6], [cx - 0.95, -4.85]], { face: 0.1 }).act(tStage + 300, "proud", { dur: 2600 });
    // ---- the camera: into the room, a small push for the messages, out to W for the night, back in for the morning, close on the phone
    const ROOM = k.cam.on([cx, y + 0.75, -3.5], { size: "room", px: 190, yaw: -10 });
    const ROOM2 = k.cam.on([cx - 0.1, y + 0.85, -3.5], { size: "room", px: 200, yaw: -10 });
    const DOORS = k.cam.on([cx, y + 0.95, -3.9], { size: "room", px: 200, yaw: -6 });
    const PHONE = k.cam.on([cx + 0.9, y + 1.25, -3.6], { size: "room", px: 228, yaw: -8 });
    k.cam.keys([{ t: 0, view: "W" }, { t: 200, hold: true, drift: false }, { t: 2200, view: ROOM, ease: "io" },
      { t: 5000, hold: true }, { t: 6800, view: ROOM2, ease: "io" }, { t: 10600, hold: true },
      { t: 13000, view: "W", ease: "io" }, { t: 19400, hold: true }, { t: 21600, view: DOORS, ease: "io" },
      { t: 29000, hold: true }, { t: 30600, view: PHONE, ease: "io" }, { t: D + 1, hold: true }]);
    if (window.locator) locator(k, { room: "teams", from: 2200, to: 10600, fade: 300 });
    if (window.locator) locator(k, { room: "teams", from: 21600, to: D + 1, fade: 300 });
    return {};
  },
});
