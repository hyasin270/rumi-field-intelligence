// locator.js (v2-kit, 11 Nov 18:2xZ): shot-side, VL 15.76 (v2-visuals 180059 proposal, in force on v2-lead's yes).
// No change to the hashed files (set.js, layer.js, parts_a.js; v2-check 145707). Two calls:
//
//   locator(k, { room: "board", from: 0, to: FILM.dur, changes: [[tLand, "store"]] })
//     The building drawn small at the top left of a close frame (S, link frames): a bar for the pavilion over three floors
//     by two rooms. Grey outlines, white inside; the room we are in filled in ink. Cell origin x 96, y 60 (o.x, o.y), 120 px
//     wide, on its own white chip. No words, never animates: on from `from` (default 0) to `to` (default the shot's end).
//     `changes` swaps the filled cell at a time (a camera move that lands in another room: 5C's drop, 4A1's link frame).
//     Rooms: board skills (B1 W, E), gates store (B2), judge teams (B3), and "pav" (the pavilion). Also "B1W".."B3E".
//     { fade: ms } (v0.8.13, opt-in; default 0 = hard on and off, as signed): the chip eases in over ms after `from` and out
//     over ms before `to` (io). Asked by 4.0's pre-read (v2-shots-d 224637: "the map comes on hard at f079").
//
//   roomRing(k, W, "board", t0, t1, { fade: 0 })
//     In a W frame, a 6 px ink outline round the room's open front, tracked through the camera every frame. Use it for the
//     last 0.6 s before a cut into a room (t0 = cut - 600, t1 = cut) and for the first 0.6 s coming back out (t0 = 0,
//     t1 = 600). Hard on and off by default (it pairs with the cut); { fade: ms } eases it in and out.
//
// Load (as every snippet):
// (function(){const x=new XMLHttpRequest();x.open("GET","snippets/locator.js",false);x.send();(0,eval)(x.responseText+";window.locator=locator;window.roomRing=roomRing;");})();
const LOCATOR_CELLS = { board: [0, 0], skills: [0, 1], gates: [1, 0], store: [1, 1], judge: [2, 0], teams: [2, 1],
  B1W: [0, 0], B1E: [0, 1], B2W: [1, 0], B2E: [1, 1], B3W: [2, 0], B3E: [2, 1] };
