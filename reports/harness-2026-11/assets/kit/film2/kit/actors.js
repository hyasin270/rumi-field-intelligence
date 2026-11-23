// actors.js (film2 kit, v2-kit): agents (v1's Look.sprite, rig v3, imported unedited) and people (v1's Look.person),
// driven by tracks declared once and evaluated at t. Channels: position (at, walk, carry offsets), yaw (at, walk, turn),
// arms and body (reach, act, pose, clip, lean), fade, effect marks. The face is the Rumi mark and never changes.
(function () {
  "use strict";
  const T = THREE, tw = FILM.tw, clamp01 = FILM.clamp01, lerp = FILM.lerp;
  const V = (p) => (Array.isArray(p) ? new T.Vector3(p[0], p[1] || 0, p[2]) : p.clone());
  const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  const lerpAng = (a, b, u) => a + wrap(b - a) * u;
  const yawTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
  const all = [];

  // the acting vocabulary: clip or pose from v1's library, plus body overlays (k squash, lift, lean, step back)
  const ACTS = {
    hop: { dur: 700, clip: "hop", body: (u) => ({ lift: 0.22 * Math.sin(Math.PI * clamp01((u - 0.12) / 0.6)), k: 1 - 0.08 * Math.sin(Math.PI * clamp01(u / 0.14)) }) },
    slump: { dur: 1600, pose: "idle", body: (u, e) => ({ k: 1 - 0.1 * e, lean: [0, 0.12 * e] }), env: true },
    shrug: { dur: 1300, clip: "shrug" },
    // v0.8.2 (v2-shots-b 150015): bump eases its step back to 0 by the act's end, no snap
    bump: { dur: 900, pose: "bump", body: (u) => ({ k: 1 - 0.12 * Math.sin(Math.PI * clamp01(u / 0.2)), back: 0.32 * FILM.E.out(clamp01((u - 0.08) / 0.5)) * (1 - FILM.E.io(clamp01((u - 0.62) / 0.38))), lean: [0, -0.08 * Math.sin(Math.PI * clamp01(u / 0.7))] }) },
    tug: { dur: 1600, arms: "forward", body: (u, e, t) => ({ lean: [0, -(0.07 + 0.035 * Math.sin(t / 95)) * e] }), env: true },
    wake: { dur: 900, pose: "happy", body: (u) => ({ k: 1 + 0.09 * Math.sin(Math.PI * u), lift: 0.05 * Math.sin(Math.PI * u) }) },
    carry: { dur: 0, pose: "carry", persist: true },
    wave: { dur: 1750, clip: "wave-once" },
    sleep: { dur: 0, clip: "sleep-breathe", persist: true },
    read: { dur: 0, clip: "read-flip", persist: true },
    write: { dur: 0, clip: "write-correct", persist: true },
    "raise-hand": { dur: 0, clip: "hand-up", persist: true },
    look: { dur: 1100, pose: "curious", body: (u, e) => ({ lean: [0, 0.06 * e] }), env: true },
    puzzled: { dur: 1400, pose: "puzzled", env: true },
    proud: { dur: 1400, pose: "determined", body: (u, e) => ({ k: 1 + 0.04 * e }), env: true },
    // seated at a low desk (agents have no legs): settled lower, arms forward to the desk; stays until the next pose or act
    sit: { dur: 0, pose: "write", persist: true, body: () => ({ k: 0.9 }) },
  };
  // an envelope that rises over the first 22% and falls over the last 22% of [t0, t0+dur]
  const envOf = (t, t0, dur) => tw(t, t0, t0 + dur * 0.22, "out") * (1 - tw(t, t0 + dur * 0.78, t0 + dur, "in"));

  function pathCurve(pts) {
    if (pts.length === 2) return new T.LineCurve3(pts[0], pts[1]);
    return new T.CatmullRomCurve3(pts, false, "centripetal", 0.5);
  }

  function agent(k, o) {
    o = o || {};
    const spr = Look.sprite(k.renderer, { book: !!o.book, pencil: !!o.pencil, judge: !!o.judge });
    (o.parent || k.scene).add(spr);
    const G = Look.spriteGeometry(), mittenC = G.mittenC || 0.27;
    const start = V(o.at || [0, 0, 0]);
    const sc0 = KIT.SCALE.agent;   // VL 14.6: locked; o.scale is ignored
    const A = { kind: "agent", scales: [], name: o.name || "agent" + all.length, spr, root: spr, i: all.length,
      pos: [], yaw: [], arms: [], fades: [], vis: [], carries: [], phase: Look.phase(all.length + (o.seed || 0), 4000) };
    const face0 = o.face || 0;
    const ch = (list, item) => { list.push(item); list.sort((a, b) => a.t0 - b.t0); return A; };
    A.at = (t0, p, face) => ch(A.pos, { kind: "at", t0, p: V(p), face });
    A.walk = (t0, dur, pts, op) => ch(A.pos, { kind: "walk", t0, dur, pts: pts.map((q) => (q.length === 2 ? [q[0], null, q[1]] : q)), op: op || {} });
    A.turn = (t0, dur, to) => ch(A.yaw, { kind: "turn", t0, dur, to });
    A.reach = (t0, dur, point, op) => ch(A.arms, { kind: "reach", t0, dur, point: V(point), op: Object.assign({ hand: "R", hold: 600 }, op || {}) });
    A.act = (t0, name, op) => { const a = ACTS[name]; if (!a) throw new Error("no act " + name + " (have: " + Object.keys(ACTS).join(", ") + ")"); return ch(A.arms, { kind: "act", t0, name, dur: (op && op.dur) || a.dur, persist: a.persist, a, op: op || {} }); };
    A.pose = (t0, name, over) => ch(A.arms, { kind: "pose", t0, name, over, persist: true });
    A.clip = (t0, name) => ch(A.arms, { kind: "clip", t0, name, persist: true });
    A.idle = (t0, op) => ch(A.arms, { kind: "idle", t0, persist: true, op: op || {} });
    A.lean = (t0, dur, l, op) => ch(A.arms, { kind: "lean", t0, dur, l, persist: true, op: op || {} });
    A.fade = (t0, dur, to) => ch(A.fades, { t0, dur, to });
    A.scaleTo = (t0, dur, to) => ch(A.scales, { t0, dur, to });
    A.show = (t0) => ch(A.vis, { t0, on: true });
    A.hide = (t0) => ch(A.vis, { t0, on: false });
    A.carry = (t0, obj, op) => ch(A.carries, { t0, obj, kind: "carry", op: op || {} });
    A.put = (t0, point, op) => ch(A.carries, { t0, kind: "put", point: V(point), dur: (op && op.dur) || 400, op: op || {} });
    A.fx = (t0, kind, op) => { KIT.layer.fxMark(k, Object.assign({ t0, kind, anchor: () => spr.localToWorld(new T.Vector3(0, 1.02, 0)) }, op || {})); return A; };
    A.say = () => A;
    A.head = () => spr.localToWorld(new T.Vector3(0, 1.12, 0));
    A.at3 = () => spr.position.clone();
    A.where = (t) => place(t).p;   // the agent's place at t without posing it (cheap; for the route line)
    // the posed mitten's centre in the world (after this frame's pose: actors are evaluated before props)
    A.hand = (side) => { const arm = spr.userData.arms[side === "L" ? 0 : 1]; spr.updateMatrixWorld(true); return arm.localToWorld(new T.Vector3(0, -mittenC, 0)); };

    // ---------- position and yaw at t (replays the declared segments up to t: pure)
    function place(t) {
      let p = start.clone(), yaw = face0, moving = false, prevYaw = face0, walkEnd = null, nextWalk = null;
      for (const s of A.pos) if (s.kind === "walk" && s.t0 > t) { nextWalk = s.t0; break; }
      for (const s of A.pos) {
        if (s.t0 > t) break;
        if (s.kind === "at") { p = s.p.clone(); if (s.face != null) yaw = typeof s.face === "number" ? s.face : yawTo(p, V(s.face)); continue; }
        const pts = [p.clone()].concat(s.pts.map((q) => new T.Vector3(q[0], q[1] == null ? p.y : q[1], q[2])));
        if (pts.length > 1 && pts[0].distanceTo(pts[1]) < 0.05) pts.splice(1, 1);
        if (pts.length < 2) continue;
        const c = pathCurve(pts), u = tw(t, s.t0, s.t0 + s.dur, s.op.ease || "sine");
        p = c.getPointAt(u);
        const tan = c.getTangentAt(Math.min(0.999, Math.max(0.001, u))), ty = Math.atan2(tan.x, tan.z);
        if (s.op.face != null) yaw = typeof s.op.face === "number" ? s.op.face : yawTo(p, V(s.op.face));
        else { const turnIn = tw(t, s.t0, s.t0 + 260, "out"); yaw = lerpAng(yaw, ty, turnIn); }
        if (t < s.t0 + s.dur) moving = true; else walkEnd = s.t0 + s.dur;
      }
      if (moving) walkEnd = null;
      for (const s of A.yaw) {
        if (s.t0 > t) break;
        const target = typeof s.to === "number" ? s.to : yawTo(p, V(s.to));
        yaw = lerpAng(yaw, target, tw(t, s.t0, s.t0 + s.dur, "io"));
      }
      return { p, yaw, moving, walkEnd, nextWalk };
    }
    // ---------- arms and body at t
    function body(t, pl) {
      const ph = A.phase;
      let base = pl.moving ? "walk-cycle" : "idle-breathe", bt = pl.moving ? t : t + ph, over = {}, body = {};
      let pers = null, tr = null, prevPers = null;
      for (const s of A.arms) {
        if (s.t0 > t) break; if (s.kind === "lean") continue;
        if (s.persist) { prevPers = pers; pers = s; tr = null; continue; }
        const end = s.kind === "reach" ? s.t0 + s.dur * 1.8 + (s.op.hold || 0) : s.t0 + s.dur;
        if (t < end) tr = s; else if (tr === s) tr = null;
      }
      const act = tr || pers;
      let clipName = base, poseName = null, reach = null, lean = null;
      if (act) {
        if (act.kind === "pose") { poseName = act.name; over = act.over || {}; }
        else if (act.kind === "clip") { clipName = act.name; bt = t - act.t0; }
        else if (act.kind === "idle") { /* back to base */ }
        else if (act.kind === "lean") lean = act;
        else if (act.kind === "reach") reach = act;
        else if (act.kind === "act") {
          const a = act.a, u = act.dur ? clamp01((t - act.t0) / act.dur) : 0, e = act.dur ? envOf(t, act.t0, act.dur) : 1;
          if (a.clip) { clipName = a.clip; bt = t - act.t0; }
          if (a.pose) poseName = a.pose;
          if (a.body) body = a.body(u, e, t);
          if (act.op && act.op.away) body.away = act.op.away;
          if (a.arms === "forward") over.armsForward = e;
        }
      }
      // the last lean persists under everything
      for (const s of A.arms) { if (s.t0 > t) break; if (s.kind === "lean") lean = s; }
      // v0.9.1 (v2-shots-b 082751, v2-visuals 082838): lean(t0, dur, l, { from: "current" }) eases from the lean in force at t0
      // (the lean before it, as it stood then) to l, instead of from none, so a lean back to [0, 0] no longer snaps. Off by default.
      const leanOff = (s, tt) => { const e = s.dur ? tw(tt, s.t0, s.t0 + s.dur, "io") : 1;
        if (!(s.op && s.op.from === "current")) return [s.l[0] * e, s.l[1] * e];
        let pv = null; for (const q of A.arms) { if (q === s) break; if (q.kind === "lean" && q.t0 <= s.t0) pv = q; }
        const p0 = pv ? leanOff(pv, s.t0) : [0, 0]; return [lerp(p0[0], s.l[0], e), lerp(p0[1], s.l[1], e)]; };
      const nm = poseName || clipName;
      let nmB = nm;
      // v0.8.4 (v2-shots-d 165059 item 4, PRE_SIGN 15): an act that holds a pose for a while (look, puzzled, proud, slump)
      // eases the arms, lean and size in from the base and back out, each over max(300 ms, 22% of the act), io. It used to
      // swap the arms in one frame. act(t0, name, { snap: true }) keeps the old one-frame change.
      let P0 = null, pe = 1;
      if (act && act.kind === "act" && act.a.env && act.a.pose && act.dur && !(act.op && act.op.snap)) {
        const r = Math.max(300, act.dur * 0.22); pe = tw(t, act.t0, act.t0 + r, "io") * (1 - tw(t, act.t0 + act.dur - r, act.t0 + act.dur, "io"));
        if (pe < 1) P0 = Look.animate(spr, clipName, bt);
      }
      // v0.8.14 (v2-shots-a 234514, T3a): a held state ("carry" or any persistent act, and idle) may take { blend: ms } and mix
      // from the arms, lean and size of the state before it over ms ("io"). Off by default: without blend it changes in one frame.
      if (!P0 && act && act === pers && act.op && act.op.blend > 0 && (act.kind === "act" || act.kind === "idle") && t < act.t0 + act.op.blend) {
        const q = prevPers, prevName = !q ? base : q.kind === "pose" || q.kind === "clip" ? q.name : q.kind === "act" ? (q.a.pose || q.a.clip || base) : base;
        pe = tw(t, act.t0, act.t0 + act.op.blend, "io");
        if (pe < 1) P0 = Look.animate(spr, prevName, q && q.kind === "clip" ? t - q.t0 : bt);
      }
      // v0.9.2 (v2-visuals 090905, VL 15.89 c; v2-shots-b 090835): DEFAULT. When a walk ends, the body blends from the walk
      // cycle's last frame into whatever it stands in over SETTLE ms (io), instead of dropping the walk's lean and arms in one
      // frame. k.agent({ settle: 0 }) keeps the old one-frame change; { settle: ms } sets the length.
      const settle = o.settle != null ? o.settle : 300;
      if (!P0 && settle > 0 && pl.walkEnd != null && t < pl.walkEnd + settle) {
        pe = tw(t, pl.walkEnd, pl.walkEnd + settle, "io"); if (pe < 1) P0 = Look.animate(spr, "walk-cycle", pl.walkEnd);
      }
      const P = Look.animate(spr, nm, bt);
      const ov = {};
      if (P0) {
        ["L", "R"].forEach((sd) => { if (P0[sd] && P[sd]) ov[sd] = { dir: P0[sd].dir.clone().lerp(P[sd].dir, pe).normalize(), st: lerp(P0[sd].st, P[sd].st, pe) }; });
        if (P0.lean && P.lean) ov.lean = [lerp(P0.lean[0], P.lean[0], pe), lerp(P0.lean[1], P.lean[1], pe)];
        if (P0.k != null && P.k != null) ov.k = lerp(P0.k, P.k, pe);
      }
      if (over.armsForward) {
        const e = over.armsForward;
        ov.L = { dir: P.L.dir.clone().lerp(new T.Vector3(0.12, -0.15, 1).normalize(), e).normalize(), st: lerp(P.L.st, 1.35, e) };
        ov.R = { dir: P.R.dir.clone().lerp(new T.Vector3(-0.12, -0.15, 1).normalize(), e).normalize(), st: lerp(P.R.st, 1.35, e) };
      }
      if (reach) {
        const r = reach, din = r.dur, hold = r.op.hold || 0;
        const e = tw(t, r.t0, r.t0 + din, "out") * (1 - tw(t, r.t0 + din + hold, r.t0 + din + hold + din * 0.8, "io"));
        const side = r.op.hand === "L" ? "L" : "R", sx = side === "L" ? 1 : -1;
        const sh = new T.Vector3(sx * 0.30, 0.50 + (r.op.lift || 0) * e, 0.065);
        const local = spr.worldToLocal(r.point.clone());
        const d = local.sub(sh), len = d.length(); d.normalize();
        const st = Math.max(1, Math.min(1.5, len / mittenC));
        ov[side] = { dir: P[side].dir.clone().lerp(d, e).normalize(), st: lerp(P[side].st, st, e) };
        ov.lean = [P.lean[0] + 0.05 * e * d.x, P.lean[1] + 0.06 * e];
        if (r.op.lift) ov.lift = (P.lift || 0) + r.op.lift * e;
        A.reachFar = len / mittenC > 1.55 ? len / mittenC : 0;
      }
      if (lean) { const l0 = ov.lean || P.lean, d = leanOff(lean, t); ov.lean = [l0[0] + d[0], l0[1] + d[1]]; }
      if (body.k) ov.k = (ov.k != null ? ov.k : P.k) * body.k;
      if (body.lift) ov.lift = (ov.lift != null ? ov.lift : P.lift || 0) + body.lift;
      if (body.lean) { const l0 = ov.lean || P.lean; ov.lean = [l0[0] + body.lean[0], l0[1] + body.lean[1]]; }
      // v0.8.15 (v2-shots-a 070254 item 1): act(t0, "press", { reach: y }) raises both arms beside the head so the mitten
      // tips meet the world height y (the glass's underside), each aimed at the point above its own shoulder (so a tipped
      // agent still meets the plane), stretch solved and capped at 1.5 (v1's rule). The tips sit above the crown only when
      // the crown is 0.5 k - 0.40 (local) under y: the rig cannot put tips at the crown (stretch 1.85). A.pressShort is the
      // world gap left when the cap bites (0 when the tips meet y). Off by default: "press" without reach is unchanged.
      if (act && act.kind === "act" && act.name === "press" && act.op && act.op.reach != null) {
        const e = act.dur ? envOf(t, act.t0, act.dur) : 1, lift = ov.lift != null ? ov.lift : P.lift || 0;
        // { squash: kMin }: contact. While the act runs, the crown never passes y: the body squashes as far as the glass
        // pushes it, never below kMin (absolute size; the press's own is about 0.986). At k 0.80 an upright agent's tips and
        // crown meet the same plane, so raise the agent (or its stack) about 0.19 x 0.78 m past "crown on the glass"
        if (act.op.squash != null) {
          const yC = spr.worldToLocal(new T.Vector3(spr.position.x, act.op.reach, spr.position.z)).y;
          ov.k = Math.max(act.op.squash, Math.min(ov.k != null ? ov.k : P.k, yC - lift));
        }
        const kk = ov.k != null ? ov.k : P.k;
        let short = 0;
        ["L", "R"].forEach((side) => {
          const sx = side === "L" ? 1 : -1, shL = new T.Vector3(sx * 0.29, 0.5 * kk + lift, 0.065);
          const out = spr.localToWorld(new T.Vector3(sx * 0.37, 0.5 * kk + lift, 0.09));
          const tgt = spr.worldToLocal(new T.Vector3(out.x, act.op.reach, out.z));
          const d = tgt.sub(shL), len = d.length(); d.normalize();
          const st = Math.max(1, Math.min(1.5, len / 0.27));
          if (len / 0.27 > 1.5) { const tip = spr.localToWorld(shL.clone().addScaledVector(d, 0.27 * 1.5)); short = Math.max(short, act.op.reach - tip.y); }
          const a0 = ov[side] || P[side];
          ov[side] = { dir: a0.dir.clone().lerp(d, e).normalize(), st: lerp(a0.st, st, e) };
        });
        A.pressShort = short;
      }
      // v0.8.15 (v2-shots-a 070254 item 2): the "carry" and "proud" poses (v1) bring a white card between the mittens.
      // k.agent({ props: false }) never shows a held prop; act(t0, name, { prop: false }) drops it for that act only.
      if (o.props === false || (act && act.op && act.op.prop === false)) ov.prop = null;
      // v0.9.0 k.breathe(): a continuous breath on the body's size while the agent stands (any held act, pose or idle), its
      // phase the agent's own; the base loop's 1 s breath and 3 s rest is replaced by the rest pose under the sine
      // v0.9.2: the breath ramps in over SETTLE ms after a walk ends and out over SETTLE ms before the next walk starts
      if (k._breath && !pl.moving) { const B = k._breath, s = Math.sin((2 * Math.PI * (t + A.phase)) / B.period), rs = Math.max(settle, 1);
        const r = (pl.walkEnd != null ? tw(t, pl.walkEnd, pl.walkEnd + rs, "io") : 1) * (pl.nextWalk != null ? 1 - tw(t, pl.nextWalk - rs, pl.nextWalk, "io") : 1);
        if (nmB === "idle-breathe") nmB = "idle"; ov.k = (ov.k != null ? ov.k : P.k) * (1 + B.amp * s * r); }
      // fade
      let op = 1; for (const f of A.fades) { if (f.t0 > t) break; const from = op; op = lerp(from, f.to, tw(t, f.t0, f.t0 + f.dur, "io")); }
      if (op < 0.999) ov.opacity = op;
      if (Object.keys(ov).length) Look.animate(spr, nmB, bt, ov);
      return body;
    }
    A.eval = function (t) {
      let vis = o.visibleFrom == null ? true : t >= o.visibleFrom;
      for (const v of A.vis) { if (v.t0 > t) break; vis = v.on; }
      spr.visible = vis; if (!vis) return;
      const pl = place(t);
      let sc = sc0; for (const z of A.scales) { if (z.t0 > t) break; sc = lerp(sc, z.to, tw(t, z.t0, z.t0 + z.dur, "out")); }
      spr.scale.setScalar(sc);
      spr.position.copy(pl.p); spr.rotation.set(0, pl.yaw, 0); spr.updateMatrixWorld(true);
      const b = body(t, pl);
      if (b.back) { let dx = -Math.sin(pl.yaw), dz = -Math.cos(pl.yaw); if (b.away) { const L = Math.hypot(b.away[0], b.away[1]) || 1; dx = b.away[0] / L; dz = b.away[1] / L; }
        spr.position.x += dx * b.back; spr.position.z += dz * b.back; spr.updateMatrixWorld(true); }
      // carried things
      let held = null;
      for (const c of A.carries) {
        if (c.t0 > t) break;
        if (c.kind === "carry") held = c;
        else if (held && c.kind === "put") {
          // v0.8.14 put(t, p, { fromHeld: true }) starts from where the carry held it (its lift and offset); default keeps the
          // signed start at the carry point (0, 0.46, 0.44), which jumps when the carry had a lift (v2-shots-a 234514)
          const hf = c.op && c.op.fromHeld, ho = hf ? (held.op.offset || [0, 0, 0]) : [0, 0, 0], hl = hf ? (held.op.lift || 0) : 0;
          const obj = held.obj, u = tw(t, c.t0, c.t0 + c.dur, "io"), from = spr.localToWorld(new T.Vector3(ho[0], 0.46 + hl + ho[1], 0.44 + ho[2]));
          const w = from.lerp(c.point, u); obj.parent.updateMatrixWorld(true); obj.position.copy(obj.parent.worldToLocal(w)); held = null; c._done = true;
        }
      }
      if (held) { const off = held.op.offset || [0, 0, 0]; const w = spr.localToWorld(new T.Vector3(off[0], 0.46 + (held.op.lift || 0) + off[1], 0.44 + off[2])); held.obj.parent.updateMatrixWorld(true); held.obj.position.copy(held.obj.parent.worldToLocal(w)); held.obj.rotation.y = pl.yaw; }
    };
    k.track(A); all.push(A);
    spr.position.copy(start); spr.rotation.y = face0;
    return A;
  }

  // ---------------------------------------------------------------- people (v1's clay person; the value plan's deep tone)
  let deepMat = null;
  // v0.8.4 (v2-shots-d 165059): kit poses on top of v1's (v1's file stays unedited). "write-stand": the write arms at chest
  // height on standing legs (4A1, ruling 98 item 4).
  const DOWN3 = new T.Vector3(0, -1, 0);
  const KIT_POSES = { "write-stand": { base: "stand", arms: [[[0.02, -0.75, 0.62], 1.15], [[0.16, -0.85, 0.45], 1.25]], torso: 0.12, head: [0, 0.32] } };
  function applyPose(g, name, t) {
    const K = KIT_POSES[name]; if (!K) { Look.personPose(g, name, t); return; }
    Look.personPose(g, K.base, t); const ud = g.userData;
    ud.arms.forEach((a, i) => { const A = K.arms[i], sd = a.userData.side; a.quaternion.setFromUnitVectors(DOWN3, new T.Vector3(sd * A[0][0], A[0][1], A[0][2]).normalize()); a.userData.elbow.rotation.x = -A[1]; });
    ud.hips.rotation.x = K.torso || 0; ud.head.rotation.set(K.head[1] || 0, K.head[0] || 0, 0); ud.pose = name;
  }
  // a pose as numbers, to blend two poses (v2-shots-d 165059: PRE_SIGN 15, a change of state takes 300 ms)
  function snap(g) { const ud = g.userData; return {
    aq: ud.arms.map((a) => a.quaternion.clone()), ae: ud.arms.map((a) => a.userData.elbow.rotation.x),
    lx: ud.legs.map((l) => l.rotation.x), kx: ud.legs.map((l) => l.userData.knee.rotation.x), fx: ud.legs.map((l) => l.userData.knee.children[1].rotation.x),
    hx: ud.hips.rotation.x, hd: [ud.head.rotation.x, ud.head.rotation.y], fy: ud.fig.position.y, bs: [ud.blob.scale.x, ud.blob.scale.z] }; }
  function mix(g, A, B, u) { const ud = g.userData, L = (a, b) => a + (b - a) * u;
    ud.arms.forEach((a, i) => { a.quaternion.copy(A.aq[i]).slerp(B.aq[i], u); a.userData.elbow.rotation.x = L(A.ae[i], B.ae[i]); });
    ud.legs.forEach((l, i) => { l.rotation.x = L(A.lx[i], B.lx[i]); l.userData.knee.rotation.x = L(A.kx[i], B.kx[i]); l.userData.knee.children[1].rotation.x = L(A.fx[i], B.fx[i]); });
    ud.hips.rotation.x = L(A.hx, B.hx); ud.head.rotation.set(L(A.hd[0], B.hd[0]), L(A.hd[1], B.hd[1]), 0); ud.fig.position.y = L(A.fy, B.fy); ud.blob.scale.set(L(A.bs[0], B.bs[0]), 1, L(A.bs[1], B.bs[1])); }
  function person(k, o) {
    o = o || {};
    const g = Look.person({ pose: o.pose === "walk" ? "stand" : KIT_POSES[o.pose] ? KIT_POSES[o.pose].base : o.pose || "stand", height: KIT.SCALE.person });   // VL 14.6: locked
    if (KIT_POSES[o.pose]) applyPose(g, o.pose, 0);
    if (o.tone !== "clay") { deepMat = deepMat || new T.MeshStandardMaterial({ color: 0x34507a, roughness: 0.7, metalness: 0 }); g.traverse((m) => { if (m.isMesh && m !== g.userData.blob) m.material = deepMat; }); }
    (o.parent || k.scene).add(g);
    const start = V(o.at || [0, 0, 0]);
    const P = { kind: "person", i: all.length, name: o.name || "person" + all.length, root: g, pos: [], yaw: [], poses: [] };
    const ch = (list, item) => { list.push(item); list.sort((a, b) => a.t0 - b.t0); return P; };
    P.at = (t0, p, face) => ch(P.pos, { kind: "at", t0, p: V(p), face });
    P.walk = (t0, dur, pts, op) => ch(P.pos, { kind: "walk", t0, dur, pts: pts.map((q) => (q.length === 2 ? [q[0], null, q[1]] : q)), op: op || {} });
    P.turn = (t0, dur, to) => ch(P.yaw, { t0, dur, to });
    // pose(t0, name, { blend: ms }): blend from the pose before over ms ("io"); without blend it changes in one frame, as before
    P.pose = (t0, name, op) => ch(P.poses, { t0, name, blend: (op && op.blend) || o.blend || 0 });
    P.vis = []; P.show = (t0) => ch(P.vis, { t0, on: true }); P.hide = (t0) => ch(P.vis, { t0, on: false });
    P.fx = (t0, kind, op) => { KIT.layer.fxMark(k, Object.assign({ t0, kind, anchor: () => g.localToWorld(new T.Vector3(0, 2.2, 0)) }, op || {})); return P; };
    P.eval = function (t) {
      let vis = o.visibleFrom == null ? true : t >= o.visibleFrom; for (const v of P.vis) { if (v.t0 > t) break; vis = v.on; }
      g.visible = vis; if (!vis) return;
      let p = start.clone(), yaw = o.face || 0, moving = false, walkEnd = null, walkStart = null, joined = false;
      for (const s of P.pos) {
        if (s.t0 > t) break;
        if (s.kind === "at") { p = s.p.clone(); if (s.face != null) yaw = s.face; continue; }
        const pts = [p.clone()].concat(s.pts.map((q) => new T.Vector3(q[0], q[1] == null ? p.y : q[1], q[2])));
        if (pts.length > 1 && pts[0].distanceTo(pts[1]) < 0.05) pts.splice(1, 1);
        if (pts.length < 2) continue;
        const c = pathCurve(pts), u = tw(t, s.t0, s.t0 + s.dur, "sine"); p = c.getPointAt(u);
        const tan = c.getTangentAt(Math.min(0.999, Math.max(0.001, u))); yaw = lerpAng(yaw, Math.atan2(tan.x, tan.z), tw(t, s.t0, s.t0 + 260, "out"));
        if (t < s.t0 + s.dur) { moving = true; walkStart = s.t0; joined = walkEnd != null && Math.abs(walkEnd - s.t0) < 1; } else walkEnd = s.t0 + s.dur;
      }
      for (const s of P.yaw) { if (s.t0 > t) break; yaw = lerpAng(yaw, typeof s.to === "number" ? s.to : yawTo(p, V(s.to)), tw(t, s.t0, s.t0 + s.dur, "io")); }
      let name = o.pose || "stand", prev = name, key = null; for (const s of P.poses) { if (s.t0 > t) break; prev = name; name = s.name; key = s; }
      const held = name; if (moving) name = "walk";
      // v0.8.12 the same {settle: ms} at a walk's start (v2-shots-a 223539): blend from the held pose into the stride over the
      // first ms ("io"); a walk that follows another walk with no stop between them does not blend
      const go = moving && o.settle && walkStart != null && !joined && t < walkStart + o.settle && held !== "walk";
      if (go) { applyPose(g, held, walkStart); const A = snap(g); applyPose(g, "walk", t); mix(g, A, snap(g), tw(t, walkStart, walkStart + o.settle, "io")); P._pose = null;
        g.position.copy(p); g.rotation.set(0, yaw, 0); return; }
      const bl = !moving && key && key.blend && t < key.t0 + key.blend && prev !== name;
      // v0.8.11 {settle: ms} on k.person (off by default; v2-shots-a 213707): when a walk ends, blend from the walk's last
      // frame to the held pose over ms ("io"), instead of the legs and arms changing in one frame
      const st = !moving && o.settle && walkEnd != null && t < walkEnd + o.settle && name !== "walk";
      if (st) { applyPose(g, "walk", walkEnd); const A = snap(g); if (bl) { applyPose(g, prev, t); const A2 = snap(g); applyPose(g, name, t); mix(g, A2, snap(g), tw(t, key.t0, key.t0 + key.blend, "io")); } else applyPose(g, name, t);
        mix(g, A, snap(g), tw(t, walkEnd, walkEnd + o.settle, "io")); P._pose = null; }
      else if (bl) { applyPose(g, prev, t); const A = snap(g); applyPose(g, name, t); const B = snap(g); mix(g, A, B, tw(t, key.t0, key.t0 + key.blend, "io")); P._pose = null; }
      else if (P._pose !== name || name === "walk" || k._breath) { applyPose(g, name, t); P._pose = name; }
      // v0.9.0 k.breathe(): a standing or seated person breathes: the body rises and settles from the hips, the head
      // answers, phase per person (re-posed every frame while it is on, so nothing accumulates)
      if (k._breath && !moving) { const B = k._breath, ud = g.userData, ph = (P.i || 0) * 977, s = Math.sin((2 * Math.PI * (t + ph)) / B.period);
        ud.hips.rotation.x += 1.1 * B.amp * s; ud.head.rotation.x -= 1.4 * B.amp * s; ud.fig.position.y += 0.35 * B.amp * (1 + s) * 0.5; P._pose = null; }
      g.position.copy(p); g.rotation.set(0, yaw, 0);
    };
    k.track(P); all.push(P);
    g.position.copy(start); g.rotation.y = o.face || 0;
    return P;
  }
  KIT.actors = { agent, person, all, ACTS };
})();
