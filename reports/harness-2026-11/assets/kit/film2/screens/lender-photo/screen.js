/* lender-photo · shot R1 inset 2 (v2-screens). DESIGN MOCKUP, chip "How it could work".
   The loan officer's phone, chat with Rumi: the farmer's field photo (a flat drawn field, no real
   place) lands, the plot outline draws on in yellow, and one card lands over its corner:
   "Field size" with a tick. Inset layout (VISUAL_LANGUAGE_v2 9.11, 14.10): carrying words 104 px (the inset plays 800 x 450, about 43 px there);
   photo and card together span ~94% of the width.
   Point words (2): "Field size". */
SCREEN.define({
  id: "lender-photo",
  dur: 4000,
  // img: the photo lands. line: the plot outline draws on (1000 ms). card: the card lands. r1: its tick.
  events: { img: 150, line: 650, card: 1900, r1: 2450 },
  build(root) {
    const L = SCREEN.lib, IC = PH.IC;
    const W = (root._W = PH.window(root, { fs: 104, compact: true, hfs: 70, name: "Rumi", who: "Rumi", label: "How it could work" }));
    W.chat.style.cssText += ";justify-content:center;padding:16px 60px 24px";
    const field = `<svg viewBox="0 0 900 600" width="1170" height="780" style="display:block;border-radius:24px">
      <defs><linearGradient id="lpSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE0F4"/><stop offset="1" stop-color="#EAF6FC"/></linearGradient></defs>
      <rect width="900" height="600" fill="url(#lpSky)"/>
      <path d="M0 170 C150 120 260 150 380 135 C520 115 640 150 900 125 V240 H0z" fill="#A8CB8E"/>
      ${Array.from({ length: 16 }, (_, i) => `<circle cx="${20 + i * 58}" cy="${178 + (i % 3) * 4}" r="${24 + (i % 4) * 5}" fill="#6E9C55"/>`).join("")}
      <path d="M0 200 H900 V600 H0z" fill="#8DBF6A"/>
      <path d="M150 215 L900 205 V600 H40z" fill="#B98A5A"/>
      ${Array.from({ length: 14 }, (_, i) => `<path d="M${150 + i * 56} 214 L${40 + i * 68} 600" stroke="#9C7148" stroke-width="5"/>`).join("")}
      <path d="M0 200 H900" stroke="#7FB15C" stroke-width="6"/>
      <polygon class="plot" points="230,255 760,245 830,560 120,570" fill="rgba(255,216,77,0)" stroke="#FFD84D" stroke-width="12" stroke-linejoin="round"/>
      ${[[230, 255], [760, 245], [830, 560], [120, 570]].map(([x, y]) => `<circle class="pc" cx="${x}" cy="${y}" r="16" fill="#FFD84D" stroke="#fff" stroke-width="5"/>`).join("")}
    </svg>`;
    root._img = PH.card(W.chat, { side: "in", html: field });
    root._img.b.style.padding = "14px"; root._img.inner.style.maxWidth = "none";
    root._card = PH.card(W.chat, { side: "in", html: `<div class="wa-cr" style="border:0;padding:.12em .1em"><span class="ct">Field size</span>${IC.ok}</div>` });
    Object.assign(root._card.item.style, { position: "absolute", right: "80px", bottom: "90px" });
    root._card.b.style.boxShadow = "0 14px 36px rgba(11,20,26,.28)";
    root._plot = root._img.b.querySelector(".plot"); root._pcs = [...root._img.b.querySelectorAll(".pc")];
    root._ok = root._card.b.querySelector(".wa-ok");
  },
  render(root, t, ev) {
    const L = SCREEN.lib;
    root._W.w.style.transform = `scale(${1 + 0.015 * L.tw(t, 0, 4000, "sine")})`;
    L.arrive(root._img.inner, t, ev.img, { dur: 420, dy: 30, scale: 0.97 });
    const per = 2 * (530 + 315) + 340, u = L.tw(t, ev.line, 1000, "io");
    root._plot.setAttribute("stroke-dasharray", `${per * u} ${per}`);
    root._plot.setAttribute("fill", `rgba(255,216,77,${0.25 * L.tw(t, ev.line + 900, 400)})`);
    root._pcs.forEach((c, i) => { c.style.opacity = L.tw(t, ev.line + i * 250, 200, "out"); });
    L.arrive(root._card.inner, t, ev.card, { dur: 420, dy: 40, scale: 0.94 });
    const a = L.tw(t, ev.r1, 340, "out");
    root._ok.style.opacity = a; root._ok.style.transform = `scale(${0.3 + 0.7 * L.E.back(a)})`;
  },
});
