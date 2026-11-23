// the highlight field under the small building (VL 15.13, ruling in 20261111T080158 item 2): rgba(255,214,102,0.28) on the
// page, 3 px edge, 0.3 m corners, 1.2 m beyond the building on each side. Same device as P2. grows from the door outward.
window.SE_field = function (k, o) {
  const T = THREE, tw = FILM.tw, W = (o.w || 9) + 2.4, D = (o.d || 4.2) + 2.4, r = 0.3;
  const sh = new T.Shape(); const x0 = -W / 2, y0 = -D / 2;
  sh.moveTo(x0 + r, y0); sh.lineTo(x0 + W - r, y0); sh.quadraticCurveTo(x0 + W, y0, x0 + W, y0 + r); sh.lineTo(x0 + W, y0 + D - r); sh.quadraticCurveTo(x0 + W, y0 + D, x0 + W - r, y0 + D);
  sh.lineTo(x0 + r, y0 + D); sh.quadraticCurveTo(x0, y0 + D, x0, y0 + D - r); sh.lineTo(x0, y0 + r); sh.quadraticCurveTo(x0, y0, x0 + r, y0);
  const fillM = new T.MeshBasicMaterial({ color: 0xffd666, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
  const fill = new T.Mesh(new T.ShapeGeometry(sh, 24), fillM); fill.rotation.x = -Math.PI / 2; fill.position.set(o.x || 0, 0.004, o.z != null ? o.z : -2.1); k.scene.add(fill);
  const edgeM = new T.LineBasicMaterial({ color: 0xffd666, transparent: true, opacity: 0 });
  const edge = new T.LineLoop(new T.BufferGeometry().setFromPoints(sh.getPoints(24).map((p) => new T.Vector3(p.x, p.y, 0))), edgeM); edge.rotation.x = -Math.PI / 2; edge.position.copy(fill.position); edge.position.y += 0.002; k.scene.add(edge);
  k.each((t) => { const u = o.t0 == null ? 1 : tw(t, o.t0, o.t0 + (o.dur || 1200), "out"); fillM.opacity = 0.28 * u; edgeM.opacity = 0.9 * u; const s = Math.max(0.01, o.t0 == null ? 1 : 0.4 + 0.6 * u); fill.scale.set(s, s, 1); edge.scale.set(s, s, 1); });
};
