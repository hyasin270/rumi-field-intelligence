/* roleb-rdf · shot roleb-rdf (lane roleb, s24 Prove it). Each region's weekly charts, aggregate images only
   (Tanzania weekly brief, 21 to 27 Oct; the role show's own two charts, s08). A title card first, then the Teach Well
   chart, then the Improve chart; each chart has its one-line reading under the title. No teacher row, no name.
   events: title (the card), teach (the first chart), improve (the second chart). Pure in t. */
SCREEN.define({
  id: "roleb-rdf",
  dur: 12000,
  events: { title: 0, teach: 2400, improve: 5600 },
  build(root) {
    const L = SCREEN.lib;
    const pg = (root._pg = PL.page(root));
    pg.style.background = "#FAF7F2";
    const hd = (root._hd = L.el("div", "abs", "", pg));
    Object.assign(hd.style, { left: "96px", top: "34px", width: "1728px" });
    hd.innerHTML = `<div class="pl-h" style="font-size:96px;color:#001F3F">The RDF</div>
      <div style="font:500 52px/1.2 'Poppins',sans-serif;color:#001F3F;margin-top:10px">Each region&rsquo;s weekly charts<br>Tanzania, from the weekly brief to 27 Oct</div>`;
    const bar = L.el("div", "abs", "", pg); Object.assign(bar.style, { left: "96px", top: "40px", width: "14px", height: "200px", borderRadius: "7px", background: "#F5B301" });
    bar.style.left = "60px";
    // the title card's three lines (step 1): what the weekly charts are
    const lines = (root._lines = L.el("div", "abs", "", pg));
    Object.assign(lines.style, { left: "96px", top: "330px", width: "1728px", font: "500 64px/1.3 'Poppins',sans-serif", color: "#001F3F" });
    lines.innerHTML = `<div>The same charts, every week, for every region.</div><div style="margin-top:28px">Totals only: no teacher is named.</div><div style="margin-top:28px;color:#B87400;font-weight:600">Your number should show up here.</div>`;
    const mk = (src) => {
      const c = L.el("div", "abs", "", pg);
      Object.assign(c.style, { left: "0", top: "0", width: "1920px", height: "1080px", opacity: 0, background: "#FAF7F2" });
      // 1560 x 884 drawn, cropped to 806 px tall: the chart's own footer line (region and dates) is said in the caption
      c.innerHTML = `<div style="position:absolute;left:180px;top:24px;width:1560px;height:806px;background:#fff;border-radius:28px;box-shadow:0 18px 50px rgba(0,31,63,.12);overflow:hidden">
          <img src="../screens/roleb-rdf/${src}" style="display:block;width:1560px;height:884px" alt=""></div>`;
      return c;
    };
    root._teach = mk("rdf_teach.png");
    root._impr = mk("rdf_improve.png");
  },
  render(root, t, ev) {
    const tw = (a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
    const io = (u) => u * u * (3 - 2 * u);
    const a = io(tw(ev.teach, ev.teach + 450)), b = io(tw(ev.improve, ev.improve + 450));
    root._lines.style.opacity = 1 - a;
    root._teach.style.opacity = a * (1 - b);
    root._teach.style.transform = `translateY(${24 * (1 - a)}px)`;
    root._impr.style.opacity = b;
    root._impr.style.transform = `translateY(${24 * (1 - b)}px)`;
  },
});
