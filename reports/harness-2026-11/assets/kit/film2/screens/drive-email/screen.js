/* drive-email · shot 2C (v2-screens / google_meet), round 2. A flat white card "Coaching tip redesign"
   (Notion logo) shrinks into a file card and drops into the shared drive "Programme team"; a document,
   a sheet and a deck land 150 ms apart, each owned by Rumi. The frame pans to Gmail; one inbox row from
   Rumi lands, with the document as a chip. The email is not opened. Hold with a slow push. COMPOSED. */
SCREEN.define({
  id: "drive-email",
  dur: 6634,
  // drop: the card shrinks (350 ms) then falls into the list (250 ms): 0 to 600 ms. files: first of three
  // rows (1500, 1650, 1800; 420 ms each). swap: pan to Gmail (700 ms). mail: the inbox row lands (4000).
  // hlRow: the highlight settles on the new row. Then hold, full frame, slow push. The email is not opened.
  events: { drop: 0, files: 1500, swap: 3100, mail: 4000, hlRow: 4600 },
  build(root, opt) {
    const L = SCREEN.lib;
    const FILES = [
      { k: "doc", name: "Coaching tip redesign" },
      { k: "sheet", name: "Coaching tip trial" },
      { k: "slides", name: "Coaching tip walkthrough" },
    ];
    // Drive: Shared drives > Programme team, sorted by name
    const D = G.shell(root, { app: "drive", shared: true });
    D.card.innerHTML = `<div class="g-h">Shared drives ${G.I.chev} Programme team ${G.I.caret}</div>
      <div class="g-th"><div class="g-c1">Name ↑</div><div class="g-c2">Owner</div><div class="g-c3">Last modified</div></div><div class="g-list"></div>`;
    const list = D.card.querySelector(".g-list");
    const row = (f, own, when) => {
      const r = L.el("div", "g-row", null, list);
      const i = L.el("div", "g-ri", `<div class="g-c1">${G.P[f.k]}<span>${f.name}</span></div>
        <div class="g-c2">${L.avatar(own)}<span>${own}</span></div><div class="g-c3">${when}</div>`, r);
      return { r, i };
    };
    root._new = FILES.map((f) => row(f, "Rumi", "Just now"));
    row({ k: "gfolder", name: "Field visit photos" }, "Field coach lead", "Yesterday");
    row({ k: "doc", name: "Reading check guide" }, "Assessment specialist", "Last week");
    row({ k: "doc", name: "Story cards draft" }, "Content lead", "Last month");
    row({ k: "sheet", name: "Training attendance" }, "Programme lead", "Last week");
    row({ k: "sheet", name: "Visit routes" }, "Field coach lead", "Last month");
    row({ k: "slides", name: "Year plan" }, "Programme lead", "Last month");
    root._D = D;
    // the card that drops in, and the white it starts on
    root._white = L.el("div", "abs", null, root); root._white.style.cssText += "inset:0;background:#fff";
    root._drop = L.el("div", "g-drop", `${G.NOTION}<span>Coaching tip redesign</span>`, root);
    // Gmail: the inbox
    const M = G.shell(root, { app: "gmail" });
    M.card.innerHTML = `<div class="g-tb">${G.I.box}${G.I.refresh}${G.I.dots}</div><div class="g-ml"></div>`;
    const ml = M.card.querySelector(".g-ml");
    const mr = L.el("div", "g-row", null, ml);
    const mi = L.el("div", "g-mrow unread", `${G.I.box}${G.I.star}<div class="fr">${L.avatar("Rumi")}Rumi</div>
      <div class="sb"><div class="sl1"><span class="sj">Coaching tip redesign</span><span class="sn"> - ready for your review</span></div></div>
      <div class="g-chips"><div class="g-chip">${G.P.doc}<span>Coaching tip redesign</span></div></div>`, mr);
    const old = [["Programme lead", "Weekly sync notes", "Notes and next steps from today"], ["Field coach lead", "Visit plan for next week", "Routes are in the sheet"],
      ["Content lead", "Story cards draft", "First pass, comments welcome"], ["Data lead", "Dashboard access", "You should have it now"],
      ["Designer", "New poster drafts", "Two options to pick from"], ["Engineer", "Login fix is live", "Let me know if it breaks"]];
    old.forEach(([w, s, n]) => L.el("div", "g-mrow", `${G.I.box}${G.I.star}<div class="fr">${w}</div><div class="sb"><div class="sl1"><span class="sj">${s}</span><span class="sn"> - ${n}</span></div></div>`, ml));
    root._M = M; root._mail = { r: mr, i: mi };
    // stack (default since gate batch 11): Gmail rises as a sheet under the three new files; Drive never leaves.
    // opt.layout "pan" keeps the old side-to-side pan.
    root._stack = !(opt && opt.layout === "pan");
    if (root._stack) {
      const sh = (root._sheet = L.el("div", "abs", null, root));
      sh.style.cssText += ";left:0;right:0;top:700px;height:380px;overflow:hidden;border-radius:30px 30px 0 0;box-shadow:0 -18px 40px rgba(32,33,36,.22);background:#F8FAFD";
      sh.appendChild(M.w); M.w.style.bottom = "auto"; M.w.style.height = "1080px";
      M.card.querySelector(".g-tb").style.display = "none";
      // stack: the older inbox rows are not shown (the frame's foot would slice them); the older Drive rows fade as the sheet rises
      [...M.card.querySelectorAll(".g-ml > .g-mrow")].forEach((e) => (e.style.display = "none"));
      [...M.w.querySelectorAll(".g-nav .g-it:not(.on)")].forEach((e) => (e.style.visibility = "hidden"));
      const fresh = new Set(root._new.map((n) => n.r));
      root._oldRows = [...D.card.querySelectorAll(".g-list > .g-row")].filter((r) => !fresh.has(r));
    }
    root._hl = L.el("div", "s-hl", null, root);
  },
  render(root, t, ev, opt) {
    const L = SCREEN.lib, D = root._D, M = root._M, dur = (this && this.dur) || (opt && opt.dur) || 6634; // the shot's length: the push runs to the end
    const tf = (s) => (/^translateX\(0px\) scale\(1\)$/.test(s) ? "none" : s);
    // ---- the drop: a flat white card shrinks into a file card and falls into the list
    const a = L.tw(t, ev.drop, 350, "io"), b = L.tw(t, ev.drop + 350, 250, "io");
    const C = root._drop;
    const x0 = 360, y0 = 280, w0 = 1200, h0 = 520;             // centred card
    const x1 = 650, y1 = 520, w1 = 900, h1 = 116;              // file card, mid frame
    const x2 = 400, y2 = 124 + 118 + 84, w2 = 1492;        // the first row of the list
    const x = L.lerp(L.lerp(x0, x1, a), x2, b), y = L.lerp(L.lerp(y0, y1, a), y2, b), w = L.lerp(L.lerp(w0, w1, a), w2, b), h = L.lerp(h0, h1, a);
    Object.assign(C.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px", fontSize: L.lerp(84, 40, a) + "px",
      gap: L.lerp(40, 30, a) + "px", borderRadius: L.lerp(L.lerp(28, 14, a), 0, b) + "px", justifyContent: a > 0.5 ? "flex-start" : "center", paddingLeft: L.lerp(L.lerp(0, 30, a), 48, b) + "px", boxShadow: b >= 1 ? "0 0 0 2px #C2E7FF" : "" });
    const lg = C.querySelector("svg"); lg.style.width = lg.style.height = L.lerp(150, 58, a) + "px";
    const fadeC = L.tw(t, ev.files, 160);
    C.style.opacity = 1 - fadeC; C.style.visibility = fadeC >= 1 ? "hidden" : "inherit";
    root._white.style.opacity = 1 - L.tw(t, ev.drop + 100, 450, "io");
    // ---- three files, 150 ms apart; the doc takes the card's place
    root._new.forEach((n, k) => G.grow(n.r, n.i, t, ev.files + 150 * k));
    if (root._stack) {
      // the sheet: Gmail rises under the files in 500 ms, ending as the inbox row lands; Drive holds (gate batch 11, 2C)
      const s = L.tw(t, ev.mail - 500, 500, "outExpo");
      D.w.style.transform = tf(`translateX(0px) scale(${1 + 0.012 * L.tw(t, 0, dur, "sine")})`);
      D.w.style.visibility = "inherit";
      root._sheet.style.transform = s >= 1 ? "none" : `translateY(${Math.round(440 * (1 - s))}px)`;
      root._sheet.style.visibility = s <= 0 ? "hidden" : "inherit";
      const of = 1 - L.tw(t, ev.mail - 500, 250); root._oldRows.forEach((r) => (r.style.opacity = of));
      M.w.style.transform = "none"; M.w.style.visibility = "inherit";
      G.grow(root._mail.r, root._mail.i, t, ev.mail);
      const hl = root._hl;
      if (t < ev.mail - 500) {
        const r0 = L.boxOf(root, root._new[0].i), r2 = L.boxOf(root, root._new[2].i);
        L.hl(hl, { x: r0.x - 8, y: r0.y - 6, w: r0.w + 16, h: r2.y + r2.h - r0.y + 12 }, t, ev.files + 800, ev.mail - 550);
      } else L.hl(hl, L.boxOf(root, root._mail.i, -4), t, ev.hlRow, null);
      return;
    }
    // the pan: Drive leaves left, Gmail comes in from the right
    const u = L.tw(t, ev.swap, 700, "io");
    const push1 = L.tw(t, 0, ev.swap + 700, "sine"), push2 = L.tw(t, ev.swap + 700, dur - ev.swap - 700, "sine");
    D.w.style.transform = tf(`translateX(${-1920 * u}px) scale(${1 + 0.015 * push1})`);
    M.w.style.transform = tf(`translateX(${1920 * (1 - u)}px) scale(${1 + 0.015 * push2})`);
    D.w.style.visibility = u >= 1 ? "hidden" : "inherit";
    M.w.style.visibility = u <= 0 ? "hidden" : "inherit";
    // ---- the inbox row
    const m = root._mail;
    G.grow(m.r, m.i, t, ev.mail);
    // ---- highlights: the three new files; then the attached document
    const hl = root._hl;
    if (t < ev.swap) {
      const r0 = L.boxOf(root, root._new[0].i), r2 = L.boxOf(root, root._new[2].i);
      L.hl(hl, { x: r0.x - 8, y: r0.y - 6, w: r0.w + 16, h: r2.y + r2.h - r0.y + 12 }, t, ev.files + 800, ev.swap - 50);
    } else L.hl(hl, L.boxOf(root, m.i, -4), t, ev.hlRow, null);
  },
});
