/* film2/screens/_lib/notion.js · v2-screens. A Notion page, drawn as it looks (white page,
   Inter, grey properties, coloured status chip, comments in the margin), at film size.
   The page is the coaching-tip redesign used by 2B2 and 2B3. Wording is composed by us;
   no real comment text. Roles for people; the agent is Rumi. */
(function () {
  const L = SCREEN.lib;
  const css = `
.no{position:absolute;left:0;top:0;width:1920px;height:1080px;background:#fff;font-family:Inter,sans-serif;color:#37352F;overflow:hidden;transform-origin:0 0}
.no-top{height:76px;display:flex;align-items:center;gap:16px;padding:0 40px;font-size:36px;color:#5F5E5B;border-bottom:2px solid #EFEFEE}
.no-top .sep{opacity:.5}
.no-top .cur{color:#37352F}
.no-top .share{margin-left:auto;font-size:36px;color:#37352F}
.no-body{position:absolute;left:120px;top:100px;right:120px}
.no-h1{font-size:80px;font-weight:700;letter-spacing:-0.02em;color:#191919;line-height:1.08;display:flex;align-items:center;gap:26px}
.no-h1 .em{font-size:74px}
.no-props{margin-top:26px;display:grid;grid-template-columns:240px auto;row-gap:12px;font-size:36px;align-items:center}
.no-props .k{color:#787774}
.no-chip{display:inline-block;border-radius:8px;padding:2px 16px;font-size:36px}
.no-chip.rev{background:#FBEFD9;color:#7A4F0E}
.no-chip.done{background:#DBEDDB;color:#1C3829}
.no-who{display:inline-flex;align-items:center;gap:14px}
.no-who .s-av{width:76px;height:76px;border-radius:50%;font-size:36px;letter-spacing:-.02em}
.no-h2{font-size:52px;font-weight:700;color:#191919;margin:0 0 20px}
.no-cols{position:absolute;left:120px;right:120px;top:356px;display:flex;gap:70px}
.no-mocks{display:flex;gap:40px}
.no-ph{width:400px;height:520px;border-radius:44px;background:#EFE7DE;border:10px solid #1F1F1F;padding:26px 22px;position:relative;overflow:hidden}
.no-ph .cap{position:absolute;left:0;right:0;top:-2px;height:62px;background:#075E54;color:#fff;font-size:36px;font-weight:600;display:flex;align-items:center;padding:0 22px}
.no-ph .bd{margin-top:66px}
.no-bub{background:#fff;border-radius:18px;padding:16px 20px;font-size:36px;line-height:1.2;color:#111;box-shadow:0 2px 2px rgba(0,0,0,.08)}
.no-btn{margin-top:12px;background:#fff;border-radius:16px;text-align:center;color:#0A7CC1;font-weight:600;font-size:36px;padding:12px 6px;box-shadow:0 2px 2px rgba(0,0,0,.08)}
.no-lab{font-size:40px;font-weight:600;color:#191919;margin:0 0 16px 6px}
.no-qs{align-self:flex-start;flex:1;padding:0 26px 8px 0}
.no-q{font-size:46px;line-height:1.35;color:#37352F}
.no-q li{margin:0 0 18px 40px}
.no-cm{position:absolute;right:40px;width:820px;background:#fff;border-radius:18px;box-shadow:0 10px 40px rgba(15,15,15,.16),0 0 0 2px rgba(15,15,15,.05);padding:26px 30px;font-family:Inter,sans-serif}
.no-cm .row{display:flex;gap:18px;align-items:flex-start}
.no-cm .row+.row{margin-top:26px}
.no-cm .s-av{width:76px;height:76px;letter-spacing:-.02em;border-radius:50%;font-size:36px}
.no-cm .s-av-rumi{border-radius:50%}
.no-cm .who{font-size:36px;font-weight:600;color:#191919}
.no-cm .tx{font-size:38px;line-height:1.32;color:#37352F;margin-top:4px}
.no-cm .res{display:flex;align-items:center;gap:14px;font-size:36px;color:#2F7D5B;font-weight:600;margin-top:24px}
.no-mark{background:rgba(255,212,0,.32);border-bottom:4px solid rgba(232,180,0,.9);border-radius:4px}
`;
  if (!document.getElementById("no-css")) { const s = document.createElement("style"); s.id = "no-css"; s.textContent = css; document.head.appendChild(s); }

  const NO = {};
  // The coaching-tip page. o.notNow: "on" | "struck" (2B3 shows the manager's ask on that button)
  NO.page = (parent, o) => {
    o = o || {};
    const p = L.el("div", "no", `
      <div class="no-top"><span>Rumi</span><span class="sep">/</span><span>Product</span><span class="sep">/</span><span class="cur">Coaching tip redesign</span><span class="share">Share</span></div>
      <div class="no-body">
        <div class="no-h1"><svg class="em" viewBox="0 0 100 100" width="84" height="84"><path d="M14 18h72a8 8 0 0 1 8 8v40a8 8 0 0 1-8 8H44L24 90V74H14a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8z" fill="#F1F1EF" stroke="#9B9A97" stroke-width="5" stroke-linejoin="round"/><circle cx="32" cy="46" r="6" fill="#787774"/><circle cx="50" cy="46" r="6" fill="#787774"/><circle cx="68" cy="46" r="6" fill="#787774"/></svg>Coaching tip redesign</div>
        <div class="no-props">
          <div class="k">Status</div><div><span class="no-chip rev">In review</span></div>
          <div class="k">Owner</div><div class="no-who">${L.avatar("Product manager")}Product manager</div>
        </div>
      </div>
      <div class="no-cols">
        <div><div class="no-h2">Mockups</div>
          <div class="no-mocks">
            <div><div class="no-lab">Today</div><div class="no-ph"><div class="cap">Rumi</div><div class="bd">
              <div class="no-bub">Here is today’s tip.</div><div class="no-btn">Read</div></div></div></div>
            <div><div class="no-lab">New</div><div class="no-ph"><div class="cap">Rumi</div><div class="bd">
              <div class="no-bub">A tip for your next lesson.</div><div class="no-btn">Get feedback</div><div class="no-btn">Show me how</div><div class="no-btn nn">Not now</div></div></div></div>
          </div></div>
        <div class="no-qs"><div class="no-h2">Open questions</div><ul class="no-q"><li>Send it in the morning?</li><li>Keep “Not now”?</li></ul></div>
      </div>`, parent);
    return { p, mocks: p.querySelector(".no-mocks"), qs: p.querySelector(".no-qs"), notNow: p.querySelector(".nn"), status: p.querySelector(".no-chip") };
  };
  window.NO = NO;
})();
