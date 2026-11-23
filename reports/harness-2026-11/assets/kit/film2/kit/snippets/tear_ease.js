// tear_ease.js (v2-kit, 11 Nov): shot-side, for kit v0.8.1's folder2 without touching parts_a.js (hash lock, v2-check 145707).
// The one-to-two change of folder2.tear opens over dur (default 450 ms, VL "one to two in 400 ms or more"):
// each half starts at the folder's middle and eases out to the place the kit gives it (its outer end in its holder's hand).
// Call AFTER F.heldBy(t, a, b) and F.tear(tTear), so this track runs after the kit's own and corrects it.
//   tearEase(k, F, a, b, tTear, { dur: 450 });
function tearEase(k, F, a, b, tTear, o) {
  const dur = (o && o.dur) || 450, hA = F.children[1], hB = F.children[2], home = F.position.clone();
  const P = (v) => { F.parent.updateWorldMatrix(true, false); return F.parent.worldToLocal(v); };
  k.track({ eval(t) {
    if (t < tTear || t > tTear + dur) return;
    const u = FILM.tw(t, tTear, tTear + dur, "io");
    const mid = P(a.hand("R")).add(P(b.hand("L"))).multiplyScalar(0.5).sub(home);
    [hA, hB].forEach((h) => { h.position.lerpVectors(mid, h.position.clone(), u); h.rotation.x *= u; });   // the kick grows with the split
  } });
}
