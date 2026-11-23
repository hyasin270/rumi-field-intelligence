// fills_with_face.js (v2-kit, 11 Nov; v2 16:55Z): shot-side, for kit v0.8.2's building without touching set.js (hash lock,
// v2-check 145707; v2-check 154101 takes the snippet as the fix). The six room front fills (v0.8, warm point lights at z +1.5)
// sit in front of the closed face and print six warm spots on it (P4, T1a, T3b). Each fill stays at 0 while the face covers
// its room and comes in as the face's top edge drops past the fill and down to that room's floor (1.2 m under it), eased.
// Call once, right after k.set.building(...):   fillsWithFace(k, W);
function fillsWithFace(k, W) {
  const T = KIT.parts.T, fills = [], c = W.parts.cover;
  W.root.traverse((o) => { if (o.isPointLight && o.color.getHex() === 0xfff6ea && o.position.z > 1) fills.push([o, o.intensity]); });
  const half = new T.Box3().setFromObject(c).getSize(new T.Vector3()).y / 2;
  k.track({ eval() {
    const top = c.position.y + half;   // the face's top edge, in the building's frame (fills and face share W.root)
    fills.forEach(([l, i]) => { const v = !c.visible ? 1 : Math.min(1, Math.max(0, (l.position.y - top) / 1.2)); l.intensity = i * v * v; });
  } });
}
