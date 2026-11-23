// camera.js (film2 kit, v2-kit): named views, keyframes with easing, the slow drift on holds, and the lint (C1 to C12).
(function () {
  "use strict";
  const T = THREE, RU = () => window.CAMERA_RULES;
  const lerp = FILM.lerp;
  const arr = (v) => (Array.isArray(v) ? v.slice() : v && v.isVector3 ? [v.x, v.y, v.z] : v);
  function norm(p) {
    const R = RU();
    const o = Object.assign({}, p); o.look = arr(o.look); if (o.focus) o.focus = arr(o.focus);
    if (o.aperture != null && R.apertureMax != null && o.aperture > R.apertureMax) o.aperture = R.apertureMax;   // VL 15.24
    o.fov = R.fov; if (o.aperture == null) o.aperture = 0; if (o.yaw == null) o.yaw = R.house.yaw; if (o.pitch == null) o.pitch = R.house.pitch;
    return o;
  }
  function viewOf(v) { const R = RU(); if (typeof v === "string") { if (!R.views[v]) throw new Error("no camera view " + v); return norm(Object.assign({ name: v }, R.views[v])); } return norm(v); }
  function mixPose(a, b, u) {
    const L = (x, y) => [lerp(x[0], y[0], u), lerp(x[1], y[1], u), lerp(x[2], y[2], u)];
    return { look: L(a.look, b.look), dist: Math.exp(lerp(Math.log(a.dist), Math.log(b.dist), u)), yaw: lerp(a.yaw, b.yaw, u), pitch: lerp(a.pitch, b.pitch, u),
      fov: a.fov, aperture: lerp(a.aperture || 0, b.aperture || 0, u), focus: L(a.focus || a.look, b.focus || b.look), size: (u < 0.5 ? a : b).size, name: (u < 0.5 ? a : b).name };
  }
  function make(k) {
    const R = RU();
    let keys = [{ t: 0, pose: viewOf("W") }];
    const C = {
      view: (name) => { keys = [{ t: 0, pose: viewOf(name) }]; return viewOf(name); },
      named: (name) => viewOf(name),
      // a pose that frames a world point at a size band (sprite height in px) and a pitch band
      on(point, o) {
        o = o || {}; const size = o.size || "room";
        const px = o.px || R.sizeTarget[size], sc = o.scale || 1;
        const dist = (o.height || KIT.SCALE.agent) * sc * 1080 / (2 * Math.tan(R.fov * Math.PI / 360) * px);
        const pitchDef = size === "wide" ? R.house.pitch : size === "close" ? -8 : -10;
        return norm({ look: arr(point), dist, yaw: o.yaw != null ? o.yaw : R.house.yaw, pitch: o.pitch != null ? o.pitch : pitchDef,
          focus: arr(o.focus || point), aperture: k.quality === "final" ? (o.aperture != null ? o.aperture : R.apertureFinal[size]) : 0, size });
      },
      // keys: [{t, view|pose, ease}, {t, hold:true}, {t, view, cut:true}, {t, rack:[x,y,z], dur}]
      // A hold drifts in slowly (VL 4.5) unless drift:false; the next move starts from where the drift ended (no pop).
      // A cut jumps to its view at t. A rack moves only the focus, over dur (default 500 ms).
      keys(list) {
        const out = [];
        list.forEach((x) => {
          const prev = out.length ? out[out.length - 1].pose : viewOf("W");
          if (x.rack) { const d = x.dur || 500; out.push({ t: x.t, hold: true, drift: false, pose: prev });
            out.push({ t: x.t + d, ease: "io", pose: Object.assign({}, prev, { focus: arr(x.rack) }) }); return; }
          out.push({ t: x.t, ease: x.ease || "io", hold: !!x.hold, cut: !!x.cut, link: !!x.link, drift: x.drift !== false, pose: x.hold ? prev : viewOf(x.view || x.pose) });
        });
        // the end pose of every segment, with the drift carried forward
        const drifted = (p, u) => Object.assign({}, p, { dist: p.dist * (1 - R.drift.push * u), yaw: p.yaw + R.drift.yaw * u });
        out[0].start = out[0].pose; out[0].end = out[0].pose;
        for (let i = 1; i < out.length; i++) {
          const a = out[i - 1], b = out[i];
          b.start = a.end;
          if (b.cut) { b.end = b.pose; continue; }
          if (b.hold) { b.end = b.drift ? drifted(a.end, 1) : a.end; b.pose = b.end; continue; }
          b.end = b.pose;
        }
        keys = out; return C;
      },
      eval(t) {
        let p;
        if (t <= keys[0].t) p = keys[0].pose;
        else {
          let i = 1; while (i < keys.length && keys[i].t < t) i++;
          if (i >= keys.length) p = keys[keys.length - 1].end;
          else {
            const a = keys[i - 1], b = keys[i];
            if (b.cut) p = t >= b.t ? b.pose : a.end;   // hold until the cut lands at b.t
            else if (b.hold) { const u = FILM.tw(t, a.t, b.t, "sine"); p = b.drift ? Object.assign({}, a.end, { dist: a.end.dist * (1 - R.drift.push * u), yaw: a.end.yaw + R.drift.yaw * u }) : a.end; }
            else p = mixPose(a.end, b.pose, FILM.tw(t, a.t, b.t, b.ease));
          }
        }
        // a link frame (VL 15.22): the key that starts or ends the segment is tagged link:true
        let link = false; if (keys.length) { let j = 0; while (j < keys.length - 1 && keys[j + 1].t <= t) j++; link = !!(keys[j].link || (keys[j + 1] && keys[j + 1].link && keys[j + 1].hold)); }
        p = Object.assign({}, p, { link }); C.current = p; return p;
      },
      get list() { return keys; },
    };
    return C;
  }
  // ---------------------------------------------------------------- the lint: what can be measured from the scene at ms
  function lintAt(k, ms) {
    const R = RU(), out = [];
    FILM.draw(ms);
    const p = k.cam.current, cam = KIT.render.cam, L = k.cam.list;
    const fail = (rule, msg) => out.push({ t: ms, rule, msg });
    const note = (rule, msg) => out.push({ t: ms, rule, msg, note: true });
    const moving = L.some((x, i) => i > 0 && !x.hold && !x.cut && x.t > ms && L[i - 1].t < ms);
    if (Math.abs(p.fov - R.fov) > R.fovTol) fail("VL4.1", `lens ${p.fov} != ${R.fov}`);
    const wide = p.size === "wide" || p.name === "W" || /^W/.test(p.name || "");
    const rg = wide ? R.wRange : R.sRange, drift = R.drift.yaw + 0.5;
    if (!moving && (p.yaw < rg.yaw[0] - 0.01 || p.yaw > rg.yaw[1] + drift)) fail("VL4.2", `${wide ? "W" : "S"} yaw ${p.yaw.toFixed(1)} outside ${rg.yaw.join("..")}`);
    if (!moving && (p.pitch < rg.pitch[0] - 0.01 || p.pitch > rg.pitch[1] + 0.01)) fail("VL4.2", `${wide ? "W" : "S"} pitch ${p.pitch.toFixed(1)} outside ${rg.pitch.join("..")}`);
    if (ms === 0) {
      const moves = L.filter((x, i) => i > 0 && !x.hold && !x.cut).length; if (moves > 1) fail("VL4.5", `${moves} camera moves in one shot (one move a shot)`);
      L.forEach((b, i) => { if (!i || b.hold || b.cut) return; const d = b.t - L[i - 1].t; if (d < R.moveMs[0] || d > R.moveMs[1]) fail("VL4.5", `move ${i} lasts ${d} ms (${R.moveMs.join(" to ")})`); });
    }
    // sizes (VL 4.3), plan 3.1 item 1, whole inside action safe (C9), the subject box (VL 4.6)
    const sprites = (KIT.actors.all || []).filter((a) => a.kind === "agent" && a.root.visible);
    let maxPx = 0, hero = null;
    sprites.forEach((a) => {
      const m = Look.measure(a.spr, cam, 1080), px = m.spritePx; if (px > maxPx) { maxPx = px; hero = a; }
      const r = KIT.render.rectOf(a.spr.userData.squash || a.spr), S = R.actionSafe;
      if (r && (r.x < S.x0 || r.y < S.y0 || r.x + r.w > S.x1 || r.y + r.h > S.y1) && !(r.x > 1920 || r.x + r.w < 0 || r.y > 1080 || r.y + r.h < 0)) fail("C9", `${a.name} cut at the frame edge`);
    });
    if (p.link) { if (sprites.length && maxPx < 170) fail("VL15.22", `link frame: subject ${maxPx.toFixed(0)} px < 170`); }
    else if (p.size && sprites.length && !moving) { const b = R.sizes[p.size]; if (maxPx < b[0] * 0.95 || maxPx > b[1] * 1.05) fail("VL4.3", `${p.size}: hero ${maxPx.toFixed(0)} px, band ${b[0]}-${b[1]}`); }
    // VL 15.24: blur at final quality, from the lens: diameter = 2 x aperture x focal(px) x |1/d - 1/D| at each agent's face
    const ap = Math.min(p.aperture || 0, R.apertureMax || 1);
    if (ap > 0) { const fpx = 540 / Math.tan(R.fov * Math.PI / 360), camPos = cam.position, fwd = new THREE.Vector3(); cam.getWorldDirection(fwd);
      const D = new THREE.Vector3(...(p.focus || p.look)).sub(camPos).dot(fwd);
      sprites.forEach((a) => { const head = a.spr.localToWorld(new THREE.Vector3(0, 0.62, 0)), d = head.clone().sub(camPos).dot(fwd), blur = 2 * ap * fpx * Math.abs(1 / d - 1 / D);
        const q = KIT.render.project(head); if (q.x < 0 || q.x > 1920 || q.y < 0 || q.y > 1080) return;
        if (blur > 10) fail("VL15.24", `${a.name}'s face blurred ${blur.toFixed(0)} px at final (aperture ${ap})`); }); }
    // words: inside graphics safe and out of the subtitle band
    document.querySelectorAll("#ui .w").forEach((el) => { if (el.closest("[style*='hidden']") || +getComputedStyle(el).opacity < 0.05) return; const r = el.getBoundingClientRect(), G = R.graphicsSafe;
      if (!r.width) return;
      if (r.left < G.x0 || r.top < G.y0 || r.right > G.x1 || r.bottom > G.y1) fail("VL4.6", `words "${el.textContent.slice(0, 30)}" outside graphics safe`);
      if (r.bottom > R.subtitleBand.y0 && r.top < R.subtitleBand.y1) fail("VL7", `words "${el.textContent.slice(0, 30)}" in the subtitle band`); });
    return { t: ms, pitch: +p.pitch.toFixed(2), yaw: +p.yaw.toFixed(2), dist: +p.dist.toFixed(2), size: p.size || null, heroPx: +maxPx.toFixed(0), hero: hero ? hero.name : null, fails: out };
  }
  KIT.camera = { make, lintAt, viewOf };
})();
