/* slack-notion · shot 2B2 (v2-screens). Continues slack-status. A clock sweeps (later the same day);
   "the draft is ready" lands with a Notion link; the pointer clicks the link and the link opens
   into the Notion page, one continuous push. Then the mockups, then the open questions, highlighted
   in turn as the voice names them.
   Point words: "@Product manager The draft is ready." + "Coaching tip redesign" (8). */
SCREEN.define({
  id: "slack-notion",
  dur: 12000,
  // clock: the time sweep starts. m3: the message lands. cur: the pointer appears. click: it clicks the link.
  // open: the link grows into the page (900 ms). hlMock / hlQ: highlights that follow the voice.
  // hlEnd (optional, v2-shots-f 213052 item 2): the questions highlight fades out over 300 ms from hlEnd.
  // opt.open "link" (213052 item 1): the page's own content rides the growing card from open's first frame and
  // cross-fades with the card's words (no blank card). Default: the white sheet, words at 80% cover (VL 15.30).
  // opt.push false (213052 item 2): no push after the open, so the page ends at scale 1 for 2B3's first frame.
  // opt.notNow "cream" (v2-check 224936, fallback only): the "Not now" button drawn see-through (cream), as the
  // signed 2B3 of 16:44Z starts. Default: white, which matches notion-comments' frame 0 since 224852.
  events: { clock: 0, m3: 1700, cur: 2900, click: 3900, open: 4050, hlMock: 6400, hlQ: 8600, hlEnd: null },
  build(root) {
    const L = SCREEN.lib;
    const S = (root._S = SL.build(root, { channel: "team-product" }));
    // the same earlier rows as slack-status, so 2B2's first frame is 2B1's last (v2-shots-f 175207 item 3)
    SL.earlier(S, [
      { who: "Data lead", time: "09:48", text: "This week's numbers are in the sheet." },
      { who: "Content lead", time: "10:05", text: "Story cards are ready for a look." },
      { who: "Engineer", time: "10:21", text: "The release went out this morning." },
      { who: "Designer", time: "10:40", text: "The new icons are in the shared folder." },
      { who: "Rumi", time: "10:52", text: "Thanks. Starting on the coaching tip now." },
    ]);
    const m1 = SL.msg(S.msgs, { who: "Rumi", time: "11:05", text: "<b>Where things stand:</b> the plan is written. Mockups next." });
    const m2 = SL.msg(S.msgs, { who: "Product manager", time: "11:07", text: "Okay, let me know when you're done." });
    const m3 = SL.msg(S.msgs, { who: "Rumi", time: "14:20", text: "@Product manager The draft is ready.", extra: SL.unfurl("Coaching tip redesign", "Plan, mockups and open questions") });
    root._m = [m1, m2, m3];
    // the time sweep: a clock over the conversation, and the hour it reaches
    const ck = L.el("div", "abs", `<div style="width:150px;height:150px">${L.clockSVG()}</div><div class="ckt" style="font:700 44px/1 Lato,sans-serif;margin-top:16px;text-align:center"></div>`, root);
    ck.style.cssText += "left:1650px;top:200px;width:150px;opacity:0";
    root._ck = ck;
    root._page = NO.page(root);
    // an opaque white sheet over the page: it grows from the card, then lifts so the page's words never show over Slack (v2-visuals 092100 item 4)
    root._sheet = SCREEN.lib.el("div", "abs", null, root._page.p); root._sheet.style.cssText += ";inset:0;background:#fff;z-index:50";
    // the growing sheet's outline, drawn outside the page's clip so it shows (v2-check 094902: read it as the card growing)
    root._edge = L.el("div", "abs", null, root); root._edge.style.cssText += ";left:0;top:0;border:3px solid #D3D1CB;background:transparent;box-shadow:0 14px 34px rgba(17,20,24,.18);opacity:0;pointer-events:none;box-sizing:border-box";
    root._cur = L.cursorEl(root); root._ring = L.ringEl(root);
    root._hl = L.el("div", "s-hl", null, root);
  },
  render(root, t, ev, opt) {
    opt = opt || {}; const viaLink = opt.open === "link", pushOn = opt.push !== false;
    root._page.notNow.style.background = opt.notNow === "cream" ? "transparent" : "";
    const L = SCREEN.lib, S = root._S, [m1, m2, m3] = root._m;
    SL.show(m1, true); SL.show(m2, true);
    // older messages step back a little once the new one has landed
    const dim = L.tw(t, ev.m3, 500);
    m1.inner.style.opacity = m2.inner.style.opacity = 1 - 0.45 * dim;
    // the open clears Slack's words first (250 ms), so the growing sheet's edge never slices a line (v2-visuals 094201)
    const clr = 1 - L.tw(t, ev.open + 100, 300);
    S.msgs.style.opacity = clr; if (S.input) S.input.style.opacity = clr;
    // clock: in, sweep 11:07 -> 14:20, out
    const ck = root._ck, cin = L.tw(t, ev.clock, 300, "io"), cout = L.tw(t, ev.m3 + 300, 300, "io"); // 300 ms each way (213052 item 3)
    ck.style.opacity = cin * (1 - cout);
    ck.style.transform = `scale(${0.9 + 0.1 * cin})`;
    L.clockAt(ck, t, ev.clock + 200, ev.m3 - ev.clock - 300, 11 + 7 / 60, 14 + 20 / 60);
    const hNow = 11 + 7 / 60 + (14 + 20 / 60 - 11 - 7 / 60) * L.E.io(L.clamp01((t - ev.clock - 200) / (ev.m3 - ev.clock - 300)));
    ck.querySelector(".ckt").textContent = L.hhmm(hNow);
    SL.grow(m3, t, ev.m3);

    // the link card, measured where it sits now (layout is fixed once m3 has landed)
    const rr = root.getBoundingClientRect(), card = m3.inner.querySelector(".sl-unf"), cr = card.getBoundingClientRect();
    const sc = rr.width / 1920; // the root may be scaled by the kit; work in root pixels
    const c = { x: (cr.left - rr.left) / sc, y: (cr.top - rr.top) / sc, w: cr.width / sc, h: cr.height / sc };
    const ti = card.querySelector(".ti").getBoundingClientRect();
    const target = { x: (ti.left - rr.left) / sc + 150, y: (ti.top - rr.top) / sc + 30 };
    L.cursorAt(root._cur, [{ t: ev.cur, x: 1500, y: 980 }, { t: ev.click - 250, x: target.x, y: target.y }, { t: ev.click + 60, x: target.x, y: target.y }, { t: ev.click + 500, x: target.x + 440, y: target.y - 6 }], t, [ev.click], { show: ev.cur, hide: ev.open + 300 });
    L.ringAt(root._ring, t, ev.click, target);
    // pressed state on the link title
    card.querySelector(".ti").style.textDecoration = t >= ev.click - 250 && t < ev.open + 200 ? "underline" : "none";

    // the open: the page starts as the card's rectangle and grows to full frame
    const P = root._page.p, u = L.tw(t, ev.open, 800, "io");
    const E2 = root._edge;
    if (t < ev.open || u >= 1) { E2.style.opacity = 0; E2.style.visibility = "hidden"; }
    if (t < ev.open) { P.style.visibility = "hidden"; }
    else {
      P.style.visibility = "inherit";
      const s0 = c.w / 1920;
      const s = L.lerp(s0, 1, u), x = L.lerp(c.x, 0, u), y = L.lerp(c.y, 0, u);
      const hClip = L.lerp(c.h / s0, 1080, u);   // page px visible in height
      P.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
      P.style.clipPath = `inset(0 0 ${Math.max(0, 1080 - hClip)}px 0 round ${L.lerp(14 / s0, 0, u)}px)`;
      if (u < 1) { Object.assign(E2.style, { visibility: "inherit", opacity: String(1 - L.tw(t, ev.open + 600, 200)), left: x + "px", top: y + "px", width: 1920 * s + "px", height: hClip * s + "px", borderRadius: L.lerp(14, 0, u) + "px" }); }
      // the sheet fades up over the card in 300 ms as it starts to grow, so the link's words go under it, never in one
      // frame (v2-shots-f 175207 item 1, PRE_SIGN 15)
      P.style.opacity = L.tw(t, ev.open, 300);
      // the page's words begin when the page covers 80% of the screen (VL 15.30; the screen is the panel), 300 ms in.
      // u80 is solved from the same curve, so every frame at t is the same.
      const cover = (v) => { const sv = L.lerp(s0, 1, v); return (sv * sv * L.lerp(c.h / s0, 1080, v)) / 1080; };
      let lo = 0, hi = 1; for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (cover(L.E.io(m)) >= 0.8) hi = m; else lo = m; }
      const lift = viaLink ? L.tw(t, ev.open, 300, "io") : L.tw(t, ev.open + 800 * hi, 300, "out");
      root._sheet.style.opacity = viaLink ? 0 : 1 - lift; root._sheet.style.visibility = viaLink || lift >= 1 ? "hidden" : "inherit";
      // the page's own words stay hidden until the sheet lifts, so no glyph shows at the growing edge (v2-visuals 094201)
      for (const ch of P.children) if (ch !== root._sheet) ch.style.opacity = lift;
      P.style.boxShadow = `0 0 0 ${L.lerp(2 / s0, 0, u)}px #DDD`;
    }
    // a gentle push while the page is read, so nothing holds still
    const push = L.tw(t, ev.open + 800, 7000, "sine");
    if (pushOn && t >= ev.open + 800) P.style.transform = `translate(${-19.2 * push}px, ${-10.8 * push}px) scale(${1 + 0.02 * push})`;

    // highlights that follow the voice: the mockups, then the open questions
    const hl = root._hl, pg = root._page;
    const box = (e, pad) => { const b = e.getBoundingClientRect(); return { x: (b.left - rr.left) / sc - pad, y: (b.top - rr.top) / sc - pad, w: b.width / sc + 2 * pad, h: b.height / sc + 2 * pad }; };
    if (t < ev.hlQ) L.hl(hl, box(pg.mocks, 18), t, ev.hlMock, ev.hlQ);
    else L.hl(hl, box(pg.qs, 22), t, ev.hlQ, ev.hlEnd == null ? null : ev.hlEnd + 300);
  },
});
