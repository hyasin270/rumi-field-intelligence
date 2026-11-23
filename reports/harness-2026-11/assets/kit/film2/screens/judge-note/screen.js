/* judge-note · shot 4B4 (v2-screens, plain). REBUILT: the real thing is the judge's rubric output
   (a score, a rationale, a quoted line; F54). Left, a page of the work (a short grade 2 maths lesson
   plan, numbered lines 10 to 17); right, the judge's note. The quoted line highlights in the work as
   the note names it. Labelled "An example".
   Point words: "Score 3 of 4" + "No time for students to practise alone." + "Quotes line 14" (14). */
SCREEN.define({
  id: "judge-note",
  dur: 9000,
  // page: the work lands. note: the note card lands. score: the score fills. why: the reason.
  // quote: "Quotes line 14" appears. hl: line 14 highlights in the work. push: slow 2% push.
  // more: two more score rows under the note, blank (dots, reason bar, quote chip; VL 15.63 item 3).
  events: { page: 0, note: 900, score: 1300, why: 2500, more: 3200, quote: 4000, hl: 4350, push: 5000 },
  build(root, opt) {
    const L = SCREEN.lib;
    const pg = (root._pg = PL.page(root));
    const w = (root._w = PL.card(pg, 90, 110, 1060, 860));
    w.style.padding = "56px 64px";
    w.innerHTML = `<div class="pl-k">Lesson plan · Grade 2 maths</div>
      <div class="pl-h" style="font-size:60px;margin:18px 0 30px">Adding two-digit numbers</div>`;
    const LINES = [
      [10, "Warm up: count in tens to 100."],
      [11, "Show 23 + 14 with blocks."],
      [12, "Add the tens, then the ones."],
      [13, "Work three sums together."],
      [14, "Students copy the sums from the board."],
      [15, "Check the answers as a class."],
      [16, "Exit question: 31 + 25."],
      [17, "Tidy away the blocks."],
    ];
    root._lines = {};
    LINES.forEach(([n, s]) => {
      const r = L.el("div", "pl-row", `<span class="pl-num">${n}</span><span>${s}</span>`, w);
      Object.assign(r.style, { font: "400 42px/1.2 'Poppins',sans-serif", padding: "13px 20px 13px 0", marginLeft: "-28px", gap: "34px" });
      root._lines[n] = r;
    });
    const tag = L.el("div", "pl-tag", "An example", pg);
    Object.assign(tag.style, { left: "1210px", top: "110px" }); root._tag = tag;
    const nt = (root._n = PL.card(pg, 1210, 210, 620, 0));
    nt.style.height = "auto"; nt.style.padding = "50px 52px";
    nt.innerHTML = `<div class="pl-k">Judge's note</div>
      <div class="sc pl-h" style="font-size:76px;margin-top:22px">Score 3 of 4</div>
      <div class="dots" style="display:flex;gap:16px;margin-top:22px"></div>
      <div class="why" style="font:500 46px/1.25 'Poppins',sans-serif;margin-top:40px;text-wrap:balance">No time for students to practise alone.</div>
      <div class="q" style="margin-top:40px"><span class="pl-chip ink">Quotes line 14</span></div>`;
    const dots = nt.querySelector(".dots");
    root._dots = [0, 1, 2, 3].map(() => { const d = L.el("div", "", null, dots); Object.assign(d.style, { width: "40px", height: "40px", borderRadius: "50%", border: "4px solid #F06E42" }); return d; });
    // opt.more: "beside every score" (4B4.1) seen on three scores. The focal score keeps the words; the other two
    // carry the same shape blank: four dots, a reason bar, a quote chip (v2-visuals 125142, VL 15.63).
    root._more = [];
    if (!(opt && opt.more === false)) { // default since v2-lead 125427 row 9; { more: false } is the old one-score card
      // room for two rows: the note starts level with the work (y 110) and "An example" sits in its top row, right
      nt.style.top = "110px"; nt.style.padding = "44px 52px";
      Object.assign(tag.style, { left: "auto", right: "134px", top: "146px", zIndex: "2" });
      nt.querySelector(".sc").style.marginTop = "14px";
      nt.querySelector(".dots").style.marginTop = "18px";
      ["why", "q"].forEach((c) => (nt.querySelector("." + c).style.marginTop = "28px"));
      const mk = L.el("div", "", null, nt);
      Object.assign(mk.style, { marginTop: "32px" });
      for (let i = 0; i < 2; i++) {
        // one line each: four dots, the reason bar, the quote chip
        const r = L.el("div", "", `${'<i style="display:block;flex:none;width:28px;height:28px;border-radius:50%;border:4px solid #F5B49E;box-sizing:border-box"></i>'.repeat(4)}
          <i style="display:block;flex:1;height:20px;border-radius:10px;background:#E6E4E0;margin:0 22px 0 14px"></i>
          <i style="display:block;flex:none;width:120px;height:40px;border-radius:999px;background:#EEF0F2"></i>`, mk);
        Object.assign(r.style, { display: "flex", alignItems: "center", gap: "10px", padding: "26px 0", borderTop: "3px solid #EEECE8" });
        root._more.push(r);
      }
    }
    root._hl = L.el("div", "s-hl", null, pg);
    root._sc = nt.querySelector(".sc"); root._why = nt.querySelector(".why"); root._q = nt.querySelector(".q"); root._chip = nt.querySelector(".pl-chip");
  },
  render(root, t, ev) {
    const L = SCREEN.lib;
    // every arrival on an even sine so each reads as 300 ms or more (v2-shots-d 202923, v2-visuals 203000: 133 to 200 ms with cubic out)
    const S = "sine";
    L.arrive(root._w, t, ev.page, { dur: 550, dy: 24, ease: S });
    L.arrive(root._n, t, ev.note, { dur: 500, dy: 30, ease: S });
    L.arrive(root._tag, t, ev.note + 150, { dur: 450, dy: 12, scale: 1, ease: S });
    L.arrive(root._sc, t, ev.score, { dur: 450, dy: 14, scale: 1, ease: S });
    root._dots.forEach((d, i) => {
      const on = i < 3 ? L.tw(t, ev.score + 200 + i * 200, 300, "sine") : 0;
      d.style.background = `rgba(240,110,66,${on})`;
      d.style.opacity = L.tw(t, ev.score, 400, "sine");
    });
    L.arrive(root._why, t, ev.why, { dur: 450, dy: 18, scale: 1, ease: S });
    L.arrive(root._q, t, ev.quote, { dur: 450, dy: 14, scale: 1, ease: S });
    root._more.forEach((r, i) => L.arrive(r, t, ev.more + i * 250, { dur: 450, dy: 14, scale: 1, ease: S }));
    // the quoted line is the film's one highlight; the other lines step back
    const h = L.tw(t, ev.hl, 400, "sine"), r = root._lines[14];
    Object.values(root._lines).forEach((x) => { if (x !== r) x.style.opacity = 1 - 0.45 * h; });
    PL.push(root._pg, t, ev.push, 4000, 0.02);
    L.hl(root._hl, t >= ev.hl ? PL.inPage(root._pg, L.boxOf(root, r, 0)) : null, t, ev.hl, null);
  },
});
