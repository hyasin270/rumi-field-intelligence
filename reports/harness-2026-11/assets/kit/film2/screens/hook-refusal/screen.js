/* hook-refusal · shot 1C4 (v2-screens, plain). REBUILT: the real thing is a hook's refusal printed
   to the agent (F20: a non-zero exit blocks the call and the reason is shown). A calm card, full
   frame: a stop mark and "Stopped.", then the reason, then the safe way, one after the other.
   The "54 hooks" number is drawn by the kit, not here.
   Point words: "Stopped." + "Going live needs a check first." + "Do this instead: send it for testing." (13). */
SCREEN.define({
  id: "hook-refusal",
  dur: 8000,
  // card: the card lands. stop: the stop mark and "Stopped.". why: the reason. instead: the safe way.
  // tick: the safe way's arrow and underline draw. push: a slow 1.5% push to the end.
  events: { card: 0, stop: 400, why: 1900, instead: 3500, tick: 4300, push: 4600 },
  // opt.cardX / opt.cardW move the card (default 260, 1400) so the kit's "54 hooks" can stand on clear
  // page at the left (shots-b 123935: cardX 400 gives the card 400..1800, inside the 1824 margin).
  build(root, opt) {
    const L = SCREEN.lib;
    const pg = (root._pg = PL.page(root));
    const cx = (opt && +opt.cardX) || 260, cw = (opt && +opt.cardW) || Math.min(1400, 1800 - cx);
    const c = (root._c = PL.card(pg, cx, 215, cw));
    c.style.padding = "84px 100px";
    root._stop = L.el("div", "", `
      <div style="display:flex;align-items:center;gap:40px">
        <svg viewBox="0 0 100 100" width="132" height="132"><path class="oct" d="M30 4h40l26 26v40L70 96H30L4 70V30z" fill="#C8372D"/><rect x="24" y="43" width="52" height="14" rx="7" fill="#fff"/></svg>
        <span class="pl-h" style="font-size:112px">Stopped.</span>
      </div>`, c);
    root._why = L.el("div", "", `Going live needs a check first.`, c);
    Object.assign(root._why.style, { font: "500 64px/1.2 'Poppins',sans-serif", marginTop: "64px", color: "#111418" });
    const ins = (root._ins = L.el("div", "", `
      <div style="height:3px;background:#EEECE8;margin:56px 0 48px"></div>
      <div style="display:flex;align-items:center;gap:34px">
        <svg class="arw" viewBox="0 0 60 60" width="76" height="76"><circle cx="30" cy="30" r="28" fill="#EEF0F2"/><path class="ap" d="M16 30h26M32 20l10 10-10 10" fill="none" stroke="#111418" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg>
        <div style="font:500 64px/1.2 'Poppins',sans-serif"><span style="color:#5A6068">Do this instead:</span> <span class="safe" style="font-weight:700;position:relative;display:inline-block">send it for testing.<span class="ul" style="position:absolute;left:0;bottom:-10px;height:8px;border-radius:4px;background:#111418;width:100%;transform-origin:0 50%"></span></span></div>
      </div>`, c));
    root._oct = root._stop.querySelector(".oct");
    root._ap = ins.querySelector(".ap"); root._ul = ins.querySelector(".ul");
  },
  render(root, t, ev) {
    const L = SCREEN.lib;
    L.arrive(root._c, t, ev.card, { dur: 500, dy: 30, scale: 0.98 });
    const s = L.arrive(root._stop, t, ev.stop, { dur: 450, dy: 18, scale: 0.94 });
    L.arrive(root._why, t, ev.why, { dur: 420, dy: 22, scale: 1 });
    L.arrive(root._ins, t, ev.instead, { dur: 450, dy: 22, scale: 1 });
    // the stop sign arrives red (#C8372D), holds, then eases to grey #5A6068 as the safe way arrives (v2-visuals 083901 item 3: never black)
    const g = L.tw(t, ev.instead, 600, "io");
    root._oct.setAttribute("fill", `rgb(${Math.round(L.lerp(200, 90, g))},${Math.round(L.lerp(55, 96, g))},${Math.round(L.lerp(45, 104, g))})`);
    const k = L.tw(t, ev.tick, 600, "out");
    root._ap.style.strokeDasharray = "1 1"; root._ap.style.strokeDashoffset = String(1 - k);
    root._ul.style.transform = `scaleX(${L.tw(t, ev.tick + 200, 700, "out")})`;
    PL.push(root._pg, t, ev.push, 3400, 0.015);
  },
});
