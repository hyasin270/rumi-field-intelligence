/* coach-phone · shot P3b (v2-screens). A large upright phone in a WhatsApp chat with Rumi.
   The teacher records the lesson (the timer runs fast to 32:10) and sends it; three steps light
   in turn while a pulse travels from the phone down through them and back; Rumi's voice note
   arrives, plays, and one short line in Urdu (Nastaliq) lands under it.
   opt {phoneOnly:true}: the phone alone, centred on white, no steps (a texture for the small
   phone prop; grab a still at arrive+500).
   Point words: "Lesson recording · 32 min" + the three steps (plan's on-screen words) + the Urdu line.
   v2-lead 180505 item 1: while "an AI model" is lit, a small card "the scoring guide" (the voice's words) with blank
   rule lines, no criteria, crest or ministry, stands under the steps (event `guide`, default the second step + 200 ms;
   it leaves as the third step lights). opt.guide {x, y, w} moves it (place and size are v2-visuals'); opt.guide false
   leaves it out. Step icons ease their fill over 300 ms (v2-shots-a 180430 item 1, VL 6.4). */
SCREEN.define({
  id: "coach-phone",
  dur: 11500,
  // guide (optional): the scoring guide card lands; default second step + 200 ms.
  // rec: recording starts. send: the recording is sent. arrive: Rumi's voice note lands.
  // play: its play head runs. caption: the Urdu line lands. The steps light between send and arrive.
  // steps (optional): [t1, t2, t3], the three light times; default send + 20%, 45%, 70% of (arrive - send).
  events: { rec: 0, send: 2400, arrive: 6000, play: 6800, caption: 8500 },
  build(root, opt) {
    const L = SCREEN.lib;
    root.style.background = "#fff";
    const only = !!(opt && opt.phoneOnly);
    const W = 640, H = 1040;
    const st = L.el("div", "abs", null, root); st.style.cssText += "left:0;top:0;width:1920px;height:1080px;transform-origin:50% 50%";
    root._st = st;
    const P = (root._P = PH.phone(st, { x: only ? (1920 - W) / 2 : 250, y: 20, w: W, h: H, fs: 42, name: "Rumi", who: "Rumi", sub: "online" }));
    PH.pill(P.chat, "Today");
    root._sent = PH.voice(P.chat, { side: "out", who: "person", dur: "32:10", seed: 11, bars: 26, meta: "" });
    // a line above the waveform naming the recording
    const lab = document.createElement("div");
    lab.className = "wa-tx"; lab.style.cssText = "font-weight:500;color:#111B21;margin-bottom:.1em;font-size:38px;white-space:nowrap";
    lab.textContent = "Lesson recording · 32 min";
    root._sent.b.insertBefore(lab, root._sent.b.firstChild);
    root._rep = PH.voice(P.chat, { side: "in", who: "Rumi", dur: "1:30", seed: 23, bars: 26 });
    root._cap = PH.text(P.chat, { side: "in", html: `<div dir="rtl" lang="ur" style="font-family:'Noto Nastaliq Urdu',serif;font-size:44px;line-height:2.0;padding:.1em .1em 0">ایک خوبی، اور آزمانے کے لیے ایک بات۔</div>` });
    root._cap.inner.style.maxWidth = "none";
    if (only) return;

    // the three steps, our tokens (Poppins, ink, coral), with a rail from the phone
    const css = `
.cp-step{position:absolute;left:1130px;width:700px;height:156px;border-radius:30px;background:#fff;border:4px solid #DDE2E6;display:flex;align-items:center;gap:34px;padding:0 36px;
  font:600 54px/1.1 'Poppins',sans-serif;color:#111418;transform-origin:0 50%}
.cp-step .ic{width:96px;height:96px;border-radius:50%;background:#EEF0F2;flex:none;display:flex;align-items:center;justify-content:center}
.cp-step .ic svg{width:56px;height:56px}
.cp-step .ok{position:absolute;right:-22px;top:-22px;width:64px;height:64px}
.cp-rail{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:visible;pointer-events:none}
.cp-pulse{position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:#F06E42;box-shadow:0 0 0 12px rgba(240,110,66,.22),0 0 30px rgba(240,110,66,.6)}`;
    const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);
    const ICON = [
      // speech to text: a wave becoming lines
      `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M5 18v12M11 12v24M17 20v8"/><path d="M26 14h17M26 24h17M26 34h11"/></svg>`,
      // an AI model: a spark
      `<svg viewBox="0 0 48 48"><path d="M24 4c1.6 9.4 5.6 13.4 15 15-9.4 1.6-13.4 5.6-15 15-1.6-9.4-5.6-13.4-15-15 9.4-1.6 13.4-5.6 15-15z" fill="currentColor"/><path d="M38 30c.8 4.4 2.6 6.2 7 7-4.4.8-6.2 2.6-7 7-.8-4.4-2.6-6.2-7-7 4.4-.8 6.2-2.6 7-7z" fill="currentColor"/></svg>`,
      // text to speech: lines becoming a speaker
      `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8l10-8v28l-10-8H6z" fill="currentColor"/><path d="M31 17c3 4 3 10 0 14M37 12c5.5 6.5 5.5 17.5 0 24"/></svg>`,
    ];
    const OK = `<svg class="ok" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#001F3F"/><path d="M14 24.5l7 7 13-14" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const words = ["speech to text", "an AI model", "text to speech"];
    root._ys = [250, 470, 690];
    root._steps = words.map((w, i) => { const e = L.el("div", "cp-step", `<div class="ic">${ICON[i]}</div><span>${w}</span>${OK}`, st); e.style.top = (root._ys[i] - 78) + "px"; return e; });
    root._rail = L.el("div", "", `<svg class="cp-rail" viewBox="0 0 1920 1080"><path class="base" fill="none" stroke="#C9CFD4" stroke-width="5" stroke-dasharray="4 14" stroke-linecap="round"/><path class="lit" fill="none" stroke="#F06E42" stroke-width="6" stroke-linecap="round"/>
      ${root._ys.map((y) => `<path d="M1060 ${y}H1126" stroke="#C9CFD4" stroke-width="5" stroke-linecap="round"/>`).join("")}</svg>`, st).firstChild;
    root._pulse = L.el("div", "cp-pulse", null, st);
    // the scoring guide: a plain page card, its label and three blank rule lines (v2-lead 180505 item 1)
    const g = opt && opt.guide;
    if (g !== false) {
      const gx = (g && g.x) || 1130, gy = (g && g.y) || 800, gw = (g && g.w) || 700;
      const gc = (root._guide = L.el("div", "", `<div style="display:flex;align-items:center;gap:22px;font:600 44px/1.1 'Poppins',sans-serif;color:#111418">
        <svg viewBox="0 0 48 48" width="52" height="52" style="flex:none"><path d="M10 4h20l10 10v30H10z" fill="#fff" stroke="#111418" stroke-width="4" stroke-linejoin="round"/><path d="M30 4v10h10" fill="none" stroke="#111418" stroke-width="4" stroke-linejoin="round"/></svg>the scoring guide</div>
        ${[0.92, 0.8, 0.62].map((f) => `<div style="height:10px;width:${Math.round(f * 100)}%;border-radius:5px;background:#E3E6E9;margin-top:22px"></div>`).join("")}`, st));
      Object.assign(gc.style, { position: "absolute", left: gx + "px", top: gy + "px", width: gw + "px", boxSizing: "border-box", padding: "26px 36px 32px", background: "#fff", border: "4px solid #DDE2E6", borderRadius: "26px", boxShadow: "0 14px 32px rgba(17,20,24,.10)", opacity: 0, transformOrigin: "50% 0" });
    }
  },
  render(root, t, ev, opt) {
    const L = SCREEN.lib, P = root._P, only = !!(opt && opt.phoneOnly);
    const sent = root._sent, rep = root._rep, cap = root._cap;
    // recording: the timer runs fast to 32:10, then the bubble is sent
    const recOn = t >= ev.rec && t < ev.send;
    const secs = Math.round(1930 * L.E.in(L.clamp01((t - ev.rec - 150) / (ev.send - ev.rec - 400))) ** 0.55);
    PH.recording(P, recOn, `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`, t);
    PH.grow(sent, t, ev.send);
    PH.ticks(sent, t < ev.send ? 0 : t < ev.send + 500 ? 1 : t < ev.send + 1000 ? 2 : 3);
    PH.play(sent, t, 1e9, 1);
    PH.grow(rep, t, ev.arrive);
    PH.play(rep, t, ev.play, 9000);
    PH.grow(cap, t, ev.caption);
    // steps timing: three equal beats between send and arrive
    // events.steps [t1, t2, t3] (ms, optional; v2-shots-a 213707 item 1) sets the three light times; else three equal beats
    const span = ev.arrive - ev.send, sT = Array.isArray(ev.steps) && ev.steps.length === 3 ? ev.steps.map(Number) : [0, 1, 2].map((k) => ev.send + span * (0.2 + 0.25 * k));
    P.sub.textContent = t >= sT[2] && t < ev.arrive ? "recording audio…" : "online";
    // a slow push once the reply is in, so the hold stays alive
    const push = L.tw(t, ev.arrive, 6000, "sine");
    root._st.style.transform = `scale(${1 + 0.015 * push})`;
    if (only) return;

    // the rail: from the sent bubble, right, down past the three steps, back to where the reply lands
    const rr = root.getBoundingClientRect(), sc = rr.width / 1920 / (1 + 0.015 * push);
    const dev = P.dev.getBoundingClientRect();
    const xr = (dev.right - rr.left) / sc - 14;
    const sb = sent.b.getBoundingClientRect();
    const yS = t < ev.send ? 700 : Math.min(880, (sb.top + sb.height / 2 - rr.top) / sc);
    const yR = Math.min(1000, yS + 100), xm = 1060, xu = 1000, ys = root._ys;
    // out along the bottom, up an outer rail, over the top, down past the steps, back to the phone
    const pts = [[xr, yS], [xu, yS], [xu, 150], [xm, 150], [xm, ys[0]], [xm, ys[1]], [xm, ys[2]], [xm, yR], [xr, yR]];
    const d = "M" + pts.map((p) => p.join(" ")).join("L");
    const base = root._rail.querySelector(".base"), lit = root._rail.querySelector(".lit");
    base.setAttribute("d", d); lit.setAttribute("d", d);
    const seg = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(tot); tot += l; }
    seg.push(tot);
    const at = (i) => seg[i];
    // keys: distance along the path over time (pauses at each step)
    // with long gaps (events.steps) the dot holds, then travels in the last 600 ms before each step (1000 ms for the first); default beats unchanged
    const K = [[Math.max(ev.send + 300, sT[0] - 1000), 0], [sT[0], at(4)], [Math.max(sT[0] + 450, sT[1] - 600), at(4)], [sT[1], at(5)], [Math.max(sT[1] + 450, sT[2] - 600), at(5)], [sT[2], at(6)], [Math.min(sT[2] + 450, ev.arrive - 61), at(6)], [ev.arrive - 60, tot]];
    let dist = 0;
    if (t >= K[K.length - 1][0]) dist = tot;
    else for (let i = 1; i < K.length; i++) if (t < K[i][0]) { const u = L.E.io(L.clamp01((t - K[i - 1][0]) / (K[i][0] - K[i - 1][0]))); dist = t < K[0][0] ? 0 : L.lerp(K[i - 1][1], K[i][1], u); break; }
    lit.setAttribute("stroke-dasharray", `${dist} ${tot + 10}`);
    const fade = 1 - L.tw(t, ev.arrive + 600, 800);
    lit.style.opacity = fade; base.style.opacity = t < ev.send ? L.tw(t, 0, 400) * 0.6 : 1 - 0.7 * L.tw(t, ev.arrive + 400, 800);
    let px = pts[0][0], py = pts[0][1];
    for (let i = 1; i < pts.length; i++) if (dist <= seg[i] || i === pts.length - 1) {
      const u = (seg[i] - seg[i - 1]) ? L.clamp01((dist - seg[i - 1]) / (seg[i] - seg[i - 1])) : 0;
      px = L.lerp(pts[i - 1][0], pts[i][0], u); py = L.lerp(pts[i - 1][1], pts[i][1], u); break;
    }
    const pOn = t >= K[0][0] && t < ev.arrive + 100;
    root._pulse.style.opacity = pOn ? Math.min(L.tw(t, K[0][0], 200), 1 - L.tw(t, ev.arrive - 100, 200)) : 0;
    root._pulse.style.transform = `translate(${px}px, ${py}px) scale(${1 + 0.08 * Math.sin(t / 110)})`;
    // steps: lit as the pulse reaches them, then done (a green tick) when the next one lights
    root._steps.forEach((e, k) => {
      const on = L.tw(t, sT[k], 280, "out"), done = k < 2 ? L.tw(t, sT[k + 1], 300) : L.tw(t, ev.arrive, 300);
      const lit = on * (1 - done);
      e.style.borderColor = lit > 0.01 ? `rgba(240,110,66,${0.25 + 0.75 * lit})` : (done > 0 ? "#BFD8BF" : "#DDE2E6");
      e.style.background = `rgba(255,241,235,${lit})`;
      e.style.transform = `scale(${1 + 0.04 * L.E.back(Math.min(on, 1)) * (1 - done)})`;
      const ic = e.querySelector(".ic");
      // the fill eases over 300 ms: grey to coral as it lights, coral to ink as it is done (VL 6.4)
      const mix = (a, b, u) => a.map((v, j) => Math.round(v + (b[j] - v) * u));
      const bg = mix(mix([238, 240, 242], [240, 110, 66], on), [17, 20, 24], done), fg = mix([138, 147, 155], [255, 255, 255], Math.max(on, done));
      ic.style.background = `rgb(${bg.join(",")})`;
      ic.style.color = `rgb(${fg.join(",")})`;
      e.querySelector("span").style.color = on > 0 ? "#111418" : "#6B737B";
      const ok = e.querySelector(".ok"); ok.style.opacity = done; ok.style.transform = `scale(${0.6 + 0.4 * L.E.back(done)})`;
    });
    // the scoring guide: lands 300 ms (a small lift), leaves 300 ms as the third step lights
    if (root._guide) {
      const g0 = ev.guide != null ? ev.guide : sT[1] + 200, gi = L.tw(t, g0, 300, "out"), go = L.tw(t, sT[2], 300);
      root._guide.style.opacity = gi * (1 - go);
      root._guide.style.transform = `translateY(${16 * (1 - gi)}px)`;
    }
  },
});
