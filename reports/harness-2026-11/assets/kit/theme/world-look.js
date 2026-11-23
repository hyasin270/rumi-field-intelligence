/* world-look.js: the look module of the engine lane (window.Look). Sorted before world.js ("world-" < "world.").
   Owner: engine/module. Base: r-engine proto-c3's world-look.js (r158), pinned by RULINGS R10 §3 and DESIGN §9.3, with:
   - the sprite section replaced by lookdev's world-look-sprite-v2.js (the R8b sprite: 2.30 to 1 lathe capsule, stadium
     window 2.6 to 1, no legs, no band, the mark file as a decal; poses stand | reach | read), plus the pencil hook;
   - the paper pre-compensated through the Khronos PBR Neutral curve (lookdev variant-a paperThroughNeutral): Look.paper();
   - every light, shadow, material and glass value read from tokens.css v3 (--look-*) and the colour tokens at apply()
     time, with the v3 values as fallbacks when the page carries no tokens.css: Look.token(name, fallback);
   - Look.lathe, Look.capsule, a radius floor on Look.box (C1 §1), a shadow frustum that covers the whole building and
     the ground block, Look.person({ pose: stand | sit | walk }).

   What apply() sets: sRGB output, Khronos PBR Neutral tone mapping (r158 has no NeutralToneMapping, so it is installed as
   CustomToneMapping), PCF-soft shadows, a three-point studio light (key upper left front, like the plates' painted key)
   plus a soft-box environment (PMREM) for reflections and glass fresnel. MSAA is the canvas's (antialias: true).
   Nothing here touches the DOM or THREE at load time beyond defining functions. */
