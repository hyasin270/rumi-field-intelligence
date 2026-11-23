/* slack-quick · shot 2A (v2-screens). Slack #team-assessment. An assessment specialist types a
   question and tags Rumi; it is sent; "1 reply" appears; the thread opens and Rumi's answer is
   there, with the file it made.
   Point words: "@Rumi Can you make a short grade 2 quiz on fractions?" / "Here it is, with the answers." (17; the second line is the answer) */
SCREEN.define({
  id: "slack-quick",
  dur: 14000,
  // type: typing starts in the composer. send: the question lands. reply: "1 reply" shows under it.
  // thread: the thread pane opens. ans: Rumi's answer lands in the thread. thanks: the specialist says thank you.
  events: { type: 700, send: 4700, reply: 7300, thread: 8100, ans: 8800, thanks: 11600 },
  build(root) {
    const S = (root._S = SL.build(root, { channel: "team-assessment", channels: ["team-assessment", "team-product", "data"] }));
    const L = SCREEN.lib;
    root._early = SL.earlier(S, [
      { who: "Content lead", time: "08:12", text: "The grade 3 quiz is back from review." },
      { who: "Engineer", time: "08:30", text: "The quiz page loads faster now." },
      { who: "Data lead", time: "08:47", text: "Last term’s results are in the sheet." },
      { who: "Programme lead", time: "09:02", text: "Term tests start on Monday." },
      { who: "Rumi", time: "09:15", text: "Noted. The question bank is up to date." },
    ]);
    const q = "@Rumi Can you make a short grade 2 quiz on fractions?";
    root._q = q;
    root._m1 = SL.msg(S.msgs, { who: "Assessment specialist", time: "09:41", text: q,
      extra: `<div class="sl-reply">${L.avatar("Rumi")}1 reply</div>` });
    const T = (root._T = SL.thread(root, "team-assessment"));
    root._t1 = SL.msg(T.msgs, { who: "Assessment specialist", time: "09:41", text: q });
    root._t2 = SL.msg(T.msgs, { who: "Rumi", time: "09:43", text: "Here it is, with the answers.", extra: SL.file("Grade 2 fractions quiz", "Google Doc", "doc") });
    root._t3 = SL.msg(T.msgs, { who: "Assessment specialist", time: "09:44", text: "Perfect, thank you." });
    root._T.msgs.style.justifyContent = "flex-start";
    root._T.msgs.style.paddingTop = "20px";
    // v2-check b32: no channel line may run under the thread pane (left edge x 920). Wrap every channel
    // line short of it from frame 0, so nothing reflows when the pane opens.
    root._wrap = () => { const lim = 1920 - 1000 - 24;
      S.main.querySelectorAll(".sl-x").forEach((x) => { let l = 0, e = x; // left edge in the screen's own 1920 px, whatever the kit's scale
        while (e && e !== root) { l += e.offsetLeft; e = e.offsetParent; }
        x.style.maxWidth = Math.max(200, Math.floor(lim - l)) + "px"; }); };
    // ---- opt.dock [d0, d1] (ruling 101; VL 15.58, as chat-answer): while the kit shows the screen small, the panel is a
    // window on the screen at about its Full size, holding "# team-assessment", the specialist's row (once sent) and the
    // message field, each whole. The field and the row are moved up under the channel name, the field narrowed to the
    // row's width, the older lines faded; the zoom follows the kit's own scale on root, so as the kit grows the panel to
    // Full at d1 everything slides back to its place in one move and the words keep their size. Same events, same order.
    // opt.dockRect {w, h} and opt.dockFit (default 840 x 441, "cover") must match the shot's k.screen to / fit.
    root._geo = (opt) => {                                  // the docked view in the screen's own px, and the zoom
      const DR = opt.dockRect || { w: 840, h: 441 }, cover = (opt.dockFit || "cover") === "cover";
      const scD = cover ? Math.max(DR.w / 1920, DR.h / 1080) : Math.min(DR.w / 1920, DR.h / 1080);
      const vw = Math.min(1920, DR.w / scD), vh = Math.min(1080, DR.h / scD);
      const main = S.main, it = root._m1.inner, xe = root._m1.x, head = main.querySelector(".sl-head");
      const x0 = main.offsetLeft + it.offsetLeft + 56;      // the avatar's left edge
      const rg = document.createRange(); rg.selectNodeContents(xe);
      const xr = xe.getBoundingClientRect(), lw = Math.max(...[...rg.getClientRects()].map((r) => r.right)) - xr.left;
      const x1 = main.offsetLeft + it.offsetLeft + xe.offsetLeft + (lw / Math.max(1e-6, xr.width)) * xe.offsetWidth;
      const L0 = x0 - 28, R0 = Math.max(x1, x0 + 640) + 28;  // 28 px of air either side of the row
      const top = 14, rowY = head.offsetHeight + 16, h1 = it.offsetHeight, compB = rowY + h1 + 8 + 112, bot = compB + 16;
      const ZD = Math.min(vw / (R0 - L0), vh / (bot - top));
      // the view is anchored left (on the avatar less 28 px) and top: the side with room to spare shows more of the
      // channel to the right or below, never the rail; the field is widened to the view's right less 28 px
      const Wv = vw / ZD, Hv = vh / ZD, Rv = Math.min(1920, L0 + Wv);
      return { scD, ZD, L0, R0: Rv, top, bot, rowY, compB, cx: L0 + Wv / 2, cy: top + Hv / 2 };
    };
    root._kDock = (t, opt) => {
      const dock = opt && opt.dock; if (!dock || t >= dock[1] + 700) return 0;
      const m = /scale\(([\d.]+)\)/.exec(root.style.transform || ""), sc = m ? +m[1] : 1;
      // measure with the reply line open: the row's docked height does not include it
      const rp = root._m1.inner.querySelector(".sl-reply"), hs = rp.style.height; rp.style.height = "0px"; rp.style.marginTop = "0px";
      const G = (root._G = root._geo(opt)); rp.style.height = hs; rp.style.marginTop = "";
      const Z = Math.max(1, Math.min(G.ZD, (G.ZD * G.scD) / sc));
      root._Z = Z; return G.ZD > 1 ? (Z - 1) / (G.ZD - 1) : 0;
    };
    root._dock = (t, opt, k) => {
      const comp = S.main.querySelector(".sl-comp"), items = [...S.msgs.children].filter((e) => e.classList.contains("sl-item"));
      comp.style.transform = ""; comp.style.marginRight = ""; comp.style.background = ""; S.input.style.whiteSpace = ""; S.input.style.lineHeight = "";
      items.forEach((e) => (e.style.transform = "")); S.typing.style.transform = ""; S.msgs.style.webkitMaskImage = "";
      root._early.forEach((e) => (e.inner.style.opacity = ""));
      if (S.w.style.transform.startsWith("translate(")) S.w.style.transform = "";
      S.w.style.transformOrigin = "";
      if (!(k > 0.0005)) return;
      const G = root._G, Z = root._Z;
      // the field: narrowed to the row's width, its bottom under the row; a typed question wraps (Slack's field grows up)
      comp.style.marginRight = 56 + (1920 - 56 - (G.R0 - 28)) * k + "px"; comp.style.background = "#fff";
      S.input.style.whiteSpace = "normal"; S.input.style.lineHeight = "1.3";
      const cB = comp.offsetTop + comp.offsetHeight;        // offsetTop is from .sl-main, as is the row's
      comp.style.transform = `translateY(${(G.compB - cB) * k}px)`;
      S.typing.style.transform = `translateY(${(G.compB - cB) * k}px)`;
      // the row sits under the channel name; the grey lines above it move with it as one column and fade
      const dy = G.rowY - root._m1.item.offsetTop;
      items.forEach((e) => (e.style.transform = `translateY(${dy * k}px)`));
      S.msgs.style.webkitMaskImage = `linear-gradient(to bottom,transparent 0,#000 ${90 * (1 - k)}px)`;
      root._early.forEach((e) => (e.inner.style.opacity = String(0.5 * Math.max(0, 1 - 1.6 * k))));
      // the window: the view's centre goes to root's centre (the kit centres root in the panel)
      S.w.style.transformOrigin = `${G.cx}px ${G.cy}px`;
      S.w.style.transform = `translate(${(960 - G.cx) * k}px,${(540 - G.cy) * k}px) scale(${Z})`;
    };
  },
  render(root, t, ev, opt) {
    const L = SCREEN.lib, S = root._S, T = root._T;
    if (!root._wrapped) { root._wrapped = 1; root._wrap(); }
    // ruling 101: typing may start late (the docked window, 5.19 s to 7.43 s); the rate rises only if 15 a second would
    // not finish 400 ms before the send, so the timing v2-check passed is unchanged
    const cps = Math.max(15, (15 * L.typeDur(SL.curly(root._q), 15, 3)) / Math.max(1, ev.send - ev.type - 400));
    SL.typeInto(S, root._q, t, ev.type, ev.send, cps);
    // tagOn / tagOff (5C, v2-visuals 165307; VL 15.54): the "@Rumi" tag is the one lit part, solid #FFD666 behind the tag
    // only, in the field and in the sent row alike; 250 ms in and out. Off unless the shot passes tagOn.
    const lit = ev.tagOn == null ? 0 : Math.min(SCREEN.lib.tw(t, ev.tagOn, 250), 1 - SCREEN.lib.tw(t, ev.tagOff == null ? 1e9 : ev.tagOff, 250));
    root.querySelectorAll(".sl-main .sl-at").forEach((a) => {
      if (lit <= 0) { a.style.background = ""; a.style.color = ""; return; }
      const mix = (x, y) => Math.round(x + (y - x) * lit);
      a.style.background = `rgb(${mix(0xE8, 0xFF)},${mix(0xF5, 0xD6)},${mix(0xFA, 0x66)})`; a.style.color = lit > 0.5 ? "#1D1C1D" : ""; });
    const rp = root._m1.inner.querySelector(".sl-reply");
    rp.style.height = ""; rp.style.marginTop = ""; rp.style.overflow = "";
    const kD = root._kDock(t, opt);                         // 1 docked, 0 at Full (ruling 101); 0 with no opt.dock
    if (kD > 0) { const h = rp.offsetHeight; rp.style.overflow = "hidden"; rp.style.height = h * (1 - kD) + "px"; rp.style.marginTop = 10 * (1 - kD) + "px"; }
    SL.grow(root._m1, t, ev.send);                          // after the fold, so its height is this frame's
    rp.style.opacity = L.tw(t, ev.reply, 300); rp.style.transform = `translateY(${(1 - L.tw(t, ev.reply, 300, "out")) * 10}px)`;
    // the thread pane slides in from the right; the channel steps back
    const u = L.tw(t, ev.thread, 600, "out");
    T.w.style.transform = `translateX(${(1 - u) * 1000}px)`;
    T.w.style.visibility = t >= ev.thread ? "inherit" : "hidden";
    S.main.style.opacity = 1 - 0.45 * u;
    SL.show(root._t1, true);
    SL.typingLine(T.typing, "Rumi", t, ev.thread + 200, ev.ans);
    SL.grow(root._t2, t, ev.ans);
    SL.grow(root._t3, t, ev.thanks);
    // a slow push on the answer so the hold stays alive
    const push = L.tw(t, ev.ans + 600, Math.max(1, this.dur - ev.ans - 600), "sine");
    T.w.style.transform += ` scale(${1 + 0.012 * push})`;
    root._dock(t, opt, kD);
  },
});
