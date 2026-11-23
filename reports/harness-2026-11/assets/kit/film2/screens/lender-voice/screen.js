/* lender-voice · shot R1 inset 1 (v2-screens). DESIGN MOCKUP, chip "How it could work".
   The farmer's phone, chat with Rumi: the farmer's own voice note (green, right) is sent, its
   ticks turn blue as Rumi hears it, and its transcript opens inside the bubble.
   Inset layout (VISUAL_LANGUAGE_v2 9.11, 14.10): carrying words are 104 px (the inset plays 800 x 450, about 43 px there)
   The bubble fills about 85% of the width.
   Point words (7): "I need a tractor for two days." */
SCREEN.define({
  id: "lender-voice",
  dur: 3800,
  // vn: the note is sent (one tick). play: its play head runs. tr: the transcript opens. rd: ticks turn blue.
  events: { vn: 200, play: 700, tr: 1400, rd: 2500 },
  build(root) {
    const W = (root._W = PH.window(root, { fs: 104, compact: true, hfs: 70, name: "Rumi", who: "Rumi", label: "How it could work" }));
    W.chat.style.cssText += ";justify-content:center;padding:20px 60px 40px";
    root._v = PH.voice(W.chat, { side: "out", who: "person", dur: "0:24", seed: 31, bars: 28, width: 1640,
      transcript: "I need a tractor<br>for two days." });
  },
  render(root, t, ev) {
    const L = SCREEN.lib, v = root._v;
    root._W.w.style.transform = `scale(${1 + 0.015 * L.tw(t, 0, 3800, "sine")})`;
    PH.transcript(v, t, ev.tr, 420);   // first: the bubble's height depends on it
    PH.grow(v, t, ev.vn);
    PH.play(v, t, ev.play, 2400);
    PH.ticks(v, t < ev.vn ? 0 : t < ev.rd - 600 ? 1 : t < ev.rd ? 2 : 3);
  },
});
