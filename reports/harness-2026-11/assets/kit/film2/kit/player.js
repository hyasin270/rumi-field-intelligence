/* player.js (show player, 23 Nov 2026): drives one film2 shot live for the clicker deck.
   The parent page (the deck's world host) sends commands by postMessage; this page draws the shot at K 1 while it moves and
   softens the frame at rest with one accumulation pass per display frame (KIT.render.refine). Every frame is still a pure
   function of t, so a cut to any rest is free.
   In : {cmd:"draw", t}  {cmd:"play", from, to, rate, seq}  {cmd:"snap"}  {cmd:"park"}
   Out: {type:"ready", dur, cams:[{t,hold,cut}], cues:[{t,name}]}  {type:"arrived", seq, t}  {type:"error", msg} */
(function () {
  "use strict";
  const q = new URLSearchParams(location.search);
  const INST = q.get("inst") || "";
  const REFINE = +(q.get("refine") || 24);
  let cur = 0, play = null, refineI = 0, raf = 0, seqDone = null;
  function post(m) { try { parent.postMessage(Object.assign({ src: "kitplayer", inst: INST, shot: (FILM._def && FILM._def.id) || q.get("shot") }, m), "*"); } catch (e) { /* no parent */ } }
  function frame(t) { cur = t; KIT.render.state.K = 1; FILM.draw(t); refineI = 0; }
  function loop(now) {
    raf = 0;
    if (play) {
      if (play.start == null) play.start = now;
      let t = play.from + (now - play.start) * play.rate;
      const done = t >= play.to;
      if (done) t = play.to;
      frame(t);
      if (done) { const s = play.seq; play = null; post({ type: "arrived", seq: s, t }); }
      raf = requestAnimationFrame(loop); return;
    }
    if (refineI < REFINE) { try { KIT.render.refine(refineI); } catch (e) { refineI = REFINE; } refineI++; raf = requestAnimationFrame(loop); }
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }
  window.PLAYER = {
    draw(t, seq) { play = null; frame(t); kick(); post({ type: "drawn", seq, t }); },
    play(from, to, rate, seq) { from = Math.min(from, FILM.dur); play = { from, to: Math.min(FILM.dur, Math.max(from, to)), rate: rate || 1, seq, start: null }; frame(from); kick(); post({ type: "drawn", seq, t: from }); },
    snap() { if (play) { const p = play; play = null; frame(p.to); post({ type: "arrived", seq: p.seq, t: p.to, snapped: true }); kick(); } },
    get t() { return cur; }, get playing() { return !!play; }, get refined() { return refineI; },
  };
  window.addEventListener("message", (e) => {
    const m = e.data || {}; if (!m || !m.cmd || !FILM.ready) return;
    if (m.cmd === "draw") PLAYER.draw(m.t, m.seq);
    else if (m.cmd === "play") PLAYER.play(m.from, m.to, m.rate, m.seq);
    else if (m.cmd === "snap") PLAYER.snap();
    else if (m.cmd === "park") { play = null; refineI = REFINE; }
  });
  window.addEventListener("error", (e) => post({ type: "error", msg: String(e.message || e) }));
  (async function () {
    try { await FILM.boot(); } catch (e) { post({ type: "error", msg: "boot: " + e }); return; }
    await FILM.whenReady();
    const cams = (FILM.k && FILM.k.cam && FILM.k.cam.list || []).map((x) => ({ t: x.t, hold: !!x.hold, cut: !!x.cut }));
    const t0 = q.get("t") != null ? +q.get("t") : 0;
    frame(t0); kick();
    post({ type: "ready", dur: FILM.dur, cams, cues: (FILM.cues ? FILM.cues() : []).map((c) => ({ t: c.t, name: c.name, text: c.text })) });
  })();
})();
