/* roleb-week · shot roleb-week (lane roleb, s26 The weekly meeting). The operators' weekly meeting: an hour in three
   parts (20 minutes, one operator's build and lesson; 10 minutes of questions; 30 minutes reading each region's
   weekly charts), then two case studies shared there. No bill figure, no names.
   events: s1, s2, s3 (each part lights in turn), c1 (the quiz case), c2 (the lesson-plan case). Pure in t. */
SCREEN.define({
  id: "roleb-week",
  dur: 14000,
  events: { s1: 600, s2: 1500, s3: 2400, c1: 5000, c2: 8400 },
  build(root) {
    const L = SCREEN.lib;
    const pg = (root._pg = PL.page(root));
    pg.style.background = "#FAF7F2";
    const hd = L.el("div", "abs", "", pg);
    Object.assign(hd.style, { left: "96px", top: "60px", width: "1728px" });
    hd.innerHTML = `<div class="pl-h" style="font-size:104px;color:#001F3F">The weekly meeting</div>`;
    // the hour as a bar: 60 minutes across 1728 px (28.8 px a minute)
    const U = 28.8, X = 96, Y = 230, H = 190;
    const seg = (m0, m1, min) => {
      const s = L.el("div", "abs", "", pg);
      Object.assign(s.style, { left: X + m0 * U + "px", top: Y + "px", width: (m1 - m0) * U - 12 + "px", height: H + "px", borderRadius: "28px",
        background: "#fff", boxShadow: "0 0 0 4px #E4DED3", boxSizing: "border-box", padding: "46px 34px" });
      s.innerHTML = `<div style="font:600 96px/1 'Fredoka',sans-serif;color:#001F3F">${min}</div>`;
      return s;
    };
    root._segs = [seg(0, 20, "20 min"), seg(20, 30, "10"), seg(30, 60, "30 min")];
    const row = (y, txt) => { const r = L.el("div", "abs", txt, pg); Object.assign(r.style, { left: "96px", top: y + "px", width: "1728px", font: "500 80px/1.2 'Poppins',sans-serif", color: "#001F3F" }); return r; };
    root._rows = [row(460, "<b style='font-weight:600'>20</b> &middot; one operator&rsquo;s build and lesson"), row(575, "<b style='font-weight:600'>10</b> &middot; questions"), row(690, "<b style='font-weight:600'>30</b> &middot; reading the RDF, region by region")];
    // the two cases, one at a time, under the bar
    const card = (head, body) => {
      const c = L.el("div", "abs", "", pg);
      Object.assign(c.style, { left: "96px", top: "470px", width: "1728px", boxSizing: "border-box", padding: "34px 44px", borderRadius: "28px",
        background: "#fff", borderLeft: "16px solid #F5B301", boxShadow: "0 18px 50px rgba(0,31,63,.10)", opacity: 0 });
      c.innerHTML = `<div class="pl-h" style="font-size:64px;color:#001F3F">${head}</div><div style="font:500 52px/1.25 'Poppins',sans-serif;color:#001F3F;margin-top:14px">${body}</div>`;
      return c;
    };
    root._c1 = card("Quizzes in WhatsApp&rsquo;s in-app browser", "Meta&rsquo;s pricing changed and the bill jumped. The quiz that goes home now opens in WhatsApp&rsquo;s in-app browser.");
    root._c2 = card("Lesson plans as phone pages", "The phone pages you saw earlier were first shown at this meeting.");
  },
  render(root, t, ev) {
    const tw = (a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
    const io = (u) => u * u * (3 - 2 * u);
    // each part lights as it is named: an amber ring and a warm fill, then stays lit
    [ev.s1, ev.s2, ev.s3].forEach((ts, i) => {
      const u = io(tw(ts, ts + 400)), s = root._segs[i];
      const lit = u;   // every part stays lit once named
      s.style.boxShadow = `0 0 0 ${4 + 4 * lit}px ${lit > 0.5 ? "#F5B301" : "#E4DED3"}`;
      s.style.background = `rgba(255, ${Math.round(255 - 9 * lit)}, ${Math.round(255 - 40 * lit)}, 1)`;
      s.style.opacity = 0.35 + 0.65 * u;
      root._rows[i].style.opacity = u * (1 - io(tw(ev.c1 - 300, ev.c1 + 150)));
    });
    const a = io(tw(ev.c1, ev.c1 + 450)), b = io(tw(ev.c2, ev.c2 + 450));
    root._c1.style.opacity = a * (1 - b); root._c1.style.transform = `translateY(${30 * (1 - a)}px)`;
    root._c2.style.opacity = b; root._c2.style.transform = `translateY(${30 * (1 - b)}px)`;
  },
});
