/* lender-record · shot R1 inset 3 (v2-screens). DESIGN MOCKUP, chip "How it could work".
   The loan officer's phone, chat with Rumi: the farmer's repayment record as ONE filled card,
   two different past loans in ink, each with an "On time" tick that lands one at a time
   (v2-visuals 090900 item 2, taken by v2-lead ruling 50). The card lands whole (opacity and scale,
   300 ms), never row by row, so no frame shows it half built.
   Inset layout (VISUAL_LANGUAGE_v2 9.11, 14.10): carrying words 104 px (the inset plays 700 x 394, about 38 px there); the card fills ~85% width.
   Point words (11): "Repayment record" / "Seed loan" / "Fertiliser loan" / "On time" (x2).
   Ruling 106 (c): the card carries a source chip in 3B2's form (chat-answer's .src), "From the officers' weekly meeting",
   part of the card so it lands with it; at src the one highlight moves to it and holds. */
SCREEN.define({
  id: "lender-record",
  dur: 3800,
  // card: the record lands whole. k1, k2: the "On time" tick lands on each loan. src: the highlight moves to the source chip.
  events: { card: 150, k1: 650, k2: 1250, src: 2300 },
  build(root) {
    const IC = PH.IC;
    const W = (root._W = PH.window(root, { fs: 104, compact: true, hfs: 70, name: "Rumi", who: "Rumi", label: "How it could work" }));
    W.chat.style.cssText += ";justify-content:center;padding:20px 60px 40px";
    const st = document.createElement("style");
    st.textContent = `.lr-h{font-weight:700;color:#111B21;padding:.1em .1em .25em;border-bottom:3px solid #F0F2F5}
.lr .wa-cr .ct{color:#111B21}
.lr-ok{display:flex;align-items:center;gap:.25em;font-weight:600;color:#008069;font-size:.9em}
.lr-ok svg{width:.9em;height:.9em}
.lr-src{display:inline-flex;align-items:center;gap:.3em;margin:.35em 0 .1em .1em;font-size:.72em;font-weight:500;color:#54656F;border:3px solid #E1E1E1;border-radius:.3em;padding:.12em .4em .16em}
.lr-src svg{width:.85em;height:.85em;flex:none}`;
    document.head.appendChild(st);
    const row = (name) => `<div class="wa-cr"><span class="ci">${IC.coin}</span><span class="ct">${name}</span><span class="lr-ok">On time${IC.ok}</span></div>`;
    root._card = PH.card(W.chat, { side: "in", width: 1640, html: `<div class="lr"><div class="lr-h">Repayment record</div>${row("Seed loan")}${row("Fertiliser loan")}<div class="lr-src"><svg viewBox="0 0 24 24"><path d="M5 4h14v4H5zM5 10h10v4H5zM5 16h14v4H5z" fill="#9B9A97"/><path d="M5 10h10v4H5z" fill="#1264A3"/></svg>From the officers’ weekly meeting</div></div>` });
    PH.show(root._card, true);
    root._hl = SCREEN.lib.el("div", "s-hl", null, root);
    root._oks = [...root._card.b.querySelectorAll(".lr-ok")]; root._rows = [...root._card.b.querySelectorAll(".wa-cr"), root._card.b.querySelector(".lr-src")];
  },
  render(root, t, ev) {
    const L = SCREEN.lib;
    root._W.w.style.transform = `scale(${1 + 0.015 * L.tw(t, 0, 3800, "sine")})`;
    L.arrive(root._card.inner, t, ev.card, { dur: 300, dy: 20, scale: 0.97 });
    [ev.k1, ev.k2].forEach((tk, i) => {
      const a = L.tw(t, tk, 340, "out");
      const o = root._oks[i]; o.style.opacity = a; o.style.transform = a >= 1 ? "none" : `scale(${0.4 + 0.6 * L.E.back(a)})`;
    });
    const K = [ev.k1, ev.k2, ev.src], hi = t >= ev.src ? 2 : t >= ev.k2 ? 1 : 0;
    L.hl(root._hl, L.boxOf(root, root._rows[hi], 4), t, K[hi], hi < 2 ? K[hi + 1] : null);
  },
});
