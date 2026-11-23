/* chat-answer · shot 3B2 (v2-screens). Slack #team-lessonplans. A field coach lead's question to
   Rumi is there; Rumi answers from one meeting summary, and says where the answer came from.
   Point words: "@Rumi What did the lesson plans team decide last week?" / "To add a practice step to every plan." / "From one meeting summary" (24, read in two beats) */
SCREEN.define({
  id: "chat-answer",
  dur: 8000,
  // q: the question lands (0 or less: it is there from the first frame, as the panel grows from the agent's card).
  // typing: Rumi is typing (shown only if there are 600 ms or more before ans). ans: the answer lands.
  // src: the source line under the answer highlights.
  // opt.dock [d0, d1] (ms from mount): the docked state, question only, framed large (ruling 77); after d1 it eases out
  // with the kit's grow to Full (call scr.full(t0 + d1)).
  events: { q: 0, typing: 0, ans: 500, src: 2200, thanks: 4300 },
  build(root) {
    const S = (root._S = SL.build(root, { channel: "team-lessonplans", channels: ["team-lessonplans", "team-product", "data"] }));
    root._early = SL.earlier(S, [
      { who: "Programme lead", time: "09:05", text: "Field visits are on Thursday this week." },
      { who: "Content lead", time: "09:30", text: "Grade 3 plans are going to review today." },
    ]);
    root._m1 = SL.msg(S.msgs, { who: "Field coach lead", time: "10:12", text: "@Rumi What did the lesson plans team decide last week?" });
    root._m2 = SL.msg(S.msgs, { who: "Rumi", time: "10:12", text: "To add a practice step to every plan.",
      extra: `<div class="src" style="display:inline-flex;align-items:center;gap:14px;margin-top:14px;font-size:36px;color:#616061;border:2px solid #E1E1E1;border-radius:12px;padding:8px 18px">
        <svg viewBox="0 0 24 24" width="36" height="36"><path d="M5 4h14v4H5zM5 10h10v4H5zM5 16h14v4H5z" fill="#9B9A97"/><path d="M5 10h10v4H5z" fill="#1264A3"/></svg>From one meeting summary</div>` });
    root._m3 = SL.msg(S.msgs, { who: "Field coach lead", time: "10:13", text: "Thanks, that helps." });
    root._hl = SCREEN.lib.el("div", "s-hl", null, root);
  },
  render(root, t, ev, opt) {
    const L = SCREEN.lib, S = root._S;
    // the slow push first, so every measurement below sees this frame's transform
    const push = L.tw(t, ev.ans, Math.max(1, this.dur - ev.ans), "sine");
    S.w.style.transformOrigin = "60% 70%"; S.w.style.transform = `scale(${1 + 0.015 * push})`;
    if (ev.q <= 0) SL.show(root._m1, true); else SL.grow(root._m1, t, ev.q);
    SL.typingLine(S.typing, "Rumi", t, ev.ans - ev.typing >= 600 ? ev.typing : 1e9, ev.ans);
    SL.grow(root._m3, t, ev.thanks);
    SL.grow(root._m2, t, ev.ans);
    // opt.dock [d0, d1] (ruling 77; VL 15.58 v1.25, v2-visuals 122617): while the kit shows the screen small, the window
    // holds the channel name, the field coach lead's row whole, and "Rumi is typing…", with no older line and no field.
    // The row sits under the channel name while docked and slides to its place in the full chat as the kit grows the
    // panel to Full; the zoom follows the kit's own scale on root, so the words keep about their size on the frame.
    // opt.dockRect {w, h} and opt.dockFit (default 840 x 441, "cover") must match the shot's k.screen to / fit.
    const dock = opt && opt.dock;
    root._early.forEach((e) => (e.inner.style.opacity = ""));             // grey (.sl-dim) unless the dock fades them
    [root._m1, ...root._early].forEach((e) => (e.item.style.transform = "")); S.typing.style.transform = ""; S.msgs.style.webkitMaskImage = "";
    if (dock && t < dock[1] + 700) {
      const m = /scale\(([\d.]+)\)/.exec(root.style.transform || ""), sc = m ? +m[1] : 1;
      const DR = opt.dockRect || { w: 840, h: 441 }, cover = (opt.dockFit || "cover") === "cover";
      const scD = cover ? Math.max(DR.w / 1920, DR.h / 1080) : Math.min(DR.w / 1920, DR.h / 1080);
      const vw = Math.min(1920, DR.w / scD), vh = Math.min(1080, DR.h / scD);   // what of root the docked window shows
      // the row: avatar to the end of its longest line (line boxes over the block's own box: transforms cancel)
      const it = root._m1.inner, main = S.main, xe = root._m1.x, x0 = main.offsetLeft + it.offsetLeft + 56;
      const rg = document.createRange(); rg.selectNodeContents(xe);
      const xr = xe.getBoundingClientRect(), lw = Math.max(...[...rg.getClientRects()].map((r) => r.right)) - xr.left;
      const x1 = main.offsetLeft + it.offsetLeft + xe.offsetLeft + (lw / Math.max(1e-6, xr.width)) * xe.offsetWidth;
      // the zoom docked: the question at 40 px on the frame, less if the row and 28 px either side would not fit
      const ZD = Math.min(40 / (44 * scD), vw / (x1 - x0 + 56));
      const Z = Math.max(1, Math.min(ZD, (ZD * scD) / sc));
      const k = ZD > 1 ? (Z - 1) / (ZD - 1) : 0;                          // 1 docked, 0 at Full
      if (k > 0.0005) {
        // the row (and the typing line under it) slide up to sit under the channel name, by k; the grey lines above it
        // move with it as one column (out of the list's top), so nothing ever overlaps on the way
        const pad = 24, dy = pad - (root._m1.item.offsetTop - S.msgs.offsetTop);   // offsetTop is from .sl-main
        const dyT = S.msgs.offsetTop + pad + root._m1.item.offsetHeight - S.typing.offsetTop;
        [root._m1, ...root._early].forEach((e) => (e.item.style.transform = `translateY(${dy * k}px)`)); S.typing.style.transform = `translateY(${dyT * k}px)`;
        S.msgs.style.webkitMaskImage = `linear-gradient(to bottom,transparent 0,#000 ${90 * (1 - k)}px)`;
        root._early.forEach((e) => (e.inner.style.opacity = String(0.5 * Math.max(0, 1 - 1.6 * k))));
        // the window: left on the avatar less 28 px, top on the screen top (the channel name)
        const hw = vw / 2 / ZD, hh = vh / 2 / ZD;
        const fx = Math.min(1920 - hw, Math.max(hw, x0 - 28 + hw)), fy = hh;
        // the kit centres root in the window, so root's centre (960, 540) is the window's centre
        S.w.style.transformOrigin = `${fx}px ${fy}px`;
        S.w.style.transform = `translate(${(960 - fx) * k}px,${(540 - fy) * k}px) scale(${Z})`;
      }
    }
    // the source chip, highlighted as the voice says the agent does not need the transcript
    L.hl(root._hl, L.boxOf(root, root._m2.inner.querySelector(".src"), 10), t, ev.src, ev.thanks - 200);
  },
});
