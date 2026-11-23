// render.js (film2 kit, v2-kit): the clay renderer. Seeded from v2-visuals' prototype (outputs/lanes/v2-visuals/proto/kit.js).
// Film frames are not real time, so a final frame is the average of K renders. Each pass jitters
//   (a) the key light over a disc -> soft area shadows; (b) a sky light over the upper hemisphere -> occlusion;
//   (c) the camera by a sub-pixel -> anti-aliasing; (d) the camera over a lens disc aimed at the focus -> depth of field.
// Draft quality is one pass with no jitter (blocking, the animatic, the lint).
(function () {
  "use strict";
  const T = THREE, W = 1920, H = 1080;
  const halton = FILM.halton;
  const PAL = {
    page: 0xfbfaf7, earth: 0xdccbb2, earthCut: 0xc9b596, slab: 0xf3ece0, wall: 0xf9f5ee, wallWarm: 0xf8f2e8,   // VL 2 v1.7: rooms near white inside
    white: 0xfbf8f2, coral: 0xf06e42, band: 0x77767a, navy: 0x34507a, green: 0xE8A200, greenSoft: 0xF7E6B5,
    ink: 0x111418, refusal: 0xc8372d, glow: 0xffd9a0, glass: 0xbfd6e2, card: 0xfdfcf9, grey: 0xb9b3a8, paper: 0xf7efe0, table: 0xf3ece0, tableEdge: 0xe6dccb,
  };
  const mats = {};
  function mat(name, opt) {
    const key = name + (opt ? JSON.stringify(opt) : "");
    if (mats[key]) return mats[key];
    const o = Object.assign({ color: PAL[name] !== undefined ? PAL[name] : 0xffffff, roughness: 0.82, metalness: 0 }, opt || {});
    return (mats[key] = new T.MeshStandardMaterial(o));
  }
  // ---------- geometry helpers (from the prototype)
  function rrShape(w, h, r) {
    const s = new T.Shape(), x = -w / 2, y = -h / 2; r = Math.min(r, w / 2, h / 2);
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0);
    s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2);
    s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
    s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, 1.5 * Math.PI); return s;
  }
  const geoCache = {};
  function rboxGeo(w, h, d, r, b) {
    const k = [w, h, d, r, b].map((v) => v.toFixed(3)).join("_"); if (geoCache[k]) return geoCache[k];
    b = Math.min(b, d / 2 - 1e-3, w / 2 - 1e-3, h / 2 - 1e-3);
    const g = new T.ExtrudeGeometry(rrShape(w - 2 * b, h - 2 * b, Math.max(r - b, 0.001)), { depth: d - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 4, curveSegments: 10 });
    g.translate(0, 0, -(d - 2 * b) / 2); g.computeVertexNormals(); return (geoCache[k] = g);
  }
  function rbox(w, h, d, m, r, b) {
    r = r === undefined ? Math.min(w, h, d) * 0.12 : r; b = b === undefined ? Math.min(Math.min(w, h, d) * 0.1, 0.06) : b;
    const me = new T.Mesh(rboxGeo(w, h, d, r, b), typeof m === "string" ? mat(m) : m); me.castShadow = me.receiveShadow = true; return me;
  }
  function add(parent, o, x, y, z) { if (x !== undefined) o.position.set(x, y, z); parent.add(o); return o; }

  // ---------- the renderer
  let renderer, scene, cam, keyL, skyL, hemi, fill, veilC = null, accRT, passRT, quadScene, quadCam, quadMat, outMat, quad;
  const state = { K: 1, quality: "draft", focus: new T.Vector3(), keyDir: new T.Vector3(-0.55, 1, 0.75).normalize(), keySpread: 0.11,
    extent: 16, centre: new T.Vector3(0, -2, -2), camBase: null, look: null, aperture: 0, frames: 0 };
  function init(canvas, quality) {
    state.quality = quality === "final" ? "final" : "draft";
    const qk = new URLSearchParams(location.search).get("k");
    state.K = qk ? +qk : state.quality === "final" ? 40 : 8;   // v2-visuals 071309: final K 40, draft K 8 (never 1)
    renderer = new T.WebGLRenderer({ canvas, antialias: state.K === 1, preserveDrawingBuffer: true, alpha: false });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false);
    renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.NoToneMapping;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = true;
    renderer.localClippingEnabled = true;
    scene = new T.Scene(); scene.background = new T.Color(PAL.page);
    cam = new T.PerspectiveCamera(20, W / H, 0.5, 600);
    const QP = new URLSearchParams(location.search);
    hemi = new T.HemisphereLight(0xffffff, 0xf3e7d6, QP.get("hemi") != null ? +QP.get("hemi") : 0.75); scene.add(hemi);
    fill = new T.DirectionalLight(0xffffff, QP.get("fill") != null ? +QP.get("fill") : 0.55); fill.position.set(2, 3, 20); scene.add(fill);
    keyL = new T.DirectionalLight(0xfff4e6, QP.get("key") != null ? +QP.get("key") : 1.6); skyL = new T.DirectionalLight(0xf2f6ff, QP.get("sky") != null ? +QP.get("sky") : 1.05);
    [keyL, skyL].forEach((l, i) => { l.castShadow = true; const m = state.K === 1 ? (i ? 1024 : 2048) : (i ? 2048 : 4096); l.shadow.mapSize.set(m, m); l.shadow.bias = -0.0006; l.shadow.normalBias = 0.03; l.shadow.radius = 2; scene.add(l); scene.add(l.target); });
    const opt = { type: T.HalfFloatType, minFilter: T.LinearFilter, magFilter: T.LinearFilter, depthBuffer: true };
    passRT = new T.WebGLRenderTarget(W, H, opt); accRT = new T.WebGLRenderTarget(W, H, Object.assign({}, opt, { depthBuffer: false }));
    quadScene = new T.Scene(); quadCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    quadMat = new T.MeshBasicMaterial({ map: passRT.texture, transparent: true, depthTest: false, depthWrite: false, toneMapped: false });
    outMat = new T.MeshBasicMaterial({ map: accRT.texture, depthTest: false, depthWrite: false, toneMapped: false });
    quad = new T.Mesh(new T.PlaneGeometry(2, 2), quadMat); quadScene.add(quad);
    return { renderer, scene, cam };
  }
  function fitShadow(l, dir) {
    const e = state.extent, c = state.centre; l.target.position.copy(c); l.position.copy(c).addScaledVector(dir, 80);
    const s = l.shadow.camera; s.left = -e; s.right = e; s.top = e; s.bottom = -e; s.near = 5; s.far = 200; s.updateProjectionMatrix();
  }
  const _d = new T.Vector3(), _r = new T.Vector3(), _u = new T.Vector3();
  const toV = (v) => (Array.isArray(v) ? new T.Vector3(v[0], v[1], v[2]) : v.clone());
  // pose: { look, dist, yaw, pitch (deg; negative looks down), fov, focus?, aperture? }
  function setCam(c) {
    const yaw = c.yaw * Math.PI / 180, pit = c.pitch * Math.PI / 180, look = toV(c.look);
    _d.set(Math.sin(yaw) * Math.cos(pit), -Math.sin(pit), Math.cos(yaw) * Math.cos(pit));
    cam.fov = c.fov || 20; cam.position.copy(look).addScaledVector(_d, c.dist); cam.up.set(0, 1, 0); cam.lookAt(look);
    cam.clearViewOffset(); cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
    state.camBase = cam.position.clone(); state.look = look; state.focus.copy(c.focus ? toV(c.focus) : look);
    state.aperture = state.K > 1 ? c.aperture || 0 : 0;
  }
  function draw(pose) {
    setCam(pose);
    const K = state.K, base = state.camBase;
    if (K === 1) {
      fitShadow(keyL, state.keyDir); skyL.castShadow = false; fitShadow(skyL, new T.Vector3(0.1, 1, 0.6).normalize());
      renderer.setRenderTarget(null); renderer.render(scene, cam); state.frames++; return;
    }
    skyL.castShadow = true;
    _r.setFromMatrixColumn(cam.matrixWorld, 0); _u.setFromMatrixColumn(cam.matrixWorld, 1);
    const right = _r.clone(), up = _u.clone();
    const fwd = new T.Vector3().subVectors(state.look, base).normalize(); const D = new T.Vector3().subVectors(state.focus, base).dot(fwd);
    const tanH = Math.tan(cam.fov * Math.PI / 360), pxPerUnit = (H / 2) / (tanH * D);
    const rot = new T.Quaternion().setFromRotationMatrix(new T.Matrix4().lookAt(base, state.look, new T.Vector3(0, 1, 0)));
    for (let i = 0; i < K; i++) {
      const a = halton(i + 1, 2), b = halton(i + 1, 3), c = halton(i + 1, 5), d = halton(i + 1, 7);
      const ang = 2 * Math.PI * a, rad = Math.sqrt(b) * state.keySpread;
      const kd = state.keyDir.clone().addScaledVector(new T.Vector3(1, 0, 0), Math.cos(ang) * rad).addScaledVector(new T.Vector3(0, 0, 1), Math.sin(ang) * rad).normalize(); fitShadow(keyL, kd);
      const phi = 2 * Math.PI * c, ct = Math.sqrt(1 - d * 0.92), st = Math.sqrt(1 - ct * ct);
      const sd = new T.Vector3(st * Math.cos(phi), ct, st * Math.sin(phi) * 0.9 + 0.55).normalize(); fitShadow(skyL, sd);
      const la = 2 * Math.PI * halton(i + 1, 11), lr = Math.sqrt(halton(i + 1, 13)) * state.aperture, lx = Math.cos(la) * lr, ly = Math.sin(la) * lr;
      cam.position.copy(base).addScaledVector(right, lx).addScaledVector(up, ly);
      cam.quaternion.copy(rot);
      cam.setViewOffset(W, H, (a - 0.5) - lx * pxPerUnit, (b - 0.5) + ly * pxPerUnit, W, H);
      cam.updateMatrixWorld(true);
      renderer.setRenderTarget(passRT); renderer.clear(); renderer.render(scene, cam);
      quad.material = quadMat; quadMat.opacity = 1 / (i + 1);
      renderer.setRenderTarget(accRT); const ac = renderer.autoClear; renderer.autoClear = false; if (i === 0) renderer.clear(); renderer.render(quadScene, quadCam); renderer.autoClear = ac;
    }
    cam.clearViewOffset(); cam.position.copy(base); cam.lookAt(state.look); cam.updateMatrixWorld(true);
    quad.material = outMat; renderer.setRenderTarget(null); renderer.render(quadScene, quadCam); state.frames++;
  }
  // show player (23 Nov): one accumulation pass at a time, so a frame at rest softens over a few display frames while the
  // presenter talks (draw() with K 1 during a move; refine(0..K-1) once the camera rests). Same jitter as draw()'s K loop.
  function refine(i) {
    const base = state.camBase; if (!base) return;
    skyL.castShadow = true;
    _r.setFromMatrixColumn(cam.matrixWorld, 0); _u.setFromMatrixColumn(cam.matrixWorld, 1);
    const right = _r.clone(), up = _u.clone();
    const fwd = new T.Vector3().subVectors(state.look, base).normalize(); const D = new T.Vector3().subVectors(state.focus, base).dot(fwd);
    const tanH = Math.tan(cam.fov * Math.PI / 360), pxPerUnit = (H / 2) / (tanH * D);
    const rot = new T.Quaternion().setFromRotationMatrix(new T.Matrix4().lookAt(base, state.look, new T.Vector3(0, 1, 0)));
    const a = halton(i + 1, 2), b = halton(i + 1, 3), c = halton(i + 1, 5), d = halton(i + 1, 7);
    const ang = 2 * Math.PI * a, rad = Math.sqrt(b) * state.keySpread;
    const kd = state.keyDir.clone().addScaledVector(new T.Vector3(1, 0, 0), Math.cos(ang) * rad).addScaledVector(new T.Vector3(0, 0, 1), Math.sin(ang) * rad).normalize(); fitShadow(keyL, kd);
    const phi = 2 * Math.PI * c, ct = Math.sqrt(1 - d * 0.92), st = Math.sqrt(1 - ct * ct);
    const sd = new T.Vector3(st * Math.cos(phi), ct, st * Math.sin(phi) * 0.9 + 0.55).normalize(); fitShadow(skyL, sd);
    cam.position.copy(base); cam.quaternion.copy(rot);
    cam.setViewOffset(W, H, (a - 0.5), (b - 0.5), W, H);
    cam.updateMatrixWorld(true);
    renderer.setRenderTarget(passRT); renderer.clear(); renderer.render(scene, cam);
    quad.material = quadMat; quadMat.opacity = 1 / (i + 1);
    renderer.setRenderTarget(accRT); const ac = renderer.autoClear; renderer.autoClear = false; if (i === 0) renderer.clear(); renderer.render(quadScene, quadCam); renderer.autoClear = ac;
    cam.clearViewOffset(); cam.position.copy(base); cam.lookAt(state.look); cam.updateMatrixWorld(true);
    quad.material = outMat; renderer.setRenderTarget(null); renderer.render(quadScene, quadCam);
    skyL.castShadow = false;
  }
  // world point -> screen pixel (at the rest camera of the current frame)
  function project(v) { const p = toV(v).project(cam); return { x: (p.x * 0.5 + 0.5) * W, y: (-p.y * 0.5 + 0.5) * H, behind: p.z > 1 }; }
  // the projected rect of an object (for push-ins and the lint)
  function rectOf(obj) {
    const b = new T.Box3().setFromObject(obj); if (b.isEmpty()) return null;
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let i = 0; i < 8; i++) { const p = project(new T.Vector3(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z)); x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  async function ready() {
    const tex = window.Look && Look.markTexture ? Look.markTexture(renderer) : null;
    if (tex && tex.image && tex.image.decode) { try { await tex.image.decode(); } catch (e) { /* data url */ } tex.needsUpdate = true; }
  }
  // ---------- the veil (k.grade): page colour over the picture, soft holes round the excepted actors
  function veil(t, grades) {
    if (!grades.length) return;
    if (!veilC) { veilC = document.createElement("canvas"); veilC.width = W; veilC.height = H; veilC.id = "veil"; veilC.style.cssText = "position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none"; const c = document.getElementById("c"); c.parentNode.insertBefore(veilC, c.nextSibling); }
    const g = veilC.getContext("2d"); g.clearRect(0, 0, W, H);
    for (const gr of grades) {
      const v = FILM.tw(t, gr.t0, gr.t0 + gr.dur, "io") * (gr.t1 != null ? 1 - FILM.tw(t, gr.t1, gr.t1 + gr.out, "io") : 1); if (v <= 0.001) continue;
      g.globalCompositeOperation = "source-over"; g.fillStyle = `rgba(251,250,247,${gr.dim * v})`; g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = "destination-out";
      for (const a of gr.except) { const r = rectOf(a.root || a); if (!r) continue; const cx = r.x + r.w / 2, cy = r.y + r.h / 2, rad = Math.max(r.w, r.h) * 0.85;
        const rg = g.createRadialGradient(cx, cy, rad * 0.45, cx, cy, rad); rg.addColorStop(0, "rgba(0,0,0,1)"); rg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = rg; g.fillRect(cx - rad, cy - rad, 2 * rad, 2 * rad); }
    }
    g.globalCompositeOperation = "source-over";
  }
  // ---------- light presets (gated by CAMERA_RULES.allowLight; VL 3)
  const PRESETS = { dawn: { key: 0xffe2c4, k: 1.0, hemi: 0.55 }, cool: { key: 0xeef3ff, k: 1.1, hemi: 0.58 }, warm: { key: 0xfff0dc, k: 1.3, hemi: 0.63 }, base: { key: 0xfff4e6, k: 1.6, hemi: 0.75 } };   // v2-visuals 113700: the page bar (VL 15.43) holds at key 1.6, sky 1.05, hemisphere 0.75
  const lightKeys = [];
  function lightKey(t0, dur, o) { lightKeys.push({ t0, dur, p: PRESETS[o.preset] || PRESETS.base }); lightKeys.sort((a, b) => a.t0 - b.t0); }
  function evalLight(t) {
    if (!keyL || !window.CAMERA_RULES || !CAMERA_RULES.allowLight || !lightKeys.length) return;
    let c = new T.Color(PRESETS.base.key), k = PRESETS.base.k, h = PRESETS.base.hemi;
    for (const L of lightKeys) { if (L.t0 > t) break; const u = FILM.tw(t, L.t0, L.t0 + L.dur, "io"); c = c.clone().lerp(new T.Color(L.p.key), u); k = FILM.lerp(k, L.p.k, u); h = FILM.lerp(h, L.p.hemi, u); }
    keyL.color.copy(c); keyL.intensity = k; hemi.intensity = h;
  }
  KIT.render = { veil, lightKey, evalLight, init, draw, refine, setCam, project, rectOf, ready, state, get cam() { return cam; }, get scene() { return scene; }, get renderer() { return renderer; } };
  KIT.parts = { T, PAL, mat, rbox, rrShape, add };
})();
