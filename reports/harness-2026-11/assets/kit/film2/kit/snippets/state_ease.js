// state_ease.js (v2-kit, 11 Nov 18:3xZ): shot-side, for the hashed parts_a.js (v2-check 145707). PRE_SIGN 15: a change of
// state takes 300 ms. Asked by v2-shots-b 171816 (1C4 rail 250 ms read as 200 ms through a brown; 1C2 door light read as
// 167 to 200 ms because its 600 ms "io" puts the change in the middle).
//
//   railEase(rails, { ms: 300 })   rails: one PARTS.rail, an array, or W (takes W.parts.rails). Call it BEFORE any
//                                   rail.stop / rail.go in setup (it records their times). The bar goes green to red and back
//                                   over ms through the unlit tone (VL 15.77: half down, half up); the "Stopped" note is unchanged.
//   doorLightEase(doors, { ms: 600, ease: "lin" })   doors: one PARTS.door2 or an array. Call BEFORE door.light(...). The
//                                   leaf's warmth and the lamp change evenly over ms (the kit's 600 ms io, spread out).
//
// Load: (function(){const x=new XMLHttpRequest();x.open("GET","snippets/state_ease.js",false);x.send();(0,eval)(x.responseText+";window.railEase=railEase;window.doorLightEase=doorLightEase;");})();
function railEase(rails, o) {
  o = o || {}; const ms = o.ms || 300, T = THREE;
  const list = rails && rails.parts ? rails.parts.rails : Array.isArray(rails) ? rails : [rails];
  const GREEN = new T.Color(KIT.parts.PAL.green), RED = new T.Color(0xc8372d), UNLIT = new T.Color(o.unlit != null ? o.unlit : KIT.parts.PAL.slab);   // unlit: the rail's body tone
  list.forEach((g) => {
    if (g._eased) return; g._eased = true;
    const bar = g.children[0].children[0].material, evs = [];
    const stop0 = g.stop, go0 = g.go, eval0 = g.eval;
    g.stop = (t0, op) => { evs.push({ t: t0, on: true }); evs.sort((a, b) => a.t - b.t); return stop0(t0, op); };
    g.go = (t0) => { evs.push({ t: t0, on: false }); evs.sort((a, b) => a.t - b.t); return go0(t0); };
    g.eval = (t) => {
      eval0(t);
      // from the colour at the previous change, so a stop inside a go's ease does not jump
      // VL 15.77 (v2-visuals 180745 item 5; v2-shots-b 210631): the bar goes through the rail's own unlit tone, never brown:
      // the old colour fades to unlit over the first half of ms, the new one comes up over the second half ("io" each)
      const c = GREEN.clone(); for (const e of evs) { if (e.t > t) break; const u = (t - e.t) / ms, to = e.on ? RED : GREEN;
        if (u < 0.5) c.lerp(UNLIT, FILM.tw(t, e.t, e.t + ms / 2, "io")); else c.copy(UNLIT).lerp(to, FILM.tw(t, e.t + ms / 2, e.t + ms, "io")); }
      bar.color.copy(c);
    };
  });
  return list;
}
function doorLightEase(doors, o) {
  o = o || {}; const ms = o.ms || 600, ease = o.ease || "lin", T = THREE, GLOW = new T.Color(0xffb35c);
  (Array.isArray(doors) ? doors : [doors]).forEach((g) => {
    if (g._eased) return; g._eased = true;
    const leafM = g.userData.leaf.material; let lamp = null; g.children.forEach((c) => { if (c.isPointLight) lamp = c; });
    const evs = [], light0 = g.light, eval0 = g.eval;
    g.light = (t0, on) => { evs.push({ t0, to: on === false ? 0 : 1 }); evs.sort((a, b) => a.t0 - b.t0); return light0(t0, on); };
    g.eval = (t) => {
      eval0(t);
      let l = 0; for (const e of evs) { if (e.t0 > t) break; l = FILM.lerp(l, e.to, FILM.tw(t, e.t0, e.t0 + ms, ease)); }
      leafM.emissive.copy(GLOW).multiplyScalar(0.05 * l); if (lamp) lamp.intensity = 0.25 * l;
    };
  });
  return doors;
}
