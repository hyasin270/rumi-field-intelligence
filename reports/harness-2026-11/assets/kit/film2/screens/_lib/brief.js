/* _lib/brief.js · v2-screens. One object, used on two screens (VL 15.48, v2-visuals 110639 item 1): a brief point
   (Grotesk 500) with its source chip under it. brief-page draws all four; call-notetaker's chat card draws point 1,
   so the viewer sees one thing twice. BR.field(t, ...) is the travelling yellow field's landing: on, then cooling. */
(function () {
  const L = SCREEN.lib;
  if (!document.getElementById("br-css")) {
    const st = document.createElement("style"); st.id = "br-css";
    st.textContent = `.br-pt{position:relative}
.br-pt .tx{font-family:'Poppins',sans-serif;font-weight:500;color:#111418;line-height:1.06}
.br-pt .ch{display:inline-block;margin-top:8px;border-radius:22px;padding:2px 20px 5px;background:#EEF0F2;color:#111418;font-family:'Poppins',sans-serif;font-weight:600;line-height:1.12}
.br-pt .wr{clip-path:inset(0 100% 0 0)}`;
    document.head.appendChild(st);
  }
  const BR = (window.BR = {});
  // the four points of ruling 68 / 70 (v2-lead 105745, 110850): words letter for letter, no full stops
  BR.POINTS = [
    ["Lesson plans changed format on Tuesday", "Source: another team's meeting · Tuesday"],
    ["Field visits are on Thursday this week", "Source: the team chat · Monday"],
    ["Coaching tip redesign is in review", "Source: a Notion page · Wednesday"],
    ["More quizzes opened this week than last", "Source: product data · today"],
  ];
  // a point: o.size (text px), o.chip (chip px)
  BR.point = (parent, i, o) => {
    const [tx, ch] = BR.POINTS[i];
    const e = L.el("div", "br-pt", `<div class="wr"><div class="tx">${tx}</div><span class="ch">${ch}</span></div>`, parent);
    e.querySelector(".tx").style.fontSize = o.size + "px";
    e.querySelector(".ch").style.fontSize = o.chip + "px";
    return e;
  };
  // the words and chip write in, left to right (420 ms)
  BR.write = (e, t, t0, dur) => {
    const u = t < t0 ? 0 : L.E.out(L.clamp01((t - t0) / (dur || 420)));
    e.querySelector(".wr").style.clipPath = u >= 1 ? "none" : `inset(-10px ${(100 * (1 - u)).toFixed(2)}% -10px -10px)`;
  };
  // the yellow field (VL 9.5, the .s-hl look) over box b: on at t0 (in 150 ms), off from t1 (250 ms), or held if t1 null
  BR.field = (el, b, t, t0, t1) => {
    if (!b || t < t0 || (t1 != null && t >= t1 + 250)) { el.style.opacity = 0; return; }
    const a = Math.min(L.clamp01((t - t0) / 150), t1 == null ? 1 : 1 - L.clamp01((t - t1) / 250));
    Object.assign(el.style, { left: b.x + "px", top: b.y + "px", width: b.w + "px", height: b.h + "px", opacity: a });
  };
})();
