/* team-board · shot 5B2 (v2-screens, plain). REBUILT: the real thing is this film's own team board
   (ORG.md), the posts the team of agents made to each other while making the film. A column of cards
   scrolls up steadily: a kind chip, FROM role → TO role, and grey bars where the text would be.
   No post text, no names. Point words: "Team board" (2) + two "sent back" rows (v2-lead 075614 note 13); the rest is texture. */
SCREEN.define({ id: "q5-team-board",
  dur: 4000,
  // scroll: the column starts moving (a 300 ms ease-in, then steady at 420 px a second to the end).
  // hl: the one yellow field lands on the first "sent back" row (cue: "sent this script back", 5B2.1).
  events: { scroll: 0, hl: 1800 },
  build(root) {
    const L = SCREEN.lib;
    const pg = (root._pg = PL.page(root));
    const KIND = [["finding", "#E3ECF5", "#1F4A73"], ["idea", "#F6EDD6", "#6E520F"], ["challenge", "#F7E3D9", "#8A3F1C"], ["ready", "#DDEFE5", "#1F5E42"], ["answer", "#ECE5F5", "#553A80"]];
    const ROLES = ["Director", "Art lead", "Voice lead", "Screens", "Shot builder", "Checker", "Cold viewer", "Cutter", "Chief of staff"];
    const col = (root._col = L.el("div", "abs", null, pg));
    Object.assign(col.style, { left: "260px", top: "0px", width: "1400px" });
    const N = 22, PITCH = 196;
    // v2-lead 075614 note 13: two rows read "sent back", Checker to Director and Cold viewer to Director.
    const SENT = { 5: [5, 0], 7: [6, 0] };
    root._sentRow = 5; root._pitch = PITCH;
    for (let i = 0; i < N; i++) {
      let k = KIND[Math.floor(L.noise(i, 11) * KIND.length)];
      let a = Math.floor(L.noise(i, 23) * ROLES.length);
      let b = Math.floor(L.noise(i, 37) * ROLES.length); if (b === a) b = (b + 1 + i) % ROLES.length; if (b === a) b = (a + 1) % ROLES.length;
      if (SENT[i]) { k = ["sent back", "#F7E3D9", "#8A3F1C"]; [a, b] = SENT[i]; }
      const w1 = 55 + 40 * L.noise(i, 41), w2 = 25 + 45 * L.noise(i, 53);
      const c = PL.card(col, 0, i * PITCH, 1400, 168);
      c.style.borderRadius = "26px"; c.style.padding = "30px 40px";
      c.innerHTML = `<div style="display:flex;align-items:center;gap:30px;font:600 40px/1 'Poppins',sans-serif">
          <span class="pl-chip" style="background:${k[1]};color:${k[2]};min-width:210px;justify-content:center">${k[0]}</span>
          <span style="color:#111418;font-weight:600">${ROLES[a]}</span>
          <svg viewBox="0 0 40 20" width="52" height="26"><path d="M2 10h32M26 3l8 7-8 7" fill="none" stroke="#9AA0A7" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span style="color:#111418;font-weight:600">${ROLES[b]}</span>
        </div>
        <div style="display:flex;gap:18px;margin-top:26px"><div class="pl-bar" style="width:${w1}%"></div><div class="pl-bar" style="width:${w2}%;background:#EEF0F2"></div></div>`;
    }
    root._hl = L.el("div", "s-hl", null, col);
    // a white header with the board's name, and soft fades at the top and bottom edges
    const hd = (root._hd = L.el("div", "abs", `<div class="pl-h" style="font-size:72px">Team board</div><div class="pl-k" style="margin-top:12px">Agents writing to each other</div>`, pg));
    Object.assign(hd.style, { left: "0", top: "0", width: "1920px", height: "240px", padding: "48px 260px 0", background: "linear-gradient(#fff 200px, rgba(255,255,255,0))", zIndex: 2 });
    const ft = L.el("div", "abs", null, pg);
    Object.assign(ft.style, { left: "0", bottom: "0", width: "1920px", height: "140px", background: "linear-gradient(rgba(255,255,255,0), #fff)", zIndex: 2 });
  },
  render(root, t, ev) {
    const L = SCREEN.lib;
    // steady scroll, a short ease-in so the first frame is not a jump
    const v = 0.42, ramp = 300, tt = Math.max(0, t - ev.scroll);
    const yAt = (u) => (u < ramp ? (v * u * u) / (2 * ramp) : v * (u - ramp / 2));
    // once the highlight lands, the scroll eases down to a crawl so the "sent back" row stays readable
    const th = Math.max(0, ev.hl - ev.scroll), vLow = 0.08, tau = 300;
    const d = Math.max(0, tt - th);
    const y = tt <= th ? yAt(tt) : yAt(th) + vLow * d + (v - vLow) * tau * (1 - Math.exp(-d / tau));
    root._col.style.transform = `translateY(${250 - y}px)`;
    // the highlight lives inside the scrolling column, so it moves with its row
    L.hl(root._hl, { x: -14, y: root._sentRow * root._pitch - 14, w: 1428, h: 196 }, t, ev.hl, null);
  },
});
