/* notion-comments · shot 2B3 (v2-screens). Continues slack-notion: the same Notion page.
   The manager comments on the "Not now" button and asks for two changes; the agent makes one
   and gives a reason to keep the other; the manager agrees; the thread resolves.
   Point words: "Send it in the morning, and drop “Not now”." / "Morning: done. I’d keep “Not now”, or teachers mute the tip." / "Fair. Keep it." */
SCREEN.define({
  id: "notion-comments",
  dur: 6000,
  // anchor: the comment mark lands on "Not now". c1: the manager's comment. typing: Rumi is replying.
  // c2: Rumi's reply (and the morning change shows on the mockup). c3: the manager agrees. resolve: the thread resolves.
  events: { anchor: 400, c1: 900, typing: 2000, c2: 2700, c3: 4100, resolve: 4900 },
  build(root) {
    const L = SCREEN.lib;
    const pg = (root._pg = NO.page(root));
    // the morning change, shown on the new mockup's header
    const cap = pg.p.querySelectorAll(".no-ph .cap")[1];
    cap.innerHTML = 'Rumi<span class="am" style="margin-left:auto;font-weight:500">8:00 am</span>';
    cap.style.display = "flex";
    root._am = cap.querySelector(".am");
    const cm = (root._cm = L.el("div", "no-cm", `
      <div class="row r1">${L.avatar("Product manager")}<div><div class="who">Product manager</div><div class="tx">Send it in the morning, and drop “Not now”.</div></div></div>
      <div class="row r2">${L.avatar("Rumi")}<div><div class="who">Rumi</div><div class="tx tx2">Morning: done. I’d keep “Not now”, or teachers mute the tip.</div></div></div>
      <div class="row r3">${L.avatar("Product manager")}<div><div class="who">Product manager</div><div class="tx">Fair. Keep it.</div></div></div>
      <div class="res"><svg viewBox="0 0 24 24" width="40" height="40"><circle cx="12" cy="12" r="11" fill="#2F7D5B"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>Resolved</div>
      <div class="typ" style="font-size:36px;color:#787774;margin-top:18px">Rumi is replying…</div>`, pg.p));
    cm.style.top = "250px";
  },
  render(root, t, ev) {
    const L = SCREEN.lib, pg = root._pg, cm = root._cm;
    // the open questions step aside for the comment thread
    const side = L.tw(t, 0, 500);
    pg.qs.style.opacity = 1 - side;
    // the anchor: Notion's yellow comment mark on the "Not now" button
    const a = L.tw(t, ev.anchor, 350);
    // opaque, from the button's own white (so frame 0 matches slack-notion's last frame) to the comment yellow
    const nn = (k) => `rgb(${Math.round(L.lerp(255, 244, k))},${Math.round(L.lerp(255, 223, k))},${Math.round(L.lerp(255, 136, k))})`;
    pg.notNow.style.background = nn(a);
    pg.notNow.style.boxShadow = `0 2px 2px rgba(0,0,0,.08), inset 0 -${5 * a}px 0 rgba(232,180,0,${0.9 * a})`;
    // the card and its rows, one at a time
    L.arrive(cm, t, ev.c1, { dur: 450, dy: 30 });
    const rows = cm.querySelectorAll(".row");
    [ev.c1, ev.c2, ev.c3].forEach((t0, i) => {
      const r = rows[i]; const on = t >= t0;
      r.style.display = on ? "flex" : "none";
      if (on) L.arrive(r, t, t0, { dur: 380, dy: 18, scale: 1 });
    });
    const typ = cm.querySelector(".typ");
    typ.style.display = t >= ev.typing && t < ev.c2 ? "block" : "none";
    typ.style.opacity = 0.55 + 0.45 * Math.sin((t - ev.typing) / 180);
    // the change the agent made: 8:00 am appears on the new mockup as its reply lands
    const am = L.tw(t, ev.c2 + 250, 400, "out");
    root._am.style.opacity = am; root._am.style.transform = `translateY(${(1 - am) * 10}px)`;
    // resolve: the thread greys and the Resolved line arrives; the status chip turns to Done
    const res = cm.querySelector(".res");
    res.style.display = t >= ev.resolve ? "flex" : "none";
    if (t >= ev.resolve) L.arrive(res, t, ev.resolve, { dur: 380, dy: 12, scale: 1 });
    const g = L.tw(t, ev.resolve + 600, 400);
    rows.forEach((r) => { r.querySelectorAll(".tx,.who").forEach((x) => { x.style.color = g > 0 ? `rgb(${Math.round(L.lerp(55, 74, g))},${Math.round(L.lerp(53, 80, g))},${Math.round(L.lerp(47, 89, g))})` : ""; }); });
    const clr = L.tw(t, ev.resolve + 300, 400);
    if (t >= ev.resolve + 300) { pg.notNow.style.background = nn(1 - clr); pg.notNow.style.boxShadow = `0 2px 2px rgba(0,0,0,.08), inset 0 -${5 * (1 - clr)}px 0 rgba(232,180,0,${0.9 * (1 - clr)})`; }
    const done = t >= ev.resolve + 400;
    pg.status.className = "no-chip " + (done ? "done" : "rev");
    pg.status.textContent = done ? "Done" : "In review";
    // a slow push so the hold never sits still
    const push = L.tw(t, 0, this.dur, "sine");
    pg.p.style.transform = `translate(${-9.6 * push}px, ${-5.4 * push}px) scale(${1 + 0.01 * push})`;
  },
});
