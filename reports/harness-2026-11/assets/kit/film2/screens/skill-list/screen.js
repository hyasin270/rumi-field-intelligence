/* skill-list · shot 1B4 (v2-screens, plain). REBUILT: the real thing is the one-line skill listing
   every session starts with (F12). Six plain lines arrive under "Always on"; "Write a lesson plan"
   highlights; its folder opens beside the list, "On demand", showing its first page; the rest dims.
   Point words: "Always on" + "Write a lesson plan" + "On demand" (9). */
SCREEN.define({
  id: "skill-list",
  dur: 12000,
  // rows: first line lands (the rest follow every 220 ms). pick: one line highlights.
  // open: its folder opens beside the list. p1, p2: the folder's first-page lines (p3 kept for timing, no line;
  // "Seven steps" out, v2-lead 201402). steps: seven step marks fill in under the two lines. push: a slow 2% push to the end.
  events: { rows: 300, pick: 2900, open: 3900, p1: 4900, p2: 5600, p3: 6300, steps: 7800, push: 8800 },
  build(root) {
    const L = SCREEN.lib;
    const pg = (root._pg = PL.page(root));
    const SK = ["Write a lesson plan", "Review a design", "Post to the team chat", "Make a quiz", "Score a coaching session", "Draw a chart"];
    const list = (root._list = PL.card(pg, 130, 120, 900, 840));
    list.style.padding = "56px 56px";
    root._lh = L.el("div", "", `<div style="display:flex;align-items:center;gap:22px"><span class="pl-h" style="font-size:72px">Always on</span></div>
      <div class="pl-k" style="margin-top:14px">One line per skill</div>`, list);
    const ul = L.el("div", "", null, list); ul.style.marginTop = "40px";
    root._rows = SK.map((s) => {
      const r = L.el("div", "pl-row", `<span class="pl-dot"></span><span>${s}</span>`, ul);
      Object.assign(r.style, { font: "500 52px/1.15 'Poppins',sans-serif", padding: "18px 26px", marginLeft: "-26px" });
      return r;
    });
    // the folder: a tab and a page
    const f = (root._f = L.el("div", "abs", null, pg));
    Object.assign(f.style, { left: "1090px", top: "150px", width: "720px", height: "800px", transformOrigin: "0 50%" });
    f.innerHTML = `
      <div style="position:absolute;left:0;top:0;width:300px;height:74px;border-radius:24px 24px 0 0;background:#EEF0F2"></div>
      <div class="pl-card" style="left:0;top:54px;width:720px;height:746px;padding:52px 56px;border-radius:0 32px 32px 32px;box-shadow:0 22px 60px rgba(17,20,24,.12),0 0 0 2px #DADDE1">
        <span class="pl-chip ink">On demand</span>
        <div class="pl-h" style="font-size:64px;margin-top:30px">Write a lesson plan</div>
        <div style="height:3px;background:#F1EFEC;margin:34px 0 20px"></div>
        <div class="fl" style="font:500 48px/1.2 'Poppins',sans-serif"></div>
      </div>`;
    const fl = f.querySelector(".fl");
    root._p = ["What is inside", "When to go deeper"].map((s) => {
      const r = L.el("div", "pl-row", `<span class="pl-dot" style="background:#111418"></span><span>${s}</span>`, fl);
      r.style.padding = "16px 0"; return r;
    });
    const st = (root._st = L.el("div", "", null, fl));
    Object.assign(st.style, { display: "flex", gap: "18px", margin: "14px 0 0 44px" });
    root._sd = [1, 2, 3, 4, 5, 6, 7].map((n) => {
      const d = L.el("div", "", String(n), st);
      Object.assign(d.style, { width: "62px", height: "62px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", font: "600 36px/1 'Poppins',sans-serif", border: "3px solid #111418", color: "#111418" });
      return d;
    });
    root._hl = L.el("div", "s-hl", null, root._pg);
  },
  render(root, t, ev) {
    const L = SCREEN.lib, rows = root._rows;
    L.arrive(root._list, t, 0, { dur: 450, dy: 18 });
    // the list starts in the middle of the frame and steps left as the folder opens
    const slide = L.tw(t, ev.open - 200, 800, "io");
    root._list.style.transform += ` translateX(${380 * (1 - slide)}px)`;
    rows.forEach((r, i) => L.arrive(r, t, ev.rows + i * 220, { dur: 360, dy: 22, scale: 1 }));
    // the pick: line one is the film's one highlight (measured at the end of render, after every transform)
    rows[0].style.fontWeight = t >= ev.pick + 150 ? 600 : 500;
    // the rest of the list dims as the folder opens
    const o = L.tw(t, ev.open, 700, "io");
    rows.slice(1).forEach((r) => { r.style.opacity = Math.min(+r.style.opacity, 1 - 0.68 * o); });
    root._lh.style.opacity = 1 - 0.35 * o;
    // the folder opens out of the picked line
    const f = root._f;
    f.style.opacity = L.clamp01(o * 2.2);
    f.style.transform = `translateX(${-50 * (1 - o)}px) scale(${0.6 + 0.4 * o})`;
    f.style.clipPath = o >= 1 ? "none" : `inset(-40px ${100 * (1 - o)}% -60px -40px round 32px)`;
    [ev.p1, ev.p2].forEach((tt, i) => L.arrive(root._p[i], t, tt, { dur: 380, dy: 20, scale: 1 }));
    root._sd.forEach((d, i) => {
      const u = L.tw(t, ev.steps + i * 110, 260, "out");
      d.style.opacity = t < ev.steps ? 0 : u;
      d.style.transform = `scale(${0.6 + 0.4 * L.E.back(u)})`;
    });
    PL.push(root._pg, t, ev.push, 3200, 0.02);
    L.hl(root._hl, t >= ev.pick ? PL.inPage(root._pg, L.boxOf(root, rows[0], 0)) : null, t, ev.pick, null);
  },
});