(function () {
  "use strict";
  if (typeof THREE === "undefined") return;
  var T = THREE;

  /* ---------------------------------------------------------------- tokens (tokens.css v3) */
  var FALLBACK = {
    "--ground": "#FBFAF7", "--ground-lift": "#FFFFFF", "--ground-deep": "#F1EFE9", "--glass-edge": "#C9C6BD",
    "--hair": "#C9C6BD", "--ink": "#111418", "--clay": "#D9D5CC", "--clay-deep": "#B8B3A8", "--ink-quiet": "#4A5059",
    "--ink-dim": "#5F656E", "--green": "#001F3F", "--sprite": "#F06E42", "--sprite-visor": "#FFFFFF",
    "--sprite-face": "#001F3F", "--sprite-judge": "#111418",
    "--look-tonemap": "neutral", "--look-exposure": "1.0", "--look-colour-space": "srgb", "--look-aa": "msaa",
    "--look-render-scale": "2", "--look-film-fps": "30",
    "--look-key-colour": "#FFF3E6", "--look-key-intensity": "2.4", "--look-key-pos": "-10 22 16",
    "--look-fill-colour": "#E6EEFF", "--look-fill-intensity": "0.7", "--look-fill-pos": "16 6 12",
    "--look-rim-colour": "#FFFFFF", "--look-rim-intensity": "1.3", "--look-rim-pos": "6 12 -18",
    "--look-hemi-sky": "#FFFFFF", "--look-hemi-ground": "#E9E4DC", "--look-hemi-intensity": "0.55",
    "--look-env": "studio", "--look-env-intensity": "0.7",
    "--look-shadow-type": "pcf-soft", "--look-shadow-map": "4096", "--look-shadow-radius": "3",
    "--look-shadow-bias": "-0.0003", "--look-shadow-normal-bias": "0.025", "--look-contact-blob": "0.12",
    "--look-ao-mode": "contact", "--look-ao-radius": "0.35", "--look-ao-intensity": "0.8",
    "--look-clay-roughness": "0.62", "--look-clay-sheen": "0.0", "--look-cut-roughness": "0.55",
    "--look-sprite-roughness": "0.42", "--look-sprite-clearcoat": "0.6", "--look-sprite-clearcoat-roughness": "0.22",
    "--look-sprite-sheen": "0.4", "--look-visor-roughness": "0.16", "--look-visor-clearcoat": "1",
    "--look-visor-relief": "0.050", "--look-edge-radius": "0.02",
    "--look-glass-transmission": "1.0", "--look-glass-roughness": "0.04", "--look-glass-ior": "1.5",
    "--look-glass-thickness": "0.06", "--look-glass-attenuation": "#DCE6EE", "--look-glass-env": "1.25",
    "--look-plate-width": "3840", "--look-plate-overscan": "0.15", "--look-plate-grid": "512 288",
    "--look-plate-jump": "0.15", "--look-cone-yaw": "20", "--look-cone-pitch": "6", "--look-cone-dolly": "0.7 1.4",
    "--look-xfade-ms": "400", "--look-xfade-mode": "reproject", "--look-surface": "slab-edge",
    "--look-found-sprite-px": "210"
  };
  // a CSS custom property is a string: "#FFF3E6" -> 0xFFF3E6, "2.4" -> 2.4, "-10 22 16" -> [-10, 22, 16], "1600ms" -> 1600,
  // anything else (neutral, studio, rgba(...)) stays a string
  function parseToken(s) {
    if (s == null) return null;
    if (typeof s !== "string") return s;
    s = s.trim();
    if (!s) return null;
    var h = /^#([0-9a-f]{3,8})$/i.exec(s);
    if (h) {
      var x = h[1];
      if (x.length === 3 || x.length === 4) x = x[0] + x[0] + x[1] + x[1] + x[2] + x[2];
      return parseInt(x.slice(0, 6), 16);
    }
    var parts = s.split(/\s+/), nums = [];
    for (var i = 0; i < parts.length; i++) {
      var m = /^(-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?)(px|ms|deg)?$/i.exec(parts[i]);
      if (!m) return s;
      nums.push(parseFloat(m[1]));
    }
    return nums.length === 1 ? nums[0] : nums;
  }
  var tokCache = {}, tokStyle = null;
  function token(name, fallback) {
    if (name.slice(0, 2) !== "--") name = "--" + name;
    if (Object.prototype.hasOwnProperty.call(tokCache, name)) return tokCache[name];
    var raw = "";
    try {
      if (!tokStyle && typeof document !== "undefined") tokStyle = getComputedStyle(document.documentElement);
      if (tokStyle) raw = tokStyle.getPropertyValue(name);
    } catch (e) { raw = ""; }
    var v = parseToken(raw);
    if (v == null) v = parseToken(FALLBACK[name]);
    if (v == null) v = parseToken(fallback);
    tokCache[name] = v;
    return v;
  }
  function tnum(name, fb) { var v = token(name, fb); return typeof v === "number" ? v : Array.isArray(v) ? v[0] : fb; }
  function tcol(name, fb) { var v = token(name, fb); return typeof v === "number" ? v : fb; }
  function tvec(name, fb) { var v = token(name); return Array.isArray(v) && v.length >= 3 ? new T.Vector3(v[0], v[1], v[2]) : new T.Vector3(fb[0], fb[1], fb[2]); }
  function readTokens() { tokCache = {}; tokStyle = null; refreshTOK(); }

  // the named colours every builder uses (kept from proto-c3; the token-backed ones are refreshed at apply())
  var TOK = {
    paper: 0xFBFAF7,   // --ground
    clay: 0xF2EFEA,    // slabs, desks, the ledger board: warm white clay (no token: one step off the paper)
    wall: 0xEDE9E3,    // the solid back wall of the floor below
    cap: 0xB8B3A8,     // --clay-deep: the cut face of a wall or slab in the cross-section
    clayDeep: 0xB8B3A8,
    frame: 0x2B3036,   // posts and the door frame: ink, softened
    person: 0xD9D5CC,  // --clay: the people above, warm grey clay
    coral: 0xF06E42,   // --sprite
    visor: 0xFFFFFF,   // --sprite-visor
    ink: 0x111418, inkDim: 0x5F656E, inkQuiet: 0x4A5059, hair: 0xC9C6BD, green: 0x006600,
    groundLift: 0xFFFFFF, groundDeep: 0xF1EFE9,
    shadow: "rgba(17,20,24,"
  };
  function refreshTOK() {
    TOK.paper = tcol("--ground", 0xFBFAF7); TOK.cap = TOK.clayDeep = tcol("--clay-deep", 0xB8B3A8);
    TOK.person = tcol("--clay", 0xD9D5CC); TOK.coral = tcol("--sprite", 0xF06E42); TOK.visor = tcol("--sprite-visor", 0xFFFFFF);
    TOK.ink = tcol("--ink", 0x111418); TOK.inkDim = tcol("--ink-dim", 0x5F656E); TOK.inkQuiet = tcol("--ink-quiet", 0x4A5059);
    TOK.hair = tcol("--hair", 0xC9C6BD); TOK.green = tcol("--green", 0x006600);
    TOK.groundLift = tcol("--ground-lift", 0xFFFFFF); TOK.groundDeep = tcol("--ground-deep", 0xF1EFE9);
    var i = TOK.ink;
    TOK.shadow = "rgba(" + ((i >> 16) & 255) + "," + ((i >> 8) & 255) + "," + (i & 255) + ",";
    if (window.Look) window.Look.paperHex = TOK.paper;
  }
  function edgeRadius() { return tnum("--look-edge-radius", 0.02); }

  /* ---------------------------------------------------------------- tone mapping: Khronos PBR Neutral */
  var NEUTRAL_GLSL = "vec3 CustomToneMapping( vec3 color ) {\n" +
    "  const float StartCompression = 0.8 - 0.04; const float Desaturation = 0.15;\n" +
    "  color *= toneMappingExposure;\n" +
    "  float x = min( color.r, min( color.g, color.b ) );\n" +
    "  float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;\n" +
    "  color -= offset;\n" +
    "  float peak = max( color.r, max( color.g, color.b ) );\n" +
    "  if ( peak < StartCompression ) return color;\n" +
    "  float d = 1. - StartCompression;\n" +
    "  float newPeak = 1. - d * d / ( peak + d - StartCompression );\n" +
    "  color *= newPeak / peak;\n" +
    "  float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );\n" +
    "  return mix( color, vec3( newPeak ), g );\n}";
  function installNeutral() {
    var src = T.ShaderChunk.tonemapping_pars_fragment;
    if (src.indexOf("StartCompression") >= 0) return;
    T.ShaderChunk.tonemapping_pars_fragment = src.replace("vec3 CustomToneMapping( vec3 color ) { return color; }", NEUTRAL_GLSL);
  }
  // the same curve in JS (linear in, linear out), exposure included
  function neutral(c, exp) {
    c = [c[0] * exp, c[1] * exp, c[2] * exp];
    var x = Math.min(c[0], c[1], c[2]), off = x < 0.08 ? x - 6.25 * x * x : 0.04;
    c = [c[0] - off, c[1] - off, c[2] - off];
    var peak = Math.max(c[0], c[1], c[2]); if (peak < 0.76) return c;
    var d = 0.24, np = 1 - d * d / (peak + d - 0.76);
    c = c.map(function (v) { return v * np / peak; });
    var g = 1 - 1 / (0.15 * (peak - np) + 1);
    return c.map(function (v) { return v * (1 - g) + np * g; });
  }
  /* the paper, pre-compensated (lookdev variant-a paperThroughNeutral): the linear colour that the Neutral curve at the
     current exposure maps onto --ground. Use it for any paper drawn as a tone-mapped surface (mat.paper, a ground plane,
     a texture background). The clear colour is NOT tone mapped in r158, so apply() clears to --ground itself. */
  function paper(hex, exp) {
    if (hex == null) hex = TOK.paper;
    if (exp == null) exp = tnum("--look-exposure", 1);
    var t = new T.Color(hex), tgt = [t.r, t.g, t.b], cin = tgt.slice();   // THREE.Color holds linear values
    if (toneMapName() !== "neutral") return t;
    for (var i = 0; i < 400; i++) {
      var o = neutral(cin, exp);
      for (var j = 0; j < 3; j++) cin[j] = Math.max(0, cin[j] + (tgt[j] - o[j]) * 2.0);
    }
    var col = new T.Color(); col.setRGB(cin[0], cin[1], cin[2], T.LinearSRGBColorSpace);
    return col;
  }
  function toneMapName() { var v = token("--look-tonemap"); return typeof v === "string" ? v.toLowerCase() : "neutral"; }

  /* ---------------------------------------------------------------- environment: a white room with soft boxes */
  function studioEnv(renderer) {
    var env = new T.Scene();
    var room = new T.Mesh(new T.BoxGeometry(40, 24, 40), new T.MeshBasicMaterial({ color: 0xC9C6C1, side: T.BackSide }));
    room.position.y = 6; env.add(room);
    function box(w, h, d, x, y, z, k) {
      var m = new T.MeshBasicMaterial({ color: new T.Color(k, k, k) });
      var b = new T.Mesh(new T.BoxGeometry(w, h, d), m); b.position.set(x, y, z); env.add(b);
    }
    box(30, 0.4, 30, 0, 17.8, 0, 2.2);      // overhead
    box(10, 8, 0.4, -10, 8, 19.6, 5.0);     // key, front left
    box(0.4, 8, 14, 19.6, 6, 4, 1.6);       // fill, right
    box(14, 5, 0.4, 6, 9, -19.6, 3.0);      // rim, behind
    box(40, 0.4, 40, 0, -5.8, 0, 1.1);      // bounce from a white floor
    var pm = new T.PMREMGenerator(renderer);
    var rt = pm.fromScene(env, 0.035);
    pm.dispose();
    env.traverse(function (o) { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
    return rt.texture;
  }

  /* ---------------------------------------------------------------- renderer + lights */
  var lights = null;
  // the key's shadow covers the building (x -12..12, y -8..4, z -5..5) and the ground block (x ±30)
  var SHADOW = { half: 32, near: 1, far: 120 };
  function apply(scene, renderer, opt) {
    opt = opt || {};
    readTokens();
    installNeutral();
    renderer.outputColorSpace = T.SRGBColorSpace;
    var tm = toneMapName();
    renderer.toneMapping = tm === "none" ? T.NoToneMapping : tm === "aces" ? T.ACESFilmicToneMapping :
      tm === "agx" && T.AgXToneMapping ? T.AgXToneMapping : T.CustomToneMapping;
    renderer.toneMappingExposure = tnum("--look-exposure", 1);
    renderer.shadowMap.enabled = true;
    var st = String(token("--look-shadow-type") || "pcf-soft").toLowerCase();
    renderer.shadowMap.type = st === "pcf" ? T.PCFShadowMap : st === "vsm" ? T.VSMShadowMap : st === "basic" ? T.BasicShadowMap : T.PCFSoftShadowMap;
    renderer.setClearColor(TOK.paper, 1);
    scene.background = null;   // the clear colour is the paper exactly (r158 does not tone map it)
    scene.environment = studioEnv(renderer);

    var key = new T.DirectionalLight(tcol("--look-key-colour", 0xFFF3E6), tnum("--look-key-intensity", 2.4));
    key.position.copy(tvec("--look-key-pos", [-10, 22, 16])); key.castShadow = true;
    var ms = Math.round(tnum("--look-shadow-map", 4096)); key.shadow.mapSize.set(ms, ms);
    var sc = key.shadow.camera;
    sc.left = -SHADOW.half; sc.right = SHADOW.half; sc.top = SHADOW.half; sc.bottom = -SHADOW.half;
    sc.near = SHADOW.near; sc.far = SHADOW.far; sc.updateProjectionMatrix();
    key.shadow.bias = tnum("--look-shadow-bias", -0.0003); key.shadow.normalBias = tnum("--look-shadow-normal-bias", 0.025);
    key.shadow.radius = tnum("--look-shadow-radius", 3);   // used by PCF and VSM; r158's PCF-soft has a fixed kernel
    var fill = new T.DirectionalLight(tcol("--look-fill-colour", 0xE6EEFF), tnum("--look-fill-intensity", 0.7));
    fill.position.copy(tvec("--look-fill-pos", [16, 6, 12]));
    var rim = new T.DirectionalLight(tcol("--look-rim-colour", 0xFFFFFF), tnum("--look-rim-intensity", 1.3));
    rim.position.copy(tvec("--look-rim-pos", [6, 12, -18]));
    var hemi = new T.HemisphereLight(tcol("--look-hemi-sky", 0xFFFFFF), tcol("--look-hemi-ground", 0xE9E4DC), tnum("--look-hemi-intensity", 0.55));
    [key, fill, rim, hemi].forEach(function (l) { scene.add(l); });
    scene.add(key.target);
    lights = { key: key, fill: fill, rim: rim, hemi: hemi };
    return lights;
  }

  /* ---------------------------------------------------------------- rounded box
     A BoxGeometry with (2*seg+1) segments per axis whose grid lines are pushed into the corner zones, then every vertex
     projected onto the rounded solid: c = clamp(p, inner box), p = c + normalize(p - c) * r. Face groups and UVs are kept,
     so a material array still puts a picture on one face (index 4 is +z, the front). r is used as given (Look.box floors it). */
  var boxCache = {};
  function roundedBox(w, h, d, r, seg) {
    seg = seg || 5;
    r = Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4);
    var key = [w, h, d, r, seg].join(",");
    if (boxCache[key]) return boxCache[key];
    var N = 2 * seg + 1, g = new T.BoxGeometry(w, h, d, N, N, N);
    var hx = w / 2, hy = h / 2, hz = d / 2;
    function remap(u, half) {
      // u in [-half, half] on a uniform grid of N steps -> corner zones get seg steps each, the middle gets one
      var i = Math.round((u + half) / (2 * half) * N);
      if (i <= seg) return -half + r * (1 - Math.cos(i / seg * Math.PI / 2));
      var j = N - i; return half - r * (1 - Math.cos(j / seg * Math.PI / 2));
    }
    var pos = g.attributes.position, nor = g.attributes.normal, uv = g.attributes.uv;
    var p = new T.Vector3(), c = new T.Vector3(), n = new T.Vector3();
    // UVs follow the moved grid, so a picture on a face spans the face (not one grid cell)
    function frac(u, half) { return (remap(u * 2 * half - half, half) + half) / (2 * half); }
    for (var q = 0; q < uv.count; q++) {
      var ax = Math.abs(nor.getX(q)), ay = Math.abs(nor.getY(q));
      var hu = ax > 0.5 ? hz : hx, hv = ay > 0.5 ? hz : hy;
      uv.setXY(q, frac(uv.getX(q), hu), frac(uv.getY(q), hv));
    }
    for (var k = 0; k < pos.count; k++) {
      p.set(remap(pos.getX(k), hx), remap(pos.getY(k), hy), remap(pos.getZ(k), hz));
      c.set(Math.max(-hx + r, Math.min(hx - r, p.x)), Math.max(-hy + r, Math.min(hy - r, p.y)), Math.max(-hz + r, Math.min(hz - r, p.z)));
      n.subVectors(p, c);
      if (n.lengthSq() < 1e-12) n.set(nor.getX(k), nor.getY(k), nor.getZ(k));
      n.normalize();
      p.copy(c).addScaledVector(n, r);
      pos.setXYZ(k, p.x, p.y, p.z); nor.setXYZ(k, n.x, n.y, n.z);
    }
    g.computeBoundingSphere(); g.computeBoundingBox();
    boxCache[key] = g;
    return g;
  }
  // C1 §1: a rounded box's radius is at least --look-edge-radius and at least 2% of its smallest side
  function boxRadius(w, h, d, r) { return Math.max(r || 0, edgeRadius(), 0.02 * Math.min(w, h, d)); }

  /* ---------------------------------------------------------------- materials */
  var mat = {
    clay: function (color, o) {
      o = o || {};
      return new T.MeshStandardMaterial({ color: color == null ? TOK.clay : color,
        roughness: o.roughness != null ? o.roughness : tnum("--look-clay-roughness", 0.62),
        metalness: 0, envMapIntensity: o.env != null ? o.env : tnum("--look-env-intensity", 0.7), clippingPlanes: o.clip || null,
        transparent: !!o.transparent, side: o.side || T.FrontSide });
    },
    glossy: function (color, o) {
      o = o || {};
      return new T.MeshPhysicalMaterial({ color: color, roughness: o.roughness != null ? o.roughness : 0.38, metalness: 0,
        clearcoat: o.clearcoat != null ? o.clearcoat : 0.6, clearcoatRoughness: 0.18, sheen: o.sheen || 0,
        envMapIntensity: 0.9, clippingPlanes: o.clip || null });
    },
    // real glass: transmission, fresnel from the studio environment, a whisper of blue-grey in the thickness
    glass: function (o) {
      o = o || {};
      // depthWrite off: blobs, decals and fades (transparent pass, drawn after glass) still show through a pane
      return new T.MeshPhysicalMaterial({ color: 0xFFFFFF, metalness: 0,
        roughness: tnum("--look-glass-roughness", 0.04), transmission: tnum("--look-glass-transmission", 1),
        thickness: tnum("--look-glass-thickness", 0.06), ior: tnum("--look-glass-ior", 1.5),
        attenuationColor: new T.Color(tcol("--look-glass-attenuation", 0xDCE6EE)), attenuationDistance: 2.5, specularIntensity: 1,
        envMapIntensity: tnum("--look-glass-env", 1.25), depthWrite: false, clippingPlanes: o.clip || null });
    },
    // the cut face of a solid: its back faces drawn flat in --clay-deep, so a clipped slab reads as solid, not hollow
    cap: function (o) {
      o = o || {};
      return new T.MeshBasicMaterial({ color: o.color != null ? o.color : TOK.cap, side: T.BackSide, clippingPlanes: o.clip || null,
        toneMapped: false });
    },
    // a lit cut face (a modelled cut, the G slab's edge): --clay-deep, a touch glossier than clay so the depth order reads
    cut: function (o) {
      o = o || {};
      return new T.MeshStandardMaterial({ color: TOK.clayDeep, roughness: tnum("--look-cut-roughness", 0.55), metalness: 0,
        envMapIntensity: tnum("--look-env-intensity", 0.7), clippingPlanes: o.clip || null });
    },
    /* paper as a surface: unlit and tone mapped, coloured with Look.paper(), so it lands on --ground exactly whatever the
       light does. Pair it with mat.shadow on a second mesh a hair above to keep the key's shadows (Look.paperSurface). */
    paper: function (o) {
      o = o || {};
      return new T.MeshBasicMaterial({ color: paper(), clippingPlanes: o.clip || null, side: o.side || T.FrontSide });
    },
    // a shadow catcher: invisible except where the key's shadow falls
    shadow: function (o) {
      o = o || {};
      return new T.ShadowMaterial({ color: TOK.ink, opacity: o.opacity != null ? o.opacity : 0.10, clippingPlanes: o.clip || null,
        depthWrite: false });
    }
  };

  // a solid with a cap: front material + a back-face cap mesh sharing the geometry
  function solid(geo, m, o) {
    o = o || {};
    var g = new T.Group(), front = new T.Mesh(geo, m);
    front.castShadow = !!o.cast; front.receiveShadow = o.receive !== false;
    g.add(front);
    if (o.clip) { var back = new T.Mesh(geo, mat.cap({ clip: o.clip })); g.add(back); }
    g.userData.front = front;
    return g;
  }
  function box(w, h, d, r, m, o) { return solid(roundedBox(w, h, d, boxRadius(w, h, d, r)), m, o); }

  /* ---------------------------------------------------------------- lathe and capsule: the other rounded solids (C1 §1)
     points: [[radius, y], ...] or Vector2s, bottom to top; the ends should sit on the axis (radius 0) to close the solid.
     o.round (default 2) rounds every corner of the profile by that many Chaikin passes; 0 keeps the points as given. */
  function chaikin(pts, n) {
    for (var k = 0; k < n; k++) {
      var out = [pts[0]];
      for (var i = 0; i < pts.length - 1; i++) {
        var a = pts[i], b = pts[i + 1];
        out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
      }
      out.push(pts[pts.length - 1]); pts = out;
    }
    return pts;
  }
  function latheGeometry(points, o) {
    o = o || {};
    var pts = points.map(function (p) { return Array.isArray(p) ? [p[0], p[1]] : [p.x, p.y]; });
    pts = chaikin(pts, o.round != null ? o.round : 2);
    var g = new T.LatheGeometry(pts.map(function (q) { return new T.Vector2(Math.max(0, q[0]), q[1]); }), o.seg || 48);
    g.computeBoundingBox(); g.computeBoundingSphere();
    return g;
  }
  function lathe(points, o) {
    o = o || {};
    return solid(latheGeometry(points, o), o.mat || mat.clay(null, { clip: o.clip }), { clip: o.clip, cast: o.cast !== false, receive: o.receive });
  }
  // a capsule of radius r and TOTAL length len (caps included) along o.axis (y default, or "x", "z")
  function capsuleGeometry(r, len, o) {
    o = o || {};
    var g = new T.CapsuleGeometry(r, Math.max(0, len - 2 * r), o.capSeg || 8, o.radial || 24);
    if (o.axis === "x") g.rotateZ(Math.PI / 2); else if (o.axis === "z") g.rotateX(Math.PI / 2);
    return g;
  }
  function capsule(r, len, m, o) {
    o = o || {};
    return solid(capsuleGeometry(r, len, o), m || mat.clay(null, { clip: o.clip }), { clip: o.clip, cast: o.cast !== false, receive: o.receive });
  }

  /* ---------------------------------------------------------------- contact blob: a soft ellipse on the floor (AO) */
  var blobTex = null;
  function blobTexture() {
    if (blobTex) return blobTex;
    var c = document.createElement("canvas"); c.width = c.height = 256;
    var g = c.getContext("2d"), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, TOK.shadow + "0.42)"); gr.addColorStop(0.35, TOK.shadow + "0.22)");
    gr.addColorStop(0.7, TOK.shadow + "0.06)"); gr.addColorStop(1, TOK.shadow + "0)");
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    blobTex = new T.CanvasTexture(c); blobTex.colorSpace = T.SRGBColorSpace;
    return blobTex;
  }
  // the slope term of polygonOffset is per drawn pixel, so at pixel ratio 2 the same factor pulls the blob half as far:
  // a blob 1 cm under a raised floor (the B1 corridor, -3.986 over -3.996) then fails the depth test and the sprite floats
  // in the 2x film (film-cut 074222). The factor scales with the pixel ratio at draw time, so pr 1 is unchanged; a factor
  // someone else set (Plate.fill's -1, Plate.sink) is left alone; clones keep the hook. Look.prOffset(m) opts any other
  // decal material in (world-set's softRect and shadeMat need it for the same reason).
  // engine-world 095608: scale only at a whole-number ratio (the deck at 1, the film at 2); the proxy renders at 2.6 and
  // keeps the base factor, so its set.png stays byte for byte and no plate's setPixelHash moves (world-set.js prOffset)
  function prOffset(r) {
    var u = this.userData, f = this.polygonOffsetFactor, p = r.getPixelRatio ? r.getPixelRatio() : 1;
    if (Math.abs(p - Math.round(p)) > 1e-6) p = 1;
    if (f === u.prBase || f === u.prSet) this.polygonOffsetFactor = u.prSet = u.prBase * p;
  }
  function prClone() { return blobPR(this.constructor.prototype.clone.call(this)); }
  function blobPR(m) { if (m.userData.prBase == null) m.userData.prBase = m.polygonOffsetFactor; m.onBeforeRender = prOffset; m.clone = prClone; return m; }
  function blob(w, d, o) {
    o = o || {};
    var m = new T.MeshBasicMaterial({ map: blobTexture(), transparent: true, depthWrite: false, opacity: o.opacity != null ? o.opacity : 1,
      clippingPlanes: o.clip || null, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2 });
    blobPR(m);
    var geo = new T.PlaneGeometry(1, 1); geo.rotateX(-Math.PI / 2);
    var b = new T.Mesh(geo, m); b.scale.set(w, 1, d); b.renderOrder = 1;
    return b;
  }

  /* a flat paper surface w x d at y = 0 that lands on --ground exactly and still takes the key's shadow */
  function paperSurface(w, d, o) {
    o = o || {};
    var g = new T.Group(), geo = new T.PlaneGeometry(w, d); geo.rotateX(-Math.PI / 2);
    var base = new T.Mesh(geo, mat.paper({ clip: o.clip })), sh = new T.Mesh(geo, mat.shadow({ clip: o.clip, opacity: o.shadow }));
    sh.receiveShadow = true; sh.position.y = 0.001; sh.renderOrder = 1;
    g.add(base); g.add(sh); g.userData.front = base;
    return g;
  }

  /* ---------------------------------------------------------------- the sprite (a newcomer), v2 (lookdev sprite, R8b)
     One smooth coral lathe capsule about 2.3 times taller than wide (soft flat-ish base on the floor, round dome), NO legs,
     NO band. Two short rounded arms grown from the body, mitten ends. The face: a white window the shape of the mark's own
     stadium (2.6 to 1 along the body), centred 0.28 of the height from the top, set in a shallow recess: a soft coral lip
     rises out of the skin round it and its inner wall drops to the window, whose rounded edge catches a soft rim light
     (sheen and clearcoat). All built on the body surface itself, so it conforms to the curve. The Rumi mark FILE sits on
     the window as a decal (whole, one ratio 663:258, never tinted, never redrawn) with clear space of half its height.
     Base at y = 0, facing +z. Poses: o.pose in stand | reach | read (read holds an open white handbook).
     Same surface as v1: Look.sprite, Look.squash, Look.spriteGeometry, Look.spriteMaterials, Look.markTexture. */
  var markTex = null, markAspect = 663 / 258;
  function markTexture(renderer) {
    if (markTex) return markTex;
    var img = new Image();
    markTex = new T.Texture(img);
    markTex.colorSpace = T.SRGBColorSpace; markTex.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 8;
    img.onload = function () { markTex.needsUpdate = true; if (window.World && World.render) World.render(); };
    img.src = window.__RUMI_MARK || "";
    return markTex;
  }
  var SPR = {
    H: 1.27, R: 0.273,              // height 1.27, width 0.552 (with the belly): 2.30 to 1
    yB: 0.19, nBot: 2.6,            // the base: a superellipse quarter, a soft flat-ish foot that sits
    yT: 0.997, nTop: 2.04,          // the dome starts at yT (round, never squared)
    belly: 0.003,                   // a hint of belly, so the barrel never reads as a tube
    seg: 56,
    // arms: tapered lathe, the shoulder ball sunk into the body, a rounded mitten at the end
    armR0: 0.074, armWaist: 0.054, armR2: 0.066, armLen: 0.30, armFlat: 0.84,
    shoulderY: 0.58, shoulderIn: 0.050, shoulderZ: 0.075,
    // the window: arc half-width and half-height along the body (2.6 to 1), centre 0.28 of H from the top
    visorY: 0.914, visA: 0.275, visB: 0.092,
    winH: 0.005, winBV: 0.018, winBulge: 0.004,   // the white window: plateau height above the skin, edge roll, a faint dome
    lipW: 0.040, lipH: 0.013, lipIn: 0.010,       // the coral lip round it: width outside the outline, height, inner wall width
    markW: 0.2364                   // mark height = visB (663:258 x visB; window height = 2 x mark height, so clear space = half its height)
  };
  var legH = 0;                       // kept for older readers: there are no legs (unused)

  /* the body profile: base superellipse, barrel, dome; then an arc-length table to place things on the surface */
  function profile(n) {
    var P = SPR, pts = [], i, t, nb = Math.round(n * 0.30), nm = Math.round(n * 0.28), nt = n - nb - nm;
    for (i = 0; i <= nb; i++) {
      t = Math.PI / 2 * (1 - i / nb);
      pts.push([P.R * Math.pow(Math.cos(t), 2 / P.nBot), P.yB * (1 - Math.pow(Math.sin(t), 2 / P.nBot))]);
    }
    for (i = 1; i < nm; i++) { var u = i / nm; pts.push([P.R + P.belly * Math.sin(Math.PI * u), P.yB + (P.yT - P.yB) * u]); }
    for (i = 0; i <= nt; i++) {
      t = Math.PI / 2 * i / nt;
      pts.push([P.R * Math.pow(Math.cos(t), 2 / P.nTop), P.yT + (P.H - P.yT) * Math.pow(Math.sin(t), 2 / P.nTop)]);
    }
    pts[0][0] = 0; pts[pts.length - 1][0] = 0;
    return pts;
  }
  var SURF = null;
  function surfTable() {
    if (SURF) return SURF;
    var raw = profile(4000), cum = [0], i;
    for (i = 1; i < raw.length; i++) cum.push(cum[i - 1] + Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]));
    var L = cum[cum.length - 1], N = 2000, tab = [], j = 0;
    for (i = 0; i <= N; i++) {
      var s = L * i / N;
      while (j < cum.length - 2 && cum[j + 1] < s) j++;
      var f = (s - cum[j]) / Math.max(1e-9, cum[j + 1] - cum[j]);
      var dx = raw[j + 1][0] - raw[j][0], dy = raw[j + 1][1] - raw[j][1], dl = Math.hypot(dx, dy) || 1;
      tab.push({ x: raw[j][0] + f * dx, y: raw[j][1] + f * dy, nr: dy / dl, ny: -dx / dl });
    }
    SURF = { L: L, N: N, tab: tab };
    return SURF;
  }
  function at(s) {
    var S = surfTable(), u = Math.max(0, Math.min(S.N, s / S.L * S.N)), i = Math.min(S.N - 1, Math.floor(u)), f = u - i;
    var a = S.tab[i], b = S.tab[i + 1], nr = a.nr + f * (b.nr - a.nr), ny = a.ny + f * (b.ny - a.ny), nl = Math.hypot(nr, ny);
    return { x: a.x + f * (b.x - a.x), y: a.y + f * (b.y - a.y), nr: nr / nl, ny: ny / nl };
  }
  function sAtY(y) {
    var S = surfTable(), i;
    for (i = 1; i <= S.N; i++) if (S.tab[i].y >= y && S.tab[i].x > 0.05) {
      var a = S.tab[i - 1], b = S.tab[i], f = (y - a.y) / Math.max(1e-9, b.y - a.y);
      return S.L * (i - 1 + f) / S.N;
    }
    return S.L / 2;
  }
  function radiusAt(y) { return at(sAtY(y)).x; }
  // the body's radius at height y (kept from v1 for any reader)
  function bodyR(y) { return y <= 0 || y >= SPR.H ? 0 : radiusAt(y); }

  /* heights above the skin, by d = inward distance from the window outline (d < 0 outside it) */
  function visLift(d) {   // the white window: under the lip's wall at the outline, a rounded edge, a gently domed plateau
    var P = SPR, base = P.winH - 0.010;
    if (d <= 0) return base;
    var q = Math.min(1, d / P.winBV), h = base + (P.winH - base) * Math.sqrt(1 - (1 - q) * (1 - q));
    var f = Math.max(0, Math.min(1, (d - P.winBV) / (P.visB - P.winBV)));
    return h + P.winBulge * (1 - (1 - f) * (1 - f));
  }
  function lipLift(d) {   // the coral lip: out of the skin with zero slope, a round crest at the outline, a wall down inside
    var P = SPR;
    if (d <= 0) { var t = Math.max(0, Math.min(1, (d + P.lipW) / P.lipW)); t = Math.sin(Math.PI / 2 * t); return -0.003 + (P.lipH + 0.003) * t * t * (3 - 2 * t); }
    var w = Math.min(1, d / P.lipIn);
    return P.lipH - (P.lipH - (P.winH - 0.018)) * (1 - Math.cos(Math.PI / 2 * w));
  }
  // signed distance to the stadium (half-width a, half-height b), negative inside
  function stadiumSD(u, v, a, b) { var dx = Math.max(Math.abs(u) - (a - b), 0); return Math.sqrt(dx * dx + v * v) - b; }
  // a point on the body at girth arc u (about the window centre) and profile arc v, lifted h along the body normal
  function onBody(sC, R0, u, v, h, out) {
    var S = at(sC + v), phi = u / R0, r = S.x + h * S.nr;
    out.push(r * Math.sin(phi), S.y + h * S.ny, r * Math.cos(phi));
  }
  /* a pad on the body: rings of the window's stadium offset by d (same parameter on every ring), each lifted by lift(d) */
  function padGeometry(ds, lift) {
    var P = SPR, a = P.visA, b = P.visB, c = a - b, sC = sAtY(P.visorY), R0 = at(sC).x, M = 160;
    var per = 4 * c + 2 * Math.PI * b, k;
    var pos = [], uv = [], idx = [];
    function ringPt(j, d) {
      var s = per * j / M, rr = b - d, x, y, th;
      if (s < 2 * c) { x = -c + s; y = rr; }
      else if (s < 2 * c + Math.PI * b) { th = Math.PI / 2 - (s - 2 * c) / b; x = c + rr * Math.cos(th); y = rr * Math.sin(th); }
      else if (s < 4 * c + Math.PI * b) { x = c - (s - 2 * c - Math.PI * b); y = -rr; }
      else { th = -Math.PI / 2 - (s - 4 * c - Math.PI * b) / b; x = -c + rr * Math.cos(th); y = rr * Math.sin(th); }
      return [x, y];
    }
    ds.forEach(function (d) {
      var h = lift(d);
      for (var j = 0; j < M; j++) { var p = ringPt(j, d); onBody(sC, R0, p[0], p[1], h, pos); uv.push(0.5 + p[0] / (2 * a), 0.5 + p[1] / (2 * b)); }
    });
    for (k = 0; k < ds.length - 1; k++) for (var j = 0; j < M; j++) {
      var j1 = (j + 1) % M, A0 = k * M + j, A1 = k * M + j1, B0 = (k + 1) * M + j, B1 = (k + 1) * M + j1;
      idx.push(A0, A1, B1, A0, B1, B0);
    }
    var g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals();
    // wind outwards: a normal on the top of the pad must face the same way as the body normal there (+z at the front)
    var n = g.attributes.normal, probe = Math.floor(ds.length / 2) * M + Math.round(M * 0.1);
    if (n.getZ(probe) < 0) { g.setIndex(idx.slice().reverse()); g.computeVertexNormals(); }
    g.userData = { sC: sC, R0: R0 };
    return g;
  }
  function visorGeometry() {   // the white window, from under the lip's wall to the core segment
    var P = SPR, ds = [0], k;
    for (k = 1; k <= 8; k++) ds.push(P.winBV * (1 - Math.cos(k / 8 * Math.PI / 2)));
    for (k = 1; k <= 7; k++) ds.push(P.winBV + (P.visB - P.winBV) * k / 7);
    return padGeometry(ds, visLift);
  }
  function lipGeometry() {     // the coral lip, from under the skin outside to under the window inside
    var P = SPR, ds = [], k;
    for (k = 0; k <= 9; k++) ds.push(-P.lipW + P.lipW * k / 9);
    for (k = 1; k <= 6; k++) ds.push(P.lipIn * k / 6);
    return padGeometry(ds, lipLift);
  }
  // the mark decal: the file's rectangle laid on the window plateau, a hair above it, the same wrap
  function decalGeometry(sC, R0) {
    var P = SPR, mw = P.markW, mh = mw / markAspect, g = new T.PlaneGeometry(mw, mh, 64, 18), p = g.attributes.position, out = [];
    for (var k = 0; k < p.count; k++) {
      var u = p.getX(k), v = p.getY(k), d = -stadiumSD(u, v, P.visA, P.visB);
      onBody(sC, R0, u, v, visLift(d) + 0.0025, out);
    }
    for (k = 0; k < p.count; k++) p.setXYZ(k, out[3 * k], out[3 * k + 1], out[3 * k + 2]);
    g.computeVertexNormals(); g.computeBoundingSphere();
    return g;
  }
  function armGeometry() {
    var P = SPR, ap = [], r0 = P.armR0, r2 = P.armR2, yc2 = -(P.armLen - r2), steps = 10, i, t;
    for (i = 0; i <= steps; i++) { t = Math.PI / 2 * i / steps; ap.push([r0 * Math.sin(t), r0 * Math.cos(t)]); }
    for (i = 1; i < 12; i++) {
      var u = i / 12, sm = u * u * (3 - 2 * u), w = Math.pow(Math.sin(Math.PI * u), 2) * ((r0 + r2) / 2 - P.armWaist);
      ap.push([r0 + (r2 - r0) * sm - w, yc2 * u]);
    }
    for (i = 0; i <= steps; i++) { t = Math.PI / 2 * i / steps; ap.push([r2 * Math.cos(t), yc2 - r2 * Math.sin(t)]); }
    ap.reverse(); ap[0][0] = 0; ap[ap.length - 1][0] = 0;
    var g = new T.LatheGeometry(ap.map(function (q) { return new T.Vector2(q[0], q[1]); }), 24);
    g.scale(1, 1, P.armFlat);   // a mitten is a little flatter front to back
    g.userData = { mittenC: -yc2 };
    return g;
  }
  var spriteGeo = null;
  function spriteGeometry() {
    if (spriteGeo) return spriteGeo;
    var P = SPR;
    var body = new T.LatheGeometry(profile(64).map(function (q) { return new T.Vector2(q[0], q[1]); }), P.seg), lip = lipGeometry();
    var vg = visorGeometry(), dg = decalGeometry(vg.userData.sC, vg.userData.R0), arm = armGeometry();
    var leg = new T.BufferGeometry();   // no legs: an empty geometry so any older reader still finds G.leg
    leg.setAttribute("position", new T.Float32BufferAttribute([], 3)); leg.setAttribute("normal", new T.Float32BufferAttribute([], 3));
    leg.setAttribute("uv", new T.Float32BufferAttribute([], 2)); leg.setIndex([]);
    spriteGeo = { body: body, lip: lip, visor: vg, decal: dg, arm: arm, leg: leg, visorY: P.visorY, vw: 2 * P.visA, vh: 2 * P.visB, visorCY: P.visorY,
      mittenC: arm.userData.mittenC, H: P.H, W: 2 * P.R };
    return spriteGeo;
  }
  // the handbook (read pose only): two white covers and two softly curved page blocks with faint ink lines
  var bookGeo = null;
  function bookGeometry() {
    if (bookGeo) return bookGeo;
    var BW = 0.14, BH = 0.18;
    var cover = roundedBox(BW, BH, 0.012, 0.005, 3).clone(); cover.translate(BW / 2, 0, 0);
    var pages = roundedBox(BW - 0.012, BH - 0.016, 0.016, 0.006, 3).clone(), pp = pages.attributes.position, pw = BW - 0.012;
    for (var i = 0; i < pp.count; i++) {
      var x = pp.getX(i) + pw / 2, uu = Math.max(0, Math.min(1, x / pw));
      pp.setXYZ(i, x + 0.003, pp.getY(i), pp.getZ(i) + 0.014 + 0.016 * (1 - Math.pow(1 - uu, 2)) * (pp.getZ(i) > 0 ? 1 : 0.6));
    }
    pages.computeVertexNormals();
    bookGeo = { cover: cover, pages: pages, W: BW, H: BH };
    return bookGeo;
  }
  function pageTexture() {
    var c = document.createElement("canvas"); c.width = 256; c.height = 320;
    var g = c.getContext("2d"); g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, 256, 320);
    g.strokeStyle = "rgba(43,48,54,0.16)"; g.lineWidth = 5; g.lineCap = "round";
    for (var y = 70; y <= 250; y += 30) { g.beginPath(); g.moveTo(40, y); g.lineTo(y === 250 ? 150 : 216, y); g.stroke(); }
    var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8;
    return t;
  }
  // a tighter, softer contact shadow than the room's blob: the base sits, it does not float
  var sprBlobTex = null;
  function spriteBlobTexture() {
    if (sprBlobTex) return sprBlobTex;
    var c = document.createElement("canvas"); c.width = c.height = 256;
    var g = c.getContext("2d"), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, TOK.shadow + "0.50)"); gr.addColorStop(0.42, TOK.shadow + "0.34)"); gr.addColorStop(0.62, TOK.shadow + "0.12)");
    gr.addColorStop(0.82, TOK.shadow + "0.03)"); gr.addColorStop(1, TOK.shadow + "0)");
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    sprBlobTex = new T.CanvasTexture(c); sprBlobTex.colorSpace = T.SRGBColorSpace;
    return sprBlobTex;
  }
  var spriteMats = null;
  function spriteMaterials(renderer, clip) {
    if (spriteMats) return spriteMats;
    spriteMats = {
      // satin clay: a soft clearcoat and a faint warm sheen
      body: new T.MeshPhysicalMaterial({ color: TOK.coral, roughness: tnum("--look-sprite-roughness", 0.42), metalness: 0,
        clearcoat: tnum("--look-sprite-clearcoat", 0.6), clearcoatRoughness: tnum("--look-sprite-clearcoat-roughness", 0.22),
        sheen: tnum("--look-sprite-sheen", 0.4), sheenColor: new T.Color(0xFFD9C8), sheenRoughness: 0.55, envMapIntensity: 0.75,
        clippingPlanes: clip || null }),
      // the window: white gloss
      visor: new T.MeshPhysicalMaterial({ color: TOK.visor, roughness: tnum("--look-visor-roughness", 0.16), metalness: 0,
        clearcoat: tnum("--look-visor-clearcoat", 1), clearcoatRoughness: 0.04,
        sheen: 0.6, sheenColor: new T.Color(0xFFFFFF), sheenRoughness: 0.35, envMapIntensity: 1.1, clippingPlanes: clip || null }),
      // the mark: unlit, never tone mapped, so the navy stays the file's navy; alpha-to-coverage for a soft MSAA edge
      decal: new T.MeshBasicMaterial({ map: markTexture(renderer), alphaTest: 0.02, alphaToCoverage: true, polygonOffset: true,
        polygonOffsetFactor: -4, toneMapped: false, clippingPlanes: clip || null }),
      book: new T.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5, metalness: 0, envMapIntensity: 0.6, clippingPlanes: clip || null }),
      page: new T.MeshStandardMaterial({ color: 0xFFFFFF, map: pageTexture(), roughness: 0.7, metalness: 0, envMapIntensity: 0.5,
        clippingPlanes: clip || null })
    };
    return spriteMats;
  }
  /* poses: arm direction (or a mitten target) in sprite space, x to the sprite's left (+x), and a stretch along the
     arm (cartoon stretch, never thicker). The body never tilts: the face stays level (BRAND_SHEET §4). */
  var POSES = {
    stand: { L: [0.22, -0.95, 0.22], R: [-0.22, -0.95, 0.22] },
    reach: { L: [0.22, 0.62, 0.76], LS: 1.42, R: [-0.30, -0.93, 0.10] },          // one arm up and forward, to a card at visor height
    read:  { LT: [0.15, 0.50, 0.38], RT: [-0.15, 0.50, 0.38], SZ: 0.14, book: true }     // both mittens on the handbook's outer edges
  };
  var DOWN = new T.Vector3(0, -1, 0);
  function sprite(renderer, o) {
    o = o || {};
    var G = spriteGeometry(), M = spriteMaterials(renderer, o.clip), P = SPR, pose = POSES[o.pose] || POSES.stand;
    var root = new T.Group(), squash = new T.Group(); root.add(squash);
    var body = new T.Mesh(G.body, M.body); body.castShadow = true; body.receiveShadow = true;
    var visor = new T.Mesh(G.visor, M.visor); visor.castShadow = true; visor.receiveShadow = true;
    var lip = new T.Mesh(G.lip, M.body); lip.castShadow = true; lip.receiveShadow = true;
    var decal = new T.Mesh(G.decal, M.decal); decal.renderOrder = 7;
    function arm(s, d, tgt, stretch) {
      var m = new T.Mesh(G.arm, M.body), rr = radiusAt(P.shoulderY), sz = pose.SZ || P.shoulderZ;
      m.position.set(s * (Math.sqrt(rr * rr - sz * sz) - P.shoulderIn), P.shoulderY, sz);
      var dir = tgt ? new T.Vector3(tgt[0], tgt[1], tgt[2]).sub(m.position) : new T.Vector3(d[0], d[1], d[2]);
      if (tgt) stretch = dir.length() / G.mittenC;
      m.quaternion.setFromUnitVectors(DOWN, dir.normalize());
      m.scale.y = Math.max(1, Math.min(1.5, stretch || 1));
      m.castShadow = true; m.receiveShadow = true;
      m.userData.reach = G.mittenC * m.scale.y;
      return m;
    }
    var aL = arm(1, pose.L, pose.LT, pose.LS), aR = arm(-1, pose.R, pose.RT, pose.RS);
    [body, lip, visor, decal, aL, aR].forEach(function (m) { squash.add(m); });
    var book = null;
    if (pose.book) {
      var B = bookGeometry(); book = new T.Group();
      [-1, 1].forEach(function (s) {
        var half = new T.Group(), cv = new T.Mesh(B.cover, M.book), pg = new T.Mesh(B.pages, M.page);
        cv.castShadow = pg.castShadow = true; cv.receiveShadow = pg.receiveShadow = true;
        half.add(cv); half.add(pg); half.scale.x = s; half.rotation.y = -s * 0.22;
        book.add(half);
      });
      book.position.set(0, pose.LT[1] + 0.035, pose.LT[2] + 0.012);
      book.rotation.x = -0.95;   // pages up and a touch forward, below the window
      squash.add(book);
    }
    var sh = blob(1.0, 0.7); sh.material.map = spriteBlobTexture(); sh.position.y = 0.004; root.add(sh);
    // the face (lip, window, mark) and the pencil are rigid: squash() gives them translation and uniform scale only
    var rigid = [lip, visor, decal].map(function (m) { return { obj: m, p: m.position.clone(), s: m.scale.clone() }; });
    root.userData = { squash: squash, arms: [aL, aR], legs: [], blob: sh, book: book, pose: POSES[o.pose] ? o.pose : "stand",
      face: [lip, visor, decal], rigid: rigid, pencil: null, s: 0, opts: { clip: o.clip || null, pencilSide: o.pencilSide } };
    if (o.pencil) attachPencil(root);
    return root;
  }
  /* eased squash-and-stretch: s in -1..1 (from a smooth bob), volume kept; the base stays on the floor. The BODY and arms
     take the squash (sx, k, sx); the face and the pencil (R8b.3) get a counter-scale so in world terms they only move
     (the window centre rides at visorY * k) and scale uniformly by sx, which keeps them on the body's surface (the
     barrel's radius scales by sx too). The mark never squashes. */
  function squash(spr, s) {
    var u = spr.userData, q = u.squash, k = 1 + 0.035 * (s || 0), sx = 1 / Math.sqrt(k), yc = SPR.visorY;
    q.scale.set(sx, k, sx);
    u.s = s || 0;
    (u.rigid || []).forEach(function (r) {
      // child world = parent (sx, k, sx) * (p + c * v): want (0, yc * k, 0) + sx * (v - (0, yc, 0)) for the rest pose
      r.obj.scale.set(r.s.x, r.s.y * sx / k, r.s.z);
      r.obj.position.set(r.p.x, yc + (r.p.y - yc) * sx / k, r.p.z);
    });
  }


  /* ---------------------------------------------------------------- the pencil (Dot's one tell; RULINGS R8 "The hero")
     A rounded ink capsule (about 0.035 m radius, 0.24 m long) tucked against the side of the body just past the window's
     coral lip, so it never sits over the window or the mark's clear space. assets-sprites replaces it by assigning a new
     Look.pencilBuilder(THREE, Look, spriteParams) -> Object3D (sprite-local coordinates, base at y = 0, facing +z). */
  function spriteParams(o) {
    var P = SPR, sC = sAtY(P.visorY), R0 = at(sC).x;
    return { H: P.H, R: P.R, W: 2 * P.R, R0: R0, visorY: P.visorY, visA: P.visA, visB: P.visB, lipW: P.lipW,
      markW: P.markW, markH: P.markW / markAspect, side: (o && o.pencilSide) || -1, clip: (o && o.clip) || null,
      radiusAt: radiusAt, ink: TOK.ink };
  }
  var pencilGeo = null, pencilMat = null;
  function defaultPencil(THREE, L, p) {
    var r = 0.035, len = 0.24, tilt = 0.30;   // tilt: the top leans back, away from the face
    if (!pencilGeo) pencilGeo = capsuleGeometry(r, len, { capSeg: 10, radial: 24 });
    if (!pencilMat) pencilMat = new THREE.MeshPhysicalMaterial({ color: p.ink, roughness: 0.45, metalness: 0, clearcoat: 0.35,
      clearcoatRoughness: 0.3, envMapIntensity: 0.8, clippingPlanes: p.clip });
    // girth arc of its centre: past the window's end (visA) and its lip (lipW), plus its own radius and a gap
    var arc = p.visA + p.lipW + r + 0.032, phi = arc / p.R0, rad = p.R0 + r * 0.55;
    var m = new THREE.Mesh(pencilGeo, pencilMat);
    m.position.set(p.side * Math.sin(phi) * rad, p.visorY, Math.cos(phi) * rad);
    var back = new THREE.Vector3(p.side * Math.cos(phi), 0, -Math.sin(phi));   // round the body, away from the face
    var axis = new THREE.Vector3(0, Math.cos(tilt), 0).addScaledVector(back, Math.sin(tilt)).normalize();
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
    m.castShadow = true; m.receiveShadow = true;
    m.name = "pencil";
    return m;
  }
  function attachPencil(spr) {
    var u = spr.userData;
    if (u.pencil) return u.pencil;
    if (!u.squash || !u.rigid) return null;   // a sprite from another builder (world-look.sprites.js) carries its own pencil
    var built = Look.pencilBuilder(T, Look, spriteParams(u.opts));
    if (!built) return null;
    // an unrotated holder takes squash()'s counter-scale, so whatever the builder rotates stays uniform in world terms
    var node = new T.Group(); node.add(built); node.name = "pencil-holder";
    node.userData.pencil = true;
    u.squash.add(node); u.rigid.push({ obj: node, p: node.position.clone(), s: node.scale.clone() });
    u.pencil = node;
    squash(spr, u.s || 0);
    return node;
  }
  function setPencil(spr, on) {
    if (!spr || !spr.userData || !spr.userData.squash) return null;
    var n = spr.userData.pencil;
    if (on && !n) n = attachPencil(spr);
    if (n) n.visible = !!on;
    return n;
  }

  /* ---------------------------------------------------------------- the people above: rounded faceless figures, warm grey clay
     o.pose: stand (default) | sit (on a seat o.seat high, default 0.46, facing +z) | walk (o.phase 0..1 swings the stride) */
  var personGeo = null;
  function personGeometry() {
    if (personGeo) return personGeo;
    personGeo = { torso: new T.CapsuleGeometry(0.30, 0.62, 12, 32), head: new T.SphereGeometry(0.235, 40, 28),
      legs: new T.CapsuleGeometry(0.22, 0.42, 10, 28), arm: new T.CapsuleGeometry(0.09, 0.62, 8, 16),
      leg: new T.CapsuleGeometry(0.13, 0.56, 8, 20), thigh: new T.CapsuleGeometry(0.17, 0.30, 8, 20),
      shin: new T.CapsuleGeometry(0.13, 0.26, 8, 20) };
    return personGeo;
  }
  function person(o) {
    o = o || {};
    var G = personGeometry(), pose = o.pose || "stand";
    var m = mat.clay(o.color != null ? o.color : TOK.person, { roughness: 0.55, env: 0.6, clip: o.clip });
    var g = new T.Group();
    function add(geo, x, y, z, rx, rz) {
      var k = new T.Mesh(geo, m); k.position.set(x, y, z); k.rotation.set(rx || 0, 0, rz || 0);
      k.castShadow = true; k.receiveShadow = true; g.add(k); return k;
    }
    var shX = 0, shZ = 0;
    if (pose === "sit") {
      var seat = o.seat != null ? o.seat : 0.46, hip = seat + 0.10;
      add(G.torso, 0, seat + 0.50, -0.06, -0.06);
      add(G.head, 0, seat + 1.42, -0.02);
      [-0.15, 0.15].forEach(function (x) {
        add(G.thigh, x, hip - 0.02, 0.17, Math.PI / 2);
        add(G.shin, x, (hip - 0.02) / 2, 0.40);
      });
      add(G.arm, -0.37, seat + 0.55, 0.16, -0.75, -0.08); add(G.arm, 0.37, seat + 0.55, 0.16, -0.75, 0.08);
      shZ = 0.18;
    } else if (pose === "walk") {
      var sw = Math.sin(2 * Math.PI * (o.phase || 0)) * 0.38;
      add(G.torso, 0, 1.03, 0);
      add(G.head, 0, 1.95, 0.02);
      [[-0.13, sw], [0.13, -sw]].forEach(function (q) {
        var k = add(G.leg, q[0], 0.86, 0, q[1]);   // hung from the hip, swung about x
        k.position.set(q[0], 0.86 - 0.41 * Math.cos(q[1]), -0.41 * Math.sin(q[1]));
      });
      add(G.arm, -0.39, 1.12, 0.02 - 0.3 * Math.sin(sw), -sw * 0.8, -0.10);
      add(G.arm, 0.39, 1.12, 0.02 + 0.3 * Math.sin(sw), sw * 0.8, 0.10);
    } else {
      add(G.legs, 0, 0.43, 0);
      add(G.torso, 0, 0.30 + 0.31 + 0.42, 0);
      add(G.head, 0, 1.95, 0);
      add(G.arm, -0.39, 1.12, 0.02, 0, -0.10); add(G.arm, 0.39, 1.12, 0.02, 0, 0.10);
    }
    var sh = blob(1.2, 0.8, { clip: o.clip }); sh.position.set(shX, 0.004, shZ); g.add(sh);
    g.userData.pose = pose; g.userData.blob = sh;
    return g;
  }

  var Look = window.Look = { TOK: TOK, apply: apply, token: token, parseToken: parseToken, readTokens: readTokens,
    paper: function (hex, exp) { return paper(hex, exp); }, paperHex: TOK.paper, neutral: neutral,
    roundedBox: roundedBox, box: box, boxRadius: boxRadius, solid: solid, mat: mat, blob: blob, prOffset: blobPR, paperSurface: paperSurface,
    lathe: lathe, latheGeometry: latheGeometry, capsule: capsule, capsuleGeometry: capsuleGeometry,
    sprite: sprite, squash: squash, spriteGeometry: spriteGeometry, spriteMaterials: spriteMaterials, markTexture: markTexture,
    spriteParams: spriteParams, pencilBuilder: defaultPencil, setPencil: setPencil,
    person: person, lights: function () { return lights; }, shadowFrustum: SHADOW };
})();
