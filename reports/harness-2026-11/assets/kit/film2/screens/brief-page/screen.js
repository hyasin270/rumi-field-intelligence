/* brief-page · shot 5D (5Db; rulings 63, 68, 70; VL 15.48) · v2-screens, plain. A mockup of the note taker's pre-meeting
   brief, in the format its code states (NOTETAKER_CODE section 1, brief_builder.py:93-94, 167-180): about one page,
   every point names its source and day, and the page ends with the sources it checked. All text is invented (words:
   v2-lead 105745 and 110850); no person, school or team. Labelled "An example".
   Built for the panel (1150 px wide, scale 0.6): at panel size the title is 44 px, point 1 40 px, points 2 to 4
   36 px, chips 30 px, the foot 30 px, rows 96 px apart (v2-visuals 110639 item 5).
   Point words: point 1 and its chip (11); the other three are heard as their sources are named. */
SCREEN.define({
  id: "brief-page",
  dur: 9000,
  // page: the page lands. p1..p4: the yellow field lands on the row, the point and chip write in under it (420 ms),
  // the field cools (250 ms). foot: "Sources checked". hl: the field comes back to point 1 and stays. push: 2%.
  events: { page: 0, p1: 700, p2: 1700, p3: 2700, p4: 3700, foot: 4600, hl: 5300, push: 5600 },
  // opt.small: the 13:18Z layout (header row; panel sizes 28/44/40/36/30). Default (v2-visuals 174926 item 2, the
  // brief's 36 px floor): every word on the page is 36 px or more at panel scale 0.6. The header row folds into the
  // title row (Rumi mark, title, "An example"); points 44, chips 38, foot 36, title 52, rows 112 px apart.
  build(root, opt) {
    const L = SCREEN.lib, k = 1920 / 1150; // screen px per panel px
    const small = !!(opt && opt.small);
    const pg = (root._pg = PL.page(root));
    // The page IS the panel (v2-visuals 124618 item 6: no card inside a card): it fills the frame edge to edge,
    // no corner, no shadow, no ring; the kit's panel gives the one rounded edge. Margins sit inside the page.
    const c = (root._c = PL.card(pg, 0, 0, 1920, 1080));
    Object.assign(c.style, { padding: small ? "64px 120px" : "50px 100px", borderRadius: "0", boxShadow: "none", boxSizing: "border-box" });
    if (small) {
      c.innerHTML = `<div class="hdr" style="display:flex;align-items:center;gap:20px;font:600 ${Math.round(28 * k)}px/1 'Poppins',sans-serif;color:#4A5059">${L.avatar("Rumi")}<span>Rumi · note taker</span>
      <span class="ex" style="margin-left:auto;border:2px solid #DADDE1;border-radius:999px;padding:8px 26px;color:#4A5059">An example</span></div>
      <div class="pl-h" style="font-size:${Math.round(44 * k)}px;margin:${Math.round(14 * k)}px 0 ${Math.round(14 * k)}px">Brief · weekly planning</div>`;
      Object.assign(c.querySelector(".s-av").style, { width: "60px", height: "60px", borderRadius: "50%", flex: "none" });
    } else {
      c.innerHTML = `<div class="hdr" style="display:flex;align-items:center;gap:26px;margin-bottom:${Math.round(10 * k)}px">${L.avatar("Rumi")}
      <span class="pl-h" style="font-size:${Math.round(52 * k)}px;line-height:1.1;margin:0">Brief · weekly planning</span>
      <span class="ex" style="margin-left:auto;border:2px solid #DADDE1;border-radius:999px;padding:6px 28px 10px;font:600 ${Math.round(36 * k)}px/1.1 'Poppins',sans-serif;color:#4A5059">An example</span></div>`;
      Object.assign(c.querySelector(".s-av").style, { width: "84px", height: "84px", borderRadius: "50%", flex: "none" });
    }
    const pitch = Math.round((small ? 96 : 112) * k);
    root._rows = BR.POINTS.map((_, i) => {
      const r = L.el("div", "", null, c);
      Object.assign(r.style, { position: "relative", height: pitch + "px", paddingLeft: small ? "86px" : "92px" });
      const n = L.el("div", "pl-num", String(i + 1), r);
      Object.assign(n.style, { position: "absolute", left: "0", top: "8px", width: "50px", fontVariantNumeric: "normal" }); // tabular "1" carries a long flag that read as drawn twice (b110)
      if (!small) Object.assign(n.style, { fontSize: Math.round(36 * k) + "px", top: "6px", width: "60px" });
      BR.point(r, i, small ? { size: Math.round((i ? 36 : 40) * k), chip: Math.round(30 * k) } : { size: Math.round(44 * k), chip: Math.round(38 * k) });
      return r;
    });
    const f = (root._foot = L.el("div", "", "Sources checked: meetings · team chat · Notion · product data", c));
    Object.assign(f.style, { marginTop: small ? "6px" : "0", paddingTop: small ? "20px" : "16px", borderTop: "2px solid #E6E8EB", font: `500 ${Math.round((small ? 30 : 36) * k)}px/1.2 'Poppins',sans-serif`, color: "#3C424B" });
    if (!small) Object.assign(f.style, { whiteSpace: "nowrap", letterSpacing: "-0.025em", marginRight: "-24px" }); // "team chat" (r109 c) is longer than "Slack": one line at the 36 px floor
    root._fld = L.el("div", "s-hl", null, pg);
  },
  render(root, t, ev) {
    const L = SCREEN.lib, P = [ev.p1, ev.p2, ev.p3, ev.p4];
    L.arrive(root._c, t, ev.page, { dur: 500, dy: 0, scale: 1 }); // a full-bleed page fades in; a lift would bare its top edge
    root._rows.forEach((r, i) => {
      BR.write(r.querySelector(".br-pt"), t, P[i]);
      r.querySelector(".pl-num").style.opacity = t < P[i] ? 0 : 1;
    });
    L.arrive(root._foot, t, ev.foot, { dur: 400, dy: 12, scale: 1 });
    // after hl, points 2 to 4 step back so point 1 is the one thing to read
    const h = L.tw(t, ev.hl, 300, "out");
    root._rows.forEach((r, i) => { r.style.opacity = i ? 1 - 0.4 * h : 1; });
    const s = PL.push(root._pg, t, ev.push, 3400, 0.02);
    // one field at a time: it lands on each row as its point writes in, cools 600 ms later; at hl it returns to point 1
    let j = -1; P.forEach((p, i) => { if (t >= p) j = i; });
    const box = (i) => { const b = L.boxOf(root, root._rows[i].querySelector(".br-pt"), 0); return PL.inPage(root._pg, { x: b.x - 18, y: b.y - 5, w: b.w + 36, h: b.h + 10 }); };
    if (t >= ev.hl) BR.field(root._fld, box(0), t, ev.hl, null);
    else if (j >= 0) BR.field(root._fld, box(j), t, P[j], P[j] + 600);
    else root._fld.style.opacity = 0;
  },
});
