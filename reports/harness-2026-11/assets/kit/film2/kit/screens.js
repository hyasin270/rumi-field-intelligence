// screens.js (film2 kit, v2-kit): mount a film2/screens/<id> component full frame, drive it from the shot clock, and push
// in from a device in the room (or any rect) and back out. A shot lists its screens: FILM.shot({ screens: ["slack-notion"] }).
// Contract for v2-screens (API.md section 8): SCREEN.define({ id, build(root), render(root, t, ev), events }) pure in t.
(function () {
  "use strict";
  const tw = FILM.tw, lerp = FILM.lerp;
  // shares v2-screens' SCREEN object (screens/_lib/sdk.js) when it is loaded; never replaces it
  const SC = (window.SCREEN = window.SCREEN || {}); SC.defs = SC.defs || {}; if (!SC.define) SC.define = (d) => { SC.defs[d.id] = d; return d; };
  const DEFS = SC.defs;
  const FULL = { x: 0, y: 0, w: 1920, h: 1080 };
  function rectFrom(src) {
    if (!src) return FULL;
    if (src.isObject3D) return KIT.render.rectOf(src) || FULL;
    if (typeof src === "function") return src();
    return src;
  }
  // VL 9: the panel (1150 x 800 at x 690, y 120). FULL is the plan's full-frame X.
  const PANEL = { x: 690, y: 166, w: 1150, h: 647 };   // VL 9.2 width; height at the screens' 16:9 (VL says 800)
  function mount(k, id, o) {
    o = o || {}; const def = DEFS[id];
    if (!def) throw new Error(`screen "${id}" is not loaded: list it in FILM.shot({ screens: ["${id}"] })`);
    const host = document.getElementById("screens");
    const wrap = document.createElement("div"); wrap.className = "scrwrap"; host.appendChild(wrap);
    const root = document.createElement("div"); root.className = "scr"; wrap.appendChild(root);
    // the shot's length goes to the screen (v2-screens 074335: this.dur / opt.dur)
    const opt = Object.assign({ dur: o.dur || Math.max(1, (FILM.dur || 0) - (o.t0 || 0)) }, o.opt || {});
    def.build(root, opt);
    const ev = Object.assign({}, def.events || {}, o.events || {});
    const t0 = o.t0 || 0, t1 = o.t1 == null ? null : o.t1;
    const target = o.to === "full" ? FULL : o.to === "panel" || !o.to ? (o.full ? FULL : PANEL) : o.to;
    const fit = o.fit || "contain";
    const moves = []; // {t0, dur, kind: in|out, from}
    const S = { root, wrap, def, ev, target };
    S.pushIn = (ta, dur, op) => { moves.push({ t0: ta, dur, kind: "in", from: (op && op.from) || null, fast: !(op && op.fade === "soft"), ease: (op && op.ease) || "outExpo" }); moves.sort((a, b) => a.t0 - b.t0); return S; };
    S.pushOut = (ta, dur, op) => { moves.push({ t0: ta, dur, kind: "out", from: (op && op.to) || null, fast: !(op && op.fade === "soft"), ease: (op && op.ease) || "outExpo" }); moves.sort((a, b) => a.t0 - b.t0); return S; };
    // VL 14.11: reading happens at Full (the whole 1920 x 1080); full(t0) grows the panel to Full in 600 ms, panel(t0) returns
    const states = []; S.full = (ta, dur) => { states.push({ t0: ta, dur: dur || 600, f: 1 }); states.sort((a, b) => a.t0 - b.t0); return S; };
    S.panel = (ta, dur) => { states.push({ t0: ta, dur: dur || 600, f: 0 }); states.sort((a, b) => a.t0 - b.t0); return S; };
    // VL 14.11's default timing: Panel 0 to 1.5 s, 600 ms to grow, Full until the last 1.5 s
    S.read = (tIn, tOut) => { S.full(tIn == null ? (o.t0 || 0) + 1500 : tIn); if (tOut !== false) S.panel(tOut == null ? FILM.dur - 1500 - 600 : tOut); return S; };
    const fullAt = (t) => { let f = target === FULL ? 1 : 0; for (const st of states) { if (st.t0 > t) break; f = lerp(f, st.f, tw(t, st.t0, st.t0 + st.dur, "io")); } return f; };
    // the panel's rect at t (in stage px): a rect for labels to dock to
    S.rect = () => S._r || target;
    S.isFull = (t) => fullAt(t) > 0.5;
    FILM._post.push((t) => {
      const on = t >= t0 && (t1 == null || t < t1);
      if (!on) { wrap.style.visibility = "hidden"; return; }
      let u = moves.length && moves[0].kind === "in" ? 0 : 1, mv = moves[0] || null;
      let op = u;   // v0.8.9: the default is the old fade (0.3 + 1.4u), the film's push for Cut 1 (v2-visuals 205629, VL 15.83); {fade: "soft"} follows the whole move on "out" (v0.8.5), for Cut 2
      for (const m of moves) { if (m.t0 > t) break; mv = m; const e = tw(t, m.t0, m.t0 + m.dur, m.ease || "outExpo"),   /* v0.8.8: {ease: "io"} opt-in (v2-shots-f 205548) */ eo = m.fast ? Math.min(1, 0.3 + 1.4 * e) : tw(t, m.t0, m.t0 + m.dur, "out"); u = m.kind === "in" ? e : 1 - e; op = m.kind === "in" ? eo : 1 - eo; }
      if (u <= 0.0005) { wrap.style.visibility = "hidden"; return; }
      const fa = fullAt(t), tg = { x: lerp(target.x, 0, fa), y: lerp(target.y, 0, fa), w: lerp(target.w, 1920, fa), h: lerp(target.h, 1080, fa) };
      const r0 = mv && mv.from ? rectFrom(mv.from) : tg;
      const r = { x: lerp(r0.x, tg.x, u), y: lerp(r0.y, tg.y, u), w: lerp(r0.w, tg.w, u), h: lerp(r0.h, tg.h, u) }; S._r = r;
      const full = fa >= 0.999 && u >= 0.999;
      wrap.style.visibility = "visible";
      wrap.style.left = r.x + "px"; wrap.style.top = r.y + "px"; wrap.style.width = r.w + "px"; wrap.style.height = r.h + "px";
      wrap.style.borderRadius = full ? "0px" : lerp(8, 26, u) * (1 - fa) + "px"; wrap.style.boxShadow = full ? "none" : "";
      // the content keeps its aspect: contain (the whole screen shows) or cover, centred in the panel
      const sc = fit === "cover" ? Math.max(r.w / 1920, r.h / 1080) : Math.min(r.w / 1920, r.h / 1080);
      root.style.transform = `translate(${(r.w - 1920 * sc) / 2}px,${(r.h - 1080 * sc) / 2}px) scale(${sc})`;
      wrap.style.opacity = Math.max(0, Math.min(1, op));
      def.render(root, t - t0, ev, opt);
    });
    return S;
  }
  KIT.screens = { mount, DEFS };
})();