function locatorCell(room) {
  if (room === "pav" || room === "pavilion" || room === "P") return "pav";
  const c = LOCATOR_CELLS[room]; if (!c) throw new Error("locator: unknown room " + room); return c[0] + "," + c[1];
}
function locator(k, o) {
  o = o || {};
  const ui = document.getElementById("ui"), X = o.x != null ? o.x : 96, Y = o.y != null ? o.y : 60;
  const s = o.scale || 1, w = 120 * s, h = 78 * s, pw = 66 * s, ph = 16 * s, g = 6 * s, pad = 14 * s;
  const cw = (w - g) / 2, ch = (h - 2 * g) / 3, H = ph + g + h;
  const NS = "http://www.w3.org/2000/svg", INK = "#111418", LINE = "#96989E";
  const chip = document.createElement("div"); chip.className = "abs locator";
  chip.style.cssText = `left:${X - pad}px;top:${Y - pad}px;width:${w + 2 * pad}px;height:${H + 2 * pad}px;background:rgba(255,255,255,.93);border-radius:${16 * s}px;visibility:hidden;`;
  const svg = document.createElementNS(NS, "svg"); svg.setAttribute("width", w + 2 * pad); svg.setAttribute("height", H + 2 * pad); chip.appendChild(svg);
  const cells = {};
  const rect = (key, x, y, cwid, chei) => { const r = document.createElementNS(NS, "rect");
    r.setAttribute("x", pad + x + 1.5); r.setAttribute("y", pad + y + 1.5); r.setAttribute("width", cwid - 3); r.setAttribute("height", chei - 3);
    r.setAttribute("rx", 5 * s); r.setAttribute("stroke-width", 3); svg.appendChild(r); cells[key] = r; };
  rect("pav", (w - pw) / 2, 0, pw, ph);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) rect(r + "," + c, c * (cw + g), ph + g + r * (ch + g), cw, ch);
  ui.appendChild(chip);
  const steps = [[-1e9, locatorCell(o.room)]].concat((o.changes || []).map(([t, rm]) => [t, locatorCell(rm)])).sort((a, b) => a[0] - b[0]);
  const from = o.from != null ? o.from : 0, to = o.to != null ? o.to : 1e12;
  let shown = null;
  FILM._post.push((t) => {
    const on = t >= from && t < to; chip.style.visibility = on ? "visible" : "hidden"; if (!on) return;
    if (o.fade) { const v = FILM.tw(t, from, from + o.fade, "io") * (to < 1e11 ? 1 - FILM.tw(t, to - o.fade, to, "io") : 1);
      chip.style.opacity = v; if (v <= 0.002) chip.style.visibility = "hidden"; }
    let cur = steps[0][1]; for (const [ts, c] of steps) { if (ts <= t) cur = c; else break; }
    if (cur === shown) return; shown = cur;
    for (const key in cells) { const f = key === cur; cells[key].setAttribute("fill", f ? INK : "#FFFFFF"); cells[key].setAttribute("stroke", f ? INK : LINE); }
  });
  return { el: chip, cellAt: (t) => { let cur = steps[0][1]; for (const [ts, c] of steps) if (ts <= t) cur = c; return cur; } };
}
function roomRing(k, W, room, t0, t1, o) {
  o = o || {};
  const T = THREE, ui = document.getElementById("ui"), NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg"); svg.setAttribute("width", 1920); svg.setAttribute("height", 1080);
  svg.setAttribute("class", "abs roomring"); svg.style.cssText = "left:0;top:0;pointer-events:none;visibility:hidden;";
  const r = document.createElementNS(NS, "rect"); r.setAttribute("fill", "none"); r.setAttribute("stroke", "#111418");
  r.setAttribute("stroke-width", o.width || 6); r.setAttribute("rx", o.rx != null ? o.rx : 10); svg.appendChild(r); ui.appendChild(svg);
  // the room's open front, in its floor group's frame (so a floor that moves carries its ring); the pavilion in its own group
  let parent, x0, x1, y0, y1, z;
  const FH = W.FH || 3.2, pv = room === "pav" || room === "pavilion";
  if (pv) { parent = W.parts.pav; const PW = W.PW || 9; x0 = -PW / 2 - 0.1; x1 = PW / 2 + 0.1; y0 = -0.05; y1 = 2.95; z = -3.0 + 2.3 + 0.35; }
  else { const [f, sd] = W.ROOMS[room]; parent = W.parts.floors[f - 1]; const HB = W.HALF || 6.1;
    x0 = sd < 0 ? -HB + 0.02 : 0.08; x1 = sd < 0 ? -0.08 : HB - 0.02; y0 = -f * FH - 0.24; y1 = -(f - 1) * FH - 0.04; z = 0.02; }
  const pad = o.pad != null ? o.pad : 6, fade = o.fade || 0;
  FILM._post.push((t) => {
    if (t < t0 || t >= t1) { svg.style.visibility = "hidden"; return; }
    parent.updateWorldMatrix(true, false);
    let a = 1e9, b = 1e9, c = -1e9, d = -1e9;
    for (const [x, y] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1]]) {
      const p = KIT.render.project(parent.localToWorld(new T.Vector3(x, y, z))); a = Math.min(a, p.x); b = Math.min(b, p.y); c = Math.max(c, p.x); d = Math.max(d, p.y); }
    r.setAttribute("x", a - pad); r.setAttribute("y", b - pad); r.setAttribute("width", c - a + 2 * pad); r.setAttribute("height", d - b + 2 * pad);
    const v = fade ? FILM.tw(t, t0, t0 + fade, "io") * (1 - FILM.tw(t, t1 - fade, t1, "io")) : 1;
    svg.style.visibility = v > 0.002 ? "visible" : "hidden"; svg.style.opacity = v;
  });
  return svg;
}
