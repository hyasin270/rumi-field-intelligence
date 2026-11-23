/* film2/screens/_lib/phone.js · v2-screens (phone/lender builder), 2026-11-11.
   WhatsApp, drawn as it looks (light theme, Roboto): green header, beige doodle chat, white
   incoming and light-green outgoing bubbles with tails, voice notes with a play button, a
   waveform, a knob and a duration, and grey/blue ticks. Two frames:
     PH.phone(root, {x, y, w, h, fs, name, who, sub})   an upright phone (device bezel)
     PH.window(root, {fs, name, who, sub, label})        a full-frame chat (for insets)
   Every size inside the chat is in em of --fs, so the same bubbles serve the phone (fs ~42)
   and the large insets (fs ~68). Nothing under 36 px: timestamps are dropped, ticks kept.
   Roles for people; the agent is Rumi with its mark. Used by coach-phone and lender-*. */
(function () {
  const L = SCREEN.lib;
  const DOODLE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260' viewBox='0 0 120 120' fill='none' stroke='%23000' stroke-opacity='.045' stroke-width='1.5' stroke-linecap='round'><circle cx='18' cy='20' r='7'/><path d='M60 12l6 10h-12z'/><rect x='92' y='14' width='14' height='10' rx='3'/><path d='M14 70c6-6 12 6 18 0'/><circle cx='70' cy='64' r='3'/><path d='M96 60l8 8M104 60l-8 8'/><path d='M30 102h14M37 95v14'/><rect x='70' y='96' width='10' height='14' rx='2'/><path d='M100 100c4-6 10-2 8 4'/></svg>")`;
  const css = `
.wa{font-family:Roboto,'Helvetica Neue',Arial,sans-serif;color:#111B21;--fs:42px;font-size:var(--fs)}
.wa-dev{position:absolute;background:#16181B;border-radius:78px;padding:18px;box-shadow:0 30px 70px rgba(0,0,0,.22),0 0 0 3px #2A2D31 inset}
.wa-scr{position:relative;width:100%;height:100%;border-radius:62px;overflow:hidden;display:flex;flex-direction:column;background:#EFEAE2}
.wa-win{position:absolute;inset:0;display:flex;flex-direction:column;background:#EFEAE2}
.wa-sb{flex:none;height:58px;background:#008069;display:flex;align-items:center;justify-content:flex-end;padding:0 46px;gap:14px;position:relative}
.wa-sb .cam{position:absolute;left:50%;top:14px;width:28px;height:28px;margin-left:-14px;border-radius:50%;background:#0B0C0E}
.wa-sb svg{height:26px;width:auto;display:block}
.wa-hd{flex:none;background:#008069;color:#fff;display:flex;align-items:center;gap:.4em;padding:.28em .5em .32em .3em}
.wa-hd .bk{width:1em;height:1em;flex:none}
.wa-hd .dp{width:2.1em;height:2.1em;border-radius:50%;flex:none;overflow:hidden;background:#fff;display:flex;align-items:center;justify-content:center}
.wa-hd .dp img{width:74%;height:auto}
.wa-hd .dp.ini{color:#fff;font-weight:700;font-size:1em}
.wa-hd .nm{flex:1;min-width:0;line-height:1.15}
.wa-hd .nm b{display:block;font-weight:500;font-size:1.08em;white-space:nowrap}
.wa-hd .nm span{display:block;font-size:max(36px,.72em);opacity:.88;white-space:nowrap}
.wa-hd .ic{display:flex;gap:.7em;align-items:center}
.wa-hd .ic svg{width:1.05em;height:1.05em;display:block}
.wa-hd .lab{flex:none;font:600 40px/1 'Poppins',sans-serif;color:#fff;border:3px solid rgba(255,255,255,.85);border-radius:999px;padding:14px 30px;letter-spacing:.01em}
.wa-chat{flex:1;min-height:0;position:relative;display:flex;flex-direction:column;justify-content:flex-end;padding:.3em .55em .35em;overflow:hidden;
  background-color:#EFEAE2;background-image:${DOODLE}}
.wa-comp{flex:none;display:flex;align-items:center;gap:.25em;padding:.18em .3em .42em;background:transparent}
.wa-in{flex:1;height:2.2em;border-radius:1.1em;background:#fff;display:flex;align-items:center;padding:0 .55em;gap:.4em;font-size:max(36px,.86em);color:#8696A0;white-space:nowrap;overflow:hidden;box-shadow:0 1px 1px rgba(0,0,0,.08)}
.wa-in .rd{width:.6em;height:.6em;border-radius:50%;background:#EA0038;flex:none}
.wa-in .rt{color:#111B21}
.wa-mic{flex:none;width:2.3em;height:2.3em;border-radius:50%;background:#00A884;display:flex;align-items:center;justify-content:center;transform-origin:50% 50%}
.wa-mic svg{width:1.1em;height:1.1em}
.wa-pill{align-self:center;background:#fff;color:#54656F;font-size:max(36px,.8em);padding:.18em .6em;border-radius:.4em;box-shadow:0 1px 1px rgba(0,0,0,.08);margin:.2em 0 .3em}
.wa-item{flex:none;overflow:visible;display:flex;flex-direction:column}
.wa-row{display:flex;flex-direction:column;max-width:86%;margin-top:.28em;transform-origin:0 100%}
.wa-row.in{align-self:flex-start}.wa-row.out{align-self:flex-end;transform-origin:100% 100%}
.wa-b{position:relative;border-radius:.32em;padding:.24em .36em .22em .42em;box-shadow:0 1px 1.5px rgba(11,20,26,.13);line-height:1.3}
.in .wa-b{background:#fff;border-top-left-radius:0}.out .wa-b{background:#D9FDD3;border-top-right-radius:0}
.in .wa-b::before{content:"";position:absolute;top:0;left:-.3em;width:.32em;height:.5em;background:#fff;clip-path:polygon(0 0,100% 0,100% 100%)}
.out .wa-b::before{content:"";position:absolute;top:0;right:-.3em;width:.32em;height:.5em;background:#D9FDD3;clip-path:polygon(0 0,100% 0,0 100%)}
.wa-tx{white-space:normal}
.wa-meta{display:flex;align-items:center;justify-content:flex-end;gap:.2em;font-size:max(36px,.62em);color:#667781;line-height:1;margin-top:.1em}
.wa-tk{display:inline-flex;align-items:center}
.wa-tk svg{height:.95em;width:auto;display:block}
.wa-vn{display:flex;align-items:center;gap:.38em;padding:.12em 0 0}
.wa-vn .av{position:relative;width:2.1em;height:2.1em;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;overflow:visible}
.wa-vn .av .face{width:100%;height:100%;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#fff;box-shadow:inset 0 0 0 2px #E2E5E7}
.wa-vn .av img{width:72%;height:auto}
.wa-vn .av .mb{position:absolute;right:-.12em;bottom:-.04em;width:.8em;height:.8em}
.wa-vn .pl{width:1.05em;height:1.2em;flex:none;color:#54656F}
.wa-vn .pl svg{width:100%;height:100%;display:block}
.wa-vn .col{flex:1;min-width:0;display:flex;flex-direction:column}
.wa-wv{position:relative;height:1.3em;display:flex;align-items:center;justify-content:space-between;gap:.08em}
.wa-wv i{display:block;flex:1 1 0;min-width:0;max-width:.16em;border-radius:.05em;background:#AEB7BC}
.wa-wv .kn{position:absolute;top:50%;width:.42em;height:.42em;margin:-.21em 0 0 -.21em;border-radius:50%;background:#00A884}
.wa-vn .du{display:flex;justify-content:space-between;align-items:center;font-size:max(36px,.62em);color:#667781;line-height:1;margin-top:.12em}
.wa-tr{overflow:hidden}
.wa-tr .in2{padding:.3em .05em .05em;border-top:2px solid rgba(0,0,0,.08);margin-top:.25em}
.wa-tr .cap{font-size:max(36px,.6em);color:#667781;margin-bottom:.08em}
.wa-card{min-width:0}
.wa-btn{background:#fff;border-radius:.32em;box-shadow:0 1px 1.5px rgba(11,20,26,.13);height:1.9em;display:flex;align-items:center;justify-content:center;gap:.35em;color:#008069;font-weight:500;position:relative}
.wa-btn svg{width:.9em;height:.9em}

/* card parts for the lender insets (sizes in em of --fs) */
.wa-ct{display:flex;align-items:center;gap:.35em;font-weight:700;padding:.1em .1em .25em;border-bottom:2px solid #E9EDEF}
.wa-ct svg{width:1em;height:1em;flex:none}
.wa-cr{display:flex;align-items:center;gap:.4em;padding:.28em .1em;border-bottom:2px solid #F0F2F5}
.wa-cr:last-child{border-bottom:0}
.wa-cr .ci{width:1.25em;height:1.25em;border-radius:50%;background:#E7F7F1;display:flex;align-items:center;justify-content:center;flex:none}
.wa-cr .ci svg{width:.72em;height:.72em}
.wa-cr .ct{flex:1;white-space:nowrap}
.wa-ok{width:1.05em;height:1.05em;flex:none}
`;
  if (!document.getElementById("wa-css")) { const s = document.createElement("style"); s.id = "wa-css"; s.textContent = css; document.head.appendChild(s); }

  const IC = {
    back: `<svg class="bk" viewBox="0 0 24 24"><path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z" fill="#fff"/></svg>`,
    video: `<svg viewBox="0 0 24 24"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11z" fill="#fff"/></svg>`,
    call: `<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="#fff"/></svg>`,
    mic: `<svg viewBox="0 0 24 24"><path d="M12 15a3.5 3.5 0 0 0 3.5-3.5v-6a3.5 3.5 0 0 0-7 0v6A3.5 3.5 0 0 0 12 15zm6-3.5a6 6 0 0 1-5 5.9V21h-2v-3.6a6 6 0 0 1-5-5.9h2a4 4 0 0 0 8 0z" fill="#fff"/></svg>`,
    micBadge: `<svg class="mb" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#00A884"/><path d="M12 14.4a2.4 2.4 0 0 0 2.4-2.4V7.4a2.4 2.4 0 0 0-4.8 0V12a2.4 2.4 0 0 0 2.4 2.4zm4-2.4a4 4 0 0 1-3.3 3.9V18h-1.4v-2.1A4 4 0 0 1 8 12h1.3a2.7 2.7 0 0 0 5.4 0z" fill="#fff"/></svg>`,
    play: `<svg viewBox="0 0 20 24"><path d="M2 1.5v21L19 12z" fill="currentColor"/></svg>`,
    pause: `<svg viewBox="0 0 20 24"><rect x="2" y="2" width="5.5" height="20" rx="1.2" fill="currentColor"/><rect x="12.5" y="2" width="5.5" height="20" rx="1.2" fill="currentColor"/></svg>`,
    person: `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#DFE5E7"/><circle cx="50" cy="38" r="19" fill="#fff"/><path d="M14 96c4-22 18-32 36-32s32 10 36 32z" fill="#fff"/></svg>`,
    signal: `<svg viewBox="0 0 34 24"><path d="M2 22h5v-6H2zm8 0h5V11h-5zm8 0h5V6h-5zm8 0h5V1h-5z" fill="#fff"/></svg>`,
    battery: `<svg viewBox="0 0 48 24"><rect x="1.5" y="3" width="40" height="18" rx="4" fill="none" stroke="#fff" stroke-width="2.5"/><rect x="5" y="6.5" width="28" height="11" rx="2" fill="#fff"/><rect x="43.5" y="9" width="3" height="6" rx="1" fill="#fff"/></svg>`,
  };
  // ticks: 0 none, 1 sent (one grey), 2 delivered (two grey), 3 read (two blue)
  const TK = (n) => n <= 0 ? "" : n === 1
    ? `<svg viewBox="0 0 16 15"><path d="M1.5 8.2 5.3 12 14.5 2.8" fill="none" stroke="#8696A0" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    : `<svg viewBox="0 0 22 15"><path d="M1.5 8.2 5.3 12 14.5 2.8M9.3 12 18.5 2.8M7.2 9.9" fill="none" stroke="${n >= 3 ? "#53BDEB" : "#8696A0"}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // header avatar: "Rumi" = the mark on white; "person" = WhatsApp's grey default; a role = initials
  const dp = (who) => who === "Rumi" ? `<div class="dp">${L.mark("")}</div>`
    : who === "person" || !who ? `<div class="dp">${IC.person}</div>`
    : `<div class="dp ini" style="background:${(L.ROLE[who] || ["", "#54656F"])[1]}">${(L.ROLE[who] || ["?"])[0]}</div>`;
  const face = (who) => who === "Rumi" ? `<div class="face">${L.mark("")}</div>` : `<div class="face">${IC.person}</div>`;

  // a green tick in a circle, and small line icons for card rows (stroke = currentColor)
  IC.ok = `<svg class="wa-ok" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#00A884"/><path d="M14 24.5l7 7 13-14" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const sv = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="#008069" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  IC.tractor = sv(`<circle cx="7" cy="16" r="4"/><circle cx="18" cy="17.5" r="2.5"/><path d="M3.5 12V6h6l2 6h7.5v3"/><path d="M14 12V8h3"/>`);
  IC.cal = sv(`<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>`);
  IC.wheat = sv(`<path d="M12 21V8"/><path d="M12 12c-3 0-4.5-2-4.5-4.5C10.5 7.5 12 9.5 12 12zM12 12c3 0 4.5-2 4.5-4.5-3 0-4.5 2-4.5 4.5zM12 16.5c-3 0-4.5-2-4.5-4.5 3 0 4.5 2 4.5 4.5zM12 16.5c3 0 4.5-2 4.5-4.5-3 0-4.5 2-4.5 4.5zM12 7.5C10.5 6 11 4 12 3c1 1 1.5 3 0 4.5z"/>`);
  IC.coin = sv(`<circle cx="12" cy="12" r="8.5"/><path d="M9 9.5c0-1.2 1.3-2 3-2s3 .8 3 2-1.3 1.8-3 2.3-3 1-3 2.3 1.3 2 3 2 3-.8 3-2M12 6v1.5M12 16.5V18"/>`);
  IC.photo = sv(`<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8"/>`);
  IC.book = sv(`<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>`);
  IC.pen = sv(`<path d="M4 20l1-4.5L16 4.5l3.5 3.5L8.5 19z"/><path d="M14 7l3.5 3.5"/>`);
  IC.doc = sv(`<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h5"/>`);
  IC.lock = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;
  const PH = { IC, TK };
  // compact header (insets): the avatar, the name and the chip only, at its own size (o.hfs px)
  const headC = (o) => `<div class="wa-hd" style="font-size:${o.hfs || 76}px;padding:.3em .6em">${dp(o.who)}<div class="nm"><b>${o.name || "Rumi"}</b></div>
    ${o.label ? `<div class="lab" style="font-size:${o.lfs || 64}px;border-width:4px;padding:.25em .6em">${o.label}</div>` : ""}</div>`;
  const head = (o) => o.compact ? headC(o) : `<div class="wa-hd">${IC.back}${dp(o.who)}<div class="nm"><b>${o.name || "Rumi"}</b><span class="sub">${o.sub == null ? "online" : o.sub}</span></div>
    ${o.label ? `<div class="lab">${o.label}</div>` : `<div class="ic">${IC.video}${IC.call}</div>`}</div>`;
  const comp = () => `<div class="wa-comp"><div class="wa-in"><span class="ph">Message</span></div><div class="wa-mic">${IC.mic}</div></div>`;
  const refs = (w) => ({ w, chat: w.querySelector(".wa-chat"), sub: w.querySelector(".wa-hd .sub"), input: w.querySelector(".wa-in"), mic: w.querySelector(".wa-mic") });

  // An upright phone. Returns { dev, w (screen), chat, sub, input, mic }.
  PH.phone = (root, o) => {
    o = o || {};
    const dev = L.el("div", "wa wa-dev", null, root);
    Object.assign(dev.style, { left: o.x + "px", top: o.y + "px", width: o.w + "px", height: o.h + "px", "--fs": (o.fs || 42) + "px" });
    const w = L.el("div", "wa-scr", `<div class="wa-sb"><div class="cam"></div>${IC.signal}${IC.battery}</div>${head(o)}<div class="wa-chat"></div>${o.composer === false ? "" : comp()}`, dev);
    return Object.assign(refs(w), { dev });
  };
  // A full-frame chat window (the large insets). Returns { w, chat, sub, input, mic }.
  PH.window = (root, o) => {
    o = o || {};
    const w = L.el("div", "wa wa-win", `${head(o)}<div class="wa-chat"></div>${o.composer ? comp() : ""}`, root);
    w.style.setProperty("--fs", (o.fs || 68) + "px");
    return refs(w);
  };
  PH.pill = (chat, text) => L.el("div", "wa-pill", text, chat);

  const item = (chat, side, inner) => {
    const it = L.el("div", "wa-item", null, chat);
    const row = L.el("div", "wa-row " + (side || "in"), `<div class="wa-b">${inner}</div>`, it);
    return { item: it, inner: row, b: row.querySelector(".wa-b"), tk: row.querySelector(".wa-tk") };
  };
  // A text bubble. o: { side, html, ticks (bool: outgoing meta), meta (extra meta text) }
  PH.text = (chat, o) => item(chat, o.side, `<div class="wa-tx">${o.html}</div>${o.ticks || o.meta ? `<div class="wa-meta">${o.meta || ""}<span class="wa-tk"></span></div>` : ""}`);
  // A card bubble: any html inside a bubble (max width overridable).
  PH.card = (chat, o) => { const it = item(chat, o.side, `<div class="wa-card">${o.html}</div>`); if (o.width) it.inner.style.maxWidth = "none", it.b.style.width = o.width + "px"; return it; };
  // A voice note. o: { side, who ("Rumi" | "person"), dur ("1:52"), bars (count), seed, meta, transcript, transcriptCap, width }
  PH.voice = (chat, o) => {
    const n = o.bars || 30, seed = o.seed || 5;
    let bars = "";
    for (let i = 0; i < n; i++) {
      const env = 0.35 + 0.65 * Math.sin(Math.PI * (i + 0.5) / n) ** 0.6;
      const h = 0.18 + 0.82 * env * (0.3 + 0.7 * L.noise(i, seed));
      bars += `<i style="height:${(h * 1.25).toFixed(3)}em"></i>`;
    }
    const av = `<div class="av">${face(o.who)}${IC.micBadge}</div>`;
    const core = `<div class="wa-vn">${o.side === "out" ? "" : av}<div class="pl">${IC.play}</div><div class="col"><div class="wa-wv">${bars}<div class="kn"></div></div>
      <div class="du"><span class="d">${o.dur || "0:00"}</span><span class="wa-meta" style="margin:0">${o.meta || ""}<span class="wa-tk"></span></span></div></div>${o.side === "out" ? av : ""}</div>
      ${o.transcript ? `<div class="wa-tr"><div class="in2">${o.transcriptCap ? `<div class="cap">${o.transcriptCap}</div>` : ""}<div class="wa-tx">${o.transcript}</div></div></div>` : ""}`;
    const it = item(chat, o.side, core);
    if (o.width) it.b.style.width = o.width + "px", it.inner.style.maxWidth = "none";
    it.bars = [...it.b.querySelectorAll(".wa-wv i")];
    it.knob = it.b.querySelector(".kn"); it.wv = it.b.querySelector(".wa-wv");
    if (!o.width) it.wv.style.minWidth = (n * 0.25) + "em";   // flex bars would collapse in a bubble with no set width
    it.pl = it.b.querySelector(".pl");
    it.tr = it.b.querySelector(".wa-tr"); it.side = o.side || "in";
    return it;
  };
  // Playback at t: bars fill and the knob travels between t0 and t0+dur; the play icon becomes pause while playing.
  PH.play = (it, t, t0, dur) => {
    const u = L.clamp01((t - t0) / dur), playing = t >= t0 && t < t0 + dur;
    const n = it.bars.length, k = u * n;
    const on = it.side === "out" ? "#1E7A5E" : "#00A884", off = it.side === "out" ? "#94B79A" : "#AEB7BC";
    it.bars.forEach((b, i) => { b.style.background = i < k ? on : off; });
    const W = it.wv.offsetWidth;
    it.knob.style.left = (u * W) + "px";
    it.knob.style.background = it.side === "out" ? "#1E7A5E" : "#00A884";
    const want = playing ? "pause" : "play";
    if (it.pl.dataset.s !== want) { it.pl.innerHTML = IC[want]; it.pl.dataset.s = want; }
  };
  // Open the transcript under a voice note between t0 and t0+dur (height grows, text fades in).
  PH.transcript = (it, t, t0, dur) => {
    if (!it.tr) return;
    const h = it.tr.firstElementChild.offsetHeight, u = L.E.out(L.clamp01((t - t0) / (dur || 500)));
    it.tr.style.height = (t < t0 ? 0 : h * u) + "px";
    it.tr.firstElementChild.style.opacity = L.clamp01((t - t0 - (dur || 500) * 0.3) / ((dur || 500) * 0.7));
  };
  PH.ticks = (it, n) => { const el = it.tk || it.b.querySelector(".wa-tk"); if (!el) return; if (el.dataset.n !== String(n)) { el.innerHTML = TK(n); el.dataset.n = String(n); } };
  // Grow a bubble into the chat at t0 (others pushed up smoothly). Before t0: height 0.
  PH.grow = (it, t, t0, dur) => {
    dur = dur || 420;   // VISUAL_LANGUAGE_v2 9: bubbles arrive in 420 ms, one at a time
    const h = it.inner.offsetHeight + (parseFloat(getComputedStyle(it.inner).marginTop) || 0);
    const u = L.E.out(L.clamp01((t - t0) / dur));
    it.item.style.height = (t < t0 ? 0 : h * u) + "px";
    L.arrive(it.inner, t, t0 + dur * 0.25, { dur, dy: 24, scale: 0.96 });
  };
  PH.show = (it, on) => { it.item.style.height = on ? "auto" : "0px"; it.inner.style.opacity = on ? 1 : 0; it.inner.style.transform = "none"; };
  // Composer: idle ("Message") or recording (red dot and a running time); the mic swells while held.
  PH.recording = (S, on, text, t) => {
    const want = on ? "rec" : "idle";
    if (S.input.dataset.s !== want + (text || "")) {
      S.input.innerHTML = on ? `<span class="rd"></span><span class="rt">${text}</span>` : `<span class="ph">Message</span>`;
      S.input.dataset.s = want + (text || "");
    }
    if (on) { const rd = S.input.querySelector(".rd"); rd.style.opacity = 0.45 + 0.55 * (0.5 + 0.5 * Math.cos(t / 160)); }
    S.mic.style.transform = `scale(${on ? 1.18 : 1})`;
  };
  // The "Design mockup" tag for insets that are not in a window header (36 px or more).
  PH.mockTag = (root, x, y) => { const e = L.el("div", "abs s-tag", "How it could work", root); Object.assign(e.style, { left: x + "px", top: y + "px" }); return e; };
  window.PH = PH;
})();
