// coin_stack.js (v2-kit, 11 Nov): a drop-in for shots/_a/lib.js SA.coinStack that uses the kit's brass coin (VL 15.51, parts_b.js:317)
// and v2-visuals' 153200 item 7: each coin drops from 0.5 m above its place, 300 ms, then the kit's small bounce.
// Same call and same return as SA.coinStack:  const pile = coinStackBrass(k, { at, r, times, drop: 0.5, dur: 300 }); k.track(pile);
function coinStackBrass(k, o) {
  const T = KIT.parts.T, g = new T.Group(); k.scene.add(g); g.position.set(...o.at);
  const r = o.r || 0.32, th = 0.2 * r, drop = o.drop != null ? o.drop : 0.5, dur = o.dur || 300;
  const coins = o.times.map((t0, i) => {
    const c = KIT.set.PARTS.coin(k, { r, seed: i }); g.add(c);
    const x = (FILM.noise(i, 3) - 0.5) * 0.06, z = (FILM.noise(i, 4) - 0.5) * 0.06, y = i * (th + 0.004);
    g.updateWorldMatrix(true, false); const w = g.localToWorld(new T.Vector3(x, y, z));
    c.fall(t0, [w.x, w.y + drop, w.z], [w.x, w.y, w.z], dur); return c; });
  return { g, coins, eval() {} };   // each coin tracks itself (PARTS.coin calls k.track)
}
