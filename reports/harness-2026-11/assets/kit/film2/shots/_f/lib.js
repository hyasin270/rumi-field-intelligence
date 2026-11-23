// shots/_f/lib.js · v2-shots-f shared helpers (2.0, 2A, 2B2; 5Db, 5Dc). Loaded after shots/_c/lib.js, which it never edits.
// Everything here is a pure function of t.
(function () {
  "use strict";
  const tw = FILM.tw;
  const F = (window.SF = {});
  // VL 15.76: the kit's locator snippet (the map in close frames, the ring at W), loaded once
  if (!window.locator) { const x = new XMLHttpRequest(); x.open("GET", "snippets/locator.js", false); x.send(); (0, eval)(x.responseText + ";window.locator=locator;window.roomRing=roomRing;"); }

  // ---------------------------------------------------------------- the screen pin, one line then two (VL 15.69; rulings 100, 101)
  // A screen's docked name. From t0 the pin is one row: the plain line alone, in the pin's small weight, at the place it keeps.
  // At tName (the start of the spoken name, never before it) the pin grows upward by one row over 300 ms: the bottom edge and
  // the plain line do not move by a pixel; the name fades 0 to 1 in its new row in the bold weight. It leaves whole at t1 in
  // 250 ms (pass the time the grow to Full starts, VL 15.33). x is the pin's left edge, bottom its bottom edge (stage px).
  // The arrival before tName is the kit's: 450 ms out-expo with a 16 px rise (layer.js life()); the plain line is then still.
  F.NAME_ROW = 51;   // 44 px at line-height 1.05, plus the 5 px gap above the small line (kit.css .pin)
  F.pin2 = (k, o) => {
    const ui = document.getElementById("ui");
    const d = document.createElement("div"); d.className = "abs w pin"; ui.appendChild(d);
    d.style.top = "auto"; d.style.bottom = (1080 - o.bottom) + "px"; d.style.left = o.x + "px";
    d.innerHTML = `<div class="nm" style="overflow:hidden;height:0px">${o.name}</div><small style="margin-top:0">${o.plain}</small>`;
    const nm = d.firstChild;
    FILM._post.push((t) => {
      const vin = tw(t, o.t0, o.t0 + 450, "outExpo"), vout = o.t1 == null ? 0 : tw(t, o.t1, o.t1 + 250, "in");
      const v = vin * (1 - vout);
      d.style.opacity = v; d.style.visibility = v <= 0.002 ? "hidden" : "visible";
      d.style.transform = `translate(0px,${16 * (1 - vin)}px)`;
      const u = o.tName == null ? 0 : tw(t, o.tName, o.tName + 300, "io");
      // whole pixels: a fractional row moved the plain line 1 px (pre-read 2A_2030, f191)
      nm.style.height = Math.round(F.NAME_ROW * u) + "px"; nm.style.opacity = u; nm.style.paddingBottom = "0px";
    });
    k.cue(o.t0, "pin", { text: o.plain });
    if (o.tName != null) k.cue(o.tName, "name", { text: o.name });
    return d;
  };

  // ---------------------------------------------------------------- a file that shares one route (2.0; VL 15.37, PRE_SIGN 4)
  // Every member walks the same polyline, `gap` m apart along it, at one speed profile, so the gaps hold at every frame and
  // the corners included. The route is cut into short legs; each leg is a linear walk at the profile's speed there.
  // route: [[x, z], ...] from the lead's start to the lead's stop. Member i starts and stops i*gap behind the lead.
  // prof(s): the lead's arc length s (m) -> time (ms), monotone. Returns, per member, its leg list and the time it
  // passes any arc length (for turns at a place on the route).
  F.route = (route) => {
    const P = route.map((p) => ({ x: p[0], z: p[1] })), cum = [0];
    for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i].x - P[i - 1].x, P[i].z - P[i - 1].z));
    const L = cum[cum.length - 1];
    // a point at arc length s; before 0 the route is extended straight back along its first leg
    const at = (s) => {
      if (s <= 0) { const dx = P[1].x - P[0].x, dz = P[1].z - P[0].z, l = Math.hypot(dx, dz); return [P[0].x + (dx / l) * s, P[0].z + (dz / l) * s]; }
      if (s >= L) return [P[P.length - 1].x, P[P.length - 1].z];
      let j = 1; while (cum[j] < s) j++;
      const u = (s - cum[j - 1]) / (cum[j] - cum[j - 1]);
      return [P[j - 1].x + (P[j].x - P[j - 1].x) * u, P[j - 1].z + (P[j].z - P[j - 1].z) * u];
    };
    return { L, at, cum };
  };
  // walk member a along route R from arc s0 to s1, where the arc reached at time t is given by the inverse profile tOf(s).
  F.walkRoute = (a, R, s0, s1, tOf, step) => {
    step = step || 0.35;
    const n = Math.max(1, Math.ceil((s1 - s0) / step));
    for (let j = 0; j < n; j++) {
      const sa = s0 + ((s1 - s0) * j) / n, sb = s0 + ((s1 - s0) * (j + 1)) / n;
      const ta = tOf(sa), tb = tOf(sb);
      a.walk(ta, Math.max(1, tb - ta), [R.at(sb)], { ease: "lin" });
    }
  };
  // a speed profile as segments [[tEnd ms, speed m/s], ...] starting at rest at t0, with eased changes (each change takes
  // `ramp` ms). Returns { sOf(t), tOf(s) } for the lead.
  F.profile = (t0, segs, ramp) => {
    ramp = ramp || 400;
    const dt = 10, ts = [], ss = []; let s = 0, v = 0, i = 0;
    const tEnd = segs[segs.length - 1][0];
    for (let t = t0; t <= tEnd + dt; t += dt) {
      while (i < segs.length - 1 && t > segs[i][0]) i++;
      const target = segs[i][1];
      const a = (target - v) / Math.max(dt, ramp) * dt; v += a; if (Math.abs(target - v) < 1e-3) v = target;
      ts.push(t); ss.push(s); s += (v * dt) / 1000;
    }
    const sOf = (t) => { if (t <= ts[0]) return 0; const j = Math.min(ss.length - 1, Math.floor((t - ts[0]) / dt)); return ss[j]; };
    const tOf = (q) => { if (q <= 0) return ts[0]; let lo = 0, hi = ss.length - 1; if (q >= ss[hi]) return ts[hi]; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (ss[m] < q) lo = m; else hi = m; } const u = (q - ss[lo]) / Math.max(1e-9, ss[hi] - ss[lo]); return ts[lo] + u * dt; };
    return { sOf, tOf, total: ss[ss.length - 1] };
  };

  // ---------------------------------------------------------------- the list's active line, crossfaded (PRE_SIGN 15)
  // C.listWhole switches the lit question in one frame (layer.js toggles a class). Over 300 ms from tAct this lays a copy
  // of the list in its earlier state (question `from` lit, question `to` not) over the kit's list and fades it out, so the
  // change takes 300 ms. Built from t alone each frame.
  F.listFade = (k, tAct, from, to, dur) => {
    dur = dur || 300; let cl = null;
    FILM._post.push((t) => {
      const box = document.querySelector("#ui .qlist");
      if (cl) { cl.remove(); cl = null; }
      if (!box || t < tAct || t >= tAct + dur) return;
      cl = box.cloneNode(true); cl.classList.remove("w"); box.parentNode.appendChild(cl);
      cl.querySelectorAll(".q").forEach((r) => { const n = +r.dataset.n; if (n === from) { r.classList.add("on"); r.classList.remove("done"); } if (n === to) r.classList.remove("on"); });
      cl.style.opacity = String((+box.style.opacity || 1) * (1 - tw(t, tAct, tAct + dur, "io")));
      // the kit's rows underneath fade in, so the newly lit circle does not show through the fading copy (pre-read 2.0_1748)
      const u = tw(t, tAct, tAct + dur, "io");
      box.querySelectorAll(".q").forEach((r) => { const n = +r.dataset.n; if (n === from || n === to) r.style.opacity = String((+r.style.opacity || 1) * u); });
    });
  };
  // a file whose gaps close as it walks: member i starts i*g0 behind the lead and stops i*g1 behind it; all start and stop
  // together, so every gap shrinks smoothly from g0 to g1 (a queue closing up as its head stops)
  F.fileTimes = (R, tOf, i, g0, g1) => { const s0 = -i * g0, s1 = R.L - i * g1, tot = s1 - s0; return { s0, s1, tO: (s) => tOf(((s - s0) / tot) * R.L) }; };

  // ---------------------------------------------------------------- the stage 2 file (2.0's route end; 2A opens on it)
  // the east-end leg runs on a diagonal (x 6.3 at the back to 5.0 at the front) so the file is spread across the frame as well
  // as down it at W (walking straight at the lens it stacked: pre-read 2.0_1748)
  F.ROUTE20 = [[4.2, -6.4], [5.6, -6.4], [6.3, -5.8], [5.0, -0.75], [4.7, -0.3], [3.2, -0.3], [2.6, -0.85], [2.3, -1.65], [2.1, -2.3], [-1.1, -2.2]];
  F.GAP20 = 0.68;   // body 0.55 m wide, 0.13 m of floor between (v2-visuals 170054)
  F.YAW20 = -0.87;   // 40 degrees towards us, facing along the file (v2-visuals 160200 item 1)
  F.file20 = () => { const R = F.route(F.ROUTE20); return [0, 1, 2, 3, 4].map((i) => R.at(R.L - i * F.GAP20)); };
  // ---------------------------------------------------------------- 2.0's five, one function for 2.0 and 2A (v2-visuals 180159 (a))
  // They stand 0.68 m apart behind the pavilion's back wall and leave it one at a time, STAG ms apart, on one route at one
  // speed profile, so at W only one body is on the lens-ward leg at a time; each stops at its place in the file. The tail
  // lands after 2.0 ends: 2A calls this with shift = -D20, so the walk carries across the cut frame for frame.
  F.D20 = 5733.4;   // 2.0's length on TIMING v5 to v7 (timing.json shots[2.0].dur)
  F.STAG20 = 600;   // 350 left the five two and three deep on the east walk at W (pre-reads 2.0_1748, 2.0_2240 A)
  F.file20Walk = (k, shift, o) => {
    o = o || {};
    const R = F.route(F.ROUTE20), GAP = F.GAP20;
    const pro = F.profile(0, [[3200, 3.7], [4700, 2.0], [5150, 0]], 350), scale = R.L / pro.total;
    const sIn = R.cum[5];
    const out = [];
    for (let i = 0; i < 5; i++) {
      const s0 = -i * GAP, s1 = R.L - i * GAP, dt = i * F.STAG20 + shift;
      const tO = (s) => pro.tOf((s - s0) / scale) + dt;
      const p0 = R.at(s0);
      const a = k.agent({ at: [p0[0], 0, p0[1]], face: Math.PI / 2, name: "q" + i });
      F.walkRoute(a, R, s0, s1, tO, 0.3);
      a.turn(tO(sIn), 350, F.YAW20);
      out.push({ a, tIn: tO(sIn), tEnd: tO(s1) });
    }
    return out;
  };
  // the five's walk, drawn on one clock across 2.0 and 2A, and set down softly when each stops (pre-reads 2A_2255 item 2,
  // 2A_2320 item 1). The kit's walk-cycle bob (1000 ms, two hops, lift up to 0.06) runs on the shot's own t, so 2A draws it
  // at t + shift (shift = D20) to match 2.0's last frame. When a member stops, the kit swaps walk-cycle for idle in one
  // frame and drops whatever lift the bob had (about 20 px in 2A's room frame); here that lift eases out over 300 ms.
  F.walkEase = (FW, shift) => {
    const map = new Map(FW.map((x) => [x.a.spr, x])), anim0 = Look.animate;
    const liftAt = (p) => { p = ((p % 500) + 500) % 500; return p > 83 && p < 417 ? 0.06 * Math.sin((Math.PI * (p - 83)) / 334) : 0; };
    Look.animate = function (spr, nm, bt, ov) {
      const m = map.get(spr); if (!m) return anim0.call(this, spr, nm, bt, ov);
      if (nm === "walk-cycle") return anim0.call(this, spr, nm, bt + shift, ov);
      const dt = bt - (m.a.phase || 0) - m.tEnd;
      if (dt >= 0 && dt < 300) { const L0 = liftAt(m.tEnd + shift); if (L0 > 0) ov = Object.assign({}, ov || {}, { lift: ((ov && ov.lift) || 0) + L0 * (1 - FILM.E.io(dt / 300)) }); }
      return anim0.call(this, spr, nm, bt, ov);
    };
  };
  // ---------------------------------------------------------------- E1, E2: the line at the small building (ruling 124 a; VL 15.49)
  // Two ranks walk in from the right edge along the front to the door and on out of the frame's left, on the floor band.
  // Rank A from before the shot; rank B from tB (the glow), 0.5 m nearer and half a beat behind, so body to body is about 0.8 m
  // and no body stands straight behind another. Every walker moves at one constant speed (1.2 m/s) on one smoothed route, so
  // the spacing is the same everywhere: the kit's person walk eases over its whole length (sine), which bunched walkers near
  // the path's start (v2-visuals 080638, 080946: two in one outline at the right edge). Each walker keeps one kit walk for its
  // stride; this sets its place and facing after the kit, every frame from t alone.
  // o: { shift: ms (E2 passes E1's length so its first frame is E1's last), tB: ms on E1's clock, beat: 1000 }
  F.endLine = (k, d, o) => {
    const T = THREE, shift = o.shift || 0, v = 1.2, beat = o.beat || 1000, D = k.dur, hid = [0, -80, 0];
    const pts = (dz) => [[d.x + 16, d.z + 2.7], [d.x + 14, d.z + 2.6], [d.x + 4, d.z + 2.2], [d.x + 1.3, d.z + 0.5], [d.x + 0.15, d.z + 0.45], [d.x - 3.0, d.z + 0.55], [d.x - 10.0, d.z + 0.7]].map(([x, z]) => [x, z + dz]);
    const dense = (P) => new T.CatmullRomCurve3(P.map(([x, z]) => new T.Vector3(x, 0, z)), false, "centripetal", 0.5).getSpacedPoints(600).map((q) => [q.x, q.z]);
    // rank B starts 1.5 m beyond E2's right edge (x d.x + 11; E1's edge is about d.x + 8), and its first walker crosses E1's
    // edge on the glow: it starts walking 2.5 s before tB, out of sight
    const ranks = [{ dz: 0, off: 0, tB: -1e12, x0: null }, { dz: 0.5, off: beat / 2, tB: o.tB - 2500, x0: d.x + 11 }];
    // o.endStand (VL 15.75 c; v2-visuals 193600): the kit's stride runs on the shot clock with a 1 s cycle (feet together at
    // t mod 500 = 0). The next shot opens on feet together, so shift the stride's phase until the last frame is feet together.
    // On v10 and ai (376 frames, last frame 12500 ms) the shift is 0, so those signed renders do not move.
    if (o.endStand) { const tl = (Math.round((D * 30) / 1000) - 1) * (1000 / 30); o.phaseOff = (500 - (tl % 500)) % 500; if (o.phaseOff < 1e-6) o.phaseOff = 0; }
    const walkers = [];
    ranks.forEach((r) => {
      const R = F.route(dense(pts(r.dz))); let s0 = 0; if (r.x0 != null) while (s0 < R.L && R.at(s0)[0] > r.x0) s0 += 0.02;
      const dur = ((R.L - s0) / v) * 1000, N = Math.ceil(dur / beat) + 2, pool = k.people(N, {}).list;
      // walker n enters the route's start at e = n beat + off on the line's clock (E1's), shot time e - shift
      const n0 = Math.ceil((shift - dur - r.off) / beat), n1 = Math.floor((shift + D - r.off) / beat);
      for (let n = n0; n <= n1; n++) {
        const eL = n * beat + r.off; if (eL < r.tB) continue;
        const e = eL - shift, P = pool[((n % N) + N) % N], st = R.at(s0);
        P.at(e - 1, [st[0], 0, st[1]], -Math.PI / 2);
        P.walk(e, dur, [R.at(R.L)]);   // the kit's walk: the stride pose; the place is set below
        P.at(e + dur + 1, hid);
        walkers.push({ P, R, e, dur, s0 });
      }
    });
    k.each((t) => {
      for (const w of walkers) {
        if (t < w.e || t >= w.e + w.dur) continue;
        const s = w.s0 + ((t - w.e) / 1000) * v, a = w.R.at(s), b = w.R.at(Math.min(w.R.L, s + 0.4)), c = w.R.at(Math.max(0, s - 0.4));
        const g = w.P.root; g.position.set(a[0], 0, a[1]); g.rotation.set(0, Math.atan2(b[0] - c[0], b[1] - c[1]), 0);
        if (o.phaseOff) window.Look.personPose(g, "walk", t + o.phaseOff);   // the stride's phase, shifted (o.endStand)
      }
    });
    return { walkers };
  };
})();
