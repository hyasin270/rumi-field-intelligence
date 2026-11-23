/* lender-officer · shot R1, the hook and the officer (narration R1.4, R1.5) (v2-screens).
   DESIGN MOCKUP, chip "How it could work". The loan officer's phone, chat with Rumi: Rumi's one
   page (drawn as icons only: request, photo, record, terms, each ticked) with two reply buttons,
   Approve and Change. The hook: a refusal-red note drops under Approve, "Approving a loan needs a
   person", and Approve locks (red stop sign, as hook-refusal). Then the officer's tap: the lock
   lifts, Approve turns green with a tick and the Loan officer's badge lands on it; the note leaves with the red (ruling 46).
   Inset layout (VISUAL_LANGUAGE_v2 9.11, 14.10): carrying words 104 px (the inset plays 800 x 450, about 43 px there).
   Point words (8): "Approving a loan needs a person" + "Approve" + "Change". */
SCREEN.define({
  id: "lender-officer",
  dur: 4800,
  // page: the page lands. barrier: the note drops and Approve locks. tap: the officer taps Approve. tick: it turns green.
  events: { page: 150, barrier: 900, tap: 3100, tick: 3250 },
  build(root) {
    const L = SCREEN.lib, IC = PH.IC, RED = "#C8372D";
    const W = (root._W = PH.window(root, { fs: 104, compact: true, hfs: 70, name: "Rumi", who: "Rumi", label: "How it could work" }));
    W.chat.style.cssText += ";justify-content:center;padding:0 60px 340px";
    const STOP = `<svg viewBox="0 0 100 100" class="stop"><path d="M30 4h40l26 26v40L70 96H30L4 70V30z" fill="${RED}"/><rect x="24" y="43" width="52" height="14" rx="7" fill="#fff"/></svg>`;
    root._STOP = STOP;
    const css = `
.lo-pg{display:flex;justify-content:space-around;align-items:center;font-size:118px;padding:.12em 0}
.lo-pg .ci{position:relative;width:1.4em;height:1.4em;border-radius:50%;background:#E7F7F1;display:flex;align-items:center;justify-content:center}
.lo-pg .ci svg{width:.8em;height:.8em}
.lo-pg .ci .wa-ok{position:absolute;right:-.2em;bottom:-.15em;width:.62em;height:.62em}
.lo-btns{display:flex;gap:24px;margin-top:28px}
.lo-btns .wa-btn{flex:1;height:2.2em}
.lo-btns .wa-btn .k{display:flex}
.lo-btns .wa-btn .k svg{width:.8em;height:.8em}
.lo-bar{position:absolute;inset:0;border-radius:.32em;background:repeating-linear-gradient(135deg,rgba(200,55,45,.16) 0 30px,rgba(200,55,45,.04) 30px 60px);box-shadow:inset 0 0 0 7px ${RED}}
.lo-note{position:absolute;left:0;top:calc(100% + 28px);transform-origin:20% 0;background:${RED};color:#fff;font-weight:700;font-size:104px;line-height:1.08;
  border-radius:.25em;padding:.22em .45em;display:flex;align-items:center;gap:.3em;box-shadow:0 14px 30px rgba(0,0,0,.2);white-space:nowrap}
.lo-note .stop{width:.9em;height:.9em;flex:none}
.lo-note .stop path{fill:#fff}.lo-note .stop rect{fill:var(--c,${RED})}
.lo-note::after{content:"";position:absolute;left:300px;top:-34px;border:36px solid transparent;border-top:0;border-bottom-color:var(--c,${RED})}
.lo-who{position:absolute;right:30px;top:50%;margin-top:-60px;width:120px;height:120px;border-radius:50%;background:${L.ROLE["Loan officer"][1]};color:#fff;font:700 52px/1 Inter,sans-serif;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 7px #fff}`;
    const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    const ic = (svg) => `<span class="ci">${svg}${IC.ok}</span>`;
    const item = L.el("div", "wa-item", null, W.chat);
    const rowEl = L.el("div", "wa-row in", `<div class="wa-b" style="width:1800px"><div class="lo-pg">${ic(IC.tractor)}${ic(IC.photo)}${ic(IC.book)}${ic(IC.doc)}</div></div>
      <div class="lo-btns"><div class="wa-btn ap"><span class="k">${IC.ok}</span><span class="lb">Approve</span><div class="lo-bar"></div><div class="lo-who">LO</div>
        <div class="lo-note">${STOP}<span>Approving a loan<br>needs a person</span></div></div>
        <div class="wa-btn"><span class="k">${IC.pen}</span>Change</div></div>`, item);
    rowEl.style.maxWidth = "none";
    root._row = rowEl; root._ap = rowEl.querySelector(".ap"); root._bar = rowEl.querySelector(".lo-bar");
    root._note = rowEl.querySelector(".lo-note"); root._who = rowEl.querySelector(".lo-who"); root._k = root._ap.querySelector(".k");
    root._k.dataset.s = "ok";
    root._ring = L.ringEl(root);
  },
  render(root, t, ev) {
    const L = SCREEN.lib, ap = root._ap;
    root._W.w.style.transform = `scale(${1 + 0.012 * L.tw(t, 0, 4800, "sine")})`;
    L.arrive(root._row, t, ev.page, { dur: 420, dy: 30, scale: 0.97 });
    // the barrier: the note drops under Approve, the button locks
    const b = L.tw(t, ev.barrier, 420, "out"), lift = L.tw(t, ev.tick, 300, "out"); // the red clears whole, with the green fill (v2-visuals 080314)
    // the note leaves with the block (v2-lead ruling 46 item 7): it fades and sinks as the red clears
    root._note.style.opacity = t < ev.barrier ? 0 : Math.min(1, b * 2) * (1 - lift);
    root._note.style.transform = `translateY(${(1 - L.E.spring(L.clamp01((t - ev.barrier) / 520))) * 80 + 30 * lift}px)`;
    root._bar.style.opacity = b * (1 - lift);
    const locked = t >= ev.barrier && t < ev.tick, want = locked ? "lock" : "ok";
    if (root._k.dataset.s !== want) { root._k.innerHTML = locked ? root._STOP : PH.IC.ok; root._k.dataset.s = want; }
    // the officer's tap, then Approve turns green with the officer's badge
    const r = L.boxOf(root, ap, 0);
    L.ringAt(root._ring, t, ev.tap, { x: r.x + r.w / 2, y: r.y + r.h / 2 });
    const g = L.tw(t, ev.tick, 300, "out");
    ap.style.background = g > 0 ? `rgb(${Math.round(L.lerp(255, 0, g))},${Math.round(L.lerp(255, 168, g))},${Math.round(L.lerp(255, 132, g))})` : "#fff";
    ap.style.color = g > 0.5 ? "#fff" : locked ? "#8696A0" : "#008069";
    ap.style.transform = `scale(${t >= ev.tap && t < ev.tap + 220 ? 0.97 : 1})`;
    const ok = root._k.querySelector(".wa-ok circle"); if (ok) ok.setAttribute("fill", g > 0.5 ? "#fff" : "#00A884");
    const okp = root._k.querySelector(".wa-ok path"); if (okp) okp.setAttribute("stroke", g > 0.5 ? "#00A884" : "#fff");
    const w = L.tw(t, ev.tick + 200, 360, "out");
    root._who.style.opacity = w; root._who.style.transform = `scale(${0.4 + 0.6 * L.E.back(w)})`;
  },
});
