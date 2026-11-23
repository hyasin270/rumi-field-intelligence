// questions_ease.js (v2-kit, 11 Nov 18:4xZ): shot-side, for the hashed layer.js (v2-check 145707). PRE_SIGN 15, 300 ms for
// a change of state. Asked by v2-shots-d (165624 items 3; 180342): question 4's ring turns to a disc in one frame, and the
// tick lands in about 0.2 s.
//
//   const box = k.ui.questions(t0, { active: 4, ... });
//   questionsEase(box, { active: 4, activeAt: tFourth, tickAt: { 4: tTick }, ms: 300 });
//     active / activeAt: the active row's number circle stays a ring until activeAt, then fills ring to ink disc (and its
//       numeral ink to white) over ms, io. Without activeAt it is a disc from the list's first frame (the layer's way).
//     tickAt: pass the same tickAt as the layer. Each tick fades in over ms (io) and grows from 0.7 to 1 (out), with no
//       overshoot; the row turns quiet over the same ms.
// Call right after k.ui.questions(...). Its post runs after the layer's each frame, so it overrides only these styles.
//
// Load: (function(){const x=new XMLHttpRequest();x.open("GET","snippets/questions_ease.js",false);x.send();(0,eval)(x.responseText+";window.questionsEase=questionsEase;");})();
function questionsEase(box, o) {
  o = o || {}; const ms = o.ms || 300, tickAt = o.tickAt || {};
  const mixHex = (a, b, u) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b);
    return "rgb(" + A.map((v, i) => Math.round(v + (B[i] - v) * u)).join(",") + ")"; };
  const INK = "#111418", PAGE = "#FBFAF7", WHITE = "#FFFFFF", QUIET = "#4A5059";
  const rows = Array.from(box.querySelectorAll(".q"));
  FILM._post.push((t) => {
    rows.forEach((r) => {
      const n = +r.dataset.n, nEl = r.querySelector(".n"), tk = r.querySelector(".tk");
      if (o.active === n && o.activeAt != null) {
        const u = FILM.tw(t, o.activeAt, o.activeAt + ms, "io");
        nEl.style.background = u <= 0 ? "transparent" : mixHex(PAGE, INK, u); nEl.style.color = mixHex(INK, WHITE, u);
        r.style.fontWeight = u < 0.5 ? 500 : 600;
      }
      const ta = tickAt[n];
      if (ta != null) {
        if (t < ta) { tk.style.opacity = 0; tk.style.transform = "scale(0)"; return; }
        const u = FILM.tw(t, ta, ta + ms, "io"), s = 0.7 + 0.3 * FILM.tw(t, ta, ta + ms, "out");
        tk.style.opacity = u; tk.style.transform = `scale(${s})`;
        if (o.active !== n) r.style.color = mixHex(INK, QUIET, u);
      }
    });
  });
  return box;
}
