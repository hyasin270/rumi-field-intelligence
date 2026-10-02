/* Coaching debrief study page. Everything renders from window.DATA (data.js), built by scripts/build_site.py. */
(function () {
  const D = window.DATA;
  const $ = (s, el = document) => el.querySelector(s);
  const h = (tag, attrs = {}, ...kids) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") e.className = v; else if (k === "html") e.innerHTML = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v); else if (v !== null && v !== undefined) e.setAttribute(k, v);
    }
    for (const k of kids.flat()) if (k !== null && k !== undefined) e.append(k.nodeType ? k : document.createTextNode(k));
    return e;
  };
  const fmt = (s) => { s = Math.max(0, Math.round(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
  const pct = (x) => `${Math.round(x * 100)}%`;
  const PROG = D.meta.programmes;               // [{id, label}]
  const DIM = Object.fromEntries(D.rubric.map(r => [r.id, r]));

  // ---------- theme toggle
  const tbtn = $("#theme");
  const setTheme = (t) => { document.documentElement.setAttribute("data-theme", t); try { localStorage.setItem("theme", t); } catch (e) {} tbtn.textContent = t === "dark" ? "Light" : "Dark"; };
  let saved = null; try { saved = localStorage.getItem("theme"); } catch (e) {}
  setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  tbtn.addEventListener("click", () => setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"));

  // ---------- tooltip
  const tip = h("div", { class: "tip" }); document.body.append(tip);
  const showTip = (ev, html) => { tip.innerHTML = html; tip.style.opacity = 1; tip.style.left = Math.min(ev.clientX + 14, innerWidth - 300) + "px"; tip.style.top = ev.clientY + 14 + "px"; };
  const hideTip = () => { tip.style.opacity = 0; };

  // ---------- a single audio element drives every small player, so only one plays at a time
  const audio = new Audio(); audio.preload = "none"; let current = null;
  function player(src, dur) {
    const btn = h("button", { "aria-label": "Play", html: playIcon() });
    const bar = h("i"); const track = h("div", { class: "track" }, bar);
    const time = h("span", { class: "time" }, fmt(dur || 0));
    const p = h("div", { class: "player" }, btn, track, time);
    p._src = src; p._bar = bar; p._time = time; p._btn = btn; p._dur = dur;
    btn.addEventListener("click", () => toggle(p));
    track.addEventListener("click", (ev) => { const r = track.getBoundingClientRect(); const f = (ev.clientX - r.left) / r.width; if (current !== p) toggle(p, f); else audio.currentTime = f * (audio.duration || p._dur); });
    return p;
  }
  function playIcon() { return '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 1.5v11l9-5.5z" fill="currentColor"/></svg>'; }
  function pauseIcon() { return '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="2.5" y="1.5" width="3" height="11" rx="1" fill="currentColor"/><rect x="8.5" y="1.5" width="3" height="11" rx="1" fill="currentColor"/></svg>'; }
  function toggle(p, frac) {
    if (current === p && !audio.paused) { audio.pause(); return; }
    if (current !== p) {
      if (current) { current._btn.innerHTML = playIcon(); current._bar.style.width = 0; }
      current = p; audio.src = p._src;
      audio.addEventListener("loadedmetadata", function once() { if (frac) audio.currentTime = frac * audio.duration; audio.removeEventListener("loadedmetadata", once); });
    }
    audio.play();
  }
  audio.addEventListener("play", () => current && (current._btn.innerHTML = pauseIcon()));
  audio.addEventListener("pause", () => current && (current._btn.innerHTML = playIcon()));
  audio.addEventListener("timeupdate", () => {
    if (!current) return; const d = audio.duration || current._dur || 1;
    current._bar.style.width = (100 * audio.currentTime / d) + "%"; current._time.textContent = fmt(audio.currentTime);
  });

  // ---------- hero numbers
  $("#stats").append(...D.meta.stats.map(s => h("div", { class: "stat" }, h("b", {}, s.value), h("span", {}, s.label))));

  // ---------- short version
  const sv = $("#short");
  for (const [cls, k, items] of [["k-good", "Going well", D.summary.going_well], ["k-opp", "Would help most", D.summary.improve], ["k-imp", "Did teaching change?", D.summary.impact]]) {
    for (const it of items) sv.append(h("div", { class: "card" }, h("div", { class: "kicker " + cls }, k), h("h4", {}, it.title), h("p", { html: it.text })));
  }

  // ---------- the ideal arc + how often each step happened
  const arc = $("#arc");
  for (const st of D.arc) {
    const seen = h("div", { class: "seen" });
    for (const p of PROG) {
      const v = st.seen && st.seen[p.id]; if (v === undefined || v === null) continue;
      seen.append(h("div", {}, h("span", { class: "muted" }, `${p.short}: ${pct(v)}`), h("div", { class: "bar-mini" }, h("i", { style: `width:${100 * v}%` }))));
    }
    arc.append(h("div", { class: "step" }, h("b", {}, st.name), h("span", {}, st.what), seen));
  }

  // ---------- rubric table
  const rb = $("#rubric");
  const citeLink = (c) => h("div", { class: "small" }, h("a", { href: c.url, target: "_blank", rel: "noopener" }, `${c.author.split(",")[0]} ${c.year}`));
  const rubricRow = (r) => h("tr", {},
    h("td", {}, h("b", {}, r.name)),
    h("td", {}, r.why),
    h("td", {}, h("div", { class: "small" }, r.strength), ...r.citations.map(citeLink)));
  rb.append(h("table", { class: "res" },
    h("tr", {}, h("th", {}, "What we scored"), h("th", {}, "Why it matters"), h("th", {}, "Evidence")),
    ...D.rubric.map(rubricRow)));

  // ---------- programme panel
  let prog = PROG[0].id;
  const tabs = $("#progtabs");
  for (const p of PROG) tabs.append(h("button", { role: "tab", "aria-selected": p.id === prog ? "true" : "false", onclick: () => { prog = p.id; [...tabs.children].forEach(b => b.setAttribute("aria-selected", b.textContent === p.label ? "true" : "false")); renderProg(); } }, p.label));
  function renderProg() {
    const P = D.programmes[prog]; const el = $("#progpanel"); el.innerHTML = "";
    el.append(h("p", { class: "lede2", html: P.headline }));
    el.append(h("div", { class: "cards3" }, ...P.tiles.map(t => h("div", { class: "card" }, h("div", { class: "kicker muted" }, t.label), h("h4", { style: "font-size:28px;margin:4px 0" }, t.value), h("div", { class: "small muted" }, t.note || "")))));
    el.append(dimChart(P));
    if (P.failure_modes && P.failure_modes.length) el.append(fmChart(P));
    if (P.patterns && P.patterns.length) el.append(h("details", { class: "fold" }, h("summary", {}, "What the managers found when they checked the readers' work"),
      ...P.patterns.map(x => h("p", {}, h("b", {}, x.title + ". "), x.finding, h("span", { class: "muted" }, x.count ? ` (${x.count})` : "")))));
  }
  function dimChart(P) {
    const dims = D.rubric.map(r => r.id).filter(id => P.dims[id]);
    const W = 760, rowH = 34, left = 250, top = 8, H = top + dims.length * rowH + 24;
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg"); svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Share of debriefs at each score, per dimension");
    const cols = ["var(--seq0)", "var(--seq1)", "var(--seq2)", "var(--seq3)"];
    const lab = ["0 absent", "1 weak", "2 adequate", "3 strong"];
    dims.forEach((id, i) => {
      const d = P.dims[id]; const n = d.dist.reduce((a, b) => a + b, 0) || 1; let x = left; const y = top + i * rowH;
      const t = document.createElementNS(ns, "text"); t.setAttribute("x", left - 10); t.setAttribute("y", y + 17); t.setAttribute("text-anchor", "end"); t.textContent = DIM[id].short || DIM[id].name; svg.append(t);
      d.dist.forEach((c, k) => {
        const w = (W - left - 60) * c / n; if (w <= 0) return;
        const r = document.createElementNS(ns, "rect"); r.setAttribute("x", x); r.setAttribute("y", y + 4); r.setAttribute("width", Math.max(0, w - 2)); r.setAttribute("height", 20); r.setAttribute("rx", 4); r.setAttribute("fill", cols[k]);
        r.addEventListener("mousemove", ev => showTip(ev, `<b>${DIM[id].name}</b><br>${lab[k]}: ${c} of ${n} debriefs (${pct(c / n)})`)); r.addEventListener("mouseleave", hideTip);
        svg.append(r); x += w;
      });
      const m = document.createElementNS(ns, "text"); m.setAttribute("x", W - 52); m.setAttribute("y", y + 18); m.textContent = `avg ${d.mean.toFixed(1)}`; svg.append(m);
    });
    const box = h("div", { class: "chart" }, h("h4", {}, P.dim_title), h("div", { class: "sub" }, `Score per debrief, 0 to 3, n = ${P.n_scored} debriefs. Hover a bar for counts.`));
    box.append(svg, h("div", { class: "legend" }, ...lab.map((l, k) => h("span", {}, h("i", { style: `background:${cols[k]}` }), l))));
    box.append(h("details", { class: "tbl" }, h("summary", {}, "Show as a table"), h("table", {}, h("tr", {}, h("th", {}, "Dimension"), ...lab.map(l => h("th", {}, l)), h("th", {}, "Average")),
      ...dims.map(id => h("tr", {}, h("td", {}, DIM[id].name), ...P.dims[id].dist.map(c => h("td", {}, c)), h("td", {}, P.dims[id].mean.toFixed(2)))))));
    return box;
  }
  function fmChart(P) {
    const box = h("div", { class: "chart" }, h("h4", {}, "The most common missed opportunities"), h("div", { class: "sub" }, `Share of debriefs where the readers saw each one, n = ${P.n_scored}`));
    const list = h("div");
    for (const f of P.failure_modes.slice(0, 8)) {
      const s = f.count / f.of;
      list.append(h("div", { class: "fmrow", style: "display:grid;grid-template-columns:230px 1fr 52px;gap:10px;align-items:center;margin:6px 0;font-size:14px" },
        h("span", {}, f.name), h("div", { class: "bar-mini", style: "height:14px;border-radius:4px" }, h("i", { style: `width:${100 * s}%;background:var(--s2);border-radius:4px` })), h("span", { class: "muted" }, pct(s))));
    }
    box.append(list); return box;
  }
  renderProg();

  // ---------- clip galleries
  function clipCard(c) {
    const good = c.kind === "strength";
    const card = h("div", { class: "clip " + (good ? "good" : "opp") });
    card.append(h("div", { class: "meta" }, h("span", { class: "tag " + (good ? "good" : "opp") }, good ? "Going well" : "Could be stronger"),
      h("span", {}, DIM[c.dimension] ? DIM[c.dimension].short || DIM[c.dimension].name : c.dimension), h("span", {}, "·"), h("span", {}, c.coach), h("span", {}, "·"), h("span", {}, c.programme_label)));
    card.append(h("h4", {}, c.title), player(c.file, c.dur));
    const orig = c.quote_original ? h("span", { class: (c.rtl ? "ur " : "") + "orig clamp", lang: c.lang, title: "Click to show all", onclick: (ev) => ev.currentTarget.classList.toggle("clamp") }, c.quote_original) : null;
    const en = h("div", { class: "en" }, ...String(c.quote_en).split(/\s*\|\s*/).map(x => h("div", {}, x)));
    card.append(h("div", { class: "quote" }, en, orig));
    card.append(h("div", { class: "why" }, c.why));
    if (!good && c.better_move) card.append(h("div", { class: "better" }, h("b", {}, "A stronger move"), c.better_move,
      c.better_move_local ? h("span", { class: c.rtl ? "ur" : "", lang: c.lang, style: "margin-top:6px" }, c.better_move_local) : null));
    return card;
  }
  function gallery(rootSel, kind) {
    const root = $(rootSel); const filt = h("div", { class: "filters" }); const grid = h("div", { class: "clips" }); const more = h("div", { class: "more" });
    const progSel = h("select", {}, h("option", { value: "" }, "All programmes"), ...PROG.map(p => h("option", { value: p.id }, p.label)));
    const dimSel = h("select", {}, h("option", { value: "" }, "All parts of the debrief"), ...D.rubric.map(r => h("option", { value: r.id }, r.name)));
    filt.append(h("span", { class: "muted" }, "Show"), progSel, dimSel); root.append(filt, grid, more);
    let limit = 9;
    const draw = () => {
      const list = D.clips.filter(c => c.kind === kind && (!progSel.value || c.programme === progSel.value) && (!dimSel.value || c.dimension === dimSel.value));
      grid.innerHTML = ""; list.slice(0, limit).forEach(c => grid.append(clipCard(c)));
      more.innerHTML = ""; if (list.length > limit) more.append(h("button", { onclick: () => { limit += 9; draw(); } }, `Show more (${list.length - limit} left)`));
      if (!list.length) grid.append(h("p", { class: "muted" }, "No clips for this filter."));
    };
    progSel.addEventListener("change", () => { limit = 9; draw(); }); dimSel.addEventListener("change", () => { limit = 9; draw(); }); draw();
  }
  gallery("#good", "strength"); gallery("#opp", "missed_opportunity");

  // ---------- whole conversations
  const convRoot = $("#convs"); const ctabs = h("div", { class: "tabs" }); const cpanel = h("div"); convRoot.append(ctabs, cpanel);
  const big = new Audio(); big.preload = "none"; let lineEls = [];
  D.conversations.forEach((c, i) => ctabs.append(h("button", { "aria-selected": i === 0 ? "true" : "false", onclick: (ev) => { [...ctabs.children].forEach(b => b.setAttribute("aria-selected", "false")); ev.target.setAttribute("aria-selected", "true"); renderConv(c); } }, c.tab)));
  function renderConv(c) {
    big.pause(); audio.pause(); big.src = c.audio; cpanel.innerHTML = "";
    const lines = h("div", { class: "lines" }); lineEls = [];
    let ph = 0;
    c.lines.forEach((l, i) => {
      while (ph < c.phases.length && c.phases[ph].t <= l.t) { lines.append(h("div", { class: "phase" }, c.phases[ph].name)); ph++; }
      const notes = c.notes.filter(n => n.line === i).map(n => h("div", { class: "note " + (n.kind === "strength" ? "good" : "opp") }, h("b", {}, (n.kind === "strength" ? "Going well · " : "Could be stronger · ") + (DIM[n.dim] ? (DIM[n.dim].short || DIM[n.dim].name) : "")), h("div", {}, n.text), n.better ? h("div", { class: "small", style: "margin-top:4px" }, h("b", {}, "A stronger move: "), n.better) : null));
      const el = h("div", { class: "line", onclick: () => { big.currentTime = l.t; big.play(); } },
        h("div", { class: "ts" }, fmt(l.t)),
        h("div", {}, h("div", { class: "who " + l.who }, l.who === "coach" ? "Coach" : "Teacher"), l.text ? h("span", { class: c.rtl ? "ur" : "", lang: c.lang, style: "font-size:16px" }, l.text) : null, h("div", { class: "en" }, l.en || ""), ...notes));
      lines.append(el); lineEls.push([l.t, el]);
    });
    const ctl = player(c.audio, c.duration); ctl._btn.onclick = null;
    ctl._btn.addEventListener("click", () => big.paused ? big.play() : big.pause());
    big.onplay = () => ctl._btn.innerHTML = pauseIcon(); big.onpause = () => ctl._btn.innerHTML = playIcon();
    big.ontimeupdate = () => {
      ctl._bar.style.width = (100 * big.currentTime / (big.duration || c.duration)) + "%"; ctl._time.textContent = fmt(big.currentTime);
      let on = null; for (const [t, el] of lineEls) { if (t <= big.currentTime + 0.2) on = el; el.classList.remove("on"); }
      if (on) { on.classList.add("on"); const box = lines; const top = on.offsetTop - box.offsetTop; if (top < box.scrollTop || top > box.scrollTop + box.clientHeight - 80) box.scrollTop = top - 40; }
    };
    ctl.querySelector(".track").onclick = (ev) => { const r = ev.currentTarget.getBoundingClientRect(); big.currentTime = (ev.clientX - r.left) / r.width * (big.duration || c.duration); big.play(); };
    const sc = h("table", { class: "scorecard" }, ...Object.entries(c.scores).map(([d, s]) => h("tr", {}, h("td", {}, DIM[d] ? (DIM[d].short || DIM[d].name) : d), h("td", { class: "dots" }, "●".repeat(s) + "○".repeat(3 - s)))));
    const side = h("div", { class: "side" }, h("div", { class: "card" }, h("div", { class: "kicker muted" }, `${c.programme_label} · ${c.coach} · ${fmt(c.duration)}`), h("h4", {}, c.title), h("p", { class: "small" }, c.why), ctl,
      h("h4", { style: "margin-top:14px" }, `Score ${c.overall} / 100`), sc));
    cpanel.append(h("div", { class: "conv" }, side, lines));
  }
  if (D.conversations.length) renderConv(D.conversations[0]);

  // ---------- impact
  const I = D.impact;
  $("#impact-verdict").innerHTML = I.verdict_html;
  $("#impact-a").append(forest(I.forest, I.forest_title, I.forest_sub, "placebo check (should sit on zero)"));
  if (I.uptake) $("#impact-b").append(forest(I.uptake, I.uptake_title, I.uptake_sub, "unrelated step (comparison)"));
  $("#impact-detail").innerHTML = I.detail_html;
  function forest(rows, title, sub, goldLabel) {
    const ns = "http://www.w3.org/2000/svg"; const W = 760, left = 300, rowH = 30, H = 30 + rows.length * rowH;
    const lo = Math.min(-0.3, ...rows.map(r => r.ci[0])) * 1.1, hi = Math.max(0.3, ...rows.map(r => r.ci[1])) * 1.1;
    const X = v => left + (W - left - 20) * (v - lo) / (hi - lo);
    const svg = document.createElementNS(ns, "svg"); svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const z = document.createElementNS(ns, "line"); z.setAttribute("x1", X(0)); z.setAttribute("x2", X(0)); z.setAttribute("y1", 4); z.setAttribute("y2", H - 22); z.setAttribute("stroke", "var(--ink-3)"); z.setAttribute("stroke-dasharray", "3 3"); svg.append(z);
    const step = (hi - lo) > 1 ? 0.25 : 0.1;
    for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) {
      const vv = Math.round(v * 100) / 100; if (Math.abs(vv) < step * 1.01) continue;   // keep "0, no change" clear
      const tk = document.createElementNS(ns, "text"); tk.setAttribute("x", X(vv)); tk.setAttribute("y", H - 6); tk.setAttribute("text-anchor", "middle"); tk.setAttribute("style", "font-size:11px;fill:var(--ink-3)"); tk.textContent = (vv > 0 ? "+" : "") + vv.toFixed(step < 0.25 ? 1 : 2); svg.append(tk);
    }
    const zt = document.createElementNS(ns, "text"); zt.setAttribute("x", X(0)); zt.setAttribute("y", H - 6); zt.setAttribute("text-anchor", "middle"); zt.textContent = "0, no change"; svg.append(zt);
    rows.forEach((r, i) => {
      const y = 16 + i * rowH; const col = r.kind === "placebo" ? "var(--s2)" : "var(--s1)";
      const t = document.createElementNS(ns, "text"); t.setAttribute("x", left - 10); t.setAttribute("y", y + 4); t.setAttribute("text-anchor", "end"); t.textContent = r.label; svg.append(t);
      const l = document.createElementNS(ns, "line"); l.setAttribute("x1", X(r.ci[0])); l.setAttribute("x2", X(r.ci[1])); l.setAttribute("y1", y); l.setAttribute("y2", y); l.setAttribute("stroke", col); l.setAttribute("stroke-width", 2); l.setAttribute("stroke-linecap", "round"); svg.append(l);
      const vl = document.createElementNS(ns, "text"); vl.setAttribute("x", X(r.ci[1]) + 8); vl.setAttribute("y", y + 4); vl.setAttribute("style", "font-size:11px;fill:var(--ink-2)"); vl.textContent = (r.est >= 0 ? "+" : "") + r.est.toFixed(2); svg.append(vl);
      const c = document.createElementNS(ns, "circle"); c.setAttribute("cx", X(r.est)); c.setAttribute("cy", y); c.setAttribute("r", 5); c.setAttribute("fill", col); c.setAttribute("stroke", "var(--card)"); c.setAttribute("stroke-width", 2); svg.append(c);
      const hit = document.createElementNS(ns, "rect"); hit.setAttribute("x", 0); hit.setAttribute("y", y - rowH / 2); hit.setAttribute("width", W); hit.setAttribute("height", rowH); hit.setAttribute("fill", "transparent");
      hit.addEventListener("mousemove", ev => showTip(ev, `<b>${r.label}</b><br>${r.est >= 0 ? "+" : ""}${r.est.toFixed(2)} (95% CI ${r.ci[0].toFixed(2)} to ${r.ci[1].toFixed(2)})<br>${r.n || ""}`)); hit.addEventListener("mouseleave", hideTip);
      svg.append(hit);
    });
    const box = h("div", { class: "chart" }, h("h4", {}, title), h("div", { class: "sub" }, sub), svg,
      h("div", { class: "legend" }, h("span", {}, h("i", { style: "background:var(--s1)" }), "estimate and 95% interval"), rows.some(r => r.kind === "placebo") ? h("span", {}, h("i", { style: "background:var(--s2)" }), goldLabel) : null));
    box.append(h("details", { class: "tbl" }, h("summary", {}, "Show as a table"), h("table", {}, h("tr", {}, h("th", {}, "Row"), h("th", {}, "Estimate"), h("th", {}, "95% interval"), h("th", {}, "n")),
      ...rows.map(r => h("tr", {}, h("td", {}, r.label), h("td", {}, r.est.toFixed(3)), h("td", {}, `${r.ci[0].toFixed(3)} to ${r.ci[1].toFixed(3)}`), h("td", {}, r.n || ""))))));
    return box;
  }

  // ---------- recommendations, methods
  $("#recs").append(...D.recommendations.map(r => h("div", { class: "card" }, h("div", { class: "kicker k-imp" }, r.for), h("h4", {}, r.do), h("p", { class: "small" }, r.because))));
  $("#methods").innerHTML = D.methods_html;
  $("#refs").append(...D.references.map(c => h("li", {}, `${c.author} (${c.year}). `, h("a", { href: c.url, target: "_blank", rel: "noopener" }, c.title))));
})();
