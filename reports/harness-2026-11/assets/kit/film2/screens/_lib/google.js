/* film2/screens/_lib/google.js · v2-screens (google_meet sub-builder), 2026-11-11.
   Google Workspace drawn as it looks, at film size (Roboto, nothing under 36 px):
   Drive and Gmail (light: #F8FAFD page, white rounded card, pill search) and Google Meet
   (dark call stage #202124, light panels and toasts). Used by drive-email (2C) and
   call-notetaker (3A1, 5D). Roles for people; the agent is Rumi with its mark. */
(function () {
  const L = SCREEN.lib;
  const css = `
.gm-lines{position:absolute;background:#fff;border-radius:24px;overflow:hidden}
.gm-lines .ln{position:absolute;left:44px;height:30px;display:flex;align-items:center;gap:22px}
.gm-lines .ln i{flex:none;width:30px;height:30px;border-radius:50%}
.gm-lines .ln b{display:block;height:24px;border-radius:12px;background:#D2D5D9}
.gm-lines .fade{position:absolute;left:0;right:0;height:90px;pointer-events:none}
.g-th2{position:absolute;inset:0;background:#fff;padding:40px 60px 0 60px}
.g-th2 .sj{font-size:56px;color:#1F1F1F;margin:20px 0 50px}
.g-th2 .hd{display:flex;align-items:center;gap:26px}
.g-th2 .hd .s-av{width:96px;height:96px;border-radius:50%}
.g-th2 .fr{font-size:42px;font-weight:700;color:#1F1F1F}
.g-th2 .to{font-size:36px;color:#5E5E5E;margin-top:6px}
.g-th2 .bd{font-size:52px;line-height:1.4;color:#1F1F1F;margin:56px 0 0 122px;max-width:1200px}
.g-th2 .att{margin:44px 0 0 122px;display:inline-flex;align-items:center;gap:22px;height:110px;border:2px solid #C7C7C7;border-radius:20px;padding:0 40px 0 28px;font-size:40px;font-weight:500;color:#1F1F1F}
.g-th2 .att svg{width:64px;height:64px}
.g-th2 .acts{display:flex;gap:26px;margin:70px 0 0 122px}
.g-th2 .acts span{display:flex;align-items:center;gap:16px;height:96px;padding:0 44px 0 34px;border:2px solid #747775;border-radius:48px;font-size:38px;font-weight:500;color:#444746}
.g-th2 .acts svg{width:40px;height:40px}
.g-drop{position:absolute;background:#fff;border-radius:28px;box-shadow:0 10px 50px rgba(0,0,0,.14),0 0 0 2px rgba(0,0,0,.06);display:flex;align-items:center;justify-content:center;gap:40px;font-family:Inter,sans-serif;font-weight:700;color:#191919;white-space:nowrap;transform-origin:0 0;overflow:hidden}
.g-drop svg{flex:none}
.gw{position:absolute;left:0;top:0;width:1920px;height:1080px;background:#F8FAFD;font-family:Roboto,Arial,sans-serif;color:#1F1F1F;overflow:hidden;transform-origin:50% 50%}
.g-top{position:absolute;left:0;right:0;top:0;height:124px;display:flex;align-items:center;padding:0 40px 0 30px;gap:22px}
.g-top .hb{width:60px;height:60px;display:flex;align-items:center;justify-content:center}
.g-brand{display:flex;align-items:center;gap:18px;width:330px;font-size:44px;color:#444746}
.g-brand svg{width:66px;height:60px}
.g-q{width:900px;height:84px;border-radius:42px;background:#E9EEF6;display:flex;align-items:center;gap:22px;padding:0 30px;font-size:36px;color:#444746}
.g-q svg{width:40px;height:40px}
.g-me{margin-left:auto;width:84px;height:84px;border-radius:50%;font-size:36px}
.g-nav{position:absolute;left:0;top:124px;width:400px;bottom:0;padding:6px 0 0 18px;font-size:38px;color:#1F1F1F}
.g-new{display:inline-flex;align-items:center;gap:20px;height:104px;padding:0 44px 0 30px;border-radius:30px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.18);font-weight:500;font-size:38px;margin:4px 0 26px}
.g-new.cmp{background:#C2E7FF;box-shadow:none;color:#001D35}
.g-new svg{width:44px;height:44px}
.g-it{height:80px;white-space:nowrap;display:flex;align-items:center;gap:28px;padding:0 26px;border-radius:40px;margin-right:22px}
.g-it svg{width:40px;height:40px;flex:none}
.g-it.on{background:#D3E3FD;font-weight:700;color:#041E49}
.g-card{position:absolute;left:400px;top:124px;right:28px;bottom:28px;background:#fff;border-radius:30px;overflow:hidden}
.g-h{height:118px;display:flex;align-items:center;gap:12px;padding:0 48px;font-size:48px;color:#1F1F1F}
.g-h svg{width:44px;height:44px}
.g-th{height:84px;display:flex;align-items:center;border-bottom:2px solid #C7C7C7;font-size:36px;font-weight:500;color:#1F1F1F;padding:0 48px}
.g-row{overflow:hidden;flex:none}
.g-ri{display:flex;align-items:center;height:116px;border-bottom:2px solid #E3E3E3;padding:0 48px;font-size:38px;color:#444746;position:relative}
.g-c1{flex:1;min-width:0;display:flex;align-items:center;gap:30px;color:#1F1F1F;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:40px}
.g-c1 svg{width:58px;height:58px;flex:none}
.g-c2{width:520px;display:flex;align-items:center;gap:20px;white-space:nowrap}
.g-c2 .s-av{width:76px;height:76px;border-radius:50%;font-size:36px}
.g-c3{width:300px;white-space:nowrap}
.g-c2 .s-av-rumi,.g-mrow .s-av-rumi,.gm .s-av-rumi{border-radius:50%}
/* gmail list */
.g-tb{height:100px;display:flex;align-items:center;gap:44px;padding:0 40px;border-bottom:2px solid #EEF0F2}
.g-tb svg{width:40px;height:40px}
.g-mrow{display:flex;align-items:flex-start;gap:26px;padding:30px 40px 28px;border-bottom:2px solid #E8EAED;background:#F2F6FC;font-size:38px;color:#444746;position:relative}
.g-mrow.unread{background:#fff;color:#1F1F1F;flex-wrap:wrap;row-gap:0}
.g-mrow>svg{width:40px;height:40px;flex:none;margin-top:2px}
.g-mrow .fr{width:400px;flex:none;display:flex;align-items:center;gap:18px;white-space:nowrap;overflow:hidden}
.g-mrow .fr .s-av{width:72px;height:72px;border-radius:50%;font-size:36px;margin:-14px 0}
.g-mrow .sb{flex:1;min-width:0}
.g-mrow .sl1{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.g-mrow.unread .fr,.g-mrow.unread .sj{font-weight:700}
.g-mrow .sn{color:#5E5E5E}
.g-chips{flex-basis:100%;display:flex;gap:16px;margin-top:20px;padding-left:132px}
.g-chip{display:flex;align-items:center;gap:14px;height:72px;border:2px solid #C7C7C7;border-radius:36px;padding:0 22px 0 16px;font-size:36px;color:#1F1F1F;white-space:nowrap;overflow:hidden}
.g-chip svg{width:44px;height:44px;flex:none}
.g-chip span{overflow:hidden;text-overflow:ellipsis}
/* google meet */
.gm{position:absolute;left:0;top:0;width:1920px;height:1080px;background:#202124;font-family:Roboto,Arial,sans-serif;color:#E8EAED;overflow:hidden;transform-origin:50% 50%}
.gm-tile{position:absolute;background:#3C4043;border-radius:24px;overflow:hidden}
.gm-tile .s-av{position:absolute;left:50%;top:50%;width:200px;height:200px;margin:-118px 0 0 -100px;border-radius:50%;font-size:76px}
.gm-tile .s-av-mark{width:68%}
.gm-tile .nm{position:absolute;left:30px;bottom:24px;font-size:40px;font-weight:500;color:#fff;display:flex;align-items:center;gap:16px;white-space:nowrap}
.gm-tile.bot{background:#E9E7E2}
.gm-tile.bot .nm{color:#202124}
.gm-tile .ring{position:absolute;inset:0;border-radius:24px;box-shadow:inset 0 0 0 6px #8AB4F8;opacity:0}
.gm-tile .rec{position:absolute;left:28px;top:28px;width:26px;height:26px;border-radius:50%;background:#EA4335;box-shadow:0 0 0 8px rgba(234,67,53,.22);opacity:0}
.gm-tile .hand{position:absolute;left:24px;top:24px;width:88px;height:88px;border-radius:50%;background:#F8E3A0;display:flex;align-items:center;justify-content:center;opacity:0}
.gm-tile .hand svg{width:56px;height:56px}
.gm-tile .mut{position:absolute;right:26px;top:26px;width:64px;height:64px;border-radius:50%;background:rgba(32,33,36,.55);display:flex;align-items:center;justify-content:center}
.gm-tile .mut svg{width:36px;height:36px}
.gm-bar{position:absolute;left:0;right:0;bottom:0;height:150px;display:flex;align-items:center;padding:0 44px}
.gm-bar .l{width:520px;font-size:38px;font-weight:500;color:#E8EAED;white-space:nowrap}
.gm-bar .mid{flex:1;display:flex;justify-content:center;gap:20px}
.gm-btn{width:92px;height:92px;border-radius:50%;background:#3C4043;display:flex;align-items:center;justify-content:center;flex:none}
.gm-btn svg{width:44px;height:44px}
.gm-btn.end{width:136px;border-radius:46px;background:#EA4335}
.gm-bar .r{width:520px;display:flex;justify-content:flex-end;gap:20px}
.gm-bar .r .gm-btn{background:transparent}
.gm-bar .r .gm-btn.on{background:#394457}
.gm-panel{position:absolute;top:28px;right:28px;bottom:150px;width:700px;background:#fff;border-radius:28px;color:#202124;padding:36px 40px;overflow:hidden}
.gm-panel h3{font-size:44px;font-weight:400;margin-bottom:30px}
.gm-add{display:inline-flex;align-items:center;gap:18px;height:88px;padding:0 40px 0 30px;border-radius:44px;background:#C2E7FF;color:#001D35;font-size:38px;font-weight:500}
.gm-add svg{width:44px;height:44px}
.gm-sec{font-size:36px;font-weight:500;color:#5F6368;margin:40px 0 12px}
.gm-p{display:flex;align-items:center;gap:24px;height:100px;font-size:38px;white-space:nowrap;overflow:hidden}
.gm-p .s-av{width:80px;height:80px;border-radius:50%;font-size:36px}
.gm-p .ac{margin-left:auto;color:#0B57D0;font-weight:500}
.gm-modal{position:absolute;left:50%;top:50%;width:1000px;margin-left:-500px;background:#fff;border-radius:32px;color:#202124;padding:44px 50px 40px;box-shadow:0 20px 60px rgba(0,0,0,.45)}
.gm-modal h3{font-size:48px;font-weight:400;margin-bottom:34px}
.gm-in{height:100px;border:3px solid #0B57D0;border-radius:14px;display:flex;align-items:center;padding:0 30px;font-size:40px;color:#202124}
.gm-in .ph{color:#80868B}
.gm-sug{display:flex;align-items:center;gap:26px;height:124px;margin-top:22px;padding:0 20px;border-radius:16px;font-size:40px}
.gm-sug .s-av{width:80px;height:80px;border-radius:50%}
.gm-sug .ac{margin-left:auto;height:80px;border-radius:40px;background:#0B57D0;color:#fff;font-size:38px;font-weight:500;padding:0 40px;display:flex;align-items:center}
.gm-toast{position:absolute;left:50%;bottom:190px;background:#fff;color:#202124;border-radius:24px;padding:30px 40px;box-shadow:0 12px 44px rgba(0,0,0,.5);display:flex;align-items:center;gap:28px;font-size:40px;white-space:nowrap}
.gm-toast .s-av{width:80px;height:80px;border-radius:50%}
.gm-toast .ac{color:#0B57D0;font-weight:500;padding:16px 24px;border-radius:40px}
.gm-toast .ac.dim{color:#5F6368}
.gm-toast .hico{width:80px;height:80px;border-radius:50%;background:#F8E3A0;display:flex;align-items:center;justify-content:center}
.gm-toast .hico svg{width:50px;height:50px}
`;
  if (!document.getElementById("g-css")) { const s = document.createElement("style"); s.id = "g-css"; s.textContent = css; document.head.appendChild(s); }

  const ic = (d, c, w) => `<svg viewBox="0 0 24 24" fill="none" stroke="${c || "#444746"}" stroke-width="${w || 2}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const I = {
    menu: ic('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    search: ic('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'),
    plus: ic('<path d="M12 5v14M5 12h14"/>', "#1F1F1F"),
    pen: ic('<path d="M4 20h4L19 9l-4-4L4 16z"/>', "#001D35"),
    home: ic('<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>'),
    folder: ic('<path d="M3 6h6l2 2h10v11H3z"/>', "#041E49"),
    shared: ic('<circle cx="9" cy="8" r="3"/><path d="M3 19c0-3 3-5 6-5s6 2 6 5"/><path d="M16 5a3 3 0 010 6M18 14c2 .7 3 2.5 3 5"/>'),
    recent: ic('<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>'),
    star: ic('<path d="M12 4l2.4 5 5.6.8-4 3.9.9 5.6L12 16.7 7.1 19.3 8 13.7 4 9.8 9.6 9z"/>', "#747775"),
    inbox: ic('<path d="M4 5h16v14H4z"/><path d="M4 13h5l1 2h4l1-2h5"/>', "#041E49"),
    sent: ic('<path d="M4 12l16-8-6 16-2-7z"/>'),
    draft: ic('<path d="M7 3h7l5 5v13H7z"/><path d="M10 15l5-5 1.5 1.5-5 5H10z"/>'),
    sdrive: ic('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="11" r="2"/><circle cx="15" cy="11" r="2"/><path d="M6 17c.6-1.6 1.8-2.4 3-2.4s2.4.8 3 2.4c.6-1.6 1.8-2.4 3-2.4s2.4.8 3 2.4"/>', "#041E49"),
    chev: ic('<path d="M9 6l6 6-6 6"/>', "#444746"),
    reply: ic('<path d="M10 8L4 13l6 5M4 13h10a6 6 0 016 6"/>'),
    fwd: ic('<path d="M14 8l6 5-6 5M20 13H10a6 6 0 00-6 6"/>'),
    caret: ic('<path d="M7 10l5 5 5-5"/>', "#1F1F1F"),
    box: ic('<rect x="4.5" y="4.5" width="15" height="15" rx="2"/>', "#747775"),
    refresh: ic('<path d="M20 11a8 8 0 10-2.3 5.7M20 5v6h-6"/>'),
    dots: `<svg viewBox="0 0 24 24" fill="#444746"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>`,
    // meet controls
    mic: ic('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>', "#E8EAED"),
    micOff: ic('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3M4 4l16 16"/>', "#fff"),
    cam: ic('<rect x="3" y="6" width="12" height="12" rx="2"/><path d="M15 10l6-3v10l-6-3z"/>', "#E8EAED"),
    cc: ic('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 10.5a2 2 0 100 3M17 10.5a2 2 0 100 3"/>', "#E8EAED"),
    hand: `<svg viewBox="0 0 24 24" fill="none" stroke="#E8EAED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13V5.5a1.5 1.5 0 013 0V11M11 10.5V4a1.5 1.5 0 013 0v6.5M14 10.5V5.5a1.5 1.5 0 013 0V14c0 4-2.5 7-6 7-2.6 0-4-1.3-5.5-3.6L3.6 14.5a1.5 1.5 0 012.5-1.6L8 15"/></svg>`,
    present: ic('<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 14V8M9 11l3-3 3 3M8 21h8"/>', "#E8EAED"),
    more: `<svg viewBox="0 0 24 24" fill="#E8EAED"><circle cx="12" cy="5" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="12" cy="19" r="1.9"/></svg>`,
    endcall: `<svg viewBox="0 0 24 24"><path d="M3 14.5c5-5 13-5 18 0l-2.4 2.4-3.4-1.6v-2.6c-2.1-.8-4.3-.8-6.4 0v2.6l-3.4 1.6z" fill="#fff"/></svg>`,
    people: ic('<circle cx="9" cy="8" r="3.2"/><path d="M3 19c0-3.2 2.7-5.2 6-5.2s6 2 6 5.2"/><path d="M16 5a3 3 0 010 6M18 14c2 .7 3 2.5 3 5"/>', "#E8EAED"),
    chat: ic('<path d="M4 5h16v11H8l-4 4z"/>', "#E8EAED"),
    info: ic('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>', "#E8EAED"),
    addPerson: ic('<circle cx="9" cy="8" r="3.4"/><path d="M3 20c0-3.4 2.7-5.6 6-5.6s6 2.2 6 5.6M19 8v6M16 11h6"/>', "#001D35"),
  };
  // the raised hand, filled (Meet's yellow chip with a dark hand)
  I.handOn = `<svg viewBox="0 0 24 24" fill="#3C2F00" stroke="#3C2F00" stroke-width="1.2" stroke-linejoin="round"><path d="M8 13V5.5a1.5 1.5 0 013 0V11M11 10.5V4a1.5 1.5 0 013 0v6.5M14 10.5V5.5a1.5 1.5 0 013 0V14c0 4-2.5 7-6 7-2.6 0-4-1.3-5.5-3.6L3.6 14.5a1.5 1.5 0 012.5-1.6L8 15z"/></svg>`;
  // product marks
  const P = {
    drive: `<svg viewBox="0 0 48 42"><path d="M16 2h16l15 26h-16z" fill="#FBBC04"/><path d="M16 2L1 28l8 13 15-26z" fill="#0F9D58"/><path d="M9 41h30l8-13H17z" fill="#4285F4"/></svg>`,
    gmail: `<svg viewBox="0 0 48 36"><path d="M3 34V8l21 15L45 8v26h-8V17L24 26 11 17v17z" fill="#EA4335"/><path d="M3 8v6l8 3V8z" fill="#C5221F"/><path d="M45 8v6l-8 3V8z" fill="#FBBC04"/><path d="M3 34h8V17L3 13z" fill="#4285F4"/><path d="M37 34h8V13l-8 4z" fill="#34A853"/></svg>`,
    doc: `<svg viewBox="0 0 24 24"><path d="M5 2h10l5 5v15H5z" fill="#4285F4"/><path d="M15 2v5h5z" fill="#A1C2FA"/><path d="M8 11h8M8 14h8M8 17h5" stroke="#fff" stroke-width="1.5"/></svg>`,
    sheet: `<svg viewBox="0 0 24 24"><path d="M5 2h10l5 5v15H5z" fill="#0F9D58"/><path d="M15 2v5h5z" fill="#87CEAC"/><rect x="7.5" y="10" width="9" height="8" fill="none" stroke="#fff" stroke-width="1.4"/><path d="M7.5 14h9M12 10v8" stroke="#fff" stroke-width="1.4"/></svg>`,
    slides: `<svg viewBox="0 0 24 24"><path d="M5 2h10l5 5v15H5z" fill="#F4B400"/><path d="M15 2v5h5z" fill="#FADA80"/><rect x="7.5" y="10.5" width="9" height="6.5" rx=".6" fill="none" stroke="#fff" stroke-width="1.5"/></svg>`,
    gfolder: `<svg viewBox="0 0 24 24"><path d="M2.5 5.5h7l2 2h10v12h-19z" fill="#5F6368"/></svg>`,
  };

  const G = { I, P };
  // Position of an element in root pixels (the root may be scaled by the kit).
  G.NOTION = `<svg viewBox="0 0 100 100"><rect x="8" y="6" width="84" height="88" rx="12" fill="#fff" stroke="#111" stroke-width="7"/><path d="M32 74V30l36 44V30" fill="none" stroke="#111" stroke-width="9" stroke-linejoin="round"/></svg>`;
  G.box = (root, e) => {
    const rr = root.getBoundingClientRect(), sc = rr.width / 1920, b = e.getBoundingClientRect();
    return { x: (b.left - rr.left) / sc, y: (b.top - rr.top) / sc, w: b.width / sc, h: b.height / sc, cx: (b.left - rr.left + b.width / 2) / sc, cy: (b.top - rr.top + b.height / 2) / sc };
  };
  // A circle avatar (Google uses circles everywhere)
  G.av = (who) => L.avatar(who);

  // The shared Workspace shell: top bar, left nav, white card. o: { app: "drive"|"gmail", me: role }
  G.shell = (root, o) => {
    const isMail = o.app === "gmail";
    const drv = o.shared
      ? `<div class="g-it">${I.home}Home</div><div class="g-it">${I.folder.replace("#041E49", "#444746")}My Drive</div><div class="g-it on">${I.sdrive}Shared drives</div><div class="g-it">${I.shared}Shared with me</div><div class="g-it">${I.recent}Recent</div>`
      : `<div class="g-it">${I.home}Home</div><div class="g-it on">${I.folder}My Drive</div><div class="g-it">${I.shared}Shared with me</div><div class="g-it">${I.recent}Recent</div><div class="g-it">${I.star}Starred</div>`;
    const nav = isMail
      ? `<div class="g-new cmp">${I.pen}Compose</div>
         <div class="g-it on">${I.inbox}Inbox</div><div class="g-it">${I.star}Starred</div><div class="g-it">${I.sent}Sent</div><div class="g-it">${I.draft}Drafts</div>`
      : `<div class="g-new">${I.plus}New</div>${drv}`;
    const w = L.el("div", "gw", `
      <div class="g-top"><div class="hb">${I.menu}</div><div class="g-brand">${isMail ? P.gmail : P.drive}${isMail ? "Gmail" : "Drive"}</div>
        <div class="g-q">${I.search}<span>${isMail ? "Search mail" : "Search in Drive"}</span></div>
        ${L.avatar(o.me || "Programme lead", "g-me")}</div>
      <div class="g-nav">${nav}</div>
      <div class="g-card"></div>`, root);
    return { w, card: w.querySelector(".g-card") };
  };
  // A row that grows into a list at t0 (others pushed down), like SL.grow.
  G.grow = (row, inner, t, t0, dur) => {
    dur = dur || 420;
    const h = inner.offsetHeight, u = L.E.out(L.clamp01((t - t0) / dur));
    row.style.height = (t < t0 ? 0 : h * u) + "px";
    const v = L.arrive(inner, t, t0 + dur * 0.2, { dur, dy: -18, scale: 0.99 });
    if (v >= 1) inner.style.transform = "none"; // settled: no layer left behind, so raster never depends on history
  };

  // Meet: the dark call shell with the bottom bar. Returns refs.
  G.meet = (root, o) => {
    const w = L.el("div", "gm", `
      <div class="gm-bar"><div class="l">${o.title || "Weekly sync"}</div>
        <div class="mid"><div class="gm-btn">${I.mic}</div><div class="gm-btn">${I.cam}</div><div class="gm-btn">${I.cc}</div><div class="gm-btn">${I.hand}</div><div class="gm-btn">${I.present}</div><div class="gm-btn">${I.more}</div><div class="gm-btn end">${I.endcall}</div></div>
        <div class="r"><div class="gm-btn">${I.info}</div><div class="gm-btn ppl">${I.people}</div><div class="gm-btn">${I.chat}</div></div></div>`, root);
    return { w, ppl: w.querySelector(".ppl") };
  };
  G.tile = (parent, who, label, o) => {
    o = o || {};
    const t = L.el("div", "gm-tile" + (who === "Rumi" ? " bot" : ""), `${L.avatar(who)}<div class="nm">${label || who}</div><div class="ring"></div>
      ${o.muted ? `<div class="mut">${I.micOff}</div>` : ""}<div class="rec"></div><div class="hand">${I.handOn}</div>`, parent);
    return t;
  };
  window.G = G;
})();
