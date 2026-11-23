/* call-notetaker · shots 3A1 (default) and 5D (opt {start:"joined"}) · v2-screens / google_meet, round 2.
   Google Meet as it looks: dark call stage (the product's own), light dialog, toasts and side card.
   3A1: four role tiles, a speaking ring moving between them. The host clicks People, the Add people
   dialog opens, "Rumi" is typed and "Rumi · note taker" is invited (about 5.6 s). The fifth tile slides in
   (about 6.6 s) with the Rumi mark and a recording dot; then wordless grey lines scroll in the card under
   it: what it is catching. 5D (ruling 63, read from the code, NOTETAKER_CODE section 2): the same call
   already joined; nobody calls on the note taker. At `hand` its tile raises Meet's hand; at `chat` its one-line
   point lands in the in-call messages card; at `invite` a person speaks (waves it in); only at `speak` does
   its tile get the speaker's ring, and the hand comes down (or stays, opt.handStays, 5Dc). Live (F41, F62).
   dur: this.dur (the shot's length), default 7767 for 3A1; 5D passes 15000. */
SCREEN.define({
  id: "call-notetaker",
  dur: 7767,
  // cur: pointer appears, travels 1000 ms. ppl: clicks People (Add people dialog opens). type: "Rumi" typed.
  // sug: suggestion shows. invite: clicks Invite (dialog closes). join: the tile slides in (500 ms) as the
  // grid makes room. rec: the recording dot. lines: grey lines start.
  // 5D only (not in the defaults, so 3A1 is untouched): hand (2500): the raised hand pops on the note taker's tile.
  // chat (hand + 700): its point arrives in the in-call messages card under the yellow field. wave (speak - 1500): a
  // person speaks (their ring), waving it in. speak or ring (hand + 5000): the hand comes down and the tile gets the
  // speaker's ring and level badge. (`invite` is 3A1's click on Invite, so 5D's person is `wave`.)
  events: { cur: 0, ppl: 1000, type: 1500, sug: 2100, invite: 3600, join: 4150, rec: 4800, lines: 5000 },
  build(root, opt) {
    const L = SCREEN.lib, joined = !!opt && (opt.start === "joined" || opt.joined === true);
    const M = (root._M = G.meet(root, { title: joined ? "Weekly planning" : "Weekly sync" }));
    const w = M.w;
    root._people = [["Programme lead"], ["Content lead", 1], ["Field coach lead", 1], ["Data lead", 1]].map(([r, m]) => G.tile(w, r, null, { muted: !!m }));
    root._bot = G.tile(w, "Rumi", "Rumi · note taker", { muted: true });
    // the card under the note taker: wordless lines of what it is catching
    const C = (root._lines = L.el("div", "gm-lines", null, w));
    const cols = ["#2F7D5B", "#A3532C", "#8C6A1F", "#2C6E7F"];
    root._ln = [];
    for (let i = 0; i < 80; i++) {
      const who = Math.floor(L.noise(i, 31) * 4), wd = 0.38 + 0.58 * L.noise(i, 17);
      const ln = L.el("div", "ln", `<i style="background:${cols[who]}"></i><b></b>`, C);
      root._ln.push({ ln, b: ln.querySelector("b"), wd });
    }
    L.el("div", "fade", null, C).style.cssText += "top:0;background:linear-gradient(#fff,rgba(255,255,255,0))";
    L.el("div", "fade", null, C).style.cssText += "bottom:0;background:linear-gradient(rgba(255,255,255,0),#fff)";
    root._scrim = L.el("div", "abs", null, w); root._scrim.style.cssText += "inset:0;background:rgba(0,0,0,.5);opacity:0";
    const D = (root._dlg = L.el("div", "gm-modal", `<h3>Add people</h3><div class="gm-in"><span class="tx"></span><span class="ph">Enter a name or email</span></div>
      <div class="gm-sug">${L.avatar("Rumi")}<span>Rumi · note taker</span><div class="ac">Invite</div></div>`, w));
    D.style.marginTop = "-240px";
    // 5D: Meet's in-call messages card, in the slot under the note taker (the lines card is not used in 5D)
    const H = (root._say = L.el("div", "gm-chat", `<div class="hd">In-call messages</div>
      <div class="msg"><div class="who">${L.avatar("Rumi")}<b>Rumi · note taker</b></div></div>`, w));
    // the point is brief-page's point 1, the same object (VL 15.48): words, face, size and chip
    root._pt = BR.point(H.querySelector(".msg"), 0, { size: 40, chip: 36 });
    root._pt.style.marginTop = "0"; // alone in the card (v2-visuals 110639 item 4, v2-check batch 33)
    // until the line writes in, the card is a dark call tile like the other five with a small chat mark (v2-visuals 124618 item 8)
    root._cm = L.el("div", "abs", `<svg viewBox="0 0 48 48" width="96" height="96"><path d="M10 10h28a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H20l-8 7v-7h-2a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z" fill="none" stroke="#9AA0A6" stroke-width="3" stroke-linejoin="round"/><g fill="#9AA0A6"><circle cx="17" cy="22" r="2.4"/><circle cx="24" cy="22" r="2.4"/><circle cx="31" cy="22" r="2.4"/></g></svg>`, H);
    Object.assign(root._cm.style, { left: "50%", top: "50%", transform: "translate(-50%,-50%)", lineHeight: "0" });
    root._fld = L.el("div", "s-hl", null, w);
    if (!document.getElementById("gm-chat-css")) {
      const st = document.createElement("style"); st.id = "gm-chat-css";
      st.textContent = `.gm-chat{position:absolute;background:#fff;border-radius:24px;padding:34px 38px;color:#202124;font-family:Roboto,sans-serif}
.gm-chat .hd{font-size:40px;font-weight:500}
.gm-chat .msg{margin-top:34px}
.gm-chat .who{display:flex;align-items:center;gap:16px;font-size:36px;color:#3C4043}
.gm-chat .who b{font-weight:500}
.gm-chat .who .s-av{width:56px;height:56px;border-radius:50%;flex:none}
.gm-chat .br-pt .ch{white-space:normal}
.gm-chat .hd,.gm-chat .who{display:none}
.gm-chat{display:flex;align-items:center}
.gm-chat .msg{margin-top:0;width:100%}
.gm-tile .eq{position:absolute;right:26px;top:26px;width:64px;height:64px;border-radius:50%;background:#1A73E8;display:flex;align-items:center;justify-content:center;gap:6px;opacity:0}
.gm-tile .eq b{display:block;width:8px;border-radius:4px;background:#fff}`;
      document.head.appendChild(st);
    }
    root._bot.appendChild(L.el("div", "eq", "<b></b><b></b><b></b>"));
    root._cur = L.cursorEl(root); root._ring = L.ringEl(root);
    if (joined) {
      D.style.display = root._scrim.style.display = "none";
      // the raised hand as Meet's white icon on the call's grey, no yellow disc: in 5Dc the only yellow is the line
      // (v2-visuals 113600 item; v2-shots-f 202645 item 2)
      const hd = root._bot.querySelector(".hand");
      hd.style.background = "#3C4043";
      hd.querySelectorAll("svg").forEach((v) => { v.setAttribute("fill", "#FFFFFF"); v.setAttribute("stroke", "#FFFFFF"); });
    }
    else H.style.display = "none";
  },
  render(root, t, ev, opt) {
    const L = SCREEN.lib, joined = !!opt && (opt.start === "joined" || opt.joined === true), dur = (this && this.dur) || opt.dur || 7767; // the shot's length: the push runs to the end
    const M = root._M, D = root._dlg, H = root._say, P = root._people, B = root._bot;
    const push = L.tw(t, 0, dur, "sine");
    M.w.style.transform = `scale(${1 + 0.015 * push})`;

    // ---- the grid: 2x2 of people, then 3x2 with the note taker top right and its card under it
    const jn = joined ? 1 : L.tw(t, ev.join, 500, "io");
    const X0 = 28, Y0 = 28, gap = 20, strip = 0, th = (1080 - 150 - strip - Y0 - gap) / 2; // 5D keeps a strip above the bar for the toast
    const w4 = (1864 - gap) / 2, w6 = (1864 - 2 * gap) / 3;
    const slot4 = (c, r) => ({ x: X0 + c * (w4 + gap), y: Y0 + r * (th + gap), w: w4 });
    const slot6 = (c, r) => ({ x: X0 + c * (w6 + gap), y: Y0 + r * (th + gap), w: w6 });
    const put = (el, a, b, u) => {
      Object.assign(el.style, { left: L.lerp(a.x, b.x, u) + "px", top: L.lerp(a.y, b.y, u) + "px", width: L.lerp(a.w, b.w, u) + "px", height: th + "px" });
    };
    put(P[0], slot4(0, 0), slot6(0, 0), jn); put(P[1], slot4(1, 0), slot6(1, 0), jn);
    put(P[2], slot4(0, 1), slot6(0, 1), jn); put(P[3], slot4(1, 1), slot6(1, 1), jn);
    const s2 = slot6(2, 0);
    put(B, { x: 1920 + 40, y: s2.y, w: w6 }, s2, jn);
    B.style.visibility = jn > 0 ? "inherit" : "hidden";
    // speaking ring moves between the people. 5D: it rests on the content lead (who holds up the old plan)
    // from 1500 ms before `speak`, then leaves the people for good: the note taker is the speaker
    const tH = joined ? (ev.hand != null ? ev.hand : 2500) : Infinity, tC = ev.chat != null ? ev.chat : tH + 700;
    // `ring` (v2-shots-e's name) = `speak`; `wave` defaults to 1500 ms before it (the person's ring, 1300 ms)
    const spIn = ev.ring != null ? ev.ring : ev.speak, sp = !joined ? Infinity : spIn != null && spIn > tC ? spIn : (ev.wave != null ? ev.wave + 1500 : tH + 5000);
    const tI = ev.wave != null && ev.wave < sp ? ev.wave : sp - 1500;
    const order = [0, 1, 3, 2, 1, 0, 3, 2, 0, 1];
    const k = Math.floor(t / 1500), botOn = t >= sp;
    // 5D: the content lead (with the old plan) speaks up to 1200 ms before the hand; then a pause, nobody speaks;
    // at `invite` the programme lead speaks for 1300 ms (waves it in); from `speak` only the note taker
    const who = !joined ? order[k % order.length] : t < tH - 1200 ? (t >= tH - 3000 ? 1 : order[k % order.length]) : t >= tI && t < tI + 1300 ? 0 : -1;
    if (!joined) P.forEach((p, i) => { p.querySelector(".ring").style.opacity = !botOn && who === i ? 1 : 0; });
    else {
      // 5D: every person's ring eases in and out over 300 ms (v2-shots-f 202645 item 4: the programme lead's ring was on and
      // off in one frame). Spans: the cycle before the content lead, the content lead, then the programme lead (the wave).
      const spans = [];
      const cEnd = tH - 3000;
      for (let j = 0; j * 1500 < cEnd; j++) spans.push([order[j % order.length], j * 1500, Math.min((j + 1) * 1500, cEnd)]);
      spans.push([1, Math.max(0, cEnd), tH - 1200]);
      // ruling 119: 400 ms with no ring on any tile before the note taker's ring (was 200 ms); whole on `invite`
      spans.push([0, tI, Math.min(tI + 1300, sp - 400)]);
      const op = [0, 0, 0, 0];
      spans.forEach(([i, a, b]) => { if (b <= a) return; const f = Math.min(300, (b - a) / 2);
        op[i] = Math.max(op[i], L.tw(t, a, f, "io") * (1 - L.tw(t, b - f, f, "io"))); });
      P.forEach((p, i) => { p.querySelector(".ring").style.opacity = botOn ? 0 : +op[i].toFixed(3); });
    }
    // recording dot
    const rec = B.querySelector(".rec");
    const ru = joined ? 1 : L.clamp01((t - ev.rec) / 300);
    rec.style.opacity = ru; rec.style.transform = ru >= 1 ? "none" : `scale(${L.E.back(ru)})`;

    // ---- the card of lines under the note taker
    const C = root._lines, s5 = slot6(2, 1);
    Object.assign(C.style, { left: s5.x + "px", top: s5.y + "px", width: w6 + "px", height: th + "px" });
    const t0 = joined ? -3000 : ev.lines, cIn = joined ? 1 : L.tw(t, ev.lines - 300, 400, "out");
    C.style.opacity = joined ? 0 : cIn; C.style.visibility = !joined && cIn > 0 ? "inherit" : "hidden";
    const step = 66, every = 420, maxW = w6 - 44 - 48 - 44;
    // 5D: the lines freeze from 500 ms before `speak` to 2400 ms after it, so the speaker and the mark are the
    // only change
    const tl = t;
    const shown = Math.max(0, (tl - t0) / every);              // lines revealed so far (fractional)
    const scroll = Math.max(0, (shown - 6.2) * step);
    root._ln.forEach((o, i) => {
      const y = 46 + i * step - scroll, g = L.clamp01(shown - i);
      o.ln.style.top = y + "px";
      o.ln.style.visibility = g > 0 && y > -40 && y < th + 20 ? "inherit" : "hidden";
      o.b.style.width = maxW * o.wd * L.E.out(g) + "px";
    });

    // ---- 5D: the raised hand, the point in chat, the invitation, then it speaks
    const hand = B.querySelector(".hand"), bring = B.querySelector(".ring"), eq = B.querySelector(".eq"), mut = B.querySelector(".mut");
    if (joined) {
      // opt.handStays (5Dc, v2-shots-f 202645 item 1): the hand stays up to the last frame while the speaker's ring comes on
      const stays = !!opt.handStays, hu = L.clamp01((t - tH) / 450), down = stays ? 0 : L.tw(t, sp, 300, "io");
      hand.style.opacity = t < tH ? 0 : L.clamp01(hu * 2) * (1 - down);
      const wv = L.clamp01((t - tH - 300) / 1200);
      const wave = t < tH ? 0 : Math.sin(wv * Math.PI * 3) * 14 * (1 - wv);
      const sc = t < tH ? 0.4 : L.lerp(0.4, 1, L.E.back(hu));
      hand.style.transform = sc === 1 && Math.abs(wave) < 0.01 ? "none" : `scale(${sc}) rotate(${wave}deg)`;
      const recUp = stays || t < sp; rec.style.left = recUp ? "128px" : "28px"; rec.style.top = recUp ? "56px" : "28px";
      // no edge while the hand is up (the only yellow in 5Dc is the line, VL 15.48); the blue speaker ring once it speaks
      const su = L.clamp01((t - sp) / 450);
      bring.style.boxShadow = "inset 0 0 0 10px #8AB4F8";
      bring.style.opacity = t < sp ? 0 : L.E.out(su);
      if (mut) mut.style.opacity = t < sp ? 1 : 1 - su;
      eq.style.opacity = t < sp ? 0 : su;
      eq.querySelectorAll("b").forEach((b, j) => { const lv = t < sp ? 0.3 : 0.35 + 0.65 * Math.abs(Math.sin((t - sp) / (170 + 40 * j) + j)); b.style.height = Math.round(10 + 22 * lv * (j === 1 ? 1 : 0.75)) + "px"; });
      const av = B.querySelector(".s-av"), hal = t < sp ? 0 : su * (10 + 8 * Math.abs(Math.sin((t - sp) / 260)));
      av.style.boxShadow = hal > 0 ? `0 0 0 ${hal.toFixed(1)}px rgba(138,180,248,.55)` : "";
      // the in-call messages card: there from the start, empty; the point arrives at `chat`
      const s1 = slot6(2, 1);
      Object.assign(H.style, { left: s1.x + "px", top: s1.y + "px", width: w6 + "px", height: th + "px", boxSizing: "border-box", overflow: "hidden" });
      // dark grey (#3C4043, the tiles' own) with its chat mark until `chat`; it turns white as the line arrives (300 ms)
      // v2-shots-f 202645 item 3: an even 300 ms (sine, not io, which read as about 130 ms), ending 100 ms before the line;
      // the chat mark is gone (150 ms) before the card is half white, so it never shows through the line
      const wu = L.tw(t, tC - 400, 300, "sine");
      H.style.position = "absolute";
      H.style.background = wu <= 0 ? "#3C4043" : wu >= 1 ? "#fff" : `rgb(${Math.round(L.lerp(60, 255, wu))},${Math.round(L.lerp(64, 255, wu))},${Math.round(L.lerp(67, 255, wu))})`;
      root._cm.style.opacity = 1 - L.tw(t, tC - 400, 150, "sine");
      // the line slides down out of the tile into the card (24 px, 420 ms) under the yellow field, which stays to the end
      L.arrive(H.querySelector(".msg"), t, tC, { dur: 420, dy: -24, scale: 1 });
      BR.write(root._pt, t, tC, 1); // whole as it slides in
      const pb = t >= tC ? L.boxOf(root, root._pt, 0) : null;
      BR.field(root._fld, pb && { x: pb.x - 14, y: pb.y - 8, w: pb.w + 28, h: pb.h + 14 }, t, tC, null);
      root._cur.style.opacity = 0; root._ring.style.opacity = 0;
      return;
    }
    hand.style.opacity = 0;
    bring.style.opacity = 0; eq.style.opacity = 0;

    // ---- 3A1: People, the Add people dialog, Invite
    M.ppl.className = "gm-btn ppl" + (t >= ev.ppl && t < ev.invite + 300 ? " on" : "");
    const dIn = L.tw(t, ev.ppl + 50, 350, "out"), dOut = L.tw(t, ev.invite + 50, 300, "io"), dA = dIn * (1 - dOut);
    D.style.transform = "none";
    const tPpl = L.boxOf(root, M.ppl), tInv = L.boxOf(root, D.querySelector(".ac"));
    root._scrim.style.opacity = 0.9 * dA;
    D.style.opacity = dA; D.style.visibility = dA > 0 ? "inherit" : "hidden";
    D.style.transform = dA >= 1 ? "none" : `scale(${L.lerp(0.92, 1, dIn)})`;
    const name = "Rumi", n = L.typed(name, t, ev.type, 9, 5);
    D.querySelector(".tx").textContent = name.slice(0, n);
    D.querySelector(".ph").style.display = n > 0 ? "none" : "inline";
    const sug = D.querySelector(".gm-sug"), su = L.clamp01((t - ev.sug) / 300);
    sug.style.opacity = t < ev.sug ? 0 : L.E.out(su);
    sug.style.background = t >= ev.invite - 300 ? "#E8F0FE" : "transparent";

    // ---- the pointer: 1000 ms travels, in-out
    const c = (b) => ({ x: b.x + b.w / 2 + 6, y: b.y + b.h / 2 + 6 });
    const pP = c(tPpl), pI = c(tInv);
    const keys = [{ t: ev.cur, x: 1240, y: 640 }, { t: ev.cur + 1000, ...pP }, { t: ev.invite - 1000, ...pP }, { t: ev.invite - 20, ...pI }];
    L.cursorAt(root._cur, keys, t, [ev.ppl, ev.invite], { show: ev.cur, hide: ev.invite + 700 });
    if (t >= ev.invite) L.ringAt(root._ring, t, ev.invite, pI); else L.ringAt(root._ring, t, ev.ppl, pP);
  },
});
