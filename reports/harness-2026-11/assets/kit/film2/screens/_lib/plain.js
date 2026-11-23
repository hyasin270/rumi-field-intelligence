/* film2/screens/_lib/plain.js · v2-screens (plain subagent), 2026-11-11.
   The shared look for REBUILT screens: where the real thing is a terminal or a source file
   (skill list, hook refusal, judge's note, team board) we draw a plain, friendly screen in our
   own look. White page, ink #111418, coral #F06E42 for the agent, green #001F3F for names,
   Poppins for UI, Fredoka for headings, soft rounded cards, generous space.
   No type under 36 px. */
(function () {
  const L = SCREEN.lib;
  const css = `
.pl{position:absolute;left:0;top:0;width:1920px;height:1080px;background:#fff;color:#111418;font-family:'Poppins',sans-serif;overflow:hidden;transform-origin:50% 50%}
.pl-card{position:absolute;background:#fff;border-radius:32px;box-shadow:0 18px 50px rgba(17,20,24,.09),0 0 0 2px #ECEAE6}
.pl-h{font-family:'Fredoka',serif;font-weight:600;color:#111418;letter-spacing:-0.01em;line-height:1.1}
.pl-k{font:600 36px/1 'Poppins',sans-serif;color:#6A6F76;letter-spacing:.02em}
.pl-row{display:flex;align-items:center;gap:26px;border-radius:20px;position:relative}
.pl-dot{flex:none;width:18px;height:18px;border-radius:50%;background:#C9CCD1}
.pl-chip{display:inline-flex;align-items:center;border-radius:999px;padding:8px 24px;font:600 36px/1.1 'Poppins',sans-serif;white-space:nowrap}
.pl-chip.coral{background:#FDE7DF;color:#B4451F}
.pl-chip.ink{background:#EEF0F2;color:#111418}
.pl-bar{height:26px;border-radius:13px;background:#E6E8EB}
.pl-num{flex:none;width:76px;text-align:right;font:500 40px/1 'Poppins',sans-serif;color:#9AA0A7;font-variant-numeric:tabular-nums}
.pl-name{color:#001F3F;font-weight:600}
.pl-hl{position:absolute;border-radius:18px;background:rgba(240,110,66,.13);box-shadow:inset 8px 0 0 #F06E42;pointer-events:none;opacity:0}
.pl-tag{position:absolute;font:600 36px/1 'Poppins',sans-serif;color:#6A6F76;border:2px solid #DADDE1;border-radius:999px;padding:10px 26px;background:#fff}
`;
  if (!document.getElementById("pl-css")) { const s = document.createElement("style"); s.id = "pl-css"; s.textContent = css; document.head.appendChild(s); }

  const PL = {};
  PL.INK = "#111418"; PL.CORAL = "#F06E42"; PL.GREEN = "#001F3F";
  // the white page every rebuilt screen sits on (push/zoom it as a whole)
  PL.page = (root) => L.el("div", "pl", null, root);
  // a soft rounded card at a fixed place
  PL.card = (parent, x, y, w, h, cls) => {
    const c = L.el("div", "pl-card" + (cls ? " " + cls : ""), null, parent);
    Object.assign(c.style, { left: x + "px", top: y + "px", width: w + "px" }); if (h) c.style.height = h + "px";
    return c;
  };
  // a box in root pixels (the root may be scaled by the kit)
  PL.box = (root, e, pad) => {
    pad = pad || 0; const rr = root.getBoundingClientRect(), sc = rr.width / 1920, b = e.getBoundingClientRect();
    return { x: (b.left - rr.left) / sc - pad, y: (b.top - rr.top) / sc - pad, w: b.width / sc + 2 * pad, h: b.height / sc + 2 * pad };
  };
  PL.place = (e, b) => Object.assign(e.style, { left: b.x + "px", top: b.y + "px", width: b.w + "px", height: b.h + "px" });
  // a slow push on a whole page (1 to 2%), from t0 over dur
  PL.push = (pg, t, t0, dur, amt) => { const u = L.tw(t, t0, dur, "sine"), s = 1 + (amt || 0.02) * u; pg.style.transform = `scale(${s})`; pg._s = s; return s; };
  // a root-pixel box (from SCREEN.lib.boxOf) turned into the page's own pixels, so a highlight placed
  // inside the page moves with its push (keeps one composited layer; redraws stay pixel-identical)
  PL.inPage = (pg, b) => { if (!b) return b; const s = pg._s || 1; return { x: 960 + (b.x - 960) / s, y: 540 + (b.y - 540) / s, w: b.w / s, h: b.h / s }; };
  window.PL = PL;
})();
