/* School-visit report: interactive, dependency-free chart ENGINE.
   No visit-specific numbers live here. Specs come from window.RUMI_CHARTS (see charts_data.js and
   CHARTS_SPEC.md): an object keyed by chart id, one spec per .chart[data-chart] on the page.
   window.RumiCharts.render(el[, spec]) draws one chart into el as inline SVG; renderAll() does every
   .chart[data-chart]. Auto-runs on DOMContentLoaded. If charts_data.js was not loaded by the page,
   the engine loads it from its own folder and then renders.
   Chart kinds: trend (x labels + series), bar_h (labels + values), bar_v (same spec, vertical,
   flips to bar_h on narrow screens), grouped_bar (categories + series).
   Colour names map to the --ch-* tokens in charts.css (house palette from economist_chart.py). */
(function () {
  'use strict';

  var ownSrc = document.currentScript && document.currentScript.src ? document.currentScript.src : '';

  function fmt(n) {
    if (n === null || n === undefined) return '';
    return Number(n).toLocaleString('en-US', { maximumFractionDigits: 1 });
  }
  function gloss(key) {
    var g = (window.RUMI_GLOSSARY || {})[key];
    return g || { name: key, plain: '' };
  }
  function pick(spec, a, b) { return spec[a] !== undefined ? spec[a] : spec[b]; }

  /* ------------------------------------------------------------ spec adapters
     Turn a plain spec into the items the drawers bind to: label, valueText, meaning, explain, aria.
     The explain map is looked up by the keys given (first hit wins); a value may be a plain
     sentence or {title, text}. With spec.glossary, the bare label is looked up in RUMI_GLOSSARY:
     the panel title becomes "LABEL Official name", the text starts with the plain-words line,
     and the tooltip meaning is prefixed the same way. */
  function explainFor(spec, keys, gkey, defTitle) {
    var ex = spec.explain || {}, hit;
    for (var i = 0; i < keys.length; i++) if (ex[keys[i]] !== undefined) { hit = ex[keys[i]]; break; }
    var g = spec.glossary ? gloss(gkey) : null;
    if (hit === undefined && !g) return null;
    var text = hit === undefined ? '' : (typeof hit === 'string' ? hit : (hit.text || ''));
    var title = (hit && hit.title) || (g ? gkey + ' ' + g.name : defTitle);
    if (g && g.plain) text = g.plain + (text ? ' ' + text : '');
    return { title: title, text: text };
  }
  function meaningFor(spec, gkey, m) {
    m = m || '';
    if (spec.glossary) return gkey + ' ' + gloss(gkey).name + '. ' + m;
    return m;
  }
  function barItems(spec) {
    var hl = spec.highlight === undefined || spec.highlight === null ? [] : [].concat(spec.highlight);
    return (spec.labels || []).map(function (l, i) {
      var v = spec.values[i];
      var c = (spec.colors && spec.colors[i]) || (hl.indexOf(i) >= 0 ? (spec.highlightColor || 'orange') : (spec.color || 'teal'));
      var key = String(l).replace(/\n/g, ', ');
      return { label: l, value: v, color: c,
        meaning: meaningFor(spec, l, spec.meaning && spec.meaning[i]),
        explain: explainFor(spec, [key, l], l, key + ': ' + fmt(v)) };
    });
  }
  function groupedItem(spec, ci, si) {
    var sr = spec.series[si], cat = spec.categories[ci], v = sr.values[ci];
    return { color: sr.color, label: cat + ' · ' + sr.name, valueText: fmt(v),
      meaning: meaningFor(spec, cat, sr.meaning && sr.meaning[ci]),
      explain: explainFor(spec, [cat + ' | ' + sr.name, cat], cat, cat + ', ' + sr.name + ': ' + fmt(v)),
      aria: sr.name + ', ' + cat + ': ' + fmt(v) };
  }
  function trendItem(spec, si, i) {
    var sr = spec.series[si], x = String(spec.x[i]), xs = x.replace('*', ''), v = sr.values[i];
    var lab = (spec.pointLabel || '{series}, {x}').replace('{series}', sr.name).replace('{x}', xs);
    return { label: lab, valueText: fmt(v),
      meaning: meaningFor(spec, xs, sr.meaning && sr.meaning[i]),
      explain: explainFor(spec, [xs, x], xs, xs),
      aria: lab + ': ' + fmt(v) };
  }

  /* --------------------------------------------------------------- helpers */
  var NS = 'http://www.w3.org/2000/svg';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function svg(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function color(name) { return 'var(--ch-' + name + ')'; }
  function estW(str, size) { return String(str).length * (size || 12.5) * 0.56; }
  function wrap(str, maxChars) {
    var out = [];
    String(str).split('\n').forEach(function (line) {
      var words = line.split(' '), cur = '';
      words.forEach(function (w) {
        if (cur && (cur + ' ' + w).length > maxChars) { out.push(cur); cur = w; }
        else cur = cur ? cur + ' ' + w : w;
      });
      if (cur) out.push(cur);
    });
    return out;
  }
  function textLines(parent, lines, x, y, cls, anchor, lineH) {
    var t = svg('text', { x: x, y: y, 'text-anchor': anchor || 'start', 'class': cls }, parent);
    lines.forEach(function (l, i) {
      var ts = svg('tspan', { x: x, dy: i === 0 ? 0 : (lineH || 15) }, t);
      ts.textContent = l;
    });
    return t;
  }
  function niceStep(max, target) {
    var raw = max / (target || 5), p = Math.pow(10, Math.floor(Math.log10(raw)));
    var c = raw / p;
    var s = c <= 1 ? 1 : c <= 2 ? 2 : c <= 5 ? 5 : 10;
    return s * p;
  }
  function ticks(max, target) {
    var step = niceStep(max, target), top = Math.ceil(max / step) * step, out = [];
    if (max / top < 0.72 && (step / 2 >= 1 || max < 2)) { step = step / 2; top = Math.ceil(max / step) * step; }
    for (var v = 0; v <= top + 1e-9; v += step) out.push(+v.toFixed(6));
    return { step: step, top: top, values: out };
  }

  function bind(target, chart, item, opts) {
    target.setAttribute('tabindex', '0');
    target.setAttribute('role', 'img');
    target.setAttribute('aria-label', item.aria);
    target.addEventListener('mouseenter', function () { showTip(chart, target, item, opts); });
    target.addEventListener('mousemove', function () { showTip(chart, target, item, opts); });
    target.addEventListener('mouseleave', function () { hideTip(chart); });
    target.addEventListener('focus', function () { showTip(chart, target, item, opts); });
    target.addEventListener('blur', function () { hideTip(chart); });
    target.addEventListener('click', function (ev) { ev.preventDefault(); toggleExplain(chart, target, item); });
    target.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); toggleExplain(chart, target, item); }
      if (ev.key === 'Escape') { closeExplain(chart); }
    });
  }

  function showTip(chart, target, item, opts) {
    var tip = chart._tip;
    tip.innerHTML = '';
    var b = el('b', null, item.label); tip.appendChild(b);
    var v = el('span', 'v', item.valueText); tip.appendChild(v);
    if (item.meaning) tip.appendChild(el('span', 'm', item.meaning));
    tip.classList.add('show');
    var r = target.getBoundingClientRect(), c = chart.getBoundingClientRect();
    var ax = (opts && opts.anchor === 'end') ? Math.min(r.right, r.left + 140) : r.left + r.width / 2;
    ax -= c.left;
    var w = tip.offsetWidth, h = tip.offsetHeight, cw = chart.clientWidth;
    var left = Math.max(6, Math.min(cw - w - 6, ax - w / 2));
    var top = r.top - c.top - h - 12;
    tip.classList.remove('below');
    if (top < 0) { top = r.bottom - c.top + 12; tip.classList.add('below'); }
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
    tip.style.setProperty('--tip-arrow', Math.max(12, Math.min(w - 12, ax - left)) + 'px');
  }
  function hideTip(chart) { chart._tip.classList.remove('show'); }

  function toggleExplain(chart, target, item) {
    if (chart._open === target) { closeExplain(chart); return; }
    closeExplain(chart);
    var panel = chart._explain, ex = item.explain || { title: item.label, text: item.meaning || '' };
    panel.innerHTML = '';
    panel.appendChild(el('b', null, ex.title));
    panel.appendChild(el('span', null, ex.text));
    var hint = el('span', 'hint', 'Press Escape or the cross to close.');
    panel.appendChild(hint);
    var btn = el('button', null, '×');
    btn.setAttribute('aria-label', 'Close explanation');
    btn.addEventListener('click', function () { closeExplain(chart); target.focus(); });
    panel.appendChild(btn);
    panel.hidden = false;
    target.classList.add('is-open');
    chart._open = target;
  }
  function closeExplain(chart) {
    if (chart._open) chart._open.classList.remove('is-open');
    chart._open = null;
    chart._explain.hidden = true;
  }

  /* -------------------------------------------------------------- drawers */
  function drawBarH(chart, spec, W, items) {
    items = items || barItems(spec);
    var n = items.length, xLabel = pick(spec, 'xlabel', 'xLabel');
    var maxChars = W < 480 ? 16 : W < 700 ? 24 : 34;
    var lines = items.map(function (it) { return wrap(it.label, maxChars); });
    var longest = 0;
    lines.forEach(function (ls) { ls.forEach(function (l) { longest = Math.max(longest, estW(l)); }); });
    var padL = Math.min(Math.ceil(longest) + 16, W * 0.45), padR = 64, padT = 8;
    var padB = xLabel ? 34 : 14;
    var rowH = n > 9 ? 27 : 32;
    var rows = lines.map(function (ls) { return Math.max(rowH, ls.length * 15 + 10); });
    var H = padT + rows.reduce(function (a, b) { return a + b; }, 0) + padB;
    var plotW = W - padL - padR;
    var max = Math.max.apply(null, items.map(function (i) { return i.value; }));
    var tk = ticks(max, 4);
    var sx = function (v) { return padL + v / tk.top * plotW; };

    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H, role: 'presentation', 'aria-hidden': 'false' });
    var baseY = H - padB;
    tk.values.forEach(function (v) {
      svg('line', { x1: sx(v), x2: sx(v), y1: padT, y2: baseY, 'class': 'ch-grid' }, s);
      if (xLabel) {
        var t = svg('text', { x: sx(v), y: baseY + 16, 'text-anchor': 'middle', 'class': 'ch-tick' }, s);
        t.textContent = fmt(v);
      }
    });
    svg('line', { x1: padL, x2: padL, y1: padT, y2: baseY, 'class': 'ch-base' }, s);
    if (xLabel) {
      var xl = svg('text', { x: padL + plotW / 2, y: H - 2, 'text-anchor': 'middle', 'class': 'ch-axis-label' }, s);
      xl.textContent = xLabel;
    }
    var y = padT;
    items.forEach(function (it, i) {
      var rh = rows[i], bh = Math.min(22, rh - 8), cy = y + rh / 2;
      var ls = lines[i];
      textLines(s, ls, padL - 10, cy - (ls.length - 1) * 7.5 + 4, 'ch-cat', 'end', 15);
      var w = Math.max(0, sx(it.value) - padL);
      var r = svg('rect', { x: padL, y: cy - bh / 2, width: w, height: bh, rx: 2, fill: color(it.color), 'class': 'ch-bar h' }, s);
      var v = svg('text', { x: padL + w + 7, y: cy + 4.5, 'class': 'ch-val' }, s);
      v.textContent = fmt(it.value);
      var flat = String(it.label).replace(/\n/g, ' ');
      bind(r, chart, { label: flat, valueText: fmt(it.value), meaning: it.meaning, explain: it.explain,
        aria: flat + ': ' + fmt(it.value) }, { anchor: 'end' });
      y += rh;
    });
    return s;
  }

  function drawBarsV(chart, spec, W, categories, series, perItem) {
    var n = categories.length, k = series.length;
    var yLabel = pick(spec, 'ylabel', 'yLabel'), yMax = pick(spec, 'ymax', 'yMax');
    var maxChars = Math.max(6, Math.floor(((W - 58) / n) / 7.6));
    var lines = categories.map(function (c) { return wrap(c, maxChars); });
    var maxLines = Math.max.apply(null, lines.map(function (l) { return l.length; }));
    var padL = 46, padR = 12, padT = 26, padB = 14 + maxLines * 15 + (yLabel ? 4 : 0);
    var plotH = Math.max(200, Math.min(300, W * 0.4));
    var H = padT + plotH + padB;
    var plotW = W - padL - padR;
    var all = [];
    series.forEach(function (sr) { sr.values.forEach(function (v) { all.push(v); }); });
    var max = yMax || Math.max.apply(null, all);
    var tk = yMax ? { step: niceStep(yMax, 4), top: yMax, values: null } : ticks(max, 4);
    if (!tk.values) { tk.values = []; for (var q = 0; q <= tk.top + 1e-9; q += tk.step) tk.values.push(q); }
    var baseY = padT + plotH;
    var sy = function (v) { return baseY - v / tk.top * plotH; };

    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H, role: 'presentation' });
    tk.values.forEach(function (v) {
      svg('line', { x1: padL, x2: W - padR, y1: sy(v), y2: sy(v), 'class': v === 0 ? 'ch-base' : 'ch-grid' }, s);
      var t = svg('text', { x: padL - 8, y: sy(v) + 4, 'text-anchor': 'end', 'class': 'ch-tick' }, s);
      t.textContent = fmt(v);
    });
    if (yLabel) {
      var yl = svg('text', { x: 0, y: 0, 'class': 'ch-axis-label', transform: 'translate(12 ' + (padT + plotH / 2) + ') rotate(-90)', 'text-anchor': 'middle' }, s);
      yl.textContent = yLabel;
    }
    var groupW = plotW / n;
    var inner = Math.min(groupW * 0.78, k * 64 + (k - 1) * 4);
    var barW = (inner - (k - 1) * 4) / k;
    categories.forEach(function (c, ci) {
      var gx = padL + groupW * ci + (groupW - inner) / 2;
      textLines(s, lines[ci], padL + groupW * ci + groupW / 2, baseY + 18, 'ch-cat' + (lines[ci].length > 1 ? ' dim' : ''), 'middle', 15);
      series.forEach(function (sr, si) {
        var v = sr.values[ci], x = gx + si * (barW + 4);
        var top = sy(v), h = baseY - top;
        var itm = perItem(ci, si);
        var r = svg('rect', { x: x, y: top, width: barW, height: h, rx: 2, fill: color(itm.color), 'class': 'ch-bar v' }, s);
        var vt = svg('text', { x: x + barW / 2, y: top - 6, 'text-anchor': 'middle', 'class': 'ch-val' }, s);
        vt.textContent = fmt(v);
        if (k > 1) vt.style.fill = itm.color === 'gray' ? 'var(--ink-3)' : color(itm.color);
        bind(r, chart, itm);
      });
    });
    return s;
  }

  function drawBarV(chart, spec, W) {
    var items = barItems(spec);
    if (W < 560 && items.length >= 5) {
      return drawBarH(chart, { xlabel: pick(spec, 'ylabel', 'yLabel') }, W, items);
    }
    var cats = items.map(function (i) { return i.label; });
    var series = [{ values: items.map(function (i) { return i.value; }) }];
    return drawBarsV(chart, spec, W, cats, series, function (ci) {
      var it = items[ci], flat = String(it.label).replace(/\n/g, ', ');
      return { color: it.color, label: flat, valueText: fmt(it.value), meaning: it.meaning, explain: it.explain,
        aria: flat + ': ' + fmt(it.value) };
    });
  }

  function drawGrouped(chart, spec, W) {
    return drawBarsV(chart, spec, W, spec.categories, spec.series, function (ci, si) { return groupedItem(spec, ci, si); });
  }

  function drawTrend(chart, spec, W) {
    var n = spec.x.length, yLabel = pick(spec, 'ylabel', 'yLabel');
    var padL = 46, padR = 28, padT = 26, padB = 52;
    var plotH = Math.max(200, Math.min(300, W * 0.4));
    var H = padT + plotH + padB, plotW = W - padL - padR;
    var all = [];
    spec.series.forEach(function (sr) { sr.values.forEach(function (v) { all.push(v); }); });
    var tk = ticks(Math.max.apply(null, all), 4);
    /* label side per point: above by default; when two series sit within 22px at the same x,
       the lower one goes below so the numbers never overlap */
    var side = spec.series.map(function (sr) { return sr.values.map(function () { return -1; }); });
    var baseY = padT + plotH;
    var sx = function (i) { return padL + (n === 1 ? plotW / 2 : i / (n - 1) * plotW); };
    var sy = function (v) { return baseY - v / tk.top * plotH; };

    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H, role: 'presentation' });
    tk.values.forEach(function (v) {
      svg('line', { x1: padL, x2: W - padR, y1: sy(v), y2: sy(v), 'class': v === 0 ? 'ch-base' : 'ch-grid' }, s);
      var t = svg('text', { x: padL - 8, y: sy(v) + 4, 'text-anchor': 'end', 'class': 'ch-tick' }, s);
      t.textContent = fmt(v);
    });
    if (yLabel) {
      var yl = svg('text', { x: 0, y: 0, 'class': 'ch-axis-label', transform: 'translate(12 ' + (padT + plotH / 2) + ') rotate(-90)', 'text-anchor': 'middle' }, s);
      yl.textContent = yLabel;
    }
    var skip = Math.max(1, Math.ceil(n * 50 / plotW));
    var show = spec.x.map(function (_, i) { return i % skip === 0; });
    if (skip > 1 && !show[n - 1]) { if ((n - 1) % skip < skip / 2) show[n - 1 - (n - 1) % skip] = false; show[n - 1] = true; }
    spec.x.forEach(function (lab, i) {
      if (!show[i]) return;
      var t = svg('text', { x: sx(i), y: baseY + 38, 'text-anchor': i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle', 'class': 'ch-cat dim' }, s);
      t.textContent = lab;
    });
    spec.x.forEach(function (_, i) {
      for (var a = 0; a < spec.series.length; a++) for (var b = a + 1; b < spec.series.length; b++) {
        var va = spec.series[a].values[i], vb = spec.series[b].values[i];
        if (Math.abs(sy(va) - sy(vb)) < 22) { if (va >= vb) side[b][i] = 1; else side[a][i] = 1; }
      }
    });
    spec.series.forEach(function (sr) {
      var d = sr.values.map(function (v, i) { return (i ? 'L' : 'M') + sx(i).toFixed(1) + ' ' + sy(v).toFixed(1); }).join(' ');
      svg('path', { d: d, stroke: color(sr.color), 'class': 'ch-line', pathLength: 1 }, s);
    });
    /* points drawn after all lines so they sit on top; labels above for series 0, below for series 1 */
    spec.series.forEach(function (sr, si) {
      sr.values.forEach(function (v, i) {
        var g = svg('g', { 'class': 'ch-pt' }, s);
        svg('circle', { cx: sx(i), cy: sy(v), r: 14, 'class': 'ch-hit' }, g);
        svg('circle', { cx: sx(i), cy: sy(v), r: 5.5, fill: color(sr.color) }, g);
        var lab = svg('text', { x: sx(i), y: sy(v) + (side[si][i] < 0 ? -11 : 20), 'text-anchor': 'middle', 'class': 'ch-val' }, s);
        lab.style.fill = color(sr.color);
        lab.textContent = fmt(v);
        bind(g, chart, trendItem(spec, si, i));
      });
    });
    return s;
  }

  var DRAW = { trend: drawTrend, bar_h: drawBarH, bar_v: drawBarV, grouped_bar: drawGrouped, grouped: drawGrouped };

  /* -------------------------------------------------------------- render */
  function legendFor(spec) {
    if (spec.legend) return spec.legend;
    if (spec.series && spec.series.length > 1) return spec.series.map(function (s) { return { name: s.name, color: s.color, line: spec.type === 'trend' }; });
    return null;
  }

  function render(chart, spec) {
    var id = chart.getAttribute('data-chart');
    spec = spec || (window.RUMI_CHARTS || {})[id];
    Array.prototype.slice.call(chart.children).forEach(function (c) { if (c.tagName !== 'NOSCRIPT') c.remove(); });
    chart.classList.add('chart');
    if (!spec || !DRAW[spec.type]) { chart.appendChild(el('p', 'chart-sub', 'Missing chart: ' + id)); return; }
    if (!reduced) chart.classList.add('anim');
    chart.setAttribute('role', 'group');
    chart.setAttribute('aria-label', spec.title);

    chart.appendChild(el('h3', 'chart-title', spec.title));
    var sub = el('p', 'chart-sub');
    var hb = el('b', null, 'How to read this: '); sub.appendChild(hb);
    sub.appendChild(document.createTextNode(spec.how || ''));
    chart.appendChild(sub);

    var lg = legendFor(spec);
    if (lg) {
      var ul = el('ul', 'chart-legend');
      ul.setAttribute('aria-label', 'Legend');
      lg.forEach(function (l) {
        var li = el('li'); var sw = el('i', l.line ? 'line' : ''); sw.style.background = color(l.color);
        li.appendChild(sw); li.appendChild(document.createTextNode(l.name)); ul.appendChild(li);
      });
      chart.appendChild(ul);
    }

    var plot = el('div', 'chart-plot'); chart.appendChild(plot);
    var explain = el('div', 'chart-explain'); explain.hidden = true; explain.setAttribute('aria-live', 'polite'); chart.appendChild(explain);
    chart.appendChild(el('p', 'chart-hint', 'Hover or tap a bar for the number. Click it, or press Enter, for what it means.'));
    chart.appendChild(el('p', 'chart-src', spec.source || ''));
    var tip = el('div', 'chart-tip'); tip.setAttribute('role', 'tooltip'); chart.appendChild(tip);
    chart._tip = tip; chart._explain = explain; chart._open = null;

    var lastW = 0;
    function draw() {
      var w = Math.round(plot.clientWidth) || 720;
      w = Math.max(300, w);
      if (Math.abs(w - lastW) < 6) return;
      lastW = w;
      closeExplain(chart);
      plot.innerHTML = '';
      plot.appendChild(DRAW[spec.type](chart, spec, w));
      if (lastW && chart.classList.contains('anim') && chart._drawn) chart.classList.remove('anim');
      chart._drawn = true;
    }
    draw();
    if (window.ResizeObserver) {
      var t;
      new ResizeObserver(function () { clearTimeout(t); t = setTimeout(draw, 80); }).observe(plot);
    } else {
      window.addEventListener('resize', function () { clearTimeout(chart._rt); chart._rt = setTimeout(draw, 120); });
    }
  }

  function renderAll(root) {
    var nodes = (root || document).querySelectorAll('.chart[data-chart], [data-chart]');
    Array.prototype.forEach.call(nodes, function (n) { if (!n._rumiChart) { n._rumiChart = true; render(n); } });
  }

  /* If the page did not load charts_data.js itself, fetch it from next to this script, then render. */
  function boot() {
    if (window.RUMI_CHARTS) { renderAll(); return; }
    var s = document.createElement('script');
    s.src = ownSrc.replace(/[^\/]*$/, '') + 'charts_data.js';
    s.onload = function () { renderAll(); };
    s.onerror = function () { renderAll(); };
    document.head.appendChild(s);
  }

  window.RumiCharts = { render: render, renderAll: renderAll, get charts() { return window.RUMI_CHARTS || {}; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
