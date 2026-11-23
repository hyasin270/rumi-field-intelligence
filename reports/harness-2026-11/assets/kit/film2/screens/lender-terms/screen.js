/* lender-terms · shot R1 inset 4 (v2-screens). DESIGN MOCKUP, chip "How it could work".
   The loan officer's phone, chat with Rumi: draft terms written line by line, with a caret.
   No amounts. Inset layout (VISUAL_LANGUAGE_v2 9.11, 14.10): carrying words 104 px (the inset plays 800 x 450, about 43 px there); card ~85% width.
   Point words (6): "Tractor" + "Two days" + "Repay after harvest". */
SCREEN.define({
  id: "lender-terms",
  dur: 4000,
  // card: the empty card lands. l1..l3: each line is typed (40 characters a second).
  // Ruling 107 (h): the card is whole by about 1.25 s, since R1 shows it for about 1.5 s (Cut 0 cut it at "Tw").
  events: { card: 100, l1: 250, l2: 500, l3: 750 },
  build(root) {
    const IC = PH.IC;
    const W = (root._W = PH.window(root, { fs: 104, compact: true, hfs: 70, name: "Rumi", who: "Rumi", label: "How it could work" }));
    W.chat.style.cssText += ";justify-content:center;padding:20px 60px 40px";
    root._lines = ["Tractor", "Two days", "Repay after harvest"];
    const ics = [IC.tractor, IC.cal, IC.wheat];
    root._card = PH.card(W.chat, { side: "in", width: 1640, html:
      root._lines.map((_, i) => `<div class="wa-cr"><span class="ci">${ics[i]}</span><span class="ct" style="min-height:1.3em"></span></div>`).join("") });
    root._rows = [...root._card.b.querySelectorAll(".wa-cr")];
  },
  render(root, t, ev) {
    const L = SCREEN.lib, T = [ev.l1, ev.l2, ev.l3];
    root._W.w.style.transform = `scale(${1 + 0.015 * L.tw(t, 0, 4000, "sine")})`;
    root._rows.forEach((r, i) => {
      const s = root._lines[i], n = L.typed(s, t, T[i], 40, 5 + i);
      const next = i < 2 ? T[i + 1] : 1e9, on = t >= T[i] && t < next;
      r.querySelector(".ct").innerHTML = s.slice(0, n) + (on && Math.floor(t / 400) % 2 === 0 ? '<span class="s-caret" style="background:#111B21;width:8px"></span>' : "");
      r.querySelector(".ci").style.opacity = L.tw(t, T[i] - 150, 200);
    });
    PH.grow(root._card, t, ev.card);   // after the text: its height depends on it
  },
});
