/* lender-reply · shot R1 last inset (v2-screens). DESIGN MOCKUP, chip "How it could work".
   The farmer's phone, chat with Rumi: the farmer's own note (green, right, small: context only),
   then Rumi's reply voice note arrives (white, left), plays, and its transcript opens.
   Inset layout (VISUAL_LANGUAGE_v2 9.11, 14.10): carrying words 104 px (the inset plays 800 x 450, about 43 px there).
   Point words (2): "Tractor booked." */
SCREEN.define({
  id: "lender-reply",
  dur: 3600,
  // vn: Rumi's reply lands. play: it plays. tr: its transcript opens.
  events: { vn: 300, play: 900, tr: 1600 },
  build(root) {
    const W = (root._W = PH.window(root, { fs: 104, compact: true, hfs: 70, name: "Rumi", who: "Rumi", label: "How it could work" }));
    W.chat.style.cssText += ";justify-content:center;padding:20px 60px 40px";
    root._a = PH.voice(W.chat, { side: "out", who: "person", dur: "0:24", seed: 31, bars: 28, width: 900 });
    root._a.item.style.fontSize = "64px";
    root._b = PH.voice(W.chat, { side: "in", who: "Rumi", dur: "0:21", seed: 47, bars: 28, width: 1640, transcript: "Tractor booked." });
    root._b.inner.style.marginTop = "40px";
  },
  render(root, t, ev) {
    const L = SCREEN.lib, a = root._a, b = root._b;
    root._W.w.style.transform = `scale(${1 + 0.015 * L.tw(t, 0, 3600, "sine")})`;
    PH.show(a, true); PH.play(a, t, 1e9, 1); PH.ticks(a, 3);
    a.inner.style.opacity = 1 - 0.35 * L.tw(t, ev.vn, 400);
    PH.transcript(b, t, ev.tr, 420);
    PH.grow(b, t, ev.vn);
    PH.play(b, t, ev.play, 2400);
  },
});
