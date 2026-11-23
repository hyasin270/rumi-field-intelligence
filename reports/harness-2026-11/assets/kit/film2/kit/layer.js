// layer.js (film2 kit, v2-kit): the 2D layer over the picture. Name card, stamp, the five questions, the number card,
// labels pinned to points in the room, free text, and the small effect marks over a sprite's head. Words carry class "w"
// so the lint can check graphics-safe. Shots pass words and points; sizes, colours and fades live here and in kit.css.
(function () {
  "use strict";
  const tw = FILM.tw, clamp01 = FILM.clamp01;
  // the plan's short forms (FILM_V2_PLAN.md 3.5)
  // ruling 113 B (v2-lead 193548): lines 1, 4, 5 take the spoken words; line 5 breaks after "when" (v2-visuals 193910, VL 15.78)
  const QUESTIONS = ["Do they know our rules?", "Where do we talk to them?", "How do they find out?", "Does the work sound like us?", "What happens when<br>the volume grows?"];
  function el(parent, cls, html) { const d = document.createElement("div"); d.className = cls; if (html != null) d.innerHTML = html; parent.appendChild(d); return d; }
  function set(d, o, x, y, sc) { d.style.opacity = o; d.style.visibility = o <= 0.002 ? "hidden" : "visible"; d.style.transform = `translate(${x || 0}px,${y || 0}px) scale(${sc == null ? 1 : sc})`; }
  // in, hold, out: 0..1
  const life = (t, t0, t1, tin, tout) => tw(t, t0, t0 + (tin || 450), "outExpo") * (t1 == null ? 1 : 1 - tw(t, t1 - (tout || 400), t1, "io"));

  function make(k) {
    const ui = document.getElementById("ui");
    const post = (fn) => FILM._post.push(fn);
    const L = {};
    L.text = function (id, t0, t1, html, o) {
      o = o || {}; const d = el(ui, "abs w " + (o.cls || ""), html);
      post((t) => { const v = life(t, t0, t1); set(d, v, o.x || 0, (o.y || 0) + 16 * (1 - tw(t, t0, t0 + 500, "outExpo"))); });
      return d;
    };
    // the name card (VL section 8): a white card grows from the object (450 ms) to x 1200, y 150; the name alone in green
    // serif lands at t0 with the "name" cue; one second of rest, the object pulses once; the gloss writes on (at most 14
    // words); an optional number counts up under it; at o.dock.t the card shrinks to a docked label beside its room (600 ms).
    L.nameCard = function (t0, o) {
      o = o || {}; const t1 = o.t1 || null;
      const box = el(ui, "abs namecard"); const nm = el(box, "name w", o.name);
      const gl = o.gloss || o.stamp ? el(box, "gloss w", o.gloss || o.stamp) : null;
      const nb = o.number ? el(box, "num w", "") : null, nu = o.number && o.number.unit ? el(box, "unit w", o.number.unit) : null;
      const sm = o.small ? el(box, "small w", o.small) : null;
      let glH = 0; if (gl) { glH = gl.scrollHeight + 4; gl.style.overflow = "hidden"; }
      k.cue(t0, "name", { text: o.name });
      const X = o.x != null ? o.x : 1200, Y = o.y != null ? o.y : 150, tin = t0 - (o.rise != null ? o.rise : 450);
      // ruling 167 (4), 168 (i) (v2-shots-d): o.lineAt = when the gloss/stamp and small lines come in, ms after t0 (default 1100, as
      // before); o.rise = how long the card grows in before t0 (default 450). Defaults leave every other render as it was.
      const gd = (o.lineAt != null ? o.lineAt : 1100) - 1100;
      if (o.from && o.from.isObject3D) { const obj = o.from, s0 = obj.scale.clone(); k.track({ eval(t) { const u = FILM.clamp01((t - t0 - 1000) / 380); obj.scale.copy(s0).multiplyScalar(1 + 0.06 * Math.sin(Math.PI * u)); } }); }
      const dk = o.dock ? L.dock(o.dock.t + 450, { text: o.dock.text || o.name, small: o.dock.small, at: o.dock.at, side: o.dock.side }) : null;
      post((t) => {
        if (t < tin || (t1 != null && t > t1) || (o.dock && t > o.dock.t + 600)) { box.style.visibility = "hidden"; return; }
        let src = o.from ? KIT.render.project(o.from.isObject3D ? new THREE.Box3().setFromObject(o.from).getCenter(new THREE.Vector3()) : o.from) : { x: X + 300, y: Y + 120 };
        // VL 14.3: as wide as its longest line plus 44 px each side; as tall as the name until the gloss arrives (grows 250 ms)
        const wN = box.offsetWidth, hN = box.offsetHeight, X2 = Math.min(Math.max(X, 96), 1824 - wN), Y2 = Math.min(Math.max(Y, 60), 1020 - hN);
        // v0.8.7: soft (KIT.layer.SOFT_CARD, or {soft: true}) grows on "io" and fades in over 300 ms, and leaves over 300 ms
        // (PRE_SIGN 15; v2-shots-d 202923, v2-visuals 203000). Off by default until v2-visuals switches it.
        const soft = o.soft != null ? o.soft : KIT.layer.SOFT_CARD === true;
        const g = tw(t, tin, t0, soft ? "io" : "outExpo"), x = FILM.lerp(src.x, X2, g), y = FILM.lerp(src.y, Y2, g), sc = FILM.lerp(0.15, 1, g);
        let v = soft ? tw(t, tin, tin + 300, "io") : Math.min(1, g * 3), xx = x, yy = y, ss = sc;
        if (o.dock && t > o.dock.t) { const d = tw(t, o.dock.t, o.dock.t + 600, "io"), dp = dk.anchorXY(); xx = FILM.lerp(x, dp.x, d); yy = FILM.lerp(y, dp.y, d); ss = FILM.lerp(sc, 0.42, d); v = 1 - d; }
        if (t1 != null) v *= 1 - (soft ? tw(t, t1 - 300, t1, "io") : tw(t, t1 - 250, t1, "in"));
        set(box, v, xx, yy, ss);
        nm.style.opacity = 1;   // VL 6.6: a card is never on screen without its words (the name grows with the box from tin)
        if (gl) { const s1 = tw(t, t0 + 1000 + gd, t0 + 1250 + gd, "out"); gl.style.opacity = tw(t, t0 + 1100 + gd, t0 + 1450 + gd, "outExpo"); gl.style.maxHeight = (s1 * glH) + "px"; gl.style.marginTop = (14 * s1) + "px"; }
        if (nb) { const u = tw(t, t0 + 1300, t0 + 1300 + (o.number.dur || 1500), "out"); nb.textContent = (o.number.prefix || "") + Math.round(FILM.lerp(o.number.from || 0, o.number.value, u)).toLocaleString("en-GB") + (o.number.suffix || ""); nb.style.opacity = tw(t, t0 + 1200, t0 + 1500); if (nu) nu.style.opacity = nb.style.opacity; }
        if (sm) sm.style.opacity = tw(t, t0 + 1500 + gd, t0 + 1900 + gd);
      });
      return box;
    };
    // a docked label (VL 10.2): west rooms right-aligned in a column ending at x 500, east rooms left-aligned from x 1420;
    // at the height of its point; a 3 px leader to a 16 px dot on the room's side wall. Once docked it never moves.
    L.dock = function (t0, o) {
      const west = o.side ? o.side === "west" : KIT.render.project(o.at).x < 960;
      const d = el(ui, "abs pin w" + (west ? " r" : ""), o.text + (o.small ? `<small>${o.small}</small>` : "")), ln = el(ui, "lead"), dt = el(ui, "dot");
      const lights = [];
      const api = { el: d, line: ln, dot: dt,
        // the label turns green for its beat (VL 15: the lit name), 250 ms in and out
        light(ta, dur) { lights.push([ta, dur || 1500]); return api; },
        anchorXY() { const a = KIT.render.project(typeof o.at === "function" ? o.at() : o.at); const w = d.offsetWidth, h = d.offsetHeight; return { x: west ? (o.x || 500) - w : o.x || 1420, y: o.y != null ? o.y : a.y - h / 2 }; } };
      post((t) => {
        if (t < t0 || (o.t1 != null && t > o.t1)) { d.style.visibility = ln.style.visibility = dt.style.visibility = "hidden"; return; }
        ln.style.visibility = dt.style.visibility = "visible";
        const v = tw(t, t0, t0 + 450, "outExpo"), a = KIT.render.project(typeof o.at === "function" ? o.at() : o.at), p = api.anchorXY(), h = d.offsetHeight;
        let lit = 0; for (const [ta, du] of lights) lit = Math.max(lit, tw(t, ta, ta + 250, "io") * (1 - tw(t, ta + du - 250, ta + du, "io")));
        d.style.color = lit > 0.5 ? "#001F3F" : ""; dt.style.background = lit > 0.5 ? "#E8A200" : "";
        set(d, v, p.x + (1 - v) * (west ? -24 : 24), p.y);
        const sx = west ? p.x + d.offsetWidth + 18 : p.x - 18, sy = p.y + h / 2, ddx = a.x - sx, ddy = a.y - sy, len = Math.hypot(ddx, ddy) * tw(t, t0 + 100, t0 + 600, "out");
        ln.style.left = sx + "px"; ln.style.top = sy - 1.5 + "px"; ln.style.width = len + "px"; ln.style.transform = `rotate(${Math.atan2(ddy, ddx)}rad)`; ln.style.opacity = v * 0.85;
        dt.style.left = a.x + "px"; dt.style.top = a.y + "px"; dt.style.opacity = v * tw(t, t0 + 400, t0 + 650); dt.style.transform = `scale(${tw(t, t0 + 400, t0 + 750, "back")})`;
      });
      return api;
    };
    // the one line (P2, E2): serif, large, centred; an optional small line under it
    L.title = function (t0, o) {
      // VL 15.11: Serif 600 84 px, at most 1,500 px wide, two balanced lines (pass "\n" or <br> where it breaks), centred on
      // x 960, between y 130 and 330
      const t1 = o.t1 || null, box = el(ui, "abs title"); const ln = el(box, "line w", String(o.line).replace(/\n/g, "<br>")); const sm = o.small ? el(box, "small w", o.small) : null;
      post((t) => { const v = life(t, t0, t1, 600, 400); set(box, v, (o.x != null ? o.x : 960 - box.offsetWidth / 2), (o.y != null ? o.y : 130) + 18 * (1 - tw(t, t0, t0 + 700, "outExpo")));
        if (sm) sm.style.opacity = tw(t, t0 + (o.smallAfter || 900), t0 + (o.smallAfter || 900) + 450); });
      return box;
    };
    // a strip of n dots with labels; dot i lights at on[i] (ms)
    L.dots = function (t0, o) {
      const box = el(ui, "abs dots"), n = o.n || 3, on = o.on || {}, labels = o.labels || [];
      const ds = []; for (let i = 0; i < n; i++) { const d = el(box, "d", `<i></i><span class="w">${labels[i] || ""}</span>`); ds.push(d); }
      post((t) => { set(box, life(t, t0, o.t1 || null), o.x || 640, o.y || 860); ds.forEach((d, i) => { const ta = on[i]; const u = ta != null ? tw(t, ta, ta + 300, "back") : 0; d.classList.toggle("on", u > 0.5); d.querySelector("i").style.transform = `scale(${0.8 + 0.25 * u})`; }); });
      return box;
    };
    // a pull card (VL 9.10): a white card with a title, an agent's coral name chip, a small line
    L.pull = function (t0, o) { return L.text("pull", t0, o.t1, `<div class="pull"><div class="t">${o.title || ""}</div>${o.by ? `<div class="by">${o.by}</div>` : ""}${o.line ? `<div class="pw">${o.line}</div>` : ""}</div>`, { x: o.x || 1240, y: o.y || 160 }); };
    // the route (VL 15.3): one green line on the cut face, drawn behind the agent it follows (never ahead), and it stays;
    // a 14 px dot at each point marked dot:true once passed. points: [[x,y,z] | {at:[x,y,z], dot:true}]; follow: an agent,
    // or keys: [[t, s]] with s the share of the line drawn (0..1).
    L.route = function (t0, o) {
      const NS = "http://www.w3.org/2000/svg", svg = document.createElementNS(NS, "svg"); svg.setAttribute("width", 1920); svg.setAttribute("height", 1080);
      svg.style.cssText = "position:absolute;left:0;top:0;overflow:visible"; ui.insertBefore(svg, ui.firstChild);
      // v0.8.1 (v2-visuals 134906 item 4, VL 15.3): the same path first in white, 2 px wider each side, so the line reads over green
      const edge = document.createElementNS(NS, "polyline"); edge.setAttribute("fill", "none"); edge.setAttribute("stroke", "#ffffff"); edge.setAttribute("stroke-width", (o.width || 8) + 4);
      edge.setAttribute("stroke-linecap", "round"); edge.setAttribute("stroke-linejoin", "round"); if (o.edge !== false) svg.appendChild(edge);
      const line = document.createElementNS(NS, "polyline"); line.setAttribute("fill", "none"); line.setAttribute("stroke", o.colour || "#E8A200"); line.setAttribute("stroke-width", o.width || 8);
      line.setAttribute("stroke-linecap", "round"); line.setAttribute("stroke-linejoin", "round"); svg.appendChild(line);
      const pts = o.points.map((p) => (Array.isArray(p) ? { at: new THREE.Vector3(...p), dot: false } : { at: new THREE.Vector3(...p.at), dot: !!p.dot }));
      const seg = []; let L3 = 0; for (let i = 1; i < pts.length; i++) { const l = pts[i].at.distanceTo(pts[i - 1].at); seg.push(l); L3 += l; }
      const dots = pts.map((p) => { if (!p.dot) return null; const c = document.createElementNS(NS, "circle"); c.setAttribute("r", 7); c.setAttribute("fill", o.colour || "#E8A200"); if (o.edge !== false) { c.setAttribute("stroke", "#ffffff"); c.setAttribute("stroke-width", 4); c.setAttribute("paint-order", "stroke"); } svg.appendChild(c); return c; });
      // the share of the line nearest an agent's place (x, y on the cut face), never going back
      const nearest = (p) => { let best = 0, bd = 1e9, acc = 0; for (let i = 1; i < pts.length; i++) { const a = pts[i - 1].at, b = pts[i].at, ab = b.clone().sub(a), u = FILM.clamp01(((p.x - a.x) * ab.x + (p.y - a.y) * ab.y) / Math.max(1e-6, ab.x * ab.x + ab.y * ab.y)); const q = a.clone().addScaledVector(ab, u), d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; best = acc + u * seg[i - 1]; } acc += seg[i - 1]; } return best / L3; };
      const shareAt = (t) => {
        if (t < t0) return 0;
        if (o.keys) { let v = 0; for (let i = 0; i < o.keys.length; i++) { const [kt, ks] = o.keys[i]; if (t >= kt) v = ks; else { const [pt, ps] = i ? o.keys[i - 1] : [t0, 0]; v = FILM.lerp(ps, ks, FILM.clamp01((t - pt) / Math.max(1, kt - pt))); break; } } return v; }
        if (o.follow) { let m = 0; for (let tt = t0; tt <= t + 1e-6; tt += 100) m = Math.max(m, nearest(o.follow.where(tt))); return Math.max(m, nearest(o.follow.where(t))); }
        return 1;
      };
      post((t) => {
        if (t < t0 || (o.t1 != null && t > o.t1)) { svg.style.display = "none"; return; } svg.style.display = "";   // v0.8.10: display, so a dot's own "visible" cannot outlive t1 (v2-shots-c 212902)
        const sh = shareAt(t) * L3; let acc = 0; const out = [KIT.render.project(pts[0].at)];
        for (let i = 1; i < pts.length; i++) { const l = seg[i - 1]; if (acc + l <= sh) out.push(KIT.render.project(pts[i].at)); else { const u = (sh - acc) / l; if (u > 0) out.push(KIT.render.project(pts[i - 1].at.clone().lerp(pts[i].at, u))); break; } acc += l; }
        const P_ = out.map((q) => q.x.toFixed(1) + "," + q.y.toFixed(1)).join(" "); line.setAttribute("points", P_); edge.setAttribute("points", P_);
        let a2 = 0; pts.forEach((p, i) => { if (i) a2 += seg[i - 1]; const c = dots[i]; if (!c) return; const on = a2 <= sh + 1e-6; c.style.visibility = on ? "visible" : "hidden"; if (on) { const q = KIT.render.project(p.at); c.setAttribute("cx", q.x); c.setAttribute("cy", q.y); } });
      });
      return { svg, shareAt };
    };
    // speech seen travelling (VL 15.7): short navy dashes leave a person's head and reach a point, three at a time, 400 ms each
    L.dashes = function (t0, o) {
      const n = o.count || 9, every = o.every || 400, ds = []; for (let i = 0; i < n; i++) { const d = el(ui, "abs dash"); ds.push(d); }
      post((t) => { const A = KIT.render.project(typeof o.from === "function" ? o.from() : o.from), B = KIT.render.project(typeof o.to === "function" ? o.to() : o.to), ang = Math.atan2(B.y - A.y, B.x - A.x);
        ds.forEach((d, i) => { const ts = t0 + Math.floor(i / 3) * every + (i % 3) * 130, u = (t - ts) / every; if (u < 0 || u > 1 || (o.t1 != null && t > o.t1)) { d.style.visibility = "hidden"; return; }
          d.style.visibility = "visible"; d.style.opacity = 1; d.style.transform = `translate(${FILM.lerp(A.x, B.x, u) - 14}px,${FILM.lerp(A.y, B.y, u) - 3}px) rotate(${ang}rad)`; }); });
    };
    L.stamp = function (t0, o) { return L.text("stamp", t0, o.t1 || t0 + 3000, `<div class="stamp">${o.text}</div>`, { x: o.x || 96, y: o.y || 900 }); };
    // the five questions: a list on the left; the active one dark; ticks land at tickAt[n] (ms) with a "tick" cue
    L.questions = function (t0, o) {
      o = o || {}; const t1 = o.t1 || null; const box = el(ui, "abs qlist");
      const rows = (o.show || [1, 2, 3, 4, 5]).map((n) => { const r = el(box, "q w" + (/<br>/.test(QUESTIONS[n - 1]) ? " wrap" : ""), `<span class="n">${n}</span><span class="tx">${QUESTIONS[n - 1]}</span><span class="tk">✓</span>`); r.dataset.n = n; return r; });
      const ticked = new Set(o.ticked || []), tickAt = o.tickAt || {};
      for (const n in tickAt) k.cue(tickAt[n], "tick", { q: +n });
      if (o.active) k.cue(t0, "question", { q: o.active });
      post((t) => {
        set(box, life(t, t0, t1, 600, 300), (o.x || 1168) - 48, (o.y || 300) - 38);   // VL 14.1: the first line's centre at y 300; VL 15.78: the 46 px block is 700 px wide and its ink ends at x 1823 (x 1168 is still the place shots name); leaving 300 ms (v2-shots-b 181813)
        rows.forEach((r, i) => {
          const n = +r.dataset.n, on = n === o.active, wa = o.writeAt && o.writeAt[n] != null ? o.writeAt[n] : t0 + i * 90, wr = tw(t, wa, wa + 450, "outExpo");
          r.style.transform = `translateX(${-24 * (1 - wr)}px)`;
          r.style.opacity = wr; r.classList.toggle("on", on);
          const tk = r.querySelector(".tk"), ta = tickAt[n], done = ticked.has(n) || (ta != null && t >= ta);
          const s = ta != null ? tw(t, ta, ta + 420, "back") : 1; tk.style.opacity = done ? 1 : 0; tk.style.transform = `scale(${done ? s : 0})`; r.classList.toggle("done", done && !on);
        });
      });
      return box;
    };
    // a number that counts up; on screen for at most hold ms (plan: three seconds or less)
    L.number = function (t0, o) {
      const hold = o.stay ? Infinity : Math.min(o.hold || 3000, 3000), t1 = o.stay ? null : t0 + hold; const box = el(ui, "abs numcard"); const num = el(box, "num w", ""); const unit = o.unit ? el(box, "unit w", o.unit) : null;
      post((t) => {
        const u = tw(t, t0 + 100, t0 + 100 + (o.dur || 1500), o.ease || "out"); const v = Math.round(FILM.lerp(o.from != null ? o.from : 0, o.value, u));
        num.textContent = (o.prefix || "") + (o.format === "raw" ? String(v) : v.toLocaleString("en-GB")) + (o.suffix || "");
        let x = o.x != null ? o.x : 1300, y = o.y != null ? o.y : 220;
        if (o.at) { const a = KIT.render.project(typeof o.at === "function" ? o.at() : o.at); x = a.x - box.offsetWidth / 2; y = a.y - box.offsetHeight / 2; }
        set(box, life(t, t0, t1, 400, 400), x, y);
      });
      return box;
    };
    // a label pinned to a point in the room: words, a leader line and a dot on the point
    L.pin = function (t0, o) {
      const t1 = o.t1 || null, d = el(ui, "abs pin w" + (o.side === "left" ? " r" : ""), o.text + (o.small ? `<small>${o.small}</small>` : "")), ln = el(ui, "lead"), dt = el(ui, "dot");
      post((t) => {
        const v = life(t, t0, t1), a = KIT.render.project(typeof o.at === "function" ? o.at() : o.at), w = d.offsetWidth, h = d.offsetHeight;
        const dx = o.dx != null ? o.dx : o.side === "left" ? -180 : 180, dy = o.dy != null ? o.dy : -90;
        const lx = a.x + dx - (o.side === "left" ? w : 0), ly = a.y + dy - h / 2;
        set(d, v, lx + (1 - v) * (o.side === "left" ? -20 : 20), ly);
        const sx = o.side === "left" ? lx + w + 14 : lx - 14, sy = ly + h / 2, ddx = a.x - sx, ddy = a.y - sy, len = Math.hypot(ddx, ddy) * tw(t, t0 + 100, t0 + 600, "out");
        ln.style.left = sx + "px"; ln.style.top = sy - 1.5 + "px"; ln.style.width = len + "px"; ln.style.transform = `rotate(${Math.atan2(ddy, ddx)}rad)`; ln.style.opacity = v * 0.85;
        dt.style.left = a.x + "px"; dt.style.top = a.y + "px"; dt.style.opacity = v * tw(t, t0 + 400, t0 + 650); dt.style.transform = `scale(${tw(t, t0 + 400, t0 + 750, "back")})`;
      });
      return d;
    };
    return L;
  }
  // small marks over a head: spark, drop, z, question, bang, tick, stop
  const GLYPH = {
    spark: '<svg viewBox="-20 -20 40 40"><g stroke="#111418" stroke-width="3.2" stroke-linecap="round"><path d="M0-17v8M0 9v8M-17 0h8M9 0h8M-12-12l5 5M7 7l5 5M12-12l-5 5M-7 7l-5 5"/></g></svg>',
    drop: '<svg viewBox="-12 -16 24 32"><path d="M0-14C4-6 9-1 9 5a9 9 0 0 1-18 0c0-6 5-11 9-19z" fill="#9cc7e6" stroke="#111418" stroke-width="2.4"/></svg>',
    // drawn as paths, never as font glyphs (a first draw rasterised a text glyph differently: determinism)
    z: '<svg viewBox="0 0 40 40"><path d="M5 14h14L5 32h14M23 6h10L23 18h10" fill="none" stroke="#111418" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    question: '<svg viewBox="0 0 30 40"><path d="M7 12a8 8 0 1 1 11 7.4c-2 .9-3 2.4-3 4.6v2" fill="none" stroke="#111418" stroke-width="5" stroke-linecap="round"/><circle cx="15" cy="34" r="3.2" fill="#111418"/></svg>',
    bang: '<svg viewBox="0 0 20 40"><path d="M10 5v20" stroke="#F06E42" stroke-width="6.5" stroke-linecap="round"/><circle cx="10" cy="34" r="3.8" fill="#F06E42"/></svg>',
    tick: '<svg viewBox="-16 -16 32 32"><circle r="14" fill="#E8A200"/><path d="M-7 0l5 5 9-10" stroke="#fff" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    stop: '<svg viewBox="-16 -16 32 32"><circle r="14" fill="#fff" stroke="#111418" stroke-width="3"/><path d="M-8 0h16" stroke="#111418" stroke-width="4" stroke-linecap="round"/></svg>',
  };
  function fxMark(k, o) {
    const fx = document.getElementById("fx"), d = document.createElement("div"); d.className = "fxm"; d.innerHTML = GLYPH[o.kind] || GLYPH.spark; fx.appendChild(d);
    const dur = o.dur || (o.kind === "z" ? 2400 : 900), size = o.size || 56;
    d.style.width = d.style.height = size + "px";
    FILM._post.push((t) => {
      if (t < o.t0 || t > o.t0 + dur) { d.style.visibility = "hidden"; return; }
      const hp = o.anchor(), a = KIT.render.project(hp), b0 = KIT.render.project(hp.clone().add(new THREE.Vector3(0, -1, 0))), pxm = Math.max(20, Math.abs(b0.y - a.y));
      const u = (t - o.t0) / dur, v = tw(t, o.t0, o.t0 + 160, "out") * (1 - tw(t, o.t0 + dur * 0.7, o.t0 + dur, "io"));
      const sz = Math.max(28, Math.min(90, pxm * 0.17)); d.style.width = d.style.height = sz + "px";
      const rise = o.kind === "z" || o.kind === "drop" ? -30 * u : -8 * u, s = o.kind === "spark" ? 0.6 + 0.6 * tw(t, o.t0, o.t0 + 300, "back") : tw(t, o.t0, o.t0 + 260, "back");
      d.style.visibility = "visible"; d.style.opacity = v; d.style.transform = `translate(${a.x + (o.dx != null ? o.dx : 0) - sz / 2}px,${a.y + (o.dy != null ? o.dy : -20) + rise - sz}px) scale(${s})`;
    });
  }
  KIT.layer = { make, fxMark, QUESTIONS, SOFT_CARD: /[?&]softcard=1/.test(location.search) };   // v0.8.7: off unless the page asks (render_shot --qs softcard=1)
})();
