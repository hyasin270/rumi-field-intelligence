/* film2/screens/_lib/slack.js · v2-screens. Slack, drawn as it looks (light theme, aubergine
   chrome, Lato), at film size: message text 40 px, names 38 px, nothing under 36 px.
   Used by 2A, 2B1, 2B2, 3B2. Roles for people; the agent is Rumi with its mark. */
(function () {
  const L = SCREEN.lib;
  const css = `
.sl{position:absolute;inset:0;font-family:Lato,'Helvetica Neue',sans-serif;color:#1D1C1D;background:#fff}
.sl-top{position:absolute;left:0;right:0;top:0;height:64px;background:#3F0E40;display:flex;align-items:center;justify-content:center}
.sl-search{width:720px;height:44px;border-radius:10px;background:rgba(255,255,255,.18);display:flex;align-items:center;padding:0 16px}
.sl-search svg{width:26px;height:26px;opacity:.8}
.sl-side{position:absolute;left:0;top:0;bottom:0;width:96px;background:#3F0E40;display:flex;flex-direction:column;align-items:center;padding-top:22px;gap:26px}
.sl-wsi{width:64px;height:64px;border-radius:14px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 3px #3F0E40,0 0 0 6px rgba(255,255,255,.85)}
.sl-wsi img{width:76%}
.sl-ri{width:56px;height:56px;border-radius:12px;display:flex;align-items:center;justify-content:center}
.sl-ri.on{background:rgba(255,255,255,.22)}
.sl-ri svg{width:34px;height:34px}
.sl-ws{font-weight:900;font-size:40px;color:#fff;padding:4px 14px 26px}
.sl-ch{font-size:36px;padding:9px 14px;border-radius:10px;white-space:nowrap;overflow:hidden;display:flex;gap:12px;align-items:center}
.sl-ch.on{background:#F9EDFF;color:#39063A;font-weight:700}
.sl-ch .h{opacity:.75}
.sl-main{position:absolute;left:96px;right:0;top:0;bottom:0;background:#fff;display:flex;flex-direction:column}
.sl-head{flex:none;height:110px;border-bottom:2px solid #E8E8E8;display:flex;align-items:center;padding:0 56px;gap:14px;font-weight:900;font-size:44px}
.sl-head .sub{font-weight:400;font-size:36px;color:#616061}
.sl-msgs{flex:1;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding-bottom:12px;-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 90px)}
.sl-item{overflow:hidden;flex:none}
.sl-m{display:flex;gap:28px;padding:18px 56px;position:relative;transform-origin:50% 100%}
.sl-m .b{min-width:0;flex:1}
.sl-n{font-weight:900;font-size:40px}
.sl-app{font-size:26px;font-weight:700;color:#616061;background:#EBEBEB;border-radius:6px;padding:2px 8px;margin-left:10px;vertical-align:6px}
.sl-t{font-size:36px;color:#616061;margin-left:14px}
.sl-x{font-size:44px;line-height:1.36;margin-top:2px;max-width:34ch}
.sl-x.wide{max-width:none}
.sl-at{background:#E8F5FA;color:#1264A3;border-radius:6px;padding:0 4px;font-weight:700}
.sl-at.me{background:#FFF4CC;color:#7A5800}
.sl-dim{opacity:.5}
.sl-unf{margin-top:16px;border-left:8px solid #DDDDDD;padding:8px 0 8px 24px;width:900px;position:relative}
.sl-unf .src{display:flex;align-items:center;gap:12px;font-size:36px;font-weight:700;color:#1D1C1D}
.sl-unf .src .nlogo{width:40px;height:40px}
.sl-unf .ti{font-size:40px;font-weight:900;color:#1264A3;margin-top:6px}
.sl-unf .ds{font-size:36px;color:#454245;margin-top:4px}
.sl-file{margin-top:16px;border:2px solid #DDDDDD;border-radius:14px;padding:18px 24px;width:760px;display:flex;align-items:center;gap:20px}
.sl-file .ic{width:64px;height:64px;border-radius:10px;flex:none;display:flex;align-items:center;justify-content:center}
.sl-file .fn{font-size:38px;font-weight:700}
.sl-file .fs{font-size:36px;color:#616061}
.sl-reply{display:flex;align-items:center;gap:14px;margin-top:10px;font-size:36px;color:#1264A3;font-weight:700}
.sl-reply .s-av{width:52px;height:52px;border-radius:10px}
.sl-comp{flex:none;margin:0 56px 32px;border:2px solid #BBBABB;border-radius:16px;min-height:112px;display:flex;align-items:center;padding:0 24px;gap:20px}
.sl-in{flex:1;font-size:40px;color:#868686;white-space:nowrap;overflow:hidden}
.sl-in.typed{color:#1D1C1D}
.sl-send{flex:none;width:72px;height:60px;border-radius:10px;background:#DDDDDD;display:flex;align-items:center;justify-content:center}
.sl-send.on{background:#007A5A}
.sl-send svg{width:32px;height:32px}
.sl-typing{flex:none;height:52px;font-size:36px;color:#616061;padding:0 56px}
.sl-day{align-self:center;margin:10px 0;font-size:36px;font-weight:700;border:2px solid #E1E1E1;border-radius:40px;padding:6px 26px;background:#fff}
.sl-thread{position:absolute;top:0;bottom:0;right:0;width:1000px;background:#fff;border-left:2px solid #E1E1E1;display:flex;flex-direction:column;box-shadow:-18px 0 40px rgba(0,0,0,.08)}
`;
  if (!document.getElementById("sl-css")) { const s = document.createElement("style"); s.id = "sl-css"; s.textContent = css; document.head.appendChild(s); }

  const SEARCH = `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21" stroke-linecap="round"/></svg>`;
  const SEND = `<svg viewBox="0 0 24 24"><path d="M3 20.5 21.5 12 3 3.5l2.6 7.4L14 12l-8.4 1.1z" fill="#fff"/></svg>`;
  const NOTION = `<svg class="nlogo" viewBox="0 0 100 100"><rect x="8" y="6" width="84" height="88" rx="12" fill="#fff" stroke="#111" stroke-width="7"/><path d="M32 74V30l36 44V30" fill="none" stroke="#111" stroke-width="9" stroke-linejoin="round"/></svg>`;

  const SL = {};
  SL.NOTION = NOTION;
  // o: { channel, channels: [...], workspace, thread: false }
  SL.build = (root, o) => {
    o = o || {};
    const chs = o.channels || ["team-product", "team-lessonplans", "data"];
    const ch = o.channel || chs[0];
    const ICON = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
    const w = L.el("div", "sl", `
      <div class="sl-side"><div class="sl-wsi">${L.mark("")}</div>
        <div class="sl-ri on">${ICON('<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>')}</div>
        <div class="sl-ri">${ICON('<path d="M4 5h16v11H8l-4 4z"/>')}</div>
        <div class="sl-ri">${ICON('<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>')}</div></div>
      <div class="sl-main"><div class="sl-head"># ${ch}</div><div class="sl-msgs"></div>
        <div class="sl-typing"></div>
        <div class="sl-comp"><div class="sl-in">Message #${ch}</div><div class="sl-send">${SEND}</div></div></div>`, root);
    return { w, msgs: w.querySelector(".sl-msgs"), typing: w.querySelector(".sl-typing"), input: w.querySelector(".sl-in"),
      send: w.querySelector(".sl-send"), main: w.querySelector(".sl-main"), placeholder: `Message #${ch}` };
  };
  // A thread pane that slides in from the right. Returns refs like build().
  SL.thread = (root, ch) => {
    const w = L.el("div", "sl-thread", `<div class="sl-head">Thread <span class="sub"># ${ch}</span></div><div class="sl-msgs"></div><div class="sl-typing"></div>`, root.querySelector(".sl") || root);
    return { w, msgs: w.querySelector(".sl-msgs"), typing: w.querySelector(".sl-typing") };
  };
  // Typographic apostrophes (outside tags): you're -> you’re
  SL.curly = (s) => s.replace(/(^|>)([^<]*)/g, (m, a, b) => a + b.replace(/'/g, "\u2019"));
  // Mentions: @Rumi, @Product manager ... in text become pills.
  SL.at = (s) => s.replace(/@(Rumi|Product manager|Assessment specialist|Programme lead|Content lead|Field coach lead|Lesson plans lead|Designer|Data lead|Engineer)/g, '<span class="sl-at">@$1</span>');
  // A message. m: { who, time, text (html allowed), extra (html below the text), app }
  SL.msg = (list, m) => {
    const item = L.el("div", "sl-item", null, list);
    const inner = L.el("div", "sl-m", `${L.avatar(m.who)}<div class="b"><div><span class="sl-n">${m.who}</span><span class="sl-t">${m.time || ""}</span></div>
      <div class="sl-x ${m.wide ? "wide" : ""}">${SL.at(SL.curly(m.text || ""))}</div>${m.extra || ""}</div>`, item);
    return { item, inner, x: inner.querySelector(".sl-x") };
  };
  // Grow a message into the list at t0 (the others are pushed up smoothly). Before t0: height 0.
  SL.grow = (it, t, t0, dur) => {
    dur = dur || 420;
    const h = it.inner.offsetHeight;
    const u = L.E.out(L.clamp01((t - t0) / dur));
    it.item.style.height = (t < t0 ? 0 : h * u) + "px";
    L.arrive(it.inner, t, t0 + dur * 0.25, { dur: dur, dy: 30 });
  };
  // Earlier messages, greyed, so the channel is never an empty half (they scroll off as new ones land).
  SL.earlier = (S, list) => list.map((m) => { const it = SL.msg(S.msgs, m); it.inner.classList.add("sl-dim"); return it; });
  SL.show = (it, on) => { it.item.style.height = on ? "auto" : "0px"; it.inner.style.opacity = on ? 1 : 0; it.inner.style.transform = "none"; };
  // Type into the composer between t0 and the send time; returns the time typing ends.
  SL.typeInto = (S, text, t, t0, tSend, cps) => {
    text = SL.curly(text);
    const n = L.typed(text, t, t0, cps || 15, 3);
    const end = t0 + L.typeDur(text, cps || 15, 3);
    if (t < t0 || t >= tSend) { S.input.className = "sl-in"; S.input.innerHTML = S.placeholder; S.send.className = "sl-send"; }
    else { S.input.className = "sl-in typed"; S.input.innerHTML = SL.at(text.slice(0, n)).replace(/<span class="sl-at">(@[^<]*)$/, '<span class="sl-at">$1</span>') + '<span class="s-caret"></span>'; S.send.className = n > 0 ? "sl-send on" : "sl-send"; }
    return end;
  };
  SL.typingLine = (el, who, t, t0, t1) => { el.textContent = t >= t0 && t < t1 ? `${who} is typing…` : ""; };
  SL.unfurl = (title, sub) => `<div class="sl-unf"><div class="src">${NOTION}Notion</div><div class="ti">${title}</div><div class="ds">${sub}</div></div>`;
  SL.file = (name, sub, kind) => {
    const col = { doc: "#4285F4", sheet: "#0F9D58", slides: "#F4B400" }[kind || "doc"];
    return `<div class="sl-file"><div class="ic" style="background:${col}"><svg viewBox="0 0 24 24" width="36" height="36"><path d="M6 3h8l4 4v14H6z" fill="#fff"/></svg></div><div><div class="fn">${name}</div><div class="fs">${sub}</div></div></div>`;
  };
  window.SL = SL;
})();
